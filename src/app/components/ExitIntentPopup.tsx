import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Gift } from 'lucide-react';

const EXIT_KEY = 'exit_intent_shown';

export const ExitIntentPopup = memo(function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem(EXIT_KEY);
    if (shown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !show) {
        setShow(true);
        sessionStorage.setItem(EXIT_KEY, '1');
      }
    };

    const handleBeforeUnload = () => {
      if (!show && !sessionStorage.getItem(EXIT_KEY)) {
        setShow(true);
        sessionStorage.setItem(EXIT_KEY, '1');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" dir="rtl">
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl">
          <button onClick={() => setShow(false)} className="absolute left-4 top-4 rounded-full p-1 hover:bg-[var(--muted)]">
            <X className="h-5 w-5" />
          </button>

          {!submitted ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-green)]/10">
                <Gift className="h-8 w-8 text-[var(--brand-green)]" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-[var(--foreground)]">تبرعت بالفعل؟</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">انضم لقائمتنا واحصل على تحديثات الأثر شهريًا</p>

              <div className="mt-6">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-center" placeholder="بريدك الإلكتروني" dir="ltr" />
                <button onClick={() => { if (email) setSubmitted(true); }} className="mt-3 w-full rounded-xl bg-[var(--brand-green)] py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  اشترك مجانًا
                </button>
              </div>

              <div className="mt-4 flex justify-center gap-4">
                <button onClick={() => { setShow(false); window.location.href = '/donate'; }} className="text-sm font-bold text-[var(--brand-green)] hover:underline">
                  تبرع الآن
                </button>
                <button onClick={() => setShow(false)} className="text-sm text-[var(--muted-foreground)] hover:underline">
                  لا شكراً
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-[var(--brand-green)]" />
              <h2 className="mt-4 text-xl font-bold text-[var(--foreground)]">شكرًا لاشتراكك!</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">ستتلقى تحديثات الأثر على بريدك</p>
              <button onClick={() => setShow(false)} className="mt-4 rounded-xl bg-[var(--brand-green)] px-6 py-2 font-bold text-white">إغلاق</button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
