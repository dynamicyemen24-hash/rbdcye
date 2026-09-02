import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  structuredData?: Record<string, unknown>;
  canonical?: string;
}

const defaultSEO = {
  title: "رحماء بينهم - إغاثة وتنمية باليمن",
  description:
    "منظمة إنسانية تنموية مستقلة مرخصة برقم ٤٨٢ - نعمل على تحقيق التنمية المستدامة ومساعدة المجتمعات المحتاجة في اليمن",
  keywords: ["إغاثة", "تنمية", "يمن", "خير", "تبرعات", "رحماء بينهم"],
  image: "https://rbdcye.org/og-image.jpg",
  url: "https://rbdcye.org",
  type: "website",
};

export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type,
  structuredData,
  canonical,
}: SEOProps) {
  const fullTitle = title ? `${title} | رحماء بينهم` : defaultSEO.title;
  const metaDescription = description || defaultSEO.description;
  const metaImage = image || defaultSEO.image;
  const metaUrl = url || defaultSEO.url;
  const metaKeywords = keywords?.join(", ") || defaultSEO.keywords.join(", ");

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (property: string, content: string) => {
      let meta =
        document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        if (property.startsWith("og:")) {
          meta.setAttribute("property", property);
        } else {
          meta.setAttribute("name", property);
        }
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    updateMeta("og:title", fullTitle);
    updateMeta("og:description", metaDescription);
    updateMeta("og:image", metaImage);
    updateMeta("og:url", metaUrl);
    updateMeta("og:type", type || defaultSEO.type);
    updateMeta("og:locale", "ar_YE");
    updateMeta("og:site_name", "رحماء بينهم");

    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", metaDescription);
    updateMeta("twitter:image", metaImage);

    updateMeta("description", metaDescription);
    updateMeta("keywords", metaKeywords);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (link) {
        link.href = canonical;
      } else {
        link = document.createElement("link");
        link.rel = "canonical";
        link.href = canonical;
        document.head.appendChild(link);
      }
    }

    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [
    fullTitle,
    metaDescription,
    metaImage,
    metaUrl,
    type,
    metaKeywords,
    canonical,
    structuredData,
  ]);

  return null;
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "رحماء بينهم للإغاثة والتنمية باليمن",
  alternateName: "Rohamaa Foundation",
  url: "https://rbdcye.org",
  logo: "https://rbdcye.org/logo.png",
  description: "منظمة إنسانية تنموية مستقلة مرخصة برقم ٤٨٢",
  address: {
    "@type": "PostalAddress",
    addressCountry: "YE",
    addressRegion: "صنعاء",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Arabic", "English"],
  },
  sameAs: [
    "https://facebook.com/rbdcye",
    "https://twitter.com/rbdcye",
    "https://instagram.com/rbdcye",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "رحماء بينهم",
  url: "https://rbdcye.org",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://rbdcye.org/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};
