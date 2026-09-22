import {
  Users,
  Heart,
  Flag,
  Building2,
  UserCheck,
  CheckCircle,
  Database,
  FileText,
  BarChart3,
  FileBarChart,
  Star,
  ChevronLeft,
  ArrowLeft,
  Zap,
  Target,
  Sparkles,
  Eye,
  HandHeart,
  Wallet,
  Bell,
  Repeat,
  Award,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, memo, useCallback } from "react";

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

/* ─── Flow Chain Data ─── */
const FLOW_NODES = [
  { id: "donor", label: "المتبرع", icon: Users, color: "#065f46", desc: "منبع العطاء" },
  { id: "donations", label: "التبرعات", icon: Wallet, color: "#047857", desc: "تير العطاء" },
  { id: "campaigns", label: "الحملات", icon: Flag, color: "#0f766e", desc: "رافعة الأثر" },
  { id: "projects", label: "المشاريع", icon: Building2, color: "#0e7490", desc: "آلة التحول" },
  { id: "beneficiaries", label: "المستفيدون", icon: UserCheck, color: "#0369a1", desc: "وت果 الأثر" },
  { id: "execution", label: "التنفيذ", icon: CheckCircle, color: "#1d4ed8", desc: "قلب العمل" },
  { id: "data", label: "البيانات", icon: Database, color: "#4338ca", desc: "الether الرقمي" },
  { id: "evidence", label: "الأدلة", icon: FileText, color: "#6d28d9", desc: "بصمة الحقيقة" },
  { id: "results", label: "النتائج", icon: BarChart3, color: "#7e22ce", desc: "面对 النجاح" },
  { id: "reports", label: "التقارير", icon: FileBarChart, color: "#7e22ce", desc: "صوت الشفافية" },
  { id: "impact", label: "الأثر", icon: Star, color: "#b45309", desc: "نجم المُستدام" },
];

/* ─── Donor Journey Data ─── */
const DONOR_JOURNEY = [
  {
    stage: 1,
    title: "الاكتشاف",
    description: "يتفهم المتبرع القضية والاحتياج",
    whatHappens: "يتصفح المشاريع، يقرأ القصص، يفهم السياق",
    output: "فهم عميق للمشكلة",
    icon: Eye,
    color: "#065f46",
    gradient: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    stage: 2,
    title: "الاختيار",
    description: "يختار نوع الأثر",
    whatHappens: "يحدد المجال والأولوية والمبلغ",
    output: "مشروع محدد",
    icon: Target,
    color: "#047857",
    gradient: "from-emerald-400/20 to-emerald-500/5",
  },
  {
    stage: 3,
    title: "العطاء",
    description: "يتبرع بسرعة وأمان",
    whatHappens: "الدفع الآمن، الإيصال الفوري",
    output: "إثبات تبرع",
    icon: HandHeart,
    color: "#0f766e",
    gradient: "from-teal-500/20 to-teal-600/5",
  },
  {
    stage: 4,
    title: "التأكيد",
    description: "يحصل على إثبات واضح",
    whatHappens: "إيصال + رقم مرجعي + ملخص",
    output: "ثقة وإثبات",
    icon: CheckCircle,
    color: "#0e7490",
    gradient: "from-cyan-500/20 to-cyan-600/5",
  },
  {
    stage: 5,
    title: "المتابعة",
    description: "تصله تحديثات مرتبطة بمشروعه",
    whatHappens: "إشعارات، تحديثات شهرية",
    output: "اتصال مستمر",
    icon: Bell,
    color: "#0369a1",
    gradient: "from-sky-500/20 to-sky-600/5",
  },
  {
    stage: 6,
    title: "الأثر",
    description: "يرى النتائج والأدلة",
    whatHappens: "صور، فيديو، تقارير، إحصائيات",
    output: "أثر ملموس",
    icon: Sparkles,
    color: "#1d4ed8",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    stage: 7,
    title: "الاستمرارية",
    description: "فرص جديدة ذات صلة",
    whatHappens: "توصيات مخصصة، مشاريع مشابهة",
    output: "علاقة طويلة الأمد",
    icon: Repeat,
    color: "#4338ca",
    gradient: "from-indigo-500/20 to-indigo-600/5",
  },
  {
    stage: 8,
    title: "الشراكة",
    description: "مستويات أعمق من المشاركة",
    whatHappens: "برنامج كبار المانحين، مجلس استشاري",
    output: "شريك في الرؤية",
    icon: Award,
    color: "#6d28d9",
    gradient: "from-violet-500/20 to-violet-600/5",
  },
];

