#!/usr/bin/env python3
"""fix_accessibility.py — إصلاح كامل لملفات إمكانية الوصول"""
import os
from pathlib import Path

BASE = Path(r"d:/Projects26/rbdcye/src/accessibility")

def w(name: str, content: str) -> None:
    """اكتب ملفًا بالترميز UTF-8"""
    path = BASE / name
    path.write_text(content, encoding="utf-8")
    print(f"✓ {name}")

# ─────────────────—— constants.ts ───────────────────────────────
w("accessibility.constants.ts", """\
/* ==========================================================================
 * Accessibility Constants — ثوابت إمكانية الوصول
 * ثابت مفتاح التخزين / الواصفات / التسميات المحلية / المفاتيح
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
""")

print("\n✅ تم إصلاح accessibility.constants.ts")
