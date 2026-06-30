interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
  badge?: string;
  compact?: boolean;
}

// Reusable browser chrome wrapper used across all product mockups.
export function BrowserFrame({
  url = "example.com",
  children,
  className = "",
  badge,
  compact = false,
}: BrowserFrameProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-line-strong bg-ink-850 shadow-float ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line bg-ink-800/80 px-3 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-ink-900 px-2.5 py-1">
          <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 018 0v3" />
          </svg>
          <span className="truncate font-mono text-[11px] text-white/45">{url}</span>
        </div>
        {badge && (
          <span className="hidden shrink-0 rounded-md border border-accent-500/30 bg-accent-500/10 px-2 py-0.5 text-[10px] font-medium text-accent-400 sm:inline">
            {badge}
          </span>
        )}
      </div>
      <div className={compact ? "" : ""}>{children}</div>
    </div>
  );
}
