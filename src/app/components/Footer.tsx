import {
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  FileText,
  CreditCard,
  CheckCircle,
  ExternalLink,
  Shield,
  ShieldCheck,
  Building2,
  Lock,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useCallback, useId } from "react";

import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { subscribersApi } from "@/shared/services/api.service";
import { useI18n } from "@/shared/i18n";

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export function Footer({ setCurrentPage }: FooterProps) {
  const { t, dir, isRTL } = useI18n();
  const emailInputId = useId();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePolicyClick = useCallback(
    (policyType: "privacy" | "terms") => {
      window.history.pushState({ policyType }, "", "/privacy-policy");
      setCurrentPage("privacy-policy");
    },
    [setCurrentPage]
  );

  // Verified navigation groups matching exact routes in App.tsx
  const footerSections = [
    {
      heading: t("footer.about.heading"),
      links: [
        { label: t("footer.about.aboutUs"), href: "about" },
        { label: t("footer.about.vision"), href: "about" },
        { label: t("footer.about.governance"), href: "transparency" },
        { label: t("footer.about.annualReports"), href: "reports" },
        { label: t("footer.join.partnerships"), href: "partners" },
      ],
    },
    {
      heading: t("footer.programs.heading"),
      links: [
        { label: t("footer.programs.programs"), href: "programs" },
        { label: t("footer.programs.projects"), href: "projects" },
        { label: t("footer.programs.successStories"), href: "success" },
        { label: isRTL ? "محرك الأثر" : "Impact Engine", href: "impact-engine" },
        { label: t("footer.ebadge.socialImpact"), href: "impact" },
      ],
    },
    {
      heading: t("footer.join.heading"),
      links: [
        { label: t("footer.join.donate"), href: "donate" },
        { label: isRTL ? "حاسبة الزكاة" : "Zakat Calculator", href: "zakat-calculator" },
        { label: t("footer.join.sadaqah"), href: "sadaqah-jariyah" },
        { label: t("footer.join.endowment"), href: "endowment" },
        { label: t("footer.your.campaigns"), href: "campaigns" },
        { label: t("footer.ebadge.smartAdvisor"), href: "smart-advisor" },
      ],
    },
    {
      heading: isRTL ? "المتبرعون والشركاء" : "Donors & Partners",
      links: [
        { label: isRTL ? "بوابة المتبرع" : "Donor Portal", href: "donor" },
        { label: t("footer.ebadge.donorPassport"), href: "donor-passport" },
        { label: t("footer.ebadge.donorJourney"), href: "donor-journey" },
        { label: isRTL ? "كبار المتبرعين" : "Major Donors", href: "major-donors" },
        { label: isRTL ? "شراكات الشركات" : "Corporate", href: "corporate" },
      ],
    },
    {
      heading: t("footer.your.heading"),
      links: [
        { label: t("footer.your.requests"), href: "requests" },
        { label: t("footer.join.volunteer"), href: "volunteer" },
        { label: t("footer.programs.training"), href: "training" },
        { label: t("footer.your.services"), href: "services" },
        { label: t("footer.your.feedback"), href: "feedback" },
        { label: t("footer.your.help"), href: "help" },
      ],
    },
    {
      heading: t("footer.resources.heading"),
      links: [
        { label: t("footer.resources.news"), href: "news" },
        { label: t("footer.resources.reports"), href: "reports" },
        { label: t("footer.resources.media"), href: "media" },
        { label: t("footer.resources.contact"), href: "contact" },
        { label: t("footer.ebadge.interactiveMap"), href: "interactive-map" },
      ],
    },
  ];

  // Newsletter subscription logic
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success" | "error">("idle");
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    if (!email) return;

    setSubscribeLoading(true);
    try {
      await subscribersApi.subscribe({ email, country: "YE", consent: true, topics: ["updates"] });
      setSubscribeStatus("success");
      form.reset();
      setTimeout(() => setSubscribeStatus("idle"), 4000);
    } catch {
      setSubscribeStatus("error");
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <footer
      className="site-footer py-14 sm:py-18 pb-8 relative overflow-hidden"
      dir={dir}
      role="contentinfo"
      aria-label={t("footer.ariaLabel")}
    >
      {/* Subtle Islamic Khatam ornament */}
      <div className="site-footer__pattern absolute inset-0 pattern-khatam-white pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-1 pattern-band-gold pointer-events-none opacity-80" />

      <div className="site-footer__inner relative px-4 sm:px-6">
        {/* Top Grid: Brand & Institutional Identity + 6 link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-8 lg:gap-6 mb-12">
          {/* Brand Column (2 cols on lg) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <button
              type="button"
              onClick={() => setCurrentPage("home")}
              aria-label={t("footer.backToHome")}
              className="flex items-center gap-3.5 mb-5 group focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 rounded-2xl outline-none text-start"
            >
              <span className="grid shrink-0 place-items-center h-12 w-12 rounded-2xl bg-white/95 p-1.5 ring-1 ring-white/20 shadow-md shadow-black/20 group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo.svg"
                  alt={t("footer.brandName")}
                  width={48}
                  height={48}
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </span>
              <div className="flex flex-col text-start leading-tight">
                <span className="text-[var(--card-foreground)] font-black text-xl tracking-tight group-hover:text-[var(--brand-gold-light)] transition-colors">
                  {t("footer.brandName")}
                </span>
                <span className="text-[var(--brand-gold)] text-xs font-semibold mt-1">
                  {isRTL ? "إغاثة وتنمية باليمن • ترخيص رقم ٤٨٢" : "Relief & Development • License 482"}
                </span>
              </div>
            </button>

            <p className="text-[var(--muted-foreground)] mb-6 text-[0.84rem] leading-relaxed">
              {t("footer.brandDescription")}
            </p>

            {/* Official Accreditations */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-[var(--brand-gold)] shrink-0" aria-hidden="true" />
                <span className="text-[var(--muted-foreground)] text-[0.75rem] font-medium">
                  {t("footer.trustBullet1")}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm">
                <Building2 className="w-4 h-4 text-[var(--brand-gold-light)] shrink-0" aria-hidden="true" />
                <span className="text-[var(--muted-foreground)] text-[0.75rem] font-medium">
                  {t("footer.trustBullet2")}
                </span>
              </div>
            </div>

            {/* Direct Contact Channels */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-[var(--muted-foreground)] text-[0.82rem]">
                <MapPin className="w-4 h-4 shrink-0 text-[var(--brand-gold)]" aria-hidden="true" />
                <span>{t("footer.location")}</span>
              </div>

              <a
                href="tel:+967780777007"
                dir="ltr"
                className="inline-flex items-center gap-2.5 text-[var(--muted-foreground)] hover:text-[var(--brand-gold-light)] transition-colors text-[0.82rem] font-mono focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] rounded-lg outline-none"
              >
                <Phone className="w-4 h-4 shrink-0 text-[var(--brand-gold)]" aria-hidden="true" />
                <span>+967 780 777 007</span>
              </a>

              <a
                href="mailto:info@rbdcye.org"
                className="flex items-center gap-2.5 text-[var(--muted-foreground)] hover:text-[var(--brand-gold-light)] transition-colors text-[0.82rem] focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] rounded-lg outline-none"
              >
                <Mail className="w-4 h-4 shrink-0 text-[var(--brand-gold)]" aria-hidden="true" />
                <span>info@rbdcye.org</span>
              </a>
            </div>
          </div>

          {/* 6 Link Columns */}
          {footerSections.map((section) => (
            <div key={section.heading} className="space-y-4">
              <h4 className="text-[var(--card-foreground)] font-bold text-[0.92rem] border-s-2 border-[var(--brand-gold)] ps-3 leading-none">
                {section.heading}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={`${section.heading}-${link.label}`}>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(link.href)}
                      aria-label={link.label}
                      className="group text-[var(--muted-foreground)] hover:text-[var(--brand-gold-light)] transition-all flex items-center gap-1.5 text-[0.82rem] focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 rounded-md outline-none text-start rtl:hover:-translate-x-1 ltr:hover:translate-x-1"
                    >
                      <span>{link.label}</span>
                      <ExternalLink
                        className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[var(--brand-gold)]"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Box */}
        <div className="rounded-2xl p-6 sm:p-7 mb-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-lg shadow-black/10">
          <div className="max-w-xl">
            <h3 className="text-[var(--card-foreground)] font-bold text-base sm:text-lg mb-1.5">
              {t("footer.subscribe.title")}
            </h3>
            <p className="text-[var(--muted-foreground)] text-[0.84rem] leading-relaxed">
              {t("footer.subscribe.description")}
            </p>
            <div
              role="status"
              aria-live="polite"
              className={
                subscribeStatus === "idle"
                  ? "sr-only"
                  : `mt-2 text-[0.82rem] font-bold ${
                      subscribeStatus === "error" ? "text-red-300" : "text-emerald-300"
                    }`
              }
            >
              {subscribeStatus === "success" && t("footer.subscribe.success")}
              {subscribeStatus === "error" && t("footer.subscribe.error")}
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
            <label htmlFor={emailInputId} className="sr-only">
              {t("footer.contact.emailHeading")}
            </label>
            <input
              id={emailInputId}
              name="email"
              type="email"
              required
              placeholder={t("footer.subscribe.placeholder")}
              className="flex-1 sm:w-72 px-4 py-2.5 rounded-xl text-[var(--card-foreground)] bg-white/[0.08] border border-white/20 placeholder-[var(--muted-foreground)]/60 focus:outline-none focus:border-[var(--brand-gold)] focus:ring-2 focus:ring-[var(--brand-gold)]/30 transition-all text-[0.85rem]"
              dir="ltr"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={subscribeLoading}
              aria-busy={subscribeLoading}
              className="px-6 py-2.5 bg-[var(--brand-gold)] text-black rounded-xl hover:bg-[var(--brand-gold-light)] transition-all font-bold text-[0.85rem] shrink-0 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 outline-none disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-black/10"
            >
              {subscribeLoading ? t("footer.subscribe.loading") : t("footer.subscribe.cta")}
            </motion.button>
          </form>
        </div>

        {/* Trust & Social Channels Bar */}
        <div className="mb-8 rounded-2xl bg-white/[0.04] border border-white/10 p-4 sm:p-5 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center text-[0.78rem]">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10">
                <Lock className="w-3.5 h-3.5 text-[var(--brand-gold)]" aria-hidden="true" />
                <span className="text-[var(--muted-foreground)] font-medium">{t("footer.sslBadge")}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--brand-gold-light)]" aria-hidden="true" />
                <span className="text-[var(--muted-foreground)] font-medium">{t("footer.licenseBadge")}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10">
                <Shield className="w-3.5 h-3.5 text-[var(--brand-gold)]" aria-hidden="true" />
                <span className="text-[var(--muted-foreground)] font-medium">
                  {isRTL ? "حوكمة وشفافية معتمدة" : "Audited Governance"}
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com/rbdcye"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer.social.facebookAria")}
                className="group flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] outline-none"
              >
                <svg
                  className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-black transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://twitter.com/rbdcye"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer.social.twitterAria")}
                className="group flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] outline-none"
              >
                <svg
                  className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-black transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>

              <a
                href="https://instagram.com/rbdcye"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer.social.instagramAria")}
                className="group flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] outline-none"
              >
                <svg
                  className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-black transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              <a
                href="https://youtube.com/@rbdcye"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer.social.youtubeAria")}
                className="group flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] outline-none"
              >
                <svg
                  className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-black transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href="https://wa.me/967780777007"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer.social.whatsappAria")}
                className="group flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 hover:bg-[var(--brand-gold)] hover:border-[var(--brand-gold)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] outline-none"
              >
                <svg
                  className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-black transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods & Legal Policies Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10">
            <div
              className="w-9 h-5 rounded bg-[#1A1F71] flex items-center justify-center text-[0.6rem] text-white font-extrabold tracking-wider"
              title={t("footer.paymentMethods.visaSupported")}
            >
              VISA
            </div>
            <div
              className="w-9 h-5 rounded bg-[#EB001B] flex items-center justify-center text-[0.6rem] text-white font-extrabold"
              title={t("footer.paymentMethods.mastercardSupported")}
            >
              MC
            </div>
            <div
              className="w-9 h-5 rounded bg-[var(--brand-green-dark)] flex items-center justify-center text-[0.55rem] text-[var(--brand-gold)] font-bold px-1"
              title={t("footer.paymentMethods.madaSupported")}
            >
              {t("footer.paymentMethods.mada")}
            </div>
            <div
              className="w-9 h-5 rounded bg-[#635BFF] flex items-center justify-center text-[0.6rem] text-white"
              title={t("footer.paymentMethods.stripeSupported")}
            >
              <CreditCard className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            </div>
          </div>

          {/* Legal and Compliance Links */}
          <div className="flex items-center gap-3 text-[var(--muted-foreground)] text-[0.8rem]">
            <button
              type="button"
              onClick={() => handlePolicyClick("privacy")}
              aria-label={t("footer.privacyPolicy")}
              className="hover:text-[var(--brand-gold-light)] transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] rounded outline-none"
            >
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t("footer.privacyPolicy")}</span>
            </button>
            <span className="text-white/20" aria-hidden="true">
              •
            </span>
            <button
              type="button"
              onClick={() => handlePolicyClick("terms")}
              aria-label={t("footer.terms")}
              className="hover:text-[var(--brand-gold-light)] transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] rounded outline-none"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t("footer.terms")}</span>
            </button>
            <span className="text-white/20" aria-hidden="true">
              •
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage("transparency")}
              aria-label={t("footer.about.governance")}
              className="hover:text-[var(--brand-gold-light)] transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] rounded outline-none"
            >
              <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t("footer.about.governance")}</span>
            </button>
          </div>
        </div>

        {/* Footer Bottom Bar: Copyright, Language Switcher, Back To Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-[0.8rem]">
          <p className="text-[var(--muted-foreground)] text-center sm:text-start leading-relaxed max-w-xl">
            {t("footer.copyrightLine")}
          </p>

          <div className="flex items-center gap-4">
            <LanguageSwitcher
              variant="outline"
              className="bg-white/[0.06] hover:bg-white/[0.12] text-white hover:text-white border-white/15 text-xs py-1.5 px-3"
            />

            <motion.button
              whileHover={{ y: -3, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={scrollToTop}
              aria-label={t("footer.backToTopAria")}
              title={t("footer.backToTop")}
              className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-[var(--brand-gold)] hover:text-black text-white flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] outline-none border border-white/15 shadow-sm"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
