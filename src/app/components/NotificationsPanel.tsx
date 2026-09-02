// Notifications Panel - لوحة الإشعارات
import { X, Bell, CheckCircle, XCircle, Info, AlertTriangle, Check } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type:
    | "donation_approved"
    | "donation_rejected"
    | "request_approved"
    | "request_replied"
    | "volunteer_approved"
    | "system"
    | "reminder";
  title: string;
  message: string;
  status: "unread" | "read" | "archived";
  priority: "low" | "normal" | "high" | "urgent";
  created_at: string;
  read_at?: string;
}

export default function NotificationsPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Try to fetch from API
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        // Fallback to empty array
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, status: "read" as const, read_at: new Date().toISOString() } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) =>
          n.status === "unread"
            ? { ...n, status: "read" as const, read_at: new Date().toISOString() }
            : n
        )
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const archiveNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/archive`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "archived" as const } : n))
      );
    } catch (error) {
      console.error("Error archiving notification:", error);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "donation_approved":
      case "request_approved":
      case "volunteer_approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "donation_rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "request_replied":
        return <Info className="w-5 h-5 text-blue-600" />;
      case "system":
      case "reminder":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "urgent":
        return "border-red-500 bg-red-50";
      case "high":
        return "border-amber-500 bg-amber-50";
      case "normal":
        return "border-blue-500 bg-blue-50";
      case "low":
        return "border-gray-300 bg-white";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return n.status === "unread";
    if (filter === "read") return n.status === "read";
    return n.status !== "archived";
  });

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end" style={{ direction: "rtl" }}>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-black/50 backdrop:blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="لوحة الإشعارات"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[var(--brand-green)]" />
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>الإشعارات</h3>
            {unreadCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs"
                style={{ fontSize: "0.7rem", fontWeight: 700 }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--brand-green)] transition-colors"
                title="تعليم الكل كمقروء"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
            >
              <X className="w-4 h-4 text-[var(--muted-foreground)]" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 p-3 border-b border-[var(--border)] bg-[var(--muted)]/30">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filter === f
                  ? "bg-[var(--brand-green)] text-white"
                  : "bg-white text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
              style={{ fontSize: "0.78rem", fontWeight: 600 }}
            >
              {f === "all" ? "الكل" : f === "unread" ? "غير مقروء" : "مقروء"}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Bell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500" style={{ fontSize: "0.85rem" }}>
                لا توجد إشعارات
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => {
                const handleClick = () => {
                  if (notification.status === "unread") {
                    markAsRead(notification.id);
                  }
                };

                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border-r-4 ${getPriorityColor(notification.priority)} ${
                      notification.status === "unread" ? "" : "opacity-75"
                    } hover:shadow-md transition-all cursor-pointer`}
                    onClick={handleClick}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick();
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`إشعار: ${notification.title}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                            {notification.title}
                          </h4>
                          {notification.status === "unread" && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--muted-foreground)",
                            lineHeight: "1.6",
                          }}
                          className="mb-2"
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span style={{ fontSize: "0.68rem", color: "var(--muted-foreground)" }}>
                            {new Date(notification.created_at).toLocaleString("ar-SA")}
                          </span>
                          <div className="flex items-center gap-1">
                            {notification.status === "unread" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-1 rounded hover:bg-blue-100 text-blue-600 transition-colors"
                                title="تعليم كمقروء"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                archiveNotification(notification.id);
                              }}
                              className="p-1 rounded hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                              title="أرشفة"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
