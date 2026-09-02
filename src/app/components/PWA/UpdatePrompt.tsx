// UpdatePrompt - مكون إشعار التحديثات للـ PWA
import { RefreshCw, X } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '../ui/button';

export default function UpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          setUpdateAvailable(true);
        });
      });
    }

    // Listen for custom update events
    const handleUpdate = () => {
      setUpdateAvailable(true);
      setDismissed(false);
    };

    window.addEventListener('pwa-update-available', handleUpdate);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdate);
    };
  }, []);

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      <div className="mx-auto max-w-4xl p-4">
        <div className="bg-white dark:bg-[var(--card)] rounded-xl shadow-lg border border-[var(--border)] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--brand-green-pale)] rounded-full">
              <RefreshCw className="w-5 h-5 text-[var(--brand-green)] animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-sm">تحديث جديد متاح! 🎉</h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                تم تحسين التطبيق بميزات جديدة. ننصح بتحديث الصفحة للحصول على أفضل تجربة.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => window.location.reload()}
              size="sm"
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-green-light)]"
            >
              تحديث الآن
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setDismissed(true)}
              className="px-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

