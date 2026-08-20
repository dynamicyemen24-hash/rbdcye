// Smart Zakat Calculator - Professional Embedded Component
import { Calculator, DollarSign, Gem, Calendar, X, Info, TrendingUp, Shield, Clock, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

type ZakatType = "money" | "gold" | "silver" | "livestock" | "trade" | "fitr";

interface ZakatCalculatorMiniProps {
  readonly onDonateClick?: (amount: number) => void;
  readonly onHide?: () => void;
  readonly embedded?: boolean;
}

interface ZakatResult {
  amount: number;
  nisab: number;
  rate: number;
  description: string;
  breakdown: string[];
}

// Zakat rules database
const ZAKAT_RULES: Record<ZakatType, { nisab: number; rate: number; unit: string }> = {
  money: { nisab: 2550, rate: 0.025, unit: "ر.ي" },
  gold: { nisab: 85, rate: 0.025, unit: "جرام" },
  silver: { nisab: 520, rate: 0.025, unit: "جرام" },
  livestock: { nisab: 30, rate: 0.005, unit: "رأس" },
  trade: { nisab: 2550, rate: 0.025, unit: "ر.ي" },
  fitr: { nisab: 2.5, rate: 1, unit: "ر.ي للفرد" },
};

const ZAKAT_DESCRIPTIONS: Record<ZakatType, string> = {
  money: "زكاة المال في التجارة والقروض والأسهم والعملات",
  gold: "زكاة الذهب ذات العيار العالي (24 قيراط)",
  silver: "زكاة الفضة ذات العيار العالي",
  livestock: "زكاة الماشية (أبقار، ماعز، طيور)",
  trade: "زكاة المال في التجارة والمخازن",
  fitr: "زكاة الفطر - واجبة على كل فرد من المسلمين",
};

export function ZakatCalculatorMini({ onDonateClick, onHide, embedded = false }: ZakatCalculatorMiniProps) {
  const [activeTab, setActiveTab] = useState<ZakatType>("money");
  const [inputValue, setInputValue] = useState(0);
  const [result, setResult] = useState<ZakatResult | null>(null);

  const calculateZakat = (type: ZakatType, value: number): ZakatResult => {
    const rule = ZAKAT_RULES[type];
    const breakdown: string[] = [];
    let zakatAmount = 0;

    if (type === "fitr") {
      zakatAmount = value * rule.nisab;
      breakdown.push(`عدد الأشخاص: ${value}`);
      breakdown.push(`القيمة للفرد: ${rule.nisab} ${rule.unit}`);
    } else if (type === "livestock") {
      const animals = Math.floor(value / 30);
      zakatAmount = animals * 30 * rule.rate;
    } else {
      if (value >= rule.nisab) {
        zakatAmount = value * rule.rate;
        breakdown.push(`المال المملوك: ${value.toLocaleString()} ${rule.unit}`);
        breakdown.push(`نصاب الزكاة: ${rule.nisab.toLocaleString()} ${rule.unit}`);
        breakdown.push(`نسبة الزكاة: ${(rule.rate * 100).toFixed(1)}%`);
      }
    }

    return {
      amount: zakatAmount,
      nisab: rule.nisab,
      rate: rule.rate,
      description: ZAKAT_DESCRIPTIONS[type],
      breakdown,
    };
  };

  const handleCalculate = () => {
    const calcResult = calculateZakat(activeTab, inputValue);
    setResult(calcResult);
  };

  const handleQuickPay = () => {
    if (result?.amount && result.amount > 0 && onDonateClick) {
      onDonateClick(result.amount);
    }
  };

  const handleReset = () => {
    setResult(null);
    setInputValue(0);
  };

  const handleClose = () => {
    setResult(null);
    setInputValue(0);
    onHide?.();
  };

  const TAB_CONFIG = [
    { id: "money", label: "زكاة المال", icon: DollarSign, description: "النقد، السندات، الشركات" },
    { id: "gold", label: "زكاة الذهب", icon: Gem, description: "الذهب التاجر والمُلك" },
    { id: "silver", label: "زكاة الفضة", icon: Gem, description: "الفضة والأشياء" },
    { id: "livestock", label: "زكاة الماشية", icon: Calendar, description: "الأبقار، الحيوانات" },
    { id: "trade", label: "زكاة التجارة", icon: TrendingUp, description: "البضاعة، المخازن" },
    { id: "fitr", label: "زكاة الفطر", icon: Calendar, description: "رمضان، قبل الفطر" },
  ];

  const content = (
    <div className="max-w-4xl mx-auto" dir="rtl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)] mb-6 shadow-lg">
          <Calculator className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-gold)] bg-clip-text text-transparent">
          حاسبة الزكاة الذكية
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          احسب زكاتك بدقة حسب الشريعة الإسلامية، مع شرح مفصل للمبلغ والنصاب والنسبة
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-6">
        {result && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)] rounded-lg transition-colors"
          >
            حساب جديد
          </button>
        )}
        {!embedded && onHide && (
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="card p-8 md:p-10">
        {/* Zakat Type Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8" role="tablist">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ZakatType)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                activeTab === tab.id
                  ? "border-[var(--brand-green)] bg-gradient-to-br from-[var(--brand-green-pale)] to-[var(--brand-gold-pale)]"
                  : "border-gray-200 hover:border-[var(--brand-green)]"
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <tab.icon className="w-6 h-6 text-[var(--brand-green)]" />
              <span className="text-sm font-bold">{tab.label}</span>
              <span className="text-xs text-gray-500">{tab.description}</span>
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-[var(--brand-green)]" />
            <span className="text-lg font-semibold">
              {activeTab === "fitr" ? "عدد أفراد الأسرة" : `المال المملوك (${ZAKAT_RULES[activeTab].unit})`}
            </span>
          </div>
          <input
            type="number"
            value={inputValue || ""}
            onChange={(e) => setInputValue(Number(e.target.value))}
            className="w-full p-5 border-2 border-gray-200 rounded-xl text-xl focus:border-[var(--brand-green)] bg-white"
            placeholder={activeTab === "fitr" ? "أدخل عدد الأشخاص" : "أدخل المبلغ"}
            min="0"
          />
          <div className="mt-3 p-4 bg-gradient-to-r from-[var(--brand-green)]/5 to-[var(--brand-gold)]/5 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>نصاب الزكاة:</strong> {ZAKAT_RULES[activeTab].nisab.toLocaleString()}{" "}
              {activeTab === "fitr" ? "" : ZAKAT_RULES[activeTab].unit}
            </p>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full btn-primary py-4 rounded-xl font-bold text-lg mb-8 flex items-center justify-center gap-2"
        >
          <Calculator className="w-6 h-6" />
          احسب الزكاة الآن
        </button>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="border-2 border-[var(--brand-green)] rounded-xl p-6 bg-gradient-to-r from-[var(--brand-green)]/5 to-[var(--brand-gold)]/5"
            >
              <div className="text-center mb-6">
                {result.amount > 0 ? (
                  <>
                    <p className="text-lg text-gray-600 mb-2">الزكاة المستحقة</p>
                    <p className="text-5xl font-bold text-[var(--brand-green)]">
                      {result.amount.toLocaleString()} <span className="text-2xl">ر.ي</span>
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Shield className="w-4 h-4 text-[var(--brand-gold)]" />
                      <span className="text-sm text-gray-500">حسب الشريعة الإسلامية</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-[var(--brand-gold)]" />
                    <p className="text-lg text-gray-600 mb-2">لم يبلغ المبلغ النصاب بعد</p>
                    <p className="text-sm">
                      النصاب الحالي: {result.nisab.toLocaleString()}{" "}
                      {activeTab !== "fitr" && ZAKAT_RULES[activeTab].unit}
                    </p>
                  </div>
                )}
              </div>

              {/* Breakdown */}
              {result.amount > 0 && result.breakdown && (
                <div className="bg-white rounded-lg p-4 mb-6">
                  <h4 className="font-semibold mb-2 text-[var(--brand-green)]">تفصيل الحساب:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {result.breakdown.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--brand-green)] rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pay Button */}
              {result.amount > 0 && (
                <button
                  onClick={handleQuickPay}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[var(--brand-gold)] text-white rounded-xl font-bold text-lg hover:bg-[var(--brand-gold-light)] transition-colors"
                >
                  أدفع زكاتي الآن
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <div className="bg-white rounded-3xl max-h-[90vh] overflow-y-auto w-full max-w-4xl relative">
        <div className="p-8">{content}</div>
      </div>
    </div>
  );
}