import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveOllamaBaseUrl, resolveOllamaSettings } from "../lib/config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("resolveOllamaSettings", () => {
  it("honors a client endpoint outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    const s = resolveOllamaSettings({ baseUrl: "http://127.0.0.1:9999", model: "mistral" });
    expect(s.baseUrl).toBe("http://127.0.0.1:9999");
    expect(s.model).toBe("mistral");
  });

  it("ignores a client endpoint in production but keeps other tunables", () => {
    vi.stubEnv("NODE_ENV", "production");
    const s = resolveOllamaSettings({ baseUrl: "http://127.0.0.1:9999", model: "mistral" });
    expect(s.baseUrl).toBe("http://localhost:11434"); // operator default
    expect(s.model).toBe("mistral");
  });
});

describe("resolveOllamaBaseUrl", () => {
  it("uses the client value in dev and the operator value in production", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(resolveOllamaBaseUrl("http://127.0.0.1:9999")).toBe("http://127.0.0.1:9999");
    vi.stubEnv("NODE_ENV", "production");
    expect(resolveOllamaBaseUrl("http://127.0.0.1:9999")).toBe("http://localhost:11434");
  });
});
