import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  Droplets,
  Gift,
  HandHeart,
  Heart,
  Landmark,
  MessageCircle,
  MoveUpLeft,
  ShieldCheck,
  Users,
  Utensils,
  Globe,
  TrendingUp,
  Award,
  Compass,
  Lightbulb,
  Scale,
  BookMarked,
  Target,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BeneficiaryStoryHero } from "@/app/components/BeneficiaryStoryHero";
import { EmotionalAccounting } from "@/app/components/EmotionalAccounting";
import { ExpenseRatioBar } from "@/app/components/ExpenseRatioBar";
import { ImpactDashboard } from "@/app/components/home/ImpactDashboard";
import { LiveImpactCounter } from "@/app/components/LiveImpactCounter";
import { TrustBadges } from "@/app/components/TrustBadges";
import { ViralShare } from "@/app/components/ViralShare";
import { EnterpriseButton, EnterpriseCard } from "@/shared/components";
import {
  scrollFadeUp,
  staggerContainer,
  hoverLift,
  viewportOnce,
} from "@/utils/animations";
import { useSEO } from "@/utils/seoAdvanced";

interface HomePageProps {
  setCurrentPage?: (page: string) => void;
}

type IconComponent = typeof Heart;

// القيم المؤسسية — نهج وأثر
const programs = [
  {
    id: "social",
    title: "العمل الاجتماعي والتكافل",
    icon: Heart,
    impact: "مئات العائلات المستفيدة شهرياً",
    belief: "نؤمن أن التكافل الاجتماعي أساس الاستقرار والتماسك المجتمعي وحفظ الكرامة",
    approach: "نهج تشاركي ميداني مع المجتمع المحلي لضمان وصول الدعم لمستحقيه بعزة ووقار",
    scope: "تغطية شاملة لمختلف المحافظات اليمنية",
  },
  {
    id: "food",
    title: "الأغذية والأمن الغذائي",
    icon: Utensils,
    impact: "آلاف السلال الغذائية الموزعة سنوياً",
    belief: "توفير الغذاء الصحي المستدام للأسر الأكثر احتياجاً والأشد تضرراً",
    approach: "توزيع السلال الغذائية المتكاملة والوجبات الساخنة في المواسم والأزمات",
    scope: "المناطق النائية ومخيمات النزوح والقرى الأشد فقراً",
  },
  {
    id: "water",
    title: "المياه والإصحاح البيئي",
    icon: Droplets,
    impact: "عشرات الآبار ومحطات التحلية بالطاقة الشمسية",
    belief: "سقيا الماء صدقة جارية وحق أصيل ينبض به شريان الحياة",
    approach: "حفر الآبار الارتوازية وتجهيز شبكات الضخ بالطاقة النظيفة ومحطات التنقية",
    scope: "المناطق الجافة والأرياف المحرومة من مصادر المياه الصالحة للشرب",
  },
  {
    id: "education",
    title: "التعليم والتأهيل المهني",
    icon: BookOpen,
    impact: "آلاف الطلاب والمتدربين المؤهلين لسوق العمل",
    belief: "التعليم والمعرفة هما أعظم أداة لتمكين الأجيال وصناعة المستقبل",
    approach: "ترميم المدارس، وتوزيع الحقائب المدرسية، وبرامج التدريب والتمكين الحرفي",
    scope: "المراكز التعليمية والمهنية بالشراكة مع الجامعات والمؤسسات",
  },
  {
    id: "seasonal",
    title: "المشاريع والحملات الموسمية",
    icon: Gift,
    impact: "عشرات الآلاف من المستفيدين في المواسم المباركة",
    belief: "التراحم والتعاطف في مواسم الخير يضاعف الأجر ويعم السعادة",
    approach: "إفطار الصائم، كسوة العيد، توزيع لحوم الأضاحي، وحملات الشتاء الدافئ",
    scope: "حملات ممتدة في عموم المحافظات على مدار العام",
  },
];

