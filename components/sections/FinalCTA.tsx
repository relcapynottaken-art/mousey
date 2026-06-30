import { Reveal } from "@/components/ui/Reveal";
import { Chrome, ArrowRight } from "@/components/ui/Icons";

export function FinalCTA() {
  return (
    <section className="border-t border-line py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-ink-850 px-6 py-16 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-grid-faint bg-[size:40px_40px] [mask-image:radial-gradient(60%_60%_at_50%_40%,#000,transparent)]" />
              <div className="absolute inset-x-0 top-0 h-64 bg-radial-spot" />
            </div>

            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Stop starting from scratch. Use the web as your design source.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
              Generate the closest possible AI-ready prompt from any live website and build
              beautiful sites faster — all on local models, no API keys.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#pricing" className="btn-primary w-full sm:w-auto">
                <Chrome className="h-4 w-4" /> Add Mousey to Chrome — Free
              </a>
              <a href="#workflow" className="btn-ghost w-full sm:w-auto">
                See the workflow <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-5 text-xs text-white/40">
              Free plan · 1 remix per day · no credit card required
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
