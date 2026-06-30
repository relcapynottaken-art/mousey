import { NextResponse } from "next/server";
import { getSubscription, cancelPro } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const sub = await getSubscription();
  return NextResponse.json(sub);
}

// Cancel the (mock) Pro plan.
export async function DELETE() {
  const sub = await cancelPro();
  return NextResponse.json(sub);
}
