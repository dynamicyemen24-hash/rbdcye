import { motion } from "motion/react";
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const variants = {
  primary: "bg-[var(--brand-green)] text-white shadow-[var(--shadow-md)] hover:bg-[var(--brand-green-light)] hover:shadow-[var(--shadow-glow)]",
  secondary: "bg-[var(--brand-gold)] text-white shadow-[var(--shadow-md)] hover:bg-[var(--brand-gold-light)] hover:shadow-[var(--shadow-glow-gold)]",
  outline: "border-2 border-[var(--brand-green)]/20 text-[var(--brand-green)] hover:bg-[var(--brand-green)]/5 hover:border-[var(--brand-green)]/40",
  ghost: "text-[var(--brand-green)] hover:bg-[var(--brand-green)]/5",
  danger: "bg-[var(--destructive)] text-white shadow-[var(--shadow-md)] hover:opacity-90",
  gold: "bg-[var(--brand-gold)] text-[var(--brand-green-dark)] shadow-[var(--shadow-md)] hover:bg-[var(--brand-gold-light)]",
};

export function buttonVariants(options?: { variant?: keyof typeof variants; size?: string }): string {
  const variant = options?.variant ?? "primary";
  return variants[variant];
}

const sizes = {
  sm: "px-4 py-2 text-xs rounded-lg min-h-[36px]",
  md: "px-6 py-3 text-sm rounded-xl min-h-[44px]",
  lg: "px-8 py-4 text-base rounded-2xl min-h-[52px]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  icon,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { y: -2, scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}
