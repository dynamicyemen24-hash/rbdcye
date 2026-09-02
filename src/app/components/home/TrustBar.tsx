// Trust Bar - شريط الثقة السريع أسفل الـHero مباشرة
// إثباتات فورية: الترخيص، الحوكمة، الشركاء، أمان الدفع
import { BadgeCheck, Landmark, ShieldCheck, Handshake } from "lucide-react";

import { Reveal } from "@/app/components/layout/Reveal";

const TRUST_ITEMS = [
  {
    icon: BadgeCheck,
    title: "مرخّصة رسمياً",
    detail: "ترخيص رقم ٤٨٢ من الجهات المختصة باليمن",
  },
  {
    icon: ShieldCheck,
    title: "حوكمة رشيدة",
    detail: "تدقيق مالي مستقل وتقارير دورية معلنة",
  },
  {
    icon: Handshake,
    title: "شبكة شركاء",
    detail: "مؤسسات محلية ودولية تؤمن برسالتنا",
  },
  {
    icon: Landmark,
    title: "تبرع آمن",
    detail: "بوابات دفع مشفّرة وإيصال فوري لكل مساهمة",
  },
];

export function TrustBar() {
  return (
    <div
      dir="rtl"
      className="relative border-b border-[var(--border)]"
      style={{ background: "var(--background)" }}
    >
      <div className="section-container py-6 md:py-7">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
          {TRUST_ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} y={14}>
              <div className="flex items-start gap-3 lg:justify-center">
                <div
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "var(--brand-green-pale)",
                    border: "1px solid rgba(var(--brand-gold-rgb),0.25)",
                  }}
                >
                  <item.icon className="w-5 h-5" style={{ color: "var(--brand-gold)" }} />
                </div>
                <div className="min-w-0">
                  <div
                    className="font-bold leading-snug"
                    style={{ fontSize: "0.9rem", color: "var(--foreground)" }}
                  >
                    {item.title}
                  </div>
                  <div
                    className="leading-relaxed"
                    style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}
                  >
                    {item.detail}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
