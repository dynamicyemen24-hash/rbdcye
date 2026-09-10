import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full rounded-xl border bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 focus:border-[var(--brand-green)] disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${error ? "border-[var(--destructive)]" : "border-[var(--border)]"} ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
