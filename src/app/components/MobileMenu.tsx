import {
  X,
  Home,
  Heart,
  ChevronDown,
  HandHeart,
  Calculator,
  MessageCircle,
  MapPin,
  Users,
  Map,
  Clock,
  Search,
  ArrowLeft,
  ShieldCheck,
  Target,
  Gift,
  GraduationCap,
  Newspaper,
  Award,
  BarChart3,
  Droplets,
  Building2,
  Lightbulb,
  Sparkles,
  Compass,
  FileCheck,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage?: string;
}

type MobileChild = { id: string; label: string; icon: typeof Home; badge?: string };
type MobileGroup = { id: string; label: string; icon: typeof Home; children: MobileChild[] };

const MOBILE_GROUPS: MobileGroup[] = [
  {
    id: "about",
    label: "عن المؤسسة",
    icon: ShieldCheck,
    children: [
      { id: "about", label: "من نحن", icon: Heart },
      { id: "transparency", label: "الحوكمة والشفافية", icon: BarChart3, badge: "٤٨٢" },
      { id: "reports", label: "التقارير", icon: FileCheck },
      { id: "partners", label: "شركاؤنا", icon: Building2 },
      { id: "media", label: "المركز الإعلامي", icon: Newspaper },
      { id: "news", label: "الأخبار", icon: Newspaper },
    ],
  },
  {
    id: "programs",
    label: "برامجنا وأثرنا",
    icon: Target,
    children: [
      { id: "programs", label: "مجالات العمل", icon: Compass },
      { id: "projects", label: "المشاريع", icon: Droplets },
      { id: "success", label: "قصص النجاح", icon: Award },
      { id: "impact", label: "الأثر المجتمعي", icon: Target },
      { id: "impact-center", label: "مركز الأثر", icon: BarChart3 },
      { id: "impact-engine", label: "محرك الأثر", icon: Sparkles, badge: "جديد" },
      { id: "interactive-map", label: "الخريطة التفاعلية", icon: Map },
    ],
  },
  {
    id: "giving",
    label: "العطاء الذكي",
    icon: Gift,
    children: [
      { id: "donate", label: "تبرع الآن", icon: HandHeart },
      { id: "zakat-calculator", label: "حاسبة الزكاة", icon: Calculator, badge: "شرعي" },
      { id: "zakat", label: "الزكاة", icon: BookOpen },
      { id: "sadaqah-jariyah", label: "الصدقة الجارية", icon: Gift },
      { id: "endowment", label: "الوقف", icon: Building2 },
      { id: "campaigns", label: "الحملات", icon: Heart },
      { id: "smart-advisor", label: "المستشار الذكي", icon: Lightbulb, badge: "ذكي" },
    ],
  },
  {
    id: "donors",
    label: "للمتبرعين والشركاء",
    icon: Users,
    children: [
      { id: "donor", label: "بوابة المتبرع", icon: Users },
      { id: "donor-passport", label: "جواز المتبرع", icon: Award },
      { id: "donor-journey", label: "رحلة المتبرع", icon: Compass },
      { id: "major-donors", label: "كبار المتبرعين", icon: Building2 },
      { id: "corporate", label: "الشركات", icon: Building2 },
      { id: "impact-for-business", label: "الأثر للشركات", icon: BarChart3 },
    ],
  },
  {
    id: "community",
    label: "خدمات المجتمع",
    icon: GraduationCap,
    children: [
      { id: "requests", label: "طلب مستفيد", icon: Heart },
      { id: "volunteer", label: "التطوع", icon: Users },
      { id: "training", label: "التدريب والتمكين", icon: GraduationCap },
      { id: "feedback", label: "الشكاوى والاقتراحات", icon: MessageCircle },
      { id: "help", label: "مركز المساعدة", icon: MessageCircle },
      { id: "services", label: "دليل الخدمات", icon: Compass },
      { id: "contact", label: "تواصل معنا", icon: MessageCircle },
    ],
  },
];

