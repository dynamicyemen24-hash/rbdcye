import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquareWarning, Lightbulb, MessageCircle, HelpCircle,
  Send, CheckCircle2, Loader2, ChevronDown, Shield, Clock, Phone
} from 'lucide-react';
import { servicesDBService, type ComplaintSuggestion } from '@/services/beneficiary/services-db.service';

const FEEDBACK_TYPES = [
  { value: 'complaint', label: 'شكوى', icon: MessageSquareWarning, color: 'bg-red-500', desc: 'إبلاغ عن مشكلة أو إشكالية' },
  { value: 'suggestion', label: 'اقتراح', icon: Lightbulb, color: 'bg-amber-500', desc: 'فكرة لتحسين الخدمات' },
  { value: 'feedback', label: 'ملاحظات', icon: MessageCircle, color: 'bg-blue-500', desc: 'رأي في تجربتك معنا' },
  { value: 'inquiry', label: 'استفسار', icon: HelpCircle, color: 'bg-purple-500', desc: 'سؤال يحتاج إلى توضيح' },
];

const DEPARTMENTS = [
  { value: 'programs', label: 'البرامج' },
  { value: 'finance', label: 'المالية' },
  { value: 'hr', label: 'الموارد البشرية' },
  { value: 'field', label: 'التنفيذ الميداني' },
  { value: 'admin', label: 'الإدارة' },
  { value: 'other', label: 'أخرى' },
];

interface FormData {
  type: string;
  full_name: string;
  phone: string;
  email: string;
  subject: string;
  description: string;
  department: string;
}

const INITIAL_FORM: FormData = { type: '', full_name: '', phone: '', email: '', subject: '', description: '', department: '' };

export const ComplaintsSuggestionPage = memo(function ComplaintsSuggestionPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [entryNumber, setEntryNumber] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!form.type) e.type = 'اختر النوع';
    if (!form.full_name.trim()) e.full_name = 'الاسم مطلوب';
    if (!form.phone.trim() && !form.email.trim()) e.phone = 'أدخل هاتف أو بريد';
    if (!form.subject.trim()) e.subject = 'الموضوع مطلوب';
    if (!form.description.trim()) e.description = 'الوصف مطلوب';
    else if (form.description.trim().length < 10) e.description = 'الوصف قصير (١٠ أحرف على الأقل)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await servicesDBService.submitFeedback({
      type: form.type,
      full_name: form.full_name.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      subject: form.subject.trim(),
      description: form.description.trim(),
      department: form.department || undefined,
    });
    setSubmitting(false);
    if (result.success) {
      setEntryNumber(result.entry_number || 0);
      setSubmitted(true);
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] py-24" dir="rtl">
        <div className="mx-auto max-w-lg px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <CheckCircle2 className="mx-auto h-20 w-20 text-[var(--brand-green)]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="mt-6 text-3xl font-bold text-[var(--foreground)]">تم استلام ملاحظتك</h1>
            <p className="mt-4 text-[var(--muted-foreground)]">رقم التتبع: <span className="font-bold text-[var(--brand-green)]">#{entryNumber}</span></p>
            <p className="mt-2 text-[var(--muted-foreground)]">نلتزم بالرد خلال ٣ أيام عمل</p>
            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-right">
              <h3 className="font-bold text-[var(--foreground)]">التزاماتنا تجاهك</h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>✓ تأكيد الاستلام خلال ٢٤ ساعة</li>
                <li>✓ رد أولي خلال ٣ أيام عمل</li>
                <li>✓ حل نهائي خلال ١٤ يوم</li>
                <li>✓ إمكانية تتبع الحالة عبر التواصل المباشر</li>
              </ul>
            </div>
            <button onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); }} className="mt-8 rounded-xl bg-[var(--brand-green)] px-8 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
              إرسال ملاحظة أخرى
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-24" dir="rtl">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-gold)]">
            <MessageSquareWarning className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-[var(--foreground)]">شكاوى ومقترحات</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">صوتك مسموع — نلتزم بالاستجابة السريعة لجميع الملاحظات</p>
        </motion.div>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          {/* Type Selection */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">نوع الرسالة *</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FEEDBACK_TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => update('type', t.value)} className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all ${form.type === t.value ? 'border-[var(--brand-green)] bg-[var(--brand-green)]/10' : 'border-[var(--border)] hover:border-[var(--brand-green)]/50'}`}>
                  <t.icon className={`h-6 w-6 ${form.type === t.value ? 'text-[var(--brand-green)]' : 'text-[var(--muted-foreground)]'}`} />
                  <span className="text-xs font-bold text-[var(--foreground)]">{t.label}</span>
                  <span className="text-[0.6rem] text-[var(--muted-foreground)]">{t.desc}</span>
                </button>
              ))}
            </div>
            {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">الاسم الكامل *</label>
                <input type="text" value={form.full_name} onChange={e => update('full_name', e.target.value)} className={`w-full rounded-xl border ${errors.full_name ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none`} placeholder="الاسم" />
                {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">رقم الهاتف</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className={`w-full rounded-xl border ${errors.phone ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none`} placeholder="770123456" dir="ltr" />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">البريد الإلكتروني</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none" dir="ltr" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">القسم المعني</label>
                <select value={form.department} onChange={e => update('department', e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none">
                  <option value="">اختر القسم</option>
                  {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">الموضوع *</label>
              <input type="text" value={form.subject} onChange={e => update('subject', e.target.value)} className={`w-full rounded-xl border ${errors.subject ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none`} placeholder="موضوع الرسالة" />
              {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">التفاصيل *</label>
              <textarea rows={5} value={form.description} onChange={e => update('description', e.target.value)} className={`w-full rounded-xl border ${errors.description ? 'border-red-500' : 'border-[var(--border)]'} bg-[var(--background)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--brand-green)] focus:outline-none resize-none`} placeholder="اشرح تفاصيل شكواك أو اقتراحك..." />
              <div className="mt-1 flex justify-between text-xs">
                {errors.description ? <p className="text-red-500">{errors.description}</p> : <span />}
                <span className="text-[var(--muted-foreground)]">{form.description.length}/١٠٠٠</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/5 p-4">
            <Shield className="h-5 w-5 shrink-0 text-[var(--brand-green)]" />
            <p className="text-sm text-[var(--muted-foreground)]">جميع الرسائل سرية ونلتزم بالرد عليها في الوقت المحدد</p>
          </div>

          <button onClick={handleSubmit} disabled={submitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-green)] py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50">
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> جاري الإرسال...</> : <><Send className="h-4 w-4" /> إرسال</>}
          </button>
        </div>

        {/* Commitments */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, title: 'رد سريع', desc: 'نلتزم بالرد خلال ٣ أيام عمل', color: 'bg-blue-500' },
            { icon: Shield, title: 'سرية تامة', desc: 'جميع الرسائل سرية ومحمية', color: 'bg-[var(--brand-green)]' },
            { icon: Phone, title: 'تواصل مباشر', desc: 'للتواصل العاجل: ٧٨٠ ٧٧٧ ٠٠٧+', color: 'bg-amber-500' },
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
