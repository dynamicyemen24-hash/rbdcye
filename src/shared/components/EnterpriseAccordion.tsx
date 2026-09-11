import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LucideIcon, ChevronDown } from "lucide-react";
import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";

export type EnterpriseAccordionVariant = "default" | "bordered" | "separated" | "elevated";

export interface EnterpriseAccordionItem {
  value: string;
  title: string;
  content: React.ReactNode;
  icon?: LucideIcon;
  disabled?: boolean;
  badge?: string | number;
  className?: string;
}

export interface EnterpriseAccordionProps {
  items: EnterpriseAccordionItem[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  variant?: EnterpriseAccordionVariant;
  allowMultiple?: boolean;
  allowToggle?: boolean;
  className?: string;
  itemClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  "aria-label"?: string;
  animated?: boolean;
  lazy?: boolean;
}

const variantStyles: Record<EnterpriseAccordionVariant, { container: string; item: string; header: string }> = {
  default: {
    container: "divide-y divide-border",
    item: "border-b border-border last:border-0",
    header: "bg-transparent",
  },
  bordered: {
    container: "border border-border rounded-xl overflow-hidden",
    item: "border-b border-border last:border-0",
    header: "bg-card",
  },
  separated: {
    container: "space-y-3",
    item: "rounded-xl border border-border overflow-hidden",
    header: "bg-card",
  },
  elevated: {
    container: "space-y-3",
    item: "rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow",
    header: "bg-card/50",
  },
}

const COMMON_HEADER_BASE = `
  flex items-center justify-between gap-3
  w-full px-5 py-4 text-right
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-card
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
`.trim();

export function EnterpriseAccordion({
  items,
  value,
  onChange,
  variant = "default",
  allowMultiple = false,
  allowToggle = true,
  className = "",
  itemClassName = "",
  headerClassName = "",
  contentClassName = "",
  "aria-label": ariaLabel,
  animated = true,
  lazy = false,
}: EnterpriseAccordionProps) {
  const [openValues, setOpenValues] = useState<string[]>(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  });

  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (value !== undefined) {
      setOpenValues(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const handleToggle = (itemValue: string) => {
    const isOpen = openValues.includes(itemValue);
    const item = items.find((i) => i.value === itemValue);
    if (item?.disabled) return;

    let newOpenValues: string[];
    if (isOpen) {
      if (!allowToggle) return;
      newOpenValues = openValues.filter((v) => v !== itemValue);
    } else {
      newOpenValues = allowMultiple ? [...openValues, itemValue] : [itemValue];
    }

    setOpenValues(newOpenValues);
    onChange?.(allowMultiple ? newOpenValues : newOpenValues[0] || "");
  };

  const isOpen = (itemValue: string) => openValues.includes(itemValue);

  const vStyles = variantStyles[variant];

  return (
    <div
      className={`w-full ${className}`}
      role="region"
      aria-label={ariaLabel}
      dir="rtl"
    >
      <div className={vStyles.container}>
        {items.map((item, index) => {
          const isItemOpen = isOpen(item.value);
          const isDisabled = item.disabled;

          return (
            <motion.div
              key={item.value}
              className={`${vStyles.item} ${itemClassName}`}
              initial={false}
              animate={{ opacity: 1 }}
            >
              <button
                type="button"
                onClick={() => handleToggle(item.value)}
                disabled={isDisabled}
                aria-expanded={isItemOpen}
                aria-controls={`accordion-content-${item.value}`}
                id={`accordion-header-${item.value}`}
                className={`${COMMON_HEADER_BASE} ${vStyles.header} ${headerClassName}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.icon && (
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-green-pale text-brand-green flex items-center justify-center">
                      <item.icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                  )}
                  <span className="font-semibold text-foreground truncate">{item.title}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold rounded-full bg-muted text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </div>
                <motion.div
                  className="flex-shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  animate={{ rotate: isItemOpen ? 180 : 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 200, ease: "easeOut" }}
                  aria-hidden="true"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isItemOpen && (
                  <motion.div
                    id={`accordion-content-${item.value}`}
                    role="region"
                    aria-labelledby={`accordion-header-${item.value}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      duration: prefersReducedMotion ? 0 : undefined,
                    }}
                    className={`overflow-hidden ${contentClassName}`}
                  >
                    <div
                      ref={(el) => { contentRefs.current[index] = el; }}
                      className={`px-5 pb-5 pt-0 ${contentClassName}`}
                    >
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default EnterpriseAccordion;