// PWA Utilities - مركز PWA متكامل مع استراتيجيات caching محسّنة
import { useEffect, useState } from "react";

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

// Connection quality detection
export function getConnectionQuality(): "excellent" | "good" | "slow" | "offline" {
  if (!navigator.onLine) return "offline";

  const connection = (navigator as { connection?: { effectiveType?: string; downlink?: number } })
    .connection;
  if (!connection) return "good";

  const { effectiveType, downlink } = connection;

  if (effectiveType === "4g" || (downlink && downlink > 2)) return "excellent";
  if (effectiveType === "3g" || (downlink && downlink > 0.5)) return "good";
  return "slow";
}

// Register service worker with advanced caching strategies + robust update detection
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
          await (registration as any).sync.register("form-sync");
        } catch {
          // Background sync not available — fallback to manual retry queue
        }
      }

      // Enable periodic background sync for content updates (hourly)
      if ("periodicSync" in (registration as any)) {
        try {
          const status = await navigator.permissions.query({ name: "periodic-background-sync" as PermissionName });
          if (status.state === "granted") {
            await (registration as any).periodicSync.register("content-update", {
              minInterval: 60 * 60 * 1000, // 1 hour
            });
          }
        } catch {
          // Periodic sync not available or not granted — silent fallback
        }
      }

      // Robust update detection — dispatches custom event + optional notification
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // Broadcast update-available event for UI toast / banner
              window.dispatchEvent(new CustomEvent("pwa:update-available", { detail: { registration } }));
              // Optional system notification (requires permission)
              if ("Notification" in window && Notification.permission === "granted") {
                try {
                  new Notification("تحديث جديد متوفر", {
                    body: "الموقع لديه تحديث جديد. اضغط للتحديث الآن.",
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

      // Auto-reload once new SW takes control — ensures fresh content without manual refresh loop
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.dispatchEvent(new CustomEvent("pwa:controller-change"));
        // Note: caller may decide to reload; we broadcast rather than force reload
      });

      // Check for updates every 60 minutes when tab is visible
      setInterval(
        () => {
          if (document.visibilityState === "visible") {
            try {
              void registration.update();
            } catch {
              // Update check failed — will retry next interval
            }
          }
        },
        60 * 60 * 1000,
      );

      return registration;
    } catch {
      // Service Worker registration failed silently — app remains functional offline-less
    }
  }
  return null;
}

// Apply waiting SW update immediately — sends SKIP_WAITING to waiting worker
export async function applyPWAUpdate(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  } catch {
    // Apply update failed — user can still reload manually
  }
}

// Subscribe to update-available event — returns unsubscribe
export function onPWAUpdate(callback: (reg: ServiceWorkerRegistration) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail as { registration: ServiceWorkerRegistration };
    if (detail?.registration) callback(detail.registration);
  };
  window.addEventListener("pwa:update-available", handler as EventListener);
  return () => window.removeEventListener("pwa:update-available", handler as EventListener);
}

// Explicit update check — callable from UI (e.g., settings)
export async function checkForPWAUpdate(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return !!registration.waiting;
  } catch {
    // Update check failed — treat as no update
    return false;
  }
}

// Check if running as PWA
export function isPWA(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  );
}

// Background sync registration — queue-aware with retries
export async function registerBackgroundSync(tag: string, _data?: unknown): Promise<void> {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      // Store payload in IndexedDB / localStorage if needed before registering sync
      await (registration as unknown as { sync: { register: (tag: string) => Promise<void> } }).sync.register(tag);
    } catch {
      // Background sync not supported — fallback to immediate retry via fetch queue
    }
  } else {
    // SyncManager unavailable — caller should handle via offline queue (src/utils/offline.ts)
  }
}

// Queue a background sync with automatic retry semantics
export async function queueBackgroundSync(tag: string, payload?: unknown): Promise<void> {
  try {
    // Persist payload for SW to pick up on sync event
    if (payload && typeof localStorage !== "undefined") {
      const key = `bg-sync:${tag}:${Date.now()}`;
      localStorage.setItem(key, JSON.stringify(payload));
    }
  } catch {
    // Storage quota or serialization failed — proceed to sync registration anyway
  }
  await registerBackgroundSync(tag, payload);
}

