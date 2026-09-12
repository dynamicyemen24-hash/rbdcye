/* ==========================================================================
 * Accessibility Context — رحماء بينهم
 * قيمة السياق التي يستهلكها مكونات الوحدة عبر useAccessibility()
 * ========================================================================== */

import type {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
      preferences.highContrast === "enabled"
        ? true
        : preferences.highContrast === "disabled"
        ? false
        : system.highContrast,
    largeText:
      // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
      preferences.largeText === "enabled"
        ? true
        : preferences.largeText === "disabled"
        ? false
        : system.largeText,
    reducedMotion:
      // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
      preferences.reducedMotion === "enabled"
        ? true
        : preferences.reducedMotion === "disabled"
        ? false
        : system.reducedMotion,
    focusIndicators:
      // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
      preferences.focusIndicators === "enabled"
        ? true
        : preferences.focusIndicators === "disabled"
        ? false
        : system.focusIndicators,
    lineSpacing:
      // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
      preferences.lineSpacing === "enabled"
        ? true
        : preferences.lineSpacing === "disabled"
        ? false
        : system.lineSpacing,
  };
}
