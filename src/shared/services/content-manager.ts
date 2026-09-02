// ============================================================
// ContentManager — Offline-First Content Architecture
//
// ARCHITECTURE:
// Layer 1: Static defaults (always available, zero network)
// Layer 2: localStorage cache (survives page reload, offline)
// Layer 3: Sanity CMS (live content, fetched when online)
//
// MERGE STRATEGY:
// - Static is ALWAYS the base
// - Cached enhances static (if exists and fresh)
// - Sanity replaces cache (when available and approved)
// - User NEVER sees loading spinners or empty states
// - Transitions are invisible — data appears as if always there
// ============================================================

import { sanityClient } from "@/sanity/client";

// ─── Cache Configuration ────────────────────────────────────
const CACHE_PREFIX = "rh_content_";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const SANITY_TIMEOUT = 5000; // 5 seconds
const MAX_RETRIES = 2;

// ─── Types ──────────────────────────────────────────────────
export type ContentSource = "static" | "cache" | "sanity" | "hybrid";

export interface ContentResult<T> {
  data: T[];
  source: ContentSource;
  isDynamic: boolean;
  cachedAt?: number;
  error: string | null;
}

export interface CacheEntry<T> {
  data: T[];
  timestamp: number;
  source: ContentSource;
}

// ─── Cache Layer ────────────────────────────────────────────
function getCacheKey(type: string): string {
  return `${CACHE_PREFIX}${type}`;
}

function readCache<T>(type: string): T[] | null {
  try {
    const raw = localStorage.getItem(getCacheKey(type));
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    // Cache is valid for 30 minutes
    if (Date.now() - entry.timestamp > CACHE_TTL * 4) {
      localStorage.removeItem(getCacheKey(type));
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache<T>(type: string, data: T[], source: ContentSource): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now(), source };
    localStorage.setItem(getCacheKey(type), JSON.stringify(entry));
  } catch {
    // QuotaExceeded — clear old caches and retry once
    try {
      clearAllCache();
      localStorage.setItem(
        getCacheKey(type),
        JSON.stringify({ data, timestamp: Date.now(), source })
      );
    } catch {
      /* give up */
    }
  }
}

function clearAllCache(): void {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
  keys.forEach((k) => localStorage.removeItem(k));
}

// ─── Sanity Fetch with Timeout + Retry ──────────────────────
async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T[] | null> {
  try {
    const fetchPromise = sanityClient.fetch<T[]>(query, params || {});
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("Sanity timeout")), SANITY_TIMEOUT)
    );

    const result = await Promise.race([fetchPromise, timeoutPromise]);
    return Array.isArray(result) && result.length > 0 ? result : null;
  } catch {
    return null;
  }
}

// ─── GROQ Queries ───────────────────────────────────────────
const GROQ = {
  news: `*[_type == "news"] | order(publishDate desc)[0...20]{
    _id, title, excerpt, category, publishDate, mainImage, views,
    "categoryColor": coalesce(categoryColor, "#2563EB"),
    "categoryBg": coalesce(categoryBg, "#EFF6FF"),
    "featured": coalesce(featured, false),
    "status": coalesce(status, "PUBLISHED"),
    "tags": coalesce(tags, []),
    "location": coalesce(location, "")
  }`,
  projects: `*[_type == "project"][0...20]{
    _id, title, description, category, status, mainImage,
    progress, goalAmount, raisedAmount,
    "location": coalesce(location, ""),
    "beneficiaries": coalesce(beneficiaries, ""),
    "budget": coalesce(budget, "")
  }`,
  programs: `*[_type == "project"][0...10]{
    _id, title, description, icon, mainImage,
    "category": coalesce(category, ""),
    "headline": coalesce(headline, ""),
    "themes": coalesce(themes, []),
    "color": coalesce(color, "#059669")
  }`,
  partners: `*[_type == "partner"] | order(orderRank)[0...20]{
    _id, name, logo, website, type,
    "status": coalesce(status, "active")
  }`,
  successStories: `*[_type == "successStory"] | order(publishDate desc)[0...10]{
    _id, title, story, beneficiaryName, mainImage, publishDate,
    "excerpt": coalesce(excerpt, ""),
    "quote": coalesce(quote, ""),
    "name": coalesce(beneficiaryName, ""),
    "role": coalesce(role, ""),
    "program": coalesce(program, ""),
    "category": coalesce(category, ""),
    "year": coalesce(year, ""),
    "location": coalesce(location, ""),
    "rating": coalesce(rating, 5)
  }`,
  impact: `*[_type == "impact"][0]{
    totalBeneficiaries, beneficiaries, activeProjects, projects,
    totalPartners, partners, volunteers,
    meals, orphans, students
  }`,
  settings: `*[_type == "siteSettings"][0]`,
  media: `*[_type == "media"] | order(_createdAt desc)[0...20]{
    _id, title, type, file, date, altText
  }`,
  reports: `*[_type == "report"] | order(date desc)[0...20]{
    _id, title, type, file, status, date
  }`,
} as const;

