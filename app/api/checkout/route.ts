import { NextRequest, NextResponse } from "next/server";
import { activatePro } from "@/lib/store";
import { cvcValid, expiryValid, luhnValid } from "@/lib/validation";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────
// LOCAL MOCK CHECKOUT — no Stripe, no payment API keys.
//
// Validates card-input FORMAT only (Luhn + expiry + CVC shape), then activates
// the Pro plan in the local JSON store. No real charge is made.
//
// To enable real payments, replace this local checkout with Stripe Checkout.
// See STRIPE_MIGRATION.md.
// ─────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: { name?: string; card?: string; expiry?: string; cvc?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const card = (body.card || "").replace(/\s+/g, "");
  const expiry = (body.expiry || "").trim();
  const cvc = (body.cvc || "").trim();

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Enter the name on the card.";
  if (!luhnValid(card)) errors.card = "Enter a valid card number.";
  if (!expiryValid(expiry)) errors.expiry = "Enter a valid future expiry (MM/YY).";
  if (!cvcValid(cvc)) errors.cvc = "Enter a valid CVC.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Simulate processing latency for realistic UX.
  await new Promise((r) => setTimeout(r, 700));

  const last4 = card.slice(-4);
  const sub = await activatePro(last4);

  return NextResponse.json({
    ok: true,
    subscription: sub,
    message: "Pro activated. (Local mock — no real charge was made.)",
  });
}
