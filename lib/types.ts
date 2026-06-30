// Shared types for the design-extraction → prompt-generation pipeline.

export interface DesignSystem {
  source: {
    url: string;
    title: string;
    capturedAt: string;
  };
  typography: {
    fontFamilies: string[];
    headingFont: string;
    bodyFont: string;
    scale: { label: string; size: string; weight: string }[];
    baseSize: string;
    lineHeight: string;
  };
  colors: {
    background: string[];
    text: string[];
    accent: string[];
    border: string[];
    palette: { hex: string; role: string }[];
    contrastStyle: string;
  };
  spacing: {
    rhythm: string;
    sectionPadding: string;
    density: "compact" | "comfortable" | "spacious";
    gridGap: string;
  };
  components: {
    borderRadius: string;
    shadow: string;
    buttonStyle: string;
    cardStyle: string;
    iconTreatment: string;
  };
  layout: {
    maxWidth: string;
    columns: string;
    header: string;
    hero: string;
    sectionOrder: string[];
  };
  mood: {
    aesthetic: string;
    tone: string;
    interactionFeel: string;
  };
}

export interface RemixRecord {
  id: string;
  sourceUrl: string;
  title: string;
  createdAt: string;
  prompt: string;
  starred: boolean;
}

export type Plan = "free" | "pro";

// Remix usage counters. Free plans are limited per day, Pro plans per month;
// both counters live here and reset lazily when their period rolls over.
export interface Usage {
  userId: string;
  day: string; // YYYY-MM-DD (UTC)
  dayCount: number;
  month: string; // YYYY-MM (UTC)
  monthCount: number;
}

// Result of checking (and optionally consuming) a remix against the quota.
export interface QuotaStatus {
  plan: Plan;
  period: "day" | "month";
  limit: number;
  used: number;
  remaining: number;
  allowed: boolean;
}

export interface Subscription {
  userId: string;
  plan: Plan;
  status: "active" | "canceled" | "none";
  activatedAt: string | null;
  renewsAt: string | null;
  // last 4 of the (mock) card, for realistic billing UI only
  cardLast4: string | null;
}
