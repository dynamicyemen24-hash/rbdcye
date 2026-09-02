// Step Scroll Component - Section-by-Section Navigation
// Implements "خاصية الصعود التدريجي المنظم" 
// Smooth gradual section scrolling with visual indicators
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Layers } from 'lucide-react';

import { useStepScroll } from '@/app/hooks/useStepScroll';

export function StepScroll() {
  const {
    currentSectionIndex,
    totalSections,
    showStepUp,
    showStepDown,
    scrollToPrevious,
    scrollToNext,
  } = useStepScroll();

  // Don't show if navigating between pages or no sections
  if (totalSections === 0) return null;

  const progress = totalSections > 1 
    ? ((currentSectionIndex + 1) / totalSections) * 100 
    : 0;

  return (
    <div className="fixed right-4 md:right-6 bottom-24 z-40 flex flex-col items-center gap-2">
      {/* Section Progress Bar */}
      <div className="hidden md:flex flex-col items-center gap-1">
        <span className="text-[0.55rem] text-white/40 font-medium tracking-wider">
          {currentSectionIndex + 1}/{totalSections}
        </span>
        <div className="w-1 h-20 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="w-full bg-gradient-to-t from-[var(--brand-gold)] to-[var(--brand-gold-light)] rounded-full"
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step Up Button */}
      <AnimatePresence>
        {showStepUp && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToPrevious}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center hover:bg-white transition-all hover:scale-110 group"
            title="الانتقال للقسم السابق"
            aria-label="الانتقال للقسم السابق"
          >
            <ChevronUp className="w-5 h-5 text-gray-700 group-hover:text-[var(--brand-green)] transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Section Indicator - shows current position */}
      <AnimatePresence>
        {showStepUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/20"
          >
            <Layers className="w-2.5 h-2.5 text-[var(--brand-green)]" />
            <span className="text-[0.55rem] text-gray-500 font-medium">
              القسم {currentSectionIndex + 1}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Down Button */}
      <AnimatePresence>
        {showStepDown && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToNext}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/20 flex items-center justify-center hover:bg-white transition-all hover:scale-110 group"
            title="الانتقال للقسم التالي"
            aria-label="الانتقال للقسم التالي"
          >
            <ChevronDown className="w-5 h-5 text-gray-700 group-hover:text-[var(--brand-green)] transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

