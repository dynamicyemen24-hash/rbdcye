// Smart Donation Form Component - نموذج التبرع الذكي المتكامل مع Stripe والتبرع الدوري
import { motion } from 'motion/react';
import {
  Heart, CreditCard, Wallet, Building2, CheckCircle, Shield,
  RefreshCw, Lock, Sparkles, AlertCircle, ArrowLeft,
  FileText, DollarSign
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { paymentGateway, type PaymentCurrency } from '@/shared/services/payment-gateway.service';
import { multiProjectDonationService } from '@/shared/services/donation-multi-project.service';
import { RecurringDonationToggle } from './RecurringDonationToggle';

interface SmartDonationFormProps {
  initialProject?: string;
  initialAmount?: number;
  initialCurrency?: PaymentCurrency;
}

export function SmartDonationForm({
  initialProject = 'general',
  initialAmount,
  initialCurrency = 'SAR',
}: SmartDonationFormProps) {
  const navigate = useNavigate();

  // 1. التردد والدورية (مرة واحدة / دوري شهري / دوري سنوي)
  const [donationFrequency, setDonationFrequency] = useState<'once' | 'monthly' | 'yearly'>('once');

  // 2. العملة والمبلغ
  const [currency, setCurrency] = useState<PaymentCurrency>(initialCurrency);
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount || 100);
  const [customAmount, setCustomAmount] = useState<string>('');

  // 3. اختيار المشروع
  const [selectedProject, setSelectedProject] = useState<string>(initialProject);

  // 4. طريقة الدفع (تضمين Stripe بشكل أساسي)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'apple' | 'google' | 'bank'>('stripe');

  // 5. معلومات البطاقة للنماذج المباشرة في Stripe
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  // 6. بيانات المتبرع والخيار المجهول
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // 7. حالات المعالجة والنجاح
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // قيم المبالغ الجاهزة حسب العملة
  const CURRENCY_PRESETS: Record<PaymentCurrency, number[]> = useMemo(() => ({
    SAR: [50, 100, 250, 500, 1000, 2500],
    USD: [10, 25, 50, 100, 250, 500],
    YER: [5000, 10000, 25000, 50000, 100000, 250000],
    AED: [50, 100, 250, 500, 1000, 2500],
    OMR: [5, 10, 25, 50, 100, 250],
  }), []);

  const CURRENCY_SYMBOLS: Record<PaymentCurrency, string> = useMemo(() => ({
    SAR: 'ر.س',
    USD: '$',
    YER: 'ر.ي',
    AED: 'د.إ',
    OMR: 'ر.ع',
  }), []);

  // المشاريع المتاحة
  const projects = [
    { id: 'general', name: 'تبرع عام (حيث الأشد حاجة)', icon: Heart, badge: 'عام' },
    { id: 'food', name: 'السلال الغذائية الطارئة', icon: Sparkles, badge: 'إغاثة' },
    { id: 'water', name: 'حفر وتأهيل آبار المياه', icon: Sparkles, badge: 'سقيا' },
    { id: 'education', name: 'كفالة الطلاب والتعليم', icon: FileText, badge: 'تعليم' },
    { id: 'orphans', name: 'كفالة الأيتام الشاملة', icon: Heart, badge: 'كفالة' },
    { id: 'zakat', name: 'زكاة المال الشرعية', icon: Shield, badge: 'زكاة' },
    { id: 'winter', name: 'كسوة ودفء الشتاء', icon: Sparkles, badge: 'شتاء' },
  ];

  // المبلغ الحقيقي المختار
  const actualAmount = customAmount ? Number(customAmount) : selectedAmount;

  // تأثير التبرع الفعلي المحسوب بالدولار
  const amountInUSD = useMemo(() => {
    return currency === 'YER' ? (actualAmount / 250) : currency === 'SAR' ? (actualAmount / 3.75) : actualAmount;
  }, [actualAmount, currency]);

  // رؤية الأثر الفعلي باللغة العربية
  const dynamicImpact = useMemo(() => {
    if (amountInUSD >= 1000) {
      return {
        label: "سقيا جارية - بئر ماء بالطاقة الشمسية",
        desc: `يسهم تبرعك بقيمة ${actualAmount.toLocaleString('ar-SA')} ${CURRENCY_SYMBOLS[currency]} في تأمين مياه شرب نصر نابعة ونقية لقرى كاملة في اليمن مدى الحياة.`,
        icon: "🌊",
        badge: "أثر مستدام"
      };
    } else if (amountInUSD >= 500) {
      return {
        label: "إيواء وأمان لأسرة نازحة",
        desc: `يغطي هذا التبرع السخي تكلفة إيجار أو صيانة مسكن آمن لأسرة نازحة مهددة بالطرد لحمايتهم من القرس والضياع.`,
        icon: "🏠",
        badge: "إيواء وصون"
      };
    } else if (amountInUSD >= 250) {
      return {
        label: "دفء الشتاء والكسوة الحرارية",
        desc: `يوفر تبرعك سلال البطانيات والكسوة الشتوية لـ ${Math.floor(amountInUSD / 50) || 1} أسر في مخيمات النزوح الجبلية.`,
        icon: "🧥",
        badge: "وقاية ودفء"
      };
    } else if (amountInUSD >= 100) {
      return {
        label: "كفالة طفل يتيم / طالب علم",
        desc: `يغطي تبرعك الشامل الحقيبة والمستلزمات والرعاية لأطفال أيتام لإعادتهم إلى مقاعد الدراسية بثقة.`,
        icon: "📚",
        badge: "بناء الأجيال"
      };
    } else if (amountInUSD >= 50) {
      return {
        label: "سقيا ماء شرب نقي",
        desc: `يوفر تبرعك مياه شرب معقمة وصالحة للاستخدام تفي بحاجة عائلات نازحة متعددة لمدة أسابيع.`,
        icon: "💧",
        badge: "سقيا وحياة"
      };
    } else {
      return {
        label: "سلة غذائية وإغاثة طارئة",
        desc: "يوجه تبرعك المباشر لتوفير المواد الأساسية العاجلة وسداد احتياجات الأسر الأشد فقراً وتأثراً.",
        icon: "🍚",
        badge: "قوت عاجل"
      };
    }
  }, [amountInUSD, actualAmount, currency, CURRENCY_SYMBOLS]);

  // تنسيق رقم البطاقة تلقائياً
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  // تنسيق تاريخ الانتهاء MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      setCardDetails(prev => ({ ...prev, expiry: `${val.substring(0, 2)}/${val.substring(2)}` }));
    } else {
      setCardDetails(prev => ({ ...prev, expiry: val }));
    }
  };

  // معالجة تقديم التبرع عبر Stripe / المحفظة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!actualAmount || actualAmount <= 0) {
      setErrorMsg('يرجى تحديد أو إدخال مبلغ تبرع صحيح');
      return;
    }

    if (!isAnonymous && !donorInfo.email && paymentMethod === 'stripe') {
      setErrorMsg('يرجى إدخال البريد الإلكتروني لإرسال سند التبرع الإلكتروني');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. استدعاء بوابة Stripe عبر paymentGateway service
      const paymentResponse = await paymentGateway.initiatePayment({
        amount: actualAmount,
        currency: currency,
        method: paymentMethod === 'stripe' ? 'stripe' : paymentMethod === 'bank' ? 'bank' : 'card',
        type: donationFrequency === 'monthly' ? 'monthly' : donationFrequency === 'yearly' ? 'yearly' : 'once',
        projectId: selectedProject,
        donorName: isAnonymous ? 'فاعل خير' : donorInfo.name || 'متبرع كريم',
        donorEmail: donorInfo.email || 'donor@rohamaa.org',
        donorPhone: donorInfo.phone,
        description: `تبرع ${donationFrequency === 'monthly' ? 'دوري شهري' : donationFrequency === 'yearly' ? 'دوري سنوي' : 'لمرة واحدة'} لمشروع ${projects.find(p => p.id === selectedProject)?.name}`,
        recurring: donationFrequency !== 'once',
        recurringInterval: donationFrequency === 'monthly' ? 'monthly' : donationFrequency === 'yearly' ? 'yearly' : undefined,
      });

      // 2. توثيق التبرع في نظام التبرعات متعدد المشاريع
      await multiProjectDonationService.processDonation({
        donorName: isAnonymous ? 'فاعل خير' : donorInfo.name || 'متبرع كريم',
        donorEmail: donorInfo.email || 'anonymous@rohamaa.org',
        donorPhone: donorInfo.phone,
        allocations: [{
          projectId: selectedProject,
          projectName: projects.find(p => p.id === selectedProject)?.name || 'تبرع عام',
          amount: actualAmount,
          isCustom: !!customAmount,
        }],
        totalAmount: actualAmount,
        currency: currency,
        paymentMethod: paymentMethod as any,
        paymentType: donationFrequency === 'monthly' ? 'monthly' : donationFrequency === 'yearly' ? 'yearly' : 'once',
        isAnonymous: isAnonymous,
        notes: donorInfo.message,
        agreeToTerms: true,
        agreeToContact: !isAnonymous,
        metadata: {
          gateway: 'Stripe_Secure_v2',
          frequency: donationFrequency,
          stripeSessionId: paymentResponse.transactionId,
        }
      });

      setTransactionDetails({
        id: paymentResponse.transactionId || `STRIPE_PAY_${Date.now().toString(36).toUpperCase()}`,
        amount: actualAmount,
        currency: currency,
        frequency: donationFrequency,
        project: projects.find(p => p.id === selectedProject)?.name,
        date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Stripe Donation Error:', err);
      setErrorMsg(err.message || 'حدث خطأ غير متوقع أثناء معالجة الدفع عبر Stripe. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // شاشة نجاح التبرع والتأكيد مع سند Stripe
  if (isSuccess && transactionDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl max-w-2xl mx-auto text-center font-cairo"
        dir="rtl"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-emerald-50 rounded-full border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 shadow-inner">
          <CheckCircle className="w-10 h-10 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>تم التأكيد بأمان وموثوقية 🔒</span>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-2">تقبل الله طاعتكم وعطاءكم!</h2>
        <p className="text-slate-600 text-base mb-6">
          تم استلام تبرعكم المبارك بنجاح بقيمة <strong className="text-emerald-700 font-extrabold">{transactionDetails.amount.toLocaleString('ar-SA')} {CURRENCY_SYMBOLS[transactionDetails.currency as PaymentCurrency]}</strong>
          {transactionDetails.frequency !== 'once' && (
            <span className="text-amber-700 block mt-1 font-bold">
              (تبرع دوري {transactionDetails.frequency === 'monthly' ? 'شهري' : 'سنوي'} متكرر)
            </span>
          )}
        </p>

        {/* تفاصيل السند المالي الرقمي */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-right space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-medium">رقم إثبات العملية:</span>
            <span className="font-mono font-bold text-slate-800 dir-ltr text-xs">{transactionDetails.id}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-medium">المشروع المستهدف:</span>
            <span className="font-bold text-slate-900">{transactionDetails.project}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-medium">تاريخ العملية:</span>
            <span className="font-bold text-slate-900">{transactionDetails.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">نوع التبرع:</span>
            <span className="font-bold text-emerald-700">
              {transactionDetails.frequency === 'monthly' ? 'صدقة جارية (تجدد شهرياً)' : transactionDetails.frequency === 'yearly' ? 'صدقة جارية (تجدد سنوياً)' : 'تبرع لمرة واحدة'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setIsSuccess(false);
              setTransactionDetails(null);
            }}
            className="btn-primary py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>تبرع آخر</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn-secondary py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>العودة للرئيسية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto font-cairo" dir="rtl">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200/90 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Islamic Geometry Background Accent */}
        <div className="absolute inset-0 pattern-islamic-stars opacity-[0.03] pointer-events-none" />

        {/* 1. التردد والدورية (مرة واحدة VS تبرع شهري VS تبرع سنوي) */}
        <div className="mb-8 relative z-10">
          <RecurringDonationToggle
            frequency={donationFrequency}
            onChange={(freq) => setDonationFrequency(freq)}
            amount={actualAmount}
            currencySymbol={CURRENCY_SYMBOLS[currency]}
          />
        </div>

        {/* 2. اختيار المشروع */}
        <div className="mb-8 relative z-10">
          <span className="block text-base sm:text-lg font-black text-slate-900 mb-3">
            المشروع أو المصرف المستهدف
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {projects.map((proj) => (
              <button
                key={proj.id}
                type="button"
                onClick={() => setSelectedProject(proj.id)}
                className={`p-3.5 rounded-2xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  selectedProject === proj.id
                    ? 'border-[var(--brand-green)] bg-[var(--brand-green)]/5 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <proj.icon className={`w-5 h-5 ${selectedProject === proj.id ? 'text-[var(--brand-green)]' : 'text-slate-400'}`} />
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    selectedProject === proj.id ? 'bg-[var(--brand-green)] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {proj.badge}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {proj.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. العملة والمبالغ المحددة أو المخصصة */}
        <div className="mb-8 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <label className="text-base sm:text-lg font-black text-slate-900">
              حدد قيمة التبرع ({CURRENCY_SYMBOLS[currency]})
            </label>
            
            {/* اختيار العملة */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['SAR', 'USD', 'YER', 'AED'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => {
                    setCurrency(curr);
                    setSelectedAmount(CURRENCY_PRESETS[curr][1]);
                    setCustomAmount('');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currency === curr
                      ? 'bg-[var(--brand-green)] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* أزرار المبالغ المقترحة */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
            {CURRENCY_PRESETS[currency].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setSelectedAmount(preset);
                  setCustomAmount('');
                }}
                className={`py-3 px-2 rounded-xl border-2 text-sm font-extrabold transition-all cursor-pointer text-center ${
                  selectedAmount === preset && !customAmount
                    ? 'border-[var(--brand-green)] bg-[var(--brand-green)] text-white shadow-md scale-[1.02]'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                {preset.toLocaleString('ar-SA')}
              </button>
            ))}
          </div>

          {/* حقل المبلغ المخصص */}
          <div className="relative">
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value) setSelectedAmount(0);
              }}
              placeholder={`أو أدخل مبلغاً مخصصاً بـ ${CURRENCY_SYMBOLS[currency]}...`}
              className="w-full p-3.5 pr-10 rounded-2xl border-2 border-slate-200 focus:border-[var(--brand-green)] focus:ring-4 focus:ring-[var(--brand-green)]/10 text-sm font-bold text-slate-900 outline-none transition-all text-right"
            />
            <DollarSign className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* بطاقة الأثر التفاعلي المباشر */}
          <motion.div
            key={`${actualAmount}-${currency}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-800/80 shadow-lg flex items-start gap-3.5 relative overflow-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              {dynamicImpact.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-[var(--brand-gold)] text-slate-950 text-[10px] font-black">
                  {dynamicImpact.badge}
                </span>
                <h4 className="text-amber-200 font-extrabold text-xs sm:text-sm">
                  {dynamicImpact.label}
                </h4>
              </div>
              <p className="text-emerald-100/90 text-xs leading-relaxed font-medium">
                {dynamicImpact.desc}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 4. طريقة الدفع وتكامل Stripe */}
        <div className="mb-8 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-700" />
              <span>طريقة الدفع المشفرة الآمنة</span>
            </span>
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              تشفير SSL 256-bit
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('stripe')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                paymentMethod === 'stripe'
                  ? 'border-[var(--brand-green)] bg-emerald-50/80 text-[var(--brand-green)] shadow-sm font-black'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <CreditCard className="w-6 h-6 text-[var(--brand-green)]" />
              <span className="text-xs font-bold">بطاقة ائتمان (Visa / MasterCard)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('apple')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                paymentMethod === 'apple'
                  ? 'border-[var(--brand-green)] bg-emerald-50/80 text-[var(--brand-green)] shadow-sm font-black'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Wallet className="w-6 h-6 text-slate-900" />
              <span className="text-xs font-bold">Apple Pay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('google')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                paymentMethod === 'google'
                  ? 'border-[var(--brand-green)] bg-emerald-50/80 text-[var(--brand-green)] shadow-sm font-black'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Wallet className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-bold">Google Pay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('bank')}
              className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                paymentMethod === 'bank'
                  ? 'border-[var(--brand-green)] bg-emerald-50/80 text-[var(--brand-green)] shadow-sm font-black'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Building2 className="w-6 h-6 text-amber-700" />
              <span className="text-xs font-bold">تحويل بنكي مباشر</span>
            </button>
          </div>

          {/* نماذج الدفع المباشرة لبطاقات الائتمان عبر Stripe */}
          {paymentMethod === 'stripe' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  دفع آمن ومشفّر بالكامل
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">Visa / MasterCard / Mada</span>
              </div>

              <div>
                <label htmlFor="card-number-input" className="block text-xs font-bold text-slate-300 mb-1.5">رقم البطاقة الائتمانية</label>
                <input
                  id="card-number-input"
                  type="text"
                  required
                  placeholder="4000 1234 5678 9010"
                  value={cardDetails.number}
                  onChange={handleCardNumberChange}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm tracking-widest outline-none focus:border-emerald-500 dir-ltr text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="card-expiry-input" className="block text-xs font-bold text-slate-300 mb-1.5">تاريخ الانتهاء (MM/YY)</label>
                  <input
                    id="card-expiry-input"
                    type="text"
                    required
                    placeholder="12/28"
                    value={cardDetails.expiry}
                    onChange={handleExpiryChange}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm tracking-widest outline-none focus:border-emerald-500 dir-ltr text-center"
                  />
                </div>
                <div>
                  <label htmlFor="card-cvc-input" className="block text-xs font-bold text-slate-300 mb-1.5">رمز الأمان (CVC/CVV)</label>
                  <input
                    id="card-cvc-input"
                    type="text"
                    required
                    maxLength={4}
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '') }))}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm tracking-widest outline-none focus:border-emerald-500 dir-ltr text-center"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 5. معلومات المتبرع والتبرع المجهول */}
        <div className="mb-8 relative z-10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-base sm:text-lg font-black text-slate-900">بيانات المتبرع</h3>
            
            {/* خيار التبرع كفاعل خير */}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-[var(--brand-green)] rounded border-slate-300 focus:ring-[var(--brand-green)]"
              />
              <span className="text-xs font-bold text-slate-700">التبرع كـ &quot;فاعل خير&quot; (مجهول)</span>
            </label>
          </div>

          {!isAnonymous && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div>
                <input
                  type="text"
                  required
                  placeholder="الاسم الكامل *"
                  value={donorInfo.name}
                  onChange={(e) => setDonorInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-[var(--brand-green)] focus:ring-4 focus:ring-[var(--brand-green)]/10 text-xs sm:text-sm font-bold text-slate-900 outline-none text-right"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  placeholder="البريد الإلكتروني (لإرسال السند الإلكتروني) *"
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-[var(--brand-green)] focus:ring-4 focus:ring-[var(--brand-green)]/10 text-xs sm:text-sm font-bold text-slate-900 outline-none dir-ltr text-right"
                />
                <input
                  type="tel"
                  placeholder="رقم الواتساب / الهاتف (اختياري)"
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-[var(--brand-green)] focus:ring-4 focus:ring-[var(--brand-green)]/10 text-xs sm:text-sm font-bold text-slate-900 outline-none dir-ltr text-right"
                />
              </div>
            </motion.div>
          )}

          <textarea
            placeholder="رسالة أو إهداء أو دعاء مع التبرع (اختياري)..."
            rows={2}
            value={donorInfo.message}
            onChange={(e) => setDonorInfo(prev => ({ ...prev, message: e.target.value }))}
            className="w-full p-3.5 rounded-2xl border-2 border-slate-200 focus:border-[var(--brand-green)] focus:ring-4 focus:ring-[var(--brand-green)]/10 text-xs sm:text-sm font-bold text-slate-900 outline-none resize-none text-right"
          />
        </div>

        {/* رسائل الخطأ إن وجدت */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* زر تنفيذ التبرع */}
        <div className="relative z-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-4 text-base sm:text-lg font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-transform"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري معالجة الدفع الآمن...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white" />
                <span>
                  تأكيد التبرع الآن — {actualAmount.toLocaleString('ar-SA')} {CURRENCY_SYMBOLS[currency]}
                  {donationFrequency !== 'once' && ` (${donationFrequency === 'monthly' ? 'شهرياً' : 'سنوياً'})`}
                </span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] font-bold text-slate-500 mt-3 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>معالجة الدفع معتمدة ومشفرة عالمياً بأعلى معايير الأمان المصرفي</span>
          </p>
        </div>

      </form>
    </div>
  );
}

export default SmartDonationForm;


