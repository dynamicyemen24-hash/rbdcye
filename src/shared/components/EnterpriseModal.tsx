import { Fragment, useEffect, useCallback, useRef, type ReactElement } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, LucideIcon } from "lucide-react";
import { createPortal } from "react-dom";

export type EnterpriseModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface EnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: EnterpriseModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showFooter?: boolean;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  preventScroll?: boolean;
  trapFocus?: boolean;
}

const sizeStyles: Record<EnterpriseModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-4xl w-full mx-4",
};

const COMMON_MODAL_BASE = `
  relative w-full bg-card rounded-2xl shadow-2xl
  focus-visible:outline-none
`.trim();

const COMMON_OVERLAY_BASE = `
  fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
  transition-opacity duration-200 ease-out
`.trim();

export function EnterpriseModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showFooter = false,
  footer,
  headerAction,
  icon: Icon,
  className = "",
  overlayClassName = "",
  contentClassName = "",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  preventScroll = true,
  trapFocus = true,
}: EnterpriseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!closeOnEscape || e.key !== "Escape") return;
      onClose();
    },
    [closeOnEscape, onClose]
  );

  const handleFocusTrap = useCallback(
    (e: KeyboardEvent) => {
      if (!trapFocus || e.key !== "Tab") return;

      const focusableElements = focusableElementsRef.current;
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [trapFocus]
  );

  const updateFocusableElements = useCallback(() => {
    if (!modalRef.current) return;
    focusableElementsRef.current = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = preventScroll ? "hidden" : "";
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keydown", handleFocusTrap);

      setTimeout(() => {
        updateFocusableElements();
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 0);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keydown", handleFocusTrap);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, preventScroll, handleKeyDown, handleFocusTrap, updateFocusableElements]);

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        className={`${COMMON_OVERLAY_BASE} ${overlayClassName}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeOnOverlayClick ? onClose : undefined}
        role="presentation"
        aria-hidden="true"
      />
    </AnimatePresence>
  );

  const modal = (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? undefined : ariaLabel}
        aria-describedby={ariaDescribedby}
        className={`${COMMON_MODAL_BASE} ${sizeStyles[size]} ${contentClassName}`}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {(title || showCloseButton || Icon || headerAction) && (
          <div className="flex items-start justify-between gap-4 border-b border-border/50 px-6 py-4">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-green-pale text-brand-green flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
              )}
              <div>
                {title && (
                  <h2 id="modal-title" className="text-lg font-bold text-foreground">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="modal-description" className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-4" tabIndex={-1}>
          {children}
        </div>

        {showFooter && footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border/50 px-6 py-4">
            {footer}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  if (typeof window === "undefined") return null;

  return (
    <Fragment>
      {createPortal(
        <Fragment>
          {modalContent}
          {modal}
        </Fragment>,
        document.body
      ) as ReactElement}
    </Fragment>
  );
}

export interface EnterpriseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
  loading?: boolean;
  icon?: LucideIcon;
}

export function EnterpriseConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "primary",
  loading = false,
  icon,
}: EnterpriseConfirmModalProps) {
  const confirmVariantStyles = {
    danger: "bg-danger hover:bg-red-700",
    primary: "bg-brand-green hover:bg-brand-green-light",
    warning: "bg-warning hover:bg-amber-600",
  };

  return (
    <EnterpriseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      icon={icon}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border-2 border-border hover:bg-muted transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2 rounded-xl text-white font-semibold transition-colors ${confirmVariantStyles[variant]} disabled:opacity-50`}
          >
            {loading ? "جاري..." : confirmText}
          </button>
        </>
      }
    >
      <p className="text-muted-foreground leading-relaxed">{message}</p>
    </EnterpriseModal>
  );
}

export default EnterpriseModal;