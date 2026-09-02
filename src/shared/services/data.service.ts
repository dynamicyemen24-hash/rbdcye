import {
  SEED_DONATIONS,
  SEED_MEDIA,
  SEED_NEWS_ITEMS,
  SEED_PARTNERS,
  SEED_PROJECTS,
  SEED_REPORTS,
  SEED_SUCCESS_STORIES,
  SEED_USER_REQUESTS,
  SEED_VOLUNTEERS,
} from "@/content/website";
import { API_BASE_URL } from "@/shared/constants/api";
import { withRetry } from "@/shared/utils/errors";

import { postgresService } from "./postgres.service";
import { DB_SCHEMA, hasSupabaseConfig, supabase } from "./supabase.client";

// ========== CACHE SYSTEM ==========
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const STALE_TTL = 60 * 60 * 1000; // 1 hour stale-while-revalidate
const cache = new Map<string, { data: any; timestamp: number }>();
const pendingRequests = new Map<string, Promise<any>>();
const cacheHits = new Map<string, number>(); // track popular cache keys

function getCached<T>(key: string): { data: T; stale: boolean } | null {
  const entry = cache.get(key);
  if (!entry) return null;
  const age = Date.now() - entry.timestamp;
  if (age < CACHE_TTL) {
    cacheHits.set(key, (cacheHits.get(key) || 0) + 1);
    return { data: entry.data as T, stale: false };
  }
  if (age < STALE_TTL) {
    return { data: entry.data as T, stale: true };
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T) {
  if (cache.size > 300) {
    const sorted = [...cache.entries()]
      .map(([k, v]) => ({ key: k, timestamp: v.timestamp, hits: cacheHits.get(k) || 0 }))
      .sort((a, b) => a.hits - b.hits || a.timestamp - b.timestamp)
      .slice(0, 100);
    sorted.forEach(({ key }) => {
      cache.delete(key);
      cacheHits.delete(key);
    });
  }
  cache.set(key, { data, timestamp: Date.now() });
  cacheHits.set(key, (cacheHits.get(key) || 0) + 1);
}

function invalidateCache(entity: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(entity)) {
      cache.delete(key);
      cacheHits.delete(key);
    }
  }
}

// Deduplicate in-flight requests
function dedupeRequest<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }
  const promise = fetcher().finally(() => {
    pendingRequests.delete(key);
  });
  pendingRequests.set(key, promise);
  return promise;
}

// ========== ENTITY CONFIG ==========
const ENTITY_CONFIG: Record<
  string,
  { endpoint: string; seed: any[]; table?: string; orderBy?: string }
> = {
  rh_news_data: { endpoint: "/news", seed: SEED_NEWS_ITEMS, table: "posts", orderBy: "created_at" },
  rh_stories_data: {
    endpoint: "/stories",
    seed: SEED_SUCCESS_STORIES,
    table: "success_stories",
    orderBy: "created_at",
  },
  rh_partners_data: {
    endpoint: "/partners",
    seed: SEED_PARTNERS,
    table: "partners",
    orderBy: "created_at",
  },
  rh_projects_data: {
    endpoint: "/projects",
    seed: SEED_PROJECTS,
    table: "projects",
    orderBy: "created_at",
  },
  rh_reports_data: {
    endpoint: "/reports",
    seed: SEED_REPORTS,
    table: "reports",
    orderBy: "created_at",
  },
  rh_media_data: {
    endpoint: "/media",
    seed: SEED_MEDIA,
    table: "media_library",
    orderBy: "created_at",
  },
  rh_donations_data: {
    endpoint: "/donations",
    seed: SEED_DONATIONS,
    table: "donations",
    orderBy: "created_at",
  },
  rh_requests_data: {
    endpoint: "/messages",
    seed: SEED_USER_REQUESTS,
    table: "service_requests",
    orderBy: "created_at",
  },
  rh_volunteers_data: {
    endpoint: "/volunteers",
    seed: SEED_VOLUNTEERS,
    table: "volunteers",
    orderBy: "created_at",
  },
  rh_subscriber_accounts: {
    endpoint: "/subscribers",
    seed: [],
    table: "subscribers",
    orderBy: "created_at",
  },
  rh_dashboard_users: {
    endpoint: "/users",
    seed: [],
    table: "dashboard_users",
    orderBy: "created_at",
  },
};

