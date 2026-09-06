// Dynamic Contrast Hook for WCAG 2.1 AAA Accessibility Compliance
// خطاف تفاعلي لفحص وتعديل تباين العناوين والأزرار ديناميكياً لتلبية معيار WCAG 2.1 AAA

import { useEffect, useRef } from "react";
import { applyDynamicAAAContrast } from "@/shared/utils/wcagContrast";

export interface DynamicContrastOptions {
  selector?: string;
  enabled?: boolean;
  onAuditComplete?: (auditedCount: number) => void;
}

/**
 * Custom Hook that scans headings, buttons, badges, and labels,
 * dynamically adjusting text color based on section background & pattern opacity.
 */
export function useDynamicContrast<T extends HTMLElement = HTMLDivElement>({
  selector = "h1, h2, h3, h4, h5, button, a.btn-primary, a.btn-gold, .section-subtitle, .badge-gold",
  enabled = true,
  onAuditComplete,
}: DynamicContrastOptions = {}) {
  const containerRef = useRef<T | null>(null);
  const auditTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const auditElements = () => {
      if (auditTimeoutRef.current) return;

      auditTimeoutRef.current = setTimeout(() => {
        const root = containerRef.current || document.body;
        const elements = root.querySelectorAll<HTMLElement>(selector);

        let auditedCount = 0;
        elements.forEach((el) => {
          applyDynamicAAAContrast(el);
          auditedCount++;
        });

        if (onAuditComplete) {
          onAuditComplete(auditedCount);
        }

        auditTimeoutRef.current = null;
      }, 100);
    };

    // Run audit immediately and on resize/theme toggle
    auditElements();

    const observer = new MutationObserver(() => {
      auditElements();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    window.addEventListener("resize", auditElements);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", auditElements);
    };
  }, [selector, enabled, onAuditComplete]);

  return containerRef;
}

export default useDynamicContrast;
