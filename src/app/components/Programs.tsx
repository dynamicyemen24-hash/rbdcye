import { motion, AnimatePresence } from "motion/react";
import { Heart, BookOpen, Users, Mic, ArrowLeft, Target, ChevronLeft } from "lucide-react";
import { useState, useEffect, memo } from "react";

import { SEED_PROJECTS } from "@/content/website";
import { getSanityImageUrl } from "@/lib/sanity-helpers";
import { useDynamicContent } from "@/shared/hooks/useDynamicContent";

interface ProgramsProps {
  readonly setCurrentPage: (page: string) => void;
}

interface SectorData {
  id: string;
  category: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  headline: string;
  description: string;
  themes: string[];
  color: string;
  gradient: string;
  href: string;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  'إغاثة': Heart,
  'تعليم': BookOpen,
  'تنمية': Users,
  'دعوة': Mic,
};

const SECTORS: SectorData[] = [
  {
    id: "relief",
    category: "إغاثة",
    icon: Heart,
    title: "الإغاثة الإنسانية",
    headline: "نصل إليك أينما كنت — في أصعب اللحظات",
    description:
      "لا ننتظر حتى نسمع عن الكارثة. فرقنا الميدانية تعمل في المحافظات المتضررة بشكل مستمر — من توزيع السلال الغذائية الشهرية إلى إيواء الأسر التي فقدت بيوتها. نبلغ الأسر النائية قبل أن يبلغها الإعلام، ونعمل بشراكة مع المجتمعات المحلية لضمان وصول المساعدات إلى من يحتاجها فعلاً.",
    themes: ["سلال غذائية شهرية", "إيواء طارئ", "برامج طبية ميدانية", "إيواء مؤقت"],
    color: "#DC2626",
    gradient: "from-red-50/80 to-red-100/40",
    href: "programs",
  },
  {
    id: "education",
    category: "تعليم",
    icon: BookOpen,
    title: "التعليم والبناء البشري",
    headline: "التعليم ليس مرفقاً — إنه بوابة التغيير الوحيد",
    description:
      "في اليمن حيث تُغلق المدارس ويتوقف التعليم، نفتح أبواباً بديلاً. مكتباتنا المتنقلة تصل إلى المناطق التي لا تتوفر فيها مدرسة، وبرامج التدريب المهني تُعطي الشباب مهارات حقيقية تُطعمهم. لا نكتفي بتعليم القراءة — نُعلي من قيم المعرفة ونبني أجيالاً قادرة على إعادة بناء اليمن بأنفسهم.",
    themes: ["منح دراسية", "محو أمية", "تدريب مهني", "مكتبات متنقلة"],
    color: "#2563EB",
    gradient: "from-blue-50/80 to-blue-100/40",
    href: "programs",
  },
  {
    id: "development",
    category: "تنمية",
    icon: Users,
    title: "التنمية المجتمعية",
    headline: "لا نُطعم المجتمع — نُعلمه كيف يُطعم نفسه",
    description:
      "المساعدات الإغاثية مؤقتة، لكن التنمية تخلق التغيير الحقيقي. نعمل مع المجتمعات المحلية لبناء مشاريع صغيرة مستدامة — من محلات تجارية للنساء إلى محطات مياه صحية. نؤمن بأن أفضل مشاريعنا هي تلك التي يُديرها المجتمع ذاته بعد انتهائنا، ونقيس نجاحنا بعدم حاجتهم إلينا.",
    themes: ["مشاريع نسائية", "بنية مائية", "صحة مجتمعية", "تثقيف زراعي"],
    color: "#059669",
    gradient: "from-emerald-50/80 to-emerald-100/40",
    href: "programs",
  },
  {
    id: "dawah",
    category: "دعوة",
    icon: Mic,
    title: "الدعوة والإرشاد",
    headline: "الدعوة ليست خطباً — هي حياة تُ践ى أمام الناس",
    description:
      "نرى في الدعوة أساس بناء المجتمع. لا نكتفي بالمحاضرات — نعيش مع الناس أفراحهم وهمومهم. تحفيظ القرآن في المساجد ليس هدفاً بحد ذاته، لكنه أداة لبناء شخصية إسلامية متماسكة. برامج الإرشاد الأسري تساعد الأسر على التعامل مع التحديات الاجتماعية بحكمة وصبر.",
    themes: ["تحفيظ القرآن", "إرشاد أسري", "القيمية الإسلامية", "بناء القدوة"],
    color: "#7C3AED",
    gradient: "from-violet-50/80 to-violet-100/40",
    href: "programs",
  },
];

