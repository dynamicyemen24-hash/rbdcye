// Shared Card Component leveraging Design Tokens
import React, { forwardRef, HTMLAttributes, ReactNode } from "react";

export interface SharedCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "glass" | "bordered";
  padding?: "sm" | "md" | "lg" | "none";
  radius?: "sm" | "md" | "lg" | "xl" | "full";
  children: ReactNode;
  className?: string;
}

export const SharedCard = forwardRef<HTMLDivElement, SharedCardProps>(
  (
    {
      variant = "default",
      padding = "md",
      radius = "lg",
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    // Design Tokens mapping for padding (4px scale)
    const paddingMap = {
      none: "p-0",
      sm: "p-4", // 16px (--space-4)
      md: "p-6", // 24px (--space-6)
      lg: "p-8", // 32px (--space-8)
    };

    // Border radius design tokens
    const radiusMap = {
      sm: "rounded-lg",   // 8px
      md: "rounded-xl",   // 12px
      lg: "rounded-2xl",  // 16px
      xl: "rounded-3xl",  // 24px
      full: "rounded-full",
    };

    const variantStyles = {
      default: "bg-white dark:bg-slate-900 border border-[var(--border)] shadow-sm text-[var(--foreground)]",
      interactive:
        "bg-white dark:bg-slate-900 border border-[var(--border)] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[var(--foreground)] cursor-pointer",
      glass:
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-800 shadow-md text-[var(--foreground)]",
      bordered:
        "bg-transparent border-2 border-[var(--brand-green)]/20 dark:border-[var(--brand-green)]/40 text-[var(--foreground)]",
    };

    return (
      <div
        ref={ref}
        className={`flex flex-col gap-4 ${paddingMap[padding]} ${radiusMap[radius]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SharedCard.displayName = "SharedCard";

export default SharedCard;
