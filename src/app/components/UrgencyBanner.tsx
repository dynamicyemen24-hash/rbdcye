import { X, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface UrgencyBannerProps {
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
  type?: 'info' | 'warning' | 'urgent';
  dismissKey?: string;
}

export function UrgencyBanner({ title, message, ctaText, ctaLink, type = 'urgent', dismissKey }: UrgencyBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (dismissKey && localStorage.getItem(`dismissed_${dismissKey}`)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: setState in effect is intentional for initial data hydration
    setIsVisible(true);
  }, [dismissKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (dismissKey) localStorage.setItem(`dismissed_${dismissKey}`, 'true');
  };

  const bgColor = {
    info: 'bg-[var(--brand-green)]',
    warning: 'bg-[var(--brand-gold)]',
    urgent: 'bg-red-600',
  }[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={`overflow-hidden ${bgColor} text-white`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 text-sm" dir="rtl">
            <div className="flex items-center gap-3">
              {type === 'urgent' ? (
                <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse" />
              ) : (
                <Clock className="h-4 w-4 shrink-0" />
              )}
              <span className="font-bold">{title}</span>
              <span className="hidden sm:inline">— {message}</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={ctaLink}
                className="shrink-0 rounded-lg bg-white/20 px-4 py-1.5 text-xs font-bold transition-colors hover:bg-white/30"
              >
                {ctaText}
              </a>
              <button onClick={handleDismiss} className="shrink-0 p-1 hover:bg-white/10 rounded" aria-label="إغلاق">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
