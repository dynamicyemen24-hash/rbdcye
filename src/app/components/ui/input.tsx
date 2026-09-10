import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-xl border bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] transition-all duration-200 placeholder:text-[var(--muted-foreground)] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 focus:border-[var(--brand-green)] disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-[var(--destructive)] focus:ring-[var(--destructive)]/20" : "border-[var(--border)]"} ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
