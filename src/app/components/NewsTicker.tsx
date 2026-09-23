import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Phone,
  Calculator,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Utensils,
  AlertTriangle,
  Droplets,
  FileText,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Users,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Building2,
  TrendingUp,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

import type { LucideIcon } from "lucide-react";

/* ──────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────── */

interface NewsTickerItem {
  id: string;
  title: string;
  badge: string;
  link: string;
  isUrgent?: boolean;
  icon?: LucideIcon;
  category?:
    | "achievement"
    | "urgent"
    | "water"
    | "orphan"
    | "transparency"
    | "impact"
    | "zakat"
    | "endowment";
}

interface QuickAction {
  label: string;
  link: string;
  icon: LucideIcon;
  color: string;
}

/* ──────────────────────────────────────────────────────
   Marketing-Intelligence Ticker Items
   ────────────────────────────────────────────────────── */

/* Strategic Marketing Order — Ultra Focus (4 High-Conversion Only)
   Expert funnel: عاجل (إلحاح فوري) → كفالة (تحويل مباشر) → مياه (تحويل) → شفافية (ثقة) — تم تقليص 8→4 لرفع CTR */
const TICKER_ITEMS: NewsTickerItem[] = [
  {
    id: "2",
    title: "حملة كسوة الشتاء ٢٠٢٦ — نسعى لتوفير كسوات لأكثر من ٢,٠٠٠ أسرة",
    badge: "عاجل",
    link: "/donate",
    isUrgent: true,
    icon: AlertTriangle,
    category: "urgent",
  },
  {
    id: "4",
    title: "كفلنا ٤٥٠ يتيمًا بدعم شهري منتظم — انضم لبرنامج الكفالة",
    badge: "كفالة",
    link: "/donate",
    icon: Heart,
    category: "orphan",
  },
  {
    id: "3",
    title: "٨ آبار مياه نقية تعمل بالطاقة الشمسية تخدم أكثر من ٥,٠٠٠ شخص",
    badge: "مشروع مياه",
    link: "/programs",
    icon: Droplets,
    category: "water",
  },
  {
    id: "5",
    title: "تقرير الشفافية السنوي ٢٠٢٥ متاح الآن — ٨٤٪ للبرامج المباشرة",
    badge: "شفافية",
    link: "/transparency",
    icon: FileText,
    category: "transparency",
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  { label: "تبرع", link: "/donate", icon: Heart, color: "text-rose-300" },
  { label: "زكاة", link: "/zakat", icon: Calculator, color: "text-emerald-300" },
  { label: "تواصل", link: "/contact", icon: Phone, color: "text-sky-300" },
];

/* ──────────────────────────────────────────────────────
   Badge color mapping by category
   ────────────────────────────────────────────────────── */

const BADGE_STYLES: Record<
  string,
  { bg: string; glow?: string; text?: string }
> = {
  achievement: {
    bg: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-light))",
    text: "text-white",
  },
  urgent: {
    bg: "linear-gradient(135deg, #ef4444, #dc2626)",
    glow: "0 0 12px rgba(239,68,68,0.5), 0 0 24px rgba(239,68,68,0.2)",
    text: "text-white",
  },
  water: {
    bg: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    glow: "0 0 10px rgba(14,165,233,0.4)",
    text: "text-white",
  },
  orphan: {
    bg: "linear-gradient(135deg, var(--brand-green), var(--brand-green-light))",
    text: "text-white",
  },
  transparency: {
    bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    glow: "0 0 10px rgba(139,92,246,0.4)",
    text: "text-white",
  },
  impact: {
    bg: "linear-gradient(135deg, var(--brand-gold), #f59e0b)",
    text: "text-white",
  },
  zakat: {
    bg: "linear-gradient(135deg, var(--brand-green), #10b981)",
    text: "text-white",
  },
  endowment: {
    bg: "linear-gradient(135deg, #6366f1, #4f46e5)",
    glow: "0 0 10px rgba(99,102,241,0.4)",
    text: "text-white",
  },
};

