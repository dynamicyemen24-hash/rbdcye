import { motion } from 'motion/react';
import { memo } from 'react';

interface Stat {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

interface StatsBarProps {
  stats: Stat[];
  variant?: 'default' | 'glass' | 'dark';
}

export const StatsBar = memo(function StatsBar({ stats, variant = 'default' }: StatsBarProps) {
  const variants = {
    default: 'bg-[var(--secondary)] border border-[var(--border)]',
    glass: 'glass-card',
    dark: 'bg-[var(--brand-green-dark)] text-white',
  };

  return (
    <div className={`rounded-2xl ${variants[variant]} p-6`}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            {stat.icon && (
              <stat.icon className={`mx-auto h-6 w-6 ${stat.color || 'text-[var(--brand-green)]'}`} />
            )}
            <div className={`mt-2 text-2xl font-extrabold ${variant === 'dark' ? 'text-white' : 'text-[var(--foreground)]'}`}>
              {stat.value}
            </div>
            <div className={`text-xs ${variant === 'dark' ? 'text-white/70' : 'text-[var(--muted-foreground)]'}`}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});
