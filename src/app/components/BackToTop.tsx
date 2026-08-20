import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  /** Scroll threshold in pixels before the button becomes visible */
  threshold?: number;
  /** Optional custom CSS classes */
  className?: string;
}

export function BackToTop({ threshold = 320, className = '' }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Optimized scroll handler using requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = document.documentElement.clientHeight;
          const totalScrollable = scrollHeight - clientHeight;

          // Toggle visibility
          setIsVisible(scrollTop > threshold);

          // Calculate percentage (0 to 100)
          if (totalScrollable > 0) {
            const progress = Math.min(100, Math.max(0, (scrollTop / totalScrollable) * 100));
            setScrollProgress(progress);
          } else {
            setScrollProgress(0);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // SVG Circular progress math
  const circleSize = 48; // px
  const strokeWidth = 3;
  const radius = (circleSize - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 25,
            mass: 0.8,
          }}
          className={`fixed z-40 right-4 sm:right-6 md:right-8 bottom-[calc(var(--mobile-nav-height)+1rem)] md:bottom-24 select-none ${className}`}
          dir="rtl"
        >
          {/* Tooltip on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[11px] font-bold font-cairo shadow-md whitespace-nowrap pointer-events-none flex items-center gap-1.5 backdrop-blur-sm border border-white/10"
              >
                <span>العودة للأعلى</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {Math.round(scrollProgress)}%
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Top Interactive Button */}
          <motion.button
            onClick={scrollToTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={`العودة إلى أعلى الصفحة - تم قراءة ${Math.round(scrollProgress)}% من المحتوى`}
            title="العودة إلى أعلى الصفحة"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgba(20,83,45,0.22)] border border-[var(--border)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 backdrop-blur-md transition-shadow duration-300"
          >
            {/* Circular Progress SVG Background */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox={`0 0 ${circleSize} ${circleSize}`}
            >
              {/* Background Track */}
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                className="stroke-slate-200/60 dark:stroke-slate-800/80 fill-none"
                strokeWidth={strokeWidth}
              />
              {/* Active Progress Fill */}
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                className="stroke-[var(--brand-green)] fill-none transition-all duration-150 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Central Arrow Icon with hover animation */}
            <ArrowUp className="w-5 h-5 text-[var(--brand-green)] group-hover:text-[var(--brand-green-light)] group-hover:-translate-y-0.5 transition-all duration-200" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BackToTop;
