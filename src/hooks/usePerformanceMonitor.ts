import { useEffect, useRef } from "react";

export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number | null>(null);

  useEffect(() => {
    renderCount.current++;
    const now = Date.now();
    const timeSinceLastRender = lastRenderTime.current === null ? 0 : now - lastRenderTime.current;

    if (import.meta.env.DEV) {
      if (renderCount.current > 10 && timeSinceLastRender < 100) {
        console.warn(
          `[Performance] ${componentName} re-rendered ${renderCount.current} times ` +
            `(${timeSinceLastRender}ms since last render). Consider memoization.`
        );
      }
    }

    lastRenderTime.current = now;
  });

  useEffect(() => {
    if (import.meta.env.DEV) {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        if (duration > 100) {
          console.warn(`[Performance] ${componentName} mount took ${duration.toFixed(2)}ms`);
        }
      };
    }
    return undefined;
  }, [componentName]);
}
