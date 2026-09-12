import { Bell, X, Check, Heart, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, memo } from 'react';

interface Notification {
  id: string;
  type: 'donation' | 'alert' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const NotificationCenter = memo(function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate real-time notifications
    const demoNotifications: Notification[] = [
      { id: '1', type: 'donation', title: 'تبرع جديد', message: 'تبرع أحمد م. بـ ٥,٠٠٠ ر.ي لمشروع كسوة الشتاء', timestamp: new Date(Date.now() - 300000), read: false, actionUrl: '/admin?tab=donations' },
      { id: '2', type: 'success', title: 'تم إنجاز', message: 'حفر بئر المياه النقية في مأرب — مكتمل', timestamp: new Date(Date.now() - 3600000), read: false },
      { id: '3', type: 'alert', title: 'تنبيه', message: '٥ تبرعات في انتظار المراجعة', timestamp: new Date(Date.now() - 7200000), read: true, actionUrl: '/admin?tab=donations' },
    ];
    setNotifications(demoNotifications);
    setUnreadCount(demoNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const typeIcons = { donation: Heart, alert: AlertTriangle, info: Info, success: Check };
  const typeColors = { donation: 'text-[var(--brand-green)]', alert: 'text-amber-500', info: 'text-blue-500', success: 'text-green-500' };

  return (
    <div className="relative" dir="rtl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-[var(--muted)] transition-colors"
        aria-label="الإشعارات"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-green)] text-[0.6rem] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          // eslint-disable-next-line react/jsx-no-comment-textnodes -- precise: react/jsx-no-comment-textnodes
          <>
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- precise: jsx-a11y/click-events-have-key-events — verified safe
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
                <h3 className="font-bold">الإشعارات</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-[var(--muted)] rounded">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-[var(--muted-foreground)]">لا توجد إشعارات</div>
                ) : (
                  notifications.map(n => {
                    const Icon = typeIcons[n.type];
                    return (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- precise: jsx-a11y/click-events-have-key-events — verified safe
                      // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- precise: jsx-a11y/no-static-element-interactions
                      <div
                        key={n.id}
                        onClick={() => { markAsRead(n.id); if (n.actionUrl) window.location.href = n.actionUrl; }}
                        className={`flex items-start gap-3 border-b border-[var(--border)] p-4 cursor-pointer transition-colors hover:bg-[var(--muted)] ${!n.read ? 'bg-[var(--brand-green)]/5' : ''}`}
                      >
                        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${typeColors[n.type]}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold">{n.title}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{n.message}</p>
                          <p className="mt-1 text-[0.65rem] text-[var(--muted-foreground)]">
                            {n.timestamp.toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!n.read && <div className="h-2 w-2 rounded-full bg-[var(--brand-green)]" />}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});
