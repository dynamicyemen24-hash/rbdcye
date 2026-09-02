// News Page - صفحة الأخبار
import { motion } from "motion/react";
import {
  Newspaper, FolderOpen, Calendar, Tag, Search,
  TrendingUp, Eye, ArrowLeft, BarChart3,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/app/components/PageHeader";
import { Skeleton, CardSkeleton } from "@/app/components/Skeleton";
import { StatsGrid } from "@/app/components/StatsGrid";
import { SEED_NEWS_ITEMS, NEWS_CATEGORIES } from "@/content/website";
import { analyticsService } from "@/shared/services/analytics.service";
import { contentManager } from "@/shared/services/content-manager";
import { useSEO } from "@/utils/seoAdvanced";

function NewsLoadingSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-[var(--background)]" style={{ direction: "rtl" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <Skeleton width="100px" height="28px" className="mx-auto mb-3" />
          <Skeleton width="300px" height="36px" className="mx-auto" />
          <Skeleton width="400px" height="20px" className="mx-auto mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={`news-card-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const navigate = useNavigate();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [contentSource, setContentSource] = useState<'static' | 'cache' | 'sanity'>('static');

  useSEO({
    title: 'الأخبار - رحماء بينهم',
    description: 'الأخبار والفعاليات الأخيرة لـ رحماء بينهم الإنسانية',
    type: 'website',
    url: 'https://rbdcye.org/news',
    image: 'https://rbdcye.org/og-news.png',
    keywords: ['أخبار', 'فعاليات', 'إغاثة', 'تنمية', 'تعليم', 'يمن', 'رحماء بينهم'],
  });

  useEffect(() => {
    let cancelled = false;

    const fallback = SEED_NEWS_ITEMS.map((n: any) => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt,
      content: n.content,
      category: n.category,
      categoryColor: n.categoryColor,
      categoryBg: n.categoryBg,
      date: n.date,
      dateEn: n.dateEn,
      image: n.image,
      views: n.views,
      featured: n.featured,
      status: n.status,
      tags: n.tags,
      location: n.location,
    }));

    const loadNews = async () => {
      try {
        // ContentManager returns static defaults instantly, then upgrades to Sanity
        const result = await contentManager.getNews();
        if (!cancelled) {
          setNews(result.data);
          setContentSource(result.source === 'sanity' ? 'sanity' : 'static');
        }
      } catch {
        if (!cancelled) {
          setNews(fallback);
          setContentSource('static');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          try { analyticsService.generateImpactReport(); } catch { /* non-critical */ }
        }
      }
    };

    loadNews();
    return () => { cancelled = true; };
  }, []);

  // تصفية الأخبار
  const filteredNews = useMemo(() => {
    return news.filter((n: any) => {
      const matchesCategory = activeCategory === "الكل" || n.category === activeCategory;
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.excerpt && n.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [news, activeCategory, searchQuery]);

  // الأخبار المميزة
  const featuredNews = useMemo(() => {
    return news.filter((n: any) => n.featured).slice(0, 3);
  }, [news]);

  if (loading) {
    return <NewsLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* Unified Page Header */}
      <PageHeader
        icon={Newspaper}
        badge="الأخبار والفعاليات"
        title="آخر الأخبار"
        subtitle="تابع أخبار رحماء بينهم والفعاليات القادمة، وتعرف على أحدث الإنجازات والمبادرات"
      >
        <StatsGrid
          stats={[
            { label: 'خبر منشور', value: news.length, icon: BarChart3, color: 'green' },
            { label: 'أخبار مميزة', value: featuredNews.length, icon: TrendingUp, color: 'gold' },
            { label: 'فئة', value: NEWS_CATEGORIES.length - 1, icon: Tag, color: 'blue' },
            { label: 'مشاهدة', value: news.reduce((sum, n) => sum + (n.views || 0), 0).toLocaleString('ar-SA'), icon: Eye, color: 'purple' },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      {/* Category Filter */}
      <section className="py-6 bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                key="all"
                onClick={() => setActiveCategory("الكل")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === "الكل"
                    ? "bg-[var(--brand-green)] text-white shadow-lg"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                الكل
              </button>
              {NEWS_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all`}
                  style={{
                    backgroundColor: activeCategory === cat.name ? cat.color : cat.bg,
                    color: activeCategory === cat.name ? 'white' : cat.color,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الأخبار..."
                className="w-64 pr-10 pl-4 py-2 border border-[var(--border)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-12 bg-[var(--secondary)]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <span className="inline-flex items-center gap-2 text-[var(--brand-gold)] text-sm font-semibold bg-[var(--brand-gold-pale)] px-4 py-1.5 rounded-full mb-4">
                <TrendingUp className="w-4 h-4" />
                مميزة
              </span>
              <h2 className="text-3xl font-bold text-[var(--foreground)]">أبرز الأخبار</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredNews.map((n: any, i: number) => (
                <motion.article
                  key={n.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                >
                  {n.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={n.image}
                        alt={n.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 bg-[var(--brand-gold)] text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        مميز
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: n.categoryBg || 'var(--brand-green-pale)', color: n.categoryColor || 'var(--brand-green)' }}
                      >
                        {n.category}
                      </span>
                      <span className="text-[var(--muted-foreground)] text-xs">
                        • {n.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-[var(--foreground)] mb-2 group-hover:text-[var(--brand-green)] transition-colors line-clamp-2">
                      {n.title}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4 flex-1 line-clamp-3">
                      {n.excerpt}
                    </p>
                    <button
                      onClick={() => navigate(`/news/${n.id}`)}
                      className="mt-auto flex items-center gap-1 text-sm font-semibold text-[var(--brand-green)] hover:text-[var(--brand-green-light)] transition-colors"
                    >
                        اقرأ المزيد
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {news.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
              <h3 className="text-[var(--foreground)] text-lg font-semibold mb-2">لا توجد أخبار حالياً</h3>
              <p className="text-[var(--muted-foreground)]">
                نعمل على إضافة محتوى جديد، تابعنا لاحقاً
              </p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">لا توجد أخبار مطابقة</h3>
              <p className="text-[var(--muted-foreground)]">جرب تغيير معايير البحث أو الفئة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((n: any) => (
                <article
                  key={n.id}
                  className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {n.image && (
                    <img
                      src={n.image}
                      alt={n.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: n.categoryBg || 'var(--brand-green-pale)', color: n.categoryColor || 'var(--brand-green)' }}
                      >
                        {n.category}
                      </span>
                      <span className="text-[var(--muted-foreground)] text-xs">
                        • {n.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] mb-2 line-clamp-2" style={{ fontSize: "1rem" }}>
                      {n.title}
                    </h3>
                    <p className="text-[var(--muted-foreground)] flex-1 mb-4 line-clamp-3" style={{ fontSize: "0.85rem", lineHeight: "1.7" }}>
                      {n.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                      <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {n.date}
                        </div>
                        <span className="w-1 h-1 bg-[var(--muted)] rounded-full" />
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {n.views || 0}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/news/${n.id}`)}
                        className="px-4 py-1.5 bg-[var(--brand-green)] text-white rounded-lg text-xs hover:bg-[var(--brand-green-light)] transition-colors"
                      >
                        اقرأ المزيد
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}


