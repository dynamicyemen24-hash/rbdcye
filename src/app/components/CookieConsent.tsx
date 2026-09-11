import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const COOKIE_CONSENT_KEY = "rh_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleChoice = (accepted: boolean) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, accepted ? "accepted" : "rejected");
    } catch { /* ignore */ }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          dir="rtl"
          className="fixed inset-x-0 bottom-0 z-[9999] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-[var(--brand-green)]/10 bg-[var(--card)]/95 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-green)]/10 text-[var(--brand-green)]">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--foreground)]">
                  ملفات تعريف الارتباط
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted-foreground)]">
                  نستخدم ملفات تعريف الارتباط الأساسية فقط لتحسين تجربتك على الموقع.
                  لا نقوم بتتبع نشاطك أو مشاركة بياناتك مع أطراف ثالثة.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleChoice(true)}
                    className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[var(--brand-green)] px-5 text-xs font-bold text-[var(--primary-foreground)] shadow-md shadow-[var(--brand-green)]/15 transition hover:bg-[var(--brand-green-light)]"
                  >
                    قبول
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChoice(false)}
                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--brand-green)]/15 bg-transparent px-5 text-xs font-bold text-[var(--muted-foreground)] transition hover:bg-[var(--brand-green-pale)] hover:text-[var(--brand-green)]"
                  >
                    رفض
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleChoice(false)}
                aria-label="إغلاق"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--muted-foreground)] transition hover:bg-[var(--brand-green-pale)] hover:text-[var(--brand-green)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
