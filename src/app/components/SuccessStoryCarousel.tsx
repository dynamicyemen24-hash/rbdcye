import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight, ChevronLeft, Quote, Sparkles, MapPin,
  Calendar, CheckCircle2, ArrowLeft, Star, Pause, Play, HeartHandshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEED_SUCCESS_STORIES } from '@/content/website';
import { FallbackImage } from '@/app/components/FallbackImage';

interface SuccessStoryCarouselProps {
  stories?: typeof SEED_SUCCESS_STORIES;
  autoPlayInterval?: number;
  className?: string;
  showTitle?: boolean;
}

export function SuccessStoryCarousel({
  stories = SEED_SUCCESS_STORIES,
  autoPlayInterval = 6000,
  className = '',
  showTitle = true,
}: SuccessStoryCarouselProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const currentStory = stories[currentIndex] || stories[0];

  const handleNext = useCallback(() => {
    setDirection('left');
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  }, [stories.length]);

  const handlePrev = useCallback(() => {
    setDirection('right');
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  }, [stories.length]);

  // Auto Play Timer
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, autoPlayInterval, handleNext]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleNext(); // In RTL, Left Arrow goes next
      } else if (e.key === 'ArrowRight') {
        handlePrev(); // In RTL, Right Arrow goes previous
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Swipe Gestures for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext(); // Swiped left -> Next story
      } else {
        handlePrev(); // Swiped right -> Previous story
      }
    }
    touchStartXRef.current = null;
  };

  // Animation Variants
  const slideVariants: any = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? -60 : 60,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'left' ? 60 : -60,
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.35, ease: 'easeIn' },
    }),
  };

  if (!stories || stories.length === 0) return null;

  return (
    <div
      className={`relative w-full max-w-6xl mx-auto font-cairo dir-rtl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header Badge & Section Title */}
      {showTitle && (
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-[var(--brand-green)] border border-emerald-200/60 text-xs sm:text-sm font-bold shadow-2xs mb-3">
            <HeartHandshake className="w-4 h-4 text-[var(--brand-gold)]" />
            <span>قصص الأثر والتحول</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            قصص نجاح تُلهم الأمل وتوثق الأثر
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
            شهادات حية لمستفيدين تغيرت حياتهم بفضل الله ثم بفضل عطائكم الممتد ودعمكم المستمر.
          </p>
        </div>
      )}

      {/* Main Carousel Card Container */}
      <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden min-h-[460px] md:min-h-[420px] flex flex-col justify-between">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 pattern-rub-hizb opacity-[0.06] pointer-events-none" />

        {/* Animated Slide Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStory.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-full relative z-10"
          >
            {/* Story Image Side (Cols 5/12 on Desktop) */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[420px] overflow-hidden bg-slate-100">
              <FallbackImage
                src={currentStory.image}
                alt={`صورة توثيقية لقصة النجاح: ${currentStory.title} - المستفيد ${currentStory.name} في ${currentStory.location || 'اليمن'}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent lg:bg-gradient-to-l lg:from-slate-950/70 lg:to-transparent" />

              {/* Badges Overlay on Image */}
              <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-20">
                <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-bold border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                  <span>{currentStory.program}</span>
                </span>
                {currentStory.location && (
                  <span className="px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-md flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{currentStory.location}</span>
                  </span>
                )}
              </div>

              {/* Rating / Year Tag on Image Bottom */}
              <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white text-xs z-20">
                <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  <span>{currentStory.year}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-300 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span className="font-bold text-white">5.0</span>
                </div>
              </div>
            </div>

            {/* Story Details & Quote Side (Cols 7/12 on Desktop) */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/20">
              <div className="space-y-4">
                {/* Title */}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug">
                  {currentStory.title}
                </h3>

                {/* Quote Box */}
                <div className="relative p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-slate-800">
                  <Quote className="w-8 h-8 text-[var(--brand-gold)] opacity-40 absolute top-3 left-3 pointer-events-none" />
                  <p className="text-sm sm:text-base leading-relaxed font-semibold italic relative z-10 text-emerald-950">
                    «{currentStory.quote || currentStory.excerpt}»
                  </p>
                </div>

                {/* Story Excerpt */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {currentStory.excerpt}
                </p>
              </div>

              {/* Storyteller Info & CTA */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 border-2 border-[var(--brand-green)] flex items-center justify-center text-[var(--brand-green)] font-bold text-base shadow-xs shrink-0">
                    {currentStory.name ? currentStory.name.charAt(0) : 'م'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                      <span>{currentStory.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {currentStory.role}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/success')}
                  aria-label={`اقرأ القصة الكاملة لـ ${currentStory.name}: ${currentStory.title}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[var(--brand-green)] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 shadow-md group cursor-pointer"
                >
                  <span>اقرأ القصة الكاملة</span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Bottom Control Bar */}
        <div className="px-6 py-4 bg-slate-900/95 text-white border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 relative z-20">
          {/* Pagination Indicators / Dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="تنقل قصص النجاح">
            {stories.map((s, idx) => (
              <button
                key={s.id || idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 'left' : 'right');
                  setCurrentIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-[var(--brand-gold)]'
                    : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`انتقل إلى القصة ${idx + 1}: ${s.title}`}
                role="tab"
                aria-selected={idx === currentIndex}
              />
            ))}
            <span className="text-xs text-slate-400 font-mono mr-2">
              {currentIndex + 1} / {stories.length}
            </span>
          </div>

          {/* Action Buttons: Prev, AutoPlay Toggle, Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              aria-label={isAutoPlaying ? 'إيقاف التشغيل التلقائي لقصص النجاح' : 'تشغيل التشغيل التلقائي لقصص النجاح'}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isAutoPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل تلقائي'}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
            </button>

            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
              aria-label="القصة السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
              aria-label="القصة التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SuccessStoryCarouselSkeleton({ showTitle = true }: { showTitle?: boolean }) {
  return (
    <div className="relative w-full max-w-6xl mx-auto font-cairo dir-rtl animate-pulse">
      {showTitle && (
        <div className="text-center mb-8 sm:mb-10">
          <div className="h-6 w-36 bg-slate-200 rounded-full mx-auto mb-3" />
          <div className="h-8 w-64 sm:w-96 bg-slate-200 rounded-xl mx-auto mb-2" />
          <div className="h-4 w-48 sm:w-80 bg-slate-200 rounded-lg mx-auto" />
        </div>
      )}

      <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden min-h-[460px] md:min-h-[420px] flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch min-h-full">
          {/* Image Skeleton */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[420px] bg-slate-200 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-300/80" />
          </div>

          {/* Details Skeleton */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="h-7 w-3/4 bg-slate-200 rounded-lg" />
              <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-5/6 bg-slate-200 rounded" />
              </div>
              <div className="h-4 w-4/5 bg-slate-200 rounded" />
            </div>

            {/* Author Info Skeleton */}
            <div className="pt-5 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="h-9 w-32 bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Control Bar Skeleton */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-8 bg-slate-700 rounded-full" />
            <div className="h-2.5 w-2.5 bg-slate-700 rounded-full" />
            <div className="h-2.5 w-2.5 bg-slate-700 rounded-full" />
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded-xl" />
            <div className="w-8 h-8 bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessStoryCarousel;
