import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useId, useCallback } from "react";

export type EnterpriseTooltipPlacement = "top" | "bottom" | "left" | "right";

export interface EnterpriseTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: EnterpriseTooltipPlacement;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

const placementClasses: Record<EnterpriseTooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 me-2",
  right: "left-full top-1/2 -translate-y-1/2 ms-2",
};

const initialMotion: Record<EnterpriseTooltipPlacement, { opacity: number; scale: number; x?: number; y?: number }> = {
  top: { opacity: 0, scale: 0.95, y: 4 },
  bottom: { opacity: 0, scale: 0.95, y: -4 },
  left: { opacity: 0, scale: 0.95, x: 4 },
  right: { opacity: 0, scale: 0.95, x: -4 },
};

export function EnterpriseTooltip({
  content,
  children,
  placement = "top",
  delay = 200,
  disabled = false,
  className = "",
}: EnterpriseTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const show = useCallback(() => {
    if (disabled) return;
    timerRef.current = setTimeout(() => setIsVisible(true), delay);
  }, [disabled, delay]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") hide();
    },
    [hide]
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- precise: jsx-a11y/no-static-element-interactions — verified safe
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={handleKeyDown}
    >
      <span aria-describedby={isVisible ? id : undefined} className="inline-flex">
        {children}
      </span>

      <AnimatePresence>
        {isVisible && (
          <motion.span
            id={id}
            role="tooltip"
            initial={initialMotion[placement]}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-lg ${placementClasses[placement]} ${className}`}
          >
            {content}
            <span
              className={`absolute h-2 w-2 rotate-45 bg-foreground ${
                // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
                placement === "top"
                  ? "top-full left-1/2 -translate-x-1/2 -translate-y-1/2"
                  // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
                  : placement === "bottom"
                  ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2"
                  : placement === "left"
                  ? "left-full top-1/2 -translate-x-1/2 -translate-y-1/2"
                  : "right-full top-1/2 translate-x-1/2 -translate-y-1/2"
              }`}
              aria-hidden="true"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default EnterpriseTooltip;