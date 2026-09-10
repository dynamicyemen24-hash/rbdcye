/* ==========================================================================
 * Accessibility Constants — رحماء بينهم
 * قيم ثابتة للسلوك / المصطلحات / المفاتيح / التسميات المحلية
 * ========================================================================== */

import type { AccessibilityPreferences, AccessibilityPreference } from "./accessibility.types";

/** مفتاح التخزين للوحدة الجديدة */
export const A11Y_STORAGE_KEY = "accessibility-prefs";

/** مفتاح قديم للتوافق مع `src/components/Accessibility.tsx` القائم */
export const A11Y_LEGACY_LARGE_TEXT_KEY = "a11y-large-text";

/** مفتاح قديم آخر للتوافق مع `src/components/Accessibility.tsx` */
export const A11Y_LEGACY_STORAGE_KEY = "app-accessibility-settings";

/** المدة الزمنية (مللي ثانية) قبل إزالة إعلان قارئ الشاشة من DOM */
export const SCREEN_READER_ANNOUNCE_DURATION_MS = 1000;

/** مدة الانتظار قبل التركيز على `main#main-content` بعد فتح SkipLink */
export const SKIP_LINK_FOCUS_DELAY_MS = 50;

/** القيم الافتراضية لكل تفضيل (أي ما يحدث عندما لا يوجد تحيز صريح وهو "system") */
export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  highContrast: "system",
  largeText: "system",
  reducedMotion: "system",
  focusIndicators: "system",
  lineSpacing: "system",
};

/** أسماء عناصر التحكم في شريط الأدوات (عربي) */
export const TOOLBAR_LABELS = {
  toggle: "أدوات إمكانية الوصول",
  highContrast: "تباين عالٍ",
  largeText: "نصوص أكبر",
  reducedMotion: "تقليل الحركات",
  focusIndicators: "مؤشرات تركيز واضحة",
  lineSpacing: "تباعد أسطر أكبر",
  resetAll: "إعادة الكل إلى النظام",
} as const;

/** وصف اختياري يُ<|special_1967|>أ-consuming components في حال أردت إضافة tooltips بالسياق */
export const PREFERENCE_DESCRIPTIONS: Record<AccessibilityPreference, string> =
  {
    highContrast:
      "يُبرز الحدود والنصوص ويُ 당기법인세와 μικّر التباين للمحتوى الأساسي.",
    largeText:
      "يرفع حجم الخطوط الأساسية بنسبة 20% ويعيد قياس العناوين بما يتناسب.",
    reducedMotion:
      "يؤدي إلى إيقاف جميع الحركات غير الضرورية ويبقى الانتقالات سريعة واحدة.",
    focusIndicators:
      "يبرز الإطار الخارجي لمؤشر التركيز عند التفاعل بلوحة المفاتيح.",
    lineSpacing:
      "يزيد تباعد الأسطر داخل الفقرات والعناوين لتسهيل القراءة.",
  };