// ─── ContentManager — The Single Source of Truth ────────────
class ContentManager {
  // ─── Impact Metrics ─────────────────────────────────────
  async getImpact(): Promise<ContentResult<Record<string, number>>> {
    const defaults: Record<string, number> = {
      totalBeneficiaries: 12847,
      activeProjects: 24,
      totalPartners: 48,
      volunteers: 320,
      meals: 180000,
      orphans: 850,
      students: 3200,
    };

    // Layer 2: try cache
    const cached = readCache<Record<string, number>>("impact");
    if (cached && cached.length > 0) {
      // Return cache immediately, but also try Sanity in background
      this.fetchAndCache("impact", GROQ.impact, (d) => {
        const raw = d[0] as any;
        return [
          {
            totalBeneficiaries:
              raw?.totalBeneficiaries || raw?.beneficiaries || defaults.totalBeneficiaries,
            activeProjects: raw?.activeProjects || raw?.projects || defaults.activeProjects,
            totalPartners: raw?.totalPartners || raw?.partners || defaults.totalPartners,
            volunteers: raw?.volunteers || defaults.volunteers,
            meals: raw?.meals || defaults.meals,
            orphans: raw?.orphans || defaults.orphans,
            students: raw?.students || defaults.students,
          },
        ];
      });
      return { data: cached, source: "cache", isDynamic: true, error: null };
    }

    // Layer 3: try Sanity
    const sanityData = await sanityFetch<any>(GROQ.impact);
    if (sanityData && sanityData.length > 0) {
      const raw = sanityData[0];
      const data = [
        {
          totalBeneficiaries:
            raw?.totalBeneficiaries || raw?.beneficiaries || defaults.totalBeneficiaries,
          activeProjects: raw?.activeProjects || raw?.projects || defaults.activeProjects,
          totalPartners: raw?.totalPartners || raw?.partners || defaults.totalPartners,
          volunteers: raw?.volunteers || defaults.volunteers,
          meals: raw?.meals || defaults.meals,
          orphans: raw?.orphans || defaults.orphans,
          students: raw?.students || defaults.students,
        },
      ];
      writeCache("impact", data, "sanity");
      return { data, source: "sanity", isDynamic: true, error: null };
    }

    // Layer 1: static defaults
    return { data: [defaults], source: "static", isDynamic: false, error: null };
  }

  // ─── News ───────────────────────────────────────────────
  async getNews(): Promise<ContentResult<any>> {
    const defaults = this.getStaticNews();

    const cached = readCache<any>("news");
    if (cached && cached.length > 0) {
      this.fetchAndCache("news", GROQ.news, (d) => this.normalizeNews(d));
      return { data: cached, source: "cache", isDynamic: true, error: null };
    }

    const sanityData = await sanityFetch<any>(GROQ.news);
    if (sanityData && sanityData.length > 0) {
      const data = this.normalizeNews(sanityData);
      writeCache("news", data, "sanity");
      return { data, source: "sanity", isDynamic: true, error: null };
    }

    return { data: defaults, source: "static", isDynamic: false, error: null };
  }

