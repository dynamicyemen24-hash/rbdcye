// Advanced SEO System - JSON-LD, Open Graph, Twitter Cards, Sitemap
import { useEffect } from "react";

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'organization';
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
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  description: string;
  url: string;
  logo?: string;
  email?: string;
  telephone?: string;
  address?: {
    '@type': 'PostalAddress';
    addressLocality: string;
    addressCountry: string;
  };
  sameAs?: string[];
}

interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  description: string;
  url: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
}

interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

interface FAQSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

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
    // Update title
    document.title = data.title;

    // robots
    if (data.noindex) {
      this.setMeta('robots', 'noindex, nofollow');
    } else {
      this.setMeta('robots', 'index, follow');
    }

    // Update meta tags
    this.setMeta('description', data.description);
    if (data.keywords) {
      this.setMeta('keywords', data.keywords.join(', '));
    }

    // Open Graph
    this.setMeta('og:title', data.title);
    this.setMeta('og:description', data.description);
    this.setMeta('og:type', data.type || 'website');
    if (data.image) this.setMeta('og:image', data.image);
    if (data.url) this.setMeta('og:url', data.url);
    
    // Twitter Card
    this.setMeta('twitter:card', 'summary_large_image');
    this.setMeta('twitter:title', data.title);
    this.setMeta('twitter:description', data.description);
    if (data.image) this.setMeta('twitter:image', data.image);

    // Article specific
    if (data.type === 'article') {
      if (data.publishedTime) this.setMeta('article:published_time', data.publishedTime);
      if (data.modifiedTime) this.setMeta('article:modified_time', data.modifiedTime);
      if (data.author?.name) this.setMeta('article:author', data.author.name);
      if (data.section) this.setMeta('article:section', data.section);
      if (data.tags) {
        data.tags.forEach(tag => this.setMeta('article:tag', tag));
      }
    }

    // JSON-LD schemas
    this.injectSchema('organization', this.getOrganizationSchema());
    this.injectSchema('website', this.getWebSiteSchema());
    if (data.type === 'article') {
      this.injectSchema('article', this.getArticleSchema(data));
    }
  }

  private setMeta(name: string, content: string) {
    const selector = `meta[property="${name}"], meta[name="${name}"]`
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        element.setAttribute('property', name);
      } else {
        element.setAttribute('name', name);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  private injectSchema(id: string, schema: object) {
    const existing = document.getElementById(`schema-${id}`);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = `schema-${id}`;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  private getOrganizationSchema(): OrganizationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'رحماء بينهم',
      description: 'الموقع الإلكتروني التعريفي الرسمي لـ رحماء بينهم للإغاثة والتنمية باليمن',
      url: 'https://rbdcye.org',
      logo: 'https://rbdcye.org/logo.png',
      email: 'info@rbdcye.org',
      telephone: '+967-780-777-007',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'اليمن',
        addressCountry: 'YE',
      },
      sameAs: [
        'https://twitter.com/rbdcye',
        'https://facebook.com/rbdcye',
        'https://instagram.com/rbdcye',
      ],
    };
  }

  private getWebSiteSchema(): WebSiteSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'رحماء بينهم',
      description: 'الموقع الإلكتروني التعريفي الرسمي لـ رحماء بينهم للإغاثة والتنمية باليمن',
      url: 'https://rbdcye.org',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://rbdcye.org/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  private getArticleSchema(data: SEOData): ArticleSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.publishedTime || new Date().toISOString(),
      dateModified: data.modifiedTime || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: data.author?.name || 'فريق التحرير',
      },
      publisher: {
        '@type': 'Organization',
        name: 'رحماء بينهم',
        logo: {
          '@type': 'ImageObject',
          url: 'https://rbdcye.org/logo.png',
        },
      },
    };
  }

  generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): BreadcrumbSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
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

// Constants
export const SITE_URL = 'https://rbdcye.org';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;
export const ORGANIZATION_NAME = 'رحماء بينهم';