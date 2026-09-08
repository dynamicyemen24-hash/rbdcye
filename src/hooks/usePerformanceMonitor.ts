import { useEffect, useRef } from "react";

export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number | null>(null);

  useEffect(() => {
    renderCount.current++;
    const now = Date.now();
    const timeSinceLastRender = lastRenderTime.current === null ? 0 : now - lastRenderTime.current;

    lastRenderTime.current = now;
  });

  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      // Performance monitoring done silently
    };
  }, [componentName]);
}
