import {
  Heart, CreditCard, CheckCircle2, Shield, Smartphone,
  Building2, Loader2, Share2, ArrowLeft, ArrowRight, Repeat
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, memo, useMemo } from 'react';

interface DonationAmount {
  value: number;
  label: string;
  impact: string;
  icon: string;
}

const AMOUNTS: DonationAmount[] = [
  { value: 1000, label: '١,٠٠٠', impact: 'وجبة غذائية لأسرة', icon: '🍲' },
  { value: 2500, label: '٢,٥٠٠', impact: 'سلة غذائية شهرية', icon: '📦' },
  { value: 5000, label: '٥,٠٠٠', impact: 'كسوة شتوية كاملة', icon: '🧥' },
  { value: 10000, label: '١٠,٠٠٠', impact: 'كفالة يتيم لشهر', icon: '👨‍👩‍👧' },
  { value: 25000, label: '٢٥,٠٠٠', impact: 'حفر بئر مياه', icon: '💧' },
  { value: 50000, label: '٥٠,٠٠٠', impact: 'مشروع تنموي كامل', icon: '🏗️' },
];

const PAYMENT_METHODS = [
  { id: 'wallet', label: 'محفظة إلكترونية', icon: Smartphone, desc: 'تحويل فوري' },
  { id: 'bank', label: 'تحويل بنكي', icon: Building2, desc: 'حساب المؤسسة' },
  { id: 'cash', label: 'نقدًا', icon: CreditCard, desc: 'تسليم يدوي' },
];