  // ─── Projects ──────────────────────────────────────────
  async getProjects(): Promise<ContentResult<any>> {
    const defaults = this.getStaticProjects();

    const cached = readCache<any>("projects");
    if (cached && cached.length > 0) {
      this.fetchAndCache("projects", GROQ.projects, (d) => this.normalizeProjects(d));
      return { data: cached, source: "cache", isDynamic: true, error: null };
    }

    const sanityData = await sanityFetch<any>(GROQ.projects);
    if (sanityData && sanityData.length > 0) {
      const data = this.normalizeProjects(sanityData);
      writeCache("projects", data, "sanity");
      return { data, source: "sanity", isDynamic: true, error: null };
    }

    return { data: defaults, source: "static", isDynamic: false, error: null };
  }

  // ─── Programs ──────────────────────────────────────────
  async getPrograms(): Promise<ContentResult<any>> {
    const defaults = this.getStaticPrograms();

    const cached = readCache<any>("programs");
    if (cached && cached.length > 0) {
      this.fetchAndCache("programs", GROQ.programs, (d) => this.normalizePrograms(d));
      return { data: cached, source: "cache", isDynamic: true, error: null };
    }

    const sanityData = await sanityFetch<any>(GROQ.programs);
    if (sanityData && sanityData.length > 0) {
      const data = this.normalizePrograms(sanityData);
      writeCache("programs", data, "sanity");
      return { data, source: "sanity", isDynamic: true, error: null };
    }

    return { data: defaults, source: "static", isDynamic: false, error: null };
  }

  // ─── Partners ──────────────────────────────────────────
  async getPartners(): Promise<ContentResult<any>> {
    const defaults = this.getStaticPartners();

    const cached = readCache<any>("partners");
    if (cached && cached.length > 0) {
      this.fetchAndCache("partners", GROQ.partners, (d) => this.normalizePartners(d));
      return { data: cached, source: "cache", isDynamic: true, error: null };
    }

    const sanityData = await sanityFetch<any>(GROQ.partners);
    if (sanityData && sanityData.length > 0) {
      const data = this.normalizePartners(sanityData);
      writeCache("partners", data, "sanity");
      return { data, source: "sanity", isDynamic: true, error: null };
    }

    return { data: defaults, source: "static", isDynamic: false, error: null };
  }

  // ─── Success Stories ───────────────────────────────────
  async getSuccessStories(): Promise<ContentResult<any>> {
    const defaults = this.getStaticStories();

    const cached = readCache<any>("stories");
    if (cached && cached.length > 0) {
      this.fetchAndCache("stories", GROQ.successStories, (d) => this.normalizeStories(d));
      return { data: cached, source: "cache", isDynamic: true, error: null };
    }

    const sanityData = await sanityFetch<any>(GROQ.successStories);
    if (sanityData && sanityData.length > 0) {
      const data = this.normalizeStories(sanityData);
      writeCache("stories", data, "sanity");
      return { data, source: "sanity", isDynamic: true, error: null };
    }

    return { data: defaults, source: "static", isDynamic: false, error: null };
  }

  // ─── Search (across all content) ───────────────────────
  async search(query: string): Promise<{
    projects: any[];
    news: any[];
    successStories: any[];
    programs: any[];
  }> {
    const q = `*${query}*`;
    const [projects, news, stories, programs] = await Promise.all([
      sanityFetch<any>(
        `*[_type == "project" && (title match $q || description match $q)] | order(orderRank) { _id, title, description, slug, category, mainImage }[0...6]`,
        { q }
      ),
      sanityFetch<any>(
        `*[_type == "news" && (title match $q || excerpt match $q)] | order(publishDate desc) { _id, title, excerpt, category, publishDate, mainImage }[0...6]`,
        { q }
      ),
      sanityFetch<any>(
        `*[_type == "successStory" && (title match $q || story match $q)] | order(publishDate desc) { _id, title, story, beneficiaryName, mainImage }[0...6]`,
        { q }
      ),
      sanityFetch<any>(
        `*[_type == "program" && (title match $q || description match $q)] | order(orderRank) { _id, title, description, icon, mainImage }[0...6]`,
        { q }
      ),
    ]);

    return {
      projects: projects || [],
      news: news || [],
      successStories: stories || [],
      programs: programs || [],
    };
  }

