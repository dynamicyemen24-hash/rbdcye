import { useEffect, useState } from 'react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
  });

  useEffect(() => {
    // Detect system preferences
    const prefersHighContrast = window.matchMedia('(prefers-contrast: more)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setSettings({
      highContrast: prefersHighContrast.matches,
      largeText: localStorage.getItem('a11y-large-text') === 'true',
      reducedMotion: prefersReducedMotion.matches,
      screenReader: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });

    // Listen for changes
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    prefersHighContrast.addEventListener('change', handleContrastChange);
    prefersReducedMotion.addEventListener('change', handleMotionChange);

    return () => {
      prefersHighContrast.removeEventListener('change', handleContrastChange);
      prefersReducedMotion.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const toggleHighContrast = () => {
    setSettings(prev => {
      const newVal = !prev.highContrast;
      document.documentElement.classList.toggle('high-contrast', newVal);
      return { ...prev, highContrast: newVal };
    });
  };

  const toggleLargeText = () => {
    setSettings(prev => {
      const newVal = !prev.largeText;
      document.documentElement.classList.toggle('large-text', newVal);
      localStorage.setItem('a11y-large-text', String(newVal));
      return { ...prev, largeText: newVal };
    });
  };

  const toggleReducedMotion = () => {
    setSettings(prev => {
      const newVal = !prev.reducedMotion;
      document.documentElement.classList.toggle('reduced-motion', newVal);
      return { ...prev, reducedMotion: newVal };
    });
  };

  return {
    settings,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
  };
}

// Skip to main content component
export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-white focus:rounded"
    >
      تخطي إلى المحتوى الرئيسي
    </a>
  );
}

// Accessibility toolbar component
export function AccessibilityToolbar() {
  const { settings, toggleHighContrast, toggleLargeText, toggleReducedMotion } = useAccessibility();

  return (
    <div
      role="toolbar"
      aria-label="أدوات إمكانية الوصول"
      className="fixed bottom-4 left-4 z-50 bg-white shadow-lg rounded-lg p-4 border"
    >
      <h3 className="text-sm font-bold mb-2">إعدادات إمكانية الوصول</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={toggleHighContrast}
            aria-label="تباين عالي"
          />
          تباين عالي
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.largeText}
            onChange={toggleLargeText}
            aria-label="نص كبير"
          />
          نص كبير
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={toggleReducedMotion}
            aria-label="تقليل الحركة"
          />
          تقليل الحركة
        </label>
      </div>
    </div>
  );
}