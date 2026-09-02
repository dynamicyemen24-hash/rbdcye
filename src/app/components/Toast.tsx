// ============================================================
// Toast.tsx - نظام الإشعارات التفاعلي للمستخدم
// ============================================================
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback if used outside provider
    return {
      addToast: () => {},
      removeToast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
    };
  }
  return ctx;
}

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

const STYLES: Record<ToastType, { bg: string; border: string; iconColor: string }> = {
  success: { bg: "#F0FDF4", border: "#BBF7D0", iconColor: "var(--brand-green)" },
  error: { bg: "#FEF2F2", border: "#FECACA", iconColor: "#E74C3C" },
  warning: { bg: "#FFFBEB", border: "#FDE68A", iconColor: "var(--brand-gold)" },
  info: { bg: "#EFF6FF", border: "#BFDBFE", iconColor: "#2563EB" },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const style = STYLES[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm animate-in slide-in-from-right"
      style={{
        background: style.bg,
        borderColor: style.border,
        borderWidth: 1,
        minWidth: 280,
        maxWidth: 400,
        direction: "rtl",
      }}
    >
      <div style={{ color: style.iconColor, flexShrink: 0, marginTop: 2 }}>
        {ICONS[toast.type]}
      </div>
      <p style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--foreground)", flex: 1, lineHeight: 1.5 }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-0.5 rounded hover:bg-black/5 transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info", duration?: number) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const success = useCallback((message: string) => addToast(message, "success"), [addToast]);
  const error = useCallback((message: string) => addToast(message, "error", 5000), [addToast]);
  const warning = useCallback((message: string) => addToast(message, "warning"), [addToast]);
  const info = useCallback((message: string) => addToast(message, "info"), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2" style={{ direction: "rtl" }}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      <style>{`
        @keyframes slide-in-from-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-in.slide-in-from-right {
          animation: slide-in-from-right 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

// ===== ConfirmDialog =====
export function useConfirm() {
  const [state, setState] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "info";
  } | null>(null);

  const confirm = useCallback(
    (message: string, options?: { title?: string; confirmLabel?: string; cancelLabel?: string; variant?: "danger" | "warning" | "info" }) => {
      return new Promise<boolean>((resolve) => {
        setState({
          isOpen: true,
          message,
          onConfirm: () => { resolve(true); setState(null); },
          onCancel: () => { resolve(false); setState(null); },
          ...options,
        });
      });
    },
    []
  );

  const ConfirmDialogComponent = state ? (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer" 
        onClick={state.onCancel}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') state.onCancel(); }}
        aria-label="إلغاء"
      />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" style={{ direction: "rtl" }}>
        <div className="text-center mb-5">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
            state.variant === 'danger' ? 'bg-red-50' : state.variant === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${
              state.variant === 'danger' ? 'text-red-500' : state.variant === 'warning' ? 'text-amber-500' : 'text-blue-500'
            }`} />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{state.title || "تأكيد العملية"}</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{state.message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={state.onConfirm}
            className={`flex-1 py-2.5 rounded-lg text-white transition-colors ${
              state.variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : state.variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[var(--brand-green)] hover:bg-[var(--brand-green-light)]'
            }`}
            style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {state.confirmLabel || "تأكيد"}
          </button>
          <button onClick={state.onCancel}
            className="flex-1 py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors"
            style={{ fontSize: "0.85rem" }}>
            {state.cancelLabel || "إلغاء"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
}

