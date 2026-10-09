// Trust Bar — مؤشرات مؤسسية موجزة أسفل الواجهة الرئيسية.
import { BadgeCheck, Landmark, ShieldCheck, Handshake } from "lucide-react";

import { Reveal } from "@/app/components/layout/Reveal";

const TRUST_ITEMS = [
  {
    icon: BadgeCheck,
    title: "الهوية والترخيص",
    detail: "بيانات المؤسسة وترخيصها كما هو معلن",
  },
  {
    icon: ShieldCheck,
    title: "المساءلة والشفافية",
    detail: "إتاحة المعلومات والتقارير المتوفرة بوضوح",
  },
  {
    icon: Handshake,
    title: "الشراكة المجتمعية",
    detail: "التعاون مع الجهات والمبادرات ذات الصلة",
  },
  {
    icon: Landmark,
    title: "وضوح قنوات المساهمة",
    detail: "راجع تفاصيل التبرع وبياناته قبل إتمام العملية",
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
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-5">
          {TRUST_ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} y={10}>
              <div className="flex items-start gap-3 lg:justify-center">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: "var(--brand-green-pale)",
                    border: "1px solid rgba(var(--brand-gold-rgb),0.25)",
                  }}
                >
                  <item.icon className="h-5 w-5" style={{ color: "var(--brand-green)" }} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div
                    className="font-semibold leading-snug"
                    style={{ fontSize: "0.9rem", color: "var(--foreground)" }}
                  >
                    {item.title}
                  </div>
                  <div
                    className="leading-relaxed"
                    style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}
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
