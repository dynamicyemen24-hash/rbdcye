import { motion } from "motion/react";
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Check,
  ChevronLeft,
  Droplets,
  HandHeart,
  Heart,
  Landmark,
  MapPin,
  MessageCircle,
  MoveUpLeft,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSEO } from "@/utils/seoAdvanced";

interface HomePageProps {
  setCurrentPage?: (page: string) => void;
}

type IconComponent = typeof Heart;

const programs = [
  {
    id: "relief",
    title: "الإغاثة وسبل العيش",
    shortTitle: "إغاثة كريمة",
    description: "استجابة تحفظ كرامة الأسرة وتمنحها بداية أكثر أمانًا، من الغذاء العاجل إلى فرص الدخل المستدام.",
    image: "/images/defaults/project-relief.svg",
    icon: Utensils,
    accent: "#B96B3F",
    stat: "٨٠٠+",
    statLabel: "سلة غذائية",
  },
  {
    id: "water",
    title: "المياه والإصحاح البيئي",
    shortTitle: "ماء للحياة",
    description: "نصل بالمياه النظيفة إلى القرى الأشد احتياجًا عبر حلول عملية تعمل بالطاقة الشمسية وتدوم طويلًا.",
    image: "/images/defaults/project-water.svg",
    icon: Droplets,
    accent: "#167A8A",
    stat: "١٠",
    statLabel: "قرى مستفيدة",
  },
  {
    id: "education",
    title: "التعليم والتمكين",
    shortTitle: "تعليم يفتح الأبواب",
    description: "نستثمر في الإنسان؛ حقائب مدرسية، تدريب مهني، وتمكين اقتصادي يوسّع مساحة الأمل والعمل.",
    image: "/images/defaults/project-education.svg",
    icon: BookOpen,
    accent: "#7B5B9E",
    stat: "٥٠٠+",
    statLabel: "طالب وطالبة",
  },
];

const impactStats = [
  { value: "١٢٬٨٤٧", label: "مستفيدًا وصل إليهم الأثر", icon: Users },
  { value: "٢٤", label: "مشروعًا في مسارات متعددة", icon: BarChart3 },
  { value: "٤٨", label: "شريكًا وداعمًا للعمل", icon: HandHeart },
  { value: "٣٢٠", label: "متطوعًا يصنعون الفرق", icon: Sparkles },
];

const principles = [
  { number: "٠١", title: "نبدأ من الاحتياج", text: "نصغي للمجتمع ونصمم التدخل المناسب للسياق المحلي، لا حلًا واحدًا للجميع." },
  { number: "٠٢", title: "نقيس الأثر", text: "نشارك نتائجنا بوضوح ونراجع مشاريعنا باستمرار حتى يصل الدعم إلى غايته." },
  { number: "٠٣", title: "نبني الاستدامة", text: "نحوّل الاستجابة العاجلة إلى قدرة محلية وفرصة يستمر أثرها بعد انتهاء المشروع." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function BrandSeal({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const styles = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-20 w-20",
  };

  return (
    <div className={`relative grid place-items-center rounded-[22px] bg-[#0F4C3A] text-[#E8C97B] shadow-[0_18px_38px_rgba(15,76,58,.18)] ${styles[size]}`} aria-hidden="true">
      <span className="absolute inset-[6px] rotate-45 rounded-[11px] border border-[#C69E5A]/80" />
      <span className="absolute inset-[11px] rounded-[8px] border border-[#C69E5A]/35" />
      <Heart className="relative h-1/2 w-1/2" fill="currentColor" strokeWidth={1.6} />
    </div>
  );
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`mb-4 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] ${light ? "text-[#E8C97B]" : "text-[#B78235]"}`}>
      <span className={`h-px w-8 ${light ? "bg-[#C69E5A]" : "bg-[#C69E5A]"}`} />
      <span>{children}</span>
      <span className={`h-1.5 w-1.5 rotate-45 ${light ? "bg-[#C69E5A]" : "bg-[#C69E5A]"}`} />
    </div>
  );
}

