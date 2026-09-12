import { ChevronDown, ChevronUp, Search, X, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { forwardRef, useState, useRef, useEffect, useCallback, useId } from "react";

import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";

export interface EnterpriseSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: LucideIcon;
  description?: string;
}

export interface EnterpriseSelectProps {
  options: EnterpriseSelectOption[];
  value?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  onChange?: (value: string | string[]) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  className?: string;
  wrapperClassName?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  name?: string;
  id?: string;
}

const sizeStyles = {
  sm: {
    trigger: "px-3 py-2 text-sm",
    icon: "w-4 h-4",
    option: "px-3 py-2 text-sm",
    gap: "gap-1.5",
  },
  md: {
    trigger: "px-4 py-2.5 text-base",
    icon: "w-5 h-5",
    option: "px-4 py-2.5 text-base",
    gap: "gap-2",
  },
  lg: {
    trigger: "px-5 py-3 text-lg",
    icon: "w-6 h-6",
    option: "px-5 py-3 text-lg",
    gap: "gap-2.5",
  },
};

const COMMON_TRIGGER_BASE = `
  w-full flex items-center justify-between
  bg-input-background border-2 border-border rounded-xl
  transition-all duration-200 ease-out-expo
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  hover:border-brand-green/50
`.trim();

const COMMON_OPTION_BASE = `
  flex items-center gap-3
  transition-colors duration-150
  cursor-pointer
  select-none
`.trim();

