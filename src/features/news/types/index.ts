export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: NewsCategory;
  tags: string[];
  status: "DRAFT" | "REVIEW" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  authorId: string;
  authorName: string;
  reviewerId?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  deletedAt?: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  bg: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  versionNo: number;
  content: Record<string, any>;
  changedBy: string;
  changedAt: string;
}

export interface NewsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  status?: string;
  featured?: boolean;
  search?: string;
  sortBy?: "createdAt" | "publishedAt" | "views" | "title";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