const values = [
  {
    icon: Scale,
    title: "الأمانة والنزاهة المؤسسية",
    text: "نلتزم بأعلى معايير الشفافية والمسؤولية في إدارة أموال التبرعات والزكاة وصرفها في مصارفها الشرعية بدقة متناهية.",
  },
  {
    icon: Users,
    title: "حفظ كرامة المستفيد",
    text: "الإنسان أولاً؛ نصل إلى المحتاجين بوقار وإحسان يحفظ عزة نفوسهم ويكرم إنسانيتهم في كل مرحلة من مراحل العطاء.",
  },
  {
    icon: BookMarked,
    title: "الاستدامة والأثر الدائم",
    text: "لا نقتصر على الإغاثة الطارئة، بل نبتكر مشاريع تنموية مستدامة تحول الأسر المحتاجة إلى أسر منتجة ومكتفية ذاتياً.",
  },
  {
    icon: Lightbulb,
    title: "الابتكار في العمل الإنساني",
    text: "نعتمد الحلول الذكية والتقنيات الحديثة لتعزيز كفاءة الميدان وتتبع الأثر الإغاثي وتسهيل التبرع بكل موثوقية.",
  },
  {
    icon: Award,
    title: "الجودة والتميز القياسي",
    text: "نطبق أفضل الممارسات والمعايير العالمية في التخطيط والتنفيذ والتقييم لضمان أقصى كفاءة وأعمق أثر مجتمعي.",
  },
  {
    icon: Compass,
    title: "الريادة والشراكة التنموية",
    text: "نبني جسور التعاون والشراكات المثمرة مع المنظمات الإنسانية والجهات المانحة لتحقيق أهداف التنمية المشتركة.",
  },
];

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`mb-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] ${
        light ? "text-[var(--brand-gold-light)]" : "text-[var(--brand-gold-dark)]"
      }`}
    >
      <span className="h-px w-8 bg-[var(--brand-gold)]" />
      <span>{children}</span>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  variant = "green",
}: {
  icon: IconComponent;
  label: string;
  value: string;
  variant?: "green" | "gold";
}) {
  const colors = {
    green: "border-[var(--brand-green)]/15 bg-white/[0.06] text-white hover:border-[var(--brand-gold)]/50",
    gold: "border-[var(--brand-gold)]/20 bg-white/[0.06] text-white hover:border-[var(--brand-gold)]/60",
  };

  return (
    <EnterpriseCard
      variant="glass"
      size="sm"
      className={`group border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colors[variant]}`}
    >
      <div className="mx-auto mb-2.5 grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-[var(--brand-gold-light)] transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xl sm:text-2xl font-black tracking-tight text-white font-cairo numeric">{value}</p>
      <p className="mt-1 text-xs font-semibold text-white/70">{label}</p>
    </EnterpriseCard>
  );
}

