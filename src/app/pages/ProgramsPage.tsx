// Programs Page - صفحة البرامج والمشاريع
import { motion } from "motion/react";
import {
  BookOpen, Heart, Droplet, GraduationCap, Globe, Users,
  ArrowRight, Calendar, Target, TrendingUp, MapPin,
    Award, CheckCircle, BarChart3,

} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/app/components/PageHeader";
import { StatsGrid } from "@/app/components/StatsGrid";
import { SEED_PROJECTS } from "@/content/website";

import { analyticsService } from "@/shared/services/analytics.service";
import { contentManager } from "@/shared/services/content-manager";
import { useSEO } from "@/utils/seoAdvanced";

// 7 مسارات البرامج من المواصفات
const PROGRAM_PATHS = [
  {
    id: 'da'
    , label: 'مسار الدعوة',
    icon: BookOpen,
    color: 'blue',
    description: 'برامج الدعوة إلى الله والتعليم الشرعي والنشر العلمي',
    projects: ['مشروع الدعاة', 'تحفيظ القرآن', 'النشر العلمي'],
  },
  {
    id: 'social',
    label: 'مسار الرعاية الاجتماعية',
    icon: Heart,
    color: 'rose',
    description: 'برامج الكفالات، المساعدات المقطوعة، الكسوة، والكفارات',
    projects: ['الكفالة', 'المساعدات المقطوعة', 'الكسوة', 'الكفارات'],
  },
  {
    id: 'food',
    label: 'مسار الأمن الغذائي',
    icon: Droplet,
    color: 'cyan',
    description: 'برامج المطابخ الخيرية، السلال الغذائية، التمور، واللحوم',
    projects: ['المطابخ الخيرية', 'السلال الغذائية', 'التمور', 'اللحوم'],
  },
  {
    id: 'seasonal',
    label: 'المسار الموسمي',
    icon: Calendar,
    color: 'amber',
    description: 'برامج الأضاحي، تفطير الصائمين، ودفء الشتاء',
    projects: ['الأضاحي', 'تفطير الصائمين', 'دفء الشتاء'],
  },
  {
    id: 'endowment',
    label: 'مسار الصدقات الجارية',
    icon: Globe,
    color: 'emerald',
    description: 'برامج بناء المساجد، حفر الآبار، وبناء دور القرآن',
    projects: ['بناء المساجد', 'حفر الآبار', 'دور القرآن'],
  },
  {
    id: 'waqf',
    label: 'مسار الأوقاف',
    icon: Award,
    color: 'purple',
    description: 'برامج الأوقاف العقارية والأسهم الوقفية والتمكين الاقتصادي',
    projects: ['الوقف العقاري', 'الأسهم الوقفية', 'تمليك الأدوات'],
  },
  {
    id: 'zakat',
    label: 'حاسبة الزكاة',
    icon: Target,
    color: 'green',
    description: 'أداة حساب الزكاة المالية، الذهب، والفطر مع توجيه للدفع',
    projects: ['زكاة المال', 'زكاة الذهب', 'زكاة الفطر'],
  },
];

const PATH_COLORS: Record<string, string> = {
  blue: 'from-blue-500 to-indigo-500',
  rose: 'from-rose-500 to-pink-500',
  cyan: 'from-cyan-500 to-blue-500',
  amber: 'from-amber-500 to-orange-500',
  emerald: 'from-emerald-500 to-teal-500',
  purple: 'from-purple-500 to-violet-500',
  green: 'from-[var(--brand-green)] to-[var(--brand-green-light)]',
};

