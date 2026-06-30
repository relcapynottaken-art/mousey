import type { Metadata } from "next";
import Link from "next/link";
import { MouseyLogo } from "@/components/ui/Icons";
import { SettingsClient } from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings & Playground",
  description:
    "Configure Mousey's local model endpoint, check Ollama status, generate an AI-ready prompt, and rewrite copy — all on local models.",
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-ink-950">
      <header className="border-b border-line">
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MouseyLogo className="h-7 w-7" />
            <span className="text-lg font-semibold text-white">Mousey</span>
          </Link>
          <Link href="/" className="text-sm text-white/55 hover:text-white">
            ← Back home
          </Link>
        </div>
      </header>

      <div className="container-x py-12">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings &amp; Playground</h1>
          <p className="mt-3 text-white/55">
            Mousey&apos;s AI features run entirely on a local Ollama instance — no cloud API keys.
            Configure the endpoint below, then try prompt generation and copy rewriting against a
            sample extracted design system.
          </p>
        </div>
        <SettingsClient />
      </div>
    </main>
  );
}
