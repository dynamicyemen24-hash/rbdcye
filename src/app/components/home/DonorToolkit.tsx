// Donor Toolkit - صندوق أدوات المُحسِن المتقدم
// الأدوات الرئيسية (تبرع سريع + حاسبة زكاة) + شريط الأدوات المساعدة
// (تثبيت التطبيق PWA + حاسبة أثر مصغرة)
import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Heart, Calculator, Smartphone, Download, CheckCircle2, WifiOff,
  BellRing, Zap, ShoppingBasket, BookOpen, Droplets, ArrowLeft, Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Section, SectionHeader } from "@/app/components/layout/Section";
import { Reveal } from "@/app/components/layout/Reveal";
import { QuickDonation } from "@/app/components/QuickDonation";
import { usePwaInstall } from "@/shared/hooks/usePwaInstall";

const ZakatCalculator = lazy(() => import("@/app/components/ZakatCalculator").then(m => ({ default: m.ZakatCalculator })));

type ToolTab = "donation" | "zakat";

// ─── بطاقة تثبيت التطبيق ──────────────────────────────────
function InstallAppCard() {
  const { canInstall, promptInstall, isInstalled, isStandalone, isIOS } = usePwaInstall();
  const [showHint, setShowHint] = useState(false);
  const installed = isInstalled || isStandalone;

  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden text-white"
      style={{
        background: installed
          ? "linear-gradient(135deg, var(--brand-green), var(--brand-green-light))"
          : "linear-gradient(135deg, var(--brand-green-dark), var(--brand-green))",
      }}
    >
      <div className="absolute inset-0 pattern-khatam-white opacity-[0.08] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(var(--brand-gold-rgb),0.2)", border: "1px solid rgba(var(--brand-gold-rgb),0.4)" }}
          >
            <Smartphone className="w-5.5 h-5.5" style={{ color: "var(--brand-gold-light)" }} />
          </div>
          <div>
            <div className="font-extrabold" style={{ fontSize: "var(--fs-body)" }}>تطبيق رحماء بينهم</div>
            <div className="text-white/70" style={{ fontSize: "var(--fs-xs)" }}>
              {installed ? "مثبّت على جهازك" : "مجاني · دون متجر التطبيقات"}
            </div>
          </div>
        </div>

        {installed ? (
          <div className="flex items-center gap-2 text-sm" style={{ color: "var(--brand-gold-light)" }}>
            <CheckCircle2 className="w-4 h-4" />
            تستمتع بالتجربة الكاملة عبر التطبيق
          </div>
        ) : (
          <>
            <ul className="space-y-1.5 mb-4 text-white/80" style={{ fontSize: "var(--fs-xs)" }}>
              <li className="flex items-center gap-2"><BellRing className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--brand-gold)" }} />إشعارات الحملات العاجلة</li>
              <li className="flex items-center gap-2"><WifiOff className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--brand-gold)" }} />تصفح يعمل حتى دون اتصال</li>
              <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--brand-gold)" }} />تبرع بثلاث نقرات فقط</li>
            </ul>

            <button
              onClick={async () => {
                if (canInstall) {
                  await promptInstall();
                } else {
                  setShowHint((s) => !s);
                }
              }}
              className="w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold))",
                color: "#FFFFFF",
                fontSize: "var(--fs-sm)",
              }}
            >
              <Download className="w-4 h-4" />
              ثبّت التطبيق الآن
            </button>

            <AnimatePresence>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-white/75 leading-relaxed overflow-hidden mt-3"
                  style={{ fontSize: "var(--fs-xs)" }}
                >
                  {isIOS
                    ? 'على آيفون: اضغط زر المشاركة ثم اختر "إضافة إلى الشاشة الرئيسية".'
                    : 'من قائمة المتصفح اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".'}
                </motion.p>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

// ─── حاسبة الأثر المصغرة ──────────────────────────────────
const AMOUNTS = [10, 25, 50, 100, 250];

