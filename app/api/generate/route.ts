import { NextRequest, NextResponse } from "next/server";
import { generateWithOllama } from "@/lib/ollama";
import { buildBasePrompt, refinementSystemPrompt } from "@/lib/prompt";
import { defaultOllamaSettings } from "@/lib/config";
import { consumeRemix, getQuotaStatus, getSubscription, saveRemix } from "@/lib/store";
import type { DesignSystem } from "@/lib/types";

export const dynamic = "force-dynamic";

// Generate an AI-ready recreation prompt from an extracted design system.
//
// The base prompt is always assembled deterministically, so the product is
// never blocked. The local model only *refines* it, and that AI refinement is
// what counts against the remix quota (free: 1/day, pro: 500/month).
export async function POST(req: NextRequest) {
  let body: { designSystem?: DesignSystem; settings?: Partial<ReturnType<typeof defaultOllamaSettings>> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const ds = body.designSystem;
  if (!ds || !ds.typography || !ds.colors) {
    return NextResponse.json({ error: "Missing or invalid designSystem" }, { status: 400 });
  }

  const settings = { ...defaultOllamaSettings(), ...(body.settings || {}) };
  const basePrompt = buildBasePrompt(ds);

  // If the remix quota is exhausted, still return the deterministic base prompt
  // (never blocked) — we just don't spend a model call refining it.
  const quota = await getQuotaStatus();
  if (!quota.allowed) {
    const upgrade =
      quota.plan === "free"
        ? "Daily free remix limit reached. Upgrade to Pro for more AI-refined remixes."
        : "Monthly Pro remix limit reached.";
    return NextResponse.json(
      { prompt: basePrompt, refined: false, notice: upgrade, quota },
      { status: 200 }
    );
  }

  try {
    const refined = await generateWithOllama({
      settings,
      system: refinementSystemPrompt(),
      prompt: basePrompt,
    });

    // Only consume quota when refinement actually happened.
    const finalPrompt = refined || basePrompt;
    let consumed = quota;
    if (refined) {
      consumed = await consumeRemix();
      // Pro feature: persist the remix so it can be replayed later.
      const sub = await getSubscription();
      if (sub.plan === "pro" && sub.status === "active") {
        await saveRemix({
          sourceUrl: ds.source.url,
          title: ds.source.title,
          prompt: finalPrompt,
        });
      }
    }

    return NextResponse.json({
      prompt: finalPrompt,
      refined: Boolean(refined),
      model: settings.model,
      quota: consumed,
    });
  } catch (err) {
    // Ollama offline or model missing: return the base prompt, don't spend quota.
    return NextResponse.json(
      {
        prompt: basePrompt,
        refined: false,
        notice: err instanceof Error ? err.message : "Local generation failed; returned base prompt.",
        quota,
      },
      { status: 200 }
    );
  }
}
