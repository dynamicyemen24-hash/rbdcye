import { Users, Heart, Building2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect, memo } from 'react';

const RECENT_DONATIONS = [
  { name: 'أحمد م.', amount: 5000, time: 'منذ ٣ دقائق', type: 'شهري' },
  { name: 'سارة ع.', amount: 2500, time: 'منذ ٨ دقائق', type: 'مرة واحدة' },
  { name: 'محمد ح.', amount: 10000, time: 'منذ ١٥ دقيقة', type: 'شهري' },
  { name: 'فاطمة ر.', amount: 1000, time: 'منذ ٢٢ دقيقة', type: 'مرة واحدة' },
  { name: 'عبدالله خ.', amount: 25000, time: 'منذ ٣٠ دقيقة', type: 'شهري' },
];

const PARTNERS = [
  'الهلال الأحمر اليمني', 'UNDP', 'WHO', 'WFP', 'UNICEF', 'البنك الدولي'
];

const TESTIMONIALS = [
  { name: 'أم أحمد', text: 'شكراً لحملة رحماء بينهم — حصلنا على سلة غذائية أنقذت أسرتنا هذا الشهر', location: 'تعز' },
  { name: 'خالد.', text: 'بئر المياه الذي حفرتموه خدم قريتنا بأكملها — الله يجزيكم خير', location: 'مأرب' },
  { name: 'نورة.', text: 'كفالة اليتيم غيّرت حياة ابني — أصبح يحصل على تعليم وعلاج', location: 'صنعاء' },
];

export const SocialProofWaterfall = memo(function SocialProofWaterfall() {
  const [currentDonation, setCurrentDonation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDonation(prev => (prev + 1) % RECENT_DONATIONS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const d = RECENT_DONATIONS[currentDonation];

  return (
    <div className="space-y-16 py-16" dir="rtl">
      {/* Section 1: Aggregate Impact */}
      <section className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-[var(--foreground)]">أثرنا بالأرقام</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { icon: Users, value: '١٥,٠٠٠+', label: 'مستفيد مباشر', color: 'text-[var(--brand-green)]' },
              { icon: Heart, value: '٤٥٠', label: 'يتيم مكفول', color: 'text-red-500' },
              { icon: Building2, value: '٨', label: 'آبار مياه', color: 'text-blue-500' },
              { icon: TrendingUp, value: '٨٤٪', label: 'للبرامج المباشرة', color: 'text-amber-500' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <s.icon className={`mx-auto h-8 w-8 ${s.color}`} />
                <div className="mt-3 text-2xl font-bold text-[var(--foreground)]">{s.value}</div>
                <div className="text-sm text-[var(--muted-foreground)]">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 2: Recent Activity */}
      <section className="mx-auto max-w-md">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--brand-green)]" />
            نشاط حي
          </div>
          <motion.div key={currentDonation} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-green)]/10">
              <Heart className="h-5 w-5 text-[var(--brand-green)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[var(--foreground)]">{d.name} تبرع بـ {d.amount.toLocaleString('ar-YE')} ر.ي</p>
              <p className="text-xs text-[var(--muted-foreground)]">{d.time} — {d.type}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Trust Signals */}
      <section className="text-center">
        <h3 className="text-lg font-bold text-[var(--foreground)]">شركاؤنا الموثوقون</h3>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {PARTNERS.map(p => (
            <div key={p} className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Testimonials */}
      <section>
        <h3 className="text-center text-lg font-bold text-[var(--foreground)]">قصص المستفيدين</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-green)]/10 text-sm font-bold text-[var(--brand-green)]">{t.name[0]}</div>
                <div><p className="text-sm font-bold text-[var(--foreground)]">{t.name}</p><p className="text-xs text-[var(--muted-foreground)]">{t.location}</p></div>
              </div>
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 5: Community Size */}
      <section className="rounded-3xl bg-gradient-to-l from-[var(--brand-green)] to-emerald-700 p-8 text-center text-white">
        <Users className="mx-auto h-10 w-10" />
        <h3 className="mt-4 text-2xl font-bold">انضم لأكثر من ١٢,٨٤٧ متبرع شهري</h3>
        <p className="mt-2 text-white/80">معًا نصنع أثراً يدوم في حياة الآلاف</p>
      </section>
    </div>
  );
});
