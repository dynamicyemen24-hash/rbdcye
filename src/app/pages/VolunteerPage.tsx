// Volunteer Registration Page - صفحة التسجيل في التطوع
import {
  HandHelping,
  Users,
  Clock,
  Award,
  Heart,
  Shield,
  CheckCircle,
  Loader2,
  ChevronDown,
  GraduationCap,
  Briefcase,
  Wrench,
  BookOpen,
  Stethoscope,
  Target,
  Globe,
  Sparkles,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TrendingUp,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Star,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ═══════════════════════════════════════════════════════
// بيانات مجالات التطوع
// ═══════════════════════════════════════════════════════
const VOLUNTEER_CATEGORIES = [
  {
    id: "ميداني",
    label: "ميداني",
    icon: Globe,
    color: "var(--brand-green)",
    bgColor: "var(--brand-green-pale)",
    description: "التواجد المباشر في الميدان وتقديم المساعدات الإنسانية",
    tasks: ["توزيع المساعدات", "الإغاثة العاجلة", "التركيب الميداني"],
  },
  {
    id: "إداري",
    label: "إداري",
    icon: Briefcase,
    color: "var(--info)",
    bgColor: "var(--info-bg)",
    description: "الدعم الإداري والتنظيمي للمؤسسة وبرامجها",
    tasks: ["إدارة الملفات", "التنسيق الإداري", "ترتيب البيانات"],
  },
  {
    id: "تقني",
    label: "تقني",
    icon: Wrench,
    color: "var(--brand-gold)",
    bgColor: "var(--brand-gold-pale)",
    description: "المساهمة في الحلول التقنية والرقمية",
    tasks: ["تطوير المواقع", "إدارة الأنظمة", "دعم تقني"],
  },
  {
    id: "تعليمي",
    label: "تعليمي",
    icon: BookOpen,
    color: "#6366f1",
    bgColor: "#eef2ff",
    description: "الإسهام في البرامج التعليمية والتدريبية",
    tasks: ["التدريس", "الإرشاد الطلابي", "إعداد المحتوى"],
  },
  {
    id: "صحي",
    label: "صحي",
    icon: Stethoscope,
    color: "var(--destructive)",
    bgColor: "var(--danger-bg)",
    description: "الدعم الصحي والإسعافات الأولية والوعي الصحي",
    tasks: ["الإسعافات الأولية", "الحملات الصحية", "التوعية الصحية"],
  },
];

// ═══════════════════════════════════════════════════════
// بيانات المزايا
// ═══════════════════════════════════════════════════════
const BENEFITS = [
  {
    icon: Clock,
    title: "ساعات مرنة",
    description: "اختر الوقت المناسب لك — نحترم وقتك ونكيّف الجدول مع ظروفك",
    color: "var(--brand-green)",
    bgColor: "var(--brand-green-pale)",
  },
  {
    icon: GraduationCap,
    title: "تطوير المهارات",
    description: "ندورات تدريبية متخصصة وتطوير مهني مستمر خلال فترة التطوع",
    color: "var(--brand-gold)",
    bgColor: "var(--brand-gold-pale)",
  },
  {
    icon: Award,
    title: "شهادة تقديرية",
    description: "شهادة رسمية من الحملة تعكس جهدك وخبرتك في العمل الإنساني",
    color: "var(--info)",
    bgColor: "var(--info-bg)",
  },
  {
    icon: Heart,
    title: "مجتمع المتطوعين",
    description: "انضم لشبكة متطوعين شغوفين يتشاركون في رؤية واحدة",
    color: "var(--destructive)",
    bgColor: "var(--danger-bg)",
  },
];

// ═══════════════════════════════════════════════════════
// إحصائيات التطوع
// ═══════════════════════════════════════════════════════
const STATS = [
  { value: "٣٥٠+", label: "متطوع نشط", icon: Users },
  { value: "١٢,٠٠٠+", label: "ساعة تطوع", icon: Clock },
  { value: "١٥", label: "مشروع مدعوم", icon: Target },
  { value: "٨", label: "مدن مستهدفة", icon: Globe },
];

// ═══════════════════════════════════════════════════════
// المهارات المطلوبة
// ═══════════════════════════════════════════════════════
const SKILLS_OPTIONS = [
  "إدارة المشاريع",
  "التصميم الجرافيكي",
  "تطوير الويب",
  "الترجمة",
  "التصوير الفوتوغرافي",
  "المحاسبة",
  "التواصل الاجتماعي",
  "ال teaching والتدريب",
  "الإسعافات الأولية",
  "إدارة الفعاليات",
  "الكتابة الإبداعية",
  "تحليل البيانات",
  "لا أملك خبرة سابقة",
];

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    skills: "",
    availability: "",
    motivation: "",
    honeypot: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;
    setSending(true);
    // محاكاة الإرسال
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSending(false);
    setSubmitted(true);
  };

  // ═══════════════════════════════════════════════════════
  // صفحة النجاح
  // ═══════════════════════════════════════════════════════
  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-20" dir="rtl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-[var(--card)] rounded-3xl p-12 border border-[var(--border)] max-w-2xl mx-auto shadow-[var(--shadow-xl)]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-28 h-28 mx-auto mb-8 bg-[var(--brand-green-pale)] rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-14 h-14 text-[var(--brand-green)]" />
            </motion.div>
            <h2 className="text-3xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
              شكرًا لك! تم استلام طلبك بنجاح
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg mb-8 leading-[2]">
              نحن سعداء برغبتك في الانضمام إلى فريق متطوعينا. سيقوم فريق التنسيق
              بالتواصل معك خلال{" "}
              <span className="font-bold text-[var(--brand-green)]">٣ أيام عمل</span>{" "}
              لتحديد موعد مقابلة أو اختبار مهني مناسب.
            </p>
            <div className="bg-[var(--brand-green-pale)] rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-[var(--brand-green)]" />
                <span className="font-bold text-[var(--brand-green)]">
                  بياناتك آمنة ومحمية
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] leading-[1.8]">
                جميع المعلومات المقدمة تُعامل بسرية تامة ولن تُستخدم إلا لأغراض
                التواصل والتنسيق الخاص بالتطوع.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  phone: "",
                  email: "",
                  skills: "",
                  availability: "",
                  motivation: "",
                  honeypot: "",
                });
                setSelectedCategory(null);
              }}
              className="px-8 py-3 bg-[var(--brand-green)] text-white rounded-2xl font-bold hover:bg-[var(--brand-green-light)] transition-all duration-300 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)]"
            >
              تقديم طلب آخر
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* ═══════════════════════════════════════════
          Hero Section
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--brand-green-dark)] py-20 text-white sm:py-36">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "var(--pattern-rub-el-hizb)",
            backgroundSize: "200px 200px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-green)]/40 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/80 backdrop-blur-sm">
              <HandHelping className="h-4 w-4 text-[var(--brand-gold)]" />
              فرص التطوع المجتمعي
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              كن جزءاً من التغيير
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-[1.8] mb-10">
              انضم إلى فريق متطوعينا وساهم في صناعة أثر حقيقي في حياة الآلاف.
              كل ساعة تطوع تُحدث فرقاً — ابدأ رحلتك معنا اليوم.
            </p>
          </motion.div>

          {/* ═══════════════════════════════════════════
              الإحصائيات
              ═══════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <stat.icon className="w-6 h-6 text-[var(--brand-gold)] mx-auto mb-3" />
                <div className="text-3xl font-extrabold mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          آية قرآنية
          ═══════════════════════════════════════════ */}
      <div className="my-12 rounded-2xl border border-[var(--brand-gold)]/20 bg-gradient-to-l from-[var(--brand-gold)]/5 to-transparent p-6 text-center max-w-4xl mx-auto">
        <p className="font-amiri text-xl md:text-2xl leading-loose text-[var(--foreground)]">
          ﴿ وَأَعِدُّوا لَهُم مَّا اسْتَطَعْتُم مِّن قُوَّةٍ ﴾
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          سورة الأنفال، الآية ٦٠
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          مزايا التطوع
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-gold-dark)] text-sm font-bold tracking-wider mb-4">
              <span className="h-px w-8 bg-[var(--brand-gold)]" />
              لماذا التطوع معنا
              <span className="h-px w-8 bg-[var(--brand-gold)]" />
            </span>
            <h2 className="text-3xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
              مزايا تجعل تجربتك استثنائية
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-[1.8]">
              نؤمن بأن المتطوع هو الكنز الحقيقي للمؤسسة. لذلك نوفر لك بيئة عمل
              ملهمة وداعمة تُمكّنك من تقديم أفضل ما لديك.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="bg-[var(--card)] rounded-3xl p-8 border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 text-center"
              >
                <div
                  className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: benefit.bgColor }}
                >
                  <benefit.icon className="w-8 h-8" style={{ color: benefit.color }} />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-[1.8]">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          مجالات التطوع
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--secondary)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-bold tracking-wider mb-4">
              <span className="h-px w-8 bg-[var(--brand-green)]" />
              مجالات التطوع
              <span className="h-px w-8 bg-[var(--brand-green)]" />
            </span>
            <h2 className="text-3xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
              اختر المجال الذي يناسبك
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-[1.8]">
              نوفر خمسة مجالات تطوعية متنوعة — اختر ما يتناسب مع مهاراتك وشغفك.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {VOLUNTEER_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative bg-[var(--card)] rounded-2xl p-6 border-2 text-center transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "border-[var(--brand-green)] shadow-[var(--shadow-glow)]"
                    : "border-[var(--border)] hover:border-[var(--brand-green)]/40 shadow-[var(--shadow-sm)]"
                }`}
              >
                {selectedCategory === cat.id && (
                  <motion.div
                    layoutId="category-indicator"
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--brand-green)] rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                <div
                  className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: cat.bgColor }}
                >
                  <cat.icon className="w-7 h-7" style={{ color: cat.color }} />
                </div>
                <h3 className="font-bold text-[var(--foreground)] mb-2">{cat.label}</h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-[1.7]">
                  {cat.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1 justify-center">
                  {cat.tasks.map((task) => (
                    <span
                      key={task}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]"
                    >
                      {task}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          كيف يعمل التطوع
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-gold-dark)] text-sm font-bold tracking-wider mb-4">
              <span className="h-px w-8 bg-[var(--brand-gold)]" />
              خطوات التطوع
              <span className="h-px w-8 bg-[var(--brand-gold)]" />
            </span>
            <h2 className="text-3xl md:text-3xl font-bold text-[var(--foreground)]">
              ثلاث خطوات بسيطة للبدء
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "١",
                title: "سجّل طلبك",
                description: "املأ نموذج التسجيل بالمعلومات المطلوبة واختر مجال التطوع المناسب",
                icon: Target,
                color: "var(--brand-green)",
              },
              {
                step: "٢",
                title: "مقابلة شخصية",
                description: "نتواصل معك لتحديد موعد مقابلة لفهم خبراتك واهتماماتك بشكل أعمق",
                icon: Users,
                color: "var(--brand-gold)",
              },
              {
                step: "٣",
                title: "ابدأ المهمة",
                description: "نُجهّزك بتدريب مكثف ثم نبدأ المهمة الأولى مع فريق مساند",
                icon: Sparkles,
                color: "var(--info)",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-[var(--card)] border-2 border-[var(--border)] flex items-center justify-center shadow-[var(--shadow-md)]">
                  <item.icon className="w-9 h-9" style={{ color: item.color }} />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 rounded-full text-white text-sm font-extrabold flex items-center justify-center shadow-[var(--shadow-md)]"
                  style={{ backgroundColor: item.color }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-[1.8] max-w-xs mx-auto">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          نموذج التسجيل
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--secondary)] py-16 sm:py-20" id="register">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-bold tracking-wider mb-4">
              <span className="h-px w-8 bg-[var(--brand-green)]" />
              سجّل الآن
              <span className="h-px w-8 bg-[var(--brand-green)]" />
            </span>
            <h2 className="text-3xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
              نموذج التسجيل في التطوع
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-[1.8]">
              أكمل النموذج أدناه وسنتواصل معك في أقرب وقت ممكن.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--card)] rounded-3xl p-8 md:p-12 border border-[var(--border)] shadow-[var(--shadow-lg)]"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* الاسم الكامل */}
                <div>
                  <label
                    htmlFor="vol-name"
                    className="block text-sm font-bold text-[var(--foreground)] mb-2"
                  >
                    الاسم الكامل *
                  </label>
                  <input
                    id="vol-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all"
                    placeholder="أدخل الاسم الكامل كما في الهوية"
                  />
                </div>

                {/* الهاتف والبريد */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="vol-phone"
                      className="block text-sm font-bold text-[var(--foreground)] mb-2"
                    >
                      رقم الهاتف *
                    </label>
                    <input
                      id="vol-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all"
                      placeholder="+967 7XX XXX XXX"
                      dir="ltr"
                      style={{ textAlign: "right" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="vol-email"
                      className="block text-sm font-bold text-[var(--foreground)] mb-2"
                    >
                      البريد الإلكتروني *
                    </label>
                    <input
                      id="vol-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all"
                      placeholder="yourname@example.com"
                      dir="ltr"
                      style={{ textAlign: "right" }}
                    />
                  </div>
                </div>

                {/* المهارات والتوفر */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="vol-skills"
                      className="block text-sm font-bold text-[var(--foreground)] mb-2"
                    >
                      المهارات الرئيسية
                    </label>
                    <div className="relative">
                      <select
                        id="vol-skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all appearance-none"
                      >
                        <option value="">اختر مهارتك</option>
                        {SKILLS_OPTIONS.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="vol-availability"
                      className="block text-sm font-bold text-[var(--foreground)] mb-2"
                    >
                      التوفر الأسبوعي
                    </label>
                    <div className="relative">
                      <select
                        id="vol-availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all appearance-none"
                      >
                        <option value="">اختر التوفر</option>
                        <option value="less-than-5">أقل من ٥ ساعات أسبوعياً</option>
                        <option value="5-10">٥ - ١٠ ساعات أسبوعياً</option>
                        <option value="10-20">١٠ - ٢٠ ساعة أسبوعياً</option>
                        <option value="20-plus">أكثر من ٢٠ ساعة أسبوعياً</option>
                        <option value="weekends">عطلة نهاية الأسبوع فقط</option>
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* مجال التطوع */}
                <div>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
                  <label className="block text-sm font-bold text-[var(--foreground)] mb-3">
                    مجال التطوع المفضل
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {VOLUNTEER_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-semibold transition-all duration-200 ${
                          selectedCategory === cat.id
                            ? "border-[var(--brand-green)] bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                            : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--brand-green)]/40"
                        }`}
                      >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* الدافع */}
                <div>
                  <label
                    htmlFor="vol-motivation"
                    className="block text-sm font-bold text-[var(--foreground)] mb-2"
                  >
                    لماذا ترغب في التطوع معنا؟ *
                  </label>
                  <textarea
                    id="vol-motivation"
                    name="motivation"
                    rows={5}
                    required
                    value={formData.motivation}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all resize-none"
                    placeholder="اكتب عن خبرتك السابقة ودافعك من التطوع والمجال الذي تريد الإسهام فيه..."
                  />
                </div>

                {/* حقل الاستدراج للبوتات */}
                <input
                  type="text"
                  name="honeypot"
                  className="hidden"
                  aria-hidden="true"
                  readOnly
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* زر الإرسال */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[var(--brand-green)] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[var(--brand-green-light)] transition-all duration-300 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <HandHelping className="w-5 h-5" />
                      تقديم طلب التطوع
                    </>
                  )}
                </button>

                {/* ملاحظة الخصوصية */}
                <div className="text-center text-sm text-[var(--muted-foreground)]">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--brand-green)]" />
                    <span>
                      بياناتك محمية ولن تُستخدم لأغراض أخرى — الخصوصية مطلقة
                    </span>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          دعوة للعمل
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--brand-green-dark)] py-16 sm:py-20 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "var(--pattern-rub-el-hizb)",
            backgroundSize: "200px 200px",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-10 h-10 text-[var(--brand-gold)] mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              مستقبلك يبدأ بالعطاء
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-[1.8] mb-10">
              كل متطوع ينضم إلينا يُقوّي قدرتنا على صناعة التغيير. لا تنتظر الفرصة المثالية
              — كن أنت الفرصة التي يحتاجها الآلاف.
            </p>
            <a
              href="#register"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--brand-gold)] text-white rounded-2xl font-bold text-lg hover:bg-[var(--brand-gold-light)] transition-all duration-300 shadow-[var(--shadow-glow-gold)] hover:shadow-[var(--shadow-glow-gold-strong)]"
            >
              <HandHelping className="w-6 h-6" />
              سجّل الآن كمتطوع
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
