// Enhanced PWA Install Prompt - تثبيت التطبيق بذكاء
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone, Check, Wifi, WifiOff, Bell, BellOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function EnhancedInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
    const lastDismissed = localStorage.getItem('rh_install_dismissed');
    if (lastDismissed) {
      const daysSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setDismissed(true);
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 30 seconds of browsing
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('rh_install_dismissed', String(Date.now()));
  };

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      if (permission === 'granted') {
        new Notification('رحماء بينهم', {
          body: 'ستتلقى إشعارات بالأخبار والتحديثات',
          icon: '/icons/icon-192.png',
        });
      }
    }
  };

  // Offline indicator
  if (isOffline) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg"
      >
        <WifiOff className="w-4 h-4" />
        أنت غير متصل — بعض الميزات قد لا تعمل
      </motion.div>
    );
  }

  // Already installed
  if (isInstalled) {
    return (
      <div className="fixed bottom-6 left-4 z-40">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-green-pale)] text-[var(--brand-green)] text-xs font-bold">
          <Check className="w-4 h-4" />
          التطبيق مثبت
        </div>
      </div>
    );
  }

  if (dismissed || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          dir="rtl"
        >
          {/* Header gradient */}
          <div className="bg-gradient-to-l from-[var(--brand-green)] to-emerald-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">حمّل تطبيق رحماء بينهم</h3>
                  <p className="text-white/70 text-xs">تابع آخر الأخبار والبرامج</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Features */}
            <div className="space-y-2">
              {[
                { icon: Bell, label: 'إشعارات فورية بالأخبار والبرامج' },
                { icon: Wifi, label: 'عمل بدون إنترنت' },
                { icon: Smartphone, label: 'تجربة أصلية как تطبيق' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <feature.icon className="w-4 h-4 text-[var(--brand-green)]" />
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Install button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleInstall}
              className="w-full py-3 rounded-xl bg-[var(--brand-green)] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--brand-green)]/25"
            >
              <Download className="w-4 h-4" />
              تثبيت التطبيق
            </motion.button>

            {/* Notifications toggle */}
            {!notificationsEnabled && (
              <button
                onClick={handleEnableNotifications}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                تفعيل الإشعارات
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
