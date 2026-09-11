// Impact for Business — بوابة الشركات والجهات المانحة والمؤسسات
import {
  Building2, Gem, Star, Crown, Users, Heart, Phone, Mail, MapPin,
  CheckCircle2, TrendingUp, BarChart3, Shield, Handshake, Target,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Briefcase, ArrowLeft, Send, GraduationCap, Leaf, BarChart, RefreshCw,
  Search, Eye, PieChart, UserCheck, type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/app/components/PageHeader';
import { StatsGrid } from '@/app/components/StatsGrid';
import { useSEO } from '@/utils/seoAdvanced';

interface JourneyStep { id: number; title: string; desc: string; icon: LucideIcon; color: string; }

const JOURNEY_STEPS: JourneyStep[] = [
  { id: 1, title: 'اختيار', desc: 'نحدد معاً المشروع أو البرنامج الأنسب لأهدافك وقيم مؤسستك', icon: Search, color: 'var(--brand-green)' },
  { id: 2, title: 'تمويل', desc: 'نُهيّء خطة تمويل مرنة وشفافة تناسب ميزانيتك', icon: Briefcase, color: 'var(--brand-gold)' },
  { id: 3, title: 'تنفيذ', desc: 'فريقنا الميداني ينفّذ المشروع وفق الجدول المتفق عليه', icon: Target, color: 'var(--brand-green)' },
  { id: 4, title: 'متابعة', desc: 'تقارير دورية بالصور والبيانات تُبقيك على اطلاع لحظي', icon: Eye, color: 'var(--brand-gold)' },
  { id: 5, title: 'قياس', desc: 'نقيس الأثر الفعلي على حياة المستفيدين بمؤشرات واضحة', icon: BarChart, color: 'var(--brand-green)' },
  { id: 6, title: 'تقرير', desc: 'تقرير أثر احترافي جاهز للنشر يُعزز صورة مؤسستك', icon: PieChart, color: 'var(--brand-gold)' },
  { id: 7, title: 'تجديد', desc: 'نُراجع الشراكة ونُوسّعها لتحقيق أثر أكبر', icon: RefreshCw, color: 'var(--brand-green)' },
];

interface ProgramType { id: string; title: string; desc: string; icon: LucideIcon; features: string[]; }

const PROGRAM_TYPES: ProgramType[] = [
  { id: 'csr', title: 'برامج المسؤولية الاجتماعية', desc: 'صمّم برنامجاً مجتمعياً يعكس قيم مؤسستك ويُحدث أثراً ملموساً', icon: Leaf, features: ['تصميم برنامج مخصص وفق أهدافك', 'إطار زمني مرن', 'تقرير أثر سنوي', 'تغطية إعلامية مشتركة'] },
  { id: 'full-project', title: 'تمويل مشروع كامل', desc: 'اضطلع بتمويل مشروع تنموي من الألف إلى الياء', icon: Building2, features: ['اسم المشروع باسم مؤسستك', 'لوحة متابعة حية', 'تقرير أثر تفصيلي', 'حفل تسليم وتوثيق'] },
  { id: 'sponsorship', title: 'رعاية برامج', desc: 'ارعى برنامجاً قائماً (تعليم، صحة، مياه)', icon: GraduationCap, features: ['رعاية برنامج تعليمي أو صحي', 'تقارير ربع سنوية', 'شعارك على مواد البرنامج', 'زيارات ميدانية'] },
  { id: 'strategic', title: 'شراكات استراتيجية', desc: 'شراكة طويلة الأمد تُغيّر واقع مجتمعات كاملة', icon: Handshake, features: ['مجلس استشاري مشترك', 'أولوية في الفرص الجديدة', 'حملات مشتركة', 'تقارير أثر استراتيجية'] },
  { id: 'joint', title: 'مشاريع مشتركة', desc: 'نفّذ مشروعاً بالشراكة مع جهات أخرى تحت مظلتنا', icon: Users, features: ['تجميع الموارد', 'إدارة مشتركة', 'تقارير شفافة', 'فعاليات مشتركة'] },
  { id: 'volunteering', title: 'تطوع ومشاركة الموظفين', desc: 'فعّل دور موظفيك عبر فرص تطوع ميدانية ورقمية', icon: UserCheck, features: ['أيام تطوع ميدانية', 'ورش عمل رقمية', 'تحديات تبرع جماعية', 'شهادات تقدير'] },
];

interface Tier { id: string; name: string; price: string; currency: string; icon: LucideIcon; color: string; benefits: string[]; popular?: boolean; }

const PARTNERSHIP_TIERS: Tier[] = [
  { id: 'silver', name: 'شريك فضي', price: '٥٠,٠٠٠', currency: 'ر.ي/سنة', icon: Star, color: 'var(--muted-foreground)', benefits: ['شعار شركتك على موقعنا', 'تقرير سنوي بأثر الشراكة', 'شهادة تقدير رسمية', 'ذكر في النشرات الدورية'] },
  { id: 'gold', name: 'شريك ذهبي', price: '١٠٠,٠٠٠', currency: 'ر.ي/سنة', icon: Crown, color: 'var(--brand-gold)', benefits: ['جميع مزايا الفضي', 'زيارة ميدانية', 'فعالية خاصة', 'تغطية إعلامية', 'تقارير ربع سنوية'], popular: true },
  { id: 'diamond', name: 'شريك ماسي', price: '٢٥٠,٠٠٠+', currency: 'ر.ي/سنة', icon: Gem, color: 'var(--info, #3b82f6)', benefits: ['جميع مزايا الذهبي', 'حملة بالعلامة التجارية', 'مقعد في المجلس الاستشاري', 'أولوية التعاون', 'استشارات متخصصة', 'شعار على جميع المطبوعات'] },
];

const SUCCESS_STORIES = [
  { id: 1, name: 'مجموعة البناء والتنمية', type: 'شريك ماسي', quote: 'الشراكة مع رحماء بينهم أحدثت تحولاً حقيقياً في مجتمعنا', stats: { families: 1200, projects: 8, years: 3 } },
  { id: 2, name: 'شركة التقنية المتقدمة', type: 'شريك ذهبي', quote: 'تعلّمنا أن الأعمال الناجحة تُقاس بأثرها المجتمعي', stats: { families: 800, projects: 3, years: 2 } },
  { id: 3, name: 'مؤسسة التعليم والتنمية', type: 'شريك فضي', quote: 'تمكّنا من الوصول لأكثر من ٥٠٠ طالب في مناطق محتاجة', stats: { families: 500, projects: 2, years: 2 } },
];

export default function ImpactForBusinessPage() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('csr');
  const [formData, setFormData] = useState({ company: '', name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  useSEO({
    title: 'رحماء Impact for Business — بوابة الشركات والجهات المانحة',
    description: 'بوابة متخصصة للشركات والمؤسسات: برامج مسؤولية اجتماعية، تمويل مشاريع كاملة، رعاية برامج، شراكات استراتيجية، تقارير أثر، وتطوع الموظفين.',
  });

  const activeProgram = useMemo(() => PROGRAM_TYPES.find((p) => p.id === activeType) ?? PROGRAM_TYPES[0], [activeType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      <PageHeader
        icon={Building2}
        badge="بوابة الشركات والمؤسسات"
        title="رحماء Impact for Business"
        subtitle="شراكة استراتيجية تُترجم مسؤوليتك المجتمعية إلى أثر حقيقي قابل للقياس — من الاختيار إلى تجديد الشراكة"
      >
        <StatsGrid
          stats={[
            { label: 'شريك مؤسسي', value: 48, icon: Building2, color: 'green' },
            { label: 'مشروع ممول', value: 120, icon: Target, color: 'gold' },
            { label: 'مستفيد', value: '٢٥,٠٠٠+', icon: Users, color: 'blue' },
            { label: 'تقرير أثر', value: 200, icon: BarChart3, color: 'purple' },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      {/* رحلة الشراكة */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">رحلة الشراكة</h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">سبع خطوات واضحة من أول حوار إلى تجديد الشراكة — بشفافية وأثر مُقاس</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {JOURNEY_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: step.id * 0.06 }} className="flex flex-col items-center text-center p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `color-mix(in srgb, ${step.color} 14%, transparent)` }}>
                    <Icon className="w-6 h-6" style={{ color: step.color }} />
                  </div>
                  <span className="text-[0.65rem] font-bold text-[var(--muted-foreground)] mb-1">خطوة {step.id}</span>
                  <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">{step.title}</h3>
                  <p className="text-xs leading-5 text-[var(--muted-foreground)]">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* برامج الشراكة */}
      <section className="py-16 sm:py-20 bg-[var(--card)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">برامج الشراكة</h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">حلول مرنة تناسب كل مؤسسة — من مسؤولية اجتماعية إلى شراكة استراتيجية</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PROGRAM_TYPES.map((p) => (
              <button key={p.id} type="button" onClick={() => setActiveType(p.id)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeType === p.id ? 'bg-[var(--brand-green)] text-white shadow-lg' : 'bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--brand-green)]/10'}`}>
                {p.title}
              </button>
            ))}
          </div>
          <motion.div key={activeType} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `color-mix(in srgb, var(--brand-green) 14%, transparent)` }}>
                  <activeProgram.icon className="w-7 h-7 text-[var(--brand-green)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">{activeProgram.title}</h3>
                <p className="text-[var(--muted-foreground)] leading-7">{activeProgram.desc}</p>
              </div>
              <ul className="space-y-3">
                {activeProgram.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-[var(--brand-green)] mt-0.5" />
                    <span className="text-sm text-[var(--foreground)]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* لوحة مؤشرات الشريك */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">لوحة مؤشرات الشريك</h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">لوحة خاصة تُتابع أثر شراكتك لحظة بلحظة — بشفافية كاملة</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'إجمالي التبرعات', value: '٢,٤٠٠,٠٠٠', change: '+١٢%', icon: TrendingUp, color: 'var(--brand-green)' },
              { label: 'المستفيدون', value: '١,٢٥٠', change: '+٨%', icon: Users, color: 'var(--brand-gold)' },
              { label: 'المشاريع المنفذة', value: '١٤', change: '+٣', icon: Target, color: 'var(--info, #3b82f6)' },
              { label: 'رضا المستفيدين', value: '٩٤%', change: '+٢%', icon: Heart, color: 'var(--destructive, #ef4444)' },
            ].map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                    <span className="text-xs font-bold text-[var(--success)]">{kpi.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{kpi.value}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{kpi.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* شرائح الشراكة */}
      <section className="py-16 sm:py-20 bg-[var(--card)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">شرائح الشراكة</h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">اختر الشريحة الأنسب لمؤسستك — مع مزايا تصاعدية</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {PARTNERSHIP_TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <motion.div key={tier.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`relative rounded-3xl border p-8 ${tier.popular ? 'border-[var(--brand-gold)] shadow-xl ring-2 ring-[var(--brand-gold)]/20' : 'border-[var(--border)]'}`}>
                  {tier.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--brand-gold)] text-white text-xs font-bold">الأكثر طلباً</span>}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${tier.color} 14%, transparent)` }}>
                      <Icon className="w-6 h-6" style={{ color: tier.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--foreground)]">{tier.name}</h3>
                  </div>
                  <p className="text-2xl font-bold text-[var(--foreground)] mb-1">{tier.price}</p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-6">{tier.currency}</p>
                  <ul className="space-y-3">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--brand-green)] mt-0.5" />
                        <span className="text-sm text-[var(--foreground)]">{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* قصص نجاح مؤسسية */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">شركاء يتحدثون عن تجربتهم</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {SUCCESS_STORIES.map((story) => (
              <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--brand-green)]/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[var(--brand-green)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--foreground)]">{story.name}</h3>
                    <span className="text-xs text-[var(--brand-gold)] font-semibold">{story.type}</span>
                  </div>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-7 mb-4">&ldquo;{story.quote}&rdquo;</p>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[var(--border)]">
                  <div className="text-center"><p className="text-lg font-bold text-[var(--brand-green)]">{story.stats.families}</p><p className="text-[0.65rem] text-[var(--muted-foreground)]">أسرة</p></div>
                  <div className="text-center"><p className="text-lg font-bold text-[var(--brand-green)]">{story.stats.projects}</p><p className="text-[0.65rem] text-[var(--muted-foreground)]">مشروع</p></div>
                  <div className="text-center"><p className="text-lg font-bold text-[var(--brand-green)]">{story.stats.years}</p><p className="text-[0.65rem] text-[var(--muted-foreground)]">سنوات</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ نموذج التواصل المؤسسي ═══════ */}
      <section id="corporate-contact" className="py-16 sm:py-20 bg-[var(--card)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-3xl font-bold text-[var(--foreground)] mb-4">ابدأ شراكتك الآن</h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">تواصل مع فريق الشراكات وسنُصمم لك مقترحاً خلال ٤٨ ساعة</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {formStatus === 'success' ? (
                <div className="rounded-3xl border-2 border-[var(--brand-green)] bg-[var(--brand-green)]/5 p-8 text-center">
                  <CheckCircle2 className="w-16 h-16 mx-auto text-[var(--brand-green)] mb-4" />
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">تم استلام طلبك بنجاح</h3>
                  <p className="text-[var(--muted-foreground)]">سنتواصل معك خلال ٤٨ ساعة</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="اسم الشركة / المؤسسة" required className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm" />
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="اسم المسؤول" required className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="البريد الإلكتروني" required className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm" dir="ltr" />
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="رقم الهاتف" className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm" dir="ltr" />
                  <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="ما نوع الشراكة التي تبحث عنها؟" rows={4} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm" />
                  <button type="submit" disabled={formStatus === 'sending'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-green)] py-3 font-bold text-white transition-all hover:shadow-lg disabled:opacity-50">
                    {formStatus === 'sending' ? 'جاري الإرسال...' : <><Send className="w-4 h-4" /> أرسل طلب الشراكة</>}
                  </button>
                </form>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              {[
                { icon: Phone, label: 'الهاتف', value: '+٩٦٧ ٧٧٠ ٠٠٠ ٠٠٠', color: 'var(--brand-green)' },
                { icon: Mail, label: 'البريد الإلكتروني', value: 'corporate@rbdcye.org', color: 'var(--brand-gold)' },
                { icon: MapPin, label: 'الموقع', value: 'صنعاء، الجمهورية اليمنية', color: 'var(--info, #3b82f6)' },
              ].map((item, i) => {
                const ItemIcon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `color-mix(in srgb, ${item.color} 12%, transparent)` }}>
                      <ItemIcon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">{item.label}</p>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[var(--brand-green)] to-emerald-700 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl sm:text-3xl font-bold mb-4">معاً نبني أثراً مستداماً</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">كل شراكة مؤسسية هي خطوة نحو مستقبل أفضل. انضم لشركائنا اليوم.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => document.getElementById('corporate-contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-xl bg-white text-[var(--brand-green)] font-bold text-lg shadow-lg hover:shadow-xl transition-all">ابدأ شراكتك الآن</button>
              <button onClick={() => navigate('/donate')} className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2"><Heart className="w-5 h-5" /> تبرع فردي</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
