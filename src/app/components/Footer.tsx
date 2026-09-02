import {
  Heart,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Shield,
  FileText,
  CreditCard,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { subscribersApi } from "@/shared/services/api.service";

const footerLinks = {
  "عن رحماء بينهم": [
    { label: "من نحن", href: "about" },
    { label: "رؤيتنا ورسالتنا", href: "about" },
    { label: "فريق العمل", href: "about" },
    { label: "التقارير السنوية", href: "reports" },
    { label: "حوكمة العمل", href: "about" },
  ],
  البرامج: [
    { label: "برامجنا", href: "programs" },
    { label: "مشاريعنا", href: "projects" },
    { label: "قصص النجاح", href: "success" },
  ],
  المشاركة: [
    { label: "تبرع الآن", href: "donate" },
    { label: "كن متطوعًا", href: "volunteer" },
    { label: "الشراكات الاستراتيجية", href: "partners" },
    { label: "الوقف الخيري", href: "endowment" },
  ],
  الموارد: [
    { label: "الأخبار", href: "news" },
    { label: "التقارير والإصدارات", href: "reports" },
    { label: "معرض الوسائط", href: "media" },
    { label: "تواصل معنا", href: "contact" },
    { label: "مركز الرسائل", href: "messages" },
    { label: "الاشتراكات والتحديثات", href: "subscribe" },
  ],
};

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export function Footer({ setCurrentPage }: FooterProps) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handlePolicyClick = (_policyType: string) => {
    setCurrentPage("privacy-policy");
  };

  // Newsletter subscription
  const [, setSubscribeStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    if (!email) return;
    try {
      await subscribersApi.subscribe({ email, country: "YE", consent: true, topics: ["updates"] });
      setSubscribeStatus("success");
      form.reset();
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    } catch {
      setSubscribeStatus("error");
    }
  };

  return (
    <footer
      className="pt-16 pb-8 relative overflow-hidden"
      style={{
        direction: "rtl",
        background: "linear-gradient(180deg, var(--brand-green-dark) 0%, var(--brand-green) 100%)",
      }}
    >
      <div className="absolute inset-0 pattern-khatam-white opacity-[0.06] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-1.5 pattern-band-gold pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <button
              onClick={() => setCurrentPage("home")}
              className="flex items-center gap-3 mb-5 group"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--brand-gold)] to-amber-600 flex items-center justify-center shadow-lg shadow-[var(--brand-gold)]/20 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="text-right">
                <div className="text-white" style={{ fontWeight: 800, fontSize: "1.15rem" }}>
                  رحماء بينهم
                </div>
                <div className="text-white/50" style={{ fontSize: "0.65rem" }}>
                  rbdcye.org
                </div>
              </div>
            </button>
            <p className="text-white/65 mb-6" style={{ fontSize: "0.82rem", lineHeight: "1.8" }}>
              رحماء بينهم للإغاثة والتنمية - عمل إنساني تنموي يهدف إلى تخفيف المعاناة وبناء مجتمعات
              مستدامة، منذ عام ١٤٣٠هـ.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <Shield className="w-3.5 h-3.5 text-[var(--success)]" />
                <span className="text-white/70 text-[0.65rem]">عمل إنساني موثوق وشفاف</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white/70 text-[0.65rem]">تنمية مستدامة باليمن</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { icon: MapPin, text: "صنعاء، اليمن" },
                { icon: Phone, text: "+967 780 777 007" },
                { icon: Mail, text: "info@rbdcye.org" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-white/60">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0 text-[var(--brand-gold)]" />
                  <span style={{ fontSize: "0.78rem" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4
                className="text-white mb-4 border-r-2 border-[var(--brand-gold)] pr-3"
                style={{ fontSize: "0.88rem", fontWeight: 700 }}
              >
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => setCurrentPage(link.href)}
                      className="group text-white/55 hover:text-[var(--brand-gold-light)] transition-colors flex items-center gap-1.5"
                      style={{ fontSize: "0.78rem" }}
                    >
                      {link.label}
                      <ExternalLink className="w-2.5 h-2.5 opacity-0 -mr-1 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          className="rounded-xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div>
            <div className="text-white mb-1" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              اشترك في نشرتنا البريدية
            </div>
            <div className="text-white/55" style={{ fontSize: "0.78rem" }}>
              كن أول من يعلم بأخبارنا وبرامجنا وفعالياتنا
            </div>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
            <label htmlFor="newsletter-email" className="sr-only">
              البريد الإلكتروني
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="بريدك الإلكتروني"
              className="flex-1 sm:w-64 px-4 py-2.5 rounded-lg text-white bg-white/10 border border-white/20 placeholder-white/40 focus:outline-none focus:border-[var(--brand-gold)] transition-colors"
              style={{ fontSize: "0.82rem" }}
              dir="ltr"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[var(--brand-gold)] text-white rounded-lg hover:bg-[var(--brand-gold-light)] transition-colors flex-shrink-0"
              style={{ fontSize: "0.82rem", fontWeight: 600 }}
            >
              اشتراك
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <div className="text-white/40 text-center sm:text-right" style={{ fontSize: "0.75rem" }}>
            © ٢٠٢٦ رحماء بينهم للإغاثة والتنمية باليمن. جميع الحقوق محفوظة.
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Payment Gateways Icons */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-1" title="Visa - مدعوم">
                <div className="w-7 h-5 rounded bg-blue-600 flex items-center justify-center text-[0.45rem] text-white font-bold">
                  V
                </div>
              </div>
              <div className="flex items-center gap-1" title="Mastercard - مدعوم">
                <div className="w-7 h-5 rounded bg-orange-500 flex items-center justify-center text-[0.45rem] text-white font-bold">
                  MC
                </div>
              </div>
              <div className="flex items-center gap-1" title="مدى - مدعوم">
                <div className="w-7 h-5 rounded bg-green-600 flex items-center justify-center text-[0.45rem] text-white font-bold">
                  M
                </div>
              </div>
              <div className="flex items-center gap-1" title="Stripe - مدعوم">
                <div className="w-7 h-5 rounded bg-indigo-600 flex items-center justify-center">
                  <CreditCard className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <div title="SSL مشفر">
                <Shield className="w-3.5 h-3.5 text-[var(--success)]" />
              </div>
              <span className="text-white/60 text-[0.6rem] font-medium">SSL آمن</span>
            </div>

            {/* Policy Links */}
            <div className="flex items-center gap-3 text-white/40">
              <button
                onClick={() => handlePolicyClick("privacy")}
                className="hover:text-[var(--brand-gold-light)] transition-colors text-[0.7rem] flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                سياسة الخصوصية
              </button>
              <span className="text-white/10">|</span>
              <button
                onClick={() => handlePolicyClick("terms")}
                className="hover:text-[var(--brand-gold-light)] transition-colors text-[0.7rem] flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                الشروط والأحكام
              </button>
            </div>

            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--brand-gold)] flex items-center justify-center transition-all hover:scale-110"
              title="العودة للأعلى"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
