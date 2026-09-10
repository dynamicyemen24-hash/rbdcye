// Update Notification - إشعار التحديث الذكي
import { RefreshCw, X, ArrowUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

export function UpdateNotification() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let dismissed = false;

    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              if (!dismissed) setShow(true);
            }
          });
        }
      });

      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        if (!dismissed) setShow(true);
      }
    });

    return () => {
      dismissed = true;
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => setShow(false), 30000);
    return () => clearTimeout(timer);
  }, [show]);

  const handleUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  }, [waitingWorker]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center"
          dir="rtl"
        >
          <div
            className="flex items-center gap-3 px-5 py-3 m-3 rounded-xl"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 32px var(--shadow-lg)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--brand-green-pale)" }}
            >
              <ArrowUp className="w-4 h-4" style={{ color: "var(--brand-green)" }} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                تحديث جديد متاح
              </p>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                نسخة محسّنة من الموقع جاهزة
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-bold shrink-0 transition-colors duration-200"
              style={{ backgroundColor: "var(--brand-green)" }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              تحديث
            </motion.button>

            <button
              onClick={() => setShow(false)}
              className="p-1.5 rounded-lg shrink-0 transition-colors duration-200"
              style={{ color: "var(--muted-foreground)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--border)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
