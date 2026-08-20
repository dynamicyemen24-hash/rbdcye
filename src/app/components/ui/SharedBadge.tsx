// Shared Badge Component leveraging Design Tokens
import { forwardRef, HTMLAttributes, ReactNode } from "react";

export interface SharedBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "gold" | "outline" | "subtle";
  size?: "sm" | "md";
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const SharedBadge = forwardRef<HTMLSpanElement, SharedBadgeProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      icon,
      className = "",
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "px-2.5 py-1 text-xs gap-1.5",  // 10px horizontal, 4px vertical
      md: "px-3.5 py-1.5 text-sm gap-2",  // 14px horizontal, 6px vertical
    };

    const variantStyles = {
      primary: "bg-[var(--brand-green)]/10 text-[var(--brand-green)] border border-[var(--brand-green)]/20 font-semibold",
      gold: "bg-[var(--brand-gold)]/15 text-amber-800 dark:text-[var(--brand-gold-light)] border border-[var(--brand-gold)]/30 font-semibold",
      outline: "bg-transparent text-[var(--foreground)] border border-[var(--border)] font-medium",
      subtle: "bg-[var(--muted)] text-[var(--muted-foreground)] font-medium",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full font-medium transition-all ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
    );
  }
);

SharedBadge.displayName = "SharedBadge";

export default SharedBadge;
