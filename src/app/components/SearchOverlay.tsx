import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
  Loader2,
  FolderHeart,
  Newspaper,
  Award,
  Layers,
  ArrowLeft,
  CornerDownLeft,
  Sparkles,
  TrendingUp,
  Tag,
  Heart,
} from "lucide-react";
import { FallbackImage } from "@/app/components/FallbackImage";
import { contentManager } from "@/shared/services/content-manager";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentPage?: (page: string) => void;
}

type CategoryFilter = "all" | "projects" | "news" | "stories" | "programs";

// Fallback initial dataset to guarantee immediate response even if Sanity is offline/unseeded
const FALLBACK_PROJECTS = [
  {
    _id: "proj-1",
    _type: "project",
    title: "إغاثة طارئة للأسر المتضررة في محافظة صعدة",
    description: "توفير المساعدات الإنسانية العاجلة للأسر المتضررة من الصراعات في المناطق المحرومة.",
    category: "إغاثة طارئة",
    status: "نشط",
    progress: 78,
    goalAmount: 150000,
    raisedAmount: 117000,
    mainImage: "/images/defaults/project-relief.svg",
  },
  {
    _id: "proj-2",
    _type: "project",
    title: "مياه نظيفة للمجتمعات الريفية",
    description:
      "حفر آبار وتركيب أنظمة تنقية المياه للمجتمعات الريفية النائية في المناطق المحرومة.",
    category: "تنمية مجتمعية",
    status: "نشط",
    progress: 92,
    goalAmount: 85000,
    raisedAmount: 78200,
    mainImage: "/images/defaults/project-water.svg",
  },
  {
    _id: "proj-3",
    _type: "project",
    title: "مشروع بنى تحتية للمجتمعات المتضررة",
    description:
      "ترميم البنية التحتية الحيوية للمجتمعات المتضررة من الصراعات وتحسين بيئة الحياة.",
    category: "تنمية مجتمعية",
    status: "مكتمل",
    progress: 100,
    goalAmount: 200000,
    raisedAmount: 200000,
    mainImage: "/images/defaults/project-development.svg",
  },
  {
    _id: "proj-4",
    _type: "project",
    title: "دعم التعليم للأطفال النازحين",
    description: "توفير المواد التعليمية والأدوات المدرسية لأكثر من 500 طفل نازح في المحافظات.",
    category: "إغاثة طارئة",
    status: "نشط",
    progress: 64,
    goalAmount: 120000,
    raisedAmount: 76800,
    mainImage: "/images/defaults/story-default.svg",
  },
];

const FALLBACK_NEWS = [
  {
    _id: "news-1",
    _type: "news",
    title: "افتتاح 5 مشاريع مياه نظيفة في محافظات مختلفة",
    excerpt: "تم افتتاح خمسة مشاريع لإمداد المياه النظيفة للمجتمعات المحرومة في المناطق الريفية.",
    category: "تنمية مجتمعية",
    publishDate: "2026-08-10",
    views: 1420,
    mainImage: "/images/defaults/project-water.svg",
  },
  {
    _id: "news-2",
    _type: "news",
    title: "توقيع اتفاقية شراكة مع منظمات دولية لدعم التعليم",
    excerpt: "وقعت الجمعية اتفاقية شراكة مع عدة منظمات دولية لتعزيز برامج التعليم والتدريب.",
    category: "إغاثة طارئة",
    publishDate: "2026-08-04",
    views: 2180,
    mainImage: "/images/defaults/project-relief.svg",
  },
  {
    _id: "news-3",
    _type: "news",
    title: "توزيع مساعدات غذائية على 45 عائلة نازحة في المحافظات",
    excerpt: "وزعت الجمعية 45 سلة غذائية على العائلات النازحة في مخيمات المحافظات الجنوبية.",
    category: "إغاثة عاجلة",
    publishDate: "2026-07-28",
    views: 950,
    mainImage: "/images/defaults/project-development.svg",
  },
];

