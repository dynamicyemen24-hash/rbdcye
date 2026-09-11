// برنامج كبار المانحين — شرف العطاء
import {
  Crown,
  Star,
  Gem,
  Users,
  Heart,
  Award,
  TrendingUp,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  FileText,
  Handshake,
  Target,
  Quote,
  CalendarDays,
  ArrowLeft,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Megaphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PageHeader } from "@/app/components/PageHeader";
import { StatsGrid } from "@/app/components/StatsGrid";
import {
  scrollFadeUp,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollSlideLeft,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollSlideRight,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollScaleIn,
  staggerContainer,
  viewportOnce,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hoverLift,
} from "@/utils/animations";
import { useSEO } from "@/utils/seoAdvanced";

// ═══════════════════════════════════════════════════════
// ثوابت الصفحة
// ═══════════════════════════════════════════════════════

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formatNumber = (v: number) => new Intl.NumberFormat("ar-YE").format(v);

const PROGRAM_TIERS = [
  {
    id: "alkima",
    name: "الْكِمَّة",
    annual: "١٠٠,٠٠٠+",
    annualNum: 100000,
    currency: "ر.ي/سنة",
    icon: Star,
    color: "var(--brand-green)",
    bg: "var(--brand-green-pale)",
    gradient: "from-emerald-500 to-teal-400",
    benefits: [
      "زيارة ميدانية للمشاريع",
      "تقرير شخصي بالأثر",
      "شهادة تقدير رسمية",
      "ذكر في نشراتنا الدورية",
    ],
  },
  {
    id: "almohafis",
    name: "الْمُحَفِّص",
    annual: "٢٥٠,٠٠٠+",
    annualNum: 250000,
    currency: "ر.ي/سنة",
    icon: Gem,
    color: "var(--brand-gold)",
    bg: "var(--brand-gold-pale)",
    gradient: "from-amber-500 to-yellow-400",
    benefits: [
      "جميع مزايا الدرجة الأولى",
      "مقعد في المجلس الاستشاري",
      "حملة تبرعات خاصة بالعلامة التجارية",
      "تقارير أثر ربع سنوية",
      "أولوية في فرص التعاون الجديدة",
    ],
    popular: true,
  },
  {
    id: "aldawriya",
    name: "الدَّوْرِيَّة",
    annual: "٥٠٠,٠٠٠+",
    annualNum: 500000,
    currency: "ر.ي/سنة",
    icon: Crown,
    color: "var(--danger)",
    bg: "var(--danger-bg)",
    gradient: "from-rose-500 to-pink-400",
    benefits: [
      "جميع مزايا الدرجتين السابقتين",
      "تسمية مشروع بأكمله",
      "تغطية إعلامية مشتركة",
      "رحلة حج أو عمرة",
      "لقاء خاص مع مجلس الإدارة",
      "شعار على جميع المطبوعات",
    ],
  },
];

const EXCLUSIVE_BENEFITS = [
  {
    title: "متابعة مباشرة للمشاريع",
    description: "تتبع لحظي لحالة المشاريع التي تدعمها عبر بوابة خاصة",
    icon: Target,
    color: "var(--brand-green)",
    bg: "var(--brand-green-pale)",
  },
  {
    title: "زيارات ميدانية حصرية",
    description: "جولات ميدانية لزيارة المشاريع واللقاء المباشر بالمستفيدين",
    icon: MapPin,
    color: "var(--brand-gold-dark)",
    bg: "var(--brand-gold-pale)",
  },
  {
    title: "تقارير شهرية مفصلة",
    description: "تقارير مفصلة عن التقدم والأثر المحقق في كل مشروع",
    icon: FileText,
    color: "var(--info)",
    bg: "var(--info-bg)",
  },
  {
    title: "دعوات لفعاليات خاصة",
    description: "حضور حفلات التكريم والفعاليات الخاصة بكبار المانحين",
    icon: CalendarDays,
    color: "var(--chart-3)",
    bg: "rgba(78, 141, 116, 0.1)",
  },
  {
    title: "شهادات تقدير رسمية",
    description: "شهادات تقدير رسمية معتمدة من الجمعية للمانحين المتميزين",
    icon: Award,
    color: "var(--brand-gold)",
    bg: "var(--brand-gold-pale)",
  },
  {
    title: "تسمية المشاريع",
    description: "إمكانية تسمية المشاريع الكبرى باسم المانح أو عائلته",
    icon: Sparkles,
    color: "var(--brand-green-light)",
    bg: "var(--brand-green-pale)",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "الشيخ عبدالله الراشد",
    tier: "الدَّوْرِيَّة",
    yearsActive: 5,
    quote:
      "program_علاقتنا مع رحماء بينهم ليست مجرد تبرعات، بل شراكة حقيقية في صنع الأثر. كل زيارة ميدانية تؤكد لنا أن أموالنا في أيدٍ أمينة تحقق فرقاً حقيقياً.",
    avatar: "ع",
  },
  {
    id: 2,
    name: "الدكتورة نورة المقطري",
    tier: "الْمُحَفِّص",
    yearsActive: 3,
    quote:
      "التقارير الشهرية المفصلة والزيارات الميدانية جعلتني أشعر بالانتماء الحقيقي لهذا العمل الإنساني. أوصي كل من يريد أن يجعل تبرعاته أكثر أثراً بالانضمام لهذا البرنامج.",
    avatar: "ن",
  },
  {
    id: 3,
    name: "المهندس خالد العولقي",
    tier: "الْكِمَّة",
    yearsActive: 2,
    quote:
      "الانضمام إلى برنامج كبار المانحين كان نقطة تحول في مسيرة العطاء. التكريم والتقدير يشجعان على مواصلة العمل الخيري ب Newmanية أكبر.",
    avatar: "خ",
  },
];

