import { Shield, Award, CheckCircle2, FileText } from 'lucide-react';
import { memo } from 'react';

export const TrustBadges = memo(function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-4" dir="rtl">
      {[
        { icon: Shield, label: 'مُعتمد شرعياً', color: 'text-[var(--brand-green)]' },
        { icon: Award, label: 'ترخيص رسمي #482', color: 'text-[var(--brand-gold)]' },
        { icon: CheckCircle2, label: 'شفافية مالية', color: 'text-blue-500' },
        { icon: FileText, label: 'تقارير سنوية', color: 'text-purple-500' },
      ].map(badge => (
        <div key={badge.label} className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2">
          <badge.icon className={`h-4 w-4 ${badge.color}`} />
          <span className="text-xs font-bold text-[var(--foreground)]">{badge.label}</span>
        </div>
      ))}
    </div>
  );
});
