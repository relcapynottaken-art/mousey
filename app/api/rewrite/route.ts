import { NextRequest, NextResponse } from "next/server";
import { generateWithOllama, checkOllama } from "@/lib/ollama";
import { defaultOllamaSettings } from "@/lib/config";

export const dynamic = "force-dynamic";

// Pro feature: AI copy rewriting. Powered by the same LOCAL Ollama instance.
export async function POST(req: NextRequest) {
  let body: { text?: string; tone?: string; settings?: Partial<ReturnType<typeof defaultOllamaSettings>> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = (body.text || "").trim();
  if (!text) {
    return NextResponse.json({ error: "Missing text to rewrite" }, { status: 400 });
  }

  const tone = body.tone || "confident, direct, builder-focused";
  const settings = { ...defaultOllamaSettings(), ...(body.settings || {}) };

  const status = await checkOllama(settings.baseUrl);
  if (!status.running) {
    return NextResponse.json(
      { error: "Start Ollama to enable AI copy rewriting." },
      { status: 503 }
    );
  }

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
