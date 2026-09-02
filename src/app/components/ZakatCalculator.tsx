// Zakat Calculator - Enterprise Grade - Unified Design System
// حاسبة الزكاة الذكية - مطابقة للمواصفات
import {
  Calculator,
  Coins,
  Gem,
  Landmark,
  Calendar,
  Share2,
  Wallet,
  CreditCard,
  Banknote,
  CheckCircle,
  RefreshCw,
  Copy,
  Download,
  History,
  X,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

type ZakatType = "money" | "gold" | "silver" | "fitrah";
type ZakatTab = ZakatType | "compare";

interface ZakatResult {
  type: ZakatType;
  amount: number;
  zakat: number;
  nisab: number;
  description: string;
  zakatRate: number;
  isAboveNisab: boolean;
}

interface ZakatHistoryItem {
  id: string;
  date: string;
  type: ZakatType;
  amount: number;
  zakat: number;
}

// Hijri date conversion helper
function getHijriDateReminder(date: Date): string {
  const hijriMonths = [
    "محرم",
    "صفر",
    "ربيع الأول",
    "ربيع الثاني",
    "جمادي الأول",
    "جمادي الثاني",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذو القعدة",
    "ذو الحجة",
  ];
  const hijriYear = date.getFullYear() - 622;
  const hijriMonth = hijriMonths[date.getMonth() % 12];
  return `${hijriMonth} ${hijriYear}هـ`;
}

// Load zakat history from localStorage
function loadZakatHistory(): ZakatHistoryItem[] {
  try {
    const saved = localStorage.getItem("zakat_calculator_history");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save zakat history to localStorage
function saveZakatHistory(history: ZakatHistoryItem[]): void {
  try {
    localStorage.setItem("zakat_calculator_history", JSON.stringify(history.slice(0, 20)));
  } catch {
    // Silently fail
  }
}

// Nisab values (updated to current market standards)
const NISAB_VALUES: Record<ZakatType, number> = {
  money: 12967, // 85g gold equivalent in YER - النصاب النقدي (٨٥ غرام ذهب equivalence)
  gold: 85, // grams - نصاب الذهب (٨٥ غرام)
  silver: 595, // grams (612.36g is the precise value, 595 is a conservative threshold) - نصاب الفضة (٥٩٥ غرام)
  fitrah: 2.5, // kg per person - نصاب الفطر (٢.٥ كيلو per person)
};

// Nisab explanations for tooltips
const NISAB_EXPLANATIONS: Record<ZakatType, string> = {
  money:
    "المبلغ النصاب هو قيمة ٨٥ غرام من الذهب الخام، مقداره ١٢٩٦٧ ريال يمني تقريباً بناءً على أسعار السوق الحالية",
  gold: "النصاب الشرعي للذهب هو ٨٥ غرام، وهي النسبة التي يجب بلوغها قبل أن تفرض الزكاة",
  silver:
    "النصاب للفضة هو ٥٩٥ غرام (القيمة الدقيقة ٦١٢.٣٦ غرام، و٥٩٥ غرام قيمة وازنة Conservative)",
  fitrah: "نصاب الفطر هو ٢.٥ كيلو من الطعام الأساسي لكل أسرة، ويجب إخراجها عن كل فرد في العائلة",
};

export function ZakatCalculator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ZakatTab>("money");

  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<ZakatResult | null>(null);
  const [zakatReminderDate, setZakatReminderDate] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ZakatHistoryItem[]>([]);
  const [reminderEmail, setReminderEmail] = useState<string>("");
  const [reminderSaved, setReminderSaved] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  // Set zakat reminder date on mount
  useEffect(() => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setZakatReminderDate(getHijriDateReminder(nextYear));
  }, []);

  // Load history on mount
  useEffect(() => {
    setHistory(loadZakatHistory());
  }, []);

  const calculateZakat = useCallback(() => {
    if (activeTab === "compare") return;
    const input = parseFloat(amount) || 0;

    const zakatRate = 0.025;
    const nisab = NISAB_VALUES[activeTab];
    let description = "";

    switch (activeTab) {
      case "money":
        description = "المال (النقد والبنوك)";
        break;
      case "gold":
        description = "الذهب";
        break;
      case "silver":
        description = "الفضة";
        break;
      case "fitrah":
        description = "الفطر";
        break;
    }

    const zakat = input >= nisab ? input * zakatRate : 0;

    const newResult: ZakatResult = {
      type: activeTab,
      amount: input,
      zakat,
      nisab,
      description,
      zakatRate,
      isAboveNisab: input >= nisab,
    };

    setResult(newResult);

    // Save to history
    if (input > 0) {
      const historyItem: ZakatHistoryItem = {
        id: `zakat_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        date: new Date().toISOString(),
        type: activeTab,
        amount: input,
        zakat,
      };
      const updatedHistory = [historyItem, ...loadZakatHistory()];
      saveZakatHistory(updatedHistory);
      setHistory(updatedHistory);
    }
  }, [amount, activeTab]);

  const shareResult = () => {
    if (!result) return;
    const text = `حساب زكاة ${result.description}: ${result.amount} - الزكاة ${result.zakat.toFixed(2)}`;
    if (navigator.share) {
      navigator.share({ text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  // Handle payment for zakat - uses React Router navigation (SPA-friendly)
  const handlePayZakat = () => {
    if (!result || result.zakat === 0) return;
    navigate("/donate", { state: { zakatAmount: result.zakat, zakatType: result.type } });
  };

  // Toggle zakat reminder modal
  const toggleZakatReminder = () => {
    setShowReminder(!showReminder);
  };

  // Save reminder email
  const handleReminderSave = () => {
    if (reminderEmail) {
      setReminderSaved(true);
      setTimeout(() => setReminderSaved(false), 3000);
      setShowReminder(false);
    }
  };

  // Copy result to clipboard
  const copyResult = () => {
    if (!result) return;
    const text = `زكاة ${result.description}: ${result.zakat.toFixed(2)} من أصل ${result.amount}`;
    navigator.clipboard.writeText(text);
  };

  // Download result as text
  const downloadResult = () => {
    if (!result) return;
    const content = `حسابة زكاة - رحماء بينهم
النوع: ${result.description}
المبلغ: ${result.amount}
الزكاة المستحقة: ${result.zakat.toFixed(2)}
النصاب: ${result.nisab}
النسبة: ${result.zakatRate * 100}%
التاريخ: ${new Date().toLocaleDateString("ar-SA")}
ملاحظة: هذه حاسبة إرشادية. يرجى استشارة الفقيه المختص للتأكد من الضوابط الشرعية.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zakat-calculation-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabConfig = [
    { id: "money", label: "المال", icon: Coins },
    { id: "gold", label: "الذهب", icon: Gem },
    { id: "silver", label: "الفضة", icon: Landmark },
    { id: "fitrah", label: "الفطر", icon: Calendar },
  ] as const;

  const comparisonConfig = [
    {
      id: "money",
      label: "مال",
      activeTab: "money",
      color: "var(--brand-green)",
      icon: <Coins className="w-6 h-6 text-white" />,
    },
    {
      id: "gold",
      label: "ذهب",
      activeTab: "gold",
      color: "var(--brand-gold)",
      icon: <Gem className="w-6 h-6 text-white" />,
    },
    {
      id: "silver",
      label: "فضة",
      activeTab: "silver",
      color: "#94A3B8",
      icon: <Landmark className="w-6 h-6 text-white" />,
    },
    {
      id: "fitrah",
      label: "فطر",
      activeTab: "fitrah",
      color: "var(--brand-green)",
      icon: <Calendar className="w-6 h-6 text-white" />,
    },
  ] as const;

  return (
    <div className="card card--lg max-w-md mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box--gold w-12 h-12">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">حاسبة الزكاة الذكية</h3>
            <p className="text-sm text-[var(--muted-foreground)]">احسب زكاة مالك بضبط ودقة</p>
          </div>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--border)] transition-colors"
          title="السجل"
        >
          <History className="w-5 h-5 text-[var(--muted-foreground)]" />
        </button>
      </div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="card max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-[var(--foreground)]">سجل العمليات</h4>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 rounded-full hover:bg-[var(--muted)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--muted-foreground)]" />
                </button>
              </div>
              {history.length === 0 ? (
                <p className="text-center text-[var(--muted-foreground)] py-8">
                  لا توجد عمليات سابقة
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="p-3 border border-[var(--border)] rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-[var(--foreground)]">
                          {item.type === "money"
                            ? "زكاة مال"
                            : item.type === "gold"
                              ? "زكاة ذهب"
                              : item.type === "silver"
                                ? "زكاة فضة"
                                : "زكاة فطر"}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {new Date(item.date).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                      <div className="text-sm text-[var(--muted-foreground)]">
                        المبلغ: {item.amount} | الزكاة: {item.zakat.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setAmount("");
              setResult(null);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[var(--brand-gold-pale)] text-[var(--brand-gold)]"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setActiveTab("compare")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "compare"
              ? "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
              : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
          }`}
          title="مقارنة النِصاب"
        >
          مقارنة
        </button>
      </div>

      {/* Comparison Mode */}
      {activeTab === "compare" && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {comparisonConfig.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center"
            >
              <div
                className="w-14 h-14 rounded-full mx-auto mb-4"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-[var(--foreground)] mb-2">{item.label}</h4>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">النصاب:</p>
              <div className="text-3xl font-extrabold text-[var(--brand-gold)]">
                {NISAB_VALUES[item.activeTab]}{" "}
                {item.activeTab === "money"
                  ? "ريال"
                  : item.activeTab === "gold"
                    ? "غرام"
                    : item.activeTab === "silver"
                      ? "غرام"
                      : "كغ"}
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                {NISAB_EXPLANATIONS[item.activeTab]}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mb-4">
        <label className="form-label">
          {activeTab === "money" && "المبلغ (بالريال اليمني)"}
          {activeTab === "gold" && "وزن الذهب (بالغرام)"}
          {activeTab === "silver" && "وزن الفضة (بالغرام)"}
          {activeTab === "fitrah" && "عدد الأسر (كل أسرة 2.5 كغ)"}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="أدخل المبلغ"
          className="form-input"
          dir="rtl"
        />
      </div>

      {/* Calculate Button */}
      <button onClick={calculateZakat} className="btn-primary w-full justify-center">
        <RefreshCw className="w-4 h-4" />
        احسب الزكاة
      </button>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[var(--brand-gold-pale)] rounded-lg border border-[var(--brand-gold)]/20"
        >
          <div className="text-center mb-3">
            <p className="text-sm text-[var(--muted-foreground)]">النتيجة</p>
            <p className="text-2xl font-bold text-[var(--brand-gold)]">
              {result.zakat.toFixed(2)}{" "}
              {activeTab === "money" ? "ريال" : activeTab === "fitrah" ? "كغ" : "غرام"}
            </p>
          </div>
          <div className="text-xs text-[var(--muted-foreground)] space-y-1">
            <p>
              المبلغ: {result.amount}{" "}
              {activeTab === "money" ? "ريال" : activeTab === "fitrah" ? "كغ" : "غرام"}
            </p>
            <p>
              حد الزكاة (النصاب): {result.nisab}{" "}
              {activeTab === "money" ? "ريال" : activeTab === "fitrah" ? "كغ" : "غرام"}
            </p>
            <p>النسبة: 2.5%</p>
            {!result.isAboveNisab && (
              <p className="text-[var(--destructive)] font-medium">
                المبلغ أقل من النصاب - لا زكاة مفروضة
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={shareResult}
              className="flex items-center justify-center gap-2 text-sm text-[var(--brand-gold)] hover:text-[var(--brand-gold-light)] py-2 border border-[var(--brand-gold)]/30 rounded-lg hover:bg-[var(--brand-gold-pale)] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              مشاركة
            </button>
            <button
              onClick={copyResult}
              className="flex items-center justify-center gap-2 text-sm text-[var(--brand-gold)] hover:text-[var(--brand-gold-light)] py-2 border border-[var(--brand-gold)]/30 rounded-lg hover:bg-[var(--brand-gold-pale)] transition-colors"
            >
              <Copy className="w-4 h-4" />
              نسخ
            </button>
            <button
              onClick={downloadResult}
              className="flex items-center justify-center gap-2 text-sm text-[var(--brand-gold)] hover:text-[var(--brand-gold-light)] py-2 border border-[var(--brand-gold)]/30 rounded-lg hover:bg-[var(--brand-gold-pale)] transition-colors"
            >
              <Download className="w-4 h-4" />
              تحميل
            </button>
            <button
              onClick={toggleZakatReminder}
              className="flex items-center justify-center gap-2 text-sm text-[var(--brand-gold)] hover:text-[var(--brand-gold-light)] py-2 border border-[var(--brand-gold)]/30 rounded-lg hover:bg-[var(--brand-gold-pale)] transition-colors"
            >
              <Calendar className="w-4 h-4" />
              تذكير
            </button>
          </div>

          {/* Donate Button - Pay Zakat Now */}
          {result.zakat > 0 && (
            <button onClick={handlePayZakat} className="mt-3 w-full btn-gold justify-center">
              <Wallet className="w-4 h-4" />
              أخرج زكاتك الآن
            </button>
          )}

          {/* Payment Methods */}
          <div className="mt-3 pt-3 border-t border-[var(--brand-gold)]/20">
            <p className="text-xs text-[var(--muted-foreground)] mb-2">وسائل الدفع المتاحة:</p>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-8 h-8 rounded bg-[var(--muted)] flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[var(--muted-foreground)]" />
              </div>
              <div className="w-8 h-8 rounded bg-[var(--muted)] flex items-center justify-center">
                <Banknote className="w-4 h-4 text-[var(--muted-foreground)]" />
              </div>
              <div className="w-8 h-8 rounded bg-[var(--muted)] flex items-center justify-center">
                <Wallet className="w-4 h-4 text-[var(--muted-foreground)]" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reminder Modal */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReminder(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-box icon-box--gold w-10 h-10">
                  <Calendar className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-[var(--foreground)]">تذكير بموعد الزكاة</h4>
              </div>
              <p className="text-[var(--muted-foreground)] mb-4">
                أدخل بريدك الإلكتروني وسنرسل لك تذكيرًا في موعد الزكاة المناسب.
              </p>
              <p className="text-sm text-[var(--brand-gold)] mb-4">
                التاريخ المقترح: {zakatReminderDate}
              </p>
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                  <input
                    type="email"
                    value={reminderEmail}
                    onChange={(e) => setReminderEmail(e.target.value)}
                    placeholder="بريدك الإلكتروني"
                    className="form-input pr-12"
                    dir="ltr"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReminderSave}
                    disabled={!reminderEmail || reminderSaved}
                    className="flex-1 btn-gold justify-center disabled:opacity-50"
                  >
                    {reminderSaved ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        تم الحفظ
                      </>
                    ) : (
                      "حفظ التذكير"
                    )}
                  </button>
                  <button
                    onClick={() => setShowReminder(false)}
                    className="flex-1 btn-secondary justify-center"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
