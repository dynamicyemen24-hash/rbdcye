// Offline Page Fallback - واجهة بديلة عند تعذر تحميل صفحة جديدة بدون اتصال بالإنترنت
import { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff, RotateCcw, HardDrive, ArrowLeft, Home } from 'lucide-react';
import { VisitedPageMeta } from './OfflineManager';

const VISITED_PAGES_STORAGE_KEY = 'rbdcye_offline_visited_pages';

interface OfflinePageFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
}

export const OfflinePageFallback = memo(function OfflinePageFallback({
  error: _error,
  onRetry,
}: OfflinePageFallbackProps) {
  const navigate = useNavigate();
  const [cachedPages, setCachedPages] = useState<VisitedPageMeta[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(VISITED_PAGES_STORAGE_KEY);
      if (stored) {
        setCachedPages(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center p-4 sm:p-8 bg-slate-50 font-cairo"
      dir="rtl"
    >
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 text-center">
        {/* Icon & Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300/60 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <WifiOff className="w-8 h-8" />
        </div>

        <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-300/40 inline-block mb-3">
          وضع التصفح دون اتصال (Offline Mode)
        </span>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          هذه الصفحة غير متوفرة في الذاكرة المؤقتة
        </h2>

        <p className="text-sm text-slate-600 mb-6 max-w-lg mx-auto leading-relaxed">
          يبدو أنك تتصفح بدون اتصال بالإنترنت ولم تتم زيارة هذه الصفحة مسبقاً. يمكنك تصفح الصفحات المحفوظة لديك مسبقاً أو إعادة المحاولة عند توفر الشبكة.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
          <button
            onClick={handleRetry}
            className="px-5 py-2.5 bg-[#0F4C3A] hover:bg-[#09422C] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            إعادة محاولة الاتصال
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#0F4C3A]" />
            الرئيسية
          </button>
        </div>

        {/* Cached Pages Available */}
        {cachedPages.length > 0 && (
          <div className="text-right border-t border-slate-100 pt-6">
            <h3 className="text-xs sm:text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#0F4C3A]" />
              صفحات محفوظة يمكنك تصفحها فوراً دون إنترنت ({cachedPages.length}):
            </h3>

            <div className="grid sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {cachedPages.slice(0, 8).map((page) => (
                <button
                  key={page.path}
                  onClick={() => {
                    navigate(page.path);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-xl text-right transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="min-w-0 pr-1">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#0F4C3A] truncate">
                      {page.title}
                    </p>
                    <span className="text-[0.7rem] text-slate-400">{page.category}</span>
                  </div>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0F4C3A] group-hover:-translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default OfflinePageFallback;
