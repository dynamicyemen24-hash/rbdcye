// Sadaqah Jariyah Page - صفحة الصدقة الجارية
import { motion } from "motion/react";
import {
  Droplets,
  Landmark,
  BookOpen,
  Stethoscope,
  Sprout,
  Wrench,
  Heart,
  Users,
  Award,
  TrendingUp,
  ArrowLeft,
  Sparkles,
  Infinity,
  Target,
  CheckCircle2,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSEO } from "@/utils/seoAdvanced";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("ar-YE").format(value);

interface SadaqahProject {
  id: string;
  title: string;
  description: string;
  cost: number;
  progress: number;
  raised: number;
  beneficiaries: string;
  impact: string;
  icon: typeof Droplets;
  color: string;
}

const projects: SadaqahProject[] = [
  {
    id: "wells",
    title: "آبار مياه",
    description: "حفر آبار ارتوازية تعمل بالطاقة الشمسية لتزويد القرى المحرومة بمياه الشرب النقية والمستمرة.",
    cost: 500000,
    progress: 72,
    raised: 360000,
    beneficiaries: "١٢,٠٠٠ شخص مستفيد",
    impact: "صحيحة مياه نقية تعمل على مدار الساعة",
    icon: Droplets,
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "mosque",
    title: "بناء وترميم مساجد",
    description: "بناء مساجد جديدة وترميم المساجد القديمة لتوفير بيئة مناسبة للعبادة والتعليم الشرعي.",
    cost: 300000,
    progress: 58,
    raised: 174000,
    beneficiaries: "٨,٥٠٠ مصلٍّ وطالب علم",
    impact: "بيئة تعليمية وروحانية مستدامة",
    icon: Landmark,
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: "library",
    title: "مكتبة علمية",
    description: "إنشاء مكتبة مجتمعية مجهزة بالكتب والمراجع العلمية لخدمة الطلاب والباحثين في المناطق الريفية.",
    cost: 200000,
    progress: 45,
    raised: 90000,
    beneficiaries: "٣,٢٠٠ طالب وباحث",
    impact: "وصول معرفي مستمر للأجيال",
    icon: BookOpen,
    color: "from-violet-500 to-purple-400",
  },
  {
    id: "clinic",
    title: "عيادة متنقلة",
    description: "تجهيز سيارة إسعاف مجهزة بالأجهزة الطبية الأساسية لتقديم الرعاية الصحية في المناطق النائية.",
    cost: 400000,
    progress: 65,
    raised: 260000,
    beneficiaries: "٥,٧٠٠ مريض سنوياً",
    impact: "رعاية صحية وقائية وعلاجية",
    icon: Stethoscope,
    color: "from-rose-500 to-pink-400",
  },
  {
    id: "farm",
    title: "مشروع زراعي",
    description: "إنشاء مزرعة زراعية مستدامة تعمل بنظام الري بالتنقيط لتوفير الغذاء والدخل للمجتمعات المحلية.",
    cost: 350000,
    progress: 52,
    raised: 182000,
    beneficiaries: "٤,٠٠٠ أسرة",
    impact: "أمن غذائي ودخل مستدام",
    icon: Sprout,
    color: "from-green-500 to-lime-400",
  },
  {
    id: "workshop",
    title: "ورشة تدريب مهني",
    description: "تدريب الشباب اليمني على مهارات مهنية مطلوبة في السوق لتعزيز فرص التوظيف وتمكينهم اقتصادياً.",
    cost: 250000,
    progress: 40,
    raised: 100000,
    beneficiaries: "١,٨٠٠ شاب وشابة",
    impact: "تمكين اقتصادي ومستقبل واعد",
    icon: Wrench,
    color: "from-amber-500 to-yellow-400",
  },
];

const impactStats = [
  { value: "٢٤", label: "مشروع مكتمل", icon: Award },
  { value: "٣٥,٠٠٠+", label: "مستفيد مباشر", icon: Users },
  { value: "٧", label: "محافظات يمنية", icon: Target },
  { value: "١٢", label: "سنة من الخدمة", icon: TrendingUp },
];

