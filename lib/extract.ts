// Deterministic, client-side design extraction.
//
// This is the real engine the Mousey browser extension uses: it walks the
// live DOM and reads *computed* styles. No AI model is involved here — the
// extraction is fully deterministic. Only the later prompt-polishing step
// (lib/ollama.ts) touches a local model.
//
// extractDesignSystem() can run in any browser context where a Document is
// available (the content script, or a same-origin page). It is intentionally
// dependency-free so it can be bundled into a content script verbatim.

import type { DesignSystem } from "./types";

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function rgbToHex(value: string): string {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return value;
  const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
  const [r, g, b] = parts;
  if ([r, g, b].some((n) => Number.isNaN(n))) return value;
  const hex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function topN<T>(items: T[], n: number): T[] {
  const counts = new Map<string, { item: T; count: number }>();
  for (const it of items) {
    const key = JSON.stringify(it);
    const entry = counts.get(key);
    if (entry) entry.count++;
    else counts.set(key, { item: it, count: 1 });
  }
  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
    .map((e) => e.item);
}

function classifyDensity(avgPadding: number): DesignSystem["spacing"]["density"] {
  if (avgPadding < 16) return "compact";
  if (avgPadding > 40) return "spacious";
  return "comfortable";
}

/**
 * Walk a live document and extract its visual design system.
 * Pass a Document (defaults to the global `document` in the browser).
 */
export function extractDesignSystem(doc?: Document): DesignSystem {
  const d = doc ?? (typeof document !== "undefined" ? document : null);
  if (!d || typeof window === "undefined") {
    throw new Error("extractDesignSystem must run in a browser context");
  }

  const all = Array.from(d.body.querySelectorAll<HTMLElement>("*")).slice(0, 4000);
  const styleOf = (el: Element) => window.getComputedStyle(el);

  const fontFamilies: string[] = [];
  const bgColors: string[] = [];
  const textColors: string[] = [];
  const borderColors: string[] = [];
  const radii: string[] = [];
  const shadows: string[] = [];
  const paddings: number[] = [];

  for (const el of all) {
    const cs = styleOf(el);
    if (cs.fontFamily) fontFamilies.push(cs.fontFamily.split(",")[0].replace(/["']/g, "").trim());

    const bg = cs.backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") bgColors.push(rgbToHex(bg));

    if (cs.color) textColors.push(rgbToHex(cs.color));

    const bc = cs.borderColor;
    if (bc && parseFloat(cs.borderTopWidth) > 0) borderColors.push(rgbToHex(bc));

    if (cs.borderRadius && cs.borderRadius !== "0px") radii.push(cs.borderRadius);
    if (cs.boxShadow && cs.boxShadow !== "none") shadows.push(cs.boxShadow);

    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    if (!Number.isNaN(pad) && pad > 0) paddings.push(pad / 2);
  }

  // Heading hierarchy
  const scale: DesignSystem["typography"]["scale"] = [];
  for (const tag of ["h1", "h2", "h3", "h4"]) {
    const el = d.querySelector(tag);
    if (el) {
      const cs = styleOf(el);
      scale.push({ label: tag.toUpperCase(), size: cs.fontSize, weight: cs.fontWeight });
    }
  }
  const bodyCS = styleOf(d.body);

  // Section order from landmark / section elements
  const sections = Array.from(
    d.querySelectorAll("header, nav, section, main, footer, [class*='hero'], [class*='section']")
  )
    .slice(0, 14)
    .map((el) => {
      const tag = el.tagName.toLowerCase();
      const cls = (el.getAttribute("class") || "").split(" ")[0];
      return cls ? `${tag}.${cls}` : tag;
    });

  const avgPadding = paddings.length
    ? paddings.reduce((a, b) => a + b, 0) / paddings.length
    : 24;

  const topFonts = topN(fontFamilies, 3);
  const topBg = topN(bgColors, 4);
  const topText = topN(textColors, 4);
  const topAccent = topN(
    bgColors.filter((c) => !topBg.slice(0, 2).includes(c)),
    3
  );

  const palette: DesignSystem["colors"]["palette"] = [
    ...topBg.slice(0, 2).map((hex) => ({ hex, role: "surface" })),
    ...topText.slice(0, 2).map((hex) => ({ hex, role: "text" })),
    ...topAccent.slice(0, 2).map((hex) => ({ hex, role: "accent" })),
  ];

  return {
    source: {
      url: typeof location !== "undefined" ? location.href : "",
      title: d.title || "Untitled",
      capturedAt: new Date().toISOString(),
    },
    typography: {
      fontFamilies: topFonts,
      headingFont: topFonts[0] || "sans-serif",
      bodyFont: topFonts[1] || topFonts[0] || "sans-serif",
      scale,
      baseSize: bodyCS.fontSize,
      lineHeight: bodyCS.lineHeight,
    },
    colors: {
      background: topBg,
      text: topText,
      accent: uniq(topAccent),
      border: topN(borderColors, 3),
      palette,
      contrastStyle: topBg[0] === "#ffffff" ? "light / high contrast" : "dark / high contrast",
    },
    spacing: {
      rhythm: `~${Math.round(avgPadding)}px base unit`,
      sectionPadding: `${Math.round(avgPadding * 2.5)}px vertical`,
      density: classifyDensity(avgPadding),
      gridGap: `${Math.round(avgPadding)}px`,
    },
    components: {
      borderRadius: topN(radii, 1)[0] || "8px",
      shadow: topN(shadows, 1)[0] || "none",
      buttonStyle: "solid accent fill, medium radius, semibold label",
      cardStyle: "bordered surface with subtle shadow",
      iconTreatment: "line icons, consistent stroke",
    },
    layout: {
      maxWidth: "~1200px centered container",
      columns: "12-col responsive grid",
      header: "sticky top nav, logo left, links center/right, CTA far right",
      hero: "left-aligned headline + supporting copy, visual to the right",
      sectionOrder: sections,
    },
    mood: {
      aesthetic: "modern, clean, product-led",
      tone: "confident, direct, builder-focused",
      interactionFeel: "subtle hover transitions, smooth scroll, low-latency",
    },
  };
}
