// ============================================================
// AdminForms.tsx - جميع نماذج الإضافة والتعديل
// ============================================================

import { useState, ReactNode, useId, FormEvent } from "react";

// ============================================================
// 1. المكونات المساعدة (Helper Components)
// ============================================================

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  min?: string | number;
  max?: string | number;
  className?: string;
  error?: string;
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  multiline = false,
  rows = 3,
  min,
  max,
  className = "",
  error,
}: TextFieldProps) {
  const id = useId();
  const baseClass =
    "w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)] bg-white transition-colors " +
    className;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block mb-1.5 text-[var(--foreground)]"
        style={{ fontSize: "0.82rem", fontWeight: 600 }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          className={baseClass}
          style={{ fontSize: "0.85rem", resize: "vertical" }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          aria-required={required}
          aria-invalid={!!error}
          className={baseClass}
          style={{ fontSize: "0.85rem" }}
        />
      )}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  className = "",
}: SelectFieldProps) {
  const id = useId();
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block mb-1.5 text-[var(--foreground)]"
        style={{ fontSize: "0.82rem", fontWeight: 600 }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-required={required}
        className={`w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-white transition-colors ${className}`}
        style={{ fontSize: "0.85rem" }}
      >
        <option value="">اختر...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function CheckboxField({ label, checked, onChange, className = "" }: CheckboxFieldProps) {
  return (
    <label
      className={`flex items-center gap-2 text-[var(--foreground)] ${className}`}
      style={{ fontSize: "0.82rem", fontWeight: 500 }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded text-[var(--brand-green)] focus:ring-[var(--brand-green)] border-[var(--border)] w-4 h-4"
      />
      {label}
    </label>
  );
}

interface FormActionsProps {
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

export function FormActions({
  onSave,
  onCancel,
  submitLabel = "حفظ",
  cancelLabel = "إلغاء",
}: FormActionsProps) {
  return (
    <div className="flex gap-3 pt-4 border-t border-[var(--border)] mt-6">
      <button
        type="submit"
        onClick={onSave}
        className="flex-1 py-2.5 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors"
        style={{ fontSize: "0.85rem", fontWeight: 600 }}
      >
        {submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors"
        style={{ fontSize: "0.85rem" }}
      >
        {cancelLabel}
      </button>
    </div>
  );
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function FormModal({ isOpen, onClose, title, children, size = "md" }: FormModalProps) {
  if (!isOpen) return null;
  const widthMap = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <button
        type="button"
        aria-label="إغلاق"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      />
      <div
        className={`relative bg-white rounded-2xl p-6 w-full ${widthMap[size]} shadow-2xl max-h-[90vh] overflow-y-auto`}
        style={{ direction: "rtl" }}
      >
        <div className="flex items-center justify-between mb-5 sticky top-0 bg-white pb-3 border-b border-[var(--border)] z-10">
          <h3 id="form-modal-title" style={{ fontWeight: 700, fontSize: "1rem" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// 2. نماذج الإدارة (Management Forms)
// ============================================================

// ---------- نموذج الشريك ----------
export function PartnerForm({
  editItem,
  onSave,
  onCancel,
}: {
  editItem?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: editItem?.name || "",
    type: editItem?.type || "",
    status: editItem?.status || "active",
    url: editItem?.url || "",
    logo: editItem?.logo || "",
    description: editItem?.description || "",
    contactEmail: editItem?.contactEmail || "",
    contactPhone: editItem?.contactPhone || "",
    partnershipStart: editItem?.partnershipStart || "",
    partnershipEnd: editItem?.partnershipEnd || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.name || form.name.trim().length === 0) newErrors.name = "الاسم مطلوب";
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail))
      newErrors.contactEmail = "صيغة البريد غير صحيحة";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    onSave({
      ...form,
      id: editItem?.id || Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="اسم المؤسسة *"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
        required
        error={errors.name}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="نوع الشراكة"
          value={form.type}
          onChange={(v) => setForm({ ...form, type: v })}
          options={[
            { value: "شريك إستراتيجي", label: "شريك إستراتيجي" },
            { value: "جهة ممولة", label: "جهة ممولة" },
            { value: "شريك تنفيذي", label: "شريك تنفيذي" },
            { value: "شريك داعم", label: "شريك داعم" },
          ]}
        />
        <SelectField
          label="الحالة"
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v })}
          options={[
            { value: "active", label: "نشط" },
            { value: "inactive", label: "غير نشط" },
            { value: "suspended", label: "موقوف" },
          ]}
        />
      </div>
      <TextField
        label="الموقع الإلكتروني"
        value={form.url}
        onChange={(v) => setForm({ ...form, url: v })}
        placeholder="https://"
      />
      <TextField
        label="شعار المؤسسة (رابط)"
        value={form.logo}
        onChange={(v) => setForm({ ...form, logo: v })}
        placeholder="https://..."
      />
      <TextField
        label="وصف الشراكة"
        value={form.description}
        onChange={(v) => setForm({ ...form, description: v })}
        multiline
        rows={3}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="البريد الإلكتروني للتواصل"
          value={form.contactEmail}
          onChange={(v) => setForm({ ...form, contactEmail: v })}
          type="email"
        />
        <TextField
          label="رقم الهاتف"
          value={form.contactPhone}
          onChange={(v) => setForm({ ...form, contactPhone: v })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="تاريخ بدء الشراكة"
          value={form.partnershipStart}
          onChange={(v) => setForm({ ...form, partnershipStart: v })}
          placeholder="YYYY/MM/DD"
        />
        <TextField
          label="تاريخ انتهاء الشراكة"
          value={form.partnershipEnd}
          onChange={(v) => setForm({ ...form, partnershipEnd: v })}
          placeholder="YYYY/MM/DD"
        />
      </div>
      <FormActions
        onSave={handleSubmit as any}
        onCancel={onCancel}
        submitLabel={editItem ? "تحديث" : "إضافة"}
      />
    </form>
  );
}

// ---------- نموذج المشروع ----------
export function ProjectForm({
  editItem,
  onSave,
  onCancel,
}: {
  editItem?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: editItem?.title || "",
    description: editItem?.description || "",
    category: editItem?.category || "",
    status: editItem?.status || "active",
    progress: editItem?.progress || 0,
    budget: editItem?.budget || "",
    beneficiaries: editItem?.beneficiaries || "",
    location: editItem?.location || "",
    startDate: editItem?.startDate || "",
    endDate: editItem?.endDate || "",
    manager: editItem?.manager || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.title || form.title.trim().length === 0) newErrors.title = "اسم المشروع مطلوب";
    const progressNum = Number(form.progress);
    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100)
      newErrors.progress = "قيمة النسبة يجب أن تكون بين 0 و 100";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    onSave({
      ...form,
      progress: progressNum,
      id: editItem?.id || Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="اسم المشروع *"
        value={form.title}
        onChange={(v) => setForm({ ...form, title: v })}
        required
        error={errors.title}
      />
      <TextField
        label="وصف المشروع"
        value={form.description}
        onChange={(v) => setForm({ ...form, description: v })}
        multiline
        rows={3}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="التصنيف"
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
          options={[
            { value: "إغاثة", label: "إغاثة" },
            { value: "تعليم", label: "تعليم" },
            { value: "تنمية", label: "تنمية" },
            { value: "صحي", label: "صحي" },
            { value: "بنية تحتية", label: "بنية تحتية" },
            { value: "دعوي", label: "دعوي" },
          ]}
        />
        <SelectField
          label="الحالة"
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v })}
          options={[
            { value: "active", label: "نشط" },
            { value: "completed", label: "مكتمل" },
            { value: "pending", label: "قيد الانتظار" },
            { value: "cancelled", label: "ملغى" },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="نسبة الإنجاز %"
          value={String(form.progress)}
          onChange={(v) => setForm({ ...form, progress: v })}
          type="number"
          min="0"
          max="100"
          error={errors.progress}
        />
        <TextField
          label="الميزانية (ر.ي)"
          value={form.budget}
          onChange={(v) => setForm({ ...form, budget: v })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="عدد المستفيدين"
          value={form.beneficiaries}
          onChange={(v) => setForm({ ...form, beneficiaries: v })}
        />
        <TextField
          label="الموقع"
          value={form.location}
          onChange={(v) => setForm({ ...form, location: v })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="تاريخ البداية"
          value={form.startDate}
          onChange={(v) => setForm({ ...form, startDate: v })}
          placeholder="YYYY-MM-DD"
        />
        <TextField
          label="تاريخ النهاية المتوقع"
          value={form.endDate}
          onChange={(v) => setForm({ ...form, endDate: v })}
          placeholder="YYYY-MM-DD"
        />
      </div>
      <TextField
        label="مدير المشروع"
        value={form.manager}
        onChange={(v) => setForm({ ...form, manager: v })}
      />
      <FormActions
        onSave={handleSubmit as any}
        onCancel={onCancel}
        submitLabel={editItem ? "تحديث" : "إضافة"}
      />
    </form>
  );
}

// ---------- نموذج التقرير ----------
export function ReportForm({
  editItem,
  onSave,
  onCancel,
}: {
  editItem?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: editItem?.title || "",
    type: editItem?.type || "",
    date: editItem?.date || "",
    size: editItem?.size || "",
    file: editItem?.file || "",
    status: editItem?.status || "draft",
    description: editItem?.description || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.title || form.title.trim().length === 0) newErrors.title = "العنوان مطلوب";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    onSave({
      ...form,
      id: editItem?.id || Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="عنوان التقرير *"
        value={form.title}
        onChange={(v) => setForm({ ...form, title: v })}
        required
        error={errors.title}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="نوع التقرير"
          value={form.type}
          onChange={(v) => setForm({ ...form, type: v })}
          options={[
            { value: "تقرير سنوي", label: "تقرير سنوي" },
            { value: "نشرة دورية", label: "نشرة دورية" },
            { value: "تقرير مالي", label: "تقرير مالي" },
            { value: "تقرير مشروع", label: "تقرير مشروع" },
            { value: "دراسة", label: "دراسة" },
          ]}
        />
        <SelectField
          label="الحالة"
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v })}
          options={[
            { value: "published", label: "منشور" },
            { value: "draft", label: "مسودة" },
            { value: "archived", label: "مؤرشف" },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="التاريخ"
          value={form.date}
          onChange={(v) => setForm({ ...form, date: v })}
          placeholder="YYYY/MM/DD"
        />
        <TextField
          label="حجم الملف"
          value={form.size}
          onChange={(v) => setForm({ ...form, size: v })}
          placeholder="مثال: 5.2 م.ب"
        />
      </div>
      <TextField
        label="رابط الملف"
        value={form.file}
        onChange={(v) => setForm({ ...form, file: v })}
        placeholder="https://..."
      />
      <TextField
        label="الوصف"
        value={form.description}
        onChange={(v) => setForm({ ...form, description: v })}
        multiline
        rows={3}
      />
      <FormActions
        onSave={handleSubmit as any}
        onCancel={onCancel}
        submitLabel={editItem ? "تحديث" : "إضافة"}
      />
    </form>
  );
}

// ---------- نموذج قصة نجاح ----------
export function SuccessStoryForm({
  editItem,
  onSave,
  onCancel,
}: {
  editItem?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: editItem?.title || "",
    excerpt: editItem?.excerpt || "",
    quote: editItem?.quote || "",
    name: editItem?.name || "",
    role: editItem?.role || "",
    program: editItem?.program || "",
    category: editItem?.category || "",
    year: editItem?.year || "",
    location: editItem?.location || "",
    image: editItem?.image || "",
    rating: editItem?.rating || 5,
    status: editItem?.status || "PUBLISHED",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      rating: Number(form.rating),
      id: editItem?.id || Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="عنوان القصة *"
        value={form.title}
        onChange={(v) => setForm({ ...form, title: v })}
        required
      />
      <TextField
        label="ملخص القصة"
        value={form.excerpt}
        onChange={(v) => setForm({ ...form, excerpt: v })}
        multiline
        rows={3}
      />
      <TextField
        label="اقتباس"
        value={form.quote}
        onChange={(v) => setForm({ ...form, quote: v })}
        multiline
        rows={2}
        placeholder="اقتباس من صاحب القصة..."
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="اسم المستفيد *"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          required
        />
        <TextField
          label="الصفة"
          value={form.role}
          onChange={(v) => setForm({ ...form, role: v })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="البرنامج"
          value={form.program}
          onChange={(v) => setForm({ ...form, program: v })}
        />
        <SelectField
          label="التصنيف"
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
          options={[
            { value: "تعليم", label: "تعليم" },
            { value: "صحي", label: "صحي" },
            { value: "تنمية مجتمعية", label: "تنمية مجتمعية" },
            { value: "إغاثة", label: "إغاثة" },
            { value: "تمكين", label: "تمكين" },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="السنة"
          value={form.year}
          onChange={(v) => setForm({ ...form, year: v })}
          placeholder="١٤٤٦هـ"
        />
        <TextField
          label="الموقع"
          value={form.location}
          onChange={(v) => setForm({ ...form, location: v })}
        />
      </div>
      <TextField
        label="رابط الصورة"
        value={form.image}
        onChange={(v) => setForm({ ...form, image: v })}
        placeholder="https://..."
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="story-rating"
            className="block mb-1.5 text-[var(--foreground)]"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            التقييم
          </label>
          <select
            id="story-rating"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-white transition-colors"
            style={{ fontSize: "0.85rem" }}
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
            <option value={4}>⭐⭐⭐⭐ (4)</option>
            <option value={3}>⭐⭐⭐ (3)</option>
            <option value={2}>⭐⭐ (2)</option>
            <option value={1}>⭐ (1)</option>
          </select>
        </div>
        <SelectField
          label="الحالة"
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v })}
          options={[
            { value: "PUBLISHED", label: "منشور" },
            { value: "DRAFT", label: "مسودة" },
            { value: "ARCHIVED", label: "مؤرشف" },
          ]}
        />
      </div>
      <FormActions
        onSave={handleSubmit as any}
        onCancel={onCancel}
        submitLabel={editItem ? "تحديث" : "إضافة"}
      />
    </form>
  );
}

// ---------- نموذج متطوع ----------
export function VolunteerForm({
  editItem,
  onSave,
  onCancel,
}: {
  editItem?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: editItem?.name || "",
    email: editItem?.email || "",
    phone: editItem?.phone || "",
    field: editItem?.field || "",
    experience: editItem?.experience || "",
    availability: editItem?.availability || "",
    motivation: editItem?.motivation || "",
    status: editItem?.status || "pending",
    hours: editItem?.hours || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      hours: Number(form.hours),
      id: editItem?.id || Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="الاسم الكامل *"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="البريد الإلكتروني *"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          type="email"
          required
        />
        <TextField
          label="رقم الهاتف *"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="مجال التطوع"
          value={form.field}
          onChange={(v) => setForm({ ...form, field: v })}
          options={[
            { value: "تعليمي", label: "تعليمي" },
            { value: "صحي", label: "صحي" },
            { value: "إغاثي", label: "إغاثي" },
            { value: "إعلامي", label: "إعلامي" },
            { value: "إداري", label: "إداري" },
            { value: "تقني", label: "تقني" },
            { value: "قانوني", label: "قانوني" },
            { value: "مالي", label: "مالي" },
          ]}
        />
        <SelectField
          label="الحالة"
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v })}
          options={[
            { value: "active", label: "نشط" },
            { value: "pending", label: "قيد المراجعة" },
            { value: "inactive", label: "غير نشط" },
          ]}
        />
      </div>
      <TextField
        label="الخبرات السابقة"
        value={form.experience}
        onChange={(v) => setForm({ ...form, experience: v })}
        multiline
        rows={3}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="التوفر"
          value={form.availability}
          onChange={(v) => setForm({ ...form, availability: v })}
          placeholder="مثال: أيام الأسبوع، نهاية الأسبوع"
        />
        <TextField
          label="الساعات المجمعة"
          value={String(form.hours)}
          onChange={(v) => setForm({ ...form, hours: v })}
          type="number"
          min="0"
        />
      </div>
      <TextField
        label="دوافع التطوع"
        value={form.motivation}
        onChange={(v) => setForm({ ...form, motivation: v })}
        multiline
        rows={3}
      />
      <FormActions
        onSave={handleSubmit as any}
        onCancel={onCancel}
        submitLabel={editItem ? "تحديث" : "إضافة"}
      />
    </form>
  );
}

// ---------- نموذج المستخدم والصلاحيات ----------
export function UserForm({
  editItem,
  onSave,
  onCancel,
}: {
  editItem?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: editItem?.name || "",
    email: editItem?.email || "",
    role: editItem?.role || "VIEWER",
    status: editItem?.status || "active",
    permissions: editItem?.permissions || [],
    phone: editItem?.phone || "",
    department: editItem?.department || "",
    notes: editItem?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      id: editItem?.id || Date.now(),
    });
  };

  const allPermissions = [
    { id: "news", label: "إدارة الأخبار" },
    { id: "stories", label: "قصص النجاح" },
    { id: "projects", label: "إدارة المشاريع" },
    { id: "reports", label: "التقارير" },
    { id: "media", label: "إدارة الوسائط" },
    { id: "partners", label: "الشركاء" },
    { id: "donations", label: "التبرعات" },
    { id: "volunteers", label: "المتطوعون" },
    { id: "users", label: "إدارة المستخدمين" },
    { id: "settings", label: "الإعدادات" },
  ];

  const togglePermission = (id: string) => {
    const newPerms = form.permissions.includes(id)
      ? form.permissions.filter((p: string) => p !== id)
      : [...form.permissions, id];
    setForm({ ...form, permissions: newPerms });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="الاسم الكامل *"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
        required
      />
      <TextField
        label="البريد الإلكتروني *"
        value={form.email}
        onChange={(v) => setForm({ ...form, email: v })}
        type="email"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="الدور"
          value={form.role}
          onChange={(v) => setForm({ ...form, role: v })}
          options={[
            { value: "ADMIN", label: "مدير النظام - صلاحية كاملة" },
            { value: "MANAGER", label: "مدير محتوى - إدارة المحتوى" },
            { value: "EDITOR", label: "محرر - إضافة وتعديل" },
            { value: "VIEWER", label: "مشاهد - عرض فقط" },
          ]}
        />
        <SelectField
          label="الحالة"
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v })}
          options={[
            { value: "active", label: "نشط" },
            { value: "inactive", label: "غير نشط" },
            { value: "suspended", label: "موقوف" },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="رقم الهاتف"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />
        <SelectField
          label="القسم"
          value={form.department}
          onChange={(v) => setForm({ ...form, department: v })}
          options={[
            { value: "إدارة", label: "الإدارة العامة" },
            { value: "محتوى", label: "المحتوى والإعلام" },
            { value: "مشاريع", label: "المشاريع" },
            { value: "مالية", label: "المالية" },
            { value: "تطوع", label: "التطوع" },
          ]}
        />
      </div>
      <fieldset className="mb-4">
        <legend
          className="block mb-1.5 text-[var(--foreground)]"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          الصلاحيات
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {allPermissions.map((p) => (
            <CheckboxField
              key={p.id}
              label={p.label}
              checked={form.permissions.includes(p.id)}
              onChange={() => togglePermission(p.id)}
            />
          ))}
        </div>
      </fieldset>
      <TextField
        label="ملاحظات"
        value={form.notes}
        onChange={(v) => setForm({ ...form, notes: v })}
        multiline
        rows={3}
      />
      <FormActions
        onSave={handleSubmit as any}
        onCancel={onCancel}
        submitLabel={editItem ? "تحديث" : "إضافة"}
      />
    </form>
  );
}

// ---------- نموذج الرد على الطلب ----------
export function RequestResponseForm({
  editItem,
  onSave,
  onCancel,
}: {
  editItem?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    response: editItem?.response || "",
    status: editItem?.status || "read",
    followUpDate: editItem?.followUpDate || "",
    assignedTo: editItem?.assignedTo || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      id: editItem?.id,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        label="الرد على الطلب"
        value={form.response}
        onChange={(v) => setForm({ ...form, response: v })}
        multiline
        rows={4}
        placeholder="اكتب ردك هنا..."
      />
      <SelectField
        label="تغيير الحالة"
        value={form.status}
        onChange={(v) => setForm({ ...form, status: v })}
        options={[
          { value: "new", label: "جديد" },
          { value: "read", label: "مقروء" },
          { value: "replied", label: "تم الرد" },
          { value: "closed", label: "مغلق" },
        ]}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="تاريخ المتابعة"
          value={form.followUpDate}
          onChange={(v) => setForm({ ...form, followUpDate: v })}
          placeholder="YYYY/MM/DD"
        />
        <SelectField
          label="تعيين إلى"
          value={form.assignedTo}
          onChange={(v) => setForm({ ...form, assignedTo: v })}
          options={[
            { value: "مدير النظام", label: "مدير النظام" },
            { value: "مدير البرامج", label: "مدير البرامج" },
            { value: "مدير المشاريع", label: "مدير المشاريع" },
            { value: "فريق المتابعة", label: "فريق المتابعة" },
          ]}
        />
      </div>
      <FormActions onSave={handleSubmit as any} onCancel={onCancel} submitLabel="إرسال الرد" />
    </form>
  );
}
