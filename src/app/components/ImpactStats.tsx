// Impact Statistics Component - Narrative Storytelling Design
// إحصائيات الأثر - تصميم سردي هرمي يحكي قصة التغيير
import { Users, FolderOpen, Handshake, Heart, DollarSign, TrendingUp, Award, HandHeart } from "lucide-react";
import { useState, useEffect, useRef, type ComponentType } from "react";

import { SEED_IMPACT } from "@/content/website";
import { useDynamicContent } from "@/shared/hooks/useDynamicContent";
import { IslamicPattern, IslamicDivider, StarMedallion } from "@/app/components/decor/IslamicPattern";

interface Metric {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  value: number;
  label: string;
  story: string;
  color: string;
}

// ─── Smooth ease-out counter ──────────────────────────────
function useCountUp(target: number, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * target));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, target, duration]);
  return count;
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

const fmt = (n: number) => n.toLocaleString("ar-SA");

// ─── Hero metric (الرقم القائد) ────────────────────────────
function HeroMetric({ metric, inView }: { metric: Metric; inView: boolean }) {
  const Icon = metric.icon;
  const count = useCountUp(metric.value, 2400, inView);

  return (
    <div
      className="relative h-full rounded-3xl p-8 md:p-10 overflow-hidden text-white flex flex-col justify-between min-h-[320px]"
      style={{
        background: "linear-gradient(135deg, var(--brand-green-dark) 0%, var(--brand-green) 55%, var(--brand-green-light) 100%)",
        boxShadow: "0 24px 48px rgba(15, 76, 58, 0.25)",
        opacity: 0,
        animation: inView ? "card-enter 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards" : "none",
      }}
    >
      {/* زخرفة النجمة الثمانية */}
      <IslamicPattern variant="khatam" style={{ color: "var(--brand-gold)", opacity: 0.16 }} />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(var(--brand-gold-rgb, 198, 158, 90), 0.25), transparent 70%)" }}
      />

      <div className="relative z-10">
        <StarMedallion size={84} color="var(--brand-gold)">
          <Icon className="w-9 h-9" style={{ color: "var(--brand-gold)" }} />
        </StarMedallion>
      </div>

      <div className="relative z-10">
        <div
          className="tabular-nums leading-none mb-3"
          style={{
            fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
            fontWeight: 800,
            color: "#FFFFFF",
            textShadow: "0 2px 12px rgba(var(--foreground-rgb),0.18)",
          }}
        >
          {inView ? `+${fmt(count)}` : "٠"}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-px w-8" style={{ background: "var(--brand-gold)" }} />
          <span style={{ fontWeight: 700, fontSize: "1.15rem", color: "var(--brand-gold-light)" }}>
            {metric.label}
          </span>
        </div>
        <p className="text-white/75 leading-relaxed" style={{ fontSize: "0.95rem", maxWidth: "42ch" }}>
          {metric.story}
        </p>
      </div>
    </div>
  );
}

// ─── Secondary feature metric ─────────────────────────────
function FeatureMetric({ metric, inView }: { metric: Metric; inView: boolean }) {
  const _Icon = metric.icon;
  const count = useCountUp(metric.value, 2200, inView);

  return (
    <div
      className="relative rounded-3xl p-8 overflow-hidden border border-[var(--border)] bg-white/80 backdrop-blur-sm h-full flex flex-col justify-between min-h-[320px]"
      style={{
        boxShadow: "0 12px 32px rgba(15, 76, 58, 0.08)",
        opacity: 0,
        animation: inView ? "card-enter 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.22s forwards" : "none",
      }}
    >
      <IslamicPattern variant="arabesque" style={{ color: "var(--brand-gold)", opacity: 0.1 }} />

      <div className="relative z-10">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
          style={{
            color: "var(--brand-gold)",
            background: "rgba(var(--brand-gold-rgb),0.12)",
            border: "1px solid rgba(var(--brand-gold-rgb),0.3)",
          }}
        >
          <DollarSign className="w-3.5 h-3.5" />
          قيمة ما وصل للمستحقين
        </span>
        <div className="tabular-nums leading-none mb-3" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", fontWeight: 800, color: "var(--brand-gold)" }}>
          {inView ? `+${fmt(count)}` : "٠"}
        </div>
        <div className="mb-2" style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--foreground)" }}>
          {metric.label}
        </div>
        <p className="leading-relaxed" style={{ fontSize: "0.9rem", color: "var(--muted-foreground)", maxWidth: "40ch" }}>
          {metric.story}
        </p>
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
        <TrendingUp className="w-4 h-4" style={{ color: "var(--brand-green)" }} />
        بإشراف لجنة شرعية ومحاسبين مستقلين
      </div>
    </div>
  );
}

