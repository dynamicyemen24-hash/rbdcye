import { AnimatePresence, motion } from 'motion/react';
import { Zap, X } from 'lucide-react';

interface ShortcutToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function ShortcutToast({ message, onDismiss }: ShortcutToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-6 z-[9999] max-w-sm flex items-center gap-3 px-4 py-3 bg-zinc-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-800"
          dir="rtl"
          role="status"
          aria-live="polite"
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--brand-green)]/20 text-[var(--brand-green)] flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs sm:text-sm font-medium leading-snug font-cairo">
            {message}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-600"
            title="إغلاق"
            aria-label="إغلاق الإشعار"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ShortcutToast;


