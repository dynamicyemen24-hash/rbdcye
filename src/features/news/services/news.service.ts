import { NEWS_CATEGORIES } from "@/content/website";
import { dataService } from "@/shared/services/data.service";

import type { NewsItem, NewsQueryParams, PaginatedResponse, NewsCategory } from "../types";

const STORAGE_KEY = "rh_news_data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadNews = () => dataService.getAll<any>(STORAGE_KEY);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToNewsItem = (item: any): NewsItem => ({
  id: item.id,
  title: item.title,
  slug: item.title?.toLowerCase().replace(/[\s]+/g, "-") || "",
  content: item.content || item.excerpt || "",
  excerpt: item.excerpt || "",
  featuredImage: item.image || item.featuredImage || "",
  category: {
    id: item.id,
    name: item.category || "",
    slug: (item.category || "").toLowerCase(),
    color: item.categoryColor || "var(--muted-foreground)",
    bg: item.categoryBg || "var(--muted)",
  },
  tags: item.tags || [item.category || ""],
  status: item.status || "PUBLISHED",
  authorId: item.authorId || "1",
  authorName: item.authorName || "فريق رحماء بينهم",
  seo: {
    title: item.title || "",
    description: item.excerpt || "",
    keywords: item.tags || [item.category || ""],
    ogImage: item.image || item.featuredImage,
  },
  views: typeof item.views === "number" ? item.views : parseInt(item.views) || 0,
  featured: item.featured || false,
  createdAt: item.date || item.createdAt || new Date().toISOString(),
  updatedAt: item.date || item.updatedAt || new Date().toISOString(),
  publishedAt: item.date || item.publishedAt,
});

export const newsService = {
  async getNews(params: NewsQueryParams = {}): Promise<PaginatedResponse<NewsItem>> {
    let all = (await loadNews()).map(mapToNewsItem);

    // Apply filters
    if (params.category) {
      all = all.filter(
        (n) => n.category.name === params.category || n.category.slug === params.category
      );
    }
    if (params.status) {
      all = all.filter((n) => n.status === params.status);
    }
    if (params.featured !== undefined) {
      all = all.filter((n) => n.featured === params.featured);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      all = all.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.excerpt.toLowerCase().includes(q) ||
          n.tags.some((t) => t.includes(q))
      );
    }
    if (params.tag) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      all = all.filter((n) => n.tags.includes(params.tag!));
    }

    // Sort
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder || "desc";
    all.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aVal = (a as any)[sortBy] || "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bVal = (b as any)[sortBy] || "";
      if (typeof aVal === "number") return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
      return sortOrder === "desc"
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });

    // Paginate
    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);

    return { data, meta: { page, limit, total, totalPages } };
  },

  async getFeaturedNews(): Promise<NewsItem[]> {
    return (await loadNews())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((i: any) => i.featured && i.status !== "DRAFT")
      .map(mapToNewsItem);
  },

  async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    const found = (await loadNews()).find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (i: any) => i.slug === slug || i.title?.toLowerCase().replace(/\s+/g, "-") === slug
    );
    return found ? mapToNewsItem(found) : null;
  },

  async getNewsById(id: string): Promise<NewsItem | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const found = await dataService.getById<any>(STORAGE_KEY, id);
    return found ? mapToNewsItem(found) : null;
  },

  async getCategories(): Promise<NewsCategory[]> {
    return NEWS_CATEGORIES;
  },

  async createNews(item: Omit<NewsItem, "id"> & { id?: string }): Promise<NewsItem> {
    const newItem = {
      ...item,
      id: item.id || String(Date.now()),
      status: item.status || "PUBLISHED",
      views: 0,
      date: new Date().toLocaleDateString("ar-SA"),
      dateEn: new Date().toISOString().slice(0, 10),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return mapToNewsItem(await dataService.create<any>(STORAGE_KEY, newItem));
  },

  async updateNews(id: string, updates: Partial<NewsItem>): Promise<NewsItem | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await dataService.update<any>(STORAGE_KEY, id, updates);
    return updated ? mapToNewsItem(updated) : null;
  },

  async deleteNews(id: string): Promise<boolean> {
    return dataService.delete(STORAGE_KEY, id);
  },

  async incrementViews(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = await dataService.getById<any>(STORAGE_KEY, id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (item) await dataService.update<any>(STORAGE_KEY, id, { views: (item.views || 0) + 1 });
  },

  async getStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    featured: number;
    totalViews: number;
  }> {
    const data = await loadNews();
    return {
      total: data.length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      published: data.filter((n: any) => n.status === "PUBLISHED").length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      draft: data.filter((n: any) => n.status === "DRAFT").length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      featured: data.filter((n: any) => n.featured).length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalViews: data.reduce((sum: number, n: any) => sum + (n.views || 0), 0),
    };
  },

  async toggleFeature(id: string): Promise<NewsItem | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = await dataService.getById<any>(STORAGE_KEY, id);
    if (!item) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await dataService.update<any>(STORAGE_KEY, id, { featured: !item.featured });
    return updated ? mapToNewsItem(updated) : null;
  },

  async toggleStatus(id: string): Promise<NewsItem | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = await dataService.getById<any>(STORAGE_KEY, id);
    if (!item) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await dataService.update<any>(STORAGE_KEY, id, {
      status: item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
    });
    return updated ? mapToNewsItem(updated) : null;
  },
};
