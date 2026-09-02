// Shared Button Component leveraging Design Tokens (4px Scale)
import { forwardRef, ReactNode } from "react";
import { motion, HTMLMotionProps } from "motion/react";

export interface SharedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  radius?: "md" | "lg" | "xl" | "full";
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  children: ReactNode;
  className?: string;
}

export const SharedButton = forwardRef<HTMLButtonElement, SharedButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      radius = "lg",
      icon,
      iconPosition = "start",
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Design Tokens Padding & Gap Scale
    const sizeStyles = {
      sm: "px-4 py-2 text-xs gap-2 min-h-[36px]", // 16px horizontal, 8px vertical
      md: "px-6 py-3 text-sm font-semibold gap-2.5 min-h-[44px]", // 24px horizontal, 12px vertical
      lg: "px-8 py-4 text-base font-bold gap-3 min-h-[52px]", // 32px horizontal, 16px vertical
    };

    const radiusStyles = {
      md: "rounded-lg", // 8px
      lg: "rounded-xl", // 12px
      xl: "rounded-2xl", // 16px
      full: "rounded-full",
    };

    const variantStyles = {
      primary:
        "bg-[var(--brand-green)] hover:bg-[var(--brand-green-light)] text-white shadow-md hover:shadow-lg active:scale-[0.98]",
      secondary:
        "bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] active:scale-[0.98]",
      gold: "bg-[var(--brand-gold)] hover:bg-[var(--brand-gold-light)] text-gray-900 font-bold shadow-md hover:shadow-lg active:scale-[0.98]",
      outline:
        "border-2 border-[var(--brand-green)] text-[var(--brand-green)] hover:bg-[var(--brand-green)] hover:text-white transition-all active:scale-[0.98]",
      ghost:
        "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-[var(--foreground)] active:scale-[0.98]",
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        whileHover={disabled ? undefined : { y: -1 }}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${sizeStyles[size]} ${radiusStyles[radius]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {icon && iconPosition === "start" && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === "end" && <span className="shrink-0">{icon}</span>}
      </motion.button>
    );
  }
);

SharedButton.displayName = "SharedButton";

export default SharedButton;
