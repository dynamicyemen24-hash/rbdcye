// ============================================================
// supabase.service.ts - خدمة متكاملة لجميع جداول قاعدة البيانات
// مع دعم البحث والإضافة والتعديل والإيقاف والربط مع وسائل التواصل
// ============================================================
import { DB_SCHEMA, hasSupabaseConfig, supabase } from "./supabase.client";

// خريطة ربط أسماء الجداول
const TABLE_NAMES = {
  donations: "donations",
  projects: "projects",
  posts: "posts",
  pages: "pages",
  categories: "categories",
  subscribers: "subscribers",
  volunteers: "volunteers",
  service_requests: "service_requests",
  success_stories: "success_stories",
  testimonials: "testimonials",
  careers: "careers",
  events: "events",
  faqs: "faqs",
  tags: "tags",
  authors: "authors",
  media_library: "media_library",
  menu_items: "menu_items",
  menus: "menus",
  page_sections: "page_sections",
  seo_meta: "seo_meta",
  admin_notifications: "admin_notifications",
  case_studies: "case_studies",
  clients: "clients",
  content_items: "content_items",
  content_analytics: "content_analytics",
  glossary: "glossary",
  keywords: "keywords",
  knowledge_base: "knowledge_base",
  knowledge_categories: "knowledge_categories",
  products: "products",
  solutions: "solutions",
  website_settings: "website_settings",
} as const;

type TableName = (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES];

// ---------- Cache System ----------
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000;

function getCache<T>(key: string): T | null {
  const entry = queryCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  if (entry) queryCache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  if (queryCache.size > 200) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey) queryCache.delete(firstKey);
  }
  queryCache.set(key, { data, timestamp: Date.now() });
}

function invalidateTableCache(table: string) {
  for (const key of queryCache.keys()) {
    if (key.startsWith(table)) queryCache.delete(key);
  }
}

// ---------- Query Interfaces ----------
interface QueryOptions {
  columns?: string;
  filters?: Record<string, any>;
  search?: { field: string; query: string };
  range?: { from: number; to: number };
  orderBy?: { field: string; ascending?: boolean };
  limit?: number;
}

// ---------- Generic CRUD Service ----------
class SupabaseTableService {
  private table: TableName;

  constructor(table: TableName) {
    this.table = table;
  }

  private cacheKey(method: string, params?: string): string {
    return `${this.table}:${method}${params ? ":" + params : ""}`;
  }

