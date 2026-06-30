import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import {
  Camera,
  Grid,
  TypeIcon,
  Palette,
  Layers,
  Sparkles,
  History,
  Code,
  Ruler,
} from "@/components/ui/Icons";

const features = [
  {
    icon: Camera,
    title: "Live website capture",
    body: "Read the page you're on in real time — no uploads, no screenshots to interpret. Mousey works on whatever renders.",
  },
  {
    icon: Grid,
    title: "Extracted layout map",
    body: "Section hierarchy, grid columns, container widths, and how blocks stack across breakpoints.",
  },
  {
    icon: TypeIcon,
    title: "Typography & style detection",
    body: "Font families, the full type scale, weights, and line-height pulled from computed styles.",
  },
  {
    icon: Palette,
    title: "Color palette detection",
    body: "Background surfaces, text colors, borders, and accents resolved to hex with their roles.",
  },
  {
    icon: Layers,
    title: "Component structure analysis",
    body: "Buttons, cards, navs, and badges — their shapes, radii, shadows, and spacing patterns.",
  },
  {
    icon: Sparkles,
    title: "Prompt generation",
    body: "A structured, builder-ready prompt assembled deterministically, then polished by a local model.",
  },
  {
    icon: Camera,
    title: "Screenshot & reference saving",
    body: "Pin a visual reference alongside the extracted system so you never lose the source look.",
  },
  {
    icon: Code,
    title: "Code snippet export",
    body: "Export the design tokens as a ready-to-paste snippet to seed your stylesheet or theme.",
  },
  {
    icon: History,
    title: "Remix library & history",
    body: "Every extraction is saved. Revisit, replay, and re-export any past remix in one click.",
  },
];

export function Features() {
  return (
    <section className="border-t border-line py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Features"
          title="Everything Mousey reads from a page"
          description="Deterministic DOM analysis, not guesswork. The extraction is precise so the recreation can be close."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80} className="contents">
              <div className="group bg-ink-850/80 p-6 transition-colors hover:bg-ink-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-ink-800 text-accent-400 transition-colors group-hover:text-cyber">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-white/40">
          <Ruler className="h-4 w-4" />
          Extraction runs client-side from computed styles — no design data leaves your machine.
        </p>
      </div>
    </section>
  );
}
