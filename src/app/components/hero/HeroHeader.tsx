import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function HeroHeader() {
  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10">
      {/* Official Identity Badge without generic "رقم" clutter */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-[#0F4C3A]/15 text-slate-800 text-xs sm:text-sm font-bold font-cairo shadow-sm mb-6"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-50 text-[#0F4C3A] flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#0F4C3A]" aria-hidden="true" />
        </div>
        <span>رحماء بينهم للإغاثة والتنمية باليمن</span>
        <span className="text-neutral-300 font-normal">|</span>
        <span className="text-[#0F4C3A] font-bold">الجمهورية اليمنية</span>
      </motion.div>

      {/* Hero Headline with Golden Balance & Breathing Line-height */}
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-cairo font-extrabold text-4xl sm:text-5xl lg:text-[4.25rem] leading-[1.25] text-slate-950 max-w-4xl tracking-tight mb-6"
      >
        معاً نصنع التنمية ونحفظ <span className="text-[#0F4C3A]">الكرامة الإنسانية</span>
      </motion.h1>

      {/* Refined Descriptive Narrative with Generous Breathing Space */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto space-y-3"
      >
        <p className="text-slate-700 font-cairo text-base sm:text-lg lg:text-xl leading-[1.8] font-normal">
          منظمة إنسانية وتنموية مستقلة انطلقت منذ عام 2014م لصون حياة الإنسان وإغاثته، وعمارة الأرض عبر برامج إغاثية وتنموية شاملة في المناطق اليمنية الأشد احتياجاً، وفق أرفع معايير الحوكمة والشفافية.
        </p>
      </motion.div>
    </div>
  );
}

export default HeroHeader;
