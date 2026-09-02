import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { motion } from 'motion/react';

interface LazyViewportSectionProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  minHeight?: string;
  id?: string;
  className?: string;
}

export function LazyViewportSection({
  children,
  threshold = 0.1,
  rootMargin = '150px 0px',
  minHeight = '200px',
  id,
  className = '',
}: LazyViewportSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} id={id} className={className} style={{ minHeight: isVisible ? 'auto' : minHeight }}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  );
}

export default LazyViewportSection;