const FALLBACK_STORIES = [
  {
    _id: "story-1",
    _type: "successStory",
    title: "قصة فاطمة: من الصفر إلى المشروع الناجح",
    story: "بدأت فاطمة مشروعاً صغيراً لتصنيع الأحذية بعد حصولها على تدريب مهني من الجمعية قبل 6 أشهر فقط.",
    beneficiaryName: "أم أحمد (تعز)",
    publishDate: "2026-08-01",
    mainImage: "/images/defaults/story-woman.svg",
  },
  {
    _id: "story-2",
    _type: "successStory",
    title: "نجاح برنامج تعليمي مميز للأطفال النازحين",
    story:
      "نجح برنامج تعليمي مقدم من الجمعية في إعادة 200 طفل إلى المدارس وتقديم الدعم النفسي والتعليمي للأطفال والآباء.",
    beneficiaryName: "سعيد عبد الله (إب)",
    publishDate: "2026-07-15",
    mainImage: "/images/defaults/project-relief.svg",
  },
];

const FALLBACK_PROGRAMS = [
  {
    _id: "prog-1",
    _type: "program",
    title: "برنامج الإغاثة الطارئة والدعم الإنساني",
    description: "توفير المساعدات الإنسانية العاجلة للأسر المتضررة في المناطق المحرومة.",
    icon: "🏥",
    mainImage: "/images/defaults/project-relief.svg",
  },
  {
    _id: "prog-2",
    _type: "program",
    title: "برنامج التنمية المجتمعية المستدامة",
    description: "تعزيز قدرات المجتمعات المحلية من خلال المشاريع التنموية المستدامة.",
    icon: "🎓",
    mainImage: "/images/defaults/project-education.svg",
  },
];

const POPULAR_SEARCH_TAGS = [
  "إغاثة طارئة",
  "مشاريع مياه",
  "إغاثة طارئة",
  "تنمية مجتمعية",
  "إغاثة طارئة",
  "مشاريع تعليمية",
];

