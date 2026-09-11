import { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoreVertical, LucideIcon } from "lucide-react";

export interface EnterpriseDropdownItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
  dividerAfter?: boolean;
  shortcut?: string;
}

export interface EnterpriseDropdownProps {
  items: EnterpriseDropdownItem[];
  trigger?: React.ReactNode;
  triggerLabel?: string;
  align?: "start" | "end";
  placement?: "bottom" | "top";
  className?: string;
  menuClassName?: string;
}

export function EnterpriseDropdown({
  items,
  trigger,
  triggerLabel = "خيارات",
  align = "end",
  placement = "bottom",
  className = "",
  menuClassName = "",
}: EnterpriseDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();

  const enabledItems = items.filter((i) => !i.disabled);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (item: EnterpriseDropdownItem) => {
      if (item.disabled) return;
      if (item.onClick) item.onClick();
      close();
    },
    [close]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          break;
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < enabledItems.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : enabledItems.length - 1));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (activeIndex >= 0) handleSelect(enabledItems[activeIndex]);
          break;
        case "Tab":
          close();
          break;
      }
    },
    [isOpen, enabledItems, activeIndex, handleSelect, close]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? id : undefined}
        aria-label={triggerLabel}
        className="inline-flex items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
      >
        {trigger || <MoreVertical className="h-5 w-5" aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={id}
            role="menu"
            initial={{ opacity: 0, scale: 0.95, y: placement === "bottom" ? -4 : 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 min-w-[12rem] overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl ${
              placement === "bottom" ? "top-full mt-1" : "bottom-full mb-1"
            } ${align === "end" ? "left-0" : "right-0"} ${menuClassName}`}
          >
            {items.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      role="menuitem"
                      disabled
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed"
                    >
                      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                      <span className="flex-1 text-right">{item.label}</span>
                    </button>
                    {item.dividerAfter && <div className="my-1 h-px bg-border" role="separator" />}
                  </div>
                );
              }

              const thisIndex = enabledItems.indexOf(item);
              return (
                <div key={item.id}>
                  <button
                    ref={(el) => {
                      itemRefs.current[thisIndex] = el;
                    }}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(thisIndex)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      activeIndex === thisIndex ? "bg-muted" : ""
                    } ${item.danger ? "text-danger hover:bg-danger/10" : "text-foreground"}`}
                  >
                    {Icon && <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
                    <span className="flex-1 text-right">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="rounded bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                  {item.dividerAfter && <div className="my-1 h-px bg-border" role="separator" />}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default EnterpriseDropdown;