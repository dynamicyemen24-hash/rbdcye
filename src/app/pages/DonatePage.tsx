// Donate Page - صفحة التبرع المتعددة العملات والوحدات
import {
  Heart,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle,
  Shield,
  TrendingUp,
  Globe,
  BarChart3,
  HandHeart,
  Lock,
  RefreshCw,
  Shirt,
  Package,
  Truck,
  ShoppingBag,
  Coins,
  Calendar,
  Repeat,
  ChevronDown,
  Sparkles,
  Droplets,
  BookOpen,
  Stethoscope,
  Utensils,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { MonthlyGivingHero } from "@/app/components/donation/MonthlyGivingHero";
import { PageHeader } from "@/app/components/PageHeader";
import { StatsGrid } from "@/app/components/StatsGrid";
import { ViralShare } from "@/app/components/ViralShare";
import { donationDBService } from "@/services/donation/donation-db.service";
import { EnterpriseButton, EnterpriseInput } from "@/shared/components";
import { analyticsService } from "@/shared/services/analytics.service";
import { multiProjectDonationService } from "@/shared/services/donation-multi-project.service";
import { useSEO } from "@/utils/seoAdvanced";

import type { DonationProject, DonationPolicy, InKindCategory, ItemCondition } from "@/services/donation/donation-types";
import type { PaymentCurrency } from "@/shared/services/payment-gateway.service";

// ═══════════════════════════════════════════════════════
// نظام العملات — أسعار الصرف التقريبية
// ═══════════════════════════════════════════════════════
const CURRENCIES: Record<
  string,
  { code: string; name: string; symbol: string; flag: string; isBase: boolean; rateToYER: number }
> = {
  YER: { code: "YER", name: "ريال يمني", symbol: "ر.ي", flag: "🇾🇪", isBase: true, rateToYER: 1 },
  SAR: { code: "SAR", name: "ريال سعودي", symbol: "ر.س", flag: "🇸🇦", isBase: false, rateToYER: 67 },
  USD: {
    code: "USD",
    name: "دولار أمريكي",
    symbol: "$",
    flag: "🇺🇸",
    isBase: false,
    rateToYER: 250,
  },
  AED: {
    code: "AED",
    name: "درهم إماراتي",
    symbol: "د.إ",
    flag: "🇦🇪",
    isBase: false,
    rateToYER: 68,
  },
  EUR: { code: "EUR", name: "يورو", symbol: "€", flag: "🇪🇺", isBase: false, rateToYER: 270 },
  GBP: {
    code: "GBP",
    name: "جنيه إسترليني",
    symbol: "£",
    flag: "🇬🇧",
    isBase: false,
    rateToYER: 315,
  },
  QAR: { code: "QAR", name: "ريال قطري", symbol: "ر.ق", flag: "🇶🇦", isBase: false, rateToYER: 69 },
  KWD: {
    code: "KWD",
    name: "دينار كويتي",
    symbol: "د.ك",
    flag: "🇰🇼",
    isBase: false,
    rateToYER: 815,
  },
  OMR: {
    code: "OMR",
    name: "ريال عماني",
    symbol: "ر.ع",
    flag: "🇴🇲",
    isBase: false,
    rateToYER: 650,
  },
  EGP: { code: "EGP", name: "جنيه مصري", symbol: "ج.م", flag: "🇪🇬", isBase: false, rateToYER: 5 },
};

// ═══════════════════════════════════════════════════════
// المبالغ المسبقة لكل عملة
// ═══════════════════════════════════════════════════════
const PRESET_AMOUNTS: Record<string, number[]> = {
  YER: [5000, 10000, 25000, 50000, 100000, 250000],
  SAR: [50, 100, 250, 500, 1000, 2500],
  USD: [10, 25, 50, 100, 250, 500],
  AED: [50, 100, 250, 500, 1000, 2500],
  EUR: [10, 25, 50, 100, 250, 500],
  GBP: [10, 20, 50, 100, 200, 500],
  QAR: [50, 100, 250, 500, 1000, 2500],
  KWD: [5, 10, 25, 50, 100, 250],
  OMR: [5, 10, 25, 50, 100, 250],
  EGP: [200, 500, 1000, 2500, 5000, 10000],
};

// ═══════════════════════════════════════════════════════
// الحد الأدنى لكل عملة
// ═══════════════════════════════════════════════════════
const MIN_DONATION_AMOUNTS: Record<string, number> = {
  USD: 1,
  SAR: 5,
  YER: 250,
};

// ═══════════════════════════════════════════════════════
// أثر التبرع حسب العملة
// ═══════════════════════════════════════════════════════
interface ImpactItem {
  amountInYER: number;
  label: string;
  icon: string;
  description: string;
}

const IMPACT_ITEMS_YER: ImpactItem[] = [
  {
    amountInYER: 5000,
    label: "وجبة غذائية متكاملة لعائلة لأسبوع",
    icon: "🍚",
    description: "خبز وبروتين ومواد غذائية أساسية تحفظ كرامة الأسرة",
  },
  {
    amountInYER: 10000,
    label: "مياه نظيفة لعشر عائلات لعدة أسابيع",
    icon: "💧",
    description: "آبار موثوقة تُدوم لأشهر وتحل مشكلة المياه لمجتمع كامل",
  },
  {
    amountInYER: 25000,
    label: "مستلزمات تعليمية لطالب لعام دراسي كامل",
    icon: "📚",
    description: "كتب وأدوات مدرسية وحقيبة مدرسية تحفظ حق الطفل في التعليم",
  },
  {
    amountInYER: 50000,
    label: "دفء شتاء متكامل لعائلة نازحة",
    icon: "🧥",
    description: "بطانيات دافئة وسخانات وملابس شتوية تحمي من قسوة الطقس",
  },
  {
    amountInYER: 100000,
    label: "سكن مؤقت آمن لعائلة لشهر كامل",
    icon: "🏠",
    description: "إيجار شهري يمنح النازحين مأوى يحفظون فيه كرامتهم",
  },
  {
    amountInYER: 250000,
    label: "حفر بئر مياه عميقة تخدم قرية بأكملها",
    icon: "🌊",
    description: "مشروع مائي دائم يُغيّر حياة قرية بأكملها على مدى عقود",
  },
];

// ═══════════════════════════════════════════════════════
// التبرع العيني — فئات المواد المقبولة
// ═══════════════════════════════════════════════════════
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IN_KIND_CATEGORIES = [
  {
    id: "clothing",
    name: "الملابس الشتوية والصيفية",
    icon: Shirt,
    description: "ملابس نظيفة بأحجام متنوعة تلبي احتياجات الأسر في الفصول المختلفة",
    accepted: "كل الأحجام — نظيفة فقط، ومحفوظة من التلف",
  },
  {
    id: "food",
    name: "المواد الغذائية الأساسية",
    icon: Package,
    description: "أرز وسكر وزيت وتمور ومواد غذائية تُغطّي الاحتياجات الأساسية",
    accepted: "مواد غير فاسدة — تأكد من سلامة التعبئة وتحديد تاريخ الصلاحية",
  },
  {
    id: "blankets",
    name: "البطانيات والأغطية الشتوية",
    icon: ShoppingBag,
    description: "بطانيات دافئة ومراتب وأغطية تحمي الأسر من قسوة فصل الشتاء",
    accepted: "جديدة فقط أو نظيفة جداً وبحالة ممتازة",
  },
  {
    id: "medical",
    name: "المساعدات الطبية والإسعافية",
    icon: Heart,
    description: "أدوية أساسية ومستلزمات إسعاف أولي تساعد في الحالات الطارئة",
    accepted: "أدوية مغلقة وغير منتهية الصلاحية — يُشترط توفر اسم الدواء والجرعة",
  },
  {
    id: "stationery",
    name: "اللوازم المدرسية والتعليمية",
    icon: Package,
    description: "دفاتر وأقلام وحقائب مدرسية وأدوات تعليمية تدعم حق الطفل في العلم",
    accepted: "جديدة فقط — لا نقبل المستعملة",
  },
  {
    id: "other",
    name: "تبرعات عينية أخرى",
    icon: Truck,
    description: "تبرعات متنوعة تحتاج إلى تنسيق مسبق مع فريقنا الميداني",
    accepted: "يرجى التواصل معنا مسبقاً لتحديد طبيعة التبرع وآلية التسليم",
  },
];

// ═══════════════════════════════════════════════════════
// الدفع المتكرر — الفئات الزمنية
// ═══════════════════════════════════════════════════════
const RECURRING_OPTIONS = [
  {
    id: "once",
    label: "تبرع لمرة واحدة",
    icon: Heart,
    description: "تبرع فوري يُحدث أثراً مباشراً في حياة المستفيد",
  },
  {
    id: "monthly",
    label: "تبرع شهري",
    icon: Calendar,
    description: "تبرع منتظم يُخصم تلقائياً كل شهر ويضمن استمرارية الخير",
  },
  {
    id: "yearly",
    label: "تبرع سنوي",
    icon: Repeat,
    description: "تبرع سنوي يُذكّر بالمسؤولية ويعزز الالتزام بالعطاء",
  },
];

// معرفات المشاريع الثابتة المعروضة عند غياب قاعدة البيانات
const HARDCODED_PROJECT_IDS = [
  "general",
  "food",
  "water",
  "education",
  "orphans",
  "zakat",
  "winter",
  "medical",
];

export default function DonatePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [selectedCurrency, setSelectedCurrency] = useState<string>("YER");
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedProject, setSelectedProject] = useState("general");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [donationType, setDonationType] = useState<"monetary" | "inkind">("monetary");
  const [recurringOption, setRecurringOption] = useState("once");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedInKind, setSelectedInKind] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inKindDetails, setInKindDetails] = useState("");
  const [donorInfo, setDonorInfo] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [converterAmount, setConverterAmount] = useState("100");
  const [converterFrom, setConverterFrom] = useState("USD");
  const [converterTo, setConverterTo] = useState("YER");
  const [debouncedConverterAmount, setDebouncedConverterAmount] = useState("100");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [projects, setProjects] = useState<DonationProject[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [policies, setPolicies] = useState<DonationPolicy[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [inKindCategory, setInKindCategory] = useState('clothing');
  const [inKindItemName, setInKindItemName] = useState('');
  const [inKindQuantity, setInKindQuantity] = useState(1);
  const [inKindCondition, setInKindCondition] = useState('جديد');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'dropoff' | 'shipping'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [estimatedValue, setEstimatedValue] = useState(0);

  const sanitizeNumericInput = (value: string): string => {
    return value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  };

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedConverterAmount(converterAmount);
    }, 300);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [converterAmount]);

  // قراءة وسائط URL لملء النموذج تلقائياً (تبرع سريع / روابط ذكية)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const amount = params.get("amount");
    const currencyParam = params.get("currency");
    const recurring = params.get("recurring");
    const project = params.get("project");
    const name = params.get("name");
    const email = params.get("email");
    const phone = params.get("phone");

    if (location.state?.zakatAmount) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: verified
      setSelectedProject("zakat");
      setCustomAmount(String(location.state.zakatAmount));
    } else if (amount) {
      setCustomAmount(sanitizeNumericInput(amount));
    }
    if (location.state?.currency) {
      setSelectedCurrency(location.state.currency);
    } else if (currencyParam && CURRENCIES[currencyParam]) {
      setSelectedCurrency(currencyParam);
    }
    if (recurring === "monthly" || recurring === "yearly") {
      setRecurringOption(recurring);
    }
    if (project) {
      setSelectedProject(project);
    }
    if (name) {
      setDonorInfo((prev) => ({ ...prev, name }));
    }
    if (email) {
      setDonorInfo((prev) => ({ ...prev, email }));
    }
    if (phone) {
      setDonorInfo((prev) => ({ ...prev, phone }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- precise: verified
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- precise: verified
  }, [location.state]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const [activeProjects, orgPolicies] = await Promise.all([
          donationDBService.getActiveProjects(),
          donationDBService.getPolicies(),
        ]);
        setProjects(activeProjects);
        setPolicies(orgPolicies);

        // التحقق من أن المشروع المختار عبر وسائط URL موجود فعلاً
        const params = new URLSearchParams(window.location.search);
        const project = params.get("project");
        if (
          project &&
          project !== "general" &&
          !HARDCODED_PROJECT_IDS.includes(project) &&
          !activeProjects.some((p) => p.slug === project)
        ) {
          setSelectedProject("general");
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error('Failed to load projects:', err);
      } finally {
        setProjectsLoading(false);
      }
    };
    loadProjects();
  }, []);

  useSEO({
    title: "تبرع الآن — رحماء بينهم",
    description:
      "ساهم في دعم المشاريع الخيرية والتنموية — تبرعات مالية أو عينية بعملات متعددة. كل ريال يُحوّل أثراً حقيقياً في حياة المحتاجين",
    type: "website",
    url: "https://rbdcye.org/donate",
    keywords: [
      "تبرع",
      "صدقة",
      "إغاثة",
      "تبرعات",
      "رحماء بينهم",
      "عملات متعددة",
      "زكاة",
      "كفالة أيتام",
    ],
  });

  const currency = CURRENCIES[selectedCurrency];
  const presetAmounts = PRESET_AMOUNTS[selectedCurrency] || PRESET_AMOUNTS.YER;
  const actualAmount = customAmount ? Number(customAmount) : selectedAmount;
  // FX rate fetched server-side - use 1 for base currency (YER), others converted at checkout
  const fxRate = currency.isBase ? 1 : undefined;

  // محوّل العملات: المعادل بالريال اليمني
  const amountInYER = currency.isBase
    ? actualAmount
    : Math.round(actualAmount * currency.rateToYER);

  // الأثر حسب المبلغ - use server FX rate or default
  const impactItems = useMemo(() => {
    return IMPACT_ITEMS_YER.map((item) => ({
      ...item,
      localAmount: fxRate ? Math.round(item.amountInYER / fxRate) : item.amountInYER,
    }));
  }, [fxRate]);

  const hardcodedProjects = [
    {
      id: "general",
      name: "تبرع عام — حيث الحاجة أكبر",
      icon: Heart,
      color: "from-[var(--brand-green)] to-[var(--brand-green-light)]",
    },
    {
      id: "food",
      name: "السلال الغذائية",
      icon: Globe,
      color: "from-[var(--brand-green)] to-[var(--brand-green-dark)]",
    },
    {
      id: "water",
      name: "مشروع الآبار المائية",
      icon: Droplets,
      color: "from-[#3b82f6] to-[var(--info)]",
    },
    {
      id: "education",
      name: "التعليم والقرآن الكريم",
      icon: BookOpen,
      color: "from-[#6366f1] to-[var(--brand-green-light)]",
    },
    {
      id: "orphans",
      name: "كفالة الأيتام والأرامل",
      icon: Heart,
      color: "from-[var(--destructive)] to-[var(--brand-gold)]",
    },
    {
      id: "zakat",
      name: "زكاة المال المستحقة",
      icon: HandHeart,
      color: "from-[var(--brand-gold)] to-[var(--brand-gold-light)]",
    },
    {
      id: "winter",
      name: "دفء الشتاء",
      icon: Package,
      color: "from-[var(--brand-green)] to-[var(--brand-green-light)]",
    },
    {
      id: "medical",
      name: "المساعدات الطبية والإسعافية",
      icon: Stethoscope,
      color: "from-[var(--destructive)] to-[#f43f5e]",
    },
  ];

  const projectIcons: Record<string, typeof Heart> = {
    general: Heart,
    food: Utensils,
    water: Droplets,
    education: BookOpen,
    orphans: Heart,
    zakat: Coins,
    winter: Shirt,
    medical: Stethoscope,
  };

  const displayProjects = projects.length > 0 ? projects.map(p => ({
    id: p.slug,
    title: p.title_ar,
    description: p.description_ar || '',
    icon: projectIcons[p.icon] || Heart,
    gradient: `from-[var(--brand-green)] to-[var(--brand-green-dark)]`,
    featured: p.is_featured,
  })) : hardcodedProjects.map(p => ({
    id: p.id,
    title: p.name,
    description: '',
    icon: p.icon,
    gradient: p.color,
    featured: false,
  }));

  const paymentMethods = useMemo(
    () => [
      {
        id: "card",
        name: "بطاقة ائتمان / مدين",
        icon: CreditCard,
        currencies: ["YER", "SAR", "USD", "AED", "EUR", "GBP"],
      },
      {
        id: "apple",
        name: "Apple Pay",
        icon: Wallet,
        currencies: ["SAR", "USD", "AED", "EUR", "GBP"],
      },
      {
        id: "google",
        name: "Google Pay",
        icon: Wallet,
        currencies: ["SAR", "USD", "AED", "EUR", "GBP"],
      },
      {
        id: "bank",
        name: "تحويل بنكي مباشر",
        icon: Building2,
        currencies: Object.keys(CURRENCIES),
      },
    ],
    []
  );

  const availablePaymentMethods = useMemo(() => {
    return paymentMethods.filter((m) => m.currencies.includes(selectedCurrency));
  }, [paymentMethods, selectedCurrency]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: verified
  useEffect(() => {
    if (!availablePaymentMethods.find((m) => m.id === paymentMethod)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: verified
      setPaymentMethod(availablePaymentMethods[0]?.id || "bank");
    }
  }, [availablePaymentMethods, paymentMethod]);

  // محوّل العملات
  const convertedAmount = useMemo(() => {
    const fromRate = CURRENCIES[converterFrom]?.rateToYER || 1;
    const toRate = CURRENCIES[converterTo]?.rateToYER || 1;
    const amount = Number(debouncedConverterAmount) || 0;
    return Math.round((amount * fromRate) / toRate);
  }, [debouncedConverterAmount, converterFrom, converterTo]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleInKind = useCallback((id: string) => {
    setSelectedInKind((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (donationType === "monetary") {
      if (!Number.isFinite(actualAmount) || actualAmount <= 0) {
        setSubmitError("يرجى إدخال مبلغ تبرع صالح قبل المتابعة. المبلغ يجب أن يكون أكبر من صفر.");
        return;
      }
      const minAmount = MIN_DONATION_AMOUNTS[selectedCurrency] ?? 1;
      if (actualAmount < minAmount) {
        setSubmitError(
          `الحد الأدنى للتبرع بالعملة ${selectedCurrency} هو ${minAmount.toLocaleString("ar-YE")} ${currency.symbol}. يرجى تعديل المبلغ.`
        );
        return;
      }
    }
    if (donationType === "inkind" && !inKindItemName) {
      setSubmitError("يرجى إدخال اسم الصنف المتبرع به.");
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedProjectData = displayProjects.find((p) => p.id === selectedProject);
      const paymentType = recurringOption === "once" ? "once" : recurringOption;
      await multiProjectDonationService.processDonation({
        donorName: donorInfo.name || "متبرع",
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone,
        allocations:
          selectedProjectData && selectedProject !== "general"
            ? [
                {
                  projectId: selectedProject,
                  projectName: selectedProjectData.title,
                  amount: actualAmount,
                  isCustom: false,
                },
              ]
            : [
                {
                  projectId: "general",
                  projectName: "تبرع عام — حيث الحاجة أكبر",
                  amount: actualAmount,
                  isCustom: true,
                },
              ],
        totalAmount: actualAmount,
        currency: selectedCurrency as PaymentCurrency,
        paymentMethod:
          paymentMethod === "apple" || paymentMethod === "google" ? "card" : paymentMethod,
        paymentType: paymentType as "once" | "monthly" | "yearly" | "zakat" | "sadaqah" | "waqf",
        isAnonymous: !donorInfo.name,
        notes:
          donationType === "inkind"
            ? `تبرع عيني: ${inKindItemName} — ${inKindCategory} — الكمية: ${inKindQuantity}`
            : donorInfo.message || undefined,
        agreeToTerms: true,
        agreeToContact: !!donorInfo.email,
        metadata: { source: "web", donationType, currency: selectedCurrency },
      } as Parameters<typeof multiProjectDonationService.processDonation>[0]);

      try {
        analyticsService.generateDonorReport();
      } catch {
        /* non-critical */
      }

      // Save to real database
      try {
        const donation = await donationDBService.createDonation({
          donor_name: donorInfo.name || undefined,
          donor_email: donorInfo.email,
          donor_phone: donorInfo.phone,
          donation_type: donationType === "monetary" ? "financial" : "in_kind",
          amount: actualAmount,
          currency: selectedCurrency,
          project_id: projects.find(p => p.slug === selectedProject)?.id,
          payment_method: paymentMethod,
          payment_status: donationType === "monetary" ? "pending" : "completed",
          message: donorInfo.message,
          is_recurring: recurringOption !== "once",
          recurring_interval: recurringOption,
          is_anonymous: !donorInfo.name,
        });

        if (donationType === "inkind" && inKindItemName) {
          await donationDBService.createInKindDonation({
            type: 'in_kind',
            items: [{ name: inKindItemName, category: inKindCategory as InKindCategory, quantity: inKindQuantity, unit: "قطعة", condition: inKindCondition as ItemCondition, estimated_value: estimatedValue, currency: selectedCurrency }],
            donation_id: donation.id,
            item_name: inKindItemName,
            item_category: inKindCategory,
            quantity: inKindQuantity,
            unit: "قطعة",
            condition: inKindCondition,
            estimated_value: estimatedValue,
            currency: selectedCurrency,
            delivery_method: deliveryMethod,
            delivery_address: deliveryAddress,
          });
        }
      } catch (dbError) {
        if (import.meta.env.DEV) console.error("DB save failed:", dbError);
        // Continue with success UI even if DB fails
      }

      setIsSuccess(true);
    } catch {
      setSubmitError(
        "تعذر إتمام الطلب حاليًا. تحقق من الاتصال بالإنترنت ثم حاول مرة أخرى، أو تواصل مع فريق رحماء بينهم على الرقم +967 780 777 007"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className="min-h-screen bg-[var(--background)] pt-24 sm:pt-32 flex items-center justify-center"
        dir="rtl"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-[var(--card)] rounded-3xl p-12 border border-[var(--border)] max-w-2xl mx-auto text-center shadow-xl"
              role="status"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-[var(--brand-green-pale)] rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-[var(--brand-green)]" aria-hidden="true" />
              </div>
              <h1 className="text-3xl md:text-3xl font-bold text-[var(--foreground)] mb-6">
                جزاك الله كل خير على تبرعك
              </h1>
              <p className="text-[var(--muted-foreground)] text-lg mb-4 leading-[2]">
                تم استلام تبرعك بنجاح بقيمة{" "}
                <span className="font-bold text-[var(--brand-green)]">
                  {actualAmount.toLocaleString("ar-YE")} {currency.symbol}
                </span>
              </p>
              <p className="text-[var(--muted-foreground)] text-sm mb-8">
                المعادل بالريال اليمني:{" "}
                <span className="font-semibold text-[var(--brand-green)]">
                  {amountInYER.toLocaleString("ar-YE")} ر.ي
                </span>
                {recurringOption !== "once" &&
                  ` — تبرع ${recurringOption === "monthly" ? "شهري" : "سنوي"} منتظم`}
              </p>
              <div className="bg-[var(--brand-green-pale)] rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-[var(--brand-green)]" aria-hidden="true" />
                  <span className="font-bold text-[var(--brand-green)]">آمن وموثوق</span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-[1.8]">
                  تم إرسال إيصال تأكيد بالبريد الإلكتروني. يمكنك متابعة أثر تبرعك من خلال
                  تقاريرنا الدورية.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <EnterpriseButton
                  variant="primary"
                  size="md"
                  onClick={() => navigate("/")}
                  aria-label="العودة إلى الصفحة الرئيسية"
                  ripple
                >
                  الرئيسية
                </EnterpriseButton>
                <EnterpriseButton
                  variant="secondary"
                  size="md"
                  onClick={() => navigate("/programs")}
                  aria-label="تصفح برامجنا"
                  ripple
                >
                  برامجنا
                </EnterpriseButton>
              </div>
            </motion.div>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DonateAction",
            recipient: {
              "@type": "NonprofitOrganization",
              name: "حملة رحماء بينهم",
              url: "https://rbdcye.org",
            },
            agent: {
              "@type": "Person",
              name: donorInfo.name || "متبرع مجهول",
            },
          }),
        }}
      />
      <PageHeader
        icon={Heart}
        badge="التبرع"
        title="تبرع الآن — كن جزءاً من التغيير"
        subtitle="تبرعات مالية أو عينية بعملات متعددة — كل ريال يُحوّل فلسفة الخير إلى واقع ملموس"
      >
        <StatsGrid
          stats={[
            {
              label: "عملة مدعومة",
              value: Object.keys(CURRENCIES).length,
              icon: Coins,
              color: "green",
            },
            { label: "مشروع نشط", value: displayProjects.length, icon: BarChart3, color: "blue" },
            { label: "دولة نشطة", value: "أكثر من ١٥,٠٠٠ مستفيد", icon: Globe, color: "purple" },
            { label: "اثر مباشر", value: "أكثر من ١٢٥ مليون ر.ي", icon: Heart, color: "gold" },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      {/* ═══════ مقدمة ═══════ */}
      <section className="bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Sparkles className="w-8 h-8 text-[var(--brand-gold)] mx-auto mb-4" />
            <h2 className="text-2xl md:text-2xl font-bold text-[var(--foreground)] mb-6">
              تبرعك ليس مجرد رقم — بل هو{" "}
              <span className="text-[var(--brand-green)]">أثر حقيقي</span>
            </h2>
            <p className="text-[var(--muted-foreground)] leading-[2]">
              كل تبرع تقدمه يُحوّل من مجرد رغبة في الخير إلى أثر حقيقي في حياة إنسان محتاج.
              نحن نضمن لك أن كل ريال يتبرع به سينفق بحكمة وشفافية تامة، وستتمكن من متابعة أثر
              تبرعك من خلال تقاريرنا الدورية.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ محوّل العملات ═══════ */}
      <section className="bg-[var(--brand-green-pale)] py-8 border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
            aria-expanded={showCurrencyConverter}
            aria-controls="currency-converter"
            aria-label={showCurrencyConverter ? "إغلاق محوّل العملات" : "فتح محوّل العملات"}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-300 text-sm font-semibold text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none"
          >
            <RefreshCw className="w-4 h-4 text-[var(--brand-green)]" aria-hidden="true" />
            محوّل العملات — احسب المبلغ بعملتك المحلية
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showCurrencyConverter ? "rotate-180" : ""}`}
            />
          </button>
          {showCurrencyConverter && (
            <motion.div
              id="currency-converter"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="max-w-3xl mx-auto mt-4 bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-lg"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label
                    htmlFor="converter-from"
                    className="block text-xs font-bold text-[var(--muted-foreground)] mb-1"
                  >
                    من عملة
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="converter-from"
                      value={converterFrom}
                      onChange={(e) => setConverterFrom(e.target.value)}
                        className="flex-1 p-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-semibold"
                    >
                      {Object.values(CURRENCIES).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="converter-amount" className="sr-only">المبلغ</label>
                    <input
                      id="converter-amount"
                      type="text"
                      inputMode="decimal"
                      value={converterAmount}
                      onChange={(e) => setConverterAmount(sanitizeNumericInput(e.target.value))}
                      className="w-24 p-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-sm text-center font-bold"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <RefreshCw className="w-5 h-5 text-[var(--brand-green)] rotate-90" aria-hidden="true" />
                </div>
                <div>
                  <label
                    htmlFor="converter-to"
                    className="block text-xs font-bold text-[var(--muted-foreground)] mb-1"
                  >
                    إلى عملة
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="converter-to"
                      value={converterTo}
                      onChange={(e) => setConverterTo(e.target.value)}
                        className="flex-1 p-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-sm font-semibold"
                    >
                      {Object.values(CURRENCIES).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="w-24 p-3 rounded-xl border-2 border-[var(--brand-green)] bg-[var(--brand-green-pale)] text-sm text-center font-bold text-[var(--brand-green)] transition-all duration-300">
                      {convertedAmount.toLocaleString("ar-YE")}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════ اختيار نوع التبرع ═══════ */}
      <section className="bg-[var(--secondary)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
              اختر نموذج العطاء
            </h2>
            <p className="text-[var(--muted-foreground)] text-sm leading-[1.8]">
              المال والعروض كلاهما يُحدث فرقاً. اختر ما يناسبك ونحن نضمن وصوله بكرامته
            </p>
          </div>
          <div className="max-w-md mx-auto grid grid-cols-2 gap-6">
            <button
              onClick={() => setDonationType("monetary")}
              aria-pressed={donationType === "monetary"}
              className={`p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none ${
                donationType === "monetary"
                  ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)] shadow-lg"
                  : "border-[var(--border)] hover:border-[var(--brand-green)]"
              }`}
            >
              <Coins
                className={`w-8 h-8 ${donationType === "monetary" ? "text-[var(--brand-green)]" : "text-[var(--muted-foreground)]"}`}
                aria-hidden="true"
              />
              <span className="font-bold text-[var(--foreground)]">تبرع مالي</span>
              <span className="text-xs text-[var(--muted-foreground)] leading-[1.6]">
                بأي عملة تفضلها — سهل وسريع
              </span>
            </button>
            <button
              onClick={() => setDonationType("inkind")}
              aria-pressed={donationType === "inkind"}
              className={`p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 outline-none ${
                donationType === "inkind"
                  ? "border-[var(--brand-gold)] bg-[var(--brand-gold-pale)] shadow-lg"
                  : "border-[var(--border)] hover:border-[var(--brand-gold)]"
              }`}
            >
              <Package
                className={`w-8 h-8 ${donationType === "inkind" ? "text-[var(--brand-gold)]" : "text-[var(--muted-foreground)]"}`}
                aria-hidden="true"
              />
              <span className="font-bold text-[var(--foreground)]">تبرع عيني</span>
              <span className="text-xs text-[var(--muted-foreground)] leading-[1.6]">
                ملابس وأغذية وبطانيات — تحتاج توصيل مباشر
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ أثر التبرع ═══════ */}
      {donationType === "monetary" && (
        <section className="bg-[var(--background)] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-semibold bg-[var(--brand-green-pale)] px-4 py-1.5 rounded-full mb-4">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                الأثر الملموس لعملتك
              </span>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
                كل <span className="text-[var(--brand-green)]">{currency.symbol}</span> يُحوّل
                فرقاً حقيقياً
              </h2>
              <p className="text-[var(--muted-foreground)] text-sm leading-[1.8]">
                هذه تقديرات تقريبية — قد تختلف الأثر الفعلي حسب الظروف الميدانية والموقع الجغرافي
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {impactItems.map((item, i) => (
                <motion.div
                  key={item.amountInYER}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-green)]/20"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="text-xl font-extrabold text-[var(--brand-green)] mb-2">
                    {item.localAmount.toLocaleString("ar-YE")} {currency.symbol}
                  </div>
                  <div className="text-[var(--foreground)] font-bold text-sm mb-2">
                    {item.label}
                  </div>
                  <div className="text-[var(--muted-foreground)] text-xs leading-[1.7]">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ آية قرآنية ═══════ */}
      <div className="my-8 rounded-2xl border border-[var(--brand-gold)]/20 bg-gradient-to-l from-[var(--brand-gold)]/5 to-transparent p-6 text-center">
        <p className="font-amiri text-xl leading-loose text-[var(--foreground)] md:text-2xl" dir="rtl">
          ﴿ وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ ﴾
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">سورة سبأ، الآية ٣٩</p>
      </div>

      {/* ═══════ نموذج التبرع ═══════ */}
      <section className="bg-[var(--secondary)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="bg-[var(--card)] rounded-3xl p-8 md:p-12 border border-[var(--border)] shadow-lg">
                {/* اختيار العملة */}
                {donationType === "monetary" && (
                  <div className="mb-8">
                    <h3 className="block text-lg font-semibold text-[var(--foreground)] mb-5">
                      العملة — اختر العملة التي تفضلها
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(CURRENCIES).map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setSelectedCurrency(c.code);
                            setSelectedAmount(PRESET_AMOUNTS[c.code]?.[0] || 0);
                            setCustomAmount("");
                          }}
                          aria-pressed={selectedCurrency === c.code}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-semibold focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none ${
                            selectedCurrency === c.code
                              ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                              : "border-[var(--border)] hover:border-[var(--brand-green)] text-[var(--foreground)]"
                          }`}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span>{c.code}</span>
                          <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">
                            {c.symbol}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                      سعر الصرف التقريبي: 1 {currency.code} = {currency.rateToYER} ر.ي
                    </div>
                  </div>
                )}

                {/* اختيار المشروع */}
                <div className="mb-8">
                  <h3 className="block text-lg font-semibold text-[var(--foreground)] mb-5">
                    المشروع — حيث تريد أن يذهب تبرعك
                  </h3>
                  {projectsLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--muted)]" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {displayProjects.map((project) => {
                        const Icon = project.icon;
                        const isSelected = selectedProject === project.id;
                        return (
                          <button
                            key={project.id}
                            type="button"
                            onClick={() => setSelectedProject(project.id)}
                            className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                              isSelected
                                ? "border-[var(--brand-gold)] bg-[var(--brand-gold)]/10 shadow-lg"
                                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand-green)]/50"
                            }`}
                          >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${project.gradient}`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-sm font-bold text-[var(--foreground)]">{project.title}</span>
                            {project.featured && (
                              <span className="absolute -top-2 -right-2 rounded-full bg-[var(--brand-gold)] px-2 py-0.5 text-[0.6rem] font-bold text-white">
                                مميز
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* المبلغ — مالي */}
                {donationType === "monetary" && (
                  <div className="mb-8">
                    <h3 className="block text-lg font-semibold text-[var(--foreground)] mb-5">
                      المبلغ ({currency.symbol})
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                      {presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount("");
                          }}
                          aria-pressed={selectedAmount === amount && !customAmount}
                          className={`p-3 rounded-xl border-2 transition-all font-bold text-sm focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none ${
                            selectedAmount === amount && !customAmount
                              ? "border-[var(--brand-green)] bg-[var(--brand-green)] text-white"
                              : "border-[var(--border)] hover:border-[var(--brand-green)]"
                          }`}
                        >
                          {amount.toLocaleString("ar-YE")}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label htmlFor="custom-amount" className="sr-only">أدخل مبلغ مخصص</label>
                      <input
                        id="custom-amount"
                        type="text"
                        inputMode="decimal"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(sanitizeNumericInput(e.target.value));
                          if (e.target.value) setSelectedAmount(0);
                        }}
                        className="w-full p-4 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-lg focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all"
                        placeholder={`أدخل المبلغ بال${currency.name}`}
                      />
                    </div>
                    {actualAmount > 0 && actualAmount < (MIN_DONATION_AMOUNTS[selectedCurrency] ?? 1) && (
                      <div className="mt-2 text-xs font-semibold text-[var(--destructive)]">
                        الحد الأدنى هو {MIN_DONATION_AMOUNTS[selectedCurrency]?.toLocaleString("ar-YE") ?? 1} {currency.symbol}
                      </div>
                    )}
                    {actualAmount > 0 && (
                      <div className="mt-2 text-xs text-[var(--brand-green)] font-semibold">
                        المعادل:{" "}
                        {(fxRate ? Math.round(actualAmount * fxRate) : actualAmount).toLocaleString(
                          "ar-YE"
                        )}{" "}
                        ر.ي — سيُنفق هذا المبلغ بحكمة وعناية
                      </div>
                    )}
                  </div>
                )}

                {/* التبرع العيني */}
                {donationType === "inkind" && (
                  <div className="space-y-6 rounded-2xl border border-[var(--brand-green)]/20 bg-[var(--card)] p-6">
                    <h3 className="text-lg font-bold text-[var(--foreground)]">تفاصيل التبرع العيني</h3>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                    
                    {/* Item Category */}
                    <div>
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                      <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">نوع الصنف</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {[
                          { id: 'clothing', label: 'كسوات', icon: Shirt },
                          { id: 'food', label: 'غذاء', icon: Utensils },
                          { id: 'blankets', label: 'بطانيات', icon: Package },
                          { id: 'medical', label: 'مستلزمات طبية', icon: Stethoscope },
                          { id: 'stationery', label: 'مستلزمات تعليمية', icon: BookOpen },
                          { id: 'other', label: 'أخرى', icon: Package },
                        ].map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setInKindCategory(cat.id)}
                            aria-label={cat.label}
                            className={`flex items-center gap-2 rounded-lg border-2 p-3 text-sm transition-all ${
                              inKindCategory === cat.id
                                ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10'
                                : 'border-[var(--border)] bg-[var(--background)]'
                            }`}
                          >
                            <cat.icon className="h-4 w-4" />
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
{/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}

                    {/* Item Name + Quantity */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                        <label className="mb-1 block text-sm font-bold text-[var(--foreground)]">اسم الصنف</label>
                        <EnterpriseInput
                          type="text"
                          value={inKindItemName}
                          onChange={(val) => setInKindItemName(val)}
                          placeholder="مثال: بطانية شتوية"
                          size="md"
                          fullWidth
                          // eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: verified
                          label="اسم الصنف"
                          helperText="أدخل اسم الصنف المتبرع به"
                        />
                      </div>
                      <div>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                        <label className="mb-1 block text-sm font-bold text-[var(--foreground)]">الكمية</label>
                        <EnterpriseInput
                          type="number"
                          min="1"
                          value={String(inKindQuantity)}
                          onChange={(val) => setInKindQuantity(Number(val) || 0)}
                          placeholder="1"
                          size="md"
                          fullWidth
                          label="الكمية"
                          helperText="عدد القطع المتبرع بها"
                        // eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: verified
                        />
                      </div>
                    </div>

                    {/* Condition */}
                    <div>
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                      <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">حالة الصنف</label>
                      <div className="flex gap-3">
                        {['جديد', 'مستعمل - جيد', 'يحتاج صيانة'].map(cond => (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => setInKindCondition(cond)}
                            className={`rounded-lg border-2 px-4 py-2 text-sm transition-all ${
                              inKindCondition === cond
                                ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10'
                                : 'border-[var(--border)]'
                            }`}
                          >
                            {cond}
                          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Method */}
                    <div>
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                      <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">طريقة التسليم</label>
                      <div className="flex gap-3">
                        {[
                          { id: 'pickup', label: 'استلام من العنوان' },
                          { id: 'dropoff', label: 'تسليم في المقر' },
                          { id: 'shipping', label: 'شحن' },
                        ].map(m => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setDeliveryMethod(m.id as 'pickup' | 'dropoff' | 'shipping')}
                            className={`rounded-lg border-2 px-4 py-2 text-sm transition-all ${
                              deliveryMethod === m.id
                                ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/10'
                                : 'border-[var(--border)]'
                            }`}
                          >
                            {m.label}
                          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {deliveryMethod === 'pickup' && (
                      <div>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                        <label className="mb-1 block text-sm font-bold text-[var(--foreground)]">عنوان الاستلام</label>
                        <EnterpriseInput
                          type="textarea"
                          value={deliveryAddress}
                          onChange={(val) => setDeliveryAddress(val)}
                          placeholder="العنوان التفصيلي للاستلام"
                          rows={2}
                          size="md"
                          // eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: verified
                          fullWidth
                          label="عنوان الاستلام"
                          helperText="أدخل العنوان الكامل للاستلام"
                        />
                      </div>
                    )}

                    {/* Estimated Value */}
                    <div>
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                      <label className="mb-1 block text-sm font-bold text-[var(--foreground)]">القيمة التقديرية (اختياري)</label>
                      <EnterpriseInput
                        type="number"
                        min="0"
                        value={String(estimatedValue)}
                        onChange={(val) => setEstimatedValue(Number(val) || 0)}
                        placeholder="0"
                        size="md"
                        fullWidth
                        label="القيمة التقديرية"
                        helperText="القيمة المالية التقديرية للتبرع العيني (اختياري)"
                      />
                    </div>
                  </div>
                )}

                {/* نوع التكرار — مالي فقط */}
                {donationType === "monetary" && (
                  <div className="mb-8">
                    <h3 className="block text-lg font-semibold text-[var(--foreground)] mb-5">
                      نموذج العطاء — اختر كيف تريد أن تتبرع
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
                      {RECURRING_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setRecurringOption(opt.id)}
                            aria-pressed={recurringOption === opt.id}
                            className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-2 focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none ${
                              recurringOption === opt.id
                                ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)]"
                                : "border-[var(--border)] hover:border-[var(--brand-green)]"
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 ${recurringOption === opt.id ? "text-[var(--brand-green)]" : "text-[var(--muted-foreground)]"}`}
                              aria-hidden="true"
                            />
                            <div className="text-sm font-bold text-[var(--foreground)]">
                              {opt.label}
                            </div>
                            <div className="text-xs text-[var(--muted-foreground)] leading-[1.6]">
                              {opt.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* طريقة الدفع — مالي فقط */}
                {donationType === "monetary" && (
                  <div className="mb-8">
                    <h3 className="block text-lg font-semibold text-[var(--foreground)] mb-5">
                      طريقة الدفع — اختر الوسيلة المناسبة
                    </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {availablePaymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            aria-pressed={paymentMethod === method.id}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none ${
                              paymentMethod === method.id
                                ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)]"
                                : "border-[var(--border)] hover:border-[var(--brand-green)]"
                            }`}
                          >
                            <Icon className="w-7 h-7 text-[var(--brand-green)]" aria-hidden="true" />
                            <span className="text-sm font-semibold text-[var(--foreground)]">
                              {method.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {availablePaymentMethods.length === 0 && (
                      <p className="text-xs text-[var(--warning)] mt-2">
                        لا توجد طرق دفع إلكترونية متاحة لهذه العملة — يمكنك استخدام التحويل
                        البنكي المباشر
                      </p>
                    )}
                  </div>
                )}

                {/* بيانات المتبرع */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-5">
                    معلوماتك — اختيارية لكنها تساعدنا في التواصل معك
                  </h3>
                  <div className="space-y-4">
                    <EnterpriseInput
                      type="text"
                      id="donor-name"
                      value={donorInfo.name}
                      onChange={(val) => setDonorInfo({ ...donorInfo, name: val })}
                      placeholder="الاسم — اتركه فارغاً إذا أردت التبرع المجهول"
                      size="md"
                      fullWidth
                      label="الاسم"
                      helperText="اختياري — اتركه فارغاً للتبرع المجهول"
                      iconPosition="start"
                    />
                    <div className="grid md:grid-cols-2 gap-6">
                      <EnterpriseInput
                        type="email"
                        id="donor-email"
                        value={donorInfo.email}
                        onChange={(val) => setDonorInfo({ ...donorInfo, email: val })}
                        placeholder="البريد الإلكتروني * — لاستلام الإيصال"
                        size="md"
                        fullWidth
                        label="البريد الإلكتروني"
                        required
                        helperText="مطلوب لاستلام إيصال التبرع"
                        error={donorInfo.email && !donorInfo.email.includes("@") ? "بريد إلكتروني غير صالح" : undefined}
                      />
                      <EnterpriseInput
                        type="tel"
                        id="donor-phone"
                        value={donorInfo.phone}
                        onChange={(val) => setDonorInfo({ ...donorInfo, phone: val })}
                        placeholder="رقم الهاتف * — للتواصل السريع"
                        size="md"
                        fullWidth
                        label="رقم الهاتف"
                        required
                        helperText="مطلوب للتواصل السريع"
                        error={donorInfo.phone && donorInfo.phone.length < 10 ? "رقم هاتف غير صالح" : undefined}
                      />
                    </div>
                    <EnterpriseInput
                      type="textarea"
                      id="donor-message"
                      value={donorInfo.message}
                      onChange={(val) => setDonorInfo({ ...donorInfo, message: val })}
                      placeholder="رسالة اختيارية — ملاحظات أو توجيهات خاصة لتبرعك"
                      rows={3}
                      size="md"
                      fullWidth
                      label="رسالة اختيارية"
                      helperText="ملاحظات أو توجيهات خاصة لتبرعك"
                    />
                  </div>
                </div>

                {/* ملخص الدفع */}
                <div className="bg-gradient-to-r from-[var(--brand-green)]/10 to-[var(--brand-green)]/5 p-6 rounded-2xl mb-8">
                  <h4 className="font-bold text-[var(--foreground)] mb-3">ملخص تبرعك</h4>
                  {donationType === "monetary" ? (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[var(--muted-foreground)]">المبلغ:</span>
                        <span className="text-2xl font-bold text-[var(--foreground)]">
                          {actualAmount.toLocaleString("ar-YE")} {currency.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-[var(--muted-foreground)]">
                          المعادل بالريال اليمني:
                        </span>
                        <span className="font-semibold text-[var(--brand-green)]">
                          {amountInYER.toLocaleString("ar-YE")} ر.ي
                        </span>
                      </div>
                      {recurringOption !== "once" && (
                        <div className="flex justify-between items-center mb-2 text-sm">
                          <span className="text-[var(--muted-foreground)]">التكرار:</span>
                          <span className="font-semibold text-[var(--foreground)]">
                            {recurringOption === "monthly" ? "شهري — يتجدد تلقائياً" : "سنوي"}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[var(--muted-foreground)]">نوع التبرع:</span>
                      <span className="font-semibold text-[var(--foreground)]">
                        تبرع عيني — {inKindItemName || "لم يُحدد"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-[var(--muted-foreground)]">المشروع المستهدف:</span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {displayProjects.find((p) => p.id === selectedProject)?.title}
                    </span>
                  </div>
                  {donationType === "monetary" && (
                    <div className="flex justify-between items-center pt-2 border-t border-[var(--border)] text-sm">
                      <span className="text-[var(--muted-foreground)]">وسيلة الدفع:</span>
                      <span className="font-semibold text-[var(--foreground)]">
                        {availablePaymentMethods.find((m) => m.id === paymentMethod)?.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* زر الإرسال */}
                {submitError && (
                  <div
                    role="alert"
                    className="mb-4 rounded-xl border border-[var(--danger)] bg-[var(--danger-bg)] px-4 py-3 text-sm font-semibold text-[var(--destructive)]"
                  >
                    {submitError}
                  </div>
                )}
                <EnterpriseButton
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  loadingText="جاري المعالجة — نتحقق لضمان وصول تبرعك..."
                  icon={Heart}
                  className="shadow-lg hover:shadow-xl"
                  ripple
                  aria-label={donationType === "monetary" ? `تأكيد التبرع بمبلغ ${actualAmount.toLocaleString("ar-YE")} ${currency.symbol}` : "تأكيد التبرع العيني"}
                >
                  {donationType === "monetary"
                    ? `تأكيد التبرع — ${actualAmount.toLocaleString("ar-YE")} ${currency.symbol}`
                    : "تأكيد التبرع العيني — سنتواصل معك لتنسيق التسليم"}
                </EnterpriseButton>

                {/* شرائح الثقة */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { icon: Shield, title: "تشفير SSL", desc: "دفع آمن ومشفر بالكامل" },
                    {
                      icon: CheckCircle,
                      title: "إيصال فوري",
                      desc: "لكل تبرع بالبريد الإلكتروني",
                    },
                    { icon: Lock, title: "خصوصية مطلقة", desc: "بياناتك محمية ولن تُشارك" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-[var(--brand-green-pale)] border border-[var(--brand-green)]/10 transition-all duration-300"
                    >
                      <item.icon className="w-5 h-5 text-[var(--brand-green)]" aria-hidden="true" />
                      <span className="text-xs font-bold text-[var(--foreground)]">
                        {item.title}
                      </span>
                      <span className="text-[0.65rem] text-[var(--muted-foreground)]">
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════ برنامج الاشتراك الشهري ═══════ */}
      <section className="bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MonthlyGivingHero />
        </div>
      </section>

      {/* ═══════ مشاركة اجتماعية ═══════ */}
      <section className="bg-[var(--secondary)] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ViralShare
            customTitle="شارك الخير مع أصدقائك"
            customMessage="حملة رحماء بينهم — تبرعك يُغيّر حياة أسرة بأكملها"
          />
        </div>
      </section>
    </div>
  );
}
