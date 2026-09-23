import { Heart, X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, memo } from 'react';

const MESSAGES = [
  { icon: Heart, text: 'شكراً لكل متبرع — أثركم في ميزان حسناتكم', color: 'text-red-500' },
  { icon: TrendingUp, text: 'آخر تبرع اليوم — جزاكم الله خيراً', color: 'text-[var(--brand-green)]' },
  { icon: Heart, text: 'تبرعك يُغيّر حياة أسرة بأكملها', color: 'text-[var(--brand-gold)]' },
  { icon: TrendingUp, text: 'إلى الآن: ٤٥ متبرع هذا الأسبوع', color: 'text-blue-500' },
  { icon: Heart, text: 'الصدقة الجارية لا تنقطع أجرها', color: 'text-[var(--brand-green)]' },
  { icon: TrendingUp, text: 'تبرعك يصل مباشرة للمستفيد', color: 'text-purple-500' },
];

export const SocialProofToast = memo(function SocialProofToast() {
  const [current, setCurrent] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShow(true);
      setCurrent(Math.floor(Math.random() * MESSAGES.length));
    }, 5000);

    const hideTimer = setTimeout(() => setShow(false), 10000);

    const interval = setInterval(() => {
      setShow(true);
      setCurrent(prev => (prev + 1) % MESSAGES.length);
      setTimeout(() => setShow(false), 5000);
    }, 18000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  const m = MESSAGES[current];
  const Icon = m.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -50, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="fixed bottom-[var(--dock-bottom-3)] left-[var(--dock-left)] z-40"
          dir="rtl"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-xl backdrop-blur-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)]/10">
              <Icon className={`h-5 w-5 ${m.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--foreground)]">
                {m.text}
              </p>
              <p className="text-[0.65rem] text-[var(--muted-foreground)]">حملة رحماء بينهم</p>
            </div>
            <button onClick={() => setShow(false)} className="shrink-0 p-1 hover:bg-[var(--muted)] rounded">
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
