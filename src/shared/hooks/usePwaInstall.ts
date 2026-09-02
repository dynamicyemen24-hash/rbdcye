// PWA Install Hook - خطاف تثبيت التطبيق
// يلتقط حدث beforeinstallprompt مبكراً على مستوى الوحدة
// حتى لو صدر قبل تحميل المكوّن (مشكلة شائعة في PWA)
import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// ── التقاط عالمي مبكر ──────────────────────────────────────
let capturedPrompt: BeforeInstallPromptEvent | null = null;
type Waiter = (e: BeforeInstallPromptEvent | null) => void;
const waiters = new Set<Waiter>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    capturedPrompt = e as BeforeInstallPromptEvent;
    waiters.forEach((w) => w(capturedPrompt));
  });
  window.addEventListener("appinstalled", () => {
    capturedPrompt = null;
    waiters.forEach((w) => w(null));
  });
}

export type InstallOutcome = "accepted" | "dismissed" | "unavailable";

export function usePwaInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(capturedPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    setIsStandalone(standalone);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    const waiter: Waiter = (e) => setDeferred(e);
    waiters.add(waiter);
    const onInstalled = () => setIsInstalled(true);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      waiters.delete(waiter);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallOutcome> => {
    if (!deferred) return "unavailable";
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferred(null);
    return outcome;
  }, [deferred]);

  return {
    canInstall: !!deferred,
    promptInstall,
    isInstalled,
    isStandalone,
    isIOS,
  };
}


