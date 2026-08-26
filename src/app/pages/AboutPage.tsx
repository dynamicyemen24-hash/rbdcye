// About Page - من نحن - الهوية الموحدة
import { motion } from 'motion/react';
import { 
  Users, Award, Globe, Heart, Target, BookOpen, HandHeart, 
  Star, Shield, Sparkles, Quote, Compass,
  TrendingUp, Clock, BadgeCheck,
  Mail, Phone, Facebook, Twitter, Instagram, Youtube,
  Calendar, CheckCircle2,
  GitCommit, Gem, Crown, Layers
} from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/app/components/PageHeader';
import { StatsGrid } from '@/app/components/StatsGrid';
import { useSEO } from '@/utils/seoAdvanced';

export default function AboutPage() {
  useSEO({
    title: 'من نحن - رحماء بينهم',
    description: 'تعرف على حملة رحماء بينهم الخيرية وإنجازاتها منذ 2014',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const aboutText = "حملة \"رحماء بينهم\" الخيرية؛ حملة دعوية، إنسانية، وتنموية انطلقت عام 2014م استجابةً للأزمة اليمنية ومعاناة المواطن الإنسانية. ومنذ انطلاقها، تسعى الحملة – بدعم أهل الخير – إلى صون حياة الإنسان وإغاثته عبر برامج علمية وإغاثية متنوعة، مستهدفةً المحافظات والمناطق اليمنية الأشد تضرراً ومأساة، انطلقاً من واجبها الشرعي والإنساني.";

  const supervisorMessage = `إنه لمن دواعي سرورنا اليوم وبعد ما يقارب عشرة أعوام من العطاء المستمر والجهود الدؤوبة، وبما يتوافق مع رؤيتنا وأهدافنا، يطيب لنا أن نقف شاكرين لله تعالى، وممتنين لكل صاحب يد سخية وجهد مبارك رسمنا سويا بصمات شريفة وأثرا حميدا، مما جعل حملة رحماء بينهم تحقق نجاحات مبهرة في مجالات متنوعة على مساحات واسعة، عبر ما يزيد عقد من الزمن.\n\nفشكرًا لكل داعمٍ ومحسن، وشكرًا لكل عاملٍ وداعية، وشكرًا لكل من جعل العطاء هويته ورسالة حياته.`;

  const partnersText = `"إلى أولئك الأخفياء الأتقياء الأصفياء، والذين ما كان لنا أن نحقق شيئاً من مشاريعنا، مؤمنين أن ما تعلّم متعلّم ولا حفظ حافظ ولا طعِم جائع ولا ارتوى ظامئ ولا اكتسى عارٍ ولا ارتسمت على محيّا حزين بسمة وكُفّت عنه دمعة إلا بفضل الله ثم بفضل الراغبين فيما عند الكريم، مَن يرون أن إصلاح المسلمين والإحسان إليهم مطلباً ربانياً ومسؤولية مجتمعية واجباً قيمياً وأخلاقياً."`;

  const handleSocialClick = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: 'https://facebook.com/rbdcye',
      twitter: 'https://twitter.com/rbdcye',
      instagram: 'https://instagram.com/rbdcye',
      youtube: 'https://youtube.com/@rbdcye',
    };
    window.open(urls[platform] || '/contact', '_blank');
  };

  const handleQuickLink = (href: string) => {
    navigate('/' + href);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--background)]" dir="rtl">
      
      {/* Unified Page Header */}
      <PageHeader
        icon={Heart}
        badge="رحماء بينهم"
        title="من نحن"
        subtitle="حملة رحماء بينهم الخيرية - تضامن إنساني وتنموي متكامل منذ 2014م"
        align="right"
      >
        <StatsGrid
          stats={[
            { label: 'سنوات العطاء', value: 'عشرات', icon: Clock, color: 'green' },
            { label: 'مشروع منفذ', value: 'مشاريع', icon: Target, color: 'gold' },
            { label: 'مستفيد', value: '50K+', icon: Users, color: 'blue' },
            { label: 'متطوع', value: 'متطوعون', icon: HandHeart, color: 'purple' },
          ]}
          columns={4}
          variant="glass"
        />
      </PageHeader>

      {/* ============================================ */}
      {/* تعريف بالحمعرة */}
      {/* ============================================ */}
      <section id="definition" className="section bg-white">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(26,92,72,0.3), transparent)' }} />
        
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="section-header"
            >
              <span className="badge badge--green">
                <Gem className="w-4 h-4" />
                نبذة عنا
              </span>
              <h2>
                تعريف <span className="highlight">بالحملة</span>
              </h2>
              <div className="divider" />
            </motion.div>

             <div className="relative">
                <div className="absolute -inset-4 rounded-3xl blur-2xl" style={{ background: 'linear-gradient(135deg, rgba(26,92,72,0.05), transparent, rgba(26,92,72,0.05))' }} />
                
                <motion.div 
                  className="card card--xl relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ boxShadow: '0 25px 50px -12px rgba(26, 92, 72, 0.25)' }}
                >
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'rgba(26,92,72,0.05)' }} />
                  <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/2 -translate-x-1/2" style={{ background: 'rgba(26,92,72,0.05)' }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full" style={{ background: 'rgba(26,92,72,0.02)' }} />

                  <div className="relative z-10">
                    <Quote className="w-12 h-12 mb-6" style={{ color: 'rgba(26,92,72,0.2)' }} />
                    
                    <p className="text-xl md:text-2xl leading-[1.8] font-light" style={{ color: 'var(--foreground)' }}>
                      {aboutText}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                      {[
                        { icon: Calendar, label: 'انطلقت 2014م' },
                        { icon: Target, label: 'برامج متنوعة' },
                        { icon: Globe, label: 'تغطية واسعة' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          <item.icon className="w-4 h-4" style={{ color: 'var(--brand-green)' }} />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* كلمة المشرف العام */}
        {/* ============================================ */}
        <section id="supervisor" className="section-secondary relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,92,72,0.05), rgba(26,92,72,0.1), rgba(26,92,72,0.05))' }} />
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
              style={{ background: 'rgba(26,92,72,0.05)' }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 30, repeat: -1 }}
            />
          </div>

          <div className="section-container relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="section-header"
              >
                <span className="badge badge--gold">
                  <Crown className="w-4 h-4" />
                  كلمة القيادة
                </span>
                <h2>
                  كلمة <span className="highlight-gold">المشرف العام</span>
                </h2>
                <div className="divider" />
              </motion.div>

              <motion.div 
                className="card card--xl relative overflow-hidden"
                style={{ borderRight: '8px solid var(--brand-green)' }}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ boxShadow: '0 30px 60px -20px rgba(26, 92, 72, 0.3)' }}
              >
                {/* Decorative bg */}
                <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full" style={{ background: 'rgba(26,92,72,0.05)' }} />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full" style={{ background: 'rgba(26,92,72,0.05)' }} />
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-6"
                  >
                    <Quote className="w-12 h-12" style={{ color: 'rgba(26,92,72,0.2)' }} />
                    <div className="w-16 h-1 mt-2 rounded-full" style={{ background: 'rgba(26,92,72,0.3)' }} />
                  </motion.div>
                   
                   {supervisorMessage.split('\n\n').map((paragraph, index) => (
                     <motion.p 
                       key={`paragraph-${index}`} 
                      className={`text-xl md:text-2xl leading-[1.8] font-light ${index > 0 ? 'mt-6' : ''}`}
                      style={{ color: 'var(--foreground)' }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                   
                  <motion.div 
                    className="mt-8 pt-6 flex flex-wrap items-center gap-6"
                    style={{ borderTop: '1px solid var(--border)' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="icon-box icon-box--green w-16 h-16 rounded-full">
                        <Users className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-bold text-xl" style={{ color: 'var(--foreground)' }}>المشرف العام</p>
                        <p style={{ color: 'var(--muted-foreground)' }}>حملة رحماء بينهم</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--brand-green)' }}>
                      <BadgeCheck className="w-5 h-5" />
                      <span>عقد من العطاء</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* الهوية التنموية */}
        {/* ============================================ */}
        <section id="identity" className="section bg-white">
          <div className="section-container">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="section-header"
              >
                <span className="badge badge--green">
                  <Layers className="w-4 h-4" />
                  هوية
                </span>
                <h2>
                  هويتنا <span className="highlight">التنموية</span>
                </h2>
                <div className="divider" />
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* الرؤية */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="card card--xl hover-lift relative overflow-hidden group"
                  whileHover={{ y: -8 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, transparent, rgba(26,92,72,0.05), transparent)' }} />
                  <div className="relative z-10">
                    <div className="icon-box icon-box--green w-20 h-20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg" style={{ boxShadow: '0 0 20px rgba(26,92,72,0.2)' }}>
                      <Globe className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>رؤيتنا</h3>
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      الريادة والشمولية في المجال الدعوي والإنساني والتنموي.
                    </p>
                  </div>
                </motion.div>

                {/* الرسالة */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="card card--xl hover-lift relative overflow-hidden group"
                  whileHover={{ y: -8 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, transparent, rgba(26,92,72,0.05), transparent)' }} />
                  <div className="relative z-10">
                    <div className="icon-box icon-box--green w-20 h-20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg" style={{ boxShadow: '0 0 20px rgba(26,92,72,0.2)' }}>
                      <Heart className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>رسالتنا</h3>
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      الإسهام في إصلاح المجتمع روحاً وسلوكاً، ومد يد العون لتوفير حياة كريمة يعيشها، 
                      بالشراكة مع المهتمين والخيرين في الداخل والخارج.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* القيم */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-16"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="icon-box icon-box--green w-14 h-14 rounded-xl">
                    <Award className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>قيمنا الناظمة</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { icon: Star, label: 'الإخلاص', color: '#F59E0B', desc: 'نية صادقة' },
                    { icon: Shield, label: 'الشفافية', color: '#3B82F6', desc: 'وضوح تام' },
                    { icon: Award, label: 'الإتقان', color: 'var(--brand-green)', desc: 'إتقان العمل' },
                    { icon: Users, label: 'المسؤولية', color: '#8B5CF6', desc: 'تحمل المسؤولية' },
                    { icon: Sparkles, label: 'المبادرة', color: '#F97316', desc: 'روح المبادرة' },
                  ].map((value) => (
                    <motion.div
                      key={value.label}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="stat-card group cursor-pointer"
                    >
                      <div 
                        className="icon-box w-14 h-14 rounded-full mx-auto mb-3 group-hover:scale-110 transition-all duration-300"
                        style={{ backgroundColor: `${value.color}15`, color: value.color }}
                      >
                        <value.icon className="w-7 h-7" />
                      </div>
                      <p className="font-bold" style={{ color: 'var(--foreground)' }}>{value.label}</p>
                      <p className="stat-label mt-1">{value.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* أهدافنا */}
        {/* ============================================ */}
        <section id="goals" className="section-secondary relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,92,72,0.05), rgba(26,92,72,0.1), rgba(26,92,72,0.05))' }} />
          
          <div className="section-container relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="section-header"
              >
                <span className="badge badge--green">
                  <Target className="w-4 h-4" />
                  طموحاتنا
                </span>
                <h2>
                  أهدافنا <span className="highlight">وطموحاتنا</span>
                </h2>
                <div className="divider" />
              </motion.div>

              <div className="space-y-4">
                {[
                  'تحقيق مبدأ التعاون على البر والتقوى، وخلق روح التكافل بين أفراد الأمة المسلمة',
                  'إحياء دور المسجد في التربية والإصلاح، وإبرار رسالة العلم، والمحافظة على أوقات المسلم',
                  'الإسهام في توفير حياة كريمة لشريحة المستفيدين وصيانتهم من مذلة السؤال',
                  'تحقيق الاكتفاء التنموي الذاتي لضمان بقاء المشاريع وديمومة أدائها',
                 ].map((goal, index) => (
                   <motion.div
                     key={`goal-${index}`}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card hover-lift flex items-start gap-6 cursor-pointer group"
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{ background: 'var(--brand-green)', color: 'white', boxShadow: '0 0 20px rgba(26,92,72,0.2)' }}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg leading-relaxed" style={{ color: 'var(--foreground)' }}>{goal}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-16 h-0.5 rounded-full" style={{ background: 'rgba(26,92,72,0.3)' }} />
                        <span className="text-xs" style={{ color: 'var(--brand-green)' }}>هدف استراتيجي</span>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 transition-colors" style={{ color: 'rgba(26,92,72,0.3)' }} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* الفئات المستهدفة */}
        {/* ============================================ */}
        <section id="beneficiaries" className="section bg-white">
          <div className="section-container">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="section-header"
              >
                <span className="badge badge--green">
                  <Users className="w-4 h-4" />
                  من نستهدف
                </span>
                <h2>
                  الفئات <span className="highlight">المستهدفة</span>
                </h2>
                <div className="divider" />
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Heart, title: 'الأيتام والأرامل والأسر المتعففة', desc: 'مستفيدو الكفالات المادية، الكسوة، وتفريج كرب الغارمين', color: '#F43F5E', count: 'آلاف' },
                  { icon: HandHeart, title: 'المحتاجون والنازحون', desc: 'مستفيدو السلال الغذائية، المطابخ الخيرية، واللحوم وتفطير الصائمين', color: '#F59E0B', count: 'عشرات آلاف' },
                  { icon: BookOpen, title: 'طلاب وحفظة القرآن والمعلمون', desc: 'مستفيدو كفالات الحلقات، طباعة المصاحف والكتب العلمية', color: '#3B82F6', count: 'آلاف' },
                  { icon: Compass, title: 'سكان المناطق النائية والجافة', desc: 'مستفيدو حفر الآبار، شبكات السقيا، وبناء المساجد ودور القرآن', color: 'var(--brand-green)', count: 'آلاف' },
                  { icon: TrendingUp, title: 'الأسر الباحثة عن الدخل', desc: 'مستفيدو تمليك الأدوات الإنتاجية للتحوؤل إلى أسر منتجة', color: '#8B5CF6', count: 'مئات' },
                 ].map((group, index) => (
                    <motion.div
                      key={group.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="card hover-lift relative overflow-hidden group cursor-pointer"
                      whileHover={{ y: -6, scale: 1.01 }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: `${group.color}08` }} />
                      <div className="relative z-10 flex items-start gap-5">
                        <div className="icon-box w-16 h-16 rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${group.color}15`, color: group.color }}>
                          <group.icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>{group.title}</h3>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${group.color}15`, color: group.color }}>
                              {group.count}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{group.desc}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: `${group.color}20` }} />
                            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>فئة مستهدفة</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* شركاء النجاح */}
        {/* ============================================ */}
        <section id="partners" className="section-secondary relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,92,72,0.05), rgba(26,92,72,0.1), rgba(26,92,72,0.05))' }} />
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
              style={{ background: 'rgba(26,92,72,0.05)' }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 15, repeat: Infinity }}
            />
          </div>

          <div className="section-container relative z-10">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <motion.div 
                  className="icon-box icon-box--green w-24 h-24 rounded-full mx-auto mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                >
                  <Users className="w-12 h-12" />
                </motion.div>
                
                <span className="badge badge--gold">
                  <GitCommit className="w-4 h-4" />
                  شراكات مستدامة
                </span>

                <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                  شركاء <span className="text-[var(--brand-green)]">النجاح</span>
                </h2>
                
                <div className="gradient-divider mx-auto mb-8" />

                <motion.div 
                  className="card card--xl relative overflow-hidden"
                  whileHover={{ boxShadow: '0 30px 60px -20px rgba(26, 92, 72, 0.25)' }}
                >
                  {/* Decorative bg */}
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'rgba(26,92,72,0.05)' }} />
                  <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/2" style={{ background: 'rgba(26,92,72,0.05)' }} />
                   
                  <div className="relative z-10">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <Quote className="w-14 h-14 mx-auto mb-6" style={{ color: 'rgba(26,92,72,0.1)' }} />
                    </motion.div>
                    
                    <p className="text-xl md:text-2xl leading-[1.8] font-light" style={{ color: 'var(--foreground)' }}>
                      {partnersText}
                    </p>

                    <motion.div 
                      className="mt-8 pt-6 flex flex-wrap justify-center gap-8"
                      style={{ borderTop: '1px solid var(--border)' }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      {[
                        { icon: Heart, label: 'شركاء النجاح' },
                        { icon: Star, label: 'داعمون أوفياء' },
                        { icon: Target, label: 'صناع الأثر' },
                       ].map((item) => (
                         <div key={item.label} className="flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
                          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-green)' }} />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* Footer */}
        {/* ============================================ */}
        <footer className="relative overflow-hidden" style={{ background: 'var(--foreground)', color: 'white' }}>
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(26,92,72,0.1)' }} />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(26,92,72,0.1)' }} />
          </div>

          <div className="relative z-10 section-container py-16">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 text-center md:text-right">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    <Heart className="w-6 h-6" style={{ color: 'var(--brand-green)' }} />
                    <span className="font-bold text-lg">رحماء بينهم</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    حملة خيرية دعوية إنسانية تنموية
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">روابط سريعة</h4>
                  <ul className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <li><button onClick={() => handleQuickLink('about')} className="hover:text-[var(--brand-green)] transition-colors">من نحن</button></li>
                    <li><button onClick={() => handleQuickLink('programs')} className="hover:text-[var(--brand-green)] transition-colors">برامجنا</button></li>
                    <li><button onClick={() => handleQuickLink('contact')} className="hover:text-[var(--brand-green)] transition-colors">تواصل معنا</button></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">تواصل</h4>
                  <ul className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <li className="flex items-center justify-center md:justify-start gap-2">
                      <Phone className="w-4 h-4" /> +967 780 777 007
                    </li>
                    <li className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="w-4 h-4" /> info@rbdcye.org
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">تابعنا</h4>
                  <div className="flex justify-center md:justify-start gap-3">
                    {[
                      { Icon: Facebook, platform: 'facebook' },
                      { Icon: Twitter, platform: 'twitter' },
                      { Icon: Instagram, platform: 'instagram' },
                      { Icon: Youtube, platform: 'youtube' }
                     ].map(({ Icon, platform }) => (
                       <motion.button
                         key={platform}
                        onClick={() => handleSocialClick(platform)}
                        whileHover={{ y: -3 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--brand-green)]"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                <p>{new Date().getFullYear()} © جميع الحقوق محفوظة - حملة رحماء بينهم الخيرية</p>
                <p className="mt-1 text-xs">رحماء بينهم - تضامن إنساني وتنموي متكامل منذ 2014</p>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}