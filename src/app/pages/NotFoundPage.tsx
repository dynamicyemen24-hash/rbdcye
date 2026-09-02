import { motion } from "motion/react";
import { Home, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { useSEO } from "@/utils/seoAdvanced";

export default function NotFoundPage() {
  useSEO({
    title: "404 - الصفحة غير موجودة | رحماء بينهم",
    description: "الصفحة التي تبحث عنها غير موجودة.",
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20 flex items-center" dir="rtl">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="text-[var(--brand-green)] text-9xl font-bold mb-6 relative inline-block"
          >
            404
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-4 border-dashed border-[var(--brand-green)]/20 rounded-full"
            />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            عذراً، الصفحة غير موجودة
          </h1>

          <p className="text-[var(--muted-foreground)] text-lg mb-8 max-w-xl mx-auto">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر.
          </p>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto mb-8">
            <input
              type="search"
              placeholder="ابحث في الموقع..."
              className="w-full px-6 py-4 pr-12 rounded-2xl border-2 border-[var(--border)] focus:border-[var(--brand-green)] focus:ring-4 focus:ring-[var(--brand-green)]/10 outline-none transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/">
              <button className="inline-flex items-center gap-2 bg-[var(--brand-green)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--brand-green-light)] transition-colors shadow-lg shadow-[var(--brand-green)]/25">
                <Home className="w-5 h-5" />
                العودة للرئيسية
              </button>
            </Link>

            <Link to="/contact">
              <button className="inline-flex items-center gap-2 border-2 border-[var(--border)] text-[var(--foreground)] px-8 py-3 rounded-xl font-bold hover:bg-[var(--secondary)] transition-colors">
                تواصل معنا
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* Quick Links Grid */}
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <p className="text-sm font-semibold text-[var(--foreground)] mb-4">
              أو تصفح الصفحات الرئيسية:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { to: "/about", label: "من نحن" },
                { to: "/programs", label: "برامجنا" },
                { to: "/projects", label: "مشاريعنا" },
                { to: "/success", label: "قصص النجاح" },
                { to: "/media", label: "المعرض" },
                { to: "/reports", label: "التقارير" },
                { to: "/transparency", label: "الشفافية" },
                { to: "/donate", label: "تبرع الآن" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center justify-center gap-2 p-3 bg-white rounded-xl border border-[var(--border)] hover:border-[var(--brand-green)] hover:shadow-md transition-all group"
                >
                  <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--brand-green)] transition-colors">
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--brand-green)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
