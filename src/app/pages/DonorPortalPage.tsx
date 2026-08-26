import { Bell, Heart, History, MessageSquare, Settings2, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DonorPortal from "@/app/components/DonorPortal";
import { useSEO } from "@/utils/seoAdvanced";

const portalLinks = [
  { label: "سجل التبرعات", description: "إيصالاتك وحالات العمليات", icon: History, tab: "history" },
  { label: "أثر مساهمتك", description: "قصص ومؤشرات من الميدان", icon: Sparkles, tab: "impact" },
  { label: "الإشعارات", description: "تحديثات الطلبات والحملات", icon: Bell, tab: "notifications" },
  { label: "تفضيلات الحساب", description: "اللغة والتنبيهات والخصوصية", icon: Settings2, tab: "settings" },
];

export default function DonorPortalPage() {
  const navigate = useNavigate();
  useSEO({ title: "بوابة المتبرع | رحماء بينهم", description: "مساحة شخصية لمتابعة التبرعات والإيصالات والأثر والتفضيلات." });

  return <div className="min-h-screen bg-[#F7F8F5] pt-24 text-[#14231F]" dir="rtl">
    <section className="bg-[#0F4C3A] px-5 py-12 text-white sm:px-8 lg:px-10"><div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#E8C97B]"><UserRound className="h-4 w-4" /> مساحة المتبرع الشخصية</div><h1 className="mt-5 text-3xl font-extrabold sm:text-5xl">تابع عطاؤك، <span className="text-[#E8C97B]">واشهد أثره.</span></h1><p className="mt-4 max-w-xl text-sm leading-7 text-white/65">بوابة مستقلة تجمع سجل التبرعات، الإيصالات، قصص الأثر، والإشعارات في مكان واحد.</p></div><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-xs text-white/70"><ShieldCheck className="h-5 w-5 text-[#E8C97B]" /> حسابك وبياناتك في مساحة محمية</div></div></div></section>
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10"><div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{portalLinks.map(({ label, description, icon: Icon, tab }) => <button key={tab} type="button" onClick={() => navigate(`/donor?view=${tab}`)} className="group rounded-2xl border border-[#0F4C3A]/10 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-[#0F4C3A]/25 hover:shadow-lg"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F1F7F2] text-[#0F4C3A] transition group-hover:bg-[#0F4C3A] group-hover:text-[#E8C97B]"><Icon className="h-5 w-5" /></span><span className="mt-4 block text-sm font-extrabold text-[#0F4C3A]">{label}</span><span className="mt-1 block text-xs text-[#687670]">{description}</span></button>)}</div><div id="donor-portal-overview" className="overflow-hidden rounded-[30px] border border-[#0F4C3A]/10 bg-white shadow-[0_20px_60px_rgba(15,76,58,.08)]"><DonorPortal /></div><div className="mt-8 grid gap-4 md:grid-cols-2"><button type="button" onClick={() => navigate("/messages")} className="flex items-center gap-4 rounded-2xl border border-[#0F4C3A]/10 bg-white p-5 text-right transition hover:border-[#0F4C3A]/25"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F1F7F2] text-[#0F4C3A]"><MessageSquare className="h-5 w-5" /></span><span><strong className="block text-sm text-[#0F4C3A]">تحتاج مساعدة؟</strong><small className="mt-1 block text-xs text-[#687670]">أرسل رسالة إلى فريق المتابعة</small></span></button><button type="button" onClick={() => navigate("/subscribe")} className="flex items-center gap-4 rounded-2xl border border-[#0F4C3A]/10 bg-white p-5 text-right transition hover:border-[#0F4C3A]/25"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF7E7] text-[#9B6A24]"><Heart className="h-5 w-5" /></span><span><strong className="block text-sm text-[#0F4C3A]">تحديثات الأثر</strong><small className="mt-1 block text-xs text-[#687670]">اختر ما ترغب في متابعته من أخبار المؤسسة</small></span></button></div></main>
  </div>;
}
