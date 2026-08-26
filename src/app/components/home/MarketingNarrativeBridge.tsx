import { motion } from 'motion/react';
import { useSEO } from '@/utils/seoAdvanced';

interface MarketingNarrativeBridgeProps {
  setCurrentPage: (page: string) => void;
}

/**
 * Marketing Narrative Bridge - elongated marketing content
 * bridges sections with compelling storytelling and enhanced spacing
 */
export function MarketingNarrativeBridge({ setCurrentPage }: MarketingNarrativeBridgeProps) {
  useSEO({
    title: 'قصتنا التسويقية - رحماء بينهم',
    description: 'قصتنا المؤثرة وكيف نحدث فارقاً حقيقياً في حياة المحتاجين',
  });

  const narrativeStories = [
    {
      id: '1',
      title: 'من اليأس إلى الأمل — قصة عائلة في تعز',
      subtitle: 'عندما وصلت السلة في الوقت المناسب',
      image: '/images/defaults/story-woman.svg',
      impact: 'عائلة أنقذناها',
      description: 'أم محمد فقدت كل شيء في الصراع. وجدناها تبكي أمام بابها المكسور. اليوم أطفالها يأكلون ويدرسون. لم نُطعمهم فقط — أعدنا لهم الأمل.',
      cta: 'اقرأ القصة كاملة',
    },
    {
      id: '2',
      title: 'بئر واحد يروي قرية كاملة',
      subtitle: 'الماء غيّر كل شيء في هذه القرية',
      image: '/images/defaults/project-water.svg',
      impact: 'قرية كاملة',
      description: 'قرية في الريف الحديدي لم يكن فيها ماء نظيف. بناء بئر ارتوازي واحد حوّل حياة أسر كاملة — من العزلة إلى صحة وتعليم.',
      cta: 'اكتشف المشروع',
    },
    {
      id: '3',
      title: 'متطوعونا — شباب يبني وطنه بيديه',
      subtitle: 'لم ينتظروا الدعوة — جاءوا بأنفسهم',
      image: '/images/defaults/story-community.svg',
      impact: 'متطوعون مخلصون',
      description: 'خالد كان طالب جامعي. سجّل في برنامج التطوع لأنهم كانوا بحاجة ليد. اليوم يقود فريقاً في المحافظة. لم يكن يعلم أنه يبني وطنه.',
      cta: 'شارك معنا',
    },
  ];

  return (
    <section className="section py-24 md:py-32" style={{ background: 'var(--background)' }}>
      <div className="section-container">
        <div className="max-w-6xl mx-auto">

          {/* Bridge title */}
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--brand-green-pale)] text-[var(--brand-green)] mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              جسرنا القصصي
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
              قصص من الميدان تلهم
            </h2>

            <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto leading-relaxed">
              ليست أرقاماً في تقرير — بل لحظات حقيقية غيرت حياة أسر يمنية
            </p>
          </div>

          {/* Narrative cards grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {narrativeStories.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: Number(story.id) * 0.1 }}
                className="card card--xl hover-lift relative overflow-hidden border border-[var(--border)] group"
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(15, 76, 58, 0.15)' }}
              >
                {/* Gradient top overlay */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green-light)]" />

                {/* Card content */}
                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-[var(--brand-green-pale)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[var(--brand-green)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2z" />
                        <line x1="11" y1="11" x2="21" y2="11" />
                        <line x1="21" y1="11" x2="11" y2="21" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">
                        {story.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {story.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Impact stat */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-green-pale)] flex items-center justify-center text-[var(--brand-green)] text-sm font-bold">
                      {story.impact}
                    </div>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      الأثر المحقق
                    </span>
                  </div>

                  {/* Story description */}
                  <p className="text-base leading-relaxed text-[var(--muted-foreground)] mb-6">
                    {story.description}
                  </p>

                  {/* CTA button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 rounded-xl bg-[var(--brand-green)] text-white font-bold text-lg hover:bg-[var(--brand-green-light)] transition-colors"
                    onClick={() => setCurrentPage('success-stories')}
                  >
                    {story.cta}
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Divider with enhanced story */}
          <div className="mt-16 pt-8 border-t border-[var(--border)]/60 text-center">
            <p className="text-[var(--muted-foreground)] mb-4">
              كل قصة تلهم، وكل تبرع يصنع فرقاً
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-green-pale)] text-[var(--brand-green)] text-sm font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              #قصص_رحماء
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}