import { Users, Heart, Droplets, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState, memo } from 'react';

interface Metric {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
  color: string;
  subtext?: string;
}

const METRICS: Metric[] = [
  { icon: Users, value: 15000, suffix: '+', label: 'مستفيد مباشر', color: 'text-[var(--brand-green)]', subtext: 'في ٨ محافظات' },
  { icon: Heart, value: 450, suffix: '', label: 'يتيم مكفول', color: 'text-red-500', subtext: 'بدعم شهري منتظم' },
  { icon: Droplets, value: 8, suffix: '', label: 'آبار مياه نقية', color: 'text-blue-500', subtext: 'تعمل بالطاقة الشمسية' },
  { icon: TrendingUp, value: 12000, suffix: '+', label: 'سلة غذائية', color: 'text-amber-500', subtext: 'تم توزيعها هذا العام' },
  { icon: MapPin, value: 8, suffix: '', label: 'محافظة يمنية', color: 'text-purple-500', subtext: 'نغطيها بالكامل' },
  { icon: Calendar, value: 12, suffix: '', label: 'سنة خدمة', color: 'text-emerald-600', subtext: 'في العمل الإنساني' },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString('ar-YE')}{suffix}</span>;
}

export const LiveImpactCounter = memo(function LiveImpactCounter() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" dir="rtl">
      {METRICS.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)]`}>
            <m.icon className={`h-5 w-5 ${m.color}`} />
          </div>
          <div className={`mt-3 text-2xl font-bold ${m.color}`}>
            <AnimatedNumber target={m.value} suffix={m.suffix} />
          </div>
          <div className="mt-1 text-xs font-bold text-[var(--foreground)]">{m.label}</div>
          {m.subtext && <div className="mt-0.5 text-[0.65rem] text-[var(--muted-foreground)]">{m.subtext}</div>}
        </motion.div>
      ))}
    </div>
  );
});
