// PWA Utilities — lean boot-critical surface: network status + SW lifecycle.
// Heavier PWA features (install prompts, badges, push, background sync) are
// implemented inside their own components/hooks. Unused helpers were removed
// so this module (imported by main.tsx) stays out of the critical path.
import { useEffect, useState } from "react";
import { hardReload, isFormInteractionActive } from "./resilience";

// Network status hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline };
}

let updateCheckInterval: NodeJS.Timeout | null = null;

// Return cleanup function for the update check interval
export function cleanupUpdateCheck(): void {
  if (updateCheckInterval) {
    clearInterval(updateCheckInterval);
    updateCheckInterval = null;
  }
}

// Register service worker with enforced updates: a newly installed worker is
// activated immediately and the page reloads into it (loop-guarded).
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      // Enable background sync for offline submissions
      if ("sync" in registration) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (registration as any).sync.register("form-sync");
        } catch {
          // Background sync not available — fallback to manual retry queue
        }
      }

      // Enable periodic background sync for content updates (hourly)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ("periodicSync" in (registration as any)) {
        try {
          const status = await navigator.permissions.query({ name: "periodic-background-sync" as PermissionName });
          if (status.state === "granted") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (registration as any).periodicSync.register("content-update", {
              minInterval: 60 * 60 * 1000, // 1 hour
            });
          }
        } catch {
          // Periodic sync not available or not granted — silent fallback
        }
      }

      // Update detection — enforce the new worker instead of waiting for tabs to close
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              try {
                newWorker.postMessage({ type: "SKIP_WAITING" });
              } catch {
                // postMessage failed — controllerchange fallback below still handles it
              }
              // Optional system notification (requires permission)
              if ("Notification" in window && Notification.permission === "granted") {
                try {
                  new Notification("تحديث جديد متوفر", {
                    body: "يتم تطبيق التحديث الجديد الآن.",
                    tag: "rbdcye-update",
                    requireInteraction: false,
                  });
                } catch {
                  // Notification display failed — non-critical
                }
              }
            }
          });
        }
      });

      // Enforced reload once the new SW takes control — guarded against loops
      // and deferred while the user is filling a form (version checks retry).
      // Skipped on FIRST install (no previous controller): the content is
      // already fresh, and reloading would flash/reset the just-opened page.
      const hadController = !!navigator.serviceWorker.controller;
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        if (!hadController) return;
        if (!isFormInteractionActive()) hardReload("sw-controller-change");
      });

      const checkUpdate = () => {
        if (document.visibilityState === "visible") {
          try {
            void registration.update();
          } catch {
            // Update check failed — will retry next interval
          }
        }
      };

      // Immediate check on boot (catches deploys that happened while away)
      checkUpdate();
      // Recheck when the user returns or reconnects
      document.addEventListener("visibilitychange", checkUpdate);
      window.addEventListener("online", checkUpdate);

      // Check for updates every 15 minutes when tab is visible
      updateCheckInterval = setInterval(checkUpdate, 15 * 60 * 1000);

      return registration;
    } catch {
      // Service Worker registration failed silently — app remains functional offline-less
    }
  }
  return null;
}
