import { useState, useEffect, useRef } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRun.current >= delay) {
      lastRun.current = now;
      func(...args);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => {
          lastRun.current = Date.now();
          func(...args);
        },
        delay - (now - lastRun.current)
      );
    }
  };
}