const QUICK_ACTIONS = [
  { id: "donate", label: "تبرع سريع", icon: HandHeart, highlight: true },
  { id: "zakat-calculator", label: "حاسبة الزكاة", icon: Calculator, color: "text-blue-500" },
  { id: "smart-advisor", label: "المستشار الذكي", icon: Lightbulb, color: "text-amber-500" },
  { id: "interactive-map", label: "الخريطة التفاعلية", icon: MapPin, color: "text-purple-500" },
] as const;

const IMPACT_STATS = [
  { value: "١٥,٠٠٠+", label: "مستفيد", icon: Users },
  { value: "٨", label: "محافظات", icon: Map },
  { value: "١١", label: "عاماً", icon: Clock },
] as const;

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.28 },
  }),
  exit: { opacity: 0, x: -16, transition: { duration: 0.12 } },
};

export default memo(function MobileMenu({
  isOpen,
  onClose,
  onNavigate,
  currentPage = "home",
}: MobileMenuProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState<string | null>("giving");

  const navigate = useCallback(
    (page: string) => {
      onNavigate(page);
      onClose();
    },
    [onNavigate, onClose]
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      const t = setTimeout(() => searchRef.current?.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let touchStartY = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      touchEndY = e.touches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (diff > minSwipeDistance && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    const onTouchEnd = () => {
      touchEndY = 0;
      touchStartY = 0;
    };

    const touchContainer = document.body;
    touchContainer.addEventListener("touchstart", onTouchStart, { passive: true });
    touchContainer.addEventListener("touchmove", onTouchMove, { passive: false });
    touchContainer.addEventListener("touchend", onTouchEnd);

    return () => {
      touchContainer.removeEventListener("touchstart", onTouchStart);
      touchContainer.removeEventListener("touchmove", onTouchMove);
      touchContainer.removeEventListener("touchend", onTouchEnd);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] xl:hidden" dir="rtl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[var(--brand-green-dark)]/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-hidden bg-[var(--card)] shadow-[-8px_0_40px_rgba(0,0,0,0.18)]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--brand-green)]/8 bg-[var(--card)]/95 px-5 py-4 backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.svg"
                  alt="شعار رحماء بينهم"
                  className="h-9 w-9 shrink-0 rounded-xl object-contain shadow-[0_4px_12px_rgba(var(--brand-green-rgb),.12)]"
                />
                <div>
                  <p className="text-sm font-extrabold text-[var(--brand-green)]">رحماء بينهم</p>
                  <p className="text-[10px] font-medium text-[var(--brand-gold-dark)]">رحمة تُرى في العمل</p>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
                aria-label="إغلاق القائمة"
                className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-5 pt-4 pb-2">
                <div className="relative">
                  <Search
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
                    aria-hidden="true"
                  />
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder="ابحث في الموقع..."
                    aria-label="بحث في الموقع"
                    className="h-11 w-full rounded-xl border border-[var(--brand-green)]/10 bg-[var(--background)] pr-10 pl-4 text-sm placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-green)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/10"
                  />
                </div>
              </div>

              <div className="px-3 pt-3">
                <button
                  type="button"
                  onClick={() => navigate("home")}
                  aria-current={currentPage === "home" ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    currentPage === "home"
                      ? "bg-[var(--brand-green)] text-white shadow-md"
                      : "bg-[var(--brand-gold)]/10 text-[var(--brand-gold-dark)] hover:bg-[var(--brand-gold)]/15"
                  }`}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                    <Home className="h-4 w-4" aria-hidden="true" />
                  </span>
                  الرئيسية
                  <ArrowLeft className="ms-auto h-4 w-4 opacity-40" aria-hidden="true" />
                </button>
              </div>

              <nav className="px-3 pt-4" aria-label="القائمة الرئيسية">
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                {MOBILE_GROUPS.map((group, gi) => {
                  const isExpanded = expanded === group.id;
                  const hasActiveChild = group.children.some((c) => c.id === currentPage);
                  return (
                    <div
                      key={group.id}
                      className={`mb-2 overflow-hidden rounded-xl border transition ${
                        hasActiveChild
                          ? "border-[var(--brand-green)]/15 bg-[var(--brand-green-pale)]/40"
                          : "border-[var(--border)] bg-[var(--card)]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : group.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`mobile-group-${group.id}`}
                        className="flex w-full items-center gap-3 px-4 py-3 text-right"
                      >
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand-green)]/10 text-[var(--brand-green)]">
                          <group.icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="flex-1 text-sm font-bold text-[var(--foreground)]">
                          {group.label}
                        </span>
                        <span className="rounded-full bg-[var(--brand-gold)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--brand-gold-dark)]">
                          {group.children.length}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-[var(--muted-foreground)] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            id={`mobile-group-${group.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-[var(--border)]"
                          >
                            <ul className="grid gap-0.5 p-2">
                              {group.children.map((child, ci) => {
                                const active = currentPage === child.id;
                                return (
                                  <motion.li
                                    key={child.id}
                                    custom={ci}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => navigate(child.id)}
                                      aria-current={active ? "page" : undefined}
                                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-right text-[13px] font-medium transition ${
                                        active
                                          ? "bg-[var(--brand-green)] text-white"
                                          : "text-[var(--foreground)] hover:bg-[var(--brand-green-pale)] hover:text-[var(--brand-green)]"
                                      }`}
                                    >
                                      <child.icon
                                        className={`h-3.5 w-3.5 shrink-0 ${active ? "text-white" : "text-[var(--brand-green)]"}`}
                                        aria-hidden="true"
                                      />
                                      <span className="flex-1">{child.label}</span>
                                      {child.badge && (
                                        <span
                                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                                            active
                                              ? "bg-white/20 text-white"
                                              : "bg-[var(--brand-gold)]/15 text-[var(--brand-gold-dark)]"
                                          }`}
                                        >
                                          {child.badge}
                                        </span>
                                      )}
                                      <ArrowLeft
                                        className={`h-3 w-3 shrink-0 ${active ? "text-white/60" : "opacity-30"}`}
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </motion.li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              <div className="px-5 pt-5 pb-2">
                <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[var(--muted-foreground)]">
                  إجراءات سريعة
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map((item, i) => {
                    const Icon = item.icon;
                    const isHighlight = "highlight" in item && Boolean((item as Record<string, any>).highlight);
                    const color = "color" in item ? (item as Record<string, any>).color as string : undefined;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(item.id)}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`flex items-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition ${
                          isHighlight
                            ? "col-span-2 justify-center bg-[var(--brand-gold)] text-[var(--brand-green-dark)] shadow-md"
                            : "bg-[var(--brand-green-pale)] text-[var(--foreground)] hover:bg-[var(--brand-green)]/10"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${isHighlight ? "text-[var(--brand-green-dark)]" : color || "text-[var(--brand-green)]"}`}
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="mx-5 mt-4 mb-6 rounded-xl border border-[var(--brand-green)]/8 bg-[var(--brand-green-pale)]/50 p-4">
                <h3 className="mb-3 text-center text-xs font-extrabold uppercase tracking-wider text-[var(--brand-green)]">
                  أثرنا حتى الآن
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {IMPACT_STATS.map(({ value, label, icon: Icon }, i) => (
                    <motion.div
                      key={label}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="text-center"
                    >
                      <Icon className="mx-auto mb-1 h-5 w-5 text-[var(--brand-green)]" aria-hidden="true" />
                      <p className="text-sm font-extrabold text-[var(--brand-green)]">{value}</p>
                      <p className="text-[10px] font-medium text-[var(--muted-foreground)]">{label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="h-6" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
