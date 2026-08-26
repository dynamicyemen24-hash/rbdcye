// Contact Page - صفحة التواصل enhanced
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Clock, Send, Loader2, Shield, CheckCircle, Facebook, Twitter, Instagram, Youtube, Linkedin, Globe, Users, BarChart3, Heart } from "lucide-react";
import { useState, useEffect } from "react";

import { sendMessage } from "@/api/messages";
import { contentManager } from "@/shared/services/content-manager";
import { analyticsService } from "@/shared/services/analytics.service";
import { PageHeader } from "@/app/components/PageHeader";
import { StatsGrid } from "@/app/components/StatsGrid";
import { EnhancedBrandStory } from "@/app/components/home/EnhancedBrandStory";
import { useSEO } from "@/utils/seoAdvanced";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentSource, setContentSource] = useState<'static' | 'sanity'>('static');
  const [ticketNumber] = useState(() => Math.floor(Math.random() * 10000));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useSEO({
    title: 'تواصل معنا - رحماء بينهم',
    description: 'تواصل مع رحماء بينهم - نحن هنا لمساعدتك في أي استفسار أو دعم إنساني',
    type: 'website',
    url: 'https://rbdcye.org/contact',
    keywords: ['تواصل', 'اتصل بنا', 'استفسار', 'دعم', 'رحماء بينهم'],
  });

  // Enhanced storytelling content
  const contactStory = "نسعى دائماً لربط بين أهل الخير والمحتاجين عبر قنوات اتصال فعالة ومتاحة. سواء كنت تتبرع، أو تستفسر عن مشروع، أو تتطوع بوقتك، فنحن هنا لنساعدك في كل خطوة من عملية التبرع والتواصل.";

  // تحميل البيانات من content-bridge
  useEffect(() => {
    let cancelled = false;
    contentManager.getImpact()
      .then((result: any) => {
        if (!cancelled) {
          setContentSource(result.source === 'sanity' || result.source === 'cache' ? 'sanity' : 'static');
        }
      })
      .catch(() => {
        if (!cancelled) setContentSource('static');
      });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
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
        try { analyticsService.generateDonorReport(); } catch { /* non-critical */ }
      } else {
        setError(result.error || 'حدث خطأ في إرسال الرسالة');
      }
    } catch (_err) {
      setError('خطأ في الاتصال بالخادم');
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
    { name: 'facebook', icon: Facebook, url: 'https://facebook.com/rbdcye', color: '#1877F2' },
    { name: 'twitter', icon: Twitter, url: 'https://twitter.com/rbdcye', color: '#1DA1F2' },
    { name: 'instagram', icon: Instagram, url: 'https://instagram.com/rbdcye', color: '#E4405F' },
    { name: 'youtube', icon: Youtube, url: 'https://youtube.com/@rbdcye', color: '#FF0000' },
    { name: 'linkedin', icon: Linkedin, url: 'https://linkedin.com/company/rbdcye', color: '#0077B5' },
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: 'الهاتف',
      details: ['+967 780 777 007'],
      color: 'var(--brand-green)',
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      details: ['info@rbdcye.org', 'donations@rbdcye.org'],
      color: 'var(--brand-gold)',
    },
    {
      icon: MapPin,
      title: 'العنوان',
      details: ['صنعاء - شارع الزبيري', 'اليمن'],
      color: '#2563EB',
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      details: ['السبت - الخميس: 8 ص - 4 م', 'الجمعة: مغلق'],
      color: '#7C3AED',
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-20" dir="rtl">
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 border border-[var(--border)] max-w-2xl mx-auto shadow-xl"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-[var(--brand-green-pale)] rounded-full flex items-center justify-center">
              <Send className="w-10 h-10 text-[var(--brand-green)]" />
            </div>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              تم إرسال رسالتك بنجاح!
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
              <CheckCircle className="w-4 h-4 text-[var(--brand-green)]" />
              <span>تم إنشاء تذكرة دعم رقم: #{ticketNumber}</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      {/* Enhanced Brand Story Section at top */}
      <EnhancedBrandStory setCurrentPage={() => {}} />

      {/* Unified Page Header */}
      <PageHeader
        icon={Mail}
        badge="تواصل معنا"
        title="نحن هنا لمساعدتك"
        subtitle="لا تتردد في مراسلتنا بأي استفسار أو اقتراح. فريقنا جاهز لتقديم المساعدة الإنسانية"
      >
        <StatsGrid
          stats={[
            { label: 'متطوع', value: 'متطوعون', icon: Users, color: 'green' },
            { label: 'مشروع', value: 'مشاريع', icon: BarChart3, color: 'gold' },
            { label: 'دولة', value: 'عدة', icon: Globe, color: 'blue' },
            { label: 'مستفيد', value: '50K+', icon: Heart, color: 'purple' },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-6 border border-[var(--border)] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${info.color}15` }}>
                      <Icon className="w-6 h-6" style={{ color: info.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--foreground)] mb-1">{info.title}</h3>
                      {info.details.map((detail, j) => (
                        <p key={j} className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                          {detail}
                        </p>
                      ))}
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
              className="bg-white rounded-3xl p-6 border border-[var(--border)] shadow-lg"
            >
              <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[var(--brand-green)]" />
                تواصل معنا على وسائل التواصل
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all shadow-lg"
                      style={{ backgroundColor: social.color }}
                      title={social.name}
                    >
                      <Icon className="w-5 h-5" />
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
              className="bg-white rounded-3xl p-6 border border-[var(--border)] shadow-lg"
            >
              <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--brand-green)]" />
                الأمان والثقة
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-[var(--brand-green)]" />
                  <span className="text-[var(--muted-foreground)]">موقع آمن بتقنية SSL</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-[var(--brand-gold)]" />
                  <span className="text-[var(--muted-foreground)]">موثوق ومعتمد</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-[var(--muted-foreground)]">خصوصية بيانات محمية</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form - enhanced with better spacing and marketing focus */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[var(--border)] shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200"
                >
                  {error}
                </motion.div>
              )}
              
              {/* Story reminder above form */}
              <div className="mb-6 p-4 bg-[var(--brand-green-pale)] rounded-xl border border-[var(--brand-green)]/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[var(--brand-green)] flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {contactStory}
                    </p>
                    <p className="text-[var(--muted-foreground)] text-sm">
                      نحن هنا لاستقبال اتصالاتك واستفساراتك في أي وقت
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus-ring-[var(--brand-green)]/30 outline-none transition-all"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus-ring-[var(--brand-green)]/30 outline-none transition-all"
                    placeholder="أدخل بريدك"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus-ring-[var(--brand-green)]/30 outline-none transition-all"
                  placeholder="+967"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                  الموضوع *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus-ring-[var(--brand-green)]/30 outline-none transition-all"
                  placeholder="موضوع رسالتك"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                  الرسالة *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus-ring-[var(--brand-green)]/30 outline-none transition-all resize-none"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--brand-green)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--brand-green-light)] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              </button>

              {/* Security Badge */}
              <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--brand-green)]" />
                  <span>🔒 دفع آمن ومشفر بتقنية SSL</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
}