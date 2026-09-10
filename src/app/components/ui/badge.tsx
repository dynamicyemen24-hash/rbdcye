import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "gold";
  size?: "sm" | "md";
  className?: string;
}

const variants = {
  default: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
  success: "bg-[var(--success)]/10 text-[var(--success)]",
  warning: "bg-[var(--warning)]/10 text-[var(--warning)]",
  danger: "bg-[var(--destructive)]/10 text-[var(--destructive)]",
  info: "bg-[var(--info)]/10 text-[var(--info)]",
  gold: "bg-[var(--brand-gold)]/10 text-[var(--brand-gold-dark)]",
};

const sizes = {
  sm: "px-2 py-0.5 text-[0.65rem]",
  md: "px-3 py-1 text-xs",
};

export function Badge({ children, variant = "default", size = "sm", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
