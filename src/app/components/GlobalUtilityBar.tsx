// Global Utility Bar - شريط الأدوات المساعدة العائم المتقدم
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Type, Sun, Moon, Coffee, Eye, RotateCcw,
  ArrowUp, Share2, Phone, MessageCircle, X, Sparkles,
  Printer, Minus, Plus, Keyboard, Zap
} from 'lucide-react';
import {
  FontSizeLevel, ReaderThemeMode,
  getSavedReaderPreferences, saveReaderPreferences
} from './ReadabilityControls';

interface GlobalUtilityBarProps {
  onSearchOpen: () => void;
}

type FontWeightMode = 'normal' | 'bold' | 'bolder';

export function GlobalUtilityBar({ onSearchOpen }: GlobalUtilityBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeLevel>('normal');
  const [theme, setTheme] = useState<ReaderThemeMode>('light');
  const [fontWeight, setFontWeight] = useState<FontWeightMode>('normal');
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const saved = getSavedReaderPreferences();
    setFontSize(saved.fontSize);
    setTheme(saved.theme);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFontSizeChange = useCallback((size: FontSizeLevel) => {
    setFontSize(size);
    saveReaderPreferences({ fontSize: size });
    document.documentElement.style.setProperty('--reader-font-size',
      size === 'normal' ? '1rem' :
      size === 'large' ? '1.15rem' :
      size === 'xlarge' ? '1.3rem' : '1.5rem'
    );
  }, []);

  const handleThemeChange = useCallback((t: ReaderThemeMode) => {
    setTheme(t);
    saveReaderPreferences({ theme: t });
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
      root.classList.remove('sepia', 'contrast');
    } else if (t === 'sepia') {
      root.classList.add('sepia');
      root.classList.remove('dark', 'contrast');
    } else if (t === 'contrast') {
      root.classList.add('contrast');
      root.classList.remove('dark', 'sepia');
    } else {
      root.classList.remove('dark', 'sepia', 'contrast');
    }
  }, []);

  const handleFontWeightChange = useCallback((weight: FontWeightMode) => {
    setFontWeight(weight);
    document.documentElement.style.setProperty('--reader-font-weight',
      weight === 'normal' ? '400' :
      weight === 'bold' ? '600' : '700'
    );
  }, []);

  const handleReset = useCallback(() => {
    setFontSize('normal');
    setTheme('light');
    setFontWeight('normal');
    saveReaderPreferences({ fontSize: 'normal', theme: 'light', lineHeight: 'relaxed' });
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia', 'contrast');
    root.style.removeProperty('--reader-font-size');
    root.style.removeProperty('--reader-font-weight');
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch {
        // The user may cancel the native share dialog; no further action is required.
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrint = () => window.print();

  const tools = [
    { icon: Search, label: 'بحث', onClick: onSearchOpen, color: 'var(--brand-green)', shortcut: 'Ctrl+K' },
    { icon: Share2, label: 'مشاركة', onClick: handleShare, color: 'var(--brand-green)' },
    { icon: Printer, label: 'طباعة', onClick: handlePrint, color: 'var(--brand-green)' },
    { icon: Phone, label: 'اتصال', onClick: () => window.open('tel:+967780777007'), color: 'var(--brand-green)' },
    { icon: MessageCircle, label: 'واتساب', onClick: () => window.open('https://wa.me/967780777007'), color: '#25D366' },
  ];

  const fontSizes: { key: FontSizeLevel; label: string; icon: React.ReactNode }[] = [
    { key: 'normal', label: 'عادي', icon: <Minus className="w-3 h-3" /> },
    { key: 'large', label: 'مريح', icon: <Type className="w-3.5 h-3.5" /> },
    { key: 'xlarge', label: 'كبير', icon: <Plus className="w-3.5 h-3.5" /> },
    { key: 'xxlarge', label: 'أقصى', icon: <Plus className="w-4 h-4" /> },
  ];

  const themes: { key: ReaderThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'light', label: 'نهاري', icon: <Sun className="w-4 h-4" />, desc: 'الوضع الافتراضي' },
    { key: 'sepia', label: 'دافئ', icon: <Coffee className="w-4 h-4" />, desc: 'مريح للعين' },
    { key: 'dark', label: 'ليلي', icon: <Moon className="w-4 h-4" />, desc: 'wohliger للعينين' },
    { key: 'contrast', label: 'تباين', icon: <Eye className="w-4 h-4" />, desc: 'وضوح عالي' },
  ];

  const fontWeights: { key: FontWeightMode; label: string }[] = [
    { key: 'normal', label: 'عادي' },
    { key: 'bold', label: 'سميك' },
    { key: 'bolder', label: 'أثقل' },
  ];

  const shortcuts = [
    { keys: ['Ctrl', 'K'], action: 'فتح البحث' },
    { keys: ['Ctrl', '+'], action: 'تكبير الخط' },
    { keys: ['Ctrl', '-'], action: 'تصغير الخط' },
    { keys: ['Ctrl', 'P'], action: 'طباعة الصفحة' },
    { keys: ['Esc'], action: 'إغلاق النوافذ' },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed left-4 bottom-6 z-50 flex flex-col items-center gap-3" dir="ltr">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={scrollToTop}
              className="w-11 h-11 rounded-full bg-white shadow-lg shadow-gray-200/80 border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[var(--brand-green)] hover:border-[var(--brand-green)]/30 transition-all hover:scale-110"
              aria-label="العودة للأعلى"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
            isOpen
              ? 'bg-gray-800 text-white shadow-gray-800/30'
              : 'bg-[var(--brand-green)] text-white shadow-[var(--brand-green)]/30'
          }`}
          aria-label={isOpen ? 'إغلاق الأدوات' : 'أدوات المساعدة'}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Quick Actions (always visible) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-4 bottom-20 z-50 flex flex-col gap-2"
            dir="ltr"
          >
            {tools.map((tool, i) => (
              <motion.button
                key={tool.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: i * 0.05 }}
                onClick={tool.onClick}
                className="w-10 h-10 rounded-full bg-white shadow-md shadow-gray-200/60 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-white hover:shadow-lg transition-all hover:scale-110 group"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = tool.color;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
                aria-label={tool.label}
                title={tool.label}
              >
                <tool.icon className="w-4 h-4" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed left-4 bottom-20 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[80vh] overflow-y-auto"
              dir="rtl"
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-l from-[var(--brand-green)] to-emerald-600 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-bold">أدوات المساعدة</span>
                  </div>
                  <button
                    onClick={() => setShowShortcuts(!showShortcuts)}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-white"
                    title="اختصارات لوحة المفاتيح"
                  >
                    <Keyboard className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Keyboard Shortcuts */}
                <AnimatePresence>
                  {showShortcuts && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                        <div className="text-xs font-bold text-gray-500 mb-2">اختصارات لوحة المفاتيح</div>
                        {shortcuts.map((s, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">{s.action}</span>
                            <div className="flex gap-1">
                              {s.keys.map((key, j) => (
                                <kbd key={j} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono text-gray-500">
                                  {key}
                                </kbd>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Font Size */}
                <div>
                  <span className="text-xs font-bold text-gray-500 mb-2 block">حجم الخط</span>
                  <div className="flex gap-1.5">
                    {fontSizes.map((fs) => (
                      <button
                        key={fs.key}
                        onClick={() => handleFontSizeChange(fs.key)}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          fontSize === fs.key
                            ? 'bg-[var(--brand-green)] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {fs.icon}
                        {fs.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Weight */}
                <div>
                  <span className="text-xs font-bold text-gray-500 mb-2 block">سمك الخط</span>
                  <div className="flex gap-1.5">
                    {fontWeights.map((fw) => (
                      <button
                        key={fw.key}
                        onClick={() => handleFontWeightChange(fw.key)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          fontWeight === fw.key
                            ? 'bg-[var(--brand-green)] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={{ fontWeight: fw.key === 'normal' ? '400' : fw.key === 'bold' ? '600' : '800' }}
                      >
                        {fw.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <span className="text-xs font-bold text-gray-500 mb-2 block">نمط العرض</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {themes.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => handleThemeChange(t.key)}
                        className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          theme === t.key
                            ? 'bg-[var(--brand-green)] text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {t.icon}
                        <span>{t.label}</span>
                        <span className="text-[9px] font-normal opacity-70">{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all border border-gray-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  إعادة الضبط الافتراضي
                </button>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Quick Actions */}
                <div>
                  <span className="text-xs font-bold text-gray-500 mb-2 block">إجراءات سريعة</span>
                  <div className="grid grid-cols-2 gap-2">
                    {tools.map((tool) => (
                      <button
                        key={tool.label}
                        onClick={() => {
                          tool.onClick();
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all"
                      >
                        <tool.icon className="w-4 h-4" style={{ color: tool.color }} />
                        {tool.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


