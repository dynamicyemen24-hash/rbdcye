import { motion } from "motion/react";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  Droplets,
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
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/app/components/ui/button";
import { LiveImpactCounter } from "@/app/components/LiveImpactCounter";
import { ExpenseRatioBar } from "@/app/components/ExpenseRatioBar";
import { BeneficiaryStoryHero } from "@/app/components/BeneficiaryStoryHero";
import { EmotionalAccounting } from "@/app/components/EmotionalAccounting";
import { TrustBadges } from "@/app/components/TrustBadges";
import { ImpactDashboard } from "@/app/components/home/ImpactDashboard";
import { ViralShare } from "@/app/components/ViralShare";
import { TestimonialsSection } from "@/app/components/TestimonialsSection";
import { ImpactNumbersSection } from "@/app/components/ImpactNumbersSection";
import { useSEO } from "@/utils/seoAdvanced";
import {
  scrollFadeUp,
  staggerContainer,
  hoverLift,
  viewportOnce,
} from "@/utils/animations";

interface HomePageProps {
  setCurrentPage?: (page: string) => void;
}

type IconComponent = typeof Heart;

const programs = [
  {
    id: "social",
    title: "الرعاية الاجتماعية والكفالات",
    icon: Heart,
    impact: "كفلنا ٤٥٠ يتيمًا بدعم شهري منتظم",
    belief: "الأيتام والأرامل والأسر المتعففة ليسوا إحصائية — إنهم أشخاص ينتظرون من يمدّهم بيده قبل أن يمدّهم بقلبه.",
    approach: "نقدم الكفالات المادية المستمرة، والكسوات (عيد، شتاء، مدارس)، وتفريج كرب الغارمين، والرعاية للممرضى المقعدين وذوي الاحتياجات الخاصة. كل كفالة تبدأ بدراسة حالة تحدد نوع الاحتياج بدقة.",
    scope: "الأيتام والأرامل والأسر المتعففة والمرضى المقعدين وذوي الاحتياجات الخاصة",
  },
  {
    id: "food",
    title: "الأمن الغذائي والإغاثة العاجلة",
    icon: Utensils,
    impact: "وزّعنا ١٢,٠٠٠ سلة غذائية متكاملة",
    belief: "حين تنقطع المياه وتقل الغذاء، تنقطع معها كرامة الأسرة. الأمن الغذائي ليس خيارًا — إنه واجب إنساني يبدأ بفهم دقيق لاحتياجات كل أسرة.",
    approach: "نُدير المطابخ الخيرية لتوزيع الوجبات الساخنة، ونوصّل السلال الغذائية المتكاملة (أرز وسكر وزيت وتمور)، ونوزع اللحوم خارج إطار الأضاحي. كل توزيع مُوثَّق ومدقَّق.",
    scope: "الأسر المحتاجة والنازحة وضحايا النزاعات والأزمات",
  },
  {
    id: "water",
    title: "المياه والمشاريع الإنشائية",
    icon: Droplets,
    impact: "أنجزنا ٨ آبار مياه تعمل بالطاقة الشمسية",
    belief: "الماء ليس ترفًا — إنه حق أساسي. حين تنقطع المياه عن قرية، تنقطع معها الحياة اليومية بأكملها، وتصبح الأسر أسيرة للمسافات الطويلة.",
    approach: "نحفر الآبار الارتوازية والعادية، وننشئ الخزانات والأحواض المائية، ونبني ونرمّم المساجد ودور القرآن. كل مشروع يُصمَّم بناءً على دراسة جيولوجية واحتياجات مجتمعية.",
    scope: "القرى النائية والمناطق الجافة المحرومة من المياه والخدمات",
  },
  {
    id: "education",
    title: "الدعوة والتعليم والنشر العلمي",
    icon: BookOpen,
    impact: "افتتحنا ٦ حلقات تحفيظ في ٣ محافظات",
    belief: "التعليم هو الطريق الوحيد الذي يقطع الفقر جيلًا تلو جيل. لا نؤمن بالتعليم كأرقام فحسب — نؤمن به كأداة حقيقية لتغيير مسار حياة أسرة بأكملها.",
    approach: "نُكفّل الدعاة والمشايخ، ونُنظّم حلقات تحفيظ القرآن الكريم، ونطبع المصحف الشريف والكتب العلمية، ونُنظّم المحاضرات والدروس والأنشطة العلمية. كل خطوة تبدأ بفهم احتياجات المجتمع العلمية.",
    scope: "طلاب العلم والمحفظين والمعلمون والمصلون في المساجد والقرى",
  },
  {
    id: "seasonal",
    title: "المشاريع الموسمية والشعائر",
    icon: Calendar,
    impact: "ذبحنا ٣٠٠ أضحية ووزّعنا لحومها على ٢,٠٠٠ أسرة",
    belief: "المواسم ليست أحداثًا عابرة — إنها فرصة ذهبية لإيصال العطاء في لحظات يحتاجها فيها الإنسان أكثر. الأضاحي وتفطير الصائمين ودفء الشتاء ليست ترفيهًا — إنها شعائر تُكمل بالسعادة.",
    approach: "نذبح الأضاحي وتوزّع اللحوم، ونُطعم الصائمين في رمضان وعشر ذي الحجة وعاشوراء، ونوزع البطانيات والجاكيتات ووسائل التدفئة في الشتاء. كل موسم يبدأ بدراسة ميدانية للمحتاجين.",
    scope: "المحتاجون والمساكين في المناسبات الدينية والفصول الباردة",
  },
  {
    id: "endowment",
    title: "الصدقات الجارية والاستثمار المستدام",
    icon: Award,
    impact: "أنشأنا ٥ مشاريع وقفية تخدم أكثر من ١,٠٠٠ أسرة",
    belief: "الصدقة الجارية هي الاستثمار الوحيد الذي لا ينقطع أجره. الوقف العقاري والأسهم الوقفية وتمليك أدوات الإنتاج — كلها أدوات تحوّل العطاء من لحظة إلى أثر مستدام.",
    approach: "نُنشئ الأوقاف العقارية، ونُصدر الأسهم الوقفية الاستثمارية، ونُملك أدوات الإنتاج (ماكينات خياطة، قوارب صيد، مواشي) للأسر المحتاجة لتتحول من الاعتماد على المساعدات إلى الإنتاج والاكتفاء.",
    scope: "الأسر المنتجة والمشاريع المستدامة والأوقاف الإنشائية",
  },
];

