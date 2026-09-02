import { HeartHandshake, Film, Compass, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface HeroActionsProps {
  readonly setCurrentPage: (page: string) => void;
  readonly onOpenVideo: () => void;
  readonly isVideoOpen: boolean;
}

export function HeroActions({ setCurrentPage, onOpenVideo, isVideoOpen }: HeroActionsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="w-full max-w-4xl mx-auto mb-12 sm:mb-16"
    >
      {/* High-Impact Interactive Control Deck with Refined Background and Border Optics */}
      <div className="relative p-2.5 sm:p-3.5 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/90 shadow-lg shadow-emerald-950/5">
        
        <div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3" 
          role="group" 
          aria-label="خيارات التفاعل والإسناد الإنساني"
        >
          {/* 1. Primary Action: Direct Urgent Donation */}
          <button
            onClick={() => setCurrentPage("donate")}
            className="relative group min-h-[58px] sm:min-h-[64px] px-5 py-3 rounded-2xl bg-gradient-to-r from-[#0F4C3A] via-[#10704c] to-[#0F4C3A] hover:from-[#09472f] hover:to-[#09472f] text-white flex items-center justify-center gap-3 font-cairo font-extrabold text-base sm:text-lg shadow-md hover:shadow-xl hover:shadow-emerald-900/25 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden"
          >
            {/* Shimmer Light Ray */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
              <HeartHandshake className="w-5 h-5 text-[#F6E05E]" aria-hidden="true" />
            </div>
            <div className="text-right">
              <div className="leading-tight font-black">تبرع الآن</div>
              <div className="text-[11px] font-normal text-emerald-100 font-cairo">للمشاريع الإغاثية العاجلة</div>
            </div>
          </button>

          {/* 2. Secondary Action: Documentary Video */}
          <button
            onClick={onOpenVideo}
            aria-haspopup="dialog"
            aria-expanded={isVideoOpen}
            aria-label="مشاهدة الفيلم التعريفي"
            className="group min-h-[58px] sm:min-h-[64px] px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50/70 border-2 border-slate-200/90 hover:border-[#0F4C3A]/60 text-slate-800 hover:text-[#0F4C3A] flex items-center justify-center gap-3 font-cairo transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 group-hover:bg-amber-100/80 border border-amber-200/70 flex items-center justify-center shrink-0 transition-colors">
              <Film className="w-5 h-5 text-[#8F6A1A]" aria-hidden="true" />
            </div>
            <div className="text-right">
              <div className="font-extrabold text-sm sm:text-base leading-tight">الفيلم التعريفي</div>
              <div className="text-[11px] font-medium text-slate-500 font-cairo">شاهد الأثر والتوثيق</div>
            </div>
          </button>

          {/* 3. Tertiary Action: Explore Projects */}
          <button
            onClick={() => setCurrentPage("projects")}
            aria-label="استكشف المشاريع الميدانية"
            className="group min-h-[58px] sm:min-h-[64px] px-5 py-3 rounded-2xl bg-slate-50/90 hover:bg-emerald-900 hover:text-white border border-slate-200/90 hover:border-emerald-900 text-slate-800 flex items-center justify-center gap-3 font-cairo transition-all duration-300 shadow-2xs hover:shadow-lg cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-white group-hover:bg-white/20 border border-slate-200 group-hover:border-white/30 flex items-center justify-center shrink-0 transition-colors">
              <Compass className="w-5 h-5 text-[#0F4C3A] group-hover:text-[#F6E05E] transition-colors" aria-hidden="true" />
            </div>
            <div className="text-right flex-1">
              <div className="font-extrabold text-sm sm:text-base leading-tight group-hover:text-white transition-colors">استكشف المشاريع</div>
              <div className="text-[11px] font-medium text-slate-500 group-hover:text-emerald-100 transition-colors font-cairo">المجالات الجارية والمنجزة</div>
            </div>
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-all" aria-hidden="true" />
          </button>
        </div>

        {/* Reassurance Micro-Footer inside Deck */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-bold text-slate-500 font-cairo">
          <div className="flex items-center gap-1.5 text-[#0F4C3A]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>تبرعات رسمية وموثوقة</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-[#8F6A1A]" />
            <span>توثيق وتقارير دورية للمانحين</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default HeroActions;


