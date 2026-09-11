import { HelpCircle, ChevronDown, ChevronUp, Phone, MessageCircle, Search, BookOpen, Users, Heart, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, memo } from 'react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  { question: 'كيف أتقدم بطلب استفادة؟', answer: 'يمكنك تقديم طلب استفادة من خلال صفحة "طلب استفادة" في الموقع. املأ النموذج بالبيانات المطلوبة وسنتواصل معك خلال ٢٤-٤٨ ساعة.', category: 'طلبات' },
  { question: 'ما هي الخدمات المتوفرة؟', answer: 'نقدم خدمات متنوعة تشمل: سلال غذائية، كسوات شتوية، آبار مياه، كفالة أيتام، تأمين طبي، مساعدات تعليمية، ومساعدات طوارئ.', category: 'خدمات' },
  { question: 'كيف أتابع حالة طلبي؟', answer: 'بمجرد تقديم طلبك، ستحصل على رقم تتبع. يمكنك التواصل معنا عبر الهاتف أو واتساب لمتابعة حالة طلبك.', category: 'طلبات' },
  { question: 'هل جميع الخدمات مجانية؟', answer: 'نعم، جميع خدماتنا مجانية بالكامل. نحن منظمة غير ربحية تعمل على تقديم المساعدة للمحتاجين دون أي رسوم.', category: 'عام' },
  { question: 'كيف أتبرع ماليًا؟', answer: 'يمكنك التبرع من خلال صفحة "تبرع الآن" واختيار الطريقة المناسبة: تحويل بنكي، محفظة إلكترونية، أو واتساب.', category: 'تبرعات' },
  { question: 'هل أحصل على إيصال تبرع؟', answer: 'نعم، ستحصل على إيصال رسمي بتبرعك يمكنك استخدامه في إقرار الزكاة والضرائب.', category: 'تبرعات' },
  { question: 'ما هي محافظات التغطية؟', answer: 'نغطي ٨ محافظات يمنية: صنعاء، عدن، تعز، إب، مأرب، الحديدة،حضرموت، صعدة، والبيضاء.', category: 'عام' },
  { question: 'كيف أساعد في التطوع؟', answer: 'يمكنك التسجيل كمتطوع من خلال صفحة "التطوع" وسنتواصل معك لتناسبك مع البرامج المناسبة.', category: 'تطوع' },
  { question: 'ما هو الوقف الخيري؟', answer: 'الوقف الخيري هو أوقاف مستدامة تخدم الأجيال القادمة. يمكنك إنشاء وقف خيري من خلال صفحة "الوقف".', category: 'وقف' },
  { question: 'كيف أتحقق من شفافية المؤسسة؟', answer: 'ننشر تقارير شفافية سنوية تتضمن التوزيع المالي بالتفصيل. يمكنك الاطلاع عليها من صفحة "الشفافية".', category: 'عام' },
];

const CATEGORIES = ['الكل', 'طلبات', 'خدمات', 'تبرعات', 'تطوع', 'وقف', 'عام'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CATEGORY_ICONS: Record<string, typeof HelpCircle> = {
  'طلبات': FileText, 'خدمات': BookOpen, 'تبرعات': Heart, 'تطوع': Users, 'وقف': BookOpen, 'عام': HelpCircle,
};

export const HelpCenterPage = memo(function HelpCenterPage() {
  const [category, setCategory] = useState('الكل');
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filtered = FAQS.filter(f => {
    const matchCategory = category === 'الكل' || f.category === category;
    const matchSearch = !search || f.question.includes(search) || f.answer.includes(search);
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] py-24" dir="rtl">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-green)]">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-[var(--foreground)]">مركز المساعدة</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">ابحث عن إجابة سؤالك أو تواصل معنا مباشرة</p>
        </motion.div>

        {/* Search */}
        <div className="mt-8 relative">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-4 pr-12 pl-4 text-lg" placeholder="ابحث عن سؤالك..." />
        </div>

        {/* Category Tabs */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${category === cat ? 'bg-[var(--brand-green)] text-white' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="mt-8 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[var(--muted-foreground)]">لا توجد نتائج</div>
          ) : (
            filtered.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="flex w-full items-center justify-between p-5 text-right">
                  <span className="font-bold text-[var(--foreground)]">{faq.question}</span>
                  {expandedFaq === i ? <ChevronUp className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]" /> : <ChevronDown className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]" />}
                </button>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="border-t border-[var(--border)] px-5 py-4 text-[var(--muted-foreground)]">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        {/* Contact Cards */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-[var(--foreground)]">لم تجد إجابتك؟</h2>
          <p className="mt-2 text-center text-[var(--muted-foreground)]">تواصل معنا مباشرة وسنساعدك</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <a href="tel:+967780777007" className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-green)]"><Phone className="h-6 w-6 text-white" /></div>
              <div><p className="font-bold text-[var(--foreground)]">الهاتف</p><p className="mt-1 text-sm text-[var(--brand-green)]" dir="ltr">+967 780 777 007</p></div>
            </a>
            <a href="https://wa.me/967780777007" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500"><MessageCircle className="h-6 w-6 text-white" /></div>
              <div><p className="font-bold text-[var(--foreground)]">واتساب</p><p className="mt-1 text-sm text-green-500">محادثة مباشرة</p></div>
            </a>
            <a href="mailto:info@rbdcye.org" className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500"><BookOpen className="h-6 w-6 text-white" /></div>
              <div><p className="font-bold text-[var(--foreground)]">البريد الإلكتروني</p><p className="mt-1 text-sm text-blue-500" dir="ltr">info@rbdcye.org</p></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});
