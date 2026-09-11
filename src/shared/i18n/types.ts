/**
 * i18n types — type-safe locale contracts.
 */

export const LOCALES = ["ar", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export type Direction = "rtl" | "ltr";

export interface LocaleConfig {
  readonly code: Locale;
  readonly name: string;
  readonly englishName: string;
  readonly dir: Direction;
  readonly intlLocale: string;
}

export const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  ar: {
    code: "ar",
    name: "العربية",
    englishName: "Arabic",
    dir: "rtl",
    intlLocale: "ar-YE",
  },
  en: {
    code: "en",
    name: "English",
    englishName: "English",
    dir: "ltr",
    intlLocale: "en-US",
  },
};

export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_STORAGE_KEY = "rbdcye.locale";

/** Dotted path into a nested dictionary, e.g. `"nav.home"`. */
export type TranslationKey<T> = FlattenKeys<T>;

type FlattenKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? `${K}.${FlattenKeys<T[K]>}` : K;
    }[keyof T & string]
  : never;

/** Resolve a dotted key against a nested object. */
export function resolvePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

/** Replace `{var}` placeholders in a translation string. */
export function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

export function dirFor(locale: Locale): Direction {
  return LOCALE_CONFIG[locale].dir;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Read persisted locale safely (SSR/private-mode friendly). */
export function getPersistedLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;
  } catch {
    // localStorage unavailable — fall through to default.
  }
  return DEFAULT_LOCALE;
}

/** Persist locale safely. */
export function persistLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage unavailable — persistence is best-effort.
  }
}

/** Locale-aware date formatting. */
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_CONFIG[locale].intlLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Locale-aware number formatting. */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_CONFIG[locale].intlLocale).format(value);
}

/** Sync `<html lang dir>` with the active locale. */
export function syncDocumentLocale(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = dirFor(locale);
}