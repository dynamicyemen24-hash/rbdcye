export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export const API_ENDPOINTS = {
  NEWS: {
    LIST: "/news",
    DETAIL: (id: string) => `/news/${id}`,
    FEATURED: "/news/featured",
    CATEGORIES: "/news/categories",
    BY_SLUG: (slug: string) => `/news/slug/${slug}`,
  },
  PROJECTS: {
    LIST: "/projects",
    DETAIL: (id: string) => `/projects/${id}`,
    CATEGORIES: "/projects/categories",
  },
  DONATIONS: {
    CAMPAIGNS: "/donations/campaigns",
    CREATE: "/donations",
    HISTORY: "/donations/history",
  },
  MEDIA: {
    UPLOAD: "/media/upload",
    LIST: "/media",
    DELETE: (id: string) => `/media/${id}`,
  },
  DASHBOARD: {
    METRICS: "/dashboard/metrics",
    ACTIVITY: "/dashboard/activity",
    KPI: "/dashboard/kpi",
  },
  PAGES: {
    LIST: "/pages",
    DETAIL: (slug: string) => `/pages/${slug}`,
  },
  PARTNERS: {
    LIST: "/partners",
  },
  MESSAGES: {
    SUBMIT: "/messages",
  },
} as const;

export const EASTER_EGG_KEYS = {
  QIBLA_COMPASS: "show_qibla_compass",
  DONATION_ANIMATION: "donation_confetti",
  SECRET_PAGE: "secret_projects",
  DEVELOPER_MODE: "dev_mode",
  SPECIAL_GREETING: "ramadan_greeting",
  INTERACTIVE_MAP: "map_3d_view",
} as const;