/* ─── Live Data Counters ─── */
const LIVE_COUNTERS = [
  { label: "المتبرعون النشطون", value: 2340, icon: Users, color: "#065f46" },
  { label: "التبرعات اليوم", value: 47, icon: Wallet, color: "#047857" },
  { label: "المشاريع الجارية", value: 12, icon: Building2, color: "#0e7490" },
  { label: "المستفيدون هذا الشهر", value: 850, icon: UserCheck, color: "#1d4ed8" },
  { label: "التقارير المُصدَرة", value: 36, icon: FileBarChart, color: "#6d28d9" },
  { label: "نقاط الأثر", value: 94, icon: Star, color: "#b45309" },
];

/* ─── Impact Report Preview ─── */
const REPORT_PREVIEW = {
  donorName: "أحمد بن محمد الزهراني",
  donationAmount: "٥٠٠,٠٠٠ ريال يمني",
  donationDate: "١٥ يناير ٢٠٢٦",
  project: "حفر بئر مياه قرية بني مطر",
  governorate: "صنعاء",
  beneficiaries: "٥٠٠ أسرة",
  beneficiaryStory: " consulted said, after years of suffering from water scarcity, the village of Bani Matar now has clean water. Children are no longer getting waterborne diseases, and women save 3 hours daily previously spent walking to fetch water.",
  evidence: [
    "صورة قبل وبعد البئر",
    "فيديو افتتاح البئر",
    "تقرير مختبر المياه",
    "قائمة المستفيدين",
  ],
  results: [
    { label: "تحسن صحة الأطفال", value: "٨٥٪" },
    { label: "توفير وقت يومي", value: "٣ ساعات" },
    { label: "panse gia families served", value: "٥٠٠" },
    { label: "مدة التنفيذ", value: "٤٥ يوم" },
  ],
};

/* ─── Utility Components ─── */
const SectionTitle = memo(function SectionTitle({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="mb-12 text-center sm:mb-16"
    >
      <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm font-bold text-[var(--brand-green)]">
        <Zap className="h-3.5 w-3.5" />
        {badge}
      </div>
      <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted-foreground)] sm:text-lg">
        {subtitle}
      </p>
    </motion.div>
  );
});

/* ─── Flow Chain Node ─── */
const FlowNode = memo(function FlowNode({
  node,
  index,
  isActive,
  onClick,
}: {
  node: (typeof FLOW_NODES)[number];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = node.icon;
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex flex-col items-center gap-3 outline-none"
    >
      {/* Pulse ring */}
      {isActive && (
        <motion.div
          className="absolute -inset-2 rounded-full"
          style={{ backgroundColor: `${node.color}15` }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Node circle */}
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-16 sm:w-16"
        style={{
          borderColor: isActive ? node.color : "var(--border)",
          backgroundColor: isActive ? `${node.color}15` : "var(--card)",
          boxShadow: isActive ? `0 0 20px ${node.color}30` : "var(--shadow-sm)",
        }}
      >
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: isActive ? node.color : "var(--muted-foreground)" }} />
      </div>

      {/* Label */}
      <span
        className="text-xs font-bold transition-colors duration-300 sm:text-sm"
        style={{ color: isActive ? node.color : "var(--muted-foreground)" }}
      >
        {node.label}
      </span>
    </motion.button>
  );
});

