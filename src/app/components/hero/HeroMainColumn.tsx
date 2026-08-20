import { 
  Heart,
  ChevronLeft,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";

interface HeroMainColumnProps {
  readonly setCurrentPage: (page: string) => void;
  readonly onOpenVideo: () => void;
  readonly isVideoOpen: boolean;
}

export function HeroMainColumn({ setCurrentPage }: HeroMainColumnProps) {
  return (
    <div className="flex flex-col justify-center h-full space-y-8 py-2 text-right">
      
      {/* 1. Identity Pill */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-[#0F4C3A] text-xs sm:text-sm font-extrabold font-cairo shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C69E5A] animate-pulse shrink-0" />
          <span>مؤسسة رحماء بينهم للإغاثة والتنمية باليمن</span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="font-cairo font-black text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] leading-[1.28] text-slate-900 tracking-tight">
          معاً نصنع التنمية ونحفظ <span className="text-[#0F4C3A] relative inline-block border-b-4 border-[#C69E5A]/40 pb-1">الكرامة الإنسانية</span>
        </h1>

        {/* Spacious Inspiring Narrative */}
        <p className="text-slate-700 font-cairo text-base sm:text-lg lg:text-xl leading-[2.1] font-medium max-w-2xl">
          مؤسسة إنسانية وتنموية مستقلة انطلقت عام 2014م لصون حياة الإنسان وإغاثته عبر برامج إغاثية وتنموية شمولية، مستهدفة المحافظات والمناطق اليمنية الأشد تضرراً ومأساة، وفق أرفع معايير الحوكمة والشفافية.
        </p>
      </motion.div>

      {/* 2. High-Contrast CTA Action Deck */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap items-center gap-4 pt-2"
      >
        <motion.button
          onClick={() => setCurrentPage("donate")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label="التوجه لصفحة التبرع السريع ودعم المشاريع الإغاثية والعاجلة"
          className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#0F4C3A] hover:bg-[#0A372A] text-white font-black text-base font-cairo shadow-lg shadow-[#0F4C3A]/25 hover:shadow-xl transition-all cursor-pointer border-2 border-[#062317] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0F4C3A] focus-visible:ring-offset-2"
        >
          <Heart className="w-5 h-5 fill-white" />
          <span>تبرع الآن</span>
        </motion.button>

        <motion.button
          onClick={() => setCurrentPage("programs")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label="استكشف جميع برامج التنمية والإغاثة المستدامة لمؤسسة رحماء بينهم"
          className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-slate-100/90 border-2 border-[#0A372A] text-[#0A372A] font-extrabold text-base font-cairo shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0A372A] focus-visible:ring-offset-2"
        >
          <span>استكشف البرامج والتنمية</span>
          <ChevronLeft className="w-5 h-5 text-[#0A372A]" />
        </motion.button>
      </motion.div>

    </div>
  );
}

export default HeroMainColumn;
