// الأثر والمعرفة - صفحة المعرفة والبحوث والأثر
import { motion } from "motion/react";
import {
  BookOpen, Quote, Users, BarChart3, TrendingUp, Search,
  ArrowLeft, Calendar, MapPin, FileText, FolderOpen,
  Award, Star, Download,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/app/components/PageHeader";
import { StatsGrid } from "@/app/components/StatsGrid";
import { SEED_SUCCESS_STORIES } from "@/content/website";
import { analyticsService } from "@/shared/services/analytics.service";
import { contentManager } from "@/shared/services/content-manager";
import { useSEO } from "@/utils/seoAdvanced";

interface KnowledgeItem {
  id: string;
  title: string;
  excerpt: string;
  fullStory: string;
  quote: string;
  name: string;
  role: string;
  program: string;
  category: string;
  year: string;
  location: string;
  rating: number;
  image: string;
  status: string;
  searchTags?: string[];
}

const CATEGORIES = ["الكل", "بحث", "تقرير", "دراسة", "تقييم"];

function normalizeStories(): KnowledgeItem[] {
  return SEED_SUCCESS_STORIES.map((s: any) => ({
    id: s.id,
    title: s.title,
    excerpt: s.excerpt,
    fullStory: s.excerpt + '\n\n' + (s.description || s.excerpt),
    quote: s.quote,
    name: s.name,
    role: s.role,
    program: s.program,
    category: s.category,
    year: s.year,
    location: s.location,
    rating: s.rating,
    image: s.image,
    status: s.status,
    searchTags: [s.title, s.category, s.location, s.program].filter(Boolean).map((t: string) => t.toLowerCase()),
  }));
}

export default function SuccessStoriesPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [items, setItems] = useState<KnowledgeItem[]>(normalizeStories());

  useSEO({
    title: 'الأثر والمعرفة - رحماء بينهم',
    description: 'نتائج أبحاثنا وتقارير أثرنا ودراساتنا التنموية في اليمن',
  });

  useEffect(() => {
    let cancelled = false;
    contentManager.getImpact()
      .then(() => {
        if (!cancelled) {
          try { analyticsService.generateImpactReport(); } catch { /* non-critical */ }
          setItems(normalizeStories());
        }
      })
      .catch(() => {
        if (!cancelled) setItems(normalizeStories());
      });
    return () => { cancelled = true; };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "الكل" && !searchQuery) return items;
    if (activeCategory !== "الكل" && !searchQuery) return items.filter(s => s.category === activeCategory);
    if (activeCategory === "الكل" && searchQuery) return items.filter(s =>
      s.searchTags?.some(tag => tag.includes(searchQuery.toLowerCase()))
    );
    return items.filter(s => s.category === activeCategory && s.searchTags?.some(tag => tag.includes(searchQuery.toLowerCase())));
  }, [items, activeCategory, searchQuery]);

  const itemsCount = useMemo(() => items.length, [items]);

  const categoryIcon = (cat: string) => {
    switch (cat) {
      case 'بحث': return BookOpen;
      case 'تقرير': return FileText;
      case 'دراسة': return FolderOpen;
      case 'تقييم': return Award;
      default: return BarChart3;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      <PageHeader
        icon={Award}
        badge="الأثر والمعرفة"
        title="أثرنا ومعرفتنا"
        subtitle="نتائج أبحاثنا وتقارير أثرنا ودراساتنا التنموية في اليمن"
      >
        <StatsGrid
          stats={[
            { label: 'بحث', value: itemsCount, icon: BookOpen, color: 'green' },
            { label: 'تقرير', value: 'متاح', icon: FileText, color: 'gold' },
            { label: 'مستفيد', value: '12,847', icon: Users, color: 'blue' },
            { label: 'تقييم', value: '4.9/5', icon: Star, color: 'purple' },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      <section className="py-6 bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم البحث أو التقرير أو القطاع..."
                className="w-full pl-10 py-2.5 rounded-xl bg-white border border-[var(--border)] text-xs font-bold text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--brand-green)] transition-colors"
                dir="rtl"
              />
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[var(--brand-green)] text-white shadow-lg"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredItems.map((item, i) => {
              const Icon = categoryIcon(item.category);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                      <Icon className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                      <span className="text-xs font-medium text-[var(--brand-green)]">{item.category}</span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[var(--foreground)]">
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-[var(--foreground)] leading-tight mb-3">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>

                    <div className="mb-4 p-3 bg-[var(--warning-bg)] rounded-lg border-r-2 border-[var(--warning)]">
                      <Quote className="w-4 h-4 text-[var(--warning)] mb-1" />
                      <p className="text-xs text-[var(--warning)] italic leading-relaxed line-clamp-2">
                        {item.quote}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand-green)]/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[var(--brand-green)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[var(--foreground)]">{item.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{item.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                      <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.year}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.location}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex items-center gap-1 text-sm font-semibold text-[var(--brand-green)] hover:text-[var(--brand-green-light)] transition-colors"
                      >
                        اطلع على التقرير
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">لا توجد نتائج مطابقة</h3>
              <p className="text-[var(--muted-foreground)]">جرب تغيير الفئة أو كلمة البحث</p>
            </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-64 object-cover rounded-t-3xl"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[var(--brand-green)]/10 text-[var(--brand-green)] rounded-full text-xs font-medium">
                  {selectedItem.category}
                </span>
                <span className="px-3 py-1 bg-[var(--brand-gold-pale)] text-[var(--brand-gold-dark)] rounded-full text-xs font-medium">
                  {selectedItem.location}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
                {selectedItem.title}
              </h2>

              <div className="mb-6 p-4 bg-[var(--warning-bg)] rounded-xl border-r-4 border-[var(--warning)]">
                <Quote className="w-6 h-6 text-[var(--warning)] mb-2" />
                <p className="text-lg text-[var(--warning)] italic leading-relaxed">
                  {selectedItem.quote}
                </p>
              </div>

              <p className="text-[var(--muted-foreground)] leading-relaxed mb-6">
                {selectedItem.fullStory}
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--brand-green)]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[var(--brand-green)]" />
                  </div>
                  <div>
                    <p className="font-bold text-[var(--foreground)]">{selectedItem.name}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{selectedItem.role}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {selectedItem.program} • {selectedItem.year}
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-green)] text-white font-bold hover:bg-[var(--brand-green-dark)] transition-colors">
                <Download className="w-4 h-4" />
                تحميل التقرير الكامل
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <section className="py-16 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">هل تريد الوصول إلى تقاريرنا؟</h2>
            <p className="text-white/80 text-lg mb-8">
            تحميل التقارير والأبحاث متاح مجاناً لدعم الشفافية والمعرفة المشتركة</p>
            <button
              onClick={() => navigate('/reports')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              <FileText className="w-5 h-5" />
              استكشف التقارير
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

