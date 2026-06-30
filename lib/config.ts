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
