import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Check } from "@/components/ui/Icons";
import { sampleDesignSystem as ds } from "@/lib/sample";

const captured = [
  "Section hierarchy",
  "Content blocks",
  "CTA placement",
  "Navigation patterns",
  "Spacing & padding behavior",
  "Design density",
  "UI styling",
  "Aesthetic tone",
  "Visual rhythm",
  "Page composition",
];

export function TechnicalDetail() {
  return (
    <section className="relative border-t border-line py-24">
      <div className="container-x">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              align="left"
              eyebrow="Under the hood"
              title={
                <>
                  Mousey captures the{" "}
                  <span className="accent-text">whole design language</span> — not isolated tokens
                </>
              }
              description="Colors and fonts are the easy part. The hard part is structure: how a page is composed, where attention is directed, and how the rhythm holds together. Mousey reads all of it."
            />
            <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {captured.map((c, i) => (
                <Reveal as="li" key={c} delay={i * 50} className="flex items-center gap-2.5 text-sm text-white/75">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-accent-500/30 bg-accent-500/10 text-accent-400">
                    <Check className="h-3 w-3" />
                  </span>
                  {c}
                </Reveal>
              ))}
            </ul>
          </div>

          {/* captured design map */}
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl border border-line-strong bg-ink-850 shadow-card">
              <div className="flex items-center justify-between border-b border-line bg-ink-800/70 px-4 py-3">
                <span className="font-mono text-xs text-white/55">design-map.json</span>
                <span className="rounded border border-line bg-ink-900 px-1.5 py-0.5 font-mono text-[10px] text-lime-signal">
                  near-match ready
                </span>
              </div>
              <div className="space-y-4 p-5">
                <MapBlock label="Section order" mono>
                  {ds.layout.sectionOrder.map((s, i) => (
                    <span key={s} className="flex items-center gap-2 text-white/70">
                      <span className="text-white/30">{String(i + 1).padStart(2, "0")}</span>
                      {s}
                    </span>
                  ))}
                </MapBlock>

                <div className="grid grid-cols-2 gap-3">
                  <MapStat label="Hero" value="centered · dual CTA" />
                  <MapStat label="Nav" value="sticky · translucent" />
                  <MapStat label="Density" value={ds.spacing.density} />
                  <MapStat label="Rhythm" value={ds.spacing.rhythm} />
                  <MapStat label="Radius" value={ds.components.borderRadius} />
                  <MapStat label="Contrast" value="dark · high" />
                </div>

                <MapBlock label="Aesthetic tone">
                  <p className="text-white/70">{ds.mood.aesthetic}</p>
                  <p className="text-white/45">{ds.mood.interactionFeel}</p>
                </MapBlock>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MapBlock({
  label,
  children,
  mono = false,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-ink-900/60 p-4">
      <div className="mb-2.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
        {label}
      </div>
      <div className={`space-y-1.5 text-xs ${mono ? "font-mono" : ""}`}>{children}</div>
    </div>
  );
}

function MapStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-ink-900/60 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-white/35">{label}</div>
      <div className="mt-0.5 font-mono text-xs text-white/75">{value}</div>
    </div>
  );
}
