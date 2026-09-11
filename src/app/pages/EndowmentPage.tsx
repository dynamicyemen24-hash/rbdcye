// Endowment Page - الوقف الخيري
import {
  Building2,
  Heart,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TrendingUp,
  Users,
  Shield,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Clock,
  Target,
  Award,
  Infinity,
  Landmark,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import { useSEO } from "@/utils/seoAdvanced";

export default function EndowmentPage() {
  const navigate = useNavigate();

  useSEO({
    title: "الوقف الخيري - رحماء بينهم",
    description: "الوقف الخيري المستدام لـ رحماء بينهم",
  });

  const endowmentFeatures = [
    {
      icon: Infinity,
      title: "أثر مستدام",
      desc: "وقف استثماري يضمن استمرارية المشاريع الإنسانية لعقود قادمة",
    },
    {
      icon: Building2,
      title: "أصول وقفية",
      desc: "أراضٍ وعقارات منتجة تدر عوائد ثابتة لدعم برامجنا",
    },
    {
      icon: Shield,
      title: "إدارة احترافية",
      desc: "إدارة متخصصة للاستثمارات الوقفية وفق أفضل الممارسات",
    },
    {
      icon: Award,
      title: "صدقة جارية",
      desc: "أجر مستمر لك بعد وفاتك مع كل انتفاع بمشاريع الوقف",
    },
  ];

  const endowmentProjects = [
    {
      name: "وقف كسوة الشتاء",
      target: "٥٠ مليون ر.ي",
      raised: "١٦ مليون ر.ي",
      progress: 32,
      description: "تأمين بطانيات ودفايات وملابس شتوية للأسر المتضررة في المحافظات الريفية خلال فصل الشتاء القارس.",
      impact: "١,٢٠٠ أسرة مستفيدة حتى الآن",
    },
    {
      name: "وقف آبار المياه النقية",
      target: "٧٥ مليون ر.ي",
      raised: "٣٣.٧٥ مليون ر.ي",
      progress: 45,
      description: "حفر وتجهيز آبار مياه عذبة في المناطق المحرومة من شبكات المياه في مأرب وشبوة والحديدة.",
      impact: "٨ آبار مياه مكتملة، ١٢ قيد الإنشاء",
    },
    {
      name: "وقف التعليم والتحفيظ",
      target: "٤٠ مليون ر.ي",
      raised: "١١.٢ مليون ر.ي",
      progress: 28,
      description: "إنشاء حلقات تحفيظ القرآن الكريم ودروس تعليمية أساسية للفتيان والأطفال في المساجد والمدارس المجتمعية.",
      impact: "٤٥٠ طالب في حلقات التحفيظ",
    },
  ];

  return (
    <div className="min-h-screen pt-20" dir="rtl">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-6">
              <Landmark className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">الوقف الخيري</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              الوقف الخيري <span className="text-[var(--brand-gold-light)]">المستدام</span>
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
              اجعل أثر عطائك مستمراً للأبد. ساهم في بناء وقف خيري يضمن استمرارية المشاريع الإنسانية
              والتنموية للأجيال القادمة.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="px-8 py-4 bg-[var(--card)] text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
              >
                ساهم في الوقف
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-8 py-4 border-2 border-white/40 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                استفسر عن الوقف
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ آية قرآنية ═══════ */}
      <div className="my-8 rounded-2xl border border-[var(--brand-gold)]/20 bg-gradient-to-l from-[var(--brand-gold)]/5 to-transparent p-6 text-center">
        <p className="font-amiri text-xl leading-loose text-[var(--foreground)] md:text-2xl" dir="rtl">
          ﴿ مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنْبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ ﴾
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">سورة البقرة، الآية ٢٦١</p>
      </div>

      {/* Stats */}
      <section className="py-16 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: "١٦٥ مليون ر.ي", label: "إجمالي رأس المال الوقفي", icon: Target },
              { value: "١,٢٠٠+", label: "أسرة مستفيدة", icon: Users },
              { value: "٨ آبار", label: "مياه مكتملة", icon: Building2 },
              { value: "٤٥٠ طالب", label: "في حلقات التحفيظ", icon: Award },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-[var(--secondary)] border border-[var(--border)]"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--brand-green-pale)] flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-[var(--brand-green)]" />
                </div>
                <div className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</div>
                <div className="text-sm text-[var(--muted-foreground)] mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[var(--secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              مميزات <span className="text-[var(--brand-green)]">الوقف</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              الوقف الخيري هو استثمار في الآخرة وأجر مستمر بإذن الله
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {endowmentFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)] flex items-center justify-center mb-5">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{feature.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Endowment Projects */}
      <section className="py-16 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              مشاريع <span className="text-[var(--brand-green)]">وقفية</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              استثمر في مشاريع وقفية متنوعة العوائد
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {endowmentProjects.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[var(--foreground)]">{project.name}</h3>
                  <span className="text-xs font-semibold text-[var(--brand-green)] bg-[var(--brand-green-pale)] px-3 py-1 rounded-full">
                    {project.impact}
                  </span>
                </div>

                <p className="text-sm text-[var(--muted-foreground)] mb-4">{project.description}</p>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-[var(--muted-foreground)]">تم جمع</span>
                    <span className="font-semibold text-[var(--brand-green)]">
                      {project.raised}
                    </span>
                  </div>
                  <div className="h-2.5 bg-[var(--muted)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green-light)]"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mt-1">
                    <span>{project.progress}%</span>
                    <span>المستهدف: {project.target}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/donate")}
                  className="w-full py-3 bg-[var(--brand-green)] text-white rounded-xl font-semibold hover:bg-[var(--brand-green-light)] transition-colors"
                >
                  ساهم الآن
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How the Endowment Works */}
      <section className="py-16 bg-[var(--secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              كيف يعمل <span className="text-[var(--brand-green)]">الوقف</span>؟
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              ورشة عمل الوقف — من الشرعية الإسلامية إلى التطبيق العملي
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Quranic Verse */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] shadow-lg mb-8 text-center"
            >
              <p className="text-xl text-[var(--foreground)] leading-loose font-medium mb-4">
                ﴿ وَمَا آتَيْتُم مِّن زَكَاةٍ تُرِيدُونَ وَجْهَ اللَّهِ فَأُولَٰئِكَ هُمُ الْمُضْلِحُونَ ﴾
              </p>
              <span className="text-sm text-[var(--muted-foreground)]">سورة الروم، الآية ٣٩</span>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "الخطوة الأولى",
                  title: "تأسيس الوقف",
                  desc: "يُسجَّل الوقف رسمياً لدى الجهات الرقابية ويُنشأ صندوق خاص لإدارته وفق أحكام الشريعة الإسلامية والأنظمة اليمنية المعمول بها.",
                },
                {
                  step: "الخطوة الثانية",
                  title: "الاستثمار والتشغيل",
                  desc: "تُستثمر أموال الوقف في مشاريع منتجة (عقارات، أراضٍ زراعية، صناديق نقدي) وتُخصص عوائدها لتمويل المشاريع الخيرية المستدامة.",
                },
                {
                  step: "الخطوة الثالثة",
                  title: "التوزيع والاستدامة",
                  desc: "تُوزَّع العوائد على المستفيدين المستهدفين (أسر محتاجة، طلاب، مشاريع مياه) مع إعادة استثمار جزء منها لضمان استمرارية الأثر لعقود قادمة.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-md"
                >
                  <span className="text-xs font-bold text-[var(--brand-green)] bg-[var(--brand-green-pale)] px-3 py-1 rounded-full">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mt-3 mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Heart className="w-16 h-16 text-white/30 mx-auto mb-6" fill="currentColor" />
            <h2 className="text-3xl font-bold text-white mb-4">اجعل أثر عطائك مستمراً</h2>
            <p className="text-white/80 text-lg mb-8">
              انضم إلى الواقفين واجعل لك صدقة جارية إلى يوم القيامة
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="px-8 py-4 bg-[var(--card)] text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              تواصل معنا للاستفسار
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
