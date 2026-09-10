import { memo } from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from './ui/SectionHeader';
import { AnimatedCounter } from './AnimatedCounter';

const NUMBERS = [
  { value: 15000, suffix: '+', label: 'مستفيد مباشر', color: 'text-[var(--brand-green)]' },
  { value: 450, suffix: '', label: 'يتيم مكفول', color: 'text-red-500' },
  { value: 8, suffix: '', label: 'آبار مياه', color: 'text-blue-500' },
  { value: 12000, suffix: '+', label: 'سلة غذائية', color: 'text-amber-500' },
  { value: 24, suffix: '', label: 'مشروع مكتمل', color: 'text-purple-500' },
  { value: 8, suffix: '', label: 'محافظة يمنية', color: 'text-emerald-600' },
];

export const ImpactNumbersSection = memo(function ImpactNumbersSection() {
  return (
    <section className="bg-[var(--secondary)] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          badge="أرقام الأثر"
          title="أثر يُقاس بالأعداد"
          subtitle="كل رقم هنا يمثل إنساناً حقيقياً غيّرتم حياته"
        />
        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {NUMBERS.map((num, i) => (
            <motion.div
              key={num.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`text-3xl font-extrabold ${num.color}`}>
                <AnimatedCounter target={num.value} suffix={num.suffix} />
              </div>
              <div className="mt-2 text-xs font-bold text-[var(--foreground)]">{num.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
