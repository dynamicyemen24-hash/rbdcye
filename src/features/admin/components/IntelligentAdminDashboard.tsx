// Intelligent Admin Dashboard - Institutional Grade with Deep Analytics
import { motion } from 'motion/react';
import { 
  Activity, TrendingUp, Users, DollarSign, 
  Calendar, AlertCircle, CheckCircle, XCircle,
  Brain, Zap, Target, BarChart3, PieChart,
  ArrowUp, ArrowDown, Eye, MousePointer,
  Clock, Globe, Smartphone, Monitor,
  MessageSquare, Bell
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, ResponsiveContainer, Cell } from 'recharts';

// AI-Powered Insights Component
const AIInsightsPanel = () => {
  const [insights] = useState([
    {
      type: 'opportunity',
      icon: TrendingUp,
      title: 'فرصة نمو ذكية',
      text: 'التبرعات زادت 23% هذا الشهر - يُنصح بتكثيف حملة التبرع السريع',
      confidence: 94,
      action: 'عرض التفاصيل'
    },
    {
      type: 'alert',
      icon: AlertCircle,
      title: 'تنبيه ذكي',
      text: '12 متطوع جديد بانتظار الموافقة - متوسط وقت الرد: 48 ساعة',
      confidence: 88,
      action: 'مراجعة الطلبات'
    },
    {
      type: 'prediction',
      icon: Brain,
      title: 'توقع ذكي',
      text: 'زيادة متوقعة في الزيارات خلال الأسبوع القادم بنسبة 35%',
      confidence: 91,
      action: 'الاستعداد'
    }
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">رؤى ذكية مدعومة بالذكاء الاصطناعي</h3>
          <p className="text-sm text-gray-500">تحليلات تنبؤية وتوصيات ذاتية</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-l from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              insight.type === 'opportunity' ? 'bg-green-100 text-green-600' :
              insight.type === 'alert' ? 'bg-orange-100 text-orange-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              <insight.icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  insight.confidence >= 90 ? 'bg-green-100 text-green-700' :
                  insight.confidence >= 80 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {insight.confidence}% دقة
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{insight.text}</p>
              <button className="text-xs font-medium text-[var(--brand-green)] hover:text-[var(--brand-green-light)] transition-colors">
                {insight.action} ←
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Pre-generated chart data (memoized for performance)
const generateChartData = () => Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: Math.floor(Math.random() * 1000) + 700
}));

const generateMiniChartData = (multiplier: number, offset: number) => Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: Math.floor(Math.random() * multiplier) + offset
}));

