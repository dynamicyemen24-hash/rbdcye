// Projects Page - صفحة المشاريع
import { motion } from "motion/react";
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
import { contentManager } from "@/shared/services/content-manager";
import { useSEO } from "@/utils/seoAdvanced";

interface Project {
  id: number | string;
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
  image: string;
}

const PROJECT_ICONS: Record<string, any> = {
  'المياه': Droplets,
  'إغاثة': Gift, 'الإغاثة': Gift,
  'التعليم': BookOpen,
  'التنمية': Heart,
  'بنية تحتية': MapPin,
  'دعوي': BookOpen,
  'عام': Heart,
};

const PROJECT_COLORS: Record<string, string> = {
  'المياه': 'cyan',
  'إغاثة': 'amber', 'الإغاثة': 'amber',
  'التعليم': 'purple',
  'التنمية': 'emerald',
  'بنية تحتية': 'blue',
  'دعوي': 'rose',
  'عام': 'emerald',
};

const CATEGORIES = ["الكل", "المياه", "الإغاثة", "التعليم", "التنمية", "بنية تحتية", "دعوي"];
const STATUS_FILTERS = [
  { label: "الكل", value: "all" as const },
  { label: "نشط", value: "active" as const },
  { label: "مكتمل", value: "completed" as const },
  { label: "قيد التخطيط", value: "planning" as const },
];

const statusConfig = {
  active: { label: "نشط", bg: "bg-[var(--success-bg)]", text: "text-[var(--success)]", dot: "bg-[var(--success-bg)]0" },
  completed: { label: "مكتمل", bg: "bg-[var(--info-bg)]", text: "text-[var(--info)]", dot: "bg-[var(--info-bg)]0" },
  planning: { label: "قيد التخطيط", bg: "bg-[var(--warning-bg)]", text: "text-[var(--warning)]", dot: "bg-[var(--warning-bg)]0" },
};

const PROJECT_IMAGES: Record<string, string> = {
  'المياه': '/images/defaults/project-water.svg',
  'إغاثة': '/images/defaults/project-relief.svg',
  'الإغاثة': '/images/defaults/project-relief.svg',
  'التعليم': '/images/defaults/project-education.svg',
  'التنمية': '/images/defaults/project-development.svg',
  'بنية تحتية': '/images/defaults/project-relief.svg',
  'دعوي': '/images/defaults/story-community.svg',
  'عام': '/images/defaults/project-relief.svg',
};

const DEFAULT_PROJECT_IMAGE = '/images/defaults/project-relief.svg';

// Normalize seed data
function normalizeSeedProjects(): Project[] {
  return SEED_PROJECTS.map((p) => {
    const statusMap: Record<string, Project['status']> = {
      'active': 'active', 'completed': 'completed', 'pending': 'planning',
    };
    const category = p.category || 'التنمية';
    return {
      id: p.id, title: p.title, category,
      status: statusMap[p.status] || 'active',
      progress: p.progress, budget: p.budget, raised: p.budget,
      beneficiaries: p.beneficiaries, location: p.location,
      icon: PROJECT_ICONS[category] || Heart,
      description: p.description,
      color: PROJECT_COLORS[category] || 'emerald',
      date: p.date,
      image: p.image || PROJECT_IMAGES[category] || DEFAULT_PROJECT_IMAGE,
    };
  });
}

