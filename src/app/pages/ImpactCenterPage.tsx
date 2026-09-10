import { useState, useEffect, useRef, memo, useCallback } from "react";
import { motion, useInView } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Droplets,
  GraduationCap,
  Stethoscope,
  Building2,
  MapPin,
  Calendar,
  Download,
  FileText,
  FileBarChart,
  BarChart3,
  Target,
  Award,
  Sparkles,
  ArrowUpLeft,
  Eye,
  ChevronLeft,
} from "lucide-react";

/* ─── Animated Counter Hook ─── */
function useAnimatedCounter(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startOnView || !isInView || hasStarted.current) return;
    hasStarted.current = true;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration, startOnView]);

  return { count, ref };
}

/* ─── Data ─── */
const KPI_DATA = [
  { id: "donors", label: "إجمالي المتبرعين", value: 2340, suffix: "+", icon: Users, color: "#059669", trend: "+18%", up: true, bg: "from-emerald-500/20 to-emerald-600/5" },
  { id: "donations", label: "إجمالي التبرعات", value: 15.2, suffix: " مليون ر.ي", icon: Heart, color: "#d97706", trend: "+24%", up: true, bg: "from-amber-500/20 to-amber-600/5", isDecimal: true },
  { id: "beneficiaries", label: "المستفيدون", value: 15000, suffix: "+", icon: Target, color: "#2563eb", trend: "+32%", up: true, bg: "from-blue-500/20 to-blue-600/5" },
  { id: "projects", label: "المشاريع المنجزة", value: 24, suffix: " مشروع", icon: Building2, color: "#7c3aed", trend: "+6", up: true, bg: "from-violet-500/20 to-violet-600/5" },
  { id: "governorates", label: "المحافظات المغطاة", value: 8, suffix: " محافظات", icon: MapPin, color: "#dc2626", trend: "+2", up: true, bg: "from-red-500/20 to-red-600/5" },
  { id: "years", label: "سنوات الخدمة", value: 12, suffix: " سنة", icon: Award, color: "#0891b2", trend: "+1", up: true, bg: "from-cyan-500/20 to-cyan-600/5" },
];

const CATEGORY_DATA = [
  { label: "الكفالات", value: 450, unit: "يتيم", max: 500, color: "#059669", icon: Heart },
  { label: "المياه", value: 8, unit: "آبار", max: 10, color: "#0891b2", icon: Droplets },
  { label: "الغذاء", value: 12000, unit: "سلة", max: 15000, color: "#d97706", icon: Users },
  { label: "التعليم", value: 6, unit: "حلقات", max: 10, color: "#2563eb", icon: GraduationCap },
  { label: "الصحة", value: 1200, unit: "مريض", max: 2000, color: "#dc2626", icon: Stethoscope },
  { label: "المشاريع", value: 5, unit: "مشاريع وقفية", max: 8, color: "#7c3aed", icon: Building2 },
];

const GOVERNORATES = [
  { name: "صنعاء", projects: 8, beneficiaries: 5200, signature: "مشروع مياه صنعاء الأزرق", color: "#059669" },
  { name: "عدن", projects: 4, beneficiaries: 2800, signature: "مركز تعليم عدن", color: "#2563eb" },
  { name: "تعز", projects: 3, beneficiaries: 2100, signature: "برنامج كفالات تعز", color: "#d97706" },
  { name: "إب", projects: 3, beneficiaries: 1500, signature: "مزرعة إب الزراعية", color: "#7c3aed" },
  { name: "مأرب", projects: 2, beneficiaries: 1200, signature: "حفر آبار مأرب", color: "#dc2626" },
  { name: "الحديدة", projects: 2, beneficiaries: 900, signature: "سلال غذائية الحديدة", color: "#0891b2" },
  { name: "حضرموت", projects: 1, beneficiaries: 800, signature: "مشروع حياء حضرموت", color: "#ea580c" },
  { name: "صعدة", projects: 1, beneficiaries: 500, signature: "مستوصف صعدة النibli", color: "#4f46e5" },
];