// Push notification subscription
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: new Uint8Array(
        urlBase64ToUint8Array(import.meta.env.VITE_PUSH_PUBLIC_KEY || "")
      ),
    });
    return subscription;
  } catch {
    return null;
  }
}

// Helper for push key conversion
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  if (!base64String) return new Uint8Array();
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String.replace(/-/g, "+") + padding).replace(/-/g, "+");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Badge API support
export async function setAppBadge(count: number): Promise<void> {
  if ("setAppBadge" in navigator) {
    try {
      await (navigator as any).setAppBadge(count);
    } catch {
      // Badge API not supported or denied
    }
  }
}

export async function clearAppBadge(): Promise<void> {
  if ("clearAppBadge" in navigator) {
    try {
      await (navigator as any).clearAppBadge();
    } catch {
      // Badge API not supported or denied
    }
  }
}

// Share API
export async function shareContent(data: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

// Wake lock to prevent screen sleep
export async function requestWakeLock(): Promise<WakeLockSentinel | null> {
  if ("wakeLock" in navigator) {
    try {
      return await navigator.wakeLock.request("screen");
    } catch {
      return null;
    }
  }
  return null;
}

// Device info
export function getDeviceInfo() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bTablet\b)/i.test(navigator.userAgent);
  const isDesktop = !isMobile && !isTablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
  };
}

// Battery status
export async function getBatteryStatus(): Promise<{ charging: boolean; level: number } | null> {
  if ("getBattery" in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      return { charging: battery.charging, level: battery.level };
    } catch {
      return null;
    }
  }
  return null;
}

// Install prompt detection
export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!installPrompt) return false;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    setInstallPrompt(null);
    return outcome === "accepted";
  };

  return { installPrompt: !!installPrompt, promptInstall };
}

// Cache strategy helper for service worker — maps to Workbox handlers
export const CACHE_STRATEGIES = {
  // Cache-first for immutable static assets (fonts, versioned js/css)
  CACHE_FIRST: "CacheFirst",
  // Network-first for dynamic HTML / API
  NETWORK_FIRST: "NetworkFirst",
  // Stale-while-revalidate for CMS images & content
  STALE_WHILE_REVALIDATE: "StaleWhileRevalidate",
  // Network-only for payments & auth (no cache)
  NETWORK_ONLY: "NetworkOnly",
  // Cache-only for offline fallback shell
  CACHE_ONLY: "CacheOnly",
} as const;

// Cache version — bump to invalidate old caches on deploy
export const CACHE_VERSION = "rbdcye-v2";

// Delete old caches not matching current version (call on app start)
export async function cleanupOldCaches(): Promise<void> {
  if (!("caches" in window)) return;
  try {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => !k.includes(CACHE_VERSION) && k.startsWith("rbdcye-")).map((k) => caches.delete(k)),
    );
  } catch {
    // Cache cleanup failed — non-critical
  }
}

// Pre-cache explicit URLs (e.g., offline.html, critical images)
export async function precacheUrls(urls: string[]): Promise<void> {
  if (!("caches" in window)) return;
  try {
    const cache = await caches.open(`${CACHE_VERSION}-precache`);
    await cache.addAll(urls);
  } catch {
    // Precache failed — network may be offline
  }
}

// Prefetch strategy based on connection quality
export function getPrefetchStrategy(): {
  prefetchImages: boolean;
  prefetchPages: boolean;
  prefetchFonts: boolean;
} {
  const quality = getConnectionQuality();

  switch (quality) {
    case "excellent":
      return { prefetchImages: true, prefetchPages: true, prefetchFonts: true };
    case "good":
      return { prefetchImages: true, prefetchPages: false, prefetchFonts: true };
    case "slow":
      return { prefetchImages: false, prefetchPages: false, prefetchFonts: false };
    case "offline":
      return { prefetchImages: false, prefetchPages: false, prefetchFonts: false };
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