/* ─── Flow Connector Line ─── */
const FlowConnector = memo(function FlowConnector({ index }: { index: number }) {
  return (
    <div className="flex flex-1 items-center justify-center" style={{ minWidth: 20 }}>
      <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <motion.div
          className="absolute inset-y-0 right-0 w-full rounded-full"
          style={{ backgroundColor: "var(--brand-green)", opacity: 0.4 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 + 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Animated dot */}
        <motion.div
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: "var(--brand-green)" }}
          animate={{ right: ["0%", "100%"] }}
          transition={{
            duration: 3,
            delay: index * 0.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
});

/* ─── Donor Journey Card ─── */
const JourneyCard = memo(function JourneyCard({
  item,
  index,
}: {
  item: (typeof DONOR_JOURNEY)[number];
  index: number;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
    >
      {/* Gradient accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative">
        {/* Stage badge */}
        <div className="mb-4 flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${item.color}18` }}
          >
            <Icon className="h-5 w-5" style={{ color: item.color }} />
          </div>
          <span
            className="flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-black text-white"
            style={{ backgroundColor: item.color }}
          >
            {item.stage}
          </span>
        </div>

        {/* Title & description */}
        <h3 className="mb-1 text-lg font-black text-[var(--foreground)]">{item.title}</h3>
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">{item.description}</p>

        {/* What happens */}
        <div className="mb-3 rounded-xl bg-[var(--muted)]/60 p-3">
          <p className="mb-1 text-xs font-bold text-[var(--foreground)]">ماذا يحدث</p>
          <p className="text-sm font-medium text-[var(--foreground)]">{item.whatHappens}</p>
        </div>

        {/* Output */}
        <div
          className="flex items-center gap-2 rounded-xl p-3"
          style={{ backgroundColor: `${item.color}10` }}
        >
          <Sparkles className="h-4 w-4 shrink-0" style={{ color: item.color }} />
          <div>
            <p className="text-xs font-bold text-[var(--foreground)]">المخرج</p>
            <p className="text-sm font-bold text-[var(--foreground)]">{item.output}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/* ─── Live Counter Card ─── */
const LiveCounter = memo(function LiveCounter({
  item,
  index,
}: {
  item: (typeof LIVE_COUNTERS)[number];
  index: number;
}) {
  const { count, ref } = useAnimatedCounter(item.value, 2200);
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">{item.label}</p>
          <p
            className="mt-2 text-3xl font-black tracking-tight text-[var(--foreground)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {count.toLocaleString("ar-SA")}
          </p>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${item.color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: item.color }} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: item.color }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
        </span>
        <span className="text-xs font-bold" style={{ color: item.color }}>
          مباشر
        </span>
      </div>
    </motion.div>
  );
});

/* ─── Animated Flow Dots ─── */
const FlowDots = memo(function FlowDots() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: "var(--brand-gold)",
            top: `${15 + i * 14}%`,
          }}
          animate={{
            left: ["-5%", "105%"],
          }}
          transition={{
            duration: 4 + i * 0.5,
            delay: i * 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default memo(function ImpactEnginePage() {
  const [activeNode, setActiveNode] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedJourneyStage, setSelectedJourneyStage] = useState<number | null>(null);

  const handleNodeClick = useCallback((index: number) => {
    setActiveNode(index);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] py-20 sm:py-28" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ═══════════ SECTION 1: HERO ═══════════ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-bl from-[var(--brand-green)] via-[var(--brand-green-dark)] to-[var(--brand-green)] p-8 sm:p-14 text-center"
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <FlowDots />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm"
          >
            <Zap className="h-10 w-10 text-white" />
          </motion.div>

          <h1 className="relative text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            محرك أثر رحماء
          </h1>
          <p className="relative mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            حيث يتحول العطاء إلى أثر مُوثَّق
          </p>
          <p className="relative mx-auto mt-2 max-w-xl text-sm text-white/60 sm:text-base">
            منظومة رقمية تربط المتبرع بمشروعه من لحظة العطاء حتى النتيجة
          </p>

          {/* Hero flow preview */}
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {FLOW_NODES.slice(0, 5).map((node, i) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-9 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                    <Icon className="h-3.5 w-3.5" />
                    {node.label}
                  </div>
                  {i < 4 && (
                    <motion.div
                      className="hidden sm:block h-0.5 w-6 rounded-full bg-white/30"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                    />
                  )}
                </motion.div>
              );
            })}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm font-bold text-white/50"
            >
              ...
            </motion.span>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="flex h-9 items-center gap-1.5 rounded-full bg-[var(--brand-gold)]/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm"
            >
              <Star className="h-3.5 w-3.5" />
              الأثر
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════ SECTION 2: FLOW CHAIN ═══════════ */}
        <section className="mt-20 sm:mt-28">
          <SectionTitle
            badge="سلسلة التدفق"
            title="١١ نقطة اتصال الحدث"
            subtitle="من المتبرع إلى الأثر — كل نقطة تعزز رسالة رحماء"
          />

          {/* Desktop chain */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-center gap-0">
              {FLOW_NODES.map((node, i) => (
                <div key={node.id} className="flex items-center">
                  <FlowNode
                    node={node}
                    index={i}
                    isActive={activeNode === i}
                    onClick={() => handleNodeClick(i)}
                  />
                  {i < FLOW_NODES.length - 1 && <FlowConnector index={i} />}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/tablet scrollable chain */}
          <div className="lg:hidden">
            <div className="overflow-x-auto pb-4" dir="rtl">
              <div className="flex min-w-max items-center gap-4 px-4">
                {FLOW_NODES.map((node, i) => (
                  <FlowNode
                    key={node.id}
                    node={node}
                    index={i}
                    isActive={activeNode === i}
                    onClick={() => handleNodeClick(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
            >
              {(() => {
                const node = FLOW_NODES[activeNode];
                const Icon = node.icon;
                return (
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${node.color}15` }}
                    >
                      <Icon className="h-7 w-7" style={{ color: node.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-[var(--foreground)]">{node.label}</h3>
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                          style={{ backgroundColor: node.color }}
                        >
                          {activeNode + 1} / {FLOW_NODES.length}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{node.desc}</p>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setActiveNode(Math.max(0, activeNode - 1))}
                          disabled={activeNode === 0}
                          className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-sm font-bold text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/80 disabled:opacity-40"
                        >
                          <ChevronLeft className="h-4 w-4 rotate-180" />
                          السابق
                        </button>
                        <button
                          onClick={() => setActiveNode(Math.min(FLOW_NODES.length - 1, activeNode + 1))}
                          disabled={activeNode === FLOW_NODES.length - 1}
                          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-bold text-white transition-colors disabled:opacity-40"
                          style={{ backgroundColor: node.color }}
                        >
                          التالي
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ═══════════ SECTION 3: DONOR JOURNEY ═══════════ */}
        <section className="mt-20 sm:mt-28">
          <SectionTitle
            badge="رحلة المتبرع"
            title="٨ مراحل من الاكتشاف إلى الشراكة"
            subtitle="كل مرحلة تعمق العلاقة وتمهد الطريق لأثر أعمق"
          />

          {/* Timeline connector (desktop) */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute right-0 top-0 bottom-0 hidden w-px bg-gradient-to-b from-[var(--brand-green)] via-[var(--brand-gold)] to-[var(--brand-green)] lg:right-8 lg:block" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {DONOR_JOURNEY.map((item, i) => (
                <JourneyCard key={item.stage} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 4: LIVE DATA FLOW ═══════════ */}
        <section className="mt-20 sm:mt-28">
          <SectionTitle
            badge="تدفق مباشر"
            title="بيانات الأثر الحية"
            subtitle="أرقام تتحدث لحظة بلحظة تعكس أثر رحماء على الأرض"
          />

          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-10">
            {/* Animated background lines */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-px w-full"
                  style={{
                    top: `${20 + i * 15}%`,
                    background: "linear-gradient(90deg, transparent, var(--brand-green), transparent)",
                  }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 6,
                    delay: i * 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LIVE_COUNTERS.map((item, i) => (
                <LiveCounter key={item.label} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 5: IMPACT REPORT PREVIEW ═══════════ */}
        <section className="mt-20 sm:mt-28">
          <SectionTitle
            badge="معاينة التقرير"
            title="رحلة الأثر الكاملة"
            subtitle="كيف يتحول تبرعك إلى قصة أثر حقيقية موثقة"
          />

          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]"
            >
              {/* Report header */}
              <div className="border-b border-[var(--border)] bg-gradient-to-l from-[var(--brand-green)] to-[var(--brand-green-dark)] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                    <FileBarChart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">تقرير الأثر التفصيلي</h3>
                    <p className="text-sm text-white/70">رقم التقرير: RPT-2026-001</p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* Flow visualization within the report */}
                <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-xs font-bold sm:gap-3">
                  {[
                    { label: REPORT_PREVIEW.donorName, icon: Users },
                    { label: REPORT_PREVIEW.donationAmount, icon: Wallet },
                    { label: REPORT_PREVIEW.project, icon: Building2 },
                    { label: REPORT_PREVIEW.beneficiaryStory.slice(0, 30) + "...", icon: UserCheck },
                    { label: "أدلة الأثر", icon: FileText },
                    { label: "النتائج", icon: BarChart3 },
                    { label: "التقرير", icon: FileBarChart },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3 py-1.5 text-[var(--foreground)]">
                        <step.icon className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--brand-green)" }} />
                        <span className="max-w-[100px] truncate sm:max-w-[150px]">{step.label}</span>
                      </div>
                      {i < 6 && (
                        <ArrowLeft className="h-3 w-3 shrink-0 text-[var(--muted-foreground)]" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Donor info */}
                <div className="mb-6 rounded-2xl bg-[var(--muted)]/50 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-[var(--brand-green)]" />
                    <span className="text-sm font-bold text-[var(--muted-foreground)]">المتبرع</span>
                  </div>
                  <p className="text-lg font-black text-[var(--foreground)]">{REPORT_PREVIEW.donorName}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
                    <span>المبلغ: <strong className="text-[var(--foreground)]">{REPORT_PREVIEW.donationAmount}</strong></span>
                    <span>التاريخ: <strong className="text-[var(--foreground)]">{REPORT_PREVIEW.donationDate}</strong></span>
                  </div>
                </div>

                {/* Project info */}
                <div className="mb-6 rounded-2xl bg-[var(--muted)]/50 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[var(--brand-green)]" />
                    <span className="text-sm font-bold text-[var(--muted-foreground)]">المشروع</span>
                  </div>
                  <p className="text-lg font-black text-[var(--foreground)]">{REPORT_PREVIEW.project}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
                    <span>المحافظة: <strong className="text-[var(--foreground)]">{REPORT_PREVIEW.governorate}</strong></span>
                    <span>المستفيدون: <strong className="text-[var(--foreground)]">{REPORT_PREVIEW.beneficiaries}</strong></span>
                  </div>
                </div>

                {/* Beneficiary story */}
                <div className="mb-6 rounded-2xl bg-[var(--muted)]/50 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-[var(--brand-gold)]" />
                    <span className="text-sm font-bold text-[var(--muted-foreground)]">قصة المستفيد</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--foreground)]">
                    {REPORT_PREVIEW.beneficiaryStory}
                  </p>
                </div>

                {/* Evidence */}
                <div className="mb-6 rounded-2xl bg-[var(--muted)]/50 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[var(--brand-green)]" />
                    <span className="text-sm font-bold text-[var(--muted-foreground)]">الأدلة والمستندات</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {REPORT_PREVIEW.evidence.map((ev, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3"
                      >
                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="text-xs font-bold text-[var(--foreground)]">{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="rounded-2xl bg-[var(--brand-green)]/5 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[var(--brand-green)]" />
                    <span className="text-sm font-bold text-[var(--muted-foreground)]">النتائج</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {REPORT_PREVIEW.results.map((res, i) => (
                      <div key={i} className="text-center">
                        <p className="text-2xl font-black text-[var(--brand-green)]">{res.value}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{res.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ SECTION 6: SUMMARY STATS ═══════════ */}
        <section className="mt-20 sm:mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-bl from-[var(--brand-green)] via-[var(--brand-green-dark)] to-[var(--brand-green)] p-8 sm:p-12 text-center"
          >
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 70%, white 1px, transparent 1px), radial-gradient(circle at 70% 20%, white 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
            <Sparkles className="relative mx-auto mb-4 h-10 w-10 text-[var(--brand-gold)]" />
            <h2 className="relative text-2xl font-black text-white sm:text-3xl">
              كل تبرع يمر بـ ١١ مرحلة ليصل إلى أثر حقيقي
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm text-white/70 sm:text-base">
              محرك الأثر لا يتوقف — كل نقطة بيانات تُغذّي المنظومة بأكملها لضمان وصول كل ريال إلى من يستحقه
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm"
              >
                <Zap className="h-4 w-4" />
                محرك الأثر النشط
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full bg-[var(--brand-gold)]/80 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm"
              >
                <Star className="h-4 w-4" />
                ٩٤٪ نسبة الأثر
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Bottom spacing */}
        <div className="h-12" />
      </div>
    </div>
  );
});
