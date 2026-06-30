# Migrating from the local mock checkout to Stripe

Mousey ships with a **functional local mock** payment flow so the Pro plan works with **zero
external API keys**. When you're ready to accept real payments, replace the mock with **Stripe
Checkout + webhooks**. This document is documentation only — no Stripe code is implemented in the
project because no API keys are available.

The mock lives in:

- `app/api/checkout/route.ts` — validates card format, activates Pro in the local JSON store
- `lib/store.ts` — local JSON subscription store
- `app/checkout/CheckoutForm.tsx` — client form

---

## 1. Required environment variables

Add these to `.env` (and to your Vercel project settings). **Do not commit real keys.**

```bash
STRIPE_SECRET_KEY=sk_live_or_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID=price_xxx          # the $14.99/mo recurring price
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Create the recurring price in the Stripe Dashboard (Products → add a $14.99/month recurring price)
and copy its `price_...` id into `STRIPE_PRICE_ID`.

---

## 2. Install the SDK

```bash
npm install stripe
```

---

## 3. Replace the checkout route with a Stripe Checkout Session

Replace `app/api/checkout/route.ts` with a route that creates a Checkout Session and redirects:

```ts
// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#pricing`,
  });

  return NextResponse.json({ url: session.url });
}
```

On the client (`app/checkout/CheckoutForm.tsx`), stop rendering the card fields and instead POST to
`/api/checkout`, then `window.location.href = data.url` to send the user to Stripe's hosted page.
Stripe handles all card collection and PCI compliance — you no longer collect card numbers yourself.

---

## 4. Add the webhook handler

Stripe confirms payment asynchronously. Create a webhook route to activate Pro only after Stripe
reports success:

```ts
// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { activatePro, cancelPro } from "@/lib/store";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      // Look up the customer/subscription and persist it. Replace the local
      // JSON store with your real DB keyed by the authenticated user id.
      await activatePro("stripe");
      break;
    case "customer.subscription.deleted":
      await cancelPro();
      break;
  }

  return NextResponse.json({ received: true });
}
```

> The `route.ts` for the webhook must read the **raw** request body (use `req.text()` as above) so
> the signature verifies. Do not parse it as JSON first.

Register the endpoint in the Stripe Dashboard (Developers → Webhooks) pointing at
`https://your-domain.com/api/stripe/webhook`, subscribe to `checkout.session.completed` and
`customer.subscription.deleted`, and copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

Test locally with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

---

## 5. Swap the local store for a real database

`lib/store.ts` uses a single-user JSON file for the demo. For production, replace it with a real
database (Postgres, etc.) keyed by the **authenticated user id**, and store the Stripe
`customer_id` and `subscription_id` so you can manage renewals and cancellations.

---

## 6. Remove the mock

Once Stripe is wired up:

- Delete the card-format validation / `setTimeout` simulation in the checkout route.
- Remove the "Local mock — no real charge" notices in `app/checkout/CheckoutForm.tsx`.
- Keep `getSubscription` / `activatePro` / `cancelPro` as your store interface, now backed by your DB.

That's it — the rest of the app (gating Pro features like AI copy rewriting) already reads plan
state through `lib/store.ts`, so it keeps working unchanged.
