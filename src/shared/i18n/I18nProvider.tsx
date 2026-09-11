import { createContext, useContext, useCallback, useEffect, useMemo, useState, useRef } from "react";

import { dictionaries } from "./dictionaries";
import { ar } from "./dictionaries/ar";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  dirFor,
  formatDate as formatDateUtil,
  formatNumber as formatNumberUtil,
  getPersistedLocale,
  isLocale,
  interpolate,
  persistLocale,
  resolvePath,
  syncDocumentLocale,
} from "./types";

import type { Dictionary } from "./dictionaries/ar";
import type { Locale, TranslationKey } from "./types";

export interface I18nValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  isRTL: boolean;
  t: (key: TranslationKey<Dictionary>, vars?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
  formatDate: (date: Date) => string;
  formatNumber: (value: number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function buildTranslator(
  locale: Locale
): (key: TranslationKey<Dictionary>, vars?: Record<string, string | number>) => string {
  return (key, vars) => {
    const dict = dictionaries[locale] ?? ar;
    const fallback = ar as any as Record<string, any>;

    const value = resolvePath(dict as any as Record<string, any>, key);
    const fallbackValue = resolvePath(fallback, key as string);

    const template =
      typeof value === "string"
        ? value
        : typeof fallbackValue === "string"
          ? fallbackValue
          : String(key);

    return interpolate(template, vars);
  };
}

const defaultValue: I18nValue = {
  locale: DEFAULT_LOCALE,
  dir: dirFor(DEFAULT_LOCALE),
  isRTL: dirFor(DEFAULT_LOCALE) === "rtl",
  t: buildTranslator(DEFAULT_LOCALE),
  setLocale: () => {},
  formatDate: (date) => formatDateUtil(date, DEFAULT_LOCALE),
  formatNumber: (value) => formatNumberUtil(value, DEFAULT_LOCALE),
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getPersistedLocale());
  const hasMounted = useRef(false);

  const setLocale = useCallback((next: Locale) => {
    if (!isLocale(next)) return;
    setLocaleState(next);
    persistLocale(next);
    syncDocumentLocale(next);
  }, []);

  useEffect(() => {
    // Sync on mount (CSR hydration) and on locale change from persistence.
    if (!hasMounted.current) {
      hasMounted.current = true;
      const persisted = getPersistedLocale();
      if (persisted !== locale) {
        setLocaleState(persisted);
        syncDocumentLocale(persisted);
        return;
      }
      syncDocumentLocale(locale);
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === LOCALE_STORAGE_KEY && event.newValue && isLocale(event.newValue)) {
        setLocaleState(event.newValue);
        syncDocumentLocale(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [locale]);

  const value = useMemo<I18nValue>(() => {
    const dir = dirFor(locale);
    return {
      locale,
      dir,
      isRTL: dir === "rtl",
      t: buildTranslator(locale),
      setLocale,
      formatDate: (date: Date) => formatDateUtil(date, locale),
      formatNumber: (v: number) => formatNumberUtil(v, locale),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Access the current i18n context. Safe to call outside a provider —
 * returns a static Arabic fallback (useful in tests / Storybook).
 */
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  return ctx ?? defaultValue;
}

export { I18nContext };
