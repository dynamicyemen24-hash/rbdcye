// منصة «حملتي» — صناعة الحملات الخيرية الرقمية لصالح مشاريع معتمدة
import { motion } from 'motion/react';
import {
  Rocket, Share2, BarChart3, Users, Heart, Target,
  Link2, PlusCircle, Send, Megaphone, MessageCircle, Globe,
  CheckCircle2, Clock, FileText, Shield,
  Copy, ExternalLink, Zap, BookOpen, Sparkles, type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/app/components/PageHeader';
import { StatsGrid } from '@/app/components/StatsGrid';
import { useSEO } from '@/utils/seoAdvanced';

interface Campaign {
  id: number; creator: string; creatorType: 'individual' | 'institution';
  title: string; slug: string; description: string;
  goal: number; collected: number; donors: number; daysLeft: number;
  project: string; category: string; coverColor: string;
  updates: { date: string; text: string }[];
}

const FEATURED_CAMPAIGNS: Campaign[] = [
  { id: 1, creator: 'أحمد الراشد', creatorType: 'individual', title: 'حملة كسوة الشتاء', slug: 'winter-coat-2026', description: 'توفير ملابس شتوية للأطفال المحتاجين في المناطق الجبلية', goal: 50000, collected: 32000, donors: 187, daysLeft: 12, project: 'كسوة شتوية', category: 'إغاثة', coverColor: 'from-amber-400 to-orange-500', updates: [{ date: '٢٠٢٦-٠٩-٠٥', text: 'تم شراء ٢٠٠ قطعة كسوة وتوزيعها على ٣ قرى في صعدة' }, { date: '٢٠٢٦-٠٨-٢٠', text: 'وصلت الحملة إلى ٦٤٪ من هدفها — شكراً لكل متبرع' }] },
  { id: 2, creator: 'سارة المقطري', creatorType: 'institution', title: 'بئر حياة', slug: 'well-of-life', description: 'حفر بئر مياه ارتوازي لتزويد قرية كاملة بمياه نظيفة', goal: 250000, collected: 180000, donors: 342, daysLeft: 25, project: 'آبار مياه', category: 'مياه', coverColor: 'from-cyan-400 to-blue-500', updates: [{ date: '٢٠٢٦-٠٩-٠١', text: 'بدأ الحفر في موقع البئر بمديرية حجر — عمق ١٢ متراً' }, { date: '٢٠٢٦-٠٨-١٥', text: 'تم اختيار الموقع بالتنسيق مع المجتمع المحلي' }] },
  { id: 3, creator: 'محمد العمري', creatorType: 'individual', title: 'تعليم الأمل', slug: 'education-hope', description: 'توفير الأدوات المدرسية والكتب لطلاب المدارس المحرومة', goal: 30000, collected: 28500, donors: 95, daysLeft: 4, project: 'تعليم', category: 'تعليم', coverColor: 'from-purple-400 to-indigo-500', updates: [{ date: '٢٠٢٦-٠٩-٠٨', text: 'تم توزيع المستلزمات على ١٢٠ طالباً في ٤ مدارس' }] },
];

const PROJECTS_OPTIONS = [
  { id: 'winter', name: 'كسوة شتوية', icon: '🧥', goal: 50000 },
  { id: 'water', name: 'آبار مياه', icon: '💧', goal: 250000 },
  { id: 'education', name: 'تعليم', icon: '📚', goal: 30000 },
  { id: 'food', name: 'سلال غذائية', icon: '🍞', goal: 80000 },
  { id: 'health', name: 'رعاية صحية', icon: '🏥', goal: 120000 },
  { id: 'orphan', name: 'كفالة أيتام', icon: '👨‍👩‍👧', goal: 40000 },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'اختر المشروع', desc: 'اختر من المشاريع المعتمدة التي تريد دعمها', icon: BookOpen, color: 'var(--brand-green)' },
  { step: 2, title: 'حدّد الهدف', desc: 'حدد المبلغ الذي تسعى لجمعه والمدة الزمنية', icon: Target, color: 'var(--brand-gold)' },
  { step: 3, title: 'انشر الحملة', desc: 'استخدم أدوات النشر لمشاركة حملتك مع شبكتك', icon: Share2, color: 'var(--brand-green)' },
  { step: 4, title: 'تابع الأثر', desc: 'حدّث المتابعين بتقرير الإنجاز وصور التقدم', icon: BarChart3, color: 'var(--brand-gold)' },
];

