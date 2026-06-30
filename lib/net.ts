// SSRF guard for the user-configurable Ollama endpoint.
//
// Mousey lets users point the app at their own local Ollama runtime (the
// in-app Settings panel exposes an "Endpoint" field, and the value flows from
// the client into a *server-side* fetch). On a hosted deployment that is a
// classic SSRF vector: a request could ask the server to fetch cloud metadata
// (http://169.254.169.254/…) or an internal admin service.
//
// Because Mousey is local-first, the only endpoints that make sense are
// loopback addresses on the user's own machine. We allow those by default and
// let an operator opt extra hosts in via OLLAMA_ALLOWED_HOSTS (comma-separated
// host or host:port entries) for the rare "Ollama on another LAN box" setup.

const LOOPBACK_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function extraAllowedHosts(): Set<string> {
  return new Set(
    (process.env.OLLAMA_ALLOWED_HOSTS || "")
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean)
  );
}

function isLoopbackHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (LOOPBACK_HOSTNAMES.has(h)) return true;
  // Any address in 127.0.0.0/8 is loopback.
  if (/^127(?:\.\d{1,3}){3}$/.test(h)) {
    return h.split(".").every((part) => Number(part) <= 255);
  }
  return false;
}

/**
 * Returns true if `rawUrl` is a safe Ollama endpoint to fetch server-side:
 * an http(s) URL whose host is loopback or explicitly allow-listed via
 * OLLAMA_ALLOWED_HOSTS. Anything unparseable or off-host returns false.
 */
export function isAllowedOllamaUrl(rawUrl: string): boolean {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const hostname = url.hostname.toLowerCase();
  if (isLoopbackHostname(hostname)) return true;

  const allowed = extraAllowedHosts();
  if (allowed.has(hostname)) return true;
  if (url.host && allowed.has(url.host.toLowerCase())) return true; // host:port form

  return false;
}

export const OLLAMA_ENDPOINT_BLOCKED_MESSAGE =
  "Endpoint not allowed. Mousey only connects to a local Ollama runtime " +
  "(localhost/127.0.0.1). Set OLLAMA_ALLOWED_HOSTS to permit another host.";
