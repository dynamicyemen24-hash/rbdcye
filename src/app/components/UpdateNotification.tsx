// Update Notification - PWA update notification
import { RefreshCw, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function UpdateNotification() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setShow(true);
              }
            });
          }
        });
        // Also check for existing waiting worker
        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
          setShow(true);
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 p-4" dir="rtl">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 mb-1">تحديث متاح</p>
          <p className="text-xs text-gray-500">توجد نسخة جديدة من الموقع. هل ترغب في التحديث؟</p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <button
        onClick={handleUpdate}
        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-green-light)] transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        تحديث الآن
      </button>
    </div>
  );
}


