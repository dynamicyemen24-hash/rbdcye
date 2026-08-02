// Projects Page - صفحة المشاريع (محسّنة بدمج البيانات ولوحة التحكم)
import { motion } from "framer-motion";
import {
  Target, MapPin, Users, Calendar, ArrowLeft,
  Filter, Search, CheckCircle2, Clock, AlertCircle,
  Heart, Droplets, BookOpen, Gift, BarChart3, TrendingUp,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/app/components/PageHeader";
import { StatsGrid } from "@/app/components/StatsGrid";
import { SEED_PROJECTS } from "@/content/website";
import { analyticsService } from "@/shared/services/analytics.service";
import { contentBridge } from "@/shared/services/content-bridge.service";
import { useSEO } from "@/utils/seoAdvanced";

interface Project {
  id: number;
  title: string;
  category: string;
  status: 'active' | 'completed' | 'planning';
  progress: number;
  budget: string;
  raised: string;
  beneficiaries: string;
  location: string;
  icon: any;
  description: string;
  color: string;
  date: string;
}

const PROJECT_ICONS: Record<string, any> = {
  'المياه': Droplets,
  'الإغاثة': Gift,
  'التعليم': BookOpen,
  'التنمية': Heart,
  'بنية تحتية': MapPin,
  'دعوي': BookOpen,
};

const PROJECT_COLORS: Record<string, string> = {
  'المياه': 'cyan',
  'الإغاثة': 'amber',
  'التعليم': 'purple',
  'التنمية': 'emerald',
  'بنية تحتية': 'blue',
  'دعوي': 'rose',
};

const CATEGORIES = ["الكل", "المياه", "الإغاثة", "التعليم", "التنمية", "بنية تحتية", "دعوي"];
const STATUS_FILTERS = [
  { label: "الكل", value: "all" as const },
  { label: "نشط", value: "active" as const },
  { label: "مكتمل", value: "completed" as const },
  { label: "قيد التخطيط", value: "planning" as const },
];

const statusConfig = {
  active: { label: "نشط", bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
  completed: { label: "مكتمل", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  planning: { label: "قيد التخطيط", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
};

const colorMap: Record<string, string> = {
  cyan: "from-cyan-500 to-blue-500",
  rose: "from-rose-500 to-pink-500",
  amber: "from-amber-500 to-orange-500",
  emerald: "from-emerald-500 to-teal-500",
  blue: "from-blue-500 to-indigo-500",
  purple: "from-purple-500 to-violet-500",
};

// تحويل بيانات SEED_PROJECTS إلى تنسيق الصفحة
function normalizeSeedProjects(): Project[] {
  return SEED_PROJECTS.map((p) => {
    const statusMap: Record<string, Project['status']> = {
      'active': 'active',
      'completed': 'completed',
      'pending': 'planning',
    };
    const category = p.category || 'التنمية';
    return {
      id: p.id,
      title: p.title,
      category,
      status: statusMap[p.status] || 'active',
      progress: p.progress,
      budget: p.budget,
      raised: p.budget,
      beneficiaries: p.beneficiaries,
      location: p.location,
      icon: PROJECT_ICONS[category] || Heart,
      description: p.description,
      color: PROJECT_COLORS[category] || 'emerald',
      date: p.date,
    };
  });
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>(normalizeSeedProjects());
  const [loading, setLoading] = useState(false);

  useSEO({
    title: 'مشاريعنا - رحماء بينهم',
    description: 'استعرض مشاريعنا الخيرية والإنسانية والتنموية في اليمن',
  });

  // محاولة جلب البيانات من content-bridge (Sanity) مع fallback للبيانات الثابتة
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    contentBridge.getContent<any>('impact')
      .then(() => {
        if (!cancelled) {
          // حفظ مشاهدة الصفحة في التحليلات
        try {
            analyticsService.generateProjectReport();
          } catch {
            // Analytics failure is non-critical
          }
          setProjects(normalizeSeedProjects());
        }
      })
      .catch(() => {
        if (!cancelled) setProjects(normalizeSeedProjects());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = activeCategory === "الكل" || project.category === activeCategory;
      const matchesStatus = activeStatus === "all" || project.status === activeStatus;
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [projects, activeCategory, activeStatus, searchQuery]);

  // إحصاءات سريعة
  const totalBeneficiaries = useMemo(() =>
    projects.reduce((sum, p) => {
      const num = parseInt(p.beneficiaries.replace(/[^\d]/g, '')) || 0;
      return sum + num;
    }, 0), [projects]);

  const activeProjects = useMemo(() =>
    projects.filter(p => p.status === 'active').length, [projects]);

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* Unified Page Header */}
      <PageHeader
        icon={Target}
        badge="مشاريعنا الخيرية"
        title="مشاريعنا من أجلكم"
        subtitle="نعمل على تنفيذ مشاريع نوعية في مختلف المجالات الإنسانية والتنموية"
      >
        <StatsGrid
          stats={[
            { label: 'مشروع نشط', value: projects.length, icon: BarChart3, color: 'green' },
            { label: 'قيد التنفيذ', value: activeProjects, icon: Target, color: 'gold' },
            { label: 'مستفيد', value: totalBeneficiaries.toLocaleString('ar-SA'), icon: Users, color: 'blue' },
            { label: 'فئة', value: CATEGORIES.length - 1, icon: TrendingUp, color: 'purple' },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      {/* Quick Stats Bar - Secondary */}
      <section className="py-6 bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--brand-green)]" />
              <span className="text-[var(--muted-foreground)]">إجمالي المشاريع: <strong className="text-[var(--foreground)]">{projects.length}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--brand-gold)]" />
              <span className="text-[var(--muted-foreground)]">النشطة: <strong className="text-[var(--foreground)]">{activeProjects}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[var(--muted-foreground)]">المستفيدون: <strong className="text-[var(--foreground)]">{totalBeneficiaries.toLocaleString('ar-SA')}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-[var(--border)] sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-[var(--brand-green)] text-white shadow-lg"
                      : "bg-gray-100 text-[var(--muted-foreground)] hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setActiveStatus(status.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeStatus === status.value
                      ? "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                      : "text-[var(--muted-foreground)] hover:bg-gray-100"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث..."
                className="w-56 pr-10 pl-4 py-2 border border-[var(--border)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredProjects.map((project, i) => {
              const status = statusConfig[project.status];
              const colorMapLocal: Record<string, string> = {
                cyan: "from-cyan-500 to-blue-500",
                rose: "from-rose-500 to-pink-500",
                amber: "from-amber-500 to-orange-500",
                emerald: "from-emerald-500 to-teal-500",
                blue: "from-blue-500 to-indigo-500",
                purple: "from-purple-500 to-violet-500",
              };

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Color header */}
                  <div className={`h-3 bg-gradient-to-r ${colorMapLocal[project.color]}`} />

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMapLocal[project.color]} flex items-center justify-center`}>
                          <project.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[var(--foreground)]">{project.title}</h3>
                          <span className="text-xs text-[var(--muted-foreground)]">{project.category}</span>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-[var(--muted-foreground)]">نسبة الإنجاز</span>
                        <span className="font-semibold text-[var(--brand-green)]">{project.progress}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${project.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${colorMapLocal[project.color]}`}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                        <div className="font-bold text-sm text-[var(--foreground)]">{project.beneficiaries}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">مستفيد</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                        <div className="font-bold text-sm text-[var(--foreground)]">{project.budget}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">الميزانية</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                        <div className="font-bold text-sm text-[var(--foreground)]">{project.raised}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">تم جمعه</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                      <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <MapPin className="w-3.5 h-3.5" />
                        {project.location}
                      </div>
                      <button
                        onClick={() => navigate('/donate')}
                        className="flex items-center gap-1 text-sm font-semibold text-[var(--brand-green)] hover:text-[var(--brand-green-light)] transition-colors"
                      >
                        تبرع
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">لا توجد مشاريع مطابقة</h3>
              <p className="text-[var(--muted-foreground)]">جرب تغيير معايير البحث</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">هل تريد دعم مشروعاً؟</h2>
            <p className="text-white/80 text-lg mb-8">
              تبرع بمبلغك وساهم في تحقيق المشاريع التي تعنيك
            </p>
            <button
              onClick={() => navigate('/donate')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              <Heart className="w-5 h-5" fill="white" />
              تبرع الآن
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