const MONTHLY_DATA = [
  { month: "يناير", value: 62 },
  { month: "فبراير", value: 68 },
  { month: "مارس", value: 71 },
  { month: "أبريل", value: 78 },
  { month: "مايو", value: 82 },
  { month: "يونيو", value: 75 },
  { month: "يوليو", value: 88 },
  { month: "أغسطس", value: 92 },
  { month: "سبتمبر", value: 86 },
  { month: "أكتوبر", value: 95 },
  { month: "نوفمبر", value: 98 },
  { month: "ديسمبر", value: 100 },
];

const IMPACT_STORIES = [
  {
    id: 1,
    title: "أحمد يعود للمدرسة بعد عام من التوقف",
    description: "بفضل برنامج الكفالات التعليمية، تمكن أحمد (١١ عامًا) من العودة إلى مقاعد الدراسة بعد أن كان يعمل في سوق شعبي لمساعدة أسرته. اليوم يتصدر فصله.",
    metric: "طالب عاد للتعليم",
    date: "ديسمبر ٢٠٢٥",
    icon: GraduationCap,
    color: "#2563eb",
  },
  {
    id: 2,
    title: "بئر صنعاء يُنقذ ٥٠٠ أسرة",
    description: "بعد سنوات من معاناة نقص المياه في مديرية بني مطر، تم حفر بئر مياه عميق يخدم أكثر من ٥٠٠ أسرة. تراجعتحالات التسمم بنسبة ٨٥%.",
    metric: "٥٠٠ أسرة حصلت على مياه نقية",
    date: "نوفمبر ٢٠٢٥",
    icon: Droplets,
    color: "#0891b2",
  },
  {
    id: 3,
    title: "٣,٠٠٠ سلة غذائية لذوي الاحتياجات",
    description: "وزعت حملة رمضان ٢٠٢٥ أكثر من ٣,٠٠٠ سلة غذائية شاملة على الأسر الأكثر حاجة في تعز وإب. كل سلة تكفي أسرة لأكثر من شهر.",
    metric: "٣,٠٠٠ سلة غذائية",
    date: "أبريل ٢٠٢٥",
    icon: Heart,
    color: "#d97706",
  },
];

const REPORTS = [
  { title: "التقرير السنوي ٢٠٢٤", type: "سنوي", size: "٣.٨ ميجا", icon: FileText, color: "#059669" },
  { title: "تقرير الأثر الربعي - Q٣ ٢٠٢٥", type: "أثر", size: "١.٢ ميجا", icon: BarChart3, color: "#d97706" },
  { title: "التقرير المالي ٢٠٢٤", type: "مالي", size: "٢.٥ ميجا", icon: FileBarChart, color: "#2563eb" },
];

/* ─── Sub-Components ─── */
const KPICard = memo(function KPICard({ kpi, index }: { kpi: (typeof KPI_DATA)[number]; index: number }) {
  const Icon = kpi.icon;
  const { count, ref } = useAnimatedCounter(kpi.value, 2200);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">{kpi.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]" style={{ fontVariantNumeric: "tabular-nums" }}>
            {kpi.isDecimal ? count.toFixed(1) : count.toLocaleString("ar-SA")}
            <span className="text-lg text-[var(--muted-foreground)] mr-1">{kpi.suffix}</span>
          </p>
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${kpi.color}18` }}
        >
          <Icon className="h-6 w-6" style={{ color: kpi.color }} />
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-1.5">
        {kpi.up ? (
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-sm font-bold ${kpi.up ? "text-emerald-500" : "text-red-500"}`}>{kpi.trend}</span>
        <span className="text-xs text-[var(--muted-foreground)]">عن العام الماضي</span>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-full rounded-b-2xl" style={{ backgroundColor: kpi.color, opacity: 0.6 }} />
    </motion.div>
  );
});

const CategoryBar = memo(function CategoryBar({ cat, index }: { cat: (typeof CATEGORY_DATA)[number]; index: number }) {
  const Icon = cat.icon;
  const percentage = (cat.value / cat.max) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${cat.color}18` }}>
            <Icon className="h-4 w-4" style={{ color: cat.color }} />
          </div>
          <span className="text-sm font-bold text-[var(--foreground)]">{cat.label}</span>
        </div>
        <span className="text-sm font-bold text-[var(--foreground)]">
          {cat.value.toLocaleString("ar-SA")} <span className="text-[var(--muted-foreground)] font-normal">{cat.unit}</span>
        </span>
      </div>
      <div className="relative h-4 overflow-hidden rounded-full bg-[var(--muted)]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 right-0 rounded-full"
          style={{ backgroundColor: cat.color }}
        />
        <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)` }} />
      </div>
    </motion.div>
  );
});

