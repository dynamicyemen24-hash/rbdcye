import { motion } from 'motion/react';
import { useSEO } from '@/utils/seoAdvanced';

interface EnhancedBrandStoryProps {
  setCurrentPage: (page: string) => void;
}

/**
 * Enhanced Brand Story - strengthening institutional identity
 * strengthened: stronger identity, better spacing, elongated marketing content
 */
export function EnhancedBrandStory({ setCurrentPage: _setCurrentPage }: EnhancedBrandStoryProps) {
  useSEO({
    title: 'هويتنا - رحماء بينهم',
    description: 'هويتنا وقيمنا الأساسية - رحماء بينهم للإغاثة والتنمية',
  });

  return (
    <section className="section section-secondary py-24 md:py-32">
      <div className="section-container">
        <div className="max-w-6xl mx-auto">

          {/* Title with enhanced badge */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--brand-green-pale)] text-[var(--brand-green)] mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              هوية رحماء بينهم
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
              لماذا نحن
            </h2>

            <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto leading-relaxed">
              نحن لسنا مجرد عمل خيري — نحن قرار يومي بالوقوف بجانب من سقط، وبناء ما تم تدميره
            </p>
          </div>

          {/* Values grid with enhanced spacing */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card card--xl hover-lift relative overflow-hidden group"
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(15, 76, 58, 0.2)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, transparent, rgba(26,92,72,0.05), transparent)' }} />
              <div className="relative z-10 p-6">
                <div className="icon-box icon-box--green w-14 h-14 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 0 20px rgba(26, 92, 72, 0.2)' }}>
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                    <line x1="15" y1="14" x2="15.01" y2="14" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>نصل قبل أن يُدار</h3>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  لا ننتظر حتى تصل الكارثة. فرقنا في الميدان قبل الأزمة — نتصفح الشوارع، نسأل عن الأسر، نبني ثقتنا مع المجتمع قبل أن نحتاجه. هكذا نصل إلى من لا يصله أحد.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card card--xl hover-lift relative overflow-hidden group"
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(15, 76, 58, 0.2)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, transparent, rgba(26,92,72,0.05), transparent)' }} />
              <div className="relative z-10 p-6">
                <div className="icon-box icon-box--green w-14 h-14 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 0 20px rgba(26, 92, 72, 0.2)' }}>
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>المساعدات تنتهي — الأثر يبقى</h3>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  سلة غذائية تُطعم أسرة أسبوعاً. مشروع صغير يُطعم أسرة عُمر. لا نريد أن نبقى مصدر العون — نريد أن نجعل المجتمع قادراً على العون.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card card--xl hover-lift relative overflow-hidden group"
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(15, 76, 58, 0.2)' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, transparent, rgba(26,92,72,0.05), transparent)' }} />
              <div className="relative z-10 p-6">
                <div className="icon-box icon-box--green w-14 h-14 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: '0 0 20px rgba(26, 92, 72, 0.2)' }}>
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15 7 22 7 25 12 22 17 15 12 15 7 8 7 3 12 3 8 7 2 12 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>كل ريال يصل إلى صاحبه</h3>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  ننشر تقاريرنا المالية شهرياً. لا نخفي ريالاً. لأن المتبرع الذي وضع ثقته فينا يستحق أن يعرف أين ذهبت. شفافيتنا ليست اختياراً — إنها عقد مع من صدّقنا.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Enhanced mission statement */}
          <div className="mt-12 pt-8 border-t border-[var(--border)]/60">
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-4">ما نفعله ببساطة</h3>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              نصل إلى الأسر المتضررة بالمساعدات العاجلة، ونبني قدرات المجتمع ليُطعم نفسه. لا نكتفي بالأرقام — نقيس نجاحنا بعدم حاجتكم إلينا.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}