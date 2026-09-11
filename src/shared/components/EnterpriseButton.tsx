import { forwardRef, useCallback, useRef, useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type EnterpriseButtonVariant =
  | "primary"
  | "secondary"
  | "gold"
  | "ghost"
  | "danger"
  | "success"
  | "outline"
  | "gradient";

export type EnterpriseButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

export interface EnterpriseButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDragStart" | "onDrag" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop"> {
  variant?: EnterpriseButtonVariant;
  size?: EnterpriseButtonSize;
  icon?: LucideIcon;
  iconPosition?: "start" | "end";
  loading?: boolean;
  loadingText?: string;
  ripple?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

const variantStyles: Record<EnterpriseButtonVariant, {
  base: string;
  hover: string;
  active: string;
  focus: string;
  disabled: string;
  shadow: string;
  hoverShadow: string;
}> = {
  primary: {
    base: "bg-brand-green text-white border-none",
    hover: "bg-brand-green-light",
    active: "bg-brand-green-dark",
    focus: "ring-2 ring-brand-green ring-offset-2 ring-offset-background",
    disabled: "opacity-50 cursor-not-allowed",
    shadow: "shadow-md shadow-brand-green/25",
    hoverShadow: "shadow-lg shadow-brand-green/35",
  },
  secondary: {
    base: "bg-transparent text-brand-green border-2 border-brand-green",
    hover: "bg-brand-green text-white",
    active: "bg-brand-green-dark text-white",
    focus: "ring-2 ring-brand-green ring-offset-2 ring-offset-background",
    disabled: "opacity-50 cursor-not-allowed border-current",
    shadow: "shadow-none",
    hoverShadow: "shadow-md shadow-brand-green/25",
  },
  gold: {
    base: "bg-brand-gold text-white border-none",
    hover: "bg-brand-gold-light",
    active: "bg-brand-gold-dark",
    focus: "ring-2 ring-brand-gold ring-offset-2 ring-offset-background",
    disabled: "opacity-50 cursor-not-allowed",
    shadow: "shadow-md shadow-brand-gold/25",
    hoverShadow: "shadow-lg shadow-brand-gold/35",
  },
  ghost: {
    base: "bg-transparent text-brand-green border-none",
    hover: "bg-brand-green-pale",
    active: "bg-brand-green-pale/80",
    focus: "ring-2 ring-brand-green ring-offset-2 ring-offset-background",
    disabled: "opacity-50 cursor-not-allowed",
    shadow: "shadow-none",
    hoverShadow: "shadow-none",
  },
  danger: {
    base: "bg-danger text-white border-none",
    hover: "bg-red-700",
    active: "bg-red-800",
    focus: "ring-2 ring-danger ring-offset-2 ring-offset-background",
    disabled: "opacity-50 cursor-not-allowed",
    shadow: "shadow-md shadow-danger/25",
    hoverShadow: "shadow-lg shadow-danger/35",
  },
  success: {
    base: "bg-success text-white border-none",
    hover: "bg-emerald-700",
    active: "bg-emerald-800",
    focus: "ring-2 ring-success ring-offset-2 ring-offset-background",
    disabled: "opacity-50 cursor-not-allowed",
    shadow: "shadow-md shadow-success/25",
    hoverShadow: "shadow-lg shadow-success/35",
  },
  outline: {
    base: "bg-transparent text-foreground border-2 border-border",
    hover: "bg-muted",
    active: "bg-muted/80",
    focus: "ring-2 ring-ring ring-offset-2 ring-offset-background",
    disabled: "opacity-50 cursor-not-allowed",
    shadow: "shadow-none",
    hoverShadow: "shadow-sm",
  },
  gradient: {
    base: "bg-gradient-brand text-white border-none",
    hover: "bg-gradient-brand-gold",
    active: "bg-gradient-brand-gold",
    focus: "ring-2 ring-brand-green ring-offset-2 ring-offset-background",
    disabled: "opacity-50 cursor-not-allowed",
    shadow: "shadow-md shadow-brand-green/30",
    hoverShadow: "shadow-lg shadow-brand-gold/40",
  },
};

const sizeStyles: Record<EnterpriseButtonSize, {
  padding: string;
  text: string;
  icon: string;
  gap: string;
  height: string;
  minWidth: string;
}> = {
  xs: {
    padding: "px-2.5 py-1.5",
    text: "text-xs",
    icon: "w-3.5 h-3.5",
    gap: "gap-1.5",
    height: "h-7",
    minWidth: "min-w-[2rem]",
  },
  sm: {
    padding: "px-3 py-2",
    text: "text-sm",
    icon: "w-4 h-4",
    gap: "gap-2",
    height: "h-9",
    minWidth: "min-w-[2.5rem]",
  },
  md: {
    padding: "px-5 py-2.5",
    text: "text-base",
    icon: "w-5 h-5",
    gap: "gap-2",
    height: "h-11",
    minWidth: "min-w-[3rem]",
  },
  lg: {
    padding: "px-6 py-3",
    text: "text-lg",
    icon: "w-5 h-5",
    gap: "gap-2.5",
    height: "h-12",
    minWidth: "min-w-[3.5rem]",
  },
  xl: {
    padding: "px-8 py-4",
    text: "text-xl",
    icon: "w-6 h-6",
    gap: "gap-3",
    height: "h-14",
    minWidth: "min-w-[4rem]",
  },
  icon: {
    padding: "p-2.5",
    text: "text-base",
    icon: "w-5 h-5",
    gap: "gap-0",
    height: "h-11",
    minWidth: "w-11",
  },
};

const COMMON_BASE = `
  inline-flex items-center justify-center font-semibold
  rounded-xl transition-all duration-200 ease-out-expo
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  active:scale-[0.98]
  select-none
  touch-manipulation
`.trim();

export const EnterpriseButton = forwardRef<HTMLButtonElement, EnterpriseButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "start",
      loading = false,
      loadingText = "جاري التحميل...",
      ripple = true,
      fullWidth = false,
      children,
      className = "",
      disabled,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      onClick,
      type = "button",
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const mountedRef = useRef(true);
    const rippleIdRef = useRef(0);
    const isHoveredRef = useRef(false);

    useEffect(() => {
      mountedRef.current = true;
      return () => { mountedRef.current = false; };
    }, []);

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      if (ripple && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = ++rippleIdRef.current;

        if (mountedRef.current) {
          setRipples(prev => [...prev, { x, y, id }]);
        }
      }

      onClick?.(e);
    }, [disabled, loading, onClick, ripple]);

    const handleMouseEnter = useCallback(() => {
      isHoveredRef.current = true;
    }, []);

    const handleMouseLeave = useCallback(() => {
      isHoveredRef.current = false;
    }, []);

    const handleAnimationEnd = useCallback((id: number) => {
      if (mountedRef.current) {
        setRipples(prev => prev.filter(r => r.id !== id));
      }
    }, []);

    const style = variantStyles[variant];
    const sizeConfig = sizeStyles[size];
    const isIconOnly = size === "icon" && !children;

    const baseClasses = [
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      COMMON_BASE,
      style.base,
      style.shadow,
      isHoveredRef.current && !disabled && !loading ? style.hoverShadow : "",
      sizeConfig.padding,
      sizeConfig.text,
      sizeConfig.gap,
      sizeConfig.height,
      sizeConfig.minWidth,
      fullWidth ? "w-full" : "",
      className,
    ].filter(Boolean).join(" ");

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        style={{
          fontFamily: "var(--font-ar)",
          position: "relative",
          overflow: "hidden",
        }}
        {...props}
      >
        <AnimatePresence>
          {ripples.map(({ x, y, id }) => (
            <motion.div
              key={id}
              className="absolute pointer-events-none rounded-full"
              style={{
                width: 0,
                height: 0,
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                backgroundColor: variant === "secondary" || variant === "ghost" || variant === "outline"
                  ? "currentColor"
                  : "rgba(255,255,255,0.5)",
              }}
              initial={{ scale: 0, opacity: 0.4 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onAnimationComplete={() => handleAnimationEnd(id)}
            />
          ))}
        </AnimatePresence>

        {loading ? (
          <>
            <motion.span
              className="inline-flex items-center gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="animate-spin"
                width={size === "xs" ? 14 : size === "sm" ? 16 : size === "md" ? 18 : 20}
                height={size === "xs" ? 14 : size === "sm" ? 16 : size === "md" ? 18 : 20}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  className="text-current/30"
                  cx="12" cy="12" r="10"
                  strokeWidth="3"
                />
                <path
                  className="text-current"
                  d="M12 2C12 2 12 2 12 2"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
              <span>{loadingText}</span>
            </motion.span>
          </>
        ) : (
          <>
            {Icon && iconPosition === "start" && (
              <span aria-hidden="true" className={sizeConfig.icon}><Icon /></span>
            )}
            <span className="truncate">{children}</span>
            {Icon && iconPosition === "end" && (
              <span aria-hidden="true" className={sizeConfig.icon}><Icon /></span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);

EnterpriseButton.displayName = "EnterpriseButton";

export default EnterpriseButton;