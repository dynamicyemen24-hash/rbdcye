// حاسبة الزكاة الشاملة — Zakat Calculator Page
import {
  Calculator,
  Coins,
  Gem,
  Banknote,
  TrendingUp,
  ShoppingBag,
  FileText,
  Sparkles,
  Scale,
  MinusCircle,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Copy,
  MessageCircle,
  AlertCircle,
  Info,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Heart,
  CircleDollarSign,
  Landmark,
  CircleDot,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  scrollFadeUp,
  staggerContainer,
  viewportOnce,
} from "@/utils/animations";
import { useSEO } from "@/utils/seoAdvanced";

// ═══════════════════════════════════════════════════════
// الثوابت الشرعية — Zakat Constants
// ═══════════════════════════════════════════════════════
const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;
const ZAKAT_RATE = 0.025;
const ZAKAT_RATE_DISPLAY = "٢٫٥٪";
const ZAKAT_FRACTION = "١/٤٠";

const formatNumber = (value: number, fractionDigits = 0) =>
  new Intl.NumberFormat("ar-YE", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const formatCurrency = (value: number) => `${formatNumber(value, 2)} ر.ي`;

// ═══════════════════════════════════════════════════════
// فئات الأصول الثمانية — 8 Asset Categories
// ═══════════════════════════════════════════════════════
interface AssetCategory {
  id: string;
  name: string;
  description: string;
  icon: typeof Coins;
  color: string;
  nisabType: "gold" | "silver" | "both" | "none";
}

const ASSET_CATEGORIES: AssetCategory[] = [
  {
    id: "gold",
    name: "الذهب (النقد)",
    description: "أثمان الذهب المُملَك — السبائك والعملات الذهبية",
    icon: Gem,
    color: "var(--brand-gold)",
    nisabType: "gold",
  },
  {
    id: "silver",
    name: "الفضة",
    description: "أثمان الفضة المُملَكة — السبائك والعملات الفضية",
    icon: Landmark,
    color: "var(--muted-foreground)",
    nisabType: "silver",
  },
  {
    id: "cash",
    name: "الأوراق النقدية والعملات",
    description: "النقود والودائع البنكية والعملات الأجنبية",
    icon: Banknote,
    color: "var(--brand-green)",
    nisabType: "gold",
  },
  {
    id: "stocks",
    name: "الأسهم والاستثمارات",
    description: "الأسهم القابلة للتداول والاستثمارات المالية بقيمتها السوقية",
    icon: TrendingUp,
    color: "var(--info, #3b82f6)",
    nisabType: "gold",
  },
  {
    id: "inventory",
    name: "العروض التجارية",
    description: "بضائع التجارة والمخزون المُعد للبيع بقيمتها السوقية",
    icon: ShoppingBag,
    color: "var(--brand-green-light)",
    nisabType: "gold",
  },
  {
    id: "receivables",
    name: "المستحقات (الديون له)",
    description: "المبالغ المُ Entrustedثر من الغير المتوقعة تحصيلها",
    icon: FileText,
    color: "var(--brand-gold-dark)",
    nisabType: "gold",
  },
  {
    id: "jewelry",
    name: "المعادن الثمينة",
    description: "مجوهرات الذهب والفضة المُستخدمة — بوزنها الخالص",
    icon: Sparkles,
    color: "var(--brand-gold-light)",
    nisabType: "both",
  },
  {
    id: "agriculture",
    name: "الزراعة والمواشي",
    description: "المحاصيل الزراعية والحيوانات المُستنقة (الغنم والأبقار والإبل)",
    icon: CircleDot,
    color: "var(--success, #22c55e)",
    nisabType: "none",
  },
];

// ═══════════════════════════════════════════════════════
// خيارات الزراعة والمواشي
// ═══════════════════════════════════════════════════════
const AGRICULTURE_OPTIONS = [
  { id: "rainfed", label: "زراعات مطرية (أمطار)", rate: 0.1, description: "١٠٪ من المحصول — لا سقي" },
  { id: "irrigated", label: "زراعات مروية (سقي)", rate: 0.05, description: "٥٪ من المحصول — مع سقي" },
  { id: "livestock", label: "مواشي (غنم/بقر/إبل)", rate: 0, description: "حسب العدد وال tipos" },
];

// ═══════════════════════════════════════════════════════
// حالة صندوق الإدخال
// ═══════════════════════════════════════════════════════
interface AssetInput {
  value: string;
  weight?: string; // for jewelry
  livestockCount?: string;
  agricultureType?: string;
  agricultureValue?: string;
}

const emptyAssets: Record<string, AssetInput> = {
  gold: { value: "" },
  silver: { value: "" },
  cash: { value: "" },
  stocks: { value: "" },
  inventory: { value: "" },
  receivables: { value: "" },
  jewelry: { value: "", weight: "" },
  agriculture: { value: "", livestockCount: "", agricultureType: "rainfed", agricultureValue: "" },
};

interface DeductibleInput {
  debts: string;
  expenses: string;
}

const emptyDeductibles: DeductibleInput = { debts: "", expenses: "" };

// ═══════════════════════════════════════════════════════
// المكون الرئيسي — Main Component
// ═══════════════════════════════════════════════════════
export default function ZakatCalculatorPage() {
  const navigate = useNavigate();

  // ─── الحالة — State ──────────────────────────────────
  const [assets, setAssets] = useState<Record<string, AssetInput>>({ ...emptyAssets });
  const [deductibles, setDeductibles] = useState<DeductibleInput>({ ...emptyDeductibles });
  const [goldPrice, setGoldPrice] = useState("25000");
  const [silverPrice, setSilverPrice] = useState("350");
  const [hasHawl, setHasHawl] = useState(true);
  const [result, setResult] = useState<{
    totalAssets: number;
    totalDeductibles: number;
    netZakatable: number;
    zakatDue: number;
    breakdown: Array<{ id: string; name: string; value: number; zakat: number; nisab: number; eligible: boolean }>;
    meetsNisab: boolean;
  } | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: "حاسبة الزكاة الشاملة — رحماء بينهم",
    description:
      "حاسبة زكاة إسلامية شاملة بثمان فئات أصول — تحسب النصاب والزكاة المستحقة بدقة وفق أصول الفقه المعتمدة. أداة مجانية لحساب زكاة مالك.",
    keywords: [
      "حاسبة الزكاة",
      "زكاة المال",
      "زكاة الذهب",
      "زكاة الفضة",
      "زكاة الأسهم",
      "زكاة العروض",
      "رحماء بينهم",
      "نصاب الزكاة",
      "زكاة الفطر",
      "حاسبة زكاة مجانية",
    ],
    url: "https://rbdcye.org/zakat-calculator",
  });

  // ─── الحسابات المُشتقّة — Derived Calculations ─────────
  const goldNisab = useMemo(() => {
    const price = parseFloat(goldPrice) || 0;
    return GOLD_NISAB_GRAMS * price;
  }, [goldPrice]);

  const silverNisab = useMemo(() => {
    const price = parseFloat(silverPrice) || 0;
    return SILVER_NISAB_GRAMS * price;
  }, [silverPrice]);

  const categoryValues = useMemo(() => {
    const parse = (v: string) => Math.max(0, parseFloat(v) || 0);

    const goldVal = parse(assets.gold.value);
    const silverVal = parse(assets.silver.value);
    const cashVal = parse(assets.cash.value);
    const stocksVal = parse(assets.stocks.value);
    const inventoryVal = parse(assets.inventory.value);
    const receivablesVal = parse(assets.receivables.value);
    const jewelryVal = parse(assets.jewelry.value);
    const agricultureVal = parse(assets.agriculture.value) || parse(assets.agriculture.agricultureValue || "");
    const livestockCount = parse(assets.agriculture.livestockCount || "");

    const agricultureFinal = (assets.agriculture.agricultureType || "rainfed") === "livestock" && livestockCount > 0
      ? livestockCount
      : agricultureVal;

    return {
      gold: goldVal,
      silver: silverVal,
      cash: cashVal,
      stocks: stocksVal,
      inventory: inventoryVal,
      receivables: receivablesVal,
      jewelry: jewelryVal,
      agriculture: agricultureFinal,
      total:
        goldVal + silverVal + cashVal + stocksVal + inventoryVal + receivablesVal + jewelryVal + agricultureFinal,
    };
  }, [assets]);

  const totalDeductibles = useMemo(() => {
    return Math.max(0, parseFloat(deductibles.debts) || 0) + Math.max(0, parseFloat(deductibles.expenses) || 0);
  }, [deductibles]);

  // ─── حساب الزكاة — Calculate Zakat ──────────────────────
  const calculateZakat = useCallback(() => {
    const parse = (v: string) => Math.max(0, parseFloat(v) || 0);
    const price = parseFloat(goldPrice) || 0;
    const sPrice = parseFloat(silverPrice) || 0;

    const cats = [
      { id: "gold", name: "الذهب (النقد)", value: parse(assets.gold.value), nisab: GOLD_NISAB_GRAMS * price, eligible: parse(assets.gold.value) >= GOLD_NISAB_GRAMS * price },
      { id: "silver", name: "الفضة", value: parse(assets.silver.value), nisab: SILVER_NISAB_GRAMS * sPrice, eligible: parse(assets.silver.value) >= SILVER_NISAB_GRAMS * sPrice },
      { id: "cash", name: "الأوراق النقدية", value: parse(assets.cash.value), nisab: GOLD_NISAB_GRAMS * price, eligible: parse(assets.cash.value) >= GOLD_NISAB_GRAMS * price },
      { id: "stocks", name: "الأسهم والاستثمارات", value: parse(assets.stocks.value), nisab: GOLD_NISAB_GRAMS * price, eligible: parse(assets.stocks.value) >= GOLD_NISAB_GRAMS * price },
      { id: "inventory", name: "العروض التجارية", value: parse(assets.inventory.value), nisab: GOLD_NISAB_GRAMS * price, eligible: parse(assets.inventory.value) >= GOLD_NISAB_GRAMS * price },
      { id: "receivables", name: "المستحقات", value: parse(assets.receivables.value), nisab: GOLD_NISAB_GRAMS * price, eligible: parse(assets.receivables.value) >= GOLD_NISAB_GRAMS * price },
      { id: "jewelry", name: "المعادن الثمينة", value: parse(assets.jewelry.value), nisab: GOLD_NISAB_GRAMS * price, eligible: parse(assets.jewelry.value) >= GOLD_NISAB_GRAMS * price },
      {
        id: "agriculture",
        name: "الزراعة والمواشي",
        value:
          (assets.agriculture.agricultureType || "rainfed") === "livestock"
            ? parse(assets.agriculture.livestockCount || "")
            : parse(assets.agriculture.agricultureValue || ""),
        nisab: 0,
        eligible: (assets.agriculture.agricultureType || "rainfed") === "livestock"
          ? parse(assets.agriculture.livestockCount || "") > 0
          : parse(assets.agriculture.agricultureValue || "") > 0,
      },
    ];

    const totalAssets = cats.reduce((sum, c) => sum + c.value, 0);
    const netZakatable = Math.max(0, totalAssets - totalDeductibles);
    const meetsNisab = netZakatable >= goldNisab;

    const breakdown = cats.map((c) => ({
      ...c,
      zakat: hasHawl && meetsNisab && c.eligible ? c.value * ZAKAT_RATE : 0,
    }));

    const zakatDue = hasHawl && meetsNisab ? netZakatable * ZAKAT_RATE : 0;

    setResult({
      totalAssets,
      totalDeductibles,
      netZakatable,
      zakatDue,
      breakdown,
      meetsNisab,
    });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [assets, deductibles, goldPrice, silverPrice, hasHawl, goldNisab, totalDeductibles]);

  // ─── إعادة الضبط — Reset ────────────────────────────────
  const reset = useCallback(() => {
    setAssets({ ...emptyAssets });
    setDeductibles({ ...emptyDeductibles });
    setGoldPrice("25000");
    setSilverPrice("350");
    setHasHawl(true);
    setResult(null);
    setShowShareMenu(false);
    setCopied(false);
    setExpandedCategory(null);
  }, []);

  // ─── النسخ والمشاركة — Share & Copy ──────────────────────
  const copyResult = useCallback(() => {
    if (!result) return;
    const text = `حاسبة الزكاة — رحماء بينهم\n========================\nإجمالي الأصول: ${formatCurrency(result.totalAssets)}\nالخصومات: ${formatCurrency(result.totalDeductibles)}\nالصافي الخاضع للزكاة: ${formatCurrency(result.netZakatable)}\nنسبة الزكاة: ${ZAKAT_RATE_DISPLAY}\n========================\nالزكاة المستحقة: ${formatCurrency(result.zakatDue)}\n========================\nhttps://rbdcye.org/zakat-calculator`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const shareWhatsApp = useCallback(() => {
    if (!result) return;
    const text = encodeURIComponent(
      `🕌 حاسبة الزكاة — رحماء بينهم\n\n💰 الزكاة المستحقة: ${formatCurrency(result.zakatDue)}\n📊 من أصل ${formatCurrency(result.netZakatable)} صافي\n\n Calcule your zakat now:\nhttps://rbdcye.org/zakat-calculator`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }, [result]);

  const goToDonate = useCallback(() => {
    if (!result) return;
    navigate("/donate", { state: { zakatAmount: Math.round(result.zakatDue), currency: "YER" } });
  }, [navigate, result]);

  // ─── تحديث قيمة الأصل — Update Asset ─────────────────────
  const updateAsset = useCallback((id: string, field: string, value: string) => {
    setAssets((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
    setResult(null);
  }, []);

  const updateDeductible = useCallback((field: keyof DeductibleInput, value: string) => {
    setDeductibles((prev) => ({ ...prev, [field]: value }));
    setResult(null);
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setExpandedCategory((prev) => (prev === id ? null : id));
  }, []);

  // ─── إغلاق القائمة عند النقر خارجها ───────────────────────
  useEffect(() => {
    if (!showShareMenu) return;
    const handler = () => setShowShareMenu(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showShareMenu]);

  // ═══════════════════════════════════════════════════════
  // العرض — Render
  // ═══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* ═══════ هيرو — Hero Section ═══════ */}
      <section className="relative overflow-hidden bg-[var(--brand-green-dark)] py-20 text-white sm:py-40">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "var(--pattern-rub-el-hizb)", backgroundSize: "200px 200px" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div initial="initial" animate="visible" variants={staggerContainer}>
            <motion.div
              variants={scrollFadeUp}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur-sm"
            >
              <Calculator className="h-3.5 w-3.5 text-[var(--brand-gold)]" />
              أداة إسلامية مجانية
            </motion.div>

            <motion.h1
              variants={scrollFadeUp}
              className="text-3xl font-extrabold leading-[1.35] sm:text-4xl lg:text-5xl"
            >
              حاسبة الزكاة <span className="text-[var(--brand-gold)]">الشاملة</span>
            </motion.h1>

            <motion.p
              variants={scrollFadeUp}
              className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base"
            >
              احسب زكاة أصولك بثمان فئات متكاملة وفقًا لأحكام الشريعة الإسلامية —
              تتضمن النصاب والخصومات وعرض تفصيلي لكل فئة.
            </motion.p>

            <motion.div
              variants={scrollFadeUp}
              className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <p className="font-amiri text-xl leading-loose text-white md:text-2xl" dir="rtl">
                ﴿ خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِمْ بِهَا ﴾
              </p>
              <p className="mt-3 text-sm text-white/50">سورة التوبة، الآية ١٠٣</p>
            </motion.div>

            <motion.div variants={scrollFadeUp} className="mt-8 grid grid-cols-2 gap-3 sm:min-w-[400px]">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-center">
                <div className="text-2xl font-extrabold text-[var(--brand-gold)]">{ZAKAT_RATE_DISPLAY}</div>
                <div className="mt-1 text-xs text-white/55">نسبة الزكاة ({ZAKAT_FRACTION})</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-center">
                <div className="text-2xl font-extrabold text-[var(--brand-gold)]">٨ فئات</div>
                <div className="mt-1 text-xs text-white/55">أنواع الأصول الخاضعة للزكاة</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ المحتوى الرئيسي ═══════ */}
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14 lg:px-10">
        {/* ─── أbastone النصاب المرجعي ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="mb-10 rounded-[28px] border border-[var(--brand-green)]/10 bg-[var(--card)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Scale className="h-5 w-5 text-[var(--brand-gold)]" />
            <h2 className="text-lg font-extrabold text-[var(--foreground)]">النصاب المرجعي</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* سعر الذهب */}
            <div className="rounded-2xl border border-[var(--brand-gold)]/20 bg-[var(--brand-gold-pale)] p-5">
              <label htmlFor="gold-price" className="block text-xs font-bold text-[var(--brand-gold-dark)] mb-2">
                سعر غرام الذهب (ر.ي)
              </label>
              <div className="relative">
                <input
                  id="gold-price"
                  type="text"
                  inputMode="decimal"
                  value={goldPrice}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
                    setGoldPrice(v);
                    setResult(null);
                  }}
                  className="w-full rounded-xl border border-[var(--brand-gold)]/20 bg-white px-4 py-3 text-lg font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/20"
                  placeholder="25000"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">
                  ر.ي/غ
                </span>
              </div>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                نصاب الذهب: <span className="font-bold text-[var(--brand-gold-dark)]">{GOLD_NISAB_GRAMS} غرام</span>
              </p>
              <p className="text-xs text-[var(--brand-green)] font-bold mt-1">
                = {formatCurrency(goldNisab)}
              </p>
            </div>

            {/* سعر الفضة */}
            <div className="rounded-2xl border border-[var(--muted-foreground)]/20 bg-[var(--secondary)] p-5">
              <label htmlFor="silver-price" className="block text-xs font-bold text-[var(--muted-foreground)] mb-2">
                سعر غرام الفضة (ر.ي)
              </label>
              <div className="relative">
                <input
                  id="silver-price"
                  type="text"
                  inputMode="decimal"
                  value={silverPrice}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
                    setSilverPrice(v);
                    setResult(null);
                  }}
                  className="w-full rounded-xl border border-[var(--muted-foreground)]/20 bg-white px-4 py-3 text-lg font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20"
                  placeholder="350"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">
                  ر.ي/غ
                </span>
              </div>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                نصاب الفضة: <span className="font-bold">{SILVER_NISAB_GRAMS} غرام</span>
              </p>
              <p className="text-xs text-[var(--brand-green)] font-bold mt-1">
                = {formatCurrency(silverNisab)}
              </p>
            </div>

            {/* شرط الحول */}
            <div className="rounded-2xl border border-[var(--brand-green)]/15 bg-[var(--brand-green-pale)] p-5 flex flex-col justify-center">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={hasHawl}
                  onChange={(e) => {
                    setHasHawl(e.target.checked);
                    setResult(null);
                  }}
                  className="h-5 w-5 accent-[var(--brand-green)]"
                />
                <div>
                  <span className="text-sm font-bold text-[var(--brand-green)]">
                    حال على المال الحول الهجري
                  </span>
                  <span className="block text-[10px] text-[var(--muted-foreground)] mt-0.5">
                    شرط أساسي في أصول الفقه —皓 كامل (١٢ قمرية)
                  </span>
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* ═══════ أقسام الأصول الثمانية ═══════ */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <CircleDollarSign className="h-5 w-5 text-[var(--brand-green)]" />
            <h2 className="text-lg font-extrabold text-[var(--foreground)]">أصولك الخاضعة للزكاة</h2>
          </div>

          {ASSET_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            const isExpanded = expandedCategory === cat.id;
            const catValue = categoryValues[cat.id as keyof typeof categoryValues] || 0;
            const hasValue = catValue > 0;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.05 }}
                className={`rounded-[24px] border bg-[var(--card)] shadow-sm overflow-hidden transition-all duration-300 ${
                  isExpanded
                    ? "border-[var(--brand-green)]/30 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
                    : "border-[var(--border)] hover:border-[var(--brand-green)]/15"
                }`}
              >
                {/* رأس القسم */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="flex w-full items-center gap-4 p-5 text-right transition-colors hover:bg-[var(--secondary)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2"
                  aria-expanded={isExpanded}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors"
                    style={{ backgroundColor: `color-mix(in srgb, ${cat.color} 12%, transparent)` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-[var(--foreground)]">{cat.name}</h3>
                      {hasValue && !isExpanded && (
                        <span className="rounded-full bg-[var(--brand-green-pale)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--brand-green)]">
                          {formatCurrency(catValue)}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--muted-foreground)] leading-5">
                      {cat.description}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-[var(--brand-green)]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[var(--muted-foreground)]" />
                    )}
                  </div>
                </button>

                {/* محتوى القسم */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[var(--border)] px-5 pb-5 pt-4">
                        {/* معلومات النصاب */}
                        <div className="mb-4 flex items-center gap-2 rounded-xl bg-[var(--secondary)] px-3 py-2 text-[11px] text-[var(--muted-foreground)]">
                          <Info className="h-3.5 w-3.5 shrink-0 text-[var(--brand-green)]" />
                          {cat.nisabType === "gold" && (
                            <span>النصاب المرجعي: <strong className="text-[var(--brand-green)]">{formatCurrency(goldNisab)}</strong> (سعر {GOLD_NISAB_GRAMS}غ ذهب)</span>
                          )}
                          {cat.nisabType === "silver" && (
                            <span>النصاب المرجعي: <strong className="text-[var(--brand-green)]">{formatCurrency(silverNisab)}</strong> (سعر {SILVER_NISAB_GRAMS}غ فضة)</span>
                          )}
                          {cat.nisabType === "both" && (
                            <span>النصاب: الذهب {formatCurrency(goldNisab)} أو الفضة {formatCurrency(silverNisab)}</span>
                          )}
                          {cat.nisabType === "none" && (
                            <span>حسب نوع الزراعة والمواشي — يُحسب نصف العشر أو العشر</span>
                          )}
                        </div>

                        {/* حقول الإدخال */}
                        {cat.id === "jewelry" ? (
                          <div className="grid gap-4 sm:grid-cols-2">
                            <label htmlFor={`asset-${cat.id}-value`} className="block">
                              <span className="mb-1.5 block text-xs font-bold text-[var(--foreground)]">
                                القيمة السوقية للمجوهرات (ر.ي)
                              </span>
                              <input
                                id={`asset-${cat.id}-value`}
                                type="text"
                                inputMode="decimal"
                                value={assets.jewelry.value}
                                onChange={(e) => updateAsset("jewelry", "value", e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))}
                                className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20"
                                placeholder="0"
                              />
                            </label>
                            <label htmlFor={`asset-${cat.id}-weight`} className="block">
                              <span className="mb-1.5 block text-xs font-bold text-[var(--foreground)]">
                                الوزن الخالص (غرام)
                              </span>
                              <input
                                id={`asset-${cat.id}-weight`}
                                type="text"
                                inputMode="decimal"
                                value={assets.jewelry.weight || ""}
                                onChange={(e) => updateAsset("jewelry", "weight", e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))}
                                className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20"
                                placeholder="0"
                              />
                            </label>
                          </div>
                        ) : cat.id === "agriculture" ? (
                          <div className="space-y-4">
                            {/* نوع الزراعة/المواشي */}
                            <div>
                              <span className="mb-2 block text-xs font-bold text-[var(--foreground)]">نوع الإنتاج</span>
                              <div className="grid gap-2 sm:grid-cols-3">
                                {AGRICULTURE_OPTIONS.map((opt) => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => updateAsset("agriculture", "agricultureType", opt.id)}
                                    className={`rounded-xl border-2 p-3 text-right transition-all ${
                                      (assets.agriculture.agricultureType || "rainfed") === opt.id
                                        ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)]"
                                        : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand-green)]/30"
                                    }`}
                                  >
                                    <span className="block text-xs font-bold text-[var(--foreground)]">{opt.label}</span>
                                    <span className="block text-[10px] text-[var(--muted-foreground)] mt-0.5">{opt.description}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {(assets.agriculture.agricultureType || "rainfed") === "livestock" ? (
                              <label htmlFor="asset-livestock-count" className="block">
                                <span className="mb-1.5 block text-xs font-bold text-[var(--foreground)]">
                                  عدد المواشي (رأس)
                                </span>
                                <input
                                  id="asset-livestock-count"
                                  type="text"
                                  inputMode="numeric"
                                  value={assets.agriculture.livestockCount || ""}
                                  onChange={(e) => updateAsset("agriculture", "livestockCount", e.target.value.replace(/[^0-9]/g, ""))}
                                  className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20"
                                  placeholder="0"
                                />
                              </label>
                            ) : (
                              <label htmlFor="asset-agriculture-value" className="block">
                                <span className="mb-1.5 block text-xs font-bold text-[var(--foreground)]">
                                  قيمة المحصول (ر.ي)
                                </span>
                                <input
                                  id="asset-agriculture-value"
                                  type="text"
                                  inputMode="decimal"
                                  value={assets.agriculture.agricultureValue || ""}
                                  onChange={(e) => updateAsset("agriculture", "agricultureValue", e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))}
                                  className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20"
                                  placeholder="0"
                                />
                                <p className="mt-1 text-[10px] text-[var(--muted-foreground)]">
                                  الزراعة المطرية: ١٠٪ — المروية: ٥٪
                                </p>
                              </label>
                            )}
                          </div>
                        ) : (
                          <label htmlFor={`asset-${cat.id}`} className="block">
                            <span className="mb-1.5 block text-xs font-bold text-[var(--foreground)]">
                              القيمة (ر.ي)
                            </span>
                            <input
                              id={`asset-${cat.id}`}
                              type="text"
                              inputMode="decimal"
                              value={assets[cat.id]?.value || ""}
                              onChange={(e) => updateAsset(cat.id, "value", e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))}
                              className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20"
                              placeholder="0"
                            />
                          </label>
                        )}

                        {/* مؤشر الحالة */}
                        {catValue > 0 && (
                          <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${
                            (cat.nisabType !== "none" && catValue >= goldNisab)
                              ? "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                              : cat.nisabType === "none"
                                ? "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                                : "bg-[var(--brand-gold-pale)] text-[var(--brand-gold-dark)]"
                          }`}>
                            {cat.nisabType !== "none" && catValue >= goldNisab ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                يتجاوز النصاب — خاضع للزكاة بنسبة {ZAKAT_RATE_DISPLAY}
                              </>
                            ) : cat.nisabType === "none" ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {(assets.agriculture.agricultureType || "rainfed") === "livestock"
                                  ? `زكاة المواشي: ${formatCurrency(catValue * ZAKAT_RATE)} (٢٫٥٪)`
                                  : `زكاة المحصول: ${formatCurrency(catValue * ((assets.agriculture.agricultureType || "rainfed") === "rainfed" ? 0.1 : 0.05))}`}
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3.5 w-3.5" />
                                لم يبلغ النصاب بعد
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ═══════ الخصومات ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="mt-8 rounded-[28px] border border-[var(--destructive, #ef4444)]/15 bg-[var(--card)] p-6 shadow-sm sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <MinusCircle className="h-5 w-5 text-[var(--destructive, #ef4444)]" />
            <div>
              <h2 className="text-lg font-extrabold text-[var(--foreground)]">الخصومات المستحقة</h2>
              <p className="text-xs text-[var(--muted-foreground)]">الديون والالتزامات الحالّة التي تُخصَّم قبل احتساب الزكاة</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="deduct-debts" className="block">
              <span className="mb-1.5 block text-xs font-bold text-[var(--foreground)]">
                الديون والمُعرَّض له (ر.ي)
              </span>
              <input
                id="deduct-debts"
                type="text"
                inputMode="decimal"
                value={deductibles.debts}
                onChange={(e) => updateDeductible("debts", e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))}
                className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20"
                placeholder="0"
              />
            </label>
            <label htmlFor="deduct-expenses" className="block">
              <span className="mb-1.5 block text-xs font-bold text-[var(--foreground)]">
                الالتزامات الحالّة (ر.ي)
              </span>
              <input
                id="deduct-expenses"
                type="text"
                inputMode="decimal"
                value={deductibles.expenses}
                onChange={(e) => updateDeductible("expenses", e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))}
                className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--foreground)] outline-none transition focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20"
                placeholder="0"
              />
            </label>
          </div>

          {totalDeductibles > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--brand-gold-pale)] px-3 py-2 text-xs font-bold text-[var(--brand-gold-dark)]">
              <Info className="h-3.5 w-3.5" />
              إجمالي الخصومات: {formatCurrency(totalDeductibles)}
            </div>
          )}
        </motion.div>

        {/* ═══════ أزرار الحساب ═══════ */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <motion.button
            type="button"
            onClick={calculateZakat}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--brand-green)] px-6 text-sm font-extrabold text-white shadow-lg transition hover:bg-[var(--brand-green-light)] focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none"
          >
            <Calculator className="h-4 w-4" /> احسب الزكاة المستحقة
          </motion.button>
          <motion.button
            type="button"
            onClick={reset}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--brand-green)]/15 px-5 text-sm font-bold text-[var(--brand-green)] transition hover:bg-[var(--brand-green-pale)] focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none"
          >
            <RotateCcw className="h-4 w-4" /> إعادة ضبط
          </motion.button>
        </div>

        {/* ═══════ النتيجة ═══════ */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="mt-10 rounded-[32px] border-2 border-[var(--brand-gold)]/30 bg-gradient-to-br from-[var(--brand-gold-pale)] via-[var(--card)] to-[var(--card)] p-6 shadow-[0_24px_80px_rgba(198,158,90,0.12)] sm:p-10"
            >
              {/* العنوان */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-gold)] text-white">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[var(--foreground)]">نتيجة حساب الزكاة</h2>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {hasHawl ? "حال على المال الحول الهجري الكامل" : "⚠️ لم يتحقق شرط الحول — للإرشاد فقط"}
                  </p>
                </div>
              </div>

              {/* المبلغ الرئيسي */}
              <div className="mb-8 text-center">
                <div className="text-[10px] font-bold text-[var(--brand-gold-dark)] tracking-wider mb-2">
                  الزكاة المستحقة
                </div>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                  className="text-5xl font-extrabold text-[var(--brand-green)] sm:text-6xl"
                >
                  {formatCurrency(result.zakatDue)}
                </motion.div>
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                  نسبة {ZAKAT_RATE_DISPLAY} من صافي الأصول {formatCurrency(result.netZakatable)} ر.ي
                </p>
                {!result.meetsNisab && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--brand-gold-pale)] px-4 py-2 text-xs font-bold text-[var(--brand-gold-dark)]">
                    <AlertCircle className="h-4 w-4" />
                    صافي الأصول لم يبلغ النصاب — الزكاة للإرشاد فقط
                  </div>
                )}
              </div>

              {/* الملخص */}
              <div className="grid gap-3 sm:grid-cols-3 mb-8">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-center">
                  <div className="text-[10px] text-[var(--muted-foreground)] mb-1">إجمالي الأصول</div>
                  <div className="text-lg font-extrabold text-[var(--foreground)]">{formatCurrency(result.totalAssets)}</div>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-center">
                  <div className="text-[10px] text-[var(--muted-foreground)] mb-1">الخصومات</div>
                  <div className="text-lg font-extrabold text-[var(--destructive, #ef4444)]">-{formatCurrency(result.totalDeductibles)}</div>
                </div>
                <div className="rounded-xl border border-[var(--brand-green)]/20 bg-[var(--brand-green-pale)] p-4 text-center">
                  <div className="text-[10px] text-[var(--muted-foreground)] mb-1">الصافي الخاضع للزكاة</div>
                  <div className="text-lg font-extrabold text-[var(--brand-green)]">{formatCurrency(result.netZakatable)}</div>
                </div>
              </div>

              {/* تفصيل كل فئة */}
              <div className="mb-8">
                <h3 className="text-sm font-extrabold text-[var(--foreground)] mb-4">تفصيل الزكاة حسب الفئة</h3>
                <div className="space-y-2">
                  {result.breakdown
                    .filter((b) => b.value > 0)
                    .map((b) => {
                      const cat = ASSET_CATEGORIES.find((c) => c.id === b.id);
                      const Icon = cat?.icon || Coins;
                      return (
                        <div
                          key={b.id}
                          className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                        >
                          <Icon className="h-4 w-4 shrink-0" style={{ color: cat?.color }} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-[var(--foreground)]">{b.name}</div>
                          </div>
                          <div className="text-left shrink-0">
                            <div className="text-sm font-extrabold text-[var(--foreground)]">
                              {formatCurrency(b.value)}
                            </div>
                            <div className="text-[10px] text-[var(--brand-green)] font-bold">
                              زكاة: {formatCurrency(b.zakat)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.button
                  type="button"
                  onClick={goToDonate}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--brand-green)] px-6 text-sm font-extrabold text-white shadow-lg transition hover:bg-[var(--brand-green-light)] focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none"
                >
                  <Heart className="h-4 w-4" /> أخرج زكاتك الآن
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </motion.button>

                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShareMenu(!showShareMenu);
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--brand-green)]/15 px-5 text-sm font-bold text-[var(--brand-green)] transition hover:bg-[var(--brand-green-pale)] focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none"
                  >
                    <Share2 className="h-4 w-4" /> مشاركة
                    {showShareMenu ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </motion.button>

                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 mb-2 w-56 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl z-10"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyResult();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-xs font-bold text-[var(--foreground)] transition hover:bg-[var(--secondary)]"
                        >
                          {copied ? (
                            <CheckCircle2 className="h-4 w-4 text-[var(--success, #22c55e)]" />
                          ) : (
                            <Copy className="h-4 w-4 text-[var(--brand-green)]" />
                          )}
                          {copied ? "تم النسخ!" : "نسخ النتيجة"}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareWhatsApp();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-xs font-bold text-[var(--foreground)] transition hover:bg-[var(--secondary)]"
                        >
                          <MessageCircle className="h-4 w-4 text-[var(--success, #22c55e)]" />
                          مشاركة عبر واتساب
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ التنبيه الشرعي ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="mt-10 rounded-[28px] bg-[var(--brand-green)] p-6 text-white sm:p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-6 w-6 text-[var(--brand-gold)]" />
            <h2 className="text-lg font-extrabold">منهج الحساب الشرعي</h2>
          </div>
          <p className="text-xs leading-7 text-white/65 mb-4">
            تعتمد هذه الأداة على أصول الفقه المعتمدة في حساب الزكاة: يُعرض النصاب بوضوح،
            وتُخصَّم الالتزامات الحالّة من إجمالي المال قبل احتساب نسبته. لا تُخفِي الأداة أي فرضية
            مؤثرة في النتيجة النهائية.
          </p>
          <div className="grid gap-3 sm:grid-cols-4 text-xs text-white/70">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="text-lg font-extrabold text-[var(--brand-gold)]">{ZAKAT_RATE_DISPLAY}</div>
              <div className="mt-1">نسبة الزكاة</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="text-lg font-extrabold text-[var(--brand-gold)]">{GOLD_NISAB_GRAMS}غ</div>
              <div className="mt-1">نصاب الذهب</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="text-lg font-extrabold text-[var(--brand-gold)]">{SILVER_NISAB_GRAMS}غ</div>
              <div className="mt-1">نصاب الفضة</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="text-lg font-extrabold text-[var(--brand-gold)]">١٢ قمرية</div>
              <div className="mt-1">مدة الحول</div>
            </div>
          </div>
        </motion.div>

        {/* ═══════ ملاحظة شرعية ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="mt-6 rounded-[24px] border border-[var(--brand-green)]/10 bg-white p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-5 w-5 text-[var(--brand-gold-dark)]" />
            <h2 className="text-sm font-extrabold text-[var(--brand-green)]">تنبيه شرعي مهم</h2>
          </div>
          <p className="text-xs leading-7 text-[var(--muted-foreground)]">
            هذه أداة إرشادية لتسهيل الحساب ولا تُغني عن الفتوى. في زكاة عروض التجارة، الأسهم،
            الصناديق الاستثمارية، أو اختلاف الحول والنصاب، يُنصح بمراجعة عالم أهل العلم أو جهة
            شرعية موثوقة قبل إخراج الزكاة.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-[var(--brand-gold-pale)] p-3 text-[11px] leading-5 text-[var(--brand-gold-dark)]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            سعر الذهب وقيمة الفضة يختلفان من دولة لأخرى — يُنصح بتحديثهما قبل كل حساب.
          </div>
        </motion.div>

        {/* ═══════ زر التبرع ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          className="mt-6"
        >
          <motion.button
            type="button"
            onClick={() => navigate("/donate")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--brand-green)]/15 bg-[var(--brand-green-pale)] py-4 text-sm font-extrabold text-[var(--brand-green)] transition hover:bg-[var(--brand-green-pale)]/80 focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none"
          >
            <Sparkles className="h-4 w-4 text-[var(--brand-gold-dark)]" />
            أخرج زكاتك عبر رحماء بينهم
            <ArrowLeft className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
