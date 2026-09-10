// Offline-First Manager with IndexedDB + Background Sync
// Works completely offline, syncs silently in background

const DB_NAME = 'rbdcye-offline';
const DB_VERSION = 1;

interface OfflineRecord {
  id: string;
  store: string;
  data: unknown;
  timestamp: number;
  synced: boolean;
  action: 'create' | 'update' | 'delete';
}

class OfflineManager {
  private db: IDBDatabase | null = null;
  private syncQueue: OfflineRecord[] = [];
  private isOnline = navigator.onLine;
  private listeners: Set<() => void> = new Set();

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Core data stores
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('donations')) {
          const store = db.createObjectStore('donations', { keyPath: 'id' });
          store.createIndex('by_email', 'donor_email');
          store.createIndex('by_status', 'payment_status');
        }
        if (!db.objectStoreNames.contains('policies')) {
          db.createObjectStore('policies', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('news')) {
          db.createObjectStore('news', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('pages')) {
          db.createObjectStore('pages', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        
        // Sync queue
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
          syncStore.createIndex('by_synced', 'synced');
        }
        
        // Cache metadata
        if (!db.objectStoreNames.contains('cache_meta')) {
          db.createObjectStore('cache_meta', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.setupOnlineListener();
        this.processSyncQueue();
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.listeners.forEach(l => l());
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.listeners.forEach(l => l());
    });
  }

  onStatusChange(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getIsOnline(): boolean {
    return this.isOnline;
  }

  // Generic CRUD operations
  async get<T>(store: string, id: string): Promise<T | null> {
    if (!this.db) return null;
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAll<T>(store: string): Promise<T[]> {
    if (!this.db) return [];
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async put<T>(store: string, data: T): Promise<void> {
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readwrite');
      tx.objectStore(store).put(data);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async delete(store: string, id: string): Promise<void> {
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readwrite');
      tx.objectStore(store).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Queue a mutation for sync
  async queueMutation(store: string, action: 'create' | 'update' | 'delete', data: unknown): Promise<void> {
    const record: OfflineRecord = {
      id: `${store}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      store,
      data,
      timestamp: Date.now(),
      synced: false,
      action,
    };
    
    this.syncQueue.push(record);
    await this.put('sync_queue', record);
    
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  // Process sync queue in background
  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || !this.db) return;
    
    const unsynced = await new Promise<OfflineRecord[]>((resolve, reject) => {
      const tx = this.db!.transaction('sync_queue', 'readonly');
      const index = tx.objectStore('sync_queue').index('by_synced');
      const req = index.getAll(IDBKeyRange.only(0));
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    for (const record of unsynced) {
      try {
        await this.syncRecord(record);
        record.synced = true;
        await this.put('sync_queue', record);
      } catch (err) {
        console.error('[Sync] Failed:', record.id, err);
        // Will retry on next online event
      }
    }
  }

  private async syncRecord(record: OfflineRecord): Promise<void> {
    // Import the actual API services dynamically
    const { donationDBService } = await import('../donation/donation-db.service');
    
    switch (record.store) {
      case 'donations':
        if (record.action === 'create') {
          await donationDBService.createDonation(record.data as any);
        }
        break;
      case 'projects':
        // Projects are read-only from public side
        break;
    }
  }

  // Cache with TTL
  async cacheWithTTL(store: string, key: string, data: unknown, ttlMs: number): Promise<void> {
    await this.put(store, { id: key, data, cachedAt: Date.now(), ttl: ttlMs });
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
}

export const offlineManager = new OfflineManager();
