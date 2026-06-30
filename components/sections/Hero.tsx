import { HeroVisual } from "@/components/mockups/HeroVisual";
import { Reveal } from "@/components/ui/Reveal";
import { Chrome, ArrowRight, Check } from "@/components/ui/Icons";

export function Hero() {
  return (
    <section id="product" className="relative overflow-hidden pt-32 pb-20 sm:pt-36 lg:pt-40">
      {/* background grid + glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-faint bg-[size:48px_48px] [mask-image:radial-gradient(70%_60%_at_50%_0%,#000_30%,transparent_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[600px] bg-radial-spot" />
      </div>

      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">
            <Chrome className="h-3.5 w-3.5" /> Chrome extension · runs on local models
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Turn any live website into an{" "}
            <span className="accent-text">AI-ready design prompt</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            Mousey reads the page you&apos;re on, extracts its full design language — layout,
            spacing, typography, colors, and component styling — and turns it into a structured
            prompt. Paste it into Claude, v0, Lovable, or Bolt and build a site that looks{" "}
            <span className="text-white/85">very close to the original</span>.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#pricing" className="btn-primary w-full sm:w-auto">
              <Chrome className="h-4 w-4" /> Add to Chrome — Free
            </a>
            <a href="#workflow" className="btn-ghost w-full sm:w-auto">
              See how it works <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/50">
            {["Extract the design language", "Stop starting from scratch", "Build a near-copy with AI"].map(
              (t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-lime-signal" /> {t}
                </li>
              )
            )}
          </ul>
        </Reveal>

        <Reveal className="mt-16" delay={120}>
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  );
}
