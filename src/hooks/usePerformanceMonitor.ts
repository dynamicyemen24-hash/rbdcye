import { useEffect, useRef } from "react";

export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number | null>(null);

  useEffect(() => {
    renderCount.current++;
    const now = Date.now();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const timeSinceLastRender = lastRenderTime.current === null ? 0 : now - lastRenderTime.current;

    lastRenderTime.current = now;
  });

  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const duration = endTime - startTime;
      // Performance monitoring done silently
    };
  }, [componentName]);
}
