// News Ticker Component - الشريط الإخباري العاجل لـ رحماء بينهم
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ChevronLeft, Volume2, X, Sparkles, AlertCircle } from 'lucide-react';
import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';

interface NewsTickerItem {
  id: string;
  title: string;
  badge: string;
  link: string;
  isUrgent?: boolean;
}

const TICKER_ITEMS: NewsTickerItem[] = [
  { id: '1', title: 'إطلاق حملة كسوة الشتاء 2025 للأسر المحتاجة والنازحين في تعز ومأرب', badge: 'حملة عاجلة', link: '/donate', isUrgent: true },
  { id: '2', title: 'افتتاح آبار مياه نقية تعمل بالطاقة الشمسية تفيد أكثر من أسر مستفيدة في مأرب', badge: 'مشروع مياه', link: '/projects' },
  { id: '3', title: 'تأهيل حلقات تحفيظ ومركزاً تعليمياً في المناطق النائية', badge: 'تعليم', link: '/programs' },
  { id: '4', title: 'توزيع سلال غذائية متكاملة للأسر المتضررة في محافظة تعز', badge: 'إغاثة طارئة', link: '/news' },
];

export const NewsTicker = memo(function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaused || !isVisible) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, isVisible]);

  if (!isVisible) return null;

  const currentItem = TICKER_ITEMS[currentIndex];

  return (
    <div 
      className="bg-gradient-to-r from-[#0F3D2E] via-[var(--brand-green)] to-[#0F3D2E] text-white py-1.5 px-4 text-xs font-semibold relative z-40 border-b border-white/10"
      dir="rtl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto flex items-center justify-between gap-3">
        {/* Ticker Content */}
        <div className="flex items-center gap-2.5 overflow-hidden flex-1" aria-live="polite" aria-atomic="true">
          <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold flex items-center gap-1 shrink-0 ${
            currentItem.isUrgent 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-[var(--brand-gold)] text-white'
          }`}>
            {currentItem.isUrgent ? <AlertCircle className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
            {currentItem.badge}
          </span>

          <AnimatePresence mode="wait">
            <motion.button
              key={currentItem.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(currentItem.link)}
              className="text-white/95 hover:text-white hover:underline truncate text-right flex items-center gap-1.5 transition-colors group"
            >
              <span>{currentItem.title}</span>
              <ChevronLeft className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-[-2px] transition-transform shrink-0" />
            </motion.button>
          </AnimatePresence>
        </div>

        {/* Ticker Controls */}
        <div className="flex items-center gap-2 shrink-0 border-r border-white/20 pr-2">
          <button
            onClick={() => navigate('/news')}
            className="text-white/70 hover:text-white text-[0.68rem] hidden sm:inline-block transition-colors"
          >
            كل الأخبار
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white p-0.5 rounded hover:bg-white/10 transition-colors"
            title="إغلاق الشريط"
            aria-label="إغلاق الشريط الإخباري"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});
