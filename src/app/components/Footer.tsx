import {
  Heart,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  FileText,
  CreditCard,
  CheckCircle,
  ExternalLink,
  Shield,
} from "lucide-react";
import { TrustShield } from "@/app/components/ui/BrandIcons";
import { useState } from "react";
import { motion } from "motion/react";
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
    { label: "التمكين والتدريب", href: "training" },
  ],
  المشاركة: [
    { label: "تبرع الآن", href: "donate" },
    { label: "كن متطوعًا", href: "volunteer" },
    { label: "الشراكات الاستراتيجية", href: "partners" },
    { label: "الوقف الخيري", href: "endowment" },
    { label: "زكاة المال", href: "zakat" },
    { label: "الصدقة الجارية", href: "sadaqah-jariyah" },
  ],
  خدماتي: [
    { label: "حملتي", href: "campaigns" },
    { label: "طلباتي", href: "requests" },
    { label: "رسائلي", href: "messages" },
    { label: "الشكاوى والمقترحات", href: "feedback" },
    { label: "كتالوج الخدمات", href: "services" },
    { label: "مركز المساعدة", href: "help" },
  ],
  "مركز الأثر": [
    { label: "جواز المتبرع", href: "donor-passport" },
    { label: "الخريطة التفاعلية", href: "interactive-map" },
    { label: "رحلة المتبرع", href: "donor-journey" },
    { label: "الأثر المجتمعي", href: "impact" },
    { label: "المستشار الذكي", href: "smart-advisor" },
  ],
  الموارد: [
    { label: "الأخبار", href: "news" },
    { label: "التقارير والإصدارات", href: "reports" },
    { label: "معرض الوسائط", href: "media" },
    { label: "تواصل معنا", href: "contact" },
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
      className="py-16 sm:py-20 pb-8 relative overflow-hidden bg-gradient-to-b from-[var(--brand-green-dark)] to-[var(--brand-green)]"
      dir="rtl"
      role="contentinfo"
      aria-label="تذييل الموقع - معلومات التواصل والروابط السريعة"
    >
       <div className="absolute inset-0 pattern-khatam-white opacity-[0.06] pointer-events-none" />
       <div className="absolute top-0 inset-x-0 h-1.5 pattern-band-gold pointer-events-none" />
       <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Grid — 6 sections + brand = 8 cols to close functional debts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-8 lg:gap-6 mb-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <button
              onClick={() => setCurrentPage("home")}
              aria-label="العودة إلى الصفحة الرئيسية"
              className="flex items-center gap-3 mb-5 group focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 rounded-xl outline-none"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--brand-gold)] to-[var(--brand-gold-dark)] flex items-center justify-center shadow-lg shadow-[var(--brand-gold)]/20 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 text-[var(--primary-foreground)]" fill="currentColor" aria-hidden="true" />
              </div>
              <div className="text-right">
                <div className="text-[var(--card-foreground)] font-extrabold text-lg">
                  رحماء بينهم
                </div>
                <div className="text-[var(--muted-foreground)] text-[10px]">
                  rbdcye.org
                </div>
              </div>
            </button>
            <p className="text-[var(--muted-foreground)] mb-6 text-[0.82rem] leading-[1.8]">
              رحماء بينهم للإغاثة والتنمية - عمل إنساني تنموي يهدف إلى تخفيف المعاناة وبناء مجتمعات
              مستدامة، منذ عام ١٤٣٥هـ.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10">
                <TrustShield className="w-3.5 h-3.5 text-[var(--success)]" aria-hidden="true" />
                <span className="text-[var(--muted-foreground)] text-[0.65rem]">عمل إنساني موثوق وشفاف</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--card-foreground)]/40" aria-hidden="true" />
                <span className="text-[var(--muted-foreground)] text-[0.65rem]">تنمية مستدامة باليمن</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { icon: MapPin, text: "صنعاء، اليمن" },
                { icon: Phone, text: "+967 780 777 007" },
                { icon: Mail, text: "info@rbdcye.org" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-[var(--muted-foreground)]">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0 text-[var(--brand-gold)]" aria-hidden="true" />
                  <span className="text-[0.78rem]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4
                className="text-[var(--card-foreground)] mb-4 border-r-2 border-[var(--brand-gold)] pr-3 text-[0.88rem] font-bold"
              >
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => setCurrentPage(link.href)}
                      aria-label={link.label}
                      className="group text-[var(--muted-foreground)] hover:text-[var(--brand-gold-light)] transition-all flex items-center gap-1.5 text-[0.78rem] focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 rounded outline-none hover:translate-x-[4px]"
                     >
                       {link.label}
                       <ExternalLink className="w-2.5 h-2.5 opacity-0 -mr-1 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          className="rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10 backdrop-blur-sm"
        >
          <div>
            <div className="text-[var(--card-foreground)] mb-1 font-bold text-[0.95rem]">
              اشترك في نشرتنا البريدية
            </div>
            <div className="text-[var(--muted-foreground)] text-[0.78rem]">
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
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl text-[var(--card-foreground)] bg-[var(--primary-foreground)]/10 border border-[var(--primary-foreground)]/20 placeholder-[var(--muted-foreground)]/40 focus:outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/30 transition-all text-[0.82rem]"
                dir="ltr"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-5 py-2.5 bg-[var(--brand-gold)] text-[var(--primary-foreground)] rounded-xl hover:bg-[var(--brand-gold-light)] transition-all flex-shrink-0 text-[0.82rem] font-semibold focus-visible:ring-2 focus-visible:ring-[var(--primary-foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-green)] outline-none"
              >
                اشتراك
              </motion.button>
          </form>
        </div>

        {/* Trust Bar */}
        <div className="mb-8 rounded-2xl bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10 p-4 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10">
                <Shield className="w-3.5 h-3.5 text-[var(--success)]" aria-hidden="true" />
                <span className="text-[var(--muted-foreground)] text-[0.65rem] font-medium">تشفير SSL آمن</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--brand-gold)]" aria-hidden="true" />
                <span className="text-[var(--muted-foreground)] text-[0.65rem] font-medium">ترخيص رقم ٤٨٢</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://facebook.com/rbdcye" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="group flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] transition-all">
                <svg className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--card-foreground)] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://twitter.com/rbdcye" target="_blank" rel="noopener noreferrer" aria-label="تويتر" className="group flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] transition-all">
                <svg className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--card-foreground)] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              </a>
              <a href="https://instagram.com/rbdcye" target="_blank" rel="noopener noreferrer" aria-label="انستغرام" className="group flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] transition-all">
                <svg className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--card-foreground)] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://wa.me/967780777007" target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="group flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] transition-all">
                <svg className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--card-foreground)] transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--primary-foreground)]/5 border border-[var(--primary-foreground)]/10">
            <div className="flex items-center gap-1.5" title="Visa - مدعوم">
              <div className="w-8 h-5 rounded bg-[var(--brand-green)] flex items-center justify-center text-[0.5rem] text-[var(--primary-foreground)] font-bold">
                VISA
              </div>
            </div>
            <div className="flex items-center gap-1.5" title="Mastercard - مدعوم">
              <div className="w-8 h-5 rounded bg-[var(--brand-gold)] flex items-center justify-center text-[0.5rem] text-[var(--primary-foreground)] font-bold">
                MC
              </div>
            </div>
            <div className="flex items-center gap-1.5" title="مدى - مدعوم">
              <div className="w-8 h-5 rounded bg-[var(--brand-green-dark)] flex items-center justify-center text-[0.5rem] text-[var(--primary-foreground)] font-bold">
                مدا
              </div>
            </div>
            <div className="flex items-center gap-1.5" title="Stripe - مدعوم">
              <div className="w-8 h-5 rounded bg-[var(--muted)] flex items-center justify-center">
                <CreditCard className="w-3 h-3 text-[var(--primary-foreground)]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[var(--muted-foreground)]">
            <motion.button
              whileHover={{ x: 2 }}
              onClick={() => handlePolicyClick("privacy")}
              aria-label="سياسة الخصوصية"
              className="hover:text-[var(--brand-gold-light)] transition-colors text-[0.7rem] flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded outline-none"
            >
              <Shield className="w-3 h-3" aria-hidden="true" />
              سياسة الخصوصية
            </motion.button>
            <span className="text-[var(--muted-foreground)]/20" aria-hidden="true">|</span>
            <motion.button
              whileHover={{ x: 2 }}
              onClick={() => handlePolicyClick("terms")}
              aria-label="الشروط والأحكام"
              className="hover:text-[var(--brand-gold-light)] transition-colors text-[0.7rem] flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded outline-none"
            >
              <FileText className="w-3 h-3" aria-hidden="true" />
              الشروط والأحكام
            </motion.button>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--primary-foreground)]/10">
          <div className="text-[var(--muted-foreground)] text-center sm:text-right text-[0.75rem]">
            © ٢٠٢٦ جمعية رحماء بينهم للإغاثة والتنمية باليمن. جميع الحقوق محفوظة. | ترخيص رقم ٤٨٢
          </div>
          <motion.button
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            aria-label="العودة إلى أعلى الصفحة"
            className="w-9 h-9 rounded-full bg-[var(--primary-foreground)]/10 hover:bg-[var(--brand-gold)] flex items-center justify-center transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-[var(--primary-foreground)] focus-visible:ring-offset-2 outline-none"
            title="العودة للأعلى"
          >
            <ArrowUp className="w-4 h-4 text-[var(--card-foreground)]" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
