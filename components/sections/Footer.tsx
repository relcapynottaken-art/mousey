import Link from "next/link";
import { MouseyLogo, Discord, Github, XSocial, Chrome } from "@/components/ui/Icons";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "#product" },
      { label: "Workflow", href: "#workflow" },
      { label: "Features", href: "#product" },
      { label: "Chrome Web Store", href: "#" },
    ],
  },
  {
    title: "Pricing",
    links: [
      { label: "Free plan", href: "#pricing" },
      { label: "Pro — $14.99/mo", href: "/checkout" },
      { label: "Compare plans", href: "#pricing" },
      { label: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: "#community" },
      { label: "Remix library", href: "#" },
      { label: "Prompt gallery", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-900/40">
      <div className="container-x py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <MouseyLogo className="h-7 w-7" />
              <span className="text-lg font-semibold text-white">Mousey</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Turn any live website into an AI-ready design prompt. Extract the design language,
              hand it to your AI builder, ship a near-match.
            </p>
            <a
              href="#"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-line bg-ink-800/60 px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:text-white"
            >
              <Chrome className="h-4 w-4" /> Available in the Chrome Web Store
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Mousey. Runs on local models. No external API keys.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: Discord, label: "Discord" },
              { icon: XSocial, label: "X" },
              { icon: Github, label: "GitHub" },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-white/55 transition-colors hover:border-line-strong hover:text-white"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
