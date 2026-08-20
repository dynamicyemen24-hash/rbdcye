import { memo } from 'react';
import { motion } from 'motion/react';

interface IslamicSeparatorProps {
  variant?: 'emerald' | 'gold' | 'subtle';
  className?: string;
}

/**
 * IslamicSeparator Component
 * Renders a subtle, semi-transparent Islamic geometric separator between major sections.
 * Combines fine gradient rule lines with an authentic Rub el Hizb (8-pointed star) / geometric rosette emblem.
 */
export const IslamicSeparator = memo(function IslamicSeparator({
  variant = 'emerald',
  className = '',
}: IslamicSeparatorProps) {
  const isGold = variant === 'gold';
  const isSubtle = variant === 'subtle';

  const lineGradient = isGold
    ? 'from-transparent via-[#C69E5A]/40 to-transparent'
    : isSubtle
    ? 'from-transparent via-slate-300/50 to-transparent'
    : 'from-transparent via-[#0F4C3A]/30 to-transparent';

  const starFill = isGold
    ? 'fill-[#C69E5A]/15 stroke-[#C69E5A]/70'
    : isSubtle
    ? 'fill-slate-200/50 stroke-slate-400/60'
    : 'fill-[#0F4C3A]/10 stroke-[#0F4C3A]/60';

  const centerDotFill = isGold ? 'bg-[#C69E5A]/80' : isSubtle ? 'bg-slate-400/80' : 'bg-[#0F4C3A]/80';

  return (
    <div className={`w-full py-8 sm:py-12 lg:py-14 flex items-center justify-center relative overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Authentic Light Islamic Geometric Pattern Background */}
      <div className="absolute inset-0 pattern-geometric-islamic opacity-[0.07] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-5xl px-4 flex items-center justify-center gap-3 sm:gap-6 relative z-10"
      >
        {/* Left Tapering Gradient Line */}
        <div className={`flex-1 h-px bg-gradient-to-r ${lineGradient}`} />

        {/* Left Micro Geometric Accent Dots */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-60">
          <div className={`w-1 h-1 rotate-45 ${centerDotFill}`} />
          <div className={`w-1.5 h-1.5 rotate-45 ${centerDotFill}`} />
        </div>

        {/* Central Rub el Hizb (Islamic 8-Pointed Star Rosette) Emblem */}
        <div className="relative flex items-center justify-center shrink-0">
          {/* Subtle Glow Ring */}
          <div
            className={`absolute w-9 h-9 rounded-full filter blur-xs ${
              isGold ? 'bg-[#C69E5A]/10' : 'bg-[#0F4C3A]/10'
            }`}
          />

          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 transition-transform duration-500 hover:rotate-45"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Outer Square rotated 0deg */}
            <rect
              x="8"
              y="8"
              width="24"
              height="24"
              rx="1.5"
              className={starFill}
              strokeWidth="1.2"
            />
            {/* Inner Square rotated 45deg around center (20,20) */}
            <rect
              x="8"
              y="8"
              width="24"
              height="24"
              rx="1.5"
              transform="rotate(45 20 20)"
              className={starFill}
              strokeWidth="1.2"
            />
            {/* Concentric Inner Geometric Diamond */}
            <rect
              x="13"
              y="13"
              width="14"
              height="14"
              transform="rotate(45 20 20)"
              fill="none"
              className={isGold ? 'stroke-[#C69E5A]/50' : 'stroke-[#0F4C3A]/40'}
              strokeWidth="1"
            />
            {/* Center Core Circle */}
            <circle
              cx="20"
              cy="20"
              r="2.5"
              className={isGold ? 'fill-[#C69E5A]' : 'fill-[#0F4C3A]'}
            />
          </svg>
        </div>

        {/* Right Micro Geometric Accent Dots */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-60">
          <div className={`w-1.5 h-1.5 rotate-45 ${centerDotFill}`} />
          <div className={`w-1 h-1 rotate-45 ${centerDotFill}`} />
        </div>

        {/* Right Tapering Gradient Line */}
        <div className={`flex-1 h-px bg-gradient-to-r ${lineGradient}`} />
      </motion.div>
    </div>
  );
});

export default IslamicSeparator;
