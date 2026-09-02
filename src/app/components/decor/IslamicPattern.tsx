// Islamic Geometric Pattern Components - مكونات الزخارف الإسلامية
// أنماط SVG متجهة دقيقة قابلة للتلوين عبر currentColor
import { useId } from "react";

export type PatternVariant = "khatam" | "zellij" | "arabesque";

const TILE_SIZE: Record<PatternVariant, { w: number; h: number }> = {
  khatam: { w: 96, h: 96 },
  zellij: { w: 64, h: 64 },
  arabesque: { w: 120, h: 60 },
};

function TileContent({ variant }: { variant: PatternVariant }) {
  if (variant === "khatam") {
    return (
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="27" y="27" width="42" height="42" />
        <rect x="27" y="27" width="42" height="42" transform="rotate(45 48 48)" />
        <circle cx="48" cy="48" r="2.5" />
        <path d="M0 -6 L6 0 L0 6 L-6 0 Z" />
        <path d="M96 -6 L102 0 L96 6 L90 0 Z" />
        <path d="M0 90 L6 96 L0 102 L-6 96 Z" />
        <path d="M96 90 L102 96 L96 102 L90 96 Z" />
      </g>
    );
  }
  if (variant === "zellij") {
    return (
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M32 0 L64 32 L32 64 L0 32 Z" />
        <path d="M0 0 L64 64 M64 0 L0 64" />
        <circle cx="32" cy="32" r="2" fill="currentColor" stroke="none" opacity="0.6" />
      </g>
    );
  }
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M0 30 Q15 10 30 30 Q45 50 60 30 Q75 10 90 30 Q105 50 120 30" />
      <path d="M-30 55 Q-15 35 0 55 Q15 75 30 55 Q45 35 60 55 Q75 75 90 55 Q105 35 120 55 Q135 75 150 55" />
      <circle cx="30" cy="30" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="90" cy="30" r="1.5" fill="currentColor" stroke="none" />
    </g>
  );
}

interface IslamicPatternProps {
  variant?: PatternVariant;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * خلفية زخرفية إسلامية تغطي الحاوية الأب (absolute inset-0)
 * استخدمها داخل عنصر relative مع ضبط اللون عبر style={{ color }}
 */
export function IslamicPattern({ variant = "khatam", className = "", style }: IslamicPatternProps) {
  const id = useId().replace(/[:]/g, "");
  const size = TILE_SIZE[variant];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={style}
    >
      <defs>
        <pattern id={`ip-${id}`} width={size.w} height={size.h} patternUnits="userSpaceOnUse">
          <TileContent variant={variant} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#ip-${id})`} />
    </svg>
  );
}

/**
 * فاصل زخرفي أفقي: خط — معينة — نجمة ثمانية — معينة — خط
 */
export function IslamicDivider({ className = "", tone = "gold" }: { className?: string; tone?: "gold" | "green" }) {
  const color = tone === "gold" ? "var(--brand-gold)" : "var(--brand-green)";
  const soft = tone === "gold" ? "var(--brand-gold-light)" : "var(--brand-green-light)";

  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`} dir="ltr">
      <span className="h-px flex-1 max-w-[140px]" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1 L13 7 L7 13 L1 7 Z" stroke={soft} strokeWidth="1.2" />
      </svg>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="6.5" y="6.5" width="13" height="13" stroke={color} strokeWidth="1.3" />
        <rect x="6.5" y="6.5" width="13" height="13" transform="rotate(45 13 13)" stroke={color} strokeWidth="1.3" />
        <circle cx="13" cy="13" r="1.4" fill={color} />
      </svg>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1 L13 7 L7 13 L1 7 Z" stroke={soft} strokeWidth="1.2" />
      </svg>
      <span className="h-px flex-1 max-w-[140px]" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
    </div>
  );
}

/**
 * ميدالية نجمية ثمانية تحيط بمحتوى (أيقونة/رقم) — للإحصاءات والشارات
 */
export function StarMedallion({
  children,
  size = 72,
  color = "var(--brand-gold)",
  className = "",
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 80 80"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect x="17" y="17" width="46" height="46" rx="4" stroke={color} strokeWidth="1.4" />
        <rect x="17" y="17" width="46" height="46" rx="4" transform="rotate(45 40 40)" stroke={color} strokeWidth="1.4" />
        <circle cx="40" cy="40" r="31" stroke={color} strokeWidth="1" strokeDasharray="2 3.5" opacity="0.65" />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}


