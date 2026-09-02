// Offline & PWA Manager - إدارة وضع التصفح دون إنترنت والمحتوى المخزن مسبقاً وتتبع التثبيت
import { useState, useEffect, useCallback, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  WifiOff,
  Wifi,
  HardDrive,
  Clock,
  ArrowLeft,
  X,
  RotateCcw,
  CheckCircle2,
  Download,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Compass,
} from "lucide-react";

export interface VisitedPageMeta {
  path: string;
  title: string;
  category: string;
  timestamp: number;
}

// Map of predefined known paths and Arabic metadata
export const ROUTE_METADATA: Record<string, { title: string; category: string }> = {
  "/": { title: "الصفحة الرئيسية", category: "الرئيسية" },
  "/about": { title: "عن رحماء بينهم ورؤيتنا", category: "عن رحماء بينهم" },
  "/programs": { title: "البرامج التنموية والإغاثية", category: "البرامج" },
  "/projects": { title: "المشاريع الميدانية", category: "المشاريع" },
  "/success": { title: "قصص النجاح والأثر الميداني", category: "الأثر" },
  "/news": { title: "المركز الإعلامي والأخبار", category: "الإعلام" },
  "/media": { title: "معرض الصور والتقارير المرئية", category: "الإعلام" },
  "/reports": { title: "التقارير السنوية والشفافية", category: "التقارير" },
  "/transparency": { title: "الحوكمة ومعايير النزاهة", category: "الشفافية" },
  "/volunteer": { title: "بوابة التطوع والميدان", category: "المشاركة" },
  "/zakat": { title: "حاسبة الزكاة الشرعية", category: "الخدمات" },
  "/endowment": { title: "الوقف الخيري التنموي", category: "الأوقاف" },
  "/donate": { title: "بوابة العطاء والتبرع السريع", category: "التبرع" },
  "/contact": { title: "تواصل معنا وقنوات الدعم", category: "الاتصال" },
  "/partners": { title: "الشركاء والتحالفات الإستراتيجية", category: "الشركاء" },
  "/donor": { title: "بوابة المانحين والتقارير المباشرة", category: "المانحين" },
  "/privacy-policy": { title: "سياسة الخصوصية وحماية البيانات", category: "القانونية" },
};

const VISITED_PAGES_STORAGE_KEY = "rbdcye_offline_visited_pages";
const INSTALL_STATS_STORAGE_KEY = "rbdcye_pwa_install_stats";

