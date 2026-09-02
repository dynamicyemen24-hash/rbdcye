// PWA Utilities - مركز PWA متكامل
import { useEffect, useState } from "react";

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      return registration;
    } catch (error) {
      console.error("SW registration failed:", error);
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

  const connection = (navigator as any).connection;
  if (!connection) return "good";

  const { effectiveType, downlink } = connection;

  if (effectiveType === "4g" || downlink > 2) return "excellent";
  if (effectiveType === "3g" || downlink > 0.5) return "good";
  return "slow";
}

// Background sync registration
export async function registerBackgroundSync(tag: string, data?: any): Promise<void> {
  if ("serviceWorker" in navigator && "sync" in (window as any).registration) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(tag);
    } catch (error) {
      console.error("Background sync registration failed:", error);
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
  } catch (error) {
    console.error("Push subscription failed:", error);
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
    } catch (error) {
      console.error("Badge API error:", error);
    }
  }
}

export async function clearAppBadge(): Promise<void> {
  if ("clearAppBadge" in navigator) {
    try {
      await (navigator as any).clearAppBadge();
    } catch (error) {
      console.error("Badge clear error:", error);
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
      return await (navigator as any).wakeLock.request("screen");
    } catch (error) {
      console.error("Wake lock error:", error);
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
export async function getBatteryStatus(): Promise<any | null> {
  if ("getBattery" in navigator) {
    try {
      return await (navigator as any).getBattery();
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

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
