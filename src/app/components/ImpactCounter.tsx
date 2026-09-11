import { motion, useInView } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

interface ImpactCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: React.ReactNode;
}

export function ImpactCounter({ end, duration = 2000, suffix = '', prefix = '', label, icon }: ImpactCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  const formattedCount = count.toLocaleString('ar-YE');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {icon && <div className="mb-2 flex justify-center">{icon}</div>}
      <div className="text-3xl font-bold text-[var(--brand-green)] md:text-4xl">
        {prefix}{formattedCount}{suffix}
      </div>
      <div className="mt-1 text-sm text-[var(--muted-foreground)]">{label}</div>
    </motion.div>
  );
}