export const OfflineManager = memo(function OfflineManager() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [isOfflineDrawerOpen, setIsOfflineDrawerOpen] = useState(false);
  const [visitedPages, setVisitedPages] = useState<VisitedPageMeta[]>([]);
  const [installAttempts, setInstallAttempts] = useState<number>(0);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [hasOfflineNavError, setHasOfflineNavError] = useState<boolean>(false);

  // 1. Initialize & Track Network Status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasOfflineNavError(false);
      setShowOnlineToast(true);
      const timer = setTimeout(() => setShowOnlineToast(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Standalone / PWA detection
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes("android-app://");
    setIsStandalone(standalone);

    // Read install attempts
    try {
      const stats = localStorage.getItem(INSTALL_STATS_STORAGE_KEY);
      if (stats) {
        const parsed = JSON.parse(stats);
        setInstallAttempts(parsed.attempts || 0);
      }
    } catch {
      // ignore
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 2. Track visited pages for Offline-First access
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VISITED_PAGES_STORAGE_KEY);
      let list: VisitedPageMeta[] = stored ? JSON.parse(stored) : [];

      const currentPath = location.pathname;
      const meta = ROUTE_METADATA[currentPath] || {
        title: document.title || "صفحة تفاعلية",
        category: "تصفح سابق",
      };

      // Filter out duplicate of same path
      list = list.filter((p) => p.path !== currentPath);

      // Add to beginning
      list.unshift({
        path: currentPath,
        title: meta.title,
        category: meta.category,
        timestamp: Date.now(),
      });

      // Keep up to 25 recent pages
      if (list.length > 25) {
        list = list.slice(0, 25);
      }

      localStorage.setItem(VISITED_PAGES_STORAGE_KEY, JSON.stringify(list));
      setVisitedPages(list);
    } catch {
      // Local storage might be restricted in some sandboxes
    }
  }, [location.pathname]);

  // Load visited pages on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VISITED_PAGES_STORAGE_KEY);
      if (stored) {
        setVisitedPages(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Clear visited pages cache
  const handleClearCache = useCallback(() => {
    try {
      localStorage.removeItem(VISITED_PAGES_STORAGE_KEY);
      setVisitedPages([]);
    } catch {
      // ignore
    }
  }, []);

  // Navigate to cached page
  const handleNavigateToCachedPage = useCallback(
    (path: string) => {
      setIsOfflineDrawerOpen(false);
      navigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate]
  );

  return (
    <>
      {/* 1. Offline Floating Indicator Bar */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-0 left-0 right-0 z-[60] bg-amber-600/95 backdrop-blur-md text-white text-xs sm:text-sm font-cairo shadow-lg border-b border-amber-400/30"
            dir="rtl"
          >
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <WifiOff className="w-3.5 h-3.5 text-white animate-pulse" />
                </div>
                <div>
                  <span className="font-bold">أنت تتصفح حالياً بدون اتصال (Offline-First)</span>
                  <span className="hidden sm:inline text-white/90 mr-2">
                    — يتوفر {visitedPages.length} صفحة محفوظة للتصفح الفوري.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mr-auto">
                <button
                  onClick={() => setIsOfflineDrawerOpen(true)}
                  className="px-3 py-1 bg-white text-amber-900 font-bold rounded-lg hover:bg-amber-50 transition-colors shadow-2xs text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  المحتوى المحفوظ ({visitedPages.length})
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-2.5 py-1 bg-amber-700/60 hover:bg-amber-700 text-white rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="إعادة فحص الاتصال"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden xs:inline">إعادة المحاولة</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Restored Connection Toast */}
      <AnimatePresence>
        {showOnlineToast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-emerald-700 text-white px-5 py-2.5 rounded-2xl shadow-xl border border-emerald-500/40 text-xs sm:text-sm font-cairo flex items-center gap-2.5"
            dir="rtl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>تمت استعادة الاتصال بالإنترنت بنجاح</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Offline-First Visited Content Drawer / Modal */}
      <AnimatePresence>
        {isOfflineDrawerOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOfflineDrawerOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden font-cairo z-10 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-l from-slate-900 via-[var(--brand-green-dark)] to-[var(--brand-green-dark)] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 flex items-center justify-center text-[var(--brand-gold)]">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                      مستودع التصفح دون إنترنت
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[0.7rem] border border-emerald-400/30">
                        Offline Cache
                      </span>
                    </h3>
                    <p className="text-xs text-white/80">
                      الصفحات والمحتويات التي زرتها مسبقاً جاهزة للعرض الفوري
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOfflineDrawerOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Alert Banner */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />
                  <span>
                    الذاكرة المؤقتة: <strong>{visitedPages.length} صفحة مخزنة</strong>
                  </span>
                </div>
                {visitedPages.length > 0 && (
                  <button
                    onClick={handleClearCache}
                    className="text-xs text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    تفريغ المحفوظات
                  </button>
                )}
              </div>

              {/* Body: List of Cached / Visited Pages */}
              <div className="p-5 overflow-y-auto flex-1 divide-y divide-slate-100">
                {visitedPages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-semibold text-sm">لا توجد صفحات مخزنة بعد</p>
                    <p className="text-xs text-slate-400 mt-1">
                      عند تصفحك لأي قسم من أقسام الموقع، سيتم حفظه تلقائياً لتتمكن من الرجوع إليه
                      دون إنترنت.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {visitedPages.map((page) => {
                      const isCurrent = location.pathname === page.path;
                      const timeAgo = new Date(page.timestamp).toLocaleTimeString("ar-YE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <button
                          type="button"
                          key={page.path}
                          onClick={() => handleNavigateToCachedPage(page.path)}
                          className={`w-full text-right p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                            isCurrent
                              ? "bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs"
                              : "bg-white hover:bg-slate-50 border-slate-200/80 hover:border-[#0F4C3A]/30 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isCurrent
                                  ? "bg-[#0F4C3A] text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <HardDrive className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 text-right">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm truncate">{page.title}</h4>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-800 text-[0.65rem] font-bold shrink-0">
                                    أنت هنا الآن
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                <span>{page.category}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  آخر زيارة: {timeAgo}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[#0F4C3A] text-xs font-semibold shrink-0">
                            <span>فتح</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تحديث البيانات الميدانية يتم فور استقرار الشبكة</span>
                </div>
                <button
                  onClick={() => setIsOfflineDrawerOpen(false)}
                  className="px-4 py-2 bg-[#0F4C3A] hover:bg-[#09422C] text-white font-bold rounded-xl transition-colors"
                >
                  تم، متابعة التصفح
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});

export default OfflineManager;
