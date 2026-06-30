"use client";

import { useCallback, useEffect, useState } from "react";
import { sampleDesignSystem } from "@/lib/sample";
import { Sparkles, Check, History } from "@/components/ui/Icons";

interface Settings {
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface OllamaStatus {
  running: boolean;
  models: string[];
  endpoint: string;
  error?: string;
}

interface Sub {
  plan: "free" | "pro";
  status: string;
  renewsAt: string | null;
  cardLast4: string | null;
}

interface Quota {
  plan: "free" | "pro";
  period: "day" | "month";
  limit: number;
  used: number;
  remaining: number;
  allowed: boolean;
}

interface Remix {
  id: string;
  sourceUrl: string;
  title: string;
  createdAt: string;
  prompt: string;
  starred: boolean;
}

const DEFAULTS: Settings = {
  baseUrl: "http://localhost:11434",
  model: "llama3",
  temperature: 0.7,
  maxTokens: 2048,
};

export function SettingsClient() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [status, setStatus] = useState<OllamaStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [sub, setSub] = useState<Sub | null>(null);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [remixes, setRemixes] = useState<Remix[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [prompt, setPrompt] = useState("");
  const [genNotice, setGenNotice] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [rewriteIn, setRewriteIn] = useState(
    "Mousey turns any live website into an AI-ready prompt so you can rebuild its design with AI."
  );
  const [rewriteOut, setRewriteOut] = useState("");
  const [rewriting, setRewriting] = useState(false);
  const [rewriteErr, setRewriteErr] = useState("");

  const checkStatus = useCallback(async (s: Settings) => {
    setChecking(true);
    try {
      const res = await fetch(
        `/api/ollama-status?baseUrl=${encodeURIComponent(s.baseUrl)}`,
        { cache: "no-store" }
      );
      setStatus(await res.json());
    } catch {
      setStatus({ running: false, models: [], endpoint: s.baseUrl, error: "unreachable" });
    } finally {
      setChecking(false);
    }
  }, []);

  const loadRemixes = useCallback(() => {
    fetch("/api/remixes", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setRemixes(Array.isArray(data.remixes) ? data.remixes : []);
        if (data.quota) setQuota(data.quota);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Restore saved settings (tolerate corrupt/legacy localStorage).
    let initial = DEFAULTS;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mousey:settings");
      if (saved) {
        try {
          initial = { ...DEFAULTS, ...JSON.parse(saved) };
        } catch {
          localStorage.removeItem("mousey:settings");
        }
      }
    }
    setSettings(initial);
    checkStatus(initial);
    fetch("/api/subscription", { cache: "no-store" })
      .then((r) => r.json())
      .then(setSub)
      .catch(() => {});
    loadRemixes();
  }, [checkStatus, loadRemixes]);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("mousey:settings", JSON.stringify(next));
    }
  }

  async function generate() {
    setGenerating(true);
    setGenNotice("");
    setPrompt("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designSystem: sampleDesignSystem, settings }),
      });
      const data = await res.json();
      setPrompt(data.prompt || "");
      if (data.quota) setQuota(data.quota);
      if (data.notice) setGenNotice(data.notice);
      else if (data.refined) setGenNotice(`Refined by local model: ${data.model}`);
      // A successful Pro refinement is saved to history — refresh the list.
      if (data.refined) loadRemixes();
    } catch {
      setGenNotice("Generation failed. Is the dev server running?");
    } finally {
      setGenerating(false);
    }
  }

  async function copyRemix(r: Remix) {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(r.prompt);
    } catch {
      return;
    }
    setCopiedId(r.id);
    setTimeout(() => setCopiedId((id) => (id === r.id ? null : id)), 1600);
  }

  async function rewrite() {
    setRewriting(true);
    setRewriteErr("");
    setRewriteOut("");
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rewriteIn, settings }),
      });
      const data = await res.json();
      if (!res.ok) setRewriteErr(data.error || "Rewrite failed.");
      else setRewriteOut(data.rewritten);
    } catch {
      setRewriteErr("Rewrite failed.");
    } finally {
      setRewriting(false);
    }
  }

  async function cancelPro() {
    const res = await fetch("/api/subscription", { method: "DELETE" });
    setSub(await res.json());
    loadRemixes(); // quota period flips back to the free daily limit
  }

  async function copyPrompt() {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const proActive = sub?.plan === "pro" && sub?.status === "active";

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* LEFT: settings + status + plan */}
      <div className="space-y-6">
        {/* Status */}
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Local model status</h2>
            <button
              onClick={() => checkStatus(settings)}
              className="text-xs text-accent-400 hover:text-accent-300"
            >
              {checking ? "Checking…" : "Refresh"}
            </button>
          </div>
          <div
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
              status?.running
                ? "border-lime-signal/30 bg-lime-signal/10 text-lime-signal"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                status?.running ? "bg-lime-signal" : "bg-amber-400"
              }`}
            />
            {status?.running ? "Ollama is running" : "Start Ollama to enable AI prompt generation"}
          </div>
          {status?.running && status.models.length > 0 && (
            <p className="mt-3 text-xs text-white/45">
              Installed models:{" "}
              <span className="font-mono text-white/70">{status.models.join(", ")}</span>
            </p>
          )}
          {!status?.running && (
            <p className="mt-3 text-xs text-white/45">
              Run <span className="font-mono text-white/70">ollama serve</span> and{" "}
              <span className="font-mono text-white/70">ollama pull {settings.model}</span>.
            </p>
          )}
        </div>

        {/* Settings */}
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Local model settings</h2>
          <div className="space-y-4">
            <SettingField label="Endpoint">
              <input
                value={settings.baseUrl}
                onChange={(e) => update("baseUrl", e.target.value)}
                onBlur={() => checkStatus(settings)}
                className="s-input font-mono"
              />
            </SettingField>
            <SettingField label="Model name">
              <input
                value={settings.model}
                onChange={(e) => update("model", e.target.value)}
                className="s-input font-mono"
                list="models"
              />
              <datalist id="models">
                {status?.models.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </SettingField>
            <div className="grid grid-cols-2 gap-4">
              <SettingField label={`Temperature · ${settings.temperature}`}>
                <input
                  type="range"
                  min={0}
                  max={1.5}
                  step={0.1}
                  value={settings.temperature}
                  onChange={(e) => update("temperature", Number(e.target.value))}
                  className="w-full accent-accent-500"
                />
              </SettingField>
              <SettingField label="Max tokens">
                <input
                  type="number"
                  min={256}
                  max={8192}
                  step={256}
                  value={settings.maxTokens}
                  onChange={(e) => update("maxTokens", Number(e.target.value))}
                  className="s-input font-mono"
                />
              </SettingField>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="rounded-2xl border border-line bg-ink-850/60 p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Your plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  proActive
                    ? "border border-accent-500/40 bg-accent-500/15 text-accent-400"
                    : "border border-line bg-ink-800 text-white/60"
                }`}
              >
                {proActive ? "Pro · active" : "Free"}
              </span>
              {proActive && sub?.cardLast4 && (
                <p className="mt-2 text-xs text-white/40">Card •••• {sub.cardLast4}</p>
              )}
            </div>
            {proActive ? (
              <button onClick={cancelPro} className="text-xs text-white/45 hover:text-white">
                Cancel
              </button>
            ) : (
              <a href="/checkout" className="btn-primary px-3 py-2 text-xs">
                Upgrade
              </a>
            )}
          </div>
          {quota && (
            <div className="mt-4 border-t border-line pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">
                  AI remixes this {quota.period}
                </span>
                <span className="font-mono text-white/75">
                  {quota.used} / {quota.limit}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-800">
                <div
                  className={`h-full rounded-full ${
                    quota.remaining > 0 ? "bg-accent-500" : "bg-amber-500"
                  }`}
                  style={{
                    width: `${Math.min(100, (quota.used / Math.max(1, quota.limit)) * 100)}%`,
                  }}
                />
              </div>
              {quota.remaining <= 0 && quota.plan === "free" && (
                <p className="mt-2 text-[11px] text-amber-300/80">
                  Daily free limit reached. Upgrade for {/* */}500 AI remixes per month.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: playground */}
      <div className="space-y-6">
        {/* Prompt generation */}
        <div className="rounded-2xl border border-line-strong bg-ink-850 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Sparkles className="h-4 w-4 text-accent-400" /> Prompt generation
            </h2>
            <button
              onClick={generate}
              disabled={generating}
              className="btn-primary px-4 py-2 text-xs disabled:opacity-60"
            >
              {generating ? "Generating…" : "Generate from sample site"}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-white/45">
            Source: <span className="font-mono">{sampleDesignSystem.source.title}</span> — extracted
            deterministically, then refined by your local model when available.
          </p>

          {genNotice && (
            <div className="mt-4 rounded-lg border border-line bg-ink-900/60 px-3 py-2 text-xs text-white/55">
              {genNotice}
            </div>
          )}

          {prompt && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-white/45">Generated prompt</span>
                <button onClick={copyPrompt} className="text-xs text-accent-400 hover:text-accent-300">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-ink-900 p-4 font-mono text-[11px] leading-relaxed text-white/75">
                {prompt}
              </pre>
            </div>
          )}
        </div>

        {/* Copy rewriting */}
        <div className="rounded-2xl border border-line bg-ink-850/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <History className="h-4 w-4 text-cyber" /> AI copy rewriting
              <span className="rounded-full border border-accent-500/40 bg-accent-500/15 px-2 py-0.5 text-[10px] font-medium text-accent-400">
                Pro
              </span>
            </h2>
            <button
              onClick={rewrite}
              disabled={rewriting}
              className="btn-ghost px-4 py-2 text-xs disabled:opacity-60"
            >
              {rewriting ? "Rewriting…" : "Rewrite"}
            </button>
          </div>
          <textarea
            value={rewriteIn}
            onChange={(e) => setRewriteIn(e.target.value)}
            rows={3}
            className="s-input mt-4 w-full resize-none"
          />
          {rewriteErr && <p className="mt-2 text-xs text-amber-300">{rewriteErr}</p>}
          {rewriteOut && (
            <div className="mt-3 rounded-lg border border-line bg-ink-900 p-4 text-sm leading-relaxed text-white/80">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-white/35">
                Rewritten
              </span>
              {rewriteOut}
            </div>
          )}
        </div>

        {/* Remix history (Pro) */}
        <div className="rounded-2xl border border-line bg-ink-850/60 p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-white">
            <History className="h-4 w-4 text-accent-400" /> Saved remixes
            <span className="rounded-full border border-accent-500/40 bg-accent-500/15 px-2 py-0.5 text-[10px] font-medium text-accent-400">
              Pro
            </span>
          </h2>
          <p className="mt-1.5 text-xs text-white/45">
            Successful AI-refined remixes are saved here so you can replay them.
          </p>
          {remixes.length === 0 ? (
            <p className="mt-4 text-xs text-white/35">
              No saved remixes yet. Generate one with Pro active to save it.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {remixes.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line bg-ink-900 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white/80">{r.title || "Untitled"}</p>
                    <p className="truncate text-[11px] text-white/35">
                      {new Date(r.createdAt).toLocaleString()}
                      {r.sourceUrl ? ` · ${r.sourceUrl}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => copyRemix(r)}
                    className="shrink-0 text-xs text-accent-400 hover:text-accent-300"
                  >
                    {copiedId === r.id ? "Copied!" : "Copy"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style>{`
        .s-input {
          width: 100%;
          border-radius: 0.55rem;
          border: 1px solid rgba(255,255,255,0.1);
          background: #0a0c12;
          padding: 0.55rem 0.7rem;
          font-size: 0.8rem;
          color: #fff;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .s-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
        }
      `}</style>
    </div>
  );
}

function SettingField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/55">{label}</span>
      {children}
    </label>
  );
}