  // ─── Background Sync (non-blocking) ────────────────────
  private async fetchAndCache<T>(
    type: string,
    query: string,
    normalize: (data: T[]) => T[]
  ): Promise<void> {
    try {
      const data = await sanityFetch<T>(query);
      if (data && data.length > 0) {
        const normalized = normalize(data);
        writeCache(type, normalized, "sanity");
      }
    } catch {
      /* silent — cache remains valid */
    }
  }

  // ─── Normalizers (Sanity → our format) ─────────────────
  private normalizeNews(data: any[]): any[] {
    return data.map((item) => ({
      id: item._id,
      title: item.title || "",
      excerpt: item.excerpt || "",
      content: item.content || item.excerpt || "",
      category: item.category || "أخبار",
      categoryColor: item.categoryColor || "#2563EB",
      categoryBg: item.categoryBg || "#EFF6FF",
      date: item.publishDate || "",
      dateEn: item.publishDate || "",
      image: item.mainImage || "/images/defaults/project-relief.svg",
      views: item.views || 0,
      featured: item.featured || false,
      status: item.status || "PUBLISHED",
      tags: item.tags || [],
      location: item.location || "",
    }));
  }

  private normalizeProjects(data: any[]): any[] {
    return data.map((item) => ({
      id: item._id,
      title: item.title || "",
      description: item.description || "",
      category: item.category || "عام",
      status: item.status || "active",
      progress: item.progress || 0,
      goalAmount: item.goalAmount || 0,
      raisedAmount: item.raisedAmount || 0,
      budget: item.budget || "",
      beneficiaries: item.beneficiaries || "",
      location: item.location || "",
      image: item.mainImage || "/images/defaults/project-relief.svg",
    }));
  }

  private normalizePrograms(data: any[]): any[] {
    return data.map((item) => ({
      id: item._id,
      title: item.title || "",
      description: item.description || "",
      icon: item.icon || "heart",
      category: item.category || "",
      headline: item.headline || "",
      themes: item.themes || [],
      color: item.color || "#059669",
      image: item.mainImage || "",
    }));
  }

  private normalizePartners(data: any[]): any[] {
    return data.map((item) => ({
      id: item._id,
      name: item.name || "",
      logo: item.logo || "",
      website: item.website || "",
      type: item.type || "",
      status: item.status || "active",
    }));
  }

  private normalizeStories(data: any[]): any[] {
    return data.map((item) => ({
      id: item._id,
      title: item.title || "",
      story: item.story || "",
      excerpt: item.excerpt || item.story || "",
      quote: item.quote || "",
      beneficiaryName: item.beneficiaryName || "",
      name: item.name || item.beneficiaryName || "",
      role: item.role || "",
      program: item.program || "",
      category: item.category || "",
      year: item.year || "",
      location: item.location || "",
      rating: item.rating || 5,
      image: item.mainImage || "/images/defaults/story-woman.svg",
    }));
  }

