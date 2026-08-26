// VolunteersPage - إدارة المتطوعين
import { motion } from 'motion/react';
import { Users, RefreshCw, Eye, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

import { volunteersQueries } from '@/lib/postgres';

interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string;
  field: string;
  motivation?: string;
  status: string;
  hours: number;
  created_at: string;
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const result = await volunteersQueries.findAll(100, 0);
      setVolunteers(result.rows || []);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await volunteersQueries.updateStatus(String(id), status);
      fetchVolunteers();
    } catch (err) {
      console.error('Error updating volunteer:', err);
    }
  };

  const filteredVolunteers = volunteers.filter(v => {
    if (filter === 'all') return true;
    return v.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'قيد المراجعة';
      default: return status;
    }
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      'إغاثة': 'إغاثة',
      'تعليم': 'تعليم',
      'صحة': 'صحة',
      'إدارة': 'إدارة',
      'تسويق': 'تسويق'
    };
    return labels[field] || field;
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
          <h1 className="text-2xl font-bold text-gray-800">المتطوعون</h1>
          <p className="text-gray-600">إدارة المتطوعين المسجلين</p>
        </div>
        <button
          onClick={fetchVolunteers}
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
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي المتطوعين</p>
              <p className="text-xl font-bold text-gray-800">{volunteers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">نشط</p>
              <p className="text-xl font-bold text-gray-800">
                {volunteers.filter(v => v.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">قيد المراجعة</p>
              <p className="text-xl font-bold text-gray-800">
                {volunteers.filter(v => v.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">ساعات التطوع</p>
              <p className="text-xl font-bold text-gray-800">
                {volunteers.reduce((sum, v) => sum + (v.hours || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        {['all', 'active', 'inactive', 'pending'].map(status => (
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
          {filteredVolunteers.length} متطوع
        </div>
      </div>

      {/* Volunteers List */}
      <div className="space-y-3">
        {filteredVolunteers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">لا يوجد متطوعين</p>
          </div>
        ) : (
          filteredVolunteers.map((volunteer, index) => (
            <motion.div
              key={volunteer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-800">{volunteer.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(volunteer.status)}`}>
                      {getStatusLabel(volunteer.status)}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {getFieldLabel(volunteer.field)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span>{volunteer.email}</span>
                    <span>{volunteer.phone}</span>
                    <span>📊 {volunteer.hours} ساعة</span>
                  </div>
                  {volunteer.motivation && (
                    <p className="text-sm text-gray-600 mb-1">الدافع: {volunteer.motivation}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(volunteer.created_at).toLocaleString('ar-SA')}
                  </p>
                </div>
                <div className="flex items-center gap-2 mr-4">
                  {volunteer.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(volunteer.id, 'active')}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="قبول"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => updateStatus(volunteer.id, 'inactive')}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="رفض"
                      >
                        <XCircle className="w-5 h-5 text-red-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}