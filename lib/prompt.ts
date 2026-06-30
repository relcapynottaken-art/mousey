import type { DesignSystem } from "./types";

// Deterministic prompt assembly.
//
// buildBasePrompt() turns an extracted DesignSystem into a structured,
// AI-builder-ready prompt WITHOUT any model call. This guarantees Mousey
// always produces a usable prompt even when Ollama is offline. The local
// model (lib/ollama.ts) is then used to *polish / expand* this base prompt
// when available.

export function buildBasePrompt(ds: DesignSystem): string {
  const accent = ds.colors.accent.join(", ") || "—";
  const bg = ds.colors.background.join(", ");
  const text = ds.colors.text.join(", ");
  const scale = ds.typography.scale
    .map((s) => `${s.label} ${s.size}/${s.weight}`)
    .join("  ·  ");
  const sections = ds.layout.sectionOrder.map((s, i) => `${i + 1}. ${s}`).join("\n");

  return `You are rebuilding a website to match a reference site's complete visual design language as closely as possible. Do not copy its source code or text content — instead reproduce its design SYSTEM with high fidelity.

REFERENCE
- Source: ${ds.source.title} (${ds.source.url})
- Overall aesthetic: ${ds.mood.aesthetic}
- Marketing tone: ${ds.mood.tone}
- Interaction feel: ${ds.mood.interactionFeel}

LAYOUT & STRUCTURE
- Container: ${ds.layout.maxWidth}
- Grid: ${ds.layout.columns}
- Header: ${ds.layout.header}
- Hero composition: ${ds.layout.hero}
- Section order (preserve this rhythm):
${sections}

TYPOGRAPHY
- Heading font: ${ds.typography.headingFont}
- Body font: ${ds.typography.bodyFont}
- Base size: ${ds.typography.baseSize}, line-height ${ds.typography.lineHeight}
- Type scale: ${scale}

COLOR & CONTRAST
- Contrast style: ${ds.colors.contrastStyle}
- Background surfaces: ${bg}
- Text colors: ${text}
- Accent colors: ${accent}

SPACING & DENSITY
- Base rhythm: ${ds.spacing.rhythm}
- Section padding: ${ds.spacing.sectionPadding}
- Grid gap: ${ds.spacing.gridGap}
- Visual density: ${ds.spacing.density}

COMPONENTS
- Border radius: ${ds.components.borderRadius}
- Shadow: ${ds.components.shadow}
- Buttons: ${ds.components.buttonStyle}
- Cards: ${ds.components.cardStyle}
- Icons: ${ds.components.iconTreatment}

REQUIREMENTS
- Match the section order, spacing rhythm, type hierarchy, color palette, contrast, component shapes, border radius, shadows, and overall mood above.
- Keep the same visual density and hero composition.
- Use placeholder copy in the same tone; do not reuse the reference's exact wording.
- Output a complete, responsive, accessible implementation (Tailwind CSS preferred).
- The result should read as a near-match in style and structure to the reference — a sibling site, not a clone of its content.`;
}

// System prompt that instructs the local model how to refine the base prompt.
export function refinementSystemPrompt(): string {
  return `You are Mousey's prompt engineer. You receive a structured design-extraction prompt and rewrite it into the single best possible instruction for an AI website builder (Claude, v0, Lovable, Bolt). Preserve every concrete value (fonts, sizes, hex colors, spacing, radii, section order). Tighten the language, remove redundancy, and make it maximally actionable for design fidelity. Return ONLY the final prompt text — no preamble, no markdown fences, no commentary.`;
}
