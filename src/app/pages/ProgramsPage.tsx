// Programs Page - صفحة البرامج والمشاريع
import {
  BookOpen,
  Heart,
  Droplet,
  GraduationCap,
  Globe,
  Users,
  ArrowRight,
  Calendar,
  Target,
  TrendingUp,
  MapPin,
  Award,
  CheckCircle,
  Sparkles,
  Lightbulb,
  Shield,
  Leaf,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/app/components/PageHeader";
import { Button } from "@/app/components/ui/button";
import { analyticsService } from "@/shared/services/analytics.service";
import { contentManager } from "@/shared/services/content-manager";
import {
  scrollFadeUp,
  staggerContainer,
  viewportOnce,
  hoverLift,
} from "@/utils/animations";
import { useSEO } from "@/utils/seoAdvanced";

interface ProgramPath {
  id: string;
  label: string;
  icon: typeof BookOpen;
  color: string;
  belief: string;
  methodology: string;
  scope: string;
  projects: string[];
  achievement: string;
}

const PROGRAM_PATHS: ProgramPath[] = [
  {
    id: "da",
    label: "مسار الدعوة",
    icon: BookOpen,
    color: "blue",
    belief:
      "نسجد أن الدعوة إلى الله هي المنبع الذي ينبع منه كل خير. فهي ليست نشاطاً ثانوياً يُضاف إلى العمل الإنساني، بل هي الركيزة الأولى التي تمنح العمل الإنساني معناه وروحه. الدعوة الحقيقية هي التي تجمع بين الكلمة الطيبة والعمل الصالح، بين النصح والرحمة، بين العلم والممارسة.",
    methodology:
      "نعتمد منهجاً شاملاً يبدأ من بناء الوعي الفردي وصولاً إلى تغيير سلوك المجتمع. ندمج بين الحلقات الشرعية المتسلسلة وبرامج النشر العلمي المتخصص، مع الاهتمام بتأهيل الدعاة واستشارتهم لخدمة المجتمع محلياً وإقليمياً. نؤمن بأن الدعوة الناجحة هي التي تتحول من خطاب نظري إلى واقع ملموس يحسّ به الفرد في حياته اليومية.",
    scope:
      "تتسع مساراتنا البرامجية في الدعوة لتشمل الحلقات الشرعية والتحفيظ القرآني وبرامج تأهيل الدعاة والمحاضرات والدورات التثقيفية التي تُقدم في المساجد والمراكز المجتمعية والجامعات، مع اهتمام خاص بالنساء والشباب والفئات الهشة التي تحتاج إلى رعاية دعوية مهنية.",
    projects: ["تأهيل الدعاة", "تحفيظ القرآن الكريم", "النشر العلمي والمحاضرات"],
    achievement: "افتتحنا ٦ حلقات تحفيظ في ٣ محافظات",
  },
  {
    id: "social",
    label: "مسار الرعاية الاجتماعية",
    icon: Heart,
    color: "rose",
    belief:
      "نؤمن بأن الأيتام والأرامل والمحتاجين ليسوا عالة على المجتمع، بل هم أمانة في أعناقنا. الرعاية الاجتماعية ليست إحساناً من الأعلى إلى الأسفل، بل هي التزام ديني وإنساني يحقق الكرامة ويصون الكيان. في عالم يتسارع فيه النسيان، نحن نسعى لبناء هالة من الحماية تُطوّق الأسر المعوزة.",
    methodology:
      "نبني نظام رعاية متكامل يجمع بين الكفالات طويلة الأمد والمساعدات المقطوعة الآنية. لا نكتفي بتوزيع الأموال، بل نبني علاقات حقيقية مع الأسر المستفيدة من خلال المتابعة الدورية والتقييم المستمر وبرامج التمكين الاقتصادي التي تُخرج الأسر من دائرة الإعانة إلى دائرة الإنتاج. نؤمن بأن كل يتيم يستحق عائلة حاضرة في حياته.",
    scope:
      "تتسع برامجنا لتشمل كفالات الأيتام والمساعدات المقطوعة والكسوات والكفالات المتكررة. وبرامج الرعاية الاجتماعية تشمل الأيتام والأرامل والمحتاجين والنازحين والمحتاجين.",
    projects: ["كفالة الأيتام والأرامل", "المساعدات المقطوعة", "الكسوات والأغطية"],
    achievement: "كفلنا ٤٥٠ يتيمًا بدعم شهري منتظم",
  },
  {
    id: "food",
    label: "مسار الأمن الغذائي",
    icon: Droplet,
    color: "cyan",
    belief:
      "الأمن الغذائي ليس مجرد تزويد الأسر بالغذاء، بل هو حق أساسي مצפון في القيم الإنسانية والشرعية. الطعام الذي نقدمه ليس رغيف خبز يملأ المعدة فحسب، بل هو شمعة أمل تُضيء بيتاً يكاد الظلام يبتلعه. نؤمن بأن تجوع طفل واحد في مجتمع يفيض فيه الخير هو فشل جماعي يتطلب إجابة جماعية.",
    methodology:
      "نبني استراتيجية متعددة الأوجه للتعامل مع قضايا الأمن الغذائي والاحتياجات الأساسية. نبدأ بالتقييم الميداني الشامل لتحديد الاحتياجات، ثم نُنظّم التدخل المباشر عبر المطابخ الخيرية والسلال الغذائية، ونتجه إلى الحلول المستدامة عبر مشاريع الزراعة والتمكين الاقتصادي. نعمل مع المجتمعات المحلية لضمان وصول المساعدات إلى من هم في أمس الحاجة إليها.",
    scope:
      "تتسع برامجنا لتغطية المناطق النائية والمحروقة والمتأثرة بالنزاعات. نخدم الأسر المنتجة والمحتاجين والنازحين عبر مشاريع المطابخ الخيرية والسلال الغذائية وتوزيع التمور واللحوم والتدخلات الغذائية الطارئة.",
    projects: ["المطابخ الخيرية", "السلال الغذائية", "توزيع التمور واللحوم"],
    achievement: "وزّعنا ١٢,٠٠٠ سلة غذائية متكاملة",
  },
  {
    id: "seasonal",
    label: "المسار الموسمي",
    icon: Calendar,
    color: "amber",
    belief:
      "المواسم في حياتنا ليست مجرد فترات زمنية عابرة، بل هي فرص ذهبية نُعزّز بها روحانية المجتمع وترابطه. رمضان موسم الرحمة والتراحم، وعيد الأضحى موسم التضحية والتقرب، والشتاء موسم العطف والحماية. نؤمن بأن العمل في هذه المواسم يضاعف الأجر ويعزز الإحساس بالانتماء والمسؤولية المشتركة.",
    methodology:
      "نُعِدّ فريقاً خاصاً لكل موسم، نبدأ بالتخطيط المبكر قبل أسابيع من الموعد، ونعمل مع الفعاليات المحلية لتحديد الفئات المستهدفة وآليات التوصيل. نبني شراكات استراتيجية مع المطابخ المحلية وموردي المواد الغذائية لتوفير أفضل جودة بأقل تكلفة. نحرص على أن تكون التوزيعات في الوقت المناسب وبشكل يحافظ على كرامة المستفدين.",
    scope:
      "تتسع برامجنا الموسمية لتشمل جميع مواسم الخير والأعياد والطقس القارس. نخدم الأيتام والمحتاجين والنازحين عبر برامج الأضاحي وتفطير الصائمين ودفء الشتاء واحتفالات الأعياد.",
    projects: ["ضحايا الأضحى", "تفطير الصائمين", "دفء الشتاء"],
    achievement: "ذبحنا ٣٠٠ أضحية ووزّعنا لحومها على ٢,٠٠٠ أسرة",
  },
  {
    id: "endowment",
    label: "مسار الصدقات الجارية",
    icon: Globe,
    color: "emerald",
    belief:
      "الصدقة الجارية هي أرقى أنواع الخير، فهي عمل لا يتوقف عن الأجر حتى بعد رحيل العامل. نؤمن بأن بناء مسجد أو حفر بئر أو إنشاء مركز قرآني هو استثمار أكيد في حياة المجتمع ونماء الخير فيه. الصدقات الجارية تُحيي التراث الإسلامي العريق في بناء المؤسسات الدائمة التي تخدم الأجيال.",
    methodology:
      "نبني مشاريع الصدقات الجارية على أسس هندسية وإدارية محكمة. نقوم بدراسات الجدوى الفنية والمالية لكل مشروع، ونعمل مع متخصصين في هندسة الإنشاءات والإشراف لضمان الجودة والسلامة. نتحقّق من التمويل من مصادر متعددة ونراقب التنفيذ بشكل دقيق مع تقارير دورية للمتبرعين.",
    scope:
      "تتسع برامجنا لتشمل بناء المساجد وحفر الآبار وبناء دور القرآن والمرافق المجتمعية الأساسية التي تخدم مجتمعات كاملة على مدى عقود.",
    projects: ["بناء المساجد", "حفر الآبار المائية", "بناء دور القرآن والتعليم"],
    achievement: "أنجزنا ٨ آبار مياه تعمل بالطاقة الشمسية",
  },
  {
    id: "waqf",
    label: "مسار الأوقاف",
    icon: Award,
    color: "purple",
    belief:
      "الوقف هو النموذج الإسلامي الأصيل لإدارة الثروة والتراحم. إنه نظام يحول الملكية الفردية إلى منفعة عامة دائمة، ويجعل المال рабّاً للخير لا سيداً له. نؤمن بأن إعادة إحياء ثقافة الوقف هو الحل الأمثل للمستقبل المستدام، فهو يُنشئ مصادر دخل دائمة تخدم الأجيال القادمة.",
    methodology:
      "نبني برامج أوقاف مبتكرة تجمع بين الأصالة والحداثة. نقدم الاستشارات القانونية والمالية للموقفين، ونراقب إدارة الأوقاف العقارية والأسهم الوقفية، ونضمن التوزيع العادل للريع على الفئات المستحقة. نعمل على توسيع قاعدة الموقفين من خلال حملات توعية وبرامج تأهيل.",
    scope:
      "تتسع برامج الأوقاف لتشمل الوقف العقاري والأسهم الوقفية وتمكين الأدوات ومشاريع الدخل المستدام التي تخدم الأيتام والمحتاجين والمقيمين في المناطق النائية.",
    projects: ["الوقف العقاري", "الأسهم الوقفية", "تمكين الأدوات ومشاريع الدخل"],
    achievement: "أنشأنا ٥ مشاريع وقفية تخدم أكثر من ١,٠٠٠ أسرة",
  },
  {
    id: "zakat",
    label: "حاسبة الزكاة",
    icon: Target,
    color: "green",
    belief:
      "الزكاة ليست رسماً مالياً فحسب، بل هي ركن من أركان الإسلام يُطهّر النفس وينمي المال ويعزز التكافل الاجتماعي. نؤمن بأن حاسبة الزكاة الدقيقة هي الخطوة الأولى نحو أداء هذا الركن على الوجه الأكمل. إنها ليست تقنية حسابية فحسب، بل هي أداة توعوية تُذكّر المسلمين بأهمية الزكاة وأثرها في حياتهم.",
    methodology:
      "نقدم حاسبة زكاة شاملة تدعم الزكاة المالية والذهبية والفطرية. تعتمد الحاسبة على المعادلات الشرعية المعتمدة مع مراعاة الفروق الفقهية بين المذاهب. نُقدّم نتائج الحاسبة مع توجيهات عملية لأفضل قنوات الدفع وأكثر المشاريع حاجةً للدعم.",
    scope:
      "تتسع خدماتنا لتشمل حساب زكاة المال والذهب والأنعام والزكاة الفطرية، مع توجيه المتبرعين لأفضل قنوات الدفع وأكثر المشاريع حاجةً للدعم",
    projects: ["زكاة المال", "زكاة الذهب", "زكاة الفطر"],
    achievement: "حسبنا زكاة لأكثر من ٣,٠٠٠ متبرع بدقة شرعية",
  },
];

const PATH_COLORS: Record<string, { gradient: string; bg: string }> = {
  blue: {
    gradient: "from-[var(--brand-green)] to-[var(--brand-green-dark)]",
    bg: "var(--brand-green-pale)",
  },
  rose: {
    gradient: "from-[var(--destructive)] to-[var(--brand-gold)]",
    bg: "var(--brand-green-pale)",
  },
  cyan: {
    gradient: "from-[var(--brand-green)] to-[var(--brand-green-dark)]",
    bg: "var(--brand-green-pale)",
  },
  amber: {
    gradient: "from-[var(--brand-gold)] to-[var(--brand-gold-light)]",
    bg: "var(--brand-gold-pale)",
  },
  emerald: {
    gradient: "from-[var(--brand-green)] to-[var(--brand-green-light)]",
    bg: "var(--brand-green-pale)",
  },
  purple: {
    gradient: "from-[var(--brand-green)] to-[var(--brand-green-light)]",
    bg: "var(--brand-green-pale)",
  },
  green: {
    gradient: "from-[var(--brand-green)] to-[var(--brand-green-light)]",
    bg: "var(--brand-green-pale)",
  },
};

const STAT_ITEMS = [
  { label: "مسار برامجي", value: "٧", icon: Target, color: "green" as const },
  { label: "برنامج فعّال", value: "٢١+", icon: Sparkles, color: "gold" as const },
  { label: "فئات مستهدفة", value: "٥+", icon: Users, color: "blue" as const },
  { label: "مناطق تغطية", value: "شاملة", icon: MapPin, color: "purple" as const },
];

export default function ProgramsPage() {
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState<string | null>(null);

  useSEO({
    title: "برامجنا ومشاريعنا — رحماء بينهم",
    description:
      "تعرّف على 7 مسارات برامجية شاملة تُعنى بالدعوة والرعاية الاجتماعية والأمن الغذائي والمواسم والصدقات الجارية والأوقاف — برامج مبنية على فلسفة عميقة ونهج علمي متقدم",
    type: "website",
    url: "https://rbdcye.org/programs",
    keywords: [
      "برامج",
      "مشاريع",
      "إغاثة",
      "تنمية",
      "تعليم",
      "يمن",
      "رحماء بينهم",
      "أيتام",
      "زكاة",
      "صدقات",
    ],
  });

  // تحميل البيانات من content-bridge
  useEffect(() => {
    contentManager
      .getImpact()
      .then(() => {
        try {
          analyticsService.generateProjectReport();
        } catch {
          /* non-critical */
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* Unified Page Header */}
      <PageHeader
        icon={GraduationCap}
        badge="برامجنا"
        title="برامجنا ومشاريعنا"
        subtitle="نطمح لتغطية جميع احتياجات المجتمع عبر 7 مسارات متكاملة تشمل الدعوة، الرعاية الاجتماعية، الأمن الغذائي، والتنمية المستدامة"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {STAT_ITEMS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
              >
                <Icon className="w-5 h-5 text-[var(--brand-gold)] mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </PageHeader>

      {/* ═══════ آية قرآنية ═══════ */}
      <div className="my-8 rounded-2xl border border-[var(--brand-gold)]/20 bg-gradient-to-l from-[var(--brand-gold)]/5 to-transparent p-6 text-center">
        <p className="font-amiri text-xl leading-loose text-[var(--foreground)] md:text-2xl" dir="rtl">
          ﴿ فَمَن يَعْمَل مِّثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ﴾
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">سورة الزلزلة، الآية ٧</p>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* مقدمة فلسفية */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scrollFadeUp}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-semibold bg-[var(--brand-green-pale)] px-4 py-1.5 rounded-full mb-6">
              <Lightbulb className="w-4 h-4" />
              فلسفتنا البرامجية
            </span>
            <h2 className="text-3xl md:text-3xl font-bold text-[var(--foreground)] mb-6 leading-relaxed">
              برامجنا ليست مجرد{" "}
              <span className="text-[var(--brand-green)]">مشاريع توزيع</span>
              <br />
              بل هي{" "}
              <span className="text-[var(--brand-gold)]">منظومة متكاملة</span>{" "}
              من التغيير المجتمعي
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg leading-[2] mb-8">
              نؤمن بأن العمل الإنساني الناجح هو الذي يبدأ من فلسفة راسخة وينتهي إلى أثر دائم.
              لذا بنيّا 7 مسارات برامجية لا تعمل بشكل معزول، بل تتداخل وتتكامل لتشكّل منظومة
              شاملة تُعالج أطراف المشكلة من جذورها. كل مسار يحمل رؤية فلسفية عميقة، ومنهجية
              عمل محددة، ونطاقاً واسياً يتجاوز مجرد التأثير الفوري ليصل إلى التحول
              المجتمعي المستدام.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--brand-green)]" />
                مبنية على قيم إسلامية أصيلة
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--brand-green)]" />
                مصممة لإحداث تحول حقيقي
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[var(--brand-green)]" />
                متكاملة ومتداخلة
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* مسارات البرامج — البطاقات التفصيلية */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[var(--secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-semibold bg-[var(--brand-green-pale)] px-4 py-1.5 rounded-full mb-4">
              <Target className="w-4 h-4" />
              مساراتنا البرامجية
            </span>
            <h2 className="text-3xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
              <span className="text-[var(--brand-green)]">٧ مسارات</span> برامجية
              متكاملة
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              كل مسار يحمل فلسفة عميقة ومنهجية محددة ونطاقاً واسياً يتجاوز مجرد التأثير
              الآني
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-10">
            {PROGRAM_PATHS.map((path, i) => {
              const Icon = path.icon;
              const colorDef = PATH_COLORS[path.color];
              const isActive = activePath === path.id;

              return (
                <motion.div
                  key={path.id}
                  initial="initial"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={scrollFadeUp}
                  transition={{ delay: i * 0.06 }}
                  onMouseEnter={() => setActivePath(path.id)}
                  onMouseLeave={() => setActivePath(null)}
                  onFocus={() => setActivePath(path.id)}
                  onBlur={() => setActivePath(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      if (path.id === "zakat") navigate("/zakat");
                      else navigate("/projects");
                    }
                  }}
                  className={`group relative bg-[var(--card)] rounded-3xl border shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer ${
                    isActive
                      ? "border-[var(--brand-green)]"
                      : "border-[var(--border)]"
                  }`}
                  onClick={() => {
                    if (path.id === "zakat") {
                      navigate("/zakat");
                    } else {
                      navigate("/projects");
                    }
                  }}
                >
                  {/* Gradient accent */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorDef.gradient}`}
                  />

                  <div className="p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start gap-5 mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorDef.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl text-[var(--foreground)] mb-2 group-hover:text-[var(--brand-green)] transition-colors">
                          {path.label}
                        </h3>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--brand-green)] group-hover:-translate-x-1 transition-all duration-300 flex-shrink-0 mt-2" />
                    </div>

                    {/* Content sections */}
                    <div className="grid md:grid-cols-3 gap-8">
                      {/* Belief */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[var(--brand-green)]">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm font-bold">الفلسفة والرسالة</span>
                        </div>
                        <p className="text-[var(--muted-foreground)] text-sm leading-[1.9]">
                          {path.belief}
                        </p>
                      </div>

                      {/* Methodology */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[var(--brand-gold)]">
                          <Lightbulb className="w-4 h-4" />
                          <span className="text-sm font-bold">المنهجية والفلسفة</span>
                        </div>
                        <p className="text-[var(--muted-foreground)] text-sm leading-[1.9]">
                          {path.methodology}
                        </p>
                      </div>

                      {/* Scope */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[var(--brand-green)]">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm font-bold">النطاق والاستهداف</span>
                        </div>
                        <p className="text-[var(--muted-foreground)] text-sm leading-[1.9]">
                          {path.scope}
                        </p>
                      </div>
                    </div>

                    {/* Achievement banner */}
                    <div className="mb-6 rounded-xl bg-[var(--brand-green)]/5 border border-[var(--brand-green)]/10 p-4 text-center">
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-green)]">
                        <Award className="w-4 h-4 text-[var(--brand-gold)]" />
                        {path.achievement}
                      </span>
                    </div>

                    {/* Projects */}
                    <div className="mt-6 pt-6 border-t border-[var(--border)]">
                      <div className="flex flex-wrap gap-3">
                        {path.projects.map((project, j) => (
                          <span
                            key={j}
                            className="inline-flex items-center gap-2 text-sm bg-[var(--brand-green-pale)] text-[var(--brand-green)] px-4 py-2 rounded-full font-medium"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {project}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorDef.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* قيم برامجية */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scrollFadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-gold)] text-sm font-semibold bg-[var(--brand-gold-pale)] px-4 py-1.5 rounded-full mb-4">
              <Shield className="w-4 h-4" />
              مبادئنا التأسيسية
            </span>
            <h2 className="text-3xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
              قيم توجّه{" "}
              <span className="text-[var(--brand-green)]">كل برنامج</span>{" "}
              نقدمه
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              ليست مجرد شعارات معلّقة على الجدران، بل معايير نقيس بها أنفسنا في كل خطوة
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: Shield,
                title: "الإخلاص والنية",
                desc: "نأكد أن كل عمل نقدمه هو خالصاً لوجه الله. الإخلاص هو المعيار الذي نقيس به نوايانا قبل مشاريعنا.",
              },
              {
                icon: Sparkles,
                title: "الشفافية المطلقة",
                desc: "نؤمن بأن الثقة تُبنى بالشفافية. كل ريال يتبرع به المتبرع تعرف أين ذهب وكيف أُنفق.",
              },
              {
                icon: TrendingUp,
                title: "الإتقان والجودة",
                desc: "لا نقبل بالاعتدال في العمل الإنساني. كل برنامج نقدمه يخضع لمعايير جودة صارمة ومتابعة مستمرة.",
              },
              {
                icon: Heart,
                title: "كرامة المستفيد",
                desc: "المستفيد ليس مجرد رقم في تقرير. هو إنسان تستحق أن يُعامَل بالاحترام والكرامة في كل تفصيلة.",
              },
              {
                icon: Lightbulb,
                title: "الابتكار والتطوير",
                desc: "نرفض الركود. نبحث دائماً عن طرق أكثر فاعلية وأكثر كفاءة في تحقيق الأثر.",
              },
              {
                icon: Leaf,
                title: "الاستدامة والتأثير",
                desc: "نخطط للحظة ونعمل للأجيال. كل مشروع نبنيه يجب أن يخدم المجتمع بعد عقود من تنفيذه.",
              },
            ].map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={scrollFadeUp}
                  whileHover={hoverLift.whileHover}
                  className="bg-[var(--card)] rounded-2xl p-5 sm:p-6 border border-[var(--border)] shadow-md hover:shadow-lg transition-all duration-300 min-h-[200px] flex flex-col"
                >
                  <Icon className="w-8 h-8 text-[var(--brand-green)] mb-4" />
                  <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)] text-sm leading-[1.9] flex-1">
                    {value.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* إنجازات — أرقام حقيقية من الميدان */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[var(--secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scrollFadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-gold)] text-sm font-semibold bg-[var(--brand-gold-pale)] px-4 py-1.5 rounded-full mb-4">
              <TrendingUp className="w-4 h-4" />
              إنجازاتنا في أرقام
            </span>
            <h2 className="text-3xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
              أرقام تعكس{" "}
              <span className="text-[var(--brand-green)]">أثرًا حقيقيًا</span>{" "}
              في حياة الناس
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              كل رقم وراءه قصة إنسان غيّر الله حياته عبر برامجنا — هذه ليست مجرد إحصائيات، بل شهادات حياة
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { number: "٤٥٠", label: "يتيمًا يتلقون دعمًا شهريًا", icon: Heart, color: "rose" },
              { number: "١٢,٠٠٠", label: "سلة غذائية موزّعة", icon: Droplet, color: "cyan" },
              { number: "٨", label: "آبار تعمل بالطاقة الشمسية", icon: Globe, color: "blue" },
              { number: "٢,٥٠٠", label: "فحص طبي مجاني", icon: Shield, color: "emerald" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={scrollFadeUp}
                whileHover={hoverLift.whileHover}
                className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand-green)]/8 text-[var(--brand-green)] mx-auto mb-4">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-[var(--brand-green)] mb-2">{stat.number}</div>
                <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* CTA Section */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="visible"
            viewport={viewportOnce}
            variants={scrollFadeUp}
            className="text-center mb-16"
          >
            <Heart className="w-16 h-16 text-white/30 mx-auto mb-6" fill="currentColor" />
            <h2 className="text-3xl md:text-3xl font-bold text-white mb-6">
              هل تريد دعم برنامجاً من برامجنا؟
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-[2]">
              كل تبرع يُحوّل فلسفة على الورق إلى واقع ملموس في حياة محتاج. اختر المسار الذي
              يلامس قلبك، وكن جزءاً من التغيير الذي نعمل لإنجازه
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/donate")}
                variant="primary"
                size="lg"
                icon={<Heart className="w-5 h-5" fill="white" />}
                className="bg-white text-[var(--brand-green)] hover:bg-white/90"
              >
                تبرع الآن
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                variant="outline"
                size="lg"
                icon={<Users className="w-5 h-5" />}
                className="border-white/40 text-white hover:bg-white/10"
              >
                تواصل معنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
