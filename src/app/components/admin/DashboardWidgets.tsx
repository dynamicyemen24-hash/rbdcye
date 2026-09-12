import { 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TrendingUp, TrendingDown, Users, Heart, DollarSign, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  BarChart3, Clock, AlertTriangle, Sparkles, RefreshCw,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ArrowUpRight, ArrowDownRight, Activity, Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState, memo } from 'react';

import { realAnalyticsService } from '@/services/admin/real-analytics.service';

import type { DashboardKPIs, DonationTrend, ProjectProgress, RecentActivity } from '@/services/admin/real-analytics.service';

// ── Smart KPI Card ──
const KPICard = memo(function KPICard({ 
  title, value, change, icon: Icon, color, suffix = '' 
}: { 
  title: string; value: string | number; change?: number; 
  icon: typeof Heart; color: string; suffix?: string;
}) {
  const isPositive = (change || 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
            {value}{suffix}
          </p>
          {change !== undefined && (
            <div className={`mt-2 flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {/* Decorative gradient */}
      <div className={`absolute -bottom-8 -left-8 h-24 w-24 rounded-full opacity-10 ${color}`} />
    </motion.div>
  );
});

// ── Mini Sparkline ──
const MiniSparkline = memo(function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="h-16 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-green)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--brand-green)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="var(--brand-green)" strokeWidth="2" points={points} />
      <polygon fill="url(#sparkGrad)" points={`0,100 ${points} 100,100`} />
    </svg>
  );
});

// ── Smart Insights Widget ──
const InsightsWidget = memo(function InsightsWidget({ insights }: { insights: string[] }) {
  if (insights.length === 0) return null;
  
  return (
    <div className="rounded-2xl border border-[var(--brand-gold)]/20 bg-gradient-to-l from-[var(--brand-gold)]/5 to-transparent p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[var(--brand-gold)]" />
        <h3 className="font-bold text-[var(--foreground)]">رؤى ذكية</h3>
      </div>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li key={i} className="text-sm text-[var(--muted-foreground)]">{insight}</li>
        ))}
      </ul>
    </div>
  );
});

// ── Activity Feed ──
const ActivityFeed = memo(function ActivityFeed({ activities }: { activities: RecentActivity[] }) {
  const typeColors: Record<string, string> = {
    donation: 'bg-[var(--brand-green)]',
    volunteer: 'bg-[var(--brand-gold)]',
    project: 'bg-blue-500',
    message: 'bg-purple-500',
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h3 className="mb-4 font-bold text-[var(--foreground)]">آخر النشاطات</h3>
      <div className="space-y-3">
        {activities.slice(0, 8).map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${typeColors[activity.type] || 'bg-gray-400'}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--foreground)]">{activity.title}</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {new Date(activity.timestamp).toLocaleString('ar-YE', { 
                  hour: '2-digit', minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ── Project Progress Bars ──
const ProjectProgressWidget = memo(function ProjectProgressWidget({ projects }: { projects: ProjectProgress[] }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h3 className="mb-4 font-bold text-[var(--foreground)]">تقدم المشاريع</h3>
      <div className="space-y-4">
        {projects.slice(0, 5).map((project) => (
          <div key={project.id}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--foreground)]">{project.title}</span>
              <span className="text-[var(--muted-foreground)]">{project.percentage}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, project.percentage)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-[var(--brand-green)]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ── Main Dashboard Widgets ──
export function DashboardWidgets() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [trend, setTrend] = useState<DonationTrend[]>([]);
  const [projects, setProjects] = useState<ProjectProgress[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadData = async () => {
    try {
      const [k, t, p, a, i] = await Promise.all([
        realAnalyticsService.getDashboardKPIs(),
        realAnalyticsService.getDonationTrend(14),
        realAnalyticsService.getProjectProgress(),
        realAnalyticsService.getRecentActivity(8),
        realAnalyticsService.getSmartInsights(),
      ]);
      setKpis(k);
      setTrend(t);
      setProjects(p);
      setActivities(a);
      setInsights(i);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('[Dashboard]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- precise: setState in effect is intentional for initial data hydration
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-[var(--muted)]" />
        ))}
      </div>
    );
  }

  const trendData = trend.map(t => t.amount);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">لوحة التحكم</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--muted-foreground)]">
            آخر تحديث: {lastRefresh.toLocaleTimeString('ar-YE')}
          </span>
          <button onClick={loadData} className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors">
            <RefreshCw className="h-4 w-4 text-[var(--muted-foreground)]" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard title="إجمالي التبرعات" value={kpis.totalDonations.toLocaleString('ar-YE')} change={kpis.monthlyGrowth} icon={Heart} color="bg-[var(--brand-green)]" />
          <KPICard title="الإيرادات" value={kpis.totalRevenue.toLocaleString('ar-YE')} change={kpis.monthlyGrowth} icon={DollarSign} color="bg-[var(--brand-gold)]" suffix=" ر.ي" />
          <KPICard title="المشاريع النشطة" value={kpis.activeProjects} icon={BarChart3} color="bg-blue-500" />
          <KPICard title="في الانتظار" value={kpis.pendingDonations} icon={Clock} color="bg-orange-500" />
        </div>
      )}

      {/* Trend + Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h3 className="mb-4 font-bold text-[var(--foreground)]">اتجاه التبرعات (١٤ يوم)</h3>
          <MiniSparkline data={trendData.length > 0 ? trendData : [0,0,0,0,0,0,0]} />
          <div className="mt-3 flex justify-between text-xs text-[var(--muted-foreground)]">
            <span>{trend[0]?.date || ''}</span>
            <span>{trend[trend.length - 1]?.date || ''}</span>
          </div>
        </div>
        <InsightsWidget insights={insights} />
      </div>

      {/* Activity + Projects */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed activities={activities} />
        <ProjectProgressWidget projects={projects} />
      </div>
    </div>
  );
}