export default function ProgramsPage() {
  const navigate = useNavigate();
  const [, setActivePath] = useState<string | null>(null);

  useSEO({
    title: 'برامجنا - رحماء بينهم',
    description: 'برامجنا الخيرية والإنسانية والتنموية في اليمن - 7 مسارات شاملة',
    type: 'website',
    url: 'https://rbdcye.org/programs',
    keywords: ['برامج', 'مشاريع', 'إغاثة', 'تنمية', 'تعليم', 'يمن', 'رحماء بينهم'],
  });

  // تحميل البيانات من content-bridge
  useEffect(() => {
    let cancelled = false;
    contentManager.getImpact()
            .then((_result: { source?: string }) => {
        if (!cancelled) {
          try { analyticsService.generateProjectReport(); } catch { /* non-critical */ }
        }
      })
      .catch(() => undefined);

    return () => { cancelled = true; };
  }, []);

  const programs = SEED_PROJECTS;

  // إحصاءات سريعة
  const totalBeneficiaries = useMemo(() =>
    programs.reduce((sum, p) => {
      const num = parseInt(p.beneficiaries.replace(/[^\d]/g, '')) || 0;
      return sum + num;
    }, 0), [programs]);

  const activeProjects = useMemo(() =>
    programs.filter(p => p.status === 'active').length, [programs]);

  

  const totalBudget = useMemo(() =>
    programs.reduce((sum, p) => {
      const num = parseInt(p.budget.replace(/[^\d]/g, '')) || 0;
      return sum + num;
    }, 0), [programs]);

  return (
     <div className="min-h-screen bg-[var(--background)]" dir="rtl">
       {/* Unified Page Header */}
       <PageHeader
         icon={GraduationCap}
         badge="برامجنا"
         title="برامجنا ومشاريعنا"
         subtitle="نطمح لتغطية جميع احتياجات المجتمع عبر 7 مسارات متكاملة تشمل الدعوة، الرعاية الاجتماعية، الأمن الغذائي، والتنمية المستدامة"
       >
         <StatsGrid
           stats={[
             { label: 'مشروع', value: programs.length, icon: BarChart3, color: 'green' },
             { label: 'نشط', value: activeProjects, icon: Target, color: 'gold' },
             { label: 'مستفيد', value: totalBeneficiaries.toLocaleString('ar-SA'), icon: Users, color: 'blue' },
             { label: 'الميزانية (ر.ي)', value: totalBudget.toLocaleString('ar-SA'), icon: TrendingUp, color: 'purple' },
           ]}
           columns={4}
           variant="glass"
         />
       </PageHeader>

      {/* Program Paths Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-semibold bg-[var(--brand-green-pale)] px-4 py-1.5 rounded-full mb-4">
              <Target className="w-4 h-4" />
              مساراتنا البرامجية
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
              7 <span className="text-[var(--brand-green)]">مسارات</span> برامجية
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              نقدم برامج شاملة عبر 7 مسارات متكاملة تغطي احتياجات المجتمع اليمني
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PROGRAM_PATHS.map((path, i) => {
              const Icon = path.icon;
              const gradient = PATH_COLORS[path.color];
              

              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                                    role="button"
                  tabIndex={0}
                  onMouseEnter={() => setActivePath(path.id)}
                  onMouseLeave={() => setActivePath(null)}
                  onFocus={() => setActivePath(path.id)}
                  onBlur={() => setActivePath(null)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      if (path.id === 'zakat') navigate('/zakat');
                      else navigate('/projects');
                    }
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}

                  className="group relative bg-white rounded-3xl p-6 border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
                  onClick={() => {
                    if (path.id === 'zakat') {
                      navigate('/zakat');
                    } else {
                      navigate('/projects');
                    }
                  }}
                >
                  {/* Gradient accent */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`} />

                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-[var(--foreground)] mb-1 group-hover:text-[var(--brand-green)] transition-colors">
                        {path.label}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                        {path.description}
                      </p>
                    </div>
                  </div>

                  {/* Projects list */}
                  <div className="mt-4 space-y-2">
                    {path.projects.map((project, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                        <CheckCircle className="w-3 h-3 text-[var(--brand-green)]" />
                        <span>{project}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <div className="mt-4 flex items-center gap-2 text-[var(--brand-green)] text-sm font-semibold">
                    <span>عرض المزيد</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-gold)] text-sm font-semibold bg-[var(--brand-gold-pale)] px-4 py-1.5 rounded-full mb-4">
              <BarChart3 className="w-4 h-4" />
              مشاريعنا
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
              مشاريع <span className="text-[var(--brand-green)]">من أجلكم</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              تصفح جميع مشاريعنا الخيرية والإنسانية والتنموية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl p-6 border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[var(--brand-green-pale)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Target className="w-7 h-7 text-[var(--brand-green)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--foreground)] text-lg mb-1">{program.title}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      program.status === 'active' ? 'bg-[var(--success-bg)] text-[var(--success)]' :
                      program.status === 'completed' ? 'bg-[var(--info-bg)] text-[var(--info)]' : 'bg-[var(--warning-bg)] text-[var(--warning)]'
                    }`}>
                      {program.status === 'active' ? 'نشط' : program.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                    </span>
                  </div>
                </div>

                <p className="text-[var(--muted-foreground)] text-sm mb-4 leading-relaxed">
                  {program.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted-foreground)] flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {program.beneficiaries}
                    </span>
                    <span className="text-[var(--muted-foreground)] flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {program.location}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--muted-foreground)]">نسبة الإنجاز</span>
                      <span className="text-xs font-bold text-[var(--brand-green)]">{program.progress}%</span>
                    </div>
                    <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${program.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green-light)]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">الميزانية</span>
                    <span className="font-semibold text-[var(--foreground)]">{program.budget}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-1 text-sm text-[var(--brand-green)] hover:text-[var(--brand-green-light)] transition-colors"
                  >
                    عرض التفاصيل
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => navigate('/donate')}
                    className="flex items-center gap-1 text-sm bg-[var(--brand-green)] text-white px-4 py-1.5 rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    تبرع
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {programs.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">لا توجد برامج متاحة حالياً</h3>
              <p className="text-[var(--muted-foreground)]">نحن نعمل على إضافة برامج جديدة قريباً</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Heart className="w-16 h-16 text-white/30 mx-auto mb-6" fill="currentColor" />
            <h2 className="text-4xl font-bold text-white mb-4">هل تريد دعم برنامجاً؟</h2>
            <p className="text-white/80 text-lg mb-8">
              ساهم في إحداث فرق حقيقي في حياة المحتاجين عبر برامجنا المتنوعة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/donate')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
              >
                <Heart className="w-5 h-5" fill="white" />
                تبرع الآن
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                <Users className="w-5 h-5" />
                تواصل معنا
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}


