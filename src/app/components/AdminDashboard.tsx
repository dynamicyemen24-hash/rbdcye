// ============================================================
// AdminDashboard.tsx - النسخة النهائية المتصلة بقاعدة البيانات
// تم إصلاح جميع المكونات المفقودة ومسارات الاستيراد
// ============================================================
import {
  LayoutDashboard,
  Newspaper,
  FolderOpen,
  Star,
  Handshake,
  FileText,
  Image,
  MessageSquare,
  Users,
  Settings,
  X,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Globe,
  ChevronDown,
  Search,
  Bell,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  DollarSign,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Heart,
  Activity,
} from "lucide-react";
import { useState, useEffect, useCallback, ReactNode } from "react";

import SettingsPage from "@/features/admin/pages/SettingsPage";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { realAnalyticsService } from '@/services/admin/real-analytics.service';
import {
  newsDashboardService as newsService,
  storiesDashboardService as storiesService,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  projectsDashboardService as projectsService,
  reportsDashboardService as reportsService,
  mediaDashboardService as mediaService,
  partnersDashboardService as partnersService,
  donationsDashboardService as donationsService,
  requestsDashboardService as requestsService,
  volunteersDashboardService as volunteersService,
  subscribersDashboardService as subscribersService,
  usersDashboardService as usersService,
  dashboardService,
} from "@/shared/services/dashboard.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { postgresService } from "@/shared/services/postgres.service";

import { ProjectManager } from "./admin/ProjectManager";
import { RequestsDashboard } from './admin/RequestsDashboard';
import { AdminAnalytics } from "./AdminAnalytics";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AdminDashboardExtras from "./AdminDashboardExtras";
import NotificationsPanel from "./NotificationsPanel";
import { useToast, useConfirm } from "./Toast";
import { DashboardWidgets } from '../components/admin/DashboardWidgets';
import { ExportButton } from '../components/admin/ExportButton';
import { Pagination } from '../components/admin/Pagination';
import SmartAlerts from '../components/admin/SmartAlerts';



// ============================================================
// استيراد الخدمات (Services) المتصلة بـ Supabase/LocalStorage
// ============================================================

// ============================================================
// 1. المكونات المساعدة الأساسية (Helper Components)
// ============================================================

// ===== Modal =====
function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly children: ReactNode;
  readonly size?: "sm" | "md" | "lg";
}) {
  const widthMap = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };
  return (
    <dialog
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 m-0"
      open={isOpen}
      onClose={onClose}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative bg-[var(--card)] rounded-2xl p-6 w-full ${widthMap[size]} shadow-2xl max-h-[90vh] overflow-y-auto`}
        style={{ direction: "rtl" }}
      >
        <div className="flex items-center justify-between mb-5 sticky top-0 bg-[var(--card)] pb-3 border-b border-[var(--border)] z-10">
          <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            <X className="w-4 h-4 text-[var(--muted-foreground)]" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

// ===== StatusBadge =====
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "نشط", color: "var(--brand-green)", bg: "var(--brand-green-pale)" },
  completed: { label: "مكتمل", color: "#2563EB", bg: "#EFF6FF" },
  pending: { label: "قيد الانتظار", color: "var(--brand-gold)", bg: "var(--brand-gold-pale)" },
  new: { label: "جديد", color: "#E74C3C", bg: "#FEF2F2" },
  read: { label: "مقروء", color: "var(--muted-foreground)", bg: "var(--muted)" },
  replied: { label: "تم الرد", color: "var(--brand-green)", bg: "var(--brand-green-pale)" },
  archived: { label: "مؤرشف", color: "#6B7280", bg: "#F3F4F6" },
  published: { label: "منشور", color: "var(--brand-green)", bg: "var(--brand-green-pale)" },
  draft: { label: "مسودة", color: "var(--brand-gold)", bg: "var(--brand-gold-pale)" },
  PUBLISHED: { label: "منشور", color: "var(--brand-green)", bg: "var(--brand-green-pale)" },
  DRAFT: { label: "مسودة", color: "var(--brand-gold)", bg: "var(--brand-gold-pale)" },
  failed: { label: "فشل", color: "#E74C3C", bg: "#FEF2F2" },
  refunded: { label: "مسترجع", color: "#6B7280", bg: "#F3F4F6" },
  inactive: { label: "غير نشط", color: "#6B7280", bg: "#F3F4F6" },
  suspended: { label: "موقوف", color: "#E74C3C", bg: "#FEF2F2" },
  closed: { label: "مغلق", color: "#6B7280", bg: "#F3F4F6" },
  paid: { label: "مدفوع", color: "var(--brand-green)", bg: "var(--brand-green-pale)" },
  cancelled: { label: "ملغي", color: "#E74C3C", bg: "#FEF2F2" },
  success: { label: "ناجح", color: "var(--brand-green)", bg: "var(--brand-green-pale)" },
};

function StatusBadge({ status }: { readonly status: string }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: "var(--muted-foreground)",
    bg: "var(--muted)",
  };
  return (
    <span
      className="px-2.5 py-1 rounded-full"
      style={{ fontSize: "0.68rem", fontWeight: 700, background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

// ===== StatCard =====
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  color,
  onClick,
}: {
  readonly label: string;
  readonly value: string | number;
  readonly trend?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly icon: any;
  readonly color: string;
  readonly onClick?: () => void;
}) {
  const Wrapper = onClick ? "button" : ("div" as const);
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] ${onClick ? "cursor-pointer hover:shadow-md hover:border-[var(--brand-green)]/40" : ""} transition-all`}
      style={onClick ? { background: "transparent", border: "none" } : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <span
            className="px-2 py-0.5 rounded-full bg-green-50 text-green-600"
            style={{ fontSize: "0.62rem", fontWeight: 600 }}
          >
            {trend}
          </span>
        )}
      </div>
      <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--foreground)" }}>
        {value}
      </div>
      <div
        className="text-[var(--muted-foreground)]"
        style={{ fontSize: "0.72rem", fontWeight: 500 }}
      >
        {label}
      </div>
    </Wrapper>
  );
}

// ===== SearchBar =====
function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "بحث..."}
                className="w-64 pr-9 pl-4 py-2.5 border border-[var(--border)] rounded-xl bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)] transition-colors"
        style={{ fontSize: "0.82rem" }}
        aria-label={placeholder || "بحث"}
      />
    </div>
  );
}

// ===== EmptyState =====
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EmptyState({ icon: Icon, title, message }: { icon: any; title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[var(--muted-foreground)]" />
      </div>
      <div
        style={{
          fontSize: "0.95rem",
          fontWeight: 700,
          color: "var(--foreground)",
          marginBottom: "0.25rem",
        }}
      >
        {title}
      </div>
      <div className="text-[var(--muted-foreground)]" style={{ fontSize: "0.82rem" }}>
        {message}
      </div>
    </div>
  );
}

