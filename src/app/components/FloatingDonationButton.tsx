import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface FloatingDonationButtonProps {
  readonly onDonateClick: () => void;
}

export function FloatingDonationButton({ onDonateClick }: FloatingDonationButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after exactly 5 seconds of browsing as specified
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-40 hidden md:block"
          dir="rtl"
        >
          <button
            onClick={onDonateClick}
            aria-label="الانتقال لنموذج التبرع السريع ودعم المشاريع العاجلة"
            className="group flex items-center gap-2.5 px-5 py-3.5 bg-[#C69E5A] hover:bg-[#B38B47] text-slate-950 rounded-full font-black font-cairo text-sm shadow-xl shadow-amber-950/25 border-2 border-[#5C4314] transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#5C4314]/50"
          >
            <div className="w-7 h-7 rounded-full bg-slate-950/10 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-slate-950 text-slate-950 animate-pulse" />
            </div>
            <span>تبرع الآن</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FloatingDonationButton;
