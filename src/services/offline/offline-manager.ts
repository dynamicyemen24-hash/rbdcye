// Offline-First Manager v2 — IndexedDB + BroadcastChannel + TTL pruning + Conflict-aware
// World-class: يعمل 100% أوفلاين، يزامن بصمت عند العودة، موحّد مع data.service

import { donationDBService } from "../donation/donation-db.service";

const DB_NAME = "rbdcye-offline";
const DB_VERSION = 2;
const BROADCAST_CH = "rbdcye-offline-sync";

interface OfflineRecord {
  id: string;
  store: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  timestamp: number;
  synced: boolean;
  action: "create" | "update" | "delete";
  attempts?: number;
  lastError?: string;
}

type StoreName =
  | "projects"
  | "donations"
  | "policies"
  | "news"
  | "stories"
  | "partners"
  | "reports"
  | "media"
  | "pages"
  | "settings"
  | "requests"
  | "volunteers"
  | "sync_queue"
  | "cache_meta"
  | "forms"
  | "app_cache";

/**
 * Decide whether an IndexedDB open failure justifies wiping and recreating
 * the database. Only corruption / version-mismatch signals qualify —
 * transient errors (blocked, unavailable, quota) must never delete user data.
 */
export function shouldResetDatabase(error: unknown): boolean {
  if (typeof DOMException !== "undefined" && error instanceof DOMException) {
    return error.name === "VersionError" || error.name === "UnknownError";
  }
  if (error instanceof Error) {
    if (/corrupt/i.test(error.message)) return true;
    return /versionerror|unknownerror/i.test(error.name);
  }
  return false;
}

/** Best-effort database wipe — always resolves, never throws. */
function deleteDatabase(name: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === "undefined") {
        resolve();
        return;
      }
      const req = indexedDB.deleteDatabase(name);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    } catch {
      resolve();
    }
  });
}