const values = [
  {
    icon: Scale,
    title: "الفهم قبل العطاء",
    text: "لا نقدم حلولًا جاهزة. نبدأ دائمًا بفهم السياق المحلي، واحتياجات المجتمع الحقيقية، وديناميكية القوى المحلية. هذا ما يميزنا عن المنظمات التي تجلب برامج جاهزة من خارج السياق.",
  },
  {
    icon: Users,
    title: "بناء القدرة لا الإعانة",
    text: "الهدف ليس أن نبقى للأبد. ندرّب ونمكّن ونبني قدرات محلية تستمر بعد رحيلنا. كل مشروع نبتكره يجب أن يترك خلفه قدرة محلية قادرة على الصيانة والتطوير.",
  },
  {
    icon: BookMarked,
    title: "المعرفة المفتوحة",
    text: "الشفافية ليست تقريرًا. إنها مسؤولية. نشارك كل ريال وما حققه، ونشرح قراراتنا وأخطاءنا، لأن المعرفة حين تُشارك تصبح قوة مجتمعية لا فردية.",
  },
  {
    icon: Lightbulb,
    title: "الابتكار في العمل الإنساني",
    text: "العمل الإنساني يحتاج إلى تفكير إبداعي. لا نكرر ما فعله غيرنا فقط — نتعلم من أخطائهم ونبحث عن حلول جديدة تتناسب مع التحديات الحقيقية في الميدان.",
  },
  {
    icon: Award,
    title: "النزاهة والمساءلة",
    text: "كل ريال له وثيقة، وكل مشروع له مسار واضح. النزاهة ليست خيارًا — إنها جزء من هويتنا. نقبل النقد ونشجع المساءلة لأنها تجعلنا أفضل.",
  },
  {
    icon: Compass,
    title: "الاستدامة في التفكير",
    text: "لا نفكر في أزمة نحن بها الآن فقط — نفكر في الأثر طويل المدى. كيف نضمن أن ما نفعله اليوم لن يسبب مشاكل غدًا؟ كيف نبني أنظمة تستمر دون اعتماد على موارد خارجية؟",
  },
];

