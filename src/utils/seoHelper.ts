import { SITE_URL } from "./seoAdvanced";

/**
 * SEO Helper Utilities
 */

export const seoConfig = {
  // الصورة الافتراضية
  imageFallback: "/images/defaults/project-default.svg",
  ogImage: "/og-image.svg",

  // توليد meta tags
  generateMeta: (
    data: {
      title?: string;
      description?: string;
      image?: string;
      url?: string;
    } = {}
  ) => ({
    title: data.title || "رحماء بينهم للإغاثة والتنمية",
    description:
      data.description ||
      "الموقع الإلكتروني الرسمي لمؤسسة رحماء بينهم للإغاثة والتنمية باليمن",
    image: data.image || "/og-image.svg",
    url: data.url || SITE_URL,
  }),

  // توليد بيانات JSON-LD
  generateSchema: (
    data: {
      name?: string;
      url?: string;
    } = {}
  ) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name || "رحماء بينهم للإغاثة والتنمية",
    url: data.url || SITE_URL,
    logo: "/logo.svg",
    sameAs: [
      "https://facebook.com/rbdcye",
      "https://twitter.com/rbdcye",
      "https://youtube.com/@rbdcye",
      "https://instagram.com/rbdcye",
    ],
  }),
};

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "رحماء بينهم للإغاثة والتنمية",
    alternateName: "Rohamaa Baynahum Foundation",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: "مؤسسة إنسانية تنموية مستقلة مرخصة برقم ٤٨٢ بالجمهورية اليمنية، تهدف إلى تقديم الإغاثة العاجلة والحلول التنموية المستدامة.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "YE",
      addressLocality: "صنعاء",
    },
    sameAs: [
      "https://facebook.com/rbdcye",
      "https://twitter.com/rbdcye",
      "https://instagram.com/rbdcye",
    ],
  };
}

/**
 * توليد Schema للمقالات
 */
export function generateArticleSchema(data: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    image: data.image || "/og-image.svg",
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      "@type": "Organization",
      name: "حملة رحماء بينهم",
    },
  };
}
