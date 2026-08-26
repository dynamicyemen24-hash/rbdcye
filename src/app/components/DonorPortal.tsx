// Professional Donor Portal Component - Enterprise Grade
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart, History, MapPin, FileText, Settings, Bell, Download, Share2,
  Calendar, Users, DollarSign, CheckCircle, Clock, Award,
  BarChart3, Target, Sparkles,
  Printer, CreditCard, QrCode, ExternalLink, User,
} from 'lucide-react';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuth } from '@/features/auth/contexts/AuthContext';

// ============================================================
// Types
// ============================================================
interface DonationRecord {
  id: string;
  amount: number;
  currency: string;
  project: string;
  projectId: string;
  date: string;
  status: 'completed' | 'pending' | 'rejected' | 'refunded';
  method: string;
  receipt_url?: string;
  notes?: string;
  impact?: ImpactMetric[];
}

interface ImpactMetric {
  metric: string;
  value: string;
  icon: string;
}

interface ImpactStory {
  id: string;
  title: string;
  type: 'water' | 'education' | 'food' | 'health' | 'orphan';
  location: string;
  beneficiaries: number;
  date: string;
  description: string;
  image?: string;
}

interface Notification {
  id: string;
  type: 'donation' | 'impact' | 'campaign' | 'receipt' | 'reminder';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

interface DonorPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  impactReports: boolean;
  zakatReminders: boolean;
  campaignAlerts: boolean;
  monthlyDigest: boolean;
  language: 'ar' | 'en';
  currency: 'YER' | 'SAR' | 'USD';
  theme: 'light' | 'dark' | 'system';
}

// ============================================================
// Mock Data (to be replaced by API calls)
// ============================================================
const DEFAULT_DONOR_STATS = {
  totalDonated: 25000,
  projectsSupported: 3,
  impactStories: 12,
  activeCampaigns: 2,
  totalBeneficiaries: 520,
  rank: 'سفير العطاء',
  nextMilestone: 35000,
  monthlyAverage: 2100,
};

const DEFAULT_DONATIONS: DonationRecord[] = [
  { id: '1', amount: 10000, currency: 'YER', project: 'بئر ماء - الحديدة', projectId: 'p1', date: '2024-11-15', status: 'completed', method: 'bank', receipt_url: '/receipts/1.pdf', impact: [{ metric: 'أسر مستفيدة', value: '320', icon: 'users' }, { metric: 'مياه نظيفة', value: '5000 لتر/يوم', icon: 'water' }] },
  { id: '2', amount: 8000, currency: 'YER', project: 'كفالة يتيم محمد', projectId: 'p2', date: '2024-10-22', status: 'completed', method: 'card', receipt_url: '/receipts/2.pdf', impact: [{ metric: 'طفل مكفول', value: '1', icon: 'heart' }, { metric: 'تقدم دراسي', value: 'ممتاز', icon: 'star' }] },
  { id: '3', amount: 7000, currency: 'YER', project: 'سلة غذائية رمضان', projectId: 'p3', date: '2024-09-10', status: 'completed', method: 'bank' },
  { id: '4', amount: 5000, currency: 'YER', project: 'الوقف التعليمي', projectId: 'p4', date: '2024-12-01', status: 'pending', method: 'card' },
  { id: '5', amount: 3000, currency: 'YER', project: 'دعم صحتك', projectId: 'p5', date: '2024-08-15', status: 'completed', method: 'cash' },
];

