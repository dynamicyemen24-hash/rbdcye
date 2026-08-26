// src/utils/imageUtils.ts

/**
 * أدوات معالجة الصور للمؤسسة
 * توفر صور افتراضية ذكية في حالة عدم توفر صور من لوحة التحكم
 */

// ألوان المؤسسة حسب التصنيفات
const CATEGORY_COLORS: Record<string, string> = {
  'تعليم': '2563EB',
  'إغاثة': 'E74C3C',
  'تنمية': '10B981',
  'شراكات': '7C3AED',
  'تدريب': 'F59E0B',
  'رعاية': 'EC4899',
  'تطوع': '14B8A6',
  'عام': '6B7280'
};

// أيقونات التصنيفات
const CATEGORY_ICONS: Record<string, string> = {
  'تعليم': '📚',
  'إغاثة': '🆘',
  'تنمية': '🌱',
  'شراكات': '🤝',
  'تدريب': '🎯',
  'رعاية': '💝',
  'تطوع': '🤲',
  'عام': '📰'
};

// صور افتراضية محلية بهوية المؤسسة (زخارف إسلامية وثقافة يمنية)
// تُستخدم فقط عند غياب صورة من لوحة التحكم أو Sanity
const HIGH_QUALITY_FALLBACK_IMAGES = [
  '/images/defaults/project-relief.svg',       // إغاثة وسلال غذائية
  '/images/defaults/project-education.svg',    // تعليم وكتاب
  '/images/defaults/project-water.svg',        // مياه وآبار
  '/images/defaults/project-development.svg',  // تنمية وتمكين
  '/images/defaults/story-community.svg',      // مجتمع وتطوع
  '/images/defaults/story-woman.svg',          // تمكين المرأة
  '/images/defaults/story-quran.svg',          // تحفيظ قرآني
  '/images/defaults/project-infrastructure.svg', // بنية تحتية ومساجد
];

// صور خاصة بالمؤسسة
const CUSTOM_FALLBACK_IMAGES = [
  '/images/defaults/project-default.svg',
  '/images/defaults/project-relief.svg',
  '/images/defaults/project-water.svg',
  '/images/defaults/project-education.svg',
  '/images/defaults/story-default.svg',
];

// مولد أرقام عشوائية ثابت لتجنب المشاكل في render
let placeholderCounter = 0;
let imageCounter = 0;

/**
 * الحصول على صورة placeholder مع نص مخصص
 * تستخدم خدمات متعددة كبدائل لتجنب المشاكل
 */
export const getPlaceholderImage = (
  text: string = 'رحماء بينهم',
  category?: string,
  width: number = 800,
  height: number = 600
): string => {
  // اختيار اللون حسب التصنيف
  const color = category && CATEGORY_COLORS[category] 
    ? CATEGORY_COLORS[category] 
    : '10B981';
  
  // تنسيق النص
  const cleanText = text
    .substring(0, 20)
    .replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, ' ')
    .trim();
  
  const encodedText = encodeURIComponent(cleanText || 'رحماء بينهم');
  
  // استخدام عداد ثابت بدلاً من Math.random لتجنب المشاكل
  placeholderCounter = (placeholderCounter + 1) % (HIGH_QUALITY_FALLBACK_IMAGES.length + 3);
  
  // الصور الافتراضية المحلية بهوية المؤسسة (الأولوية دائماً)
  const placeholders = [
    ...HIGH_QUALITY_FALLBACK_IMAGES,
    `https://placehold.co/${width}x${height}/${color}/FFFFFF/png?text=${encodedText}`,
  ];
  
  // استخدام العداد للاختيار
  return placeholders[placeholderCounter] || HIGH_QUALITY_FALLBACK_IMAGES[0];
};

/**
 * الحصول على صورة افتراضية عشوائية عالية الجودة
 * تستخدم عداد ثابت لتجنب المشاكل في render
 */
export const getRandomImage = (category?: string): string => {
  // استخدام العداد الثابت بدلاً من Math.random
  imageCounter = (imageCounter + 1) % HIGH_QUALITY_FALLBACK_IMAGES.length;
  
  // إذا كان هناك تصنيف، حاول العثور على صورة مناسبة لنوع المشروع
  if (category) {
    const categoryImages: Record<string, string[]> = {
      'تعليم': [
        '/images/defaults/sector-education.svg',
        '/images/defaults/story-quran.svg',
      ],
      'إغاثة': [
        '/images/defaults/sector-relief.svg',
        '/images/defaults/project-water.svg',
      ],
      'تنمية': [
        '/images/defaults/sector-empowerment.svg',
        '/images/defaults/project-development.svg',
      ],
      'تمكين': [
        '/images/defaults/sector-empowerment.svg',
        '/images/defaults/story-woman.svg',
      ],
      'زراعة': [
        '/images/defaults/sector-agriculture.svg',
      ],
      'رعاية': [
        '/images/defaults/story-default.svg',
        '/images/defaults/story-woman.svg',
      ],
      'شراكات': ['/images/defaults/partner-1.svg'],
      'تدريب': ['/images/defaults/story-community.svg'],
      'دعوة': ['/images/defaults/sector-dawah.svg', '/images/defaults/project-dawah.svg'],
    };
    
    const images = categoryImages[category] || HIGH_QUALITY_FALLBACK_IMAGES;
    return images[imageCounter % images.length];
  }
  
  // استخدام العداد الثابت
  return HIGH_QUALITY_FALLBACK_IMAGES[imageCounter];
};

/**
 * الحصول على صورة آمنة مع fallback ذكي
 */
export const getSafeImage = (
  imageUrl?: string,
  title?: string,
  category?: string,
  usePlaceholder: boolean = true
): string => {
  // إذا كانت الصورة موجودة، استخدمها
  if (imageUrl && imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // إذا كانت الصورة محلية (تبدأ بـ /)
  if (imageUrl && imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // استخدام صورة عشوائية عالية الجودة
  if (!usePlaceholder) {
    return getRandomImage(category);
  }
  
  // استخدام placeholder مع النص
  return getPlaceholderImage(title || 'رحماء بينهم', category);
};

/**
 * معالج خطأ تحميل الصور
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackImage?: string
): void => {
  const img = event.currentTarget;
  if (img.src !== fallbackImage) {
    // محاولة استخدام صورة بديلة
    if (fallbackImage) {
      img.src = fallbackImage;
    } else {
      // استخدام placeholder
      img.src = getPlaceholderImage('صورة غير متوفرة');
    }
  }
};

/**
 * الحصول على صورة مصغرة (Thumbnail)
 */
export const getThumbnail = (url: string, size: number = 300): string => {
  if (!url) return getPlaceholderImage('', undefined, size, size);
  
  // إذا كانت من Unsplash، أضف معامل الحجم
  if (url.includes('unsplash.com')) {
    return url.replace(/w=\d+/, `w=${size}`).replace(/h=\d+/, `h=${size}`);
  }
  
  return url;
};

/**
 * قائمة الصور الموصى بها للمؤسسة
 */
export const RECOMMENDED_IMAGES = {
  hero: '/images/defaults/about-hero.svg',
  education: '/images/defaults/project-education.svg',
  relief: '/images/defaults/project-relief.svg',
  development: '/images/defaults/project-development.svg',
  partnership: '/images/defaults/partner-3.svg',
  volunteer: '/images/defaults/story-community.svg',
  children: '/images/defaults/story-default.svg',
  community: '/images/defaults/story-man.svg',
};

export default {
  getPlaceholderImage,
  getRandomImage,
  getSafeImage,
  handleImageError,
  getThumbnail,
  RECOMMENDED_IMAGES,
};