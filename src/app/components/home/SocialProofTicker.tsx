// Social Proof Ticker - شريط إثباتات اجتماعية حية
// يعرض نشاط المتبرعين والشهادات لبناء الثقة الفورية
// ⚠️ جميع البيانات هنا محاكاة — لا توجد بيانات حقيقية لمستفيدين
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Quote, Star, TrendingUp } from "lucide-react";

// بيانات محاكاة فقط — أسماء عامة غير حقيقية
const RECENT_DONORS = [
  { label: "متبرع", amount: "٥٠٠", project: "السلال الغذائية", time: "منذ ١٢ دقيقة" },
  { label: "متبرعة", amount: "٢٥٠", project: "كفالة الأيتام", time: "منذ ٢٥ دقيقة" },
  { label: "متبرع", amount: "١,٠٠٠", project: "مشروع الآبار", time: "منذ ٤٠ دقيقة" },
  { label: "متبرعة", amount: "١٥٠", project: "دفء الشتاء", time: "منذ ساعة" },
  { label: "متبرع", amount: "٢,٥٠٠", project: "تبرع عام", time: "منذ ساعة" },
  { label: "متبرعة", amount: "٣٠٠", project: "التعليم والقرآن", time: "منذ ساعتين" },
  { label: "متبرع", amount: "٧٥٠", project: "السلال الغذائية", time: "منذ ٣ ساعات" },
  { label: "متبرعة", amount: "١٢٥", project: "دفء الشتاء", time: "منذ ٤ ساعات" },
];

// شهادات محاكاة — أسماء عامة غير حقيقية
const TESTIMONIALS = [
  {
    quote: "من أرقى المؤسسات التي عملت معها — شفافية مطلقة واحترافية في التنفيذ. كل ريال يصل لمن يستحقه.",
    author: "مستخدم",
    role: "مستفيد من خدماتنا",
    rating: 5,
  },
  {
    quote: "السلال الغذائية وصلت أسرتي في وقتها وبجودة ممتازة. شكراً رحماء بينهم على هذا الاهتمام.",
    author: "مستفيدة",
    role: "مستفيدة من programmesنا",
    rating: 5,
  },
  {
    quote: "التعاون مع رحماء بينهم كان من أفضل القرارات. نهجهم الشامل للتنمية يحدث فرقاً حقيقياً في حياة المجتمعات المستهدفة.",
    author: "شريك مؤسسي",
    role: "شريك في العمل التطوعي",
    rating: 5,
  },
];

export function SocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (RECENT_DONORS.length + TESTIMONIALS.length));
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  const isDonorIndex = currentIndex < RECENT_DONORS.length;
  const currentItem = isDonorIndex
    ? RECENT_DONORS[currentIndex]
    : TESTIMONIALS[currentIndex - RECENT_DONORS.length];

  return (
    <section
      dir="rtl"
      className="relative overflow-hidden border-y border-[var(--border)]"
      style={{ background: "var(--brand-green-pale)" }}
    >
      <div className="absolute inset-0 pattern-bg opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center gap-4 md:gap-6">
          {/* Live indicator */}
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-green)]/10 border border-[var(--brand-green)]/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-green)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--brand-green)]" />
            </span>
            <span className="text-[var(--brand-green)] text-xs font-bold hidden sm:inline">مباشر</span>
          </div>

          {/* Content ticker */}
          <div
            className="flex-1 min-h-[52px] flex items-center"
            aria-live="polite"
            aria-atomic="true"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              {isDonorIndex ? (
                <motion.div
                  key={`donor-${currentIndex}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 w-full"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)] flex items-center justify-center shadow-md">
                    <Heart className="w-4 h-4 text-white" fill="white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                      <span className="font-bold text-[var(--foreground)]">{(currentItem as typeof RECENT_DONORS[0]).label}</span>
                      <span className="text-[var(--muted-foreground)]">تبرع بمبلغ</span>
                      <span className="font-bold text-[var(--brand-green)]">{(currentItem as typeof RECENT_DONORS[0]).amount} ر.ي</span>
                      <span className="text-[var(--muted-foreground)]">لـ</span>
                      <span className="font-semibold text-[var(--foreground)]">{(currentItem as typeof RECENT_DONORS[0]).project}</span>
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{(currentItem as typeof RECENT_DONORS[0]).time}</div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`test-${currentIndex}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-3 w-full"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Quote className="w-5 h-5 text-[var(--brand-gold)]" fill="var(--brand-gold)" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)] font-medium line-clamp-2 leading-relaxed">
                      {(currentItem as typeof TESTIMONIALS[0]).quote}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[var(--brand-green)]">{(currentItem as typeof TESTIMONIALS[0]).author}</span>
                      <span className="text-xs text-[var(--muted-foreground)]">— {(currentItem as typeof TESTIMONIALS[0]).role}</span>
                      <div className="flex gap-0.5 mr-1">
                        {Array.from({ length: (currentItem as typeof TESTIMONIALS[0]).rating }).map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-[var(--brand-gold)]" fill="var(--brand-gold)" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Counter */}
          <div className="flex-shrink-0 hidden md:flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <TrendingUp className="w-3.5 h-3.5 text-[var(--brand-green)]" />
            <span>{currentIndex + 1}/{RECENT_DONORS.length + TESTIMONIALS.length}</span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1 mt-3" dir="ltr">
          {Array.from({ length: Math.min(RECENT_DONORS.length + TESTIMONIALS.length, 12) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 bg-[var(--brand-green)]' : 'w-1 bg-[var(--brand-green)]/25 hover:bg-[var(--brand-green)]/50'
              }`}
              aria-label={`إثبات ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


