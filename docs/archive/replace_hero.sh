#!/bin/bash

cat << 'REPLACE' > src/app/components/Hero.tsx
import { Heart, ChevronLeft, Play, Pause, Volume2, VolumeX, Sparkles, Users, Star, Handshake, Shield, ArrowDown, UserCheck, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { SEED_IMPACT } from "@/content/website";
import { contentBridge } from "@/shared/services/content-bridge.service";

interface HeroProps {
  readonly setCurrentPage: (page: string) => void;
}

// ============================================================
// Enriched Islamic Texts
// ============================================================
const ISLAMIC_TEXTS = [
  {
    type: 'ayah' as const,
    arabic: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنۢبُلَةٍ مِّائَةُ حَبَّةٍ",
    reference: "البقرة: ٢٦١",
  },
  {
    type: 'ayah' as const,
    arabic: "إِنَّ الْمُصَّدِّقِينَ وَالْمُصَّدِّقَاتِ وَأَقْرَضُوا اللَّهَ قَرْضًا حَسَنًا يُضَاعَفُ لَهُمْ وَلَهُمْ أَجْرٌ كَرِيمٌ",
    reference: "الحديد: ١٨",
  },
  {
    type: 'hadith' as const,
    arabic: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ",
    reference: "رواه مسلم",
  },
  {
    type: 'hadith' as const,
    arabic: "الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ",
    reference: "رواه الترمذي",
  },
];

// ============================================================
// Interactive Video Background
// ============================================================
function InteractiveVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.play().then(() => setVideoLoading(false)).catch(() => {
      setVideoError(true);
      setVideoLoading(false);
    });
  }, []);

  if (videoError) {
    return (
      <div className="absolute inset-0 w-full h-full z-0 bg-[#052317]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#052317] to-emerald-950 opacity-80" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#052317]">
      <video
        ref={videoRef} loop muted playsInline autoPlay
        poster="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&h=900&q=80"
        className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoading ? 'opacity-0 scale-105' : 'opacity-60 scale-100'}`}
      >
        <source src="/videos/hero-background.webm" type="video/webm" />
        <source src="/videos/hero-background.mp4" type="video/mp4" />
      </video>
      
      {/* Heavy gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#02110a]/90 via-[#052317]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#02110a] via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

// ============================================================
// Main Hero Component
// ============================================================
export default function Hero({ setCurrentPage }: HeroProps) {
  const [verseIndex, setVerseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const sub = contentBridge.getImpactMetrics().subscribe(data => setMetrics(data));
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setVerseIndex(prev => (prev + 1) % ISLAMIC_TEXTS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = ISLAMIC_TEXTS[verseIndex];
  const formatStat = (value: number | undefined) => typeof value === "number" ? value.toLocaleString("ar-SA") : "...";

  return (
    <section className="relative overflow-hidden pt-[200px] pb-[240px]" style={{ direction: "rtl" }}>
      
      {/* Interactive Video Background (Reinstated as per request) */}
      <InteractiveVideoBackground />

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* ───── Right Column (Text, Spacing, Stats, CTAs) ───── */}
          <div className="lg:col-span-7">
            
            {/* 1. Headline (Modern, smaller size) */}
            <h1 className="text-white font-alexandria font-bold tracking-tight drop-shadow-xl mb-[120px]" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.3 }}>
              نصنع <span className="text-[var(--brand-gold)]">التنمية المستدامة</span>
              <br />
              ونحفظ <span className="text-white">الكرامة الإنسانية</span>
            </h1>

            {/* 2. Intro Text (3cm/120px space achieved via headline bottom margin) */}
            <p className="text-white/85 max-w-2xl font-readex leading-loose drop-shadow-md text-base md:text-lg lg:text-xl font-light">
              مؤسسة وطنية رائدة متخصصة في هندسة الأثر وتطبيق حلول التنمية المستدامة باليمن. نتبنى نماذج حوكمة مرنة في إدارة المساعدات وإطلاق مشاريع السقيا النظيفة، والتمكين الاقتصادي للأسر المنتجة، استناداً إلى مسوح ميدانية توثق الأثر بشفافية.
            </p>

            {/* 3. Pure White Space (8cm ≈ 320px) */}
            <div className="h-[160px] lg:h-[320px]" aria-hidden="true" />

            {/* 4. Stats Grid */}
            <div className="border-t border-white/10 pt-8 max-w-2xl mb-[200px]">
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                {[
                  { value: formatStat(metrics?.totalBeneficiaries), label: "مستفيد ميداني موثق", icon: Users },
                  { value: formatStat(metrics?.activeProjects), label: "مشروع تنموي مستدام", icon: Star },
                  { value: formatStat(metrics?.totalPartners), label: "شريك استراتيجي", icon: Handshake },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-[var(--brand-gold)] shrink-0 opacity-100" />
                        <span className="text-[0.65rem] sm:text-xs font-semibold text-white/70 font-readex">{stat.label}</span>
                      </div>
                      <div className="text-white font-bold font-alexandria text-xl md:text-3xl tracking-tight drop-shadow-lg">
                        {stat.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Smart CTAs (5cm/200px space achieved via stats bottom margin) */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              {/* Donors Portal */}
              <motion.button
                onClick={() => setCurrentPage("donate")}
                className="group flex flex-1 items-center justify-center gap-3 px-6 py-4 lg:py-5 bg-gradient-to-l from-[var(--brand-gold)] to-amber-500 text-[#02110a] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all font-readex"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <HeartHandshake className="w-5 h-5 text-[#02110a]" />
                <span className="text-sm lg:text-base">بوابة المحسنين (بادر بالعطاء)</span>
              </motion.button>

              {/* Beneficiaries Portal */}
              <motion.button
                onClick={() => setCurrentPage("contact")}
                className="group flex flex-1 items-center justify-center gap-3 px-6 py-4 lg:py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl hover:bg-white/15 transition-all font-bold font-readex"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserCheck className="w-5 h-5 text-white/90" />
                <span className="text-sm lg:text-base">بوابة المستفيدين (طلب دعم)</span>
              </motion.button>
            </div>
            
            {/* Note: Bottom padding of 6cm (240px) is applied to the main section tag above */}
          </div>

          {/* ───── Left Column (Quran/Hadith Panel opposite to intro text) ───── */}
          <div className="lg:col-span-5 relative z-30 pt-0 lg:pt-[240px]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="relative rounded-3xl p-8 lg:p-10 overflow-hidden bg-black/40 backdrop-blur-2xl border border-white/15 shadow-2xl min-h-[460px] flex flex-col justify-between"
            >
              <div className="relative h-full flex flex-col justify-between flex-1">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
                    <span className="px-3 py-1.5 rounded-full bg-[var(--brand-gold)]/20 text-[var(--brand-gold-light)] text-xs font-bold flex items-center gap-2 font-readex">
                      <Sparkles className="w-4 h-4" />
                      {current.type === 'ayah' ? 'تذكير بالآية الكريمة' : 'تذكير بالحديث الشريف'}
                    </span>
                    <span className="text-white/60 text-xs font-medium font-readex bg-white/5 px-3 py-1 rounded-md">{current.reference}</span>
                  </div>

                  <div className="min-h-[220px] flex items-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={verseIndex}
                        initial={{ opacity: 0, filter: "blur(5px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(5px)" }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                      >
                        {/* Enlarged Font as requested */}
                        <p className="text-white font-medium text-2xl md:text-3xl lg:text-[2.25rem] leading-[2.1] text-right font-serif tracking-normal" style={{
                          fontFamily: "'Noto Naskh Arabic', 'Traditional Arabic', serif",
                          textShadow: "0 4px 20px rgba(0,0,0,0.8)"
                        }}>
                          {current.arabic}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex gap-2" dir="ltr" role="tablist">
                    {ISLAMIC_TEXTS.map((_, i) => (
                      <button
                        key={i}
                        role="tab"
                        aria-selected={i === verseIndex}
                        onClick={() => setVerseIndex(i)}
                        className="relative group p-2 -m-2 focus:outline-none"
                      >
                        <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === verseIndex ? 'w-8 bg-[var(--brand-gold)]' : 'w-2 bg-white/30'}`} />
                      </button>
                    ))}
                  </div>
                  <span className="text-white/40 text-[10px] font-readex tracking-widest uppercase">مؤسسة رحماء بينهم</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
REPLACE
