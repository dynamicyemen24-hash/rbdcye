// Supabase Client - مع Fallback لقاعدة البيانات المحلية IndexedDB
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
export const DB_SCHEMA = import.meta.env.VITE_SUPABASE_SCHEMA || "gs_website";

// إذا لم تكن المفاتيح متوفرة، استخدم IndexedDB fallback
let supabaseInstance: any = null;

if (hasSupabaseConfig) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          "x-application-name": "rbdcye-website",
        },
      },
    });
  } catch {
    // Failed to initialize Supabase client, falling back to IndexedDB
  }
}

export const supabase = supabaseInstance;

// IndexedDB Fallback Class
class IndexedDBFallback {
  private dbName = "rbdcyeDB";
  private version = 2;

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const stores = [
          "posts",
          "success_stories",
          "partners",
          "projects",
          "reports",
          "media_library",
          "donations",
          "service_requests",
          "volunteers",
          "subscribers",
          "dashboard_users",
        ];

        stores.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
          }
        });
      };
    });
  }

  async getAll(table: string): Promise<any[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(table, "readonly");
      const store = transaction.objectStore(table);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async create(table: string, item: any): Promise<any> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(table, "readwrite");
      const store = transaction.objectStore(table);
      const request = store.put({ ...item, id: item.id || crypto.randomUUID() });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const idbFallback = new IndexedDBFallback();
