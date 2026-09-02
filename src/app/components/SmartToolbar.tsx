// SmartToolbar - Professional Floating Toolbar with Advanced AI-Powered UX for Visitors
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Calculator,
  Map,
  ChevronUp,
  X,
  Zap,
  HandHelping,
  Move,
  BarChart3,
  Moon,
  Sun,
  Gift,
  Globe,
  Sparkles,
  Mail,
  Award,
  HelpCircle,
  RefreshCcw,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";

import { useSmartToolbar } from "@/app/hooks/useSmartToolbar";
import { logger } from "@/features/core/observability/metrics";

interface SmartToolbarProps {
  setCurrentPage?: (page: string) => void;
}

interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  onClick: () => void;
  color?: string;
  shortcut?: string;
  badge?: string | number;
  category?: "main" | "page" | "utility";
}

export const SmartToolbar = memo(function SmartToolbar({
  setCurrentPage = () => {},
}: SmartToolbarProps) {
  const {
    preferences,
    updatePosition,
    toggleVisibility,
    toggleExpanded,
    trackActionUsage,
    shouldShowBehaviorTip,
  } = useSmartToolbar();

  const [scrolled, setScrolled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"main" | "page" | "utility">("main");
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("dark-mode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("dark-mode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    logger.info("Dark mode toggled", { enabled: newMode });
  }, [darkMode]);

  // Scroll handler with throttling
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 100);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  // Actions are computed inline and memoized properly
  const actions = useMemo((): ToolbarAction[] => {
    const hour = new Date().getHours();

    // Main actions (donation & impact) - most important for visitors
    const mainActions: ToolbarAction[] = [
      {
        id: "quick-donate",
        label: "تبرع سريع",
        icon: Heart,
        onClick: () => {
          trackActionUsage("quick-donate");
          const el = document.getElementById("quick-donation");
          el?.scrollIntoView({ behavior: "smooth" });
        },
        color: "var(--brand-green)",
        shortcut: "Ctrl+D",
        badge: "سريع",
        category: "main",
      },
      {
        id: "zakat",
        label: "حاسبة الزكاة",
        icon: Calculator,
        onClick: () => {
          trackActionUsage("zakat");
          setCurrentPage("zakat");
        },
        color: "var(--brand-gold)",
        shortcut: "Ctrl+Z",
        category: "main",
      },
      {
        id: "geosope",
        label: "خريطة الأثر",
        icon: Map,
        onClick: () => {
          trackActionUsage("geosope");
          const el = document.getElementById("geosope-map");
          el?.scrollIntoView({ behavior: "smooth" });
        },
        color: "#3B82F6",
        shortcut: "Ctrl+M",
        category: "main",
      },
      {
        id: "impact",
        label: "أثر التبرع",
        icon: Zap,
        onClick: () => {
          trackActionUsage("impact");
          const el = document.getElementById("impact-stats");
          el?.scrollIntoView({ behavior: "smooth" });
        },
        color: "#8B5CF6",
        shortcut: "Ctrl+I",
        category: "main",
      },
    ];

    // Page navigation actions
    const pageActions: ToolbarAction[] = [
      {
        id: "contact",
        label: "اتصل بنا",
        icon: Mail,
        onClick: () => {
          trackActionUsage("contact");
          const el = document.getElementById("contact");
          el?.scrollIntoView({ behavior: "smooth" });
        },
        color: "#0EA5E9",
        shortcut: "Ctrl+C",
        category: "page",
      },
      {
        id: "projects",
        label: "المشاريع",
        icon: Award,
        onClick: () => {
          trackActionUsage("projects");
          setCurrentPage("projects");
        },
        color: "#14B8A6",
        shortcut: "Ctrl+P",
        category: "page",
      },
      {
        id: "media",
        label: "الوسائط",
        icon: Globe,
        onClick: () => {
          trackActionUsage("media");
          setCurrentPage("media");
        },
        color: "#EF4444",
        shortcut: "Ctrl+L",
        category: "page",
      },
      {
        id: "programs",
        label: "برامجنا",
        icon: Gift,
        onClick: () => {
          trackActionUsage("programs");
          setCurrentPage("programs");
        },
        color: "#8B5CF6",
        shortcut: "Ctrl+B",
        category: "page",
      },
      {
        id: "volunteer",
        label: "تطوع الآن",
        icon: HandHelping,
        onClick: () => {
          trackActionUsage("volunteer");
          setCurrentPage("volunteer");
        },
        color: "#F59E0B",
        shortcut: "Ctrl+V",
        category: "page",
      },
      {
        id: "reports",
        label: "التقارير",
        icon: BarChart3,
        onClick: () => {
          trackActionUsage("reports");
          setCurrentPage("reports");
        },
        color: "#6366F1",
        shortcut: "Ctrl+R",
        category: "page",
      },
    ];

    // Utility actions
    const utilityActions: ToolbarAction[] = [
      {
        id: "theme",
        label: darkMode ? "الوضع النهاري" : "الوضع الليلي",
        icon: darkMode ? Sun : Moon,
        onClick: toggleDarkMode,
        color: "#64748B",
        shortcut: "Ctrl+E",
        category: "utility",
      },
      {
        id: "refresh",
        label: "إعادة تحميل",
        icon: RefreshCcw,
        onClick: () => {
          window.location.reload();
        },
        color: "#64748B",
        shortcut: "F5",
        category: "utility",
      },
    ];

    // Add smart action based on time
    if (hour >= 5 && hour <= 10) {
      mainActions.unshift({
        id: "morning-donation",
        label: "صباحك سعيد",
        icon: Sparkles,
        onClick: () => {
          const el = document.getElementById("quick-donation");
          el?.scrollIntoView({ behavior: "smooth" });
        },
        color: "#EC4899",
        shortcut: "Ctrl+H",
        category: "main",
      });
    }

    return [...mainActions, ...pageActions, ...utilityActions];
  }, [setCurrentPage, trackActionUsage, darkMode, toggleDarkMode]);

  // Filter actions by active category
  const filteredActions = useMemo(
    () => actions.filter((a) => a.category === activeCategory),
    [actions, activeCategory]
  );

  // Category tabs
  const categories: { id: "main" | "page" | "utility"; label: string; icon: any }[] = [
    { id: "main", label: "رئيسية", icon: Heart },
    { id: "page", label: "الصفحات", icon: Globe },
    { id: "utility", label: "أدوات", icon: HelpCircle },
  ];

  // Smart behavior tracking with keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        actions.find((a) => a.id === "quick-donate")?.onClick();
      }
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        actions.find((a) => a.id === "zakat")?.onClick();
      }
      if (e.ctrlKey && e.key === "m") {
        e.preventDefault();
        actions.find((a) => a.id === "geosope")?.onClick();
      }
      if (e.ctrlKey && e.key === "i") {
        e.preventDefault();
        actions.find((a) => a.id === "impact")?.onClick();
      }
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        actions.find((a) => a.id === "contact")?.onClick();
      }
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        actions.find((a) => a.id === "projects")?.onClick();
      }
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        actions.find((a) => a.id === "media")?.onClick();
      }
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        actions.find((a) => a.id === "programs")?.onClick();
      }
      if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        actions.find((a) => a.id === "volunteer")?.onClick();
      }
      if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        actions.find((a) => a.id === "reports")?.onClick();
      }
      if (e.ctrlKey && e.key === "e") {
        e.preventDefault();
        toggleDarkMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions, toggleDarkMode]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!toolbarRef.current) return;

    const rect = toolbarRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.right,
      y: e.clientY - rect.bottom,
    });
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStart) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      updatePosition(newX, newY);
    },
    [isDragging, dragStart, updatePosition]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);

      return () => {
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Auto-collapse when scrolling down
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleDirection = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
        if (preferences.expanded) {
          toggleExpanded(false);
        }
      }
      lastScrollY.current = currentScrollY;
    };

    const tick = () => handleDirection();
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(tick);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [preferences.expanded, toggleExpanded]);

  if (!preferences.visible) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={() => toggleVisibility(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[var(--brand-green)] text-white rounded-full shadow-lg hover:shadow-xl transition-all touch-target"
        aria-label="إظهار شريط الأدوات"
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          x: preferences.position.x,
          y: preferences.position.y,
        }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          scrolled ? "translate-y-0 opacity-100" : "translate-y-4 opacity-90"
        }`}
        style={{
          x: preferences.position.x,
          y: preferences.position.y,
          touchAction: isDragging ? "none" : "auto",
        }}
      >
        <div className="flex flex-col items-end gap-3">
          {/* Behavior Tip - Show smart suggestions based on usage */}
          <AnimatePresence>
            {shouldShowBehaviorTip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="bg-white dark:bg-[var(--card)] rounded-xl shadow-lg p-3 border border-[var(--border)] max-w-64"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--brand-gold)] flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium mb-1">نصيحة ذكية</p>
                    <p className="text-[var(--muted-foreground)]">
                      استخدم اختصارات لوحة المفاتيح للوصول السريع! Ctrl+D للتبرع
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded Actions with Category Tabs */}
          <AnimatePresence>
            {preferences.expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-2 mb-2 overflow-hidden"
              >
                {/* Category Tabs */}
                <div className="flex gap-1 justify-end bg-white dark:bg-[var(--card)] rounded-lg p-1 shadow-md border border-[var(--border)]">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`p-2 rounded-md transition-all ${
                        activeCategory === cat.id
                          ? "bg-[var(--brand-green)] text-white"
                          : "text-gray-600 hover:bg-[var(--muted)]"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={cat.label}
                    >
                      <cat.icon className="w-4 h-4" />
                    </motion.button>
                  ))}
                </div>

                {/* Actions Grid for better visibility with many items */}
                <div className="bg-white dark:bg-[var(--card)] rounded-xl shadow-md border border-[var(--border)] p-2 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredActions.map((action, index) => (
                      <motion.button
                        key={action.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={action.onClick}
                        className="flex flex-col items-center gap-2 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--brand-green)] hover:shadow-md transition-all group touch-target relative"
                        style={{
                          borderColor: action.category === "main" ? action.color : undefined,
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <action.icon className="w-5 h-5" style={{ color: action.color }} />
                        <span className="text-[0.7rem] font-medium text-center leading-tight">
                          {action.label}
                        </span>
                        {action.badge && (
                          <span className="absolute -top-1 -right-1 bg-[var(--brand-gold)] text-white text-[0.6rem] rounded-full px-1 py-0.5">
                            {action.badge}
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Toggle Button */}
          <div className="flex items-center gap-2">
            {/* Help/Shortcuts Button */}
            <motion.button
              onClick={() =>
                alert(
                  `اختصارات لوحة المفاتيح:\nCtrl+D - تبرع سريع\nCtrl+Z - حاسبة الزكاة\nCtrl+M - خريطة الأثر\nCtrl+I - أثر التبرع\nCtrl+C - اتصل بنا\nCtrl+P - المشاريع\nCtrl+L - الوسائط\nCtrl+B - برامجنا\nCtrl+V - تطوع الآن\nCtrl+R - التقارير\nCtrl+E - تبديل السمة`
                )
              }
              className="p-2 rounded-lg bg-white dark:bg-[var(--card)] shadow-md border border-[var(--border)] hover:shadow-lg transition-all touch-target opacity-70 hover:opacity-100"
              aria-label="الاختصارات"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HelpCircle className="w-4 h-4 text-gray-600 dark:text-[var(--muted-foreground)]" />
            </motion.button>

            {/* Drag Handle */}
            <motion.button
              onMouseDown={handleDragStart}
              className="p-2 rounded-lg bg-white dark:bg-[var(--card)] shadow-md border border-[var(--border)] hover:shadow-lg transition-all cursor-move touch-target opacity-70 hover:opacity-100"
              aria-label="سحب شريط الأدوات"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Move className="w-4 h-4 text-gray-600 dark:text-[var(--muted-foreground)]" />
            </motion.button>

            {/* Close Button */}
            <motion.button
              onClick={() => toggleVisibility(false)}
              className="p-2 rounded-lg bg-white dark:bg-[var(--card)] shadow-md border border-[var(--border)] hover:shadow-lg transition-all touch-target"
              aria-label="إخفاء الشريط"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4 text-gray-600 dark:text-[var(--muted-foreground)]" />
            </motion.button>

            {/* Main Toggle */}
            <motion.button
              onClick={() => toggleExpanded(!preferences.expanded)}
              className={`p-4 rounded-2xl shadow-lg transition-all flex items-center justify-center touch-target ${
                preferences.expanded
                  ? "bg-[var(--brand-green)] text-white rotate-45"
                  : "bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-gold)] text-white"
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <HandHelping className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