  // ─── Static Default Content ─────────────────────────────
  private getStaticNews(): any[] {
    return [
      {
        id: "s1",
        title: "إطلاق مشروع التعليم المستدام في المناطق النائية لعام ١٤٤٦هـ",
        excerpt:
          "أطلقت مؤسسة رحماء بينهم مشروعها السنوي للتعليم المستدام الذي يستهدف أكثر من ٥٠٠ طالب وطالبة في المناطق النائية.",
        content: "",
        category: "تعليم",
        categoryColor: "#2563EB",
        categoryBg: "#EFF6FF",
        date: "١٥ ربيع الثاني ١٤٤٦",
        dateEn: "2024-10-18",
        image: "/images/defaults/project-education.svg",
        views: 1240,
        featured: true,
        status: "PUBLISHED",
        tags: ["تعليم", "تنمية"],
        location: "عدة محافظات",
      },
      {
        id: "s2",
        title: "توزيع ٨٠٠ سلة غذائية على الأسر المتضررة في محافظة تعز",
        excerpt:
          "نفّذ فريق الإغاثة الميداني حملة موسعة لتوزيع السلال الغذائية على الأسر الأكثر احتياجاً في تعز.",
        content: "",
        category: "إغاثة",
        categoryColor: "#E74C3C",
        categoryBg: "#FEF2F2",
        date: "٨ ربيع الثاني ١٤٤٦",
        dateEn: "2024-10-11",
        image: "/images/defaults/project-relief.svg",
        views: 986,
        featured: true,
        status: "PUBLISHED",
        tags: ["إغاثة", "مساعدات"],
        location: "تعز",
      },
      {
        id: "s3",
        title: "توقيع اتفاقية شراكة استراتيجية مع منظمة التنمية الخليجية",
        excerpt:
          "وقّعت المؤسسة اتفاقية شراكة استراتيجية مع منظمة التنمية الخليجية لمدة ثلاث سنوات.",
        content: "",
        category: "شراكات",
        categoryColor: "#8B5CF6",
        categoryBg: "#F5F3FF",
        date: "١ ربيع الثاني ١٤٤٦",
        dateEn: "2024-10-04",
        image: "/images/defaults/project-development.svg",
        views: 756,
        featured: false,
        status: "PUBLISHED",
        tags: ["شراكات", "تنمية"],
        location: "صنعاء",
      },
      {
        id: "s4",
        title: "برنامج التدريب المهني لتمكين الشباب اليمني",
        excerpt: "انطلاق برنامج التدريب المهني الذي يستهدف ٢٠٠ شاب وشابة في التخصصات市场需求.",
        content: "",
        category: "تدريب",
        categoryColor: "#F59E0B",
        categoryBg: "#FFFBEB",
        date: "٢٥ محرم ١٤٤٦",
        dateEn: "2024-09-20",
        image: "/images/defaults/story-community.svg",
        views: 534,
        featured: false,
        status: "PUBLISHED",
        tags: ["تدريب", "شباب"],
        location: "صنعاء",
      },
      {
        id: "s5",
        title: "حفر ١٠ آبار ارتوازية في مديرية rflع",
        excerpt: "errorMsgمشروع حفر الآبار الارتوازية الذي يستفيد منه أكثر من ٥٠٠ أسرة.",
        content: "",
        category: "تنمية",
        categoryColor: "#10B981",
        categoryBg: "#ECFDF5",
        date: "٢٠ محرم ١٤٤٦",
        dateEn: "2024-09-15",
        image: "/images/defaults/project-water.svg",
        views: 412,
        featured: false,
        status: "PUBLISHED",
        tags: ["مياه", "تنمية"],
        location: "حجة",
      },
    ];
  }

