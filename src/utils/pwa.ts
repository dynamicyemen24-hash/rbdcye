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

// Register service worker with advanced caching strategies
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      // Enable background sync for offline submissions
      if ("sync" in registration) {
        try {
          await (registration as any).sync.register("form-sync");
        } catch {
          // Background sync not available
        }
      }

      // Enable periodic background sync for content updates
      if ("periodicSync" in (registration as any).sync) {
        try {
          await (registration as any).periodicSync.register("content-update", {
            minInterval: 60 * 60 * 1000, // 1 hour
          });
        } catch {
          // Periodic sync not available
        }
      }

      // Listen for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New content available
              if ("Notification" in window) {
                try {
                  new Notification("تحديث جديد متوفر", {
                    body: "الموقع لديه تحديث جديد. هل تريد التحديث الآن؟",
                    tag: "rbdcye-update",
                    requireInteraction: true,
                  });
                } catch {
                  // Notification not supported
                }
              }
            }
          });
        }
      });

      return registration;
    } catch {
      // Service Worker registration failed silently
    }
  }
  return null;
}

// Check if running as PWA
export function isPWA(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  );
}

// Background sync registration
export async function registerBackgroundSync(tag: string, data?: any): Promise<void> {
  if ("serviceWorker" in navigator && "sync" in (navigator as any).serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(tag);
    } catch {
      // Background sync not supported
    }
  }
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

// Cache strategy helper for service worker
export const CACHE_STRATEGIES = {
  // Cache-first for static assets
  CACHE_FIRST: "CacheFirst",
  // Network-first for dynamic data
  NETWORK_FIRST: "NetworkFirst",
  // Stale-while-revalidate for content
  STALE_WHILE_REVALIDATE: "StaleWhileRevalidate",
  // Network-only for API calls that must be fresh
  NETWORK_ONLY: "NetworkOnly",
  // Cache-only for offline fallback
  CACHE_ONLY: "CacheOnly",
} as const;

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
