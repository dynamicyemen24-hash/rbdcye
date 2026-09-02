import { Heart, ChevronLeft, Play, Pause, Volume2, VolumeX, Sparkles, Users, Star, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";

import { SEED_IMPACT } from "@/content/website";
import { contentManager } from "@/shared/services/content-manager";

interface HeroProps {
  readonly setCurrentPage: (page: string) => void;
}

// ============================================================
// Enriched Islamic Texts
// ============================================================
const ISLAMIC_TEXTS = [
  {
    type: 'ayah' as const,
    arabic: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنۢبُلَةٍ مِّائَةُ حَبَّةٍ ۗ وَاللَّهُ يُضَاعِفُ لِمَن يَشَاءُ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ",
    reference: "البقرة: ٢٦١",
    theme: "الإنفاق",
    cta: "اجعل أجرك يتضاعف",
  },
  {
    type: 'ayah' as const,
    arabic: "إِنَّ الْمُصَّدِّقِينَ وَالْمُصَّدِّقَاتِ وَأَقْرَضُوا اللَّهَ قَرْضًا حَسَنًا يُضَاعَفُ لَهُمْ وَلَهُمْ أَجْرٌ كَرِيمٌ",
    reference: "الحديد: ١٨",
    theme: "التصدق",
    cta: "اقرض الله قرضاً حسناً",
  },
  {
    type: 'hadith' as const,
    arabic: "مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ",
    reference: "رواه مسلم",
    theme: "التنفيس",
    cta: "فرّج كربة محتاج",
  },
  {
    type: 'hadith' as const,
    arabic: "الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ",
    reference: "رواه الترمذي",
    theme: "الصدقة",
    cta: "تصدق يسترك الله",
  },
];

// ============================================================
// Video Background
// ============================================================
const VideoBackground = memo(function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>();
  const playAttempted = useRef(false);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!videoRef.current.muted);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => setVideoError(true));
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || playAttempted.current) return;
    playAttempted.current = true;

    const attemptPlay = () => {
      video.play().then(() => { setVideoLoading(false); setIsPlaying(true); })
        .catch(() => { setVideoLoading(false); setIsPlaying(false); });
    };
    attemptPlay();

    const handleInteraction = () => { if (video.paused) attemptPlay(); };
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  useEffect(() => () => clearTimeout(controlsTimer.current), []);

  if (videoError) {
    return (
      <div className="absolute inset-0">
        <div className="w-full h-full" style={{
          background: "linear-gradient(135deg, var(--brand-green-dark) 0%, var(--brand-green) 30%, var(--brand-green-dark) 60%, var(--brand-green-dark) 100%)",
          backgroundSize: '400% 400%', animation: 'gradientShift 20s ease infinite',
        }} />
        <div className="absolute inset-0 opacity-5 pattern-bg" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0" onMouseMove={handleMouseMove} onMouseEnter={() => setShowControls(true)}>
      {videoLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--brand-green-dark)]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--brand-gold)]/30 border-t-[var(--brand-gold)] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-6 h-6 text-[var(--brand-gold-light)]" />
            </div>
          </div>
        </div>
      )}

      <video
        ref={videoRef} loop muted={isMuted} playsInline autoPlay preload="auto"
        poster="/images/defaults/about-hero.svg"
        className={`w-full h-full object-cover transition-opacity duration-700 ${videoLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => { setVideoError(true); setVideoLoading(false); }}
        onCanPlay={() => setVideoLoading(false)}
        onPlaying={() => setVideoLoading(false)}
        aria-label="فيديو خلفية تعريفي لمؤسسة رحماء بينهم"
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
        <track kind="captions" src="" label="العربية" srcLang="ar" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-ink)]/80 via-[var(--brand-green)]/70 to-[var(--brand-green)]/80" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Video controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10"
      >
        <button onClick={togglePlay} className="p-2 rounded-full hover:bg-white/15 transition-all text-white/80 hover:text-white" aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <div className="w-32 h-1 rounded-full bg-white/20 overflow-hidden cursor-pointer">
          <div className="w-full h-full rounded-full bg-gradient-to-l from-[var(--brand-gold)] to-[var(--brand-gold-light)]" />
        </div>
        <button onClick={toggleMute} className="p-2 rounded-full hover:bg-white/15 transition-all text-white/80 hover:text-white" aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}>
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </motion.div>
    </div>
  );
});

// ============================================================
// Main Hero
// ============================================================
export function Hero({ setCurrentPage }: HeroProps) {
  const [metrics, setMetrics] = useState<{ totalBeneficiaries?: number; activeProjects?: number; totalPartners?: number } | null>(null);
  const [verseIndex, setVerseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const metricsFetched = useRef(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    if (metricsFetched.current) return;
    metricsFetched.current = true;
    const fallback = { totalBeneficiaries: SEED_IMPACT.beneficiaries, activeProjects: SEED_IMPACT.projects, totalPartners: SEED_IMPACT.partners };
    contentManager.getImpact()
      .then(result => {
        const data = result.data[0];
        setMetrics(data ? {
          totalBeneficiaries: data?.totalBeneficiaries || data?.beneficiaries || fallback.totalBeneficiaries,
          activeProjects: data?.activeProjects || data?.projects || fallback.activeProjects,
          totalPartners: data?.totalPartners || data?.partners || fallback.totalPartners,
        } : fallback);
      })
      .catch(() => setMetrics(fallback));
  }, []);

  // Islamic text carousel - separate from main content layout
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setVerseIndex(prev => (prev + 1) % ISLAMIC_TEXTS.length), 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Stop carousel on user interaction - uses ref to avoid re-render storm
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleInteraction = () => {
      if (!isPausedRef.current) {
        isPausedRef.current = true;
        setIsPaused(true);
      }
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        isPausedRef.current = false;
        setIsPaused(false);
      }, 5000);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isPausedRef.current) {
        isPausedRef.current = true;
        setIsPaused(true);
      } else if (document.visibilityState === 'visible' && isPausedRef.current) {
        isPausedRef.current = false;
        setIsPaused(false);
      }
    };
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timeoutId);
    };
  }, []);

  const current = ISLAMIC_TEXTS[verseIndex];

  const formatStat = useCallback((value: number | undefined) => {
    if (typeof value === "number") {
      const formatted = value.toLocaleString("ar-SA");
      return `+${formatted}`;
    }
    if (value === 0) return "+0";
    return "...";
  }, []);

  const statsData = useMemo(() => [
    { value: formatStat(metrics?.totalBeneficiaries), label: "مستفيد", icon: Users, aria: "إجمالي المستفيدين" },
    { value: formatStat(metrics?.activeProjects), label: "مشروع", icon: Star, aria: "المشاريع النشطة" },
    { value: formatStat(metrics?.totalPartners), label: "شريك", icon: Heart, aria: "إجمالي الشركاء والداعمين" },
  ], [metrics, formatStat]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ direction: "rtl" }}>
      <VideoBackground />

      {/* Main content row: headline + cta on left, verse on right */}
      <div className="relative z-20 w-full py-28 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* ───── Left Column: Headline + CTAs ───── */}
            <div className="lg:col-span-7">
              {/* Trust badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white/50 bg-[var(--brand-green)] flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" fill="white" />
                    </div>
                  ))}
                </div>
                <span className="text-white/90 text-sm font-medium">
                  أكثر من <strong className="text-[var(--brand-gold-light)]">آلاف</strong> المستفيدين يثقون بنا
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-white mb-4"
                style={{ fontWeight: 800, fontSize: "clamp(2.2rem, 5.5vw, 4rem)", lineHeight: 1.15 }}
              >
                رحماء بينهم...{' '}
                <span className="text-[var(--brand-gold-light)]">أثرٌ يدوم</span>
                <br />
                مستقبلٌ{' '}
                <span className="relative inline-block">
                  يُبنى
                  <span className="absolute bottom-1 left-0 right-0 h-1 bg-[var(--brand-gold)] rounded-full opacity-60" />
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-white/85 mb-8 max-w-xl"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)", lineHeight: 1.8 }}
              >
                لا نكتفي بتخفيف المعاناة — نبني قدرات المجتمع ليُطعم نفسه. إغاثة عاجلة، تعليم يُعلي الهمم، وتنمية تصنع كوادر يمنية قادرة على إعادة بناء وطنهم.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-3"
              >
                  <motion.button
                    onClick={() => setCurrentPage("donate")}
                    className="flex items-center gap-2.5 px-8 py-3.5 bg-[var(--brand-gold)] text-white rounded-xl font-bold shadow-lg shadow-[var(--brand-gold)]/25 hover:shadow-xl hover:shadow-[var(--brand-gold)]/35 hover:-translate-y-0.5 transition-all"
                    style={{ fontSize: "1.05rem" }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Heart className="w-5 h-5" fill="white" />
                    تبرع الآن
                  </motion.button>

                  <motion.button
                    onClick={() => setCurrentPage("programs")}
                    className="flex items-center gap-2 px-7 py-3.5 bg-white/15 backdrop-blur-sm text-white border border-white/30 rounded-xl hover:bg-white/25 transition-all"
                    style={{ fontSize: "1rem" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    برامجنا
                  </motion.button>

                  <button onClick={() => setCurrentPage("success")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors px-2" style={{ fontSize: "0.9rem" }}>
                    <span className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center hover:border-white/60 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </span>
                    قصص النجاح
                  </button>
              </motion.div>

                {/* Stats row */}
                <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm">
                  {statsData.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                        aria-label={stat.aria}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1.5 text-[var(--brand-gold-light)]/80" aria-hidden="true" />
                        <div className="text-[var(--brand-gold-light)]" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stat.value}</div>
                        <div className="text-white/60 text-xs">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
            </div>

            {/* ───── Right Column: Islamic Verse Card ───── */}
            <div className="lg:col-span-5 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="relative rounded-2xl p-6 md:p-8 overflow-hidden hero-verse-card" style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 20px 60px rgba(var(--foreground-rgb),0.2)",
                }}>
                  {/* Glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--brand-gold), transparent 70%)" }} />

                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[var(--brand-gold)]/20 backdrop-blur-md border border-[var(--brand-gold)]/30 text-[var(--brand-gold-light)] text-xs font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      {current.type === 'ayah' ? 'آية قرآنية' : 'حديث نبوي'}
                    </span>
                    <span className="text-white/50 text-xs">{current.reference}</span>
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className="mr-auto p-1 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                      title={isPaused ? 'استئناف' : 'إيقاف'}
                    >
                      {isPaused ? <Play className="w-3 h-3 text-white" fill="white" /> : <Pause className="w-3 h-3 text-white" />}
                    </button>
                  </div>

                  {/* Arabic text */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={verseIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="text-white leading-relaxed" style={{
                        fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                        fontWeight: 600,
                        textShadow: "0 2px 10px rgba(var(--foreground-rgb),0.3)",
                        lineHeight: 2,
                        fontFamily: "'Noto Naskh Arabic', 'Traditional Arabic', serif",
                      }}>
                        {current.arabic}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* CTA */}
                  <motion.button
                    onClick={() => setCurrentPage("donate")}
                    className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm hover:bg-white/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="w-3.5 h-3.5" fill="white" />
                    {current.cta}
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </motion.button>

                  {/* Dots */}
                  <div className="flex gap-2 mt-4" dir="ltr">
                    {ISLAMIC_TEXTS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setVerseIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === verseIndex ? 'w-8 bg-[var(--brand-gold)]' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                        aria-label={`النص ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/50 animate-bounce">
        <span style={{ fontSize: "0.75rem" }}>اكتشف أكثر</span>
        <ArrowDown className="w-4 h-4" />
      </div>
    </section>
  );
}

