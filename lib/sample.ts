import type { DesignSystem } from "./types";

// A representative extraction result used by the marketing demo and as a
// fallback when no live page is available (e.g. the landing page playground).
export const sampleDesignSystem: DesignSystem = {
  source: {
    url: "https://lumen-analytics.example.com",
    title: "Lumen — Analytics for product teams",
    capturedAt: "2026-06-30T09:14:00.000Z",
  },
  typography: {
    fontFamilies: ["Inter", "Inter", "JetBrains Mono"],
    headingFont: "Inter",
    bodyFont: "Inter",
    scale: [
      { label: "H1", size: "64px", weight: "700" },
      { label: "H2", size: "40px", weight: "600" },
      { label: "H3", size: "24px", weight: "600" },
      { label: "H4", size: "18px", weight: "500" },
    ],
    baseSize: "16px",
    lineHeight: "1.6",
  },
  colors: {
    background: ["#0b0d12", "#11141d", "#171b27", "#ffffff"],
    text: ["#e6e8ef", "#9aa3b2", "#ffffff"],
    accent: ["#6366f1", "#22d3ee"],
    border: ["#1f2433", "#2a3142"],
    palette: [
      { hex: "#0b0d12", role: "surface" },
      { hex: "#11141d", role: "surface" },
      { hex: "#e6e8ef", role: "text" },
      { hex: "#9aa3b2", role: "text" },
      { hex: "#6366f1", role: "accent" },
      { hex: "#22d3ee", role: "accent" },
    ],
    contrastStyle: "dark / high contrast",
  },
  spacing: {
    rhythm: "~8px base unit",
    sectionPadding: "120px vertical",
    density: "comfortable",
    gridGap: "24px",
  },
  components: {
    borderRadius: "14px",
    shadow: "0 24px 60px -24px rgba(0,0,0,0.7)",
    buttonStyle: "solid indigo fill, 12px radius, semibold label, subtle glow on hover",
    cardStyle: "bordered dark surface, 1px hairline border, soft drop shadow",
    iconTreatment: "1.5px stroke line icons, indigo accent",
  },
  layout: {
    maxWidth: "1200px centered container",
    columns: "12-col responsive grid",
    header: "sticky translucent top nav, logo left, links center, CTA right",
    hero: "centered eyebrow + large headline, dual CTA, product mockup below",
    sectionOrder: [
      "header.nav",
      "section.hero",
      "section.logos",
      "section.features",
      "section.metrics",
      "section.pricing",
      "section.cta",
      "footer.site",
    ],
  },
  mood: {
    aesthetic: "dark premium, technical, data-forward",
    tone: "confident, precise, builder-focused",
    interactionFeel: "smooth hover lifts, animated gradients, low-latency feel",
  },
};
