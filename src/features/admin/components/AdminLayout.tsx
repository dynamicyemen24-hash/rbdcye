// AdminLayout - هيكل لوحة التحكم الموحد
import { motion } from 'motion/react';
import { LayoutDashboard, MessageSquare, Heart, Users, Settings, Video, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { path: '/admin/messages', icon: MessageSquare, label: 'الرسائل' },
  { path: '/admin/donations', icon: Heart, label: 'التبرعات' },
  { path: '/admin/volunteers', icon: Users, label: 'المتطوعون' },
  { path: '/admin/videos', icon: Video, label: 'الفيديوهات' },
  { path: '/admin/settings', icon: Settings, label: 'الإعدادات' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-lg font-bold text-gray-800">لوحة التحكم</h1>
        <div className="w-10" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 shadow-xl lg:translate-x-0 lg:static lg:block"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">لوحة التحكم</h2>
                <p className="text-xs text-gray-500">رحماء بينهم</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/admin' && location.pathname.startsWith(item.path));
                
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2024-2026 رحماء بينهم
            </p>
          </div>
        </motion.aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            role="button"
            tabIndex={0}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSidebarOpen(false);
              }
            }}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}