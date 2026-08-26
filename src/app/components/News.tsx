// src/app/components/News.tsx

import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, ArrowLeft, Eye, Loader2, Heart, Users, 
  Sparkles, Clock,
  Search, Filter, X, ChevronDown, ChevronUp,
  Grid, List, ArrowRight, Lightbulb
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";

import { useDynamicContent } from "@/shared/hooks/useDynamicContent";
import { sanityService, getImageUrl } from "@/shared/services/sanity.service";
import { 
  getSafeImage, 
  handleImageError, 
  getPlaceholderImage,
  getRandomImage
} from "@/utils/imageUtils";

// ============================================
// الأنواع والتصنيفات
// ============================================

interface NewsCategory {
  name: string;
  color: string;
  bg: string;
  icon: string;
  description?: string;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: NewsCategory;
  date: string;
  views: number;
  featuredImage?: string;
  gallery?: string[];
  video?: string;
  status?: string;
  readTime?: number;
  author?: string;
  tags?: string[];
  impact?: string;
  donations?: number;
  beneficiaries?: number;
  comments?: number;
  likes?: number;
  isFallback?: boolean;
}

const NEWS_CATEGORIES_MAP: Record<string, NewsCategory> = {
  'تعليم': { 
    name: 'تعليم', 
    color: '#2563EB', 
    bg: '#EFF6FF',
    icon: '📚',
    description: 'تمكين العلم والمعرفة'
  },
  'إغاثة': { 
    name: 'إغاثة', 
    color: '#E74C3C', 
    bg: '#FEF2F2',
    icon: '🆘',
    description: 'عون وإغاثة المحتاجين'
  },
  'تنمية': { 
    name: 'تنمية', 
    color: '#10B981', 
    bg: '#ECFDF5',
    icon: '🌱',
    description: 'تنمية مستدامة للمجتمع'
  },
  'شراكات': { 
    name: 'شراكات', 
    color: '#7C3AED', 
    bg: '#F5F3FF',
    icon: '🤝',
    description: 'شراكات استراتيجية فاعلة'
  },
  'تدريب': { 
    name: 'تدريب', 
    color: '#F59E0B', 
    bg: '#FFFBEB',
    icon: '🎯',
    description: 'تمكين الكوادر والمتطوعين'
  },
  'رعاية': { 
    name: 'رعاية اجتماعية', 
    color: '#EC4899', 
    bg: '#FDF2F8',
    icon: '💝',
    description: 'رعاية الأسر والأيتام'
  },
  'تطوع': { 
    name: 'تطوع', 
    color: '#14B8A6', 
    bg: '#F0FDFA',
    icon: '🤲',
    description: 'فريق المتطوعين المتميز'
  },
  'عام': { 
    name: 'أخبارنا', 
    color: '#6B7280', 
    bg: '#F3F4F6',
    icon: '📰',
    description: 'آخر أخبارنا'
  },
};

interface NewsPageProps {
  setCurrentPage?: (page: string) => void;
  isFullPage?: boolean;
}

// ============================================
// البيانات الافتراضية الذكية
// ============================================

