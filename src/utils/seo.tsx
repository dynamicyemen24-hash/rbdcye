import React from "react";

/**
 * SEO Props for generating meta tags and structured data
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
  type?: "website" | "article" | "organization";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  siteName?: string;
  extraMeta?: Array<{ name: string; content: string }>;
}

/**
 * Generate JSON-LD structured data for Organization (NGO)
 */
export function getOrganizationSchema(): React.ReactNode {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "رحماء بينهم",
    alternateName: "rbdcye Foundation",
    url: "https://rbdcye.org",
    description:
      "منظمة إنسانية تنموية رائدة في اليمن، تعمل على تخفيف معاناة الأسرة اليمنية وتحقيق التنمية المستدامة عبر برامج الإغاثة والتعليم والصحة والمياه",
    foundingDate: "2009",
    address: {
      "@type": "PostalAddress",
      addressCountry: "YE",
      addressLocality: "صنعاء",
    },
    sameAs: [
      "https://facebook.com/rbdcye",
      "https://twitter.com/rbdcye",
      "https://linkedin.com/company/rbdcye",
      "https://youtube.com/@rbdcye",
    ],
    email: "info@rbdcye.org",
    vatID: "YE123456789",
  };
  return <script type="application/ld+json">{JSON.stringify(schema, null, 2)}</script>;
}

/**
 * Generate JSON-LD breadcrumbs schema
 */
export function getBreadcrumbSchema(items: { label: string; href?: string }[]): React.ReactNode {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `https://rbdcye.org${item.href}` } : {}),
    })),
  };
  return <script type="application/ld+json">{JSON.stringify(schema, null, 2)}</script>;
}

/**
 * Generate JSON-LD Article schema
 */
export function getArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}): React.ReactNode {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || "/og-image.png",
    datePublished,
    dateModified: dateModified || datePublished,
    author: author
      ? {
          "@type": "Organization",
          name: author,
        }
      : {
          "@type": "Organization",
          name: "رحماء بينهم",
        },
  };
  return <script type="application/ld+json">{JSON.stringify(schema, null, 2)}</script>;
}

/**
 * Generate JSON-LD FAQ schema
 */
export function getFaqSchema(questions: { question: string; answer: string }[]): React.ReactNode {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q, i) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
  return <script type="application/ld+json">{JSON.stringify(schema, null, 2)}</script>;
}

/**
 * Generate JSON-LD HowTo schema
 */
export function getHowToSchema({
  steps,
  totalTime,
  name,
  description,
}: {
  steps: { number: string; name: string; description: string }[];
  totalTime?: string;
  name: string;
  description: string;
}): React.ReactNode {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    totalTime,
    step: steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.description,
      position: Number(step.number),
    })),
  };
  return <script type="application/ld+json">{JSON.stringify(schema, null, 2)}</script>;
}

/**
 * Generate comprehensive SEO head tags
 */
export function generateSeoMeta({
  title = "رحماء بينهم | rbdcye",
  description = "منظمة إنسانية تنموية رائدة في اليمن، تعمل على تخفيف معاناة الأسرة اليمنية وتحقيق التنمية المستدامة عبر برامج متكاملة في الإغاثة والتعليم والتنمية المجتمعية.",
  ogImage = "https://rbdcye.org/og-image.png",
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
  extraMeta,
}: SeoProps): React.ReactNode[] {
  const meta: React.ReactNode[] = [];

  // Charset and viewport
  meta.push(<meta charSet="utf-8" key="charset" />);
  meta.push(<meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />);

  // Title
  meta.push(<title key="title">{title}</title>);

  // Description
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
  meta.push(<meta property="og:description" content={ogDescription || description} key="ogdesc" />);
  meta.push(<meta property="og:image" content={ogImage} key="ogimage" />);
  meta.push(<meta property="og:image:width" content="1200" key="ogiw" />);
  meta.push(<meta property="og:image:height" content="630" key="ogih" />);
  meta.push(<meta property="og:url" content={canonicalUrl || "https://rbdcye.org"} key="ogurl" />);

  // Twitter Card
  meta.push(<meta name="twitter:card" content={twitterCard} key="twcard" />);
  meta.push(<meta name="twitter:title" content={ogTitle || title} key="twtitle" />);
  meta.push(
    <meta name="twitter:description" content={ogDescription || description} key="twdesc" />
  );
  meta.push(<meta name="twitter:image" content={ogImage} key="twimage" />);

  // Article-specific OG tags
  if (type === "article" && publishedTime) {
    meta.push(<meta property="article:published_time" content={publishedTime} key="articlept" />);
  }
  if (type === "article" && modifiedTime) {
    meta.push(<meta property="article:modified_time" content={modifiedTime} key="articlemt" />);
  }
  if (type === "article" && author) {
    meta.push(<meta property="article:author" content={author} key="articleauthor" />);
  }

  // Additional meta tags
  if (extraMeta && extraMeta.length > 0) {
    extraMeta.map((item, index) => {
      meta.push(<meta key={index} {...item} />);
    });
  }

  return meta;
}