// Use centralized scrollFadeUp and staggerContainer from @/utils/animations

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`mb-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] ${light ? "text-[var(--brand-gold-light)]" : "text-[var(--brand-gold-dark)]"}`}
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
    green: {
      text: "text-[var(--brand-green)]",
      iconBg: "bg-[var(--brand-green)]/10",
    },
    gold: {
      text: "text-[var(--brand-gold-dark)]",
      iconBg: "bg-[var(--brand-gold)]/10",
    },
  };
  const c = colors[variant];
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/95 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.16)] hover:border-white/25">
      <div className={`grid h-12 w-12 place-items-center rounded-xl ${c.iconBg} ${c.text}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
        <p className={`mt-1 text-sm font-bold ${c.text}`}>{value}</p>
      </div>
    </motion.div>
  );
}

export function HomePage({ setCurrentPage }: HomePageProps) {
  const navigate = useNavigate();
  const [activeProgram, setActiveProgram] = useState(programs[0].id);

  useSEO({
    title: "رحماء بينهم | رحمة تُبنى لا تُهدر",
    description:
      "حملة رحماء بينهم للإغاثة والتنمية باليمن — حملة إنسانية تنموية مرخصة برقم ٤٨٢. نعمل منذ ٢٠١٤م على صون كرامة الإنسان عبر برامج كفالة الأيتام والمطابخ الخيرية وحفر الآبار والتعليم الشرعي والتمكين الاقتصادي.",
    type: "website",
    url: "https://rbdcye.org",
    keywords: ["رحماء بينهم", "إغاثة اليمن", "تنمية مستدامة", "كفالة الأيتام", "مطابخ خيرية", "حفر آبار", "زكاة"],
    image: "https://rbdcye.org/og-image.png",
    author: { name: "حملة رحماء بينهم", url: "https://rbdcye.org/about" },
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

  return (
    <div className="overflow-hidden bg-[var(--background)] text-[var(--foreground)]" dir="rtl">

      {/* ═══════════════════════════════════════════════════════════
          HERO — فائق القوة والرقي والتقدم — أوسع وأنظف وأضخم
          1600px عرض + 92vh ارتفاع + مساحة تنفس فاخرة + قوة تحويلية
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--brand-green-dark)] min-h-[86vh] lg:min-h-[92vh] flex items-center py-20 sm:py-28 lg:py-32 text-white bg-islamic-geometric">
        {/* طبقات عمق فاخرة — إسلامي + ذهب + ضباب */}
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "var(--pattern-rub-el-hizb)", backgroundSize: "220px 220px" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "var(--pattern-girih-star)", backgroundSize: "320px 320px" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-[var(--brand-gold)]/[0.06] blur-[140px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-900/20 blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[var(--brand-gold)]/[0.03] blur-[100px]" />

        <div className="relative mx-auto w-full max-w-[1600px] px-6 text-center sm:px-10 lg:px-16">
          <motion.div initial="initial" animate="visible" variants={staggerContainer} className="mx-auto max-w-5xl">
            <motion.div variants={scrollFadeUp} className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-5 py-2.5 text-xs font-bold tracking-wide text-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--brand-gold)] text-[var(--brand-green-dark)]">
                <BadgeCheck className="h-3 w-3" />
              </span>
              مرخصة رسمياً برقم ٤٨٢ — حملة إنسانية تنموية منذ ٢٠١٤م
              <span className="h-3 w-px bg-white/15" aria-hidden="true" />
              <span className="text-white/50 font-medium">١١ عامًا من الأثر</span>
            </motion.div>

            <motion.h1 variants={scrollFadeUp} className="text-[2.2rem] font-black leading-[1.25] tracking-tight sm:text-6xl lg:text-[4.5rem] lg:leading-[1.15]">
              العمل الإنساني يبدأ من{" "}
              <span className="gold-foil">فهم الاحتياج</span>
              <br className="hidden sm:block" />
              لا من الإحسان العابر.
            </motion.h1>

            <motion.p variants={scrollFadeUp} className="mx-auto mt-10 max-w-4xl text-base leading-[2.1] text-white/60 sm:text-lg lg:text-xl lg:leading-[2]">
              حملة رحماء بينهم للإغاثة والتنمية — حملة دعوية وإنسانية وتنموية انطلقت
              استجابةً للأزمة اليمنية ومعاناة المواطن. نعمل على صون حياة الإنسان
              وإغاثته وتنميته عبر برامج علمية وإغاثية متنوعة، مستهدفةً الفئات الأكثر احتياجاً.
            </motion.p>

            <motion.div variants={scrollFadeUp} className="mt-12 flex flex-wrap justify-center gap-4">
              <Button onClick={() => go("donate")} variant="gold" icon={<HandHeart className="h-5 w-5" />} className="rounded-2xl px-8 py-6 text-base font-black shadow-[0_16px_40px_rgba(var(--brand-gold-rgb),.28)] hover:shadow-[0_20px_50px_rgba(var(--brand-gold-rgb),.35)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                ابدأ رحلتك معنا — تبرع الآن
              </Button>
              <Button onClick={() => go("about")} variant="outline" icon={<ArrowLeft className="h-5 w-5" />} className="rounded-2xl bg-white/95 px-8 py-6 text-base font-bold text-[var(--brand-green-dark)] shadow-[0_12px_35px_rgba(0,0,0,0.12)] hover:bg-white">
                اقرأ فلسفتنا
              </Button>
            </motion.div>
            <motion.p variants={scrollFadeUp} className="mt-4 text-xs font-medium tracking-wide text-white/40">
              ٨٤٪ من كل تبرع يصل مباشرةً للبرامج الميدانية — شفافية كاملة
            </motion.p>

            <motion.div variants={scrollFadeUp} className="mt-20 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6 lg:gap-8">
              <MetricCard icon={Heart} label="سنوات العطاء" value="١١ عامًا من العطاء" variant="green" />
              <MetricCard icon={Target} label="مسارات البرامج" value="٧ مسارات متكاملة" variant="gold" />
              <MetricCard icon={Globe} label="التغطية الجغرافية" value="٨ محافظات يمنية" variant="green" />
              <MetricCard icon={Users} label="المستفيدون" value="١٥,٠٠٠+ مستفيد مباشر" variant="gold" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          شريط المصداقية الاستراتيجي — ثقة + أثر حي (AIDA: Interest)
          مدمج لتقليل تشتيت الانتباه وزيادة الإقناع المباشر بعد الهيرو
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--secondary)] py-8 sm:py-10">
        <div className="mx-auto max-w-4xl px-4">
          <TrustBadges />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-8">
          <LiveImpactCounter />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          لوحة الأثر التفاعلية الفائقة — أكثر تقدماً (Real-time + AI)
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ImpactDashboard />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          قصص المستفيدين + الشفافية المالية
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>قصص حقيقية</SectionLabel>
            <h2 className="mb-4 text-3xl font-bold text-[var(--brand-green)] sm:text-4xl">
              أصوات من الميدان
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-[2] text-[var(--muted-foreground)]">
              هذه ليست قصص مكتوبة — إنها أصوات حقيقية من أشخاص غيّرتم حياتهم بأيادיכم.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BeneficiaryStoryHero />
            </div>
            <div className="flex flex-col gap-6">
              <ExpenseRatioBar />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          أثر تبرعك — حاسبة عاطفية
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--secondary)] py-24 sm:py-32 bg-islamic-arabesque">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp} className="text-center">
            <SectionLabel>أثر تبرعك</SectionLabel>
            <h2 className="mb-4 text-3xl font-bold text-[var(--brand-green)] sm:text-4xl">
              اختر المبلغ، واكتشف ماذا ستفعل
            </h2>
          </motion.div>
          <div className="mt-14">
            <EmotionalAccounting />
          </div>
        </div>
      </section>

      {/* ── آية قرآنية — جسر روحي استراتيجي بعد إظهار الأثر وقبل القصص ── */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 my-6">
        <div className="rounded-2xl border border-[var(--brand-gold)]/20 bg-gradient-to-l from-[var(--brand-gold)]/5 to-transparent p-6 text-center">
          <p className="font-amiri text-xl leading-loose text-[var(--foreground)] md:text-2xl" dir="rtl">
            ﴿ إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ ﴾
          </p>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">سورة يوسف، الآية ٩٠ — تذكير بأن كل عطاء محفوظ</p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          فلسفتنا — كيف نفكر قبل أن نعمل
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>فلسفتنا</SectionLabel>
            <h2 className="mb-4 max-w-3xl text-3xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl">
              لا نجلب حلولًا جاهزة. نفهم أولاً، ثم نبني معًا.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-[2] text-[var(--muted-foreground)]">
              العمل الإنساني الناجح لا يبدأ بكتابة مشروع على ورق — يبدأ بسؤال المجتمع عن احتياجاته
              الفعلية، ثم بناء استجابة تحترم ذكاء المجتمع وكرامته وثقافته.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                number: "01",
                icon: Globe,
                title: "نفهم السياق",
                text: "كل قرية لها خصوصيتها، وكل مجتمع له ديناميكيته. نبدأ بدراسة ميدانية تضع صوت المجتمع في صلب التصميم، لا في هامشه. نسمع قبل أن نقدم، ونفهم قبل أن نتحرك.",
              },
              {
                number: "02",
                icon: TrendingUp,
                title: "نبني القدرة",
                text: "الهدف ليس أن نبقى للأبد. ندرّب ونمكّن ونرحل تاركين خلفنا قدرة محلية تستمر. كل مشروع يجب أن يترك خلفه نظامًا يعمل دون اعتماد على الحضور الخارجي.",
              },
              {
                number: "03",
                icon: Sparkles,
                title: "نشارك المعرفة",
                text: "الشفافية ليست تقريرًا سنويًا. إنها مسؤولية مستمرة. نشارك كل ريال وما حققه، ونشرح قراراتنا وأخطاءنا، لأن المعرفة حين تُشارك تصبح قوة مجتمعية.",
              },
            ].map((item) => (
              <motion.div key={item.number} variants={scrollFadeUp} className="border-t-2 border-[var(--brand-gold)]/40 pt-6 pb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--brand-gold-dark)]">{item.number}</span>
                  <item.icon className="h-4 w-4 text-[var(--brand-gold)]" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--brand-green)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-[1.95] text-[var(--muted-foreground)]">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          قيمنا — إطار فلسفي عميق
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--secondary)] py-24 sm:py-32 bg-islamic-arabesque">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>قيمنا</SectionLabel>
            <h2 className="mb-4 max-w-3xl text-3xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl">
              قيم ناظمة تحدد كيف نفكر، كيف نتصرف، وكيف نتعلم.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-[2] text-[var(--muted-foreground)]">
              الإخلاص والشفافية والإتقان وتحمل المسؤولية وروح المبادرة — ليست شعارات على جدار،
              إنها مبادئ نطبقها يوميًا في كل قرار نتخذه.
            </p>
          </motion.div>

          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={staggerContainer} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <motion.div key={value.title} variants={scrollFadeUp} whileHover={hoverLift.whileHover} className="rounded-2xl border border-[var(--brand-green)]/8 bg-[var(--card)] p-6 sm:p-8 transition hover:shadow-lg hover:border-[var(--brand-green)]/20">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-green)]/8 text-[var(--brand-green)]">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[var(--brand-green)]">{value.title}</h3>
                <p className="mt-3 text-sm leading-[1.95] text-[var(--muted-foreground)]">{value.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          مجالات العمل — مسارات متكاملة واقعية
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>مجالات العمل</SectionLabel>
            <h2 className="mb-4 max-w-3xl text-3xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl">
              سبعة مسارات متكاملة تغطي احتياجات المجتمع اليمني.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-[2] text-[var(--muted-foreground)]">
              نركّز جهدنا في مجالات نستطيع فيها إحداث أثر حقيقي — من الكفالات إلى الآبار،
              من المطابخ الخيرية إلى تعليم القرآن، ومن الأضاحي إلى الأوقاف المستدامة.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
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
                  className={`group rounded-[24px] p-6 sm:p-8 text-right transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--brand-green)] text-white shadow-[0_20px_60px_rgba(var(--brand-green-rgb),.18)]"
                      : "bg-[var(--background)] text-[var(--brand-green)] hover:shadow-lg hover:bg-[var(--card)] border border-[var(--brand-green)]/8"
                  }`}
                >
                  <div className={`mb-6 grid h-12 w-12 place-items-center rounded-2xl transition-colors ${
                    isActive ? "bg-white/10 text-[var(--brand-gold-light)]" : "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">{program.title}</h3>
                  <p className={`mt-3 text-sm leading-[1.95] ${isActive ? "text-white/70" : "text-[var(--muted-foreground)]"}`}>
                    {program.belief}
                  </p>
                  {isActive && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 border-t border-white/15 pt-6">
                      <div className="mb-4 rounded-xl bg-[var(--brand-gold)]/10 p-3 text-center">
                        <p className="text-sm font-bold text-[var(--brand-gold-light)]">{program.impact}</p>
                      </div>
                      <p className="text-xs font-bold text-[var(--brand-gold-light)]">كيف نعمل</p>
                      <p className="mt-2 text-sm leading-[1.85] text-white/60">{program.approach}</p>
                      <div className="mt-4 rounded-xl bg-white/5 p-4">
                        <p className="text-xs font-bold text-[var(--brand-gold-light)]">الفئات المستهدفة</p>
                        <p className="mt-2 text-sm leading-[1.8] text-white/50">{program.scope}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp} className="mt-10 text-center">
            <Button onClick={() => go("programs")} variant="outline" icon={<ArrowLeft className="h-4 w-4" />} className="rounded-2xl">
              اكتشف جميع المجالات
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Video Showcase ── */}
      <section className="py-24 sm:py-32 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--foreground)] md:text-4xl">
              شاهد أثر مساهمتك
            </h2>
            <p className="mt-4 text-lg text-[var(--muted-foreground)]">
              من الميدان إلى المستفيد — رحلة الخير التي تصنعها معنا
            </p>
          </div>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
            <div className="relative pb-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/?listType=user_uploads&list=@RahmaaBenahum"
                title="حملة رحماء بينهم — رؤيتنا في دقيقة"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          آخرون ي/testimonials — شهادات المستفيدين
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-[var(--secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp} className="text-center">
            <SectionLabel>ماذا يقول المستفيدون</SectionLabel>
            <h2 className="text-center text-3xl font-bold text-[var(--foreground)]">ماذا يقول المستفيدون</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-[2] text-[var(--muted-foreground)]">
              أصوات حقيقية من مجتمعات خدمتها برامجنا — شهادات ت_echoes تأثير العطاء المستدام
            </p>
          </motion.div>
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={staggerContainer} className="mt-12 grid gap-8 md:grid-cols-3">
            <motion.div variants={scrollFadeUp} className="rounded-2xl bg-[var(--card)] p-8 border border-[var(--brand-green)]/8 shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-green)]">أم أحمد — صنعاء</p>
                  <p className="text-xs text-[var(--muted-foreground)]">مستفيدة من كفالة الأيتام</p>
                </div>
              </div>
              <blockquote className="text-sm leading-[1.9] text-[var(--muted-foreground)]">
                "بفضل الكفالة الشهرية، تمكنت من إبقاء أطفالي في المدرسة. لم أكن أتخيل أنني سأرى ابنتي تقرأ القرآن بشكل صحيح. شكراً لكل من ساهم."
              </blockquote>
            </motion.div>
            <motion.div variants={scrollFadeUp} className="rounded-2xl bg-[var(--card)] p-8 border border-[var(--brand-green)]/8 shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-gold)]/10 text-[var(--brand-gold-dark)]">
                  <Utensils className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-green)]">صالح — حجة</p>
                  <p className="text-xs text-[var(--muted-foreground)]">مستفيد من المطابخ الخيرية</p>
                </div>
              </div>
              <blockquote className="text-sm leading-[1.9] text-[var(--muted-foreground)]">
                "السلال الغذائية كانت في توقيت لا نقدر عليه. كان البيت فارغًا والطعام قليلًا. وصلت السلة وكأنها بركة من الله. لا ننسى هذا العطاء."
              </blockquote>
            </motion.div>
            <motion.div variants={scrollFadeUp} className="rounded-2xl bg-[var(--card)] p-8 border border-[var(--brand-green)]/8 shadow-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)]">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--brand-green)]">شيخ عبدالله — مأرب</p>
                  <p className="text-xs text-[var(--muted-foreground)]">⁾ من سكان القرية المخدومة</p>
                </div>
              </div>
              <blockquote className="text-sm leading-[1.9] text-[var(--muted-foreground)]">
                "كنا نمشي ساعات لإحضار الماء. الآن البئر يعمل بالطاقة الشمسية والماء يصل لكل بيت. غيّرتم حياتنا."
              </blockquote>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          نهجنا — كيف نحقق الأثر الحقيقي
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--brand-green)] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel light>منهجيتنا</SectionLabel>
            <h2 className="mb-4 max-w-3xl text-3xl font-bold leading-[1.4] sm:text-4xl">
              أربعة مبادئ توجّه كل تدخل نقوم به في الميدان.
            </h2>
          </motion.div>

          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={staggerContainer} className="mt-14 grid gap-6 sm:grid-cols-2">
            {[
              {
                step: "01",
                title: "الاستماع أولاً",
                desc: "قبل أن نتحرك، نجلس مع المجتمع. نسمع لقصصهم، نفهم تحدياتهم، ونحترم ثقتهم فينا. لا نفرض رؤيتنا — نستضيف رؤيتهم.",
              },
              {
                step: "02",
                title: "التصميم المشترك",
                desc: "المجتمع شريك في التصميم، لا مستقبل فقط للخدمة. نعمل معًا لتصميم حلول تتناسب مع واقعهم وثقافتهم واحتياجاتهم الحقيقية.",
              },
              {
                step: "03",
                title: "التنفيذ المرن",
                desc: "الميدان يتغير يوميًا. نجعل تنفيذنا مرنًا لتتناسب مع المتغيرات — لا نتمسك بخطة فشلت، بل نتعلم ونتعديل باستمرار.",
              },
              {
                step: "04",
                title: "القياس والإعلام",
                desc: "نقيس الأثر بطرق علمية، ونشرع النتائج — حتى النتائج السلبية. لأن المعرفة الحقيقية تأتي من الصدق في الإبلاغ.",
              },
            ].map((item) => (
              <motion.div key={item.step} variants={scrollFadeUp} whileHover={hoverLift.whileHover} className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-gold)]/20 text-[var(--brand-gold-light)] text-sm font-bold">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-[1.95] text-white/60">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          الشفافية — وعد لا تكرار
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
              <SectionLabel>الشفافية</SectionLabel>
              <h2 className="mb-4 text-3xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl">
                تبرعك يصل أين يجب أن يصل.
              </h2>
              <p className="mt-6 text-sm leading-[2] text-[var(--muted-foreground)]">
                لا نخفي شيئًا. كل ريال يُنفق له وثيقة، وكل مشروع له مسار واضح. الشفافية ليست خيارًا أو ترفًا إداريًا — إنها جزء من هويتنا المؤسسية ومسؤوليتنا تجاه من وثق بنا.
              </p>
              <p className="mt-4 text-sm leading-[2] text-[var(--muted-foreground)]">
                ننشر تقاريرنا بشكل دوري، ونشارك بيانات الأثر مع شركائنا والمجتمع. لا نخجل من أخطائنا — نتعلم منها ونعلن عنها لأن الثقة تُبنى على الصدق لا الكمال.
              </p>
              <div className="mt-8">
                <Button onClick={() => go("transparency")} variant="outline" icon={<ArrowLeft className="h-4 w-4" />} className="rounded-2xl">
                  اطلع على تقاريرنا
                </Button>
              </div>
            </motion.div>

            <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
              <blockquote className="border-r-2 border-[var(--brand-gold)]/40 pr-6 text-xl font-bold leading-[1.8] text-[var(--brand-green)]">
                "أفضل العطاء ما ترك في حياة الناس قدرةً جديدة."
              </blockquote>
              <p className="mt-6 text-sm leading-[2] text-[var(--muted-foreground)]">
                لا نكتفي بعبور الأزمة. نبني قدرة المجتمع على الاعتماد على الذات — حتى نصل إلى اليوم الذي لا نكون فيه مطلوبين فيه. هذا هو الهدف الحقيقي للعمل الإنساني المسؤول.
              </p>
              <p className="mt-4 text-sm leading-[2] text-[var(--muted-foreground)]">
                كل مشروع نبتكره يمر بثلاث مراحل: بناء الثقة، بناء القدرة، ثم الانسحاب المسؤول. لا نكون أبطالًا — نكون شركاء يمكّنون المجتمع من أن يكون بطل قصته بنفسه.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          أثرنا — كيف نحول الكلام إلى أفعال
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--secondary)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>الأثر</SectionLabel>
            <h2 className="mb-4 max-w-3xl text-3xl font-bold leading-[1.4] text-[var(--brand-green)] sm:text-4xl">
              لا نعد بعدد المستفيدين — نعد بجودة الأثر.
            </h2>
          </motion.div>

          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={staggerContainer} className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "أثر اجتماعي",
                desc: "مجتمعات أكثر قدرة على التعامل مع التحديات. أسر تنتقل من الاعتماد على المساعدات إلى الإنتاج والمشاركة الفعالة. أيتام يحصلون على فرصة حقيقية للتعلم والنمو.",
              },
              {
                icon: TrendingUp,
                title: "أثر اقتصادي",
                desc: "مشاريع حقيقية تُنشأ عبر تمكين الأسر من الدخل المستدام. ماكينات خياطة وقوارب صيد ومواشي تحوّل الأسر من المتلقين إلى المنتجين. لا نريد اعتمادًا — بل حرية.",
              },
              {
                icon: Award,
                title: "أثر مؤسسي",
                desc: "منظمات محلية قادرة على الاستمرار والتطور. نعمل مع الشركاء المحليين لبناء مؤسسات تستمر العمل لسنوات قادمة. كل مشروع يترك نظامًا يعمل دون اعتماد على الحضور الخارجي.",
              },
            ].map((item) => (
              <motion.div key={item.title} variants={scrollFadeUp} whileHover={hoverLift.whileHover} className="rounded-2xl bg-[var(--card)] p-6 sm:p-8 border border-[var(--brand-green)]/8 shadow-md transition-shadow hover:shadow-lg">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand-green)]/8 text-[var(--brand-green)]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-[var(--brand-green)]">{item.title}</h3>
                <p className="mt-4 text-sm leading-[1.95] text-[var(--muted-foreground)]">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          دعوة للعمل — بسيطة وصريحة وعميقة
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--brand-green)] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel light>خطوة جديدة</SectionLabel>
            <h2 className="mb-4 text-3xl font-bold leading-[1.4] sm:text-5xl">
              اجعل عطاؤك{" "}
              <span className="text-[var(--brand-gold-light)]">بداية حكمة.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-[2] text-white/55 sm:text-base">
              التبرع ليس نهاية المعاملة — إنه بداية علاقة. نأخذك معنا في الرحلة، ونشاركك الأثر
              خطوة بخطوة. لا نريد أنك دفعت ورحلت — بل أنك شريك في قصة أثر حقيقي.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Button onClick={() => go("donate")} variant="gold" icon={<HandHeart className="h-4 w-4" />} className="rounded-2xl shadow-[0_14px_30px_rgba(var(--brand-gold-rgb),.24)]">
                تبرع الآن
              </Button>
              <Button onClick={() => go("volunteer")} variant="outline" icon={<Heart className="h-4 w-4" />} className="rounded-2xl bg-[var(--card)] shadow-[0_14px_30px_rgba(var(--foreground-rgb),.14)]">
                كن جزءًا من الرحلة
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          التواصل — مباشر وواضح
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp}>
            <SectionLabel>تواصل</SectionLabel>
            <h2 className="mb-4 text-3xl font-bold text-[var(--brand-green)] sm:text-4xl">
              فريقنا جاهز للاستماع.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-[2] text-[var(--muted-foreground)]">
              سواء كنت ترغب في التبرع، أو الشراكة، أو التطوع — أو حتى لديك سؤال فلسفي عن العمل الإنساني.
              نؤمن بأن كل سؤال هو بداية تعلم، ونرحب به.
            </p>
          </motion.div>

          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp} className="mt-14 flex flex-wrap gap-3">
            <Button onClick={() => go("contact")} variant="outline" icon={<MessageCircle className="h-4 w-4" />} className="rounded-2xl">
              تواصل مع الفريق
            </Button>
            <motion.a
              href="https://wa.me/967780777007"
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-[var(--brand-green)]/15 bg-[var(--card)] px-6 text-sm font-bold text-[var(--brand-green)] transition hover:bg-[var(--brand-green-pale)]"
            >
              <span>واتساب مباشر</span>
              <MessageCircle className="h-4 w-4" />
            </motion.a>
          </motion.div>

          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={staggerContainer} className="mt-14 grid gap-6 sm:grid-cols-2">
            <motion.div variants={scrollFadeUp} className="flex items-center gap-4 rounded-2xl border border-[var(--brand-green)]/10 bg-[var(--card)] p-6 sm:p-8">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand-green-pale)] text-[var(--brand-green)]">
                <Landmark className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">المكتب الرئيسي</p>
                <p className="mt-1 text-sm font-bold text-[var(--brand-green)]">صنعاء — شارع الزبيري، الجمهورية اليمنية</p>
              </div>
            </motion.div>
              <motion.div variants={scrollFadeUp} className="flex items-center gap-4 rounded-2xl border border-[var(--brand-green)]/10 bg-[var(--card)] p-6 sm:p-8">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand-gold-pale)] text-[var(--brand-gold-dark)]">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">للاستفسارات</p>
                <p dir="ltr" className="mt-1 text-sm font-bold text-[var(--brand-green)]">+967 780 777 007</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          مشاركة اجتماعية — اجعل الخير ينتشر
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[var(--secondary)] py-24 sm:py-32 bg-islamic-arabesque">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div initial="initial" whileInView="visible" viewport={viewportOnce} variants={scrollFadeUp} className="text-center">
            <SectionLabel>انشر الخير</SectionLabel>
            <h2 className="mb-4 text-3xl font-bold text-[var(--brand-green)] sm:text-4xl">
              شارك الحملة واحصل على أجر مضاعف
            </h2>
          </motion.div>
          <div className="mt-14">
            <ViralShare />
          </div>
        </div>
      </section>

      {/* Scroll to top */}
      <motion.button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="العودة إلى الأعلى"
        whileHover={{ y: -3, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-[var(--brand-green)]/15 bg-[var(--card)]/90 text-[var(--brand-green)] shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--brand-green)] hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none"
      >
        <MoveUpLeft className="h-4 w-4" aria-hidden="true" />
      </motion.button>
    </div>
  );
}

export default HomePage;

