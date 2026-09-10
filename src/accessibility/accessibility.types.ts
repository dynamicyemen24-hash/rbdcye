/* ==========================================================================
 * Accessibility Types — رحماء بينهم
 * مشير إلى WCAG 2.1 / ARIA Authoring Practices Guide (APG)/current
 * كلّ القيم هنا هي Effective Values (بعد تطبيق توقعات المستخدم + system)
 * ========================================================================== */

/** الخيارات الممكنة لكل تفضيل: اتبع النظام / تشغيل صريح / إيقاف صريح */
export type PreferenceState = "system" | "enabled" | "disabled";

/** مجمل أنواع التفضيلات القابلة للضبط */
export type AccessibilityPreference =
  | "highContrast"
  | "largeText"
  | "reducedMotion"
  | "focusIndicators"
  | "lineSpacing";

/** الإعدادات الفعلية التي يشتقّها النظام من التفضيلات والتوقعات البيئية */
export interface AccessibilitySettings {
  /** تباين عالٍ — يفعّل/يطفّئ الطبقة .high-contrast على :root */
  highContrast: boolean;
  /** حجم خط أكبر بنسبة 120% مع إعادة تجريد خطوط العناوين */
  largeText: boolean;
  /** الحد من الحركات — يحول كل الـ animation/transition إلى آخر واحد سريع */
  reducedMotion: boolean;
  /** مؤشرات تركيز أكثر وضوحًا (.focus-ring-enhanced) */
  focusIndicators: boolean;
  /** تباعد سطور أكبر (1.8 بدل 1.5 في العناوين والنصوص الأساسية) */
  lineSpacing: boolean;
}

/** حالة التفضيلات الخام التي يخزنها المستخدم (تُترجم لاحقًا إلى Settings) */
export interface AccessibilityPreferences {
  highContrast: PreferenceState;
  largeText: PreferenceState;
  reducedMotion: PreferenceState;
  focusIndicators: PreferenceState;
  lineSpacing: PreferenceState;
}

/** وصف السياق الخاص بـ React — هو ما يحصل عليه المكونات عن طريق useAccessibility() */
export interface AccessibilityContextValue {
  /** القيم الفعلية الحالية (مُجمّعة) */
  settings: AccessibilitySettings;
  /** حالة التفضيلات كما وضّعها المستخدم (اظهرها في الـ Toolbar كمفاتيح toggle) */
  preferences: AccessibilityPreferences;
  /** ضبط تفضيل معين — "system" يعني يعود ليطابق البيئة */
  setPreference: (key: AccessibilityPreference, state: PreferenceState) => void;
  /** إعادة تفضيل واحد إلى حالة "system" */
  resetPreference: (key: AccessibilityPreference) => void;
  /** إعادة كل التفضيلات إلى حالتها الافتراضية (system) */
  resetAll: () => void;
  /** إعلان صوتي لقارئ الشاشة */
  announce: (message: string, priority?: "polite" | "assertive") => void;
  /** إعادة تركيز المؤشر إلى العنصر الرئيسي (main#main-content) */
  focusMain: () => void;
  /** إنشاء فخّ تركيز داخل حاوية (لـ Modal / Drawer / Menu) */
  createFocusTrap: (container: HTMLElement) => () => void;
}

/** ما يُخزّن فعليًا في localStorage (مُبسّط مقارنة بالأنواع الداخلية) */
export interface StoredAccessibilityPrefs {
  /** تفضيلات المستخدم */
  preferences: AccessibilityPreferences;
  /** الوقت الخاص لضبط settings */
  updatedAt: number;
}

