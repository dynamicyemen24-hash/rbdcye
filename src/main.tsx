/* eslint-disable no-inner-declarations */
import { StrictMode, lazy, Suspense, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

declare global {
  interface Window {
    __loaderStop?: () => void;
  }
}

import AdvancedProgressBar, { ScrollProgressIndicator } from "@/components/AdvancedProgressBar";
import { HeroSkeleton } from "@/components/LoadingSkeleton";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { initializeCoreServices } from "@/features/core";
import { setSecurityHeaders, cleanDangerousElements } from "@/utils/security-headers";
import { preloadCriticalAssets } from "@/utils/performance";
import { setupGlobalErrorHandler } from "@/components/ErrorBoundary";
import { I18nProvider } from "@/shared/i18n";
import { ToastProvider } from "./app/components/Toast";
import "./styles/index.css";

// ============================================================
// CRITICAL: All initialization is NON-BLOCKING
// ?????? ???? ????? ??? ?????? ?? ???
// ============================================================

// Initialize in background after DOM is ready
if (typeof window !== "undefined") {
  const scheduleInit = (cb: () => void) => {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => cb(), { timeout: 2000 });
    } else {
      setTimeout(cb, 100);
    }
  };

  scheduleInit(() => {
    initializeCoreServices().catch((err) => {
      if (import.meta.env.DEV) console.error("[CoreServices]", err);
    });
    setSecurityHeaders();
    cleanDangerousElements();
    preloadCriticalAssets();
    setupGlobalErrorHandler();
    import("@/services/offline")
      .then(({ offlineManager, syncService }) =>
        offlineManager.init().then(() => {
          syncService.start();
        })
      )
      .catch((err) => {
        if (import.meta.env.DEV) console.error("[OfflineManager]", err);
      });
  });

  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener(
      "load",
      () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
      if (import.meta.env.DEV) console.error("[SW Registration]", err);
    });
      },
      { passive: true, once: true }
    );
  }
}

// Lazy load App for better initial performance
const App = lazy(() => import("./app/App"));

// ============================================================
// Main App - instant render
// ============================================================
function AppWithProgress() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      if (typeof window.__loaderStop === 'function') window.__loaderStop();
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 600);
    }

    setProgress(30);
    const t1 = setTimeout(() => setProgress(60), 200);
    const t2 = setTimeout(() => setProgress(85), 500);
    const t3 = setTimeout(() => {
      setProgress(100);
      setIsLoaded(true);
    }, 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <>
      <AdvancedProgressBar
        percentage={progress}
        message=""
        isComplete={isLoaded}
        isReady={isLoaded}
      />
      <ScrollProgressIndicator />
      <OfflineIndicator />
      <Suspense fallback={<HeroSkeleton />}>
        <App />
      </Suspense>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <AppWithProgress />
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  </StrictMode>
);
