import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';

export function useRealtimeMessages() {
  const [newMessage, setNewMessage] = useState<any | null>(null);
  const [updatedMessage, setUpdatedMessage] = useState<any | null>(null);

  useEffect(() => {
    // التأكد من أن supabase مُعدّ
    if (!supabase) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload: any) => {
          setNewMessage(payload.new);
          // طلب إشعار المتصفح
          if (Notification.permission === 'granted') {
            new Notification('📩 رسالة جديدة', {
              body: `من: ${payload.new.name}`,
              icon: '/favicon.svg',
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        (payload: any) => {
          setUpdatedMessage(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

  return { newMessage, updatedMessage };
}

