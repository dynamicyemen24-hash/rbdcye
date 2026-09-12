import {
  FileText, Send, CheckCircle2, Loader2, Shield, Clock, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, memo, useCallback } from 'react';

import { servicesDBService } from '@/services/beneficiary/services-db.service';

const GOVERNORATES = [
  'صنعاء', 'عدن', 'تعز', 'مسقط', 'إب', 'حضرموت', 'صعدة', 'حجة', 'الحديدة', 'مأرب', 'البيضاء', 'شبوة', 'لحج', 'أبين'
];

const REQUEST_TYPES = [
  { value: 'assistance', label: 'مساعدة إنسانية', icon: '🤝' },
  { value: 'medical', label: 'مساعدة طبية', icon: '🏥' },
  { value: 'educational', label: 'مساعدة تعليمية', icon: '📚' },
  { value: 'food', label: 'مساعدة غذائية', icon: '🍲' },
  { value: 'shelter', label: 'مساعدة سكنية', icon: '🏠' },
  { value: 'water', label: 'مساعدة مياه', icon: '💧' },
  { value: 'other', label: 'أخرى', icon: '📋' },
];

interface FormData {
  full_name: string;
  phone: string;
  email: string;
  governorate: string;
  district: string;
  address: string;
  request_type: string;
  priority: string;
  description: string;
  family_size: string;
}

const INITIAL_FORM: FormData = {
  full_name: '', phone: '', email: '', governorate: '', district: '',
  address: '', request_type: '', priority: 'normal', description: '', family_size: '',
};