// ========== HELPERS ==========
const normalizeEndpoint = (endpoint: string) => {
  const base = API_BASE_URL.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

const readPayload = (payload: any) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return payload;
};

const getItemTime = (item: any) => {
  const candidate = item?.updatedAt || item?.createdAt || item?.dateEn || item?.date;
  const timestamp = Date.parse(String(candidate || ""));
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const mergeLatestById = <T extends { id: string | number }>(primary: T[], secondary: T[]) => {
  const map = new Map<string, T>();
  [...secondary, ...primary].forEach((item) => {
    const key = String(item.id);
    const existing = map.get(key);
    if (!existing || getItemTime(item) >= getItemTime(existing)) {
      map.set(key, item);
    }
  });
  return Array.from(map.values());
};

const getAuthHeaders = (): Record<string, string> => {
  try {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

const toHeaderRecord = (headers: HeadersInit | undefined): Record<string, string> => {
  if (!headers) return {};
  if (headers instanceof Headers) return Object.fromEntries(headers.entries());
  if (Array.isArray(headers)) return Object.fromEntries(headers);
  return headers as Record<string, string>;
};

const toCamelKey = (key: string) =>
  key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
const toSnakeKey = (key: string) => key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

const normalizeRecord = (record: any) => {
  if (!record || typeof record !== "object" || Array.isArray(record)) return record;
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [toCamelKey(key), value]));
};

const normalizeRecords = <T>(records: any[]): T[] => records.map(normalizeRecord) as T[];

const prepareRecordForDatabase = (item: any) => {
  const prepared: Record<string, unknown> = {};
  Object.entries(item || {}).forEach(([key, value]) => {
    if (value === undefined) return;
    prepared[toSnakeKey(key)] = value;
  });
  return prepared;
};

// ========== SANITIZATION & VALIDATION ==========
const SANITIZE_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /javascript\s*:/gi,
  /data:\s*text\/html/gi,
];

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    let sanitized = value;
    SANITIZE_PATTERNS.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, "");
    });
    return sanitized.trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, sanitizeValue(v)]));
  }
  return value;
}

function sanitizeRecord<T extends Record<string, unknown>>(record: T): T {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, sanitizeValue(value)])
  ) as T;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^[\d\s+\-()]{7,20}$/.test(phone);
}

// ========== DATA SERVICE ==========
class DataService {
  private getConfig(entity: string) {
    return ENTITY_CONFIG[entity] || { endpoint: `/${entity}`, seed: [] };
  }

