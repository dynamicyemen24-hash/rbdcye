import { motion } from "motion/react";
import { useState } from "react";
import { CheckCircle2, Clock3, Headphones, Mail, MessageSquare, Phone, Search, Send, ShieldCheck } from "lucide-react";

import { contactApi } from "@/shared/services/api.service";
import { useSEO } from "@/utils/seoAdvanced";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function MessagesPage() {
  useSEO({ title: "مركز الرسائل | رحماء بينهم", description: "أرسل رسالتك إلى رحماء بينهم وتابع طلبك بوضوح واحترام." });
  const [form, setForm] = useState(initialForm);
  const [requestId, setRequestId] = useState("");
  const [sentId, setSentId] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [tracking, setTracking] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await contactApi.send({ ...form, type: "general" });
      const id = String((response.data as { id?: string } | undefined)?.id || `REQ-${Date.now().toString().slice(-6)}`);
      setSentId(id);
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  return <div className="min-h-screen bg-[var(--background)] pt-24 text-[var(--brand-ink)]" dir="rtl">
    <section className="bg-[var(--brand-green)] px-5 py-14 text-white sm:px-8 lg:px-10"><div className="mx-auto max-w-6xl"><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[var(--brand-gold)]"><MessageSquare className="h-4 w-4" /> مركز الرسائل والمتابعة</div><h1 className="mt-6 max-w-2xl text-3xl font-extrabold leading-[1.4] sm:text-5xl">رسالتك تصل إلى الفريق <span className="text-[var(--brand-gold)]">باحترام ووضوح.</span></h1><p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">للاستفسار أو الشراكة أو متابعة طلب، أرسل رسالة واحدة واحفظ رقم المتابعة الخاص بك.</p></div></section>
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.38fr] lg:px-10">
      <section className="rounded-[28px] border border-[var(--brand-green)]/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,76,58,.07)] sm:p-8"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--brand-green)]/8 pb-5"><div><p className="text-xs font-bold text-[var(--brand-gold-dark)]">تواصل مباشر</p><h2 className="mt-2 text-2xl font-extrabold text-[var(--brand-green)]">أرسل رسالة جديدة</h2></div><div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><ShieldCheck className="h-4 w-4 text-[var(--brand-green)]" /> بياناتك تعامل بسرية</div></div>
        {status === "success" ? <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-2xl border border-[var(--success)]/25 bg-[var(--brand-green-pale)] p-6"><CheckCircle2 className="h-8 w-8 text-[var(--success)]" /><h3 className="mt-4 text-xl font-extrabold text-[var(--brand-green)]">تم استلام رسالتك</h3><p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">رقم المتابعة الخاص بك هو <strong className="text-[var(--brand-green)]">{sentId}</strong>. احتفظ به للاستفسار عن حالة الطلب.</p><button type="button" onClick={() => setStatus("idle")} className="mt-5 rounded-xl bg-[var(--brand-green)] px-4 py-3 text-xs font-bold text-white">إرسال رسالة أخرى</button></motion.div> : <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="الاسم الكامل" value={form.name} required onChange={(value) => setForm({ ...form, name: value })} /><Field label="البريد الإلكتروني" type="email" value={form.email} required onChange={(value) => setForm({ ...form, email: value })} /><Field label="رقم الهاتف" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} /><Field label="موضوع الرسالة" value={form.subject} required onChange={(value) => setForm({ ...form, subject: value })} /><label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold text-[var(--brand-green)]">نص الرسالة</span><textarea required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows={6} className="w-full rounded-2xl border border-[var(--brand-green)]/12 bg-[var(--brand-green-pale)] p-4 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-4 focus:ring-[var(--brand-green)]/10" placeholder="اكتب رسالتك باختصار ووضوح..." /></label><div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center"><button disabled={status === "sending"} type="submit" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--brand-green)] text-sm font-extrabold text-white transition hover:bg-[var(--brand-green-light)] disabled:opacity-60"><Send className="h-4 w-4" />{status === "sending" ? "جارٍ الإرسال..." : "إرسال الرسالة"}</button>{status === "error" && <p className="text-xs font-bold text-[var(--destructive)]">تعذر الإرسال الآن. حاول مجددًا أو تواصل عبر الهاتف.</p>}</div></form>}
      </section>
      <aside className="space-y-4"><div className="rounded-[24px] border border-[var(--brand-green)]/10 bg-white p-6"><div className="flex items-center gap-3"><Search className="h-5 w-5 text-[var(--brand-gold-dark)]" /><h2 className="text-sm font-extrabold text-[var(--brand-green)]">تتبع طلبًا</h2></div><p className="mt-3 text-xs leading-6 text-[var(--muted-foreground)]">أدخل رقم المتابعة الذي وصلك بعد إرسال الرسالة.</p><input value={requestId} onChange={(event) => setRequestId(event.target.value)} className="mt-4 min-h-11 w-full rounded-xl border border-[var(--brand-green)]/12 bg-[var(--brand-green-pale)] px-3 text-sm outline-none focus:border-[var(--brand-green)]" placeholder="مثال: REQ-123456" /><button type="button" onClick={() => setTracking(true)} className="mt-3 w-full rounded-xl border border-[var(--brand-green)]/15 py-3 text-xs font-bold text-[var(--brand-green)]">بحث في حالة الطلب</button>{tracking && <p className="mt-3 rounded-xl bg-[var(--brand-gold-pale)] p-3 text-xs leading-5 text-[var(--brand-gold-dark)]">سيظهر التحديث عند ربط رقم الطلب بسجل المؤسسة. تأكد من كتابة الرقم كما وصل إليك.</p>}</div><div className="rounded-[24px] bg-[var(--brand-green)] p-6 text-white"><Headphones className="h-6 w-6 text-[var(--brand-gold)]" /><h2 className="mt-4 text-lg font-extrabold">قنوات أخرى</h2><div className="mt-5 space-y-4 text-xs text-white/65"><div className="flex items-center gap-3"><Mail className="h-4 w-4 text-[var(--brand-gold)]" /> info@rbdcye.org</div><div className="flex items-center gap-3"><Phone className="h-4 w-4 text-[var(--brand-gold)]" /> +967 777 000 482</div><div className="flex items-center gap-3"><Clock3 className="h-4 w-4 text-[var(--brand-gold)]" /> نتابع الرسائل خلال أوقات الدوام</div></div></div></aside>
    </main>
  </div>;
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label><span className="mb-2 block text-xs font-bold text-[var(--brand-green)]">{label}</span><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full rounded-2xl border border-[var(--brand-green)]/12 bg-[var(--brand-green-pale)] px-4 text-sm outline-none transition focus:border-[var(--brand-green)] focus:ring-4 focus:ring-[var(--brand-green)]/10" /></label>; }


