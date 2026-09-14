/* eslint-disable no-inner-declarations */
import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { I18nProvider } from "@/shared/i18n";
import { initializeCoreServices } from "@/features/core";
import { setupGlobalErrorHandler } from "@/components/ErrorBoundary";
import { initPerformancePrefetch, preloadCriticalAssets } from "@/utils/performance";
import { cleanupUpdateCheck, registerServiceWorker } from "@/utils/pwa";
import { setSecurityHeaders, cleanDangerousElements } from "@/utils/security-headers";

import { ToastProvider } from "./app/components/Toast";
import "./styles/index.css";

// ============================================================
// CRITICAL: All initialization is NON-BLOCKING
// تهيئة غير متزامنة لضمان تحميل فوري للصفحة
// ============================================================

// Initialize in background after DOM is ready
if (typeof window !== "undefined") {
  const scheduleInit = (cb: () => void) => {
    if ("requestIdleCallback" in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    initPerformancePrefetch();
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
    // World-class PWA registration (Workbox + periodicSync + update detection)
    if (import.meta.env.PROD) {
      registerServiceWorker().catch(() => { /* silent — app works offline-less */ });
    }
    window.addEventListener("beforeunload", () => {
      cleanupUpdateCheck();
    });
  });
}

// ============================================================
// Main App - instant render without blocking loader
// HTML already has #main-content structure, React hydrates on top
// ============================================================
const App = lazy(() => import("./app/App"));

// Render immediately - the HTML already has #main-content structure
// React will hydrate on top of the existing DOM
// ============================================================
function AppRoot() {
  return (
    <StrictMode>
      <I18nProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </I18nProvider>
    </StrictMode>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
createRoot(document.getElementById("root")!).render(
  <AppRoot />
);