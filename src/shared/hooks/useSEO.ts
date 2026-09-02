import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'organization';
  publishedTime?: string;
  modifiedTime?: string;
  author?: { name: string; url?: string } | string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  canonicalUrl?: string;
  jsonLd?: object;
}

export interface RouteSEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
}

export const DEFAULT_SITE_TITLE = 'مؤسسة رحماء بينهم | الموقع الإلكتروني التعريفي الرسمي للإغاثة والتنمية باليمن';
export const DEFAULT_SITE_DESCRIPTION = 'الموقع الإلكتروني التعريفي الرسمي لمؤسسة رحماء بينهم للإغاثة والتنمية باليمن - استعراض الرؤية، الأهداف، الأثر التنموي، وأرفع معايير الحوكمة والشفافية.';
export const DEFAULT_OG_IMAGE = 'https://rbdcye.org/og-image.png';
export const SITE_URL = 'https://rbdcye.org';

export const ROUTE_SEO_MAP: Record<string, RouteSEOConfig> = {
  '/': {
    title: 'مؤسسة رحماء بينهم | الموقع الإلكتروني التعريفي الرسمي للإغاثة والتنمية باليمن',
    description: 'الموقع الإلكتروني التعريفي الرسمي لمؤسسة رحماء بينهم للإغاثة والتنمية باليمن - استعراض الرؤية، الأهداف، الأثر التنموي، وأرفع معايير الحوكمة والشفافية.',
    keywords: ['رحماء بينهم', 'مؤسسة رحماء بينهم', 'موقع تعريفي', 'عمل خيري', 'تنمية مستدامة', 'اليمن'],
  },
  '/about': {
    title: 'من نحن - هوية ورسالة مؤسسة رحماء بينهم',
    description: 'تعرف على رؤية ورسالة ومسيرة مؤسسة رحماء بينهم الخيرية وإنجازاتها الميدانية في خدمة المجتمع وتمكين الأسر المستضعفة.',
    keywords: ['من نحن', 'مؤسسة خيرية', 'رؤية رحماء بينهم', 'العمل الإنساني', 'فريق العمل'],
  },
  '/programs': {
    title: 'برامجنا التنموية والإغاثية | مؤسسة رحماء بينهم',
    description: 'استعرض برامجنا الخيرية والتنموية الشاملة في مجالات الإغاثة، التعليم، الرعاية الصحية، والمياه، والتمكين الاقتصادي.',
    keywords: ['برامج خيرية', 'إغاثة عاجلة', 'تمكين اقتصادي', 'رعاية صحية', 'مشاريع المياه'],
  },
  '/projects': {
    title: 'المشاريع الميدانية والإنسانية | رحماء بينهم',
    description: 'اطلع على المشاريع الإنسانية الجارية والمكتملة، وتابع نسب الإنجاز والتأثير المباشر على الأرض بشفافية تامة.',
    keywords: ['مشاريع إنسانية', 'إنجازات خيرة', 'مشاريع جارية', 'مساعدات ميدانية'],
  },
  '/success': {
    title: 'قصص الأثر والنجاح | رحماء بينهم',
    description: 'قصص واقعية وتجارب ملهمة لأسر وأفراد تغيرت حياتهم نحو الأفضل بفضل عطائكم وتضامنكم الإنساني.',
    keywords: ['قصص نجاح', 'أثر التبرع', 'تجارب ملهمة', 'تغيير حياة الأسر'],
  },
  '/news': {
    title: 'الأخبار والمركز الإعلامي | مؤسسة رحماء بينهم',
    description: 'تابع آخر الأخبار، التغطيات الميدانية، والتقارير الصحفية حول أنشطة وفعاليات ومشاريع مؤسسة رحماء بينهم.',
    keywords: ['أخبار رحماء بينهم', 'تغطية ميدانية', 'بيانات صحفية', 'نشاطات خيرية'],
  },
  '/media': {
    title: 'المكتبة الإعلامية والمرئيات | رحماء بينهم',
    description: 'شاهد معرض الصور، الفيديوهات الميدانية، والوثائقيات التي توثق عمليات الإغاثة والبناء والتنمية على الميدان.',
    keywords: ['معرض الصور', 'فيديوهات إغاثية', 'توثيق ميداني', 'إعلام خيري'],
  },
  '/reports': {
    title: 'التقارير السنوية والمالية | مؤسسة رحماء بينهم',
    description: 'حمل واطلع على التقارير السنوية والمالية الشفافة التي توثق الإنجازات، الميزانيات، ونسب توزيع المساعدات.',
    keywords: ['تقارير مالية', 'شفافية حوكمة', 'تقارير سنوية', 'تدقيق مالي'],
  },
  '/transparency': {
    title: 'الشفافية والحوكمة الرشيدة | رحماء بينهم',
    description: 'نلتزم بأعلى معايير النزاهة والحوكمة الرشيدة والتدقيق المالي المستقل لضمان وصول كل ريال إلى مستحقيه.',
    keywords: ['الحوكمة', 'الشفافية المالية', 'النزاهة', 'معايير الجودة'],
  },
  '/volunteer': {
    title: 'انضم كمتطوع | مؤسسة رحماء بينهم',
    description: 'شارك بجهدك ووقتك ومهاراتك في صناعة الأثر الإيجابي وخدمة المجتمعات المحتاجة عبر برامج التطوع الميداني.',
    keywords: ['تطوع خيري', 'فرص تطوعية', 'خدمة المجتمع', 'الانضمام للفريق'],
  },
  '/zakat': {
    title: 'حاسبة الزكاة الذكية | مؤسسة رحماء بينهم',
    description: 'احسب زكاة مالك، الذهب، والأنعام والتجارة بسهولة وفق الضوابط الشرعية المعتمدة وأخرجها لمستحقيها.',
    keywords: ['حاسبة الزكاة', 'حساب زكاة المال', 'زكاة الذهب', 'مصارف الزكاة'],
  },
  '/endowment': {
    title: 'الوقف الخيري - صدقة جارية | رحماء بينهم',
    description: 'ساهم في الأوقاف الخيرية والمشاريع الاستثمارية الوقفية التي يمتد أثرها وثوابها عبر الأجيال.',
    keywords: ['وقف خيري', 'صدقة جارية', 'استثمار وقفي', 'أوقاف تعليمية'],
  },
  '/donate': {
    title: 'تبرع الآن - عطاؤك حياة | رحماء بينهم',
    description: 'تبرع بسهولة وأمان لدعم المشاريع الإغاثية والتنموية العاجلة، وساهم في رسم البسمة على وجوه المحتاجين.',
    keywords: ['تبرع أونلاين', 'صدقة عاجلة', 'إغاثة الأسر', 'بوابة التبرع'],
  },
  '/contact': {
    title: 'اتصل بنا - تواصل مع فريق رحماء بينهم',
    description: 'تواصل معنا للاستفسارات، تقديم الاقتراحات، أو بحث فرص الشراكة والتعاون المؤسسي.',
    keywords: ['تواصل معنا', 'عناوين المؤسسة', 'أرقام التواصل', 'مواقع الفروع'],
  },
  '/partners': {
    title: 'شركاء النجاح والأثر | رحماء بينهم',
    description: 'استعرض قائمة المنظمات والجهات الشريكة الداعمة لمسيرة مؤسسة رحماء بينهم في تحقيق التنمية والإغاثة.',
    keywords: ['شركاء الخير', 'منظمات دولية', 'مؤسسات داعمة', 'تحالفات إنسانية'],
  },
  '/login': {
    title: 'تسجيل الدخول | رحماء بينهم',
    description: 'بوابة الوصول للشركاء والمتطوعين والمتبرعين لمتابعة المساهمات والسجلات.',
    keywords: ['تسجيل الدخول', 'حساب المتبرع'],
  },
  '/donor': {
    title: 'بوابة المتبرع الشخصية | رحماء بينهم',
    description: 'تابع تقارير أثر تبرعاتك، إيصالات الدفع، وسجل مساهماتك الخيرية بشفافية وتفصيل كامل.',
    keywords: ['بوابة المتبرع', 'سجل التبرعات', 'تقارير الأثر الشخصي'],
  },
  '/admin': {
    title: 'لوحة التحكم الإدارية | رحماء بينهم',
    description: 'إدارة العمليات الميدانية، طلبات المساعدة، المشاريع، والتقارير المباشرة.',
    keywords: ['لوحة التحكم', 'الإدارة', 'إدارة العمليات'],
  },
};

