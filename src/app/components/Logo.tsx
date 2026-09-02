// Campaign Logo Component - High-Quality Visual Identity
import { Heart } from "lucide-react";
import { motion } from "motion/react";

interface LogoProps {
  readonly size?: "sm" | "md" | "lg" | "xl";
  readonly variant?: "navbar" | "hero" | "footer";
  readonly onClick?: () => void;
}

const sizeConfig = {
  sm: { icon: "w-8 h-8", text: "text-lg", container: "gap-2" },
  md: { icon: "w-10 h-10", text: "text-xl", container: "gap-3" },
  lg: { icon: "w-12 h-12", text: "text-2xl", container: "gap-3" },
  xl: { icon: "w-16 h-16", text: "text-3xl", container: "gap-4" },
};

const variantConfig = {
  navbar: {
    iconBg: "bg-[var(--brand-green)]",
    textColor: "text-[var(--brand-green)]",
    subTextColor: "text-[var(--muted-foreground)]",
    subTextSize: "text-sm",
  },
  hero: {
    iconBg: "bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]",
    textColor: "text-white",
    subTextColor: "text-[var(--brand-gold-light)]",
    subTextSize: "text-base",
  },
  footer: {
    iconBg: "bg-[var(--brand-gold)]",
    textColor: "text-white",
    subTextColor: "text-gray-300",
    subTextSize: "text-xs",
  },
};

export function Logo({ size = "md", variant = "navbar", onClick }: LogoProps) {
  const sizes = sizeConfig[size];
  const variants = variantConfig[variant];

  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center ${sizes.container} group relative`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Logo Icon */}
      <div
        className={`${sizes.icon} rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
        style={{
          background:
            variant === "hero"
              ? "linear-gradient(135deg, var(--brand-green), var(--brand-green-light))"
              : undefined,
        }}
      >
        {variant === "hero" && (
          <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm" />
        )}
        <Heart
          className="text-white group-hover:scale-110 transition-transform duration-300"
          fill="currentColor"
          style={{ width: "calc(var(--size) * 0.6)", height: "calc(var(--size) * 0.6)" }}
        />
        {variant === "hero" && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--brand-gold)] rounded-full border-2 border-white" />
        )}
      </div>

      {/* Logo Text */}
      <div className="text-right">
        <div
          className={`${variants.textColor} font-bold leading-tight ${sizes.text}`}
          style={{ fontFamily: "Cairo, sans-serif" }}
        >
          رحماء بينهم
        </div>
        <div
          className={`${variants.subTextColor} ${variants.subTextSize} leading-none mt-0.5`}
          style={{ fontFamily: "Cairo, sans-serif", fontWeight: 400 }}
        >
          rbdcye Foundation
        </div>
      </div>
    </motion.button>
  );
}

interface LogoBadgeProps {
  readonly onClick?: () => void;
}

// Logo Badge - Compact version for small spaces
export function LogoBadge({ onClick }: LogoBadgeProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)] flex items-center justify-center shadow-md">
        <Heart className="w-5 h-5 text-white" fill="currentColor" />
      </div>
      <span
        className="text-[var(--brand-green)] font-bold"
        style={{ fontFamily: "Cairo, sans-serif", fontSize: "1.125rem" }}
      >
        رحماء بينهم
      </span>
    </motion.button>
  );
}

