// useOfflineSync — World-class offline-first hook
// يوفّر حالة الشبكة + طابور المزامنة + آخر مزامنة + إعادة مزامنة يدوية
import { useEffect, useState, useCallback } from "react";

import { offlineManager } from "@/services/offline/offline-manager";
import { syncService } from "@/services/offline/sync-service";
import { useNetworkStatus } from "@/utils/pwa";

export function useOfflineSync() {
  const { isOnline } = useNetworkStatus();
  const [pending, setPending] = useState(0);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(syncService.getLastSyncAt());
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    try { setPending(await offlineManager.getSyncQueueCount()); } catch { /* ignore */ }
    setLastSyncAt(syncService.getLastSyncAt());
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    const onComplete = () => { setSyncing(false); refresh(); };
    const onQueued = () => refresh();
    window.addEventListener("rbdcye:sync-complete" as unknown as string, onComplete as EventListener);
    window.addEventListener("rbdcye:offline-queued" as unknown as string, onQueued as EventListener);
    const unsub = offlineManager.onStatusChange(refresh);
    return () => { clearInterval(id); window.removeEventListener("rbdcye:sync-complete" as unknown as string, onComplete as EventListener); window.removeEventListener("rbdcye:offline-queued" as unknown as string, onQueued as EventListener); unsub(); };
  }, [refresh]);

  const syncNow = useCallback(async () => {
    if (!isOnline || syncing) return;
    setSyncing(true);
    try { await syncService.syncAll(); } finally { setSyncing(false); refresh(); }
  }, [isOnline, syncing, refresh]);

  return { isOnline, pending, lastSyncAt, syncing, syncNow, refresh };
}
