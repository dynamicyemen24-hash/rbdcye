// ============================================================
// Notification Service - Push Notifications for Real-time Updates
// نظام الإشعارات الفورية للموقع
// ============================================================

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
  actions?: { action: string; title: string }[];
  tag?: string;
  requireInteraction?: boolean;
}

interface Subscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// VAPID Public Key (should be from environment)
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

class NotificationService {
  private static instance: NotificationService;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private subscription: Subscription | null = null;

  private constructor() {
    this.init();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize service worker and notifications
  private async init() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        this.swRegistration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        if (import.meta.env.DEV) console.log("Service Worker registered for notifications");
      } catch {
        // Service worker registration failed
      }
    }
  }

  // Request permission for notifications
  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      return "default";
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  }

  // Get current subscription
  async getSubscription(): Promise<Subscription | null> {
    if (!this.swRegistration) return null;

    try {
      const sub = await this.swRegistration.pushManager.getSubscription();
      if (sub) {
        const p256dhKey = sub.getKey("p256dh");
        const authKey = sub.getKey("auth");

        this.subscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: p256dhKey ? this.arrayBufferToBase64(p256dhKey) : "",
            auth: authKey ? this.arrayBufferToBase64(authKey) : "",
          },
        };
      }
      return this.subscription;
    } catch {
      return null;
    }
  }

  // Subscribe to push notifications
  async subscribe(): Promise<Subscription | null> {
    if (!this.swRegistration) {
      throw new Error("Service Worker not registered");
    }

    const permission = await this.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission denied");
    }

    try {
      const sub = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.base64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });

      const p256dhKey = sub.getKey("p256dh");
      const authKey = sub.getKey("auth");

      this.subscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: p256dhKey ? this.arrayBufferToBase64(p256dhKey) : "",
          auth: authKey ? this.arrayBufferToBase64(authKey) : "",
        },
      };

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);

      return this.subscription;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<void> {
    if (!this.swRegistration) return;

    try {
      const sub = await this.swRegistration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
      }
      this.subscription = null;
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
    }
  }

  // Show local notification
  async showLocalNotification(options: NotificationOptions): Promise<void> {
    if (!this.isSupported()) return;

    const permission = await this.requestPermission();
    if (permission !== "granted") return;

    if (this.swRegistration && this.swRegistration.active) {
      this.swRegistration.active.postMessage({
        type: "SHOW_NOTIFICATION",
        payload: options,
      });
    } else {
      // Fallback to regular notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || "/favicon.svg",
        badge: options.badge,
        data: options.data,
      });
    }
  }

  // Send subscription to server
  private async sendSubscriptionToServer(subscription: Subscription): Promise<void> {
    try {
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });
    } catch {
      // Failed to save subscription to server
    }
  }

  // Utility: Convert base64 to Uint8Array
  private base64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Convert ArrayBuffer to Base64 string
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  }

  // Check if user is subscribed
  async isSubscribed(): Promise<boolean> {
    const subscription = await this.getSubscription();
    return !!subscription;
  }
}

export const notificationService = NotificationService.getInstance();
