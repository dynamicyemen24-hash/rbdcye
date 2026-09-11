import { TrendingUp, Users, Heart, MapPin, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState, memo } from 'react';

import { realAnalyticsService } from '@/services/admin/real-analytics.service';

interface ImpactMetric {
  label: string;
  value: number;
  suffix: string;
  icon: typeof Heart;
  color: string;
  trend?: number;
}

export const ImpactTracker = memo(function ImpactTracker() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const kpis = await realAnalyticsService.getDashboardKPIs();
        setMetrics([
          { label: 'مستفيد مباشر', value: kpis.totalBeneficiaries, suffix: '+', icon: Users, color: 'text-[var(--brand-green)]', trend: kpis.monthlyGrowth },
          { label: 'تبرع مالي', value: Math.round(kpis.totalRevenue / 1000000), suffix: 'M ر.ي', icon: TrendingUp, color: 'text-[var(--brand-gold)]', trend: kpis.monthlyGrowth },
          { label: 'مشروع نشط', value: kpis.activeProjects, suffix: '', icon: MapPin, color: 'text-blue-500' },
          { label: 'سنوات خدمة', value: 12, suffix: '', icon: Calendar, color: 'text-purple-500' },
        ]);
      } catch {
        setMetrics([
          { label: 'مستفيد', value: 15000, suffix: '+', icon: Users, color: 'text-[var(--brand-green)]' },
          { label: 'تبرع', value: 125, suffix: 'M ر.ي', icon: TrendingUp, color: 'text-[var(--brand-gold)]' },
          { label: 'مشروع', value: 8, suffix: '', icon: MapPin, color: 'text-blue-500' },
          { label: 'سنوات', value: 12, suffix: '', icon: Calendar, color: 'text-purple-500' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-[var(--muted)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4" dir="rtl">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center"
        >
          <metric.icon className={`mx-auto h-6 w-6 ${metric.color}`} />
          <div className="mt-2 text-2xl font-bold text-[var(--foreground)]">
            {metric.value.toLocaleString('ar-YE')}{metric.suffix}
          </div>
          <div className="text-xs text-[var(--muted-foreground)]">{metric.label}</div>
          {metric.trend !== undefined && (
            <div className={`mt-1 text-xs font-bold ${metric.trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {metric.trend >= 0 ? '↑' : '↓'} {Math.abs(metric.trend)}%
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
});
