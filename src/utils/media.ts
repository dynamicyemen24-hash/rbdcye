// Media query utilities — central, SSR-safe, testable.
// All window.matchMedia usage must flow through here or through the hooks below.
//
// IMPORTANT: usePrefersReducedMotion lives in @/shared/hooks/usePrefersReducedMotion.ts
// (the documented canonical hook). This file only provides the additional hooks
// (useSystemColorScheme, useIsStandalone) and the SSR-safe sync helpers.

import { useEffect, useState } from 'react';

// Re-export the canonical reduced-motion hook for convenience.
// Components may import from either @/shared/hooks/usePrefersReducedMotion
// or @/utils/media (both resolve to the same implementation).
export { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion';

// ---------------------------------------------------------------------------
// 1. System color scheme — SSR-safe hook.
// ---------------------------------------------------------------------------

export function useSystemColorScheme(): boolean {
  const [isSystemDark, setIsSystemDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsSystemDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy Safari fallback.
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return isSystemDark;
}

// ---------------------------------------------------------------------------
// 2. Standalone / PWA detection — SSR-safe (call only inside effects / handlers).
// ---------------------------------------------------------------------------

export function useIsStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');
    setIsStandalone(standalone);
  }, []);

  return isStandalone;
}

// Sync version — safe only inside an effect or event handler (not during render).
export function isStandaloneSync(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

// ---------------------------------------------------------------------------
// 3. Plain SSR-safe sync helpers (for use inside effects/event handlers only).
// ---------------------------------------------------------------------------

export function prefersReducedMotionSync(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isSystemDarkSync(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// NOTES:
// - No component or hook outside this file may call window.matchMedia() directly.
// - The SSR guard `typeof window === 'undefined'` is mandatory for every consumer.
// - Tests in src/__tests__/media.test.tsx validate SSR behaviour and change listeners.