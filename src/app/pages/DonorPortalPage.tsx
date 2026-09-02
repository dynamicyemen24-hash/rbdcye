import {
  Bell,
  Heart,
  History,
  MessageSquare,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import DonorPortal from "@/app/components/DonorPortal";
import { useSEO } from "@/utils/seoAdvanced";

const portalLinks = [
  { label: "سجل التبرعات", description: "إيصالاتك وحالات العمليات", icon: History, tab: "history" },
  { label: "أثر مساهمتك", description: "قصص ومؤشرات من الميدان", icon: Sparkles, tab: "impact" },
  { label: "الإشعارات", description: "تحديثات الطلبات والحملات", icon: Bell, tab: "notifications" },
  {
    label: "تفضيلات الحساب",
    description: "اللغة والتنبيهات والخصوصية",
    icon: Settings2,
    tab: "settings",
  },
];

export default function DonorPortalPage() {
  const navigate = useNavigate();
  useSEO({
    title: "بوابة المتبرع | رحماء بينهم",
    description: "مساحة شخصية لمتابعة التبرعات والإيصالات والأثر والتفضيلات.",
  });

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 text-[var(--brand-ink)]" dir="rtl">
      <section className="bg-[var(--brand-green)] px-5 py-12 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[var(--brand-gold)]">
                <UserRound className="h-4 w-4" /> مساحة المتبرع الشخصية
              </div>
              <h1 className="mt-5 text-3xl font-extrabold sm:text-5xl">
                تابع عطاؤك، <span className="text-[var(--brand-gold)]">واشهد أثره.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                بوابة مستقلة تجمع سجل التبرعات، الإيصالات، قصص الأثر، والإشعارات في مكان واحد.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-xs text-white/70">
              <ShieldCheck className="h-5 w-5 text-[var(--brand-gold)]" /> حسابك وبياناتك في مساحة
              محمية
            </div>
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {portalLinks.map(({ label, description, icon: Icon, tab }) => (
            <button
              key={tab}
              type="button"
              onClick={() => navigate(`/donor?view=${tab}`)}
              className="group rounded-2xl border border-[var(--brand-green)]/10 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-[var(--brand-green)]/25 hover:shadow-lg"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-green-pale)] text-[var(--brand-green)] transition group-hover:bg-[var(--brand-green)] group-hover:text-[var(--brand-gold)]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="mt-4 block text-sm font-extrabold text-[var(--brand-green)]">
                {label}
              </span>
              <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
                {description}
              </span>
            </button>
          ))}
        </div>
        <div
          id="donor-portal-overview"
          className="overflow-hidden rounded-[30px] border border-[var(--brand-green)]/10 bg-white shadow-[0_20px_60px_rgba(15,76,58,.08)]"
        >
          <DonorPortal />
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/messages")}
            className="flex items-center gap-4 rounded-2xl border border-[var(--brand-green)]/10 bg-white p-5 text-right transition hover:border-[var(--brand-green)]/25"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-green-pale)] text-[var(--brand-green)]">
              <MessageSquare className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-sm text-[var(--brand-green)]">تحتاج مساعدة؟</strong>
              <small className="mt-1 block text-xs text-[var(--muted-foreground)]">
                أرسل رسالة إلى فريق المتابعة
              </small>
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/subscribe")}
            className="flex items-center gap-4 rounded-2xl border border-[var(--brand-green)]/10 bg-white p-5 text-right transition hover:border-[var(--brand-green)]/25"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-gold-pale)] text-[var(--brand-gold-dark)]">
              <Heart className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-sm text-[var(--brand-green)]">تحديثات الأثر</strong>
              <small className="mt-1 block text-xs text-[var(--muted-foreground)]">
                اختر ما ترغب في متابعته من أخبار المؤسسة
              </small>
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
