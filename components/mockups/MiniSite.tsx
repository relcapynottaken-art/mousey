// A tiny abstract website rendering used as the "source" and "recreated"
// previews. `variant` lets us show the recreation as a near-match sibling.
export function MiniSite({
  variant = "source",
  scanning = false,
}: {
  variant?: "source" | "recreated";
  scanning?: boolean;
}) {
  const accent = variant === "source" ? "#6366f1" : "#22d3ee";
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink-900 p-4">
      {scanning && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 animate-scan bg-gradient-to-b from-accent-500/30 to-transparent" />
      )}
      {/* nav */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: accent }} />
          <span className="h-2 w-10 rounded bg-white/30" />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-6 rounded bg-white/15" />
          <span className="h-1.5 w-6 rounded bg-white/15" />
          <span className="h-4 w-12 rounded" style={{ backgroundColor: accent }} />
        </div>
      </div>
      {/* hero */}
      <div className="mb-4 space-y-2">
        <span className="block h-2 w-16 rounded-full bg-white/10" />
        <span className="block h-4 w-4/5 rounded bg-white/70" />
        <span className="block h-4 w-3/5 rounded bg-white/40" />
        <span className="block h-2 w-2/3 rounded bg-white/15" />
        <div className="flex gap-2 pt-1">
          <span className="h-5 w-16 rounded-md" style={{ backgroundColor: accent }} />
          <span className="h-5 w-16 rounded-md border border-white/15" />
        </div>
      </div>
      {/* cards grid */}
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1.5 rounded-lg border border-white/10 bg-ink-800 p-2">
            <span className="block h-3 w-3 rounded" style={{ backgroundColor: accent, opacity: 0.7 }} />
            <span className="block h-1.5 w-full rounded bg-white/25" />
            <span className="block h-1.5 w-2/3 rounded bg-white/15" />
          </div>
        ))}
      </div>
    </div>
  );
}
