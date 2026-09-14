// Offline Indicator — World-class: أوفلاين أولاً مع حالة المزامنة وعدّاد الطابور
import { useEffect, useState } from "react";
import { WifiOff, Wifi, RefreshCw, CloudOff } from "lucide-react";

import { useOfflineSync } from "@/shared/hooks/useOfflineSync";

export default function OfflineIndicator() {
  const { isOnline, pending, syncing } = useOfflineSync();
  const [dismissed, setDismissed] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- reset dismissed when back online
  useEffect(() => { if (isOnline) setDismissed(false); }, [isOnline]);

  if (isOnline && pending === 0 && !syncing) return null;
  if (!isOnline && dismissed && pending === 0) return null;

  const bg = !isOnline ? "bg-amber-600" : syncing ? "bg-[var(--brand-green)]" : "bg-emerald-600";
  const Icon = !isOnline ? CloudOff : syncing ? RefreshCw : Wifi;
  const text = !isOnline
    ? pending > 0 ? `أنت غير متصل — ${pending} عنصر في طابور المزامنة (سيُرسل تلقائياً)` : "أنت غير متصل — المحتوى المحفوظ متاح والمزامنة ستتم تلقائياً عند الاتصال"
    : syncing ? "جارٍ المزامنة في الخلفية..." : pending > 0 ? `تم الاتصال — جارٍ إرسال ${pending} عنصر معلق` : "تمت استعادة الاتصال";

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 safe-bottom pointer-events-none" role="status" aria-live="polite">
      <div className={`mx-auto max-w-xl ${bg} text-white rounded-xl px-4 py-3 flex items-center justify-between gap-3 shadow-lg pointer-events-auto`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={`w-5 h-5 shrink-0 ${syncing ? "animate-spin" : ""}`} aria-hidden="true" />
          <span className="font-medium text-sm leading-6 truncate">{text}</span>
          {!isOnline && <WifiOff className="w-4 h-4 opacity-80 shrink-0" aria-hidden="true" />}
          {isOnline && !syncing && <Wifi className="w-4 h-4 opacity-80 shrink-0" aria-hidden="true" />}
        </div>
        {!isOnline && (
          <button type="button" onClick={() => setDismissed(true)} className="shrink-0 text-white/90 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-white/15" aria-label="إخفاء التنبيه">إخفاء</button>
        )}
      </div>
    </div>
  );
}
