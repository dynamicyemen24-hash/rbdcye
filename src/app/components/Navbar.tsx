// Navbar Component - Navigation Bar for Rahamaa Foundation
// Premium design with expressive icons, intelligent contrast backdrop, and micro-interactions
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Menu, X, Home, Info, Layers, FolderHeart, Award,
  ShieldCheck, UserCheck, PhoneCall, Calculator, Sparkles, HandHeart
} from 'lucide-react';
import { useState, useEffect, useCallback, memo } from 'react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'about', label: 'عن المؤسسة', icon: Info },
  { id: 'programs', label: 'برامجنا', icon: Layers },
  { id: 'projects', label: 'مشاريعنا', icon: FolderHeart },
  { id: 'success', label: 'قصص النجاح', icon: Award },
  { id: 'zakat', label: 'الزكاة', icon: Calculator, badge: 'حاسبة' },
  { id: 'transparency', label: 'الشفافية', icon: ShieldCheck },
  { id: 'donor', label: 'بوابة المتبرع', icon: UserCheck },
  { id: 'contact', label: 'اتصل بنا', icon: PhoneCall },
];

export default memo(function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = useCallback((page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentPage]);

  // Is home page hero overlay active
  const isHomePage = currentPage === 'home' || currentPage === '';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-md shadow-emerald-950/5 border-b border-gray-100 py-2' 
          : isHomePage
            ? 'bg-gradient-to-b from-black/60 via-black/30 to-transparent py-3'
            : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100/80 py-2.5'
      }`}
      dir="rtl"
    >
      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('home')}
            className="flex items-center gap-3 group outline-none"
          >
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
              isScrolled || !isHomePage
                ? 'bg-gradient-to-br from-[var(--brand-green)] to-emerald-600 shadow-md shadow-emerald-600/20 text-white' 
                : 'bg-white/20 backdrop-blur-md border border-white/40 text-white'
            }`}>
              <Heart className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
            </div>
            <div className="text-right">
              <h1 className={`text-base md:text-lg font-bold tracking-tight transition-colors duration-300 ${
                isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'
              }`}>
                رحماء بينهم
              </h1>
              <p className={`text-[0.65rem] md:text-[0.7rem] font-medium transition-colors duration-300 ${
                isScrolled || !isHomePage ? 'text-[var(--brand-green)]' : 'text-emerald-200'
              }`}>
                مؤسسة خيرية إنسانية
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links with Expressive Icons */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-100/60 p-1.5 rounded-full border border-gray-200/50 backdrop-blur-sm">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || (item.id === 'home' && currentPage === '');
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-semibold whitespace-nowrap outline-none ${
                    isActive
                      ? 'bg-[var(--brand-green)] text-white shadow-md shadow-[var(--brand-green)]/25'
                      : 'text-gray-700 hover:text-[var(--brand-green)] hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                  
                  {item.badge && !isActive && (
                    <span className="px-1.5 py-0.2 text-[0.6rem] bg-[var(--brand-gold-pale)] text-[var(--brand-gold)] font-bold rounded-full border border-[var(--brand-gold)]/20">
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-[var(--brand-green)] rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Zakat Button */}
            <button
              onClick={() => handleNavigation('zakat')}
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isScrolled || !isHomePage
                  ? 'bg-amber-50 text-[var(--brand-gold)] border border-[var(--brand-gold)]/30 hover:bg-amber-100'
                  : 'bg-white/15 backdrop-blur-md text-amber-200 border border-amber-300/30 hover:bg-white/25'
              }`}
            >
              <Calculator className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>الزكاة</span>
            </button>

            {/* Donate Now CTA Button */}
            <motion.button
              onClick={() => handleNavigation('donate')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 md:py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg text-xs md:text-sm bg-gradient-to-l from-[var(--brand-green)] to-emerald-600 text-white shadow-emerald-700/25 hover:shadow-emerald-700/40"
            >
              <Heart className="w-4 h-4" fill="currentColor" />
              <span>تبرع الآن</span>
            </motion.button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                isScrolled || !isHomePage
                  ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                  : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
              }`}
              aria-label="قائمة التصفح"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100 mt-2 mb-4 overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-sm font-semibold ${
                        isActive
                          ? 'bg-[var(--brand-green-pale)] text-[var(--brand-green)] border-r-4 border-[var(--brand-green)]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isActive ? 'bg-[var(--brand-green)] text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-amber-100 text-[var(--brand-gold)] font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col gap-2">
                  <button
                    onClick={() => handleNavigation('zakat')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 text-[var(--brand-gold)] border border-[var(--brand-gold)]/20 rounded-2xl font-bold text-sm"
                  >
                    <Calculator className="w-4 h-4" />
                    حاسبة الزكاة الشرعية
                  </button>
                  <button
                    onClick={() => handleNavigation('donate')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-l from-[var(--brand-green)] to-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-700/25"
                  >
                    <Heart className="w-4 h-4" fill="white" />
                    تبرع الآن
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
});