const INSPIRATIONAL_CONTENT = [
  {
    id: 'vision-1',
    title: 'لماذا اخترنا اسم «رحماء بينهم»؟',
    excerpt: 'لأننا لا نرى المحتاج كرقم في تقرير، بل كإنسان له وجه وقصة وحلم. نؤمن أن الرحمة ليست مشاعر عابرة، بل قرار يومي بالوقوف بجانب من سقط.',
    category: 'عام',
    icon: '🌟',
    impact: 'رسالتنا'
  },
  {
    id: 'message-1',
    title: 'المساعدة لا تنتظر حتى تكتمل الصورة',
    excerpt: 'في اليوم الأول من عملنا، لم يكن لدينا مكتب ولا فريق كامل. كان لدينا قلب يخالج الألم ويد واحدة تصلح ما يمكن إصلاحه. بدأت رحلتنا بسلة غذائية واحدة لعائلة في تعز، وعلمنا أن الخير لا يحتاج الكمال — يبدأ بالتوفر.',
    category: 'إغاثة',
    icon: '💚',
    impact: 'من العمليات'
  },
  {
    id: 'values-1',
    title: 'الشفافية ليست شعاراً — إنها التزام',
    excerpt: 'ننشر تقاريرنا المالية شهرية. لا نخفي ريالاً واحداً. لأن المتبرع الذي وضع ثقته فينا يستحق أن يعرف أين ذهبت ثقته. شفافيتنا ليست اختياراً — إنها عقد بيننا وبين من صدّقنا.',
    category: 'عام',
    icon: '⭐',
    impact: 'شفافية حقيقية'
  },
  {
    id: 'achievement-1',
    title: 'عندما يتعلم طفل في قرية نائية',
    excerpt: 'أحمد من قرية في مرتفعات إب. لم يكن يملك قلمًا. اليوم يكتب خطابه الأول إلى المتبرع الذي غيّر حياته. لم نُطعمه فقط — علّمناه أن يُطعم نفسه. هذا هو الفرق بين الإغاثة والتنمية.',
    category: 'تعليم',
    icon: '📚',
    impact: 'قصة أحمد'
  },
  {
    id: 'relief-1',
    title: 'ليست سلة غذائية — إنها لحظة رجاء',
    excerpt: 'عندما فتحت أم محمد الباب ووجدت السلة، لم تسأل عما بداخلها. سألت: «هل أنتم من الله؟» هذه اللحظة تُذكّرنا لماذا نعمل. المساعدات تنتهي — لكن تلك اللحظة تبقى مع الأسرة.',
    category: 'إغاثة',
    icon: '🆘',
    impact: 'من الميدان'
  },
  {
    id: 'development-1',
    title: 'المتجر الصغير الذي غيّر حياة قرية',
    excerpt: 'امرأة في الحديدة كانت تبيع في الشارع. لها متجر صغير تديره بدعم من برنامج تمكين النساء. ليس ثورياً — لكنه يكفي لأطفال يأكلون ويدرسون. هذا هو التغيير الحقيقي.',
    category: 'تنمية',
    icon: '🌱',
    impact: 'قصة فاطمة'
  },
  {
    id: 'orphan-1',
    title: 'ليس يتيمًا — بل طالب في انتظار مستقبله',
    excerpt: 'عمر فقد أباه في الصراع. كنا نظن أن كفالته تعني مبلغاً مالياً. اكتشفنا أنه يحتاج من يسأله: كيف حالك اليوم؟ برنامج يربطه بمُكلّف يتابع دراسته وصحته أسبوعياً.',
    category: 'رعاية',
    icon: '💝',
    impact: 'رعاية شاملة'
  },
  {
    id: 'volunteer-1',
    title: 'المتطوع الذي لم يكن يعلم أنه يبني وطنه',
    excerpt: 'خالد كان طالب جامعي ملّ من الجلوس في البيت. سجّل في برنامج التدريب والتطوع. اليوم يقود فريقاً في المحافظة. لم يكن يعلم أنه يبني وطنه — جاء لأنهم كانوا بحاجة ليد. ووجد نفسه.',
    category: 'تطوع',
    icon: '🤲',
    impact: 'قصة خالد'
  },
  {
    id: 'wisdom-1',
    title: 'الآية التي لا ننساها',
    excerpt: '"وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ" — هذه ليست آية في كتاب فقط. إنها بطاقة هويتنا. كل مشروع نبدأه، كل أسرة نزورها، كل طفل نُعلمه — نسأل: أين الرحمة هنا؟',
    category: 'عام',
    icon: '📖',
    impact: 'قيمنا'
  },
  {
    id: 'hope-1',
    title: 'الابتسامة التي لا تُكتب في التقارير',
    excerpt: 'ليس لدينا مقياس يقيس لحظة سعادة طفل عندما يرى حقيبته المدرسية الجديدة. ولا إحصاء يلتقط دعاء أمwhen she says "الحمد لله". لكن هذه اللحظات هي النجاح الحقيقي.',
    category: 'عام',
    icon: '✨',
    impact: 'ما لا يُقاس'
  },
  {
    id: 'future-1',
    title: 'ما نبنيه اليوم هو اليمن الذي نتخيله',
    excerpt: 'لسنا مؤسسة تقدم المساعدات فقط. نحن بنّاؤون — نبني قدرات، نبني وعي، نبني ثقة. كل طفل نعلمه يصبح معلماً. كل أسرة ندعمها تصبح سندًا لجيرانها. هذا هو التأثير الذي لا يتوقف.',
    category: 'تنمية',
    icon: '🌟',
    impact: 'تأثير مستدام'
  }
];

