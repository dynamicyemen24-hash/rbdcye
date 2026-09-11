import { forwardRef } from "react";

export interface EnterpriseSkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
  animation?: "pulse" | "shimmer" | "none";
  "aria-label"?: string;
}

const variantRadius: Record<NonNullable<EnterpriseSkeletonProps["variant"]>, string> = {
  text: "rounded",
  circular: "rounded-full",
  rectangular: "rounded-none",
  rounded: "rounded-xl",
};

export const EnterpriseSkeleton = forwardRef<HTMLDivElement, EnterpriseSkeletonProps>(
  (
    {
      variant = "rounded",
      width,
      height,
      lines = 1,
      className = "",
      animation = "shimmer",
      "aria-label": ariaLabel = "جاري التحميل",
    },
    ref
  ) => {
    const animationClass =
      animation === "pulse"
        ? "animate-pulse bg-muted"
        : animation === "shimmer"
        ? "skeleton-pulse"
        : "bg-muted";

    const baseClasses = [
      animationClass,
      variantRadius[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (variant === "text" && lines > 1) {
      return (
        <div ref={ref} className="flex flex-col gap-2" role="status" aria-label={ariaLabel}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={baseClasses}
              style={{
                width: i === lines - 1 ? "70%" : typeof width === "number" ? `${width}px` : width || "100%",
                height: typeof height === "number" ? `${height}px` : height || "1em",
              }}
            />
          ))}
          <span className="sr-only">{ariaLabel}</span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={baseClasses}
        role="status"
        aria-label={ariaLabel}
        style={{
          width: typeof width === "number" ? `${width}px` : width || "100%",
          height:
            typeof height === "number"
              ? `${height}px`
              : height || (variant === "text" ? "1em" : "1rem"),
        }}
      >
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  }
);

EnterpriseSkeleton.displayName = "EnterpriseSkeleton";

export interface EnterpriseSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "brand" | "gold" | "white" | "current";
  label?: string;
  className?: string;
}

const spinnerSizes = {
  xs: "w-3.5 h-3.5",
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-10 h-10",
  xl: "w-14 h-14",
};

const spinnerColors = {
  brand: "text-brand-green",
  gold: "text-brand-gold",
  white: "text-white",
  current: "text-current",
};

export function EnterpriseSpinner({
  size = "md",
  color = "brand",
  label = "جاري التحميل",
  className = "",
}: EnterpriseSpinnerProps) {
  return (
    <span role="status" aria-label={label} className={`inline-flex ${className}`}>
      <svg
        className={`animate-spin ${spinnerSizes[size]} ${spinnerColors[color]}`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
        <path
          className="opacity-90"
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export interface EnterpriseProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  variant?: "brand" | "gold" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  striped?: boolean;
  animated?: boolean;
  className?: string;
  "aria-label"?: string;
}

const progressVariants = {
  brand: "bg-brand-green",
  gold: "bg-brand-gold",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const progressSizes = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function EnterpriseProgress({
  value,
  max = 100,
  showLabel = false,
  label,
  variant = "brand",
  size = "md",
  striped = false,
  animated = false,
  className = "",
  "aria-label": ariaLabel,
}: EnterpriseProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {(label || showLabel) && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{label}</span>
          {showLabel && (
            <span className="text-muted-foreground tabular-nums">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel || label}
        className={`w-full overflow-hidden rounded-full bg-muted ${progressSizes[size]}`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out-expo ${progressVariants[variant]} ${
            striped
              ? "bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"
              : ""
          } ${animated ? "animate-[shimmer_1s_linear_infinite]" : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default EnterpriseSkeleton;