import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Chrome, Cursor, Layers, Sparkles } from "@/components/ui/Icons";

const steps = [
  {
    n: "01",
    icon: Chrome,
    title: "Install the extension",
    body: "Add Mousey from the Chrome Web Store. No account, no setup — it lives in your toolbar and runs entirely on local models.",
  },
  {
    n: "02",
    icon: Cursor,
    title: "Open any website",
    body: "Visit any live site whose design you want. A landing page, a SaaS app, a portfolio — Mousey reads whatever is on screen.",
  },
  {
    n: "03",
    icon: Layers,
    title: "Extract the design",
    body: "One click captures the layout, color system, spacing rhythm, typography scale, and component structure — deterministically from the DOM.",
  },
  {
    n: "04",
    icon: Sparkles,
    title: "Paste into your AI builder",
    body: "Mousey generates a detailed prompt. Drop it into Claude, v0, Lovable, or Bolt to recreate the design with high fidelity.",
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="border-t border-line py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Workflow"
          title="From a live page to a near-match in four steps"
          description="No manual recreation. Capture a real website's design system and hand it to an AI builder."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-ink-850/60 p-6 transition-colors hover:border-line-strong">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-ink-800 text-accent-400">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs text-white/30">{s.n}</span>
                </div>
                <h3 className="text-base font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{s.body}</p>
                {/* connector line */}
                {i < steps.length - 1 && (
                  <span className="absolute -right-2 top-11 hidden h-px w-4 bg-gradient-to-r from-accent-500/60 to-transparent lg:block" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
