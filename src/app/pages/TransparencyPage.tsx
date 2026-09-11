// Transparency Page - صفحة الشفافية
import { motion } from "motion/react";
import {
  Shield,
  FileText,
  Eye,
  Award,
  Users,
  CheckCircle,
  Download,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSEO } from "@/utils/seoAdvanced";

const REPORTS = [
  {
    id: 1,
    year: "2025",
    title: "التقرير السنوي 2025",
    type: "سنوي",
    size: "4.2 MB",
    pages: 48,
    highlights: ["تقرير شامل عن الأداء البرمجي", "25 مشروعًا منجزًا", "ميزانية سنوية مُدفّقة"],
  },
  {
    id: 2,
    year: "2024",
    title: "التقرير السنوي 2024",
    type: "سنوي",
    size: "3.8 MB",
    pages: 42,
    highlights: ["شمل أكثر من 10,000 مستفيد", "20 مشروعًا تنمويًا", "ميزانية مُدفّقة"],
  },
  {
    id: 3,
    year: "2025/Q1",
    title: "التقرير الربعي الأول 2025",
    type: "ربعي",
    size: "1.5 MB",
    pages: 18,
    highlights: ["3,500 مستفيد مباشر", "8 مشاريع نشطة", "تقرير مالي مدقق"],
  },
  {
    id: 4,
    year: "2024/Q4",
    title: "التقرير الربعي الرابع 2024",
    type: "ربعي",
    size: "1.2 MB",
    pages: 15,
    highlights: ["2,800 مستفيد", "6 مشاريع مكتملة", "ميزانية مُدفّقة"],
  },
];

const BENCHMARKS = [
  { category: "نسبة البرامج", orgValue: "٨٤٪", benchmark: "٨٥٪", rating: "ممتاز", note: "أعلى من متوسط المنظمات المحلية (٧٠٪)" },
  { category: "المصروفات الإدارية", orgValue: "١١٪", benchmark: "١٥٪", rating: "ممتاز", note: "أقل من الحد الأقصى المعتمد دولياً" },
  { category: "نسبة الشفافية", orgValue: "سنوي", benchmark: "ربعية/سنوية", rating: "متوافق", note: "ننشر تقارير ربعية وسنوية مُدفّقة" },
  { category: "التدقيق المستقل", orgValue: "سنوي", benchmark: "سنوي على الأقل", rating: "متوافق", note: "مراجعة من مكتب محاسبة مستقل" },
];

const GOVERNANCE_BODIES = [
  {
    title: "مجلس الإدارة",
    members: "7 أعضاء",
    desc: "يتولى رسم السياسات العامة والإشراف الاستراتيجي على أداء الحملة واتخاذ القرارات الجوهرية المتعلقة بالمشاريع والشراكات.",
  },
  {
    title: "اللجنة التنفيذية",
    members: "5 أعضاء",
    desc: "تشرف على تنفيذ القرارات الصادرة عن مجلس الإدارة وإدارة العمليات اليومية وتنسيق الفرق الميدانية.",
  },
  {
    title: "لجنة التدقيق والمراجعة",
    members: "3 أعضاء",
    desc: "تراجع الحسابات المالية والتوثيق الداخلي بشكل دوري وتضمن الامتثال لمعايير المحاسبة الدولية(IRFIPSAS) والأنظمة المحلية.",
  },
  {
    title: "لجنة الحوكمة والنزاهة",
    members: "3 أعضاء",
    desc: "تقود تطبيق مبادئ الشفافية والمساءلة ومنع تعارض المصالح وتطبيق سياسات الحماية من الاستغلال والنصب.",
  },
];

