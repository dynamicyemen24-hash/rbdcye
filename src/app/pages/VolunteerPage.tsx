// Volunteer Page - صفحة التطوع (محسّنة لتكامل لوحة التحكم والمواصفات)
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle, Users, Heart, HandHelping, Globe, Shield, Award, Target } from "lucide-react";
import { useState, useEffect } from "react";

import { contentBridge } from "@/shared/services/content-bridge.service";
import { intakeService } from "@/shared/services/intake.service";
import { useSEO } from "@/utils/seoAdvanced";

// مجالات التطوع حسب الدليل التشغيلي
const VOLUNTEER_FIELDS = [
  { id: 'education', label: 'تعليمي', icon: '📚', description: 'تدريس وتحفيظ' },
  { id: 'health', label: 'صحي', icon: '🏥', description: 'دعم طبي وتمريض' },
  { id: 'relief', label: 'إغاثي', icon: '🚚', description: 'توزيع مواد إغاثية' },
  { id: 'media', label: 'إعلامي', icon: '📱', description: 'تصميم ومونتاج' },
  { id: 'admin', label: 'إداري', icon: '📊', description: 'إدارة وتنسيق' },
  { id: 'tech', label: 'تقني', icon: '💻', description: 'تطوير ودعم تقني' },
  { id: 'logistics', label: 'لوجستي', icon: '📦', description: 'تخزين وتوزيع' },
  { id: 'fundraising', label: 'تأمين موارد', icon: '💰', description: 'جمع تبرعات وشراكات' },
];

const VOLUNTEER_STATS = [
  { label: 'متطوع نشط', value: '200+', icon: Users, color: 'text-[var(--brand-green)]' },
  { label: 'ميدان', value: '8', icon: Globe, color: 'text-blue-600' },
  { label: 'ساعات تطوع', value: '10,000+', icon: Award, color: 'text-purple-600' },
  { label: 'مشروع مدعوم', value: '50+', icon: Target, color: 'text-[var(--brand-gold)]' },
];

export default function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentSource, setContentSource] = useState<'static' | 'sanity'>('static');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    field: '',
    reason: '',
  });

  useSEO({
    title: 'تطوع معنا - رحماء بينهم',
    description: 'انضم إلى فريق متطوعي رحماء بينهم - فرص تطوع في مجالات متعددة',
    keywords: ['تطوع', 'فرص تطوع', 'عمل خيري', 'رحماء بينهم'],
  });

  useEffect(() => {
    let cancelled = false;
    contentBridge.getContent<any>('impact')
      .then((result) => {
        if (!cancelled) {
          setContentSource(result.isDynamic ? 'sanity' : 'static');
        }
      })
      .catch(() => {
        if (!cancelled) setContentSource('static');
      });
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);

    try {
      await intakeService.submitVolunteer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        field: formData.field,
        motivation: formData.reason,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-20" dir="rtl">
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 border border-[var(--border)] max-w-2xl mx-auto shadow-xl"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-[var(--brand-green-pale)] rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-[var(--brand-green)]" />
            </div>
            <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">
              تم استلام طلبك بنجاح!
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg mb-6">
              شكراً لرغبتك في التطوع معنا. سنقوم بمراجعة طلبك والرد عليك قريباً.
            </p>
            <div className="bg-[var(--brand-green-pale)] rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-[var(--brand-green)]" />
                <span className="font-bold text-[var(--brand-green)]">🔒 آمن وموثوق</span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                سيظهر طلبك في لوحة التحكم للمراجعة. سنتواصل معك قريباً عبر البريد الإلكتروني.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="px-8 py-3 bg-[var(--brand-green)] text-white rounded-xl font-bold hover:bg-[var(--brand-green-light)] transition-colors shadow-lg"
            >
              تقديم طلب آخر
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-20" dir="rtl">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[var(--brand-green)]/10 to-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[var(--brand-green)]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[var(--brand-gold)]/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[var(--brand-green)]/20 px-5 py-2 rounded-full mb-6 shadow-lg">
              <HandHelping className="w-4 h-4 text-[var(--brand-green)]" />
              <span className="text-[var(--brand-green)] text-sm font-medium">التطوع</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-4">
              تطوع مع <span className="text-[var(--brand-green)]">رحماء بينهم</span>
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-8">
              انضم إلى فريق متطوعينا وكن جزءاً من التغيير الإيجابي في المجتمع
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {VOLUNTEER_STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--border)]"
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Volunteer Fields */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-semibold bg-[var(--brand-green-pale)] px-4 py-1.5 rounded-full mb-4">
              <Target className="w-4 h-4" />
              مجالات التطوع
            </span>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              اختر مجال التطوع المناسب لك
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              نوفر فرص تطوع متنوعة تناسب مهاراتك واهتماماتك
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {VOLUNTEER_FIELDS.map((field, i) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-[var(--border)] shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{field.icon}</div>
                <h3 className="font-bold text-[var(--foreground)] mb-1">{field.label}</h3>
                <p className="text-xs text-[var(--muted-foreground)]">{field.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 border border-[var(--border)] shadow-lg"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                      placeholder="+967 ..."
                    />
                  </div>
                  <div>
                    <label htmlFor="field" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                      مجال التطوع المفضل
                    </label>
                    <select
                      id="field"
                      name="field"
                      value={formData.field}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                    >
                      <option value="">اختر المجال</option>
                      {VOLUNTEER_FIELDS.map((field) => (
                        <option key={field.id} value={field.id}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                    لماذا ترغب في التطوع معنا؟ *
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    required
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all resize-none"
                    placeholder="اكتب دوافعك للتطوع مع رحماء بينهم..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-[var(--brand-green)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--brand-green-light)] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <HandHelping className="w-5 h-5" />
                      تقديم طلب التطوع
                    </>
                  )}
                </button>

                <div className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--brand-green)]" />
                    <span>🔒 بياناتك محمية وآمنة</span>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Source Indicator (dev only) */}
      {import.meta.env?.DEV && (
        <div className="fixed bottom-4 left-4 z-50 bg-purple-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${contentSource === 'sanity' ? 'bg-green-400' : 'bg-yellow-400'}`} />
            <span>{contentSource === 'sanity' ? 'Sanity CMS' : 'Static Content'}</span>
          </div>
        </div>
      )}
    </div>
  );
}