// Normalize Sanity/API data
function normalizeApiProjects(items: any[]): Project[] {
  return items.map(p => {
    const category = p.category || 'عام';
    return {
      id: p.id || p._id || Math.random(),
      title: p.title || '',
      category,
      status: (p.status || 'active') as Project['status'],
      progress: p.progress || 0,
      budget: p.budget ? `${Number(p.budget).toLocaleString('ar')} ر.ي` : 'غير محدد',
      raised: p.raisedAmount ? `${Number(p.raisedAmount).toLocaleString('ar')} ر.ي` : '0',
      beneficiaries: p.beneficiaries || '',
      location: p.location || '',
      icon: PROJECT_ICONS[category] || Heart,
      description: p.description || '',
      color: PROJECT_COLORS[category] || 'emerald',
      date: p.start_date || '',
      image: p.image || p.mainImage || PROJECT_IMAGES[category] || DEFAULT_PROJECT_IMAGE,
    };
  });
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>(normalizeSeedProjects());
  const [contentSource, setContentSource] = useState<'static' | 'sanity'>('static');

  useSEO({
    title: 'مشاريعنا - رحماء بينهم',
    description: 'استعرض مشاريعنا الخيرية والإنسانية والتنموية في اليمن',
  });

  // ContentManager: static instantly → Sanity in background
  useEffect(() => {
    let cancelled = false;

    contentManager.getProjects().then(result => {
      if (cancelled) return;
      if (result.data.length > 0 && result.source !== 'static') {
        setProjects(normalizeApiProjects(result.data));
        setContentSource('sanity');
      } else {
        setProjects(normalizeSeedProjects());
        setContentSource('static');
      }
      try {
        analyticsService.generateProjectReport();
      } catch {
        // Reporting is optional; the projects page remains usable if analytics is unavailable.
      }
    }).catch(() => {
      if (!cancelled) setProjects(normalizeSeedProjects());
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
              <div className="w-2 h-2 rounded-full bg-[var(--info-bg)]0" />
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
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
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
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
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
              const Icon = project.icon;

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                >
                  {/* Image header - صورة المشروع الافتراضية أو من لوحة التحكم */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                    <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-11 h-11 shrink-0 rounded-xl bg-white/90 backdrop-blur-sm border border-[var(--brand-gold)]/40 flex items-center justify-center shadow-lg`}>
                          <Icon className="w-5 h-5 text-[var(--brand-green)]" />
                        </div>
                        <h3 className="font-bold text-white drop-shadow-md leading-snug line-clamp-1">{project.title}</h3>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-[var(--brand-gold)]/90 text-white text-xs font-semibold shadow">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">

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
                      <div className="h-2.5 bg-[var(--muted)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${project.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full rounded-full bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green-light)]"
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 rounded-lg bg-[var(--brand-green-pale)]/50 border border-[var(--brand-green)]/10">
                        <div className="font-bold text-sm text-[var(--foreground)]">{project.beneficiaries}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">مستفيد</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-[var(--brand-gold-pale)]/60 border border-[var(--brand-gold)]/15">
                        <div className="font-bold text-sm text-[var(--foreground)]">{project.budget}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">الميزانية</div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-[var(--secondary)] border border-[var(--border)]">
                        <div className="font-bold text-sm text-[var(--foreground)]">{project.raised}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">تم جمعه</div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-auto">
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
                </motion.article>
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
      <section className="relative py-20 bg-gradient-to-br from-[var(--brand-green-dark)] via-[var(--brand-green)] to-[var(--brand-green-light)] overflow-hidden">
        <div className="absolute inset-0 pattern-khatam-white" />
        <div className="absolute top-0 inset-x-0 h-2 pattern-band-gold" />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="mx-auto mb-6 flex justify-center">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                <rect x="14" y="14" width="28" height="28" stroke="var(--brand-gold)" strokeWidth="1.5" />
                <rect x="14" y="14" width="28" height="28" transform="rotate(45 28 28)" stroke="var(--brand-gold)" strokeWidth="1.5" />
                <circle cx="28" cy="28" r="3" fill="var(--brand-gold)" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">كن شريكاً في صناعة الأثر</h2>
            <p className="text-white/85 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
              كل مساهمة — مهما صغرت — تتحول في أيدينا إلى مياه تجري، ودرسٌ يُتلقّى، وأسرةٌ تنتج وتكفّل نفسها
            </p>
            <button
              onClick={() => navigate('/donate')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:-translate-y-0.5"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              تبرع الآن
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