const DEFAULT_IMPACTS: ImpactStory[] = [
  { id: 'i1', title: 'بئر ماء - الحديدة', type: 'water', location: 'الحديدة, اليمن', beneficiaries: 320, date: '2024-12-01', description: 'تم حفر البئر وتركيب المضخة، ويستفيد منها 320 أسرة يومياً.', image: '/images/defaults/project-water.svg' },
  { id: 'i2', title: 'كفالة اليتيم محمد', type: 'orphan', location: 'صنعاء, اليمن', beneficiaries: 1, date: '2024-10-01', description: 'محمد يدرس في الصف الثاني متوسط بتفوق، حصل على المركز الأول.' },
  { id: 'i3', title: 'توزيع السلات الغذائية', type: 'food', location: 'مأرب, اليمن', beneficiaries: 150, date: '2024-09-15', description: 'تم توزيع 150 سلة غذائية للأسر النازحة في مخيمات مأرب.' },
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'donation', title: 'تم استلام تبرعك', message: 'تبرعك بمبلغ 10,000 ريال لبئر ماء - الحديدة تم استلامه بنجاح.', date: '2024-11-15', read: false, actionUrl: '/donate/history' },
  { id: 'n2', type: 'impact', title: 'أثر تبرعك الجديد', message: 'بئر ماء الحديدة: 320 أسرة تستفيد من المياه النظيفة الآن!', date: '2024-12-01', read: false, actionUrl: '/donate/impact' },
  { id: 'n3', type: 'campaign', title: 'حملة جديدة: كسوة الشتاء', message: 'انطلقت حملة كسوة الشتاء 2025، ساهم الآن.', date: '2024-12-20', read: true, actionUrl: '/donate' },
  { id: 'n4', type: 'receipt', title: 'إيصال تبرع جديد', message: 'تم إصدار إيصال إلكتروني لتبرعك الأخير.', date: '2024-11-16', read: true },
];

const DEFAULT_PREFERENCES: DonorPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  impactReports: true,
  zakatReminders: false,
  campaignAlerts: true,
  monthlyDigest: true,
  language: 'ar',
  currency: 'YER',
  theme: 'light',
};

// ============================================================
// Helper Components
// ============================================================
const StatusBadge = memo(function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: 'مكتمل', color: '#059669', bg: '#ECFDF5' },
    pending: { label: 'معلق', color: '#D97706', bg: '#FFFBEB' },
    rejected: { label: 'مرفوض', color: '#DC2626', bg: '#FEF2F2' },
    refunded: { label: 'مسترجع', color: '#6B7280', bg: '#F3F4F6' },
  };
  const c = config[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: c.color, backgroundColor: c.bg }}>
      {c.label}
    </span>
  );
});

const StatCard = memo(function StatCard({ icon: Icon, label, value, trend, color, onClick }: {
  icon: any; label: string; value: string | number; trend?: string; color: string; onClick?: () => void;
}) {
  const Wrapper = onClick ? 'button' : 'div' as const;
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={onClick ? { scale: 0.98 } : undefined}>
      <Wrapper
        onClick={onClick}
        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 w-full text-right"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          {trend && (
            <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-xs font-semibold">{trend}</span>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-800 mb-1">{typeof value === 'number' ? value.toLocaleString('ar-SA') : value}</div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
      </Wrapper>
    </motion.div>
  );
});

