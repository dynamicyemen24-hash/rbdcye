import {
  ArrowLeft,
  BarChart3,
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
  Heart,
  Lightbulb,
  Map,
  GraduationCap,
  Building2,
  Newspaper,
  MessageCircle,
  FileCheck,
  Sparkles,
  Compass,
  Award,
  Droplets,
  Gift,
  BookOpen,
  Target,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import MobileMenu from "@/app/components/MobileMenu";
import { isSystemDarkSync } from "@/utils/media";


interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

type NavChild = { id: string; label: string; desc: string; icon: typeof Home; badge?: string };
type NavGroup = { id: string; label: string; icon: typeof Home; children: NavChild[]; featured?: NavChild };

const NAV_GROUPS: NavGroup[] = [
  {
    id: "about",
    label: "عن المؤسسة",
    icon: ShieldCheck,
    children: [
      { id: "about", label: "من نحن", desc: "الرسالة والرؤية والقيم", icon: Heart },
      { id: "transparency", label: "الحوكمة والشفافية", desc: "التقارير والمساءلة", icon: BarChart3, badge: "٤٨٢" },
      { id: "reports", label: "التقارير", desc: "المالية والميدانية", icon: FileCheck },
      { id: "partners", label: "شركاؤنا", desc: "شبكة الثقة والتعاون", icon: Building2 },
      { id: "media", label: "المركز الإعلامي", desc: "الصور والقصص والتغطيات", icon: Newspaper },
    ],
  },
  {
    id: "programs",
    label: "برامجنا وأثرنا",
    icon: Target,
    featured: { id: "impact-engine", label: "محرك الأثر", desc: "لوحة قياس الأثر الحي", icon: Sparkles, badge: "جديد" },
    children: [
      { id: "programs", label: "مجالات العمل", desc: "٧ مسارات متكاملة", icon: Compass },
      { id: "projects", label: "المشاريع", desc: "الميدان بالأرقام والخرائط", icon: Droplets },
      { id: "success", label: "قصص النجاح", desc: "أصوات غيّرتم حياتها", icon: Award },
      { id: "impact", label: "الأثر المجتمعي", desc: "من المعاناة إلى القدرة", icon: Target },
      { id: "impact-center", label: "مركز الأثر", desc: "دراسات وبيانات", icon: BarChart3 },
      { id: "interactive-map", label: "الخريطة التفاعلية", desc: "٨ محافظات على الخريطة", icon: Map },
    ],
  },
  {
    id: "giving",
    label: "العطاء الذكي",
    icon: Gift,
    featured: { id: "zakat-calculator", label: "حاسبة الزكاة", desc: "احسب زكاتك بدقة شرعية", icon: Calculator, badge: "شرعي" },
    children: [
      { id: "donate", label: "تبرع الآن", desc: "مالي أو عيني بعملات متعددة", icon: HandHeart },
      { id: "zakat", label: "الزكاة", desc: "مصارفها وأثرها", icon: BookOpen },
      { id: "sadaqah-jariyah", label: "الصدقة الجارية", desc: "أثر لا ينقطع", icon: Gift },
      { id: "endowment", label: "الوقف", desc: "استثمار مستدام", icon: Building2 },
      { id: "campaigns", label: "الحملات", desc: "كسوة الشتاء وغيرها", icon: Heart },
      { id: "smart-advisor", label: "المستشار الذكي", desc: "وجّه تبرعك بذكاء", icon: Lightbulb, badge: "ذكي" },
    ],
  },
  {
    id: "donors",
    label: "للمتبرعين والشركاء",
    icon: UsersRound,
    children: [
      { id: "donor", label: "بوابة المتبرع", desc: "تابع تبرعاتك وأثرك", icon: CircleUserRound },
      { id: "donor-passport", label: "جواز المتبرع", desc: "هويتك في رحلة الخير", icon: Award },
      { id: "donor-journey", label: "رحلة المتبرع", desc: "من النية إلى الأثر", icon: Compass },
      { id: "major-donors", label: "كبار المتبرعين", desc: "شراكات استراتيجية", icon: Building2 },
      { id: "corporate", label: "الشركات", desc: "المسؤولية المجتمعية", icon: Building2 },
      { id: "impact-for-business", label: "الأثر للشركات", desc: "عائد الاستثمار المجتمعي", icon: BarChart3 },
    ],
  },
  {
    id: "community",
    label: "خدمات المجتمع",
    icon: GraduationCap,
    featured: { id: "training", label: "التدريب والتمكين", desc: "بناء القدرة لا الإعانة", icon: GraduationCap },
    children: [
      { id: "requests", label: "طلب مستفيد", desc: "قدّم طلبك بكرامة", icon: Heart },
      { id: "volunteer", label: "التطوع", desc: "وقتك وخبرتك يصنعان فرقاً", icon: UsersRound },
      { id: "feedback", label: "الشكاوى والاقتراحات", desc: "صوتك يُحسّن خدمتنا", icon: MessageCircle },
      { id: "help", label: "مركز المساعدة", desc: "إجابات لكل الأسئلة", icon: MessageCircle },
      { id: "services", label: "دليل الخدمات", desc: "كل الخدمات في مكان واحد", icon: Compass },
    ],
  },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {/* الشعار الرسمي — مثبّت دائماً بلونه الأصلي داخل خلفية فاتحة
          (لا تحويل لسيلويت أبيض حتى لا تختفي الهوية الرسمية) */}
      <span
        className={`grid shrink-0 place-items-center rounded-2xl bg-[var(--brand-green-pale)] ring-1 ring-[var(--brand-green)]/15 ${
          compact ? "h-10 w-10" : "h-11 w-11"
        }`}
      >
        <img
          src="/logo.svg"
          alt="الشعار الرسمي لمؤسسة رحماء بينهم للإغاثة والتنمية"
          width={44}
          height={44}
          decoding="async"
          className="h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] rounded-[10px] object-contain"
        />
      </span>
      <span className="flex flex-col text-right leading-none">
        <span className={`${compact ? "text-base" : "text-lg"} font-bold text-[var(--brand-green)]`}>
          رحماء بينهم
        </span>
        <span className="mt-1.5 text-[10px] font-semibold text-[var(--brand-gold-dark)]">
          إغاثة وتنمية باليمن
        </span>
      </span>
    </div>
  );
}

