import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-xl border bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] transition-all duration-200 placeholder:text-[var(--muted-foreground)] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20 focus:border-[var(--brand-green)] disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-y ${error ? "border-[var(--destructive)]" : "border-[var(--border)]"} ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
