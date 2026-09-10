import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, HandHeart } from 'lucide-react';

// Social proof notifications — shows recent donations to build trust
const PROOF_ITEMS = [
  { name: 'أحمد م.', amount: '٥,٠٠٠ ر.ي', project: 'كسوة الشتاء', time: 'منذ ٣ دقائق' },
  { name: 'سارة ع.', amount: '١٠٠ دولار', project: 'آبار المياه', time: 'منذ ٨ دقائق' },
  { name: 'محمد خ.', amount: '٢,٠٠٠ ر.س', project: 'الأيتام', time: 'منذ ١٢ دقيقة' },
  { name: 'فاطمة ر.', amount: '٥٠ دولار', project: 'التعليم', time: 'منذ ١٥ دقيقة' },
  { name: 'عبدالله ن.', amount: '١٠,٠٠٠ ر.ي', project: 'عام', time: 'منذ ٢٠ دقيقة' },
];

export function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 5 seconds, then cycle every 8 seconds
    const showTimer = setTimeout(() => setIsVisible(true), 5000);
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % PROOF_ITEMS.length);
    }, 8000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  const item = PROOF_ITEMS[currentIndex];

  return (
    <div className="fixed bottom-24 left-4 z-40 hidden lg:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="flex items-center gap-3 rounded-2xl border border-[var(--brand-green)]/20 bg-[var(--card)]/95 p-3 shadow-xl backdrop-blur-xl"
          dir="rtl"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)]/10">
            <Heart className="h-5 w-5 text-[var(--brand-green)]" fill="var(--brand-green)" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[var(--foreground)]">
              {item.name} تبرع بـ {item.amount}
            </div>
            <div className="text-[0.65rem] text-[var(--muted-foreground)]">
              {item.project} — {item.time}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
