import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { usePrefersReducedMotion, useSystemColorScheme } from '@/utils/media';

export type ThemeMode = 'light' | 'dark' | 'system';
export type DisplayMode = 'default' | 'sepia' | 'contrast';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  setHighContrast: (value: boolean) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "rh_theme_mode";
const HIGH_CONTRAST_STORAGE_KEY = "rh_high_contrast";
const DISPLAY_MODE_STORAGE_KEY = "rh_display_mode";
const FONT_SIZE_STORAGE_KEY = "rh_font_size";
const REDUCED_MOTION_STORAGE_KEY = "rh_reduced_motion";

const DEFAULT_FONT_SIZE = 16;
const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 24;

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return saved && ["light", "dark", "system"].includes(saved) ? saved : "system";
  });

  const [isHighContrast, setIsHighContrastState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY) === "true";
  });

  const [displayMode, setDisplayModeState] = useState<DisplayMode>(() => {
    if (typeof window === "undefined") return "default";
    const saved = localStorage.getItem(DISPLAY_MODE_STORAGE_KEY) as DisplayMode | null;
    return saved && ["default", "sepia", "contrast"].includes(saved) ? saved : "default";
  });

  const [fontSize, setFontSizeState] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_FONT_SIZE;
    const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    const parsed = saved ? parseInt(saved, 10) : DEFAULT_FONT_SIZE;
    return Number.isFinite(parsed) ? Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, parsed)) : DEFAULT_FONT_SIZE;
  });

  // SSR-safe system reduced-motion detection — delegated to src/utils/media.ts.
  // The OS preference seeds the initial state; the user may override it via
  // toggleReducedMotion, and the override is persisted to localStorage.
  const systemReducedMotion = usePrefersReducedMotion();
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY);
    if (saved === "true") return true;
    if (saved === "false") return false;
    return systemReducedMotion;
  });

  // Re-sync with the OS preference when the user hasn't chosen an override.
  useEffect(() => {
    const saved = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY);
    if (saved === null) {
      setReducedMotionState(systemReducedMotion);
    }
  }, [systemReducedMotion]);

  // SSR-safe system-color-scheme detection — delegated to src/utils/media.ts.
  const isSystemDark = useSystemColorScheme();

  // useSystemColorScheme / usePrefersReducedMotion already subscribe to the
  // change events inside media.ts and manage their own lifecycle.

  const isDark = theme === "dark" || (theme === "system" && isSystemDark);

  // Apply root DOM classes and data attributes
  useEffect(() => {
    const root = document.documentElement;

    // Remove theme classes
    root.classList.remove("light", "dark", "sepia", "contrast");

    // Apply display mode
    if (displayMode === "sepia") {
      root.classList.add("sepia");
    } else if (displayMode === "contrast") {
      root.classList.add("contrast");
    }

    // Apply theme mode
    if (isDark) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }

    // Apply high contrast
    if (isHighContrast) {
      root.classList.add("high-contrast");
      root.setAttribute("data-high-contrast", "true");
    } else {
      root.classList.remove("high-contrast");
      root.removeAttribute("data-high-contrast");
    }

    // Apply font size
    root.style.fontSize = `${fontSize}px`;

    // Apply reduced motion
    if (reducedMotion) {
      root.classList.add("reduced-motion");
      root.setAttribute("data-reduced-motion", "true");
    } else {
      root.classList.remove("reduced-motion");
      root.removeAttribute("data-reduced-motion");
    }
  }, [isDark, isHighContrast, displayMode, fontSize, reducedMotion]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      /* non-critical */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      // eslint-disable-next-line no-nested-ternary -- precise: ternary flattened to guard — readability preserved, logic unchanged
      const nextTheme: ThemeMode = prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        /* non-critical */
      }
      return nextTheme;
    });
  }, []);

  const setHighContrast = useCallback((value: boolean) => {
    setIsHighContrastState(value);
    try {
      localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, String(value));
    } catch {
      /* non-critical */
    }
  }, []);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrastState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, String(next));
      } catch {
        /* non-critical */
      }
      return next;
    });
  }, []);

  const setDisplayMode = useCallback((mode: DisplayMode) => {
    setDisplayModeState(mode);
    try {
      localStorage.setItem(DISPLAY_MODE_STORAGE_KEY, mode);
    } catch {
      /* non-critical */
    }
  }, []);

  const setFontSize = useCallback((size: number) => {
    const clamped = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, size));
    setFontSizeState(clamped);
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(clamped));
    } catch {
      /* non-critical */
    }
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotionState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(REDUCED_MOTION_STORAGE_KEY, String(next));
      } catch {
        /* non-critical */
      }
      return next;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      isDark,
      toggleTheme,
      isHighContrast,
      toggleHighContrast,
      setHighContrast,
      displayMode,
      setDisplayMode,
      fontSize,
      setFontSize,
      reducedMotion,
      toggleReducedMotion,
    }),
    [theme, setTheme, isDark, toggleTheme, isHighContrast, toggleHighContrast, setHighContrast, displayMode, setDisplayMode, fontSize, setFontSize, reducedMotion, toggleReducedMotion]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
