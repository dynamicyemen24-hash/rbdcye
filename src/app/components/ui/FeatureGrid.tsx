import { memo, ReactNode } from 'react';
import { motion } from 'motion/react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color?: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export const FeatureGrid = memo(function FeatureGrid({ features, columns = 3 }: FeatureGridProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-300 hover:shadow-lg hover:border-[var(--brand-green)]/20"
        >
          <div className={`mb-4 grid h-12 w-12 place-items-center rounded-xl ${feature.color || 'bg-[var(--brand-green)]/10'} text-[var(--brand-green)] transition-transform group-hover:scale-110`}>
            <feature.icon className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-[var(--foreground)]">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
});
