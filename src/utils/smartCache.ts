type CacheStrategy =
  "cache-first" | "network-first" | "stale-while-revalidate" | "cache-only" | "network-only";

interface CacheOptions {
  maxAge?: number;
  maxEntries?: number;
  cacheName: string;
}

interface CacheEntry {
  key: string;
  value: any;
  expiry: number;
  tags: string[];
}

class SmartCacheService {
  private static instance: SmartCacheService;
  private memoryCache: Map<string, CacheEntry> = new Map();

  static getInstance(): SmartCacheService {
    if (!SmartCacheService.instance) {
      SmartCacheService.instance = new SmartCacheService();
    }
    return SmartCacheService.instance;
  }

  async fetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: Partial<CacheOptions> = {}
  ): Promise<T> {
    const { maxAge = 5 * 60 * 1000, maxEntries = 50, cacheName = "default" } = options;

    const memoryEntry = this.memoryCache.get(key);

    if (memoryEntry && Date.now() < memoryEntry.expiry) {
      return memoryEntry.value as T;
    }

    try {
      const data = await fetcher();

      this.memoryCache.set(key, {
        key,
        value: data,
        expiry: Date.now() + maxAge,
        tags: [cacheName],
      });

      if (this.memoryCache.size > maxEntries) {
        const oldest = Array.from(this.memoryCache.values()).sort((a, b) => a.expiry - b.expiry)[0];
        if (oldest) this.memoryCache.delete(oldest.key);
      }

      return data;
    } catch (error) {
      if (memoryEntry) {
        return memoryEntry.value as T;
      }
      throw error;
    }
  }

  invalidate(tag?: string) {
    if (!tag) {
      this.memoryCache.clear();
      return;
    }

    for (const [key, entry] of this.memoryCache) {
      if (entry.tags.includes(tag)) {
        this.memoryCache.delete(key);
      }
    }
  }

  invalidateByPattern(pattern: RegExp) {
    for (const [key] of this.memoryCache) {
      if (pattern.test(key)) {
        this.memoryCache.delete(key);
      }
    }
  }

  prefetch(key: string, fetcher: () => Promise<any>, options?: Partial<CacheOptions>) {
    if (this.memoryCache.has(key)) return;

    fetcher()
      .then((data) => {
        this.memoryCache.set(key, {
          key,
          value: data,
          expiry: Date.now() + (options?.maxAge || 5 * 60 * 1000),
          tags: [options?.cacheName || "default"],
        });
      })
      .catch(() => {});
  }

  getStats() {
    let totalSize = 0;
    let oldestEntry: CacheEntry | undefined;
    let newestEntry: CacheEntry | undefined;

    for (const entry of this.memoryCache.values()) {
      totalSize += JSON.stringify(entry.value).length;
      if (!oldestEntry || entry.expiry < oldestEntry.expiry) oldestEntry = entry;
      if (!newestEntry || entry.expiry > newestEntry.expiry) newestEntry = entry;
    }

    return {
      size: this.memoryCache.size,
      totalSize,
      oldestEntry,
      newestEntry,
    };
  }

  clear() {
    this.memoryCache.clear();
  }
}

export const smartCache = SmartCacheService.getInstance();

// React Hook for smart caching
export function useSmartCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    maxAge?: number;
    enabled?: boolean;
  } = {}
) {
  const { maxAge = 5 * 60 * 1000, enabled = true } = options;

  return {
    query: () => {
      if (!enabled) return fetcher();
      return smartCache.fetch(key, fetcher, { maxAge });
    },
    invalidate: () => {
      smartCache.invalidateByPattern(new RegExp(`^${key}`));
    },
    prefetch: () => {
      if (!enabled) return;
      smartCache.prefetch(key, fetcher, { maxAge });
    },
  };
}
