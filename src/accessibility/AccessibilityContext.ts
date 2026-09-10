/* ==========================================================================
 * Accessibility Context — رحماء بينهم
 * قيمة السياق التي يستهلكها مكونات الوحدة عبر useAccessibility()
 * ========================================================================== */

import type {
  AccessibilityContextValue,
  AccessibilityPreferences,
  AccessibilitySettings,
} from "./accessibility.types";

/**
 * يعيد Settings الفعلية من preferences + system preferences.
 * عندما يكون التفضيل "system" نستعين بقيم matchMedia الفعلية.
 */
export function deriveEffectiveSettings(
  preferences: AccessibilityPreferences,
  system: AccessibilitySettings,
): AccessibilitySettings {
  return {
    highContrast:
      preferences.highContrast === "enabled"
        ? true
        : preferences.highContrast === "disabled"
        ? false
        : system.highContrast,
    largeText:
      preferences.largeText === "enabled"
        ? true
        : preferences.largeText === "disabled"
        ? false
        : system.largeText,
    reducedMotion:
      preferences.reducedMotion === "enabled"
        ? true
        : preferences.reducedMotion === "disabled"
        ? false
        : system.reducedMotion,
    focusIndicators:
      preferences.focusIndicators === "enabled"
        ? true
        : preferences.focusIndicators === "disabled"
        ? false
        : system.focusIndicators,
    lineSpacing:
      preferences.lineSpacing === "enabled"
        ? true
        : preferences.lineSpacing === "disabled"
        ? false
        : system.lineSpacing,
  };
}