// Advanced Metrics Grid with Deep Analytics
const AdvancedMetricsGrid = () => {
  const metrics = [
    {
      label: 'إجمالي الزوار',
      value: '24.8K',
      change: +15.3,
      icon: Eye,
      color: 'blue',
      chartData: generateChartData()
    },
    {
      label: 'معدل التفاعل',
      value: '3.2%',
      change: +0.8,
      icon: MousePointer,
      color: 'purple',
      chartData: generateMiniChartData(5, 2)
    },
    {
      label: 'متوسط المدة',
      value: '4.5 دقيقة',
      change: -0.3,
      icon: Clock,
      color: 'orange',
      chartData: generateMiniChartData(3, 3)
    },
    {
      label: 'مصادر الزيارات',
      value: '12 دولة',
      change: +3,
      icon: Globe,
      color: 'green',
      chartData: []
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-${metric.color}-100 rounded-xl flex items-center justify-center`}>
              <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {Math.abs(metric.change)}%
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
          <p className="text-sm text-gray-500 mb-4">{metric.label}</p>

          {metric.chartData.length > 0 && (
            <div className="h-16 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metric.chartData}>
                  <defs>
                    <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={`var(--brand-${metric.color})`} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={`var(--brand-${metric.color})`} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={`var(--brand-${metric.color})`} fill={`url(#gradient-${index})`} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// User Behavior Analytics
const UserBehaviorAnalytics = () => {
  const behaviorData = useMemo(() => [
    { name: 'الصفحة الرئيسية', visits: 4521, percentage: 35 },
    { name: 'التبرعات', visits: 2890, percentage: 22 },
    { name: 'الأخبار', visits: 1980, percentage: 15 },
    { name: 'التطوع', visits: 1654, percentage: 13 },
    { name: 'البرامج', visits: 1432, percentage: 11 },
    { name: 'أخرى', visits: 520, percentage: 4 },
  ], []);

  const COLORS = ['#0F4C3A', '#10B981', '#059669', '#34D399', '#6EE7B7', '#A7F3D0'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">تحليل سلوك المستخدمين</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPie>
              <Pie data={behaviorData} dataKey="visits" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {behaviorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {behaviorData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-800">{item.visits}</span>
                <span className="text-xs text-gray-500 w-12 text-left">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Smart Notifications Center
const SmartNotificationsCenter = () => {
  const [notifications] = useState([
    {
      id: '1',
      type: 'message',
      title: 'رسالة جديدة',
      text: 'تم استلام رسالة جديدة من أحمد محمد',
      time: 'منذ 5 دقائق',
      read: false
    },
    {
      id: '2',
      type: 'donation',
      title: 'تبرع جديد',
      text: 'تم استلام تبرع بقيمة 500$ لمشروع التعليم',
      time: 'منذ 15 دقيقة',
      read: false
    },
    {
      id: '3',
      type: 'volunteer',
      title: 'متطوع جديد',
      text: 'سارة أحمد سجلت للتطوع في مجال الصحة',
      time: 'منذ ساعة',
      read: true
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'donation': return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'volunteer': return <Users className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">الإشعارات الذكية</h3>
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
          {notifications.filter(n => !n.read).length} جديد
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
              notification.read ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-100'
            }`}
          >
            {getNotificationIcon(notification.type)}
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-800">{notification.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{notification.text}</p>
              <span className="text-xs text-gray-400 mt-2 block">{notification.time}</span>
            </div>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Main Intelligent Admin Dashboard
export default function IntelligentAdminDashboard() {
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 247,
    currentDonations: 1250,
    pendingMessages: 8,
    systemHealth: 99.9
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        currentDonations: prev.currentDonations + Math.floor(Math.random() * 100),
        pendingMessages: Math.max(0, prev.pendingMessages + Math.floor(Math.random() * 3) - 1),
        systemHealth: 99.5 + Math.random() * 0.5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header with Real-time Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم الذكية</h1>
          <p className="text-gray-600 mt-1">مراقبة وتحليلات مؤسسية متقدمة</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">النظام نشط</span>
          </div>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleString('ar-SA')}
          </div>
        </div>
      </div>

      {/* Real-time Ticker */}
      <div className="bg-gradient-to-r from-[#0a2e1f] via-[var(--brand-green)] to-[#0a2e1f] rounded-xl p-4 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{realtimeData.activeUsers}</div>
            <div className="text-xs text-white/80">مستخدم نشط</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${realtimeData.currentDonations}</div>
            <div className="text-xs text-white/80">تبرعات اليوم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{realtimeData.pendingMessages}</div>
            <div className="text-xs text-white/80">رسائل معلقة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{realtimeData.systemHealth.toFixed(1)}%</div>
            <div className="text-xs text-white/80">صحة النظام</div>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      <AIInsightsPanel />

      {/* Advanced Metrics */}
      <AdvancedMetricsGrid />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserBehaviorAnalytics />
        <SmartNotificationsCenter />
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">أداء الفريق</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">معدل الاستجابة</span>
              <span className="text-sm font-semibold text-green-600">2.5 ساعة</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">رضا المستفيدين</h4>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-[var(--brand-green)]">4.8/5</div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`w-6 h-6 rounded ${i <= 4 ? 'bg-[var(--brand-gold)]' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">مؤشر الأثر</h4>
          <div className="text-3xl font-bold text-purple-600">Excellent</div>
          <p className="text-sm text-gray-500 mt-1">12,847 مستفيد مباشر</p>
        </div>
      </div>
    </div>
  );
}