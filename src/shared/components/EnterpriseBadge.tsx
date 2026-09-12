import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

export type EnterpriseBadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "gold"
  | "outline";

export type EnterpriseBadgeSize = "sm" | "md" | "lg";

export interface EnterpriseBadgeProps {
  children: React.ReactNode;
  variant?: EnterpriseBadgeVariant;
  size?: EnterpriseBadgeSize;
  icon?: LucideIcon;
  dot?: boolean;
  pulse?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  "aria-label"?: string;
}

const variantStyles: Record<EnterpriseBadgeVariant, string> = {
  default: "bg-muted text-muted-foreground border-transparent",
  primary: "bg-brand-green text-white border-transparent",
  secondary: "bg-brand-green-pale text-brand-green border-transparent",
  success: "bg-success/15 text-success border-transparent",
  warning: "bg-warning/15 text-warning border-transparent",
  danger: "bg-danger/15 text-danger border-transparent",
  info: "bg-info/15 text-info border-transparent",
  gold: "bg-brand-gold text-white border-transparent",
  outline: "bg-transparent text-foreground border-border",
};

const sizeStyles: Record<EnterpriseBadgeSize, string> = {
  sm: "px-2 py-0.5 text-[0.65rem] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-2",
};

export const EnterpriseBadge = forwardRef<HTMLSpanElement, EnterpriseBadgeProps>(
  (
    {
      children,
      variant = "default",
      size = "md",
      icon: Icon,
      dot = false,
      pulse = false,
      removable = false,
      onRemove,
      className = "",
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const classes = [
      "inline-flex items-center justify-center rounded-full font-semibold border",
      variantStyles[variant],
      sizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} aria-label={ariaLabel}>
        {dot && (
          <span className="relative flex h-2 w-2" aria-hidden="true">
            {pulse && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
          </span>
        )}
        {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
        <span className="truncate">{children}</span>
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="ms-0.5 -me-0.5 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="إزالة"
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

EnterpriseBadge.displayName = "EnterpriseBadge";

export default EnterpriseBadge;