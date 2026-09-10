import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Heart, Calculator, MapPin, BarChart3, 
  MessageCircle, Users, BookOpen, ArrowLeft 
} from 'lucide-react';

const ACTIONS = [
  { id: 'donate', label: 'تبرع سريع', icon: Heart, color: 'bg-[var(--brand-gold)]', link: '/donate' },
  { id: 'zakat', label: 'حاسبة الزكاة', icon: Calculator, color: 'bg-blue-500', link: '/zakat-calculator' },
  { id: 'map', label: 'الخريطة', icon: MapPin, color: 'bg-purple-500', link: '/interactive-map' },
  { id: 'impact', label: 'مركز الأثر', icon: BarChart3, color: 'bg-emerald-500', link: '/impact-center' },
  { id: 'whatsapp', label: 'واتساب', icon: MessageCircle, color: 'bg-green-600', link: 'https://wa.me/967780777007' },
  { id: 'advisor', label: 'المستشار الذكي', icon: Zap, color: 'bg-amber-500', link: '/smart-advisor' },
];

export const QuickActions = memo(function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40 md:bottom-28 md:right-8" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xl backdrop-blur-md"
          >
            <p className="mb-3 text-xs font-bold text-[var(--muted-foreground)]">إجراءات سريعة</p>
            <div className="grid grid-cols-3 gap-2">
              {ACTIONS.map((action) => (
                <a
                  key={action.id}
                  href={action.link}
                  className="group flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all hover:bg-[var(--muted)]"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color} text-white transition-transform group-hover:scale-110`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[0.65rem] font-bold text-[var(--foreground)]">{action.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-green)] to-emerald-600 text-white shadow-lg shadow-[var(--brand-green)]/30 transition-all hover:shadow-xl hover:shadow-[var(--brand-green)]/40"
        aria-label="إجراءات سريعة"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Zap className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </div>
  );
});
