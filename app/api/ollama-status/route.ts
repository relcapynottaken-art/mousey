import { NextRequest, NextResponse } from "next/server";
import { checkOllama } from "@/lib/ollama";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const baseUrl = req.nextUrl.searchParams.get("baseUrl") || config.ollama.baseUrl;
  const status = await checkOllama(baseUrl);
  return NextResponse.json(status);
}