  // --- Local Storage with size limit ---
  private getLocal<T>(entity: string): T[] {
    try {
      const data = localStorage.getItem(entity);
      if (data) {
        const parsed = JSON.parse(data) as T[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore parse errors
    }
    return [...this.getConfig(entity).seed] as T[];
  }

  private getStored<T>(entity: string): T[] | null {
    try {
      const data = localStorage.getItem(entity);
      if (!data) return null;
      const parsed = JSON.parse(data) as T[];
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  private setLocal(entity: string, items: unknown[]) {
    try {
      const limited = Array.isArray(items) ? items.slice(0, 500) : items;
      localStorage.setItem(entity, JSON.stringify(limited));
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        try {
          for (const key of Object.keys(localStorage)) {
            if (key.startsWith("rh_")) {
              localStorage.removeItem(key);
            }
          }
          localStorage.setItem(entity, JSON.stringify(items));
        } catch {
          // Give up silently
        }
      }
    }
  }

  // --- Secure HTTP request with timeout ---
  private async request<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...getAuthHeaders(),
      ...toHeaderRecord(init.headers),
    };

    try {
      const response = await fetch(normalizeEndpoint(endpoint), {
        ...init,
        headers,
        credentials: "include",
        signal: controller.signal,
      });

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        throw new Error(message || `API request failed with ${response.status}`);
      }

      if (response.status === 204) return undefined as T;
      return response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // --- PostgresService (Neon) ---
  private async fetchFromPostgres<T>(entity: string): Promise<T[]> {
    const mapping: Record<string, () => Promise<T[]>> = {
      rh_projects_data: () => postgresService.getProjects() as Promise<T[]>,
      rh_news_data: () => postgresService.getNews() as Promise<T[]>,
      rh_donations_data: () => postgresService.getDonations() as Promise<T[]>,
      rh_requests_data: () => postgresService.getRequests() as Promise<T[]>,
      rh_volunteers_data: () => postgresService.getVolunteers() as Promise<T[]>,
      rh_partners_data: () => postgresService.getPartners() as Promise<T[]>,
      rh_media_data: () => postgresService.getMedia() as Promise<T[]>,
      rh_reports_data: () => postgresService.getReports() as Promise<T[]>,
      rh_stories_data: () => postgresService.getSuccessStories() as Promise<T[]>,
      rh_subscriber_accounts: () => postgresService.getSubscribers() as Promise<T[]>,
      rh_dashboard_users: () => postgresService.getUsers() as Promise<T[]>,
    };
    const fetcher = mapping[entity];
    if (!fetcher) return [];
    return fetcher();
  }

  private async createInPostgres<T>(entity: string, item: any): Promise<T | null> {
    if (entity === "rh_projects_data") return postgresService.createProject(item) as any;
    if (entity === "rh_news_data") return postgresService.createNews(item) as any;
    if (entity === "rh_donations_data") return postgresService.createDonation(item) as any;
    if (entity === "rh_requests_data") return postgresService.createRequest(item) as any;
    if (entity === "rh_volunteers_data") return postgresService.createVolunteer(item) as any;
    if (entity === "rh_partners_data") return postgresService.createPartner(item) as any;
    if (entity === "rh_media_data") return postgresService.createMedia(item) as any;
    if (entity === "rh_reports_data") return postgresService.createReport(item) as any;
    if (entity === "rh_stories_data") return postgresService.createSuccessStory(item) as any;
    if (entity === "rh_dashboard_users") return postgresService.createUser(item) as any;
    return null;
  }

  private async updateInPostgres<T>(
    entity: string,
    id: string | number,
    updates: Partial<T>
  ): Promise<T | null> {
    if (entity === "rh_projects_data")
      return postgresService.updateProject(id as string, updates as any) as any;
    if (entity === "rh_news_data")
      return postgresService.updateNews(id as string, updates as any) as any;
    if (entity === "rh_donations_data") {
      await postgresService.updateDonationStatus(id as string, (updates as any).status);
      return null;
    }
    if (entity === "rh_requests_data") {
      await postgresService.updateRequestStatus(id as string, (updates as any).status);
      return null;
    }
    if (entity === "rh_volunteers_data") {
      await postgresService.updateVolunteerStatus(id as string, (updates as any).status);
      return null;
    }
    if (entity === "rh_partners_data")
      return postgresService.updatePartner(id as string, updates as any) as any;
    if (entity === "rh_reports_data")
      return postgresService.updateReport(id as string, updates as any) as any;
    if (entity === "rh_stories_data")
      return postgresService.updateSuccessStory(id as string, updates as any) as any;
    if (entity === "rh_dashboard_users") {
      await postgresService.updateUserRole(id as string, (updates as any).role);
      return null;
    }
    return null;
  }

  private async deleteInPostgres(entity: string, id: string | number): Promise<boolean> {
    if (entity === "rh_projects_data") {
      await postgresService.deleteProject(id as string);
      return true;
    }
    if (entity === "rh_news_data") {
      await postgresService.deleteNews(id as string);
      return true;
    }
    if (entity === "rh_partners_data") {
      await postgresService.deletePartner(id as string);
      return true;
    }
    if (entity === "rh_media_data") {
      await postgresService.deleteMedia(id as string);
      return true;
    }
    if (entity === "rh_reports_data") {
      await postgresService.deleteReport(id as string);
      return true;
    }
    if (entity === "rh_stories_data") {
      await postgresService.deleteSuccessStory(id as string);
      return true;
    }
    return false;
  }

  // --- Supabase with retry and fallback ---
  private async getSupabaseAll<T>(entity: string): Promise<T[] | null> {
    const config = this.getConfig(entity);
    if (!hasSupabaseConfig || !supabase || !config.table) return null;

    try {
      let response = await supabase
        .schema(DB_SCHEMA)
        .from(config.table)
        .select("*")
        .order(config.orderBy || "created_at", { ascending: false });

      if (response.error && config.orderBy) {
        response = await supabase.schema(DB_SCHEMA).from(config.table).select("*");
      }

      if (response.error) throw response.error;
      return normalizeRecords<T>(response.data || []);
    } catch {
      return null;
    }
  }

  private async getSupabaseById<T>(entity: string, id: string | number): Promise<T | null> {
    const config = this.getConfig(entity);
    if (!hasSupabaseConfig || !supabase || !config.table) return null;

    try {
      const response = await supabase
        .schema(DB_SCHEMA)
        .from(config.table)
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (response.error) throw response.error;
      return response.data ? (normalizeRecord(response.data) as T) : null;
    } catch {
      return null;
    }
  }

  private async createSupabase<T>(entity: string, item: any): Promise<T | null> {
    const config = this.getConfig(entity);
    if (!hasSupabaseConfig || !supabase || !config.table) return null;

    try {
      const sanitized = sanitizeRecord(prepareRecordForDatabase(item));
      const response = await supabase
        .schema(DB_SCHEMA)
        .from(config.table)
        .insert([sanitized])
        .select()
        .single();

      if (response.error) throw response.error;
      return normalizeRecord(response.data) as T;
    } catch {
      return null;
    }
  }

  private async updateSupabase<T>(
    entity: string,
    id: string | number,
    updates: Partial<T>
  ): Promise<T | null> {
    const config = this.getConfig(entity);
    if (!hasSupabaseConfig || !supabase || !config.table) return null;

    try {
      const sanitized = sanitizeRecord(
        prepareRecordForDatabase({ ...updates, updatedAt: new Date().toISOString() })
      );
      const response = await supabase
        .schema(DB_SCHEMA)
        .from(config.table)
        .update(sanitized)
        .eq("id", id)
        .select()
        .single();

      if (response.error) throw response.error;
      return normalizeRecord(response.data) as T;
    } catch {
      return null;
    }
  }

  private async deleteSupabase(entity: string, id: string | number): Promise<boolean | null> {
    const config = this.getConfig(entity);
    if (!hasSupabaseConfig || !supabase || !config.table) return null;

    try {
      const response = await supabase.schema(DB_SCHEMA).from(config.table).delete().eq("id", id);

      if (response.error) throw response.error;
      return true;
    } catch {
      return null;
    }
  }

  // ========== PUBLIC API ==========

  /**
   * Get all items for an entity.
   * Strategy: Cache → Postgres (Neon) → Supabase → HTTP API → LocalStorage → Seed data
   */
  async getAll<T extends { id: string | number }>(
    entity: string,
    forceRefresh: boolean = false
  ): Promise<T[]> {
    const cacheKey = `getAll:${entity}`;

    // 1. Check cache (with stale-while-revalidate)
    if (!forceRefresh) {
      const cached = getCached<T[]>(cacheKey);
      if (cached) {
        if (cached.stale) {
          this.refreshCacheInBackground(entity, cacheKey);
        }
        return cached.data;
      }
    }

    // 2. Get local stored data
    const stored = this.getStored<T>(entity);

    // 3. Try PostgresService (Neon/PostgreSQL - highest priority)
    try {
      const items = await withRetry(() => this.fetchFromPostgres<T>(entity), 2, 1000);
      if (Array.isArray(items) && items.length > 0) {
        const merged = stored ? mergeLatestById(items, stored) : items;
        this.setLocal(entity, merged);
        setCache(cacheKey, merged);
        return merged;
      }
    } catch {
      // Postgres failed, continue to next fallback
    }

    // 4. Try Supabase
    try {
      const items = await withRetry(() => this.getSupabaseAll<T>(entity), 2, 1000);
      if (Array.isArray(items) && items.length > 0) {
        const merged = stored ? mergeLatestById(items, stored) : items;
        this.setLocal(entity, merged);
        setCache(cacheKey, merged);
        return merged;
      }
    } catch {
      // Supabase failed, continue to next fallback
    }

    // 5. Try HTTP API
    try {
      const payload = await withRetry(
        () => this.request<any>(this.getConfig(entity).endpoint),
        2,
        1000
      );
      const items = readPayload(payload);
      if (Array.isArray(items) && items.length > 0) {
        const merged = stored ? mergeLatestById(items as T[], stored) : (items as T[]);
        this.setLocal(entity, merged);
        setCache(cacheKey, merged);
        return merged;
      }
    } catch {
      // API failed, continue to fallback
    }

    // 6. Fallback: stored data or seed data
    const result = stored || this.getLocal<T>(entity);
    setCache(cacheKey, result);
    return result;
  }

  /**
   * Background cache refresh - doesn't block UI
   */
  private async refreshCacheInBackground(entity: string, cacheKey: string) {
    try {
      const items = await withRetry(() => this.getSupabaseAll<any>(entity), 1, 2000);
      if (Array.isArray(items) && items.length > 0) {
        const stored = this.getStored<any>(entity);
        const merged = stored ? mergeLatestById(items, stored) : items;
        this.setLocal(entity, merged);
        setCache(cacheKey, merged);
      }
    } catch {
      // Background refresh failed silently - stale data is still usable
    }
  }

  /**
   * Get a single item by ID.
   */
  async getById<T extends { id: string | number }>(
    entity: string,
    id: string | number
  ): Promise<T | null> {
    const cacheKey = `getById:${entity}:${id}`;
    const cached = getCached<T>(cacheKey);
    if (cached) return cached.data;

    // Try PostgresService
    try {
      const items = await this.fetchFromPostgres<T>(entity);
      const result = items.find((item) => String(item.id) === String(id)) || null;
      if (result) {
        setCache(cacheKey, result);
        return result;
      }
    } catch {
      // Fall through
    }

    // Try Supabase
    try {
      const result = await withRetry(() => this.getSupabaseById<T>(entity, id), 2, 1000);
      if (result) {
        setCache(cacheKey, result);
        return result;
      }
    } catch {
      // Fall through
    }

    // Try HTTP API
    try {
      const payload = await withRetry(
        () => this.request<any>(`${this.getConfig(entity).endpoint}/${id}`),
        2,
        1000
      );
      const result = readPayload(payload) as T;
      if (result) {
        setCache(cacheKey, result);
        return result;
      }
    } catch {
      // Fall through
    }

    // Fallback to local storage
    const all = this.getStored<T>(entity) || this.getLocal<T>(entity);
    return all.find((item) => String(item.id) === String(id)) || null;
  }

  /**
   * Create a new item.
   * Writes to Postgres first, then falls back to Supabase, HTTP API, or local.
   */
  async create<T extends { id: string | number }>(entity: string, item: any): Promise<T> {
    invalidateCache(entity);

    const sanitizedItem = sanitizeRecord({ ...item });

    if (sanitizedItem.email && !validateEmail(String(sanitizedItem.email))) {
      throw new Error("Invalid email format");
    }
    if (sanitizedItem.phone && !validatePhone(String(sanitizedItem.phone))) {
      throw new Error("Invalid phone format");
    }

    // Try PostgresService first (Neon)
    try {
      const created = await withRetry(
        () => this.createInPostgres<T>(entity, sanitizedItem),
        2,
        1000
      );
      if (created) {
        const all = await this.getAll<T>(entity, true);
        this.setLocal(entity, [
          created,
          ...all.filter((entry) => String(entry.id) !== String(created.id)),
        ]);
        return created;
      }
    } catch {
      // Fall through
    }

    // Try Supabase
    try {
      const created = await withRetry(() => this.createSupabase<T>(entity, sanitizedItem), 2, 1000);
      if (created) {
        const all = await this.getAll<T>(entity, true);
        this.setLocal(entity, [
          created,
          ...all.filter((entry) => String(entry.id) !== String(created.id)),
        ]);
        return created;
      }
    } catch {
      // Fall through
    }

    // Try HTTP API
    try {
      const payload = await withRetry(
        () =>
          this.request<any>(this.getConfig(entity).endpoint, {
            method: "POST",
            body: JSON.stringify(sanitizedItem),
          }),
        2,
        1000
      );
      const created = readPayload(payload) as T;
      const all = await this.getAll<T>(entity, true);
      this.setLocal(entity, [
        created,
        ...all.filter((entry) => String(entry.id) !== String(created.id)),
      ]);
      return created;
    } catch {
      // Fall through to local
    }

    // Local fallback
    const all = this.getLocal<T>(entity);
    const now = new Date().toISOString();
    const newItem = {
      ...sanitizedItem,
      id: sanitizedItem.id || String(Date.now()),
      createdAt: sanitizedItem.createdAt || now,
      updatedAt: now,
    } as T;
    this.setLocal(entity, [newItem, ...all]);
    return newItem;
  }

  /**
   * Update an existing item.
   */
  async update<T extends { id: string | number }>(
    entity: string,
    id: string | number,
    updates: Partial<T>
  ): Promise<T | null> {
    invalidateCache(entity);

    const sanitizedUpdates = sanitizeRecord({ ...updates } as unknown as Record<string, unknown>);

    // Try PostgresService
    try {
      const updated = await withRetry(
        () => this.updateInPostgres<T>(entity, id, sanitizedUpdates as unknown as Partial<T>),
        2,
        1000
      );
      if (updated) {
        const all = await this.getAll<T>(entity, true);
        this.setLocal(
          entity,
          all.map((item) => (String(item.id) === String(id) ? updated : item))
        );
        return updated;
      }
    } catch {
      // Fall through
    }

    // Try Supabase
    try {
      const updated = await withRetry(
        () => this.updateSupabase<T>(entity, id, sanitizedUpdates as unknown as Partial<T>),
        2,
        1000
      );
      if (updated) {
        const all = await this.getAll<T>(entity, true);
        this.setLocal(
          entity,
          all.map((item) => (String(item.id) === String(id) ? updated : item))
        );
        return updated;
      }
    } catch {
      // Fall through
    }

    // Try HTTP API
    try {
      const payload = await withRetry(
        () =>
          this.request<any>(`${this.getConfig(entity).endpoint}/${id}`, {
            method: "PATCH",
            body: JSON.stringify(sanitizedUpdates),
          }),
        2,
        1000
      );
      const updated = readPayload(payload) as T;
      const all = await this.getAll<T>(entity, true);
      this.setLocal(
        entity,
        all.map((item) => (String(item.id) === String(id) ? updated : item))
      );
      return updated;
    } catch {
      // Fall through to local
    }

    // Local fallback
    const all = this.getLocal<T>(entity);
    const idx = all.findIndex((item) => String(item.id) === String(id));
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...sanitizedUpdates, updatedAt: new Date().toISOString() } as T;
    this.setLocal(entity, all);
    return all[idx];
  }

  /**
   * Delete an item.
   */
  async delete(entity: string, id: string | number): Promise<boolean> {
    invalidateCache(entity);

    // Try PostgresService
    try {
      const deleted = await withRetry(() => this.deleteInPostgres(entity, id), 2, 1000);
      if (deleted) {
        const all = this.getLocal<any>(entity);
        this.setLocal(
          entity,
          all.filter((item) => String(item.id) !== String(id))
        );
        return true;
      }
    } catch {
      // Fall through
    }

    // Try Supabase
    try {
      const deleted = await withRetry(() => this.deleteSupabase(entity, id), 2, 1000);
      if (deleted) {
        const all = this.getLocal<any>(entity);
        this.setLocal(
          entity,
          all.filter((item) => String(item.id) !== String(id))
        );
        return true;
      }
    } catch {
      // Fall through
    }

    // Try HTTP API
    try {
      await withRetry(
        () => this.request(`${this.getConfig(entity).endpoint}/${id}`, { method: "DELETE" }),
        2,
        1000
      );
    } catch {
      // Fall through
    }

    // Local fallback
    const all = this.getLocal<any>(entity);
    const filtered = all.filter((item) => String(item.id) !== String(id));
    if (filtered.length === all.length) return false;
    this.setLocal(entity, filtered);
    return true;
  }

  /**
   * Prefetch an entity into cache (for anticipated navigation)
   */
  prefetch(entity: string): void {
    const cacheKey = `getAll:${entity}`;
    if (getCached(cacheKey)) return; // Already cached
    this.getAll(entity).catch(() => {
      /* silent */
    });
  }

  /**
   * Clear all caches (for logout or forced refresh)
   */
  clearAllCaches(): void {
    cache.clear();
    cacheHits.clear();
    pendingRequests.clear();
  }
}

export const dataService = new DataService();
