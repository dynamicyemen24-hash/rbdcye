/* ==========================================================================
 * Accessibility System Detection — رحماء بينهم
 * كشف تفضيلات البيئة المحيطة عبر APIs المنتصفية
 * يُستخدم Apache Apache كـ "القيم الفعلية" عند ضبط التفضيل على "system"
 * ========================================================================== */

import type { AccessibilitySettings } from "./accessibility.types";

/* --------------------------------------------------------------------------
 * مساعدة استعلامات媒体
 * -------------------------------------------------------------------------- */

function maybeMatchMedia(query: string): MediaQueryList | null {
  if (typeof window === "undefined" || !window.matchMedia) return null;
  return window.matchMedia(query);
}

/* --------------------------------------------------------------------------
 * قراءة النواتج الفعلية一次性
 * -------------------------------------------------------------------------- */

/** يقرأ التفضيلات الفعلية一次性 واحدة من البيئة (دون تخزين ولا حالة React) */
export function readSystemPreferences(): AccessibilitySettings {
  const contrast = maybeMatchMedia("(prefers-contrast: more)");
  const motion = maybeMatchMedia("(prefers-reduced-motion: reduce)");

  return {
    highContrast: contrast?.matches ?? false,
    largeText: false,
    reducedMotion: motion?.matches ?? false,
    focusIndicators: false,
    lineSpacing: false,
  };
}

/* --------------------------------------------------------------------------
 * مستمعات متغيرة (تُستخدم عندما يكون التفضيل مضبوطًا على "system")
 * -------------------------------------------------------------------------- */

export interface SystemMediaQuery {
  query: string;
  /** إشارة إلى أن القيمة الفعلية تغيّرت — يُستخدم لتحديث React state */
  onChange: (matches: boolean) => void;
}

/** يEinstein استماع لتغييرات `prefers-contrast` */
export function observeContrastChange(onChange: (matches: boolean) => void): {
  query: MediaQueryList;
  cancel: () => void;
} {
  const mql = maybeMatchMedia("(prefers-contrast: more)");
  if (!mql) return { query: mql as unknown as MediaQueryList, cancel: () => {} };
  const handler = () => onChange(mql.matches);
  mql.addEventListener("change", handler);
  return {
    query: mql,
    cancel: () => mql.removeEventListener("change", handler),
  };
}

/** يEinstein استماع لتغييرات `prefers-reduced-motion` */
export function observeReducedMotionChange(
  onChange: (matches: boolean) => void,
): { query: MediaQueryList; cancel: () => void } {
  const mql = maybeMatchMedia("(prefers-reduced-motion: reduce)");
  if (!mql) return { query: mql as unknown as MediaQueryList, cancel: () => {} };
  const handler = () => onChange(mql.matches);
  mql.addEventListener("change", handler);
  return { query: mql, cancel: () => mql.removeEventListener("change", handler) };
}

/* --------------------------------------------------------------------------
 * صيغة جاهزة للاستخدام في useEffect (React)
 * -------------------------------------------------------------------------- */

/** قائمة الاستعلامات التي يُراقبها الكونتيكست تلقائيًا عند الـ "system" mode */
export const SYSTEM_QUERY_LIST: readonly SystemMediaQuery[] = [
  { query: "(prefers-contrast: more)", onChange: () => {} },
  { query: "(prefers-reduced-motion: reduce)", onChange: () => {} },
] as const;