export const ProgressiveDonationFlow = memo(function ProgressiveDonationFlow() {
  const [step, setStep] = useState(1);
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const finalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;
  const dailyCost = Math.round(finalAmount / 30);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const annualImpact = finalAmount * 12;

  const selectedImpact = useMemo(() => {
    return AMOUNTS.find(a => a.value === finalAmount)?.impact || `${Math.floor(finalAmount / 5000)} مساعدات`;
  }, [finalAmount]);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="rounded-3xl border-2 border-[var(--brand-green)]/30 bg-[var(--brand-green)]/5 p-8 text-center" dir="rtl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <CheckCircle2 className="mx-auto h-20 w-20 text-[var(--brand-green)]" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 text-2xl font-bold text-[var(--foreground)]">
          شكرًا لك — تبرعك مسجل
        </motion.h2>
        <p className="mt-3 text-[var(--muted-foreground)]">
          {isMonthly ? `تبرع شهري: ${finalAmount.toLocaleString('ar-YE')} ر.ي` : `تبرع لمرة واحدة: ${finalAmount.toLocaleString('ar-YE')} ر.ي`}
        </p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">سنتواصل معك لتأكيد التفاصيل</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-[var(--brand-green)] px-6 py-3 font-bold text-white">
            <Share2 className="h-4 w-4" /> شارك الحملة
          </button>
          <button onClick={() => { setCompleted(false); setStep(1); setForm({ name: '', phone: '', email: '', note: '' }); }} className="rounded-xl border border-[var(--border)] px-6 py-3 font-bold text-[var(--foreground)]">
            تبرع مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-[var(--brand-green)] to-emerald-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <Heart className="h-8 w-8" />
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-2 w-8 rounded-full transition-all ${step >= s ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-bold">تبرع الآن</h2>
        <p className="mt-1 text-sm text-white/80">اختر المبلغ وطريقة الدفع</p>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Amount */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Monthly Toggle */}
              <div className="mb-6 flex items-center justify-center gap-3 rounded-xl bg-[var(--muted)] p-1">
                <button onClick={() => setIsMonthly(true)} className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${isMonthly ? 'bg-[var(--brand-green)] text-white shadow' : 'text-[var(--muted-foreground)]'}`}>
                  <Repeat className="ml-1 inline h-4 w-4" /> تبرع شهري
                </button>
                <button onClick={() => setIsMonthly(false)} className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${!isMonthly ? 'bg-[var(--brand-green)] text-white shadow' : 'text-[var(--muted-foreground)]'}`}>
                  لمرة واحدة
                </button>
              </div>

              {isMonthly && (
                <p className="mb-4 text-center text-sm text-[var(--brand-green)]">
                 فقط {dailyCost.toLocaleString('ar-YE')} ر.ي/يوم = {(finalAmount * 12).toLocaleString('ar-YE')} ر.ي/سنوي
                </p>
              )}

              {/* Amount Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {AMOUNTS.map(amt => (
                  <button key={amt.value} onClick={() => { setSelectedAmount(amt.value); setCustomAmount(''); }} className={`rounded-2xl border-2 p-4 text-center transition-all ${selectedAmount === amt.value && !customAmount ? 'border-[var(--brand-green)] bg-[var(--brand-green)]/10 shadow-lg' : 'border-[var(--border)] hover:border-[var(--brand-green)]/30'}`}>
                    <span className="text-2xl">{amt.icon}</span>
                    <div className="mt-2 text-lg font-bold text-[var(--foreground)]">{amt.label}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{amt.impact}</div>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mt-4">
                <input type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)} placeholder="مبلغ مخصص (ر.ي)" className={`w-full rounded-xl border ${customAmount ? 'border-[var(--brand-green)]' : 'border-[var(--border)]'} bg-[var(--background)] px-4 py-3 text-center text-lg font-bold`} />
              </div>

              {/* Impact Preview */}
              {finalAmount > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/5 p-4 text-center">
                  <p className="text-sm text-[var(--muted-foreground)]">بمبلغك يمكنك:</p>
                  <p className="mt-1 text-lg font-bold text-[var(--brand-green)]">{selectedImpact}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Info */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="font-bold text-[var(--foreground)]">بياناتك</h3>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3" placeholder="الاسم الكامل" />
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3" placeholder="رقم الهاتف" dir="ltr" />
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3" placeholder="البريد (اختياري)" dir="ltr" />
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="font-bold text-[var(--foreground)]">طريقة الدفع</h3>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(pm => (
                  <button key={pm.id} onClick={() => setPaymentMethod(pm.id)} className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 transition-all ${paymentMethod === pm.id ? 'border-[var(--brand-green)] bg-[var(--brand-green)]/10' : 'border-[var(--border)]'}`}>
                    <pm.icon className="h-5 w-5 text-[var(--brand-green)]" />
                    <div className="text-right"><p className="font-bold text-[var(--foreground)]">{pm.label}</p><p className="text-xs text-[var(--muted-foreground)]">{pm.desc}</p></div>
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-[var(--muted)] p-4">
                <div className="flex justify-between text-sm"><span className="text-[var(--muted-foreground)]">المبلغ:</span><span className="font-bold text-[var(--foreground)]">{finalAmount.toLocaleString('ar-YE')} ر.ي</span></div>
                <div className="flex justify-between text-sm"><span className="text-[var(--muted-foreground)]">النوع:</span><span className="font-bold text-[var(--foreground)]">{isMonthly ? 'شهري' : 'مرة واحدة'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[var(--muted-foreground)]">الأثر:</span><span className="font-bold text-[var(--brand-green)]">{selectedImpact}</span></div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/5 p-3">
                <Shield className="h-4 w-4 shrink-0 text-[var(--brand-green)]" />
                <p className="text-xs text-[var(--muted-foreground)]">بياناتك آمنة ومحمية بالكامل</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold">
              <ArrowRight className="h-4 w-4" /> السابق
            </button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} disabled={step === 1 && finalAmount <= 0} className="flex items-center gap-1 rounded-xl bg-[var(--brand-green)] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              التالي <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || !form.name || !form.phone} className="flex items-center gap-2 rounded-xl bg-[var(--brand-gold)] px-8 py-3 font-bold text-white disabled:opacity-50">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
              {submitting ? 'جاري المعالجة...' : 'تأكيد التبرع'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
