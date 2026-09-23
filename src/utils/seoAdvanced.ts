// Advanced SEO System - JSON-LD, Open Graph, Twitter Cards, Sitemap
import { useEffect } from "react";

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  alt?: string;
  url?: string;
  type?: "website" | "article" | "organization";
  publishedTime?: string;
  modifiedTime?: string;
  author?: {
    name: string;
    url?: string;
  };
  section?: string;
  tags?: string[];
  noindex?: boolean;
}

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "NonprofitOrganization";
  name: string;
  alternateName?: string[];
  legalName?: string;
  foundingDate?: string;
  description: string;
  url: string;
  logo?: string;
  email?: string;
  telephone?: string;
  areaServed?: {
    "@type": "Country";
    name: string;
  };
  address?: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressCountry: string;
  };
  sameAs?: string[];
}

interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  description: string;
  url: string;
  potentialAction: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
}

interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

/**
 * Arabic labels for known public routes — used to build route-aware
 * BreadcrumbList JSON-LD. Unknown paths yield no breadcrumb (junk-free).
 */
const ROUTE_LABELS: Record<string, string> = {
  "/": "الرئيسية",
  "/about": "من نحن",
  "/programs": "برامجنا",
  "/projects": "مشاريعنا",
  "/services": "خدماتنا",
  "/donate": "تبرع الآن",
  "/contact": "تواصل معنا",
  "/news": "الأخبار",
  "/success": "قصص النجاح",
  "/campaigns": "الحملات",
  "/impact": "الأثر المجتمعي",
  "/impact-center": "مركز الأثر",
  "/impact-engine": "محرك الأثر",
  "/impact-for-business": "الأثر للأعمال",
  "/volunteer": "التطوع",
  "/zakat": "الزكاة",
  "/zakat-calculator": "حاسبة الزكاة",
  "/sadaqah-jariyah": "الصدقة الجارية",
  "/transparency": "الشفافية",
  "/reports": "التقارير",
  "/media": "المركز الإعلامي",
  "/partners": "الشركاء",
  "/endowment": "الوقف",
  "/training": "التدريب",
  "/corporate": "الشراكة المؤسسية",
  "/interactive-map": "الخريطة التفاعلية",
  "/help": "مركز المساعدة",
  "/subscribe": "الاشتراكات",
  "/feedback": "الشكاوى والاقتراحات",
  "/privacy-policy": "سياسة الخصوصية",
  "/major-donors": "كبار المتبرعين",
  "/donor-journey": "رحلة المتبرع",
  "/smart-advisor": "المستشار الذكي",
  "/requests": "طلب المساعدة",
  "/donor": "بوابة المتبرع",
  "/login": "تسجيل الدخول",
  "/donor-passport": "جواز المتبرع",
  "/messages": "الرسائل",
};

class SEOManager {
  private static instance: SEOManager;
  private currentData: Partial<SEOData> = {};

