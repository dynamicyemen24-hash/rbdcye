import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  BookOpenText,
  Calculator,
  ChevronDown,
  CircleUserRound,
  HandHeart,
  Home,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  UsersRound,
} from "lucide-react";
import { RohamaaHeart } from "@/app/components/ui/BrandIcons";
import MobileMenu from "@/app/components/MobileMenu";
import { memo, useCallback, useEffect, useState } from "react";

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "about", label: "عن الحملة", icon: BookOpenText },
  { id: "programs", label: "مجالات العمل", icon: UsersRound },
  { id: "projects", label: "مشاريعنا", icon: HandHeart },
  { id: "transparency", label: "الشفافية", icon: ShieldCheck },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo.svg"
        alt="شعار رحماء بينهم"
        className={`${compact ? "h-10 w-10" : "h-11 w-11"} shrink-0 rounded-[14px] object-contain shadow-[0_8px_20px_rgba(var(--brand-green-rgb),.15)]`}
      />
      <RohamaaHeart className="h-5 w-5 text-[var(--brand-green)]" />
      <div className="text-right leading-none">
        <div
          className={`${compact ? "text-base" : "text-lg"} font-extrabold tracking-tight text-[var(--brand-green)]`}
        >
          رحماء بينهم
        </div>
        <div className="mt-1 text-[10px] font-medium tracking-[0.14em] text-[var(--brand-gold-dark)]">
          حملة إغاثية وتنموية
        </div>
      </div>
    </div>
  );
}

export default memo(function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("rh_theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("rh_theme", isDark ? "dark" : "light");
    } catch { /* ignore */ }
  }, [isDark]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = useCallback(
    (page: string) => {
      setCurrentPage(page);
      setIsMobileMenuOpen(false);
    },
    [setCurrentPage]
  );

  const isHome = currentPage === "home" || currentPage === "";
  const isOverlay = isHome && !isScrolled;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-[100] focus:rounded-lg focus:bg-[var(--brand-green)] focus:px-4 focus:py-2 focus:text-[var(--primary-foreground)] focus:shadow-lg"
      >
        تخطى إلى المحتوى الرئيسي
      </a>
      <header
        className={`fixed inset-x-0 top-0 lg:top-9 z-50 transition-all duration-300 ${isOverlay ? "bg-gradient-to-b from-[var(--brand-green-dark)]/80 to-transparent" :             "border-b border-[var(--brand-green)]/8 bg-[var(--card)]/90 shadow-[0_4px_20px_rgba(0,0,0,0.08),0_10px_35px_rgba(var(--brand-green-rgb),.08)] backdrop-blur-xl"}`}
        dir="rtl"
      >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10" aria-label="التصفح الرئيسي">
        <div className="flex h-18 items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => navigate("home")}
            aria-label="العودة إلى الصفحة الرئيسية"
            className={`rounded-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 ${isOverlay ? "brightness-0 invert" : ""}`}
          >
            <BrandMark />
          </button>

          <div className="hidden items-center gap-1 rounded-2xl border border-[var(--brand-green)]/8 bg-[var(--card)]/85 p-1.5 shadow-sm backdrop-blur-md lg:flex">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = currentPage === id || (id === "home" && isHome);
              return (
                <motion.button
                  key={id}
                  type="button"
                  onClick={() => navigate(id)}
                  whileTap={{ scale: 0.95 }}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex min-h-10 items-center gap-2 rounded-xl px-3.5 text-xs font-bold transition-all duration-200 ${active ? "bg-[var(--brand-green)] text-[var(--primary-foreground)] shadow-md shadow-[var(--brand-green)]/15" : "text-[var(--muted-foreground)] hover:bg-[var(--brand-green-pale)] hover:text-[var(--brand-green)]"}`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{label}</span>
                  {id === "transparency" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]" aria-hidden="true" />
                  )}
                </motion.button>
              );
            })}
            <div className="mx-1 h-5 w-px bg-[var(--brand-green)]/10" />
            <button
              type="button"
              onClick={() => navigate("zakat")}
              aria-label="حاسبة الزكاة"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-bold text-[var(--brand-gold-dark)] transition-all duration-200 hover:bg-[var(--brand-gold-pale)]"
            >
              <Calculator className="h-3.5 w-3.5" aria-hidden="true" />
              <span>حاسبة الزكاة</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
              className={`grid h-11 w-11 place-items-center rounded-xl transition-all duration-300 ${isOverlay ? "text-[var(--primary-foreground)]/80 hover:bg-[var(--primary-foreground)]/10" : "text-[var(--muted-foreground)] hover:bg-[var(--brand-green-pale)] hover:text-[var(--brand-green)]"}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex"
                  >
                    <Sun className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex"
                  >
                    <Moon className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <div className="hidden xl:block w-px h-6 bg-[var(--brand-green)]/10 mx-1" />
            <button
              type="button"
              onClick={() => navigate("donor")}
              aria-label="بوابة المتبرع"
              className={`hidden min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-bold transition-all duration-200 xl:inline-flex ${isOverlay ? "text-[var(--primary-foreground)]/80 hover:bg-[var(--primary-foreground)]/10" : "text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)]"}`}
            >
              <CircleUserRound className="h-4 w-4" aria-hidden="true" />
              <span>بوابة المتبرع</span>
              <ChevronDown className="h-3.5 w-3.5 rotate-90 opacity-50" aria-hidden="true" />
            </button>
            <motion.button
              type="button"
              onClick={() => navigate("donate")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-label="تبرع الآن"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--brand-gold-light)] px-4 text-xs font-extrabold text-[var(--brand-green-dark)] shadow-[0_10px_25px_rgba(var(--brand-gold-rgb),.23)] transition hover:bg-[var(--brand-gold)] sm:px-5"
            >
              <HandHeart className="h-4 w-4" aria-hidden="true" />
              <span>تبرع الآن</span>
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </motion.button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              className={`grid h-11 w-11 place-items-center rounded-xl transition lg:hidden ${isOverlay ? "bg-[var(--primary-foreground)]/10 text-[var(--primary-foreground)] hover:bg-[var(--primary-foreground)]/20" : "bg-[var(--brand-green-pale)] text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)]"}`}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
    </header>

    <MobileMenu
      isOpen={isMobileMenuOpen}
      onClose={() => setIsMobileMenuOpen(false)}
      onNavigate={(page) => setCurrentPage(page)}
      currentPage={currentPage}
    />
    </>
  );
});
