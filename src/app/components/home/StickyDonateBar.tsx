// Sticky Donate Bar - شريط التبرع اللاصق الذكي
// يظهر بعد تمرير 40% من الصفحة (ذروة الاندماج) ويختفي على صفحة التبرع
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heart, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function StickyDonateBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setVisible(progress > 0.4 && progress < 0.96);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // لا يظهر على صفحات التبرع/البوابة إطلاقاً
  const hiddenRoute = ["/donate", "/portal"].some((r) => location.pathname.startsWith(r));
  const show = visible && !dismissed && !hiddenRoute;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: reduce ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          dir="rtl"
          className="hidden md:flex fixed inset-x-0 bottom-6 z-[45] justify-center pointer-events-none"
        >
          <div
            className="pointer-events-auto flex items-center gap-4 pl-3 pr-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,0.92)",
              borderColor: "rgba(var(--brand-gold-rgb),0.35)",
              boxShadow: "0 16px 40px rgba(15,76,58,0.22)",
            }}
          >
            <div
              className="hidden sm:flex w-10 h-10 shrink-0 rounded-xl items-center justify-center"
              style={{ background: "var(--brand-green-pale)" }}
            >
              <Heart
                className="w-5 h-5"
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
              className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold))",
                color: "#FFFFFF",
              }}
            >
              <Heart className="w-4 h-4" fill="currentColor" />
              تبرع سريع
            </button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="إغلاق الشريط"
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
              style={{ color: "var(--muted-foreground)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