/**
 * Generate Google Tag Manager script
 */
export function getGtmScript(id: string): React.ReactNode {
  return (
    <script
      async
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${id});
        `,
      }}
      key="gtm"
    />
  );
}

/**
 * Generate content security policy meta tag
 */
export function getCspMeta(): React.ReactNode {
  return (
    <meta
      httpEquiv="Content-Security-Policy"
      content={
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "connect-src self; " +
        "font-src 'self'; " +
        "frame-src 'self';"
      }
      key="csp"
    />
  );
}

/**
 * Generate language and direction meta tags for Arabic
 */
function getArMeta(): React.ReactNode {
  return (
    <React.Fragment>
      <meta name="language" content="ar" key="arlanguage" />
      <meta httpEquiv="Content-Language" content="ar" key="arlanguagedir" />
      <meta name="dir" content="rtl" key="rtdir" />
    </React.Fragment>
  );
}

/**
 * Generate application name and phone number meta tags
 */
function getAppMeta(): React.ReactNode {
  return (
    <React.Fragment>
      <meta name="apple-mobile-web-app-capable" content="yes" key="applemawc" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#0F4C3A" key="applemawssbs" />
      <meta name="msapplication-TileColor" content="#0F4C3A" key="msatc" />
      <meta name="msapplication-config" content="/browserconfig.json" key="maconfig" />
      <meta name="format-detection" content="telephone=no" key="fdt" />
    </React.Fragment>
  );
}

/**
 * Generate full SEO head for homepage
 */
export function getHomeSeoProps({
  extraMeta,
}: { extraMeta?: Array<{ name: string; content: string }> } = {}): {
  head: React.ReactNode[];
  schema: React.ReactNode;
} {
  const head = generateSeoMeta({
    title: "رحماء بينهم - الموقع الرسمي",
    description:
      "الموقع الرسمي لمؤسسة رحماء بينهم للإغاثة والتنمية باليمن. نعمل على تخفيف معاناة الأسر اليمنية عبر برامج الإغاثة العاجلة، التعليم، المياه والصحة.",
    ogImage: "https://rbdcye.org/og-image.png",
    type: "website",
    canonicalUrl: "https://rbdcye.org",
    extraMeta,
  });

  const schema = [getOrganizationSchema(), getBreadcrumbSchema([{ label: "الرئيسية", href: "/" }])];

  return { head, schema };
}

/**
 * Generate full SEO head for program/page pages
 */
export function getPageSeoProps({
  title,
  description,
  ogImage,
  type,
  extraMeta,
}: {
  title: string;
  description: string;
  ogImage?: string;
  type?: "website" | "article";
  extraMeta?: Array<{ name: string; content: string }>;
}): {
  head: React.ReactNode[];
  schema: React.ReactNode[];
} {
  const head = generateSeoMeta({
    title,
    description,
    ogImage: ogImage || "https://rbdcye.org/og-image.png",
    type,
    canonicalUrl: undefined,
    extraMeta,
  });

  const schema: React.ReactNode[] = [null, ...(extraMeta || [])].filter(
    Boolean
  ) as React.ReactNode[];

  return { head, schema };
}
