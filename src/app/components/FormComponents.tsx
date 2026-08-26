import { useState, useEffect } from "react";

export function TextField({ label, value, onChange, required, type = "text", placeholder, multiline, maxLength, min, max }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; type?: string; placeholder?: string; multiline?: boolean; maxLength?: number; min?: string; max?: string;
}) {
  const [error, setError] = useState("");

  useEffect(() => {
    if (required && !value.trim()) setError("هذا الحقل مطلوب");
    else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) setError("بريد إلكتروني غير صحيح");
    else if (type === 'number' && value && isNaN(Number(value))) setError("رقم غير صحيح");
    else if (maxLength && value.length > maxLength) setError(`الحد الأقصى ${maxLength} حرف`);
    else setError("");
  }, [value, required, type, maxLength]);

  const inputClass = `w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 focus:border-[var(--brand-green)] transition-colors ${
    error ? 'border-red-400 bg-red-50' : 'border-[var(--border)] bg-white'
  }`;

  return (
    <div className="mb-4">
      <label className="block mb-1.5 text-[var(--foreground)]" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {multiline ? (
        <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass}
          style={{ fontSize: "0.85rem", resize: "vertical" }} maxLength={maxLength} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputClass}
          style={{ fontSize: "0.85rem" }} required={required} maxLength={maxLength} min={min} max={max} />
      )}
      {error && <p className="text-red-500 mt-1" style={{ fontSize: "0.72rem" }}>{error}</p>}
    </div>
  );
}

export function SelectField({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1.5 text-[var(--foreground)]" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30 bg-white transition-colors"
        style={{ fontSize: "0.85rem" }} required={required}>
        <option value="">اختر...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <input type="checkbox" id={label} checked={checked} onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded text-[var(--brand-green)] focus:ring-[var(--brand-green)] border-[var(--border)]" />
      <label htmlFor={label} style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)", cursor: "pointer" }}>{label}</label>
    </div>
  );
}

export function FormModal({ isOpen, onClose, title, children, size = "md" }: {
  isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: "sm" | "md" | "lg";
}) {
  if (!isOpen) return null;
  const widthMap = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      />
      <div
        className={`relative bg-white rounded-2xl p-6 w-full ${widthMap[size]} shadow-2xl max-h-[90vh] overflow-y-auto`}
        style={{ direction: "rtl" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-modal-title"
      >
        <div className="flex items-center justify-between mb-5 sticky top-0 bg-white pb-3 border-b border-[var(--border)] z-10">
          <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors">
            <span className="text-[var(--muted-foreground)] text-xl">×</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormActions({ onSave, onCancel, submitLabel = "حفظ", cancelLabel = "إلغاء", saving = false }: {
  onSave: () => void; onCancel: () => void; submitLabel?: string; cancelLabel?: string; saving?: boolean;
}) {
  return (
    <div className="flex gap-3 pt-4 border-t border-[var(--border)]">
      <button type="button" onClick={onSave} disabled={saving}
        className="flex-1 py-2.5 bg-[var(--brand-green)] text-white rounded-lg hover:bg-[var(--brand-green-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontSize: "0.85rem", fontWeight: 600 }}>
        {saving ? "جاري الحفظ..." : submitLabel}
      </button>
      <button type="button" onClick={onCancel} disabled={saving}
        className="flex-1 py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors disabled:opacity-50"
        style={{ fontSize: "0.85rem" }}>
        {cancelLabel}
      </button>
    </div>
  );
}
