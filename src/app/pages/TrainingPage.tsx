// Training Courses Page - صفحة الدورات التدريبية
import { motion } from "motion/react";
import { useState } from "react";
import {
  GraduationCap,
  Clock,
  Award,
  BookOpen,
  Calendar,
  Users,
  CheckCircle,
  Loader2,
  Shield,
  ChevronDown,
  ChevronLeft,
  Target,
  Sparkles,
  Star,
  Building2,
  FileText,
  Stethoscope,
  AlertTriangle,
  Users2,
  Calculator,
  ArrowLeft,
} from "lucide-react";

// ═══════════════════════════════════════════════════════
// الدورات التدريبية
// ═══════════════════════════════════════════════════════
const COURSES = [
  {
    id: "project-management",
    title: "إدارة المشاريع الإنسانية",
    duration: "٤٠ ساعة",
    durationNum: 40,
    icon: Target,
    color: "var(--brand-green)",
    bgColor: "var(--brand-green-pale)",
    description:
      "دورة شاملة في مبادئ إدارة المشاريع الإنسانية وفقاً للمعايير الدولية. تشمل التخطيط والمتابعة والتقييم و拤يد المخرجات.",
    prerequisites: [
      "إجادة استخدام الحاسب الآلي",
      "خبرة سابقة في العمل الميداني (مفضلة)",
      "إتقان اللغة العربية قراءةً وكتابةً",
    ],
    certificate: "شهادة إدارة مشاريع إنسانية معتمدة",
    sessions: [
      { date: "٢٠٢٦/١٠/١٥ — ١٨/١٠/٢٠٢٦", location: "عدن — المقر الرئيسي", available: true },
      { date: "٢٠٢٦/١٢/٠٥ — ٠٨/١٢/٢٠٢٦", location: "صنعاء — فرع الشمال", available: true },
      { date: "٢٠٢٧/٠٢/٢٠ — ٢٣/٠٢/٢٠٢٧", location: "عدن — المقر الرئيسي", available: false },
    ],
  },
  {
    id: "first-aid",
    title: "الإسعافات الأولية",
    duration: "٢٤ ساعة",
    durationNum: 24,
    icon: Stethoscope,
    color: "var(--destructive)",
    bgColor: "var(--danger-bg)",
    description:
      "دورة عملية في الإسعافات الأولية ومهارات التعامل مع الحالات الطارئة. تتضمن التدريب على الإصابات والحروق والصدمات.",
    prerequisites: [
      "العمر فوق ١٨ سنة",
      "لياقة بدنية مناسبة للتدريب الميداني",
      "الرغبة في تعلم مهارات إنقاذ الأرواح",
    ],
    certificate: "شهادة إسعافات أولية — صالحة لمدة سنتين",
    sessions: [
      { date: "٢٠٢٦/٠٩/٢٠ — ٢٢/٠٩/٢٠٢٦", location: "عدن — مركز التدريب", available: true },
      { date: "٢٠٢٦/١١/١٠ — ١٢/١١/٢٠٢٦", location: "المكلا — فرع حضرموت", available: true },
      { date: "٢٠٢٧/٠١/١٥ — ١٧/٠١/٢٠٢٧", location: "عدن — مركز التدريب", available: false },
    ],
  },
  {
    id: "crisis-management",
    title: "التعامل مع الأزمات",
    duration: "٣٢ ساعة",
    durationNum: 32,
    icon: AlertTriangle,
    color: "var(--brand-gold)",
    bgColor: "var(--brand-gold-pale)",
    description:
      "دورة متقدمة في إدارة الأزمات والكوارث. تشمل آليات الاستجابة السريعة والتواصل مع الجهات المعنية وإدارة المخاطر.",
    prerequisites: [
      "إكمال دورة الإسعافات الأولية أو ما يعادلها",
      "خبرة في العمل الميداني في مشاريع إنسانية",
      "قدرة على اتخاذ القرار تحت الضغط",
    ],
    certificate: "شهادة إدارة أزمات متقدمة",
    sessions: [
      { date: "٢٠٢٦/١٠/٢٥ — ٢٩/١٠/٢٠٢٦", location: "عدن — المقر الرئيسي", available: true },
      { date: "٢٠٢٧/٠١/١٠ — ١٤/٠١/٢٠٢٧", location: "صنعاء — فرع الشمال", available: true },
      { date: "٢٠٢٧/٠٣/٢٠ — ٢٤/٠٣/٢٠٢٧", location: "عدن — المقر الرئيسي", available: false },
    ],
  },
  {
    id: "community-leadership",
    title: "القيادة المجتمعية",
    duration: "٢٠ ساعة",
    durationNum: 20,
    icon: Users2,
    color: "#6366f1",
    bgColor: "#eef2ff",
    description:
      "دورة في بناء القيادات المجتمعية وتمكين الشباب من قيادة التغيير. تشمل مهارات التواصل والتأثير وبناء الشراكات.",
    prerequisites: [
      "الإسهام في عمل تطوعي سابق (مفضلة)",
      "الرغبة في بناء مهارات قيادية",
      "التعاون والعمل الجماعي",
    ],
    certificate: "شهادة قيادة مجتمعية",
    sessions: [
      { date: "٢٠٢٦/٠٩/٢٥ — ٢٧/٠٩/٢٠٢٦", location: "عدن — مركز القيادة", available: true },
      { date: "٢٠٢٦/١٢/١٥ — ١٧/١٢/٢٠٢٦", location: "المكلا — فرع حضرموت", available: true },
      { date: "٢٠٢٧/٠٢/١٠ — ١٢/٠٢/٢٠٢٧", location: "عدن — مركز القيادة", available: false },
    ],
  },
  {
    id: "financial-accountability",
    title: "المحاسبة والشفافية المالية",
    duration: "٤٠ ساعة",
    durationNum: 40,
    icon: Calculator,
    color: "var(--brand-gold-dark)",
    bgColor: "var(--brand-gold-pale)",
    description:
      "دورة شاملة في مبادئ المحاسبة والشفافية المالية للمؤسسات غير الربحية. تشمل المحاسبة الشرعية وإعداد التقارير المالية.",
    prerequisites: [
      "إجادة استخدام البرامج المحاسبية",
      "إتقان اللغة العربية والرياضيات",
      "إجادة استخدام الحاسب الآلي",
    ],
    certificate: "شهادة محاسبة مؤسسات غير ربحية",
    sessions: [
      { date: "٢٠٢٦/١٠/٢٠ — ٢٣/١٠/٢٠٢٦", location: "عدن — المركز التدريبي", available: true },
      { date: "٢٠٢٦/١٢/٢٥ — ٢٨/١٢/٢٠٢٦", location: "صنعاء — فرع الشمال", available: true },
      { date: "٢٠٢٧/٠٣/٠٥ — ٠٨/٠٣/٢٠٢٧", location: "عدن — المركز التدريبي", available: false },
    ],
  },
];

