import type { Metadata } from "next";
import Link from "next/link";
import { MouseyLogo } from "@/components/ui/Icons";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Upgrade to Pro",
  description: "Activate Mousey Pro — 500 remixes/month, AI copy rewriting, save & replay.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-ink-950">
      <header className="border-b border-line">
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MouseyLogo className="h-7 w-7" />
            <span className="text-lg font-semibold text-white">Mousey</span>
          </Link>
          <Link href="/#pricing" className="text-sm text-white/55 hover:text-white">
            ← Back to pricing
          </Link>
        </div>
      </header>

      <div className="container-x py-12">
        <CheckoutForm />
      </div>
    </main>
  );
}
