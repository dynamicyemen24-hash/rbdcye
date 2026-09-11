import { motion, AnimatePresence } from "motion/react";

import IntroVideoPlayer from "@/app/components/IntroVideoPlayer";

interface HeroVideoModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function HeroVideoModal({ isOpen, onClose }: HeroVideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--brand-ink)]/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="الفيلم التعريفي لحملة رحماء بينهم"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            className="relative w-full max-w-5xl bg-[var(--card)] rounded-[2rem] overflow-hidden shadow-2xl border border-white/20"
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black text-white text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]"
              aria-label="إغلاق"
            >
              ✕
            </button>

            <IntroVideoPlayer
              videoSrc="/videos/hero-background.mp4"
              title="الفيلم التعريفي لحملة رحماء بينهم"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default HeroVideoModal;
