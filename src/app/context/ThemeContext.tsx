import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  setHighContrast: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'rh_theme_mode';
const HIGH_CONTRAST_STORAGE_KEY = 'rh_high_contrast';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return saved && ['light', 'dark', 'system'].includes(saved) ? saved : 'system';
  });

  const [isHighContrast, setIsHighContrastState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY) === 'true';
  });

  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen to system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && isSystemDark);

  // Apply root DOM classes and data attributes
  useEffect(() => {
    const root = document.documentElement;

    // Remove theme classes
    root.classList.remove('light', 'dark');

    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    if (isHighContrast) {
      root.classList.add('high-contrast');
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.classList.remove('high-contrast');
      root.removeAttribute('data-high-contrast');
    }
  }, [isDark, isHighContrast]);

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
      const nextTheme: ThemeMode = prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light';
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

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      isDark,
      toggleTheme,
      isHighContrast,
      toggleHighContrast,
      setHighContrast,
    }),
    [theme, setTheme, isDark, toggleTheme, isHighContrast, toggleHighContrast, setHighContrast]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
