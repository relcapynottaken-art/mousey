"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MouseyLogo, Chrome, ArrowRight } from "@/components/ui/Icons";

const nav = [
  { label: "Product", href: "#product" },
  { label: "Workflow", href: "#workflow" },
  { label: "Pricing", href: "#pricing" },
  { label: "Community", href: "#community" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-ink-950/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Mousey home">
          <MouseyLogo className="h-7 w-7" />
          <span className="text-lg font-semibold tracking-tight text-white">Mousey</span>
          <span className="ml-1 hidden items-center gap-1 rounded-full border border-line bg-ink-800/60 px-2 py-0.5 text-[10px] font-medium text-white/55 sm:inline-flex">
            <Chrome className="h-3 w-3" /> Chrome Web Store
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/65 transition-colors hover:bg-ink-800/60 hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="#pricing" className="text-sm font-medium text-white/65 transition-colors hover:text-white">
            Sign in
          </a>
          <a href="#pricing" className="btn-primary">
            Get Started <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-white/80 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-ink-950/95 px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-ink-800"
              >
                {n.label}
              </a>
            ))}
            <a href="#pricing" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Get Started
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
