import { useId } from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showPercent?: boolean;
}

export function ProgressBar({ value, max = 100, size = "md", showPercent = true }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const height = size === "sm" ? 6 : size === "lg" ? 12 : 8;
  const gradientId = useId();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-[var(--muted)]">{value}/{max}</div>
        {showPercent && <div className="text-sm font-semibold">{pct}%</div>}
      </div>
      <svg className="w-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1">
            <stop offset="0%" stopColor="var(--brand-green)" stopOpacity="1" />
            <stop offset="100%" stopColor="#6ee7b7" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height={height} rx={height / 2} fill="rgba(var(--foreground-rgb),0.06)" />
        <rect x="0" y="0" width={`${pct}%`} height={height} rx={height / 2} fill={`url(#${gradientId})`} />
      </svg>
    </div>
  );
}

export default ProgressBar;


