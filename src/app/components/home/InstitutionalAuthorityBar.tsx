// Institutional Authority Bar - شريط المصداقية المؤسسية
// يعرض الترخيص الرسمي، الشهادات، والاعتمادات بشكل راقي واحترافي
import { motion } from "motion/react";
import { BadgeCheck, ShieldCheck, Award, FileCheck, Building2, Globe } from "lucide-react";

const AUTHORITY_ITEMS = [
  {
    icon: BadgeCheck,
    title: "ترخيص رسمي",
    detail: "رقم ٤٨٢ — وزارة الشؤون الاجتماعية",
    accent: "var(--brand-green)",
  },
  {
    icon: ShieldCheck,
    title: "تدقيق مالي مستقل",
    detail: "تدقيق دوري من مراجعين معتمدين",
    accent: "var(--brand-gold)",
  },
  {
    icon: Award,
    title: "معايير جودة",
    detail: "متوافق مع معايير المنظمات الدولية",
    accent: "var(--brand-green-light)",
  },
  {
    icon: FileCheck,
    title: "تقارير علنية",
    detail: "تقارير سنوية ومراجعات مالية معلنة",
    accent: "var(--brand-gold)",
  },
  {
    icon: Building2,
    title: "حضور ميداني",
    detail: "مكاتب في عدة محافظات يمنية",
    accent: "var(--brand-green)",
  },
  {
    icon: Globe,
    title: "شراكات دولية",
    detail: "تعاون مع مؤسسات إقليمية ودولية",
    accent: "var(--brand-gold)",
  },
];

export function InstitutionalAuthorityBar() {
  return (
    <section
      dir="rtl"
      className="relative overflow-hidden border-b border-[var(--border)]"
      style={{
        background: "linear-gradient(135deg, var(--brand-green-dark) 0%, var(--brand-green) 100%)",
      }}
    >
      <div className="absolute inset-0 pattern-khatam-white opacity-[0.05] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-sm border border-white/20 text-white/90">
            <ShieldCheck className="w-3.5 h-3.5" />
            منظمة مرخّصة ومعتمدة رسمياً
          </span>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {AUTHORITY_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group relative bg-white/[0.07] backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/25 hover:bg-white/[0.12] transition-all duration-300"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{
                  background: `${item.accent}22`,
                  border: `1px solid ${item.accent}44`,
                }}
              >
                <item.icon className="w-4.5 h-4.5" style={{ color: item.accent }} />
              </div>
              <div className="text-white font-bold text-sm mb-1 leading-snug">{item.title}</div>
              <div className="text-white/55 text-xs leading-relaxed">{item.detail}</div>
            </motion.div>
          ))}
        </div>

        {/* Bottom assurance line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/40 text-xs"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            جميع التقارير متاحة للعموم
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-gold)] animate-pulse" />
            تدقيق مالي سنوي مستقل
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            متوافق مع معايير الشفافية الدولية
          </span>
        </motion.div>
      </div>
    </section>
  );
}


