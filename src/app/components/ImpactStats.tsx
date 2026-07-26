// Impact Statistics Component - Premium Visual & Motion
// إحصائيات الأثر - مستوى احترافي متكامل
import { Users, FolderOpen, Handshake, Heart, DollarSign, TrendingUp, Award, Sparkles } from "lucide-react";
import { useState, useEffect, useRef, type ComponentType } from "react";

import { SEED_IMPACT } from "@/content/website";
import { useDynamicContent } from "@/shared/hooks/useDynamicContent";

interface Stat {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  value: number;
  label: string;
  sub: string;
  color: string;
  gradient: string;
}

// ─── Smooth ease-out counter ──────────────────────────────
function useCountUp(target: number, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!start) {
      setCount(0);
      setFinished(false);
      return;
    }
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      // ease-out cubic
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.floor(eased * target);
      setCount(current);
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setFinished(true);
      }
    };
    requestAnimationFrame(animate);
  }, [start, target, duration]);
  return { count, finished };
}

// ─── Decorative floating orb ──────────────────────────────
function Orb({ color, size, top, left, right, delay }: { color: string; size: number; top: string; left?: string; right?: string; delay: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        filter: "blur(60px)",
        opacity: 0.6,
        animation: `orb-float 6s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

// ─── Individual stat card ─────────────────────────────────
function StatCard({ stat, index, inView, onHover }: {
  readonly stat: Stat;
  readonly index: number;
  readonly inView: boolean;
  readonly onHover: (index: number | null) => void;
}) {
  const Icon = stat.icon;
  const { count, finished } = useCountUp(stat.value, 2200 + index * 150, inView);
  const [localHover, setLocalHover] = useState(false);

  return (
    <div
      className="group relative"
      style={{
        opacity: 0,
        animation: inView ? `card-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${0.12 + index * 0.1}s forwards` : "none",
        transform: inView ? undefined : "translateY(40px)",
      }}
      onMouseEnter={() => { setLocalHover(true); onHover(index); }}
      onMouseLeave={() => { setLocalHover(false); onHover(null); }}
    >
      {/* Glass backdrop card */}
      <div
        className={`
          relative rounded-2xl p-7 overflow-hidden
          transition-all duration-500 ease-out
          ${localHover ? "shadow-2xl" : "shadow-sm"}
        `}
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: localHover
            ? `1.5px solid ${stat.color}40`
            : "1px solid var(--border)",
          transform: localHover ? "translateY(-6px)" : "translateY(0)",
          boxShadow: localHover
            ? `0 20px 40px ${stat.color}20, 0 8px 16px rgba(0,0,0,0.06)`
            : "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* Hover glow - top layer */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: localHover ? 0.6 : 0,
            background: `linear-gradient(135deg, ${stat.color}08, transparent 60%)`,
          }}
        />

        {/* Icon container */}
        <div
          className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
          style={{
            background: localHover
              ? `linear-gradient(135deg, ${stat.color}20, ${stat.color}08)`
              : `${stat.color}12`,
            transform: localHover ? "scale(1.1)" : "scale(1)",
            boxShadow: localHover ? `0 0 20px ${stat.color}30` : "none",
          }}
        >
          <Icon
            className="w-7 h-7 transition-transform duration-300"
            style={{
              color: stat.color,
              transform: localHover ? "rotate(-8deg) scale(1.1)" : "rotate(0) scale(1)",
            }}
          />
        </div>

        {/* Count value with shimmer on finish */}
        <div className="relative">
          <div
            className="mb-1 tabular-nums relative"
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 800,
              color: stat.color,
            }}
          >
            {finished && <Sparkles className="absolute -top-1 -right-4 w-4 h-4 opacity-40" style={{ color: stat.color }} />}
            {inView ? `+${count.toLocaleString("ar-SA")}` : "٠"}
          </div>
        </div>

        {/* Label & subtitle */}
        <div className="relative" style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)" }}>
          {stat.label}
        </div>
        <div className="relative mt-0.5" style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
          {stat.sub}
        </div>

        {/* Animated accent bar */}
        <div
          className="absolute bottom-0 right-0 rounded-r-full transition-all duration-700 ease-out"
          style={{
            width: localHover ? "100%" : "0.25rem",
            height: localHover ? "0.25rem" : "3rem",
            background: localHover
              ? `linear-gradient(90deg, ${stat.color}, transparent)`
              : stat.color,
            opacity: localHover ? 0.35 : 1,
          }}
        />

        {/* Corner shine on hover */}
        <div
          className="absolute top-0 left-0 w-20 h-20 rounded-full transition-all duration-500"
          style={{
            background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
            opacity: localHover ? 1 : 0,
            transform: localHover ? "translate(-30%, -30%)" : "translate(-100%, -100%)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────
export function ImpactStats() {
  const [metrics, setMetrics] = useState<{
    totalBeneficiaries?: number;
    activeProjects?: number;
    totalPartners?: number;
    totalVolunteers?: number;
    totalDonations?: number;
    productiveFamilies?: number;
  } | null>(null);
  const [contentSource, setContentSource] = useState<'static' | 'sanity'>('static');
  const [showDevBadge, setShowDevBadge] = useState(false);
  const [inView, setInView] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [counterReady, setCounterReady] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Dynamic content
  const { data: dynamicImpact, source } = useDynamicContent<any>({
    contentType: "impact",
    enableRealtime: false,
    refreshInterval: 300000,
  });

  // Dev badge
  useEffect(() => {
    if (import.meta.env?.DEV) setShowDevBadge(true);
  }, []);

  // Metrics + intersection observer
  useEffect(() => {
    let cancelled = false;

    const fallback = {
      totalBeneficiaries: SEED_IMPACT.beneficiaries,
      activeProjects: SEED_IMPACT.projects,
      totalPartners: SEED_IMPACT.partners,
      totalVolunteers: SEED_IMPACT.volunteers,
      totalDonations: 3_200_000,
      productiveFamilies: 472,
    };

    const load = async () => {
      try {
        if (dynamicImpact?.length > 0) {
          const d = dynamicImpact[0];
          setMetrics({
            totalBeneficiaries: d?.totalBeneficiaries ?? d?.beneficiaries ?? fallback.totalBeneficiaries,
            activeProjects: d?.activeProjects ?? d?.projects ?? fallback.activeProjects,
            totalPartners: d?.totalPartners ?? d?.partners ?? fallback.totalPartners,
            totalVolunteers: d?.totalVolunteers ?? d?.volunteers ?? fallback.totalVolunteers,
            totalDonations: d?.totalDonations ?? fallback.totalDonations,
            productiveFamilies: d?.productiveFamilies ?? fallback.productiveFamilies,
          });
          setContentSource(source as "sanity" | "static");
        } else {
          setMetrics(fallback);
          setContentSource("static");
        }
      } catch {
        if (!cancelled) {
          setMetrics(fallback);
          setContentSource("static");
        }
      }
    };
    load();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Small delay before counters start for dramatic effect
          setTimeout(() => setCounterReady(true), 300);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [dynamicImpact, source]);

  // ─── Stat definitions ──────────────────────────────────
  const stats: Stat[] = [
    {
      icon: Users,
      value: metrics?.totalBeneficiaries ?? 0,
      label: "مستفيد مباشر",
      sub: "من مختلف المحافظات والمناطق",
      color: "var(--brand-green)",
      gradient: "linear-gradient(135deg, #1A5C48, #2E7D6B)",
    },
    {
      icon: FolderOpen,
      value: metrics?.activeProjects ?? 0,
      label: "مشروع منجز",
      sub: "في مجالات متنوعة ومؤثرة",
      color: "var(--brand-gold)",
      gradient: "linear-gradient(135deg, #C8861E, #E8A83A)",
    },
    {
      icon: DollarSign,
      value: metrics?.totalDonations ?? 0,
      label: "إجمالي المساعدات",
      sub: "المبالغ المالية الموزعة",
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669, #34D399)",
    },
    {
      icon: Handshake,
      value: metrics?.totalPartners ?? 0,
      label: "شريك استراتيجي",
      sub: "من مؤسسات وجهات داعمة",
      color: "var(--brand-green-light)",
      gradient: "linear-gradient(135deg, #2E7D6B, #4AA88E)",
    },
    {
      icon: Heart,
      value: metrics?.totalVolunteers ?? 0,
      label: "متطوع ومبادر",
      sub: "فريق عمل المؤسسة",
      color: "var(--brand-gold)",
      gradient: "linear-gradient(135deg, #C8861E, #E8A83A)",
    },
    {
      icon: Users,
      value: metrics?.productiveFamilies ?? 0,
      label: "أسرة منتجة",
      sub: "نتاج برامج التمكين الاقتصادي",
      color: "#7C3AED",
      gradient: "linear-gradient(135deg, #7C3AED, #A78BFA)",
    },
  ];

  // Progress sectors data
  const sectors = [
    { label: "الإغاثة الإنسانية", pct: 38, color: "var(--brand-green)" },
    { label: "التعليم والتأهيل", pct: 28, color: "var(--brand-gold)" },
    { label: "التنمية المجتمعية", pct: 22, color: "var(--brand-green-light)" },
    { label: "الدعوة والإرشاد", pct: 12, color: "#8B5CF6" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--secondary) 0%, var(--background) 100%)",
        direction: "rtl",
      }}
    >
      {/* ── Decorative orbs ── */}
      <Orb color="var(--brand-green)" size={400} top="-10%" left="-10%" delay={0} />
      <Orb color="var(--brand-gold)" size={300} top="40%" right="-8%" left="auto" delay={2} />
      <Orb color="var(--brand-green-light)" size={250} top="70%" left="60%" delay={4} />

      {/* ── Subtle pattern overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231A5C48' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Dev badge */}
      {showDevBadge && (
        <div className="fixed top-4 left-4 z-50 bg-purple-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${contentSource === "sanity" ? "bg-green-400" : "bg-yellow-400"}`} />
            <span>{contentSource === "sanity" ? "Sanity CMS" : "Static Content"}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Header section ── */}
        <div
          className="text-center mb-16"
          style={{
            opacity: 0,
            animation: inView ? "fade-in-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s forwards" : "none",
          }}
        >
          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              color: "var(--brand-gold)",
              background: "rgba(200,134,30,0.1)",
              border: "1px solid rgba(200,134,30,0.2)",
            }}
          >
            <Award className="w-4 h-4" />
            أثرنا بالأرقام
          </span>

          {/* Title */}
          <h2
            className="mb-4"
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 800,
              color: "var(--foreground)",
              lineHeight: 1.3,
            }}
          >
            أرقامٌ تحكي قصة{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, var(--brand-green), var(--brand-green-light))",
              }}
            >
              التغيير الحقيقي
            </span>
          </h2>

          {/* Divider */}
          <div className="mx-auto mb-4 rounded-full" style={{ width: 60, height: 3, background: "linear-gradient(90deg, transparent, var(--brand-green), transparent)" }} />

          {/* Subtitle */}
          <p
            className="max-w-xl mx-auto"
            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)", lineHeight: 1.8, color: "var(--muted-foreground)" }}
          >
            خلال سنوات من العمل المتواصل، أسهمت مؤسسة رحماء بينهم في إحداث تحول ملموس في حياة آلاف الأسر
          </p>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} inView={counterReady} onHover={setHoveredIndex} />
          ))}
        </div>

        {/* ── Progress bar visual ── */}
        <div
          className="mt-16 rounded-2xl p-8 shadow-sm overflow-hidden relative"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid var(--border)",
            opacity: 0,
            animation: inView ? "fade-in-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.5s forwards" : "none",
          }}
        >
          {/* Hover glow sync */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: hoveredIndex !== null ? 0.4 : 0,
              background: hoveredIndex !== null
                ? `linear-gradient(135deg, ${stats[hoveredIndex]?.color}08, transparent 60%)`
                : "transparent",
            }}
          />

          {/* Header */}
          <div className="relative mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>
              <TrendingUp className="w-5 h-5" style={{ color: "var(--brand-green)" }} />
              توزيع البرامج حسب القطاع
            </h3>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>٢٠٢٥م</span>
          </div>

          {/* Progress rows */}
          <div className="relative space-y-5">
            {sectors.map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)" }}>
                    {item.label}
                  </span>
                  <span className="tabular-nums" style={{ fontSize: "0.8rem", fontWeight: 700, color: item.color }}>
                    {inView ? `${item.pct}٪` : "٠٪"}
                  </span>
                </div>
                <div
                  className="relative h-3 rounded-full overflow-hidden"
                  style={{ background: `${item.color}15` }}
                >
                  {/* Animated fill */}
                  <div
                    ref={(el) => { progressRefs.current[i] = el; }}
                    className="h-full rounded-full relative overflow-hidden transition-all duration-[1200ms] ease-out"
                    style={{
                      width: inView ? `${item.pct}%` : "0%",
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                      transitionDelay: `${0.3 + i * 0.15}s`,
                    }}
                  >
                    {/* Shimmer overlay on hover */}
                    {hoveredIndex !== null && (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                          animation: "shimmer-sweep 1.5s ease-in-out infinite",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom decorative line */}
          <div className="relative mt-6 pt-4 border-t border-[var(--border)]/50">
            <p className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
              إجمالي البرامج المنفذة: <strong style={{ color: "var(--brand-green)" }}>{metrics?.activeProjects ?? 0}</strong> مشروع
            </p>
          </div>
        </div>
      </div>

      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes card-enter {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0); }
          33%      { transform: translate(20px, -20px); }
          66%      { transform: translate(-10px, 15px); }
        }
        @keyframes shimmer-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}