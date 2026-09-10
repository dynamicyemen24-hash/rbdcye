import { memo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';

export const BeneficiaryStoryHero = memo(function BeneficiaryStoryHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]"
      dir="rtl"
    >
      <div className="grid gap-0 md:grid-cols-2">
        {/* Image Side */}
        <div className="relative h-64 overflow-hidden md:h-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="flex h-full items-center justify-center bg-[var(--muted)] text-[var(--muted-foreground)]">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-green)]/10 text-4xl">
                👨‍👩‍👧‍👦
              </div>
              <p className="mt-2 text-sm">صورة المستفيد</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur">
            <MapPin className="h-3 w-3" /> تعز — مديرية المخا
          </div>
        </div>

        {/* Content Side */}
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Calendar className="h-3 w-3" />
            <span>قصة حقيقية — أغسطس ٢٠٢٦</span>
          </div>
          
          <h2 className="mt-3 text-xl font-bold text-[var(--foreground)]">
            "بئر المياه أنقذ أسرتنا"
          </h2>
          
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
            كنت أمشي ٣ ساعات يومياً لأجلب الماء لأسرتي. أطفالي كانوا يتأخرون عن المدرسة بسبب الماء.
            عندما حفرتم البئر في قريتنا — تغيّر كل شيء. أصبح الماء على بُعد ٥ دقائق.
            أطفالي يذهبون للمدرسة في الوقت. وشكراً لكم — عادت الابتسامة لوجوهنا.
          </p>
          
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-green)]/10 text-sm font-bold text-[var(--brand-green)]">
              أم أحمد
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--foreground)]">أم أحمد</p>
              <p className="text-xs text-[var(--muted-foreground)]">أم لـ ٥ أطفال — تعز</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a href="/donate" className="flex items-center gap-2 rounded-xl bg-[var(--brand-gold)] px-6 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
              ساهم في تغيير حياة <ArrowLeft className="h-4 w-4" />
            </a>
            <a href="/stories" className="rounded-xl border border-[var(--border)] px-6 py-3 font-bold text-[var(--foreground)] transition-all hover:bg-[var(--muted)]">
              المزيد من القصص
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
