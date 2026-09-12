import { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect, useCallback } from "react";

import { usePrefersReducedMotion } from "@/shared/hooks/usePrefersReducedMotion";

export type EnterpriseTabsVariant = "default" | "pills" | "underline" | "enclosed";
export type EnterpriseTabsOrientation = "horizontal" | "vertical";

export interface EnterpriseTab {
  value: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
  badge?: string | number;
  count?: number;
  children?: React.ReactNode;
}

export interface EnterpriseTabsProps {
  tabs: EnterpriseTab[];
  value: string;
  onChange: (value: string) => void;
  variant?: EnterpriseTabsVariant;
  orientation?: EnterpriseTabsOrientation;
  className?: string;
  tabClassName?: string;
  panelClassName?: string;
  "aria-label"?: string;
  fullWidth?: boolean;
  animated?: boolean;
  lazy?: boolean;
}

const variantStyles: Record<EnterpriseTabsVariant, { trigger: string; active: string; container: string }> = {
  default: {
    trigger: "px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
    active: "bg-brand-green text-white shadow-md",
    container: "border-b border-border",
  },
  pills: {
    trigger: "px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
    active: "bg-brand-green text-white shadow-lg",
    container: "",
  },
  underline: {
    trigger: "px-4 py-3 text-sm font-medium relative transition-all duration-200",
    active: "text-brand-green",
    container: "border-b border-border",
  },
  enclosed: {
    trigger: "px-4 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200",
    active: "bg-brand-green text-white border-brand-green shadow-md",
    container: "",
  },
};

export function EnterpriseTabs({
  tabs,
  value,
  onChange,
  variant = "default",
  orientation = "horizontal",
  className = "",
  tabClassName = "",
  panelClassName = "",
  "aria-label": ariaLabel,
  fullWidth = true,
  animated = true,
  lazy = false,
}: EnterpriseTabsProps) {
  const [activeValue, setActiveValue] = useState(value);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: setState in effect is intentional for initial data hydration
    setActiveValue(value);
  }, [value]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: setState in effect is intentional for initial data hydration
    setActiveValue(value);
  }, [value]);

  const handleSelect = useCallback(
    (tabValue: string) => {
      const tab = tabs.find((t) => t.value === tabValue);
      if (tab?.disabled) return;
      setActiveValue(tabValue);
      onChange(tabValue);
    },
    [tabs, onChange]
  );

  const handleKeyDown = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- precise: @typescript-eslint/no-unused-vars — verified safe
    (e: React.KeyboardEvent, index: number) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const enabledTabs = tabs.filter((t) => !t.disabled);
      const currentEnabledIndex = enabledTabs.findIndex((t) => t.value === activeValue);

      let newIndex = currentEnabledIndex;
      switch (e.key) {
        case orientation === "horizontal" ? "ArrowRight" : "ArrowDown":
          e.preventDefault();
          newIndex = (currentEnabledIndex + 1) % enabledTabs.length;
          break;
        case orientation === "horizontal" ? "ArrowLeft" : "ArrowUp":
          e.preventDefault();
          newIndex = (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = enabledTabs.length - 1;
          break;
      }

      if (newIndex !== currentEnabledIndex) {
        const targetTab = enabledTabs[newIndex];
        handleSelect(targetTab.value);
        tabRefs.current[tabs.indexOf(targetTab)]?.focus();
      }
    },
    [tabs, activeValue, orientation, handleSelect]
  );

  const updateIndicator = useCallback(() => {
    if (!indicatorRef.current || !containerRef.current || variant !== "underline") return;

    const activeTab = tabRefs.current[tabs.findIndex((t) => t.value === activeValue)];
    const container = containerRef.current;
    const indicator = indicatorRef.current;

    if (activeTab && container && indicator) {
      const tabRect = activeTab.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (orientation === "horizontal") {
        indicator.style.width = `${tabRect.width}px`;
        indicator.style.transform = `translateX(${tabRect.left - containerRect.left}px)`;
      } else {
        indicator.style.height = `${tabRect.height}px`;
        indicator.style.transform = `translateY(${tabRect.top - containerRect.top}px)`;
      }
    }
  }, [activeValue, tabs, orientation, variant]);

  useEffect(() => {
    if (animated && variant === "underline") {
      updateIndicator();
    }
  }, [activeValue, animated, variant, updateIndicator]);

  const vStyles = variantStyles[variant];
  const isHorizontal = orientation === "horizontal";

  const triggerClasses = [
    "relative inline-flex items-center justify-center gap-2",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-colors duration-200",
    vStyles.trigger,
    tabClassName,
  ].filter(Boolean).join(" ");

  const activeTriggerClasses = [
    vStyles.active,
    "text-white",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={`flex flex-col ${isHorizontal ? "flex-col" : "flex-row"} ${className}`}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      dir="rtl"
    >
      <div
        ref={containerRef}
        className={`flex ${isHorizontal ? "flex-row" : "flex-col"} gap-1 ${vStyles.container} ${fullWidth ? "w-full" : ""}`}
        role="tablist"
        aria-label={ariaLabel}
      >
        {tabs.map((tab, index) => {
          const isActive = activeValue === tab.value;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.value}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              id={`tab-${tab.value}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.value}`}
              aria-disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(tab.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={isDisabled}
              className={`${triggerClasses} ${isActive ? activeTriggerClasses : ""}`}
            >
              {tab.icon && <tab.icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
              <span className="truncate">{tab.label}</span>
              {(tab.badge !== undefined || tab.count !== undefined) && (
                <span
                  className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.badge ?? tab.count}
                </span>
              )}
            </button>
          );
        })}

        {animated && variant === "underline" && (
          <motion.div
            ref={indicatorRef}
            className="absolute bottom-0 left-0 h-0.5 bg-brand-green rounded-full transition-all duration-300 ease-out"
            initial={false}
            animate={{ width: 0, x: 0 }}
            style={{ width: 0, transform: "translateX(0)" }}
          />
        )}
      </div>

      <div className="mt-4">
        <AnimatePresence mode={lazy ? "wait" : "popLayout"}>
          {tabs.map((tab) => {
            const isActive = activeValue === tab.value;
            if (!isActive && lazy) return null;

            return (
              <motion.div
                key={tab.value}
                role="tabpanel"
                id={`panel-${tab.value}`}
                aria-labelledby={`tab-${tab.value}`}
                hidden={!isActive}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: prefersReducedMotion ? 0 : 200, ease: "easeOut" }}
                className={panelClassName}
              >
                {tab.children || tab.label}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default EnterpriseTabs;