function ImpactEstimatorCard() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(50);

  const equivalents = [
    { icon: ShoppingBasket, per: 25, label: "سلة غذائية تكفي أسرة شهراً", color: "var(--brand-green)" },
    { icon: BookOpen, per: 15, label: "حقيبة مدرسية لطالب", color: "var(--brand-gold)" },
    { icon: Droplets, per: 150, label: "حصة في حفر بئر يروي قرية", color: "var(--brand-green-light)" },
  ].map((e) => ({ ...e, count: Math.floor(amount / e.per) }));

  return (
    <div className="rounded-2xl p-5 bg-white border border-[var(--border)] shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--brand-gold-pale)", border: "1px solid rgba(var(--brand-gold-rgb),0.35)" }}
        >
          <Calculator className="w-5.5 h-5.5" style={{ color: "var(--brand-gold)" }} />
        </div>
        <div>
          <div className="font-extrabold" style={{ fontSize: "var(--fs-body)", color: "var(--foreground)" }}>كم يساوي تبرعك؟</div>
          <div style={{ fontSize: "var(--fs-xs)", color: "var(--muted-foreground)" }}>جرّب المبالغ وشاهد الأثر فوراً</div>
        </div>
      </div>

      {/* شرائح المبالغ */}
      <div className="flex flex-wrap gap-2 mb-4">
        {AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => setAmount(a)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${amount === a ? "scale-105" : "hover:scale-105"}`}
            style={{
              fontSize: "var(--fs-sm)",
              background: amount === a ? "linear-gradient(135deg, var(--brand-green), var(--brand-green-light))" : "var(--muted)",
              color: amount === a ? "#FFFFFF" : "var(--muted-foreground)",
              boxShadow: amount === a ? "0 6px 16px rgba(15,76,58,0.25)" : "none",
            }}
          >
            {a.toLocaleString("ar-SA")}$
          </button>
        ))}
      </div>

      {/* المكافئات */}
      <div className="space-y-2 mb-4">
        {equivalents.map((e) =>
          e.count > 0 ? (
            <motion.div
              key={e.label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2"
              style={{ background: `${e.color}0D` }}
            >
              <e.icon className="w-4 h-4 shrink-0" style={{ color: e.color }} />
              <span className="font-bold tabular-nums" style={{ color: e.color, fontSize: "var(--fs-sm)" }}>
                {e.count.toLocaleString("ar-SA")}
              </span>
              <span className="truncate" style={{ fontSize: "var(--fs-xs)", color: "var(--muted-foreground)" }}>{e.label}</span>
            </motion.div>
          ) : null
        )}
      </div>

      <button
        onClick={() => navigate("/donate")}
        className="w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          border: "1.5px solid var(--brand-green)",
          color: "var(--brand-green)",
          fontSize: "var(--fs-sm)",
        }}
      >
        حقّق هذا الأثر الآن
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── المكوّن الرئيسي ──────────────────────────────────────
export function DonorToolkit() {
  const [tab, setTab] = useState<ToolTab>("donation");

  const tabs: { id: ToolTab; label: string; icon: typeof Heart }[] = [
    { id: "donation", label: "تبرع سريع", icon: Heart },
    { id: "zakat", label: "حاسبة الزكاة", icon: Calculator },
  ];

  return (
    <Section tone="gradient" pattern="khatam" id="quick-donation">
      <SectionHeader
        badge="صندوق أدوات المُحسِن"
        badgeIcon={Wrench}
        title="أدوات ذكية تُقرب"
        highlight="أثرك من يدٍ إلى يد"
        subtitle="كل ما تحتاجه لتحويل نيتك إلى أثر موثّق في مكان واحد: تبرع فوري، زكاة محسوبة شرعاً، وتطبيق في جيبك"
      />

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {/* الأدوات الرئيسية */}
        <Reveal className="lg:col-span-2">
          <div className="rounded-3xl overflow-hidden bg-white border border-[var(--border)] shadow-xl h-full flex flex-col">
            {/* شريط التبويبات */}
            <div className="flex border-b border-[var(--border)]" role="tablist" aria-label="الأدوات الرئيسية">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex-1 py-4 px-6 text-center font-bold transition-colors flex items-center justify-center gap-2 ${
                    tab === t.id ? "text-[var(--brand-green)]" : "text-[var(--muted-foreground)] hover:text-[var(--brand-green)]"
                  }`}
                  style={{ fontSize: "var(--fs-body)" }}
                >
                  <t.icon className="w-4.5 h-4.5" />
                  {t.label}
                  {tab === t.id && (
                    <motion.span
                      layoutId="toolkit-tab"
                      className="absolute bottom-0 inset-x-8 h-0.5 rounded-full"
                      style={{ background: "linear-gradient(to left, var(--brand-gold), var(--brand-green))" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* المحتوى المتحرك */}
            <div className="p-5 md:p-6 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 14 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {tab === "donation" ? (
                    <QuickDonation embedded />
                  ) : (
                    <Suspense fallback={<div className="skeleton-pulse rounded-2xl min-h-[420px]" aria-hidden="true" />}>
                      <ZakatCalculator />
                    </Suspense>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* شريط الأدوات المساعدة */}
        <div className="flex flex-col gap-5">
          <Reveal delay={0.12}>
            <InstallAppCard />
          </Reveal>
          <Reveal delay={0.22} className="flex-1">
            <ImpactEstimatorCard />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}