export function SearchOverlay({ isOpen, onClose, setCurrentPage }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    projects: any[];
    news: any[];
    successStories: any[];
    programs: any[];
  }>({
    projects: [],
    news: [],
    successStories: [],
    programs: [],
  });

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setFocusedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Merge Sanity & Fallback list without duplicates
  const mergeResults = (sanityList: any[], fallbackList: any[]) => {
    const map = new Map<string, any>();
    sanityList.forEach((item) => map.set(item._id || item.title, item));
    fallbackList.forEach((item) => {
      if (!map.has(item._id) && !map.has(item.title)) {
        map.set(item._id, item);
      }
    });
    return Array.from(map.values());
  };

  // Handle Sanity + Fallback Search logic with Debouncing
  useEffect(() => {
    if (!isOpen) return;

    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      setResults({ projects: [], news: [], successStories: [], programs: [] });
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        // Use ContentManager search (with timeout + fallback)
        const sanityRes = await contentManager.search(trimmedQuery);

        // Fallback filter over static items
        const matchedFallbackProjects = FALLBACK_PROJECTS.filter(
          (p) =>
            p.title.toLowerCase().includes(trimmedQuery) ||
            p.description.toLowerCase().includes(trimmedQuery) ||
            p.category.toLowerCase().includes(trimmedQuery)
        );

        const matchedFallbackNews = FALLBACK_NEWS.filter(
          (n) =>
            n.title.toLowerCase().includes(trimmedQuery) ||
            n.excerpt.toLowerCase().includes(trimmedQuery) ||
            n.category.toLowerCase().includes(trimmedQuery)
        );

        const matchedFallbackStories = FALLBACK_STORIES.filter(
          (s) =>
            s.title.toLowerCase().includes(trimmedQuery) ||
            s.story.toLowerCase().includes(trimmedQuery) ||
            s.beneficiaryName.toLowerCase().includes(trimmedQuery)
        );

        const matchedFallbackPrograms = FALLBACK_PROGRAMS.filter(
          (pr) =>
            pr.title.toLowerCase().includes(trimmedQuery) ||
            pr.description.toLowerCase().includes(trimmedQuery)
        );

        // Combine Sanity results with Fallback items ensuring unique IDs
        const combinedProjects = mergeResults(sanityRes?.projects || [], matchedFallbackProjects);
        const combinedNews = mergeResults(sanityRes?.news || [], matchedFallbackNews);
        const combinedStories = mergeResults(
          sanityRes?.successStories || [],
          matchedFallbackStories
        );
        const combinedPrograms = mergeResults(sanityRes?.programs || [], matchedFallbackPrograms);

        setResults({
          projects: combinedProjects,
          news: combinedNews,
          successStories: combinedStories,
          programs: combinedPrograms,
        });
      } catch {
        // Sanity search failed, using static fallback
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Flatten active items for keyboard navigation
  const activeFlattenedItems = useMemo(() => {
    const list: Array<{
      item: any;
      type: "project" | "news" | "successStory" | "program";
      targetPage: string;
    }> = [];

    if (selectedCategory === "all" || selectedCategory === "projects") {
      results.projects.forEach((p) =>
        list.push({ item: p, type: "project", targetPage: "projects" })
      );
    }
    if (selectedCategory === "all" || selectedCategory === "news") {
      results.news.forEach((n) => list.push({ item: n, type: "news", targetPage: "news" }));
    }
    if (selectedCategory === "all" || selectedCategory === "stories") {
      results.successStories.forEach((s) =>
        list.push({ item: s, type: "successStory", targetPage: "success" })
      );
    }
    if (selectedCategory === "all" || selectedCategory === "programs") {
      results.programs.forEach((pr) =>
        list.push({ item: pr, type: "program", targetPage: "programs" })
      );
    }

    return list;
  }, [results, selectedCategory]);

  const totalResultsCount = activeFlattenedItems.length;

  const handleSelectItem = useCallback(
    (targetPage: string, _item?: any) => {
      if (setCurrentPage) {
        setCurrentPage(targetPage);
      }
      onClose();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setCurrentPage, onClose]
  );

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Esc / Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev < totalResultsCount - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : totalResultsCount - 1));
      } else if (e.key === "Enter" && focusedIndex >= 0 && focusedIndex < totalResultsCount) {
        e.preventDefault();
        const selected = activeFlattenedItems[focusedIndex];
        if (selected) {
          handleSelectItem(selected.targetPage, selected.item);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, totalResultsCount, focusedIndex, activeFlattenedItems, handleSelectItem, onClose]);

  // Helper to extract image URL safely
  const getItemImage = (item: any) => {
    // ContentManager normalizes images into the 'image' field
    if (item.image) return item.image;
    if (item.mainImage) {
      if (typeof item.mainImage === "string") return item.mainImage;
      try {
        // Sanity image object
        if (item.mainImage.asset?.url) return item.mainImage.asset.url;
      } catch {
        // fallback
      }
    }
    return null;
  };

  // Helper to highlight matching text
  const renderHighlightedText = (text: string, searchStr: string) => {
    if (!text) return null;
    if (!searchStr.trim()) return text;

    const regex = new RegExp(`(${searchStr.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === searchStr.toLowerCase() ? (
        <mark
          key={i}
          className="bg-emerald-100 text-[var(--brand-green-dark)] font-bold rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 md:pt-20 px-4 bg-[var(--brand-ink)]/80 backdrop-blur-md transition-all"
        dir="rtl"
      >
        {/* Backdrop click to close */}
        <button
          type="button"
          tabIndex={-1}
          className="absolute inset-0 -z-10 bg-transparent border-0 w-full h-full cursor-default"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="ابحث عن المشاريع والأخبار والقصص والبرامج"
          className="relative w-full max-w-3xl bg-[var(--card)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Top Search Input Bar */}
          <div
            className="relative flex items-center p-4 sm:p-5 border-b border-[var(--border)] bg-[var(--background)]/50"
            role="search"
          >
            <Search
              className="w-6 h-6 text-emerald-600 mr-2 ml-3 flex-shrink-0"
              aria-hidden="true"
            />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب للبحث عن المشاريع والأخبار أو القصص والبرامج..."
              aria-label="اكتب للبحث"
              aria-autocomplete="list"
              aria-controls="search-results-list"
              className="w-full bg-transparent border-none outline-none text-base sm:text-lg font-bold font-cairo text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] placeholder:font-normal focus:ring-0"
            />

            {loading && (
              <Loader2
                className="w-5 h-5 text-[var(--brand-green)] animate-spin ml-2 flex-shrink-0"
                aria-label="جاري التحميل"
              />
            )}

            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1.5 rounded-full hover:bg-[var(--muted)]/80 text-[var(--muted-foreground)] transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
                aria-label="مسح البحث"
                title="مسح النص"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}

            <button
              onClick={onClose}
              aria-label="إغلاق البحث"
              className="px-3 py-1.5 bg-[var(--muted)]/60 hover:bg-[var(--muted)] text-[var(--foreground)] font-bold text-xs rounded-xl font-cairo transition-colors mr-2 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
            >
              <span className="hidden sm:inline">إغلاق</span>
              <kbd className="px-1.5 py-0.5 bg-[var(--card)] rounded border border-[var(--border)] text-[10px] shadow-2xs font-mono">
                Esc
              </kbd>
            </button>
          </div>

          {/* Filter Categories Pills */}
          <div
            className="flex items-center gap-2 px-4 py-3 bg-[var(--card)] border-b border-[var(--border)] overflow-x-auto no-scrollbar font-cairo text-xs font-bold"
            role="tablist"
            aria-label="تصفية حسب الفئات"
          >
            <span className="text-[var(--muted-foreground)] font-normal whitespace-nowrap ml-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" aria-hidden="true" />
              الفئات:
            </span>

            {[
              {
                id: "all",
                label: "الكل",
                count:
                  results.projects.length +
                  results.news.length +
                  results.successStories.length +
                  results.programs.length,
              },
              {
                id: "projects",
                label: "المشاريع",
                count: results.projects.length,
                icon: FolderHeart,
              },
              { id: "news", label: "الأخبار", count: results.news.length, icon: Newspaper },
              {
                id: "stories",
                label: "قصص نجاح",
                count: results.successStories.length,
                icon: Award,
              },
              { id: "programs", label: "البرامج", count: results.programs.length, icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`تصفية ${tab.label}`}
                  onClick={() => setSelectedCategory(tab.id as CategoryFilter)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] ${
                    isActive
                      ? "bg-[var(--brand-green)] text-white shadow-xs"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
                  <span>{tab.label}</span>
                  {query.trim() && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? "bg-[var(--card)]/20 text-white" : "bg-[var(--muted)] text-[var(--foreground)]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Results & Content Body */}
          <div
            id="search-results-list"
            ref={resultsContainerRef}
            className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1"
            aria-live="polite"
          >
            {/* Case 1: Empty Query - Show Suggestions & Tags */}
            {!query.trim() && (
              <div className="py-4 space-y-6">
                <div>
                    <h4 className="text-xs font-bold text-[var(--muted-foreground)] font-cairo mb-3 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      عمليات بحث شائعة:
                    </h4>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCH_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[var(--brand-green-dark)] font-bold text-xs rounded-xl font-cairo border border-emerald-100 transition-all hover:scale-105"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--border)]">
                  <button
                    onClick={() => handleSelectItem("projects")}
                    className="p-4 rounded-2xl bg-[var(--background)] hover:bg-emerald-50/60 border border-[var(--border)] hover:border-emerald-200 text-right transition-all group"
                  >
                    <FolderHeart className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h5 className="font-bold text-sm text-[var(--foreground)] font-cairo">
                      استكشف المشاريع الجارية
                    </h5>
                    <p className="text-xs text-[var(--muted-foreground)] font-cairo mt-1">
                      مشاريع متعددة تخدم المجتمعات المحرومة
                    </p>
                  </button>

                  <button
                    onClick={() => handleSelectItem("news")}
                    className="p-4 rounded-2xl bg-[var(--background)] hover:bg-emerald-50/60 border border-[var(--border)] hover:border-emerald-200 text-right transition-all group"
                  >
                    <Newspaper className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h5 className="font-bold text-sm text-[var(--foreground)] font-cairo">آخر الأخبار</h5>
                    <p className="text-xs text-[var(--muted-foreground)] font-cairo mt-1">
                      تابع آخر أخبار الجمعية والمشاريع
                    </p>
                  </button>

                  <button
                    onClick={() => handleSelectItem("donate")}
                    className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 border border-amber-200/60 text-right transition-all group"
                  >
                    <Heart
                      className="w-6 h-6 text-amber-600 mb-2 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                    />
                    <h5 className="font-bold text-sm text-amber-900 font-cairo">تبرع الآن</h5>
                    <p className="text-xs text-amber-700 font-cairo mt-1">
                      ساعد في دعم المشاريع الإنسانية والتنموية
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Case 2: Query Typed & No Results Found */}
            {query.trim() && !loading && totalResultsCount === 0 && (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-[var(--muted)] text-[var(--muted-foreground)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-[var(--foreground)] font-cairo mb-1">
                  لم يتم العثور على نتائج &quot;{query}&quot;
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] font-cairo max-w-sm mx-auto mb-6 leading-relaxed">
                  جرب البحث بكلمات مختلفة مثل &quot;مياه&quot;، &quot;تعليم&quot;،
                  &quot;إغاثة&quot;، أو تصفح المشاريع مباشرة.
                </p>
                <button
                  onClick={() => setQuery("")}
                  className="px-4 py-2 bg-[var(--brand-green)] text-white text-xs font-bold font-cairo rounded-xl shadow-xs hover:bg-[var(--brand-green-light)] transition-all"
                >
                  ابدأ البحث من جديد
                </button>
              </div>
            )}

            {/* Case 3: Results Found */}
            {query.trim() && totalResultsCount > 0 && (
              <div className="space-y-6 font-cairo">
                {/* 1. Projects Section */}
                {(selectedCategory === "all" || selectedCategory === "projects") &&
                  results.projects.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border)]">
                        <h4 className="text-xs font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5">
                          <FolderHeart className="w-4 h-4 text-emerald-600" />
                          المشاريع المجتمعية الجارية ({results.projects.length})
                        </h4>
                        <button
                          onClick={() => handleSelectItem("projects")}
                          className="text-xs font-bold text-[var(--brand-green)] hover:underline flex items-center gap-1"
                        >
                          عرض الكل <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {results.projects.map((proj, _idx) => {
                          const img = getItemImage(proj);
                          const globalIndex = activeFlattenedItems.findIndex(
                            (i) => i.item === proj
                          );
                          const isFocused = focusedIndex === globalIndex;

                          return (
                            <button
                              key={proj._id}
                              type="button"
                              onClick={() => handleSelectItem("projects", proj)}
                              aria-label={`مشروع مشروع?? ${proj.title}`}
                              className={`w-full text-right p-3 sm:p-4 rounded-2xl transition-all cursor-pointer border flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] ${
                                isFocused
                                  ? "bg-emerald-50/80 border-emerald-300 shadow-sm"
                                  : "bg-[var(--background)]/60 hover:bg-[var(--muted)]/80 border-[var(--border)] hover:border-[var(--border)]"
                              }`}
                            >
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[var(--muted)] overflow-hidden flex-shrink-0 relative">
                                {img ? (
                                  <FallbackImage
                                    src={img}
                                    alt={proj.title}
                                    containerClassName="w-full h-full"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-lg">
                                    مشروع
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-[var(--brand-green-dark)] font-bold rounded-md">
                                    {proj.category || "غير محدد"}
                                  </span>
                                  {proj.status && (
                                    <span className="text-[10px] text-[var(--muted-foreground)] font-semibold">
                                      � {proj.status}
                                    </span>
                                  )}
                                </div>
                                <h5 className="text-sm font-bold text-[var(--foreground)] truncate">
                                  {renderHighlightedText(proj.title, query)}
                                </h5>
                                <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
                                  {renderHighlightedText(proj.description, query)}
                                </p>

                                {proj.progress !== undefined && (
                                  <div className="mt-2 flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-[var(--brand-green)]"
                                        style={{ width: `${Math.min(proj.progress, 100)}%` }}
                                      />
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-700">
                                      {proj.progress}%
                                    </span>
                                  </div>
                                )}
                              </div>

                              <CornerDownLeft
                                className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                aria-hidden="true"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* 2. News Section */}
                {(selectedCategory === "all" || selectedCategory === "news") &&
                  results.news.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border)]">
                        <h4 className="text-xs font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5">
                          <Newspaper className="w-4 h-4 text-emerald-600" />
                          للتنقل? للتنقلمشروع ({results.news.length})
                        </h4>
                        <button
                          onClick={() => handleSelectItem("news")}
                          className="text-xs font-bold text-[var(--brand-green)] hover:underline flex items-center gap-1"
                        >
                          عرض الكل <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {results.news.map((item) => {
                          const img = getItemImage(item);
                          const globalIndex = activeFlattenedItems.findIndex(
                            (i) => i.item === item
                          );
                          const isFocused = focusedIndex === globalIndex;

                          return (
                            <button
                              key={item._id}
                              type="button"
                              onClick={() => handleSelectItem("news", item)}
                              aria-label={`مشروع مشروع??: ${item.title}`}
                              className={`w-full text-right p-3 sm:p-4 rounded-2xl transition-all cursor-pointer border flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] ${
                                isFocused
                                  ? "bg-emerald-50/80 border-emerald-300 shadow-sm"
                                  : "bg-[var(--background)]/60 hover:bg-[var(--muted)]/80 border-[var(--border)] hover:border-[var(--border)]"
                              }`}
                            >
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[var(--muted)] overflow-hidden flex-shrink-0">
                                {img ? (
                                  <FallbackImage
                                    src={img}
                                    alt={item.title}
                                    containerClassName="w-full h-full"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-lg">
                                    ??
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-700 font-bold rounded-md">
                                    {item.category || "عام"}
                                  </span>
                                  {item.publishDate && (
                                    <span className="text-[10px] text-[var(--muted-foreground)]">
                                      � {item.publishDate}
                                    </span>
                                  )}
                                </div>
                                <h5 className="text-sm font-bold text-[var(--foreground)] truncate">
                                  {renderHighlightedText(item.title, query)}
                                </h5>
                                <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
                                  {renderHighlightedText(item.excerpt, query)}
                                </p>
                              </div>

                              <CornerDownLeft
                                className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                aria-hidden="true"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* 3. Success Stories Section */}
                {(selectedCategory === "all" || selectedCategory === "stories") &&
                  results.successStories.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border)]">
                        <h4 className="text-xs font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-500" aria-hidden="true" />
                          مشروع للتنقل للتنقل ({results.successStories.length})
                        </h4>
                        <button
                          onClick={() => handleSelectItem("success")}
                          aria-label="مشروع ?? مشروع للتنقل"
                          className="text-xs font-bold text-[var(--brand-green)] hover:underline flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[var(--brand-green)] rounded"
                        >
                          عرض الكل <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {results.successStories.map((story) => {
                          const img = getItemImage(story);
                          const globalIndex = activeFlattenedItems.findIndex(
                            (i) => i.item === story
                          );
                          const isFocused = focusedIndex === globalIndex;

                          return (
                            <button
                              key={story._id}
                              type="button"
                              onClick={() => handleSelectItem("success", story)}
                              aria-label={`مشروع مشروع للتنقل: ${story.title}`}
                              className={`w-full text-right p-3 sm:p-4 rounded-2xl transition-all cursor-pointer border flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] ${
                                isFocused
                                  ? "bg-amber-50/80 border-amber-300 shadow-sm"
                                  : "bg-[var(--background)]/60 hover:bg-[var(--muted)]/80 border-[var(--border)] hover:border-[var(--border)]"
                              }`}
                            >
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[var(--muted)] overflow-hidden flex-shrink-0">
                                {img ? (
                                  <FallbackImage
                                    src={img}
                                    alt={story.title}
                                    containerClassName="w-full h-full"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-amber-100 text-amber-700 font-bold text-lg">
                                    ??
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-800 font-bold rounded-md">
                                    {story.beneficiaryName || "مستفيد"}
                                  </span>
                                </div>
                                <h5 className="text-sm font-bold text-[var(--foreground)] truncate">
                                  {renderHighlightedText(story.title, query)}
                                </h5>
                                <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
                                  {renderHighlightedText(story.story, query)}
                                </p>
                              </div>

                              <CornerDownLeft
                                className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                aria-hidden="true"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* 4. Programs Section */}
                {(selectedCategory === "all" || selectedCategory === "programs") &&
                  results.programs.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border)]">
                        <h4 className="text-xs font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                          للتنقل? للتنقلمشروع? ({results.programs.length})
                        </h4>
                        <button
                          onClick={() => handleSelectItem("programs")}
                          aria-label="مشروع ?? للتنقل? للتنقلمشروع?"
                          className="text-xs font-bold text-[var(--brand-green)] hover:underline flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-[var(--brand-green)] rounded"
                        >
                          عرض الكل <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {results.programs.map((prog) => {
                          const globalIndex = activeFlattenedItems.findIndex(
                            (i) => i.item === prog
                          );
                          const isFocused = focusedIndex === globalIndex;

                          return (
                            <button
                              key={prog._id}
                              type="button"
                              onClick={() => handleSelectItem("programs", prog)}
                              aria-label={`مشروع للتنقل ${prog.title}`}
                              className={`w-full text-right p-3 sm:p-4 rounded-2xl transition-all cursor-pointer border flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] ${
                                isFocused
                                  ? "bg-emerald-50/80 border-emerald-300 shadow-sm"
                                  : "bg-[var(--background)]/60 hover:bg-[var(--muted)]/80 border-[var(--border)] hover:border-[var(--border)]"
                              }`}
                            >
                              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold flex-shrink-0">
                                {prog.icon || "خبر"}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-bold text-[var(--foreground)] truncate">
                                  {renderHighlightedText(prog.title, query)}
                                </h5>
                                <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 mt-0.5">
                                  {renderHighlightedText(prog.description, query)}
                                </p>
                              </div>

                              <CornerDownLeft
                                className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                aria-hidden="true"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Bottom Footer Shortcuts Info */}
          <div className="px-5 py-3 bg-[var(--background)] border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted-foreground)] font-cairo">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--card)] border border-[var(--border)] rounded font-mono text-[10px]">
                  ?
                </kbd>
                <kbd className="px-1.5 py-0.5 bg-[var(--card)] border border-[var(--border)] rounded font-mono text-[10px]">
                  ?
                </kbd>
                للتنقل
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--card)] border border-[var(--border)] rounded font-mono text-[10px]">
                  ?
                </kbd>
                للتنقل??
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نتائج بحث فورية من Sanity CMS</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SearchOverlay;
