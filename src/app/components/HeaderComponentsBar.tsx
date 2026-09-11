import { Calculator, Lightbulb, Map, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";

interface HeaderComponentsBarProps {
  onNavigate: (page: string) => void;
}

/**
 * HeaderComponentsBar — شريط الأدوات الاستراتيجي
 * ليس تكراراً للتنقل الرئيسي، بل وصول مباشر لأقوى الأدوات التسويقية والتفاعلية
 * التي تميّز المؤسسة: المستشار الذكي، محرك الأثر، الخريطة، حاسبة الزكاة
 */
const STRATEGIC_TOOLS = [
  { id: "smart-advisor", label: "المستشار الذكي", icon: Lightbulb, badge: "ذكي" },
  { id: "impact-engine", label: "محرك الأثر", icon: Sparkles, badge: "مباشر" },
  { id: "interactive-map", label: "الخريطة التفاعلية", icon: Map },
  { id: "zakat-calculator", label: "حاسبة الزكاة", icon: Calculator, badge: "شرعي" },
] as const;

export const HeaderComponentsBar = memo(function HeaderComponentsBar({
  onNavigate,
}: HeaderComponentsBarProps) {
  return (
    <div
      className="hidden lg:block fixed top-0 inset-x-0 z-50 w-full border-b border-[var(--brand-green)]/10 bg-[var(--brand-green-dark)] text-white"
      dir="rtl"
      role="navigation"
      aria-label="شريط الأدوات الاستراتيجية"
    >
      <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-between gap-6 px-6 lg:px-10">
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-black tracking-tight text-white">رحماء بينهم</span>
          <span className="h-3 w-px bg-white/20" aria-hidden="true" />
          <span className="hidden xl:inline text-[10px] font-bold tracking-[0.14em] text-[var(--brand-gold-light)]">
            RAHMAA BAYNAHUM
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-gold)]" aria-hidden="true" />
            ترخيص ٤٨٢ • منذ ٢٠١٤م
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="hidden xl:inline text-[10px] font-bold tracking-wider text-white/50">أدوات استراتيجية:</span>
          {STRATEGIC_TOOLS.map((tool) => (
            <motion.button
              key={tool.id}
              type="button"
              onClick={() => onNavigate(tool.id)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
              aria-label={tool.label}
            >
              <tool.icon className="h-3.5 w-3.5 text-[var(--brand-gold-light)]" aria-hidden="true" />
              {tool.label}
              {"badge" in tool && tool.badge && (
                <span className="rounded-full bg-[var(--brand-gold)] px-1.5 py-0.5 text-[9px] font-black leading-none text-[var(--brand-green-dark)]">
                  {(tool as { badge: string }).badge}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden xl:inline text-[10px] text-white/60">٨ محافظات • ١٥,٠٠٠+ مستفيد</span>
          <motion.button
            type="button"
            onClick={() => onNavigate("donate")}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center rounded-full bg-[var(--brand-gold)] px-4 py-1.5 text-[11px] font-black text-[var(--brand-green-dark)] shadow-sm hover:bg-[var(--brand-gold-light)] transition-colors"
          >
            تبرع الآن
          </motion.button>
        </div>
      </div>
    </div>
  );
});
