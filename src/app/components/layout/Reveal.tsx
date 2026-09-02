// Unified Scroll Reveal - نظام الكشف الموحد عند التمرير
// تأثير واحد متسق لكل الموقع مع احترام prefers-reduced-motion
import { motion, useReducedMotion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  /** مهلة بالثواني للتدرج بين العناصر */
  delay?: number;
  /** مسافة الانزلاق العمودي */
  y?: number;
  className?: string;
  once?: boolean;
}

export function Reveal({ children, delay = 0, y = 28, className = "", once = true }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration: reduce ? 0.25 : 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}