const GovernorateCard = memo(function GovernorateCard({ gov, index }: { gov: (typeof GOVERNORATES)[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
    >
      <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-[3rem] opacity-10 transition-opacity group-hover:opacity-20" style={{ backgroundColor: gov.color }} />

      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-3 w-3 items-center justify-center rounded-full" style={{ backgroundColor: gov.color }}>
            <MapPin className="h-1.5 w-1.5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">{gov.name}</h3>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">المشاريع</p>
            <p className="text-xl font-bold text-[var(--foreground)]">{gov.projects}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">المستفيدون</p>
            <p className="text-xl font-bold text-[var(--foreground)]">{gov.beneficiaries.toLocaleString("ar-SA")}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-[var(--muted)]/60 px-3 py-2">
          <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: gov.color }} />
          <span className="text-xs font-medium text-[var(--muted-foreground)]">{gov.signature}</span>
        </div>
      </div>
    </motion.div>
  );
});

const MonthlyChart = memo(function MonthlyChart() {
  const maxVal = Math.max(...MONTHLY_DATA.map((d) => d.value));

  return (
    <div className="flex items-end gap-1.5 sm:gap-2" style={{ height: 220 }}>
      {MONTHLY_DATA.map((d, i) => {
        const heightPct = (d.value / maxVal) * 100;
        return (
          <div key={d.month} className="group flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${heightPct}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 + 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-t-lg relative overflow-hidden"
              style={{
                backgroundColor: i === MONTHLY_DATA.length - 1 ? "var(--brand-green)" : "var(--brand-green-pale)",
                minWidth: 8,
              }}
            >
              <div
                className="absolute inset-0 rounded-t-lg"
                style={{
                  background: i === MONTHLY_DATA.length - 1
                    ? "linear-gradient(180deg, rgba(var(--brand-green-rgb,15,76,58),0.9) 0%, rgba(var(--brand-green-rgb,15,76,58),0.5) 100%)"
                    : "none",
                }}
              />
            </motion.div>
            <span className="text-[10px] sm:text-xs text-[var(--muted-foreground)] text-center leading-tight">
              {d.month.slice(0, 3)}
            </span>
          </div>
        );
      })}
    </div>
  );
});

