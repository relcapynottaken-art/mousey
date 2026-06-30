import { NextResponse } from "next/server";
import { getQuotaStatus, listRemixes } from "@/lib/store";

export const dynamic = "force-dynamic";

// Saved remix history (Pro: "Save & replay remixes") plus the current remix
// quota, so the Settings panel can show both in one round trip.
export async function GET() {
  const [remixes, quota] = await Promise.all([listRemixes(), getQuotaStatus()]);
  return NextResponse.json({ remixes, quota });
}
