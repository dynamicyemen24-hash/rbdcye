// مستشار العطاء الذكي — Smart Giving Advisor
// الرحلة المركزية للتبرع الذكي — 5 خطوات
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Heart,
  Droplets,
  BookOpen,
  Baby,
  Users,
  Briefcase,
  Building2,
  Sprout,
  ShieldAlert,
  BarChart3,
  Wallet,
  Target,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  CreditCard,
  Banknote,
  Smartphone,
  Clock,
  TrendingUp,
  MapPin,
  Eye,
  Zap,
  ArrowLeft,
  HandHeart,
  CircleDollarSign,
  Timer,
  Target as TargetIcon,
  Star,
  Trophy,
  BadgeCheck,
  HandCoins,
  Repeat,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// البيانات — شرائح الأثر والتوصيات
// ═══════════════════════════════════════════════════════════════

interface ImpactCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  activeProjects: number;
}

interface PriorityOption {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface BudgetPreset {
  amount: number;
  label: string;
  impact: string;
}

interface SmartProject {
  id: string;
  name: string;
  description: string;
  why: string;
  forWhom: string;
  where: string;
  whatHappened: string;
  requiredAmount: number;
  raisedAmount: number;
  duration: string;
  successIndicators: string[];
  category: string;
  priority: string;
}

const IMPACT_CATEGORIES: ImpactCategory[] = [
  { id: "relief", icon: "🫂", title: "إغاثة عاجلة", description: "إمدادات طارئة للمتضررين", activeProjects: 3 },
  { id: "health", icon: "🏥", title: "صحة", description: "دعم طبي وعلاج", activeProjects: 2 },
  { id: "water", icon: "💧", title: "مياه", description: "حفر آبار وتجهيز مصادر مياه", activeProjects: 4 },
  { id: "education", icon: "📚", title: "تعليم", description: "بناء مدارس وتأهيل", activeProjects: 3 },
  { id: "orphans", icon: "👶", title: "طفل", description: "كفالة أيتام ورعاية", activeProjects: 5 },
  { id: "families", icon: "👨‍👩‍👧", title: "أسرة", description: "دعم أسر محتاجة", activeProjects: 4 },
  { id: "empowerment", icon: "💼", title: "تمكين اقتصادي", description: "مشاريع إنتاجية", activeProjects: 2 },
  { id: "sadaqah", icon: "🕌", title: "صدقة جارية", description: "مشاريع مستدامة", activeProjects: 6 },
  { id: "sustainable", icon: "🌱", title: "مشروع مستدام", description: "استثمار تنموي", activeProjects: 3 },
];

const PRIORITY_OPTIONS: PriorityOption[] = [
  { id: "urgent", icon: "🚨", title: "الأعلى إلحاحاً", description: "حالات طارئة" },
  { id: "impact", icon: "📊", title: "الأعلى أثراً", description: "أكبر عدد مستفيدين" },
  { id: "efficient", icon: "💰", title: "الأقل تكلفة", description: "أقصى أثر بأقل مبلغ" },
  { id: "specific", icon: "🎯", title: "محدد", description: "أريد دعم مشروع محدد" },
];

const BUDGET_PRESETS: BudgetPreset[] = [
  { amount: 500, label: "٥٠٠", impact: "يدعم أسرة واحدة لمدة أسبوع" },
  { amount: 1000, label: "١,٠٠٠", impact: "يوفر سلالاً غذائية لـ ١٠ أسر" },
  { amount: 2500, label: "٢,٥٠٠", impact: "يمول علاجاً طبياً لـ ٥ مرضى" },
  { amount: 5000, label: "٥,٠٠٠", impact: "يُثبّت خزان مياه لمدرسة" },
  { amount: 10000, label: "١٠,٠٠٠", impact: "يكفّل يتيمًا لمدة سنة كاملة" },
  { amount: 25000, label: "٢٥,٠٠٠", impact: "يحفر بئراً تخدم ٢٠٠ أسرة" },
];

const ARABIC_IMPACTS: Record<number, string> = {
  500: "يدعم أسرة واحدة لمدة أسبوع",
  1000: "يوفر سلالاً غذائية لـ ١٠ أسر",
  2500: "يمول علاجاً طبياً لـ ٥ مرضى",
  5000: "يُثبّت خزان مياه لمدرسة",
  10000: "يكفّل يتيمًا لمدة سنة كاملة",
  25000: "يحفر بئراً تخدم ٢٠٠ أسرة",
};

const RECOMMENDED_PROJECTS: SmartProject[] = [
  {
    id: "p1",
    name: "بئر الحياة — مأرب",
    description: "حفر آبار مياه عذبة لقرية الملاحة في مأرب، التي تعاني من شح المياه منذ سنوات.",
    why: "تعاني قرية الملاحة من نقص حاد في المياه الصالحة للشرب، مما يسبب انتشار الأمراض المنقولة بالمياه ويُجبر النساء والأطفال على قطع كيلومترات يومياً.",
    forWhom: "٣٠٠ أسرة (حوالي ١,٥٠٠ شخص) في قرية الملاحة — مأرب",
    where: "مأرب — قرية الملاحة — مديرية العبدية",
    whatHappened: "تم حفر البئر بنجاح وتزويده بمضخة كهربائية. يحصل السكان الآن على مياه نقية على مدار الساعة.",
    requiredAmount: 75000,
    raisedAmount: 52000,
    duration: "٣ أشهر",
    successIndicators: ["وصول المياه لـ ١,٥٠٠ شخص", "انخفاض الأمراض بنسبة ٦٠%", "توفير ٥ ساعات يومياً للنساء"],
    category: "water",
    priority: "impact",
  },
  {
    id: "p2",
    name: "المأيوون — مأيوون",
    description: "إغاثة عاجلة لـ ٥٠٠ أسرة متضررة من السيول في محافظة حضرموت.",
    why: "السيول المفاجئة دمرت منازل وممتلكات ٥٠٠ أسرة، وأصبحت بدون مأوى في عز الصيف.",
    forWhom: "٥٠٠ أسرة متضررة (حوالي ٢,٥٠٠ شخص) في حضرموت",
    where: "حضرموت — مديرية سيئون — معبر الجعفية",
    whatHappened: "تم توزيع ٣٠٠ خيمة و٤٠٠ سلة غذائية و٢٠٠ بطانية على المتضررين.",
    requiredAmount: 120000,
    raisedAmount: 85000,
    duration: "شهر واحد",
    successIndicators: ["توفير مأوى لـ ٥٠٠ أسرة", "توزيع ٤٠٠ سلة غذائية", "رعاية طبية لـ ٢٠٠ مريض"],
    category: "relief",
    priority: "urgent",
  },
  {
    id: "p3",
    name: "قلم الأمل — تعز",
    description: "بناء وتجهيز ٣ مدارس متنقلة للأطفال النازحين في تعز.",
    why: "الأطفال النازحون في تعز محرومون من التعليم بسبب تدمير المدارس. أكثر من ٢,٠٠٠ طفل محرومون من حقهم في التعليم الأساسي.",
    forWhom: "٢,٠٠٠ طفل نازح في تعز",
    where: "تعز — مديرية المخاء — مخيمات النازحين",
    whatHappened: "تم بناء مدرستين متنقلتين وتوظيف ١٢ معلماً. يتعلم حالياً ٨٠٠ طفل في المدارس المبنية.",
    requiredAmount: 95000,
    raisedAmount: 62000,
    duration: "٤ أشهر",
    successIndicators: ["تعليم ٢,٠٠٠ طفل", "توظيف ١٥ معلماً", "متابعة أكاديمية مستمرة"],
    category: "education",
    priority: "impact",
  },
  {
    id: "p4",
    name: "عناية — تعزيز صحة الأم والطفل",
    description: "برنامج طبي شامل لرعاية الأم والطفل في ٣ محافظات يمنية.",
    why: "اليمن من أكثر الدول خطورة على صحة الأم والطفل. معدل وفيات الأمهات ١٦٣ لكل ١٠٠,٠٠٠ ولادة، ونقص التغذية يطال ٥٣٪ من الأطفال.",
    forWhom: "٥٠٠ أم حامل و١,٥٠٠ طفل في ٣ محافظات",
    where: "تعز — إب — صعدة",
    whatHappened: "تم فتح ٣ مراكز صحية وتقديم ١,٢٠٠ استشارة طبية و ٨٠٠ جرعة تطعيم.",
    requiredAmount: 150000,
    raisedAmount: 98000,
    duration: "٦ أشهر",
    successIndicators: ["رعاية ٥٠٠ أم حامل", "تطعيم ١,٠٠٠ طفل", "انخفاض وفيات الأمهات بنسبة ٢٥٪"],
    category: "health",
    priority: "urgent",
  },
  {
    id: "p5",
    name: "طبيب للجميع — عيادات متنقلة",
    description: "تجهيز ٥ عيادات متنقلة للوصول إلى المناطق النائية في حضرموت.",
    why: "المناطق النائية في حضرموت تفتقر لأي خدمات طبية. السكان يقطعون ساعات للوصول لأقرب مستشفى، مما يؤدي إلى وفيات يمكن تجنبها.",
    forWhom: "٨,٠٠٠ شخص في المناطق النائية — حضرموت",
    where: "حضرموت — وادي حضرموت — المناطق النائية",
    whatHappened: "تم تجهيز ٣ عيادات متنقلة وتقديم ٢,٥٠٠ استشارة طبية و ٥٠٠ عملية جراحية بسيطة.",
    requiredAmount: 200000,
    raisedAmount: 135000,
    duration: "١٢ شهر",
    successIndicators: ["وصول طبي لـ ٨,٠٠٠ شخص", "تقديم ٥٠٠ عملية جراحية", "تدريب ١٠ كوادر محلية"],
    category: "health",
    priority: "urgent",
  },
  {
    id: "p6",
    name: " يد بيد — تمكين اقتصادي للنساء",
    description: "تأهيل ٥٠ امرأة من الأسر المتعافاة بمشاريع صغيرة مربحة.",
    why: "النساء في المناطق المنكوبة يعانين من بطالة تصل إلى ٨٠٪. تمكينهن اقتصادياً يؤمن دخلاً مستداماً للأسرة.",
    forWhom: "٥٠ امرأة من أسر متعافاة في صنعاء وعدن",
    where: "صنعاء — تعز — عدن",
    whatHappened: "تم تدريب ٣٥ امرأة وافتتاح ٢٠ مشروعاً صغيراً (خياطة، حلويات، يدوية). دخل متوسط ٥٠٠$ شهرياً لكل امرأة.",
    requiredAmount: 80000,
    raisedAmount: 55000,
    duration: "٩ أشهر",
    successIndicators: ["تأهيل ٥٠ امرأة", "إنشاء ٥٠ مشروعاً", "دخل مستدام ٥٠٠$ شهرياً"],
    category: "empowerment",
    priority: "impact",
  },
  {
    id: "p7",
    name: " كرم الأيتام — كفالة شاملة",
    description: "برنامج كفالة شامل يتضمن التعليم والرعاية الصحية والدعم النفسي لـ ١٠٠ يتيم.",
    why: "اليمن يعاني من أكبر أزمة أيتام في العالم العربي. أكثر من ٢ مليون طفل يتيماً بسبب الحرب. الوصول إلى التعليم والصحة والدعم النفسي أمر بالغ الأهمية.",
    forWhom: "١٠٠ يتيم في صنعاء وعدن وتعز",
    where: "صنعاء — عدن — تعز",
    whatHappened: "تم كفالة ٧٥ يتيماً وتقديم دعم تعليمي وصحي ونفسي مستمر. معدل التحصيل الأكاديمي ٨٥٪.",
    requiredAmount: 300000,
    raisedAmount: 210000,
    duration: "مستمر",
    successIndicators: ["كفالة ١٠٠ يتيم", "تحصيل أكاديمي ٨٥٪", "رعاية صحية ونفسية شاملة"],
    category: "orphans",
    priority: "impact",
  },
  {
    id: "p8",
    name: " صدقة بنيان — وقف تعليمي مستدام",
    description: "إنشاء مكتبة ومركز تعليمي يخدم ١,٠٠٠ طالب بشكل دائم.",
    why: "التعليم هو الاستثمار الأفضل في المستقبل. المكتبة تُرسي الأساس للتعلم مدى الحياة لآلاف الأطفال.",
    forWhom: "١,٠٠٠ طالب وطالبة في تعز",
    where: "تعز — مديرية شرعب — شارع الستين",
    whatHappened: "تم بناء المكتبة وتجهيزها بـ ٥,٠٠٠ كتاب وأجهزة حاسوب ومختبر علوم صغير.",
    requiredAmount: 250000,
    raisedAmount: 180000,
    duration: "٦ أشهر",
    successIndicators: ["خدمة ١,٠٠٠ طالب", "توفير ٥,٠٠٠ كتاب", "مختبر علوم مجهز"],
    category: "sadaqah",
    priority: "impact",
  },
];

// ═══════════════════════════════════════════════════════════════
// المكون الرئيسي — مستشار العطاء الذكي
// ═══════════════════════════════════════════════════════════════

type WizardStep = 1 | 2 | 3 | 4 | 5;

interface WizardState {
  step: WizardStep;
  selectedCategories: string[];
  selectedPriority: string | null;
  donationAmount: number;
  customAmount: string;
  isMonthly: boolean;
  selectedProject: SmartProject | null;
  paymentMethod: string | null;
}

const STEP_LABELS = [
  "ما الأثر الذي ترغب في صناعته؟",
  "ما أولويتك؟",
  "كم ترغب في التبرع؟",
  "توصيات ذكية",
  "تأكيد التبرع",
];

const STEP_ICONS = [Heart, Target, Wallet, Sparkles, CheckCircle2];

export default function SmartAdvisorPage() {
  const [state, setState] = useState<WizardState>({
    step: 1,
    selectedCategories: [],
    selectedPriority: null,
    donationAmount: 0,
    customAmount: "",
    isMonthly: false,
    selectedProject: null,
    paymentMethod: null,
  });

  const [direction, setDirection] = useState<-1 | 1>(1);

  // ─── اتجاه الحركة ───
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  // ─── التنقل ───
  const goNext = useCallback(() => {
    if (state.step < 5) {
      setDirection(1);
      setState((s) => ({ ...s, step: (s.step + 1) as WizardStep }));
    }
  }, [state.step]);

  const goBack = useCallback(() => {
    if (state.step > 1) {
      setDirection(-1);
      setState((s) => ({ ...s, step: (s.step - 1) as WizardStep }));
    }
  }, [state.step]);

  const resetWizard = useCallback(() => {
    setDirection(-1);
    setState({
      step: 1,
      selectedCategories: [],
      selectedPriority: null,
      donationAmount: 0,
      customAmount: "",
      isMonthly: false,
      selectedProject: null,
      paymentMethod: null,
    });
  }, []);

  // ─── التبديل بين الفئات ───
  const toggleCategory = useCallback((id: string) => {
    setState((s) => {
      const selected = s.selectedCategories.includes(id)
        ? s.selectedCategories.filter((c) => c !== id)
        : s.selectedCategories.length < 3
          ? [...s.selectedCategories, id]
          : s.selectedCategories;
      return { ...s, selectedCategories: selected };
    });
  }, []);

  // ─── تصفية المشاريع حسب الاختيارات ───
  const filteredProjects = useMemo(() => {
    let projects = [...RECOMMENDED_PROJECTS];

    if (state.selectedCategories.length > 0) {
      projects = projects.filter((p) => state.selectedCategories.includes(p.category));
    }

    if (state.selectedPriority) {
      const prioritySorted = [...projects].sort((a, b) => {
        const priorityOrder: Record<string, number> = { urgent: 0, impact: 1, efficient: 2 };
        const aOrder = priorityOrder[a.priority] ?? 3;
        const bOrder = priorityOrder[b.priority] ?? 3;
        return aOrder - bOrder;
      });
      projects = prioritySorted;
    }

    if (state.donationAmount > 0) {
      projects = projects.filter(
        (p) => p.requiredAmount - p.raisedAmount >= state.donationAmount * 0.1
      );
    }

    return projects.slice(0, 5);
  }, [state.selectedCategories, state.selectedPriority, state.donationAmount]);

  // ─── حساب الأثر المتوقع ───
  const getExpectedImpact = (amount: number): string => {
    if (amount >= 25000) return "يمكنك بناء بئر مياه كاملة تخدم مئات الأسر";
    if (amount >= 10000) return "يمكنك كفالة يتيم لمدة سنة كاملة";
    if (amount >= 5000) return "يمكنك تجهيز مختبر علوم صغير";
    if (amount >= 2500) return "يمكنك علاج ٥ مرضى محتاجين";
    if (amount >= 1000) return "يمكنك توزيع ١٠ سلال غذائية";
    if (amount >= 500) return "يمكنك دعم أسرة واحدة لمدة أسبوع";
    return "أي مبلغ يصنع أثراً真实اً في حياة المحتاجين";
  };

  // ═══════════════════════════════════════════════════════════════
  // الخطوة ١ — اختيار فئة الأثر
  // ═══════════════════════════════════════════════════════════════
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
          ما الأثر الذي ترغب في صناعته؟
        </h2>
        <p className="text-[var(--muted-foreground)]">
          اختر مجالاً واحداً أو أكثر (حتى ٣ مجالات)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {IMPACT_CATEGORIES.map((cat) => {
          const isSelected = state.selectedCategories.includes(cat.id);
          return (
            <motion.button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative text-right p-5 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? "border-[var(--brand-green)] bg-[var(--brand-green)]/10 shadow-lg shadow-[var(--brand-green)]/10"
                  : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand-green)]/40 hover:shadow-md"
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 left-3 w-6 h-6 rounded-full bg-[var(--brand-green)] flex items-center justify-center"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </motion.div>
              )}
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">{cat.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-3">{cat.description}</p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--brand-green)] bg-[var(--brand-green)]/10 px-2.5 py-1 rounded-full">
                <Building2 className="w-3 h-3" />
                {cat.activeProjects} مشاريع نشطة
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="text-center">
        <span className="text-sm text-[var(--muted-foreground)]">
          تم اختيار {state.selectedCategories.length} من ٣
        </span>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // الخطوة ٢ — الأولوية
  // ═══════════════════════════════════════════════════════════════
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
          ما أولويتك؟
        </h2>
        <p className="text-[var(--muted-foreground)]">
          كم ترغب في التبرع؟
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {PRIORITY_OPTIONS.map((opt) => {
          const isSelected = state.selectedPriority === opt.id;
          return (
            <motion.button
              key={opt.id}
              onClick={() => setState((s) => ({ ...s, selectedPriority: opt.id }))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative text-right p-6 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? "border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 shadow-lg shadow-[var(--brand-gold)]/10"
                  : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand-gold)]/40 hover:shadow-md"
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 left-3 w-6 h-6 rounded-full bg-[var(--brand-gold)] flex items-center justify-center"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </motion.div>
              )}
              <div className="text-4xl mb-3">{opt.icon}</div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">{opt.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{opt.description}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // الخطوة ٣ — المبلغ
  // ═══════════════════════════════════════════════════════════════
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
          كم ترغب في التبرع؟
        </h2>
        <p className="text-[var(--muted-foreground)]">
          اختر مبلغاً أو أدخل مبلغاً مخصصاً
        </p>
      </div>

      {/* التبديل بين دفعة واحدة وشهرية */}
      <div className="flex justify-center">
        <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
          <button
            onClick={() => setState((s) => ({ ...s, isMonthly: false }))}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              !state.isMonthly
                ? "bg-[var(--brand-green)] text-white shadow-md"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <HandCoins className="w-4 h-4 inline-block ml-1.5" />
            دفعة واحدة
          </button>
          <button
            onClick={() => setState((s) => ({ ...s, isMonthly: true }))}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              state.isMonthly
                ? "bg-[var(--brand-green)] text-white shadow-md"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <Repeat className="w-4 h-4 inline-block ml-1.5" />
            تبرع شهري
          </button>
        </div>
      </div>

      {/* المبالغ الجاهزة */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
        {BUDGET_PRESETS.map((preset) => {
          const isActive = state.donationAmount === preset.amount && !state.customAmount;
          return (
            <motion.button
              key={preset.amount}
              onClick={() =>
                setState((s) => ({
                  ...s,
                  donationAmount: preset.amount,
                  customAmount: "",
                }))
              }
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-center ${
                isActive
                  ? "border-[var(--brand-green)] bg-[var(--brand-green)]/10 shadow-lg shadow-[var(--brand-green)]/10"
                  : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand-green)]/40"
              }`}
            >
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[var(--brand-green)] flex items-center justify-center"
                >
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </motion.div>
              )}
              <div className="text-2xl font-bold text-[var(--brand-green)] mb-1">
                {preset.label}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">ريال يمني</div>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 pt-2 border-t border-[var(--brand-green)]/20"
                >
                  <p className="text-xs text-[var(--brand-green)] font-medium leading-relaxed">
                    أثرك المتوقع: {ARABIC_IMPACTS[preset.amount]}
                  </p>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* مبلغ مخصص */}
      <div className="max-w-md mx-auto">
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2 text-center">
          مبلغ مخصص
        </label>
        <div className="relative">
          <input
            type="number"
            value={state.customAmount}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                customAmount: e.target.value,
                donationAmount: parseFloat(e.target.value) || 0,
              }))
            }
            placeholder="أدخل المبلغ"
            className="w-full text-center text-2xl font-bold py-4 px-6 rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none transition-colors"
            dir="rtl"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">
            ر.ي
          </span>
        </div>
        {state.donationAmount > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-sm text-[var(--brand-green)] font-medium"
          >
            ✨ {getExpectedImpact(state.donationAmount)}
          </motion.p>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // الخطوة ٤ — التوصيات الذكية
  // ═══════════════════════════════════════════════════════════════
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
          <Sparkles className="w-7 h-7 inline-block ml-2 text-[var(--brand-gold)]" />
          توصيات ذكية
        </h2>
        <p className="text-[var(--muted-foreground)]">
          بناءً على اختياراتك، وجدنا لك {filteredProjects.length} مشاريع مناسبة
        </p>
      </div>

      {/* ملخص الاختيارات */}
      <div className="flex flex-wrap justify-center gap-2">
        {state.selectedCategories.map((catId) => {
          const cat = IMPACT_CATEGORIES.find((c) => c.id === catId);
          return cat ? (
            <span
              key={catId}
              className="inline-flex items-center gap-1 text-xs font-medium bg-[var(--brand-green)]/10 text-[var(--brand-green)] px-3 py-1.5 rounded-full"
            >
              {cat.icon} {cat.title}
            </span>
          ) : null;
        })}
        {state.selectedPriority && (
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] px-3 py-1.5 rounded-full">
            {PRIORITY_OPTIONS.find((p) => p.id === state.selectedPriority)?.icon}{" "}
            {PRIORITY_OPTIONS.find((p) => p.id === state.selectedPriority)?.title}
          </span>
        )}
        {state.donationAmount > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-[var(--brand-green)]/10 text-[var(--brand-green)] px-3 py-1.5 rounded-full">
            <CircleDollarSign className="w-3 h-3" />
            {state.donationAmount.toLocaleString("ar")} ر.ي
          </span>
        )}
      </div>

      {/* بطاقات المشاريع */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => {
            const remaining = project.requiredAmount - project.raisedAmount;
            const progress = Math.round((project.raisedAmount / project.requiredAmount) * 100);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.1, type: "spring", damping: 25 }}
                className={`relative rounded-3xl border-2 overflow-hidden transition-all duration-300 ${
                  state.selectedProject?.id === project.id
                    ? "border-[var(--brand-green)] shadow-xl shadow-[var(--brand-green)]/10"
                    : "border-[var(--border)] bg-[var(--card)] hover:shadow-lg"
                }`}
              >
                {/* رأس البطاقة */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-[var(--brand-green)] bg-[var(--brand-green)]/10 px-2.5 py-1 rounded-full">
                          {IMPACT_CATEGORIES.find((c) => c.id === project.category)?.icon}{" "}
                          {IMPACT_CATEGORIES.find((c) => c.id === project.category)?.title}
                        </span>
                        <span className="text-xs font-medium text-[var(--brand-gold)] bg-[var(--brand-gold)]/10 px-2.5 py-1 rounded-full">
                          {PRIORITY_OPTIONS.find((p) => p.id === project.priority)?.icon}{" "}
                          {PRIORITY_OPTIONS.find((p) => p.id === project.priority)?.title}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[var(--foreground)]">{project.name}</h3>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">{project.description}</p>
                    </div>
                  </div>

                  {/* الأسئلة الخمسة */}
                  <div className="space-y-3 mb-5">
                    {[
                      { q: "ماذا؟", a: project.name + " — " + project.description, icon: Eye },
                      { q: "لماذا؟", a: project.why, icon: Zap },
                      { q: "لمن؟", a: project.forWhom, icon: Users },
                      { q: "أين؟", a: project.where, icon: MapPin },
                      { q: "ماذا حدث؟", a: project.whatHappened, icon: TrendingUp },
                    ].map((item) => (
                      <div key={item.q} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--brand-green)]/10 flex items-center justify-center mt-0.5">
                          <item.icon className="w-4 h-4 text-[var(--brand-green)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-[var(--brand-green)]">{item.q}</span>
                          <p className="text-sm text-[var(--foreground)] leading-relaxed">{item.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* مؤشرات النجاح */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.successIndicators.map((indicator, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-xs bg-[var(--brand-green)]/5 text-[var(--brand-green)] px-2.5 py-1 rounded-full border border-[var(--brand-green)]/10"
                      >
                        <Trophy className="w-3 h-3" />
                        {indicator}
                      </span>
                    ))}
                  </div>

                  {/* المدة */}
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-4">
                    <Timer className="w-4 h-4" />
                    <span>مدة التنفيذ: {project.duration}</span>
                  </div>

                  {/* شريط التقدم */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">
                        المحصل: {project.raisedAmount.toLocaleString("ar")} ر.ي
                      </span>
                      <span className="font-bold text-[var(--brand-green)]">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-l from-[var(--brand-green)] to-[var(--brand-green-light)]"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                      <span>المطلوب: {project.requiredAmount.toLocaleString("ar")} ر.ي</span>
                      <span className="text-[var(--brand-gold)] font-medium">
                        المتبقي: {remaining.toLocaleString("ar")} ر.ي
                      </span>
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراء */}
                <div className="border-t border-[var(--border)] p-4 flex gap-3">
                  <button
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        selectedProject: s.selectedProject?.id === project.id ? null : project,
                      }))
                    }
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                      state.selectedProject?.id === project.id
                        ? "bg-[var(--brand-green)] text-white"
                        : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--brand-green)]/10"
                    }`}
                  >
                    {state.selectedProject?.id === project.id ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        تم الاختيار
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        عرض التفاصيل
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setState((s) => ({
                        ...s,
                        selectedProject: project,
                        step: 5 as WizardStep,
                      }));
                      setDirection(1);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-dark)] transition-all"
                  >
                    <Heart className="w-4 h-4" />
                    تبرع الآن
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
              لا توجد مشاريع مطابقة حالياً
            </h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              جرّب تعديل اختياراتك للعثور على مشاريع مناسبة
            </p>
            <button
              onClick={resetWizard}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-green)] text-white font-medium hover:bg-[var(--brand-green-dark)] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              بدء من جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // الخطوة ٥ — تأكيد التبرع
  // ═══════════════════════════════════════════════════════════════
  const renderStep5 = () => {
    const project = state.selectedProject;
    if (!project) {
      return (
        <div className="text-center py-12 space-y-4">
          <div className="text-6xl">⚠️</div>
          <h3 className="text-xl font-bold text-[var(--foreground)]">لم تتم اختيار مشروع بعد</h3>
          <p className="text-[var(--muted-foreground)]">
            يرجى العودة واختيار مشروع للتبرع
          </p>
          <button
            onClick={() => {
              setDirection(-1);
              setState((s) => ({ ...s, step: 4 as WizardStep }));
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-green)] text-white font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للتوصيات
          </button>
        </div>
      );
    }

    const finalAmount = state.donationAmount || 1000;
    const paymentMethods = [
      { id: "card", label: "بطاقة ائتمان", icon: CreditCard, desc: "فيزا / ماستركارد" },
      { id: "bank", label: "تحويل بنكي", icon: Building2, desc: "تحويل مباشر للحساب" },
      { id: "mobile", label: "محفظة إلكترونية", icon: Smartphone, desc: "شايニー / دفع محلي" },
      { id: "cash", label: "نقدي", icon: Banknote, desc: "الدفع في المقر" },
    ];

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
            تأكيد التبرع
          </h2>
          <p className="text-[var(--muted-foreground)]">
            راجع تفاصيل تبرعك قبل التأكيد
          </p>
        </div>

        {/* ملخص التبرع */}
        <div className="rounded-3xl border-2 border-[var(--brand-green)]/20 bg-[var(--card)] overflow-hidden">
          <div className="p-6 bg-gradient-to-l from-[var(--brand-green)]/5 to-[var(--brand-gold)]/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand-green)] flex items-center justify-center">
                <HandHeart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">{project.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{project.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <span className="text-xs text-[var(--muted-foreground)] block mb-1">المبلغ</span>
                <span className="text-xl font-bold text-[var(--brand-green)]">
                  {finalAmount.toLocaleString("ar")} ر.ي
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <span className="text-xs text-[var(--muted-foreground)] block mb-1">نوع التبرع</span>
                <span className="text-lg font-bold text-[var(--brand-gold)]">
                  {state.isMonthly ? "شهري" : "مرة واحدة"}
                </span>
              </div>
            </div>
          </div>

          {/* وسائل الدفع */}
          <div className="p-6 border-t border-[var(--border)]">
            <h4 className="text-sm font-bold text-[var(--foreground)] mb-4">اختر وسيلة الدفع</h4>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const isActive = state.paymentMethod === method.id;
                return (
                  <motion.button
                    key={method.id}
                    onClick={() => setState((s) => ({ ...s, paymentMethod: method.id }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-right transition-all ${
                      isActive
                        ? "border-[var(--brand-green)] bg-[var(--brand-green)]/5"
                        : "border-[var(--border)] hover:border-[var(--brand-green)]/30"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isActive ? "bg-[var(--brand-green)] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-[var(--foreground)] block">{method.label}</span>
                      <span className="text-xs text-[var(--muted-foreground)]">{method.desc}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* زر التأكيد */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!state.paymentMethod}
          className="w-full py-4 rounded-2xl bg-gradient-to-l from-[var(--brand-green)] to-[var(--brand-green-dark)] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-[var(--brand-green)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <BadgeCheck className="w-6 h-6" />
          تأكيد التبرع — {finalAmount.toLocaleString("ar")} ر.ي
        </motion.button>

        {/* ملاحظات أمنية */}
        <div className="flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
          <ShieldAlert className="w-4 h-4" />
          <span>جميع المعاملات مشفرة وآمنة ١٠٠٪</span>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // المحتوى الرئيسي حسب الخطوة
  // ═══════════════════════════════════════════════════════════════
  const stepContent = useMemo(() => {
    switch (state.step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // ═══════════════════════════════════════════════════════════════
  // التحقق من صحة الزر التالي
  // ═══════════════════════════════════════════════════════════════
  const canProceed = useMemo(() => {
    switch (state.step) {
      case 1:
        return state.selectedCategories.length > 0;
      case 2:
        return state.selectedPriority !== null;
      case 3:
        return state.donationAmount > 0;
      case 4:
        return state.selectedProject !== null;
      case 5:
        return state.paymentMethod !== null;
      default:
        return false;
    }
  }, [state]);

  // ═══════════════════════════════════════════════════════════════
  // العرض
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* ═══ الشريط العلوي — مؤشر التقدم ═══ */}
      <div className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* العنوان */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-[var(--brand-gold)]" />
            <span className="text-sm font-bold text-[var(--foreground)]">
              مستشار العطاء الذكي
            </span>
          </div>

          {/* خطوات التقدم */}
          <div className="flex items-center justify-between gap-1">
            {[1, 2, 3, 4, 5].map((s) => {
              const StepIcon = STEP_ICONS[s - 1];
              const isActive = state.step === s;
              const isCompleted = state.step > s;
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted
                          ? "var(--brand-green)"
                          : isActive
                            ? "var(--brand-gold)"
                            : "var(--muted)",
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center mb-1"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <StepIcon
                          className={`w-4 h-4 ${isActive ? "text-white" : "text-[var(--muted-foreground)]"}`}
                        />
                      )}
                    </motion.div>
                    <span
                      className={`text-[10px] font-medium text-center leading-tight hidden sm:block ${
                        isActive
                          ? "text-[var(--brand-gold)]"
                          : isCompleted
                            ? "text-[var(--brand-green)]"
                            : "text-[var(--muted-foreground)]"
                      }`}
                    >
                      {STEP_LABELS[s - 1]}
                    </span>
                  </div>
                  {s < 5 && (
                    <div className="flex-shrink-0 w-6 sm:w-10 h-0.5 mx-1 rounded-full overflow-hidden bg-[var(--muted)]">
                      <motion.div
                        animate={{ width: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-[var(--brand-green)]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* رقم الخطوة */}
          <div className="text-center mt-2">
            <span className="text-xs text-[var(--muted-foreground)]">
              الخطوة {state.step} / ٥
            </span>
          </div>
        </div>
      </div>

      {/* ═══ المحتوى الرئيسي ═══ */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={state.step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {stepContent}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═══ شريط التنقل السفلي ═══ */}
      <div className="sticky bottom-0 z-40 bg-[var(--background)]/80 backdrop-blur-xl border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* زر الرجوع */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={goBack}
              disabled={state.step === 1}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-[var(--border)] text-[var(--foreground)] font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--brand-green)]/40 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
              رجوع
            </motion.button>

            {/* أزرار الوسط */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={resetWizard}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                بدء من جديد
              </motion.button>
            </div>

            {/* زر التالي */}
            <motion.button
              whileHover={{ scale: canProceed ? 1.03 : 1 }}
              whileTap={{ scale: canProceed ? 0.97 : 1 }}
              onClick={goNext}
              disabled={!canProceed || state.step === 5}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                canProceed && state.step < 5
                  ? "bg-[var(--brand-green)] text-white shadow-lg shadow-[var(--brand-green)]/20 hover:bg-[var(--brand-green-dark)]"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed"
              }`}
            >
              {state.step === 4 ? "تأكيد الاختيار" : "التالي"}
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ═══ خلفية مزخرفة ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--brand-green)]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[var(--brand-gold)]/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--brand-green)]/3 blur-[120px]" />
      </div>
    </div>
  );
}