/* ─── Main Page ─── */
export default memo(function ImpactCenterPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] py-20 sm:py-28" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ═══════════ HERO ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-bl from-[var(--brand-green)] via-[var(--brand-green-dark)] to-[var(--brand-green)] p-8 sm:p-14 text-center"
        >
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"
          >
            <Eye className="h-10 w-10 text-white" />
          </motion.div>

          <h1 className="relative text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            مركز الأثر
          </h1>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg sm:text-xl text-white/80 font-medium">
            حيث يتحول العدد إلى قصة
          </p>
          <div className="relative mt-6 flex items-center justify-center gap-3">
            <div className="h-1 w-12 rounded-full bg-white/40" />
            <Target className="h-5 w-5 text-white/60" />
            <div className="h-1 w-12 rounded-full bg-white/40" />
          </div>
        </motion.section>

        {/* ═══════════ REAL-TIME DASHBOARD ═══════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)]/10">
              <BarChart3 className="h-5 w-5 text-[var(--brand-green)]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[var(--foreground)]">لوحة معلومات حية</h2>
              <p className="text-sm text-[var(--muted-foreground)]">بيانات محدثة لحظيًا عن أداء المؤسسة</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {KPI_DATA.map((kpi, i) => (
              <KPICard key={kpi.id} kpi={kpi} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════════ IMPACT BY CATEGORY ═══════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)]/10">
              <BarChart3 className="h-5 w-5 text-[var(--brand-green)]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[var(--foreground)]">الأثر حسب المجال</h2>
              <p className="text-sm text-[var(--muted-foreground)]">توزيع الإنجازات عبر البرامج الرئيسية</p>
            </div>
          </motion.div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            <div className="space-y-5">
              {CATEGORY_DATA.map((cat, i) => (
                <CategoryBar key={cat.label} cat={cat} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ IMPACT BY GOVERNORATE ═══════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)]/10">
              <MapPin className="h-5 w-5 text-[var(--brand-green)]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[var(--foreground)]">الأثر حسب المحافظة</h2>
              <p className="text-sm text-[var(--muted-foreground)]">انتشار المشاريع في {GOVERNORATES.length} محافظات يمنية</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GOVERNORATES.map((gov, i) => (
              <GovernorateCard key={gov.name} gov={gov} index={i} />
            ))}
          </div>
        </section>

        {/* ═══════════ MONTHLY TREND ═══════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)]/10">
              <TrendingUp className="h-5 w-5 text-[var(--brand-green)]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[var(--foreground)]">الاتجاه الشهري</h2>
              <p className="text-sm text-[var(--muted-foreground)]">نمو الأثر على مدار العام الأخير</p>
            </div>
          </motion.div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-500">نمو +٦١% سنويًا</span>
              </div>
              <span className="text-xs text-[var(--muted-foreground)]">ديسمبر ٢٠٢٥</span>
            </div>
            <MonthlyChart />
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-4">
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--foreground)]">١٥,٠٠٠+</p>
                <p className="text-xs text-[var(--muted-foreground)]">مستفيد إجمالي</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--brand-green)]">٢٤</p>
                <p className="text-xs text-[var(--muted-foreground)]">مشروع منجز</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--foreground)]">١٥.٢م</p>
                <p className="text-xs text-[var(--muted-foreground)]">ر.ي إجمالي</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ IMPACT STORIES ═══════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)]/10">
              <Heart className="h-5 w-5 text-[var(--brand-green)]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[var(--foreground)]">قصص أثر حديثة</h2>
              <p className="text-sm text-[var(--muted-foreground)]">قصص حقيقية من حياة المستفيدين</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {IMPACT_STORIES.map((story, i) => {
              const Icon = story.icon;
              return (
                <motion.article
                  key={story.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 h-1 w-full rounded-t-2xl" style={{ backgroundColor: story.color }} />

                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${story.color}18` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: story.color }} />
                      </div>
                      <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <Calendar className="h-3.5 w-3.5" />
                        {story.date}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[var(--foreground)] leading-snug">
                      {story.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-3">
                      {story.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
                      <span className="text-xs font-bold" style={{ color: story.color }}>
                        {story.metric}
                      </span>
                      <button className="flex items-center gap-1 text-xs font-medium text-[var(--brand-green)] transition-colors hover:text-[var(--brand-green-light)]">
                        <span>التفاصيل</span>
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* ═══════════ DOWNLOAD REPORTS ═══════════ */}
        <section className="mt-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)]/10">
              <Download className="h-5 w-5 text-[var(--brand-green)]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[var(--foreground)]">تحميل التقارير</h2>
              <p className="text-sm text-[var(--muted-foreground)]">تقارير مفصلة عن الأثر والأداء المالي</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {REPORTS.map((report, i) => {
              const Icon = report.icon;
              return (
                <motion.div
                  key={report.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${report.color}15` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: report.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[var(--foreground)] truncate">{report.title}</h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs text-[var(--muted-foreground)]">{report.type}</span>
                      <span className="text-[var(--border-strong)]">•</span>
                      <span className="text-xs text-[var(--muted-foreground)]">{report.size}</span>
                    </div>
                  </div>
                  <Download className="h-5 w-5 shrink-0 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--brand-green)]" />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ═══════════ BOTTOM CTA ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 rounded-3xl border border-[var(--border)] bg-gradient-to-bl from-[var(--brand-green)] to-[var(--brand-green-dark)] p-8 sm:p-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white">سجّل أثرك اليوم</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            كل تبرع يصبح قصة. كل قصة تُلهم أثرًا. كن جزءًا من هذا التحول.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-[var(--brand-green)] transition-all hover:bg-white/90 hover:shadow-lg">
              تبرع الآن
            </button>
            <button className="rounded-xl border-2 border-white/30 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-white/10">
              شاهد القصص
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
});
