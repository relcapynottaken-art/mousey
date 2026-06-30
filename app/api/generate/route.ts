import { NextRequest, NextResponse } from "next/server";
import { generateWithOllama, checkOllama } from "@/lib/ollama";
import { buildBasePrompt, refinementSystemPrompt } from "@/lib/prompt";
import { defaultOllamaSettings } from "@/lib/config";
import type { DesignSystem } from "@/lib/types";

export const dynamic = "force-dynamic";

// Generate an AI-ready recreation prompt from an extracted design system.
// The base prompt is assembled deterministically; the local model refines it.
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

  // Confirm the local model is reachable before attempting generation.
  const status = await checkOllama(settings.baseUrl);
  if (!status.running) {
    // Deterministic prompt still returned so the product is never blocked.
    return NextResponse.json(
      {
        prompt: basePrompt,
        refined: false,
        notice: "Start Ollama to enable AI prompt generation. Returned the structured base prompt instead.",
      },
      { status: 200 }
    );
  }

  try {
    const refined = await generateWithOllama({
      settings,
      system: refinementSystemPrompt(),
      prompt: basePrompt,
    });
    return NextResponse.json({
      prompt: refined || basePrompt,
      refined: Boolean(refined),
      model: settings.model,
    });
  } catch (err) {
    return NextResponse.json(
      {
        prompt: basePrompt,
        refined: false,
        notice: err instanceof Error ? err.message : "Local generation failed; returned base prompt.",
      },
      { status: 200 }
    );
  }
}
