// Reports Page - التقارير السنوية والإصدارات
import { motion } from "framer-motion";
import {
  FileText, Download, Calendar, Eye, Search, 
  Filter, BookOpen, TrendingUp, Users, Award,
  ArrowLeft, BarChart3, PieChart, FileBarChart
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSEO } from "@/utils/seoAdvanced";

const REPORTS = [
  {
    id: 1,
    title: "التقرير السنوي 2025",
    type: "سنوي",
    year: "2025",
    pages: 48,
    size: "4.2 MB",
    category: "مالي",
    description: "التقرير المالي والإداري السنوي للمؤسسة للعام 2025",
    highlights: ["إيرادات 2.5M$", "12,000+ مستفيد", "25 مشروع"],
    color: "emerald",
  },
  {
    id: 2,
    title: "التقرير السنوي 2024",
    type: "سنوي",
    year: "2024",
    pages: 42,
    size: "3.8 MB",
    category: "مالي",
    description: "التقرير المالي والإداري السنوي للمؤسسة للعام 2024",
    highlights: ["إيرادات 2M$", "10,000+ مستفيد", "20 مشروع"],
    color: "blue",
  },
  {
    id: 3,
    title: "تقرير الأثر - الربع الأول 2025",
    type: "ربعي",
    year: "2025/Q1",
    pages: 18,
    size: "1.5 MB",
    category: "أثر",
    description: "تقرير قياس أثر البرامج والمشاريع للربع الأول",
    highlights: ["3,500 مستفيد", "8 مشاريع", "698K$ ميزانية"],
    color: "amber",
  },
  {
    id: 4,
    title: "تقرير الشفافية 2024",
    type: "خاص",
    year: "2024",
    pages: 24,
    size: "2.1 MB",
    category: "حوكمة",
    description: "تقرير الشفافية والحوكمة ومكافحة الفساد",
    highlights: ["تدقيق خارجي", "نسبة 96%", "امتثال كامل"],
    color: "purple",
  },
  {
    id: 5,
    title: "النشرة الإخبارية - ديسمبر 2025",
    type: "نشرة",
    year: "2025/12",
    pages: 8,
    size: "0.8 MB",
    category: "إعلامي",
    description: "النشرة الشهرية لأخبار وفعاليات المؤسسة",
    highlights: ["أخبار", "قصص نجاح", "فعاليات قادمة"],
    color: "rose",
  },
  {
    id: 6,
    title: "تقرير برامج التعليم 2024-2025",
    type: "تخصصي",
    year: "2024-2025",
    pages: 32,
    size: "2.8 MB",
    category: "برامج",
    description: "تقرير متخصص عن برامج التعليم وتحفيظ القرآن",
    highlights: ["1,200 طالب", "50 حلقة", "15 مسجد"],
    color: "cyan",
  },
];

const CATEGORIES = ["الكل", "سنوي", "ربعي", "نشرة", "تخصصي", "خاص"];

export default function ReportsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  useSEO({
    title: 'التقارير - رحماء بينهم',
    description: 'التقارير السنوية والإصدارات الدورية لمؤسسة رحماء بينهم',
  });

  const filteredReports = REPORTS.filter((report) => {
    const matchesCategory = activeCategory === "الكل" || report.type === activeCategory;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const colorMap: Record<string, string> = {
    emerald: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-indigo-500",
    amber: "from-amber-500 to-orange-500",
    purple: "from-purple-500 to-violet-500",
    rose: "from-rose-500 to-pink-500",
    cyan: "from-cyan-500 to-blue-500",
  };

  return (
    <div className="min-h-screen pt-20" dir="rtl">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-b from-[var(--brand-green)]/10 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[var(--brand-green)]/20 px-5 py-2 rounded-full mb-6 shadow-lg">
              <FileText className="w-4 h-4 text-[var(--brand-green)]" />
              <span className="text-[var(--brand-green)] text-sm font-medium">التقارير والإصدارات</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[var(--foreground)]">التقارير </span>
              <span className="text-[var(--brand-green)]">والإصدارات</span>
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] max-w-3xl mx-auto">
              جميع تقارير المؤسسة المالية والإدارية والفنية متاحة للتحميل
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-[var(--brand-green)] text-white shadow-lg"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {cat}
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
                className="w-64 pr-10 pl-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-12 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <div className={`h-2 bg-gradient-to-r ${colorMap[report.color]}`} />
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[report.color]} flex items-center justify-center`}>
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{report.title}</h3>
                        <span className="text-xs text-gray-500">{report.category}</span>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
                      {report.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {report.highlights.map((h, j) => (
                      <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-[var(--brand-green-pale)] text-[var(--brand-green)]">
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {report.year}
                      </span>
                      <span>{report.pages} صفحة</span>
                      <span>{report.size}</span>
                    </div>
                    <button className="flex items-center gap-1 text-sm font-semibold text-[var(--brand-green)] hover:text-[var(--brand-green-light)] transition-colors">
                      <Download className="w-4 h-4" />
                      تحميل
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-16">
              <FileBarChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد تقارير مطابقة</h3>
              <p className="text-gray-500">جرب تغيير معايير البحث</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}