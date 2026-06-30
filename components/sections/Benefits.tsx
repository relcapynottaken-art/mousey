import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Cursor, Layers, Bolt } from "@/components/ui/Icons";

const benefits = [
  {
    icon: Cursor,
    title: "Skip the blank canvas",
    body: "Start from a real website you already like, not an empty editor. Point Mousey at a reference and begin with a design system that already works.",
    accent: "from-accent-500/20",
  },
  {
    icon: Layers,
    title: "Copy the design system",
    body: "Capture actual visual systems — measured fonts, hex colors, spacing units, radii, shadows, and component shapes. Not vague inspiration. Real values.",
    accent: "from-cyber/20",
  },
  {
    icon: Bolt,
    title: "Rebuild it with AI",
    body: "Generate prompts engineered for design fidelity. Move faster without manually recreating every detail — let the builder do the assembly.",
    accent: "from-lime-signal/20",
  },
];

export function Benefits() {
  return (
    <section className="border-t border-line py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why Mousey"
          title="Don't reinvent a design you already found"
          description="The web is the largest design library that exists. Mousey lets you transfer any of it into your next build."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 100}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-ink-850/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-card">
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${b.accent} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line-strong bg-ink-800 text-white">
                    <b.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-white">{b.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{b.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
