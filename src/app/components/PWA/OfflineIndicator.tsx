// Offline Indicator - مؤشر عدم الاتصال
import { WifiOff } from 'lucide-react';

import { useNetworkStatus } from '@/utils/pwa';

export default function OfflineIndicator() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up safe-bottom">
      <div className="bg-orange-500 text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2 shadow-lg">
        <WifiOff className="w-5 h-5" />
        <span className="font-medium">أنت غير متصل بالإنترنت - سيتم حفظ البيانات مؤقتاً</span>
      </div>
    </div>
  );
}


