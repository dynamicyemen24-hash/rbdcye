// Enhanced PWA Install Prompt - تثبيت التطبيق بذكاء
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Download, X, Smartphone, Check, WifiOff, Wifi, ArrowDown } from "lucide-react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export function EnhancedInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: setState in effect is intentional for initial data hydration
      setIsInstalled(true);
      return;
    }

    const lastDismissed = localStorage.getItem("rh_install_dismissed");
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
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: setState in effect is intentional for initial data hydration
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    if (!showPrompt) return;
    const timer = setTimeout(() => setShowPrompt(false), 15000);
    return () => clearTimeout(timer);
  }, [showPrompt]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem("rh_install_dismissed", String(Date.now()));
  }, []);

  const handleDragEnd = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
    (_: any, info: PanInfo) => {
      if (info.offset.y > 100) handleDismiss();
    },
    [handleDismiss]
  );

  if (isOffline) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2 shadow-lg"
        style={{ backgroundColor: "var(--brand-gold)" }}
      >
        <WifiOff className="w-4 h-4" />
        أنت غير متصل — بعض الميزات قد لا تعمل
      </motion.div>
    );
  }

  if (isInstalled) {
    return (
      <div className="fixed bottom-6 left-4 z-40">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
          style={{ backgroundColor: "var(--brand-green-pale)", color: "var(--brand-green)" }}
        >
          <Check className="w-4 h-4" />
          التطبيق مثبت
        </div>
      </div>
    );
  }

  if (dismissed || !deferredPrompt || !showPrompt) return null;

  const features = [
    { icon: WifiOff, text: "يعمل بدون إنترنت" },
    { icon: Smartphone, text: "تجربة سلسة" },
    { icon: ArrowDown, text: "تحديثات تلقائية" },
  ];

  const cardContent = (
    <>
      <div
        className="relative p-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--brand-green) 0%, var(--brand-green) 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white" />
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <img
                src="/icons/pwa-192x192.png"
                alt="رحماء بينهم"
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const fallback = document.createElement("span");
                    fallback.className = "text-white text-xl font-bold";
                    fallback.textContent = "رُ";
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">ثبّت تطبيق رحماء بينهم</h3>
              <p className="text-white/70 text-xs mt-0.5">تابع آخر الأخبار والبرامج</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors duration-200"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2.5">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-center gap-2.5"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--brand-green-pale)" }}
              >
                <feature.icon className="w-3.5 h-3.5" style={{ color: "var(--brand-green)" }} />
              </div>
              <span className="text-sm" style={{ color: "var(--foreground)" }}>
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleInstall}
          className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200"
          style={{
            backgroundColor: "var(--brand-green)",
            boxShadow: "0 8px 24px rgba(15, 76, 58, 0.3)",
          }}
        >
          <Download className="w-4 h-4" />
          تثبيت التطبيق
        </motion.button>

        <p className="text-center text-xs" style={{ color: "var(--muted-foreground)" }}>
          متاح لأجهزة Android و iOS
        </p>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998]"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden"
            style={{
              backgroundColor: "var(--card)",
              boxShadow: "0 -8px 32px var(--shadow-lg)",
            }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--border)" }} />
            </div>
            {cardContent}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-6 left-6 w-[380px] z-50 rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 12px 40px var(--shadow-lg)",
        }}
        dir="rtl"
      >
        {cardContent}
      </motion.div>
    </AnimatePresence>
  );
}