/**
 * Safely sets meta or link tags in document head
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[${attributeName}="${attributeValue}"]`;
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonicalLink(url: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

function injectJsonLd(id: string, schema: object) {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Gets route default SEO configuration based on current pathname
 */
export function getRouteSEOConfig(pathname: string): RouteSEOConfig {
  // Normalize pathname (remove trailing slash except for root)
  const cleanPath = pathname !== '/' && pathname.endsWith('/') 
    ? pathname.slice(0, -1) 
    : pathname;

  if (ROUTE_SEO_MAP[cleanPath]) {
    return ROUTE_SEO_MAP[cleanPath];
  }

  // Check prefix matching for dynamic subroutes (e.g., /news/123 -> /news)
  const parentSegment = '/' + cleanPath.split('/')[1];
  if (ROUTE_SEO_MAP[parentSegment]) {
    return ROUTE_SEO_MAP[parentSegment];
  }

  // Default fallback for 404 or unknown routes
  return {
    title: 'الصفحة غير موجودة | رحماء بينهم',
    description: 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. نرجو استخدام القائمة للوصول إلى الأقسام الرئيسية.',
    keywords: ['رحماء بينهم', '404', 'غير موجودة'],
  };
}

/**
 * Custom hook useSEO
 * Dynamically updates document title, meta tags, OpenGraph, Twitter cards, and structured JSON-LD
 * based on the current active route and optional custom parameters.
 */
