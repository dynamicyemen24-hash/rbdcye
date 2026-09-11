import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
  LucideIcon,
} from "lucide-react";

export type EnterpriseAlertVariant = "info" | "success" | "warning" | "danger" | "neutral";

export interface EnterpriseAlertProps {
  variant?: EnterpriseAlertVariant;
  title?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
  "aria-live"?: "polite" | "assertive" | "off";
}

const variantConfig: Record<
  EnterpriseAlertVariant,
  { container: string; icon: string; DefaultIcon: LucideIcon }
> = {
  info: {
    container: "border-info/30 bg-info/10 text-foreground",
    icon: "text-info",
    DefaultIcon: Info,
  },
  success: {
    container: "border-success/30 bg-success/10 text-foreground",
    icon: "text-success",
    DefaultIcon: CheckCircle2,
  },
  warning: {
    container: "border-warning/30 bg-warning/10 text-foreground",
    icon: "text-warning",
    DefaultIcon: AlertTriangle,
  },
  danger: {
    container: "border-danger/30 bg-danger/10 text-foreground",
    icon: "text-danger",
    DefaultIcon: AlertCircle,
  },
  neutral: {
    container: "border-border bg-muted/50 text-foreground",
    icon: "text-muted-foreground",
    DefaultIcon: Info,
  },
};

export const EnterpriseAlert = forwardRef<HTMLDivElement, EnterpriseAlertProps>(
  (
    {
      variant = "info",
      title,
      children,
      icon,
      dismissible = false,
      onDismiss,
      action,
      className = "",
      "aria-live": ariaLive = "polite",
    },
    ref
  ) => {
    const [dismissed, setDismissed] = useState(false);
    const config = variantConfig[variant];
    const Icon = icon || config.DefaultIcon;

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    return (
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            ref={ref}
            role="alert"
            aria-live={ariaLive}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-3 rounded-xl border p-4 ${config.container} ${className}`}
          >
            <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${config.icon}`} aria-hidden="true" />

            <div className="flex-1 min-w-0">
              {title && <p className="font-bold text-sm mb-1">{title}</p>}
              <div className="text-sm leading-relaxed opacity-90">{children}</div>
              {action && <div className="mt-3">{action}</div>}
            </div>

            {dismissible && (
              <button
                type="button"
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
                aria-label="إغلاق التنبيه"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

EnterpriseAlert.displayName = "EnterpriseAlert";

export default EnterpriseAlert;