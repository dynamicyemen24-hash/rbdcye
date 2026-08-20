import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, Eye, Clock, User, Share2, Heart,
  Printer, Sparkles, Tag, ArrowRight, BookOpen, Quote, ShieldCheck
} from 'lucide-react';
import { 
  ReadabilityControls, 
  FONT_SIZE_CLASSES, 
  LINE_HEIGHT_CLASSES,
  READER_THEME_CLASSES, 
  READER_CARD_THEME_CLASSES,
  FontSizeLevel, 
  ReaderThemeMode,
  LineHeightMode,
  getSavedReaderPreferences,
  saveReaderPreferences
} from './ReadabilityControls';

export interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: {
    name: string;
    color: string;
    bg: string;
    icon?: string;
  };
  date: string;
  views: number;
  readTime?: number;
  author?: string;
  featuredImage?: string;
  tags?: string[];
  impact?: string;
  beneficiaries?: number;
  likes?: number;
}

interface NewsArticleModalProps {
  article: ArticleData | null;
  onClose: () => void;
  onNavigateDonate?: () => void;
}

export const NewsArticleModal: React.FC<NewsArticleModalProps> = ({
  article,
  onClose,
  onNavigateDonate
}) => {
  const saved = getSavedReaderPreferences();
  const [fontSize, setFontSize] = useState<FontSizeLevel>(saved.fontSize);
  const [readerTheme, setReaderTheme] = useState<ReaderThemeMode>(saved.theme);
  const [lineHeight, setLineHeight] = useState<LineHeightMode>(saved.lineHeight || 'relaxed');
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (article) {
      setLikesCount(article.likes || 124);
      setIsLiked(false);
      const pref = getSavedReaderPreferences();
      setFontSize(pref.fontSize);
      setReaderTheme(pref.theme);
      setLineHeight(pref.lineHeight || 'relaxed');
    }
  }, [article]);

  // Handle scroll progress inside article content
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const totalHeight = target.scrollHeight - target.clientHeight;
    if (totalHeight > 0) {
      const currentProgress = (target.scrollTop / totalHeight) * 100;
      setScrollProgress(currentProgress);
    }
  };

  if (!article) return null;

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ رابط المقال بنجاح!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetReader = () => {
    setFontSize('normal');
    setReaderTheme('light');
    setLineHeight('relaxed');
    saveReaderPreferences({ fontSize: 'normal', theme: 'light', lineHeight: 'relaxed' });
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden font-cairo" 
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label={`قراءة مقال: ${article.title}`}
      >
        {/* Modal Outer Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-4xl h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border transition-colors duration-300 ${READER_THEME_CLASSES[readerTheme]}`}
        >
          {/* Top Reading Progress Bar */}
          <div className="w-full h-1.5 bg-slate-200/30 overflow-hidden shrink-0">
            <div 
              className="h-full bg-gradient-to-l from-[var(--brand-green)] to-[var(--brand-gold)] transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
              role="progressbar"
              aria-valuenow={Math.round(scrollProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* Reader Controls Toolbar */}
          <div className="px-4 py-3 sm:px-6 border-b border-slate-200/30 flex flex-wrap items-center justify-between shrink-0 bg-slate-500/5 backdrop-blur-md gap-3 z-10">
            {/* Category & Badge */}
            <div className="flex items-center gap-2">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs flex items-center gap-1.5 shrink-0"
                style={{ backgroundColor: article.category.color }}
              >
                {article.category.icon && <span>{article.category.icon}</span>}
                <span>{article.category.name}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs opacity-75 font-medium shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime || 3} دقائق قراءة</span>
              </span>
            </div>

            {/* Readability Controls Component */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ReadabilityControls
                fontSize={fontSize}
                theme={readerTheme}
                lineHeight={lineHeight}
                onFontSizeChange={setFontSize}
                onThemeChange={setReaderTheme}
                onLineHeightChange={setLineHeight}
                onReset={handleResetReader}
              />

              {/* Share & Print */}
              <button 
                onClick={handleShare}
                className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors opacity-80 hover:opacity-100 shrink-0"
                title="مشاركة المقال"
                aria-label="مشاركة المقال"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button 
                onClick={handlePrint}
                className="hidden sm:block p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors opacity-80 hover:opacity-100 shrink-0"
                title="طباعة المقال"
                aria-label="طباعة المقال"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-red-500 hover:text-white transition-all text-slate-700 dark:text-slate-200 mr-1 shrink-0"
                title="إغلاق المقال"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Article Scrollable Content Area */}
          <div 
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 sm:px-10 md:px-16 py-8 sm:py-12 space-y-8 scroll-smooth"
          >
            {/* Header Title Section */}
            <header className="article-header text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold mb-3 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-[#C69E5A]" />
                <span>مؤسسة رحماء بينهم - التقرير الإنساني</span>
              </div>

              <h1 className="font-cairo font-black text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4 tracking-normal">
                {article.title}
              </h1>

              {/* Author & Publication Meta */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm opacity-80 font-medium pt-2 pb-6 border-b border-slate-200/30">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#C69E5A]" />
                  <span>{article.author || 'المكتب الإعلامي للمؤسسة'}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[var(--brand-green)]" />
                  <span>{article.date}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>{article.views.toLocaleString('ar-SA')} مشاهدة</span>
                </div>
              </div>
            </header>

            {/* Featured Hero Banner */}
            {article.featuredImage && (
              <figure className="my-6 relative rounded-2xl overflow-hidden shadow-md border border-slate-200/30 max-w-3xl mx-auto">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full max-h-[380px] object-cover" 
                />
                <figcaption className="bg-slate-900/80 backdrop-blur-md text-white/90 text-xs p-3 text-center font-medium">
                  صورة ميدانية توثّق إنجازات وتفاصيل المبادرة الإنسانية في موقع التنفيذ.
                </figcaption>
              </figure>
            )}

            {/* Article Content with Dynamic Font Size and Line Height */}
            <article 
              className={`max-w-3xl mx-auto space-y-6 font-cairo transition-all duration-200 article-content ${FONT_SIZE_CLASSES[fontSize]} ${LINE_HEIGHT_CLASSES[lineHeight]}`}
            >
              {/* Lead Paragraph / Summary Intro */}
              <div className={`p-4 sm:p-5 rounded-2xl border ${READER_CARD_THEME_CLASSES[readerTheme]} shadow-xs`}>
                <div className="flex items-center gap-2 mb-2 text-[var(--brand-green)] font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>الموجز التنفيذي:</span>
                </div>
                <p className="m-0 font-medium">
                  {article.excerpt}
                </p>
              </div>

              {/* Main Text Content */}
              {article.content ? (
                <div className="space-y-5">
                  {article.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <>
                  {/* Detailed Narrative default structure */}
                  <h2 className="font-bold text-xl sm:text-2xl pt-2">أبرز محاور المبادرة والأبعاد الإنسانية</h2>
                  <p>
                    تواصل مؤسسة رحماء بينهم تنفيذ برامجها الاستراتيجية المستدامة بهدف تعزيز التكافل الاجتماعي
                    ورفع المعاناة عن الأسر المتضررة في المحافظات والمناطق النائية. تأتي هذه المبادرة امتداداً للرؤية
                    الإنسانية المتكاملة التي تسعى لبناء مجتمع كافٍ ومتعلم ويمتلك مقومات الحياة الكريمة.
                  </p>
                  <p>
                    وقد تضمنت هذه المرحلة دراسات ميدانية مسحية شاملة شملت الفرق الهندسية والفرق الاجتماعية لتقييم الاحتياجات
                    الدقيقة، وضمان وصول الدعم المباشر إلى مستحقيه بكل شفافية وعدالة وفق المعايير المعتمدة دولياً ومحلياً.
                  </p>

                  {/* Quote Pullout */}
                  <div className={`p-5 rounded-2xl border-r-4 my-6 ${READER_CARD_THEME_CLASSES[readerTheme]}`}>
                    <Quote className="w-7 h-7 text-[#C69E5A] mb-2 opacity-80" />
                    <p className="italic font-medium">
                      « إن العمل الإنساني الشامل لا يقتصر على تقديم العون المؤقت، بل يكمن في تمكين الأسر وبناء قدرات الشباب وتحويل الحاجة إلى طاقات إنتاجية مستدامة تثمر خيراً على المجتمع بأكمله. »
                    </p>
                    <div className="text-xs opacity-75 mt-2 font-bold">
                      <span>— من كلمة الإدارة التنفيذية لمؤسسة رحماء بينهم</span>
                    </div>
                  </div>

                  {/* Section: Numbers & Impact */}
                  <h2 className="font-bold text-xl sm:text-2xl pt-2">الأثر الميداني والأرقام المحققة</h2>
                  <p>
                    بفضل الدعم الكريم والمستمر من أهل الخير والشُركاء الداعمين، حققت المبادرة نتائج ملموسة انعكست
                    مباشرة على حياة آلاف المستفيدين، ويمكن تلخيص أبرز الثمار والمؤشرات الميدانية في النقاط التالية:
                  </p>

                  <ul className="list-disc list-inside space-y-2 pr-2">
                    <li>تغطية أكثر من <strong>١٨ مديرية وقرية أشد احتياجاً</strong> وتأمين احتياجاتهم المباشرة.</li>
                    <li>توزيع الحقائب المدرسية والمستلزمات التعليمية على أكثر من <strong>٣,٥٠٠ طالب وطالبة</strong>.</li>
                    <li>تقديم المنح والتسهيلات التمويلية لدعم أكثر من <strong>١٢٠ مشروعاً صغيراً للأسر المنتجة</strong>.</li>
                    <li>تأهيل وتشغيل ٣ آبار مياه صحية تعمل بالطاقة الشمسية المستدامة.</li>
                  </ul>

                  {/* Highlight Callout Box */}
                  <div className={`p-5 rounded-2xl border ${READER_CARD_THEME_CLASSES[readerTheme]}`}>
                    <div className="flex items-center gap-2 font-bold text-sm mb-2 text-[var(--brand-green)]">
                      <ShieldCheck className="w-5 h-5 text-[#C69E5A]" />
                      <span>معايير الشفافية والمساءلة الإنسانية</span>
                    </div>
                    <p className="m-0 text-sm opacity-90">
                      تلتزم مؤسسة رحماء بينهم بنشر كافة التقارير الميدانية والمالية الخاصة بالمشاريع بشكل دوري،
                      مع إتاحة التتبع المباشر للتبرعات لضمان أقصى درجات النزاهة والمصداقية تجاه جميع الداعمين.
                    </p>
                  </div>

                  <p>
                    ونحن إذ نشكر جميع أيادي الخير والشُركاء الذين ساهموا في إنجاح هذا العمل، نؤكد استمرار قوافل الخير
                    وبرامج التمكين في المستقبل القريب لتشمل مناطق جديدة وأسر أخرى تنتظر البصمة الإنسانية المضيئة.
                  </p>
                </>
              )}
            </article>

            {/* Article Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-200/30 flex flex-wrap items-center gap-2 max-w-3xl mx-auto">
                <Tag className="w-4 h-4 opacity-60 ml-1" />
                <span className="text-xs font-bold opacity-75">الوسوم:</span>
                {article.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 hover:bg-slate-500/20 transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Interactive Feedback & CTA Box */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-l from-[var(--brand-green)] to-emerald-800 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 my-8 max-w-3xl mx-auto">
              <div className="space-y-1 text-center sm:text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 text-amber-200 text-xs font-bold mb-1">
                  <Heart className="w-3.5 h-3.5 fill-amber-200" />
                  <span>ساهم في صنع الفارق</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">هل ألهمتك هذه القصة والمبادرة؟</h3>
                <p className="text-xs sm:text-sm text-slate-100 max-w-md">
                  تبرعك البسيط اليوم يساهم في مواصلة هذه البرامج واستدامة الخير لأسر ومستفيدين آخرين.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={toggleLike}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all border ${isLiked ? 'bg-rose-500 text-white border-rose-400' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'}`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                  <span>{likesCount}</span>
                </button>

                {onNavigateDonate && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateDonate();
                    }}
                    className="px-5 py-2.5 bg-[#C69E5A] hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2"
                  >
                    <span>تبرع للمشروع</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
