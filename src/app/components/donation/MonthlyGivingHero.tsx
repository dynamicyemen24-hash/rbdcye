import { Repeat, Heart, Star, Crown, Shield, Check, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';

const TIERS = [
  { id: 'rufaqa', label: 'رفيق الخير', amount: 2500, icon: Heart, color: 'bg-emerald-500', benefits: ['إشعار شهري بالأثر', 'اسمك في صفحة الشاكرين'] },
  { id: 'hurss', label: 'حارس الأيتام', amount: 5000, icon: Shield, color: 'bg-blue-500', benefits: ['كل ما سبق', 'تقرير أثر شخصي شهري', 'دعوة للفعاليات الخاصة'] },
  { id: 'batal', label: 'بطل التنمية', amount: 10000, icon: Star, color: 'bg-amber-500', benefits: ['كل ما سبق', 'زيارة ميدانية للمشاريع', 'شهادة تقدير رسمية'] },
  { id: 'raiy', label: 'شريك الرؤية', amount: 25000, icon: Crown, color: 'bg-purple-500', benefits: ['كل ما سبق', 'تغطية مشاريع باسمك', 'عضو في اللوحة الاستشارية'] },
];

export const MonthlyGivingHero = memo(function MonthlyGivingHero() {
  const [selected, setSelected] = useState('hurss');
  const navigate = useNavigate();
  const selectedTier = TIERS.find(t => t.id === selected);

  const startMonthly = () => {
    if (!selectedTier) return;
    navigate(`/donate?amount=${selectedTier.amount}&recurring=monthly`);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[var(--brand-green)] to-emerald-800 p-8 text-white" dir="rtl">
      <div className="text-center">
        <Repeat className="mx-auto h-12 w-12 text-[var(--brand-gold)]" />
        <h2 className="mt-4 text-3xl font-bold">برنامج الرفيق الشهري</h2>
        <p className="mt-2 text-white/80">انضم لعائلة الدعم المستمر — أثرك لا يتوقف</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map(tier => (
          <motion.button key={tier.id} whileHover={{ scale: 1.03 }} onClick={() => setSelected(tier.id)} className={`rounded-2xl p-5 text-center transition-all ${selected === tier.id ? 'bg-white text-[var(--foreground)] shadow-2xl' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${tier.color}`}><tier.icon className="h-5 w-5 text-white" /></div>
            <h3 className={`mt-3 text-sm font-bold ${selected === tier.id ? 'text-[var(--foreground)]' : 'text-white'}`}>{tier.label}</h3>
            <div className={`mt-2 text-2xl font-bold ${selected === tier.id ? 'text-[var(--brand-green)]' : 'text-[var(--brand-gold)]'}`}>{tier.amount.toLocaleString('ar-YE')}</div>
            <div className="text-xs opacity-70">ر.ي/شهريًا</div>
            <ul className="mt-3 space-y-1 text-xs text-right">
              {tier.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-1"><Check className="mt-0.5 h-3 w-3 shrink-0 text-[var(--brand-green)]" /><span>{b}</span></li>
              ))}
            </ul>
          </motion.button>
        ))}
      </div>

      {selectedTier && (
        <div className="mt-6 text-center">
          <p className="text-sm text-white/60">
            {selectedTier.amount.toLocaleString('ar-YE')} ر.ي/شهر = {(selectedTier.amount * 12).toLocaleString('ar-YE')} ر.ي سنويًا
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={startMonthly}
              className="flex items-center gap-2 rounded-xl bg-[var(--brand-gold)] px-7 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              <Heart className="h-5 w-5" fill="currentColor" />
              ابدأ عطاءك الشهري
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/donate')}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-bold text-white transition-all hover:bg-white/20"
            >
              صفحة التبرع الكاملة
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
