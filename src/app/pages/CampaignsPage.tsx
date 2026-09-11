// منظومة حملات الأفراد — منصة التبرعات الجماعية
import {
  Rocket,
  Share2,
  BarChart3,
  Users,
  TrendingUp,
  Heart,
  ChevronLeft,
  Megaphone,
  MessageCircle,
  Twitter,
  Facebook,
  Link2,
  PlusCircle,
  Clock,
  Sparkles,
  UserRound,
  Send,
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

const formatNumber = (v: number) => new Intl.NumberFormat("ar-YE").format(v);

const CAMPAIGNS = [
  {
    id: 1,
    creator: "أحمد الراشد",
    title: "حملة كسوة الشتاء",
    description: "توفير ملابس شتوية دافئة للأطفال المحتاجين في المناطق الجبلية",
    goal: 50000,
    collected: 32000,
    donors: 187,
    daysLeft: 12,
    project: "كسوة شتوية",
  },
  {
    id: 2,
    creator: "سارة المقطري",
    title: "بئر_حياة",
    description: "حفر بئر مياه ارتوازي لتزويد قرية كاملة بمياه الشرب النظيفة",
    goal: 250000,
    collected: 180000,
    donors: 342,
    daysLeft: 25,
    project: "آبار مياه",
  },
  {
    id: 3,
    creator: "محمد العمري",
    title: "تعليم_الأمل",
    description: "توفير الأدوات المدرسية والكتب لطلاب المدارس المحرومة",
    goal: 30000,
    collected: 28500,
    donors: 95,
    daysLeft: 4,
    project: "تعليم",
  },
  {
    id: 4,
    creator: "فاطمة الزهراء",
    title: "عيادة_صحي",
    description: "تجهيز عيادة متنقلة لتقديم الرعاية الصحية للقرى النائية",
    goal: 120000,
    collected: 67000,
    donors: 156,
    daysLeft: 30,
    project: "رعاية صحية",
  },
  {
    id: 5,
    creator: "خالد النجار",
    title: "غذاء_الأمان",
    description: "توفير سلال غذائية متكاملة لأكثر من 200 أسرة محتاجة",
    goal: 80000,
    collected: 54000,
    donors: 230,
    daysLeft: 18,
    project: "سلال غذائية",
  },
  {
    id: 6,
    creator: "نورة الحسني",
    title: "بيت_الكرامة",
    description: "ترميم وبناء بيوت مدمرة ل Families المتضررة من الظروف الراهنة",
    goal: 200000,
    collected: 95000,
    donors: 178,
    daysLeft: 45,
    project: "إيواء",
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "أنشئ حملتك",
    description: "اختر المشروع والهدف المالي والمدة الزمنية المناسبة لحملتك",
    icon: PlusCircle,
    color: "var(--brand-green)",
    bg: "var(--brand-green-pale)",
  },
  {
    step: 2,
    title: "شاركها",
    description: "انشر حملتك على واتساب وتويتر فيسبوك ووسائل التواصل الاجتماعي",
    icon: Share2,
    color: "var(--brand-gold-dark)",
    bg: "var(--brand-gold-pale)",
  },
  {
    step: 3,
    title: "تابع الأثر",
    description: "احصل على تقارير مباشرة عن التقدم ووصول التبرعات للمستفيدين",
    icon: BarChart3,
    color: "var(--info)",
    bg: "var(--info-bg)",
  },
];

const PROJECTS_OPTIONS = [
  "آبار مياه",
  "كسوة شتوية",
  "سلال غذائية",
  "تعليم",
  "رعاية صحية",
  "إيواء",
  "تمكين اقتصادي",
];

// ═══════════════════════════════════════════════════════
// المكون الرئيسي
// ═══════════════════════════════════════════════════════

export default function CampaignsPage() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState("");
  const [sharePreview, setSharePreview] = useState("");

  useSEO({
    title: "منظومة حملات الأفراد — أطلق حملتك | رحماء بينهم",
    description:
      "أنشئ حملتك الخاصة وتبرعاتك مع الأصدقاء. منصة التبرعات الجماعية التي تمكنك من صنع أثرك الخاص.",
    keywords: ["حملات تبرعات", "تبرعات جماعية", " fundraising", "رحماء بينهم"],
  });

  const handleSharePreview = (title: string) => {
    setSharePreview(title);
  };

  const stats = [
    { label: "حملة نشطة", value: "٤٢", icon: Rocket },
    { label: "متبرع مسجل", value: "٣,٤٥٠", icon: Users },
    { label: "مبلغ مجموع", value: "١.٢ مليون ر.ي", icon: TrendingUp },
    { label: "أثر直接", value: "١٢,٠٠٠ مستفيد", icon: Heart },
  ];

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
              <Megaphone className="h-4 w-4 text-[var(--brand-gold-light)]" />
              <span className="text-sm font-medium text-white">تبرعات جماعية</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
              أطلق حملتك{" "}
              <span className="text-[var(--brand-gold-light)]">— صنع أثرك الخاص</span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/80">
              أنشئ حملتك الخاصة، شاركها مع أصدقائك، وتابع الأثر المباشر لتبرعاتك.
              كل حملة تصنع فرقاً حقيقياً في حياة الأسر المحتاجة.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="flex items-center gap-2 rounded-xl bg-[var(--card)] px-8 py-4 text-lg font-bold text-[var(--brand-green)] shadow-2xl transition-all hover:shadow-2xl"
              >
                <Rocket className="h-5 w-5" />
                ابدأ حملتك الآن
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
              >
                استفسر عن الحملات
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Stats Section ═══════ */}
      <section className="bg-[var(--secondary)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StatsGrid stats={stats} columns={4} />
        </div>
      </section>

      {/* ═══════ Active Campaigns Section ═══════ */}
      <section className="bg-[var(--background)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              حملات <span className="text-[var(--brand-green)]">نشطة</span>
            </h2>
            <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">
              اختر حملة وكن شريكاً في صنع الأثر — كل تبرع يُغيّر حياة
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {CAMPAIGNS.map((campaign) => {
              const progress = Math.round((campaign.collected / campaign.goal) * 100);
              return (
                <motion.div
                  key={campaign.id}
                  variants={scrollFadeUp}
                  className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Header */}
                  <div className="relative bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)] p-6 text-white">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
                            <UserRound className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-white/80">
                            {campaign.creator}
                          </span>
                        </div>
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                          {campaign.project}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{campaign.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/70">
                        {campaign.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="p-6">
                    <div className="mb-4 flex items-end justify-between">
                      <div>
                        <div className="text-xs text-[var(--muted-foreground)]">تم جمعه</div>
                        <div className="text-xl font-bold text-[var(--brand-green)]">
                          {formatNumber(campaign.collected)} ر.ي
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-[var(--muted-foreground)]">الهدف</div>
                        <div className="text-sm font-bold text-[var(--foreground)]">
                          {formatNumber(campaign.goal)} ر.ي
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={viewportOnce}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-l from-[var(--brand-green)] to-[var(--brand-green-light)]"
                      />
                    </div>

                    <div className="mb-4 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                      <span className="font-bold text-[var(--brand-green)]">{progress}%</span>
                      <span>مكتمل</span>
                    </div>

                    {/* Meta */}
                    <div className="mb-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                        <Users className="h-3.5 w-3.5" />
                        <span>{campaign.donors} متبرع</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{campaign.daysLeft} يوم متبقي</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/donate")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-green)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[var(--brand-green-dark)] hover:shadow-lg"
                    >
                      <Heart className="h-4 w-4" />
                      تبرع الآن
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════ How It Works Section ═══════ */}
      <section className="bg-[var(--secondary)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              كيف <span className="text-[var(--brand-green)]">تعمل</span>؟
            </h2>
            <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">
              ثلاث خطوات بسيطة لإطلاق حملتك وصنع الأثر
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.15 }}
                  className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Icon className="h-8 w-8" style={{ color: item.color }} />
                  </div>
                  <div className="mb-2 text-sm font-bold text-[var(--muted-foreground)]">
                    الخطوة {item.step}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-[var(--foreground)]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ Create Campaign Form ═══════ */}
      <section className="bg-[var(--background)] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              أنشئ <span className="text-[var(--brand-green)]">حملتك</span>
            </h2>
            <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">
              املأ النموذج أدناه وابدأ رحلتك في صنع الأثر
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
                <Megaphone className="h-5 w-5" />
                نموذج إنشاء حملة
              </h3>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                    عنوان الحملة *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: كسوة_الشتاء — حملتي"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                    اختيار المشروع *
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                  >
                    <option value="">اختر المشروع</option>
                    {PROJECTS_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                  وصف الحملة *
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب وصفاً مختصراً لحملتك وللأثر المتوقع..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                    الهدف المالي (ر.ي) *
                  </label>
                  <input
                    type="number"
                    placeholder="50000"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">
                    مدة الحملة (أيام) *
                  </label>
                  <input
                    type="number"
                    placeholder="30"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--input-background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--brand-green)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/20"
                  />
                </div>
              </div>

              {/* Share Preview */}
              {sharePreview && (
                <div className="rounded-xl border border-[var(--brand-green)]/20 bg-[var(--brand-green-pale)] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--brand-green)]">
                    <Link2 className="h-4 w-4" />
                    معاينة المشاركة
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    تبرع في حملة "{sharePreview}" — رحماء بينهم
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleSharePreview("حملتي")}
                  className="flex items-center gap-2 rounded-xl bg-[var(--brand-green)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[var(--brand-green-dark)] hover:shadow-lg"
                >
                  <Rocket className="h-4 w-4" />
                  ابدأ حملتك
                </button>
                <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <span>أو شارك عبر:</span>
                  <button className="rounded-lg bg-[var(--brand-green-pale)] p-2 text-[var(--brand-green)] transition hover:bg-[var(--brand-green)] hover:text-white">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg bg-[var(--brand-green-pale)] p-2 text-[var(--brand-green)] transition hover:bg-[var(--brand-green)] hover:text-white">
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg bg-[var(--brand-green-pale)] p-2 text-[var(--brand-green)] transition hover:bg-[var(--brand-green)] hover:text-white">
                    <Facebook className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Leaderboard Section ═══════ */}
      <section className="bg-[var(--secondary)] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              أبرز <span className="text-[var(--brand-green)]">الحملات</span>
            </h2>
            <p className="mx-auto max-w-2xl text-[var(--muted-foreground)]">
              أكثر الحملات إنجازاً — قدوة في صنع الأثر
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-4"
          >
            {[...CAMPAIGNS]
              .sort(
                (a, b) =>
                  b.collected / b.goal - a.collected / a.goal,
              )
              .slice(0, 5)
              .map((campaign, i) => {
                const progress = Math.round(
                  (campaign.collected / campaign.goal) * 100,
                );
                const medals = ["🥇", "🥈", "🥉", "🏅", "🏅"];
                return (
                  <motion.div
                    key={campaign.id}
                    variants={scrollFadeUp}
                    className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green-pale)] text-xl font-bold text-[var(--brand-green)]">
                      {medals[i]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-[var(--foreground)]">
                          {campaign.title}
                        </h4>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          — {campaign.creator}
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          viewport={viewportOnce}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-gradient-to-l from-[var(--brand-gold)] to-[var(--brand-gold-light)]"
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                        <span className="font-bold text-[var(--brand-green)]">{progress}%</span>
                        <span>{campaign.donors} متبرع</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </motion.div>
        </div>
      </section>

      {/* ═══════ Final CTA ═══════ */}
      <section className="bg-gradient-to-br from-[var(--brand-green-dark)] to-[var(--brand-green)] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
          >
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-[var(--brand-gold-light)]" />
            <h2 className="mb-4 text-2xl font-bold text-white md:text-4xl">
              هل أنت مستعد لصنع الأثر؟
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
              كل حملة تبدأ بقرار واحد — قرّر اليوم وابدأ رحلتك في صنع الفرق
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="flex items-center gap-2 rounded-xl bg-[var(--card)] px-8 py-4 text-lg font-bold text-[var(--brand-green)] shadow-2xl transition-all hover:shadow-2xl"
              >
                <Heart className="h-5 w-5" />
                تبرع الآن
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
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
