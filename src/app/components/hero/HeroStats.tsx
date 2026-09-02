import { Users, Star, Handshake } from "lucide-react";
import { HeroMetrics } from "./types";

interface HeroStatsProps {
  readonly metrics: HeroMetrics | null;
}

export function HeroStats({ metrics }: HeroStatsProps) {
  const formatStat = (value: number | undefined, defaultVal: string) =>
    typeof value === "number" ? value.toLocaleString("ar-SA") : defaultVal;

  return (
    <div className="max-w-5xl mx-auto" role="region" aria-label="إحصائيات الأثر الميداني">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 text-right">
        <div className="bg-white hover:bg-slate-50 rounded-3xl p-6 sm:p-7 lg:p-8 border-2 border-slate-200/90 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm md:text-base font-bold font-cairo mb-1.5">
              <Users className="w-5 h-5 text-[#8F6A1A]" aria-hidden="true" />
              <span>مستفيد ميداني</span>
            </div>
            <div className="text-slate-950 font-black font-cairo text-2xl sm:text-3xl lg:text-4xl">
              {formatStat(metrics?.totalBeneficiaries, "آلاف المستفيدين")}
            </div>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>

        <div className="bg-white hover:bg-slate-50 rounded-3xl p-6 sm:p-7 lg:p-8 border-2 border-slate-200/90 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm md:text-base font-semibold font-cairo mb-1.5">
              <Star className="w-5 h-5 text-[#8F6A1A]" aria-hidden="true" />
              <span>مشروع تنموي</span>
            </div>
            <div className="text-slate-950 font-black font-cairo text-2xl sm:text-3xl lg:text-4xl">
              {formatStat(metrics?.activeProjects, "مشاريع تنموية")}
            </div>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>

        <div className="bg-white hover:bg-slate-50 rounded-3xl p-6 sm:p-7 lg:p-8 border-2 border-slate-200/90 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm md:text-base font-semibold font-cairo mb-1.5">
              <Handshake className="w-5 h-5 text-[#8F6A1A]" aria-hidden="true" />
              <span>شريك استراتيجي</span>
            </div>
            <div className="text-slate-950 font-black font-cairo text-2xl sm:text-3xl lg:text-4xl">
              {formatStat(metrics?.totalPartners, "شركاء استراتيجيون")}
            </div>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-teal-100 text-teal-900 flex items-center justify-center shrink-0">
            <Handshake className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroStats;