// ============================================
// خدمة ذكية لإدارة الأخبار
// ============================================

class SmartNewsService {
  private fallbackItems: NewsItem[] = [];

  constructor() {
    this.initializeFallback();
  }

  private initializeFallback() {
    this.fallbackItems = INSPIRATIONAL_CONTENT.map((content, index) => {
      const category = NEWS_CATEGORIES_MAP[content.category] || NEWS_CATEGORIES_MAP['عام'];
      const dates = [
        '15 يونيو 2026', '10 يونيو 2026', '5 يونيو 2026',
        '28 مايو 2026', '20 مايو 2026', '15 مايو 2026'
      ];
      
      return {
        id: content.id || `fallback-${index}`,
        title: content.title,
        excerpt: content.excerpt,
        content: content.excerpt + ' نعمل معاً لتحقيق الخير والبركة في المجتمع.',
        category: category,
        date: dates[index % dates.length],
        views: Math.floor(Math.random() * 500) + 100,
        featuredImage: getRandomImage(content.category),
        status: 'published',
        readTime: Math.ceil(content.excerpt.length / 200) + 1,
        author: 'فريق رحماء بينهم',
        tags: ['خير', 'تنمية', 'مجتمع', 'إنسانية'],
        impact: content.impact || 'أثر إيجابي',
        beneficiaries: Math.floor(Math.random() * 500) + 50,
        comments: Math.floor(Math.random() * 30),
        likes: Math.floor(Math.random() * 100),
        isFallback: true,
      };
    });
  }

  async getNews(limit?: number): Promise<NewsItem[]> {
    try {
      const sanityNews = await this.fetchFromSanity();
      
      if (sanityNews && sanityNews.length > 0) {
        const mixed = this.mixWithFallback(sanityNews);
        return limit ? mixed.slice(0, limit) : mixed;
      }
      
      return this.getFallbackNews(limit);
    } catch {
      return this.getFallbackNews(limit);
    }
  }

  private async fetchFromSanity(): Promise<any[]> {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );
      