  // جلب كل السجلات مع دعم البحث والترتيب والتصفح
  async getAll<T = any>(options: QueryOptions = {}): Promise<{ data: T[]; count: number }> {
    if (!supabase) return { data: [], count: 0 };

    const ck = this.cacheKey("getAll", JSON.stringify(options));
    const cached = getCache<{ data: T[]; count: number }>(ck);
    if (cached) return cached;

    try {
      let query = supabase
        .schema(DB_SCHEMA)
        .from(this.table)
        .select(options.columns || "*", { count: "exact" });

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return;
          if (typeof value === "object" && value.operator) {
            const { operator, val } = value;
            if (operator === "gte") query = query.gte(key, val);
            else if (operator === "lte") query = query.lte(key, val);
            else if (operator === "neq") query = query.neq(key, val);
            else if (operator === "like") query = query.ilike(key, `%${val}%`);
            else if (operator === "in") query = query.in(key, val);
          } else {
            query = query.eq(key, value);
          }
        });
      }

      if (options.search?.query) {
        query = query.ilike(options.search.field, `%${options.search.query}%`);
      }

      query = query.order(options.orderBy?.field || "created_at", {
        ascending: options.orderBy?.ascending ?? false,
      });

      if (options.range) {
        query = query.range(options.range.from, options.range.to);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const response = await query;
      const data = (response?.data || []) as T[];
      const count = response?.count ?? 0;

      const result = { data, count };
      setCache(ck, result);
      return result;
    } catch (error) {
      console.error(`Error fetching ${this.table}:`, error);
      return { data: [], count: 0 };
    }
  }

  // جلب سجل واحد بالـ ID
  async getById<T = any>(id: string | number): Promise<T | null> {
    if (!supabase) return null;

    const ck = this.cacheKey("getById", String(id));
    const cached = getCache<T>(ck);
    if (cached) return cached;

    try {
      const response = await supabase
        .schema(DB_SCHEMA)
        .from(this.table)
        .select("*")
        .eq("id", id)
        .single();

      if (response.error) throw response.error;
      if (response.data) setCache(ck, response.data as T);
      return response.data as T;
    } catch {
      return null;
    }
  }

  // إنشاء سجل جديد
  async create<T = any>(item: Partial<T>): Promise<T | null> {
    if (!supabase) return null;

    invalidateTableCache(this.table);
    try {
      const response = await supabase
        .schema(DB_SCHEMA)
        .from(this.table)
        .insert([{ ...item, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (response.error) throw response.error;
      return response.data as T;
    } catch (error) {
      console.error(`Error creating in ${this.table}:`, error);
      return null;
    }
  }

  // تحديث سجل
  async update<T = any>(id: string | number, updates: Partial<T>): Promise<T | null> {
    if (!supabase) return null;

    invalidateTableCache(this.table);
    try {
      const response = await supabase
        .schema(DB_SCHEMA)
        .from(this.table)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (response.error) throw response.error;
      return response.data as T;
    } catch (error) {
      console.error(`Error updating in ${this.table}:`, error);
      return null;
    }
  }

  // حذف سجل
  async delete(id: string | number): Promise<boolean> {
    if (!supabase) return false;

    invalidateTableCache(this.table);
    try {
      const response = await supabase.schema(DB_SCHEMA).from(this.table).delete().eq("id", id);

      return !response.error;
    } catch {
      return false;
    }
  }

  // تغيير الحالة (تفعيل/تعطيل)
  async toggleStatus(id: string | number, field: string = "status"): Promise<boolean> {
    const item = await this.getById<any>(id);
    if (!item) return false;

    const statuses: Record<string, string[]> = {
      status: ["active", "inactive", "pending", "suspended"],
      publish: ["PUBLISHED", "DRAFT", "ARCHIVED"],
    };

    const values = statuses[field] || ["active", "inactive"];
    const idx = values.indexOf(item[field]);
    const newStatus = values[(idx + 1) % values.length];

    const result = await this.update(id, { [field]: newStatus } as any);
    return result !== null;
  }

  // بحث متقدم في عدة حقول
  async search<T = any>(query: string, fields: string[], limit: number = 20): Promise<T[]> {
    if (!supabase) return [];

    try {
      let dbQuery = supabase.schema(DB_SCHEMA).from(this.table).select("*").limit(limit);

      if (query && fields.length > 0) {
        const conditions = fields.map((f) => `${f}.ilike.%${query}%`).join(",");
        dbQuery = dbQuery.or(conditions);
      }

      const response = await dbQuery;
      if (response.error) throw response.error;
      return (response.data || []) as T[];
    } catch {
      return [];
    }
  }

  // إحصاء عدد السجلات
  async count(filters?: Record<string, any>): Promise<number> {
    const result = await this.getAll({ filters, limit: 0 });
    return result.count;
  }
}

// ---------- Content Service للصفحات الثابتة والديناميكية ----------
class ContentService {
  async getPageBySlug(slug: string) {
    if (!supabase) return null;

    try {
      const response = await supabase
        .schema(DB_SCHEMA)
        .from("pages")
        .select("*, page_sections(*)")
        .eq("slug", slug)
        .eq("status", "PUBLISHED")
        .single();

      if (response.error) throw response.error;
      return response.data;
    } catch {
      return null;
    }
  }

  async getMenuBySlug(slug: string) {
    if (!supabase) return null;

    try {
      const response = await supabase
        .schema(DB_SCHEMA)
        .from("menus")
        .select("*, menu_items(*)")
        .eq("slug", slug)
        .single();

      if (response.error) throw response.error;
      return response.data;
    } catch {
      return null;
    }
  }

  async getSEOMeta(pageUrl: string) {
    if (!supabase) return null;

    try {
      const response = await supabase
        .schema(DB_SCHEMA)
        .from("seo_meta")
        .select("*")
        .eq("page_url", pageUrl)
        .single();

      if (response.error) throw response.error;
      return response.data;
    } catch {
      return null;
    }
  }
}

// ---------- Marketing Service ----------
class MarketingService {
  async getAllNewsletterSubscribers(page: number = 1, perPage: number = 20) {
    if (!supabase) return { data: [], count: 0 };

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    try {
      const response = await supabase
        .schema(DB_SCHEMA)
        .from("subscribers")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("created_at", { ascending: false });

      if (response.error) throw response.error;
      return { data: response.data || [], count: response.count ?? 0 };
    } catch {
      return { data: [], count: 0 };
    }
  }
}

// ---------- Export Services ----------
export const tableService = {
  admin_notifications: new SupabaseTableService(TABLE_NAMES.admin_notifications),
  authors: new SupabaseTableService(TABLE_NAMES.authors),
  careers: new SupabaseTableService(TABLE_NAMES.careers),
  case_studies: new SupabaseTableService(TABLE_NAMES.case_studies),
  categories: new SupabaseTableService(TABLE_NAMES.categories),
  clients: new SupabaseTableService(TABLE_NAMES.clients),
  content_items: new SupabaseTableService(TABLE_NAMES.content_items),
  donations: new SupabaseTableService(TABLE_NAMES.donations),
  events: new SupabaseTableService(TABLE_NAMES.events),
  faqs: new SupabaseTableService(TABLE_NAMES.faqs),
  glossary: new SupabaseTableService(TABLE_NAMES.glossary),
  keywords: new SupabaseTableService(TABLE_NAMES.keywords),
  knowledge_base: new SupabaseTableService(TABLE_NAMES.knowledge_base),
  knowledge_categories: new SupabaseTableService(TABLE_NAMES.knowledge_categories),
  media_library: new SupabaseTableService(TABLE_NAMES.media_library),
  menus: new SupabaseTableService(TABLE_NAMES.menus),
  menu_items: new SupabaseTableService(TABLE_NAMES.menu_items),
  pages: new SupabaseTableService(TABLE_NAMES.pages),
  page_sections: new SupabaseTableService(TABLE_NAMES.page_sections),
  posts: new SupabaseTableService(TABLE_NAMES.posts),
  products: new SupabaseTableService(TABLE_NAMES.products),
  projects: new SupabaseTableService(TABLE_NAMES.projects),
  seo_meta: new SupabaseTableService(TABLE_NAMES.seo_meta),
  service_requests: new SupabaseTableService(TABLE_NAMES.service_requests),
  solutions: new SupabaseTableService(TABLE_NAMES.solutions),
  subscribers: new SupabaseTableService(TABLE_NAMES.subscribers),
  success_stories: new SupabaseTableService(TABLE_NAMES.success_stories),
  tags: new SupabaseTableService(TABLE_NAMES.tags),
  testimonials: new SupabaseTableService(TABLE_NAMES.testimonials),
  volunteers: new SupabaseTableService(TABLE_NAMES.volunteers),
  website_settings: new SupabaseTableService(TABLE_NAMES.website_settings),
};

export const contentService = new ContentService();
export const marketingService = new MarketingService();

// ---------- Utility: الاتصال المباشر بقاعدة البيانات ----------
export { hasSupabaseConfig, supabase };

// ---------- Utility: إعادة تحميل البيانات ----------
export function refreshTable(table: string) {
  invalidateTableCache(table);
}
