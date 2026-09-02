// Final CTA - الدعوة الختامية بكامل العرض (قوس الإقناع الأخير)
import { Heart, UserPlus, ShieldCheck, Receipt, FileBarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Reveal } from "@/app/components/layout/Reveal";
import { StarMedallion } from "@/app/components/decor/IslamicPattern";

const ASSURANCES = [
  { icon: ShieldCheck, label: "تبرعك مشفّر بالكامل" },
  { icon: Receipt, label: "إيصال فوري لكل مساهمة" },
  { icon: FileBarChart, label: "تقارير صرف دورية معلنة" },
];

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section
      dir="rtl"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, var(--brand-green-dark) 0%, var(--brand-green) 60%, var(--brand-green-dark) 100%)",
      }}
    >
      {/* الزخارف */}
      <div className="absolute inset-0 pattern-khatam-white opacity-[0.08] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-2 pattern-band-gold pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-2 pattern-band-gold pointer-events-none z-10" />
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(var(--brand-gold-rgb),0.18), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-40 -right-24 w-[28rem] h-[28rem] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)" }}
      />

      <div className="relative z-10 section-container text-center">
        <Reveal>
          <div className="flex justify-center mb-8">
            <StarMedallion size={104} color="var(--brand-gold)">
              <Heart
                className="w-11 h-11"
                fill="var(--brand-gold)"
                style={{ color: "var(--brand-gold)" }}
              />
            </StarMedallion>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            className="mb-5"
            style={{
              fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.35,
            }}
          >
            جعلنا نُحسن…
            <span style={{ color: "var(--brand-gold-light)" }}> فكن أنت السند</span>
          </h2>
          <p
            className="mx-auto mb-10 max-w-2xl"
            style={{
              fontSize: "var(--fs-lead)",
              lineHeight: 2,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            خلف كل مشروع قصة، وخلف كل قصة أسرة انتظرت يدًا ممدة. مساهمتك اليوم — مهما صغرت — هي ما
            يحوّل النوايا إلى مياه تجري ودروسٍ تُتلقّى وأسرٍ تنتج.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              onClick={() => navigate("/donate")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-extrabold text-lg transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold))",
                color: "#FFFFFF",
                boxShadow: "0 12px 28px rgba(var(--brand-gold-rgb),0.35)",
              }}
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              تبرع الآن
            </button>
            <button
              onClick={() => navigate("/volunteer")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-lg border-2 transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.4)", color: "#FFFFFF" }}
            >
              <UserPlus className="w-5 h-5" />
              كن متطوعاً معنا
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-8 border-t border-white/10 max-w-2xl mx-auto">
            {ASSURANCES.map((a) => (
              <span
                key={a.label}
                className="flex items-center gap-2 text-sm"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                <a.icon className="w-4 h-4" style={{ color: "var(--brand-gold-light)" }} />
                {a.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
