import { sampleDesignSystem as ds } from "@/lib/sample";
import { MouseyLogo, Layers, TypeIcon, Palette, Ruler } from "@/components/ui/Icons";

// The Mousey extension popup as it appears over a live page: a deterministic
// readout of the extracted design system (colors, type, spacing, components).
export function ExtractionPanel({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-[290px] rounded-xl border border-line-strong bg-ink-850/95 shadow-float backdrop-blur-md ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-3.5 py-3">
        <div className="flex items-center gap-2">
          <MouseyLogo className="h-5 w-5" />
          <span className="text-sm font-semibold text-white">Mousey</span>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-lime-signal">
          <span className="h-1.5 w-1.5 animate-pulse-line rounded-full bg-lime-signal" />
          Extracting
        </span>
      </div>

      <div className="space-y-3 p-3.5">
        {/* Typography */}
        <Row icon={<TypeIcon className="h-3.5 w-3.5" />} label="Typography">
          <div className="flex flex-wrap gap-1.5">
            <Chip>{ds.typography.headingFont}</Chip>
            <Chip>{ds.typography.baseSize}</Chip>
            <Chip>H1 {ds.typography.scale[0].size}</Chip>
          </div>
        </Row>

        {/* Colors */}
        <Row icon={<Palette className="h-3.5 w-3.5" />} label="Color palette">
          <div className="flex gap-1.5">
            {ds.colors.palette.map((c) => (
              <span
                key={c.hex + c.role}
                title={`${c.hex} · ${c.role}`}
                className="h-5 w-5 rounded-md border border-white/10"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </Row>

        {/* Spacing */}
        <Row icon={<Ruler className="h-3.5 w-3.5" />} label="Spacing & density">
          <div className="flex flex-wrap gap-1.5">
            <Chip>{ds.spacing.rhythm}</Chip>
            <Chip>{ds.spacing.density}</Chip>
            <Chip>gap {ds.spacing.gridGap}</Chip>
          </div>
        </Row>

        {/* Components */}
        <Row icon={<Layers className="h-3.5 w-3.5" />} label="Components">
          <div className="flex flex-wrap gap-1.5">
            <Chip>radius {ds.components.borderRadius}</Chip>
            <Chip>shadow</Chip>
            <Chip>solid btn</Chip>
          </div>
        </Row>

        <button className="mt-1 w-full rounded-lg bg-accent-600 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-500">
          Generate AI prompt →
        </button>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-ink-900/60 p-2.5">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
        <span className="text-accent-400">{icon}</span>
        {label}
      </div>
      {children}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-line bg-ink-800 px-1.5 py-0.5 font-mono text-[10px] text-white/70">
      {children}
    </span>
  );
}