// ═══════════════════════════════════════════════════════
// شركاء التدريب
// ═══════════════════════════════════════════════════════
const PARTNERS = [
  { name: "ال얀قة للتدريب", type: "تدريب ومعايير دولية" },
  { name: "الهلال الأحمر اليمني", type: "إسعافات أولية وطوارئ" },
  { name: "جامعة عدن", type: "傘عمة أكاديمية" },
  { name: "منظمة الصحة العالمية", type: "معايير صحية وتدريب صحي" },
];

export default function TrainingPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [submittedCourse, setSubmittedCourse] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    honeypot: "",
  });

  const activeCourse = COURSES.find((c) => c.id === selectedCourse);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent, courseId: string) => {
    e.preventDefault();
    if (formData.honeypot) return;
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSending(false);
    setSubmittedCourse(courseId);
  };

  // ═══════════════════════════════════════════════════════
  // صفحة النجاح لدورة معينة
  // ═══════════════════════════════════════════════════════
  if (submittedCourse) {
    const course = COURSES.find((c) => c.id === submittedCourse);
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
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              تم تسجيلك بنجاح!
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg mb-4 leading-[2]">
              تم استلام طلبك للدورة التدريبية:
            </p>
            <p className="text-xl font-bold text-[var(--brand-green)] mb-6">
              {course?.title}
            </p>
            <p className="text-[var(--muted-foreground)] text-sm mb-8 leading-[1.8]">
              سيقوم فريق التنسيق بالتواصل معك خلال{" "}
              <span className="font-bold text-[var(--brand-green)]">٤٨ ساعة</span>{" "}
              لتأإداء موعدك وتزويدك بالتفاصيل اللازمة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmittedCourse(null);
                  setSelectedCourse(null);
                  setFormData({ name: "", phone: "", email: "", notes: "", honeypot: "" });
                }}
                className="px-8 py-3 bg-[var(--brand-green)] text-white rounded-2xl font-bold hover:bg-[var(--brand-green-light)] transition-all duration-300 shadow-[var(--shadow-md)]"
              >
                التسجيل في دورة أخرى
              </button>
              <button
                onClick={() => {
                  setSubmittedCourse(null);
                  setSelectedCourse(null);
                  setFormData({ name: "", phone: "", email: "", notes: "", honeypot: "" });
                }}
                className="px-8 py-3 border-2 border-[var(--brand-green)] text-[var(--brand-green)] rounded-2xl font-bold hover:bg-[var(--brand-green)]/5 transition-all duration-300"
              >
                العودة للرئيسية
              </button>
            </div>
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
      <section className="relative overflow-hidden bg-[var(--brand-green-dark)] py-28 text-white sm:py-36">
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
              <GraduationCap className="h-4 w-4 text-[var(--brand-gold)]" />
              الدورات التدريبية المتخصصة
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              بناء القدرات — استثمار في المستقبل
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-[1.8] mb-10">
              دورات تدريبية متخصصة صُممت لتأهيل القوى العاملة في_sector الإنساني.
              احترف. تطوّر. أثّر.
            </p>
          </motion.div>

          {/* إحصائيات سريعة */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { value: "٥", label: "دورات متخصصة", icon: BookOpen },
              { value: "١٥٦", label: "ساعة تدريب", icon: Clock },
              { value: "٢٠٠+", label: "متدرب نشط", icon: Users },
              { value: "٩٥٪", label: "نسبة الرضا", icon: Star },
            ].map((stat, i) => (
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
          ﴿ رَبِّ زِدْنِي عِلْمًا ﴾
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          سورة طه، الآية ١١٤
        </p>
      </div>

      {/* ═══════════════════════════════════════════
          الدورات التدريبية
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-bold tracking-wider mb-4">
              <span className="h-px w-8 bg-[var(--brand-green)]" />
              الدورات المتاحة
              <span className="h-px w-8 bg-[var(--brand-green)]" />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              اختر الدورة التي تناسبك
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-[1.8]">
              دورات تدريبية متخصصة في خمسة محاور أساسية — كل دورة مصممة بعناية
              لتزويدك بالمهارات العملية التي تحتاجها.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COURSES.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`bg-[var(--card)] rounded-3xl border-2 overflow-hidden transition-all duration-300 ${
                  selectedCourse === course.id
                    ? "border-[var(--brand-green)] shadow-[var(--shadow-glow)]"
                    : "border-[var(--border)] hover:border-[var(--brand-green)]/30 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)]"
                }`}
              >
                {/* Header */}
                <div className="p-8 pb-6">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: course.bgColor }}
                    >
                      <course.icon className="w-7 h-7" style={{ color: course.color }} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--muted-foreground)]" />
                      <span className="text-sm font-bold text-[var(--brand-green)]">
                        {course.duration}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-[1.8] mb-5">
                    {course.description}
                  </p>

                  {/* المتطلبات */}
                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-[var(--muted-foreground)] mb-2 uppercase tracking-wider">
                      المتطلبات
                    </h4>
                    <ul className="space-y-1.5">
                      {course.prerequisites.map((req) => (
                        <li
                          key={req}
                          className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[var(--brand-green)] mt-0.5 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* الشهادة */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--brand-gold-pale)]">
                    <Award className="w-5 h-5 text-[var(--brand-gold)] shrink-0" />
                    <span className="text-xs font-bold text-[var(--brand-gold-dark)]">
                      {course.certificate}
                    </span>
                  </div>
                </div>

                {/* أزرار */}
                <div className="px-8 pb-6">
                  <button
                    onClick={() =>
                      setSelectedCourse(selectedCourse === course.id ? null : course.id)
                    }
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                      selectedCourse === course.id
                        ? "bg-[var(--background)] text-[var(--brand-green)] border-2 border-[var(--brand-green)]"
                        : "bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-light)] shadow-[var(--shadow-sm)]"
                    }`}
                  >
                    {selectedCourse === course.id ? "إغلاق التفاصيل" : "عرض المواعيد والتسجيل"}
                  </button>
                </div>

                {/* تفاصيل المواعيد (متوسّع) */}
                {selectedCourse === course.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-[var(--border)] bg-[var(--secondary)]"
                  >
                    <div className="p-8">
                      <h4 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[var(--brand-green)]" />
                        المواعيد القادمة
                      </h4>
                      <div className="space-y-3 mb-8">
                        {course.sessions.map((session, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                              session.available
                                ? "border-[var(--brand-green)]/20 bg-[var(--card)]"
                                : "border-[var(--border)] bg-[var(--muted)] opacity-60"
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-[var(--brand-green)]" />
                                <span className="text-sm font-bold text-[var(--foreground)]">
                                  {session.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                                <span className="text-xs text-[var(--muted-foreground)]">
                                  {session.location}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${
                                session.available
                                  ? "bg-[var(--brand-green-pale)] text-[var(--brand-green)]"
                                  : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                              }`}
                            >
                              {session.available ? "متاح" : "مكتمل"}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* نموذج التسجيل في الدورة */}
                      <div className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)]">
                        <h4 className="font-bold text-[var(--foreground)] mb-4">
                          التسجيل في دورة: {course.title}
                        </h4>
                        <form
                          onSubmit={(e) => handleSubmit(e, course.id)}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor={`train-name-${course.id}`}
                                className="block text-sm font-bold text-[var(--foreground)] mb-1.5"
                              >
                                الاسم الكامل *
                              </label>
                              <input
                                id={`train-name-${course.id}`}
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all text-sm"
                                placeholder="الاسم كما في الهوية"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`train-phone-${course.id}`}
                                className="block text-sm font-bold text-[var(--foreground)] mb-1.5"
                              >
                                رقم الهاتف *
                              </label>
                              <input
                                id={`train-phone-${course.id}`}
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all text-sm"
                                placeholder="+967 7XX XXX XXX"
                                dir="ltr"
                                style={{ textAlign: "right" }}
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor={`train-email-${course.id}`}
                              className="block text-sm font-bold text-[var(--foreground)] mb-1.5"
                            >
                              البريد الإلكتروني *
                            </label>
                            <input
                              id={`train-email-${course.id}`}
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all text-sm"
                              placeholder="yourname@example.com"
                              dir="ltr"
                              style={{ textAlign: "right" }}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`train-notes-${course.id}`}
                              className="block text-sm font-bold text-[var(--foreground)] mb-1.5"
                            >
                              ملاحظات إضافية
                            </label>
                            <textarea
                              id={`train-notes-${course.id}`}
                              name="notes"
                              rows={3}
                              value={formData.notes}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand-green)] focus:ring-2 focus:ring-[var(--brand-green)]/20 outline-none transition-all resize-none text-sm"
                              placeholder="أي ملاحظات أو استفسارات..."
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

                          <button
                            type="submit"
                            disabled={sending}
                            className="w-full bg-[var(--brand-green)] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--brand-green-light)] transition-all duration-300 shadow-[var(--shadow-md)] disabled:opacity-50"
                          >
                            {sending ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                جاري التسجيل...
                              </>
                            ) : (
                              <>
                                <GraduationCap className="w-5 h-5" />
                                تسجيل في الدورة
                              </>
                            )}
                          </button>
                          <div className="text-center text-xs text-[var(--muted-foreground)]">
                            <div className="flex items-center justify-center gap-2">
                              <Shield className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                              بياناتك آمنة ولن تُستخدم لأغراض أخرى
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          الجدول الزمني التقديري
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--secondary)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-gold-dark)] text-sm font-bold tracking-wider mb-4">
              <span className="h-px w-8 bg-[var(--brand-gold)]" />
              الجدول الزمني
              <span className="h-px w-8 bg-[var(--brand-gold)]" />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              المواعيد القادمة للدورات
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-[1.8]">
              راجع الجدول أدناه واختر الموعد الأنسب لك. يمكنك التسجيل في أي دورة متاحة.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-[var(--shadow-md)] overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 bg-[var(--brand-green-dark)] text-white text-sm font-bold">
                  <div className="p-4">الدورة</div>
                  <div className="p-4">المدة</div>
                  <div className="p-4">الموعد القادم</div>
                  <div className="p-4">الحالة</div>
                </div>
                {/* Rows */}
                {COURSES.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`grid grid-cols-4 border-t border-[var(--border)] text-sm ${
                      i % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--secondary)]"
                    }`}
                  >
                    <div className="p-4 font-bold text-[var(--foreground)] flex items-center gap-2">
                      <course.icon className="w-4 h-4" style={{ color: course.color }} />
                      {course.title}
                    </div>
                    <div className="p-4 text-[var(--muted-foreground)] flex items-center">
                      {course.duration}
                    </div>
                    <div className="p-4 text-[var(--muted-foreground)] flex items-center">
                      {course.sessions[0].date}
                    </div>
                    <div className="p-4 flex items-center">
                      <span className="px-3 py-1 rounded-full bg-[var(--brand-green-pale)] text-[var(--brand-green)] text-xs font-bold">
                        {course.sessions[0].available ? "متاح" : "مكتمل"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          شركاء التدريب
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-bold tracking-wider mb-4">
              <span className="h-px w-8 bg-[var(--brand-green)]" />
              شركاؤنا في التدريب
              <span className="h-px w-8 bg-[var(--brand-green)]" />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              مؤسسات تدريبية معتمدة
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-[1.8]">
              نتعاون مع أفضل المؤسسات التدريبية لضمان أعلى معايير الجودة في برامجنا.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {PARTNERS.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--brand-green-pale)] flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-[var(--brand-green)]" />
                </div>
                <h3 className="font-bold text-[var(--foreground)] mb-1">{partner.name}</h3>
                <p className="text-xs text-[var(--muted-foreground)]">{partner.type}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          مميزات التدريب
          ═══════════════════════════════════════════ */}
      <section className="bg-[var(--brand-green-dark)] py-24 sm:py-32 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "var(--pattern-rub-el-hizb)",
            backgroundSize: "200px 200px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Sparkles className="w-10 h-10 text-[var(--brand-gold)] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              لماذا تدريبنا يختلف؟
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto leading-[1.8]">
              نقدم تدريباً عملياً يرتكز على الخبرة الميدانية الحقيقية — لا نكتفي بالنظريات.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Target,
                title: "تدريب عملي ١٠٠٪",
                description: "تمارين حالة حقيقية ومحاكاة أزمات تعكس التحديات الميدانية الفعلية",
              },
              {
                icon: Users,
                title: "مدربون ميدانيون",
                description: "مدرّبون نشطون في العمل الإنساني يمتلكون خبرة مباشرة فيYL",
              },
              {
                icon: Award,
                title: "شهادات معتمدة",
                description: "شهادات تُعترف بها من المؤسسات الإنسانية الدولية وتعزز فرص التوظيف",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
              >
                <item.icon className="w-10 h-10 text-[var(--brand-gold)] mx-auto mb-5" />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-white/70 leading-[1.8]">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <a
              href="#courses"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--brand-gold)] text-white rounded-2xl font-bold text-lg hover:bg-[var(--brand-gold-light)] transition-all duration-300 shadow-[var(--shadow-glow-gold)]"
            >
              <GraduationCap className="w-6 h-6" />
              استعرض الدورات والسجل الآن
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
