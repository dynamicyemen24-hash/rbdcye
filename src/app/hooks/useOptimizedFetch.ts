// ============================================================
// useOptimizedFetch Hook - optimized fetching with caching and deduplication
// ============================================================
import { useState, useEffect, useCallback, useRef, memo } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  lastAccessed: number;
  promise?: Promise<T>;
}

const MAX_CACHE_SIZE = 100;
const MAX_PENDING_SIZE = 50;
const globalCache = new Map<string, CacheEntry<any>>();
const pendingRequests = new Map<string, Promise<any>>();

function evictLRU<K, V>(map: Map<K, V>, maxSize: number) {
  if (map.size <= maxSize) return;
  let oldestKey: K | null = null;
  let oldestTime = Infinity;
  for (const [key, entry] of map) {
    const time = (entry as any).lastAccessed ?? (entry as any).timestamp ?? 0;
    if (time < oldestTime) {
      oldestTime = time;
      oldestKey = key;
    }
  }
  if (oldestKey !== null) {
    map.delete(oldestKey);
  }
}

export function useOptimizedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    staleTime?: number;
    immediate?: boolean;
  } = {}
): { data: T | null; loading: boolean; error: string | null; refetch: () => void } {
  const { ttl = 5 * 60 * 1000, staleTime = 60 * 1000, immediate = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    const now = Date.now();
    const cached = globalCache.get(key);

    if (cached && now - cached.timestamp < ttl + staleTime) {
      if (!mountedRef.current) return;
      cached.lastAccessed = now;
      setData(cached.data);

      if (now - cached.timestamp > ttl && !cached.promise) {
        const promise = fetcher().catch(() => {});
        cached.promise = promise;
        pendingRequests.set(key, promise);

        promise.then(result => {
          if (mountedRef.current) {
            setData(result as T);
            globalCache.set(key, { data: result, timestamp: Date.now(), lastAccessed: Date.now() });
          }
        }).finally(() => {
          pendingRequests.delete(key);
        });
      }
      return;
    }

    if (pendingRequests.has(key)) {
      try {
        const result = await pendingRequests.get(key)!;
        if (mountedRef.current) setData(result as T);
      } catch {
        // Ignore dedup errors
      }
      return;
    }

    setLoading(true);
    setError(null);

    const promise = fetcher();
    pendingRequests.set(key, promise);

    if (pendingRequests.size > MAX_PENDING_SIZE) {
      const firstKey = pendingRequests.keys().next().value;
      if (firstKey) pendingRequests.delete(firstKey);
    }

    promise
      .then(result => {
        if (mountedRef.current) {
          setData(result as T);
          evictLRU(globalCache, MAX_CACHE_SIZE - 1);
          globalCache.set(key, { data: result, timestamp: Date.now(), lastAccessed: Date.now() });
        }
      })
      .catch((err: any) => {
        if (mountedRef.current) {
          setError(err?.message || 'حدث خطأ');
        }
      })
      .finally(() => {
        pendingRequests.delete(key);
        if (mountedRef.current) setLoading(false);
      });

    return promise;
  }, [key, fetcher, ttl, staleTime]);

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [immediate, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Optimize re-renders with memo comparison
export function createOptimizedComponent<T extends object>(
  Component: React.FC<T>,
  areEqual?: (prev: T, next: T) => boolean
) {
  return memo(Component, areEqual);
}


