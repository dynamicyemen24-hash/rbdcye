import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Keyboard, X, Search, Zap, Compass, Eye, ArrowRight, Sparkles } from "lucide-react";
import { ShortcutDefinition } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutDefinition[];
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  shortcuts,
}: KeyboardShortcutsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "navigation" | "actions" | "accessibility"
  >("all");
  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter shortcuts
  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter((shortcut) => {
      const matchesCategory = selectedCategory === "all" || shortcut.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesText =
        shortcut.title.toLowerCase().includes(query) ||
        shortcut.description.toLowerCase().includes(query) ||
        shortcut.keyCombo.toLowerCase().includes(query) ||
        (shortcut.altKeyCombo && shortcut.altKeyCombo.toLowerCase().includes(query));

      return matchesCategory && matchesText;
    });
  }, [shortcuts, searchQuery, selectedCategory]);

  const categories = [
    { id: "all", label: "جميع الاختصارات", icon: Sparkles, count: shortcuts.length },
    {
      id: "navigation",
      label: "التنقل بين الصفحات",
      icon: Compass,
      count: shortcuts.filter((s) => s.category === "navigation").length,
    },
    {
      id: "actions",
      label: "الإجراءات والأدوات",
      icon: Zap,
      count: shortcuts.filter((s) => s.category === "actions").length,
    },
    {
      id: "accessibility",
      label: "الوصول ومؤشرات التركيز",
      icon: Eye,
      count: shortcuts.filter((s) => s.category === "accessibility").length,
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200/80 dark:border-zinc-800 flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 md:p-8 pb-5 border-b border-gray-100 dark:border-zinc-800 bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/30 dark:from-zinc-900 dark:to-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--brand-green)]/10 dark:bg-[var(--brand-green)]/20 border border-[var(--brand-green)]/20 flex items-center justify-center text-[var(--brand-green)]">
                  <Keyboard className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="keyboard-shortcuts-title"
                    className="text-xl md:text-2xl font-bold font-alexandria text-gray-900 dark:text-white"
                  >
                    اختصارات لوحة المفاتيح
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-cairo mt-0.5">
                    تنقل فوري بدون أي تأخير مع مؤشرات تركيز متباينة
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="إغلاق دليل الاختصارات (Esc)"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mt-2">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اختصار أو اسم صفحة..."
                className="w-full pl-10 pr-11 py-3 bg-white dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-cairo text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] focus:border-transparent transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Categories Filters */}
            <div
              className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none"
              role="tablist"
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)] ${
                      isSelected
                        ? "bg-[var(--brand-green)] text-white shadow-sm"
                        : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{cat.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shortcuts Grid List */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-3 max-h-[50vh]">
            {filteredShortcuts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-cairo">لم يتم العثور على اختصارات تطابق بحثك</p>
              </div>
            ) : (
              filteredShortcuts.map((shortcut) => (
                <button
                  type="button"
                  key={shortcut.id}
                  onClick={() => {
                    shortcut.action();
                    onClose();
                  }}
                  className="w-full text-right group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/60 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/80 border border-gray-100 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-zinc-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-green)] opacity-60 group-hover:scale-125 group-hover:opacity-100 transition-all" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white font-cairo group-hover:text-[var(--brand-green)] transition-colors">
                          {shortcut.title}
                        </span>
                        {shortcut.category === "navigation" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold font-cairo">
                            صفحة
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-cairo truncate mt-0.5">
                        {shortcut.description}
                      </p>
                    </div>
                  </div>

                  {/* Keys Badges */}
                  <div className="flex items-center gap-2 flex-shrink-0 mr-3">
                    <kbd className="inline-flex items-center justify-center min-w-[64px] px-3 py-1.5 text-xs font-mono font-bold bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded-xl border-2 border-gray-200 dark:border-zinc-700 shadow-sm group-hover:border-[var(--brand-green)]/40 transition-colors">
                      {shortcut.keyCombo}
                    </kbd>

                    {shortcut.altKeyCombo && (
                      <>
                        <span className="text-xs text-gray-400 font-cairo">أو</span>
                        <kbd className="inline-flex items-center justify-center min-w-[32px] px-2.5 py-1.5 text-xs font-mono font-bold bg-amber-50 dark:bg-zinc-900 text-amber-900 dark:text-amber-300 rounded-xl border-2 border-amber-200/80 dark:border-amber-900/60 shadow-sm">
                          {shortcut.altKeyCombo}
                        </kbd>
                      </>
                    )}

                    <ArrowRight
                      className="w-4 h-4 text-gray-300 group-hover:text-[var(--brand-green)] group-hover:-translate-x-1 transition-all mr-1"
                      aria-hidden="true"
                    />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer Tips & Focus Guidance */}
          <div className="p-4 sm:p-5 bg-gray-50 dark:bg-zinc-900/90 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400 font-cairo">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">
                💡
              </span>
              <span>
                اضغط على أرقام{" "}
                <strong className="text-gray-900 dark:text-white font-mono">1-9</strong> في أي وقت
                للتنقل المباشر، أو مفتاح{" "}
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-gray-200 rounded font-mono">
                  Tab
                </kbd>{" "}
                للتنقل بالتركيز المرئي.
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-gray-400">للإغلاق اضغط:</span>
              <kbd className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg font-mono text-[11px] shadow-2xs text-gray-800 dark:text-gray-200 font-bold">
                Esc
              </kbd>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
