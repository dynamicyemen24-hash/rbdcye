// Push Notification Service
// Uses Web Push API for browser notifications

class PushNotificationService {
  private permission: NotificationPermission = 'default';

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    
    this.permission = await Notification.requestPermission();
    return this.permission === 'granted';
  }

  async subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (this.permission !== 'granted') return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey) as unknown as string,
      });
      
      // Save subscription to backend
      await this.saveSubscription(subscription);
      return subscription;
    } catch (err) {
      console.error('[Push] Subscribe failed:', err);
      return null;
    }
  }

  async unsubscribe(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await this.removeSubscription();
      }
    } catch (err) {
      console.error('[Push] Unsubscribe failed:', err);
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.ready;
      return await registration.pushManager.getSubscription();
    } catch {
      return null;
    }
  }

  private async saveSubscription(subscription: PushSubscription): Promise<void> {
    // Save to Supabase
    const { supabase } = await import('@/lib/supabase');
    if (!supabase) return;
    
    await supabase.from('push_subscriptions').upsert({
      endpoint: subscription.endpoint,
      keys: JSON.stringify(subscription.toJSON().keys),
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString(),
    });
  }

  private async removeSubscription(): Promise<void> {
    const { supabase } = await import('@/lib/supabase');
    if (!supabase) return;
    
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await supabase.from('push_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Send local notification (for immediate feedback)
  sendLocal(title: string, body: string, icon?: string, url?: string): void {
    if (this.permission !== 'granted') return;
    
    new Notification(title, {
      body,
      icon: icon || '/logo.svg',
      badge: '/logo.svg',
      tag: 'rbdcye-' + Date.now(),
      data: { url },
    });
  }
}

export const pushService = new PushNotificationService();
