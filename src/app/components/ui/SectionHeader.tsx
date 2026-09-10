import { memo, ReactNode } from 'react';
import { motion } from 'motion/react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: 'center' | 'right';
  children?: ReactNode;
}

export const SectionHeader = memo(function SectionHeader({
  badge,
  title,
  titleHighlight,
  subtitle,
  align = 'center',
  children,
}: SectionHeaderProps) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-right';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl ${alignment}`}
    >
      {badge && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--brand-green)]/20 bg-[var(--brand-green)]/5 px-4 py-1.5 text-xs font-bold text-[var(--brand-green)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-green)] animate-pulse" />
          {badge}
        </div>
      )}
      <h2 className="text-[var(--text-section)] font-extrabold leading-tight text-[var(--foreground)]">
        {title}
        {titleHighlight && (
          <span className="gradient-text"> {titleHighlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[var(--text-body)] leading-relaxed text-[var(--muted-foreground)] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {children}
    </motion.div>
  );
});