      const newsPromise = sanityService.getNews();
      const result = await Promise.race([newsPromise, timeoutPromise]);
      return result || [];
    } catch {
      return [];
    }
  }

  private mixWithFallback(sanityNews: any[]): NewsItem[] {
    const normalized = sanityNews.map((n: any) => ({
      id: n._id || `sanity-${Math.random()}`,
      title: n.title || 'خبر جديد',
      excerpt: n.excerpt || 'تابعوا آخر أخبارنا',
      content: n.content || n.excerpt || '',
      category: NEWS_CATEGORIES_MAP[n.category] || NEWS_CATEGORIES_MAP['عام'],
      date: n.publishDate ? new Date(n.publishDate).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) : new Date().toLocaleDateString('ar-SA'),
      views: n.views || Math.floor(Math.random() * 200) + 50,
      featuredImage: getSafeImage(
        n.mainImage ? getImageUrl(n.mainImage) : undefined,
        n.title,
        n.category,
        true
      ),
      status: n.status || 'published',
      readTime: Math.ceil((n.content?.length || n.excerpt?.length || 0) / 200) || 2,
      author: n.author || 'فريق رحماء بينهم',
      tags: n.tags || ['خير', 'تنمية'],
      impact: n.impact || 'أثر إيجابي',
      beneficiaries: n.beneficiaries || Math.floor(Math.random() * 300) + 50,
      comments: n.comments || Math.floor(Math.random() * 20),
      likes: n.likes || Math.floor(Math.random() * 80),
      isFallback: false,
    }));

    const shuffledFallback = this.shuffleArray([...this.fallbackItems]);
    const fallbackToAdd = shuffledFallback.slice(0, Math.min(3, this.fallbackItems.length));
    
    return [...normalized, ...fallbackToAdd];
  }

  getFallbackNews(limit?: number): NewsItem[] {
    const shuffled = this.shuffleArray([...this.fallbackItems]);
    return limit ? shuffled.slice(0, limit) : shuffled;
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

const smartNewsService = new SmartNewsService();

// ============================================
// 1. شريط الأخبار العاجلة (المتحرك)
// ============================================

const BreakingNewsTicker = memo(({ items }: { items: NewsItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="bg-[var(--brand-green)] text-white py-2.5 overflow-hidden shadow-lg border-b-4 border-[var(--brand-green-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-sm font-bold whitespace-nowrap">
              {items.some(item => !item.isFallback) ? 'عاجل' : 'نشاطاتنا'}
            </span>
          </div>

          <div className="flex-1 overflow-hidden relative h-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center"
              >
                <span className="text-sm md:text-base font-medium truncate">
                  {items[currentIndex]?.title}
                </span>
                <span className="hidden md:inline mx-3 text-white/40">|</span>
                <span className="hidden md:inline text-xs text-white/80">
                  {items[currentIndex]?.category.icon} {items[currentIndex]?.category.name}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-shrink-0 flex items-center gap-1">
            {items.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>

          <Heart className="w-4 h-4 text-white/60 flex-shrink-0 animate-pulse" />
        </div>
      </div>
    </div>
  );
});

BreakingNewsTicker.displayName = 'BreakingNewsTicker';

// ============================================
// 2. بطاقة الخبر الكاملة
// ============================================

const FullNewsCard = memo(({ item, onClick }: { item: NewsItem; onClick: () => void }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes || 0);
  const [imageError, setImageError] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleImageErrorLocal = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    const placeholder = getPlaceholderImage(item.title, item.category.name);
    handleImageError(e, placeholder);
  };

  const imageSrc = imageError 
    ? getPlaceholderImage(item.title, item.category.name)
    : getSafeImage(item.featuredImage, item.title, item.category.name, true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`group bg-white rounded-2xl overflow-hidden shadow-lg border ${
        item.isFallback ? 'border-[#10B981]/20' : 'border-[var(--border)]'
      } hover:shadow-2xl transition-all duration-400 cursor-pointer relative`}
      onClick={onClick}
    >
      {item.isFallback && (
        <div className="absolute top-2 left-2 z-20 bg-[var(--success)] text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          مستوحى من رسالتنا
        </div>
      )}
      
      <div className="relative h-56 overflow-hidden bg-[var(--secondary)]">
        <img
          src={imageSrc}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onError={handleImageErrorLocal}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-4 right-4 flex gap-2 flex-wrap">
          <span
            className="px-3 py-1.5 rounded-full text-white shadow-lg"
            style={{ 
              fontSize: "0.7rem", 
              fontWeight: 700, 
              background: item.category.color,
              boxShadow: `0 4px 15px ${item.category.color}40`
            }}
          >
            {item.category.icon} {item.category.name}
          </span>
          {item.impact && (
            <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
              <Heart className="w-3 h-3 inline ml-1" />
              {item.impact}
            </span>
          )}
        </div>

        {item.beneficiaries && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{item.beneficiaries.toLocaleString()} مستفيد</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-[var(--foreground)] line-clamp-2 group-hover:text-[var(--success)] transition-colors">
          {item.title}
        </h3>

        <p className="text-[var(--muted-foreground)] text-sm line-clamp-2 my-2">
          {item.excerpt}
        </p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[var(--secondary)] px-2 py-0.5 rounded-full text-[var(--muted-foreground)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 text-[var(--muted-foreground)] text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {item.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {item.readTime || 2} د
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {item.views}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isLiked ? 'text-[var(--success)]' : 'text-[var(--muted-foreground)]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#10B981]' : ''}`} />
              {likes}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

FullNewsCard.displayName = 'FullNewsCard';

// ============================================
// 3. صفحة الأخبار الكاملة - المكون الرئيسي
// ============================================

export const News = ({ setCurrentPage = () => {}, isFullPage: _isFullPage = false }: NewsPageProps) => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPageState] = useState(1);
  const [totalBeneficiaries, setTotalBeneficiaries] = useState(0);
  const [showInspirational, setShowInspirational] = useState(false);
  const [contentSource, setContentSource] = useState<'static' | 'cache' | 'sanity' | 'hybrid'>('static');
  const [showDevBadge, setShowDevBadge] = useState(false);
  const itemsPerPage = 6;

  // Use dynamic content hook
  const { data: dynamicNews = [], isLoading: dynamicLoading, source } = useDynamicContent<NewsItem>({
    contentType: 'news',
    enableRealtime: false,
    refreshInterval: 300000
  });

  // Show dev badge in development mode
  useEffect(() => {
    if (import.meta.env?.DEV) {
      setShowDevBadge(true);
    }
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      
      // ContentManager always returns data (static defaults guaranteed)
      if (dynamicNews.length > 0) {
        const allItems = dynamicNews.map((n: any) => ({
          ...n,
          isFallback: source === 'static'
        }));
        setItems(allItems);
        setFilteredItems(allItems);
        setContentSource(source);
        setShowInspirational(false);
      } else {
        // Should rarely happen — ContentManager guarantees static fallback
        const allItems = await smartNewsService.getNews();
        setItems(allItems);
        setFilteredItems(allItems);
        setContentSource('static');
        setShowInspirational(allItems.every(item => item.isFallback));
      }
      
      const total = items.reduce((sum, item) => sum + (item.beneficiaries || 0), 0);
      setTotalBeneficiaries(total);
      
    } catch {
      const fallback = await smartNewsService.getFallbackNews();
      setItems(fallback);
      setFilteredItems(fallback);
      setContentSource('static');
      setShowInspirational(true);
    } finally {
      setLoading(false);
    }
  }, [dynamicNews, source]);
  
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchNews();
    }
  }, [fetchNews]);

  useEffect(() => {
    let result = items;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory !== 'الكل') {
      result = result.filter(item => item.category.name === selectedCategory);
    }
    
    setFilteredItems(result);
    setCurrentPageState(1);
  }, [searchQuery, selectedCategory, items]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage, itemsPerPage]);

  const categories = useMemo(() => {
    const unique = ['الكل', ...new Set(items.map(item => item.category.name))];
    return unique;
  }, [items]);

  const breakingNews = useMemo(() => items.slice(0, 5), [items]);

  // Dev indicator badge
  const DevBadge = showDevBadge ? (
    <div className="fixed top-4 left-4 z-50 bg-purple-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          contentSource === 'sanity' ? 'bg-green-400' : 
          contentSource === 'hybrid' ? 'bg-blue-400' : 'bg-yellow-400'
        }`} />
        <span>{contentSource === 'sanity' ? 'Sanity CMS' : contentSource === 'hybrid' ? 'Hybrid' : 'Static Content'}</span>
      </div>
    </div>
  ) : null;

  if (loading || dynamicLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-[var(--secondary)]" style={{ direction: "rtl" }}>
        {DevBadge}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--success)] rounded-full blur-2xl opacity-20 animate-pulse" />
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin text-[var(--success)]" />
                <div className="absolute inset-0 animate-ping rounded-full border-2 border-[var(--success)]/20" />
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className="w-2 h-2 bg-[var(--success)] rounded-full animate-bounce" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="text-[var(--muted-foreground)] animate-pulse text-lg">
              جاري تحميل أخبار المؤسسة...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0FDF4] to-[var(--secondary)] relative overflow-hidden" style={{ direction: "rtl" }}>
      <div className="absolute inset-0 pattern-khatam-light pointer-events-none" />
      {DevBadge}
      
      {breakingNews.length > 0 && <BreakingNewsTicker items={breakingNews} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
            <div className="inline-flex items-center gap-3 bg-[var(--success)]/10 px-6 py-2 rounded-full mb-4">
            <Heart className="w-5 h-5 text-[var(--success)]" />
            <span className="text-[var(--success)] font-semibold">رحماء بينهم</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--foreground)] mb-3">
            {showInspirational ? 'من الميدان' : 'أخبارنا'}
            <span className="text-[var(--success)] block md:inline"> {showInspirational ? 'قصص تلهم' : 'وفعالياتها'}</span>
          </h1>
          
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            {showInspirational 
              ? 'قصص حقيقية من عملنا الميداني — ليس أرقاماً في تقرير، بل لحظات تلمس القلوب'
              : 'تابعوا آخر المستجدات والإنجازات والفعاليات التي تقوم بها مؤسسة رحماء بينهم'
            }
          </p>
          
          {showInspirational && (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full border border-amber-200">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm">نعمل على إضافة أخبار جديدة قريباً</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--border)] text-center">
            <div className="text-[var(--success)] text-2xl font-bold">{items.length}</div>
            <div className="text-[var(--muted-foreground)] text-sm">
              {showInspirational ? 'رسائل ملهمة' : 'إجمالي الأخبار'}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--border)] text-center">
            <div className="text-[var(--success)] text-2xl font-bold">{totalBeneficiaries.toLocaleString()}</div>
            <div className="text-[var(--muted-foreground)] text-sm">إجمالي المستفيدين</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--border)] text-center">
            <div className="text-[var(--success)] text-2xl font-bold">{categories.length - 1}</div>
            <div className="text-[var(--muted-foreground)] text-sm">التصنيفات</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--border)] text-center">
            <div className="text-[var(--success)] text-2xl font-bold">
              {items.reduce((acc, item) => acc + (item.views || 0), 0).toLocaleString()}
            </div>
            <div className="text-[var(--muted-foreground)] text-sm">إجمالي المشاهدات</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--border)] mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder={showInspirational ? 'ابحث في الرسائل الملهمة...' : 'ابحث في الأخبار...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-xl py-2.5 pr-10 pl-4 focus:outline-none focus:border-[#10B981] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--secondary)] rounded-xl hover:bg-[var(--border)] transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">تصفية</span>
                {showFilters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <div className="flex bg-[var(--secondary)] rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-[var(--success)]' : 'text-[var(--muted-foreground)]'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-[var(--success)]' : 'text-[var(--muted-foreground)]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-[var(--border)] mt-4">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                          selectedCategory === category
                            ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30'
                            : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                        }`}
                      >
                        {category === 'الكل' ? '📰 الكل' : category}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {currentItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">لا توجد نتائج</h3>
            <p className="text-[var(--muted-foreground)]">
              {showInspirational 
                ? 'جاري إضافة المزيد من الرسائل الملهمة قريباً'
                : 'لم يتم العثور على أخبار تطابق معايير البحث'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('الكل');
              }}
              className="mt-4 text-[#10B981] hover:underline"
            >
              عرض جميع المحتويات
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {currentItems.map((item) => (
              <FullNewsCard
                key={item.id}
                item={item}
                onClick={() => setCurrentPage('news-detail')}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-2 mt-10"
          >
            <button
              onClick={() => setCurrentPageState(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white border border-[var(--border)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPageState(pageNum)}
                  className={`min-w-[40px] px-3 py-2 rounded-xl transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30'
                      : 'bg-white border border-[var(--border)] hover:bg-[var(--secondary)]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPageState(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white border border-[var(--border)] hover:bg-[var(--secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default memo(News);