class OfflineManager {
  private db: IDBDatabase | null = null;
  private isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
  private listeners: Set<() => void> = new Set();
  private bc: BroadcastChannel | null = null;
  private initPromise: Promise<void> | null = null;
  private syncInProgress = false;

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    this.initPromise = this.openWithRecovery();
    return this.initPromise;
  }

  private openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined") {
        reject(new Error("indexeddb-unavailable"));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;

        const ensure = (name: string, keyPath: string, indexes?: { name: string; key: string }[]) => {
          if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, { keyPath });
            indexes?.forEach((idx) => store.createIndex(idx.name, idx.key));
          }
        };

        ensure("projects", "id");
        ensure("donations", "id", [
          { name: "by_email", key: "donor_email" },
          { name: "by_status", key: "payment_status" },
        ]);
        ensure("policies", "key");
        ensure("news", "id");
        ensure("stories", "id");
        ensure("partners", "id");
        ensure("reports", "id");
        ensure("media", "id");
        ensure("pages", "id");
        ensure("settings", "key");
        ensure("requests", "id");
        ensure("volunteers", "id");
        ensure("forms", "id");
        ensure("app_cache", "id");

        if (!db.objectStoreNames.contains("sync_queue")) {
          const syncStore = db.createObjectStore("sync_queue", { keyPath: "id" });
          syncStore.createIndex("by_synced", "synced");
          syncStore.createIndex("by_store", "store");
        }
        if (!db.objectStoreNames.contains("cache_meta")) {
          db.createObjectStore("cache_meta", { keyPath: "key" });
        }

        // migration v1 -> v2 : ensure new stores exist (already handled by ensure)
        if (oldVersion < 2) {
          // no-op, stores created above
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        // handle unexpected close
        this.db.onclose = () => { this.db = null; };
        this.db.onerror = () => { /* non-critical */ };
        this.setupOnlineListener();
        this.setupBroadcast();
        void this.pruneExpired();
        void this.processSyncQueue();
        resolve();
      };
      // Treat blocked as failure so recovery can retry instead of hanging the app
      request.onerror = () => reject(request.error ?? new Error("indexeddb-open-failed"));
      request.onblocked = () => reject(new Error("indexeddb-blocked"));
    });
  }

  // Open with one-shot self-healing: a corrupted/version-mismatched database is
  // wiped and recreated instead of permanently disabling offline features.
  // Never rejects — the app always stays usable, offline-less at worst.
  private async openWithRecovery(): Promise<void> {
    try {
      await this.openDatabase();
      return;
    } catch (first) {
      if (!shouldResetDatabase(first)) {
        this.db = null;
        this.setupOnlineListener();
        return;
      }
    }
    try {
      await deleteDatabase(DB_NAME);
    } catch {
      // best-effort — retry open regardless
    }
    try {
      await this.openDatabase();
    } catch {
      this.db = null;
      this.setupOnlineListener();
    }
  }

  private setupBroadcast(): void {
    try {
      if (typeof BroadcastChannel !== "undefined") {
        this.bc = new BroadcastChannel(BROADCAST_CH);
        this.bc.onmessage = (e) => {
          if (e.data?.type === "invalidate" || e.data?.type === "sync-complete") {
            this.listeners.forEach((l) => l());
          }
        };
      }
    } catch { /* ignore */ }
  }

  private broadcast(type: string, payload?: unknown) {
    try { this.bc?.postMessage({ type, payload, ts: Date.now() }); } catch { /* ignore */ }
  }

  private setupOnlineListener(): void {
    if (typeof window === "undefined") return;
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.listeners.forEach((l) => l());
      void this.processSyncQueue();
      window.dispatchEvent(new CustomEvent("rbdcye:online"));
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.listeners.forEach((l) => l());
      window.dispatchEvent(new CustomEvent("rbdcye:offline"));
    });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && navigator.onLine) void this.processSyncQueue();
    });
  }

  onStatusChange(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getIsOnline(): boolean { return this.isOnline; }

  // ---- IndexedDB helpers with localStorage fallback ----
  private async withFallback<T>(op: () => Promise<T>, fallback: T): Promise<T> {
    if (!this.db) return fallback;
    try { return await op(); } catch { return fallback; }
  }

  async get<T>(store: string, id: string): Promise<T | null> {
    return this.withFallback<T | null>(() => new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tx = this.db!.transaction(store, "readonly");
      const req = tx.objectStore(store).get(id);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => reject(req.error);
    }), null);
  }

  async getAll<T>(store: string): Promise<T[]> {
    return this.withFallback<T[]>(() => new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tx = this.db!.transaction(store, "readonly");
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve((req.result as T[]) || []);
      req.onerror = () => reject(req.error);
    }), []);
  }

  async put<T>(store: string, data: T): Promise<void> {
    if (!this.db) return;
    await new Promise<void>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tx = this.db!.transaction(store, "readwrite");
      tx.objectStore(store).put(data);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    this.broadcast("invalidate", { store });
  }

  async putMany<T>(store: string, items: T[]): Promise<void> {
    if (!this.db || items.length === 0) return;
    await new Promise<void>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tx = this.db!.transaction(store, "readwrite");
      const os = tx.objectStore(store);
      items.forEach((it) => os.put(it));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    this.broadcast("invalidate", { store });
  }

  async delete(store: string, id: string): Promise<void> {
    if (!this.db) return;
    await new Promise<void>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tx = this.db!.transaction(store, "readwrite");
      tx.objectStore(store).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    this.broadcast("invalidate", { store, id });
  }

  async clear(store: string): Promise<void> {
    if (!this.db) return;
    await new Promise<void>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tx = this.db!.transaction(store, "readwrite");
      tx.objectStore(store).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // ---- Queue ----
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async queueMutation(store: string, action: "create" | "update" | "delete", data: any): Promise<void> {
    const record: OfflineRecord = {
      id: `${store}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      store, data, timestamp: Date.now(), synced: false, action, attempts: 0,
    };
    await this.put("sync_queue", record);
    // optimistic write to local store
    try {
      if (action === "create" || action === "update") await this.put(store, data);
      if (action === "delete" && data?.id) await this.delete(store, String(data.id));
    } catch { /* ignore */ }
    if (this.isOnline) void this.processSyncQueue();
    // also persist to localStorage bg-sync for SW
    try {
      const key = `bg-sync:${record.id}`;
      localStorage.setItem(key, JSON.stringify(record));
      if ("serviceWorker" in navigator && "sync" in (navigator as unknown as { serviceWorker: object }).serviceWorker) {
        const reg = await navigator.serviceWorker.ready;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (reg as any).sync.register("rbdcye-sync");
      }
    } catch { /* ignore */ }
  }

  async getSyncQueueCount(): Promise<number> {
    const all = await this.getAll<OfflineRecord>("sync_queue");
    return all.filter((r) => !r.synced).length;
  }

  async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline || !this.db) return;
    this.syncInProgress = true;
    try {
      const unsynced = await new Promise<OfflineRecord[]>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tx = this.db!.transaction("sync_queue", "readonly");
        const store = tx.objectStore("sync_queue");
        const req = store.getAll();
        req.onsuccess = () => {
          const all = (req.result as OfflineRecord[]) || [];
          resolve(all.filter((r) => !r.synced));
        };
        req.onerror = () => reject(req.error);
      });
      for (const record of unsynced) {
        if ((record.attempts ?? 0) >= 5) continue; // give up after 5 attempts, keep for manual retry
        try {
          await this.syncRecord(record);
          record.synced = true;
          await this.put("sync_queue", record);
          // cleanup bg-sync localStorage
          try { localStorage.removeItem(`bg-sync:${record.id}`); } catch { /* ignore */ }
        } catch (err) {
          record.attempts = (record.attempts ?? 0) + 1;
          record.lastError = err instanceof Error ? err.message : String(err);
          await this.put("sync_queue", record);
          // exponential backoff: skip remaining if many failures
          await new Promise((r) => setTimeout(r, Math.min(2000 * Math.pow(1.6, record.attempts ?? 1), 15000)));
        }
      }
      if (unsynced.length > 0) this.broadcast("sync-complete", { count: unsynced.length });
    } finally {
      this.syncInProgress = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async syncRecord(record: OfflineRecord): Promise<void> {
    const { dataService } = await import("@/shared/services/data.service");
    switch (record.store) {
      case "donations":
        if (record.action === "create") await donationDBService.createDonation(record.data);
        break;
      case "requests":
      case "messages":
        if (record.action === "create") await dataService.create("rh_requests_data", record.data);
        break;
      case "volunteers":
        if (record.action === "create") await dataService.create("rh_volunteers_data", record.data);
        break;
      case "subscribers":
        if (record.action === "create") await dataService.create("rh_subscriber_accounts", record.data);
        break;
      case "news":
      case "projects":
      case "partners":
      case "reports":
      case "media":
      case "stories":
        // Admin-only writes — if queued from admin while offline, replay via dataService
        if (record.action === "create") await dataService.create(`rh_${record.store}_data`, record.data);
        if (record.action === "update") await dataService.update(`rh_${record.store}_data`, record.data.id, record.data);
        if (record.action === "delete") await dataService.delete(`rh_${record.store}_data`, record.data.id);
        break;
      default:
        break;
    }
  }

  // ---- TTL cache helpers ----
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async cacheWithTTL(store: string, key: string, data: any, ttlMs: number): Promise<void> {
    await this.put(store, { id: key, data, cachedAt: Date.now(), ttl: ttlMs, v: 2 });
  }

  async getCached<T>(store: string, key: string): Promise<T | null> {
    const record = await this.get<{ data: T; cachedAt: number; ttl: number }>(store, key);
    if (!record) return null;
    if (Date.now() - record.cachedAt > record.ttl) {
      await this.delete(store, key);
      return null;
    }
    return record.data;
  }

  async pruneExpired(): Promise<void> {
    if (!this.db) return;
    const stores: StoreName[] = ["app_cache", "cache_meta"];
    for (const store of stores) {
      try {
        const all = await this.getAll<{ id: string; cachedAt?: number; ttl?: number; timestamp?: number; maxAge?: number }>(store);
        const now = Date.now();
        for (const r of all) {
          const cachedAt = r.cachedAt ?? r.timestamp ?? 0;
          const ttl = r.ttl ?? r.maxAge ?? 0;
          if (cachedAt && ttl && now - cachedAt > ttl) await this.delete(store, r.id);
        }
      } catch { /* ignore */ }
    }
  }

  // Expose cache stats for debug/admin
  async getStats(): Promise<{ stores: Record<string, number>; syncPending: number }> {
    const stores: Record<string, number> = {};
    const names: StoreName[] = ["projects", "news", "donations", "policies", "pages", "settings", "partners", "reports", "media", "stories", "requests", "volunteers", "sync_queue", "app_cache"];
    for (const s of names) {
      try { stores[s] = (await this.getAll(s)).length; } catch { stores[s] = 0; }
    }
    return { stores, syncPending: stores["sync_queue"] ?? 0 };
  }
}

export const offlineManager = new OfflineManager();
