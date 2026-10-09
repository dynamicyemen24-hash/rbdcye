import { Heart, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

interface HeroMainColumnProps {
  readonly setCurrentPage: (page: string) => void;
  readonly onOpenVideo: () => void;
  readonly isVideoOpen: boolean;
}

export function HeroMainColumn({ setCurrentPage }: HeroMainColumnProps) {
  return (
    <div className="flex h-full flex-col justify-center space-y-7 py-2 text-right sm:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="space-y-5 sm:space-y-6"
      >
        <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3.5 py-2 text-xs font-semibold text-[#0F4C3A] shadow-sm sm:px-4 sm:text-sm">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#C69E5A]" aria-hidden="true" />
          <span>رحماء بينهم للإغاثة والتنمية في اليمن</span>
        </div>

        <h1 className="max-w-3xl font-cairo text-3xl font-bold leading-[1.45] text-slate-900 sm:text-4xl sm:leading-[1.4] lg:text-[2.75rem]">
          نساند الإنسان اليوم، ونعزّز قدرته على بناء الغد
          <span className="mt-1 block text-[#0F4C3A]">بكرامةٍ وأثرٍ مستدام</span>
        </h1>

        <p className="max-w-2xl text-base font-normal leading-[1.95] text-slate-700 sm:text-lg sm:leading-[2]">
          نعمل على الاستجابة للاحتياجات الإنسانية، ودعم الفئات الأشد احتياجاً، وتطوير مبادرات
          تنموية أقرب إلى واقع المجتمعات اليمنية. نحرص على توجيه الموارد بمسؤولية، واحترام كرامة
          المستفيدين، وتعزيز الشفافية في عرض البرامج والنتائج.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-stretch gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:pt-2"
      >
        <motion.button
          type="button"
          onClick={() => setCurrentPage("donate")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="الانتقال إلى صفحة التبرع ودعم البرامج"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--brand-green-dark)] bg-[var(--brand-green)] px-6 py-3.5 font-cairo text-base font-bold text-white shadow-md shadow-[var(--brand-green)]/20 transition-colors hover:bg-[var(--brand-green-dark)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-green)] focus-visible:ring-offset-2 sm:w-auto sm:rounded-2xl sm:px-8"
        >
          <Heart className="h-5 w-5 fill-white" aria-hidden="true" />
          <span>ساهم في الأثر</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={() => setCurrentPage("programs")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="استكشاف برامج المؤسسة"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[var(--brand-green-dark)]/25 bg-white px-5 py-3.5 font-cairo text-base font-semibold text-[var(--brand-green-dark)] shadow-sm transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-green-dark)] focus-visible:ring-offset-2 sm:w-auto sm:rounded-2xl sm:px-7"
        >
          <span>استكشف البرامج</span>
          <ChevronLeft className="h-5 w-5 text-[var(--brand-green-dark)]" aria-hidden="true" />
        </motion.button>
      </motion.div>
    </div>
  );
}

export default HeroMainColumn;
