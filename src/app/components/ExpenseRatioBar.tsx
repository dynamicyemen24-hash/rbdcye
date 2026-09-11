// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { memo } from 'react';

interface Segment {
  label: string;
  percentage: number;
  color: string;
}

const SEGMENTS: Segment[] = [
  { label: 'المستفيدين مباشرة', percentage: 84, color: 'bg-[var(--brand-green)]' },
  { label: 'البرامج والتنفيذ', percentage: 8, color: 'bg-[var(--brand-gold)]' },
  { label: 'الإدارة والعمليات', percentage: 8, color: 'bg-[var(--muted)]' },
];

export const ExpenseRatioBar = memo(function ExpenseRatioBar() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green)]/10">
          <Shield className="h-5 w-5 text-[var(--brand-green)]" />
        </div>
        <div>
          <h3 className="font-bold text-[var(--foreground)]">الشفافية المالية</h3>
          <p className="text-xs text-[var(--muted-foreground)]">أين يذهب تبرعك بالضبط</p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-full bg-[var(--muted)]">
        <div className="flex h-4">
          {SEGMENTS.map((seg, i) => (
            <motion.div
              key={seg.label}
              initial={{ width: 0 }}
              whileInView={{ width: `${seg.percentage}%` }}
              transition={{ duration: 1, delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`${seg.color} h-full`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {SEGMENTS.map(seg => (
          <div key={seg.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${seg.color}`} />
              <span className="text-[var(--muted-foreground)]">{seg.label}</span>
            </div>
            <span className="font-bold text-[var(--foreground)]">{seg.percentage}%</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-[var(--brand-green)]/5 p-3 text-center">
        <p className="text-sm font-bold text-[var(--brand-green)]">
          من كل ١٠٠ ريال تبرعك — ٨٤ ريال تصل مباشرة للمستفيد
        </p>
      </div>
    </div>
  );
});
