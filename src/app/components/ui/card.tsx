import { motion } from "motion/react";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined" | "glass";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const variantMap = {
  default: "bg-[var(--card)] border border-[var(--border)] rounded-2xl",
  elevated: "bg-[var(--card)] shadow-lg border border-[var(--border)] rounded-2xl",
  outlined: "bg-transparent border-2 border-[var(--border)] rounded-2xl",
  glass: "bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl dark:bg-zinc-900/70 dark:border-white/10",
};

export function Card({
  children,
  variant = "default",
  hover = false,
  padding = "md",
  className = "",
}: CardProps) {
  const Component = hover ? motion.div : "div";
  const hoverProps = hover
    ? {
        whileHover: { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={`${variantMap[variant]} ${paddingMap[padding]} transition-all duration-300 ${className}`}
      {...hoverProps}
    >
      {children}
    </Component>
  );
}
