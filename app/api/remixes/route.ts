import { NextResponse } from "next/server";
import { getQuotaStatus, getSubscription, listRemixes } from "@/lib/store";

export const dynamic = "force-dynamic";

// Saved remix history (Pro: "Save & replay remixes") plus the current remix
// quota, so the Settings panel can show both in one round trip. Quota is public
// (Settings shows it for everyone); the saved history is Pro-only, so it is
// omitted for free/canceled users even though entries may exist in the store.
export async function GET() {
  const [quota, sub] = await Promise.all([getQuotaStatus(), getSubscription()]);
  const isPro = sub.plan === "pro" && sub.status === "active";
  const remixes = isPro ? await listRemixes() : [];
  return NextResponse.json({ remixes, quota });
}
