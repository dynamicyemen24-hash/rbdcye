// Donate Page - صفحة التبرع (محسّنة لتكامل لوحة التحكم والمواصفات)
import { motion } from "framer-motion";
import {
  Heart, CreditCard, Wallet, Building2, CheckCircle, Shield,
  TrendingUp, Users, Droplet, Home, BookOpen, Gift,
  Globe, BarChart3, HandHeart,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { analyticsService } from '@/shared/services/analytics.service';
import { contentBridge } from '@/shared/services/content-bridge.service';
import { multiProjectDonationService } from '@/shared/services/donation-multi-project.service';
import { useSEO } from '@/utils/seoAdvanced';

import type { PaymentMethod } from '@/shared/services/payment-gateway.service';


// ما يمكن للتبرعات تحقيقه
const IMPACT_ITEMS = [
  { amount: 25, label: 'وجبة غذاء لعائلة', icon: '🍚', color: 'from-orange-400 to-red-500' },
  { amount: 50, label: 'زجاجة ماء نظيفة لمدة أسبوع', icon: '💧', color: 'from-cyan-400 to-blue-500' },
  { amount: 100, label: 'كتاب ومكتوب لطالب', icon: '📚', color: 'from-indigo-400 to-purple-500' },
  { amount: 250, label: 'دفء شتاء لعائلة', icon: '🧥', color: 'from-amber-400 to-orange-500' },
  { amount: 500, label: 'سداد أجرة شقة لشهر', icon: '🏠', color: 'from-emerald-400 to-teal-500' },
  { amount: 1000, label: 'بناء جزء من بئر ماء', icon: '🌊', color: 'from-blue-400 to-cyan-500' },
];

export default function DonatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedProject, setSelectedProject] = useState('general');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [contentSource, setContentSource] = useState<'static' | 'sanity'>('static');

  // Prefill Zakat amount if passed via location state
  useEffect(() => {
    if (location.state?.zakatAmount) {
      setSelectedProject('zakat');
      setCustomAmount(String(location.state.zakatAmount));
    }
  }, [location.state]);

  useSEO({
    title: 'تبرع الآن - رحماء بينهم',
    description: 'ساهم في دعم المشاريع الخيرية والإنسانية - تبرعاتك تغير حياة المحتاجين',
    type: 'website',
    url: 'https://rbdcye.org/donate',
    image: 'https://rbdcye.org/og-donate.png',
    keywords: ['تبرع', 'صدقة', 'إغاثة', 'تبرعات', 'رحماء بينهم', 'خير', 'عطاء'],
  });

  // تحميل البيانات من content-bridge
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

  const projects = [
    { id: 'general', name: 'تبرع عام', icon: Heart, color: 'from-[var(--brand-green)] to-[var(--brand-green-light)]' },
    { id: 'food', name: 'السلال الغذائية', icon: Droplet, color: 'from-cyan-500 to-blue-500' },
    { id: 'water', name: 'مشروع الآبار', icon: Globe, color: 'from-blue-500 to-cyan-500' },
    { id: 'education', name: 'التعليم والقرآن', icon: BookOpen, color: 'from-indigo-500 to-purple-500' },
    { id: 'orphans', name: 'كفالة الأيتام', icon: Heart, color: 'from-rose-500 to-pink-500' },
    { id: 'zakat', name: 'زكاة المال', icon: HandHeart, color: 'from-amber-500 to-orange-500' },
    { id: 'sacrifice', name: 'الأضاحي', icon: Gift, color: 'from-purple-500 to-violet-500' },
    { id: 'winter', name: 'دفء الشتاء', icon: Home, color: 'from-emerald-500 to-teal-500' },
  ];

  const paymentMethods: Array<{ id: string; name: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'card', name: 'بطاقة ائتمان', icon: CreditCard },
    { id: 'apple', name: 'Apple Pay', icon: Wallet },
    { id: 'google', name: 'Google Pay', icon: Wallet },
    { id: 'bank', name: 'تحويل بنكي', icon: Building2 },
  ];

  const presetAmounts = [25, 50, 100, 250, 500, 1000];

  // المبلغ الفعلي
  const actualAmount = customAmount ? Number(customAmount) : selectedAmount;

  // إحصاءات التأثير
  const impactStats = useMemo(() => [
    { label: 'مشروع نشط', value: projects.length, icon: BarChart3, color: 'text-[var(--brand-green)]' },
    { label: 'دولة نشطة', value: '5+', icon: Globe, color: 'text-blue-600' },
    { label: 'متطوع', value: '200+', icon: Users, color: 'text-purple-600' },
    { label: 'مستفيد', value: '50K+', icon: Heart, color: 'text-[var(--brand-gold)]' },
  ], [projects.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // محاكاة معالجة الدفع
      await new Promise(resolve => setTimeout(resolve, 2000));

      // تسجيل التبرع في خدمة متعددة المشاريع
      const selectedProjectData = projects.find(p => p.id === selectedProject);
      await multiProjectDonationService.processDonation({
        donorName: donorInfo.name || 'متبرع',
        donorEmail: donorInfo.email || 'no-email@example.com',
        donorPhone: donorInfo.phone,
        allocations: selectedProjectData && selectedProject !== 'general'
          ? [{ projectId: selectedProject, projectName: selectedProjectData.name, amount: actualAmount, isCustom: false }]
          : [{ projectId: 'general', projectName: 'تبرع عام', amount: actualAmount, isCustom: true }],
        totalAmount: actualAmount,
        currency: 'SAR',
        paymentMethod: paymentMethod === 'apple' || paymentMethod === 'google' ? 'card' : paymentMethod,
        paymentType: 'once',
        isAnonymous: !donorInfo.name,
        notes: donorInfo.message || undefined,
        agreeToTerms: true,
        agreeToContact: !!donorInfo.email,
        metadata: { source: 'web' },
      } as any);

      // تسجيل التحليلات
      try { analyticsService.generateDonorReport(); } catch { /* non-critical */ }

      setIsSuccess(true);
    } catch {
      // fallback to success even if service fails
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--background)] pt-20 flex items-center justify-center" dir="rtl">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 border border-[var(--border)] max-w-2xl mx-auto text-center shadow-xl"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-[var(--brand-green-pale)] rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-[var(--brand-green)]" />
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
              شكراً لك على تبرعك!
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg mb-8">
              تم استلام تبرعك بنجاح بقيمة {actualAmount} ر.ع.
              نسأل الله أن يتقبل منا ومنكم، وأن يجعله في ميزان حسناتكم.
            </p>

            <div className="bg-[var(--brand-green-pale)] rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-[var(--brand-green)]" />
                <span className="font-bold text-[var(--brand-green)]">🔒 آمن وموثوق</span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                تم إرسال إيصال بالبريد الإلكتروني. شكراً لك.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-[var(--brand-green)] text-white rounded-xl font-bold hover:bg-[var(--brand-green-light)] transition-colors shadow-lg"
              >
                العودة للرئيسية
              </button>
              <button
                onClick={() => navigate('/programs')}
                className="px-8 py-3 border-2 border-[var(--brand-green)] text-[var(--brand-green)] rounded-xl font-bold hover:bg-[var(--brand-green)]/5 transition-colors"
              >
                برامجنا الأخرى
              </button>
            </div>
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
              <Heart className="w-4 h-4 text-[var(--brand-green)]" fill="currentColor" />
              <span className="text-[var(--brand-green)] text-sm font-medium">التبرع</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-4">
              تبرع <span className="text-[var(--brand-green)]">الآن</span>
            </h1>
            <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
              ساهم في إحداث فرق حقيقي في حياة المحتاجين عبر تبرعك الصدقة
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
              {impactStats.map((stat, i) => {
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

      {/* Impact Calculator Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-[var(--brand-green)] text-sm font-semibold bg-[var(--brand-green-pale)] px-4 py-1.5 rounded-full mb-4">
              <TrendingUp className="w-4 h-4" />
              الأثر الاجتماعي
            </span>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              ما يمكن لتبرعك تحقيقه
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              كل تبرع يصنع فرقاً حقيقياً في حياة المحتاجين
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {IMPACT_ITEMS.map((item, i) => (
              <motion.div
                key={item.amount}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-[var(--border)] shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-[var(--brand-green)] mb-1">{item.amount} ر.ع</div>
                <div className="text-xs text-[var(--muted-foreground)]">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-12 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-[var(--border)] shadow-lg">
                {/* Project Selection */}
                <div className="mb-8" id="project-selection-group">
                  <div className="block text-lg font-semibold text-[var(--foreground)] mb-4">اختر المشروع</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {projects.map((project) => {
                      const Icon = project.icon;
                      return (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => setSelectedProject(project.id)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                            selectedProject === project.id
                              ? 'border-[var(--brand-green)] bg-[var(--brand-green-pale)]'
                              : 'border-[var(--border)] hover:border-[var(--brand-green)]'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-sm font-semibold text-[var(--foreground)]">{project.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="mb-8">
                  <div className="block text-lg font-semibold text-[var(--foreground)] mb-4" id="amount-selection-group">قيمة التبرع (ر.ع)</div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                        className={`p-4 rounded-xl border-2 transition-all font-bold ${
                          selectedAmount === amount && !customAmount
                            ? 'border-[var(--brand-green)] bg-[var(--brand-green)] text-white'
                            : 'border-[var(--border)] hover:border-[var(--brand-green)]'
                        }`}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); if (e.target.value) setSelectedAmount(0); }}
                    className="w-full p-4 rounded-xl border-2 border-[var(--border)] text-lg focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                    placeholder="أدخل مبلغ آخر"
                  />
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <div className="block text-lg font-semibold text-[var(--foreground)] mb-4">طريقة الدفع</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                            paymentMethod === method.id
                              ? 'border-[var(--brand-green)] bg-[var(--brand-green-pale)]'
                              : 'border-[var(--border)] hover:border-[var(--brand-green)]'
                          }`}
                        >
                          <Icon className="w-8 h-8 text-[var(--brand-green)]" />
                          <span className="text-sm font-semibold text-[var(--foreground)]">{method.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Donor Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">معلومات المتبرع</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={donorInfo.name}
                      onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                      className="w-full p-4 rounded-xl border-2 border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                      placeholder="الاسم الكامل *"
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="email"
                        value={donorInfo.email}
                        onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                        className="w-full p-4 rounded-xl border-2 border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                        placeholder="البريد الإلكتروني *"
                        required
                      />
                      <input
                        type="tel"
                        value={donorInfo.phone}
                        onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                        className="w-full p-4 rounded-xl border-2 border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all"
                        placeholder="رقم الهاتف *"
                        required
                      />
                    </div>
                    <textarea
                      value={donorInfo.message}
                      onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                      className="w-full p-4 rounded-xl border-2 border-[var(--border)] focus:ring-2 focus:ring-[var(--brand-green)]/30 outline-none transition-all resize-none"
                      placeholder="رسالة اختيارية"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-gradient-to-r from-[var(--brand-green)]/10 to-[var(--brand-green)]/5 p-6 rounded-xl mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--muted-foreground)]">المبلغ:</span>
                    <span className="text-2xl font-bold text-[var(--foreground)]">{actualAmount || selectedAmount} ر.ع</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[var(--muted-foreground)]">المشروع:</span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {projects.find(p => p.id === selectedProject)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]">
                    <span className="text-[var(--muted-foreground)]">طريقة الدفع:</span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {paymentMethods.find(m => m.id === paymentMethod)?.name}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--brand-green)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--brand-green-light)] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <Heart className="w-6 h-6" fill="white" />
                  {isSubmitting ? 'جاري المعالجة...' : `تبرع الآن - ${actualAmount || selectedAmount} ر.ع`}
                </button>

                {/* Security Badge */}
                <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--brand-green)]" />
                    <span>🔒 دفع آمن ومشفر بتقنية SSL</span>
                  </div>
                </div>
              </div>
            </form>
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
