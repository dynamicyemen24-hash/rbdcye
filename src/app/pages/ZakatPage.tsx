import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  Coins,
  Gem,
  History,
  Info,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSEO } from "@/utils/seoAdvanced";

type ZakatMode = "money" | "gold" | "silver" | "fitr";

const GOLD_NISAB_GRAMS = 85;
const SILVER_NISAB_GRAMS = 595;
const ZAKAT_RATE = 0.025;

const formatNumber = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("ar-YE", { maximumFractionDigits }).format(Number.isFinite(value) ? value : 0);

const modes: Array<{ id: ZakatMode; title: string; description: string; icon: typeof Coins }> = [
  { id: "money", title: "زكاة المال", description: "النقد والمدخرات والذمم المرجوّة", icon: Coins },
  { id: "gold", title: "زكاة الذهب", description: "الوزن الخالص أو المكافئ الخالص", icon: Gem },
  { id: "silver", title: "زكاة الفضة", description: "وزن الفضة المملوك", icon: Landmark },
  { id: "fitr", title: "زكاة الفطر", description: "عدد الأشخاص وقيمة الصاع محليًا", icon: Users },
];

export default function ZakatPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ZakatMode>("money");
  const [cash, setCash] = useState(0);
  const [receivables, setReceivables] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [goldPrice, setGoldPrice] = useState(25000);
  const [goldWeight, setGoldWeight] = useState(0);
  const [silverWeight, setSilverWeight] = useState(0);
  const [fitrPeople, setFitrPeople] = useState(1);
  const [fitrValue, setFitrValue] = useState(1500);
  const [hasHawl, setHasHawl] = useState(true);
  const [result, setResult] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useSEO({
    title: "حاسبة الزكاة المعيارية | رحماء بينهم",
    description: "أداة إرشادية واضحة لحساب زكاة المال والذهب والفضة والفطر مع إظهار الفرضيات والنصاب.",
    keywords: ["حاسبة الزكاة", "زكاة المال", "زكاة الذهب", "زكاة الفطر", "رحماء بينهم"],
  });

  const moneyNisab = goldPrice * GOLD_NISAB_GRAMS;
  const moneyNet = Math.max(0, cash + receivables - liabilities);
  const nisabLabel = mode === "money" ? `${formatNumber(moneyNisab)} ر.ي` : mode === "gold" ? `${GOLD_NISAB_GRAMS} غرام` : mode === "silver" ? `${SILVER_NISAB_GRAMS} غرام` : `${formatNumber(fitrValue)} ر.ي / شخص`;

  const calculation = useMemo(() => {
    if (mode === "money") return { base: moneyNet, threshold: moneyNisab, eligible: hasHawl && moneyNet >= moneyNisab, unit: "ر.ي" };
    if (mode === "gold") return { base: goldWeight, threshold: GOLD_NISAB_GRAMS, eligible: hasHawl && goldWeight >= GOLD_NISAB_GRAMS, unit: "غرام" };
    if (mode === "silver") return { base: silverWeight, threshold: SILVER_NISAB_GRAMS, eligible: hasHawl && silverWeight >= SILVER_NISAB_GRAMS, unit: "غرام" };
    return { base: fitrPeople * fitrValue, threshold: fitrValue, eligible: fitrPeople > 0 && fitrValue > 0, unit: "ر.ي" };
  }, [mode, moneyNet, moneyNisab, goldWeight, silverWeight, fitrPeople, fitrValue, hasHawl]);

  const calculate = () => {
    const amount = mode === "fitr" ? fitrPeople * fitrValue : calculation.eligible ? calculation.base * ZAKAT_RATE : 0;
    setResult(amount);
    setSaved(false);
  };

  const saveCalculation = () => {
    if (result === null) return;
    const existing = JSON.parse(localStorage.getItem("rh_zakat_history") || "[]") as Array<Record<string, unknown>>;
    localStorage.setItem("rh_zakat_history", JSON.stringify([{ mode, amount: result, date: new Date().toISOString() }, ...existing].slice(0, 10)));
    setSaved(true);
  };

  const reset = () => {
    setCash(0); setReceivables(0); setLiabilities(0); setGoldWeight(0); setSilverWeight(0); setFitrPeople(1); setResult(null); setSaved(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] pt-24 text-[#14231F]" dir="rtl">
      <section className="relative overflow-hidden bg-[#0F4C3A] px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "var(--pattern-rub-el-hizb)", backgroundSize: "160px 160px" }} />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#E8C97B]"><Calculator className="h-4 w-4" /> أداة مساعدة مستقلة</div><h1 className="text-3xl font-extrabold leading-[1.35] sm:text-5xl">حاسبة الزكاة <span className="text-[#E8C97B]">بوضوح وأمانة.</span></h1><p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">احسب على أساس المدخلات التي تعرفها، وراجع النصاب والفرضيات قبل اعتماد النتيجة. الأداة إرشادية ولا تستبدل سؤال أهل العلم عند وجود تفاصيل خاصة.</p></div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]"><div className="rounded-2xl border border-white/10 bg-white/8 p-4"><div className="text-2xl font-extrabold text-[#E8C97B]">٢٫٥٪</div><div className="mt-1 text-xs text-white/55">زكاة المال عند تحقق الشروط</div></div><div className="rounded-2xl border border-white/10 bg-white/8 p-4"><div className="text-2xl font-extrabold text-[#E8C97B]">٨٥غ</div><div className="mt-1 text-xs text-white/55">مرجع نصاب الذهب</div></div></div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.36fr] lg:py-14 lg:px-10">
        <section className="rounded-[28px] border border-[#0F4C3A]/10 bg-white p-5 shadow-[0_20px_60px_rgba(15,76,58,.08)] sm:p-8">
          <div className="grid gap-2 sm:grid-cols-4">{modes.map(({ id, title, description, icon: Icon }) => <button key={id} type="button" onClick={() => { setMode(id); setResult(null); }} className={`rounded-2xl border p-4 text-right transition ${mode === id ? "border-[#0F4C3A] bg-[#0F4C3A] text-white shadow-lg" : "border-[#0F4C3A]/10 bg-[#FAFCF9] text-[#0F4C3A] hover:border-[#0F4C3A]/30"}`}><Icon className={`h-5 w-5 ${mode === id ? "text-[#E8C97B]" : "text-[#0F4C3A]"}`} /><span className="mt-3 block text-sm font-extrabold">{title}</span><span className={`mt-1 block text-[10px] leading-5 ${mode === id ? "text-white/55" : "text-[#687670]"}`}>{description}</span></button>)}</div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#0F4C3A]/8 pb-5"><div><p className="text-xs font-bold text-[#B78235]">النصاب المرجعي الحالي</p><p className="mt-2 text-xl font-extrabold text-[#0F4C3A]">{nisabLabel}</p></div><div className="flex items-center gap-2 rounded-xl bg-[#F4F8F5] px-3 py-2 text-xs text-[#687670]"><Info className="h-4 w-4 text-[#0F4C3A]" /> راجع الأسعار المحلية قبل الإخراج</div></div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {mode === "money" && <><Field label="النقد والمدخرات" suffix="ر.ي" value={cash} onChange={setCash} /><Field label="الذمم المرجوّة" suffix="ر.ي" value={receivables} onChange={setReceivables} /><Field label="الالتزامات الحالّة" suffix="ر.ي" value={liabilities} onChange={setLiabilities} /><Field label="سعر غرام الذهب المرجعي" suffix="ر.ي" value={goldPrice} onChange={setGoldPrice} /></>}
            {mode === "gold" && <><Field label="الوزن الخالص أو المكافئ الخالص" suffix="غرام" value={goldWeight} onChange={setGoldWeight} /><Field label="سعر غرام الذهب المرجعي" suffix="ر.ي" value={goldPrice} onChange={setGoldPrice} /></>}
            {mode === "silver" && <Field label="وزن الفضة المملوك" suffix="غرام" value={silverWeight} onChange={setSilverWeight} />}
            {mode === "fitr" && <><Field label="عدد الأشخاص" suffix="شخص" value={fitrPeople} onChange={setFitrPeople} min={1} /><Field label="قيمة زكاة الفطر للشخص" suffix="ر.ي" value={fitrValue} onChange={setFitrValue} /></>}
          </div>

          {mode !== "fitr" && <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl border border-[#0F4C3A]/10 bg-[#FAFCF9] p-4 text-sm font-bold text-[#0F4C3A]"><input type="checkbox" checked={hasHawl} onChange={(event) => setHasHawl(event.target.checked)} className="h-5 w-5 accent-[#0F4C3A]" /> حال على المال الحول الهجري الكامل <span className="mr-auto text-xs font-normal text-[#687670]">شرط إرشادي للحساب</span></label>}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={calculate} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0F4C3A] px-6 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#17694F]"><Calculator className="h-4 w-4" /> احسب النتيجة</button><button type="button" onClick={reset} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#0F4C3A]/15 px-5 text-sm font-bold text-[#0F4C3A] transition hover:bg-[#F4F8F5]"><RotateCcw className="h-4 w-4" /> إعادة ضبط</button></div>

          {result !== null && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-[24px] border border-[#C69E5A]/35 bg-[#FFFBF2] p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-sm font-bold text-[#9B6A24]"><CheckCircle2 className="h-5 w-5" /> النتيجة الإرشادية</div><div className="mt-3 text-4xl font-extrabold text-[#0F4C3A]">{formatNumber(result, 2)} <span className="text-base">ر.ي</span></div><p className="mt-2 text-xs leading-6 text-[#687670]">{mode === "fitr" ? `على أساس ${formatNumber(fitrPeople)} أشخاص × ${formatNumber(fitrValue)} ر.ي` : calculation.eligible ? `٢٫٥٪ من أصل ${formatNumber(calculation.base, 2)} ${calculation.unit}` : "لم يتحقق النصاب أو شرط الحول وفق المدخلات الحالية."}</p></div><button type="button" onClick={saveCalculation} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#0F4C3A]/15 bg-white px-4 text-xs font-bold text-[#0F4C3A]">{saved ? <CheckCircle2 className="h-4 w-4 text-[#4C9F7B]" /> : <History className="h-4 w-4" />} {saved ? "حُفظت العملية" : "حفظ في السجل"}</button></div></motion.div>}
        </section>

        <aside className="space-y-4"><div className="rounded-[24px] bg-[#0F4C3A] p-6 text-white"><ShieldCheck className="h-7 w-7 text-[#E8C97B]" /><h2 className="mt-5 text-lg font-extrabold">منهج الحساب</h2><p className="mt-3 text-xs leading-7 text-white/65">النصاب يُعرض بوضوح، والالتزامات الحالّة تُخصم من المال المدخل. لا تُخفي الأداة أي فرضية مؤثرة في النتيجة.</p><div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-xs text-white/70"><div className="flex justify-between"><span>معدل زكاة المال</span><strong className="text-[#E8C97B]">٢٫٥٪</strong></div><div className="flex justify-between"><span>نصاب الذهب</span><strong className="text-[#E8C97B]">٨٥ غ</strong></div><div className="flex justify-between"><span>نصاب الفضة</span><strong className="text-[#E8C97B]">٥٩٥ غ</strong></div></div></div><div className="rounded-[24px] border border-[#0F4C3A]/10 bg-white p-6"><div className="flex items-center gap-3"><BookOpen className="h-5 w-5 text-[#B78235]" /><h2 className="text-sm font-extrabold text-[#0F4C3A]">تنبيه مهم</h2></div><p className="mt-4 text-xs leading-7 text-[#687670]">هذه حاسبة إرشادية. في زكاة عروض التجارة، الأسهم، الديون، أو اختلاف الحول والنصاب، راجع عالمًا أو جهة شرعية موثوقة قبل الإخراج.</p><div className="mt-5 flex items-start gap-2 rounded-xl bg-[#FFF7E7] p-3 text-[11px] leading-5 text-[#76521D]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> سعر الذهب وقيمة الفطر قابلان للتعديل لأنهما يتغيران محليًا.</div></div><button type="button" onClick={() => navigate("/donate")} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#0F4C3A]/15 bg-[#F1F5F0] py-3 text-sm font-bold text-[#0F4C3A] transition hover:bg-[#E6EFE9]"><Sparkles className="h-4 w-4 text-[#B78235]" /> أخرج زكاتك عبر رحماء بينهم <ArrowLeft className="h-4 w-4" /></button></aside>
      </main>
    </div>
  );
}

function Field({ label, suffix, value, onChange, min = 0 }: { label: string; suffix: string; value: number; onChange: (value: number) => void; min?: number }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-[#0F4C3A]">{label}</span><div className="relative"><input type="number" min={min} value={value || ""} onChange={(event) => onChange(Math.max(min, Number(event.target.value) || 0))} className="min-h-12 w-full rounded-2xl border border-[#0F4C3A]/12 bg-[#FAFCF9] px-4 pl-16 text-sm font-bold text-[#14231F] outline-none transition focus:border-[#0F4C3A] focus:ring-4 focus:ring-[#0F4C3A]/10" placeholder="0" /><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#8B9A94]">{suffix}</span></div></label>;
}
