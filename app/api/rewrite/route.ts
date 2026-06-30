import { NextRequest, NextResponse } from "next/server";
import { generateWithOllama } from "@/lib/ollama";
import { defaultOllamaSettings } from "@/lib/config";
import { getSubscription } from "@/lib/store";

export const dynamic = "force-dynamic";

// Pro feature: AI copy rewriting. Powered by the same LOCAL Ollama instance.
// Gated server-side behind an active Pro subscription — the UI gating in
// Settings is convenience only and must not be the sole enforcement point.
export async function POST(req: NextRequest) {
  let body: { text?: string; tone?: string; settings?: Partial<ReturnType<typeof defaultOllamaSettings>> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sub = await getSubscription();
  if (!(sub.plan === "pro" && sub.status === "active")) {
    return NextResponse.json(
      { error: "AI copy rewriting is a Pro feature. Upgrade to Pro to use it." },
      { status: 403 }
    );
  }

  const text = (body.text || "").trim();
  if (!text) {
    return NextResponse.json({ error: "Missing text to rewrite" }, { status: 400 });
  }

  const tone = body.tone || "confident, direct, builder-focused";
  const settings = { ...defaultOllamaSettings(), ...(body.settings || {}) };

  try {
    const rewritten = await generateWithOllama({
      settings,
      system: `You are Mousey's copywriter. Rewrite marketing copy in a ${tone} voice. Keep it concise and punchy. Return ONLY the rewritten copy, no quotes or commentary.`,
      prompt: text,
    });
    return NextResponse.json({ rewritten: rewritten || text, model: settings.model });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Local rewrite failed." },
      { status: 502 }
    );
  }
}
