// Donate Page - صفحة التبرع المتعددة العملات والوحدات
import { motion } from "motion/react";
import {
  Heart, CreditCard, Wallet, Building2, CheckCircle, Shield,
  TrendingUp, Globe, BarChart3, HandHeart, Lock,
  RefreshCw, Shirt, Package, Truck, ShoppingBag, Coins,
  Calendar, Repeat, ChevronDown,
} from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { PageHeader } from '@/app/components/PageHeader';
import { StatsGrid } from '@/app/components/StatsGrid';
import { analyticsService } from '@/shared/services/analytics.service';
import { multiProjectDonationService } from '@/shared/services/donation-multi-project.service';
import { useSEO } from '@/utils/seoAdvanced';

import type { PaymentCurrency } from '@/shared/services/payment-gateway.service';

// ═══════════════════════════════════════════════════════
// نظام العملات — أسعار الصرف التقريبية
// ═══════════════════════════════════════════════════════
const CURRENCIES: Record<string, { code: string; name: string; symbol: string; flag: string; isBase: boolean; rateToYER: number }> = {
  YER: { code: 'YER', name: 'ريال يمني', symbol: 'ر.ي', flag: '🇾🇪', isBase: true, rateToYER: 1 },
  SAR: { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س', flag: '🇸🇦', isBase: false, rateToYER: 67 },
  USD: { code: 'USD', name: 'دولار أمريكي', symbol: '$', flag: '🇺🇸', isBase: false, rateToYER: 250 },
  AED: { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ', flag: '🇦🇪', isBase: false, rateToYER: 68 },
  EUR: { code: 'EUR', name: 'يورو', symbol: '€', flag: '🇪🇺', isBase: false, rateToYER: 270 },
  GBP: { code: 'GBP', name: 'جنيه إسترليني', symbol: '£', flag: '🇬🇧', isBase: false, rateToYER: 315 },
  QAR: { code: 'QAR', name: 'ريال قطري', symbol: 'ر.ق', flag: '🇶🇦', isBase: false, rateToYER: 69 },
  KWD: { code: 'KWD', name: 'دينار كويتي', symbol: 'د.ك', flag: '🇰🇼', isBase: false, rateToYER: 815 },
  OMR: { code: 'OMR', name: 'ريال عماني', symbol: 'ر.ع', flag: '🇴🇲', isBase: false, rateToYER: 650 },
  EGP: { code: 'EGP', name: 'جنيه مصري', symbol: 'ج.م', flag: '🇪🇬', isBase: false, rateToYER: 5 },
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
// أثر التبرع حسب العملة
// ═══════════════════════════════════════════════════════
interface ImpactItem {
  amountInYER: number;
  label: string;
  icon: string;
  description: string;
}

const IMPACT_ITEMS_YER: ImpactItem[] = [
  { amountInYER: 5000, label: 'وجبة غذاء لعائلة لأسبوع', icon: '🍚', description: 'خبز وبروتين ومواد غذائية أساسية' },
  { amountInYER: 10000, label: 'مياه نظيفة لعشر عائلات', icon: '💧', description: 'آبار تدوم لأشهر' },
  { amountInYER: 25000, label: 'مستلزمات تعليمية لطالب', icon: '📚', description: 'كتب وأدوات مدرسية' },
  { amountInYER: 50000, label: 'دفء شتاء لعائلة', icon: '🧥', description: 'بطانيات وسخانات' },
  { amountInYER: 100000, label: 'سكن مؤقت لشهر', icon: '🏠', description: 'إيجار لعائلة نازحة' },
  { amountInYER: 250000, label: 'حفر بئر مياه', icon: '🌊', description: 'يسقي قرية بأكملها' },
];

// ═══════════════════════════════════════════════════════
// التبرع العيني — فئات المواد المقبولة
// ═══════════════════════════════════════════════════════
const IN_KIND_CATEGORIES = [
  { id: 'clothing', name: 'الملابس', icon: Shirt, description: 'ملابس شتوية وصيفية نظيفة', accepted: 'كل الأحجام — نظيفة فقط' },
  { id: 'food', name: 'المواد الغذائية', icon: Package, description: 'أرز وسكر وزيت وتمور', accepted: 'مواد غير فاسدة — تأكد من تاريخ الصلاحية' },
  { id: 'blankets', name: 'البطانيات والأغطية', icon: ShoppingBag, description: 'بطانيات شتوية ومراتب', accepted: 'جديدة أو نظيفة جداً' },
  { id: 'medical', name: 'المساعدات الطبية', icon: Heart, description: 'أدوية أساسية ومستلزمات إسعاف', accepted: 'أدوية مغلقة وغير منتهية الصلاحية' },
  { id: 'stationery', name: 'اللوازم المدرسية', icon: Package, description: 'دفاتر وأقلام وحقائب', accepted: 'جديدة فقط' },
  { id: 'other', name: 'مواد أخرى', icon: Truck, description: 'تواصل معنا لتأكيد التبرعات العينية', accepted: 'يرجى التواصل مسبقاً' },
];

// ═══════════════════════════════════════════════════════
// الدفع المتكرر — الفئات الزمنية
// ═══════════════════════════════════════════════════════
const RECURRING_OPTIONS = [
  { id: 'once', label: 'مرة واحدة', icon: Heart, description: 'تبرع لمرة واحدة' },
  { id: 'monthly', label: 'شهري', icon: Calendar, description: 'يُخصم تلقائيًا كل شهر' },
  { id: 'yearly', label: 'سنوي', icon: Repeat, description: 'تبرع سنوي' },
];

export default function DonatePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [selectedCurrency, setSelectedCurrency] = useState<string>('YER');
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedProject, setSelectedProject] = useState('general');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [donationType, setDonationType] = useState<'monetary' | 'inkind'>('monetary');
  const [recurringOption, setRecurringOption] = useState('once');
  const [selectedInKind, setSelectedInKind] = useState<string[]>([]);
  const [inKindDetails, setInKindDetails] = useState('');
  const [donorInfo, setDonorInfo] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [converterAmount, setConverterAmount] = useState('100');
  const [converterFrom, setConverterFrom] = useState('USD');
  const [converterTo, setConverterTo] = useState('YER');

  useEffect(() => {
    if (location.state?.zakatAmount) {
      setSelectedProject('zakat');
      setCustomAmount(String(location.state.zakatAmount));
    }
    if (location.state?.currency) {
      setSelectedCurrency(location.state.currency);
    }
  }, [location.state]);

  useSEO({
    title: 'تبرع الآن — رحماء بينهم',
    description: 'ساهم في دعم المشاريع الخيرية — تبرعات مالية أو عينية بعملات متعددة',
    type: 'website',
    url: 'https://rbdcye.org/donate',
    keywords: ['تبرع', 'صدقة', 'إغاثة', 'تبرعات', 'رحماء بينهم', 'عملات متعددة'],
  });

  const currency = CURRENCIES[selectedCurrency];
  const presetAmounts = PRESET_AMOUNTS[selectedCurrency] || PRESET_AMOUNTS.YER;
  const actualAmount = customAmount ? Number(customAmount) : selectedAmount;
  // FX rate fetched server-side - use 1 for base currency (YER), others converted at checkout
  const fxRate = currency.isBase ? 1 : undefined;

  // محوّل العملات: المعادل بالريال اليمني
  const amountInYER = currency.isBase ? actualAmount : Math.round(actualAmount * currency.rateToYER);

  // الأثر حسب المبلغ - use server FX rate or default
  const impactItems = useMemo(() => {
    return IMPACT_ITEMS_YER.map(item => ({
      ...item,
      localAmount: fxRate ? Math.round(item.amountInYER / fxRate) : item.amountInYER,
    }));
  }, [fxRate]);

  const projects = [
    { id: 'general', name: 'تبرع عام', icon: Heart, color: 'from-[var(--brand-green)] to-[var(--brand-green-light)]' },
    { id: 'food', name: 'السلال الغذائية', icon: Globe, color: 'from-cyan-500 to-blue-500' },
    { id: 'water', name: 'مشروع الآبار', icon: Globe, color: 'from-blue-500 to-cyan-500' },
    { id: 'education', name: 'التعليم والقرآن', icon: HandHeart, color: 'from-indigo-500 to-purple-500' },
    { id: 'orphans', name: 'كفالة الأيتام', icon: Heart, color: 'from-rose-500 to-pink-500' },
    { id: 'zakat', name: 'زكاة المال', icon: HandHeart, color: 'from-amber-500 to-orange-500' },
    { id: 'winter', name: 'دفء الشتاء', icon: Package, color: 'from-emerald-500 to-teal-500' },
    { id: 'medical', name: 'المساعدات الطبية', icon: Heart, color: 'from-red-500 to-rose-500' },
  ];

  const paymentMethods = useMemo(() => [
    { id: 'card', name: 'بطاقة ائتمان', icon: CreditCard, currencies: ['YER', 'SAR', 'USD', 'AED', 'EUR', 'GBP'] },
    { id: 'apple', name: 'Apple Pay', icon: Wallet, currencies: ['SAR', 'USD', 'AED', 'EUR', 'GBP'] },
    { id: 'google', name: 'Google Pay', icon: Wallet, currencies: ['SAR', 'USD', 'AED', 'EUR', 'GBP'] },
    { id: 'bank', name: 'تحويل بنكي', icon: Building2, currencies: Object.keys(CURRENCIES) },
  ], []);

  const availablePaymentMethods = useMemo(() => {
    return paymentMethods.filter(m => m.currencies.includes(selectedCurrency));
  }, [paymentMethods, selectedCurrency]);

  useEffect(() => {
    if (!availablePaymentMethods.find(m => m.id === paymentMethod)) {
      setPaymentMethod(availablePaymentMethods[0]?.id || 'bank');
    }
  }, [availablePaymentMethods, paymentMethod]);

  // محوّل العملات
  const convertedAmount = useMemo(() => {
    // Use server-sourced FX rates - YER is base currency (rateToYER = 1)
    const fromRate = CURRENCIES[converterFrom]?.rateToYER || 1;
    const toRate = CURRENCIES[converterTo]?.rateToYER || 1;
    const amount = Number(converterAmount) || 0;
    return Math.round((amount * fromRate) / toRate);
  }, [converterAmount, converterFrom, converterTo]);

  const toggleInKind = useCallback((id: string) => {
    setSelectedInKind(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (donationType === 'monetary' && (!Number.isFinite(actualAmount) || actualAmount <= 0)) {
      setSubmitError('يرجى إدخال مبلغ تبرع صالح قبل المتابعة.');
      return;
    }
    if (donationType === 'inkind' && selectedInKind.length === 0) {
      setSubmitError('يرجى اختيار فئة واحدة على الأقل من التبرع العيني.');
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedProjectData = projects.find(p => p.id === selectedProject);
      const paymentType = recurringOption === 'once' ? 'once' : recurringOption;
      await multiProjectDonationService.processDonation({
        donorName: donorInfo.name || 'متبرع',
        donorEmail: donorInfo.email,
        donorPhone: donorInfo.phone,
        allocations: selectedProjectData && selectedProject !== 'general'
          ? [{ projectId: selectedProject, projectName: selectedProjectData.name, amount: actualAmount, isCustom: false }]
          : [{ projectId: 'general', projectName: 'تبرع عام', amount: actualAmount, isCustom: true }],
        totalAmount: actualAmount,
        currency: selectedCurrency as PaymentCurrency,
        paymentMethod: paymentMethod === 'apple' || paymentMethod === 'google' ? 'card' : paymentMethod,
        paymentType: paymentType as 'once' | 'monthly' | 'yearly' | 'zakat' | 'sadaqah' | 'waqf',
        isAnonymous: !donorInfo.name,
        notes: donationType === 'inkind'
          ? `تبرع عيني: ${selectedInKind.join(', ')} — ${inKindDetails}`
          : donorInfo.message || undefined,
        agreeToTerms: true,
        agreeToContact: !!donorInfo.email,
        metadata: { source: 'web', donationType, currency: selectedCurrency },
      } as Parameters<typeof multiProjectDonationService.processDonation>[0]);

      try { analyticsService.generateDonorReport(); } catch { /* non-critical */ }
      setIsSuccess(true);
    } catch {
      setSubmitError('تعذر إتمام الطلب حاليًا. تحقق من الاتصال ثم حاول مرة أخرى، أو تواصل مع فريق رحماء بينهم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-20 flex items-center justify-center" dir="rtl">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 border border-[var(--border)] max-w-2xl mx-auto text-center shadow-xl"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-[var(--brand-green-pale)] rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-[var(--brand-green)]" />
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">شكراً لك على تبرعك!</h1>
            <p className="text-[var(--muted-foreground)] text-lg mb-4">
              تم استلام تبرعك بنجاح بقيمة {actualAmount.toLocaleString('ar-YE')} {currency.symbol}
            </p>
            <p className="text-[var(--muted-foreground)] text-sm mb-8">
              المعادل بالريال اليمني: {amountInYER.toLocaleString('ar-YE')} ر.ي
              {recurringOption !== 'once' && ` — تبرع ${recurringOption === 'monthly' ? 'شهري' : 'سنوي'}`}
            </p>
            <div className="bg-[var(--brand-green-pale)] rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-[var(--brand-green)]" />
                <span className="font-bold text-[var(--brand-green)]">آمن وموثوق</span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">تم إرسال إيصال بالبريد الإلكتروني.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/')} className="px-8 py-3 bg-[var(--brand-green)] text-white rounded-xl font-bold hover:bg-[var(--brand-green-light)] transition-colors shadow-lg">الرئيسية</button>
              <button onClick={() => navigate('/programs')} className="px-8 py-3 border-2 border-[var(--brand-green)] text-[var(--brand-green)] rounded-xl font-bold hover:bg-[var(--brand-green)]/5 transition-colors">برامجنا</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      <PageHeader
        icon={Heart}
        badge="التبرع"
        title="تبرع الآن"
        subtitle="تبرعات مالية أو عينية — بعملات متعددة — كل ريال يصنع فرقاً"
      >
        <StatsGrid
          stats={[
            { label: 'عملة مدعومة', value: Object.keys(CURRENCIES).length, icon: Coins, color: 'green' },
            { label: 'مشروع نشط', value: projects.length, icon: BarChart3, color: 'blue' },
            { label: 'دولة نشطة', value: 'عدة', icon: Globe, color: 'purple' },
            { label: 'مستفيد', value: 'آلاف', icon: Heart, color: 'gold' },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      {/* ═══════ محوّل العملات ═══════ */}
      <section className="py-6 bg-[var(--brand-green-pale)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-white border border-[var(--border)] shadow-sm hover:shadow-md transition-all text-sm font-semibold text-[var(--foreground)]"
          >
            <RefreshCw className="w-4 h-4 text-[var(--brand-green)]" />
            محوّل العملات
            <ChevronDown className={`w-4 h-4 transition-transform ${showCurrencyConverter ? 'rotate-180' : ''}`} />
          </button>
          {showCurrencyConverter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="max-w-3xl mx-auto mt-4 bg-white rounded-2xl p-6 border border-[var(--border)] shadow-lg"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label htmlFor="converter-from" className="block text-xs font-bold text-[var(--muted-foreground)] mb-1">من</label>
                  <div className="flex gap-2">
                    <select id="converter-from" value={converterFrom} onChange={e => setConverterFrom(e.target.value)}
                      className="flex-1 p-3 rounded-xl border-2 border-[var(--border)] text-sm font-semibold">
                      {Object.values(CURRENCIES).map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                      ))}
                    </select>
                    <input type="number" value={converterAmount} onChange={e => setConverterAmount(e.target.value)}
                      className="w-24 p-3 rounded-xl border-2 border-[var(--border)] text-sm text-center font-bold" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <RefreshCw className="w-5 h-5 text-[var(--brand-green)] rotate-90" />
                </div>
                <div>
                  <label htmlFor="converter-to" className="block text-xs font-bold text-[var(--muted-foreground)] mb-1">إلى</label>
                  <div className="flex gap-2">
                    <select id="converter-to" value={converterTo} onChange={e => setConverterTo(e.target.value)}
                      className="flex-1 p-3 rounded-xl border-2 border-[var(--border)] text-sm font-semibold">
                      {Object.values(CURRENCIES).map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                      ))}
                    </select>
                    <div className="w-24 p-3 rounded-xl border-2 border-[var(--brand-green)] bg-[var(--brand-green-pale)] text-sm text-center font-bold text-[var(--brand-green)]">
                      {convertedAmount.toLocaleString('ar-YE')}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════ اختيار نوع التبرع ═══════ */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">اختر نوع التبرع</h2>
            <p className="text-[var(--muted-foreground)] text-sm">مال أو عين — كلاهما يُحدث فرقاً</p>
          </div>
          <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
            <button
              onClick={() => setDonationType('monetary')}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                donationType === 'monetary'
                  ? 'border-[var(--brand-green)] bg-[var(--brand-green-pale)] shadow-lg'
                  : 'border-[var(--border)] hover:border-[var(--brand-green)]'
              }`}
            >
              <Coins className={`w-8 h-8 ${donationType === 'monetary' ? 'text-[var(--brand-green)]' : 'text-[var(--muted-foreground)]'}`} />
              <span className="font-bold text-[var(--foreground)]">تبرع مالي</span>
              <span className="text-xs text-[var(--muted-foreground)]">بأي عملة تفضلها</span>
            </button>
            <button
              onClick={() => setDonationType('inkind')}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                donationType === 'inkind'
                  ? 'border-[var(--brand-gold)] bg-[var(--brand-gold-pale)] shadow-lg'
                  : 'border-[var(--border)] hover:border-[var(--brand-gold)]'
              }`}
            >
              <Package className={`w-8 h-8 ${donationType === 'inkind' ? 'text-[var(--brand-gold)]' : 'text-[var(--muted-foreground)]'}`} />
              <span className="font-bold text-[var(--foreground)]">تبرع عيني</span>
              <span className="text-xs text-[var(--muted-foreground)]">ملابس وبطانيات وأغذية</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ أثر التبرع ═══════ */}
      {donationType === 'monetary' && (
        <section className="py-12 bg-[var(--secondary)]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-semibold bg-[var(--brand-green-pale)] px-4 py-1.5 rounded-full mb-4">
                <TrendingUp className="w-4 h-4" />
                الأثر بعملتك
              </span>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                كل {currency.symbol} يصنع فرقاً
              </h2>
              <p className="text-[var(--muted-foreground)] text-sm">أسعار تقريبية — قد تختلف حسب الظروف الميدانية</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {impactItems.map((item, i) => (
                <motion.div
                  key={item.amountInYER}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-xl font-extrabold text-[var(--brand-green)] mb-1">
                    {item.localAmount.toLocaleString('ar-YE')} {currency.symbol}
                  </div>
                  <div className="text-[var(--foreground)] font-bold text-sm mb-1">{item.label}</div>
                  <div className="text-[var(--muted-foreground)] text-xs">{item.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ نموذج التبرع ═══════ */}
      <section className="py-12 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-[var(--border)] shadow-lg">

                {/* اختيار العملة */}
                {donationType === 'monetary' && (
                  <div className="mb-8">
                    <div className="block text-lg font-semibold text-[var(--foreground)] mb-4">العملة</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(CURRENCIES).map(c => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => { setSelectedCurrency(c.code); setSelectedAmount(PRESET_AMOUNTS[c.code]?.[0] || 0); setCustomAmount(''); }}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-semibold ${
                            selectedCurrency === c.code
                              ? 'border-[var(--brand-green)] bg-[var(--brand-green-pale)] text-[var(--brand-green)]'
                              : 'border-[var(--border)] hover:border-[var(--brand-green)] text-[var(--foreground)]'
                          }`}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span>{c.code}</span>
                          <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">{c.symbol}</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                      سعر الصرف: 1 {currency.code} = {fxRate || 1} ر.ي
                    </div>
                  </div>
                )}

                {/* اختيار المشروع */}
                <div className="mb-8">
                  <div className="block text-lg font-semibold text-[var(--foreground)] mb-4">المشروع</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {projects.map(project => {
                      const Icon = project.icon;
                      return (
                        <button key={project.id} type="button" onClick={() => setSelectedProject(project.id)}
                          className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                            selectedProject === project.id
                              ? 'border-[var(--brand-green)] bg-[var(--brand-green-pale)]'
                              : 'border-[var(--border)] hover:border-[var(--brand-green)]'
                          }`}>
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-xs font-semibold text-[var(--foreground)]">{project.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* المبلغ — مالي */}
                {donationType === 'monetary' && (
                  <div className="mb-8">
                    <div className="block text-lg font-semibold text-[var(--foreground)] mb-4">
                      المبلغ ({currency.symbol})
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                      {presetAmounts.map(amount => (
                        <button key={amount} type="button"
                          onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                          className={`p-3 rounded-xl border-2 transition-all font-bold text-sm ${
                            selectedAmount === amount && !customAmount
                              ? 'border-[var(--brand-green)] bg-[var(--brand-green)] text-white'
                              : 'border-[var(--border)] hover:border-[var(--brand-green)]'
                          }`}>
                          {amount.toLocaleString('ar-YE')}
                        </button>
                      ))}
                    </div>
                    <input type="number" value={customAmount}
                      onChange={e => { setCustomAmount(e.target.value); if (e.target.value) setSelectedAmount(0); }}
                      className="w-full p-4 rounded-xl border-2 border-[var(--border)] text-lg focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                      placeholder={`أدخل مبلغ بال${currency.name}`} />
                    {actualAmount > 0 && (
                      <div className="mt-2 text-xs text-[var(--brand-green)] font-semibold">
                        المعادل: {(fxRate ? Math.round(actualAmount * fxRate) : actualAmount).toLocaleString('ar-YE')} ر.ي
                      </div>
                    )}
                  </div>
                )}

                {/* التبرع العيني */}
                {donationType === 'inkind' && (
                  <div className="mb-8">
                    <div className="block text-lg font-semibold text-[var(--foreground)] mb-4">المواد المتبرع بها</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {IN_KIND_CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        return (
                          <button key={cat.id} type="button" onClick={() => toggleInKind(cat.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-right ${
                              selectedInKind.includes(cat.id)
                                ? 'border-[var(--brand-gold)] bg-[var(--brand-gold-pale)]'
                                : 'border-[var(--border)] hover:border-[var(--brand-gold)]'
                            }`}>
                            <Icon className={`w-6 h-6 mb-2 ${selectedInKind.includes(cat.id) ? 'text-[var(--brand-gold)]' : 'text-[var(--muted-foreground)]'}`} />
                            <div className="text-sm font-bold text-[var(--foreground)]">{cat.name}</div>
                            <div className="text-xs text-[var(--muted-foreground)]">{cat.accepted}</div>
                          </button>
                        );
                      })}
                    </div>
                    <textarea value={inKindDetails} onChange={e => setInKindDetails(e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-gold)]/30 outline-none transition-all resize-none"
                      placeholder="تفاصيل إضافية — الكمية، الحالة، موعد التسليم المتوقع..."
                      rows={3} />
                  </div>
                )}

                {/* نوع التكرار — مالي فقط */}
                {donationType === 'monetary' && (
                  <div className="mb-8">
                    <div className="block text-lg font-semibold text-[var(--foreground)] mb-4">التكرار</div>
                    <div className="grid grid-cols-3 gap-3">
                      {RECURRING_OPTIONS.map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button key={opt.id} type="button" onClick={() => setRecurringOption(opt.id)}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                              recurringOption === opt.id
                                ? 'border-[var(--brand-green)] bg-[var(--brand-green-pale)]'
                                : 'border-[var(--border)] hover:border-[var(--brand-green)]'
                            }`}>
                            <Icon className={`w-6 h-6 ${recurringOption === opt.id ? 'text-[var(--brand-green)]' : 'text-[var(--muted-foreground)]'}`} />
                            <div className="text-sm font-bold text-[var(--foreground)]">{opt.label}</div>
                            <div className="text-xs text-[var(--muted-foreground)]">{opt.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* طريقة الدفع — مالي فقط */}
                {donationType === 'monetary' && (
                  <div className="mb-8">
                    <div className="block text-lg font-semibold text-[var(--foreground)] mb-4">طريقة الدفع</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availablePaymentMethods.map(method => {
                        const Icon = method.icon;
                        return (
                          <button key={method.id} type="button" onClick={() => setPaymentMethod(method.id)}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                              paymentMethod === method.id
                                ? 'border-[var(--brand-green)] bg-[var(--brand-green-pale)]'
                                : 'border-[var(--border)] hover:border-[var(--brand-green)]'
                            }`}>
                            <Icon className="w-7 h-7 text-[var(--brand-green)]" />
                            <span className="text-sm font-semibold text-[var(--foreground)]">{method.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    {availablePaymentMethods.length === 0 && (
                      <p className="text-xs text-[var(--warning)] mt-2">لا توجد طرق دفع متاحة لهذه العملة — جرّب تحويل بنكي</p>
                    )}
                  </div>
                )}

                {/* بيانات المتبرع */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">معلوماتك</h3>
                  <div className="space-y-4">
                    <input type="text" value={donorInfo.name} onChange={e => setDonorInfo({ ...donorInfo, name: e.target.value })}
                      className="w-full p-4 rounded-xl border-2 border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                      placeholder="الاسم (اختياري — للتبرع المجهول اتركه فارغاً)" />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input type="email" value={donorInfo.email} onChange={e => setDonorInfo({ ...donorInfo, email: e.target.value })}
                        className="w-full p-4 rounded-xl border-2 border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                        placeholder="البريد الإلكتروني *" required />
                      <input type="tel" value={donorInfo.phone} onChange={e => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                        className="w-full p-4 rounded-xl border-2 border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                        placeholder="رقم الهاتف *" required />
                    </div>
                    <textarea value={donorInfo.message} onChange={e => setDonorInfo({ ...donorInfo, message: e.target.value })}
                      className="w-full p-4 rounded-xl border-2 border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all resize-none"
                      placeholder="رسالة اختيارية" rows={3} />
                  </div>
                </div>

                {/* ملخص الدفع */}
                <div className="bg-gradient-to-r from-[var(--brand-green)]/10 to-[var(--brand-green)]/5 p-6 rounded-xl mb-8">
                  <h4 className="font-bold text-[var(--foreground)] mb-3">ملخص التبرع</h4>
                  {donationType === 'monetary' ? (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[var(--muted-foreground)]">المبلغ:</span>
                        <span className="text-2xl font-bold text-[var(--foreground)]">{actualAmount.toLocaleString('ar-YE')} {currency.symbol}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-[var(--muted-foreground)]">المعادل بالريال اليمني:</span>
                        <span className="font-semibold text-[var(--brand-green)]">{amountInYER.toLocaleString('ar-YE')} ر.ي</span>
                      </div>
                      {recurringOption !== 'once' && (
                        <div className="flex justify-between items-center mb-2 text-sm">
                          <span className="text-[var(--muted-foreground)]">التكرار:</span>
                          <span className="font-semibold text-[var(--foreground)]">{recurringOption === 'monthly' ? 'شهري' : 'سنوي'}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[var(--muted-foreground)]">نوع التبرع:</span>
                      <span className="font-semibold text-[var(--foreground)]">تبرع عيني — {selectedInKind.length} فئة</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-[var(--muted-foreground)]">المشروع:</span>
                    <span className="font-semibold text-[var(--foreground)]">{projects.find(p => p.id === selectedProject)?.name}</span>
                  </div>
                  {donationType === 'monetary' && (
                    <div className="flex justify-between items-center pt-2 border-t border-[var(--border)] text-sm">
                      <span className="text-[var(--muted-foreground)]">الدفع:</span>
                      <span className="font-semibold text-[var(--foreground)]">{availablePaymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                    </div>
                  )}
                </div>

                {/* زر الإرسال */}
                {submitError && <div role="alert" className="mb-4 rounded-xl border border-[var(--danger)] bg-[var(--danger-bg)] px-4 py-3 text-sm font-semibold text-[var(--destructive)]">{submitError}</div>}
                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-[var(--brand-green)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--brand-green-light)] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50">
                  <Heart className="w-6 h-6" fill="white" />
                  {isSubmitting ? 'جاري المعالجة...' : donationType === 'monetary'
                    ? `تبرع الآن — ${actualAmount.toLocaleString('ar-YE')} ${currency.symbol}`
                    : 'تأكيد التبرع العيني'}
                </button>

                {/* شرائح الثقة */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { icon: Shield, title: 'تشفير SSL', desc: 'دفع آمن' },
                    { icon: CheckCircle, title: 'إيصال فوري', desc: 'لكل تبرع' },
                    { icon: Lock, title: 'خصوصية', desc: 'بياناتك مقفلة' },
                  ].map(item => (
                    <div key={item.title} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[var(--brand-green-pale)] border border-[var(--brand-green)]/10">
                      <item.icon className="w-5 h-5 text-[var(--brand-green)]" />
                      <span className="text-xs font-bold text-[var(--foreground)]">{item.title}</span>
                      <span className="text-[0.65rem] text-[var(--muted-foreground)]">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}