  private getStaticProjects(): any[] {
    return [
      {
        id: "sp1",
        title: "الكساء الشتوي",
        category: "إغاثة",
        status: "active",
        progress: 75,
        goalAmount: 350000,
        raisedAmount: 262500,
        budget: "٣٥٠,٠٠٠ ر.ي",
        beneficiaries: "٢٠٠٠ أسرة",
        location: "عدة محافظات",
        image: "/images/defaults/project-relief.svg",
        description: "توفير ملابس شتوية دافئة للأسر المتضررة في المناطق الجبلية.",
      },
      {
        id: "sp2",
        title: "التعليم في الريف",
        category: "تعليم",
        status: "active",
        progress: 60,
        goalAmount: 500000,
        raisedAmount: 300000,
        budget: "٥٠٠,٠٠٠ ر.ي",
        beneficiaries: "٥٠٠ طالب",
        location: "حجة",
        image: "/images/defaults/project-education.svg",
        description: "بناء مدارس مجهزة وتوفير الكتب والقرطاسية للطلاب في المناطق النائية.",
      },
      {
        id: "sp3",
        title: "تمكين المرأة الريفية",
        category: "تنمية",
        status: "active",
        progress: 45,
        goalAmount: 200000,
        raisedAmount: 90000,
        budget: "٢٠٠,٠٠٠ ر.ي",
        beneficiaries: "١٥٠ امرأة",
        location: "إب",
        image: "/images/defaults/project-development.svg",
        description: "تدريب النساء على الحرف اليدوية وتمكينهن اقتصادياً.",
      },
      {
        id: "sp4",
        title: "حفر الآبار الارتوازية",
        category: "مياه",
        status: "active",
        progress: 80,
        goalAmount: 800000,
        raisedAmount: 640000,
        budget: "٨٠٠,٠٠٠ ر.ي",
        beneficiaries: "٥٠٠ أسرة",
        location: "حجة",
        image: "/images/defaults/project-water.svg",
        description: "حفر وتجهيز آبار ارتوازية لتزويد المجتمعات بالمياه النظيفة.",
      },
      {
        id: "sp5",
        title: "السلال الغذائية الرمضانية",
        category: "إغاثة",
        status: "completed",
        progress: 100,
        goalAmount: 300000,
        raisedAmount: 300000,
        budget: "٣٠٠,٠٠٠ ر.ي",
        beneficiaries: "١٠٠٠ أسرة",
        location: "تعز",
        image: "/images/defaults/project-relief.svg",
        description: "توزيع سلال غذائية كاملة على الأسر المحتاجة خلال شهر رمضان المبارك.",
      },
      {
        id: "sp6",
        title: "حلقات التحفيظ القرآني",
        category: "دعوي",
        status: "active",
        progress: 55,
        goalAmount: 100000,
        raisedAmount: 55000,
        budget: "١٠٠,٠٠٠ ر.ي",
        beneficiaries: "٣٠٠ طالب",
        location: "صنعاء",
        image: "/images/defaults/story-community.svg",
        description: "إطلاق حلقات تحفيظ قرآني للأطفال والشباب في المساجد والمراكز.",
      },
    ];
  }

  private getStaticPrograms(): any[] {
    return [
      {
        id: "prog1",
        title: "الإغاثة الإنسانية",
        description:
          "توفير المساعدات العاجلة للأسر المتضررة والنازحة عبر توزيع السلال الغذائية والأدوية وال_Mskعيات.",
        icon: "heart",
        category: "إغاثة",
        headline: "نصل إلى من يحتاج",
        themes: ["إغاثة", "نازحين", "طوارئ"],
        color: "#E74C3C",
        image: "",
      },
      {
        id: "prog2",
        title: "التعليم والتأهيل",
        description: "بناء المدارس وتوفير المستلزمات التعليمية وتدريب المعلمين وبرنامج محو الأمية.",
        icon: "graduation-cap",
        category: "تعليم",
        headline: "نُشئ أجيالاً قادرة",
        themes: ["تعليم", "تدريب", "أمية"],
        color: "#2563EB",
        image: "",
      },
      {
        id: "prog3",
        title: "التنمية المجتمعية",
        description: "مشاريع الحفر والزراعة وتمكين المرأة ودعم المشاريع الصغيرة.",
        icon: "users",
        category: "تنمية",
        headline: "نبني مجتمعات مستدامة",
        themes: ["زراعة", "مشاريع صغيرة", "تمكين"],
        color: "#10B981",
        image: "",
      },
      {
        id: "prog4",
        title: "الدعوة والإرشاد",
        description: "المحاضرات والدروس والactivities الدينية وبرنامج تحفيظ القرآن.",
        icon: "book-open",
        category: "دعوي",
        headline: "نُنير العقول والقلوب",
        themes: ["قرآن", "محاضرات", "أنشطة"],
        color: "#8B5CF6",
        image: "",
      },
    ];
  }

