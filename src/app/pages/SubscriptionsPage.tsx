import { motion } from "motion/react";
import { BellRing, CheckCircle2, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";

import { subscribersApi } from "@/shared/services/api.service";
import { useSEO } from "@/utils/seoAdvanced";

const topics = ["تقارير الأثر", "فرص التبرع", "قصص المستفيدين", "التطوع والشراكات"];

export default function SubscriptionsPage() {
  useSEO({ title: "الاشتراكات والتحديثات | رحماء بينهم", description: "اشترك في تحديثات رحماء بينهم واختر ما يهمك من قصص الأثر وفرص المشاركة." });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(topics);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      await subscribersApi.subscribe({ email, name, country: "YE", topics: selectedTopics, consent: true });
      localStorage.setItem("rh_subscription", JSON.stringify({ email, name, topics: selectedTopics, updatedAt: new Date().toISOString() }));
      setStatus("success");
    } catch { setStatus("error"); }
  };

  const toggleTopic = (topic: string) => setSelectedTopics((current) => current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]);

  return <div className="min-h-screen bg-[#F7F8F5] pt-24 text-[#14231F]" dir="rtl">
    <section className="relative overflow-hidden bg-[#0F4C3A] px-5 py-16 text-white sm:px-8 lg:px-10"><div className="absolute -left-20 -top-28 h-72 w-72 rounded-full bg-[#C69E5A]/15 blur-3xl" /><div className="relative mx-auto max-w-6xl"><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#E8C97B]"><BellRing className="h-4 w-4" /> مركز الاشتراكات</div><h1 className="mt-6 max-w-2xl text-3xl font-extrabold leading-[1.4] sm:text-5xl">ابق قريبًا من <span className="text-[#E8C97B]">الأثر.</span></h1><p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">اختر نوع التحديثات التي تهمك، وسنرسل لك أخبار المؤسسة وتقارير أثرها دون إغراق بريدك.</p></div></section>
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.42fr] lg:px-10"><section className="rounded-[28px] border border-[#0F4C3A]/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,76,58,.07)] sm:p-8">{status === "success" ? <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[360px] flex-col items-center justify-center text-center"><div className="grid h-20 w-20 place-items-center rounded-full bg-[#F1FAF4]"><CheckCircle2 className="h-10 w-10 text-[#2F8C63]" /></div><h2 className="mt-6 text-2xl font-extrabold text-[#0F4C3A]">تم تأكيد اشتراكك</h2><p className="mt-3 max-w-md text-sm leading-7 text-[#687670]">سنرسل التحديثات إلى {email}. يمكنك تعديل تفضيلاتك من الرسائل القادمة أو التواصل معنا.</p><button type="button" onClick={() => setStatus("idle")} className="mt-6 rounded-xl border border-[#0F4C3A]/15 px-5 py-3 text-xs font-bold text-[#0F4C3A]">تحديث بيانات الاشتراك</button></motion.div> : <><div className="flex items-end justify-between gap-4 border-b border-[#0F4C3A]/8 pb-5"><div><p className="text-xs font-bold text-[#B78235]">تحديثات منتقاة</p><h2 className="mt-2 text-2xl font-extrabold text-[#0F4C3A]">أنشئ تفضيلاتك</h2></div><Sparkles className="h-7 w-7 text-[#C69E5A]" /></div><form onSubmit={submit} className="mt-7 space-y-6"><div className="grid gap-5 sm:grid-cols-2"><Field icon={UserRound} label="الاسم" value={name} onChange={setName} /><Field icon={Mail} label="البريد الإلكتروني" type="email" required value={email} onChange={setEmail} /></div><fieldset><legend className="mb-3 text-xs font-extrabold text-[#0F4C3A]">ما الذي ترغب في متابعته؟</legend><div className="grid gap-3 sm:grid-cols-2">{topics.map((topic) => <label key={topic} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm font-bold transition ${selectedTopics.includes(topic) ? "border-[#0F4C3A]/25 bg-[#F1F7F2] text-[#0F4C3A]" : "border-[#0F4C3A]/10 text-[#687670]"}`}><input type="checkbox" checked={selectedTopics.includes(topic)} onChange={() => toggleTopic(topic)} className="h-4 w-4 accent-[#0F4C3A]" />{topic}</label>)}</div></fieldset><label className="flex items-start gap-3 rounded-2xl bg-[#FAFCF9] p-4 text-xs leading-6 text-[#687670]"><input required type="checkbox" className="mt-1 h-4 w-4 accent-[#0F4C3A]" /> أوافق على استقبال تحديثات رحماء بينهم، ويمكنني إلغاء الاشتراك في أي وقت.</label><button disabled={status === "sending"} type="submit" className="min-h-12 w-full rounded-2xl bg-[#0F4C3A] text-sm font-extrabold text-white transition hover:bg-[#17694F] disabled:opacity-60">{status === "sending" ? "جارٍ حفظ الاشتراك..." : "تأكيد الاشتراك"}</button>{status === "error" && <p className="text-center text-xs font-bold text-red-600">تعذر حفظ الاشتراك الآن. حاول مرة أخرى.</p>}</form></>}</section><aside className="space-y-4"><div className="rounded-[24px] bg-[#0F4C3A] p-6 text-white"><ShieldCheck className="h-7 w-7 text-[#E8C97B]" /><h2 className="mt-5 text-lg font-extrabold">رسائل قليلة، قيمة أكبر</h2><p className="mt-3 text-xs leading-7 text-white/65">نستخدم بيانات اشتراكك لإرسال النوع الذي اخترته فقط، ولا نبيع قوائم المشتركين أو نشاركها لأغراض تجارية.</p></div><div className="rounded-[24px] border border-[#0F4C3A]/10 bg-white p-6"><h2 className="text-sm font-extrabold text-[#0F4C3A]">ما الذي يصلك؟</h2><div className="mt-4 space-y-3 text-xs leading-6 text-[#687670]"><p>ملخصات أثر قابلة للقراءة والمشاركة.</p><p>فرص تبرع مرتبطة باحتياج واضح.</p><p>دعوات تطوع وشراكات ذات معنى.</p></div></div></aside></main>
  </div>;
}

function Field({ icon: Icon, label, value, onChange, type = "text", required = false }: { icon: typeof Mail; label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label><span className="mb-2 block text-xs font-bold text-[#0F4C3A]">{label}</span><div className="relative"><Icon className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B78235]" /><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full rounded-2xl border border-[#0F4C3A]/12 bg-[#FAFCF9] px-4 pr-11 text-sm outline-none transition focus:border-[#0F4C3A] focus:ring-4 focus:ring-[#0F4C3A]/10" /></div></label>; }
