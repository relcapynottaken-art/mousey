import { promises as fs } from "fs";
import path from "path";
import { config } from "./config";
import type { Plan, QuotaStatus, RemixRecord, Subscription, Usage } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// LOCAL MOCK STORE
//
// A development-only, file-backed store for subscription state, remix usage
// quota, and saved remix history. It exists so the Pro checkout flow and the
// freemium quota are fully functional WITHOUT Stripe or any payment API keys.
//
// To enable real payments, replace this local store with Stripe Checkout +
// webhooks and a real DB keyed by the authenticated user. See
// STRIPE_MIGRATION.md.
// ─────────────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "subscriptions.json");

// In this single-user local demo we key everything to one local user.
const LOCAL_USER = "local-user";

// Cap on how many remixes we retain in history (Pro "Save & replay remixes").
const MAX_REMIX_HISTORY = 25;

interface DbShape {
  subscriptions: Record<string, Subscription>;
  usage: Record<string, Usage>;
  remixes: Record<string, RemixRecord[]>;
}

function emptyDb(): DbShape {
  return { subscriptions: {}, usage: {}, remixes: {} };
}

// Serialize all read-modify-write cycles through a single promise chain so two
// concurrent requests can't clobber each other's writes (the file store has no
// transactional guarantees of its own).
let writeChain: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  // Keep the chain alive regardless of whether `fn` resolved or rejected.
  writeChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

async function readDb(): Promise<DbShape> {
  // Only a missing file means "empty store". A parse failure or permission
  // error must surface, not silently reset — otherwise the next write would
  // persist an empty store over real subscriptions/quota/history.
  let raw: string;
  try {
    raw = await fs.readFile(DB_PATH, "utf8");
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code?: string }).code : undefined;
    if (code === "ENOENT") return emptyDb();
    throw err;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Local store is not valid JSON: ${DB_PATH}`);
  }
  if (!parsed || typeof parsed !== "object") return emptyDb();

  const obj = parsed as Record<string, unknown>;
  // New shape carries an explicit `subscriptions` key.
  if (obj.subscriptions && typeof obj.subscriptions === "object") {
    return {
      subscriptions: (obj.subscriptions as DbShape["subscriptions"]) ?? {},
      usage: (obj.usage as DbShape["usage"]) ?? {},
      remixes: (obj.remixes as DbShape["remixes"]) ?? {},
    };
  }
  // Legacy shape: the whole file was a flat map of userId -> Subscription.
  return { subscriptions: obj as DbShape["subscriptions"], usage: {}, remixes: {} };
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

function subFromDb(db: DbShape): Subscription {
  return db.subscriptions[LOCAL_USER] ?? freeSubscription();
}

function planOf(sub: Subscription): Plan {
  return sub.plan === "pro" && sub.status === "active" ? "pro" : "free";
}

// ── Subscriptions ─────────────────────────────────────────────────────────

export async function getSubscription(): Promise<Subscription> {
  return subFromDb(await readDb());
}

export async function activatePro(cardLast4: string): Promise<Subscription> {
  return withLock(async () => {
    const db = await readDb();
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
    db.subscriptions[LOCAL_USER] = sub;
    await writeDb(db);
    return sub;
  });
}

export async function cancelPro(): Promise<Subscription> {
  return withLock(async () => {
    const db = await readDb();
    const current = subFromDb(db);
    const canceled: Subscription = { ...current, status: "canceled" };
    db.subscriptions[LOCAL_USER] = canceled;
    await writeDb(db);
    return canceled;
  });
}

// ── Remix quota ───────────────────────────────────────────────────────────

function utcDayKey(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
function utcMonthKey(d: Date): string {
  return d.toISOString().slice(0, 7); // YYYY-MM
}

function freshUsage(now: Date): Usage {
  return {
    userId: LOCAL_USER,
    day: utcDayKey(now),
    dayCount: 0,
    month: utcMonthKey(now),
    monthCount: 0,
  };
}

// Roll the day/month counters forward if their period has changed.
function rolled(usage: Usage, now: Date): Usage {
  const day = utcDayKey(now);
  const month = utcMonthKey(now);
  return {
    userId: LOCAL_USER,
    day,
    dayCount: usage.day === day ? usage.dayCount : 0,
    month,
    monthCount: usage.month === month ? usage.monthCount : 0,
  };
}

function quotaFor(plan: Plan, usage: Usage): Omit<QuotaStatus, "allowed"> {
  if (plan === "pro") {
    const limit = config.product.proRemixesPerMonth;
    const used = usage.monthCount;
    return { plan, period: "month", limit, used, remaining: Math.max(0, limit - used) };
  }
  const limit = config.product.freeRemixesPerDay;
  const used = usage.dayCount;
  return { plan, period: "day", limit, used, remaining: Math.max(0, limit - used) };
}

/** Report current quota without consuming anything. */
export async function getQuotaStatus(): Promise<QuotaStatus> {
  const db = await readDb();
  const plan = planOf(subFromDb(db));
  const usage = rolled(db.usage[LOCAL_USER] ?? freshUsage(new Date()), new Date());
  const q = quotaFor(plan, usage);
  return { ...q, allowed: q.remaining > 0 };
}

/**
 * Atomically check the quota and, if there's room, consume one remix.
 * Returns the resulting status. When `allowed` is false nothing is consumed.
 */
export async function consumeRemix(): Promise<QuotaStatus> {
  return withLock(async () => {
    const db = await readDb();
    const now = new Date();
    const plan = planOf(subFromDb(db));
    const usage = rolled(db.usage[LOCAL_USER] ?? freshUsage(now), now);
    const q = quotaFor(plan, usage);

    if (q.remaining <= 0) {
      db.usage[LOCAL_USER] = usage;
      await writeDb(db);
      return { ...q, allowed: false };
    }

    if (plan === "pro") usage.monthCount += 1;
    else usage.dayCount += 1;
    db.usage[LOCAL_USER] = usage;
    await writeDb(db);

    const after = quotaFor(plan, usage);
    return { ...after, allowed: true };
  });
}

// ── Remix history (Pro: "Save & replay remixes") ──────────────────────────

export async function listRemixes(): Promise<RemixRecord[]> {
  const db = await readDb();
  return db.remixes[LOCAL_USER] ?? [];
}

export async function saveRemix(
  record: Omit<RemixRecord, "id" | "createdAt" | "starred"> &
    Partial<Pick<RemixRecord, "id" | "createdAt" | "starred">>
): Promise<RemixRecord> {
  return withLock(async () => {
    const db = await readDb();
    const full: RemixRecord = {
      id: record.id ?? `rx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      sourceUrl: record.sourceUrl,
      title: record.title,
      prompt: record.prompt,
      createdAt: record.createdAt ?? new Date().toISOString(),
      starred: record.starred ?? false,
    };
    const list = [full, ...(db.remixes[LOCAL_USER] ?? [])].slice(0, MAX_REMIX_HISTORY);
    db.remixes[LOCAL_USER] = list;
    await writeDb(db);
    return full;
  });
}
