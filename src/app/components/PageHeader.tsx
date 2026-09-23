// Unified Page Header Component - Professional Design System
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

import { IslamicPattern, IslamicDivider } from "@/app/components/decor/IslamicPattern";

interface PageHeaderProps {
  icon: LucideIcon;
  badge: string;
  title: string;
  subtitle: string;
  align?: "center" | "right";
  children?: React.ReactNode;
}

export type { PageHeaderProps };

export function PageHeader({
  icon: Icon,
  badge,
  title,
  subtitle,
  align = "center",
  children,
}: PageHeaderProps) {
  const isCenter = align === "center";

  return (
    <section
      className="relative overflow-hidden bg-[var(--background)] bg-gradient-to-b from-[rgba(var(--brand-green-rgb),0.06)] to-white pb-14 pt-[calc(var(--header-offset)+2.5rem)] sm:pb-20 sm:pt-[calc(var(--header-offset)+3.5rem)]"
      aria-labelledby="page-header-title"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <IslamicPattern variant="khatam" style={{ color: "var(--brand-green)", opacity: 0.05 }} />
        <IslamicPattern
          variant="arabesque"
          style={{
            color: "var(--brand-gold)",
            opacity: 0.06,
            maskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, var(--brand-green) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, var(--brand-gold) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`max-w-4xl ${isCenter ? "mx-auto text-center" : "ml-auto"}`}
        >
          {/* Unified Badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 shadow-md bg-white/90 backdrop-blur-[10px] border border-[rgba(var(--brand-green-rgb),0.12)]"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]"
            >
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-sm font-semibold text-[var(--brand-green)]"
            >
              {badge}
            </span>
          </div>

          {/* Title with consistent typography */}
          <h1
            id="page-header-title"
            className="mb-6 max-w-3xl text-[clamp(2.15rem,5vw,var(--fs-h1))] font-extrabold leading-[var(--lh-heading)] text-[var(--foreground)]"
          >
            {title}
          </h1>

          <IslamicDivider tone="gold" className={`mb-6 ${isCenter ? "" : "mr-0"}`} />

          {/* Subtitle with consistent styling */}
          <p
            className="max-w-3xl leading-[1.8] text-[clamp(1rem,1.8vw,1.15rem)] text-[var(--muted-foreground)]"
          >
            {subtitle}
          </p>

          {/* Optional custom content (stats, CTA, etc.) */}
          {children}
        </motion.div>
      </div>
    </section>
  );
}