// ===== DataTable =====
function DataTable({
  data,
  columns,
  loading,
  onView,
  onEdit,
  onDelete,
  onToggle,
  emptyIcon,
  emptyTitle,
  emptyMessage,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly columns: any[];
  readonly loading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly onView?: (item: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly onEdit?: (item: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly onDelete?: (item: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly onToggle?: (item: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly emptyIcon?: any;
  readonly emptyTitle?: string;
  readonly emptyMessage?: string;
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--brand-green)]" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon || FileText}
        title={emptyTitle || "لا توجد بيانات"}
        message={emptyMessage || "لا توجد عناصر لعرضها"}
      />
    );
  }

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {columns.map((col: any) => (
                <th
                  key={col.key}
                  className="text-right px-4 py-3 text-[var(--muted-foreground)]"
                  style={{ fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  {col.label}
                </th>
              ))}
              {(onView || onEdit || onDelete || onToggle) && (
                <th
                  className="text-center px-4 py-3 text-[var(--muted-foreground)]"
                  style={{ fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  إجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={item.id || idx}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/50 transition-colors"
              >
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {columns.map((col: any) => (
                  <td key={col.key} className="px-4 py-3" style={{ fontSize: "0.82rem" }}>
                    {col.render ? col.render(item) : (item[col.key] ?? "—")}
                  </td>
                ))}
                {(onView || onEdit || onDelete || onToggle) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                          title="عرض"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors"
                          title="تعديل"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (confirm("هل أنت متأكد من الحذف؟")) onDelete(item);
                          }}
                          className="p-1.5 rounded-lg hover:bg-[var(--danger-bg)] text-[var(--destructive)] hover:text-[var(--destructive)] transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onToggle && (
                        <button
                          onClick={() => onToggle(item)}
                          className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
                          title="تغيير الحالة"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== GenericForm =====
function GenericForm({
  fields,
  editItem,
  onSave,
  onCancel,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly fields: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly editItem?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly onSave: (data: any) => void;
  readonly onCancel: () => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<any>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initial: any = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields.forEach((f: any) => {
      initial[f.key] = editItem?.[f.key] || "";
    });
    return initial;
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, id: editItem?.id || Date.now() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {fields.map((field: any) =>
        field.multiline ? (
          <div key={field.key} className="mb-4">
            <label
              className="block mb-1.5 text-[var(--foreground)]"
              style={{ fontSize: "0.82rem", fontWeight: 600 }}
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={form[field.key] || ""}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              required={field.required}
              rows={4}
              className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)] bg-[var(--card)] transition-colors"
              style={{ fontSize: "0.85rem", resize: "vertical" }}
            />
          </div>
        ) : field.options ? (
          <div key={field.key} className="mb-4">
            <label
              className="block mb-1.5 text-[var(--foreground)]"
              style={{ fontSize: "0.82rem", fontWeight: 600 }}
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              value={form[field.key] || ""}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              required={field.required}
              className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)] transition-colors"
              style={{ fontSize: "0.85rem" }}
            >
              <option value="">اختر...</option>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {field.options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div key={field.key} className="mb-4">
            <label
              className="block mb-1.5 text-[var(--foreground)]"
              style={{ fontSize: "0.82rem", fontWeight: 600 }}
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type || "text"}
              value={form[field.key] || ""}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              required={field.required}
              placeholder={field.label}
              className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)] bg-[var(--card)] transition-colors"
              style={{ fontSize: "0.85rem" }}
            />
          </div>
        )
      )}
      <div className="flex gap-3 pt-4 border-t border-[var(--border)] mt-6">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors disabled:opacity-50"
          style={{ fontSize: "0.85rem", fontWeight: 600 }}
        >
          {saving ? "جاري الحفظ..." : editItem ? "تحديث" : "إضافة"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors disabled:opacity-50"
          style={{ fontSize: "0.85rem" }}
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}

// ===== NewsForm =====
function NewsForm({
  editItem,
  onSave,
  onCancel,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editItem?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: editItem?.title || "",
    content: editItem?.content || "",
    excerpt: editItem?.excerpt || "",
    category: editItem?.category || "",
    image: editItem?.image || "",
    status: editItem?.status || "DRAFT",
    date: editItem?.date || new Date().toISOString().split("T")[0],
    tags: editItem?.tags || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      tags: form.tags ? form.tags.split(",").map((t: string) => t.trim()) : [],
      id: editItem?.id || Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label
          htmlFor="news-title"
          className="block mb-1.5 text-[var(--foreground)]"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          العنوان *
        </label>
        <input
          id="news-title"
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)] bg-[var(--card)]"
          style={{ fontSize: "0.85rem" }}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="news-content"
          className="block mb-1.5 text-[var(--foreground)]"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          المحتوى
        </label>
        <textarea
          id="news-content"
          rows={5}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
          style={{ fontSize: "0.85rem", resize: "vertical" }}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="news-excerpt"
          className="block mb-1.5 text-[var(--foreground)]"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          الملخص
        </label>
        <textarea
          id="news-excerpt"
          rows={3}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
          style={{ fontSize: "0.85rem", resize: "vertical" }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="news-category"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            التصنيف
          </label>
          <select
            id="news-category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          >
            <option value="">اختر...</option>
            <option value="إغاثي">إغاثي</option>
            <option value="تعليمي">تعليمي</option>
            <option value="تنموي">تنموي</option>
            <option value="صحي">صحي</option>
            <option value="دعوي">دعوي</option>
            <option value="عام">عام</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="news-status"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            الحالة
          </label>
          <select
            id="news-status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          >
            <option value="PUBLISHED">منشور</option>
            <option value="DRAFT">مسودة</option>
            <option value="ARCHIVED">مؤرشف</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="news-image"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            رابط الصورة
          </label>
          <input
            id="news-image"
            type="url"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://..."
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="news-date"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            التاريخ
          </label>
          <input
            id="news-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="news-tags"
          className="block mb-1.5 text-[var(--foreground)]"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          الوسوم (مفصولة بفاصلة)
        </label>
        <input
          id="news-tags"
          type="text"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="إغاثة, تعليم, تنمية"
          className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
          style={{ fontSize: "0.85rem" }}
        />
      </div>
      <div className="flex gap-3 pt-4 border-t border-[var(--border)] mt-6">
        <button
          type="submit"
          className="flex-1 py-2.5 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
          style={{ fontSize: "0.85rem", fontWeight: 600 }}
        >
          {editItem ? "تحديث" : "إضافة"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors"
          style={{ fontSize: "0.85rem" }}
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}

// ===== DonationForm =====
function DonationForm({
  form,
  setForm,
  onSave,
  onCancel,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: (f: any) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="donor-name"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            اسم المتبرع *
          </label>
          <input
            id="donor-name"
            type="text"
            value={form.donor}
            onChange={(e) => setForm({ ...form, donor: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="donor-amount"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            المبلغ *
          </label>
          <input
            id="donor-amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            min="1"
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="donor-email"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            البريد الإلكتروني
          </label>
          <input
            id="donor-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="donor-phone"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            رقم الهاتف
          </label>
          <input
            id="donor-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="donor-project"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            المشروع
          </label>
          <input
            id="donor-project"
            type="text"
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="donor-method"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            طريقة الدفع
          </label>
          <select
            id="donor-method"
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          >
            <option value="card">بطاقة ائتمان</option>
            <option value="bank">تحويل بنكي</option>
            <option value="cash">نقدي</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="donor-type"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            النوع
          </label>
          <select
            id="donor-type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          >
            <option value="once">تبرع لمرة واحدة</option>
            <option value="monthly">شهري</option>
            <option value="yearly">سنوي</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="donor-status"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            الحالة
          </label>
          <select
            id="donor-status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)]"
            style={{ fontSize: "0.85rem" }}
          >
            <option value="pending">معلق</option>
            <option value="completed">مكتمل</option>
            <option value="failed">فاشل</option>
            <option value="refunded">مسترجع</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t border-[var(--border)] mt-6">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors disabled:opacity-50"
          style={{ fontSize: "0.85rem", fontWeight: 600 }}
        >
          {saving ? "جاري الحفظ..." : "تسجيل التبرع"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors disabled:opacity-50"
          style={{ fontSize: "0.85rem" }}
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}

// ===== GenericSection =====
function GenericSection({
  service,
  title,
  searchPlaceholder,
  emptyIcon,
  emptyTitle,
  emptyMessage,
  columns,
  formFields,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any;
  title: string;
  searchPlaceholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emptyIcon?: any;
  emptyTitle?: string;
  emptyMessage?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formFields: any[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editModal, setEditModal] = useState<{ item: any } | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await service.getAll();
      setItems(data);
    } catch {
      // Error loading items
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = items.filter((item: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns.some((col: any) => String(item[col.key] || "").includes(search))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder || `بحث في ${title}...`}
                className="px-4 py-2.5 border border-[var(--border)] rounded-xl bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 w-64"
            style={{ fontSize: "0.82rem" }}
          />
          <span className="text-[var(--muted-foreground)]" style={{ fontSize: "0.8rem" }}>
            {filtered.length} عنصر
          </span>
        </div>
        <button
          onClick={() => setEditModal({ item: null })}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" /> إضافة {title}
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        loading={loading}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onView={(item) => {}}
        onEdit={(item) => setEditModal({ item })}
        onDelete={async (item) => {
          await service.delete(item.id);
          await loadItems();
        }}
        emptyIcon={emptyIcon}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
      />

      <Modal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        title={editModal?.item ? `تعديل ${title}` : `إضافة ${title} جديد`}
        size="lg"
      >
        <GenericForm
          fields={formFields}
          editItem={editModal?.item}
          onSave={async (data) => {
            try {
              if (editModal?.item) {
                await service.update(editModal.item.id, data);
              } else {
                await service.create(data);
              }
              await loadItems();
              setEditModal(null);
    } catch {
      // Error saving items
    }
          }}
          onCancel={() => setEditModal(null)}
        />
      </Modal>
    </div>
  );
}

// ============================================================
// DashboardOverview (تعتمد على الخدمات الحقيقية)
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DashboardOverview({ onNavigate }: { onNavigate: (id: string) => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [charts, setCharts] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsData, chartData] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getChartData(),
        ]);
        setMetrics(metricsData);
        setCharts(chartData);
    } catch {
      // Error fetching dashboard data
    } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--brand-green)]" />
      </div>
    );
  if (!metrics)
    return (
      <EmptyState
        icon={AlertTriangle}
        title="خطأ في التحميل"
        message="تعذر تحميل بيانات لوحة التحكم"
      />
    );

  return (
    <div className="space-y-6">
      <SmartAlerts />
      <DashboardWidgets />
    </div>
  );
}

// ============================================================
// SIDEBAR_ITEMS
// ============================================================
const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { id: "analytics", label: "تحليل النشاط", icon: Activity },
  { id: "news", label: "إدارة الأخبار", icon: Newspaper },
  { id: "stories", label: "قصص النجاح", icon: Star },
  { id: "projects", label: "إدارة المشاريع", icon: FolderOpen },
  { id: "reports", label: "التقارير والإصدارات", icon: FileText },
  { id: "media", label: "إدارة الوسائط", icon: Image },
  { id: "partners", label: "الشركاء", icon: Handshake },
  { id: "donations", label: "التبرعات", icon: DollarSign },
  { id: "requests", label: "طلبات التواصل", icon: MessageSquare },
  { id: "beneficiary-requests", label: "طلبات المستفيدين", icon: FileText },
  { id: "volunteers", label: "المتطوعون", icon: Users },
  { id: "subscribers", label: "حسابات المشتركين", icon: UserCheck },
  { id: "users", label: "المستخدمين والصلاحيات", icon: Users },
  { id: "settings", label: "إعدادات الموقع", icon: Settings },
];

// ============================================================
// Render Helpers
// ============================================================
function renderSelect(
  label: string,
  value: string,
  onChange: (v: string) => void,
  options: { value: string; label: string }[]
) {
  return (
    <div className="mb-4">
      <label
        className="block mb-1.5 text-[var(--foreground)]"
        style={{ fontSize: "0.82rem", fontWeight: 600 }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-[var(--card)] transition-colors"
        style={{ fontSize: "0.85rem" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================================
// AdminDashboard الرئيسي
// ============================================================
export function AdminDashboard({
  onClose,
  isFullPage = false,
}: {
  onClose: () => void;
  isFullPage?: boolean;
}) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editModal, setEditModal] = useState<{ item: any; section: string } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [viewModal, setViewModal] = useState<{ item: any; title: string } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // حالات البيانات لكل قسم
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [donations, setDonations] = useState<any[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [donationSearch, setDonationSearch] = useState("");
  const [donationFilter, setDonationFilter] = useState("all");
  const [donationsPage, setDonationsPage] = useState(1);
  const DONATIONS_PER_PAGE = 25;
  const donationsData = donations;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [requests, setRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestSearch, setRequestSearch] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [volunteersLoading, setVolunteersLoading] = useState(true);
  const [volunteerSearch, setVolunteerSearch] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(true);
  const [subscriberSearch, setSubscriberSearch] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reports, setReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportSearch, setReportSearch] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [media, setMedia] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsSearch, setNewsSearch] = useState("");

  const [donationForm, setDonationForm] = useState({
    donor: "",
    email: "",
    phone: "",
    amount: "",
    project: "",
    method: "card",
    type: "once",
    status: "pending",
  });

  // دوال جلب البيانات من الخدمات الحقيقية
  const loadDonations = useCallback(async () => {
    setDonationsLoading(true);
    try {
      const data = await donationsService.getAll();
      setDonations(data);
    } catch {
      // Error loading donations
    } finally {
      setDonationsLoading(false);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const data = await requestsService.getAll();
      setRequests(data);
    } catch {
      // Error loading requests
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  const loadVolunteers = useCallback(async () => {
    setVolunteersLoading(true);
    try {
      const data = await volunteersService.getAll();
      setVolunteers(data);
    } catch {
      // Error loading volunteers
    } finally {
      setVolunteersLoading(false);
    }
  }, []);

  const loadSubscribers = useCallback(async () => {
    setSubscribersLoading(true);
    try {
      const data = await subscribersService.getAll();
      setSubscribers(data);
    } catch {
      // Error loading subscribers
    } finally {
      setSubscribersLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } catch {
      // Error loading users
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const data = await reportsService.getAll();
      setReports(data);
    } catch {
      // Error loading reports
    } finally {
      setReportsLoading(false);
    }
  }, []);

  const loadMedia = useCallback(async () => {
    setMediaLoading(true);
    try {
      const data = await mediaService.getAll();
      setMedia(data);
    } catch {
      // Error loading media
    } finally {
      setMediaLoading(false);
    }
  }, []);

  const loadNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const data = await newsService.getAll();
      setNews(data);
    } catch {
      // Error loading news
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // تحميل كل البيانات عند التحميل الأولي
  useEffect(() => {
    loadDonations();
    loadRequests();
    loadVolunteers();
    loadSubscribers();
    loadUsers();
    loadReports();
    loadMedia();
    loadNews();
  }, [
    loadDonations,
    loadRequests,
    loadVolunteers,
    loadSubscribers,
    loadUsers,
    loadReports,
    loadMedia,
    loadNews,
  ]);

  // ===== Toast + Confirm hooks =====
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirm, ConfirmDialog } = useConfirm();

  // ===== معالجات الأحداث =====
  const handleDonationSave = async () => {
    if (!donationForm.donor || !donationForm.amount) return;
    try {
      await donationsService.create({
        ...donationForm,
        amount: parseFloat(donationForm.amount),
        date: new Date().toISOString().split("T")[0],
      });
      setDonationForm({
        donor: "",
        email: "",
        phone: "",
        amount: "",
        project: "",
        method: "card",
        type: "once",
        status: "pending",
      });
      setShowAddModal(false);
      await loadDonations();
      toast.success("تم تسجيل التبرع بنجاح");
    } catch {
      // Error saving donation
      toast.error("حدث خطأ أثناء حفظ التبرع");
    }
  };

  const handleDonationApproval = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    donation: any,
    action: "completed" | "failed",
    reviewNotes?: string
  ) => {
    try {
      const response = await fetch("/api/donations?id=" + donation.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action,
          reviewed_by: "المدير",
          review_notes:
            reviewNotes || (action === "completed" ? "تم قبول التبرع" : "تم رفض التبرع"),
          action: action === "completed" ? "approved" : "rejected",
        }),
      });

      if (!response.ok) throw new Error("Failed to update donation status");

      await loadDonations();
      toast.success(
        action === "completed" ? "تم قبول التبرع وإرسال إشعار للمتبرع" : "تم رفض التبرع"
      );
    } catch {
      // Error updating donation status
      toast.error("حدث خطأ أثناء تحديث حالة التبرع");
    }
  };

  const handleRequestStatusChange = async (id: string | number, status: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await requestsService.update(id, { status } as any);
      await loadRequests();
    } catch {
      // Error updating request status
    }
  };

  const handleVolunteerToggle = async (id: string | number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await volunteersService.update(id, { status: newStatus } as any);
      await loadVolunteers();
    } catch {
      // Error toggling volunteer status
    }
  };

  const handleSubscriberToggle = async (id: string | number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "pending" : "active";
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await subscribersService.update(id, { status: newStatus } as any);
      await loadSubscribers();
    } catch {
      // Error toggling subscriber status
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUserToggleStatus = async (user: any) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await usersService.update(user.id, { status: newStatus } as any);
      await loadUsers();
    } catch {
      // Error fetching dashboard data
    }
  };

  // ===== مكون عرض التفاصيل =====
  const renderViewModal = () => {
    if (!viewModal) return null;
    return (
      <Modal
        isOpen={!!viewModal}
        onClose={() => setViewModal(null)}
        title={viewModal.title}
        size="lg"
      >
        <div className="space-y-4">
          {Object.entries(viewModal.item)
            .filter(([k]) => !["id", "logo", "image", "url"].includes(k))
            .map(([key, val]) => (
              <div key={key} className="flex items-start gap-3">
                <span
                  className="text-[var(--muted-foreground)] min-w-[100px]"
                  style={{ fontSize: "0.8rem", fontWeight: 600 }}
                >
                  {key}
                </span>
                <span className="text-[var(--foreground)]" style={{ fontSize: "0.85rem" }}>
                  {String(val)}
                </span>
              </div>
            ))}
        </div>
      </Modal>
    );
  };

  // ===== تعريف الأعمدة للجداول =====
  const donationColumns = [
    {
      key: "donor",
      label: "المتبرع",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (d: any) => <span style={{ fontWeight: 600 }}>{d.donor}</span>,
    },
    {
      key: "amount",
      label: "المبلغ",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (d: any) => (
        <span style={{ fontWeight: 700, color: "var(--brand-green)" }}>
          {d.amount?.toLocaleString("ar-SA") || d.amount} ر.ي
        </span>
      ),
    },
    { key: "project", label: "المشروع" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { key: "status", label: "الحالة", render: (d: any) => <StatusBadge status={d.status} /> },
    {
      key: "date",
      label: "التاريخ",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (d: any) => (d.date ? new Date(d.date).toLocaleDateString("ar-SA") : "—"),
    },
    {
      key: "actions",
      label: "إجراءات",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (d: any) => (
        <div className="flex items-center justify-center gap-1">
          {d.status === "pending" && (
            <>
              <button
                onClick={() => handleDonationApproval(d, "completed")}
                className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors"
                title="قبول"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDonationApproval(d, "failed")}
                className="p-1.5 rounded-lg hover:bg-[var(--danger-bg)] text-[var(--destructive)] hover:text-[var(--destructive)] transition-colors"
                title="رفض"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => setViewModal({ item: d, title: `تبرع من ${d.donor}` })}
            className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="عرض"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const requestColumns = [
    {
      key: "name",
      label: "المرسل",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => (
        <div>
          <span style={{ fontWeight: 600 }}>{r.name}</span>
          <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>{r.email}</div>
        </div>
      ),
    },
    {
      key: "type",
      label: "النوع",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => (
        <span
          className="px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]"
          style={{ fontSize: "0.7rem" }}
        >
          {r.type}
        </span>
      ),
    },
    {
      key: "message",
      label: "الرسالة",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => (
        <span style={{ fontSize: "0.78rem" }}>
          {r.message?.length > 60 ? r.message.slice(0, 60) + "..." : r.message}
        </span>
      ),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { key: "status", label: "الحالة", render: (r: any) => <StatusBadge status={r.status} /> },
    {
      key: "date",
      label: "التاريخ",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => (r.date ? new Date(r.date).toLocaleDateString("ar-SA") : "—"),
    },
  ];

  const volunteerColumns = [
    {
      key: "name",
      label: "الاسم",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (v: any) => <span style={{ fontWeight: 600 }}>{v.name}</span>,
    },
    { key: "phone", label: "الهاتف" },
    {
      key: "field",
      label: "المجال",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (v: any) => (
        <span
          className="px-2 py-0.5 rounded-full bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
          style={{ fontSize: "0.7rem", fontWeight: 600 }}
        >
          {v.field}
        </span>
      ),
    },
    {
      key: "hours",
      label: "الساعات",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (v: any) => <span style={{ fontWeight: 700 }}>{v.hours}</span>,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { key: "status", label: "الحالة", render: (v: any) => <StatusBadge status={v.status} /> },
  ];

  const subscriberColumns = [
    {
      key: "name",
      label: "الاسم",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (s: any) => (
        <div>
          <span style={{ fontWeight: 600 }}>{s.name}</span>
          <div style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>{s.email}</div>
        </div>
      ),
    },
    { key: "phone", label: "الهاتف" },
    {
      key: "source",
      label: "المصدر",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (s: any) => (
        <span
          className="px-2 py-0.5 rounded-full bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
          style={{ fontSize: "0.7rem", fontWeight: 600 }}
        >
          {s.source}
        </span>
      ),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { key: "status", label: "الحالة", render: (s: any) => <StatusBadge status={s.status} /> },
    {
      key: "updatedAt",
      label: "آخر تحديث",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (s: any) => (s.updatedAt ? new Date(s.updatedAt).toLocaleDateString("ar-SA") : "—"),
    },
  ];

  const userColumns = [
    {
      key: "name",
      label: "الاسم",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (u: any) => (
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full bg-[var(--brand-green)] flex items-center justify-center text-white"
            style={{ fontSize: "0.7rem", fontWeight: 700 }}
          >
            {u.name?.charAt(0)}
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: "0.8rem" }}>{u.name}</span>
            <div style={{ fontSize: "0.68rem", color: "var(--muted-foreground)" }}>{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "الدور",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (u: any) => {
        const roles: Record<string, { label: string; color: string; bg: string }> = {
          ADMIN: { label: "مدير", color: "#E74C3C", bg: "#FEF2F2" },
          EDITOR: { label: "محرر", color: "#2563EB", bg: "#EFF6FF" },
          MANAGER: {
            label: "مدير محتوى",
            color: "var(--brand-green)",
            bg: "var(--brand-green-pale)",
          },
          VIEWER: { label: "مشاهد", color: "var(--brand-gold)", bg: "var(--brand-gold-pale)" },
        };
        const r = roles[u.role] || {
          label: u.role,
          color: "var(--muted-foreground)",
          bg: "var(--muted)",
        };
        return (
          <span
            className="px-2.5 py-1 rounded-full"
            style={{ fontSize: "0.68rem", fontWeight: 700, background: r.bg, color: r.color }}
          >
            {r.label}
          </span>
        );
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { key: "status", label: "الحالة", render: (u: any) => <StatusBadge status={u.status} /> },
    {
      key: "createdAt",
      label: "تاريخ الإنشاء",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (u: any) => (u.createdAt ? new Date(u.createdAt).toLocaleDateString("ar-SA") : "—"),
    },
    {
      key: "lastLogin",
      label: "آخر دخول",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (u: any) => (
        <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>{u.lastLogin}</span>
      ),
    },
  ];

  const reportColumns = [
    {
      key: "title",
      label: "العنوان",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => <span style={{ fontWeight: 600 }}>{r.title}</span>,
    },
    {
      key: "type",
      label: "النوع",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => (
        <span
          className="px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]"
          style={{ fontSize: "0.7rem" }}
        >
          {r.type}
        </span>
      ),
    },
    {
      key: "date",
      label: "التاريخ",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (r: any) => (r.date ? new Date(r.date).toLocaleDateString("ar-SA") : "—"),
    },
    { key: "size", label: "الحجم" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { key: "status", label: "الحالة", render: (r: any) => <StatusBadge status={r.status} /> },
  ];

  const newsColumns = [
    {
      key: "title",
      label: "العنوان",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (n: any) => <span style={{ fontWeight: 600 }}>{n.title}</span>,
    },
    {
      key: "category",
      label: "التصنيف",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (n: any) => (
        <span
          className="px-2 py-0.5 rounded-full"
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            background: n.category_bg || "var(--muted)",
            color: n.category_color || "var(--muted-foreground)",
          }}
        >
          {n.category}
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (n: any) => <StatusBadge status={n.status === "PUBLISHED" ? "published" : "draft"} />,
    },
    {
      key: "date",
      label: "التاريخ",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (n: any) => (n.date ? new Date(n.date).toLocaleDateString("ar-SA") : "—"),
    },
    {
      key: "views",
      label: "المشاهدات",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (n: any) => <span style={{ fontWeight: 600 }}>{n.views || 0}</span>,
    },
  ];

  // ===== الفلاتر =====
  const filteredDonations = donations.filter(
    (d) =>
      (donationFilter === "all" || d.status === donationFilter) &&
      (String(d.donor || "").includes(donationSearch) ||
        String(d.project || "").includes(donationSearch))
  );

  const filteredRequests = requests.filter(
    (r) =>
      String(r.name || "").includes(requestSearch) ||
      String(r.message || "").includes(requestSearch) ||
      String(r.email || "").includes(requestSearch)
  );

  const filteredVolunteers = volunteers.filter(
    (v) =>
      String(v.name || "").includes(volunteerSearch) ||
      String(v.field || "").includes(volunteerSearch)
  );

  const filteredSubscribers = subscribers.filter(
    (s) =>
      String(s.name || "").includes(subscriberSearch) ||
      String(s.email || "").includes(subscriberSearch) ||
      String(s.phone || "").includes(subscriberSearch)
  );

  const filteredNews = news.filter(
    (n) =>
      String(n.title || "").includes(newsSearch) || String(n.category || "").includes(newsSearch)
  );

  // ===== عرض الأقسام =====
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview onNavigate={setActiveSection} />;

      case "analytics":
        return <AdminAnalytics />;

      case "news":
        return (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <SearchBar
                  value={newsSearch}
                  onChange={setNewsSearch}
                  placeholder="بحث في الأخبار..."
                />
                <span className="text-[var(--muted-foreground)]" style={{ fontSize: "0.8rem" }}>
                  {filteredNews.length} خبر
                </span>
              </div>
              <button
                onClick={() => setEditModal({ item: null, section: "news" })}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
                style={{ fontSize: "0.82rem", fontWeight: 600 }}
              >
                <Plus className="w-4 h-4" /> إضافة خبر
              </button>
            </div>
            <DataTable
              data={filteredNews}
              columns={newsColumns}
              loading={newsLoading}
              onView={(n) => setViewModal({ item: n, title: n.title })}
              onEdit={(n) => setEditModal({ item: n, section: "news" })}
              onDelete={async (n) => {
                await newsService.delete(n.id);
                await loadNews();
              }}
              emptyIcon={Newspaper}
              emptyTitle="لا توجد أخبار"
              emptyMessage="لم يتم إضافة أي أخبار بعد"
            />

            <Modal
              isOpen={!!editModal && editModal.section === "news"}
              onClose={() => setEditModal(null)}
              title={editModal?.item ? "تعديل الخبر" : "إضافة خبر جديد"}
              size="lg"
            >
              <NewsForm
                editItem={editModal?.item}
                onSave={async (data) => {
                  try {
                    if (editModal?.item) {
                      await newsService.update(editModal.item.id, data);
                    } else {
                      await newsService.create(data);
                    }
                    await loadNews();
                    setEditModal(null);
                  } catch {
                    toast.error("حدث خطأ أثناء حفظ الخبر");
                  }
                }}
                onCancel={() => setEditModal(null)}
              />
            </Modal>
          </div>
        );

      case "stories":
        return (
          <GenericSection
            service={storiesService}
            title="قصة نجاح"
            searchPlaceholder="بحث في القصص..."
            emptyIcon={Star}
            emptyTitle="لا توجد قصص"
            emptyMessage="أضف أول قصة نجاح"
            columns={[
              {
                key: "title",
                label: "العنوان",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                render: (s: any) => <span style={{ fontWeight: 600 }}>{s.title}</span>,
              },
              { key: "name", label: "صاحب القصة" },
              { key: "program", label: "البرنامج" },
              {
                key: "status",
                label: "الحالة",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                render: (s: any) => <StatusBadge status={s.status || "draft"} />,
              },
            ]}
            formFields={[
              { key: "title", label: "العنوان", required: true },
              { key: "name", label: "صاحب القصة", required: true },
              { key: "program", label: "البرنامج" },
              { key: "content", label: "المحتوى", multiline: true },
              { key: "image", label: "رابط الصورة" },
              {
                key: "status",
                label: "الحالة",
                options: [
                  { value: "published", label: "منشور" },
                  { value: "draft", label: "مسودة" },
                ],
              },
            ]}
          />
        );

      case "projects":
        return <ProjectManager />;

      case "reports":
        return (
          <div>
            <div className="flex items-center justify-between mb-5">
              <SearchBar
                value={reportSearch}
                onChange={setReportSearch}
                placeholder="بحث في التقارير..."
              />
              <button
                onClick={() => setEditModal({ item: null, section: "reports" })}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
                style={{ fontSize: "0.82rem", fontWeight: 600 }}
              >
                <Plus className="w-4 h-4" /> إضافة تقرير
              </button>
            </div>
            <DataTable
              data={reports.filter((r) => String(r.title || "").includes(reportSearch))}
              columns={reportColumns}
              loading={reportsLoading}
              onView={(r) => setViewModal({ item: r, title: r.title })}
              onDelete={async (r) => {
                await reportsService.delete(r.id);
                await loadReports();
              }}
              emptyIcon={FileText}
              emptyTitle="لا توجد تقارير"
              emptyMessage="قم بإضافة أول تقرير للحملة"
            />

            <Modal
              isOpen={!!editModal && editModal.section === "reports"}
              onClose={() => setEditModal(null)}
              title={editModal?.item ? "تعديل التقرير" : "إضافة تقرير جديد"}
              size="lg"
            >
              <GenericForm
                fields={[
                  { key: "title", label: "العنوان", required: true },
                  {
                    key: "type",
                    label: "النوع",
                    options: [
                      { value: "سنوي", label: "سنوي" },
                      { value: "مشروع", label: "مشروع" },
                      { value: "مالي", label: "مالي" },
                    ],
                  },
                  { key: "file_url", label: "رابط الملف" },
                  { key: "size", label: "الحجم" },
                  {
                    key: "status",
                    label: "الحالة",
                    options: [
                      { value: "published", label: "منشور" },
                      { value: "draft", label: "مسودة" },
                    ],
                  },
                ]}
                editItem={editModal?.item}
                onSave={async (data) => {
                  try {
                    if (editModal?.item) {
                      await reportsService.update(editModal.item.id, data);
                    } else {
                      await reportsService.create(data);
                    }
                    await loadReports();
                    setEditModal(null);
                  } catch {
                    // Error saving report
                    toast.error("حدث خطأ أثناء حفظ التقرير");
                  }
                }}
                onCancel={() => setEditModal(null)}
              />
            </Modal>
          </div>
        );

      case "media":
        return (
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-[var(--muted-foreground)]" style={{ fontSize: "0.8rem" }}>
                {media.length} وسائط
              </span>
              <button
                onClick={() => setEditModal({ item: null, section: "media" })}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
                style={{ fontSize: "0.82rem", fontWeight: 600 }}
              >
                <Plus className="w-4 h-4" /> رفع وسائط
              </button>
            </div>
            {mediaLoading ? (
              <div className="flex justify-center py-16">
                <RefreshCw className="w-8 h-8 animate-spin text-[var(--brand-green)]" />
              </div>
            ) : media.length === 0 ? (
              <EmptyState icon={Image} title="لا توجد وسائط" message="قم برفع أول وسيط للحملة" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((m) => (
                  <div
                    key={m.id}
                    className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={m.url}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className="px-2 py-0.5 rounded-full bg-white/90 text-[var(--foreground)]"
                          style={{ fontSize: "0.62rem", fontWeight: 600 }}
                        >
                          {m.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div style={{ fontSize: "0.78rem", fontWeight: 600 }}>{m.title}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span
                          className="text-[var(--muted-foreground)]"
                          style={{ fontSize: "0.65rem" }}
                        >
                          {m.size}
                        </span>
                        <span
                          className="text-[var(--muted-foreground)]"
                          style={{ fontSize: "0.65rem" }}
                        >
                          {m.date}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2 pt-2 border-t border-[var(--border)]">
                        <button
                          onClick={() => setViewModal({ item: m, title: m.title })}
                          className="flex-1 py-1 text-xs rounded-lg text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)] transition-colors"
                        >
                          عرض
                        </button>
                        <button
                          onClick={async () => {
                            await mediaService.delete(m.id);
                            await loadMedia();
                          }}
                          className="flex-1 py-1 text-xs rounded-lg text-[var(--destructive)] hover:bg-[var(--danger-bg)] transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Modal
              isOpen={!!editModal && editModal.section === "media"}
              onClose={() => setEditModal(null)}
              title="إضافة وسيط جديد"
              size="lg"
            >
              <GenericForm
                fields={[
                  { key: "title", label: "العنوان", required: true },
                  {
                    key: "type",
                    label: "النوع",
                    options: [
                      { value: "صورة", label: "صورة" },
                      { value: "فيديو", label: "فيديو" },
                      { value: "وثيقة", label: "وثيقة" },
                    ],
                  },
                  { key: "url", label: "رابط الملف", required: true },
                  { key: "size", label: "الحجم" },
                ]}
                editItem={editModal?.item}
                onSave={async (data) => {
                  try {
                    if (editModal?.item) {
                      await mediaService.update(editModal.item.id, data);
                    } else {
                      await mediaService.create(data);
                    }
                    await loadMedia();
                    setEditModal(null);
                  } catch {
                    // Error saving media
                    toast.error("حدث خطأ أثناء حفظ الوسيط");
                  }
                }}
                onCancel={() => setEditModal(null)}
              />
            </Modal>
          </div>
        );

      case "partners":
        return (
          <GenericSection
            service={partnersService}
            title="شريك"
            searchPlaceholder="بحث في الشركاء..."
            emptyIcon={Handshake}
            emptyTitle="لا توجد شراكات"
            emptyMessage="أضف شريكاً جديداً"
            columns={[
              {
                key: "name",
                label: "اسم الشريك",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                render: (p: any) => <span style={{ fontWeight: 600 }}>{p.name}</span>,
              },
              { key: "type", label: "نوع الشراكة" },
              {
                key: "status",
                label: "الحالة",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                render: (p: any) => <StatusBadge status={p.status || "active"} />,
              },
            ]}
            formFields={[
              { key: "name", label: "الاسم", required: true },
              {
                key: "type",
                label: "النوع",
                options: [
                  { value: "حكومي", label: "حكومي" },
                  { value: "خاص", label: "خاص" },
                  { value: "منظمة غير حكومية", label: "منظمة غير حكومية" },
                ],
              },
              { key: "logo", label: "رابط الشعار" },
              { key: "description", label: "الوصف", multiline: true },
              {
                key: "status",
                label: "الحالة",
                options: [
                  { value: "active", label: "نشط" },
                  { value: "inactive", label: "غير نشط" },
                ],
              },
            ]}
          />
        );

      case "donations":
        return (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <SearchBar
                  value={donationSearch}
                  onChange={setDonationSearch}
                  placeholder="بحث في التبرعات..."
                />
                <select
                  value={donationFilter}
                  onChange={(e) => setDonationFilter(e.target.value)}
                  className="px-3 py-2.5 border border-[var(--border)] rounded-xl bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30"
                  style={{ fontSize: "0.82rem" }}
                >
                  <option value="all">جميع الحالات</option>
                  <option value="completed">مكتمل</option>
                  <option value="pending">معلق</option>
                  <option value="failed">فاشل</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="text-[var(--brand-green)]"
                  style={{ fontSize: "0.85rem", fontWeight: 700 }}
                >
                  الإجمالي:{" "}
                  {filteredDonations
                    .reduce((sum, d) => sum + (d.status === "completed" ? d.amount || 0 : 0), 0)
                    .toLocaleString("ar-SA")}{" "}
                  ر.ي
                </div>
                <ExportButton 
                  data={donationsData} 
                  columns={[
                    { key: 'donor_name', label: 'المتبرع' },
                    { key: 'amount', label: 'المبلغ' },
                    { key: 'currency', label: 'العملة' },
                    { key: 'donation_type', label: 'النوع' },
                    { key: 'payment_status', label: 'الحالة' },
                    { key: 'created_at', label: 'التاريخ' },
                  ]}
                  filename="donations"
                  title="تقرير التبرعات"
                />
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
                  style={{ fontSize: "0.82rem", fontWeight: 600 }}
                >
                  <Plus className="w-4 h-4" /> تسجيل تبرع
                </button>
              </div>
            </div>
            <DataTable
              data={filteredDonations}
              columns={donationColumns}
              loading={donationsLoading}
              onView={(d) => setViewModal({ item: d, title: `تبرع من ${d.donor}` })}
              emptyIcon={DollarSign}
              emptyTitle="لا توجد تبرعات"
              emptyMessage="لم يتم تسجيل أي تبرعات بعد"
            />
            <Pagination
              currentPage={donationsPage}
              totalPages={Math.ceil((filteredDonations?.length || 0) / DONATIONS_PER_PAGE)}
              onPageChange={setDonationsPage}
              totalItems={filteredDonations?.length || 0}
              pageSize={DONATIONS_PER_PAGE}
            />

            <Modal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              title="تسجيل تبرع جديد"
              size="md"
            >
              <DonationForm
                form={donationForm}
                setForm={setDonationForm}
                onSave={handleDonationSave}
                onCancel={() => setShowAddModal(false)}
              />
            </Modal>
          </div>
        );

      case "requests":
        return (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <SearchBar
                  value={requestSearch}
                  onChange={setRequestSearch}
                  placeholder="بحث في الطلبات..."
                />
                <span className="text-[var(--muted-foreground)]" style={{ fontSize: "0.8rem" }}>
                  {filteredRequests.length} طلب —{" "}
                  {filteredRequests.filter((r) => r.status === "new").length} جديد
                </span>
              </div>
            </div>
            <DataTable
              data={filteredRequests}
              columns={requestColumns}
              loading={requestsLoading}
              onView={(r) => setViewModal({ item: r, title: `رسالة من ${r.name}` })}
              onToggle={(r) => {
                const nextStatus =
                  r.status === "new" ? "read" : r.status === "read" ? "replied" : "read";
                handleRequestStatusChange(r.id, nextStatus);
              }}
              emptyIcon={MessageSquare}
              emptyTitle="لا توجد طلبات"
              emptyMessage="لم يتم استلام أي طلبات تواصل بعد"
            />
          </div>
        );

      case "beneficiary-requests":
        return <RequestsDashboard />;

      case "volunteers":
        return (
          <div>
            <div className="flex items-center justify-between mb-5">
              <SearchBar
                value={volunteerSearch}
                onChange={setVolunteerSearch}
                placeholder="بحث في المتطوعين..."
              />
              <span className="text-[var(--muted-foreground)]" style={{ fontSize: "0.8rem" }}>
                {filteredVolunteers.length} متطوع —{" "}
                {volunteers.filter((v) => v.status === "active").length} نشط
              </span>
            </div>
            <DataTable
              data={filteredVolunteers}
              columns={volunteerColumns}
              loading={volunteersLoading}
              onView={(v) => setViewModal({ item: v, title: v.name })}
              onToggle={(v) => handleVolunteerToggle(v.id, v.status)}
              emptyIcon={Users}
              emptyTitle="لا يوجد متطوعون"
              emptyMessage="لم يتم تسجيل أي متطوعين بعد"
            />
          </div>
        );

      case "subscribers":
        return (
          <div>
            <div className="flex items-center justify-between mb-5">
              <SearchBar
                value={subscriberSearch}
                onChange={setSubscriberSearch}
                placeholder="بحث في حسابات المشتركين..."
              />
              <span className="text-[var(--muted-foreground)]" style={{ fontSize: "0.8rem" }}>
                {filteredSubscribers.length} حساب —{" "}
                {subscribers.filter((s) => s.status === "pending").length} قيد المراجعة
              </span>
            </div>
            <DataTable
              data={filteredSubscribers}
              columns={subscriberColumns}
              loading={subscribersLoading}
              onView={(s) => setViewModal({ item: s, title: s.name })}
              onToggle={(s) => handleSubscriberToggle(s.id, s.status)}
              emptyIcon={UserCheck}
              emptyTitle="لا توجد حسابات مشتركين"
              emptyMessage="ستظهر هنا حسابات المتبرعين والمتطوعين ومرسلي الطلبات من الموقع"
            />
          </div>
        );

      case "users":
        return (
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-[var(--muted-foreground)]" style={{ fontSize: "0.8rem" }}>
                {users.length} مستخدم
              </span>
              <button
                onClick={() => setEditModal({ item: null, section: "users" })}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
                style={{ fontSize: "0.82rem", fontWeight: 600 }}
              >
                <Plus className="w-4 h-4" /> إضافة مستخدم
              </button>
            </div>
            <DataTable
              data={users}
              columns={userColumns}
              loading={usersLoading}
              onEdit={(u) => setEditModal({ item: u, section: "users" })}
              onToggle={handleUserToggleStatus}
              emptyIcon={Settings}
              emptyTitle="لا يوجد مستخدمون"
              emptyMessage="لم يتم إضافة أي مستخدمين بعد"
            />

            <Modal
              isOpen={!!editModal && editModal.section === "users"}
              onClose={() => setEditModal(null)}
              title={editModal?.item ? "تعديل صلاحيات المستخدم" : "إضافة مستخدم جديد"}
              size="lg"
            >
              {editModal?.item ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-[var(--muted)] rounded-xl">
                    <div
                      className="w-12 h-12 rounded-full bg-[var(--brand-green)] flex items-center justify-center text-white"
                      style={{ fontSize: "1rem", fontWeight: 700 }}
                    >
                      {editModal.item.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                        {editModal.item.name}
                      </div>
                      <div
                        className="text-[var(--muted-foreground)]"
                        style={{ fontSize: "0.78rem" }}
                      >
                        {editModal.item.email}
                      </div>
                    </div>
                  </div>
                  {renderSelect(
                    "الدور",
                    editModal.item.role,
                    async (v) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      await usersService.update(editModal.item.id, { role: v } as any);
                      await loadUsers();
                    },
                    [
                      { value: "ADMIN", label: "مدير النظام - صلاحية كاملة" },
                      { value: "MANAGER", label: "مدير محتوى - إدارة المحتوى" },
                      { value: "EDITOR", label: "محرر - إضافة وتعديل" },
                      { value: "VIEWER", label: "مشاهد - عرض فقط" },
                    ]
                  )}
                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={() => handleUserToggleStatus(editModal.item)}
                      className="flex-1 py-2.5 border border-[var(--warning)] text-[var(--warning)] rounded-lg hover:bg-[var(--warning-bg)] transition-colors"
                      style={{ fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      {editModal.item.status === "active" ? "تعطيل الحساب" : "تفعيل الحساب"}
                    </button>
                    <button
                      onClick={() => setEditModal(null)}
                      className="flex-1 py-2.5 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
                      style={{ fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      حفظ
                    </button>
                  </div>
                </div>
              ) : (
                <GenericForm
                  fields={[
                    { key: "name", label: "الاسم الكامل", required: true },
                    { key: "email", label: "البريد الإلكتروني", type: "email", required: true },
                    {
                      key: "role",
                      label: "الدور",
                      options: [
                        { value: "ADMIN", label: "مدير النظام" },
                        { value: "MANAGER", label: "مدير محتوى" },
                        { value: "EDITOR", label: "محرر" },
                        { value: "VIEWER", label: "مشاهد" },
                      ],
                    },
                    {
                      key: "status",
                      label: "الحالة",
                      options: [
                        { value: "active", label: "نشط" },
                        { value: "inactive", label: "غير نشط" },
                      ],
                    },
                  ]}
                  editItem={null}
                  onSave={async (data) => {
                    try {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const usersServiceCreate = usersService as any;
                      await usersServiceCreate.create({
                        ...data,
                        createdAt: new Date().toISOString(),
                        lastLogin: "جديد",
                      });
                      await loadUsers();
                      setEditModal(null);
    } catch {
      // Error creating user
      toast.error("حدث خطأ أثناء إضافة المستخدم");
                    }
                  }}
                  onCancel={() => setEditModal(null)}
                />
              )}
            </Modal>
          </div>
        );

      case "settings":
        return <SettingsPage />;
      default:
        return (
          <EmptyState
            icon={AlertTriangle}
            title="قسم غير معروف"
            message="تعذر تحديد القسم المطلوب. حدّث الصفحة أو اختر قسماً من القائمة."
          />
        );
    }
  };

  // ===== واجهة المستخدم الرئيسية =====
  const containerClass = isFullPage
    ? "min-h-screen bg-[var(--background)]"
    : "fixed inset-0 z-[100] flex bg-black/50 backdrop-blur-sm";

  return (
    <div className={containerClass} style={{ direction: "rtl", fontFamily: "Cairo, sans-serif" }}>
      {!isFullPage && (
        <button
          type="button"
          aria-label="إغلاق"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={`relative z-10 flex w-full ${isFullPage ? "" : "max-w-7xl mx-auto my-4"} rounded-2xl overflow-hidden shadow-2xl bg-[var(--background)] ${isFullPage ? "min-h-screen" : ""}`}
      >
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 transition-all duration-300 flex flex-col border-l border-[var(--border)] bg-[var(--card)] ${sidebarCollapsed ? "w-16" : "w-56"}`}
        >
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            {!sidebarCollapsed && (
              <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--brand-green)" }}>
                لوحة التحكم
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform ${sidebarCollapsed ? "-rotate-90" : "rotate-90"}`}
              />
            </button>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-right ${
                    active
                      ? "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span style={{ fontSize: "0.8rem", fontWeight: active ? 700 : 500 }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="p-3 border-t border-[var(--border)]">
            <button
              onClick={onClose}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)] transition-colors ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <Globe className="w-4 h-4" />
              {!sidebarCollapsed && <span style={{ fontSize: "0.8rem" }}>العودة للموقع</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-20">
            <div>
              <h2
                className="text-[var(--foreground)]"
                style={{ fontSize: "1rem", fontWeight: 700 }}
              >
                {SIDEBAR_ITEMS.find((s) => s.id === activeSection)?.label || "لوحة التحكم"}
              </h2>
              <div className="text-[var(--muted-foreground)]" style={{ fontSize: "0.72rem" }}>
                {activeSection === "dashboard"
                  ? "نظرة عامة على أداء الحملة"
                  : `إدارة ${SIDEBAR_ITEMS.find((s) => s.id === activeSection)?.label}`}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
              >
                <Bell className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--danger-bg)]0" />
              </button>
              <button
                onClick={() => setActiveSection("dashboard")}
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--brand-green-pale)] rounded-lg hover:bg-[var(--brand-green)] hover:text-white transition-all group"
              >
                <div
                  className="w-6 h-6 rounded-full bg-[var(--brand-green)] flex items-center justify-center text-white group-hover:bg-white group-hover:text-[var(--brand-green)] transition-all"
                  style={{ fontSize: "0.6rem", fontWeight: 700 }}
                >
                  م
                </div>
                {!sidebarCollapsed && (
                  <span
                    style={{ fontSize: "0.78rem", fontWeight: 600 }}
                    className="group-hover:text-white"
                  >
                    المدير
                  </span>
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--danger-bg)] text-[var(--destructive)] hover:text-[var(--destructive)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{renderSection()}</div>
        </div>
      </div>
      {renderViewModal()}
      {ConfirmDialog}
      <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
}
