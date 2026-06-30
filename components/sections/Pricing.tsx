import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Check, ArrowRight, Chrome } from "@/components/ui/Icons";

const free = {
  name: "Free",
  price: "$0",
  cadence: "/month",
  note: "No credit card",
  features: [
    "1 remix per day",
    "Browser extension",
    "Brand kit & library",
    "Community support",
  ],
};

const pro = {
  name: "Pro",
  price: "$14.99",
  cadence: "/month",
  note: "Cancel anytime",
  features: [
    "500 remixes per month",
    "AI copy rewriting",
    "Save & replay remixes",
    "Priority support",
    "Everything in Free",
  ],
};

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-line py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Upgrade when you're shipping."
          description="Every plan runs on local models — no cloud API keys, no usage bills from us."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          {/* Free */}
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-ink-850/60 p-8">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-white">{free.name}</h3>
                <span className="rounded-full border border-line bg-ink-800 px-2.5 py-1 text-[11px] text-white/55">
                  {free.note}
                </span>
              </div>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-white">{free.price}</span>
                <span className="text-sm text-white/45">{free.cadence}</span>
              </div>
              <ul className="mt-7 space-y-3">
                {free.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                    <Check className="h-4 w-4 text-white/40" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="btn-ghost mt-8 w-full">
                <Chrome className="h-4 w-4" /> Add to Chrome
              </a>
            </div>
          </Reveal>

          {/* Pro — primary */}
          <Reveal delay={100}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-accent-500/40 bg-ink-850 p-8 shadow-glow">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-radial-spot" />
              <div className="relative flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-white">{pro.name}</h3>
                <span className="rounded-full border border-accent-500/40 bg-accent-500/15 px-2.5 py-1 text-[11px] font-medium text-accent-400">
                  Most popular
                </span>
              </div>
              <div className="relative mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-white">{pro.price}</span>
                <span className="text-sm text-white/45">{pro.cadence}</span>
              </div>
              <p className="relative mt-1 text-xs text-white/45">{pro.note}</p>
              <ul className="relative mt-7 space-y-3">
                {pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent-500/15 text-accent-400">
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/checkout" className="btn-primary relative mt-8 w-full">
                Upgrade to Pro <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
