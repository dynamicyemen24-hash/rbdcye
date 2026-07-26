import { useEffect, useState, useCallback } from 'react';

interface DataLoaderOptions {
  staleWhileRevalidate?: boolean;
  cacheTime?: number; // بالثواني
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
}

interface DataLoaderResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook مخصص لتحميل البيانات مع دعم إعادة المحاولة والتخزين المؤقت
 */
export function useDataLoader<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: DataLoaderOptions = {}
): DataLoaderResult<T> {
  const {
    staleWhileRevalidate = false,
    cacheTime = 5 * 60, // 5 دقائق افتراضياً
    retryCount = 3,
    retryDelay = 1000,
    timeout = 15000
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = `rbdcye_data_${dependencies.join('_')}`;

  // تحميل البيانات من التخزين المؤقت
  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp, value } = JSON.parse(cached);
        const age = (Date.now() - timestamp) / 1000;
        
        // إذا كانت البيانات لا تزال صالحة
        if (age < cacheTime) {
          return value as T;
        }
      }
    } catch (e) {
      console.warn('Failed to load from cache:', e);
      localStorage.removeItem(cacheKey);
    }
    return null;
  }, [cacheKey, cacheTime]);

  // حفظ البيانات في التخزين المؤقت
  const saveToCache = useCallback((value: T) => {
    try {
      const cacheData = {
        timestamp: Date.now(),
        value
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Failed to save to cache:', e);
    }
  }, [cacheKey]);

  const fetchData = useCallback(async () => {
    let mounted = true;
    const abortController = new AbortController();

    // محاولة تحميل من التخزين المؤقت أولاً إذا كان staleWhileRevalidate
    if (staleWhileRevalidate) {
      const cached = loadFromCache();
      if (cached) {
        setData(cached);
      }
    }

    setLoading(true);
    setError(null);

    // إعادة المحاولة
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const result = await Promise.race([
          fetchFn(),
          new Promise<never>((_, reject) => 
            setTimeout(() => {
              abortController.abort();
              reject(new Error('Timeout'));
            }, timeout)
          )
        ]);
        
        if (!mounted) return;
        
        setData(result);
        saveToCache(result);
        setError(null);
        return;
      } catch (err) {
        const error = err as Error;
        
        // إذا كان ذلك آخر محاولة
        if (attempt === retryCount - 1) {
          if (!mounted) return;
          
          setError(error);
          
          // محاولة استخدام البيانات من التخزين المؤقت
          if (!staleWhileRevalidate) {
            const cached = loadFromCache();
            if (cached) {
              setData(cached);
              setError(null);
            }
          }
        } else {
          // انتظار قبل المحاولة التالية
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [loadFromCache, saveToCache, staleWhileRevalidate, retryCount, retryDelay, timeout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}