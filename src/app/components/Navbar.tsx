import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  BookOpenText,
  Calculator,
  ChevronDown,
  CircleUserRound,
  HandHeart,
  Heart,
  Home,
  Menu,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
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
  { id: "about", label: "عن المؤسسة", icon: BookOpenText },
  { id: "programs", label: "مجالات العمل", icon: UsersRound },
  { id: "projects", label: "مشاريعنا", icon: HandHeart },
  { id: "transparency", label: "الشفافية", icon: ShieldCheck },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${compact ? "h-10 w-10 rounded-[14px]" : "h-11 w-11 rounded-[15px]"} relative grid shrink-0 place-items-center bg-[var(--brand-green)] text-[var(--brand-gold)] shadow-[0_8px_20px_rgba(15,76,58,.15)]`}>
        <span className="absolute inset-[6px] rotate-45 rounded-[8px] border border-[var(--brand-gold)]/75" />
        <Heart className="relative h-5 w-5" fill="currentColor" strokeWidth={1.8} />
      </div>
      <div className="text-right leading-none">
        <div className={`${compact ? "text-base" : "text-lg"} font-extrabold tracking-tight text-[var(--brand-green)]`}>رحماء بينهم</div>
        <div className="mt-1 text-[10px] font-medium tracking-[0.14em] text-[var(--brand-gold-dark)]">إغاثة • تنمية • أثر</div>
      </div>
    </div>
  );
}

export default memo(function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const navigate = useCallback((page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [setCurrentPage]);

  const isHome = currentPage === "home" || currentPage === "";
  const isOverlay = isHome && !isScrolled;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isOverlay ? "bg-gradient-to-b from-[#061F17]/80 to-transparent" : "border-b border-[var(--brand-green)]/8 bg-white/92 shadow-[0_10px_35px_rgba(15,76,58,.08)] backdrop-blur-xl"}`} dir="rtl">
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10" aria-label="التصفح الرئيسي">
        <div className="flex h-[76px] items-center justify-between gap-6">
          <button type="button" onClick={() => navigate("home")} aria-label="العودة إلى الصفحة الرئيسية" className={`rounded-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-[#D6A95D] focus-visible:ring-offset-2 ${isOverlay ? "brightness-0 invert" : ""}`}>
            <BrandMark />
          </button>

          <div className="hidden items-center gap-1 rounded-2xl border border-[var(--brand-green)]/8 bg-white/85 p-1.5 shadow-sm backdrop-blur-md lg:flex">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = currentPage === id || (id === "home" && isHome);
              return <button key={id} type="button" onClick={() => navigate(id)} aria-current={active ? "page" : undefined} className={`relative inline-flex min-h-10 items-center gap-2 rounded-xl px-3.5 text-xs font-bold transition ${active ? "bg-[var(--brand-green)] text-white shadow-md shadow-[var(--brand-green)]/15" : "text-[#52635D] hover:bg-[var(--brand-green-pale)] hover:text-[var(--brand-green)]"}`}><Icon className="h-3.5 w-3.5" /><span>{label}</span>{id === "transparency" && <span className="h-1.5 w-1.5 rounded-full bg-[#D6A95D]" />}</button>;
            })}
            <div className="mx-1 h-5 w-px bg-[var(--brand-green)]/10" />
            <button type="button" onClick={() => navigate("zakat")} className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-bold text-[var(--brand-gold-dark)] transition hover:bg-[#F7F0DF]"><Calculator className="h-3.5 w-3.5" /><span>حاسبة الزكاة</span></button>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate("donor")} className={`hidden min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-bold transition xl:inline-flex ${isOverlay ? "text-white/80 hover:bg-white/10" : "text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)]"}`}><CircleUserRound className="h-4 w-4" /><span>بوابة المتبرع</span><ChevronDown className="h-3.5 w-3.5 rotate-90 opacity-50" /></button>
            <motion.button type="button" onClick={() => navigate("donate")} whileHover={{ y: -2 }} whileTap={{ scale: .98 }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--brand-gold-light)] px-4 text-xs font-extrabold text-[var(--brand-green-dark)] shadow-[0_10px_25px_rgba(var(--brand-gold-rgb),.23)] transition hover:bg-[var(--brand-gold)] sm:px-5"><HandHeart className="h-4 w-4" /><span>تبرع الآن</span><ArrowLeft className="h-3.5 w-3.5" /></motion.button>
            <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation" aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"} className={`grid h-11 w-11 place-items-center rounded-xl transition lg:hidden ${isOverlay ? "bg-white/10 text-white hover:bg-white/20" : "bg-[var(--brand-green-pale)] text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)]"}`}>{isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && <motion.div id="mobile-navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2 }} className="mb-4 overflow-hidden rounded-[24px] border border-[var(--brand-green)]/10 bg-white/96 p-3 shadow-2xl backdrop-blur-xl lg:hidden">
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-[var(--brand-green-pale)] px-4 py-3"><div><p className="text-xs font-extrabold text-[var(--brand-green)]">رحماء بينهم</p><p className="mt-1 text-[10px] text-[var(--muted-foreground)]">رحمة تُرى في العمل</p></div><BrandMark compact /></div>
            <div className="grid gap-1">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => { const active = currentPage === id || (id === "home" && isHome); return <button key={id} type="button" onClick={() => navigate(id)} aria-current={active ? "page" : undefined} className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 text-right text-sm font-bold transition ${active ? "bg-[var(--brand-green)] text-white" : "text-[#52635D] hover:bg-[var(--brand-green-pale)]"}`}><span className={`grid h-8 w-8 place-items-center rounded-xl ${active ? "bg-white/12 text-[var(--brand-gold)]" : "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"}`}><Icon className="h-4 w-4" /></span><span>{label}</span><ChevronDown className="mr-auto h-4 w-4 -rotate-90 opacity-40" /></button>; })}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[var(--brand-green)]/8 pt-3"><button type="button" onClick={() => navigate("zakat")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F7F0DF] text-xs font-bold text-[var(--brand-gold-dark)]"><Calculator className="h-4 w-4" />حاسبة الزكاة</button><button type="button" onClick={() => navigate("donor")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-green-pale)] text-xs font-bold text-[var(--brand-green)]"><CircleUserRound className="h-4 w-4" />بوابة المتبرع</button></div>
          </motion.div>}
        </AnimatePresence>
      </nav>
    </header>
  );
});


