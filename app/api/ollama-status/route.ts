import { NextRequest, NextResponse } from "next/server";
import { checkOllama } from "@/lib/ollama";
import { resolveOllamaBaseUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // In production the client-supplied endpoint is ignored (SSRF hardening).
  const baseUrl = resolveOllamaBaseUrl(req.nextUrl.searchParams.get("baseUrl"));
  const status = await checkOllama(baseUrl);
  return NextResponse.json(status);
}