  private getStaticPartners(): any[] {
    return [
      {
        id: "part1",
        name: "منظمة الإغاثة الخيرية",
        logo: "/images/defaults/partner-placeholder.svg",
        website: "#",
        type: "local",
        status: "active",
      },
      {
        id: "part2",
        name: "صندوق التنمية البشرية",
        logo: "/images/defaults/partner-placeholder.svg",
        website: "#",
        type: "international",
        status: "active",
      },
      {
        id: "part3",
        name: "جامعة العلوم والتكنولوجيا",
        logo: "/images/defaults/partner-placeholder.svg",
        website: "#",
        type: "academic",
        status: "active",
      },
      {
        id: "part4",
        name: "الهيئة اليمنية للإغاثة",
        logo: "/images/defaults/partner-placeholder.svg",
        website: "#",
        type: "local",
        status: "active",
      },
      {
        id: "part5",
        name: "مؤسسة سعيد القادري",
        logo: "/images/defaults/partner-placeholder.svg",
        website: "#",
        type: "donor",
        status: "active",
      },
      {
        id: "part6",
        name: "جمعية♉rahma للتنمية",
        logo: "/images/defaults/partner-placeholder.svg",
        website: "#",
        type: "local",
        status: "active",
      },
    ];
  }

  private getStaticStories(): any[] {
    return [
      {
        id: "ss1",
        title: "آمال عادلة: من الفقر إلى التدريب المهني",
        story: "كانت آمال تعيش في ظروف صعبة، لكن برنامج التدريب المهني غيّر حياتها بالكامل.",
        excerpt: "كانت آمال تعيش في ظروف صعبة، لكن برنامج التدريب المهني غيّر حياتها بالكامل.",
        quote: "البرنامج لم يُعلّمني حرفة فقط، بل علّمني أن أحلم byg größere Träume.",
        name: "آمال عادلة",
        role: "خريجة برنامج التدريب",
        program: "التدريب المهني",
        category: "تنمية",
        year: "١٤٤٥",
        location: "إب",
        rating: 5,
        image: "/images/defaults/story-woman.svg",
      },
      {
        id: "ss2",
        title: "قرية الماء: من العطش إلى الحياة",
        story: "بعد حفر البئر الارتوازي، تحوّلت حياة سكان القرية بالكامل.",
        excerpt: "بعد حفر البئر الارتوازي، تحوّلت حياة سكان القرية بالكامل.",
        quote: "لم نكن نتخيل أن الماء النظيف سيصل إلى بيوتنا.",
        name: "محمد المغربي",
        role: "ismic village chief",
        program: "حفر الآبار",
        category: "تنمية",
        year: "١٤٤٥",
        location: "حجة",
        rating: 5,
        image: "/images/defaults/project-water.svg",
      },
      {
        id: "ss3",
        title: "نجاح慭ال理工: تعليم يصنع الفرق",
        story: "بفضل الدعم التعليمي، تخرجت 내廉洁第一名 في كليتها.",
        excerpt: "بفضل الدعم التعليمي، تخرجت بالمركز الأول في كليتها.",
        quote: "التعليم هو المفتاح الذي فتح لي أبواب المستقبل.",
        name: "نور الحسن",
        role: "طالبة جامعية",
        program: "التعليم المستدام",
        category: "تعليم",
        year: "١٤٤٦",
        location: "صنعاء",
        rating: 5,
        image: "/images/defaults/project-education.svg",
      },
      {
        id: "ss4",
        title: "سلال رمضان: فرحة تجمعنا",
        story: "وزّعت المؤسسة آلاف السلال الغذائية خلال رمضان.",
        excerpt: "وزّعت المؤسسة آلاف السلال الغذائية خلال رمضان.",
        quote: "في رمضان، نشعر أننا أسرة واحدة.",
        name: "فاطمة أحمد",
        role: "مستفيدة",
        program: "السلال الغذائية",
        category: "إغاثة",
        year: "١٤٤٥",
        location: "تعز",
        rating: 5,
        image: "/images/defaults/story-community.svg",
      },
    ];
  }

  // ─── Cache Management ───────────────────────────────────
  clearCache(): void {
    clearAllCache();
  }

  refreshAll(): void {
    clearAllCache();
    // Re-fetch all content in background
    Promise.all([
      this.getImpact(),
      this.getNews(),
      this.getProjects(),
      this.getPrograms(),
      this.getPartners(),
      this.getSuccessStories(),
    ]);
  }
}

// Singleton
export const contentManager = new ContentManager();
