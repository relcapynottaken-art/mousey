import { BrowserFrame } from "./BrowserFrame";
import { ExtractionPanel } from "./ExtractionPanel";
import { PromptCard } from "./PromptCard";
import { MiniSite } from "./MiniSite";
import { ArrowRight, Bolt, Sparkles, Check } from "@/components/ui/Icons";

// The full hero story in one composition:
// live source site → design extraction → AI-ready prompt → builder → near-match.
export function HeroVisual() {
  return (
    <div className="relative">
      {/* glow */}
      <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 bg-radial-spot blur-2xl" />

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        {/* LEFT: live source site with extraction panel overlay */}
        <div className="relative">
          <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" /> Live source website
          </span>
          <BrowserFrame url="lumen-analytics.example.com" badge="reading page">
            <div className="h-[230px]">
              <MiniSite variant="source" scanning />
            </div>
          </BrowserFrame>

          {/* extension popup overlapping the page */}
          <ExtractionPanel className="absolute -bottom-6 -right-3 hidden sm:block lg:-right-6" />
        </div>

        {/* RIGHT: generated prompt */}
        <div className="relative flex flex-col justify-end">
          <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/40">
            <Sparkles className="h-3 w-3 text-cyber" /> Generated prompt
          </span>
          <PromptCard />
        </div>
      </div>

      {/* HANDOFF ROW */}
      <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
        {/* builder targets */}
        <div className="card flex flex-col justify-center gap-3 py-4">
          <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
            Paste into your AI builder
          </span>
          <div className="flex flex-wrap gap-2">
            {["Claude", "v0", "Lovable", "Bolt"].map((b) => (
              <span
                key={b}
                className="flex items-center gap-1.5 rounded-lg border border-line bg-ink-800 px-2.5 py-1.5 text-xs font-medium text-white/80"
              >
                <Bolt className="h-3.5 w-3.5 text-accent-400" />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* arrow */}
        <div className="hidden items-center justify-center sm:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-ink-800 text-accent-400">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>

        {/* recreated result */}
        <div className="relative">
          <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/40">
            <Check className="h-3 w-3 text-lime-signal" /> Recreated — near match
          </span>
          <BrowserFrame url="your-new-site.app" compact>
            <div className="h-[150px]">
              <MiniSite variant="recreated" />
            </div>
          </BrowserFrame>
        </div>
      </div>
    </div>
  );
}