// ─── Compact supporting metric chip ───────────────────────
function SupportMetric({ metric, index, inView }: { metric: Metric; index: number; inView: boolean }) {
  const Icon = metric.icon;
  const count = useCountUp(metric.value, 1800 + index * 150, inView);

  return (
    <div
      className="group relative rounded-2xl p-5 bg-white border border-[var(--border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--brand-gold)]/40"
      style={{
        opacity: 0,
        animation: inView ? `card-enter 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${0.35 + index * 0.08}s forwards` : "none",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${metric.color}14` }}
        >
          <Icon className="w-6 h-6" style={{ color: metric.color }} />
        </div>
        <div className="min-w-0">
          <div className="tabular-nums leading-tight" style={{ fontSize: "1.45rem", fontWeight: 800, color: metric.color }}>
            {inView ? `+${fmt(count)}` : "٠"}
          </div>
          <div className="truncate" style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--foreground)" }}>
            {metric.label}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {metric.story}
      </p>
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

  // ─── Metric definitions (سردية الأثر) ───────────────────
  const heroMetric: Metric = {
    icon: Users,
    value: metrics?.totalBeneficiaries ?? 0,
    label: "مستفيد مباشر غيّرت حياتهم",
    story: "رجالٌ ونساء وأطفال في مختلف المحافظات اليمنية وجدوا يدًا ممدة؛ ماءً يصل قراهم، ودراسةً لا تنقطع، وأسرةً تستعيد كرامتها.",
    color: "var(--brand-green)",
  };

  const donationMetric: Metric = {
    icon: DollarSign,
    value: metrics?.totalDonations ?? 0,
    label: "دولار وصل لمستحقيه",
    story: "كل ريال من تبرعاتكم تحوّل إلى طعامٍ على المائدة، ودواءٍ يُنقذ حياة، وحلقةٍ تُحفظ فيها آيات الله.",
    color: "var(--brand-gold)",
  };

  const supportMetrics: Metric[] = [
    {
      icon: FolderOpen,
      value: metrics?.activeProjects ?? 0,
      label: "مشروع نوعي منجز",
      story: "مشاريع مدروسة تبدأ بالمسح الميداني ولا تنتهي عند التسليم بل تمتد للمتابعة والاستدامة.",
      color: "var(--brand-green)",
    },
    {
      icon: Handshake,
      value: metrics?.totalPartners ?? 0,
      label: "شريك استراتيجي",
      story: "مؤسسات وجهات خيرية محلية وعالمية تتقاسم معنا المسؤولية وتضاعف أثر كل ريال.",
      color: "var(--brand-green-light)",
    },
    {
      icon: HandHeart,
      value: metrics?.totalVolunteers ?? 0,
      label: "متطوع ومبادر",
      story: "شباب يمني يمنح وقته وطاقته تطوعاً، مؤمنين بأن العمل الخيري رسالة قبل أن يكون وظيفة.",
      color: "var(--brand-gold)",
    },
    {
      icon: Heart,
      value: metrics?.productiveFamilies ?? 0,
      label: "أسرة منتجة",
      story: "أسر انتقلت من صفوف الانتظار إلى صفوف الإنتاج، بفضل رواتب الأعمال وبرامج التمكين الاقتصادي.",
      color: "var(--brand-gold-dark)",
    },
  ];

  // Progress sectors data
  const sectors = [
    { label: "الإغاثة الإنسانية", pct: 38, color: "var(--brand-green)" },
    { label: "التعليم والتأهيل", pct: 28, color: "var(--brand-gold)" },
    { label: "التنمية المجتمعية", pct: 22, color: "var(--brand-green-light)" },
    { label: "الدعوة والإرشاد", pct: 12, color: "var(--brand-gold)" },
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

      {/* ── زخرفة خاتم خلفية ── */}
      <IslamicPattern variant="khatam" style={{ color: "var(--brand-green)", opacity: 0.04 }} />

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
          className="text-center mb-14"
          style={{
            opacity: 0,
            animation: inView ? "fade-in-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s forwards" : "none",
          }}
        >
          <span
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              color: "var(--brand-gold)",
              background: "rgba(var(--brand-gold-rgb),0.1)",
              border: "1px solid rgba(var(--brand-gold-rgb),0.25)",
            }}
          >
            <Award className="w-4 h-4" />
            أثرنا بالأرقام
          </span>

          <h2
            className="mb-5"
            style={{
              fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--foreground)",
              lineHeight: 1.35,
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

          <p
            className="max-w-2xl mx-auto mb-6"
            style={{ fontSize: "clamp(0.92rem, 1.4vw, 1.05rem)", lineHeight: 1.9, color: "var(--muted-foreground)" }}
          >
            خلف كل رقم هنا أسرة استقرت، وطفل عاد لمكتبته، وقريّة صارت تزرع أرضها؛
            هذه ليست إحصائياتٍ جافة بل سجلّ أمانة نشارككم إياها بشفافية كاملة
          </p>

          <IslamicDivider tone="gold" />
        </div>

        {/* ── Tier 1: hero + donations ── */}
        <div className="grid lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-3">
            <HeroMetric metric={heroMetric} inView={counterReady} />
          </div>
          <div className="lg:col-span-2">
            <FeatureMetric metric={donationMetric} inView={counterReady} />
          </div>
        </div>

        {/* ── Tier 2: supporting metrics ── */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
          {supportMetrics.map((m, i) => (
            <SupportMetric key={m.label} metric={m} index={i} inView={counterReady} />
          ))}
        </div>

        {/* ── Tier 3: sector distribution ── */}
        <div
          className="rounded-3xl p-8 shadow-sm overflow-hidden relative border border-[var(--border)]"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            opacity: 0,
            animation: inView ? "fade-in-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.5s forwards" : "none",
          }}
        >
          <IslamicPattern variant="zellij" style={{ color: "var(--brand-green)", opacity: 0.04 }} />

          <div className="relative flex flex-col md:flex-row md:items-center gap-3 md:gap-0 md:justify-between mb-8">
            <h3 className="flex items-center gap-2" style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--foreground)" }}>
              <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--brand-green-pale)" }}>
                <TrendingUp className="w-5 h-5" style={{ color: "var(--brand-green)" }} />
              </span>
              أين تذهب جهودنا؟
            </h3>
            <span
              className="self-start md:self-auto px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--brand-green-pale)", color: "var(--brand-green)" }}
            >
              توزيع البرامج حسب القطاع · ٢٠٢٥م
            </span>
          </div>

          {/* Progress rows */}
          <div className="relative space-y-6">
            {sectors.map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--foreground)" }}>
                    {item.label}
                  </span>
                  <span className="tabular-nums" style={{ fontSize: "0.85rem", fontWeight: 800, color: item.color }}>
                    {inView ? `${item.pct}٪` : "٠٪"}
                  </span>
                </div>
                <div className="relative h-3 rounded-full overflow-hidden" style={{ background: `${item.color}12` }}>
                  <div
                    ref={(el) => { progressRefs.current[i] = el; }}
                    className="h-full rounded-full transition-all duration-[1200ms] ease-out"
                    style={{
                      width: inView ? `${item.pct}%` : "0%",
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                      transitionDelay: `${0.3 + i * 0.15}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div className="relative mt-8 pt-5 border-t border-[var(--border)]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-center sm:text-right" style={{ color: "var(--muted-foreground)" }}>
              إجمالي البرامج المنفذة: <strong style={{ color: "var(--brand-green)" }}>{metrics?.activeProjects ?? 0}</strong> برنامجاً ومشروعاً
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              تُحدَّث الأرقام دورياً بعد التدقيق الميداني والمالي
            </p>
          </div>
        </div>
      </div>

      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes card-enter {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
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
      `}</style>
    </section>
  );
}


