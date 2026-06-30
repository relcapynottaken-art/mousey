# Mousey

**Turn any live website into an AI-ready design prompt.**

Mousey is a Chrome extension + companion web app that reads the website you're on, extracts its
complete visual design language — layout, spacing, typography, colors, and component styling — and
generates a detailed, structured prompt. Paste that prompt into an AI website builder (Claude, v0,
Lovable, Bolt) to recreate a new site that looks **very close to the original**.

It is not a vague "inspiration" tool. The extraction is deterministic (read from the live DOM's
computed styles), and the generated prompt is engineered for **maximum design fidelity** so the AI
builder reproduces the section order, spacing rhythm, type hierarchy, color palette, component
shapes, radii, and overall mood of the reference.

> **Runs entirely on local models. No cloud API keys required.** AI prompt generation and copy
> rewriting are powered by a local [Ollama](https://ollama.ai) instance. The Pro checkout is a
> functional local mock that can be swapped for Stripe later.

---

## What Mousey does

1. You open a website you like.
2. Mousey reads the page.
3. Mousey captures the site's design language (deterministic DOM analysis).
4. Mousey generates a detailed prompt describing that design.
5. You paste the prompt into Claude, Lovable, v0, Bolt, or another AI builder.
6. The AI generates a new website with a very similar design style, structure, layout, and feel.

### What gets captured

Section hierarchy · content blocks · CTA placement · navigation patterns · spacing & padding
behavior · design density · typography & font hierarchy · color palette & contrast · component
shapes · button & card styling · grid patterns · border radius · shadows · icon treatment · hero
composition · visual rhythm · aesthetic mood · page composition.

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (custom dark premium design system)
- **Ollama** local LLM backend for prompt generation & copy rewriting
- **Local JSON store** for mock subscription state (no external DB)

---

## Project structure

```
mousey/
├── app/
│   ├── layout.tsx            # Metadata, OG tags, fonts
│   ├── page.tsx              # Landing page (all sections)
│   ├── globals.css
│   ├── checkout/             # Local mock Pro checkout (functional)
│   ├── settings/             # Local-model settings + live playground
│   └── api/
│       ├── ollama-status/    # Checks if Ollama is running
│       ├── generate/         # Design system → AI-ready prompt (local model, quota-metered)
│       ├── rewrite/          # Pro: AI copy rewriting (local model, Pro-gated)
│       ├── checkout/         # Local mock payment → activates Pro
│       ├── remixes/          # Saved remix history + current quota
│       └── subscription/     # Read / cancel local subscription
├── components/
│   ├── sections/             # Header, Hero, Workflow, Pricing, …
│   ├── mockups/              # Browser frames, extraction panel, prompt card
│   └── ui/                   # Icons, Reveal
├── lib/
│   ├── extract.ts            # Deterministic client-side DOM design extraction
│   ├── prompt.ts             # Deterministic prompt assembly
│   ├── ollama.ts             # Local Ollama client
│   ├── net.ts                # SSRF guard for the Ollama endpoint
│   ├── validation.ts         # Pure card-format validators (Luhn / expiry / CVC)
│   ├── store.ts              # Local JSON store: subscription + quota + remix history
│   ├── sample.ts             # Sample extracted design system (demo/fallback)
│   └── config.ts / types.ts
├── data/                     # Local subscription JSON (gitignored at runtime)
├── .env.example
├── vercel.json
├── STRIPE_MIGRATION.md
└── README.md
```

---

## Environment variables

All configuration is **local-only**. There are **no cloud API keys**. Copy `.env.example` to `.env`:

| Variable             | Default                          | Purpose                                            |
| -------------------- | -------------------------------- | -------------------------------------------------- |
| `OLLAMA_BASE_URL`    | `http://localhost:11434`         | Local Ollama endpoint for AI features              |
| `OLLAMA_MODEL`       | `llama3`                         | Default local model (e.g. `llama3`, `mistral`)     |
| `OLLAMA_TEMPERATURE` | `0.7`                            | Generation temperature (overridable in Settings)   |
| `OLLAMA_MAX_TOKENS`  | `2048`                           | Max tokens (overridable in Settings)               |
| `OLLAMA_ALLOWED_HOSTS` | _(empty)_                      | Extra non-loopback hosts allowed for the Ollama endpoint (SSRF allowlist) |
| `DATABASE_URL`       | `file:./data/subscriptions.json` | Local mock subscription store                      |

> **Endpoint safety (SSRF):** the Ollama endpoint is fetched **server-side**. In **production**
> the client-supplied endpoint is ignored entirely — only the operator-configured `OLLAMA_BASE_URL`
> (plus `OLLAMA_ALLOWED_HOSTS`) is trusted, so a visitor can't point the server at loopback-only
> services on the host. In **local/dev** runs the in-app Settings endpoint still works so you can
> target your own Ollama. As defense-in-depth, only loopback hosts (`localhost`, `127.0.0.0/8`,
> `::1`) or hosts in `OLLAMA_ALLOWED_HOSTS` are ever allowed, and redirects off the endpoint are
> rejected.

> No `STRIPE_*`, `OPENAI_*`, `ANTHROPIC_*`, `GOOGLE_*`, or other cloud keys are used anywhere.

---

## Install & start Ollama (for AI features)

The app runs without Ollama (it falls back to a deterministic structured prompt), but to enable
**AI prompt refinement** and **AI copy rewriting** you need a local model:

1. Install Ollama from **https://ollama.ai**
2. Pull a model:
   ```bash
   ollama pull llama3      # or: ollama pull mistral
   ```
3. Start the server:
   ```bash
   ollama serve
   ```
4. Verify it's running at **http://localhost:11434**
5. Mousey connects automatically. Prefer a different model? Change `OLLAMA_MODEL` in `.env`, or set
   it live in the in-app **Settings** panel (`/settings`).

If Ollama is not running, the app shows: **"Start Ollama to enable AI prompt generation"** and still
returns the structured base prompt so you're never blocked.

---

## Run locally

```bash
# 1. Install dependencies
npm install

# 2. Configure local env
cp .env.example .env

# 3. (Optional, for AI features) start Ollama in another terminal
ollama serve

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000**.

- Landing page: `/`
- Local-model settings & playground: `/settings`
- Pro checkout (local mock): `/checkout`

Production build:

```bash
npm run build
npm start
```

---

## Local mock payments

The Pro plan ($14.99/month) checkout at `/checkout` is a **fully functional local mock**:

- The form validates card input **format** (Luhn check + expiry + CVC shape).
- On submit it activates Pro in a local JSON store (`data/subscriptions.json`).
- **No real charge is made** and no payment processor is contacted.

To enable real payments, replace the local checkout with **Stripe Checkout** — see
[`STRIPE_MIGRATION.md`](./STRIPE_MIGRATION.md).

### Remix quota & Pro gating

Remix limits are enforced **server-side**, not just in the UI:

- **Free:** 1 AI-refined remix per day. The deterministic base prompt is always returned (never
  blocked) — only the local-model refinement is metered.
- **Pro:** 500 AI-refined remixes per month, plus **AI copy rewriting** (`/api/rewrite`, gated
  behind an active Pro subscription) and **saved remix history** (`/api/remixes`, replayable from
  Settings).

Quota counters and saved remixes live in the same local JSON store and reset lazily when their
day/month period rolls over.

---

## Deploy to Vercel (manual)

A `vercel.json` is included and the project is a standard Next.js app.

**Via the Vercel dashboard:**

1. Push this repo to GitHub (see below).
2. Go to **vercel.com → Add New → Project** and import the repo.
3. Framework preset is detected as **Next.js** automatically.
4. (Optional) Set env vars `OLLAMA_BASE_URL` and `OLLAMA_MODEL`.
5. Deploy.

**Via the Vercel CLI:**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

> Note: AI features call `http://localhost:11434`, which is the **user's own machine**. On a
> hosted deployment those calls only work for visitors running Ollama locally; the landing page,
> mock checkout, and deterministic prompt assembly work everywhere. This is intentional — Mousey is
> a local-first product.

---

## Testing & checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # next lint (eslint-config-next)
npm test            # vitest — validators, extraction helpers, prompt assembly, SSRF guard
```

CI (`.github/workflows/ci.yml`) runs typecheck, lint, tests, and a production build on every PR.

---

## Scripts

| Command           | Description                |
| ----------------- | ------------------------- |
| `npm run dev`     | Start dev server          |
| `npm run build`   | Production build          |
| `npm start`       | Run production server     |
| `npm run lint`    | Lint                      |
| `npm run typecheck` | Type-check (no emit)    |
| `npm test`        | Run unit tests (Vitest)   |

---

## License

For demonstration purposes. Mousey, all branding, and copy are part of this concept build.
