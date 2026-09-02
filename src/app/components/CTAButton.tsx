// Unified CTA Button Component - Professional Design System
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface CTAButtonProps {
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "gold";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps>(
  (
    {
      icon: Icon,
      variant = "primary",
      size = "md",
      children,
      onClick,
      disabled = false,
      type = "button",
      className = "",
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-300";

    const variants = {
      primary: {
        background: "linear-gradient(135deg, var(--brand-green), var(--brand-green-light))",
        color: "white",
        border: "none",
        shadow: "0 4px 14px rgba(26, 92, 72, 0.25)",
        hoverShadow: "0 6px 20px rgba(26, 92, 72, 0.35)",
      },
      secondary: {
        background: "rgba(255, 255, 255, 0.9)",
        color: "var(--brand-green)",
        border: "2px solid var(--brand-green)",
        shadow: "none",
        hoverShadow: "0 4px 12px rgba(26, 92, 72, 0.15)",
      },
      gold: {
        background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-light))",
        color: "white",
        border: "none",
        shadow: "0 4px 14px rgba(200, 134, 30, 0.25)",
        hoverShadow: "0 6px 20px rgba(200, 134, 30, 0.35)",
      },
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const style = variants[variant];

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseStyles} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        style={{
          background: style.background,
          color: style.color,
          border: style.border,
          boxShadow: style.shadow,
          fontFamily: "Cairo, sans-serif",
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = style.hoverShadow;
            e.currentTarget.style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = style.shadow;
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </motion.button>
    );
  }
);

CTAButton.displayName = "CTAButton";
