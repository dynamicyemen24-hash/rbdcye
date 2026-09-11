import { memo } from "react";
import { motion } from "motion/react";

interface HeaderComponentsBarProps {
  onNavigate: (page: string) => void;
}

const MAIN_ITEMS = [
  { id: "home", label: "الرئيسية" },
  { id: "about", label: "من نحن" },
  { id: "programs", label: "قطاعات الأعمال" },
  { id: "projects", label: "المشاريع" },
  { id: "transparency", label: "الحوكمة" },
  { id: "news", label: "الأخبار" },
  { id: "contact", label: "تواصل معنا" },
] as const;

/**
 * HeaderComponentsBar — شريط رأسي أول معياري عالمي
 * يعبر عن المكونات الرئيسية القوية بصورة احترافية عالمية
 * بلا إحصائيات — فقط تنقل رئيسي نظيف (الرئيسية، من نحن، قطاعات الأعمال...)
 */
export const HeaderComponentsBar = memo(function HeaderComponentsBar({ onNavigate }: HeaderComponentsBarProps) {
  return (
    <div
      className="hidden lg:block fixed top-0 inset-x-0 z-50 w-full border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--card)]/85"
      dir="rtl"
      role="navigation"
      aria-label="التنقل الرئيسي"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-10">
        <div className="flex h-9 items-center justify-between gap-6">
          {/* Right: Brand micro */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-extrabold tracking-tight text-[var(--brand-green)]">رحماء بينهم</span>
            <span className="h-3 w-px bg-[var(--border)]" aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-[0.14em] text-[var(--brand-gold-dark)]">RAHMAA BAYNAHUM</span>
          </div>

          {/* Center: Main components — global standard */}
          <nav className="flex items-center gap-1" aria-label="المكونات الرئيسية">
            {MAIN_ITEMS.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="px-3 py-1.5 text-[13px] font-bold text-[var(--foreground)]/80 hover:text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)] rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
                aria-label={item.label}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Left: CTA + Language */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] font-medium text-[var(--muted-foreground)] hidden xl:inline">منذ ٢٠١٤م • ترخيص ٤٨٢</span>
            <motion.button
              type="button"
              onClick={() => onNavigate("donate")}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center rounded-full bg-[var(--brand-gold)] px-4 py-1 text-[11px] font-black text-white shadow-sm hover:bg-[var(--brand-gold-dark)] transition-colors"
            >
              تبرع الآن
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
});
