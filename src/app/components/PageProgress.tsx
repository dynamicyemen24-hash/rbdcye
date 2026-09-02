// Page Progress - Lightweight scroll & loading progress
import { motion, useScroll, useSpring } from "motion/react";

export function PageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5" dir="ltr">
      <motion.div
        className="h-full bg-gradient-to-r from-[var(--brand-green)] via-[var(--brand-gold)] to-[var(--brand-green)]"
        style={{ scaleX, transformOrigin: "left center" }}
      />
    </div>
  );
}
