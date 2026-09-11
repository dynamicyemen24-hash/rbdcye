// Quick Donate - نافذة تبرع سريع حقيقية تعمل من أي صفحة
import {
  Heart,
  X,
  Repeat,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Shield,
  Wallet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { donationOrchestrator } from '@/services/donation/donation-orchestrator';
import { multiProjectDonationService } from '@/shared/services/donation-multi-project.service';

const QUICK_AMOUNTS = [
  { v: 1000, l: '١,٠٠٠' },
  { v: 5000, l: '٥,٠٠٠' },
  { v: 10000, l: '١٠,٠٠٠' },
  { v: 25000, l: '٢٥,٠٠٠' },
];

type Stage = 'amount' | 'details' | 'success';

export const FixedDonateButton = memo(function FixedDonateButton() {
  const [showQuickDonate, setShowQuickDonate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [stage, setStage] = useState<Stage>('amount');
  const [recurring, setRecurring] = useState<'once' | 'monthly'>('once');
  const [amount, setAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const navigate = useNavigate();

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const isValidAmount = Number.isFinite(finalAmount) && finalAmount > 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const reset = () => {
    setStage('amount');
    setCustomAmount('');
    setForm({ name: '', phone: '', email: '' });
    setError('');
    setReceiptNumber('');
  };

  const close = useCallback(() => {
    setShowQuickDonate(false);
    reset();
  }, []);

  useEffect(() => {
    if (!showQuickDonate) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showQuickDonate, close]);

  const handleSubmit = async () => {
    setError('');
    if (!isValidAmount) {
      setError('أدخل مبلغاً صحيحاً أكبر من صفر');
      return;
    }
    if (!form.name && !form.phone && !form.email) {
      setError('أدخل وسيلة تواصل واحدة على الأقل (اسم أو هاتف أو بريد إلكتروني)');
      return;
    }
    setSubmitting(true);
    let saved = false;

    // 1) المسار الكامل عبر المنظّم (Supabase + إيصال رسمي)
    try {
      const receipt = await donationOrchestrator.processDonation({
        donor_name: form.name || undefined,
        donor_email: form.email,
        donor_phone: form.phone,
        donation: {
          type: 'financial',
          amount: Math.round(finalAmount),
          currency: 'YER',
          payment_method: 'bank_transfer',
          is_recurring: recurring === 'monthly',
          recurring_interval: recurring === 'monthly' ? 'monthly' : 'once',
        },
        is_anonymous: !form.name,
        receipt_method: form.email ? 'email' : 'whatsapp',
        metadata: { source: 'quick_donate' },
      });
      setReceiptNumber(receipt.receipt_number);
      saved = true;
    } catch {
      // 2) مسار آمن: خدمة المشاريع المتعددة (تتعامل مع غياب قاعدة البيانات)
      try {
        const fallback = await multiProjectDonationService.processDonation({
          donorName: form.name || 'متبرع كريم',
          donorEmail: form.email,
          donorPhone: form.phone,
          allocations: [
            {
              projectId: 'general',
              projectName: 'تبرع عام — حيث الحاجة أكبر',
              amount: Math.round(finalAmount),
              isCustom: true,
            },
          ],
          totalAmount: Math.round(finalAmount),
          currency: 'YER',
          paymentMethod: 'bank',
          paymentType: recurring === 'monthly' ? 'monthly' : 'once',
          isAnonymous: !form.name,
          source: 'web',
          metadata: { source: 'quick_donate' },
          agreeToTerms: true,
          agreeToContact: !!form.email,
        });
        setReceiptNumber(fallback.receiptNumber);
        saved = true;
      } catch {
        setError('تعذر إتمام التبرع الآن — أعد المحاولة أو تواصل معنا على +967 780 777 007');
      }
    } finally {
      setSubmitting(false);
    }

    if (saved) {
      setStage('success');
    }
  };

  return (
    <>
      {/* Main Fixed Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 left-6 z-50 md:bottom-8 md:left-8"
            dir="rtl"
          >
            <button
              onClick={() => (showQuickDonate ? close() : setShowQuickDonate(true))}
              aria-expanded={showQuickDonate}
              aria-controls="quick-donate-panel"
              aria-haspopup="dialog"
              className="group flex items-center gap-3 rounded-full bg-gradient-to-l from-[var(--brand-gold)] to-amber-600 px-6 py-4 text-white shadow-2xl transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(217,119,6,0.4)]"
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
              </span>
              <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="text-lg font-bold">
                {showQuickDonate ? 'إغلاق' : 'تبرع الآن'}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Donate Panel */}
      <AnimatePresence>
        {showQuickDonate && (
          <motion.div
            id="quick-donate-panel"
            role="dialog"
            aria-modal="false"
            aria-label="تبرع سريع"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 w-96 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl md:left-8"
            dir="rtl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--foreground)]">
                {stage === 'success' ? 'تم استلام تبرعك' : 'تبرع سريع'}
              </h3>
              <button
                onClick={close}
                aria-label="إغلاق نافذة التبرع السريع"
                className="p-1.5 hover:bg-[var(--muted)] rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <AnimatePresence>
              {stage === 'amount' && (
                <motion.div
                  key="qa-amount"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 space-y-4"
                >
                  {/* الدفعة — مرة واحدة / شهري */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'once', label: 'مرة واحدة', icon: Wallet },
                      { id: 'monthly', label: 'شهري مستمر', icon: Repeat },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRecurring(opt.id as 'once' | 'monthly')}
                        aria-pressed={recurring === opt.id}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all ${
                          recurring === opt.id
                            ? 'border-[var(--brand-green)] bg-[var(--brand-green)]/10 text-[var(--brand-green)]'
                            : 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--brand-green)]/40'
                        }`}
                      >
                        <opt.icon className="h-4 w-4" />
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* المبالغ السريعة */}
                  <div className="grid grid-cols-4 gap-2">
                    {QUICK_AMOUNTS.map((amt) => (
                      <button
                        key={amt.v}
                        type="button"
                        onClick={() => {
                          setAmount(amt.v);
                          setCustomAmount('');
                        }}
                        aria-pressed={!customAmount && amount === amt.v}
                        className={`rounded-xl border-2 py-2 text-center text-sm font-bold transition-all ${
                          !customAmount && amount === amt.v
                            ? 'border-[var(--brand-green)] bg-[var(--brand-green)]/10 text-[var(--brand-green)]'
                            : 'border-[var(--border)] text-[var(--foreground)] hover:border-[var(--brand-green)]/40'
                        }`}
                      >
                        {amt.l}
                      </button>
                    ))}
                  </div>

                  {/* مبلغ مخصص */}
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--muted)] p-2">
                    <span className="text-xs text-[var(--muted-foreground)]">مبلغ مخصص (ر.ي)</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="أدخل المبلغ"
                      className="flex-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* الأثر الفوري */}
                  <div className="mt-2 flex items-start gap-2 rounded-xl bg-[var(--brand-green-pale)] p-2.5">
                    <Shield className="h-4 w-4 shrink-0 text-[var(--brand-green)]" />
                    <span className="text-xs leading-5 text-[var(--brand-green)]">
                      {recurring === 'monthly'
                        ? `تبرعك الشهري = ${(Math.round(finalAmount || 0) * 12).toLocaleString('ar-YE')} ر.ي سنوياً من الأثر`
                        : `أثرك الفوري: ${
                            Math.round(finalAmount || 0) >= 25000
                              ? 'حفر بئر مياه'
                              : Math.round(finalAmount || 0) >= 10000
                                ? 'كفالة يتيم لشهر'
                                : Math.round(finalAmount || 0) >= 5000
                                  ? 'كسوة شتوية متكاملة'
                                  : 'سلة غذائية لأسرة'
                          }`}
                    </span>
                  </div>

                  {error && (
                    <p role="alert" className="rounded-lg border border-[var(--danger)] bg-[var(--danger-bg)] px-3 py-2 text-xs font-semibold text-[var(--destructive)]">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setStage('details')}
                    disabled={!isValidAmount}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-green)] py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                  >
                    التالي — أدخل بياناتك
                    <ArrowLeft className="h-4 w-4" />
                  </button>

                  <span className="block text-center">
                    <button
                      type="button"
                      onClick={() => navigate('/donate')}
                      className="text-xs font-semibold text-[var(--muted-foreground)] underline-offset-2 hover:text-[var(--brand-green)]"
                    >
                      تريد تبرعاً لمشروع محدد أو تبرعاً عينياً؟ صفحة التبرع الكاملة
                    </button>
                  </span>
                </motion.div>
              )}

              {stage === 'details' && (
                <motion.div
                  key="qa-details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 space-y-4"
                >
                  <div className="rounded-xl bg-[var(--muted)] p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted-foreground)]">المبلغ:</span>
                      <span className="font-bold text-[var(--foreground)]">
                        {Math.round(finalAmount).toLocaleString('ar-YE')} ر.ي
                      </span>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[var(--muted-foreground)]">الدفعة:</span>
                      <span className="font-bold text-[var(--foreground)]">
                        {recurring === 'monthly' ? 'شهرية مستمرة' : 'للمرة الواحدة'}
                      </span>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="الاسم (اختياري)"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
                    autoComplete="name"
                  />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="رقم الهاتف / واتساب"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
                    autoComplete="tel"
                    dir="ltr"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="البريد الإلكتروني (اختياري)"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm"
                    autoComplete="email"
                    dir="ltr"
                  />

                  {error && (
                    <p role="alert" className="rounded-lg border border-[var(--danger)] bg-[var(--danger-bg)] px-3 py-2 text-xs font-semibold text-[var(--destructive)]">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isValidAmount}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-gold)] py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
                    {submitting ? 'جاري المعالجة...' : `تأكيد التبرع — ${Math.round(finalAmount).toLocaleString('ar-YE')} ر.ي`}
                  </button>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStage('amount')}
                      className="text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--brand-green)]"
                    >
                      ← تعديل المبلغ
                    </button>
                    <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                      <Shield className="h-3.5 w-3.5 text-[var(--brand-green)]" />
                      بياناتك آمنة ومحمية
                    </span>
                  </div>
                </motion.div>
              )}

              {stage === 'success' && (
                <motion.div
                  key="qa-success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 220 }}
                  >
                    <CheckCircle2 className="mx-auto h-14 w-14 text-[var(--brand-green)]" />
                  </motion.div>
                  <p className="mt-3 font-bold text-[var(--foreground)]">
                    جزاك الله كل خير — تبرعك مسجل
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {Math.round(finalAmount).toLocaleString('ar-YE')} ر.ي
                    {recurring === 'monthly' ? 'شهرياً' : ''}
                    {receiptNumber ? ` — الإيصال: ${receiptNumber}` : ''}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    سنتواصل معك لتأكيد تفاصيل الدفع والوصول
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={close}
                      className="rounded-xl bg-[var(--brand-green)] px-5 py-2.5 text-sm font-bold text-white"
                    >
                      متابعة التصفح
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});