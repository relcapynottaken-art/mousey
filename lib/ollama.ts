import type { OllamaSettings } from "./config";

// Thin client for a LOCAL Ollama runtime. No cloud providers, no API keys.
// Everything here targets http://localhost:11434 by default.

export interface OllamaStatus {
  running: boolean;
  models: string[];
  endpoint: string;
  error?: string;
}

export async function checkOllama(baseUrl: string): Promise<OllamaStatus> {
  const endpoint = baseUrl.replace(/\/$/, "");
  try {
    const res = await fetch(`${endpoint}/api/tags`, {
      method: "GET",
      // short timeout so the UI never hangs when Ollama is offline
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });
    if (!res.ok) {
      return { running: false, models: [], endpoint, error: `HTTP ${res.status}` };
    }
    const data = (await res.json()) as { models?: { name: string }[] };
    return {
      running: true,
      models: (data.models || []).map((m) => m.name),
      endpoint,
    };
  } catch (err) {
    return {
      running: false,
      models: [],
      endpoint,
      error: err instanceof Error ? err.message : "unreachable",
    };
  }
}

export interface GenerateArgs {
  settings: OllamaSettings;
  system: string;
  prompt: string;
}

/**
 * Call the local model via Ollama's /api/generate (non-streaming).
 * Returns the generated text. Throws with a clear message if Ollama is down.
 */
export async function generateWithOllama({
  settings,
  system,
  prompt,
}: GenerateArgs): Promise<string> {
  const endpoint = settings.baseUrl.replace(/\/$/, "");
  let res: Response;
  try {
    res = await fetch(`${endpoint}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: settings.model,
        system,
        prompt,
        stream: false,
        options: {
          temperature: settings.temperature,
          num_predict: settings.maxTokens,
        },
      }),
      signal: AbortSignal.timeout(120000),
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Could not reach the local model. Start Ollama to enable AI prompt generation."
    );
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 404) {
      throw new Error(
        `Model "${settings.model}" is not installed. Run: ollama pull ${settings.model}`
      );
    }
    throw new Error(`Ollama error ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as { response?: string };
  return (data.response || "").trim();
}
