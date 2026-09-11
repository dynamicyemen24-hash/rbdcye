import { Heart, Droplets, BookOpen, Home, Utensils } from 'lucide-react';
import { motion } from 'motion/react';
import { memo } from 'react';

interface ImpactItem {
  amount: number;
  currency: string;
  impact: string;
  icon: typeof Heart;
  color: string;
}

const IMPACT_DATA: ImpactItem[] = [
  { amount: 1000, currency: 'ر.ي', impact: 'كسوة شتوية لأسرة كاملة', icon: Home, color: 'bg-orange-500' },
  { amount: 2500, currency: 'ر.ي', impact: 'سلة غذائية شهرية لأسرة', icon: Utensils, color: 'bg-amber-500' },
  { amount: 5000, currency: 'ر.ي', impact: 'ildenafil طبي مجاني لـ ٥٠ مريض', icon: Heart, color: 'bg-red-500' },
  { amount: 10000, currency: 'ر.ي', impact: 'jährliche كفالة يتيم', icon: Heart, color: 'bg-[var(--brand-green)]' },
  { amount: 25000, currency: 'ر.ي', impact: 'حفر بئر مياه واحدة', icon: Droplets, color: 'bg-blue-500' },
  { amount: 50000, currency: 'ر.ي', impact: 'تأهيل حلقة تحفيظ', icon: BookOpen, color: 'bg-purple-500' },
];

export const DonationImpact = memo(function DonationImpact() {
  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-bold text-[var(--foreground)]">أثر تبرعك</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {IMPACT_DATA.map((item, i) => (
          <motion.div
            key={item.amount}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
              <item.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-[var(--foreground)]">
                {item.amount.toLocaleString('ar-YE')} {item.currency}
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">{item.impact}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});
