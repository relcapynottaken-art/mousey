import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Discord, ArrowRight } from "@/components/ui/Icons";

const posts = [
  {
    handle: "@devon.builds",
    role: "vibe coder",
    avatar: "DB",
    color: "#6366f1",
    text: "Pointed Mousey at a SaaS landing I loved, pasted the prompt into v0, and the first generation was already 90% there. Spacing and type scale matched almost exactly.",
  },
  {
    handle: "@mira_ships",
    role: "indie founder",
    avatar: "MS",
    color: "#22d3ee",
    text: "I stopped screenshotting sites into Figma. Mousey just gives me the actual design system as a prompt. Rebuilt our marketing page in an afternoon.",
  },
  {
    handle: "@tariq.codes",
    role: "design remixer",
    avatar: "TC",
    color: "#a3e635",
    text: "The section-order capture is the killer feature. The recreation keeps the same rhythm, not just the colors. Feels like a sibling site, not a clone.",
  },
  {
    handle: "@noor.dev",
    role: "AI builder",
    avatar: "ND",
    color: "#f472b6",
    text: "Runs on my local llama3, so I'm not burning credits to iterate. Extract, tweak the prompt, regenerate. Fast loop.",
  },
];

export function Community() {
  return (
    <section id="community" className="border-t border-line py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Community"
          title="Built with startup builders and vibe coders"
          description="Join the Mousey Discord to share remixes, swap prompts, and trade the best reference sites worth cloning."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((p, i) => (
            <Reveal key={p.handle} delay={i * 80}>
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-ink-850/60 p-5 transition-colors hover:border-line-strong">
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-ink-950"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.avatar}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-white">{p.handle}</div>
                    <div className="text-[11px] text-white/45">{p.role}</div>
                  </div>
                </div>
                <blockquote className="text-sm leading-relaxed text-white/65">{p.text}</blockquote>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-col items-center justify-between gap-5 overflow-hidden rounded-2xl border border-line bg-gradient-to-r from-ink-850 to-ink-800 p-7 sm:flex-row">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5865F2]/20 text-[#7984ff]">
                <Discord className="h-6 w-6" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-base font-semibold text-white">Mousey Community on Discord</span>
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-signal" /> 4,200+ builders online
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-white/55">
                  Daily remix drops, prompt reviews, and a feed of sites worth recreating.
                </p>
              </div>
            </div>
            <a href="#" className="btn-primary shrink-0">
              Join the Discord <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
