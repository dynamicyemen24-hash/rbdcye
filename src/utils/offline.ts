// Offline-first utilities for reliability
export function getCachedData<T>(key: string, fallback: T): T {
  try {
    const cached = localStorage.getItem(`rbdcye_cache_${key}`);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch {
    // Ignore parse errors
  }
  return fallback;
}

export function setCachedData<T>(key: string, data: T, maxAgeMs = 24 * 60 * 60 * 1000): void {
  try {
    const cached = {
      data,
      timestamp: Date.now(),
      maxAge: maxAgeMs,
    };
    localStorage.setItem(`rbdcye_cache_${key}`, JSON.stringify(cached));
  } catch {
    // Ignore storage errors
  }
}

export function isCacheValid(key: string): boolean {
  try {
    const cached = localStorage.getItem(`rbdcye_cache_${key}`);
    if (!cached) return false;
    const parsed = JSON.parse(cached);
    return Date.now() - parsed.timestamp < parsed.maxAge;
  } catch {
    return false;
  }
}

export function cacheFormData(key: string, data: Record<string, unknown>): void {
  try {
    localStorage.setItem(`rbdcye_form_${key}`, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

export function getCachedFormData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(`rbdcye_form_${key}`);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export function clearCachedFormData(key: string): void {
  try {
    localStorage.removeItem(`rbdcye_form_${key}`);
  } catch {
    // Ignore storage errors
  }
}

// Background sync for offline submissions
export async function backgroundSync(tag: string, data: unknown): Promise<void> {
  if ("serviceWorker" in navigator && "sync" in (navigator as any).serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(tag);
    } catch {
      // Background sync not available
    }
  }
}

// Retry with exponential backoff
export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, baseDelay * Math.pow(2, i)));
    }
  }
  throw new Error("Max retries reached");
}
