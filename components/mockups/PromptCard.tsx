import { Sparkles, Code } from "@/components/ui/Icons";

// The generated AI-ready prompt panel — what Mousey hands off to the builder.
export function PromptCard({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line-strong bg-ink-850 shadow-float ${className}`}>
      <div className="flex items-center justify-between border-b border-line bg-ink-800/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent-400" />
          <span className="text-xs font-semibold text-white">AI-ready prompt</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded border border-line bg-ink-900 px-1.5 py-0.5 font-mono text-[10px] text-white/50">
            llama3 · local
          </span>
          <Code className="h-3.5 w-3.5 text-white/40" />
        </div>
      </div>
      <div className="space-y-2 p-4 font-mono text-[11px] leading-relaxed">
        <p className="text-white/45">
          <span className="text-accent-400">Rebuild</span> a site matching this reference&apos;s
          design language:
        </p>
        <p>
          <span className="text-cyber">LAYOUT</span>{" "}
          <span className="text-white/70">1200px container · 12-col grid · sticky nav</span>
        </p>
        <p>
          <span className="text-cyber">TYPE</span>{" "}
          <span className="text-white/70">Inter · H1 64/700 · base 16/1.6</span>
        </p>
        <p>
          <span className="text-cyber">COLOR</span>{" "}
          <span className="text-white/70">#0b0d12 surface · #6366f1 accent · dark/high-contrast</span>
        </p>
        <p>
          <span className="text-cyber">SPACING</span>{" "}
          <span className="text-white/70">8px rhythm · 120px sections · comfortable</span>
        </p>
        <p>
          <span className="text-cyber">COMPONENTS</span>{" "}
          <span className="text-white/70">14px radius · soft shadow · solid indigo buttons</span>
        </p>
        <p className="text-white/35">
          Preserve section order: hero → logos → features → metrics → pricing → cta
          <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse-line bg-accent-400" />
        </p>
      </div>
      <div className="flex items-center gap-2 border-t border-line bg-ink-900/60 px-4 py-2.5">
        <button className="rounded-md bg-accent-600 px-2.5 py-1 text-[11px] font-semibold text-white">
          Copy prompt
        </button>
        <button className="rounded-md border border-line px-2.5 py-1 text-[11px] font-medium text-white/70">
          Export snippet
        </button>
      </div>
    </div>
  );
}
