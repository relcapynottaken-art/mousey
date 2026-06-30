import { afterEach, describe, expect, it } from "vitest";
import { isAllowedOllamaUrl } from "../lib/net";

afterEach(() => {
  delete process.env.OLLAMA_ALLOWED_HOSTS;
});

describe("isAllowedOllamaUrl", () => {
  it("allows loopback hosts", () => {
    expect(isAllowedOllamaUrl("http://localhost:11434")).toBe(true);
    expect(isAllowedOllamaUrl("http://127.0.0.1:11434")).toBe(true);
    expect(isAllowedOllamaUrl("http://127.0.0.5")).toBe(true);
    expect(isAllowedOllamaUrl("http://[::1]:11434")).toBe(true);
  });

  it("blocks the cloud metadata endpoint and arbitrary hosts (SSRF)", () => {
    expect(isAllowedOllamaUrl("http://169.254.169.254/latest/meta-data")).toBe(false);
    expect(isAllowedOllamaUrl("http://evil.example.com")).toBe(false);
    expect(isAllowedOllamaUrl("http://10.0.0.5:11434")).toBe(false);
  });

  it("blocks non-http(s) and unparseable URLs", () => {
    expect(isAllowedOllamaUrl("ftp://localhost")).toBe(false);
    expect(isAllowedOllamaUrl("file:///etc/passwd")).toBe(false);
    expect(isAllowedOllamaUrl("not a url")).toBe(false);
  });

  it("honors the OLLAMA_ALLOWED_HOSTS opt-in", () => {
    expect(isAllowedOllamaUrl("http://ollama.lan:11434")).toBe(false);
    process.env.OLLAMA_ALLOWED_HOSTS = "ollama.lan:11434, gpu-box";
    expect(isAllowedOllamaUrl("http://ollama.lan:11434")).toBe(true);
    expect(isAllowedOllamaUrl("http://gpu-box:11434")).toBe(true);
    expect(isAllowedOllamaUrl("http://other.lan")).toBe(false);
  });
});
