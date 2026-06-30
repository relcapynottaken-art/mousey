"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "@/components/ui/Icons";

// ─────────────────────────────────────────────────────────────────────────
// LOCAL MOCK CHECKOUT (client). Validates input format, posts to the local
// /api/checkout route, and activates Pro in the local JSON store. No real
// charge is made. To enable real payments, replace this with Stripe Checkout.
// See STRIPE_MIGRATION.md.
// ─────────────────────────────────────────────────────────────────────────

type Errors = Partial<Record<"name" | "card" | "expiry" | "cvc", string>>;

const proFeatures = [
  "500 remixes per month",
  "AI copy rewriting (local model)",
  "Save & replay remixes",
  "Priority support",
  "Cancel anytime",
];

function formatCard(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export function CheckoutForm() {
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [last4, setLast4] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setStatus("processing");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, card, expiry, cvc }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrors(data.errors || {});
        setStatus("idle");
        return;
      }
      setLast4(data.subscription?.cardLast4 || card.slice(-4));
      setStatus("success");
    } catch {
      setErrors({ card: "Something went wrong. Try again." });
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-signal/30 bg-lime-signal/10 text-lime-signal">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-white">You&apos;re on Mousey Pro</h1>
        <p className="mt-3 text-white/60">
          Pro is now active for this workspace. Card ending{" "}
          <span className="font-mono text-white/80">•••• {last4}</span>.
        </p>
        <div className="mt-4 rounded-lg border border-line bg-ink-850 px-4 py-3 text-xs text-white/45">
          Local mock — no real charge was made. Subscription state is stored locally.
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/settings" className="btn-ghost">
            Configure local model
          </Link>
          <Link href="/" className="btn-primary">
            Back to Mousey <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_1.1fr]">
      {/* Order summary */}
      <div>
        <span className="eyebrow">
          <Sparkles className="h-3.5 w-3.5" /> Mousey Pro
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">Upgrade to Pro</h1>
        <div className="mt-6 rounded-2xl border border-line bg-ink-850/60 p-6">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <span className="text-white/70">Pro plan</span>
            <span className="text-2xl font-bold text-white">
              $14.99<span className="text-sm font-normal text-white/45">/mo</span>
            </span>
          </div>
          <ul className="mt-5 space-y-3">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-white/75">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent-500/15 text-accent-400">
                  <Check className="h-3 w-3" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-sm text-white/55">Due today</span>
            <span className="font-semibold text-white">$14.99</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-white/40">
          Billed monthly. Cancel anytime from Settings. Local mock checkout — see{" "}
          <span className="font-mono">STRIPE_MIGRATION.md</span> to enable real payments.
        </p>
      </div>

      {/* Payment form */}
      <form onSubmit={onSubmit} className="rounded-2xl border border-line-strong bg-ink-850 p-7 shadow-card">
        <h2 className="text-lg font-semibold text-white">Payment details</h2>
        <p className="mt-1 text-xs text-white/45">
          Test mode · use any number passing the Luhn check (e.g. 4242 4242 4242 4242).
        </p>

        <div className="mt-6 space-y-4">
          <Field label="Name on card" error={errors.name}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              autoComplete="cc-name"
              className="input"
            />
          </Field>

          <Field label="Card number" error={errors.card}>
            <input
              value={card}
              onChange={(e) => setCard(formatCard(e.target.value))}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              autoComplete="cc-number"
              className="input font-mono"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry" error={errors.expiry}>
              <input
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
                className="input font-mono"
              />
            </Field>
            <Field label="CVC" error={errors.cvc}>
              <input
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                inputMode="numeric"
                autoComplete="cc-csc"
                className="input font-mono"
              />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "processing"}
          className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "processing" ? "Processing…" : "Pay $14.99 & activate Pro"}
        </button>
        <p className="mt-3 text-center text-[11px] text-white/35">
          🔒 No real charge — local development checkout
        </p>

        <style>{`
          .input {
            width: 100%;
            border-radius: 0.6rem;
            border: 1px solid rgba(255,255,255,0.1);
            background: #0a0c12;
            padding: 0.65rem 0.8rem;
            font-size: 0.875rem;
            color: #fff;
            outline: none;
            transition: border-color .15s, box-shadow .15s;
          }
          .input::placeholder { color: rgba(255,255,255,0.3); }
          .input:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
          }
        `}</style>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/60">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
