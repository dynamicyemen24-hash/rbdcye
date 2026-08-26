import { useEffect, useState, useCallback } from 'react';

interface DataLoaderOptions {
  staleWhileRevalidate?: boolean;
  cacheTime?: number;
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

export function useDataLoader<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: DataLoaderOptions = {}
): DataLoaderResult<T> {
  const {
    staleWhileRevalidate = false,
    cacheTime = 5 * 60,
    retryCount = 3,
    retryDelay = 1000,
    timeout = 15000
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = `rbdcye_data_${dependencies.join('_')}`;

  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { timestamp, value } = JSON.parse(cached);
        const age = (Date.now() - timestamp) / 1000;
        if (age < cacheTime) {
          return value as T;
        }
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
    return null;
  }, [cacheKey, cacheTime]);

  const saveToCache = useCallback((value: T) => {
    try {
      const cacheData = {
        timestamp: Date.now(),
        value
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch {
      // silently ignore cache write errors
    }
  }, [cacheKey]);

  const refetch = useCallback(async () => {
    const abortController = new AbortController();

    if (staleWhileRevalidate) {
      const cached = loadFromCache();
      if (cached) {
        setData(cached);
      }
    }

    setLoading(true);
    setError(null);

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

        setData(result);
        saveToCache(result);
        setError(null);
        setLoading(false);
        return;
      } catch (err) {
        const error = err as Error;

        if (attempt === retryCount - 1) {
          setError(error);

          if (!staleWhileRevalidate) {
            const cached = loadFromCache();
            if (cached) {
              setData(cached);
              setError(null);
            }
          }
          setLoading(false);
        } else {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }
  }, [fetchFn, loadFromCache, saveToCache, staleWhileRevalidate, retryCount, retryDelay, timeout]);

  useEffect(() => {
    let mounted = true;

    const abortController = new AbortController();

    const runFetch = async () => {
      if (staleWhileRevalidate) {
        const cached = loadFromCache();
        if (cached && mounted) {
          setData(cached);
        }
      }

      setLoading(true);
      setError(null);

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
          setLoading(false);
          return;
        } catch (err) {
          if (!mounted) return;
          const error = err as Error;

          if (attempt === retryCount - 1) {
            setError(error);
            if (!staleWhileRevalidate) {
              const cached = loadFromCache();
              if (cached) {
                setData(cached);
                setError(null);
              }
            }
            setLoading(false);
          } else {
            await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          }
        }
      }
    };

    runFetch();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, dependencies);

  return { data, loading, error, refetch };
}