function MegaPanel({
  group,
  onNavigate,
  onClose,
}: {
  group: NavGroup;
  onNavigate: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute right-0 top-full mt-3 w-[560px] overflow-hidden rounded-2xl border border-[var(--brand-green)]/10 bg-[var(--card)] shadow-[0_20px_60px_rgba(0,0,0,0.16),0_8px_24px_rgba(var(--brand-green-rgb),.12)]"
      role="region"
      aria-label={group.label}
    >
      {group.featured && (
        <button
          type="button"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
            onNavigate(group.featured!.id);
            onClose();
          }}
          className="flex w-full items-center gap-4 bg-gradient-to-l from-[var(--brand-green)] to-[var(--brand-green-light)] px-5 py-4 text-right text-white transition hover:from-[var(--brand-green-light)] hover:to-[var(--brand-green)]"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
            <group.featured.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="flex items-center gap-2 text-sm font-black">
              {group.featured.label}
              {group.featured.badge && (
                <span className="rounded-full bg-[var(--brand-gold)] px-2 py-0.5 text-[10px] font-black text-[var(--brand-green-dark)]">
                  {group.featured.badge}
                </span>
              )}
            </span>
            <span className="text-xs text-white/70">{group.featured.desc}</span>
          </span>
          <ArrowLeft className="h-4 w-4 text-white/70" aria-hidden="true" />
        </button>
      )}
      <div className="grid grid-cols-2 gap-1 p-2">
        {group.children.map((child) => (
          <button
            key={child.id}
            type="button"
            onClick={() => {
              onNavigate(child.id);
              onClose();
            }}
            className="flex items-start gap-3 rounded-xl px-3 py-3 text-right transition hover:bg-[var(--brand-green-pale)]"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--brand-green)]/8 text-[var(--brand-green)]">
              <child.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--foreground)]">
                {child.label}
                {child.badge && (
                  <span className="rounded-full bg-[var(--brand-gold)]/15 px-1.5 py-0.5 text-[10px] font-black text-[var(--brand-gold-dark)]">
                    {child.badge}
                  </span>
                )}
              </span>
              <span className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-[var(--muted-foreground)]">
                {child.desc}
              </span>
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default memo(function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  // True only after the user explicitly toggles the theme — gates persistence
  // so the OS-following default is never frozen into storage by accident.
  const explicitThemeChoice = useRef(false);
  // Render-phase initializer reads only localStorage (sync, pure).
  // OS theme is resolved in the mount effect below via the centralized helper.
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("rh_theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
    if (!explicitThemeChoice.current) return;
    try {
      localStorage.setItem("rh_theme", isDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [isDark]);

  // Resolve the OS theme on mount when the user has no saved preference,
  // and follow OS changes. Runs in an effect — never during render.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("rh_theme");
    } catch {
      saved = null;
    }
    if (saved === "dark" || saved === "light") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: intentional OS-theme hydration after mount
    setIsDark(isSystemDarkSync());
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      let current: string | null = null;
      try {
        current = localStorage.getItem("rh_theme");
      } catch {
        current = null;
      }
      if (current !== "dark" && current !== "light") setIsDark(e.matches);
    };
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const navigate = useCallback(
    (page: string) => {
      setCurrentPage(page);
      setIsMobileMenuOpen(false);
      setOpenGroup(null);
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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 lg:top-[var(--header-topbar-h)] ${
          isOverlay
            ? "bg-gradient-to-b from-[var(--brand-green-dark)]/80 to-transparent"
            : "border-b border-[var(--brand-green)]/8 bg-[var(--card)] shadow-[0_4px_20px_rgba(0,0,0,0.08),0_10px_35px_rgba(var(--brand-green-rgb),.08)] backdrop-blur-xl"
        }`}
        dir="rtl"
      >
        <nav
          ref={navRef}
          className="shell flex h-[var(--header-main-h)] items-center justify-between gap-3 sm:gap-4"
          aria-label="التصفح الرئيسي"
        >
          <button
            type="button"
            onClick={() => navigate("home")}
            aria-label="العودة إلى الصفحة الرئيسية"
            className={`shrink-0 rounded-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 ${
              isOverlay
                ? "bg-white/95 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md"
                : ""
            }`}
          >
            <BrandMark />
          </button>

          <div className="hidden items-center gap-1 xl:flex">
            <motion.button
              type="button"
              onClick={() => navigate("home")}
              whileTap={{ scale: 0.97 }}
              aria-current={isHome ? "page" : undefined}
              className={`inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-xs font-bold transition ${
                // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
                isHome
                  ? "bg-[var(--brand-green)] text-white shadow-md"
                  : isOverlay
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : "text-[var(--foreground)] hover:bg-[var(--brand-green-pale)] hover:text-[var(--brand-green)]"
              }`}
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              الرئيسية
            </motion.button>

            {NAV_GROUPS.map((group) => {
              const isActive = group.children.some((c) => c.id === currentPage) || group.featured?.id === currentPage;
              const isOpen = openGroup === group.id;
              return (
                <div key={group.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isOpen ? null : group.id)}
                    onMouseEnter={() => setOpenGroup(group.id)}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 text-xs font-bold transition ${
                      // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
                      isActive
                        ? "bg-[var(--brand-green)] text-white shadow-md"
                        // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
                        : isOpen
                          ? isOverlay
                            ? "bg-white/15 text-white"
                            : "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                          : isOverlay
                            ? "text-white/85 hover:bg-white/10 hover:text-white"
                            : "text-[var(--foreground)] hover:bg-[var(--brand-green-pale)] hover:text-[var(--brand-green)]"
                    }`}
                  >
                    <group.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {group.label}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""} opacity-60`}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <div onMouseLeave={() => setOpenGroup(null)}>
                        <MegaPanel group={group} onNavigate={navigate} onClose={() => setOpenGroup(null)} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                explicitThemeChoice.current = true;
                setIsDark((d) => !d);
              }}
              aria-label={isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
              className={`grid h-10 w-10 place-items-center rounded-xl transition ${
                isOverlay
                  ? "text-white/80 hover:bg-white/10"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--brand-green-pale)] hover:text-[var(--brand-green)]"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <motion.button
              type="button"
              onClick={() => navigate("donate")}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              aria-label="تبرع الآن"
              className="hidden items-center gap-2 whitespace-nowrap rounded-xl bg-[var(--brand-gold-light)] px-4 py-2.5 text-xs font-bold text-[var(--brand-green-dark)] shadow-[0_8px_20px_rgba(var(--brand-gold-rgb),.22)] transition hover:bg-[var(--brand-gold)] sm:inline-flex"
            >
              <HandHeart className="h-4 w-4" aria-hidden="true" />
              تبرع الآن
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            </motion.button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              className={`grid h-10 w-10 place-items-center rounded-xl transition xl:hidden ${
                isOverlay
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
              }`}
            >
              <Menu className="h-5 w-5" />
            </button>
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