/* ──────────────────────────────────────────────────────
   Constants
   ────────────────────────────────────────────────────── */

const DISMISS_KEY = "news_ticker_dismissed";
const TICKER_INTERVAL = 5000;

const DONOR_NAMES = [
  "مجهول",
  ".FullName",
  "سعيد",
  "أحمد",
  "فاطمة",
  "خالد",
  "مجهول",
  "عمر",
];

const IMPACT_ACTIVITIES = [
  { action: "تبرع بمبلغ", suffix: "ر.ي", min: 5000, max: 50000 },
  { action: "سلة غذائية", suffix: "", min: 1, max: 5 },
  { action: "كفالة يتيم", suffix: "شهريًا", min: 1, max: 1 },
];

/* ──────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────── */

function generateDonation(): { name: string; amount: string; time: string } {
  const donor = DONOR_NAMES[Math.floor(Math.random() * DONOR_NAMES.length)];
  const activity =
    IMPACT_ACTIVITIES[Math.floor(Math.random() * IMPACT_ACTIVITIES.length)];
  const value =
    Math.floor(Math.random() * (activity.max - activity.min + 1)) +
    activity.min;
  const formatted = value.toLocaleString("ar-YE");
  const ago = Math.floor(Math.random() * 120) + 1;
  return {
    name: donor,
    amount: `${activity.action} ${formatted} ${activity.suffix}`.trim(),
    time: `${ago} دقيقة`,
  };
}

/* ──────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────── */

