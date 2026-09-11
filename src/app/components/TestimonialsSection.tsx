import { memo } from 'react';

import { TestimonialCarousel } from './TestimonialCarousel';
import { SectionHeader } from './ui/SectionHeader';

export const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="bg-[var(--background)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="شهادات المتبرعين"
          title="ماذا يقول متبرعونا"
          titleHighlight="عنا؟"
          subtitle="آصوات حقيقية من أشخاص يصنعون الأثر يوماً بعد يوم"
        />
        <div className="mt-14 max-w-3xl mx-auto">
          <TestimonialCarousel />
        </div>
      </div>
    </section>
  );
});
