// Central config resolver. All values are local-only; no cloud keys exist.

export const config = {
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "llama3",
    temperature: Number(process.env.OLLAMA_TEMPERATURE ?? 0.7),
    maxTokens: Number(process.env.OLLAMA_MAX_TOKENS ?? 2048),
  },
  db: {
    // Local JSON store for mock subscription state.
    url: process.env.DATABASE_URL || "file:./data/subscriptions.json",
  },
  product: {
    name: "Mousey",
    proPrice: 14.99,
    freeRemixesPerDay: 1,
    proRemixesPerMonth: 500,
  },
} as const;

export type OllamaSettings = {
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
};

export function defaultOllamaSettings(): OllamaSettings {
  return {
    baseUrl: config.ollama.baseUrl,
    model: config.ollama.model,
    temperature: config.ollama.temperature,
    maxTokens: config.ollama.maxTokens,
  };
}

/**
 * Merge client-supplied generation settings over the server defaults.
 *
 * SSRF hardening: in production (a hosted deployment) the endpoint is NEVER
 * taken from the client — only the operator-configured OLLAMA_BASE_URL is
 * trusted, so a visitor can't point the server-side fetch at loopback-only
 * services on the host. In local/dev runs the in-app Settings endpoint still
 * works so users can target their own Ollama. Model/temperature/maxTokens stay
 * client-tunable in both modes.
 */
export function resolveOllamaSettings(client?: Partial<OllamaSettings>): OllamaSettings {
  const base = defaultOllamaSettings();
  const merged = { ...base, ...(client || {}) };
  if (process.env.NODE_ENV === "production") {
    merged.baseUrl = base.baseUrl;
  }
  return merged;
}

/** Resolve the Ollama endpoint to probe, dropping a client value in production. */
export function resolveOllamaBaseUrl(clientBaseUrl?: string | null): string {
  if (process.env.NODE_ENV === "production") return config.ollama.baseUrl;
  return clientBaseUrl || config.ollama.baseUrl;
}