export const NewsTicker = memo(function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  /* Live activity state */
  const [liveDonation, setLiveDonation] = useState(generateDonation);
  const [todayImpact, setTodayImpact] = useState(127);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const donationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const impactTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  const memoizedItems = useMemo(() => TICKER_ITEMS, []);
  const itemCount = memoizedItems.length;

  /* ── Check dismissed ── */
  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) setIsDismissed(true);
  }, []);

  /* ── Live donation rotation ── */
  useEffect(() => {
    donationTimerRef.current = setInterval(() => {
      setLiveDonation(generateDonation());
    }, 8000);
    return () => {
      if (donationTimerRef.current) clearInterval(donationTimerRef.current);
    };
  }, []);

  /* ── Impact counter increment ── */
  useEffect(() => {
    impactTimerRef.current = setInterval(() => {
      setTodayImpact((prev) => prev + 1);
    }, 45000);
    return () => {
      if (impactTimerRef.current) clearInterval(impactTimerRef.current);
    };
  }, []);

  /* ── Keyboard Navigation ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDismissed) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDismissed]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Navigation Handlers ── */
  const goToIndex = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setProgress(0);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [isTransitioning],
  );

  const goNext = useCallback(() => {
    goToIndex((currentIndex + 1) % itemCount);
  }, [currentIndex, goToIndex, itemCount]);

  const goPrev = useCallback(() => {
    goToIndex((currentIndex - 1 + itemCount) % itemCount);
  }, [currentIndex, goToIndex, itemCount]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem(DISMISS_KEY, "true");
  }, []);

  const handleItemClick = useCallback(
    (item: NewsTickerItem) => {
      navigate(item.link);
    },
    [navigate],
  );

  /* ── Progress Bar Timer ── */
  useEffect(() => {
    if (isPaused || isDismissed) {
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }
    setProgress(0);
    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / TICKER_INTERVAL) * 100, 100);
      setProgress(pct);
    }, 50);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPaused, isDismissed, currentIndex]);

  /* ── Auto-advance Timer ── */
  useEffect(() => {
    if (isPaused || isDismissed) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(goNext, TICKER_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isDismissed, goNext]);

  /* ── Touch Handlers ── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart === null) return;
      const diff = touchStart - e.changedTouches[0].clientX;
      const threshold = 50;
      if (diff > threshold) goNext();
      else if (diff < -threshold) goPrev();
      setTouchStart(null);
    },
    [touchStart, goNext, goPrev],
  );

  if (isDismissed) return null;

  const currentItem = memoizedItems[currentIndex];
  const badgeStyle =
    BADGE_STYLES[currentItem.category || "achievement"] ||
    BADGE_STYLES.achievement;
  const ItemIcon = currentItem.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -56, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
        dir="rtl"
        className="sticky top-[var(--header-main-h)] lg:top-[var(--header-offset)] z-40 w-full border-b border-white/10 select-none backdrop-blur-sm supports-[backdrop-filter]:bg-[var(--brand-green-dark)]/95"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="آخر الأخبار والإعلانات"
        aria-live="polite"
        aria-atomic="false"
      >
        {/* ── Pulsing gold accent line ── */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--brand-gold), transparent)",
            animation: "pulseGoldLine 2s ease-in-out infinite",
          }}
        />

        {/* ── Animated gradient background ── */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, var(--brand-green-dark) 0%, var(--brand-green) 50%, var(--brand-green-dark) 100%)`,
            animation: "shimmerGradient 8s ease infinite",
            backgroundSize: "200% 200%",
          }}
        />

        {/* ── Edge shadows ── */}
        <div className="absolute inset-y-0 left-0 w-12 z-[1] pointer-events-none bg-gradient-to-r from-black/15 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-12 z-[1] pointer-events-none bg-gradient-to-l from-black/15 to-transparent" />

        {/* ── Main content row ── */}
        <div className="shell relative z-[2] flex h-[var(--ticker-h)] items-center gap-2 sm:gap-3">
          {/* ── 1. Live Activity Indicator ── */}
          <div className="hidden md:flex shrink-0 items-center gap-2 border-l border-white/15 pl-3">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                style={{
                  animation:
                    "pingGlow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
                  boxShadow: "0 0 10px 3px rgba(52,211,153,0.5)",
                }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </span>
            <span className="text-[0.6rem] font-bold text-white/70 sm:text-xs whitespace-nowrap">
              آخر نشاط
            </span>
          </div>

          {/* ── 2. Live Donation Micro-Toast ── */}
          <div className="hidden lg:flex shrink-0 items-center gap-1.5 rounded-full bg-white/[0.07] backdrop-blur-sm px-2.5 py-1 border border-white/[0.08]">
            <Heart className="h-3 w-3 text-rose-400 shrink-0" aria-hidden="true" />
            <span className="text-[0.6rem] text-white/60 whitespace-nowrap">
              {liveDonation.name} — {liveDonation.amount}
            </span>
            <span className="text-[0.55rem] text-white/80">
              ({liveDonation.time})
            </span>
          </div>

          {/* ── 3. Center: Scrolling headline ── */}
          <div className="relative flex min-w-0 flex-1 items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                exit={{ opacity: 0, clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="flex min-w-0 items-center gap-2"
              >
                {/* Smart badge */}
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-bold leading-none sm:text-xs ${
                    badgeStyle.text || "text-white"
                  }`}
                  style={{
                    background: badgeStyle.bg,
                    ...(badgeStyle.glow && {
                      boxShadow: badgeStyle.glow,
                      animation: currentItem.isUrgent
                        ? "badgeGlow 2s ease-in-out infinite"
                        : undefined,
                    }),
                  }}
                >
                  {ItemIcon && <ItemIcon className="h-2.5 w-2.5" aria-hidden="true" />}
                  {currentItem.badge}
                </span>

                {/* Separator */}
                <span className="h-1 w-1 shrink-0 rounded-full bg-white/30" />

                {/* Headline */}
                <button
                  onClick={() => handleItemClick(currentItem)}
                  className="group flex min-w-0 items-center gap-1 text-right text-[0.7rem] text-white/90 transition-colors hover:text-white sm:text-sm"
                >
                  <span className="truncate">{currentItem.title}</span>
                  <ChevronLeft className="h-3 w-3 shrink-0 text-white/50 transition-all group-hover:translate-x-[-2px] group-hover:text-white/80" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── 4. Impact Counter ── */}
          <div className="hidden sm:flex shrink-0 items-center gap-1.5 rounded-full bg-white/[0.07] backdrop-blur-sm px-2.5 py-1 border border-white/[0.08]">
            <TrendingUp className="h-3 w-3 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="text-[0.6rem] font-bold text-white/80 tabular-nums whitespace-nowrap">
              أثر اليوم
            </span>
            <span className="text-[0.65rem] font-bold text-amber-300 tabular-nums">
              {todayImpact}
            </span>
          </div>

          {/* ── 5. Quick Actions (micro-buttons) ── */}
          <div className="hidden md:flex shrink-0 items-center gap-1">
            {QUICK_ACTIONS.map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.link)}
                  className="flex min-h-6 items-center gap-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.06] px-2 py-1 transition-all duration-200"
                  title={action.label}
                  aria-label={action.label}
                >
                  <ActionIcon
                    className={`h-3 w-3 ${action.color} shrink-0`}
                    aria-hidden="true"
                  />
                  <span className="hidden xl:inline text-[0.6rem] font-medium text-white/70">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── 6. Right controls: Counter + Nav + Dots + Close ── */}
          <div className="flex shrink-0 items-center gap-1.5 border-r border-white/15 pr-1.5 sm:gap-2 sm:pr-2.5">
            {/* Mobile counter */}
            <span
              className="flex sm:hidden items-center text-[0.55rem] font-bold text-white/60 tabular-nums"
              aria-label={`الخبر ${currentIndex + 1} من ${itemCount}`}
            >
              {currentIndex + 1}/{itemCount}
            </span>

            {/* Nav arrows — 24px minimum targets (WCAG 2.2 target-size) */}
            <div className="hidden items-center gap-0.5 sm:flex">
              <button
                onClick={goNext}
                className="flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="الخبر التالي"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={goPrev}
                className="flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="الخبر السابق"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Dots — 24px hit area with a small visual indicator inside */}
            <div
              className="flex items-center gap-1"
              role="tablist"
              aria-label="التنقل بين الأخبار"
            >
              {memoizedItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => goToIndex(idx)}
                  role="tab"
                  aria-selected={idx === currentIndex}
                  aria-label={`الخبر ${idx + 1}: ${item.badge}`}
                  className="flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "w-4 bg-white shadow-[0_0_4px_rgba(255,255,255,0.3)]"
                        : "w-1.5 bg-white/30"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Separator */}
            <span className="h-4 w-px bg-white/15" />

            {/* Close — 24px minimum target */}
            <button
              onClick={handleDismiss}
              className="flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
              title="إغلاق الشريط"
              aria-label="إغلاق الشريط الإخباري"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-10 bg-white/5">
          <motion.div
            className="h-full"
            style={{
              background:
                "linear-gradient(90deg, var(--brand-gold), var(--brand-gold-light))",
              width: `${progress}%`,
            }}
            transition={{ duration: 0.05, ease: "linear" }}
          />
        </div>

        {/* ── Keyframe Styles ── */}
        <style>{`
          @keyframes shimmerGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulseGoldLine {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          @keyframes pingGlow {
            0% { transform: scale(1); opacity: 0.75; box-shadow: 0 0 10px 3px rgba(52,211,153,0.5); }
            75%, 100% { transform: scale(2.2); opacity: 0; box-shadow: 0 0 20px 6px rgba(52,211,153,0.1); }
          }
          @keyframes badgeGlow {
            0%, 100% { box-shadow: 0 0 12px rgba(239,68,68,0.5), 0 0 24px rgba(239,68,68,0.2); }
            50% { box-shadow: 0 0 18px rgba(239,68,68,0.7), 0 0 36px rgba(239,68,68,0.3); }
          }
          @keyframes marqueeScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .news-ticker-marquee-track {
            display: flex;
            width: max-content;
            animation: marqueeScroll 30s linear infinite;
          }
          .news-ticker-marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
});
