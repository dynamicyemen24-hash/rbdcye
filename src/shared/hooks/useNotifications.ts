// React Hook for notifications - useNotifications.ts
import { useState, useEffect } from 'react';

import { notificationService } from '@/shared/services/notification.service';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  actions?: { action: string; title: string }[];
  tag?: string;
  requireInteraction?: boolean;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (notificationService.isSupported()) {
      setPermission(Notification.permission);
      notificationService.isSubscribed().then(setIsSubscribed);
    }
  }, []);

  const subscribe = async () => {
    setLoading(true);
    try {
      const sub = await notificationService.subscribe();
      if (sub) {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    await notificationService.unsubscribe();
    setIsSubscribed(false);
    setLoading(false);
  };

  const notify = async (options: NotificationOptions) => {
    await notificationService.showLocalNotification(options);
  };

  return { permission, isSubscribed, loading, subscribe, unsubscribe, notify };
}

