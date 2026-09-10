import { memo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Home,
  Info,
  Heart,
  FolderOpen,
  Megaphone,
  BarChart3,
  Eye,
  Phone,
  Calculator,
  MessageCircle,
  MapPin,
  Users,
  Map,
  Clock,
  Search,
  HandHeart,
  ArrowLeft,
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'about', label: 'عن الحملة', icon: Info },
  { id: 'programs', label: 'مجالات العمل', icon: FolderOpen },
  { id: 'projects', label: 'المشاريع', icon: FolderOpen },
  { id: 'donate', label: 'تبرع الآن', icon: Heart, highlight: true },
  { id: 'media', label: 'المركز الإعلامي', icon: Megaphone },
  { id: 'reports', label: 'التقارير', icon: BarChart3 },
  { id: 'transparency', label: 'الشفافية', icon: Eye },
  { id: 'contact', label: 'تواصل معنا', icon: Phone },
];

const QUICK_ACTIONS = [
  { id: 'donate', label: 'تبرع سريع', icon: HandHeart, highlight: true },
  { id: 'zakat', label: 'حاسبة الزكاة', icon: Calculator, color: 'text-blue-500' },
  { id: 'whatsapp', label: 'تواصل واتساب', icon: MessageCircle, color: 'text-green-500' },
  { id: 'map', label: 'الخريطة التفاعلية', icon: MapPin, color: 'text-purple-500' },
];

const IMPACT_STATS = [
  { value: '١٥,٠٠٠+', label: 'مستفيد', icon: Users },
  { value: '٨', label: 'محافظات', icon: Map },
  { value: '١٢', label: 'سنة خدمة', icon: Clock },
];

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.3,
    },
  }),
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

export default memo(function MobileMenu({
  isOpen,
  onClose,
  onNavigate,
  currentPage = 'home',
}: MobileMenuProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback(
    (page: string) => {
      onNavigate(page);
      onClose();
    },
    [onNavigate, onClose]
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      const timer = setTimeout(() => searchRef.current?.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden" dir="rtl">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[var(--brand-green-dark)]/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-[var(--card)] shadow-[-8px_0_40px_rgba(0,0,0,0.18)]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--brand-green)]/8 bg-[var(--card)]/95 px-5 py-4 backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.svg"
                  alt="شعار رحماء بينهم"
                  className="h-9 w-9 shrink-0 rounded-xl object-contain shadow-[0_4px_12px_rgba(var(--brand-green-rgb),.12)]"
                />
                <div>
                  <p className="text-sm font-extrabold text-[var(--brand-green)]">
                    رحماء بينهم
                  </p>
                  <p className="text-[10px] font-medium text-[var(--brand-gold-dark)]">
                    رحمة تُرى في العمل
                  </p>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.85 }}
                aria-label="إغلاق القائمة"
                className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-green-pale)] text-[var(--brand-green)] transition-colors hover:bg-[var(--brand-green)] hover:text-[var(--primary-foreground)]"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Search Bar */}
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
                  className="h-11 w-full rounded-xl border border-[var(--brand-green)]/10 bg-[var(--background)] pr-10 pl-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--brand-green)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/10"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="px-3 pt-2" aria-label="القائمة الرئيسية">
              <ul className="grid gap-1">
                {NAV_ITEMS.map(({ id, label, icon: Icon, highlight }, i) => {
                  const active = currentPage === id;
                  return (
                    <motion.li
                      key={id}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <button
                        type="button"
                        onClick={() => navigate(id)}
                        aria-current={active ? 'page' : undefined}
                        className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-right text-sm font-bold transition-all duration-200 ${
                          highlight
                            ? 'bg-[var(--brand-gold)]/10 text-[var(--brand-gold-dark)] hover:bg-[var(--brand-gold)]/20'
                            : active
                              ? 'bg-[var(--brand-green)] text-[var(--primary-foreground)] shadow-md shadow-[var(--brand-green)]/15'
                              : 'text-[var(--foreground)] hover:bg-[var(--brand-green-pale)] hover:text-[var(--brand-green)]'
                        }`}
                      >
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                            highlight
                              ? 'bg-[var(--brand-gold)]/15 text-[var(--brand-gold-dark)]'
                              : active
                                ? 'bg-[var(--primary-foreground)]/12 text-[var(--brand-gold)]'
                                : 'bg-[var(--brand-green-pale)] text-[var(--brand-green)]'
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="flex-1">{label}</span>
                        {highlight && (
                          <span className="rounded-md bg-[var(--brand-gold)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--brand-green-dark)]">
                            مميز
                          </span>
                        )}
                        {!highlight && (
                          <ArrowLeft
                            className="h-4 w-4 opacity-30"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            {/* Quick Actions */}
            <div className="px-5 pt-5 pb-2">
              <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[var(--muted-foreground)]">
                إجراءات سريعة
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map(({ id, label, icon: Icon, highlight, color }, i) => (
                  <motion.button
                    key={id}
                    type="button"
                    onClick={() => navigate(id)}
                    custom={i + NAV_ITEMS.length}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-xs font-bold transition-all duration-200 ${
                      highlight
                        ? 'col-span-2 justify-center bg-[var(--brand-gold)] text-[var(--brand-green-dark)] shadow-[0_8px_20px_rgba(var(--brand-gold-rgb),.25)] hover:shadow-[0_12px_28px_rgba(var(--brand-gold-rgb),.35)]'
                        : 'bg-[var(--brand-green-pale)] text-[var(--foreground)] hover:bg-[var(--brand-green)]/10'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${highlight ? 'text-[var(--brand-green-dark)]' : color || 'text-[var(--brand-green)]'}`}
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Impact Stats */}
            <div className="mx-5 mt-4 mb-6 rounded-xl border border-[var(--brand-green)]/8 bg-[var(--brand-green-pale)]/50 p-4">
              <h3 className="mb-3 text-center text-xs font-extrabold uppercase tracking-wider text-[var(--brand-green)]">
                أثرنا حتى الآن
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {IMPACT_STATS.map(({ value, label, icon: Icon }, i) => (
                  <motion.div
                    key={label}
                    custom={i + NAV_ITEMS.length + QUICK_ACTIONS.length}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-center"
                  >
                    <Icon
                      className="mx-auto mb-1.5 h-5 w-5 text-[var(--brand-green)]"
                      aria-hidden="true"
                    />
                    <p className="text-base font-extrabold text-[var(--brand-green)]">
                      {value}
                    </p>
                    <p className="text-[10px] font-medium text-[var(--muted-foreground)]">
                      {label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom safe area */}
            <div className="h-6" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
