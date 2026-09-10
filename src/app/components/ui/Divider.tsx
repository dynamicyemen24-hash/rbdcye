interface DividerProps {
  variant?: "default" | "gold" | "gradient";
  className?: string;
}

export function Divider({ variant = "default", className = "" }: DividerProps) {
  const variants = {
    default: "h-px bg-[var(--border)]",
    gold: "h-0.5 bg-gradient-to-r from-transparent via-[var(--brand-gold)] to-transparent",
    gradient: "h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent",
  };

  return <div className={`${variants[variant]} ${className}`} role="separator" />;
}
