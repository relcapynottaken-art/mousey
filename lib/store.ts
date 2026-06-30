import { promises as fs } from "fs";
import path from "path";
import type { Subscription } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// LOCAL MOCK SUBSCRIPTION STORE
//
// This is a development-only, file-backed store for subscription state. It
// exists so the Pro checkout flow is fully functional WITHOUT Stripe or any
// payment API keys.
//
// To enable real payments, replace this local store with Stripe Checkout +
// webhooks. See STRIPE_MIGRATION.md.
// ─────────────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "subscriptions.json");

// In this single-user local demo we key everything to one local user.
const LOCAL_USER = "local-user";

type DbShape = Record<string, Subscription>;

async function ensureDb(): Promise<DbShape> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw) as DbShape;
  } catch {
    return {};
  }
}

async function writeDb(db: DbShape): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function freeSubscription(): Subscription {
  return {
    userId: LOCAL_USER,
    plan: "free",
    status: "none",
    activatedAt: null,
    renewsAt: null,
    cardLast4: null,
  };
}

export async function getSubscription(): Promise<Subscription> {
  const db = await ensureDb();
  return db[LOCAL_USER] ?? freeSubscription();
}

export async function activatePro(cardLast4: string): Promise<Subscription> {
  const db = await ensureDb();
  const now = new Date();
  const renews = new Date(now);
  renews.setMonth(renews.getMonth() + 1);

  const sub: Subscription = {
    userId: LOCAL_USER,
    plan: "pro",
    status: "active",
    activatedAt: now.toISOString(),
    renewsAt: renews.toISOString(),
    cardLast4,
  };
  db[LOCAL_USER] = sub;
  await writeDb(db);
  return sub;
}

export async function cancelPro(): Promise<Subscription> {
  const db = await ensureDb();
  const current = db[LOCAL_USER] ?? freeSubscription();
  const canceled: Subscription = {
    ...current,
    status: "canceled",
  };
  db[LOCAL_USER] = canceled;
  await writeDb(db);
  return canceled;
}
