import React from "react";

/**
 * Generate SEO-related meta tags and structured data
 */

interface SeoProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  canonicalUrl?: string;
  noIndex?: boolean;
  locale?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "رحماء بينهم",
    alternateName: "rbdcye Foundation",
    url: "https://rbdcye.org",
    logo: "https://rbdcye.org/logo.png",
    description:
      "منظمة إنسانية تنموية رائدة في اليمن، تعمل على تخفيف معاناة الأسرة اليمنية وتحقيق التنمية المستدامة",
    foundingDate: "2009",
    address: {
      "@type": "PostalAddress",
      addressCountry: "YE",
    },
    sameAs: [
      "https://facebook.com/rbdcye",
      "https://twitter.com/rbdcye",
      "https://youtube.com/@rbdcye",
    ],
  };
}

/**
 * Generate JSON-LD breadcrumbs
 */
export function getBreadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `https://rbdcye.org${item.href}` } : {}),
    })),
  };
}

/**
 * Generate comprehensive SEO head tags
 */
export function generateSeoMeta({
  title = "رحماء بينهم | rbdcye",
  description = "منظمة إنسانية تنموية رائدة في اليمن، تعمل على تخفيف معاناة الأسرة اليمنية وتحقيق التنمية المستدامة عبر برامج متكاملة في الإغاثة والتعليم والتنمية المجتمعية.",
  ogImage = "https://rbdcye.org/og-default.jpg",
  ogTitle,
  ogDescription,
  twitterCard = "summary_large_image",
  canonicalUrl,
  noIndex = false,
  locale = "ar_YE",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  siteName = "رحماء بينهم",
}: SeoProps): React.ReactNode[] {
  const meta: React.ReactNode[] = [];

  // Charset and viewport
  meta.push(<meta charSet="utf-8" key="charset" />);
  meta.push(
    <meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />
  );

  // Title and description
  meta.push(<title key="title">{title}</title>);
  meta.push(<meta name="description" content={description} key="desc" />);

  // Canonical URL
  if (canonicalUrl) {
    meta.push(<link rel="canonical" href={canonicalUrl} key="canonical" />);
  }

  // Robots
  meta.push(
    <meta
      name="robots"
      content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}
      key="robots"
    />
  );

  // Open Graph
  meta.push(<meta property="og:locale" content={locale} key="oglocale" />);
  meta.push(<meta property="og:type" content={type} key="ogtype" />);
  meta.push(<meta property="og:site_name" content={siteName} key="ogsite" />);
  meta.push(<meta property="og:title" content={ogTitle || title} key="ogtitle" />);
  meta.push(
    <meta property="og:description" content={ogDescription || description} key="ogdesc" />
  );
  meta.push(<meta property="og:image" content={ogImage} key="ogimage" />);
  meta.push(
    <meta property="og:image:width" content="1200" key="ogiw" />
  );
  meta.push(
    <meta property="og:image:height" content="630" key="ogih" />
  );

  // Article-specific OG tags
  if (type === "article" && publishedTime) {
    meta.push(
      <meta property="article:published_time" content={publishedTime} key="articlept" />
    );
  }
  if (type === "article" && modifiedTime) {
    meta.push(
      <meta property="article:modified_time" content={modifiedTime} key="articlemt" />
    );
  }
  if (type === "article" && author) {
    meta.push(
      <meta property="article:author" content={author} key="articleauthor" />
    );
  }

  // Twitter Card
  meta.push(<meta name="twitter:card" content={twitterCard} key="twcard" />);
  meta.push(<meta name="twitter:title" content={ogTitle || title} key="twtitle" />);
  meta.push(
    <meta name="twitter:description" content={ogDescription || description} key="twdesc" />
  );
  meta.push(<meta name="twitter:image" content={ogImage} key="twimage" />);

  return meta;
}

/**
 * Generate Google Analytics / analytics script (placeholder)
 */
export function getAnalyticsScript(): React.ReactNode {
  return (
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID || "G-XXXXXXXXXX"}`}
      key="ga"
    />
  );
}