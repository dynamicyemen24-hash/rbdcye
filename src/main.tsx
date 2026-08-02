import { StrictMode, lazy, Suspense, useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import AdvancedProgressBar, { ScrollProgressIndicator } from "@/components/AdvancedProgressBar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HeroSkeleton } from "@/components/LoadingSkeleton";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { initializeCoreServices } from "@/features/core";
import { usePageProgress } from "@/shared/hooks/usePageProgress";

import { ToastProvider } from "./app/components/Toast";
import "./styles/index.css";

// ============================================================
// CRITICAL: All initialization is now NON-BLOCKING
// الموقع يظهر فوراً دون انتظار أي شيء
// ============================================================

// Initialize in background after DOM is ready
if (typeof window !== 'undefined') {
  // Use requestIdleCallback to defer non-critical work
  const scheduleInit = (cb: () => void) => {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => cb(), { timeout: 2000 });
    } else {
      setTimeout(cb, 100);
    }
  };

  scheduleInit(() => {
    // Core services - non-blocking
    initializeCoreServices().catch(() => {
      // Silently fail - core services are non-critical
    });

    // Security headers
    try {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io https://js.stripe.com https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: https://*.unsplash.com https://cdn.sanity.io; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sanity.io https://xd0ohyiz.apicdn.sanity.io https://api.stripe.com; frame-src 'self' https://*.sanity.io https://js.stripe.com https://hooks.stripe.com; media-src 'self' https://*.sanity.io; worker-src 'self' blob:; base-uri 'self'; form-action 'self'";
      document.head.appendChild(cspMeta);
    } catch {
      // Silently fail - security meta tags are non-critical
    }
  });

  // Register service worker for PWA support - after load
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silently fail - PWA is optional
      });
    }, { passive: true, once: true });
  }
}

// Lazy load App for better initial performance
const App = lazy(() => import("./app/App"));

// ============================================================
// Loading state messages
// ============================================================
const LOADING_MESSAGES = [
  { text: 'جاري تحميل المنصة...', weight: 1 },
  { text: 'تهيئة النظام الأساسي', weight: 2 },
  { text: 'تحميل المحتوى', weight: 2 },
  { text: 'تجهيز الواجهة', weight: 1 },
  { text: 'تفعيل الأمان', weight: 1 },
  { text: 'الانتهاء...', weight: 1 },
];

// ============================================================
// Main App with Fast Progress Bar
// ============================================================
function AppWithProgress() {
  const { percentage, message, isComplete, isReady, markInteractive } = usePageProgress('hero');
  const [isInteractive, setIsInteractive] = useState(false);
  const stepRef = useRef(0);

  useEffect(() => {
    // Fast loading sequence - 80ms per step
    const timer = setInterval(() => {
      if (stepRef.current < LOADING_MESSAGES.length) {
        stepRef.current++;
      }
    }, 80);

    // Mark interactive very quickly (1.2s)
    const interactiveTimer = setTimeout(() => {
      markInteractive();
      setIsInteractive(true);
    }, 1200);

    return () => {
      clearInterval(timer);
      clearTimeout(interactiveTimer);
    };
  }, [markInteractive]);

  // Force complete after 2s regardless
  useEffect(() => {
    const forceTimer = setTimeout(() => {
      if (!isInteractive) {
        markInteractive();
        setIsInteractive(true);
      }
    }, 2000);
    return () => clearTimeout(forceTimer);
  }, [isInteractive, markInteractive]);

  return (
    <>
      <AdvancedProgressBar
        percentage={percentage}
        message={message}
        isComplete={isComplete || isInteractive}
        isReady={isReady && isInteractive}
        showAyah={true}
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