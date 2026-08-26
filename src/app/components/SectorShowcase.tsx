import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Users, BookOpen, Mic, Droplet, Sprout, 
  Target, ArrowLeft, Building2, MapPin, 
  BarChart3, Quote, Sparkles 
} from 'lucide-react';
import { SECTORS_SHOWCASE_DATA } from '@/data/sectorsData';
import { FallbackImage } from './FallbackImage';

interface SectorShowcaseProps {
  setCurrentPage?: (page: string) => void;
}

// Map string icon names to Lucide Icon components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Heart,
  Users,
  BookOpen,
  Mic,
  Droplet,
  Sprout
};

export const SectorShowcase: React.FC<SectorShowcaseProps> = memo(({ setCurrentPage = () => {} }) => {
  const [activeSectorId, setActiveSectorId] = useState<string>(SECTORS_SHOWCASE_DATA[0].id);

  const activeSector = SECTORS_SHOWCASE_DATA.find((s) => s.id === activeSectorId) || SECTORS_SHOWCASE_DATA[0];
  const ActiveIcon = ICON_MAP[activeSector.iconName] || Target;

  return (
    <section className="section-padding-lg bg-slate-50 relative overflow-hidden font-cairo" dir="rtl" id="sectors-showcase">
      {/* Decorative top border & background pattern */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0F4C3A]/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pattern-girih opacity-[0.06] pointer-events-none" />

      <div className="container-standard relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F4C3A]/10 text-[#0F4C3A] text-xs font-bold font-cairo border border-[#0F4C3A]/20 mb-3.5 shadow-2xs"
          >
            <Target className="w-3.5 h-3.5 text-[#C69E5A]" />
            <span>منظومة القطاعات والمشاريع التنموية</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-cairo mb-4 leading-tight"
          >
            عرض الشفافية والربط <span className="text-[#0F4C3A]">بين القطاعات والأثر</span>
          </motion.h2>

          <div className="w-16 h-1 bg-[#0F4C3A]/20 mx-auto rounded-full mb-4" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium"
          >
            عرض موحد وشامل يربط كل قطاع تنموي بمشاريعه الميدانية التنفيذية وقصص النجاح الموثقة لتقليل التكرار وتجسيد الشفافية.
          </motion.p>
        </div>

        {/* Sector Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12" role="tablist" aria-label="عرض القطاعات التنموية">
          {SECTORS_SHOWCASE_DATA.map((sector) => {
            const IconComp = ICON_MAP[sector.iconName] || Target;
            const isActive = sector.id === activeSectorId;

            return (
              <button
                key={sector.id}
                onClick={() => setActiveSectorId(sector.id)}
                role="tab"
                aria-selected={isActive}
                aria-label={`تغيير القطاع المعروض إلى قطاع ${sector.categoryTag}`}
                className={`inline-flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-black font-cairo transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#0F4C3A] text-white border-[#0F4C3A] shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200/90 hover:border-[#0F4C3A]/30 hover:bg-slate-50'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? 'text-[#C69E5A]' : 'text-slate-500'}`} aria-hidden="true" />
                <span>{sector.categoryTag}</span>
              </button>
            );
          })}
        </div>

        {/* Active Sector Showcase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Sector Overview Banner Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#0F4C3A]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Sector Intro */}
                <div className="lg:col-span-7 text-right space-y-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: activeSector.themeBg }}
                    >
                      <ActiveIcon className="w-6 h-6" style={{ color: activeSector.themeColor }} />
                    </div>
                    <div>
                      <span className="text-xs font-black font-cairo text-[#724B00] dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-3 py-1 rounded-md">
                        {activeSector.categoryTag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-cairo mt-1">
                        {activeSector.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                    {activeSector.summary}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold font-cairo text-slate-700">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                      <Users className="w-4 h-4 text-[#0F4C3A]" />
                      <span>{activeSector.impactMetrics.totalBeneficiaries} مستفيد</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                      <Building2 className="w-4 h-4 text-[#C69E5A]" />
                      <span>{activeSector.impactMetrics.completedProjects + activeSector.impactMetrics.activeProjects} مشروعاً كلياً</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                      <MapPin className="w-4 h-4 text-[#0F4C3A]" />
                      <span>{activeSector.impactMetrics.governoratesCount} محافظات مغطاة</span>
                    </div>
                  </div>
                </div>

                {/* Linked Success Story Feature Box */}
                {activeSector.stories[0] && (
                  <div className="lg:col-span-5">
                    <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden border border-emerald-500/30 shadow-lg">
                      <div className="absolute top-0 left-0 p-4 opacity-10">
                        <Quote className="w-24 h-24 text-white" />
                      </div>
                      
                      <div className="relative z-10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C69E5A]/20 text-[#E6C875] text-xs font-bold font-cairo border border-[#C69E5A]/30">
                            <Sparkles className="w-3 h-3" />
                            <span>{activeSector.stories[0].transformationBadge}</span>
                          </span>
                          <span className="text-[11px] text-slate-300 font-cairo">
                            {activeSector.stories[0].location}
                          </span>
                        </div>

                        <p className="font-cairo text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                          « {activeSector.stories[0].quote} »
                        </p>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs font-bold font-cairo text-amber-200">
                            {activeSector.stories[0].beneficiaryName}
                          </span>
                          <button
                            onClick={() => setCurrentPage('stories')}
                            aria-label={`استعراض قصة نجاح ${activeSector.stories[0].beneficiaryName} في ${activeSector.stories[0].location}`}
                            className="text-[11px] font-bold font-cairo text-emerald-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>استعراض القصة</span>
                            <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid of Sector Active Projects */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 font-cairo flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#0F4C3A]" aria-hidden="true" />
                  <span>المشاريع التنفيذية لقطاع {activeSector.categoryTag}</span>
                </h4>
                <button
                  onClick={() => setCurrentPage('projects')}
                  aria-label={`عرض كافة مشاريع قطاع ${activeSector.categoryTag}`}
                  className="text-xs sm:text-sm font-bold font-cairo text-[#0F4C3A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>كافة مشاريع القطاع</span>
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeSector.projects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-md hover:shadow-xl transition-all text-right flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="relative h-44 rounded-xl overflow-hidden">
                        <FallbackImage
                          src={project.image}
                          alt={`صورة توضيحية لمشروع ${project.title} - قطاع ${activeSector.categoryTag} في ${project.location}`}
                          fallbackSrc="/images/defaults/about-hero.svg"
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#0F4C3A] font-cairo shadow-sm">
                          {project.status}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white font-cairo flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C69E5A]" aria-hidden="true" />
                          <span>{project.location}</span>
                        </div>
                      </div>

                      <h5 className="text-base sm:text-lg font-black text-slate-900 font-cairo">
                        {project.title}
                      </h5>

                      <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold font-cairo mb-1.5">
                          <span className="text-slate-600">نسبة الإنجاز الميداني</span>
                          <span className="text-[#0F4C3A] font-mono">{project.progressPercentage}%</span>
                        </div>
                        <div 
                          className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
                          role="progressbar"
                          aria-valuenow={project.progressPercentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`نسبة الإنجاز الميداني لمشروع ${project.title}: ${project.progressPercentage}%`}
                        >
                          <div
                            className="h-full bg-[#0F4C3A] rounded-full transition-all duration-700"
                            style={{ width: `${project.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Beneficiaries & Action */}
                      <div className="flex items-center justify-between text-xs font-cairo pt-1">
                        <div className="flex items-center gap-1 text-slate-700 font-bold">
                          <Users className="w-3.5 h-3.5 text-[#0F4C3A]" aria-hidden="true" />
                          <span>{project.beneficiariesCount}</span>
                        </div>

                        <button
                          onClick={() => setCurrentPage('donate')}
                          aria-label={`دعم والتبرع لمشروع ${project.title}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F4C3A] hover:bg-[#0F4C3A] text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          <span>دعم المشروع</span>
                          <ArrowLeft className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
});

SectorShowcase.displayName = 'SectorShowcase';
export default SectorShowcase;