export default function HamleetPage() {
  const navigate = useNavigate();
  const [activeCampaign, setActiveCampaign] = useState(0);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ creator: '', type: 'individual', project: 'winter', goal: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');

  useSEO({
    title: 'حملتي — منصة صناعة الحملات الخيرية الرقمية',
    description: 'أنشئ حملتك الخيرية لصالح مشاريع معتمدة، انشرها، تابع الإنجاز، وقدّم تقرير أثر — بكل شفافية والتزام نظامي.',
  });

  const campaign = FEATURED_CAMPAIGNS[activeCampaign];
  const progress = Math.round((campaign.collected / campaign.goal) * 100);
  const shareUrl = `https://rbdcye.org/campaign/${campaign.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('success');
  };

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      <PageHeader
        icon={Rocket}
        badge="منصة حملات الأفراد والمؤسسات"
        title="حملتي"
        subtitle="صنِع حملتك الخيرية الرقمية لصالح مشاريع معتمدة — من الإنشاء إلى تقرير الأثر"
      >
        <StatsGrid
          stats={[
            { label: 'حملة نشطة', value: 156, icon: Rocket, color: 'green' },
            { label: 'مشروع معتمد', value: 24, icon: CheckCircle2, color: 'gold' },
            { label: 'متبرع عبر الحملات', value: '٨,٤٠٠+', icon: Users, color: 'blue' },
            { label: 'تقرير أثر', value: 320, icon: FileText, color: 'purple' },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      {/* كيف تعمل المنصة */}
      <section className="py-16 sm:py-20 bg-[var(--card)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">كيف تصنع حملتك؟</h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">أربع خطوات من الفكرة إلى الأثر الموثّق</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: item.step * 0.08 }} className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                  <div className="absolute -top-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: item.color }}>{item.step}</div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mt-2" style={{ backgroundColor: `color-mix(in srgb, ${item.color} 14%, transparent)` }}>
                    <Icon className="w-7 h-7" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{item.title}</h3>
                  <p className="text-sm leading-6 text-[var(--muted-foreground)]">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* معاينة صفحة حملة */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">صفحة الحملة</h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">كل حملة تحصل على صفحة مستقلة بهدفها ومؤشر إنجازها وأدوات نشرها</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {FEATURED_CAMPAIGNS.map((c, i) => (
              <button key={c.id} type="button" onClick={() => { setActiveCampaign(i); setCopied(false); }} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCampaign === i ? 'bg-[var(--brand-green)] text-white' : 'bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--brand-green)]/10'}`}>
                {c.title}
              </button>
            ))}
          </div>
          <motion.div key={campaign.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <div className={`h-40 bg-gradient-to-l ${campaign.coverColor} flex items-center justify-center`}>
              <Megaphone className="w-16 h-16 text-white/80" />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-[var(--brand-green)]/10 text-[var(--brand-green)] text-xs font-bold">{campaign.category}</span>
                <span className="px-3 py-1 rounded-full bg-[var(--brand-gold)]/10 text-[var(--brand-gold-dark)] text-xs font-bold">{campaign.creatorType === 'institution' ? 'مؤسسة' : 'فرد'}</span>
                <span className="text-xs text-[var(--muted-foreground)]">بواسطة {campaign.creator}</span>
              </div>
              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{campaign.title}</h3>
              <p className="text-[var(--muted-foreground)] leading-7 mb-6">{campaign.description}</p>
              {/* مؤشر الإنجاز */}
              <div className="rounded-2xl bg-[var(--background)] p-5 mb-6">
                <div className="flex items-end justify-between mb-3">
                  <div><p className="text-sm text-[var(--muted-foreground)]">المجمّع</p><p className="text-3xl font-bold text-[var(--brand-green)]">{campaign.collected.toLocaleString('ar-YE')} ر.ي</p></div>
                  <div className="text-left"><p className="text-sm text-[var(--muted-foreground)]">الهدف</p><p className="text-xl font-bold text-[var(--foreground)]">{campaign.goal.toLocaleString('ar-YE')} ر.ي</p></div>
                </div>
                <div className="h-3 w-full rounded-full bg-[var(--muted)] overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${progress}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-gradient-to-l from-[var(--brand-gold)] to-[var(--brand-gold-light)]" />
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="font-bold text-[var(--brand-green)]">{progress}%</span>
                  <span className="text-[var(--muted-foreground)]">{campaign.donors} متبرع · {campaign.daysLeft} يوم متبقي</span>
                </div>
              </div>
              {/* رابط + نشر */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl bg-[var(--background)] p-4">
                  <p className="text-sm font-bold text-[var(--foreground)] mb-3 flex items-center gap-2"><Link2 className="w-4 h-4 text-[var(--brand-green)]" /> رابط المشاركة</p>
                  <div className="flex items-center gap-2">
                    <input type="text" readOnly value={shareUrl} className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs text-left" dir="ltr" />
                    <button type="button" onClick={handleCopyLink} className="shrink-0 px-3 py-2 rounded-lg bg-[var(--brand-green)] text-white text-xs font-bold flex items-center gap-1">
                      {copied ? <><CheckCircle2 className="w-3.5 h-3.5" /> نُسخ</> : <><Copy className="w-3.5 h-3.5" /> نسخ</>}
                    </button>
                  </div>
                </div>
                <div className="rounded-2xl bg-[var(--background)] p-4">
                  <p className="text-sm font-bold text-[var(--foreground)] mb-3 flex items-center gap-2"><Share2 className="w-4 h-4 text-[var(--brand-green)]" /> أدوات النشر</p>
                  <div className="flex items-center gap-2">
                    {[
                      { icon: MessageCircle, label: 'واتساب', color: '#25D366' },
                      { icon: Globe, label: 'فيسبوك', color: '#1877F2' },
                      { icon: ExternalLink, label: 'تويتر', color: '#1DA1F2' },
                    ].map((s, i) => (
                      <button key={i} type="button" title={`مشاركة عبر ${s.label}`} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-white text-xs font-bold" style={{ backgroundColor: s.color }}>
                        <s.icon className="w-3.5 h-3.5" /> {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* تحديثات */}
              <div className="mb-6">
                <p className="text-sm font-bold text-[var(--foreground)] mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--brand-green)]" /> تحديثات الحملة</p>
                <div className="space-y-3">
                  {campaign.updates.map((u, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-[var(--background)]">
                      <div className="w-2 h-2 rounded-full bg-[var(--brand-green)] mt-2 shrink-0" />
                      <div><p className="text-xs text-[var(--muted-foreground)] mb-1">{u.date}</p><p className="text-sm text-[var(--foreground)]">{u.text}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              {/* تقرير الأثر */}
              <div className="rounded-2xl border border-[var(--brand-green)]/20 bg-[var(--brand-green)]/5 p-5">
                <p className="text-sm font-bold text-[var(--brand-green)] mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> تقرير الأثر</p>
                <p className="text-sm text-[var(--foreground)] leading-7">
                  {campaign.id === 1 && 'تم توزيع ٢٠٠ قطعة كسوة على أطفال ٣ قرى في صعدة. ٩٢٪ من المستفيدين أفادوا بتحسن ملموس في الوقاية من البرد.'}
                  {campaign.id === 2 && 'البئر سيزوّد ١٥٠ أسرة بمياه نظيفة بشكل مستدام. نسبة الإنجاز ٧٢٪ — متوقع الاكتمال خلال ٢٥ يوماً.'}
                  {campaign.id === 3 && '١٢٠ طالباً حصلوا على مستلزمات مدرسية كاملة. ٩٥٪ من الهدف تحقق بفضل ٩٥ متبرعاً.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* أنشئ حملتك */}
      <section id="create-campaign" className="py-16 sm:py-20 bg-[var(--card)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">أنشئ حملتك</h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">اختر مشروعاً معتمداً وابدأ رحلتك في صناعة الأثر</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {formStatus === 'success' ? (
                <div className="rounded-3xl border-2 border-[var(--brand-green)] bg-[var(--brand-green)]/5 p-8 text-center">
                  <CheckCircle2 className="w-16 h-16 mx-auto text-[var(--brand-green)] mb-4" />
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">تم إرسال طلب إنشاء الحملة</h3>
                  <p className="text-[var(--muted-foreground)]">سيُراجع فريقك طلبك ويُوافق عليه خلال ٢٤ ساعة</p>
                </div>
              ) : (
                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <input type="text" value={formData.creator} onChange={(e) => setFormData({ ...formData, creator: e.target.value })} placeholder="اسمك أو ا�م المؤسسة" required className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm" />
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm">
                    <option value="individual">فرد</option>
                    <option value="institution">مؤسسة / شركة</option>
                  </select>
                  <div>
                    <p className="text-sm font-bold text-[var(--foreground)] mb-2">اختر المشروع المعتمد</p>
                    <div className="grid grid-cols-3 gap-2">
                      {PROJECTS_OPTIONS.map((p) => (
                        <button key={p.id} type="button" onClick={() => setFormData({ ...formData, project: p.id })} className={`p-3 rounded-xl border-2 text-center transition-all ${formData.project === p.id ? 'border-[var(--brand-green)] bg-[var(--brand-green)]/10' : 'border-[var(--border)] bg-[var(--background)]'}`}>
                          <span className="text-xl">{p.icon}</span>
                          <p className="text-xs font-bold mt-1">{p.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <input type="number" value={formData.goal} onChange={(e) => setFormData({ ...formData, goal: e.target.value })} placeholder="الهدف المالي (ر.ي)" min={1000} required className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm" dir="ltr" />
                  <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-green)] py-3 font-bold text-white transition-all hover:shadow-lg">
                    <PlusCircle className="w-4 h-4" /> أنشئ الحملة
                  </button>
                </form>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
              <div className="rounded-2xl bg-[var(--background)] p-5">
                <p className="text-sm font-bold text-[var(--foreground)] mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-[var(--brand-gold)]" /> مميزات المنصة</p>
                <ul className="space-y-2">
                  {['صفحة حملة مستقلة باسمك', 'مؤشر إنجاز حي يحدث تلقائياً', 'رابط مشاركة فريد + أدوات نشر', 'تحديثات دورية للمتبرعين', 'تقرير أثر احترافي عند الإغلاق', 'لوحة متابعة شخصية'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[var(--foreground)]"><CheckCircle2 className="w-4 h-4 shrink-0 text-[var(--brand-green)]" />{f}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--brand-gold)]/20 bg-[var(--brand-gold)]/5 p-5">
                <p className="text-sm font-bold text-[var(--brand-gold-dark)] mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> الإطار النظامي</p>
                <p className="text-xs leading-6 text-[var(--muted-foreground)]">تخضع جميع آليات جمع التبرعات وتسويقها للمتطلبات النظامية والتراخيص ذات العلاقة في الدول المستهدفة. الحملات تُراجع وتُعتمد من الفريق المختص قبل النشر.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[var(--brand-green-dark)] to-[var(--brand-green)] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-[var(--brand-gold-light)]" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">هل أنت مستعد لصنع الأثر؟</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">كل حملة تبدأ بقرار واحد — قرّر اليوم وابدأ رحلتك</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => document.getElementById('create-campaign')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-[var(--brand-green)] shadow-2xl transition-all"><Rocket className="w-5 h-5" /> ابدأ حملتك</button>
              <button onClick={() => navigate('/donate')} className="flex items-center gap-2 rounded-xl border-2 border-white/40 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"><Heart className="w-5 h-5" /> تبرع الآن</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