const TabButton = memo(function TabButton({ id: _id, label, icon: Icon, active, onClick }: {
  id: string; label: string; icon: any; active: boolean; onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium transition-all text-sm whitespace-nowrap ${
        active
          ? 'bg-gradient-to-l from-[var(--brand-green)] to-emerald-500 text-white shadow-lg shadow-emerald-200'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </motion.button>
  );
});

// ============================================================
// Main DonorPortal Component
// ============================================================
type PortalTab = 'overview' | 'history' | 'impact' | 'settings' | 'notifications';

const getPortalTab = (value: string | null): PortalTab => {
  const allowed: PortalTab[] = ['overview', 'history', 'impact', 'settings', 'notifications'];
  return allowed.includes(value as PortalTab) ? value as PortalTab : 'overview';
};

export default function DonorPortal() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<PortalTab>(() => getPortalTab(searchParams.get('view')));

  const [loading, setLoading] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState<DonationRecord | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [preferences, setPreferences] = useState<DonorPreferences>(DEFAULT_PREFERENCES);

  // Simulate loading
    useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setActiveTab(getPortalTab(searchParams.get('view')));
  }, [searchParams]);

  const stats = useMemo(() => ({

    ...DEFAULT_DONOR_STATS,
    progressPercent: Math.min((DEFAULT_DONOR_STATS.totalDonated / DEFAULT_DONOR_STATS.nextMilestone) * 100, 100),
  }), []);

  const activeNotifications = useMemo(() => 
    DEFAULT_NOTIFICATIONS.filter(n => !n.read).length,
  []);

  const handleDownloadReceipt = useCallback((donation: DonationRecord) => {
    setShowReceiptModal(donation);
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'رحماء بينهم',
        text: 'أساهم مع رحماء بينهم في صنع الأثر!',
        url: window.location.href,
      }).catch(() => setShowShareModal(true));
    } else {
      setShowShareModal(true);
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white pt-24" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-24 bg-white/60 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={`portal-skeleton-${i}`} className="h-40 bg-white/60 rounded-3xl" />)}
            </div>
            <div className="h-96 bg-white/60 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 pt-24" dir="rtl">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-gradient-to-br from-[var(--brand-green)] to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
          title="مشاركة"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
        <motion.button
          onClick={handlePrint}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-white border border-gray-200 text-gray-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
          title="طباعة"
        >
          <Printer className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[var(--brand-green)] via-emerald-600 to-emerald-800 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name || ''} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <Heart className="w-10 h-10 text-white" fill="white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold">مرحباً {user?.name || 'بك'}!</h1>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {stats.rank}
                  </span>
                </div>
                <p className="text-white/80">شكراً لك على كرمك ومساهمتك في صنع الأثر</p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setActiveTab('notifications')}
                  className="relative p-3 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5 text-white" />
                  {activeNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {activeNotifications}
                    </span>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setShowQrModal(true)}
                  className="p-3 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <QrCode className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">التقدم إلى المستوى التالي</span>
                <span className="text-sm font-semibold">{stats.totalDonated.toLocaleString()} / {stats.nextMilestone.toLocaleString()} ريال</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.progressPercent}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-l from-[var(--brand-gold)] to-yellow-300 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" style={{ animationDuration: '2s' }} />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Heart} label="إجمالي العطاء" value={`${stats.totalDonated.toLocaleString('ar-SA')} ريال`} trend="+15%" color="#059669" />
          <StatCard icon={Target} label="المشاريع المدعومة" value={stats.projectsSupported} trend="+2" color="#2563EB" />
          <StatCard icon={Users} label="المستفيدون" value={stats.totalBeneficiaries.toLocaleString('ar-SA')} color="#7C3AED" />
          <StatCard icon={Award} label="قصص الأثر" value={stats.impactStories} trend="+5" color="#D97706" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'تبرع سريع', icon: Heart, action: '/donate', color: '#059669' },
            { label: 'سجل التبرعات', icon: History, action: () => setActiveTab('history'), color: '#2563EB' },
            { label: 'رحلة الأثر', icon: MapPin, action: () => setActiveTab('impact'), color: '#7C3AED' },
            { label: 'إعدادات', icon: Settings, action: () => setActiveTab('settings'), color: '#D97706' },
          ].map((item) => (
            <motion.button
              key={item.label}
              onClick={() => typeof item.action === 'function' ? item.action() : window.location.href = item.action}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-md hover:shadow-lg transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${item.color}15` }}>
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: Heart },
            { id: 'history', label: 'سجل التبرعات', icon: History },
            { id: 'impact', label: 'رحلة الأثر', icon: MapPin },
            { id: 'settings', label: 'الإعدادات', icon: Settings },
            { id: 'notifications', label: 'الإشعارات', icon: Bell },
          ].map(tab => (
            <TabButton key={tab.id} {...tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id as any)} />
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {/* Monthly Overview Chart */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--brand-green)]" />
                  نشاط التبرعات الشهري
                </h3>
                <div className="space-y-3">
                  {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'ديسمبر'].map((month, i) => {
                    const amount = (i + 1) * 3500;
                    return (
                      <div key={month} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500 w-12">{month}</span>
                        <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(amount / 25000) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full bg-gradient-to-l from-[var(--brand-green)] to-emerald-400 rounded-full"
                          />
                        </div>
                        <span className="text-xs font-bold text-[var(--brand-green)] w-16 text-left">{amount.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Campaigns */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--brand-gold)]" />
                  الحملات النشطة
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'كسوة الشتاء 2025', progress: 65, raised: 65000, target: 100000, daysLeft: 15 },
                    { name: 'وقف التعليم', progress: 40, raised: 400000, target: 1000000, daysLeft: 45 },
                   ].map((campaign, _i) => (
                    <div key={campaign.name} className="p-4 bg-gradient-to-l from-emerald-50 to-white rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{campaign.name}</h4>
                        <span className="text-xs text-gray-500">{campaign.daysLeft} يوم متبقي</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${campaign.progress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-l from-[var(--brand-green)] to-[var(--brand-gold)] rounded-full"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>تم جمع {campaign.raised.toLocaleString()} ريال</span>
                        <span>الهدف {campaign.target.toLocaleString()} ريال</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Notifications */}
              {DEFAULT_NOTIFICATIONS.filter(n => !n.read).length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[var(--brand-gold)]" />
                    الإشعارات الحديثة
                  </h3>
                  <div className="space-y-3">
                    {DEFAULT_NOTIFICATIONS.filter(n => !n.read).slice(0, 3).map(notif => (
                      <div key={notif.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                        <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                          <p className="text-xs text-gray-500">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Donation History Tab */}
          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Filters */}
              <div className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 mb-6">
                <div className="flex flex-wrap gap-3 items-center">
                  <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none">
                    <option>كل المشاريع</option>
                    <option>بئر ماء</option>
                    <option>كفالة</option>
                    <option>سلة غذائية</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none">
                    <option>كل الحالات</option>
                    <option>مكتمل</option>
                    <option>معلق</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none">
                    <option>آخر 6 أشهر</option>
                    <option>آخر سنة</option>
                    <option>كل التبرعات</option>
                  </select>
                  <div className="flex-1" />
                  <span className="text-sm text-gray-500">{DEFAULT_DONATIONS.length} تبرع</span>
                </div>
              </div>

              {/* Donation List */}
              <div className="space-y-4">
                {DEFAULT_DONATIONS.map((donation, i) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-6 h-6 text-[var(--brand-green)]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 mb-1">{donation.project}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(donation.date).toLocaleDateString('ar-SA')}
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5" />
                              {donation.method === 'bank' ? 'تحويل بنكي' : donation.method === 'card' ? 'بطاقة ائتمان' : 'نقدي'}
                            </span>
                          </div>
                          {donation.impact && (
                            <div className="flex flex-wrap gap-2 mt-2">
                               {donation.impact.map((imp, _idx) => (
                                 <span key={imp.metric} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  {imp.metric}: {imp.value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:text-left">
                        <div className="text-right">
                          <div className="text-xl font-bold text-[var(--brand-green)]">
                            {donation.amount.toLocaleString('ar-SA')}
                          </div>
                          <div className="text-xs text-gray-500">{donation.currency}</div>
                        </div>
                        <StatusBadge status={donation.status} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      {donation.receipt_url && (
                        <button
                          onClick={() => handleDownloadReceipt(donation)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          الإيصال
                        </button>
                      )}
                      <button
                        onClick={() => {}}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        التفاصيل
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Impact Tab */}
          {activeTab === 'impact' && (
            <motion.div key="impact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Impact Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 {[
                   { label: 'المستفيدون', value: stats.totalBeneficiaries.toLocaleString(), icon: Users, color: '#059669' },
                   { label: 'الأسر المستفيدة', value: '472', icon: Users, color: '#2563EB' },
                   { label: 'المشاريع المنجزة', value: '8', icon: Target, color: '#7C3AED' },
                   { label: 'ساعات التطوع', value: '1,240', icon: Clock, color: '#D97706' },
                 ].map((stat) => (
                   <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: `${stat.color}15` }}>
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Impact Timeline */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--brand-green)]" />
                  رحلة عطائي
                </h3>
                <div className="space-y-6">
                  {DEFAULT_IMPACTS.map((story, i) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pr-8 pb-6 border-r-2 border-emerald-200 last:pb-0"
                    >
                      <div className="absolute right-0 top-0 w-4 h-4 bg-[var(--brand-green)] rounded-full -translate-x-1/2 border-4 border-white shadow" />
                      <div className="bg-gradient-to-l from-emerald-50 to-white rounded-xl p-4 border border-emerald-100">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-800">{story.title}</h4>
                          <span className="text-xs text-gray-500">{new Date(story.date).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{story.description}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1 text-emerald-700">
                            <Users className="w-3.5 h-3.5" />
                            {story.beneficiaries} مستفيد
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-3.5 h-3.5" />
                            {story.location}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {/* Personal Info */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--brand-green)]" />
                  المعلومات الشخصية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم الكامل</label>
                    <input id="fullName" type="text" defaultValue={user?.name || ''} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label>
                    <input id="email" type="email" defaultValue={user?.email || ''} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الهاتف</label>
                    <input id="phone" type="tel" placeholder="+967" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all" />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1.5">العنوان</label>
                    <input id="address" type="text" placeholder="المدينة، الدولة" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all" />
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[var(--brand-gold)]" />
                  إعدادات الإشعارات
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'إشعارات البريد الإلكتروني', desc: 'استلام إشعارات التبرعات والفواتير عبر البريد' },
                    { key: 'smsNotifications', label: 'إشعارات الرسائل النصية', desc: 'إشعارات سريعة عبر الهاتف للحالات الطارئة' },
                    { key: 'impactReports', label: 'تقارير الأثر الدورية', desc: 'تحديثات دورية عن أثر تبرعاتك' },
                    { key: 'zakatReminders', label: 'تذكير موعد الزكاة', desc: 'تذكير بحساب الزكاة السنوي' },
                    { key: 'campaignAlerts', label: 'تنبيهات الحملات', desc: 'إشعارات عند إطلاق حملات جديدة' },
                    { key: 'monthlyDigest', label: 'الملخص الشهري', desc: 'ملخص شهري لكامل نشاطك التطوعي' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100/50 transition-all">
                      <label htmlFor={item.key} className="flex-1 cursor-pointer">
                        <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </label>
                      <div className="relative">
                        <input
                          id={item.key}
                          type="checkbox"
                          defaultChecked={(preferences as any)[item.key]}
                          onChange={(e) => setPreferences({ ...preferences, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[var(--brand-green)] after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  التفضيلات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-1.5">اللغة</label>
                    <select id="language" defaultValue="ar" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none">
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-1.5">العملة</label>
                    <select id="currency" defaultValue="YER" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none">
                      <option value="YER">ريال يمني</option>
                      <option value="SAR">ريال سعودي</option>
                      <option value="USD">دولار أمريكي</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="theme" className="block text-sm font-semibold text-gray-700 mb-1.5">المظهر</label>
                    <select id="theme" defaultValue="light" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none">
                      <option value="light">فاتح</option>
                      <option value="dark">داكن</option>
                      <option value="system">تلقائي</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-gradient-to-l from-[var(--brand-green)] to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                حفظ التغييرات
              </motion.button>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[var(--brand-gold)]" />
                  الإشعارات
                  {activeNotifications > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">{activeNotifications} جديد</span>
                  )}
                </h3>
                <div className="space-y-3">
                  {DEFAULT_NOTIFICATIONS.map(notif => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                        notif.read ? 'bg-white hover:bg-gray-50' : 'bg-emerald-50 border border-emerald-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'donation' ? 'bg-green-100' :
                        notif.type === 'impact' ? 'bg-blue-100' :
                        notif.type === 'campaign' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <Bell className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{notif.title}</h4>
                          {!notif.read && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
                        </div>
                        <p className="text-sm text-gray-600">{notif.message}</p>
                        <span className="text-xs text-gray-400 mt-1 block">{notif.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowReceiptModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--brand-green)]/10 rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-[var(--brand-green)]" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">إيصال تبرع</h3>
              </div>
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">المشروع</span>
                  <span className="font-semibold text-gray-800">{showReceiptModal.project}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">المبلغ</span>
                  <span className="font-bold text-[var(--brand-green)]">{showReceiptModal.amount.toLocaleString('ar-SA')} {showReceiptModal.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">التاريخ</span>
                  <span className="font-semibold text-gray-800">{new Date(showReceiptModal.date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">الحالة</span>
                  <StatusBadge status={showReceiptModal.status} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReceiptModal(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
                >
                  إغلاق
                </button>
                <button className="flex-1 py-2.5 bg-[var(--brand-green)] text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  تحميل الإيصال
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowQrModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">رمز التبرع السريع</h3>
              <p className="text-sm text-gray-500 mb-6">امسح الرمز للتبرع مباشرة</p>
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-[var(--brand-green)] to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <QrCode className="w-32 h-32 text-white" />
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 bg-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
              >
                إغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">شارك إنجازك</h3>
              <p className="text-sm text-gray-500 mb-6 text-center">انشر أثر تبرعك وكن قدوة للآخرين</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: 'تويتر', label: 'تويتر', color: '#1DA1F2' },
                  { icon: 'واتساب', label: 'واتساب', color: '#25D366' },
                  { icon: 'فيسبوك', label: 'فيسبوك', color: '#1877F2' },
                ].map(social => (
                  <button
                    key={social.label}
                    className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-center"
                  >
                    <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1" style={{ backgroundColor: `${social.color}15` }}>
                      <Share2 className="w-5 h-5" style={{ color: social.color }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{social.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2.5 mt-4 bg-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
              >
                إغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}