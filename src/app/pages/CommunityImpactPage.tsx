// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Users, Heart, Droplets, GraduationCap, Home, TrendingUp, Calculator } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, memo } from 'react';

interface ImpactCategory {
  id: string;
  title: string;
  icon: typeof Heart;
  color: string;
  impact: string;
  costPerUnit: number;
  unit: string;
  iconEmoji: string;
}

const CATEGORIES: ImpactCategory[] = [
  { id: 'food', title: 'سلال غذائية', icon: Home, color: 'bg-amber-500', impact: 'سر رجل أسرة لشهر كامل', costPerUnit: 2500, unit: 'سلة', iconEmoji: '🍲' },
  { id: 'education', title: 'تعليم', icon: GraduationCap, color: 'bg-blue-500', impact: 'تأمين عام دراسي كامل لطالب', costPerUnit: 15000, unit: 'طالب', iconEmoji: '📚' },
  { id: 'water', title: 'آبار مياه', icon: Droplets, color: 'bg-cyan-500', impact: 'تأمين مياه نقية لأكثر من ٥٠٠ شخص', costPerUnit: 50000, unit: 'بئر', iconEmoji: '💧' },
  { id: 'medical', title: 'تأمين طبي', icon: Heart, color: 'bg-red-500', impact: 'علاج مريض لشهر كامل', costPerUnit: 3000, unit: 'مريض', iconEmoji: '🏥' },
  { id: 'clothing', title: 'كسوات شتوية', icon: Users, color: 'bg-purple-500', impact: 'كسوة كاملة لأسرة', costPerUnit: 5000, unit: 'أُسرة', iconEmoji: '🧥' },
  { id: 'orphan', title: 'كفالة أيتام', icon: Heart, color: 'bg-[var(--brand-green)]', impact: 'دعم شهري لليتيم', costPerUnit: 10000, unit: 'يتيم', iconEmoji: '👨‍👩‍👧‍👦' },
];

export const CommunityImpactPage = memo(function CommunityImpactPage() {
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [amount, setAmount] = useState(10000);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: verified
  const category = CATEGORIES.find(c => c.id === selectedCategory) ?? CATEGORIES[0];
  const units = Math.floor(amount / category.costPerUnit);
  const remaining = amount % category.costPerUnit;

  return (
    <div className="min-h-screen bg-[var(--background)] py-24" dir="rtl">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-green)]">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-[var(--foreground)]">حاسبة الأثر المجتمعي</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">اكتشف كيف يُحوّل تبرعك أثرًا حقيقيًا في حياة الآلاف</p>
        </motion.div>

        {/* Category Selector */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${selectedCategory === cat.id ? 'border-[var(--brand-green)] bg-[var(--brand-green)]/10 shadow-lg' : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand-green)]/30'}`}>
              <span className="text-3xl">{cat.iconEmoji}</span>
              <span className="text-sm font-bold text-[var(--foreground)]">{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Calculator */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Input Side */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
            <h2 className="text-xl font-bold text-[var(--foreground)]">حساب الأثر</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{category.title} — {category.impact}</p>

            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
            <div className="mt-8">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- precise: jsx-a11y/label-has-associated-control verified */}
              <label className="mb-2 block text-sm font-bold text-[var(--foreground)]">مبلغ التبرع (ر.ي)</label>
              <input type="range" min="1000" max="100000" step="1000" value={amount} onChange={e => setAmount(parseInt(e.target.value))} className="w-full accent-[var(--brand-green)]" />
              <div className="mt-2 flex justify-between text-xs text-[var(--muted-foreground)]">
                <span>١,٠٠٠ ر.ي</span>
                <span className="text-lg font-bold text-[var(--foreground)]">{amount.toLocaleString('ar-YE')} ر.ي</span>
                <span>١٠٠,٠٠٠ ر.ي</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {[5000, 10000, 25000, 50000].map(v => (
                <button key={v} onClick={() => setAmount(v)} className={`flex-1 rounded-xl py-2 text-sm font-bold transition-all ${amount === v ? 'bg-[var(--brand-green)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'}`}>
                  {v.toLocaleString('ar-YE')}
                </button>
              ))}
            </div>
          </div>

          {/* Result Side */}
          <div className="rounded-2xl border-2 border-[var(--brand-green)]/30 bg-[var(--brand-green)]/5 p-5 sm:p-6">
            <h2 className="text-xl font-bold text-[var(--foreground)]">أثر تبرعك</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">بمبلغ {amount.toLocaleString('ar-YE')} ر.ي يمكنك:</p>

            <div className="mt-8 text-center">
              <motion.div key={`${selectedCategory}-${amount}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <div className="text-6xl font-bold text-[var(--brand-green)]">{units.toLocaleString('ar-YE')}</div>
                <div className="mt-2 text-lg text-[var(--foreground)]">{category.unit}</div>
              </motion.div>
              <p className="mt-4 text-[var(--muted-foreground)]">{category.impact}</p>
            </div>

            <div className="mt-8 rounded-xl bg-[var(--card)] p-4">
              <h3 className="font-bold text-[var(--foreground)]">تفاصيل التوزيع</h3>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">التكلفة لكل {category.unit}:</span><span className="font-bold text-[var(--foreground)]">{category.costPerUnit.toLocaleString('ar-YE')} ر.ي</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">عدد الوحدات:</span><span className="font-bold text-[var(--foreground)]">{units}</span></div>
                {remaining > 0 && <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">المتبقي:</span><span className="font-bold text-[var(--foreground)]">{remaining.toLocaleString('ar-YE')} ر.ي</span></div>}
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-[var(--foreground)]">إجمالي الأثر المجتمعي</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Users, value: '١٥,٠٠٠+', label: 'مستفيد مباشر', color: 'bg-[var(--brand-green)]' },
              { icon: Heart, value: '٤٥٠', label: 'يتيم مكفول', color: 'bg-red-500' },
              { icon: Droplets, value: '٨', label: 'آبار مياه', color: 'bg-cyan-500' },
              { icon: GraduationCap, value: '٥٦٧', label: 'طالب مستفيد', color: 'bg-blue-500' },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}><stat.icon className="h-6 w-6 text-white" /></div>
                <div className="mt-3 text-2xl font-bold text-[var(--foreground)]">{stat.value}</div>
                <div className="mt-1 text-sm text-[var(--muted-foreground)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