const SectorCard = memo(({ sector, index, setCurrentPage }: {
  sector: SectorData;
  index: number;
  setCurrentPage: (page: string) => void;
}) => {
  const Icon = sector.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
    >
      <div
        className={`relative bg-gradient-to-br ${sector.gradient} rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-shadow duration-300`}
      >
        <div
          className="absolute top-0 right-0 w-1.5 h-full rounded-l-full"
          style={{ backgroundColor: sector.color }}
        />

        <div className="p-6 pr-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${sector.color}12`, border: `1.5px solid ${sector.color}25` }}
            >
              <Icon className="w-5 h-5" style={{ color: sector.color }} />
            </div>
            <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
              {sector.title}
            </h3>
          </div>

          <p className="text-sm font-semibold mb-3 leading-relaxed" style={{ color: sector.color }}>
            {sector.headline}
          </p>

          <p className="text-sm leading-[1.9] mb-5" style={{ color: "var(--muted-foreground)" }}>
            {sector.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {sector.themes.map((theme) => (
              <span
                key={theme}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${sector.color}10`,
                  color: sector.color,
                  border: `1px solid ${sector.color}20`,
                }}
              >
                {theme}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage(sector.href)}
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3 group"
            style={{ color: sector.color }}
          >
            <span>استكشف القطاع</span>
            <ChevronLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

SectorCard.displayName = 'SectorCard';

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl border border-[var(--border)] p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export function Programs({ setCurrentPage }: ProgramsProps) {
  const [sectors, setSectors] = useState<SectorData[]>(SECTORS);

  // ContentManager returns static SECTORS instantly, then upgrades to Sanity programs
  const { data: dynamicPrograms } = useDynamicContent<any>({
    contentType: 'programs',
    enableRealtime: false,
    refreshInterval: 300000,
  });

  // Merge dynamic programs from Sanity into SECTORS when available
  useEffect(() => {
    if (dynamicPrograms && dynamicPrograms.length > 0) {
      const merged = SECTORS.map(sector => {
        const dynamic = dynamicPrograms.find((p: any) =>
          p.category === sector.category || p.title === sector.title
        );
        if (dynamic) {
          return {
            ...sector,
            title: dynamic.title || sector.title,
            headline: dynamic.headline || dynamic.description || sector.headline,
            description: dynamic.description || sector.description,
          };
        }
        return sector;
      });
      setSectors(merged);
    }
  }, [dynamicPrograms]);

  return (
    <section className="py-20 bg-gradient-to-b from-[var(--background)] to-[var(--brand-green-pale)]/10" style={{ direction: "rtl" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-3 text-[var(--brand-green)] border border-[var(--brand-green)]/30 bg-[var(--brand-green-pale)] px-4 py-1.5 rounded-full text-sm font-semibold"
            >
              <Target className="w-4 h-4" />
              محاور العمل الإنساني
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[var(--foreground)] text-3xl md:text-4xl font-bold mb-2"
            >
              برامجنا وقطاعات{" "}
              <span className="text-[var(--brand-green)]">التدخل</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[var(--muted-foreground)] mt-2 max-w-2xl text-base leading-relaxed"
            >
              أربعة محاور متكاملة تشكّل منظومتنا — الإغاثة، والتعليم، والتنمية، والدعوة؛ يعمل كلٌّ منها بمنهجية المسح والتنفيذ والمتابعة ليصل الأثر كاملاً لمن يستحقه
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={() => setCurrentPage("programs")}
            className="flex items-center gap-2.5 text-[var(--brand-green)] hover:text-[var(--brand-green-light)] transition-all px-5 py-2.5 rounded-xl border border-[var(--brand-green)]/20 hover:border-[var(--brand-green)]/40 hover:bg-[var(--brand-green)]/5 whitespace-nowrap font-semibold"
          >
            <span>كل البرامج</span>
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {sectors.length > 0 && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {sectors.map((sector, i) => (
                <SectorCard
                  key={sector.id}
                  sector={sector}
                  index={i}
                  setCurrentPage={setCurrentPage}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-14"
        >
          <button
            onClick={() => setCurrentPage("projects")}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green)]/80 text-white font-semibold hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <Target className="w-5 h-5" />
            <span>استعرض جميع المشاريع</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}