export function useSEO(options?: SEOOptions) {
  let locationPathname = '/';

  try {
    const location = useLocation();
    locationPathname = location.pathname;
  } catch {
    // Fallback if rendered outside react-router-dom context
    if (typeof window !== 'undefined') {
      locationPathname = window.location.pathname;
    }
  }

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const routeDefaults = getRouteSEOConfig(locationPathname);

    // Resolved title and description
    const title = options?.title || routeDefaults.title || DEFAULT_SITE_TITLE;
    const description = options?.description || routeDefaults.description || DEFAULT_SITE_DESCRIPTION;
    const keywords = options?.keywords || routeDefaults.keywords || ['رحماء بينهم', 'عمل خيري', 'إغاثة'];
    const image = options?.image || routeDefaults.image || DEFAULT_OG_IMAGE;
    const currentUrl = options?.url || options?.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : `${SITE_URL}${locationPathname}`);
    const pageType = options?.type || 'website';

    // Update document title
    document.title = title;

    // Update primary meta tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords.join(', '));
    setMetaTag('name', 'robots', options?.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // Update Open Graph tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', pageType);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:site_name', 'مؤسسة رحماء بينهم');

    // Update Twitter Card tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);

    // Article meta if applicable
    if (pageType === 'article') {
      if (options?.publishedTime) setMetaTag('property', 'article:published_time', options.publishedTime);
      if (options?.modifiedTime) setMetaTag('property', 'article:modified_time', options.modifiedTime);
      const authorName = typeof options?.author === 'object' ? options.author.name : options?.author;
      if (authorName) setMetaTag('property', 'article:author', authorName);
      if (options?.section) setMetaTag('property', 'article:section', options.section);
    }

    // Set canonical link
    setCanonicalLink(currentUrl);

    // Optional JSON-LD Structured Data
    if (options?.jsonLd) {
      injectJsonLd('schema-custom-jsonld', options.jsonLd);
    }
  }, [
    locationPathname,
    options?.title,
    options?.description,
    options?.image,
    options?.url,
    options?.canonicalUrl,
    options?.type,
    options?.noindex,
    options?.keywords,
    options?.publishedTime,
    options?.modifiedTime,
    options?.author,
    options?.section,
    options?.jsonLd,
  ]);
}

export default useSEO;


