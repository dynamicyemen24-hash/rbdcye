/* ==========================================================================
 * Accessibility Storage — رحماء بينهم
 * قراءة/كتابة آمنة لمفضّات إمكانية الوصول في localStorage
 * يتعامل مع السيناريوهات: التصفّح الخاص، واجهات غير متاحة، وتخزين تالف
 * ========================================================================== */

import { A11Y_STORAGE_KEY, A11Y_LEGACY_STORAGE_KEY, A11Y_LEGACY_LARGE_TEXT_KEY } from "./accessibility.constants";

import type {
  AccessibilityPreferences,
  AccessibilityPreference,
  PreferenceState,
  StoredAccessibilityPrefs,
} from "./accessibility.types";

/* --------------------------------------------------------------------------
 * قراءة آمنة
 * -------------------------------------------------------------------------- */

/** يقرأ المفضّات المخزّنة مع التعامل مع كل الأخطاء الشائعة بسلاسة */
export function readStoredPrefs(): AccessibilityPreferences {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(A11Y_STORAGE_KEY) : null;
    if (!raw) return defaultPreferencesFromLegacy();
    const parsed = JSON.parse(raw) as StoredAccessibilityPrefs | null;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed.preferences)) return defaultPreferencesFromLegacy();
    return normalizePreferences(parsed.preferences as unknown as Record<string, unknown>);
  } catch {
    return defaultPreferencesFromLegacy();
  }
}

/** التحويل لأقدم تنسيق تخزين (مشروع accessibility.tsx القديم) */
function defaultPreferencesFromLegacy(): AccessibilityPreferences {
  try {
    if (typeof window === "undefined") return allSystem();
    const legacy = window.localStorage.getItem(A11Y_LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as { highContrast?: boolean; largeText?: boolean; reducedMotion?: boolean } | null;
      if (parsed && typeof parsed === "object") {
        // قدّم التفضيلات القديمة كـ "enabled"/"disabled" صريح
        const legacyPrefs: AccessibilityPreferences = allSystem();
        if (typeof parsed.highContrast === "boolean") legacyPrefs.highContrast = parsed.highContrast ? "enabled" : "disabled";
        if (typeof parsed.largeText === "boolean") legacyPrefs.largeText = parsed.largeText ? "enabled" : "disabled";
        if (typeof parsed.reducedMotion === "boolean") legacyPrefs.reducedMotion = parsed.reducedMotion ? "enabled" : "disabled";
        return legacyPrefs;
      }
    }
    const legacyLargeText = window.localStorage.getItem(A11Y_LEGACY_LARGE_TEXT_KEY);
    if (legacyLargeText !== null) {
      const prefs = allSystem();
      prefs.largeText = legacyLargeText === "true" ? "enabled" : "disabled";
      return prefs;
    }
    return allSystem();
  } catch {
    return allSystem();
  }
}

/* --------------------------------------------------------------------------
 * مساعدات تحويل
 * -------------------------------------------------------------------------- */

/** يتأكد أن كل مفاتيح AccessibilityPreferences موجودة بقيم صالحة */
function normalizePreferences(prefs: Record<string, unknown>): AccessibilityPreferences {
  const next: AccessibilityPreferences = allSystem();
  const allowed = new Set(Object.keys(next) as AccessibilityPreference[]);
  for (const key of Object.keys(prefs)) {
    if (!allowed.has(key as AccessibilityPreference)) continue;
    const value = prefs[key];
    if (value === "system" || value === "enabled" || value === "disabled") {
      next[key as AccessibilityPreference] = value as PreferenceState;
    }
  }
  return next;
}

/** إرجاع كائن بجميع التفضيلات Teacher "system" */
export function allSystem(): AccessibilityPreferences {
  return {
    highContrast: "system",
    largeText: "system",
    reducedMotion: "system",
    focusIndicators: "system",
    lineSpacing: "system",
  };
}

/* --------------------------------------------------------------------------
 * كتابة آمنة
 * -------------------------------------------------------------------------- */

/** يحفظ المفضّات في localStorage بصيغة StoredAccessibilityPrefs */
export function writeStoredPrefs(preferences: AccessibilityPreferences): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredAccessibilityPrefs = {
      preferences,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(payload));
    // احتفظ بالمفاتيح القديمة لضمان الاستمرارية مع وحدات قديمة لم تُحدّث بعد
    keepLegacyKeysInSync(preferences);
  } catch {
    // في التصفّح الخاص أو السياقات المقيدة قد يرمي localStorage خطأً
  }
}

/** يزامن المفاتيح القديمة للمشروع مع التفضيلات الجديدة */
function keepLegacyKeysInSync(preferences: AccessibilityPreferences): void {
  try {
    if (typeof window === "undefined") return;
    // 1. إsetting القديم (Boolean-based)
    window.localStorage.setItem(
      A11Y_LEGACY_STORAGE_KEY,
      JSON.stringify({
        highContrast: preferences.highContrast === "enabled",
        largeText: preferences.largeText === "enabled",
        reducedMotion: preferences.reducedMotion === "enabled",
      }),
    );
    // 2. مفتاح large-text القديم
    window.localStorage.setItem(A11Y_LEGACY_LARGE_TEXT_KEY, String(preferences.largeText === "enabled"));
  } catch {
    // تجاهل الأخطاء — الإعدادات الجديدة هي الأصلية
  }
}
