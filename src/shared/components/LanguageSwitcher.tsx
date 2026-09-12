import { Globe } from "lucide-react";

import { EnterpriseTooltip } from "@/shared/components";
import { useI18n } from "@/shared/i18n";

export interface LanguageSwitcherProps {
  className?: string;
  variant?: "ghost" | "outline";
}

export function LanguageSwitcher({ className = "", variant = "ghost" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();
  const nextLocale = locale === "ar" ? "en" : "ar";
  const label = nextLocale === "ar" ? "العربية" : "English";

  return (
    <EnterpriseTooltip content={t("a11y.toggleLanguage")}>
      <button
        type="button"
        onClick={() => setLocale(nextLocale)}
        aria-label={t("a11y.toggleLanguage")}
        lang={nextLocale}
        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 ${
          variant === "outline"
            ? "border border-border hover:bg-muted"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        } ${className}`}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span>{label}</span>
      </button>
    </EnterpriseTooltip>
  );
}

export default LanguageSwitcher;
