// Install Prompt Component - تثبيت التطبيق وتنزيل كـ PWA لسطح المكتب والموبايل
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Monitor, Sparkles, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useCallback, memo } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = memo(function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check localStorage dismissal
    const dismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    setBannerDismissed(dismissed);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!dismissed) setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction for browser
      alert('لتثبيت التطبيق على جهازك، استخدم خيار "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق" من قائمة المتصفح.');
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    setBannerDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  }, []);

  if (isStandalone || isInstalled) return null;

  return (
    <AnimatePresence>
      {showPrompt && !bannerDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50"
          dir="rtl"
        >
          <div className="bg-gradient-to-br from-[#0F3D2E] via-[var(--brand-green)] to-[#0A2A1F] rounded-3xl p-5 shadow-2xl border border-white/20 text-white relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--brand-gold)]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--brand-gold)] to-amber-600 flex items-center justify-center shadow-md shrink-0">
                  {isIOS ? <Smartphone className="w-6 h-6 text-white" /> : <Monitor className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-bold text-base flex items-center gap-1.5">
                    تطبيق رحماء بينهم
                    <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[0.65rem] rounded-full border border-amber-300/30">مجاني</span>
                  </h3>
                  <p className="text-xs text-white/80">تثبيت سريع على الجوال وسطح المكتب</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/85 mb-4 leading-relaxed relative z-10">
              {isIOS
                ? 'اضغط على زر المشاركة 📤 في المتصفح ثم اختر "إضافة إلى الشاشة الرئيسية" لتثبيت التطبيق.'
                : 'احصل على تجربة تصفح سريعة وتثبيت مباشر على جهازك دون الحاجة لمتجر التطبيقات.'}
            </p>

            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={handleInstall}
                className="flex-1 py-2.5 px-4 bg-gradient-to-l from-[var(--brand-gold)] to-amber-500 hover:from-amber-500 hover:to-[var(--brand-gold)] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                تثبيت التطبيق الآن
              </button>
              <button
                onClick={handleDismiss}
                className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white/80 rounded-xl text-xs font-semibold transition-colors"
              >
                لاحقاً
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Hook for detecting PWA state
export function usePWA() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isStandalone, isOnline };
}