// Sticky Donate Bar - شريط التبرع اللاصق الذكي
// يظهر بعد تمرير 40% من الصفحة (ذروة الاندماج) ويختفي على صفحة التبرع
import { Heart, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SCROLL_THRESHOLD = 0.4;
const SCROLL_UPPER_LIMIT = 0.96;

export function StickyDonateBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);
  const rafRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();

  const onScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const shouldBeVisible =
        progress > SCROLL_THRESHOLD && progress < SCROLL_UPPER_LIMIT;
      setVisible((prev) => {
        if (prev !== shouldBeVisible && shouldBeVisible && !hasAppeared) {
          setHasAppeared(true);
        }
        return shouldBeVisible;
      });
    });
  }, [hasAppeared]);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  // لا يظهر على صفحات التبرع/البوابة إطلاقاً
  const hiddenRoute = ["/donate", "/portal"].some((r) =>
    location.pathname.startsWith(r),
  );
  const show = visible && !dismissed && !hiddenRoute;

  const handleDismiss = useCallback(() => setDismissed(true), []);

  return (
    <>
      <style>{`
        @keyframes bar-glow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(var(--brand-gold-rgb), 0.25), 0 16px 40px rgba(var(--brand-green-rgb), 0.18); }
          50% { box-shadow: 0 0 0 1.5px rgba(var(--brand-gold-rgb), 0.55), 0 20px 48px rgba(var(--brand-green-rgb), 0.28); }
        }
        @keyframes heart-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .sticky-bar-glow { animation: bar-glow 3s ease-in-out infinite; }
        .sticky-bar-glow-reduced { box-shadow: 0 0 0 1px rgba(var(--brand-gold-rgb), 0.3), 0 16px 40px rgba(var(--brand-green-rgb), 0.2); }
        .sticky-heart-pulse { animation: heart-pulse 2s ease-in-out infinite; }
      `}</style>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 80, scale: 0.92 }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 60, scale: 0.96 }
            }
            transition={{
              duration: reduce ? 0.15 : 0.55,
              type: "spring",
              stiffness: 260,
              damping: 22,
              mass: 0.8,
            }}
            dir="rtl"
            className="fixed inset-x-0 bottom-0 md:bottom-6 z-[45] flex md:justify-center pointer-events-none"
          >
            {/* ─── Mobile: full-width bar ─── */}
            <div
              className="pointer-events-auto md:hidden w-full flex items-center gap-3 pl-3 pr-3 py-3 backdrop-blur-xl dark:bg-zinc-900/80 bg-white/80 border-t dark:border-white/10 border-black/5"
              style={{
                boxShadow: "0 -8px 30px rgba(var(--brand-green-rgb),0.15)",
              }}
            >
              <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50">
                <Heart
                  className="w-4 h-4 sticky-heart-pulse"
                  fill="var(--brand-green)"
                  style={{ color: "var(--brand-green)" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="font-bold leading-snug truncate text-[0.8rem]"
                  style={{ color: "var(--foreground)" }}
                >
                  مساهمتك تصنع الفرق الآن
                </div>
                <div
                  className="truncate text-[0.65rem]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  تبرع آمن · إيصال فوري
                </div>
              </div>
              <button
                onClick={() => navigate("/donate")}
                className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-lg font-extrabold text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-gold), #e8a020)",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 2px 12px rgba(var(--brand-gold-rgb),0.3)",
                }}
              >
                <Heart className="w-3.5 h-3.5" fill="currentColor" />
                تبرع
              </button>
              <button
                onClick={handleDismiss}
                aria-label="إغلاق الشريط"
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ─── Desktop: floating pill ─── */}
            <div
              className={`hidden md:flex pointer-events-auto items-center gap-4 pl-3 pr-4 py-3 rounded-2xl border backdrop-blur-xl dark:bg-zinc-900/80 bg-white/80 dark:border-white/10 border-black/5 ${
                reduce ? "sticky-bar-glow-reduced" : "sticky-bar-glow"
              }`}
            >
              <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50">
                <Heart
                  className="w-5 h-5 sticky-heart-pulse"
                  fill="var(--brand-green)"
                  style={{ color: "var(--brand-green)" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="font-bold leading-snug truncate"
                  style={{ fontSize: "0.88rem", color: "var(--foreground)" }}
                >
                  مساهمتك تصنع الفرق الآن
                </div>
                <div
                  className="truncate"
                  style={{ fontSize: "0.72rem", color: "var(--muted-foreground)" }}
                >
                  تبرع آمن · إيصال فوري · وصول مضمون للمستحقين
                </div>
              </div>
              <button
                onClick={() => navigate("/donate")}
                className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 hover:shadow-[0_4px_24px_rgba(var(--brand-gold-rgb),0.4)]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand-gold), #e8a020)",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 2px 16px rgba(var(--brand-gold-rgb),0.3)",
                }}
              >
                <Heart className="w-4 h-4" fill="currentColor" />
                تبرع سريع
              </button>
              <button
                onClick={handleDismiss}
                aria-label="إغلاق الشريط"
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                style={{ color: "var(--muted-foreground)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
