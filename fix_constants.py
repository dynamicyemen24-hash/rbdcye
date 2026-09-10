# -*- coding: utf-8 -*-
from pathlib import Path
Path(r"d:\Projects26\rbdcye\src\accessibility\accessibility.constants.ts").write_text("""/* ==========================================================================
 * Accessibility Constants - رحماء بينهم
 * قيم ثابتة للسلوك / المصطلحات / المفاتيح / التسميات المحلية
 * ========================================================================== */

import type { AccessibilityPreference, AccessibilityPreferences } from "./accessibility.types";

export const A11Y_STORAGE_KEY = "accessibility-prefs";
export const A11Y_LEGACY_LARGE_TEXT_KEY = "a11y-large-text";
export const A11Y_LEGACY_STORAGE_KEY = "app-accessibility-settings";
export const SCREEN_READER_ANNOUNCE_DURATION_MS = 1000;
export const SKIP_LINK_FOCUS_DELAY_MS = 50;

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  highContrast: "system",
  largeText: "system",
  reducedMotion: "system",
  focusIndicators: "system",
  lineSpacing: "system",
};

export const TOOLBAR_LABELS = {
  toggle: "أدوات إمكانية الوصول",
  highContrast: "تباين عالٍ",
  largeText: "نصوص أكبر",
  reducedMotion: "تقليل الحركات",
  focusIndicators: "مؤشرات تركيز واضحة",
  lineSpacing: "تباعد أسطر أكبر",
  resetAll: "إعادة الكل إلى النظام",
} as const;

export const PREFERENCE_DESCRIPTIONS: Record<AccessibilityPreference, string> = {
  highContrast: "يبرز الحدود والنصوص ويكثف التباين للمحتوى الأساسي.",
  largeText: "يرفع حجم الخطوط الأساسية بنسبة 20% ويعيد قياس العناوين بما يتناسب.",
  reducedMotion: "يؤدي إلى إيقاف جميع الحركات غير الضرورية ويبقى الانتقالات سريعة واحدة.",
  focusIndicators: "يبرز الإطار الخارجي لمؤشر التركيز عند التفاعل بلوحة المفاتيح.",
  lineSpacing: "يزيد تباعد الأسطر داخل الفقرات والعناوين لتسهيل القراءة.",
};
""", encoding="utf-8")
print("OK: accessibility.constants.ts")
