// ============================================================
// database.ts - أنواع بيانات جميع جداول قاعدة البيانات
// ============================================================

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  is_read: boolean;
  user_id?: string;
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Career {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  type: "full_time" | "part_time" | "contract" | "remote";
  status: "active" | "closed" | "draft";
  requirements?: string;
  salary_range?: string;
  application_email?: string;
  created_at: string;
  updated_at: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client_name: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  image?: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  type: "post" | "project" | "product" | "media" | "knowledge";
  icon?: string;
  order_index: number;
  status: "active" | "inactive";
  created_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: "post" | "page" | "project" | "product" | "case_study";
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  author_id?: string;
  featured_image?: string;
  is_featured: boolean;
  view_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  email?: string;
  phone?: string;
  amount: number;
  project?: string;
  method: "card" | "bank" | "cash" | "other";
  type: "once" | "monthly" | "yearly";
  status: "pending" | "completed" | "failed" | "refunded";
  notes?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location: string;
  type: "online" | "offline" | "hybrid";
  image?: string;
  max_participants?: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order_index: number;
  status: "active" | "inactive";
  created_at: string;
}

export interface KnowledgeBase {
  id: string;
  title: string;
  content: string;
  category_id?: string;
  keywords?: string[];
  status: "PUBLISHED" | "DRAFT";
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: "image" | "video" | "document" | "audio";
  size?: string;
  mime_type?: string;
  alt_text?: string;
  created_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  template?: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  is_homepage: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id?: string;
  category_id?: string;
  featured_image?: string;
  tags?: string[];
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  is_featured: boolean;
  view_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: "active" | "completed" | "pending" | "cancelled";
  progress: number;
  budget?: string;
  beneficiaries?: number;
  location?: string;
  start_date?: string;
  end_date?: string;
  manager?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface SEO {
  id: string;
  page_url: string;
  title: string;
  description: string;
  keywords?: string[];
  og_image?: string;
  og_title?: string;
  og_description?: string;
  canonical_url?: string;
  no_index: boolean;
  no_follow: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: "contact" | "donation" | "volunteer" | "support" | "partnership";
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "closed";
  assigned_to?: string;
  response?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  source: "website" | "contact" | "donation" | "volunteer" | "manual";
  status: "active" | "pending" | "unsubscribed";
  last_request_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SuccessStory {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  name: string;
  role?: string;
  program?: string;
  category?: string;
  year?: string;
  location?: string;
  image?: string;
  rating: number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  type?: string;
  count: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  avatar?: string;
  rating: number;
  status: "PUBLISHED" | "DRAFT";
  created_at: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  field?: string;
  experience?: string;
  availability?: string;
  motivation?: string;
  hours: number;
  status: "pending" | "active" | "inactive" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface WebsiteSetting {
  id: string;
  key: string;
  value: any;
  type: "text" | "json" | "image" | "boolean" | "array";
  group: string;
  description?: string;
  updated_at: string;
}
