import { CheckCircle2, Share2, Mail, Repeat, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import { memo } from 'react';

interface PostGiftProps {
  amount: number;
  isMonthly: boolean;
  donorName: string;
}

export const PostGiftJourney = memo(function PostGiftJourney({ amount, isMonthly, donorName }: PostGiftProps) {
  return (
    <div className="rounded-3xl border-2 border-[var(--brand-green)]/30 bg-[var(--brand-green)]/5 p-8 text-center" dir="rtl">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
        <CheckCircle2 className="mx-auto h-24 w-24 text-[var(--brand-green)]" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h1 className="mt-6 text-3xl font-bold text-[var(--foreground)]">شكرًا {donorName}</h1>
        <p className="mt-3 text-lg text-[var(--muted-foreground)]">
          تبرعك {isMonthly ? 'الشهري' : ''} بقيمة {amount.toLocaleString('ar-YE')} ر.ي مسجل
        </p>
      </motion.div>

      {/* Impact Confirmation */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mx-auto mt-8 max-w-sm rounded-2xl bg-[var(--card)] p-6">
        <Gift className="mx-auto h-8 w-8 text-[var(--brand-gold)]" />
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">تبرعك سيُستخدم في</p>
        <p className="mt-1 font-bold text-[var(--foreground)]">{amount >= 25000 ? 'حفر بئر مياه نقية' : amount >= 10000 ? 'كفالة يتيم شهري' : amount >= 5000 ? 'كسوة شتوية' : 'سلة غذائية'}</p>
      </motion.div>

      {/* Next Steps */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mx-auto mt-8 max-w-md space-y-3">
        <p className="font-bold text-[var(--foreground)]">الخطوات التالية</p>
        <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
          <div className="flex items-center gap-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-[0.6rem] font-bold text-white">١</span>سنتواصل معك لتأكيد التفاصيل</div>
          <div className="flex items-center gap-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-[0.6rem] font-bold text-white">٢</span>ستتلقى تقرير أثر تبرعك</div>
          <div className="flex items-center gap-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)] text-[0.6rem] font-bold text-white">٣</span>نحدثك بالمستجدات دورياً</div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-8 flex flex-wrap justify-center gap-3">
        <button className="flex items-center gap-2 rounded-xl bg-[var(--brand-green)] px-6 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
          <Share2 className="h-4 w-4" /> شارك مع أصدقائك
        </button>
        {!isMonthly && (
          <button className="flex items-center gap-2 rounded-xl border border-[var(--brand-green)] px-6 py-3 font-bold text-[var(--brand-green)] transition-all hover:bg-[var(--brand-green)]/5">
            <Repeat className="h-4 w-4" /> اجعله شهريًا
          </button>
        )}
        <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 font-bold text-[var(--foreground)] transition-all hover:bg-[var(--muted)]">
          <Mail className="h-4 w-4" /> اشترك في النشرة
        </button>
      </motion.div>
    </div>
  );
});
