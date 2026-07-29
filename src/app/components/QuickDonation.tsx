// Quick Donation Component - Interactive Impact Calculator with Inline Payment
import { motion } from "framer-motion";
import { Heart, Package, CreditCard, Smartphone, Banknote, Users, Droplets, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";

import { paymentGateway, BANK_ACCOUNTS } from "@/shared/services/payment-gateway.service";
import { useSEO } from "@/utils/seoAdvanced";

interface QuickDonationProps {
  readonly onClose?: () => void;
  readonly embedded?: boolean;
}

interface ImpactResult {
  beneficiaries: number;
  meals: number;
  waterDays: number;
  educationDays: number;
  orphansSupported: number;
}

// Project impact multipliers
const IMPACT_MULTIPLIERS: Record<string, (amount: number) => ImpactResult> = {
  general: (amount) => ({
    beneficiaries: Math.floor(amount / 15),
    meals: Math.floor(amount / 2),
    waterDays: 0,
    educationDays: 0,
    orphansSupported: 0,
  }),
  food: (amount) => ({
    beneficiaries: Math.floor(amount / 10),
    meals: Math.floor(amount / 1.5),
    waterDays: 0,
    educationDays: 0,
    orphansSupported: 0,
  }),
  water: (amount) => ({
    beneficiaries: 0,
    meals: 0,
    waterDays: Math.floor(amount / 25),
    educationDays: 0,
    orphansSupported: 0,
  }),
  education: (amount) => ({
    beneficiaries: 0,
    meals: 0,
    waterDays: 0,
    educationDays: Math.floor(amount / 30),
    orphansSupported: 0,
  }),
  orphans: (amount) => ({
    beneficiaries: 0,
    meals: 0,
    waterDays: 0,
    educationDays: 0,
    orphansSupported: Math.floor(amount / 100),
  }),
  zakat: (amount) => ({
    beneficiaries: Math.floor(amount / 5),
    meals: Math.floor(amount / 2),
    waterDays: 0,
    educationDays: 0,
    orphansSupported: 0,
  }),
};

const PROJECTS = [
  { id: "general", label: "الصندوق العام", icon: Heart, description: "مساهمة عامة في جميع برامج المؤسسة" },
  { id: "food", label: "السلال الغذائية", icon: Package, description: "توفير سلال غذائية للأسر المحتاجة" },
  { id: "water", label: "مشروع الآبار", icon: Droplets, description: "حفر آبار وتوفير مياه شرب نظيفة" },
  { id: "education", label: "التعليم والقرآن", icon: GraduationCap, description: "دعم التعليم وتحفيز القرآن" },
  { id: "orphans", label: "كفالة الأيتام", icon: Users, description: "رعاية يتيم في التعليم والصحة" },
  { id: "zakat", label: "زكاة المال", icon: Banknote, description: "صرف الزكاة في مصارفها الشرعية" },
];

const PAYMENT_METHODS = [
  { id: "stripe", label: "بطاقة ائتمان", icon: CreditCard },
  { id: "bank", label: "تحويل بنكي", icon: Banknote },
  { id: "cash", label: "نقدي", icon: Banknote },
];

export function QuickDonation({ onClose, embedded = false }: QuickDonationProps) {
  const [amount, setAmount] = useState(50);
  const [selectedProject, setSelectedProject] = useState("general");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [impact, setImpact] = useState<ImpactResult>({
    beneficiaries: 0,
    meals: 0,
    waterDays: 0,
    educationDays: 0,
    orphansSupported: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentResult, setShowPaymentResult] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string; transactionId?: string } | null>(null);

  useSEO({
    title: "تبرع سريع - رحماء بينهم",
    description: "تبرع بسهولة وأثر مباشر في مشاريع المؤسسة",
  });

  useEffect(() => {
    const multiplier = IMPACT_MULTIPLIERS[selectedProject] || IMPACT_MULTIPLIERS.general;
    setImpact(multiplier(amount));
  }, [amount, selectedProject]);

  const handleDonate = async () => {
    setIsProcessing(true);
    setPaymentResult(null);

    try {
      // استخدام payment gateway الحقيقي
      const result = await paymentGateway.initiatePayment({
        amount: amount,
        currency: 'USD',
        method: paymentMethod as any,
        type: selectedProject === 'zakat' ? 'zakat' : 'once',
        projectId: selectedProject,
        donorName: donorName || 'متبرع كريم',
        donorEmail: donorEmail,
        donorPhone: donorPhone,
        description: `تبرع لمشروع ${PROJECTS.find(p => p.id === selectedProject)?.label || 'عام'}`,
      });

      if (result.status === 'completed' || result.status === 'processing') {
        setPaymentResult({
          success: true,
          message: 'تم إنشاء طلب التبرع بنجاح!',
          transactionId: result.transactionId,
        });
        setShowPaymentResult(true);
      } else if (result.status === 'pending') {
        // عرض تفاصيل التحويل البنكي أو النقدي
        const bankAccounts = BANK_ACCOUNTS || [];
        const bankInfo = bankAccounts.length > 0 
          ? `إلى حساب ${bankAccounts[0].accountName} - ${bankAccounts[0].iban}`
          : 'وسيقوم فريقنا بالتواصل معك';
        setPaymentResult({
          success: true,
          message: `يرجى إجراء التحويل البنكي ${bankInfo}`,
          transactionId: result.transactionId,
        });
        setShowPaymentResult(true);
      } else {
        setPaymentResult({
          success: false,
          message: result.confirmationCode || 'فشل في إنشاء طلب التبرع',
        });
        setShowPaymentResult(true);
      }
    } catch (error) {
      setPaymentResult({
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة الدفع',
      });
      setShowPaymentResult(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const presetAmounts = [10, 25, 50, 100, 250, 500, 1000];

  const content = (
    <div className="max-w-2xl mx-auto" dir="rtl">
      {/* Payment Success/Error Message */}
      {showPaymentResult && paymentResult && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-6 rounded-xl text-center ${
            paymentResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="text-lg font-semibold mb-2">
            {paymentResult.success ? '✅ نجح التبرع!' : '❌ فشل التبرع'}
          </div>
          <p className="text-gray-600 mb-3">{paymentResult.message}</p>
          {paymentResult.transactionId && (
            <p className="text-sm text-gray-500">رقم المعاملة: {paymentResult.transactionId}</p>
          )}
          <button
            onClick={() => setShowPaymentResult(false)}
            className="mt-4 px-6 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
          >
            تبرع جديد
          </button>
        </motion.div>
      )}

      <div className="text-center mb-8">
        <Heart className="w-16 h-16 mx-auto mb-4 text-[var(--brand-green)]" />
        <h2 className="text-3xl font-bold mb-2">تبرع سريع وأثر مباشر</h2>
        <p className="text-gray-600">اختر المشروع وحساب أثر تبرعك قبل الدفع</p>
      </div>

      <div className="card p-8">
        {/* Donor Information */}
        <div className="mb-6">
          <span className="block text-lg font-semibold mb-3">المعلومات الشخصية</span>
          <div className="space-y-4">
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="اسم المتبرع (اختياري)"
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-lg focus:border-[var(--brand-green)]"
              dir="rtl"
            />
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="البريد الإلكتروني (لإرسال الإيصال)"
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-lg focus:border-[var(--brand-green)]"
              dir="ltr"
            />
            <input
              type="tel"
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
              placeholder="رقم الهاتف (اختياري)"
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-lg focus:border-[var(--brand-green)]"
              dir="ltr"
            />
          </div>
        </div>

        {/* Project Selection */}
        <div className="mb-6" role="group" aria-label="اختر المشروع">
          <span className="block text-lg font-semibold mb-3">اختر المشروع</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PROJECTS.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedProject === project.id
                    ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)]"
                    : "border-gray-200 hover:border-[var(--brand-green)]"
                }`}
                role="radio"
                aria-checked={selectedProject === project.id}
              >
                <project.icon className="w-8 h-8 text-[var(--brand-green)]" />
                <span className="text-sm font-medium">{project.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Selection */}
        <div className="mb-6" role="group" aria-label="قيمة التبرع">
          <span className="block text-lg font-semibold mb-3">قيمة التبرع (ر.ع)</span>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`p-3 rounded-lg border transition-all ${
                  amount === preset
                    ? "border-[var(--brand-green)] bg-[var(--brand-green)] text-white"
                    : "border-gray-200 hover:border-[var(--brand-green)]"
                }`}
                role="radio"
                aria-checked={amount === preset}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-4 border-2 border-gray-200 rounded-lg text-lg focus:border-[var(--brand-green)]"
            placeholder="أو أدخل مبلغ آخر"
            min="1"
            max="10000"
            dir="ltr"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-8" role="group" aria-label="طريقة الدفع">
          <span className="block text-lg font-semibold mb-3">طريقة الدفع</span>
          <div className="flex gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === method.id
                    ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)]"
                    : "border-gray-200"
                }`}
              >
                <method.icon className="w-5 h-5" />
                <span className="text-sm">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Impact Calculator */}
        <div className="bg-gradient-to-r from-[var(--brand-green)]/5 to-[var(--brand-gold)]/5 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold mb-4 text-center">أثر تبرعك</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {impact.beneficiaries > 0 && (
              <div className="text-center">
                <Users className="w-10 h-10 mx-auto mb-2 text-[var(--brand-green)]" />
                <div className="text-2xl font-bold">{impact.beneficiaries}</div>
                <div className="text-sm text-gray-600">مستفيد</div>
              </div>
            )}
            {impact.meals > 0 && (
              <div className="text-center">
                <Package className="w-10 h-10 mx-auto mb-2 text-[var(--brand-green)]" />
                <div className="text-2xl font-bold">{impact.meals}</div>
                <div className="text-sm text-gray-600">وجبة غذائية</div>
              </div>
            )}
            {impact.waterDays > 0 && (
              <div className="text-center">
                <Droplets className="w-10 h-10 mx-auto mb-2 text-[var(--brand-green)]" />
                <div className="text-2xl font-bold">{impact.waterDays}</div>
                <div className="text-sm text-gray-600">يوم مياه نظيفة</div>
              </div>
            )}
            {impact.educationDays > 0 && (
              <div className="text-center">
                <GraduationCap className="w-10 h-10 mx-auto mb-2 text-[var(--brand-green)]" />
                <div className="text-2xl font-bold">{impact.educationDays}</div>
                <div className="text-sm text-gray-600">يوم تعليم</div>
              </div>
            )}
            {impact.orphansSupported > 0 && (
              <div className="text-center">
                <Users className="w-10 h-10 mx-auto mb-2 text-[var(--brand-green)]" />
                <div className="text-2xl font-bold">{impact.orphansSupported}</div>
                <div className="text-sm text-gray-600">يتيم مكفول</div>
              </div>
            )}
          </div>
        </div>

        {/* Donate Button */}
        <motion.button
          onClick={handleDonate}
          disabled={isProcessing}
          className="w-full btn-primary py-4 rounded-lg text-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري المعالجة...
            </>
          ) : (
            <>
              <Heart className="w-6 h-6" fill="white" />
              تبرع الآن - {amount} ر.ع
            </>
          )}
        </motion.button>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-h-[90vh] overflow-y-auto relative w-full max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100"
        >
          ✕
        </button>
        <div className="p-6">{content}</div>
      </div>
    </div>
  );
}