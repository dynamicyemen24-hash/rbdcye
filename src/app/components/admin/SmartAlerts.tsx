// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AlertTriangle, Bell, TrendingDown, Users, X } from 'lucide-react';
import { useEffect, useState, memo } from 'react';

import { realAnalyticsService } from '@/services/admin/real-analytics.service';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  title: string;
  message: string;
  timestamp: Date;
}

const SmartAlerts = memo(function SmartAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkAlerts = async () => {
      try {
        const kpis = await realAnalyticsService.getDashboardKPIs();
        const newAlerts: Alert[] = [];

        if (kpis.pendingDonations > 10) {
          newAlerts.push({
            id: 'pending-high',
            type: 'warning',
            title: 'تبرعات كثيرة في الانتظار',
            message: `${kpis.pendingDonations} تبرع بحاجة لمراجعة`,
            timestamp: new Date(),
          });
        }

        if (kpis.monthlyGrowth < -20) {
          newAlerts.push({
            id: 'growth-drop',
            type: 'danger',
            title: 'انخفاض في التبرعات',
            message: `انخفضت التبرعات بنسبة ${Math.abs(kpis.monthlyGrowth)}%`,
            timestamp: new Date(),
          });
        }

        if (kpis.monthlyGrowth > 50) {
          newAlerts.push({
            id: 'growth-spike',
            type: 'success',
            title: 'نمو ممتاز في التبرعات',
            message: `ارتفاع بنسبة ${kpis.monthlyGrowth}% هذا الشهر`,
            timestamp: new Date(),
          });
        }

        setAlerts(newAlerts);
      } catch {
        // Silently fail
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const visibleAlerts = alerts.filter(a => !dismissed.has(a.id));
  if (visibleAlerts.length === 0) return null;

  const typeStyles: Record<string, string> = {
    warning: 'border-amber-300 bg-amber-50 dark:bg-amber-950/30',
    danger: 'border-red-300 bg-red-50 dark:bg-red-950/30',
    success: 'border-green-300 bg-green-50 dark:bg-green-950/30',
    info: 'border-blue-300 bg-blue-50 dark:bg-blue-950/30',
  };

  const typeIcons: Record<string, typeof Bell> = {
    warning: AlertTriangle,
    danger: TrendingDown,
    success: TrendingDown,
    info: Bell,
  };

  return (
    <div className="space-y-2" dir="rtl">
      {visibleAlerts.map(alert => {
        const Icon = typeIcons[alert.type];
        return (
          <div key={alert.id} className={`flex items-center gap-3 rounded-xl border p-3 ${typeStyles[alert.type]}`}>
            <Icon className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <span className="text-sm font-bold">{alert.title}</span>
              <span className="mr-2 text-sm">{alert.message}</span>
            </div>
            <button 
              onClick={() => setDismissed(prev => new Set([...prev, alert.id]))}
              className="p-1 hover:bg-black/5 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
});

export default SmartAlerts;
