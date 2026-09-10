import { memo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  variant?: 'green' | 'gold' | 'dark';
  children?: ReactNode;
}

export const CTASection = memo(function CTASection({
  title,
  subtitle,
  buttonText,
  buttonLink,
  variant = 'green',
  children,
}: CTASectionProps) {
  const gradients = {
    green: 'from-[var(--brand-green)] to-emerald-700',
    gold: 'from-[var(--brand-gold)] to-amber-600',
    dark: 'from-[var(--brand-green-dark)] to-zinc-900',
  };

  return (
    <section className={`relative overflow-hidden bg-gradient-to-l ${gradients[variant]} py-20 sm:py-28`}>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'var(--pattern-rub-el-hizb)', backgroundSize: '200px 200px' }} />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-4 text-lg text-white/80">{subtitle}</p>}
          <motion.a
            href={buttonLink}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-[var(--brand-green)] shadow-xl transition-all hover:shadow-2xl"
          >
            {buttonText}
            <ArrowLeft className="h-5 w-5" />
          </motion.a>
          {children}
        </motion.div>
      </div>
    </section>
  );
});
