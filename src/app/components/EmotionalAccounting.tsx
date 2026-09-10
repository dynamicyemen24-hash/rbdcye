import { useState, memo } from 'react';
import { motion } from 'motion/react';
import { Calculator, Heart, Gift } from 'lucide-react';

interface ImpactItem {
  amount: number;
  label: string;
  impact: string;
  icon: string;
}

const IMPACT_ITEMS: ImpactItem[] = [
  { amount: 500, label: '٥٠٠ ر.ي', impact: 'وجبة غذائية لأسرة لمدة أسبوع', icon: '🍲' },
  { amount: 1000, label: '١,٠٠٠ ر.ي', impact: 'سلة غذائية متكاملة لأسرة', icon: '📦' },
  { amount: 2500, label: '٢,٥٠٠ ر.ي', impact: 'كسوة شتوية كاملة لأسرة', icon: '🧥' },
  { amount: 5000, label: '٥,٠٠٠ ر.ي', impact: 'تأمين طبي لمريض لشهر كامل', icon: '🏥' },
  { amount: 10000, label: '١٠,٠٠٠ ر.ي', impact: 'كفالة يتيم لشهر كامل', icon: '👨‍👩‍👧' },
  { amount: 25000, label: '٢٥,٠٠٠ ر.ي', impact: 'حفر بئر مياه نقية', icon: '💧' },
];

export const EmotionalAccounting = memo(function EmotionalAccounting() {
  const [selected, setSelected] = useState(2500);

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8" dir="rtl">
      <div className="text-center">
        <Calculator className="mx-auto h-10 w-10 text-[var(--brand-green)]" />
        <h2 className="mt-4 text-2xl font-bold text-[var(--foreground)]">أثر تبرعك</h2>
        <p className="mt-2 text-[var(--muted-foreground)]">اختر المبلغ واكتشف بالضبط ماذا ستفعل</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {IMPACT_ITEMS.map(item => (
          <button
            key={item.amount}
            onClick={() => setSelected(item.amount)}
            className={`rounded-2xl border-2 p-4 text-center transition-all ${
              selected === item.amount
                ? 'border-[var(--brand-green)] bg-[var(--brand-green)]/10 shadow-lg'
                : 'border-[var(--border)] hover:border-[var(--brand-green)]/30'
            }`}
          >
            <span className="text-3xl">{item.icon}</span>
            <div className="mt-2 text-lg font-bold text-[var(--foreground)]">{item.label}</div>
            <div className="mt-1 text-xs text-[var(--muted-foreground)]">{item.impact}</div>
          </button>
        ))}
      </div>

      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-2xl bg-gradient-to-l from-[var(--brand-green)] to-emerald-700 p-6 text-center text-white"
      >
        <Gift className="mx-auto h-8 w-8" />
        <p className="mt-2 text-lg font-bold">
          بمبلغ {IMPACT_ITEMS.find(i => i.amount === selected)?.label}
        </p>
        <p className="mt-1 text-xl font-bold text-[var(--brand-gold)]">
          {IMPACT_ITEMS.find(i => i.amount === selected)?.impact}
        </p>
        <a href="/donate" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-[var(--brand-green)] transition-all hover:-translate-y-0.5 hover:shadow-lg">
          <Heart className="h-4 w-4" /> تبرع الآن
        </a>
      </motion.div>
    </div>
  );
});
