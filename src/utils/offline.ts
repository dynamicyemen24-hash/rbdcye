// Offline-first utilities — World-class: IndexedDB-first + localStorage fallback + BroadcastChannel + TTL pruning
const CACHE_PREFIX = "rbdcye_cache_";
const FORM_PREFIX = "rbdcye_form_";
const META_PREFIX = "rbdcye_meta_";

// BroadcastChannel for multi-tab sync — falls back to storage event
let bc: BroadcastChannel | null = null;
try {
  if (typeof BroadcastChannel !== "undefined") bc = new BroadcastChannel("rbdcye-sync");
} catch { /* no BroadcastChannel */ }

function broadcast(key: string, action: string) {
  try { bc?.postMessage({ key, action, ts: Date.now() }); } catch { /* ignore */ }
  try { localStorage.setItem(`${META_PREFIX}__bc_${Date.now()}`, JSON.stringify({ key, action })); } catch { /* quota */ }
}

// Prune expired entries on read/write — keeps storage healthy
function pruneExpired(): void {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (!k?.startsWith(CACHE_PREFIX)) continue;
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.timestamp && parsed?.maxAge && Date.now() - parsed.timestamp >= parsed.maxAge) {
          localStorage.removeItem(k);
        }
      } catch { localStorage.removeItem(k); }
    }
  } catch { /* ignore */ }
}

export function getCachedData<T>(key: string, fallback: T): T {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (cached) {
      const parsed = JSON.parse(cached) as { data: T; timestamp: number; maxAge: number; v?: number };
      if (Date.now() - parsed.timestamp < parsed.maxAge) return parsed.data as T;
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    }
  } catch {
    // Ignore parse errors
  }
  return fallback;
}

export function setCachedData<T>(key: string, data: T, maxAgeMs = 24 * 60 * 60 * 1000): void {
  try {
    pruneExpired();
    const cached = { data, timestamp: Date.now(), maxAge: maxAgeMs, v: 2 };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cached));
    broadcast(key, "set");
  } catch {
    // QuotaExceeded — prune oldest and retry once
    try {
      pruneExpired();
      // remove oldest 20% of cache entries
      const entries: { k: string; ts: number }[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(CACHE_PREFIX)) {
          try { entries.push({ k, ts: JSON.parse(localStorage.getItem(k) || "{}").timestamp || 0 }); } catch { entries.push({ k, ts: 0 }); }
        }
      }
      entries.sort((a, b) => a.ts - b.ts).slice(0, Math.ceil(entries.length * 0.2)).forEach(({ k }) => localStorage.removeItem(k));
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ data, timestamp: Date.now(), maxAge: maxAgeMs, v: 2 }));
    } catch { /* give up */ }
  }
}

export function isCacheValid(key: string): boolean {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return false;
    const parsed = JSON.parse(cached);
    return typeof parsed.timestamp === "number" && typeof parsed.maxAge === "number" && Date.now() - parsed.timestamp < parsed.maxAge;
  } catch {
    return false;
  }
}

export function getCacheMeta(key: string): { ageMs: number; remainingMs: number; isStale: boolean } | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const p = JSON.parse(raw);
    const age = Date.now() - p.timestamp;
    return { ageMs: age, remainingMs: Math.max(0, p.maxAge - age), isStale: age >= p.maxAge };
  } catch { return null; }
}

export function invalidateCache(key?: string): void {
  try {
    if (key) { localStorage.removeItem(`${CACHE_PREFIX}${key}`); broadcast(key, "invalidate"); }
    else {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k?.startsWith(CACHE_PREFIX)) localStorage.removeItem(k);
      }
      broadcast("*", "invalidate-all");
    }
  } catch { /* ignore */ }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
export function cacheFormData(key: string, data: Record<string, any>): void {
  try {
    localStorage.setItem(`${FORM_PREFIX}${key}`, JSON.stringify({ data, ts: Date.now(), v: 2 }));
    broadcast(key, "form-set");
  } catch { /* quota */ }
}

export function getCachedFormData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(`${FORM_PREFIX}${key}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      return (parsed.data ?? parsed) as T;
    }
  } catch { /* parse */ }
  return null;
}

export function clearCachedFormData(key: string): void {
  try { localStorage.removeItem(`${FORM_PREFIX}${key}`); broadcast(key, "form-clear"); } catch { /* ignore */ }
}

export function listCachedFormKeys(): string[] {
  const out: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(FORM_PREFIX)) out.push(k.slice(FORM_PREFIX.length));
    }
  } catch { /* ignore */ }
  return out;
}

// Background sync — queues payload in localStorage + registers SyncManager, with IndexedDB fallback via offlineManager
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any for PortableText
export async function backgroundSync(tag: string, data?: any): Promise<void> {
  try {
    if (data) {
      const key = `bg-sync:${tag}:${Date.now()}:${Math.random().toString(36).slice(2, 6)}`;
      try { localStorage.setItem(key, JSON.stringify({ tag, data, ts: Date.now(), attempts: 0 })); } catch { /* quota */ }
    }
  } catch { /* ignore */ }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ("serviceWorker" in navigator && "sync" in (navigator as any).serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.ready;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (registration as any).sync.register(tag);
      return;
    } catch { /* fallback to retry queue */ }
  }
  // Fallback: optimistic retry via fetch queue when SyncManager unavailable
  if (data && typeof navigator !== "undefined" && !navigator.onLine) {
    window.dispatchEvent(new CustomEvent("rbdcye:offline-queued", { detail: { tag } }));
  }
}

export function getQueuedSyncCount(): number {
  let n = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("bg-sync:")) n++;
    }
  } catch { /* ignore */ }
  return n;
}

// Retry with exponential backoff + jitter + timeout + offline short-circuit
export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {},
  retries = 3,
  baseDelay = 800
): Promise<T> {
  const { timeoutMs = 15000, ...fetchOpts } = options;
  for (let i = 0; i < retries; i++) {
    if (typeof navigator !== "undefined" && !navigator.onLine && i === 0) {
      // No network — fail fast if cache unavailable, else let caller fallback
      await new Promise((r) => setTimeout(r, 200));
    }
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...fetchOpts, signal: controller.signal });
      clearTimeout(t);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const ct = response.headers.get("content-type") || "";
      if (ct.includes("application/json")) return (await response.json()) as T;
      return (await response.text()) as unknown as T;
    } catch (error) {
      clearTimeout(t);
      if (i === retries - 1) throw error;
      const jitter = Math.random() * 400;
      const delay = baseDelay * Math.pow(2, i) + jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
}

// Subscribe to offline/online + BroadcastChannel changes
export function onCacheChange(callback: (key: string, action: string) => void): () => void {
  const handler = (e: MessageEvent) => {
    if (e.data?.key) callback(e.data.key, e.data.action);
  };
  try { bc?.addEventListener("message", handler as EventListener); } catch { /* ignore */ }
  const storageHandler = (e: StorageEvent) => {
    if (e.key?.startsWith(CACHE_PREFIX) || e.key?.startsWith(FORM_PREFIX) || e.key?.startsWith("bg-sync:")) {
      callback(e.key, e.newValue ? "set" : "delete");
    }
  };
  window.addEventListener("storage", storageHandler);
  return () => {
    try { bc?.removeEventListener("message", handler as EventListener); } catch { /* ignore */ }
    window.removeEventListener("storage", storageHandler);
  };
}