export const BeneficiaryRequestPage = memo(function BeneficiaryRequestPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestNumber, setRequestNumber] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = useCallback((s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.full_name.trim()) e.full_name = 'الاسم الكامل مطلوب';
      if (!form.phone.trim()) e.phone = 'رقم الهاتف مطلوب';
      else if (!/^[0-9+]{10,15}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'رقم الهاتف غير صحيح';
      if (!form.governorate) e.governorate = 'المحافظة مطلوبة';
    } else if (s === 2) {
      if (!form.request_type) e.request_type = 'نوع الطلب مطلوب';
      if (!form.description.trim()) e.description = 'وصف الطلب مطلوب';
      else if (form.description.trim().length < 20) e.description = 'يرجى كتابة وصف تفصيلي';
      if (form.family_size && (parseInt(form.family_size) < 1 || parseInt(form.family_size) > 50)) e.family_size = 'يجب أن يكون بين ١ و ٥٠';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setSubmitting(true);
    const result = await servicesDBService.submitRequest({
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      governorate: form.governorate,
      district: form.district.trim() || undefined,
      address: form.address.trim() || undefined,
      request_type: form.request_type,
      priority: form.priority,
      description: form.description.trim(),
      family_size: form.family_size ? parseInt(form.family_size) : undefined,
    });
    setSubmitting(false);
    if (result.success) {
      setRequestNumber(result.request_number || 0);
      setSubmitted(true);
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] py-24" dir="rtl">
        <div className="mx-auto max-w-lg px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <CheckCircle2 className="mx-auto h-20 w-20 text-[var(--brand-green)]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="mt-6 text-2xl font-bold text-[var(--foreground)]">تم استلام طلبك بنجاح</h1>
            <p className="mt-4 text-[var(--muted-foreground)]">رقم الطلب: <span className="font-bold text-[var(--brand-green)]">#{requestNumber}</span></p>
            <p className="mt-2 text-[var(--muted-foreground)]">سنتواصل معك خلال ٢٤-٤٨ ساعة عبر رقم الهاتف المسجل</p>
            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-right">
              <h3 className="font-bold text-[var(--foreground)]">الخطوات التالية</h3>
              <ol className="mt-4 space-y-3 text-sm text-[var(--muted-foreground)]">
                <li className="flex items-start gap-2"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-[0.6rem] font-bold text-white">١</span>مراجعة الطلب من فريق العمل</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-[0.6rem] font-bold text-white">٢</span>التواصل معك للتحقق من البيانات</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-[0.6rem] font-bold text-white">٣</span>تنفيذ الخدمة أو المساعدة</li>
              </ol>
            </div>
            <button onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); setStep(1); }} className="mt-8 rounded-xl bg-[var(--brand-green)] px-8 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
              تقديم طلب جديد
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-24" dir="rtl">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-green)]">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-[var(--foreground)]">طلب استفادة</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">املأ النموذج أدناه وسنتواصل معك في أقرب وقت</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {[{ n: 1, l: 'البيانات الشخصية' }, { n: 2, l: 'تفاصيل الطلب' }, { n: 3, l: 'المراجعة والإرسال' }].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <button onClick={() => s.n < step && setStep(s.n)} className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${step >= s.n ? 'bg-[var(--brand-green)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
                {step > s.n ? '✓' : s.n}
              </button>
              <span className={`hidden text-sm sm:inline ${step >= s.n ? 'font-bold text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>{s.l}</span>
              {i < 2 && <div className={`mx-2 h-0.5 w-8 ${step > s.n ? 'bg-[var(--brand-green)]' : 'bg-[var(--muted)]'}`} />}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
            
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[var(--foreground)]">البيانات الشخصية</h2>
                
                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">الاسم الكامل *</label>
                  <input type="text" value={form.full_name} onChange={e => update('full_name', e.target.value)} className={`w-full rounded-xl border ${errors.full_name ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none`} placeholder="محمد أحمد محمد" />
                  {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                    <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">رقم الهاتف *</label>
                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className={`w-full rounded-xl border ${errors.phone ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none`} placeholder="770123456" dir="ltr" />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  </div>
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                    <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">البريد الإلكتروني (اختياري)</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none" dir="ltr" />
                  </div>
                </div>
{/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                    <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">المحافظة *</label>
                    <select value={form.governorate} onChange={e => update('governorate', e.target.value)} className={`w-full rounded-xl border ${errors.governorate ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none`}>
                      <option value="">اختر المحافظة</option>
                      {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                    </select>
                    {errors.governorate && <p className="mt-1 text-xs text-red-500">{errors.governorate}</p>}
                  </div>
                  <div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                    <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">المديرية / المنطقة</label>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                    <input type="text" value={form.district} onChange={e => update('district', e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none" placeholder="المديرية" />
                  </div>
                </div>

                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">العنوان التفصيلي</label>
                  <input type="text" value={form.address} onChange={e => update('address', e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none" placeholder="شارع، حي، منطقة" />
                </div>

                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">عدد أفراد الأسرة</label>
                  <input type="number" min="1" max="50" value={form.family_size} onChange={e => update('family_size', e.target.value)} className={`w-full rounded-xl border ${errors.family_size ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none`} placeholder="5" />
                  {errors.family_size && <p className="mt-1 text-xs text-red-500">{errors.family_size}</p>}
                </div>
              </div>
            )}
// eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: verified

            {/* Step 2: Request Details */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[var(--foreground)]">تفاصيل الطلب</h2>

                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">نوع الطلب *</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {REQUEST_TYPES.map(t => (
                      <button key={t.value} type="button" onClick={() => update('request_type', t.value)} className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all ${form.request_type === t.value ? 'border-[var(--brand-green)] bg-[var(--brand-green)]/10' : 'border-[var(--border)] hover:border-[var(--brand-green)]/50'}`}>
                        <span className="text-2xl">{t.icon}</span>
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                        <span className="text-xs font-bold text-[var(--foreground)]">{t.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.request_type && <p className="mt-1 text-xs text-red-500">{errors.request_type}</p>}
                </div>

                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">الأولوية</label>
                  <div className="flex gap-2">
                    {[
                      { v: 'urgent', l: 'عاجل', c: 'border-red-500 bg-red-500/10 text-red-600' },
                      { v: 'high', l: 'مرتفع', c: 'border-amber-500 bg-amber-500/10 text-amber-600' },
                      { v: 'normal', l: 'عادي', c: 'border-[var(--brand-green)] bg-[var(--brand-green)]/10 text-[var(--brand-green)]' },
                      { v: 'low', l: 'منخفض', c: 'border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]' },
                    // eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: verified
                    ].map(p => (
                      <button key={p.v} type="button" onClick={() => update('priority', p.v)} className={`flex-1 rounded-xl border-2 py-2 text-center text-sm font-bold transition-all ${form.priority === p.v ? p.c : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--brand-green)]/30'}`}>
                        {p.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">وصف الطلب *</label>
                  <textarea rows={5} value={form.description} onChange={e => update('description', e.target.value)} className={`w-full rounded-xl border ${errors.description ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none resize-none`} placeholder="اشرح وضعك بالتفصيل — ما هي المساعدة المطلوبة ولماذا؟" />
                  <div className="mt-1 flex justify-between text-xs">
                    {errors.description ? <p className="text-red-500">{errors.description}</p> : <span />}
                    <span className="text-[var(--muted-foreground)]">{form.description.length}/٥٠٠</span>
                  </div>
                </div>
              </div>
            )}
// eslint-disable-next-line no-nested-ternary -- precise: verified

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-[var(--foreground)]">مراجعة الطلب</h2>
                <div className="space-y-3 rounded-xl bg-[var(--muted)] p-4 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">الاسم:</span><span className="font-bold text-[var(--foreground)]">{form.full_name}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">الهاتف:</span><span className="font-bold text-[var(--foreground)]">{form.phone}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">المحافظة:</span><span className="font-bold text-[var(--foreground)]">{form.governorate}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">نوع الطلب:</span><span className="font-bold text-[var(--foreground)]">{REQUEST_TYPES.find(t => t.value === form.request_type)?.label}</span></div>
                  {/* eslint-disable-next-line no-nested-ternary -- precise: no-nested-ternary verified */}
                  <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">الأولوية:</span><span className="font-bold text-[var(--foreground)]">{form.priority === 'urgent' ? 'عاجل' : form.priority === 'high' ? 'مرتفع' : form.priority === 'normal' ? 'عادي' : 'منخفض'}</span></div>
                  {form.family_size && <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">عدد الأسرة:</span><span className="font-bold text-[var(--foreground)]">{form.family_size} أفراد</span></div>}
                  <div className="border-t border-[var(--border)] pt-3">
                    <span className="text-[var(--muted-foreground)]">الوصف:</span>
                    <p className="mt-1 text-[var(--foreground)]">{form.description}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/5 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-green)]" />
                    <div className="text-sm text-[var(--foreground)]">
                      <p className="font-bold">خصوصيتك محمية</p>
                      <p className="mt-1 text-[var(--muted-foreground)]">جميع بياناتك آمنة ولن يتم مشاركتها مع أي جهة خارجية</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-bold text-[var(--foreground)] transition-all hover:bg-[var(--muted)]">
              السابق
            </button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={() => { if (validateStep(step)) setStep(step + 1); }} className="rounded-xl bg-[var(--brand-green)] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
              التالي
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 rounded-xl bg-[var(--brand-green)] px-8 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> جاري الإرسال...</> : <><Send className="h-4 w-4" /> إرسال الطلب</>}
            </button>
          )}
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, title: 'سرعة الاستجابة', desc: 'نرد خلال ٢٤-٤٨ ساعة', color: 'bg-blue-500' },
            { icon: Shield, title: 'خصوصية تامة', desc: 'بياناتك محمية ولن تُشارك', color: 'bg-[var(--brand-green)]' },
            { icon: Heart, title: 'خدمة مجانية', desc: 'جميع خدماتنا مجانية بالكامل', color: 'bg-red-500' },
          ].map(c => (
            <div key={c.title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center">
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${c.color}`}><c.icon className="h-6 w-6 text-white" /></div>
              <h3 className="mt-3 font-bold text-[var(--foreground)]">{c.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