const IMPACT_STATS = [
  { label: "إجمالي مساهمات كبار المانحين", value: "٨.٥ مليون ر.ي", icon: TrendingUp },
  { label: "مشاريع ممولة بالكامل", value: "١٨ مشروع", icon: Target },
  { label: "حياة تم تغييرها", value: "٢٤,٠٠٠ مستفيد", icon: Heart },
  { label: "كبار المانحين المسجلين", value: "٤٥ مانح", icon: Users },
];

// ═══════════════════════════════════════════════════════
// المكون الرئيسي
// ═══════════════════════════════════════════════════════

export default function MajorDonorsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    annualGiving: "",
    preferredProjects: "",
    message: "",
  });

  useSEO({
    title: "برنامج كبار المانحين — شرف العطاء | رحماء بينهم",
    description:
      "برنامج حصري لكبار المانحين يوفر زيارات ميدانية وتقارير شخصية وتكريم خاص. انضم الآن وكن شريكاً في صنع الأثر.",
    keywords: ["كبار المانحين", "برنامج حصري", "تبرعات كبرى", "رحماء بينهم"],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-20" dir="rtl">
      {/* ═══════ Hero Section ═══════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-green-dark)] to-[var(--brand-green)] py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--brand-gold)]/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 backdrop-blur-sm">
              <Crown className="h-4 w-4 text-[var(--brand-gold-light)]" />
              <span className="text-sm font-medium text-white">برنامج حصري</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
              برنامج كبار المانحين{" "}
              <span className="text-[var(--brand-gold-light)]">— شرف العطاء</span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/80">
              برنامج حصري يُكرّم كبار المانحين ويمنحهم تجربة فريدة في متابعة الأثر.
              شرف العطاء يبدأ من هنا.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="flex items-center gap-2 rounded-xl bg-[var(--card)] px-8 py-4 text-lg font-bold text-[var(--brand-green)] shadow-2xl transition-all hover:shadow-2xl"
              >
                <Heart className="h-5 w-5" />
                انضم للبرنامج
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
              >
                تعرّف على المزيد
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Stats Section ═══════ */}
      <section className="bg-[var(--secondary)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StatsGrid
            stats={IMPACT_STATS.map((s) => ({ ...s, color: "green" as const }))}
            columns={4}
          />
        </div>
      </section>

      {/* ═══════ Program Tiers ═══════ */}
      <section className="bg-[var(--background)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              مستويات <span className="text-[var(--brand-green)]">البرنامج</span>
            </h2>
            <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">
              ثلاث درجات حصرية كل منها بمزايا فريدة تعكس قدر العطاء
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-8 md:grid-cols-3"
          >
            {PROGRAM_TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  variants={scrollFadeUp}
                  className={`relative overflow-hidden rounded-3xl border bg-[var(--card)] shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl ${
                    tier.popular
                      ? "border-[var(--brand-gold)] ring-2 ring-[var(--brand-gold)]/20"
                      : "border-[var(--border)]"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute left-0 right-0 top-0 bg-gradient-to-l from-[var(--brand-gold)] to-[var(--brand-gold-light)] py-2 text-center text-xs font-bold text-white">
                      الأكثر طلباً
                    </div>
                  )}

                  <div
                    className={`p-8 text-center ${tier.popular ? "pt-14" : ""}`}
                  >
                    <div
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: tier.bg }}
                    >
                      <Icon className="h-8 w-8" style={{ color: tier.color }} />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-[var(--foreground)]">
                      {tier.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-2xl font-bold" style={{ color: tier.color }}>
                        {tier.annual}
                      </span>
                      <span className="mr-1 text-sm text-[var(--muted-foreground)]">
                        {tier.currency}
                      </span>
                    </div>

                    <ul className="mb-8 space-y-3 text-right">
                      {tier.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-2 text-sm text-[var(--foreground)]"
                        >
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: tier.color }}
                          />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => navigate("/contact")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-lg"
                      style={{ backgroundColor: tier.color }}
                    >
                      <Handshake className="h-4 w-4" />
                      انضم الآن
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════ Exclusive Benefits ═══════ */}
      <section className="bg-[var(--secondary)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              مزايا <span className="text-[var(--brand-green)]">حصرية</span>
            </h2>
            <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">
              مزايا مصممة خصيصاً لتكريم كبار المانحين وتوفير تجربة فريدة
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {EXCLUSIVE_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={scrollFadeUp}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors group-hover:bg-[var(--brand-green)] group-hover:text-white"
                    style={{ backgroundColor: benefit.bg, color: benefit.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[var(--foreground)]">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════ Testimonials ═══════ */}
      <section className="bg-[var(--background)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              شهادات <span className="text-[var(--brand-green)]">كبار المانحين</span>
            </h2>
            <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">
              ماذا يقول شركاؤنا في برنامج كبار المانحين
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-8 md:grid-cols-3"
          >
            {TESTIMONIALS.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={scrollFadeUp}
                className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <Quote className="absolute left-4 top-4 h-12 w-12 text-[var(--brand-green)]/10" />
                <div className="relative z-10">
                  <p className="mb-6 text-sm leading-relaxed text-[var(--foreground)]">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-[var(--border)] pt-4">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-green)] text-sm font-bold text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--foreground)]">
                        {testimonial.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                        <span className="rounded-full bg-[var(--brand-green-pale)] px-2 py-0.5 text-[var(--brand-green)]">
                          {testimonial.tier}
                        </span>
                        <span>{testimonial.yearsActive} سنوات</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ Application Form ═══════ */}
      <section className="bg-[var(--secondary)] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              انضم <span className="text-[var(--brand-green)]">للبرنامج</span>
            </h2>
            <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">
              سجّل الآن وابدأ رحلتك مع برنامج كبار المانحين
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl"
          >
            <div className="bg-gradient-to-l from-[var(--brand-green)] to-[var(--brand-green-light)] p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                <Crown className="h-5 w-5" />
                نموذج الانضمام
              </h3>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="77xxxxxxx"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                    المبلغ السنوي المقصود (ر.ي) *
                  </label>
                  <select
                    name="annualGiving"
                    value={formData.annualGiving}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                  >
                    <option value="">اختر المبلغ</option>
                    <option value="100000">١٠٠,٠٠٠+ ر.ي (الْكِمَّة)</option>
                    <option value="250000">٢٥٠,٠٠٠+ ر.ي (الْمُحَفِّص)</option>
                    <option value="500000">٥٠٠,٠٠٠+ ر.ي (الدَّوْرِيَّة)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                  المشاريع المفضلة
                </label>
                <select
                  name="preferredProjects"
                  value={formData.preferredProjects}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                >
                  <option value="">اختر نوع المشاريع</option>
                  <option value="water">آبار مياه</option>
                  <option value="education">تعليم</option>
                  <option value="health">رعاية صحية</option>
                  <option value="food">سلال غذائية</option>
                  <option value="shelter">إيواء</option>
                  <option value="empowerment">تمكين اقتصادي</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                  رسالتك
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="أي ملاحظات أو تفضيلات خاصة..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                />
              </div>

              <button
                onClick={() => navigate("/contact")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-green)] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[var(--brand-green-dark)] hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
                انضم للبرنامج
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Impact of Major Donors ═══════ */}
      <section className="bg-gradient-to-br from-[var(--brand-green-dark)] to-[var(--brand-green)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
              أثر <span className="text-[var(--brand-gold-light)]">كبار المانحين</span>
            </h2>
            <p className="mx-auto max-w-2xl text-white/70">
              أرقام تعكس حجم الأثر الذي يصنعه كبار مانحينا في حياة المستفيدين
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                    <Icon className="h-6 w-6 text-[var(--brand-gold-light)]" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mt-1 text-xs text-white/60">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ Final CTA ═══════ */}
      <section className="bg-[var(--background)] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
          >
            <Crown className="mx-auto mb-4 h-10 w-10 text-[var(--brand-gold)]" />
            <h2 className="mb-4 text-2xl font-bold text-[var(--foreground)] md:text-4xl">
              شرف العطاء يبدأ من هنا
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-[var(--muted-foreground)]">
              كن شريكاً في صنع الأثر واحصل على تجربة فريدة في متابعة أثرك
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="flex items-center gap-2 rounded-xl bg-[var(--brand-green)] px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:bg-[var(--brand-green-dark)] hover:shadow-2xl"
              >
                <Heart className="h-5 w-5" />
                تبرع الآن
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="flex items-center gap-2 rounded-xl border-2 border-[var(--brand-green)]/30 px-8 py-4 text-lg font-bold text-[var(--brand-green)] transition-all hover:bg-[var(--brand-green)] hover:text-white"
              >
                <Send className="h-5 w-5" />
                تواصل معنا
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
