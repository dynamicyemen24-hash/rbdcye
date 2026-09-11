import { forwardRef, useState, useCallback, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LucideIcon } from "lucide-react";
import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";

export type EnterpriseInputSize = "sm" | "md" | "lg";
export type EnterpriseInputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "datetime-local"
  | "month"
  | "week"
  | "time"
  | "textarea";

export interface EnterpriseInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "onChange"> {
  type?: EnterpriseInputType;
  size?: EnterpriseInputSize;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  warning?: string;
  success?: string;
  icon?: LucideIcon;
  iconPosition?: "start" | "end";
  iconClickable?: boolean;
  onIconClick?: () => void;
  fullWidth?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  mask?: string;
  maskPlaceholder?: string;
  autoComplete?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-errormessage"?: string;
  "aria-invalid"?: boolean;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const sizeStyles: Record<EnterpriseInputSize, {
  wrapper: string;
  label: string;
  input: string;
  icon: string;
  padding: string;
  gap: string;
}> = {
  sm: {
    wrapper: "gap-1.5",
    label: "text-xs",
    input: "text-sm py-2 px-3",
    icon: "w-4 h-4",
    padding: "px-3",
    gap: "gap-2",
  },
  md: {
    wrapper: "gap-2",
    label: "text-sm",
    input: "text-base py-2.5 px-4",
    icon: "w-5 h-5",
    padding: "px-4",
    gap: "gap-2.5",
  },
  lg: {
    wrapper: "gap-2.5",
    label: "text-base",
    input: "text-lg py-3 px-5",
    icon: "w-6 h-6",
    padding: "px-5",
    gap: "gap-3",
  },
};

const COMMON_INPUT_BASE = `
  w-full bg-input-background border-2 rounded-xl
  transition-all duration-200 ease-out-expo
  placeholder:text-muted-foreground/60
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted
  readonly:bg-muted/50
  selection:bg-brand-green/20
`.trim();

const COMMON_LABEL_BASE = `
  font-semibold text-foreground
  transition-color duration-200
  select-none
`.trim();

const COMMON_WRAPPER_BASE = `
  flex flex-col
  relative
  isolation-isolate
`.trim();

export const EnterpriseInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, EnterpriseInputProps>(
  (
    {
      type = "text",
      size = "md",
      label,
      placeholder,
      helperText,
      error,
      warning,
      success,
      icon: Icon,
      iconPosition = "start",
      iconClickable = false,
      onIconClick,
      fullWidth = true,
      clearable = false,
      onClear,
      mask,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      maskPlaceholder = "_",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      autoComplete = "off",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      "aria-errormessage": ariaErrorMessage,
      "aria-invalid": ariaInvalid,
      className = "",
      wrapperClassName = "",
      labelClassName = "",
      inputClassName = "",
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      value,
      defaultValue,
      disabled,
      readOnly,
      required,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [showError, setShowError] = useState(false);
    const [shakeTrigger, setShakeTrigger] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const labelId = `${id}-label`;
    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
      setHasValue(!!(value ?? defaultValue));
    }, [value, defaultValue]);

    useEffect(() => {
      if (error && !prefersReducedMotion) {
        setShowError(true);
        setShakeTrigger(prev => prev + 1);
        const timer = setTimeout(() => setShowError(false), 3000);
        return () => clearTimeout(timer);
      } else {
        setShowError(false);
      }
    }, [error]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setHasValue(!!newValue);
      onChange?.(newValue, e);
    }, [onChange]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e as React.FocusEvent<HTMLInputElement>);
    }, [onBlur]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e as React.FocusEvent<HTMLInputElement>);
    }, [onFocus]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Escape" && clearable && hasValue) {
        e.preventDefault();
        inputRef.current?.focus();
        onClear?.();
        onChange?.("", e as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }
      onKeyDown?.(e as React.KeyboardEvent<HTMLInputElement>);
    }, [clearable, hasValue, onClear, onChange, onKeyDown]);

    const handleClear = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      inputRef.current?.focus();
      onClear?.();
      onChange?.("", e as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, [onClear, onChange]);

    const handleIconClick = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      inputRef.current?.focus();
      onIconClick?.();
    }, [onIconClick]);

    const sizeConfig = sizeStyles[size];
    const hasIcon = !!Icon;
    const hasMessage = error || warning || success;
    const hasHelper = helperText && !hasMessage;

    const isInvalid = ariaInvalid ?? !!error;
    const isWarning = !!warning && !error;
    const isSuccess = !!success && !error && !warning;

    const getBorderColor = () => {
      if (isFocused) return isInvalid ? "focus-visible:ring-danger/20 focus-visible:border-danger" : isWarning ? "focus-visible:ring-warning/20 focus-visible:border-warning" : "focus-visible:ring-brand-green/20 focus-visible:border-brand-green";
      if (isInvalid) return "border-danger";
      if (isWarning) return "border-warning";
      if (isSuccess) return "border-success";
      return "border-border";
    };

    const getRingColor = () => {
      if (isFocused) {
        if (isInvalid) return "focus-visible:ring-danger";
        if (isWarning) return "focus-visible:ring-warning";
        return "focus-visible:ring-brand-green";
      }
      return "";
    };

    const getLabelColor = () => {
      if (isFocused) return isInvalid ? "text-danger" : isWarning ? "text-warning" : "text-brand-green";
      if (isInvalid) return "text-danger/80";
      if (isWarning) return "text-warning/80";
      if (isSuccess) return "text-success/80";
      return "";
    };

    const inputPadding = hasIcon
      ? (iconPosition === "start" ? "pl-12 pr-4" : "pl-4 pr-12")
      : sizeConfig.padding;

    const clearButtonPadding = clearable && hasValue && !disabled && !readOnly ? "pr-12" : "";

    const combinedInputClasses = [
      COMMON_INPUT_BASE,
      sizeConfig.input,
      inputPadding,
      clearButtonPadding,
      getBorderColor(),
      getRingColor(),
      isFocused ? "ring-2 ring-offset-background" : "",
      error && !prefersReducedMotion && showError ? "animate-[shake_400ms_ease-out]" : "",
      inputClassName,
      className,
    ].filter(Boolean).join(" ");

    const combinedLabelClasses = [
      COMMON_LABEL_BASE,
      sizeConfig.label,
      getLabelColor(),
      labelClassName,
    ].filter(Boolean).join(" ");

    const combinedWrapperClasses = [
      COMMON_WRAPPER_BASE,
      sizeConfig.wrapper,
      sizeConfig.gap,
      fullWidth ? "w-full" : "",
      wrapperClassName,
    ].filter(Boolean).join(" ");

    const describedBy = [
      hasHelper ? helperId : "",
      error ? errorId : "",
      warning ? errorId : "",
      success ? errorId : "",
      ariaDescribedBy,
    ].filter(Boolean).join(" ") || undefined;

    const isTextarea = type === "textarea";

    return (
      <div ref={wrapperRef} className={combinedWrapperClasses}>
        {label && (
          <label
            id={labelId}
            htmlFor={id}
            className={combinedLabelClasses}
          >
            {label}
            {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {hasIcon && iconPosition === "start" && (
            <div
              className={`absolute right-3 flex items-center justify-center pointer-events-none ${sizeConfig.icon} text-muted-foreground/60 transition-colors duration-200 ${isFocused ? (isInvalid ? "text-danger" : isWarning ? "text-warning" : "text-brand-green") : ""} ${iconClickable ? "cursor-pointer pointer-events-auto" : ""}`}
              aria-hidden="true"
              onClick={iconClickable ? handleIconClick : undefined}
            >
              <Icon />
            </div>
          )}

          {isTextarea ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={id}
              placeholder={placeholder}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              autoComplete={autoComplete}
              className={combinedInputClasses}
              aria-label={ariaLabel}
              aria-describedby={describedBy}
              aria-invalid={isInvalid}
              aria-errormessage={error ? errorId : ariaErrorMessage}
              style={{
                fontFamily: "var(--font-ar)",
                minHeight: "100px",
                resize: "vertical",
                direction: "rtl",
              }}
              {...props}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={id}
              type={type}
              placeholder={placeholder}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              autoComplete={autoComplete}
              className={combinedInputClasses}
              aria-label={ariaLabel}
              aria-describedby={describedBy}
              aria-invalid={isInvalid}
              aria-errormessage={error ? errorId : ariaErrorMessage}
              style={{ fontFamily: "var(--font-ar)", direction: "rtl" }}
              {...props}
            />
          )}

          {hasIcon && iconPosition === "end" && (
            <div
              className={`absolute left-3 flex items-center justify-center pointer-events-none ${sizeConfig.icon} text-muted-foreground/60 transition-colors duration-200 ${isFocused ? (isInvalid ? "text-danger" : isWarning ? "text-warning" : "text-brand-green") : ""} ${iconClickable ? "cursor-pointer pointer-events-auto" : ""}`}
              aria-hidden="true"
              onClick={iconClickable ? handleIconClick : undefined}
            >
              <Icon />
            </div>
          )}

          {clearable && hasValue && !disabled && !readOnly && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="absolute left-3 flex items-center justify-center p-1 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors duration-150"
              aria-label="مسح المحتوى"
              aria-hidden="false"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          )}

          <AnimatePresence mode="wait">
            {(isFocused || hasValue) && (
              <motion.div
                className="absolute inset-0 border-2 rounded-xl pointer-events-none"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 150, ease: "easeOut" }}
                style={{
                  borderColor: isFocused
                    ? isInvalid
                      ? "var(--danger)"
                      : isWarning
                      ? "var(--warning)"
                      : "var(--brand-green)"
                    : "transparent",
                }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id={errorId}
              role="alert"
              className="text-sm text-danger flex items-center gap-1.5"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 200 }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </motion.p>
          )}

          {warning && !error && (
            <motion.p
              id={errorId}
              className="text-sm text-warning flex items-center gap-1.5"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 200 }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              {warning}
            </motion.p>
          )}

          {success && !error && !warning && (
            <motion.p
              id={errorId}
              className="text-sm text-success flex items-center gap-1.5"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 200 }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {success}
            </motion.p>
          )}

          {helperText && !hasMessage && (
            <motion.p
              id={helperId}
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 200 }}
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

EnterpriseInput.displayName = "EnterpriseInput";

export interface EnterpriseInputGroupProps {
  label?: string;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const EnterpriseInputGroup = ({
  label,
  helperText,
  error,
  children,
  className = "",
}: EnterpriseInputGroupProps) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {label && (
      <label className="text-sm font-semibold text-foreground">
        {label}
      </label>
    )}
    <div className="relative">{children}</div>
    {error && (
      <p className="text-sm text-danger flex items-center gap-1.5" role="alert">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {error}
      </p>
    )}
    {helperText && !error && (
      <p className="text-sm text-muted-foreground">{helperText}</p>
    )}
  </div>
);

EnterpriseInputGroup.displayName = "EnterpriseInputGroup";

export default EnterpriseInput;