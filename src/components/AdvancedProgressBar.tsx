// Advanced Progress Bar - Thin, non-blocking top indicator
import { motion, AnimatePresence, useScroll, useSpring as useFramerSpring } from "motion/react";
import { useMemo } from "react";

interface AdvancedProgressBarProps {
  readonly percentage: number | { get: () => number };
  readonly message: string;
  readonly isComplete: boolean;
  readonly isReady: boolean;
  readonly showAyah?: boolean;
}

function extractProgress(percentage: number | { get: () => number }, isReady: boolean): number {
  if (isReady) return 100;
  if (typeof percentage === "object" && percentage !== null && "get" in percentage) {
    const value = percentage.get();
    return Math.max(0, Math.min(100, value));
  }
  if (typeof percentage === "number") {
    return Math.max(0, Math.min(100, percentage));
  }
  return 0;
}

export default function AdvancedProgressBar({
  percentage,
  isComplete,
  isReady,
}: AdvancedProgressBarProps) {
  const progressPercent = extractProgress(percentage, isReady);
  const progressWidth = useMemo(() => `${progressPercent}%`, [progressPercent]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 right-0 z-[9999]"
          dir="ltr"
        >
          <div className="h-1 bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--brand-green)] via-[var(--brand-gold)] to-[var(--brand-green)]"
              animate={{ width: progressWidth }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Scroll-based reading progress indicator
export function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useFramerSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-1" dir="ltr">
      <motion.div
        className="h-full bg-gradient-to-r from-[var(--brand-green)] via-[var(--brand-gold)] to-[var(--brand-green)]"
        style={{
          scaleX: smoothProgress,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}
