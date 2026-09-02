// Impact Dashboard - لوحة أثر مؤسسي حية
// عرض أرقام الأثر بأسلوب بصري متحرك ومقنع
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Users, Droplet, Home, BookOpen, Heart, TrendingUp, ArrowLeft, Play, Pause } from "lucide-react";

interface Metric {
  id: string;
  label: string;
  suffix: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  bgGradient: string;
  description: string;
}

const METRICS: Metric[] = [
  {
    id: "beneficiaries",
    label: "مستفيد",
    suffix: "+",
    icon: Users,
    color: "var(--brand-green)",
    bgGradient: "linear-gradient(135deg, rgba(15,76,58,0.08), rgba(23,105,79,0.04))",
    description: "اسر يمنية استفادت من برامجنا",
  },
  {
    id: "projects",
    label: "مشروع نشط",
    suffix: "",
    icon: Home,
    color: "var(--brand-gold)",
    bgGradient: "linear-gradient(135deg, rgba(var(--brand-gold-rgb),0.08), rgba(var(--brand-gold-light-rgb),0.04))",
    description: "مشاريع تنموية وإغاثية باليمن",
  },
  {
    id: "meals",
    label: "وجبة",
    suffix: "+",
    icon: Droplet,
    color: "#2563EB",
    bgGradient: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(37,99,235,0.04))",
    description: "وجبة غذائية وزعت على المحتاجين",
  },
  {
    id: "orphans",
    label: "يتيم",
    suffix: "+",
    icon: Heart,
    color: "#DC2626",
    bgGradient: "linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.04))",
    description: "طفل يتيم يتم كفالته",
  },
  {
    id: "students",
    label: "طالب",
    suffix: "+",
    icon: BookOpen,
    color: "#7C3AED",
    bgGradient: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.04))",
    description: "طالب ممول في برنامج التعليم",
  },
  {
    id: "partners",
    label: "شريك",
    suffix: "",
    icon: TrendingUp,
    color: "var(--brand-green-light)",
    bgGradient: "linear-gradient(135deg, rgba(23,105,79,0.08), rgba(15,76,58,0.04))",
    description: "شريك رئيسي في العمل الإنساني",
  },
];

// Target values (representing actual impact - hidden from direct display)
const TARGETS: Record<string, number> = {
  beneficiaries: 45200,
  projects: 28,
  meals: 180000,
  orphans: 850,
  students: 3200,
  partners: 35,
};

function useCountUp(target: number, duration = 2500, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView || started) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView, started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

function formatArabicNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)} مليون`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')} آلاف`;
  return n.toLocaleString("ar-YE");
}

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const { count, ref } = useCountUp(TARGETS[metric.id], 2200);
  const Icon = metric.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white rounded-2xl p-6 md:p-7 border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: metric.bgGradient }} />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `${metric.color}12`,
            border: `1.5px solid ${metric.color}30`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: metric.color }} />
        </div>

        {/* Number */}
        <div className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight" style={{ color: metric.color }}>
          {formatArabicNumber(count)}{metric.suffix}
        </div>

        {/* Label */}
        <div className="text-[var(--foreground)] font-bold text-sm mb-1.5">{metric.label}</div>

        {/* Description */}
        <div className="text-[var(--muted-foreground)] text-xs leading-relaxed">{metric.description}</div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to left, transparent, ${metric.color}, transparent)` }}
      />
    </motion.div>
  );
}

export function ImpactDashboard() {
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  return (
    <section dir="rtl" className="relative py-24 md:py-32 overflow-hidden" style={{ background: "var(--secondary)" }}>
      <div className="absolute inset-0 pattern-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 md:mb-18"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-[var(--brand-green-pale)] text-[var(--brand-green)] border border-[var(--brand-green)]/15 mb-5">
            <TrendingUp className="w-4 h-4" />
            أثرنا بالأرقام
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4">
            نحسب أثرنا{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, var(--brand-green), var(--brand-green-light))" }}>
              بالنتائج
            </span>
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-base leading-relaxed">
            كل رقم يروي قصة — قصة أسرة أنقذت، طفل عاد للمدرسة، قرية حصلت على ماء نظيف.
            نعمل بشفافية مطلقة لضمان وصول كل ريال لمن يحتاجه.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 mb-12">
          {METRICS.map((metric, i) => (
            <MetricCard key={metric.id} metric={metric} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--brand-green)] text-white rounded-xl font-bold hover:bg-[var(--brand-green-light)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            <span>عرض التقارير التفصيلية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}


