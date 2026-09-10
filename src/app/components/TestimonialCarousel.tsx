import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  program: string;
  text: string;
  iconBg: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'أم أحمد — صنعاء',
    location: 'صنعاء',
    program: 'مستفيدة من كفالة الأيتام',
    text: 'بفضل الكفالة الشهرية، تمكنت من إبقاء أطفالي في المدرسة. لم أكن أتخيل أنني سأرى ابنتي تقرأ القرآن بشكل صحيح. شكراً لكل من ساهم.',
    iconBg: 'bg-[var(--brand-green)]/10 text-[var(--brand-green)]',
  },
  {
    id: 2,
    name: 'صالح — حجة',
    location: 'حجة',
    program: 'مستفيد من المطابخ الخيرية',
    text: 'السلال الغذائية كانت في توقيت لا نقدر عليه. كان البيت فارغًا والطعام قليلًا. وصلت السلة وكأنها بركة من الله. لا ننسى هذا العطاء.',
    iconBg: 'bg-[var(--brand-gold)]/10 text-[var(--brand-gold-dark)]',
  },
  {
    id: 3,
    name: 'شيخ عبدالله — مأرب',
    location: 'مأرب',
    program: 'من سكان القرية المخدومة',
    text: 'كنا نمشي ساعات لإحضار الماء. الآن البئر يعمل بالطاقة الشمسية والماء يصل لكل بيت. غيّرتم حياتنا.',
    iconBg: 'bg-[var(--brand-green)]/10 text-[var(--brand-green)]',
  },
  {
    id: 4,
    name: 'فاطمة — ذمار',
    location: 'ذمار',
    program: 'مستفيدة من الأوقاف',
    text: 'الماكينة التي حصلنا عليها غيّرت حياتنا. أصبح لدينا دخل شهري مستقر ولا نحتاج للانتظار. هذه الصدقة الجارية تصلح فينا ما أفسده الفقر.',
    iconBg: 'bg-[var(--brand-gold)]/10 text-[var(--brand-gold-dark)]',
  },
  {
    id: 5,
    name: 'محمد — تعز',
    location: 'تعز',
    program: 'مستفيد من حلقات التحفيظ',
    text: 'ابني كان يضيع وقته في الشارع. بعد انضمامه لحلقة التحفيظ، تغير تماماً. يحفظ القرآن ويتربى على الأخلاق. شكراً لكم.',
    iconBg: 'bg-[var(--brand-green)]/10 text-[var(--brand-green)]',
  },
];

export const TestimonialCarousel = memo(function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const testimonial = TESTIMONIALS[current];

  return (
    <div className="relative">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={testimonial.id}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-md"
        >
          <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full bg-[var(--brand-green)]/10">
            <Quote className="h-5 w-5 text-[var(--brand-green)]" />
          </div>
          <blockquote className="text-base leading-[1.9] text-[var(--foreground)]">
            {testimonial.text}
          </blockquote>
          <div className="mt-6">
            <p className="text-sm font-bold text-[var(--brand-green)]">{testimonial.name}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{testimonial.program}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="الشهادة السابقة"
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] transition hover:bg-[var(--brand-green)] hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              aria-label={`الشهادة ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-6 bg-[var(--brand-green)]' : 'w-2 bg-[var(--border)]'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="الشهادة التالية"
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] transition hover:bg-[var(--brand-green)] hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});
