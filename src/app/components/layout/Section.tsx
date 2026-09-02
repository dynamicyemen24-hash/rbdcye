// Unified Section Layout System - نظام الأقسام الموحد
// يفرض إيقاعاً بصرياً ثابتاً: مسافات متسقة + تناوب خلفيات محسوب
import { motion } from "motion/react";

import { IslamicPattern, IslamicDivider, StarMedallion } from "@/app/components/decor/IslamicPattern";
import type { LucideIcon } from "lucide-react";

export type SectionTone = "white" | "pale" | "cream" | "dark" | "gradient";

const TONE_STYLES: Record<SectionTone, { style: React.CSSProperties; className?: string }> = {
  white: {
    style: { background: "var(--background)" },
  },
  pale: {
    style: {
      background: "linear-gradient(180deg, var(--background) 0%, var(--brand-green-pale) 55%, var(--background) 100%)",
    },
  },
  cream: {
    style: {
      background: "linear-gradient(180deg, var(--background) 0%, var(--brand-gold-pale) 60%, var(--background) 100%)",
    },
  },
  dark: {
    style: {
      background: "linear-gradient(180deg, var(--brand-green-dark) 0%, var(--brand-green) 100%)",
    },
    className: "text-white",
  },
  gradient: {
    style: {},
    className: "section-bg-gradient",
  },
};

interface SectionProps {
  tone?: SectionTone;
  /** زخرفة خلفية اختيارية تغطي القسم */
  pattern?: "khatam" | "zellij" | "arabesque" | false;
  /** شريط ذهبي علوي/سفلي للأقسام الداكنة */
  goldBands?: boolean;
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

export function Section({
  tone = "white",
  pattern = false,
  goldBands = false,
  id,
  className = "",
  containerClassName = "",
  children,
}: SectionProps) {
  const toneCfg = TONE_STYLES[tone];
  const isDark = tone === "dark";

  return (
    <section
      id={id}
      dir="rtl"
      className={`relative py-24 md:py-32 overflow-hidden ${toneCfg.className ?? ""} ${isDark ? "text-white" : ""} ${className}`}
      style={toneCfg.style}
    >
      {/* الزخرفة الخلفية */}
      {pattern && (
        <IslamicPattern
          variant={pattern}
          style={{
            color: isDark ? "var(--brand-gold)" : "var(--brand-green)",
            opacity: isDark ? 0.07 : 0.05,
          }}
        />
      )}
      {goldBands && (
        <>
          <div className="absolute top-0 inset-x-0 h-1.5 pattern-band-gold pointer-events-none z-10" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 pattern-band-gold pointer-events-none z-10" />
        </>
      )}

      <div className={`relative z-10 section-container ${containerClassName}`}>{children}</div>
    </section>
  );
}

// ─── ترويسة قسم موحّدة: شارة + عنوان + فاصل + وصف ──────────
interface SectionHeaderProps {
  badge: string;
  badgeIcon?: LucideIcon;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "center" | "right";
  dark?: boolean;
  className?: string;
}

export function SectionHeader({
  badge,
  badgeIcon: BadgeIcon,
  title,
  highlight,
  subtitle,
  align = "center",
  dark = false,
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`${isCenter ? "mx-auto text-center" : ""} max-w-3xl mb-16 md:mb-20 ${className}`}
    >
      <span
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
        style={
          dark
            ? {
                color: "var(--brand-gold-light)",
                background: "rgba(var(--brand-gold-rgb),0.14)",
                border: "1px solid rgba(var(--brand-gold-rgb),0.35)",
              }
            : {
                color: "var(--brand-gold)",
                background: "rgba(var(--brand-gold-rgb),0.1)",
                border: "1px solid rgba(var(--brand-gold-rgb),0.25)",
              }
        }
      >
        {BadgeIcon && <BadgeIcon className="w-4 h-4" />}
        {badge}
      </span>

      <h2
        className="mb-5"
        style={{
          fontSize: "var(--fs-h2)",
          fontWeight: 800,
          lineHeight: "var(--lh-heading)",
          color: dark ? "var(--white)" : "var(--foreground)",
        }}
      >
        {title}{" "}
        {highlight && (
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: dark
                ? "linear-gradient(135deg, var(--brand-gold-light), var(--brand-gold))"
                : "linear-gradient(135deg, var(--brand-green), var(--brand-green-light))",
            }}
          >
            {highlight}
          </span>
        )}
      </h2>

      <IslamicDivider tone={dark ? "gold" : "gold"} className="mb-5" />

      {subtitle && (
        <p
          className={isCenter ? "mx-auto" : ""}
          style={{
            fontSize: "var(--fs-lead)",
            lineHeight: "var(--lh-body)",
            color: dark ? "rgba(255,255,255,0.75)" : "var(--muted-foreground)",
            maxWidth: "60ch",
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ─── درز زخرفي بين الأقسام: خط ذهبي + ميدالية نجمية ────────
export function SectionSeam() {
  return (
    <div dir="rtl" aria-hidden="true" className="relative h-20 flex items-center justify-center overflow-hidden" style={{ background: "var(--background)" }}>
      <div
        className="absolute inset-x-0 top-1/2 h-px"
        style={{ background: "linear-gradient(to left, transparent, rgba(var(--brand-gold-rgb),0.55), transparent)" }}
      />
      <div className="relative flex items-center justify-center px-5" style={{ background: "var(--background)" }}>
        <StarMedallion size={52} color="var(--brand-gold)">
          <span className="block w-2.5 h-2.5 rotate-45" style={{ background: "var(--brand-gold)" }} />
        </StarMedallion>
      </div>
    </div>
  );
}


