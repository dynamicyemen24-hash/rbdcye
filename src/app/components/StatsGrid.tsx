// Unified Stats Grid Component - Professional Design System
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'green' | 'gold' | 'blue' | 'purple';
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'glass';
}

const colorClasses = {
  green: 'text-[var(--brand-green)]',
  gold: 'text-[var(--brand-gold)]',
  blue: 'text-[var(--brand-green-light)]',
  purple: 'text-[var(--chart-3)]',
};

export function StatsGrid({ stats, columns = 4, variant = 'default' }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  const bgStyle = variant === 'glass' 
    ? {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }
    : {
        background: 'var(--card)',
        border: '1px solid var(--border)',
      };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 max-w-4xl mx-auto`}>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const colorClass = stat.color ? colorClasses[stat.color] : 'text-[var(--foreground)]';
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            className="text-center p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
            style={bgStyle}
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
              variant === 'glass' 
                ? 'bg-white/50' 
                : 'bg-[var(--brand-green-pale)]'
            }`}>
              <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
            <div 
              className="text-3xl font-bold mb-1"
              style={{ 
                color: stat.color ? `var(--brand-${stat.color === 'blue' ? 'green-light' : stat.color})` : 'var(--foreground)',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              {stat.value}
            </div>
            <div 
              className="text-sm"
              style={{ 
                color: 'var(--muted-foreground)',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              {stat.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