export default function SadaqahJariyahPage() {
  const navigate = useNavigate();

  useSEO({
    title: "الصدقة الجارية — أجر لا ينقطع | رحماء بينهم",
    description:
      "ساهم في مشاريع الصدقة الجارية المستمرة: آبار مياه، مساجد، مكتبات، عيادات متنقلة، مزارع، وورش تدريب. أجرك مستمر حتى يرث الله الأرض ومن عليها.",
    keywords: [
      "صدقة جارية",
      "صدقة جارية يمنية",
      "آبار مياه",
      "بناء مساجد",
      "رحماء بينهم",
      "صدقة مستمرة",
      "أجر مستمر",
    ],
  });

  return (
    <div className="min-h-screen pt-20" dir="rtl">
      {/* ═══════ Hero Section ═══════ */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[var(--brand-green-dark)] to-[var(--brand-green)]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand-gold)]/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-6">
              <Infinity className="w-4 h-4 text-[var(--brand-gold-light)]" />
              <span className="text-white text-sm font-medium">صدقة جارية</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              الصدقة الجارية{" "}
              <span className="text-[var(--brand-gold-light)]">— أجر لا ينقطع</span>
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
              الصدقة الجارية هي تلك التي تُنفق فيها مرة واحدة، لكنك تحصد ثمراتها وأجرها
              مستمر حتى يرث الله الأرض ومن عليها. فكن شريكاً في أجر لا ينقطع بإذن الله.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="px-8 py-4 bg-[var(--card)] text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                ابدأ صدقتك الآن
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-8 py-4 border-2 border-white/40 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
              >
                استفسر عن المشاريع
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Quranic Verse ═══════ */}
      <div className="my-8 mx-auto max-w-4xl rounded-2xl border border-[var(--brand-gold)]/20 bg-gradient-to-l from-[var(--brand-gold)]/5 to-transparent p-6 text-center">
        <p className="font-amiri text-xl leading-loose text-[var(--foreground)] md:text-2xl" dir="rtl">
          ﴿ مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ
          أَنْبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ ﴾
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">سورة البقرة، الآية ٢٦١</p>
      </div>

      {/* ═══════ Hadith Section ═══════ */}
      <section className="py-12 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-[var(--brand-green-pale)] px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-[var(--brand-green)]" />
              <span className="text-sm font-medium text-[var(--brand-green)]">حديث نبوي شريف</span>
            </div>
            <blockquote className="text-lg md:text-xl text-[var(--foreground)] leading-relaxed font-medium mb-4">
              «إذا مات الإنسان انقطع عمله إلا من ثلاثة: إلا من صدقة جارية، أو علم يُنتفع به، أو ولد صالح يدعو له»
            </blockquote>
            <p className="text-sm text-[var(--muted-foreground)]">رواه مسلم</p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Impact Stats ═══════ */}
      <section className="py-16 bg-[var(--secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              أثرنا <span className="text-[var(--brand-green)]">المتواصل</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              مشاريع صدقة جارية أثّرت في حياة آلاف الأسر اليمنية
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {impactStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--brand-green-pale)] flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-[var(--brand-green)]" />
                </div>
                <div className="text-3xl font-bold text-[var(--foreground)]">{stat.value}</div>
                <div className="text-sm text-[var(--muted-foreground)] mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Projects Grid ═══════ */}
      <section className="py-16 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              مشاريع <span className="text-[var(--brand-green)]">الصدقة الجارية</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              اختر مشروعك وابدأ أجرك المستمر — كل تبرع يصنع فرقاً حقيقياً
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {projects.map((project, i) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Icon Header */}
                  <div className={`relative p-6 bg-gradient-to-br ${project.color} text-white`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-medium opacity-80">التكلفة الإجمالية</div>
                        <div className="text-lg font-bold">{formatNumber(project.cost)} ر.ي</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{project.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-[var(--muted-foreground)]">تم جمع</span>
                        <span className="font-semibold text-[var(--brand-green)]">
                          {formatNumber(project.raised)} ر.ي
                        </span>
                      </div>
                      <div className="h-2.5 bg-[var(--muted)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${project.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: i * 0.2 }}
                          className="h-full rounded-full bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green-light)]"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mt-1">
                        <span>{project.progress}%</span>
                        <span>المستهدف: {formatNumber(project.cost)} ر.ي</span>
                      </div>
                    </div>

                    {/* Impact */}
                    <div className="flex items-start gap-2 p-3 bg-[var(--brand-green-pale)] rounded-xl mb-4">
                      <CheckCircle2 className="w-4 h-4 text-[var(--brand-green)] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-[var(--brand-green)]">{project.beneficiaries}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">{project.impact}</div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate("/donate")}
                      className="w-full py-3 bg-[var(--brand-green)] text-white rounded-xl font-bold hover:bg-[var(--brand-green-light)] transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      ساهم الآن
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ Cumulative Impact ═══════ */}
      <section className="py-16 bg-[var(--secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              الأثر <span className="text-[var(--brand-gold)]">التراكمي</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              مشروع واحد يغيّر حياةundreds. تبرعك اليوم يُبنى عليه غداً
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Water Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] shadow-lg text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-[var(--foreground)] mb-2">١٢</div>
              <div className="text-sm text-[var(--brand-green)] font-medium mb-1">بئر مياه مكتملة</div>
              <p className="text-xs text-[var(--muted-foreground)]">
                تعمل بالطاقة الشمسية وتزوّد أكثر من ١٢,٠٠٠ شخص بالمياه النقية على مدار الساعة
              </p>
            </motion.div>

            {/* Landmark Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] shadow-lg text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mx-auto mb-4">
                <Landmark className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-[var(--foreground)] mb-2">٨</div>
              <div className="text-sm text-[var(--brand-green)] font-medium mb-1">مساجد بناء وترميم</div>
              <p className="text-xs text-[var(--muted-foreground)]">
                بيئة روحانية وتعليمية مستدامة تخدم أكثر من ٨,٥٠٠ مصلٍّ وطالب علم يومياً
              </p>
            </motion.div>

            {/* Community Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] shadow-lg text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-[var(--foreground)] mb-2">٣٥,٠٠٠+</div>
              <div className="text-sm text-[var(--brand-green)] font-medium mb-1">مستفيد مباشر</div>
              <p className="text-xs text-[var(--muted-foreground)]">
                من مشاريع المياه والتعليم والصحة والتمكين الاقتصادي في ٧ محافظات يمنية
              </p>
            </motion.div>
          </div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] shadow-lg text-center">
              <Sparkles className="w-8 h-8 text-[var(--brand-gold)] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">
                كيف تعمل الصدقة الجارية؟
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-right">
                {[
                  {
                    step: "١",
                    title: "تختار المشروع",
                    desc: "اختر من بين مشاريع متنوعة تلبي احتياجات المجتمع اليمني",
                  },
                  {
                    step: "٢",
                    title: "تتبرع مرة واحدة",
                    desc: "تبرعك يُستخدم لبناء أو تجهيز المشروع المستدام",
                  },
                  {
                    step: "٣",
                    title: "أجرك مستمر",
                    desc: "كل شخص يستفيد من المشروع يُ增加值 أجرك حتى يرث الله الأرض",
                  },
                ].map((item, i) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-green)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--foreground)] mb-1">{item.title}</h4>
                      <p className="text-sm text-[var(--muted-foreground)]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Why Sadaqah Jariyah ═══════ */}
      <section className="py-16 bg-[var(--background)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              لماذا <span className="text-[var(--brand-green)]">الصدقة الجارية</span>؟
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Infinity,
                title: "أجر مستمر",
                desc: "تُنفق مرة واحدة لكن الأجر يتدفق مع كل انتفاع",
              },
              {
                icon: Users,
                title: "أثر مجتمعي",
                desc: "تُغيّر حياة مئات الأسر في مناطق محرومة",
              },
              {
                icon: TrendingUp,
                title: "مشاريع مستدامة",
                desc: "استثمارات تخدم الأجيال القادمة لا الحاضرة فقط",
              },
              {
                icon: Heart,
                title: "trust موثوق",
                desc: "إدارة شفافة مع متابعة مباشرة لحالة مشاريعك",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)] flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Footer CTA ═══════ */}
      <section className="py-20 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Heart className="w-16 h-16 text-white/30 mx-auto mb-6" fill="currentColor" />
            <h2 className="text-4xl font-bold text-white mb-4">
              ابدأ صدقة جارية اليوم
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              لا تؤجل خيرك — كل يوم تمر دون صدقة جارية هو فرصة ضائعة للأجر المستمر.
              اختر مشروعاً وابدأ رحلتك في الخير.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/donate")}
                className="px-8 py-4 bg-[var(--card)] text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                تبرع الآن
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-8 py-4 border-2 border-white/40 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
              >
                تواصل معنا
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
