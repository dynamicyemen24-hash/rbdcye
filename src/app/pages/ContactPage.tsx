// Contact Page - صفحة التواصل المحسّنة
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  Shield,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
  MessageSquare,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";

import { sendMessage } from "@/api/messages";
import { contentManager } from "@/shared/services/content-manager";
import { analyticsService } from "@/shared/services/analytics.service";
import { EnhancedBrandStory } from "@/app/components/home/EnhancedBrandStory";
import { useSEO } from "@/utils/seoAdvanced";

// Honeypot field - hidden from humans, filled by bots
const HONEYPOT_FIELD = "website";
const MAX_MESSAGE_LENGTH = 2000;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentSource, setContentSource] = useState<"static" | "sanity">("static");
  const [ticketNumber] = useState(() => Math.floor(Math.random() * 10000));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    // Honeypot field - hidden from humans, filled by bots
    honeypot: "",
  });

  // Turnstile verification
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  useSEO({
    title: "تواصل معنا — رحماء بينهم",
    description:
      "تواصل مع فريق رحماء بينهم للاستفسارات والتبرعات والتطوع — هاتف مباشر وبريد إلكتروني ورسائل عبر منصات التواصل الاجتماعي.",
    type: "website",
    url: "https://rbdcye.org/contact",
    keywords: [
      "تواصل",
      "اتصل بنا",
      "استفسار",
      "دعم",
      "رحماء بينهم",
      "منظمات يمنية",
      "تبرع",
    ],
  });

  const contactStory =
    "نسعى دائماً لربط أهل الخير بالمحتاجين عبر قنوات اتصال فعالة ومتاحة. سواء كنت تتبرع، أو تستفسر عن مشروع من مشاريعنا، أو تتطوع بوقتك وخبرتك، ففريقنا جاهز لمساعدتك في كل خطوة من رحلة الخير التي تريد المساهمة فيها.";

  // تحميل البيانات من content-bridge
  useEffect(() => {
    let cancelled = false;
    contentManager
      .getImpact()
      .then((result: any) => {
        if (!cancelled) {
          setContentSource(
            result.source === "sanity" || result.source === "cache" ? "sanity" : "static"
          );
        }
      })
      .catch(() => {
        if (!cancelled) setContentSource("static");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Turnstile verification — server-side via Cloudflare Pages Function
  async function verifyTurnstile(token: string) {
    try {
      const response = await fetch("/api/verify-turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      setTurnstileVerified(data.success ?? false);
      if (!data.success) {
        setTurnstileError("التحقق من TURNSTILE فشل يرجى المحاولة مرة أخرى");
      }
    } catch {
      setTurnstileError("حدث خطأ في التحقق من TURNSTILE");
      setTurnstileVerified(false);
    }
  }

  // Phone validation — Yemeni format
  function isValidPhone(phone: string): boolean {
    if (!phone) return true; // optional field
    const cleaned = phone.replace(/[\s\-()]/g, "");
    return /^\+?967[7][0-9]{8}$/.test(cleaned) || /^[0-9]{9,10}$/.test(cleaned);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Check honeypot — if filled, it's a bot
    if (formData.honeypot) {
      setError("تم رفض الطلب — يرجى المحاولة مرة أخرى");
      setIsSubmitting(false);
      return;
    }

    // Verify Turnstile token
    if (!turnstileVerified) {
      setError("يجب إكمال التحقق الأمني قبل الإرسال");
      setIsSubmitting(false);
      return;
    }

    // Client-side phone validation
    if (!isValidPhone(formData.phone)) {
      setError("رقم الهاتف غير صحيح — يرجى إدخال رقم هاتف يمني صحيح");
      setIsSubmitting(false);
      return;
    }

    // Message length validation
    if (formData.message.length > MAX_MESSAGE_LENGTH) {
      setError(`الرسالة أطول من الحد المسموح (${MAX_MESSAGE_LENGTH} حرف)`);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await sendMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      if (result.success) {
        setSubmitted(true);
        try {
          analyticsService.generateDonorReport();
        } catch {
          /* non-critical */
        }
      } else {
        setError(result.error || "حدث خطأ في إرسال الرسالة — يرجى المحاولة مرة أخرى");
      }
    } catch (_err) {
      setError("خطأ في الاتصال بالخادم — تحقق من اتصالك بالإنترنت وحاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    { name: "facebook", icon: Facebook, url: "https://facebook.com/rbdcye", color: "#1877F2" },
    { name: "twitter", icon: Twitter, url: "https://twitter.com/rbdcye", color: "#1DA1F2" },
    { name: "instagram", icon: Instagram, url: "https://instagram.com/rbdcye", color: "#E4405F" },
    { name: "youtube", icon: Youtube, url: "https://youtube.com/@rbdcye", color: "#FF0000" },
    {
      name: "linkedin",
      icon: Linkedin,
      url: "https://linkedin.com/company/rbdcye",
      color: "#0077B5",
    },
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: "الهاتف المباشر",
      details: ["+967 780 777 007"],
      description: "للتواصل المباشر والاستفسارات العاجلة — نرد في أسرع وقت ممكن",
      color: "var(--brand-green)",
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      details: ["info@rbdcye.org", "donations@rbdcye.org"],
      description: "للتواصل غير العاجل — نرد خلال 24 ساعة عمل",
      color: "var(--brand-gold)",
    },
    {
      icon: MapPin,
      title: "المقر الرئيسي",
      details: ["صنعاء - شارع الزبيري", "اليمن"],
      description: "لزيارتنا مباشرة أو تسليم التبرعات العينية",
      color: "var(--brand-green)",
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      details: ["السبت - الخميس: 8 ص - 4 م", "الجمعة: مغلق"],
      description: "نتلقى اتصالاتكم خلال ساعات العمل الرسمية",
      color: "var(--brand-gold)",
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-20" dir="rtl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--card)] rounded-3xl p-12 border border-[var(--border)] max-w-2xl mx-auto shadow-xl"
              role="status"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-[var(--brand-green-pale)] rounded-full flex items-center justify-center">
                <Send className="w-10 h-10 text-[var(--brand-green)]" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">
                تم إرسال رسالتك بنجاح!
              </h2>
              <p className="text-[var(--muted-foreground)] mb-6 leading-[2]">
                شكراً لتواصلك معنا. فريقنا سيراجعك في أقرب وقت ممكن. إذا كان الاستفسار
                عاجلاً، يمكنك الاتصال بنا مباشرة على الرقم +967 780 777 007.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
                <CheckCircle className="w-4 h-4 text-[var(--brand-green)]" aria-hidden="true" />
                <span>تم إنشاء تذكرة دعم رقم: #{ticketNumber}</span>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-[var(--brand-green)] text-white rounded-xl font-bold hover:bg-[var(--brand-green-light)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none"
              >
                إرسال رسالة أخرى
              </button>
            </motion.div>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* Enhanced Brand Story Section at top */}
      <EnhancedBrandStory setCurrentPage={() => {}} />
      {/* Page Header */}
      <section className="relative overflow-hidden bg-[var(--brand-green-dark)] py-28 text-white sm:py-40">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "var(--pattern-rub-el-hizb)",
            backgroundSize: "200px 200px",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
            <MessageSquare className="h-3.5 w-3.5 text-[var(--brand-gold)]" />
            تواصل معنا
          </div>
          <h1 className="text-3xl font-bold leading-[1.35] sm:text-4xl">
            نحن هنا لمساعدتك — في أي وقت وأي مكان
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-[2] text-white/55">
            لا تتردد في مراسلتنا بأي استفسار أو اقتراح أو تبرع. فريقنا المتخصص جاهز
            لخدمتك ومساعدتك في كل ما تحتاجه من دعم إنساني ومجتمعي
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[var(--card)] rounded-3xl p-6 border border-[var(--border)] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `var(--brand-green-pale)` }}
                    >
                      <Icon className="w-6 h-6 text-[var(--brand-green)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--foreground)] mb-1">{info.title}</h3>
                      {info.details.map((detail, j) => (
                        <p
                          key={j}
                          className="text-[var(--muted-foreground)] text-sm leading-relaxed"
                        >
                          {detail}
                        </p>
                      ))}
                      <p className="text-[var(--muted-foreground)] text-xs mt-1 leading-[1.6] opacity-75">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-[var(--card)] rounded-3xl p-6 border border-[var(--border)] shadow-lg"
            >
              <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[var(--brand-green)]" aria-hidden="true" />
                تابعنا على منصات التواصل الاجتماعي
              </h3>
              <p className="text-[var(--muted-foreground)] text-xs mb-4 leading-[1.7]">
                ننشر المحتوى التعليمي والإنساني بانتظام على منصات التواصل — متابعتك تُعزز
                الصلة بيننا وبين المحتاجين وتساعد في نشر الوعي المجتمعي.
              </p>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      aria-label={`تابعنا على ${social.name}`}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 outline-none"
                      style={{ backgroundColor: social.color }}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-[var(--card)] rounded-3xl p-6 border border-[var(--border)] shadow-lg"
            >
              <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--brand-green)]" />
                الأمان والثقة
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-[var(--brand-green)] flex-shrink-0" />
                  <span className="text-[var(--muted-foreground)]">
                    موقع آمن بتقنية تشفير SSL المتقدمة
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-[var(--brand-gold)] flex-shrink-0" />
                  <span className="text-[var(--muted-foreground)]">
                    منظمة رسمية مرخّصة برقم #482
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-[var(--brand-green)] flex-shrink-0" />
                  <span className="text-[var(--muted-foreground)]">
                    خصوصية بياناتك محمية ولن تُستخدم لأغراض أخرى
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-[var(--card)] rounded-3xl p-8 sm:p-10 border border-[var(--border)] shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  className="p-4 bg-[var(--danger-bg)] text-[var(--destructive)] rounded-xl border border-[var(--danger)]"
                >
                  {error}
                </motion.div>
              )}

              {/* Story reminder above form */}
              <div className="mb-6 p-4 bg-[var(--brand-green-pale)] rounded-xl border border-[var(--brand-green)]/20">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[var(--brand-green)] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[var(--foreground)] leading-[1.8]">
                      {contactStory}
                    </p>
                    <p className="text-[var(--muted-foreground)] text-sm mt-2">
                      نحن هنا لاستقبال اتصالاتك واستفساراتك في أي وقت — لا تتردد
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-[var(--foreground)] mb-3"
                  >
                    الاسم الكامل *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus-ring-[var(--brand-green)]/30 outline-none transition-all"
                    placeholder="أدخل اسمك الكامل كما سيظهر في الرد"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[var(--foreground)] mb-3"
                  >
                    البريد الإلكتروني *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus-ring-[var(--brand-green)]/30 outline-none transition-all"
                    placeholder="أدخل بريدك الإلكتروني لمتابعة الرد"
                  />
                  {/* Honeypot field - hidden from humans, filled by bots */}
                  <input
                    type="text"
                    name="honeypot"
                    className="w-full px-4 py-3 rounded-xl border border-transparent outline-none bg-transparent hidden sm:block"
                    aria-hidden="true"
                    readOnly
                    tabIndex={-1}
                  />
                  {/* Turnstile response token */}
                  <input
                    type="hidden"
                    name="cf-turnstile-response"
                    id="cf-turnstile-response"
                    value=""
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-[var(--foreground)] mb-3"
                >
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus-ring-[var(--brand-green)]/30 outline-none transition-all"
                  placeholder="أدخل رقم هاتفك للتواصل السريع (اختياري)"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-[var(--foreground)] mb-3"
                >
                  الموضوع *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus-ring-[var(--brand-green)]/30 outline-none transition-all"
                  placeholder="مثال: استفسار عن برنامج الكفالة، أو طلب تبرع، أو اقتراح مشروع"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-[var(--foreground)] mb-3"
                >
                  الرسالة *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={MAX_MESSAGE_LENGTH}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus-ring-[var(--brand-green)]/30 outline-none transition-all resize-none"
                  placeholder="اكتب رسالتك بوضوح — كلما كانت التفاصيل أدق، كانت سرعة الاستجابة أكبر. يُرجى ذكر أي أرقام مرجعية إن وُجدت"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${formData.message.length > MAX_MESSAGE_LENGTH * 0.9 ? 'text-[var(--destructive)]' : 'text-[var(--muted-foreground)]'}`}>
                    {formData.message.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
              </div>

              {/* Turnstile widget */}
              <div className="mb-6">
                <script
                  async
                  src="https://challenges.cloudflare.com/v1/cf-turnstile.js"
                  defer
                ></script>
                <div
                  id="turnstile"
                  data-sitekey={(import.meta as any).env?.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAADnPIDROrmt1Wwj"}
                  data-theme="light"
                  data-size="normal"
                ></div>
                {turnstileError && (
                  <p className="text-[var(--destructive)] text-sm mt-2">{turnstileError}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                aria-label={isSubmitting ? "جاري إرسال رسالتك..." : "إرسال الرسالة"}
                className="w-full bg-[var(--brand-green)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--brand-green-light)] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 outline-none"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="w-5 h-5" aria-hidden="true" />
                )}
                {isSubmitting ? "جاري إرسال رسالتك..." : "إرسال الرسالة"}
              </motion.button>

              {/* Security Badge */}
              <div className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--brand-green)]" aria-hidden="true" />
                  <span>رسالتك آمنة ومشفرة — لن نشارك بياناتك مع أي جهة</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
