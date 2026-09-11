import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";

export function useRealtimeMessages() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newMessage, setNewMessage] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [updatedMessage, setUpdatedMessage] = useState<any | null>(null);

  useEffect(() => {
    // التأكد من أن supabase مُعدّ
    if (!supabase) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          setNewMessage(payload.new);
          // طلب إشعار المتصفح
          if (Notification.permission === "granted") {
            new Notification("📩 رسالة جديدة", {
              body: `من: ${payload.new.name}`,
              icon: "/favicon.svg",
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
