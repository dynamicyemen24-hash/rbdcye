// DonationsPage - إدارة التبرعات
import { motion } from 'motion/react';
import { Heart, RefreshCw, Eye, Trash2, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

import { donationsQueries } from '@/lib/postgres';

interface Donation {
  id: number;
  donor: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  project?: string;
  method: string;
  type: string;
  status: string;
  anonymous: boolean;
  notes?: string;
  created_at: string;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, amount: 0, pending: 0, completed: 0 });

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const result = await donationsQueries.findAll(100, 0);
      const data = result.rows || [];
      setDonations(data);
      
      // Calculate stats
      const total = data.length;
      const amount = data.reduce((sum: number, d: Donation) => sum + (d.amount || 0), 0);
      const pending = data.filter((d: Donation) => d.status === 'pending').length;
      const completed = data.filter((d: Donation) => d.status === 'completed').length;
      
      setStats({ total, amount, pending, completed });
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await donationsQueries.updateStatus(String(id), status);
      fetchDonations();
    } catch (err) {
      console.error('Error updating donation:', err);
    }
  };

  const filteredDonations = donations.filter(d => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'معلق';
      case 'completed': return 'مكتمل';
      case 'failed': return 'فاشل';
      case 'refunded': return 'مسترجع';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">التبرعات</h1>
          <p className="text-gray-600">إدارة والتبرعات الواردة</p>
        </div>
        <button
          onClick={fetchDonations}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          تحديث
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي التبرعات</p>
              <p className="text-xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي المبالغ</p>
              <p className="text-xl font-bold text-gray-800">{stats.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">معلق</p>
              <p className="text-xl font-bold text-gray-800">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">مكتمل</p>
              <p className="text-xl font-bold text-gray-800">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        {['all', 'pending', 'completed', 'failed', 'refunded'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === status
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'الكل' : getStatusLabel(status)}
          </button>
        ))}
        <div className="mr-auto text-sm text-gray-500">
          {filteredDonations.length} تبرع
        </div>
      </div>

      {/* Donations List */}
      <div className="space-y-3">
        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">لا توجد تبرعات</p>
          </div>
        ) : (
          filteredDonations.map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-800">
                      {donation.anonymous ? 'متبرع مجهول' : donation.donor}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(donation.status)}`}>
                      {getStatusLabel(donation.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span>{donation.email}</span>
                    <span>{donation.phone}</span>
                    <span className="text-emerald-600 font-bold">
                      {donation.amount.toLocaleString()} {donation.currency}
                    </span>
                  </div>
                  {donation.project && (
                    <p className="text-sm text-gray-600 mb-1">المشروع: {donation.project}</p>
                  )}
                  {donation.notes && (
                    <p className="text-sm text-gray-500">ملاحظات: {donation.notes}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(donation.created_at).toLocaleString('ar-SA')}
                  </p>
                </div>
                <div className="flex items-center gap-2 mr-4">
                  {donation.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(donation.id, 'completed')}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                    >
                      تأكيد
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="عرض">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}