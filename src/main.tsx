/* eslint-disable no-inner-declarations */
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { I18nProvider } from "@/shared/i18n";
import { initializeCoreServices } from "@/features/core";
import { ErrorBoundary, setupGlobalErrorHandler } from "@/components/ErrorBoundary";
import { initPerformancePrefetch, preloadCriticalAssets } from "@/utils/performance";
import { cleanupUpdateCheck, registerServiceWorker } from "@/utils/pwa";
import { setSecurityHeaders, cleanDangerousElements } from "@/utils/security-headers";
import { ensureRootElement, installChunkErrorRecovery, enforceAppVersion } from "@/utils/resilience";

import { ToastProvider } from "./app/components/Toast";
import "./styles/index.css";

// ============================================================
// CRITICAL: All initialization is NON-BLOCKING
// تهيئة غير متزامنة لضمان تحميل فوري للصفحة
// ============================================================

// ============================================================
// SELF-HEALING BOOT — runs before anything else can fail
// - Recovers from stale-chunk load errors (auto hard-reload, loop-guarded)
// - Enforces newly deployed versions (version.json check + SW takeover)
// ============================================================
if (typeof window !== "undefined") {
  installChunkErrorRecovery();
  ensureRootElement("root");
  enforceAppVersion();
}

// Initialize in background after DOM is ready
if (typeof window !== "undefined") {
  const scheduleInit = (cb: () => void) => {
    if ("requestIdleCallback" in window) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- precise: requestIdleCallback accepts options with timeout
      (window as { requestIdleCallback: (cb: () => void, opts?: { timeout?: number }) => void }).requestIdleCallback(() => cb(), { timeout: 2000 });
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
            {/* Shell-level boundary: a provider/boot crash can never blank the
                page — users get an accessible recovery UI with reload. */}
            <ErrorBoundary boundaryName="app-shell" allowReload>
              {/* fallback=null: the boot splash (#app-loader) already covers
                  the lazy-shell gap and hides on rbdcye:app-ready */}
              <Suspense fallback={null}>
                <App />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </ToastProvider>
      </I18nProvider>
    </StrictMode>
  );
}

const rootEl = ensureRootElement("root");
if (rootEl) {
  createRoot(rootEl).render(<AppRoot />);
}