// src/shared/hooks/useDynamicContent.ts
// Updated: Always returns data (static defaults guaranteed)
import { useState, useEffect, useCallback, useRef } from "react";

import { contentBridge } from "@/shared/services/content-bridge.service";

interface UseDynamicContentOptions<T> {
  contentType: string;
  initialData?: T[];
  enableRealtime?: boolean;
  refreshInterval?: number;
}

export function useDynamicContent<T = any>({
  contentType,
  initialData,
  enableRealtime = false,
  refreshInterval = 300000, // 5 minutes
}: UseDynamicContentOptions<T>) {
  const [data, setData] = useState<T[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(false); // Start as false — static data is instant
  const [source, setSource] = useState<"static" | "cache" | "sanity" | "hybrid">("static");
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const loadContent = useCallback(async () => {
    try {
      const result = await contentBridge.getContent<T>(contentType as any);
      if (!mountedRef.current) return;
      setData(result.data);
      setSource(result.source);
      setError(result.error ? new Error(result.error) : null);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err as Error);
      if (initialData && initialData.length > 0) {
        setData(initialData);
      }
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [contentType, initialData]);

  useEffect(() => {
    mountedRef.current = true;
    loadContent();

    if (enableRealtime) {
      const interval = setInterval(loadContent, refreshInterval);
      return () => {
        mountedRef.current = false;
        clearInterval(interval);
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [loadContent, enableRealtime, refreshInterval]);

  return {
    data,
    isLoading,
    source,
    error,
    isDynamic: source === "sanity" || source === "hybrid" || source === "cache",
    refresh: loadContent,
  };
}
