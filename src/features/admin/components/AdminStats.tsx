// AdminStats - بطاقات الإحصائيات المتكاملة مع قاعدة البيانات
import { motion } from 'motion/react';
import { MessageSquare, Heart, Users, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { messagesQueries, donationsQueries, volunteersQueries } from '@/lib/postgres';

interface StatsData {
  messages: { total: number; new: number; read: number; replied: number };
  donations: { total: number; amount: number; pending: number; completed: number };
  volunteers: { total: number; active: number; pending: number };
  performance: number;
}

export const AdminStats = () => {
  const [stats, setStats] = useState<StatsData>({
    messages: { total: 0, new: 0, read: 0, replied: 0 },
    donations: { total: 0, amount: 0, pending: 0, completed: 0 },
    volunteers: { total: 0, active: 0, pending: 0 },
    performance: 95,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [messagesResult, donationsResult, volunteersResult] = await Promise.all([
        messagesQueries.getStats(),
        donationsQueries.getStats(),
        volunteersQueries.getStats(),
      ]);

      const messagesStats = messagesResult.rows?.[0] || { total: 0, new: 0, read: 0, replied: 0 };
      const donationsStats = donationsResult.rows?.[0] || { total: 0, amount: 0, pending: 0, completed: 0 };
      const volunteersStats = volunteersResult.rows?.[0] || { total: 0, active: 0, pending: 0 };

      setStats({
        messages: {
          total: messagesStats.total || 0,
          new: messagesStats.new || 0,
          read: messagesStats.read || 0,
          replied: messagesStats.replied || 0,
        },
        donations: {
          total: donationsStats.total || 0,
          amount: donationsStats.amount || 0,
          pending: donationsStats.pending || 0,
          completed: donationsStats.completed || 0,
        },
        volunteers: {
          total: volunteersStats.total || 0,
          active: volunteersStats.active || 0,
          pending: volunteersStats.pending || 0,
        },
        performance: 95,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('فشل تحميل البيانات من قاعدة البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'الرسائل',
      value: stats.messages.total,
      subtitle: `${stats.messages.new} جديد`,
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'التبرعات',
      value: stats.donations.total,
      subtitle: `${stats.donations.amount.toLocaleString()} ريال`,
      icon: Heart,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      title: 'المتطوعون',
      value: stats.volunteers.total,
      subtitle: 'مسجل',
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'أداء الموقع',
      value: `${stats.performance}%`,
      subtitle: 'ممتاز',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchStats}
            className="text-sm text-red-600 underline mt-1"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <button
              onClick={fetchStats}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="تحديث"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
          <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;