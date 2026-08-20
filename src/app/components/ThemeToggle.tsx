import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Laptop, Eye, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '@/app/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'dropdown' | 'compact';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'dropdown',
}) => {
  const { theme, setTheme, isDark, isHighContrast, toggleHighContrast } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'light', label: 'وضع نهاري (فاتح)', icon: Sun },
    { mode: 'dark', label: 'وضع ليلي (داكن)', icon: Moon },
    { mode: 'system', label: 'تلقائي (حسب الجهاز)', icon: Laptop },
  ];

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي'}
        title={isDark ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي'}
        className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" aria-hidden="true" />
        )}
      </button>
    );
  }

  return (
    <div className={`relative inline-block text-right ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="تغيير مظهر الصفحة والتباين"
        title="تغيير مظهر الصفحة والتباين"
        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 shadow-xs flex items-center gap-2 text-xs font-bold font-cairo cursor-pointer outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
      >
        <span className="flex items-center justify-center">
          {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />}
          {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" aria-hidden="true" />}
          {theme === 'system' && <Laptop className="w-4 h-4 text-emerald-500" aria-hidden="true" />}
        </span>

        {isHighContrast && (
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="وضع التباين العالي نشط" />
        )}

        <span className="hidden sm:inline-block">
          {theme === 'light' ? 'فاتح' : theme === 'dark' ? 'داكن' : 'تلقائي'}
        </span>
      </button>

      {/* Menu Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 space-y-1 text-slate-800 dark:text-slate-100 text-xs font-cairo"
            role="menu"
            aria-orientation="vertical"
            aria-label="خيارات المظهر"
          >
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
              اختر مظهر الموقع
            </div>

            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.mode;

              return (
                <button
                  key={opt.mode}
                  role="menuitem"
                  onClick={() => {
                    setTheme(opt.mode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer text-right font-medium ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[var(--brand-green)] dark:text-emerald-400 font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[var(--brand-green)] dark:text-emerald-400 shrink-0" />}
                </button>
              );
            })}

            <div className="pt-1 border-t border-slate-100 dark:border-slate-800 my-1" />

            {/* High Contrast Toggle */}
            <button
              role="menuitem"
              onClick={() => {
                toggleHighContrast();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer text-right font-medium ${
                isHighContrast
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
                <span>وضع التباين العالي (الكفيف)</span>
              </div>
              <div
                className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${
                  isHighContrast ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform ${
                    isHighContrast ? '-translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
