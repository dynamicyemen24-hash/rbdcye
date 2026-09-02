import { Shield, Sparkles, Award, Users, Heart } from "lucide-react";
import { motion } from "motion/react";

interface CoreValuesProps {
  readonly onActionClick?: () => void;
}

const VALUES = [
  {
    id: "sincerity",
    title: "الإخلاص",
    description: "نية صادقة لله تعالى في كل خطوة ومبادرة، نبتغي بها وجه الله وخدمة الأمة.",
    icon: Heart,
    color: "#8F6A1A",
    bg: "#FDF8EE",
  },
  {
    id: "transparency",
    title: "الشفافية",
    description: "إفصاح ووضوح تام في مسارات التبرع، وتوثيق ميداني وتقارير حوكمة دقيقة.",
    icon: Shield,
    color: "#0F4C3A",
    bg: "#F0FDF4",
  },
  {
    id: "perfection",
    title: "الإتقان",
    description: "جودة متميزة بتنفيذ المشاريع، وتطبيق أرفع معايير التخطيط والإنجاز التنموي.",
    icon: Award,
    color: "#0F4C3A",
    bg: "#F0FDF4",
  },
  {
    id: "responsibility",
    title: "المسؤولية",
    description: "أمانة راسخة أمام الله والمجتمع، والتزام كامل بالصيانة التنموية وحفظ الكرامة.",
    icon: Users,
    color: "#8F6A1A",
    bg: "#FDF8EE",
  },
  {
    id: "initiative",
    title: "المبادرة",
    description: "استجابة سريعة وفاعلة للاحتياجات الميدانية والأزمات الإنسانية عبر اليمن.",
    icon: Sparkles,
    color: "#0F4C3A",
    bg: "#F0FDF4",
  },
];

export function CoreValues({ onActionClick }: CoreValuesProps) {
  return (
    <section className="section-padding-lg bg-white relative overflow-hidden font-cairo" dir="rtl">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-green)]/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pattern-sanaani-arch opacity-15 pointer-events-none" />

      <div className="container-standard relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--brand-gold)]/15 text-[var(--brand-gold-dark)] dark:text-[var(--warning)] text-xs font-bold font-cairo border border-[var(--brand-gold)]/30 mb-3.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[var(--brand-gold-dark)] dark:text-[var(--warning)]" />
            <span>المبادئ والقيم المؤسسية الحاكمة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--foreground)] font-cairo mb-4 leading-tight">
            قيمنا الراسخة في <span className="text-[var(--brand-green)]">صناعة الأثر الإنساني</span>
          </h2>
          <div className="w-16 h-1 bg-[var(--brand-green)]/20 mx-auto rounded-full mb-4" />
          <p className="section-subtitle max-w-2xl mx-auto">
            نرتكز على منظومة قيمية صارمة توجه كل مشروع ميداني وريال ينفق لإحداث تحول حقيقي ومستدام
            يصون كرامة المستفيدين.
          </p>
        </div>

        {/* 5 Core Values Grid with 24px-32px Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-7 border border-[var(--border)] shadow-sm hover:shadow-xl hover:border-[var(--brand-green)]/40 transition-all flex flex-col justify-between text-center group cursor-pointer"
              >
                <div>
                  <div
                    className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-xs"
                    style={{ backgroundColor: val.bg, color: val.color }}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[var(--foreground)] font-cairo mb-3">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-cairo leading-relaxed font-medium">
                    {val.description}
                  </p>
                </div>

                <div
                  className="mt-8 pt-4 border-t border-[var(--border)] flex items-center justify-center text-xs font-black font-cairo"
                  style={{ color: val.color }}
                >
                  <span>ركيزة أساسية</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Strategic Anchor Link */}
        {onActionClick && (
          <div className="text-center mt-14">
            <motion.button
              onClick={onActionClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)] text-white font-cairo font-black text-sm border border-[var(--brand-green)] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>تعرف على الميثاق الأخلاقي والحوكمة الكاملة لعملنا</span>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}

export default CoreValues;
