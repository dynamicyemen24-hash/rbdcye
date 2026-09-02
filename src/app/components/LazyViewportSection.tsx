import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface LazyViewportSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  minHeight?: string;
  className?: string;
  id?: string;
}

export function LazyViewportSection({
  children,
  fallback,
  threshold = 0.01,
  rootMargin = "600px 0px",
  minHeight = "120px",
  className = "",
  id,
}: LazyViewportSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
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
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const defaultFallback = (
    <div
      className="flex items-center justify-center w-full transition-opacity duration-300"
      style={{ minHeight }}
    >
      <div className="flex items-center gap-2.5 text-emerald-800/80 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-emerald-100/60 shadow-xs">
        <Loader2 className="w-4 h-4 animate-spin text-[var(--brand-green)]" />
        <span className="text-xs font-semibold font-cairo">جاري التحميل...</span>
      </div>
    </div>
  );

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`w-full relative ${className}`}
      style={{ minHeight: isVisible ? "auto" : minHeight }}
    >
      {isVisible ? children : fallback || defaultFallback}
    </div>
  );
}

export default LazyViewportSection;