const TRANSPARENCY_PILLARS = [
  {
    icon: Eye,
    title: "الإفصاح المالي المُدقق",
    desc: "نشر الإفصاحات المالية المُدققة من مراجع خارجي مستقل بشكل دوري — من التخصيص البرامجي إلى المصروفات التشغيلية، بإتاحة كاملة دون حجب أي بند.",
  },
  {
    icon: Award,
    title: "الحوكمة الرشيدة والرقابة",
    desc: "تطبيق أرقى معايير الحوكمة والرقابة الداخلية وفق معايير CHS و SPHERE — فصل السلطات، منع تعارض المصالح، وسياسات حماية صارمة.",
  },
  {
    icon: FileText,
    title: "الإفصاحات الدورية المنتظمة",
    desc: "إصدار إفصاحات شهرية وربعية وسنوية عن الأداء والأثر والتحديات، مع تفصيل المخرجات والمؤشرات لكل تدخل على حدة.",
  },
  {
    icon: Users,
    title: "المساءلة المجتمعية",
    desc: "منظومة مساءلة مجتمعية موثوقة لاستقبال الملاحظات والشكاوى والمقترحات — قنوات آمنة مع ضمان السرية والعدالة وسرعة الاستجابة.",
  },
];

export default function TransparencyPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | "سنوي" | "ربعي">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useSEO({
    title: "الحوكمة والإفصاح المؤسسي - رحماء بينهم",
    description: "الإفصاح المؤسسي والحوكمة الرشيدة في حملة رحماء بينهم — الإفصاحات المالية المدققة، البنية الحوكمية، ومعايير المساءلة والرقابة المستقلة.",
  });

  const filteredReports = REPORTS.filter((report) => {
    const matchesType = activeFilter === "all" || report.type === activeFilter;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 sm:pt-32" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-[var(--brand-green)]/10 to-[var(--background)]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[var(--brand-green)]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[var(--brand-gold)]/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-[var(--card)]/80 backdrop-blur-sm border border-[var(--brand-green)]/20 px-5 py-2 rounded-full mb-6 shadow-lg">
              <Shield className="w-4 h-4 text-[var(--brand-green)]" />
              <span className="text-[var(--brand-green)] text-sm font-bold tracking-wide">
                الحوكمة والإفصاح المؤسسي
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
              <span className="text-[var(--foreground)]">الحوكمة </span>
              <span className="text-[var(--brand-green)]">ركنٌ راسخ</span>
            </h1>

            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto leading-[2] mb-8">
              في حملة رحماء بينهم، نُعدّ الإفصاح المؤسسي والحوكمة الرشيدة أساساً لبناء الثقة المستدامة
              مع شركائنا والمستفيدين والجهات الرقابية. نلتزم بأرقى معايير الإفصاح المالي والرقابة المستقلة
              لضمان وصول كل تبرع إلى مستحقه بكفاءة ونزاهة مُطلقة.
            </p>

            {/* Governance Promise — بلا أرقام مالية، حفظاً للخصوصية */}
            <div className="mt-8 rounded-2xl border border-[var(--brand-green)]/10 bg-[var(--card)] p-6 text-center shadow-sm">
              <p className="text-sm font-bold text-[var(--brand-green)]">عهد الحوكمة</p>
              <p className="mt-2 text-sm leading-[1.9] text-[var(--muted-foreground)]">
                نلتزم بالإفصاح الحوكي دون مساس بخصوصية المستفيدين أو سرية البيانات — لا ننشر ميزانيات تفصيلية ولا قوائم مستفيدين، بل نُفصح عن السياسات والآليات والرقابة المستقلة.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ آية قرآنية ═══════ */}
      <div className="my-8 rounded-2xl border border-[var(--brand-gold)]/20 bg-gradient-to-l from-[var(--brand-gold)]/5 to-transparent p-6 text-center">
        <p className="font-amiri text-xl leading-loose text-[var(--foreground)] md:text-2xl" dir="rtl">
          ﴿ وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ ﴾
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">سورة الرحمن، الآية ٩</p>
      </div>

      {/* Benchmarks — مقارنة بالممارسات الدولية (نسب حوكمية، دون كشف تفاصيل مالية) */}
      <section className="py-16 bg-[var(--secondary)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[var(--brand-green)]">مقارنة</span> بالمعايير الدولية
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              نقيس أداءنا بالمعايير الدولية المعتمدة لضمان أعلى معايير الكفاءة والشفافية
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-lg overflow-hidden">
            <div className="grid grid-cols-4 bg-[var(--brand-green)]/10 px-6 py-4 text-sm font-bold text-[var(--foreground)]">
              <div>الفئة</div>
              <div>أدائنا</div>
              <div>المعيار الدولي</div>
              <div>التقييم</div>
            </div>
            {BENCHMARKS.map((item, i) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`grid grid-cols-4 px-6 py-4 text-sm border-t border-[var(--border)] ${i % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--card)]"}`}
              >
                <div className="font-semibold text-[var(--foreground)]">{item.category}</div>
                <div className="font-bold text-[var(--brand-green)]">{item.orgValue}</div>
                <div className="text-[var(--muted-foreground)]">{item.benchmark}</div>
                <div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    item.rating === "ممتاز"
                      ? "bg-[var(--success)]/10 text-[var(--success)]"
                      : "bg-[var(--info-bg)] text-[var(--info)]"
                  }`}>
                    <CheckCircle className="w-3 h-3" />
                    {item.rating}
                  </span>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{item.note}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              <span className="text-[var(--brand-green)]">مرتكزات</span> الحوكمة الرشيدة
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-[2]">
              أربعة مرتكزات استراتيجية تُرسخ التزامنا بالإفصاح المؤسسي والمساءلة — لكل مرتكز
              مؤشرات قياس وتقييم دورية تُنشر نتائجها بشفافية مطلقة.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {TRANSPARENCY_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[var(--card)] rounded-2xl p-8 border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand-green-pale)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <pillar.icon className="w-8 h-8 text-[var(--brand-green)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{pillar.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Section */}
      <section className="bg-[var(--secondary)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              البنية <span className="text-[var(--brand-green)]">الحوكمية والرقابية</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-[2]">
              مجالس ولجان مستقلة تعمل وفق الأنظمة المعتمدة لضمان أرقى معايير الحوكمة
              والرقابة الداخلية والتدقيق المستقل للأداء المالي والعملياتي.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {GOVERNANCE_BODIES.map((body, i) => (
              <motion.div
                key={body.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[var(--foreground)]">{body.title}</h3>
                  <span className="text-xs font-semibold text-[var(--brand-green)] bg-[var(--brand-green-pale)] px-3 py-1 rounded-full">
                    {body.members}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {body.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="bg-[var(--background)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              <span className="text-[var(--brand-green)]">الإفصاحات</span> المالية والحوكمية
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto leading-[2]">
              جميع إفصاحاتنا المالية والإدارية مُدققة من مراجع خارجي مستقل ومتاحة للتحميل
              والاطلاع — ننشر إفصاحات ربعية وسنوية لضمان تتبع الأداء المستمر والإفصاح المطلق.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex gap-2">
                {["all", "سنوي", "ربعي"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as any)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                      activeFilter === filter
                        ? "bg-[var(--brand-green)] text-white"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    {filter === "all" ? "الكل" : filter}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث في التقارير..."
                  className="w-64 pr-10 pl-4 py-2 border border-[var(--border)] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30"
                />
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {filteredReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[var(--card)] rounded-2xl p-6 border border-[var(--border)] shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--brand-green-pale)] flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[var(--brand-green)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">{report.title}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          report.type === "سنوي"
                            ? "bg-[var(--info-bg)] text-[var(--info)]"
                            : "bg-[var(--warning-bg)] text-[var(--warning)]"
                        }`}
                      >
                        {report.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)]">{report.year}</span>
                </div>

                <div className="space-y-2 mb-4">
                  {report.highlights.map((h, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[var(--brand-green)] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[var(--muted-foreground)]">{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                    <span>{report.size}</span>
                    <span>•</span>
                    <span>{report.pages} صفحة</span>
                  </div>
                  <button
                    onClick={() => navigate("/reports")}
                    aria-label={`عرض تفاصيل ${report.title}`}
                    className="flex items-center gap-1 text-sm font-semibold text-[var(--brand-green)] hover:text-[var(--brand-green-light)] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    عرض التفاصيل
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-[var(--muted-foreground)]/30 mx-auto mb-4" />
              <p className="text-[var(--muted-foreground)]">لا توجد تقارير تطابق بحثك</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">لديك استفسار حول الشفافية؟</h2>
            <p className="text-white/80 text-lg mb-8 leading-[1.8]">
              يُرجى التواصل معنا لأي استفسار حول تقاريرنا المالية أو الإدارية أو آليات الحوكمة —
              فريقنا جاهز للرد على جميع الاستفسارات بشكل مفصّل.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--brand-green)] rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
            >
              تواصل معنا
              <ArrowLeft className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
