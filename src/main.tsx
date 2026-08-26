import { StrictMode, lazy, Suspense, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import AdvancedProgressBar, { ScrollProgressIndicator } from "@/components/AdvancedProgressBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HeroSkeleton } from "@/components/LoadingSkeleton";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { initializeCoreServices } from "@/features/core";

import { ToastProvider } from "./app/components/Toast";
import "./styles/index.css";

// ============================================================
// CRITICAL: All initialization is NON-BLOCKING
// الموقع يظهر فوراً دون انتظار أي شيء
// ============================================================

// Initialize in background after DOM is ready
if (typeof window !== 'undefined') {
  const scheduleInit = (cb: () => void) => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => cb(), { timeout: 2000 });
    } else {
      setTimeout(cb, 100);
    }
  };

  scheduleInit(() => {
    initializeCoreServices().catch(() => {});

    // CSP is set via HTTP headers (vercel.json / server config), not dynamic meta injection.
  });

  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }, { passive: true, once: true });
  }
}

// Lazy load App for better initial performance
const App = lazy(() => import("./app/App"));

// ============================================================
// Main App - instant render, no artificial delays
// ============================================================
function AppWithProgress() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Instant progress - no delays
    setProgress(60);
    const t1 = setTimeout(() => setProgress(90), 100);
    const t2 = setTimeout(() => {
      setProgress(100);
      setIsLoaded(true);
    }, 200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
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
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Suspense>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AppWithProgress />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>
);