function PillButton({
  children,
  onClick,
  variant = "primary",
  icon: Icon = ArrowLeft,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "light" | "outline";
  icon?: IconComponent;
}) {
  const classes = {
    primary: "bg-[#D6A95D] text-[#14352B] shadow-[0_14px_30px_rgba(198,158,90,.24)] hover:bg-[#E8C97B]",
    light: "bg-white text-[#0F4C3A] shadow-[0_14px_30px_rgba(0,0,0,.14)] hover:bg-[#F7F2E7]",
    outline: "border border-[#0F4C3A]/15 bg-white text-[#0F4C3A] hover:border-[#0F4C3A]/35 hover:bg-[#F4F8F5]",
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl px-6 text-sm font-bold transition ${classes[variant]}`}
    >
      <span>{children}</span>
      <Icon className="h-4 w-4" />
    </motion.button>
  );
}

export function HomePage({ setCurrentPage }: HomePageProps) {
  const navigate = useNavigate();
  const [activeProgram, setActiveProgram] = useState(programs[0].id);

  useSEO({
    title: "رحماء بينهم | أثرٌ يحفظ الكرامة ويبني المستقبل",
    description: "مؤسسة رحماء بينهم للإغاثة والتنمية باليمن؛ نخفف المعاناة ونبني حلولًا مستدامة يقودها المجتمع.",
    type: "website",
    url: "https://rbdcye.org",
    keywords: ["رحماء بينهم", "إغاثة اليمن", "تنمية مستدامة", "تبرع", "مياه", "تعليم"],
    image: "https://rbdcye.org/og-image.png",
    author: { name: "مؤسسة رحماء بينهم", url: "https://rbdcye.org/about" },
  });

  const go = (page: string) => {
    if (setCurrentPage) {
      setCurrentPage(page);
    } else {
      navigate(page === "home" ? "/" : `/${page}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedProgram = programs.find((program) => program.id === activeProgram) ?? programs[0];
  const SelectedIcon = selectedProgram.icon;

  return (
    <div className="overflow-hidden bg-[#F7F8F5] text-[#14231F]" dir="rtl">
      <section className="relative isolate overflow-hidden bg-[#0B3B2D] text-white">
        <div className="absolute inset-0 z-0">
          <video
            className="h-full min-h-[760px] w-full object-cover opacity-30 mix-blend-screen"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/images/defaults/about-hero.svg"
            aria-hidden="true"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(5,30,22,.96)_4%,rgba(15,76,58,.87)_52%,rgba(15,76,58,.62)_100%)]" />
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "var(--pattern-rub-el-hizb)", backgroundSize: "150px 150px" }} />
          <div className="absolute -left-28 top-20 h-96 w-96 rounded-full bg-[#D6A95D]/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#4C9F7B]/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-12 pt-36 sm:px-8 lg:px-10 lg:pb-20 lg:pt-48">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.78fr]">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="max-w-2xl">
              <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/85 backdrop-blur-md">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#D6A95D] text-[#0F4C3A]"><BadgeCheck className="h-3.5 w-3.5" /></span>
                مؤسسة إنسانية تنموية مستقلة ومرخصة
              </motion.div>
              <motion.h1 variants={fadeUp} className="max-w-3xl text-4xl font-extrabold leading-[1.18] tracking-tight sm:text-6xl lg:text-[4.7rem]">
                حين تمتد اليد،
                <span className="block text-[#E8C97B]">يبدأ الأثر.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-7 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
                في رحماء بينهم، نخفف المعاناة اليوم ونبني قدرة المجتمع على الغد. عملٌ ميداني يضع الإنسان أولًا، ويحوّل العطاء إلى فرصة تحفظ الكرامة.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
                <PillButton onClick={() => go("donate")} variant="primary" icon={HandHeart}>ساهم في أثرٍ يدوم</PillButton>
                <PillButton onClick={() => go("projects")} variant="light" icon={ChevronLeft}>تعرّف على مشاريعنا</PillButton>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-10 flex items-center gap-4 text-xs text-white/60">
                <div className="flex -space-x-3 space-x-reverse">
                  {["/images/defaults/story-woman.svg", "/images/defaults/story-community.svg", "/images/defaults/story-man.svg"].map((image) => (
                    <img key={image} src={image} alt="" loading="lazy" className="h-9 w-9 rounded-full border-2 border-[#0F4C3A] bg-[#F7F8F5] object-cover" />
                  ))}
                </div>
                <span>مع شركاء ومتطوعين يؤمنون بأن الرحمة فعلٌ مستمر</span>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="relative mx-auto w-full max-w-[430px]">
              <div className="absolute -inset-4 rounded-[38px] border border-[#D6A95D]/20" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
                <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-[#D6A95D]/15 blur-2xl" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold tracking-[0.2em] text-[#E8C97B]">حكمة الأثر</span>
                    <Quote className="mt-4 h-7 w-7 text-[#D6A95D]" />
                  </div>
                  <BrandSeal size="sm" />
                </div>
                <p className="relative mt-6 text-xl font-semibold leading-[1.9] text-white">«مَن كان في حاجة أخيه كان الله في حاجته»</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-white/55">
                  <span>رواه البخاري ومسلم</span>
                  <span className="text-[#E8C97B]">رحمة • كرامة • أثر</span>
                </div>
              </div>
              <div className="relative mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-md">
                  <div className="text-2xl font-extrabold text-[#E8C97B]">١٢٬٨٤٧</div>
                  <div className="mt-1 text-xs text-white/55">مستفيدًا</div>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-md">
                  <div className="text-2xl font-extrabold text-[#E8C97B]">٢٤</div>
                  <div className="mt-1 text-xs text-white/55">مشروعًا</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 bg-[#082F24]/55 backdrop-blur-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-x-reverse divide-white/10 px-5 sm:grid-cols-4 sm:px-8 lg:px-10">
            {[
              ["١٤٣٠هـ", "عام التأسيس"],
              ["٢٤", "مشروعًا نشطًا"],
              ["٤٨", "شريكًا وداعمًا"],
              ["٣٢٠", "متطوعًا"],
            ].map(([value, label]) => (
              <div key={label} className="px-3 py-5 text-center sm:py-6">
                <div className="text-lg font-extrabold text-[#E8C97B] sm:text-2xl">{value}</div>
                <div className="mt-1 text-[11px] text-white/55 sm:text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main>
        <section className="border-b border-[#0F4C3A]/8 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F4EAD5] text-[#9B6A24]"><Landmark className="h-5 w-5" /></div>
              <div><p className="text-sm font-bold text-[#0F4C3A]">موثوقية تبدأ من الوضوح</p><p className="mt-0.5 text-xs text-[#687670]">مرخّصة برقم ٤٨٢ • نعمل وفق مبادئ الحوكمة والشفافية</p></div>
            </div>
            <button type="button" onClick={() => go("transparency")} className="group inline-flex items-center gap-2 self-start text-xs font-bold text-[#0F4C3A] transition hover:text-[#9B6A24] sm:self-auto"><span>اطّلع على تقاريرنا</span><ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" /></button>
          </div>
        </section>

        <section id="story" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1fr] lg:gap-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className="relative order-2 lg:order-1">
              <div className="absolute -right-5 -top-5 h-full w-full rounded-[34px] border border-[#D6A95D]/60" />
              <div className="relative overflow-hidden rounded-[30px] bg-[#EAF0EB] p-3">
                <img src="/images/defaults/story-community.svg" alt="فريق مجتمعي يعمل مع الأهالي" loading="lazy" className="h-[380px] w-full rounded-[23px] object-cover sm:h-[440px]" />
                <div className="absolute bottom-7 right-7 left-7 flex items-center justify-between rounded-2xl border border-white/50 bg-white/85 px-4 py-3 shadow-xl backdrop-blur-md">
                  <div><p className="text-sm font-bold text-[#0F4C3A]">الأثر يبدأ من المجتمع</p><p className="mt-1 text-[11px] text-[#687670]">شراكة حقيقية، لا مساعدة عابرة</p></div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0F4C3A] text-[#E8C97B]"><Users className="h-5 w-5" /></div>
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className="order-1 lg:order-2">
              <SectionLabel>قصتنا باختصار</SectionLabel>
              <h2 className="max-w-2xl text-3xl font-extrabold leading-[1.35] tracking-tight text-[#0F4C3A] sm:text-5xl">نصنع من الرحمة <span className="text-[#B78235]">منهجًا للعمل.</span></h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#687670]">رحماء بينهم مؤسسة إنسانية تنموية مستقلة تعمل في اليمن على تخفيف المعاناة، وتعزيز فرص التعلم والعمل، ودعم المجتمعات لتقود حلولها بنفسها.</p>
              <div className="mt-9 grid gap-5 sm:grid-cols-3">
                {principles.map((principle) => <div key={principle.number} className="border-t-2 border-[#D6A95D] pt-4"><span className="text-xs font-extrabold text-[#B78235]">{principle.number}</span><h3 className="mt-3 text-sm font-bold text-[#0F4C3A]">{principle.title}</h3><p className="mt-2 text-xs leading-6 text-[#687670]">{principle.text}</p></div>)}
              </div>
              <div className="mt-9"><PillButton onClick={() => go("about")} variant="outline" icon={ArrowLeft}>اكتشف هويتنا المؤسسية</PillButton></div>
            </motion.div>
          </div>
        </section>

        <section id="impact" className="relative overflow-hidden bg-[#0F4C3A] py-20 text-white sm:py-24">
          <div className="absolute inset-0 opacity-[0.13]" style={{ backgroundImage: "var(--pattern-girih-star)", backgroundSize: "190px 190px" }} />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><SectionLabel light>الأثر بالأرقام</SectionLabel><h2 className="max-w-2xl text-3xl font-extrabold leading-[1.35] sm:text-5xl">كل رقم خلفه <span className="text-[#E8C97B]">إنسان وحكاية.</span></h2></div><p className="max-w-sm text-sm leading-7 text-white/60">نقيس ما ننجزه لأن الشفافية ليست تقريرًا سنويًا؛ إنها وعدٌ يتجدد مع كل مشروع.</p></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map(({ value, label, icon: Icon }) => <motion.div key={label} whileHover={{ y: -4 }} className="rounded-[22px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm"><div className="flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#D6A95D]/15 text-[#E8C97B]"><Icon className="h-5 w-5" /></div><span className="text-xs text-white/35">رحماء بينهم</span></div><div className="mt-7 text-3xl font-extrabold text-[#E8C97B]">{value}</div><p className="mt-2 text-sm text-white/65">{label}</p></motion.div>)}
            </div>
          </div>
        </section>

        <section id="programs" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1fr] lg:gap-20">
            <div><SectionLabel>مسارات العمل</SectionLabel><h2 className="text-3xl font-extrabold leading-[1.35] text-[#0F4C3A] sm:text-5xl">مجالات نعمل فيها،<span className="block text-[#B78235]">وأثر نتركه.</span></h2><p className="mt-6 max-w-md text-base leading-8 text-[#687670]">نختار تدخلاتنا بعناية، ونربط الإغاثة العاجلة بالتنمية التي تمنح الأسرة قدرة أطول على الاعتماد على الذات.</p><div className="mt-8 flex flex-col gap-2">{programs.map((program) => { const Icon = program.icon; const isActive = program.id === activeProgram; return <button key={program.id} type="button" onClick={() => setActiveProgram(program.id)} className={`group flex items-center justify-between rounded-2xl border px-4 py-4 text-right transition ${isActive ? "border-[#0F4C3A] bg-[#0F4C3A] text-white shadow-xl shadow-[#0F4C3A]/15" : "border-[#0F4C3A]/10 bg-white text-[#0F4C3A] hover:border-[#0F4C3A]/25 hover:bg-[#F4F8F5]"}`}><span className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${isActive ? "bg-white/12 text-[#E8C97B]" : "bg-[#F1F5F0] text-[#0F4C3A]"}`}><Icon className="h-5 w-5" /></span><span><span className="block text-sm font-bold">{program.title}</span><span className={`mt-1 block text-[11px] ${isActive ? "text-white/55" : "text-[#687670]"}`}>{program.shortTitle}</span></span></span><ChevronLeft className={`h-4 w-4 transition ${isActive ? "text-[#E8C97B]" : "text-[#8B9A94] group-hover:-translate-x-1"}`} /></button>; })}</div></div>
            <motion.div key={selectedProgram.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} className="relative overflow-hidden rounded-[32px] bg-white p-3 shadow-[0_24px_70px_rgba(15,76,58,.11)] ring-1 ring-[#0F4C3A]/8"><div className="relative overflow-hidden rounded-[25px] bg-[#EDF4EF]"><img src={selectedProgram.image} alt={selectedProgram.title} loading="lazy" className="h-[265px] w-full object-cover sm:h-[350px]" /><div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl border border-white/50 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md"><div><p className="text-sm font-bold text-[#0F4C3A]">{selectedProgram.shortTitle}</p><p className="mt-1 text-[11px] text-[#687670]">من مشاريع رحماء بينهم</p></div><div className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ backgroundColor: selectedProgram.accent }}><SelectedIcon className="h-5 w-5" /></div></div></div><div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:p-7"><div><h3 className="text-2xl font-extrabold text-[#0F4C3A]">{selectedProgram.title}</h3><p className="mt-4 max-w-lg text-sm leading-7 text-[#687670]">{selectedProgram.description}</p><button type="button" onClick={() => go("programs")} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0F4C3A] hover:text-[#B78235]"><span>استكشف البرنامج</span><ArrowLeft className="h-4 w-4" /></button></div><div className="rounded-2xl bg-[#F5F7F3] p-4 text-center sm:min-w-28"><div className="text-2xl font-extrabold" style={{ color: selectedProgram.accent }}>{selectedProgram.stat}</div><div className="mt-2 text-[11px] text-[#687670]">{selectedProgram.statLabel}</div></div></div></motion.div>
          </div>
        </section>

        <section className="bg-[#F1EEE7] py-20 sm:py-24"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-10"><div className="rounded-[28px] border border-[#0F4C3A]/10 bg-[#FFFDF8] p-7 shadow-sm sm:p-10"><div className="flex items-center justify-between"><div><SectionLabel>شفافية عملية</SectionLabel><h2 className="text-2xl font-extrabold text-[#0F4C3A] sm:text-3xl">تبرعك يتحول إلى خطوات واضحة</h2></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0F4C3A] text-[#E8C97B]"><ShieldCheck className="h-6 w-6" /></div></div><div className="mt-9 space-y-6">{[["01", "نحدد الاحتياج", "بدراسة ميدانية وشراكة مع المجتمع المحلي"], ["02", "ننـفذ بوضوح", "فريق متخصص ومؤشرات متابعة لكل مشروع"], ["03", "نشارك الأثر", "تقارير ونتائج تساعدك على رؤية الفرق"]].map(([number, title, text]) => <div key={number} className="flex gap-4"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E6EFE9] text-xs font-extrabold text-[#0F4C3A]">{number}</div><div><h3 className="text-sm font-bold text-[#0F4C3A]">{title}</h3><p className="mt-1 text-xs leading-6 text-[#687670]">{text}</p></div><Check className="mr-auto mt-1 h-4 w-4 text-[#5C9774]" /></div>)}</div><button type="button" onClick={() => go("transparency")} className="mt-9 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#0F4C3A]/15 py-3 text-sm font-bold text-[#0F4C3A] transition hover:bg-[#F4F8F5]"><span>شاهد تقارير الشفافية</span><ArrowLeft className="h-4 w-4" /></button></div><div><SectionLabel>إيماننا</SectionLabel><blockquote className="text-3xl font-extrabold leading-[1.5] text-[#0F4C3A] sm:text-4xl">“أفضل العطاء ما ترك في حياة الناس قدرةً جديدة.”</blockquote><p className="mt-6 max-w-md text-sm leading-7 text-[#687670]">نؤمن أن العمل الإنساني لا يكتفي بعبور الأزمة؛ بل يفتح طريقًا أوسع للتعلم والاعتماد على الذات.</p><div className="mt-8 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0F4C3A] text-[#E8C97B]"><Heart className="h-5 w-5" fill="currentColor" /></div><div><p className="text-sm font-bold text-[#0F4C3A]">رحماء بينهم</p><p className="text-xs text-[#687670]">رحمةٌ تُرى في العمل</p></div></div></div></div></section>

        <section className="relative overflow-hidden bg-[#0F4C3A] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-24"><div className="absolute inset-y-0 left-0 w-1/2 opacity-15" style={{ backgroundImage: "var(--pattern-andalusian-star)", backgroundSize: "140px 140px" }} /><div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-center"><div className="max-w-2xl"><SectionLabel light>الخطوة التالية لك</SectionLabel><h2 className="text-3xl font-extrabold leading-[1.35] sm:text-5xl">اجعل عطاؤك بابًا <span className="text-[#E8C97B]">لأملٍ جديد.</span></h2><p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">تبرعك ليس رقمًا في سجل؛ إنه ماءٌ يصل، وطفلٌ يتعلم، وأسرةٌ تستعيد قدرتها على الوقوف.</p></div><div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><PillButton onClick={() => go("donate")} variant="primary" icon={HandHeart}>تبرع الآن</PillButton><PillButton onClick={() => go("volunteer")} variant="light" icon={Users}>كن جزءًا من الفريق</PillButton></div></div></section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24"><div className="grid gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-center"><div><SectionLabel>نحن قريبون منك</SectionLabel><h2 className="text-3xl font-extrabold text-[#0F4C3A] sm:text-4xl">لديك سؤال أو فكرة شراكة؟</h2><p className="mt-5 max-w-lg text-sm leading-7 text-[#687670]">يسعد فريق رحماء بينهم أن يسمع منك. تواصل معنا لنناقش كيف يمكن أن نضاعف الأثر معًا.</p><div className="mt-8 flex flex-wrap gap-3"><PillButton onClick={() => go("contact")} variant="outline" icon={MessageCircle}>تواصل مع الفريق</PillButton><a href="https://wa.me/967780777007" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-[#25D366]/25 bg-[#F2FBF5] px-6 text-sm font-bold text-[#1B7E46] transition hover:bg-[#E2F7E9]"><span>واتساب مباشر</span><MessageCircle className="h-4 w-4" /></a></div></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><div className="flex items-center gap-4 rounded-2xl border border-[#0F4C3A]/10 bg-white p-4 shadow-sm"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F1F5F0] text-[#0F4C3A]"><MapPin className="h-5 w-5" /></div><div><p className="text-xs text-[#687670]">المكتب الرئيسي</p><p className="mt-1 text-sm font-bold text-[#0F4C3A]">صنعاء، الجمهورية اليمنية</p></div></div><div className="flex items-center gap-4 rounded-2xl border border-[#0F4C3A]/10 bg-white p-4 shadow-sm"><div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F4EAD5] text-[#9B6A24]"><WalletCards className="h-5 w-5" /></div><div><p className="text-xs text-[#687670]">للاستفسارات والتبرع</p><p dir="ltr" className="mt-1 text-sm font-bold text-[#0F4C3A]">+967 780 777 007</p></div></div></div></div></section>
      </main>

      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="العودة إلى الأعلى" className="fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-[#0F4C3A]/15 bg-white/90 text-[#0F4C3A] shadow-xl backdrop-blur-md transition hover:-translate-y-1 hover:bg-[#0F4C3A] hover:text-white"><MoveUpLeft className="h-4 w-4" /></button>
    </div>
  );
}

export default HomePage;
