import { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { forwardRef, useState, useCallback, useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";

export type EnterpriseCardVariant =
  | "default"
  | "elevated"
  | "outlined"
  | "glass"
  | "glass-premium"
  | "gradient"
  | "interactive";

export type EnterpriseCardSize = "sm" | "md" | "lg" | "xl";

export interface EnterpriseCardProps {
  variant?: EnterpriseCardVariant;
  size?: EnterpriseCardSize;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  role?: "article" | "region" | "group";
  image?: {
    src: string;
    alt: string;
    position?: "top" | "background";
    aspectRatio?: "16:9" | "4:3" | "1:1" | "3:4";
  };
  header?: React.ReactNode;
  footer?: React.ReactNode;
  badge?: React.ReactNode;
  glow?: "none" | "green" | "gold" | "auto";
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  border?: boolean;
  transition?: "fast" | "normal" | "slow" | "spring";
}

const variantBaseStyles: Record<EnterpriseCardVariant, string> = {
  default: "bg-card text-card-foreground",
  elevated: "bg-card text-card-foreground shadow-lg",
  outlined: "bg-transparent text-foreground border-2 border-border",
  glass: "bg-white/5 backdrop-blur-xl border border-white/10",
  "glass-premium": "bg-white/7 backdrop-blur-2xl backdrop-saturate-150 border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]",
  gradient: "bg-gradient-brand text-white",
  interactive: "bg-card text-card-foreground cursor-pointer",
};

const variantHoverStyles: Record<EnterpriseCardVariant, string> = {
  default: "hover:shadow-lg hover:border-border/50",
  elevated: "hover:shadow-xl hover:-translate-y-1",
  outlined: "hover:border-brand-green/50 hover:bg-brand-green-pale/30",
  glass: "hover:bg-white/10 hover:border-white/20 hover:shadow-glow",
  "glass-premium": "hover:bg-white/12 hover:border-white/25 hover:shadow-glow-strong",
  gradient: "hover:shadow-glow-gold hover:-translate-y-1",
  interactive: "hover:shadow-lg hover:-translate-y-1 hover:border-brand-green/30",
};

const variantFocusStyles: Record<EnterpriseCardVariant, string> = {
  default: "focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
  elevated: "focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
  outlined: "focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
  glass: "focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
  "glass-premium": "focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
  gradient: "focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
  interactive: "focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
};

const sizeStyles: Record<EnterpriseCardSize, { padding: string; radius: string; gap: string }> = {
  sm: { padding: "p-4", radius: "rounded-xl", gap: "gap-3" },
  md: { padding: "p-5", radius: "rounded-xl", gap: "gap-4" },
  lg: { padding: "p-6", radius: "rounded-2xl", gap: "gap-5" },
  xl: { padding: "p-8", radius: "rounded-3xl", gap: "gap-6" },
};

const shadowStyles = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
};

const glowStyles = {
  none: "",
  green: "shadow-glow",
  gold: "shadow-glow-gold",
  auto: "",
};

const transitionStyles = {
  fast: "transition-all duration-150 ease-out-expo",
  normal: "transition-all duration-250 ease-out-expo",
  slow: "transition-all duration-400 ease-out-quart",
  spring: "transition-all duration-500 ease-spring",
};

const COMMON_BASE = `
  relative overflow-hidden
  focus-visible:outline-none
  select-none
`.trim();

export const EnterpriseCard = forwardRef<HTMLDivElement, EnterpriseCardProps>(
  (
    {
      variant = "default",
      size = "md",
      children,
      className = "",
      hoverable = true,
      clickable = false,
      onClick,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      role = "article",
      image,
      header,
      footer,
      badge,
      glow = "auto",
      shadow = "md",
      border = false,
      transition = "normal",
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- precise: @typescript-eslint/no-unused-vars — verified safe
    const [isFocused, setIsFocused] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cardRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    const handleMouseEnter = useCallback(() => {
      if (hoverable && !clickable) setIsHovered(true);
    }, [hoverable, clickable]);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
    }, []);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (clickable && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick?.();
      }
    }, [clickable, onClick]);

    const baseVariant = variantBaseStyles[variant];
    const hoverVariant = hoverable ? variantHoverStyles[variant] : "";
    const focusVariant = clickable || hoverable ? variantFocusStyles[variant] : "";
    const sizeStyle = sizeStyles[size];
    const shadowStyle = shadowStyles[shadow];
    const glowStyle = glow !== "auto" ? glowStyles[glow] : "";
    const transitionStyle = prefersReducedMotion ? "" : transitionStyles[transition];

    const autoGlowClass = (() => {
      if (glow !== "auto") return "";
      if (variant === "glass" || variant === "glass-premium" || variant === "interactive") {
        return isHovered ? "shadow-glow" : "";
      }
      if (variant === "gradient") {
        return isHovered ? "shadow-glow-gold" : "";
      }
      return "";
    })();

    const combinedClasses = [
      COMMON_BASE,
      baseVariant,
      hoverVariant,
      focusVariant,
      sizeStyle.padding,
      sizeStyle.radius,
      sizeStyle.gap,
      shadowStyle,
      glowStyle,
      autoGlowClass,
      transitionStyle,
      border ? "border-border" : "",
      clickable ? "cursor-pointer" : "",
      className,
    ].filter(Boolean).join(" ");

    const renderImage = () => {
      if (!image) return null;
      const aspectRatioClass = {
        "16:9": "aspect-video",
        "4:3": "aspect-[4/3]",
        "1:1": "aspect-square",
        "3:4": "aspect-[3/4]",
      }[image.aspectRatio || "16:9"];

      return (
        <div className={`relative overflow-hidden ${sizeStyle.radius} ${aspectRatioClass}`}>
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover transition-transform duration-700 ease-out-expo hover:scale-105"
            loading="lazy"
          />
          {badge && (
            <div className="absolute top-3 right-3 z-10">{badge}</div>
          )}
        </div>
      );
    };

    const renderContent = () => (
      <div className="flex flex-col gap-4">
        {header && <div className="flex items-start justify-between gap-4">{header}</div>}
        <div className="flex-1">{children}</div>
        {footer && <div className="pt-2 border-t border-border/50">{footer}</div>}
      </div>
    );

    // Forward ref only for div, not for button
    useEffect(() => {
      if (ref && !clickable) {
        if (typeof ref === 'function') {
          ref(cardRef.current);
        } else {
          ref.current = cardRef.current;
        }
      }
    }, [ref, clickable]);

    if (clickable) {
      return (
        <button
          ref={buttonRef}
          type="button"
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={combinedClasses}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          tabIndex={0}
          style={{ fontFamily: "var(--font-ar)" }}
        >
          {image?.position === "background" && image && (
            <div className="absolute inset-0 z-0" aria-hidden="true">
              <img
                src={image.src}
                alt=""
                className="w-full h-full object-cover transition-opacity duration-500"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          )}

          <div className="relative z-10 flex flex-col">
            {image?.position !== "background" && renderImage()}
            {renderContent()}
          </div>

          <AnimatePresence>
            {isHovered && hoverable && variant !== "outlined" && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-green/5 via-transparent to-brand-gold/5 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 300 }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
        </button>
      );
    }

    return (
      <div
        ref={cardRef}
        role={role}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={combinedClasses}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        style={{ fontFamily: "var(--font-ar)" }}
        {...props}
      >
        {image?.position === "background" && image && (
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <img
              src={image.src}
              alt=""
              className="w-full h-full object-cover transition-opacity duration-500"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        )}

        <div className="relative z-10 flex flex-col">
          {image?.position !== "background" && renderImage()}
          {renderContent()}
        </div>

        <AnimatePresence>
          {isHovered && hoverable && variant !== "outlined" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-brand-green/5 via-transparent to-brand-gold/5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 300 }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
);

EnterpriseCard.displayName = "EnterpriseCard";

export interface EnterpriseCardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export const EnterpriseCardHeader = ({
  title,
  subtitle,
  icon: Icon,
  action,
  className = "",
}: EnterpriseCardHeaderProps) => (
  <div className={`flex items-start justify-between gap-4 ${className}`}>
    <div className="flex items-start gap-3 flex-1 min-w-0">
      {Icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-green-pale text-brand-green flex items-center justify-center">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-foreground truncate">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

EnterpriseCardHeader.displayName = "EnterpriseCardHeader";

export interface EnterpriseCardFooterProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

export const EnterpriseCardFooter = ({
  children,
  className = "",
  divider = true,
}: EnterpriseCardFooterProps) => (
  <div className={`flex items-center justify-between gap-4 ${divider ? "pt-4 border-t border-border/50" : ""} ${className}`}>
    {children}
  </div>
);

EnterpriseCardFooter.displayName = "EnterpriseCardFooter";

export default EnterpriseCard;