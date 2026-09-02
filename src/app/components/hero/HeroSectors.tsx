import { Sparkles, Droplets, Heart, BookOpen, Stethoscope, ArrowLeft, Layers } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectorsProps {
  readonly setCurrentPage: (page: string) => void;
}

const SECTORS_DATA = [
  {
    id: "food",
    title: "الأمن الغذائي",
    subtitle: "سلال ومطابخ خيرية للأسر الأشد احتياجاً",
    icon: Sparkles,
    iconColor: "text-amber-300",
    iconBg: "bg-amber-400/15 border-amber-300/30",
    badgeBg: "bg-amber-400/20 text-amber-200 border-amber-400/30",
    badge: "إغاثة عاجلة",
    hoverBorder: "hover:border-amber-400/60 hover:shadow-amber-500/10",
    page: "projects",
  },
  {
    id: "water",
    title: "سقيا الماء",
    subtitle: "حفر وتأهيل الآبار وشبكات المياه الصالحة",
    icon: Droplets,
    iconColor: "text-sky-300",
    iconBg: "bg-sky-400/15 border-sky-300/30",
    badgeBg: "bg-sky-400/20 text-sky-200 border-sky-400/30",
    badge: "مياه مستدامة",
    hoverBorder: "hover:border-sky-400/60 hover:shadow-sky-500/10",
    page: "projects",
  },
  {
    id: "orphans",
    title: "كفالة الأيتام",
    subtitle: "رعاية معيشية، تعليمية، وصحية شاملة للأيتام",
    icon: Heart,
    iconColor: "text-rose-300",
    iconBg: "bg-rose-400/15 border-rose-300/30",
    badgeBg: "bg-rose-400/20 text-rose-200 border-rose-400/30",
    badge: "رعاية مستمرة",
    hoverBorder: "hover:border-rose-400/60 hover:shadow-rose-500/10",
    page: "projects",
  },
  {
    id: "education",
    title: "التعليم والتمكين",
    subtitle: "تأهيل مهني، منح تعليمية، وبناء سبل العيش",
    icon: BookOpen,
    iconColor: "text-emerald-300",
    iconBg: "bg-emerald-400/15 border-emerald-300/30",
    badgeBg: "bg-emerald-400/20 text-emerald-200 border-emerald-400/30",
    badge: "تنمية وتمكين",
    hoverBorder: "hover:border-emerald-400/60 hover:shadow-emerald-500/10",
    page: "projects",
  },
  {
    id: "health",
    title: "الرعاية الصحية",
    subtitle: "قوافل علاجية، أدوية، ودعم العمليات الجراحية",
    icon: Stethoscope,
    iconColor: "text-teal-300",
    iconBg: "bg-teal-400/15 border-teal-300/30",
    badgeBg: "bg-teal-400/20 text-teal-200 border-teal-400/30",
    badge: "صحة وعافية",
    hoverBorder: "hover:border-teal-400/60 hover:shadow-teal-500/10",
    page: "projects",
  },
];

export function HeroSectors({ setCurrentPage }: HeroSectorsProps) {
  return (
    <div className="w-full mt-16 sm:mt-20 pt-12 border-t border-white/15 relative">
      {/* Background Glow Accent for Sectors Area */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-white/10 to-transparent blur-2xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10 text-center sm:text-right relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-black font-cairo border border-white/20 mb-2.5 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-[#F6E05E]" />
            <span>مجالات العمل التنموي والإنساني</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-cairo tracking-tight">
            قطاعات التدخل الميداني في اليمن
          </h2>
          <p className="text-emerald-100/80 text-xs sm:text-sm font-cairo mt-1 font-normal max-w-xl">
            برامج متكاملة تصنع أثراً مباشراً ومستداماً لتخفيف المعاناة وصون كرامة الأسر الأكثر
            احتياجاً
          </p>
        </div>

        {/* Action Anchor to Projects Page */}
        <button
          onClick={() => setCurrentPage("projects")}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold font-cairo text-white hover:text-slate-900 px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-[#F6E05E] border border-white/20 hover:border-[#F6E05E] transition-all duration-300 shadow-2xs group shrink-0 cursor-pointer"
        >
          <span>تصفح كافة المشاريع التنموية</span>
          <ArrowLeft className="w-4 h-4 text-emerald-200 group-hover:text-slate-900 group-hover:-translate-x-1 transition-all" />
        </button>
      </div>

      {/* 5 Sectors Balanced Glass Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
        {SECTORS_DATA.map((sector, index) => {
          const Icon = sector.icon;
          return (
            <motion.button
              key={sector.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 * index }}
              onClick={() => setCurrentPage(sector.page)}
              className={`group relative text-right p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 ${sector.hoverBorder} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer`}
            >
              <div>
                {/* Header: Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-2xl ${sector.iconBg} border flex items-center justify-center shadow-2xs group-hover:scale-108 transition-transform duration-300`}
                  >
                    <Icon className={`w-5 h-5 ${sector.iconColor}`} aria-hidden="true" />
                  </div>
                  <span
                    className={`text-[10px] font-bold font-cairo px-2.5 py-0.5 rounded-full border ${sector.badgeBg}`}
                  >
                    {sector.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-cairo font-black text-base sm:text-lg text-white group-hover:text-[#F6E05E] transition-colors mb-1.5">
                  {sector.title}
                </h3>

                {/* Description */}
                <p className="text-emerald-100/75 text-xs font-cairo leading-relaxed font-normal">
                  {sector.subtitle}
                </p>
              </div>

              {/* Action Footer */}
              <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold font-cairo text-emerald-200 group-hover:text-white transition-colors">
                <span>استعراض المشاريع</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default HeroSectors;
