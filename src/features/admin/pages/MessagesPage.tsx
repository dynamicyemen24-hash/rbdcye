// MessagesPage - إدارة رسائل التواصل
import { motion } from 'motion/react';
import { MessageSquare, RefreshCw, Eye, Trash2, Filter, Mail, Globe, Monitor, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

import { messagesQueries } from '@/lib/postgres';

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country_code?: string;
  country?: string;
  subject?: string;
  message: string;
  status: string;
  is_read: boolean;
  device_info?: any;
  geo_location?: any;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const result = await messagesQueries.findAll(100, 0);
      const messagesWithMeta = (result.rows || []).map((msg: any) => ({
        ...msg,
        device_info: msg.device_info || {},
        geo_location: msg.geo_location || null,
      }));
      setMessages(messagesWithMeta);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await messagesQueries.updateStatus(String(id), status);
      fetchMessages();
    } catch (err) {
      console.error('Error updating message:', err);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    try {
      const token = localStorage.getItem('rbdcye_admin_token') || '';
      await fetch(`/api/admin?action=contacts&id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-yellow-100 text-yellow-700';
      case 'replied': return 'bg-green-100 text-green-700';
      case 'archived': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'جديد';
      case 'read': return 'مقروء';
      case 'replied': return 'تم الرد';
      case 'archived': return 'مؤرشف';
      default: return status;
    }
  };

  const getDeviceIcon = (deviceInfo: any) => {
    const device = deviceInfo?.device || 'desktop';
    switch (device) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      default: return '💻';
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
          <h1 className="text-2xl font-bold text-gray-800">الرسائل</h1>
          <p className="text-gray-600">إدارة رسائل التواصل الواردة</p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          تحديث
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <Filter className="w-5 h-5 text-gray-400" />
        <div className="flex gap-2">
          {['all', 'new', 'read', 'replied', 'archived'].map(status => (
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
        </div>
        <div className="flex items-center gap-2 mr-auto text-sm text-gray-500">
          <MessageSquare className="w-4 h-4" />
          <span>{filteredMessages.length} رسالة</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">لا توجد رسائل</p>
          </div>
        ) : (
          filteredMessages.map((msg, index) => {
            const deviceInfo = msg.device_info || {};
            const geoLocation = msg.geo_location;
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all ${
                  selectedId === msg.id ? 'border-emerald-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-800">{msg.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(msg.status)}`}>
                        {getStatusLabel(msg.status)}
                      </span>
                      {!msg.is_read && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          غير مقروء
                        </span>
                      )}
                      {msg.country && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {msg.country}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>{msg.email}</span>
                      {msg.phone && <span>{msg.phone}</span>}
                      {msg.subject && <span>• {msg.subject}</span>}
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">{msg.message}</p>
                    
                    {/* Device & Geo Info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {getDeviceIcon(deviceInfo)}
                        {deviceInfo.browser && <span>{deviceInfo.browser}</span>}
                        {deviceInfo.os && <span>• {deviceInfo.os}</span>}
                      </span>
                      
                      {geoLocation && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <MapPin className="w-3 h-3" />
                          {geoLocation.city && <span>{geoLocation.city}</span>}
                          {geoLocation.country && <span>• {geoLocation.country}</span>}
                        </span>
                      )}
                      
                      {msg.referrer && (
                        <span className="text-gray-400 truncate max-w-[200px]">
                          المصدر: {new URL(msg.referrer).pathname}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(msg.created_at).toLocaleString('ar-SA')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mr-4">
                    <button
                      onClick={() => setSelectedId(selectedId === msg.id ? null : msg.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="عرض"
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    {msg.status !== 'replied' && (
                      <button
                        onClick={() => updateStatus(msg.id, 'replied')}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                      >
                        رد
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}