// Navbar Component - Navigation Bar for the Website
// Premium design with glass effect, smooth transitions, and responsive behavior
import { useState, useEffect, useCallback } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'about', label: 'عن المؤسسة' },
  { id: 'programs', label: 'برامجنا' },
  { id: 'projects', label: 'مشاريعنا' },
  { id: 'success', label: 'قصص النجاح' },
  { id: 'transparency', label: 'الشفافية' },
  { id: 'donor', label: 'بوابة المتبرع' },
  { id: 'contact', label: 'اتصل بنا' },
];

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5' 
          : 'bg-gradient-to-b from-black/40 to-transparent'
      }`}
      dir="rtl"
    >
      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
              isScrolled 
                ? 'bg-gradient-to-br from-[var(--brand-green)] to-emerald-600 shadow-md' 
                : 'bg-white/20 backdrop-blur-sm border border-white/30'
            }`}>
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" fill="white" />
            </div>
            <div className="text-right hidden sm:block">
              <h1 className={`text-base md:text-lg font-bold transition-colors duration-300 ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}>
                رحماء بينهم
              </h1>
              <p className={`text-[0.6rem] md:text-xs transition-colors duration-300 ${
                isScrolled ? 'text-gray-400' : 'text-white/60'
              }`}>
                Rahamaa Foundation
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`relative px-3 lg:px-4 py-2 rounded-full transition-all text-sm font-medium ${
                  currentPage === item.id
                    ? isScrolled
                      ? 'bg-[var(--brand-green)]/10 text-[var(--brand-green)]'
                      : 'bg-white/15 text-white backdrop-blur-sm'
                    : isScrolled
                      ? 'text-gray-600 hover:text-[var(--brand-green)] hover:bg-gray-100'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      isScrolled ? 'bg-[var(--brand-green)]' : 'bg-white'
                    }`}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => handleNavigation('donate')}
              className={`hidden sm:flex items-center gap-2 px-5 md:px-6 py-2 md:py-2.5 rounded-full font-medium transition-all duration-300 hover:shadow-lg text-sm ${
                isScrolled
                  ? 'bg-gradient-to-l from-[var(--brand-green)] to-emerald-600 text-white hover:shadow-[var(--brand-green)]/20'
                  : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
              }`}
            >
              <Heart className="w-4 h-4" fill="currentColor" />
              <span className="hidden lg:inline">تبرع الآن</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20'
              }`}
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? (
                <X className={`w-5 h-5 ${isScrolled ? 'text-gray-600' : 'text-white'}`} />
              ) : (
                <Menu className={`w-5 h-5 ${isScrolled ? 'text-gray-600' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 mb-4 overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full text-right px-4 py-3 rounded-xl transition-all text-sm ${
                      currentPage === item.id
                        ? 'bg-[var(--brand-green)]/10 text-[var(--brand-green)] font-semibold border-r-2 border-[var(--brand-green)]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--brand-green)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleNavigation('donate')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-l from-[var(--brand-green)] to-emerald-600 text-white rounded-xl font-medium shadow-md"
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
}
