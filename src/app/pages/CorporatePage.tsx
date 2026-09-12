// صفحة منصة الشركات — صفحة الشراكات المؤسسية والمسؤولية المجتمعية
import {
  Building2,
  Gem,
  Star,
  Crown,
  Users,
  Heart,
  FileText,
  Calculator,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  CheckCircle2,
  TrendingUp,
  Award,
  Globe,
  BarChart3,
  Shield,
  BookOpen,
  Sparkles,
  Handshake,
  Target,
  Briefcase,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ArrowLeft,
  Send,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Building,
  GraduationCap,
  Droplets,
  School,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/app/components/PageHeader";
import { StatsGrid } from "@/app/components/StatsGrid";
import {
  scrollFadeUp,
  scrollSlideLeft,
  scrollSlideRight,
  scrollScaleIn,
  staggerContainer,
  viewportOnce,
} from "@/utils/animations";
import { useSEO } from "@/utils/seoAdvanced";

// ═══════════════════════════════════════════════════════
// ثوابت الصفحة
// ═══════════════════════════════════════════════════════
const PARTNERSHIP_TIERS = [
  {
    id: "silver",
    name: "شريك فضي",
    price: "٥٠,٠٠٠",
    priceNum: 50000,
    currency: "ر.ي/سنة",
    icon: Star,
    color: "var(--muted-foreground)",
    bgGradient: "from-gray-300 to-gray-400",
    benefits: [
      "شعار شركتك على موقعنا الإلكتروني",
      "تقرير سنوي بأثر الشراكة",
      "شهادة تقدير رسمية",
      "ذكر في نشراتنا الدورية",
    ],
  },
  {
    id: "gold",
    name: "شريك ذهبي",
    price: "١٠٠,٠٠٠",
    priceNum: 100000,
    currency: "ر.ي/سنة",
    icon: Crown,
    color: "var(--brand-gold)",
    bgGradient: "from-yellow-400 to-amber-500",
    benefits: [
      "جميع مزايا الشراكة الفضية",
      "زيارة ميدانية للمشاريع",
      "فعالية خاصة لشركائك",
      "تغطية إعلامية مشتركة",
      "تقارير أثر ربع سنوية",
    ],
    popular: true,
  },
  {
    id: "diamond",
    name: "شريك ماسي",
    price: "٢٥٠,٠٠٠+",
    priceNum: 250000,
    currency: "ر.ي/سنة",
    icon: Gem,
    color: "var(--info, #3b82f6)",
    bgGradient: "from-cyan-400 to-blue-500",
    benefits: [
      "جميع مزايا الشراكة الذهبية",
      "حملة تبرعات مختصرة بالعلامة التجارية",
      "مقعد في المجلس الاستشاري",
      "أولوية في فرص التعاون الجديدة",
      "استشارات مجتمعية متخصصة",
      "logo على جميع المطبوعات",
    ],
  },
];

const SUCCESS_STORIES = [
  {
    id: 1,
    name: "مجموعة البناء والتنمية",
    type: "شريك ماسي",
    impact: "أكثر من ١٢٠٠ أسرة استفادت من حملات التبرعات المشتركة",
    quote: "الشراكة مع رحماء بينهم أحدثت تحولاً حقيقياً في مجتمعنا. نفخر بكوننا جزءاً من هذا العمل الإنساني الرائد.",
    stats: { families: 1200, projects: 8, years: 3 },
  },
  {
    id: 2,
    name: "شركة التقنية المتقدمة",
    type: "شريك ذهبي",
    impact: "إنشاء ٣ مشاريع مياه نظيفة في المناطق النائية",
    quote: "تعلمّا من فريق رحماء بينهم أن الأعمال الناجحة تُقاس بأثرها المجتمعي. شراكتنا معهم غيّرت نظرتنا للمسؤولية المجتمعية.",
    stats: { families: 800, projects: 3, years: 2 },
  },
  {
    id: 3,
    name: "مؤسسة التعليم والتنمية",
    type: "شريك فضي",
    impact: "توفير المستلزمات المدرسية لأكثر من ٥٠٠ طالب",
    quote: "نؤمن بأن التعليم هو مفتاح التغيير. من خلال شراكتنا، تمكّنا من الوصول لأكثر من ٥٠٠ طالب في مناطق محتاجة.",
    stats: { families: 500, projects: 5, years: 2 },
  },
];

const BENEFITS = [
  {
    icon: Globe,
    title: "صورة عامة إيجابية",
    description: "تعزيز سمعة شركتك كمؤسسة مسؤولة اجتماعياً تُسهم في التنمية المستدامة",
    color: "var(--brand-green)",
  },
  {
    icon: FileText,
    title: "خصومات ضريبية",
    description: "لاستفادة من الإعفيات الضريبية المتاحة للتبرعات المؤسسية المعتمدة",
    color: "var(--brand-gold)",
  },
  {
    icon: Heart,
    title: "تقوية الروابط المجتمعية",
    description: "بناء علاقات أقوى مع المجتمع المحلي وتعزيز الثقة المتبادلة",
    color: "var(--brand-green-light, #10b981)",
  },
  {
    icon: GraduationCap,
    title: "تطوير مهارات الموظفين",
    description: "فرص للتطوع المؤسسي وبناء مهارات القيادة في بيئة مجتمعية",
    color: "var(--info, #3b82f6)",
  },
  {
    icon: BarChart3,
    title: "تقارير أثر مفصلة",
    description: "تقارير دورية شاملة تُوثّق أثر تبرعاتكم وتعكس أثر المساهمات المجتمعية",
    color: "var(--warning, #f59e0b)",
  },
  {
    icon: Award,
    title: "شهادات تقدير رسمية",
    description: "شهادات تقدير ومعايير جودة توثيق مساهمتكم الإنسانية الرائدة",
    color: "var(--brand-green)",
  },
];

const IMPACT_RATES = {
  familyFood: { cost: 2500, label: "أسرة شهرياً", icon: Heart },
  waterProject: { cost: 50000, label: "مشروع مياه نظيفة", icon: Droplets },
  schoolSupplies: { cost: 1500, label: "حقيبة مدرسية كاملة", icon: BookOpen },
};

// ═══════════════════════════════════════════════════════
// المكون الرئيسي — Corporate Page
// ═══════════════════════════════════════════════════════
export default function CorporatePage() {
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState(100);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);

  useSEO({
    title: "منصة الشركات — شراكة تُحدث أثراً | رحماء بينهم",
    description: "انضم لمنصة الشركات واجعل شركتك جزءاً من التغيير. شراكات مؤسسية فعّالة تُحدث أثراً حقيقياً في المجتمع.",
  });

  const annualContribution = employeeCount * monthlyContribution * 12;

  const impactMetrics = useMemo(() => {
    const families = Math.floor(annualContribution / IMPACT_RATES.familyFood.cost);
    const waterProjects = Math.floor(annualContribution / IMPACT_RATES.waterProject.cost);
    const schoolSupplies = Math.floor(annualContribution / IMPACT_RATES.schoolSupplies.cost);
    return { families, waterProjects, schoolSupplies };
  }, [annualContribution]);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("ar-SA").format(value);

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* ═══════ Hero Section ═══════ */}
      <PageHeader
        icon={Building2}
        badge="منصة الشركات والمسؤولية المجتمعية"
        title="منصة الشركات — شراكة تُحدث أثراً"
        subtitle="اجعل شركتك جزءاً من التغيير. بناء شراكات مؤسسية فعّالة تُحدث أثراً حقيقياً في حياة الأسر المحتاجة والمجتمعات المحلية."
      >
        <StatsGrid
          stats={[
            { label: "شريك مؤسسي", value: "٤٥+", icon: Building2, color: "green" },
            { label: "أسر مستفيدة", value: "١٥,٠٠٠+", icon: Heart, color: "gold" },
            { label: "مشروع مشترك", value: "٨٥+", icon: Target, color: "blue" },
            { label: "موظف مشارك", value: "٣,٥٠٠+", icon: Users, color: "purple" },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      {/* ═══════ آية قرآنية ═══════ */}
      <div className="my-8 rounded-2xl border border-[var(--brand-gold)]/20 bg-gradient-to-l from-[var(--brand-gold)]/5 to-transparent p-6 text-center">
        <p className="font-amiri text-xl leading-loose text-[var(--foreground)] md:text-2xl" dir="rtl">
          ﴿ وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ ﴾
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">سورة المائدة، الآية ٢</p>
      </div>

      {/* ═══════ Partnership Tiers ═══════ */}
      <section className="py-16 sm:py-20 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scrollFadeUp}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)] text-sm font-semibold mb-4">
              <Handshake className="w-4 h-4" />
              <span>مستويات الشراكة</span>
            </div>
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">
              اختر مستوى شراكتك المؤسسية
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              ثلاثة مستويات مصممة خصيصاً لتلبية احتياجات شركتك مع تعظيم الأثر المجتمعي
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {PARTNERSHIP_TIERS.map((tier) => {
              const TierIcon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  variants={scrollScaleIn}
                  className={`relative rounded-3xl border-2 p-8 transition-all duration-300 hover:shadow-2xl ${
                    tier.popular
                      ? "border-[var(--brand-gold)] bg-gradient-to-br from-[var(--brand-gold)]/5 to-[var(--background)] scale-105 shadow-xl"
                      : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand-green)]/30"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[var(--brand-gold)] to-amber-500 text-white text-xs font-bold shadow-lg">
                      الأكثر طلباً
                    </div>
                  )}

                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${tier.bgGradient} shadow-lg`}>
                    <TierIcon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{tier.name}</h3>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-[var(--foreground)]">{tier.price}</span>
                    <span className="text-sm text-[var(--muted-foreground)]">{tier.currency}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[var(--foreground)]">
                        <CheckCircle2 className="w-5 h-5 text-[var(--brand-green)] mt-0.5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      document.getElementById("corporate-contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      tier.popular
                        ? "bg-gradient-to-r from-[var(--brand-gold)] to-amber-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        : "bg-[var(--brand-green)] text-white hover:opacity-90 hover:shadow-lg"
                    }`}
                  >
                    ابدأ الشراكة الآن
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════ CSR Impact Calculator ═══════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[rgba(var(--brand-green-rgb),0.04)] to-[rgba(var(--brand-green-rgb),0.01)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scrollFadeUp}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)] text-sm font-semibold mb-4">
              <Calculator className="w-4 h-4" />
              <span>حاسبة الأثر</span>
            </div>
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">
              احسب أثر شركتك قبل البدء
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              أدخل بيانات شركتك واكتشف كم أسرة يمكنكم مساعدتها من خلال شراكتكم معنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Calculator Input */}
            <motion.div
              variants={scrollSlideRight}
              initial="initial"
              whileInView="visible"
              viewport={viewportOnce}
              className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-8 shadow-lg"
            >
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-green)]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[var(--brand-green)]" />
                </div>
                بيانات شركتك
              </h3>

              <div className="space-y-6">
                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    عدد الموظفين المشاركين
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50 focus:border-[var(--brand-green)] transition-all"
                  />
                  <input
                    type="range"
                    min={1}
                    max={2000}
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(parseInt(e.target.value))}
                    className="w-full mt-3 accent-[var(--brand-green)]"
                  />
                  <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                    <span>١ موظف</span>
                    <span>٢,٠٠٠ موظف</span>
                  </div>
                </div>

                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    المساهمة الشهرية لكل موظف (ر.ي)
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={500}
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Math.max(100, parseInt(e.target.value) || 100))}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50 focus:border-[var(--brand-green)] transition-all"
                  />
                  <input
                    type="range"
                    min={100}
                    max={50000}
                    step={500}
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                    className="w-full mt-3 accent-[var(--brand-green)]"
                  />
                  <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                    <span>١٠٠ ر.ي</span>
                    <span>٥٠,٠٠٠ ر.ي</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-[var(--brand-green)] to-emerald-600 p-6 text-white">
                  <p className="text-sm opacity-90 mb-1">إجمالي المساهمة السنوية</p>
                  <p className="text-3xl font-black">{formatNumber(annualContribution)} ر.ي</p>
                  <p className="text-xs opacity-75 mt-2">
                    {formatNumber(employeeCount)} موظف × {formatNumber(monthlyContribution)} ر.ي × ١٢ شهر
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Impact Results */}
            <motion.div
              variants={scrollSlideLeft}
              initial="initial"
              whileInView="visible"
              viewport={viewportOnce}
              className="space-y-6"
            >
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-8 shadow-lg">
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand-gold)]/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[var(--brand-gold)]" />
                  </div>
                  أثر شركتك السنوي
                </h3>

                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30">
                    <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                      <Heart className="w-7 h-7 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-black text-[var(--foreground)]">{formatNumber(impactMetrics.families)}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">أسرة تحصل على وجبات غذائية شهرياً</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                      <Droplets className="w-7 h-7 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-black text-[var(--foreground)]">{formatNumber(impactMetrics.waterProjects)}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">مشروع مياه نظيفة يُنفَّذ</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
                    <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                      <School className="w-7 h-7 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-black text-[var(--foreground)]">{formatNumber(impactMetrics.schoolSupplies)}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">حقيبة مدرسية كاملة للأطفال</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--brand-green)]/20 bg-[var(--brand-green)]/5 p-6">
                <p className="text-sm text-[var(--foreground)] leading-relaxed">
                  <span className="font-bold text-[var(--brand-green)]">ملاحظة:</span>{" "}
                  هذه تقديرات تقريبية بناءً على تكاليف المشاريع الحالية. الأثر الفعلي قد يختلف حسب نوع المشاريع والمناطق المستهدفة.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ Success Stories ═══════ */}
      <section className="py-16 sm:py-20 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scrollFadeUp}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>قصص نجاح شركات</span>
            </div>
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">
              شركاء نجحوا في إحداث التغيير
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              اكتشف كيف حققت شركات شريكتنا أثراً ملموساً في المجتمع من خلال شراكتها معنا
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {SUCCESS_STORIES.map((story) => (
              <motion.div
                key={story.id}
                variants={scrollScaleIn}
                className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[var(--brand-green)]/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand-green)] to-emerald-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--foreground)]">{story.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] font-semibold">
                      {story.type}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--brand-green)]/5 border border-[var(--brand-green)]/10 p-4 mb-6">
                  <p className="text-sm font-semibold text-[var(--brand-green)] mb-1">الأثر المحقق</p>
                  <p className="text-[var(--foreground)]">{story.impact}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl bg-[var(--muted)]/50">
                    <p className="text-lg font-bold text-[var(--foreground)]">{formatNumber(story.stats.families)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">أسرة</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-[var(--muted)]/50">
                    <p className="text-lg font-bold text-[var(--foreground)]">{formatNumber(story.stats.projects)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">مشاريع</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-[var(--muted)]/50">
                    <p className="text-lg font-bold text-[var(--foreground)]">{formatNumber(story.stats.years)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">سنوات</p>
                  </div>
                </div>

                <blockquote className="text-sm text-[var(--muted-foreground)] leading-relaxed italic border-r-2 border-[var(--brand-green)] pr-4">
                  "{story.quote}"
                </blockquote>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ Benefits of Partnership ═══════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[rgba(var(--brand-gold-rgb,217,119,6),0.04)] to-[rgba(var(--brand-gold-rgb,217,119,6),0.01)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scrollFadeUp}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)] text-sm font-semibold mb-4">
              <Briefcase className="w-4 h-4" />
              <span>مزايا الشراكة</span>
            </div>
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">
              لماذا تختار الشراكة مع رحماء بينهم؟
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              مزايا حصرية تجعل شراكتك معنا استثماراً حقيقياً في مجتمعك وشركتك
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {BENEFITS.map((benefit, idx) => {
              const BenefitIcon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  variants={scrollScaleIn}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 transition-all duration-300 hover:shadow-xl hover:border-[var(--brand-green)]/20 hover:scale-[1.02]"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `color-mix(in srgb, ${benefit.color} 12%, transparent)` }}
                  >
                    <BenefitIcon className="w-7 h-7" style={{ color: benefit.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{benefit.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════ Partner Logos ═══════ */}
      <section className="py-16 sm:py-20 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scrollFadeUp}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">شركاؤنا</h2>
            <p className="text-lg text-[var(--muted-foreground)]">
              نفخر بتعاوننا مع نخبة من المؤسسات والشركات الرائدة
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <motion.div
                key={idx}
                variants={scrollScaleIn}
                className="aspect-square rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--muted)]/30 flex items-center justify-center hover:border-[var(--brand-green)]/30 hover:bg-[var(--brand-green)]/5 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-center">
                  <Building2 className="w-8 h-8 text-[var(--muted-foreground)]/40 group-hover:text-[var(--brand-green)]/50 transition-colors mx-auto mb-2" />
                  <span className="text-xs text-[var(--muted-foreground)]/50 group-hover:text-[var(--muted-foreground)] transition-colors">
                    شريك {idx + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={scrollFadeUp}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mt-10"
          >
            <p className="text-sm text-[var(--muted-foreground)]">
              هل ترغب في أن تظهر شركتك هنا؟{" "}
              <button
                onClick={() => document.getElementById("corporate-contact")?.scrollIntoView({ behavior: "smooth" })}
                className="text-[var(--brand-green)] font-semibold hover:underline"
              >
                تواصل معنا
              </button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Contact Form ═══════ */}
      <section id="corporate-contact" className="py-16 sm:py-20 bg-gradient-to-br from-[rgba(var(--brand-green-rgb),0.06)] to-[rgba(var(--brand-green-rgb),0.01)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scrollFadeUp}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)] text-sm font-semibold mb-4">
              <MessageCircle className="w-4 h-4" />
              <span>تواصل معنا</span>
            </div>
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">
              ابدأ شراكتك اليوم
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              املأ النموذج أدناه وسيتواصل فريقنا معك خلال ٢٤ ساعة
            </p>
          </motion.div>

          <motion.div
            variants={scrollScaleIn}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-8 sm:p-12 shadow-xl"
          >
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    اسم الشركة *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                    <input
                      type="text"
                      required
                      placeholder="أدخل اسم الشركة"
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50 focus:border-[var(--brand-green)] transition-all"
                    />
                  </div>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                </div>

                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    اسم شخص التواصل *
                  </label>
                  <div className="relative">
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                    <input
                      type="text"
                      required
                      placeholder="الاسم الكامل"
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50 focus:border-[var(--brand-green)] transition-all"
                    />
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  </div>
                </div>

                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    رقم الهاتف *
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                    <input
                      type="tel"
                      required
                      placeholder="+٩٦٧ ..."
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50 focus:border-[var(--brand-green)] transition-all"
                    // eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: verified
                    />
                  </div>
                </div>

                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    البريد الإلكتروني *
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                    <input
                      type="email"
                      required
                      placeholder="email@company.com"
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50 focus:border-[var(--brand-green)] transition-all"
                    // eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: verified
                    />
                  </div>
                </div>
              </div>

              <div>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                  الاهتمام بالشراكة *
                </label>
                <div className="relative">
                  <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)] pointer-events-none" />
                  <select
                    required
                    className="w-full pr-4 pl-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50 focus:border-[var(--brand-green)] transition-all"
                  >
                    <option value="">اختر مستوى الشراكة</option>
                    <option value="silver">شريك فضي — ٥٠,٠٠٠ ر.ي/سنة</option>
                    <option value="gold">شريك ذهبي — ١٠٠,٠٠٠ ر.ي/سنة</option>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                    <option value="diamond">شريك ماسي — ٢٥٠,٠٠٠+ ر.ي/سنة</option>
                    <option value="custom">شراكة مخصصة — أريد مناقشة التفاصيل</option>
                  </select>
                </div>
              </div>

              <div>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                  رسالتك
                </label>
                <textarea
                  rows={4}
                  placeholder="اكتب رسالتك هنا... أخبرنا عن اهتمامات شركتك وأهدافها من الشراكة"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/50 focus:border-[var(--brand-green)] transition-all resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--brand-green)] to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Send className="w-5 h-5" />
                  <span>أرسل طلب الشراكة</span>
                </button>
                <p className="text-xs text-[var(--muted-foreground)]">
                  سيتواصل فريقنا معك خلال ٢٤ ساعة عمل
                </p>
              </div>
            </form>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
          >
            {[
              { icon: Phone, label: "الهاتف", value: "+٩٦٧ ٧٧٠ ٠٠٠ ٠٠٠", color: "var(--brand-green)" },
              { icon: Mail, label: "البريد الإلكتروني", value: "corporate@rbdcye.org", color: "var(--brand-gold)" },
              { icon: MapPin, label: "الموقع", value: "صنعاء، الجمهورية اليمنية", color: "var(--info, #3b82f6)" },
            ].map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={scrollFadeUp}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] hover:shadow-md transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `color-mix(in srgb, ${item.color} 12%, transparent)` }}
                  >
                    <ItemIcon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">{item.label}</p>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════ CTA Footer ═══════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[var(--brand-green)] to-emerald-700 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={scrollFadeUp}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl sm:text-3xl font-bold mb-4">
              معاً نبني مجتمعاً أقوى
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              كل شراكة مؤسسية هي خطوة نحو مستقبل أفضل للأسر المحتاجة والمجتمعات المحلية. انضم إلينا اليوم.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => document.getElementById("corporate-contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 rounded-xl bg-white text-[var(--brand-green)] font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                ابدأ شراكتك الآن
              </button>
              <button
                onClick={() => navigate("/donate")}
                className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                <span>تبرع فردي</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
