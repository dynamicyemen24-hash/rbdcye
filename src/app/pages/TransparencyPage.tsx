// Transparency Page - صفحة الشفافية
import { motion } from "framer-motion";
import {
  Shield, FileText, BarChart3, Eye, Award, TrendingUp, 
  Users, DollarSign, CheckCircle, Download, Search,
  ExternalLink, Calendar, ArrowLeft
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
    highlights: [
      "أكثر من 12,000 مستفيد",
      "25 مشروع منفذ",
      "ميزانية 2.5 مليون دولار",
    ],
  },
  {
    id: 2,
    year: "2024",
    title: "التقرير السنوي 2024",
    type: "سنوي",
    size: "3.8 MB",
    pages: 42,
    highlights: [
      "أكثر من 10,000 مستفيد",
      "20 مشروع منفذ",
      "ميزانية 2 مليون دولار",
    ],
  },
  {
    id: 3,
    year: "2025/Q1",
    title: "التقرير الربعي الأول 2025",
    type: "ربعي",
    size: "1.5 MB",
    pages: 18,
    highlights: [
      "3,500 مستفيد",
      "8 مشاريع نشطة",
      "698,000 دولار ميزانية",
    ],
  },
  {
    id: 4,
    year: "2024/Q4",
    title: "التقرير الربعي الرابع 2024",
    type: "ربعي",
    size: "1.2 MB",
    pages: 15,
    highlights: [
      "2,800 مستفيد",
      "6 مشاريع مكتملة",
      "540,000 دولار ميزانية",
    ],
  },
];

const FINANCIAL_STATS = [
  { label: "إجمالي الإيرادات", value: "$2.5M", change: "+15%", positive: true },
  { label: "مصروفات البرامج", value: "$2.1M", change: "84%", positive: true },
  { label: "المصروفات الإدارية", value: "$280K", change: "11%", positive: true },
  { label: "احتياطي نقدي", value: "$120K", change: "5%", positive: false },
];

const GOVERNANCE_BODIES = [
  {
    title: "مجلس الإدارة",
    members: "7 أعضاء",
    desc: "يتولى رسم السياسات العامة والإشراف على أداء المؤسسة",
  },
  {
    title: "اللجنة التنفيذية",
    members: "5 أعضاء",
    desc: "تشرف على تنفيذ القرارات وإدارة العمليات اليومية",
  },
  {
    title: "لجنة التدقيق",
    members: "3 أعضاء",
    desc: "تراجع الحسابات وتضمن الامتثال للمعايير المالية",
  },
  {
    title: "لجنة الحوكمة",
    members: "3 أعضاء",
    desc: "تضمن تطبيق مبادئ الشفافية والنزاهة والمساءلة",
  },
];

const TRANSPARENCY_PILLARS = [
  {
    icon: Eye,
    title: "الشفافية المالية",
    desc: "نشر التقارير المالية المدققة بشكل دوري وإتاحتها للجمهور",
  },
  {
    icon: Award,
    title: "الحوكمة الرشيدة",
    desc: "تطبيق أعلى معايير الحوكمة والرقابة الداخلية",
  },
  {
    icon: FileText,
    title: "التقارير الدورية",
    desc: "إصدار تقارير دورية عن الأداء والإنجازات والتحديات",
  },
  {
    icon: Users,
    title: "إشراك المستفيدين",
    desc: "آليات فعالة لتلقي الملاحظات والشكاوى والتعامل معها",
  },
];

export default function TransparencyPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'سنوي' | 'ربعي'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useSEO({
    title: 'الشفافية - رحماء بينهم',
    description: 'الشفافية والحوكمة في مؤسسة رحماء بينهم - التقارير المالية والإدارية',
  });

  const filteredReports = REPORTS.filter((report) => {
    const matchesType = activeFilter === 'all' || report.type === activeFilter;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-20" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-[var(--brand-green)]/10 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[var(--brand-green)]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[var(--brand-gold)]/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[var(--brand-green)]/20 px-5 py-2 rounded-full mb-6 shadow-lg">
              <Shield className="w-4 h-4 text-[var(--brand-green)]" />
              <span className="text-[var(--brand-green)] text-sm font-medium">الشفافية والنزاهة</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[var(--foreground)]">الشفافية </span>
              <span className="text-[var(--brand-green)]">ركن أساسي</span>
            </h1>
            
            <p className="text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed mb-8">
              نؤمن في مؤسسة رحماء بينهم بأن الشفافية هي أساس الثقة. 
              نلتزم بأعلى معايير الإفصاح والحوكمة لضمان وصول تبرعاتكم إلى مستحقيها.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FINANCIAL_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-white backdrop-blur-sm rounded-2xl p-5 border border-[var(--border)] shadow-lg"
                >
                  <div className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</div>
                  <div className="text-sm text-[var(--muted-foreground)] mt-1">{stat.label}</div>
                  <div className={`text-xs font-semibold mt-1 ${stat.positive ? 'text-green-600' : 'text-amber-600'}`}>
                    {stat.change}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[var(--brand-green)]">ركائز</span> الشفافية
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              أربع ركائز أساسية نبني عليها التزامنا بالشفافية
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
                className="group bg-white rounded-2xl p-8 border border-[var(--border)] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
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
      <section className="py-20 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              هيكل <span className="text-[var(--brand-green)]">الحوكمة</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              مجالس ولجان تضمن أعلى معايير الحوكمة والرقابة
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
                className="bg-white rounded-2xl p-6 border border-[var(--border)] shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[var(--foreground)]">{body.title}</h3>
                  <span className="text-xs font-semibold text-[var(--brand-green)] bg-[var(--brand-green-pale)] px-3 py-1 rounded-full">
                    {body.members}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{body.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[var(--brand-green)]">التقارير</span> والإفصاحات
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              جميع تقاريرنا المالية والإدارية متاحة للتحميل والاطلاع
            </p>
          </motion.div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex gap-2">
                {['all', 'سنوي', 'ربعي'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as any)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                      activeFilter === filter
                        ? 'bg-[var(--brand-green)] text-white'
                        : 'bg-gray-100 text-[var(--muted-foreground)] hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'الكل' : filter}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                className="group bg-white rounded-2xl p-6 border border-[var(--border)] shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--brand-green-pale)] flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[var(--brand-green)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">{report.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        report.type === 'سنوي' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
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
                  <button className="flex items-center gap-1 text-sm font-semibold text-[var(--brand-green)] hover:text-[var(--brand-green-light)] transition-colors">
                    <Download className="w-4 h-4" />
                    تحميل
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-[var(--muted-foreground)]">لا توجد تقارير تطابق بحثك</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-light)]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">لديك استفسار حول الشفافية؟</h2>
            <p className="text-white/80 text-lg mb-8">
              يمكنك التواصل معنا لأي استفسار حول تقاريرنا المالية أو الإدارية
            </p>
            <button
              onClick={() => navigate('/contact')}
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