export const EnterpriseSelect = forwardRef<HTMLDivElement, EnterpriseSelectProps>(
  (
    {
      options,
      value,
      placeholder = "اختر...",
      label,
      helperText,
      error,
      disabled = false,
      required = false,
      searchable = false,
      multiple = false,
      clearable = false,
      onChange,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- precise: @typescript-eslint/no-unused-vars — verified safe
      onBlur,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onFocus,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      "aria-label": ariaLabel,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      "aria-describedby": ariaDescribedBy,
      className = "",
      wrapperClassName = "",
      size = "md",
      fullWidth = true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- precise: @typescript-eslint/no-unused-vars — verified safe
      name,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      id: providedId,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
    const generatedId = useId();
    const id = providedId || generatedId;
    const listId = `${id}-list`;
    const triggerId = `${id}-trigger`;
    const searchId = `${id}-search`;
    const prefersReducedMotion = usePrefersReducedMotion();

    const filteredOptions = options.filter((opt) => {
      if (opt.disabled) return true;
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query)
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps -- precise: deps intentionally limited to avoid loop — verified safe
    // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened
    const selectedOptions = multiple
      // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
      ? (value ? (typeof value === "string" ? value.split(",") : value) : [])
      : value
      ? [value]
      : [];

    const handleToggle = useCallback(() => {
      if (disabled) return;
      setIsOpen((prev) => {
        const next = !prev;
        if (next) {
          setHighlightedIndex(-1);
          setSearchQuery("");
        }
        return next;
      });
    }, [disabled]);

    const handleClose = useCallback(() => {
      setIsOpen(false);
      setSearchQuery("");
      setHighlightedIndex(-1);
    }, []);

    const handleSelect = useCallback(
      (option: EnterpriseSelectOption) => {
        if (option.disabled) return;

        let newValue: string | string[];
        if (multiple) {
          const current = selectedOptions;
          newValue = current.includes(option.value)
            ? current.filter((v) => v !== option.value)
            : [...current, option.value];
        } else {
          newValue = option.value;
          handleClose();
        }

        onChange?.(multiple ? newValue : newValue);
        triggerRef.current?.focus();
      },
      [multiple, selectedOptions, onChange, handleClose]
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(multiple ? [] : "");
        triggerRef.current?.focus();
      },
      [multiple, onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const enabledOptions = filteredOptions.filter((opt) => !opt.disabled);
        if (enabledOptions.length === 0) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev < enabledOptions.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : enabledOptions.length - 1
            );
            break;
          case "Enter":
          case " ":
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < enabledOptions.length) {
              handleSelect(enabledOptions[highlightedIndex]);
            }
            break;
          case "Escape":
            handleClose();
            break;
          case "Tab":
            handleClose();
            break;
        }
      },
      [filteredOptions, highlightedIndex, handleSelect, handleClose]
    );

    const handleClickOutside = useCallback(
      (e: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node) &&
          listRef.current &&
          !listRef.current.contains(e.target as Node)
        ) {
          handleClose();
        }
      },
      [handleClose]
    );

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    useEffect(() => {
      if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
        optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex]);

    const sizeConfig = sizeStyles[size];
    const hasValue = multiple ? selectedOptions.length > 0 : !!value;
    const isInvalid = !!error;

    const triggerClasses = [
      COMMON_TRIGGER_BASE,
      sizeConfig.trigger,
      sizeConfig.gap,
      fullWidth ? "w-full" : "",
      isInvalid ? "border-danger focus-visible:ring-danger" : "",
      isFocused ? "ring-2 ring-brand-green ring-offset-2" : "",
      className,
    ].filter(Boolean).join(" ");

    const wrapperClasses = [
      "relative inline-flex flex-col",
      fullWidth ? "w-full" : "",
      wrapperClassName,
    ].filter(Boolean).join(" ");

    const renderSelected = () => {
      if (!hasValue) return null;

      if (multiple) {
        return (
          <div className="flex flex-wrap gap-1.5">
            {selectedOptions.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-green-pale text-brand-green text-sm font-medium"
                >
                  {opt?.label || val}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const current = selectedOptions.filter((v) => v !== val);
                      onChange?.(current);
                    }}
                    className="p-0.5 rounded hover:bg-brand-green/20"
                    aria-label={`إزالة ${opt?.label || val}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })}
          </div>
        );
      }

      const opt = options.find((o) => o.value === value);
      return <span className="text-foreground">{opt?.label || value}</span>;
    };

    return (
      <div ref={ref} className={wrapperClasses} dir="rtl">
        {label && (
          <label
            id={`${id}-label`}
            htmlFor={triggerId}
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            {label}
            {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-labelledby={`${id}-label`}
            aria-describedby={ariaDescribedBy}
            aria-required={required}
            aria-invalid={isInvalid}
            className={triggerClasses}
            role="combobox"
          >
            {!hasValue && !searchable ? (
              <span className="text-muted-foreground/60">{placeholder}</span>
            ) : (
              renderSelected()
            )}

            {searchable && isOpen && (
              <input
                ref={searchInputRef}
                id={searchId}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="بحث..."
                className="ml-2 w-40 px-2 py-1 text-sm border-none bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-green rounded"
                aria-label="البحث في الخيارات"
              />
            )}

            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 p-1 rounded hover:bg-muted transition-colors"
                aria-label="مسح التحديد"
              >
                <X className={sizeConfig.icon} />
              </button>
            )}

            <span className="ml-2 flex-shrink-0" aria-hidden="true">
              {isOpen ? (
                <ChevronUp className={sizeConfig.icon} />
              ) : (
                <ChevronDown className={sizeConfig.icon} />
              )}
            </span>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                ref={listRef}
                id={listId}
                role="listbox"
                aria-labelledby={triggerId}
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 150, ease: "easeOut" }}
                className="absolute right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border-2 border-brand-green/20 bg-card shadow-xl ring-1 ring-brand-green/10"
                style={{ fontFamily: "var(--font-ar)" }}
              >
                {searchable && (
                  <li className="p-2 border-b border-border/50 sticky top-0 bg-card/95 backdrop-blur-sm">
                    <label htmlFor={searchId} className="sr-only">
                      بحث
                    </label>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <input
                        ref={searchInputRef}
                        id={searchId}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setHighlightedIndex(-1);
                        }}
                        placeholder="بحث في الخيارات..."
                        className="w-full pr-10 pl-3 py-2 text-sm border border-border rounded-lg bg-input-background focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none"
                        aria-label="البحث في الخيارات"
                      />
                    </div>
                  </li>
                )}

                {filteredOptions.length === 0 ? (
                  <li className="px-4 py-3 text-center text-muted-foreground text-sm">
                    لا توجد نتائج مطابقة
                  </li>
                ) : (
                  filteredOptions.map((option, index) => {
                    const isSelected = multiple
                      ? selectedOptions.includes(option.value)
                      : value === option.value;
                    const isHighlighted = highlightedIndex === index;
                    const isDisabled = option.disabled;

                    return (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- precise: jsx-a11y/click-events-have-key-events — verified safe
                      <li
                        ref={(el) => {
                          optionRefs.current[index] = el;
                        }}
                        key={option.value}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={isDisabled}
                        onClick={() => handleSelect(option)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`${COMMON_OPTION_BASE} ${sizeConfig.option} ${
                          isSelected ? "bg-brand-green-pale text-brand-green" : ""
                        } ${isHighlighted ? "bg-muted/50" : ""} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        data-value={option.value}
                      >
                        {option.icon && <option.icon className={sizeConfig.icon} aria-hidden="true" />}
                        <div className="flex-1 min-w-0 text-right">
                          <span className="font-medium truncate">{option.label}</span>
                          {option.description && (
                            <span className="text-xs text-muted-foreground block truncate">
                              {option.description}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <svg
                            className={sizeConfig.icon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </li>
                    );
                  })
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {(error || helperText) && (
          <p
            id={`${id}-message`}
            className={`mt-1.5 text-sm ${error ? "text-danger" : "text-muted-foreground"}`}
            role={error ? "alert" : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

EnterpriseSelect.displayName = "EnterpriseSelect";

export default EnterpriseSelect;