  static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager();
    }
    return SEOManager.instance;
  }

  update(data: SEOData) {
    this.currentData = data;
    this.applyToDOM(data);
  }

  private applyToDOM(data: SEOData) {
    // Path-aware absolute URL — every SPA route must self-canonicalize,
    // otherwise inner pages keep the homepage canonical from index.html
    // and Google consolidates them as duplicates of "/".
    const pageUrl = data.url || this.getCurrentUrl();
    const image = absolutizeUrl(data.image || DEFAULT_IMAGE);
    const alt = data.alt || data.title;

    // Update title
    document.title = data.title;

    // robots — preserve rich-snippet directives on indexable pages
    if (data.noindex) {
      this.setMeta("robots", "noindex, nofollow");
    } else {
      this.setMeta(
        "robots",
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      );
    }

    // Update meta tags
    this.setMeta("description", data.description);
    if (data.keywords) {
      this.setMeta("keywords", data.keywords.join(", "));
    }

    // Canonical (self-referencing per route)
    this.setCanonical(pageUrl);

    // Open Graph — locale aligned with index.html (ar_YE), absolute image
    this.setMeta("og:title", data.title);
    this.setMeta("og:description", data.description);
    this.setMeta("og:type", data.type || "website");
    this.setMeta("og:url", pageUrl);
    this.setMeta("og:locale", "ar_YE");
    this.setMeta("og:locale:alternate", "en_US");
    this.setMeta("og:image", image);
    this.setMeta("og:image:width", "1200");
    this.setMeta("og:image:height", "630");
    this.setMeta("og:image:alt", alt);
    if (data.keywords) {
      this.setMeta("og:tags", data.keywords.join(", "));
    }
    this.setMeta("article:publisher", "https://www.facebook.com/rbdcye");
    this.setMeta("article:author", data.author?.name || "فريق التحرير");

    // Twitter Card
    this.setMeta("twitter:card", "summary_large_image");
    this.setMeta("twitter:site", isAdminSubdomain ? "@admin_rbdcye" : "@rbdcye");
    this.setMeta("twitter:creator", isAdminSubdomain ? "@admin_rbdcye" : "@rbdcye");
    this.setMeta("twitter:title", data.title);
    this.setMeta("twitter:description", data.description);
    this.setMeta("twitter:image", image);
    this.setMeta("twitter:image:alt", alt);

    // JSON-LD schemas (replace the static index.html copies by id)
    this.injectSchema("organization", this.getOrganizationSchema());
    this.injectSchema("website", this.getWebSiteSchema());
    if (data.type === "article") {
      this.injectSchema("article", this.getArticleSchema(data));
    }
    const breadcrumb = this.getRouteBreadcrumbSchema();
    if (breadcrumb) {
      this.injectSchema("breadcrumb-route", breadcrumb);
    }
  }

  /** Absolute canonical for the current SPA route (production origin). */
  private getCurrentUrl(): string {
    if (typeof window === "undefined") return SITE_URL;
    const path = window.location.pathname.replace(/\/+$/, "");
    return `${SITE_URL.replace(/\/+$/, "")}${path}`;
  }

  /** Self-referencing canonical link for the current route. */
  private setCanonical(url: string) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }

  /** Route-aware BreadcrumbList (الرئيسية ← … ← الحالية); null for unknown paths. */
  private getRouteBreadcrumbSchema(): BreadcrumbSchema | null {
    if (typeof window === "undefined") return null;
    const base = SITE_URL.replace(/\/+$/, "");
    const segments = window.location.pathname.split("/").filter(Boolean);
    const items: BreadcrumbSchema["itemListElement"] = [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${base}/` },
    ];
    let accumulator = base;
    for (const segment of segments) {
      const label = ROUTE_LABELS[`/${segment}`];
      if (!label) return null;
      accumulator += `/${segment}`;
      items.push({
        "@type": "ListItem",
        position: items.length + 1,
        name: label,
        item: accumulator,
      });
    }
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    };
  }

  private setMeta(name: string, content: string) {
    const selector = `meta[property="${name}"], meta[name="${name}"]`;
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      if (name.startsWith("og:") || name.startsWith("twitter:")) {
        element.setAttribute("property", name);
      } else {
        element.setAttribute("name", name);
      }
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  }

  private injectSchema(id: string, schema: object) {
    const existing = document.getElementById(`schema-${id}`);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = `schema-${id}`;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  private getOrganizationSchema(): OrganizationSchema {
    const baseUrl = SITE_URL;
    const host = getSiteHost(baseUrl);
    return {
      "@context": "https://schema.org",
      "@type": "NonprofitOrganization",
      name: "مؤسسة رحماء بينهم للإغاثة والتنمية",
      alternateName: ["رحماء بينهم", "Rohamaa Foundation", "RBDCYE"],
      legalName: "مؤسسة رحماء بينهم للإغاثة والتنمية باليمن",
      foundingDate: "2014",
      description: "الموقع الإلكتروني التعريفي الرسمي لـ رحماء بينهم للإغاثة والتنمية باليمن",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      email: `info@${host}`,
      telephone: "+967-780-777-007",
      areaServed: {
        "@type": "Country",
        name: "اليمن",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "صنعاء",
        addressCountry: "YE",
      },
      sameAs: [
        "https://twitter.com/rbdcye",
        "https://facebook.com/rbdcye",
        "https://instagram.com/rbdcye",
        "https://youtube.com/@rbdcye",
      ],
    };
  }

  private getWebSiteSchema(): WebSiteSchema {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "رحماء بينهم",
      description: "الموقع الإلكتروني التعريفي الرسمي لـ رحماء بينهم للإغاثة والتنمية باليمن",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };
  }

  private getArticleSchema(data: SEOData): ArticleSchema {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.publishedTime || new Date().toISOString(),
      dateModified: data.modifiedTime || new Date().toISOString(),
      author: {
        "@type": "Person",
        name: data.author?.name || "فريق التحرير",
      },
      publisher: {
        "@type": "Organization",
        name: "رحماء بينهم",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
      },
    };
  }

  generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbSchema {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQSchema {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }
}

export const seoManager = SEOManager.getInstance();

// Hook for SEO - Must be called inside React component
export function useSEO(data: SEOData) {
  useEffect(() => {
    seoManager.update(data);
  }, [data]);
}

// Constants - use environment variable or default
const siteUrl = import.meta.env.VITE_APP_URL || "https://rbdcye.org";
export const SITE_URL = siteUrl;
export const DEFAULT_IMAGE = `${siteUrl.replace(/\/+$/, "")}/og-image.png`;

/** Resolve root-relative asset paths to absolute URLs (og:image must be absolute). */
function absolutizeUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const base = SITE_URL.replace(/\/+$/, "");
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}
export const ORGANIZATION_NAME = "رحماء بينهم";

// Safe hostname extraction with fallback (avoids throwing on relative URLs)
export function getSiteHost(url: string = SITE_URL, fallback = "rbdcye.org"): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return fallback;
  }
}

// Admin subdomain detection
export const isAdminSubdomain = typeof window !== "undefined"
  ? window.location.hostname === "admin.rbdcye.org"
  : false;
