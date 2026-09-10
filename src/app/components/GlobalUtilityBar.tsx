// GlobalUtilityBar — Strategic floating action bar
// شريط الأدوات الاستراتيجي العائم — وصول سريع للوظائف المحورية
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Heart,
  Calculator,
  MessageCircle,
  Share2,
  Type,
  Sun,
  Moon,
  Printer,
  ArrowUp,
  X,
  Minus,
  Plus,
  Zap,
} from "lucide-react";
import {
  FontSizeLevel,
  ReaderThemeMode,
  getSavedReaderPreferences,
  saveReaderPreferences,
} from "./ReadabilityControls";

interface GlobalUtilityBarProps {
  onSearchOpen: () => void;
}

export function GlobalUtilityBar({ onSearchOpen }: GlobalUtilityBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeLevel>("normal");
  const [theme, setTheme] = useState<ReaderThemeMode>("light");
  const [shareTooltip, setShareTooltip] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const saved = getSavedReaderPreferences();
    setFontSize(saved.fontSize);
    setTheme(saved.theme);
  }, []);

  // Track scroll position for "scroll to top" visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Apply font size to root
  const handleFontSize = useCallback((size: FontSizeLevel) => {
    setFontSize(size);
    saveReaderPreferences({ fontSize: size });
    const map: Record<FontSizeLevel, string> = {
      normal: "1rem",
      large: "1.15rem",
      xlarge: "1.3rem",
      xxlarge: "1.5rem",
    };
    document.documentElement.style.setProperty("--reader-font-size", map[size]);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const next: ReaderThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveReaderPreferences({ theme: next });
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.classList.remove("sepia", "contrast");
  }, [theme]);

  // Increase / decrease font size
  const cycleFontSize = useCallback(
    (dir: "up" | "down") => {
      const levels: FontSizeLevel[] = ["normal", "large", "xlarge", "xxlarge"];
      const idx = levels.indexOf(fontSize);
      const next = dir === "up" ? levels[Math.min(idx + 1, 3)] : levels[Math.max(idx - 1, 0)];
      handleFontSize(next);
    },
    [fontSize, handleFontSize],
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handlePrint = () => window.print();

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled native share
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareTooltip(true);
      setTimeout(() => setShareTooltip(false), 1800);
    }
  };

  const openWhatsApp = () =>
    window.open("https://wa.me/967780777007?text=مرحباً، أريد التواصل معكم", "_blank");

  const isDark = theme === "dark" || document.documentElement.classList.contains("dark");

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <>
      {/* Floating trigger FAB */}
      <div className="fixed left-3 bottom-5 z-50 flex flex-col items-center gap-2" dir="rtl">
        {/* Scroll-to-top (appears after 400px scroll) */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 8 }}
              onClick={scrollToTop}
              aria-label="العودة للأعلى"
              className="w-10 h-10 rounded-full bg-[var(--card)] shadow-lg border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--brand-green)] hover:border-[var(--brand-green)]/30 transition-all hover:scale-110"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Main FAB trigger */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "إغلاق شريط الأدوات" : "فتح شريط الأدوات"}
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? "bg-[var(--foreground)] text-[var(--background)] shadow-black/20"
              : "bg-[var(--brand-green)] text-white shadow-[var(--brand-green)]/30"
          }`}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Expanded sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.nav
              initial={{ opacity: 0, x: -20, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              role="navigation"
              aria-label="شريط الأدوات الاستراتيجي"
              className="fixed left-3 bottom-20 z-50 w-72 bg-[var(--card)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden"
              dir="rtl"
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-l from-[var(--brand-green)] to-emerald-700">
                <div className="flex items-center gap-2 text-white">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-bold">شريط الأدوات</span>
                </div>
              </div>

              <div className="p-3 space-y-3 max-h-[70vh] overflow-y-auto">
                {/* ── Strategic Row 1: Primary Conversion — Donate (expert: تحويل أولاً) ── */}
                <a
                  href="/donate"
                  className="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                  style={{
                    background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-dark))",
                    color: "#fff",
                    boxShadow: "0 4px 14px rgba(var(--brand-gold-rgb), 0.35)",
                  }}
                >
                  <Heart className="w-4 h-4" />
                  <span>تبرع سريع — أثر فوري</span>
                </a>

                <button
                  onClick={() => { onSearchOpen(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-[var(--foreground)] text-sm font-semibold"
                >
                  <Search className="w-4 h-4 text-[var(--brand-green)]" />
                  <span>بحث</span>
                  <kbd className="mr-auto text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted-foreground)] font-mono">
                    Ctrl+K
                  </kbd>
                </button>

                {/* ── Strategic Row 2: Zakat + WhatsApp ── */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="/zakat"
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
                  >
                    <Calculator className="w-4 h-4 text-[var(--brand-green)]" />
                    <span className="text-xs font-bold">زكاة</span>
                  </a>

                  <button
                    onClick={openWhatsApp}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
                  >
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold">واتساب</span>
                  </button>
                </div>

                {/* ── Strategic Row 3: Share ── */}
                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-[var(--foreground)] text-sm font-semibold"
                  >
                    <Share2 className="w-4 h-4 text-[var(--brand-green)]" />
                    <span>مشاركة الصفحة</span>
                  </button>
                  <AnimatePresence>
                    {shareTooltip && (
                      <motion.span
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[var(--brand-green)] text-white px-2 py-1 rounded-lg shadow-md whitespace-nowrap"
                      >
                        تم النسخ
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Divider ── */}
                <div className="border-t border-[var(--border)]" />

                {/* ── Accessibility Controls ── */}
                <div>
                  <span className="text-xs font-bold text-[var(--muted-foreground)] mb-1.5 block">
                    حجم الخط
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => cycleFontSize("down")}
                      aria-label="تصغير الخط"
                      className="w-9 h-9 rounded-lg bg-[var(--background)] hover:bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-1 flex items-center justify-center">
                      <Type className="w-4 h-4 text-[var(--brand-green)]" />
                    </div>
                    <button
                      onClick={() => cycleFontSize("up")}
                      aria-label="تكبير الخط"
                      className="w-9 h-9 rounded-lg bg-[var(--background)] hover:bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ── Dark Mode Toggle ── */}
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-[var(--foreground)] text-sm font-semibold"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-[var(--brand-green)]" />
                  )}
                  <span>{isDark ? "الوضع النهاري" : "الوضع الليلي"}</span>
                </button>

                {/* ── Print ── */}
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-[var(--foreground)] text-sm font-semibold"
                >
                  <Printer className="w-4 h-4 text-[var(--brand-green)]" />
                  <span>طباعة الصفحة</span>
                </button>

                {/* ── Scroll to top (always visible inside panel) ── */}
                <button
                  onClick={() => { scrollToTop(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-[var(--foreground)] text-sm font-semibold"
                >
                  <ArrowUp className="w-4 h-4 text-[var(--brand-green)]" />
                  <span>العودة للأعلى</span>
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