export function HomePage({ setCurrentPage }: HomePageProps) {
  const navigate = useNavigate();
  const [activeProgram, setActiveProgram] = useState(programs[0].id);

  useSEO({
    title: "رحماء بينهم للإغاثة والتنمية | الموقع التعريفي الرسمي",
    description:
      "الموقع الرسمي لمؤسسة رحماء بينهم للإغاثة والتنمية باليمن (ترخيص رسمي ٤٨٢). عمل إنساني وتنموي مستدام يحفظ الكرامة ويبني المستقبل.",
    type: "website",
    url: "https://rbdcye.org",
    keywords: ["رحماء بينهم", "مؤسسة رحماء بينهم", "إغاثة اليمن", "تنمية اليمن", "كفالة أيتام", "مشاريع مياه", "زكاة", "تبرع"],
    image: "https://rbdcye.org/og-image.svg",
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

  return (
    <div className="overflow-hidden bg-[var(--background)] text-[var(--foreground)]" dir="rtl">

      {/* -----------------------------------------------------------
          HERO — الواجهة الرئيسية مع وقار إسلامي وهوية راقية
          ----------------------------------------------------------- */}
      <section
        id="hero"
        aria-labelledby="home-hero-heading"
        aria-label="رحماء بينهم — معاً نصنع التنمية ونحفظ الكرامة الإنسانية"
        className="relative overflow-hidden bg-[var(--brand-green-dark)] min-h-[86vh] lg:min-h-[92vh] flex items-center py-20 sm:py-28 lg:py-32 text-white hero-section"
        style={{ contentVisibility: "visible", contain: "layout style" } as React.CSSProperties}
      >
        {/* زخارف إسلامية خفيفة جداً — تجميلية ومتناسقة */}
        <div className="absolute inset-0 opacity-[0.04] pattern-khatam-white pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 opacity-[0.025] pattern-moroccan-dark pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-[var(--brand-gold)]/[0.08] blur-[140px] will-change-transform pointer-events-none" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-900/30 blur-[120px] will-change-transform pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[var(--brand-gold)]/[0.04] blur-[100px] will-change-transform pointer-events-none" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-[1600px] px-6 text-center sm:px-10 lg:px-16">
          <motion.div initial="initial" animate="visible" variants={staggerContainer} className="mx-auto max-w-5xl">
            <motion.div variants={scrollFadeUp} className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 text-xs font-bold tracking-wide text-white/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--brand-gold)] text-[var(--brand-green-dark)]">
                <BadgeCheck className="h-3 w-3" />
              </span>
              ترخيص رسمي معتمد برقم ٤٨٢ · الجمهورية اليمنية
              <span className="h-3 w-px bg-white/20" aria-hidden="true" />
              <span className="text-[var(--brand-gold-light)] font-semibold">أثرٌ مستدام يحفظ الكرامة</span>
            </motion.div>

            <motion.h1
              id="home-hero-heading"
              variants={scrollFadeUp}
              className="text-[2.2rem] font-black leading-[1.25] tracking-tight sm:text-6xl lg:text-[4.5rem] lg:leading-[1.15] text-balance font-cairo"
            >
              عطاءٌ يحفظ الكرامة ويبني{" "}
              <span className="text-gradient-gold">المستقبل الواعد</span>
              <br className="hidden sm:block" />
              لأهلنا وإخواننا في اليمن.
            </motion.h1>

            <motion.p variants={scrollFadeUp} className="mx-auto mt-8 max-w-4xl text-base leading-[2.1] text-white/80 sm:text-lg lg:text-xl lg:leading-[2] font-cairo">
              مؤسسة «رحماء بينهم للإغاثة والتنمية» — هيئة إنسانية تنموية مستقلة تعمل على تلبية الاحتياجات
              الإغاثية العاجلة وتشييد المشاريع التنموية المستدامة في قطاعات المياه والتعليم والصحة والغذاء.
            </motion.p>

            <motion.div variants={scrollFadeUp} className="mt-10 flex flex-wrap justify-center gap-4">
              <EnterpriseButton
                variant="gold"
                size="lg"
                icon={HandHeart}
                onClick={() => go("donate")}
                className="shadow-[0_16px_40px_rgba(var(--brand-gold-rgb),.28)] hover:shadow-[0_20px_50px_rgba(var(--brand-gold-rgb),.35)] font-bold text-base"
                ripple
              >
                ساهم في التبرع الآن
              </EnterpriseButton>
              <EnterpriseButton
                variant="secondary"
                size="lg"
                icon={ArrowLeft}
                onClick={() => go("about")}
                className="shadow-[0_12px_35px_rgba(0,0,0,0.12)] font-bold text-base bg-white/10 hover:bg-white/20 text-white border border-white/20"
                ripple
              >
                تعرّف على المؤسسة
              </EnterpriseButton>
            </motion.div>
            <motion.p variants={scrollFadeUp} className="mt-4 text-xs font-medium tracking-wide text-white/70 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
              <span>١٠٠٪ من تبرعاتكم تصل مباشرة لمستحقيها وفق أعلى معايير الشفافية والمسؤولية</span>
            </motion.p>

            <motion.div variants={scrollFadeUp} className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:gap-8">
              <MetricCard icon={Heart} label="عائلات مستفيدة" value="+٢٥,٠٠٠" variant="green" />
              <MetricCard icon={Target} label="مشاريع منجزة" value="+١٨٠" variant="gold" />
              <MetricCard icon={Globe} label="محافظات مغطاة" value="١٢ محافظة" variant="green" />
              <MetricCard icon={Users} label="شريك وداعم" value="+٥٠ جهة" variant="gold" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------
          شارات الثقة والعداد الحي
          ----------------------------------------------------------- */}
      <section className="bg-[var(--secondary)] py-10 sm:py-12 border-b border-[var(--border)] relative">
        <div className="absolute inset-0 pattern-khatam-light opacity-50 pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 relative z-10">
          <TrustBadges />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8 relative z-10">
          <LiveImpactCounter />
        </div>
      </section>

      {/* -----------------------------------------------------------
          لوحة قياس الأثر التنموي
          ----------------------------------------------------------- */}
      <section className="bg-[var(--background)] py-16 sm:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ImpactDashboard />
        </div>
      </section>

      {/* -----------------------------------------------------------
          قصة الأثر + الشفافية المالية
          ----------------------------------------------------------- */}
      <section className="bg-[var(--background)] py-16 sm:py-24 border-t border-[var(--border)] relative">
        <div className="absolute inset-0 pattern-mashrabiya-light opacity-30 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>أثرٌ في الميدان</SectionLabel>
            <h2 className="mb-4 text-2xl font-bold text-[var(--brand-green)] sm:text-4xl font-cairo">
              قصص من واقع العطاء الإنساني
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-[2] text-[var(--muted-foreground)]">
              خلف كل رقم قصة إنسانية ملهمة، وأسرة استعادت أملها في الحياة بفضل الله ثم تبرعاتكم السخية.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BeneficiaryStoryHero />
            </div>
            <div className="flex flex-col gap-6">
              <ExpenseRatioBar />
            </div>
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------
          حساب الأثر العاطفي والاجتماعي
          ----------------------------------------------------------- */}
      <section className="bg-[var(--secondary)] py-16 sm:py-24 pattern-arabesque-light relative border-y border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp} className="text-center">
            <SectionLabel>الأثر المستدام</SectionLabel>
            <h2 className="mb-4 text-2xl font-bold text-[var(--brand-green)] sm:text-4xl font-cairo">
              قيمة عطائك تصنع فارقاً حقيقياً
            </h2>
          </motion.div>
          <div className="mt-10">
            <EmotionalAccounting />
          </div>
        </div>
      </section>

      {/* -- قبس قرآني كريم -- */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 my-12">
        <div className="rounded-3xl border border-[var(--brand-gold)]/30 bg-gradient-to-l from-[var(--brand-gold)]/10 via-[var(--card)] to-[var(--card)] p-8 text-center shadow-lg relative overflow-hidden ornate-card">
          <div className="absolute inset-0 pattern-khatam-light opacity-20 pointer-events-none" />
          <p className="font-amiri text-2xl leading-loose text-[var(--brand-green-dark)] md:text-3xl font-bold relative z-10" dir="rtl">
            ﴿ وَمَا تُنْفِقُوا مِنْ خَيْرٍ فَلِأَنْفُسِكُمْ وَمَا تُنْفِقُونَ إِلَّا ابْتِغَاءَ وَجْهِ اللَّهِ ﴾
          </p>
          <p className="mt-3 text-xs font-semibold text-[var(--brand-gold-dark)] relative z-10">سورة البقرة — آية ٢٧٢</p>
        </div>
      </div>

      {/* -----------------------------------------------------------
          المنطلقات والمبادئ الحاكمة
          ----------------------------------------------------------- */}
      <section className="bg-[var(--background)] py-16 sm:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>قيمنا الراسخة</SectionLabel>
            <h2 className="mb-4 max-w-3xl text-2xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl font-cairo">
              مبادئ إنسانية سامية تحكم مسيرة عملنا
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-[2] text-[var(--muted-foreground)]">
              نلتزم بمنظومة قيمية رصينة تضمن الشفافية والمسؤولية وصون كرامة الإنسان في شتى الميادين.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                number: "٠١",
                icon: Globe,
                title: "الشمولية والعدالة",
                text: "نصل إلى الفئات الأكثر احتياجاً دون تمييز، مع التركيز على المناطق النائية والمجتمعات المحرومة.",
              },
              {
                number: "٠٢",
                icon: TrendingUp,
                title: "التنمية المستدامة",
                text: "نركز على المشاريع ذات الأثر طويل الأمد التي تسهم في الاعتماد على الذات وبناء القدرات المحلية.",
              },
              {
                number: "٠٣",
                icon: Sparkles,
                title: "الجودة والتميز",
                text: "نطبق أفضل المعايير الإدارية والميدانية المعتمدة لضمان تحقيق أقصى عائد إنساني لكل تبرع.",
              },
            ].map((item) => (
              <motion.div key={item.number} variants={scrollFadeUp} className="border-t-2 border-[var(--brand-gold)]/40 pt-6 pb-6 bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--brand-gold-dark)] bg-[var(--brand-gold)]/10 px-2.5 py-1 rounded-full">{item.number}</span>
                  <item.icon className="h-5 w-5 text-[var(--brand-gold)]" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--brand-green)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-[1.95] text-[var(--muted-foreground)]">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------
          قيم المؤسسة التفصيلية
          ----------------------------------------------------------- */}
      <section className="bg-[var(--secondary)] py-16 sm:py-24 pattern-zellij-light relative border-y border-[var(--border)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>ركائز المؤسسة</SectionLabel>
            <h2 className="mb-4 max-w-3xl text-2xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl font-cairo">
              نحو عمل إنساني مؤسسي رائد وموثوق
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-[2] text-[var(--muted-foreground)]">
              نسعى للارتقاء بالعمل الإغاثي والتنموي في اليمن إلى أعلى المستويات المهنية والإدارية.
            </p>
          </motion.div>

          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={staggerContainer} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <motion.div key={value.title} variants={scrollFadeUp} whileHover={hoverLift.whileHover} className="rounded-2xl border border-[var(--brand-green)]/10 bg-[var(--card)] p-6 transition hover:shadow-xl hover:border-[var(--brand-gold)]/40 islamic-corner-accents">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand-green-pale)] text-[var(--brand-green)]">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-[var(--brand-green)] font-cairo">{value.title}</h3>
                <p className="mt-3 text-sm leading-[1.95] text-[var(--muted-foreground)]">{value.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------
          القطاعات والبرامج التنموية
          ----------------------------------------------------------- */}
      <section className="bg-[var(--background)] py-16 sm:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>القطاعات التنموية</SectionLabel>
            <h2 className="mb-4 max-w-3xl text-2xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl font-cairo">
              برامج ومشاريع متخصصة تصنع التغيير
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-[2] text-[var(--muted-foreground)]">
              تعمل المؤسسة عبر قطاعات تنموية متكاملة تهدف إلى تلبية الاحتياجات الأساسية وتمكين المجتمع.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {programs.map((program) => {
              const Icon = program.icon;
              const isActive = program.id === activeProgram;
              return (
                <motion.button
                  key={program.id}
                  type="button"
                  onClick={() => setActiveProgram(program.id)}
                  whileHover={hoverLift.whileHover}
                  whileTap={{ scale: 0.98 }}
                  className={`group rounded-3xl p-6 text-right transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[var(--brand-green)] text-white shadow-2xl ring-2 ring-[var(--brand-gold)]/50"
                      : "bg-[var(--card)] text-[var(--foreground)] hover:shadow-xl border border-[var(--border)] hover:border-[var(--brand-green)]/30"
                  }`}
                >
                  <div className={`mb-6 grid h-12 w-12 place-items-center rounded-2xl transition-colors ${
                    isActive ? "bg-white/15 text-[var(--brand-gold-light)]" : "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold font-cairo">{program.title}</h3>
                  <p className={`mt-3 text-sm leading-[1.95] ${isActive ? "text-white/80" : "text-[var(--muted-foreground)]"}`}>
                    {program.belief}
                  </p>
                  {isActive && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 border-t border-white/15 pt-6">
                      <div className="mb-4 rounded-xl bg-[var(--brand-gold)]/15 p-3 text-center border border-[var(--brand-gold)]/20">
                        <p className="text-sm font-bold text-[var(--brand-gold-light)]">{program.impact}</p>
                      </div>
                      <p className="text-xs font-bold text-[var(--brand-gold-light)]">منهجية التنفيذ:</p>
                      <p className="mt-1.5 text-sm leading-[1.85] text-white/80">{program.approach}</p>
                      <div className="mt-4 rounded-xl bg-white/5 p-4 border border-white/10">
                        <p className="text-xs font-bold text-[var(--brand-gold-light)]">نطاق التغطية:</p>
                        <p className="mt-1 text-sm leading-[1.8] text-white/80">{program.scope}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp} className="mt-12 text-center">
            <EnterpriseButton
              variant="outline"
              size="md"
              icon={ArrowLeft}
              onClick={() => go("programs")}
              className="rounded-2xl font-bold"
              ripple
            >
              استعرض كافة البرامج والمشاريع
            </EnterpriseButton>
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------
          آراء وشهادات المستفيدين
          ----------------------------------------------------------- */}
      <section className="py-16 sm:py-24 bg-[var(--secondary)] border-t border-[var(--border)] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp} className="text-center">
            <SectionLabel>أصداء الميدان</SectionLabel>
            <h2 className="text-center text-2xl font-bold text-[var(--foreground)] sm:text-4xl font-cairo">شهادات من أرض الواقع</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-[2] text-[var(--muted-foreground)]">
              أصوات المستفيدين والشركاء تجسد أثر العطاء الصادق في تغيير حياة الآلاف.
            </p>
          </motion.div>
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={staggerContainer} className="mt-12 grid gap-8 md:grid-cols-3">
            <motion.div variants={scrollFadeUp} className="rounded-3xl bg-[var(--card)] p-8 border border-[var(--border)] shadow-md hover:shadow-xl transition-shadow">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-green)]">أم محمد — تعز</p>
                  <p className="text-xs text-[var(--muted-foreground)]">مستفيدة من السلال الغذائية</p>
                </div>
              </div>
              <blockquote className="text-sm leading-[1.9] text-[var(--muted-foreground)]">
                "كانت السلال الغذائية الشهرية طوق نجاة لأسرتي في أحلك الظروف. جزاكم الله خيراً على إحسانكم ووقوفكم إلى جانبنا."
              </blockquote>
            </motion.div>
            <motion.div variants={scrollFadeUp} className="rounded-3xl bg-[var(--card)] p-8 border border-[var(--border)] shadow-md hover:shadow-xl transition-shadow">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-gold)]/10 text-[var(--brand-gold-dark)]">
                  <Utensils className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-green)]">سالم — حجة</p>
                  <p className="text-xs text-[var(--muted-foreground)]">مستفيد من مشروع سقيا الماء</p>
                </div>
              </div>
              <blockquote className="text-sm leading-[1.9] text-[var(--muted-foreground)]">
                "تشغيل محطة المياه بالطاقة الشمسية في قريتنا وفر علينا مشقة جلب الماء يومياً وحفظ صحة أطفالنا."
              </blockquote>
            </motion.div>
            <motion.div variants={scrollFadeUp} className="rounded-3xl bg-[var(--card)] p-8 border border-[var(--border)] shadow-md hover:shadow-xl transition-shadow">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)]">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-green)]">عبدالله — إب</p>
                  <p className="text-xs text-[var(--muted-foreground)]">خريج برنامج التأهيل المهني</p>
                </div>
              </div>
              <blockquote className="text-sm leading-[1.9] text-[var(--muted-foreground)]">
                "بفضل دورات التأهيل المهني تمكنت من اكتساب مهارة حرفية والبدء بعمل حر يوفر قوت أسرتي بكرامة."
              </blockquote>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------
          دعوة للمساهمة والعطاء
          ----------------------------------------------------------- */}
      <section className="bg-[var(--brand-green)] py-20 text-white sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pattern-khatam-white opacity-10 pointer-events-none" />
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8 relative z-10">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel light>كن شريك الأثر</SectionLabel>
            <h2 className="mb-4 text-2xl font-bold leading-[1.4] sm:text-4xl font-cairo">
              عطاؤك اليوم يصنع{" "}
              <span className="text-[var(--brand-gold-light)]">مستقبلاً أفضل.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-[2] text-white/80 sm:text-base font-cairo">
              كل مساهمة مهما كانت تزرع بسمة وتخفف معاناة وتبني صرحاً من الخير المستدام في أرض اليمن.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <EnterpriseButton
                variant="gold"
                size="lg"
                icon={HandHeart}
                onClick={() => go("donate")}
                className="rounded-2xl shadow-[0_14px_30px_rgba(var(--brand-gold-rgb),.28)] font-bold"
                ripple
              >
                تبرع الآن
              </EnterpriseButton>
              <EnterpriseButton
                variant="secondary"
                size="lg"
                icon={Heart}
                onClick={() => go("volunteer")}
                className="rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold"
                ripple
              >
                انضم كمتطوع
              </EnterpriseButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------
          معلومات التواصل والمقر الرسمي
          ----------------------------------------------------------- */}
      <section className="bg-[var(--background)] py-16 sm:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>تواصل معنا</SectionLabel>
            <h2 className="mb-4 text-2xl font-bold text-[var(--brand-green)] sm:text-4xl font-cairo">
              نرحب بتواصلكم واستفساراتكم
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-[2] text-[var(--muted-foreground)]">
              فريقنا جاهز للإجابة عن تساؤلاتكم واستقبال مقترحاتكم وتقديم التقارير التفصيلية حول المشاريع.
            </p>
          </motion.div>

          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp} className="mt-8 flex flex-wrap gap-3">
            <EnterpriseButton
              variant="outline"
              size="md"
              icon={MessageCircle}
              onClick={() => go("contact")}
              className="rounded-2xl font-bold"
              ripple
            >
              صفحة التواصل الرسمية
            </EnterpriseButton>
            <EnterpriseButton
              variant="secondary"
              size="md"
              icon={PhoneCall}
              onClick={() => window.open("https://wa.me/967780777007", "_blank", "noopener,noreferrer")}
              className="rounded-2xl font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
              ripple
              aria-label="تواصل معنا عبر واتساب"
            >
              تواصل عبر واتساب
            </EnterpriseButton>
          </motion.div>

          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={staggerContainer} className="mt-10 grid gap-6 sm:grid-cols-2">
            <motion.div variants={scrollFadeUp} className="flex items-center gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-green-pale)] text-[var(--brand-green)]">
                <Landmark className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">المقر الرئيسي</p>
                <p className="mt-1 text-sm font-bold text-[var(--brand-green)]">صنعاء — الجمهورية اليمنية</p>
              </div>
            </motion.div>
            <motion.div variants={scrollFadeUp} className="flex items-center gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand-gold-pale)] text-[var(--brand-gold-dark)]">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">الترخيص الرسمي والهاتف</p>
                <p dir="ltr" className="mt-1 text-sm font-bold text-[var(--brand-green)]">+967 780 777 007 (رقم ٤٨٢)</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* -----------------------------------------------------------
          المشاركة ونشر الخير
          ----------------------------------------------------------- */}
      <section className="bg-[var(--secondary)] py-16 sm:py-24 border-t border-[var(--border)] relative">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp} className="text-center">
            <SectionLabel>شارك الأجر</SectionLabel>
            <h2 className="mb-4 text-2xl font-bold text-[var(--brand-green)] sm:text-3xl font-cairo">
              الدال على الخير كفاعله
            </h2>
          </motion.div>
          <div className="mt-8">
            <ViralShare />
          </div>
        </div>
      </section>

      {/* زر العودة لأعلى الصفحة */}
      <motion.button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="العودة لأعلى الصفحة"
        whileHover={{ y: -3, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-[var(--brand-green)]/15 bg-[var(--card)]/90 text-[var(--brand-green)] shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--brand-green)] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none cursor-pointer"
      >
        <MoveUpLeft className="h-4 w-4" aria-hidden="true" />
      </motion.button>
    </div>
  );
}

export default HomePage;
