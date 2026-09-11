/* eslint-disable no-inner-declarations */
import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type ChangeEvent,
  type ReactNode,
} from "react";

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
}

interface StoredAccessibilitySettings {
  highContrast?: boolean;
  largeText?: boolean;
  reducedMotion?: boolean;
}

const STORAGE_KEY = "app-accessibility-settings";
const LEGACY_LARGE_TEXT_KEY = "a11y-large-text";

const ROOT_CLASSES = {
  highContrast: "high-contrast",
  largeText: "large-text",
  reducedMotion: "reduced-motion",
} as const;

function readStoredSettings(): StoredAccessibilitySettings {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value) {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
    const legacyLargeText = window.localStorage.getItem(LEGACY_LARGE_TEXT_KEY);
    return legacyLargeText === null
      ? {}
      : { largeText: legacyLargeText === "true" };
  } catch {
    return {};
  }
}


interface UseAccessibilityReturn {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ) => void;
  resetSettings: () => void;
}

function useAccessibility(): UseAccessibilityReturn {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const stored = readStoredSettings();
    const system = getSystemAccessibilitySettings();
    return {
      highContrast: stored.highContrast ?? system.highContrast,
      largeText: stored.largeText ?? system.largeText,
      reducedMotion: stored.reducedMotion ?? system.reducedMotion,
    };
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle(ROOT_CLASSES.highContrast, settings.highContrast);
    root.classList.toggle(ROOT_CLASSES.largeText, settings.largeText);
    root.classList.toggle(ROOT_CLASSES.reducedMotion, settings.reducedMotion);
    saveSettings(settings);
  }, [settings]);

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings(getSystemAccessibilitySettings());
  }, []);

  return { settings, updateSetting, resetSettings };
}

type AccessibilityContextValue = UseAccessibilityReturn;

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function useAccessibilityContext(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibilityContext must be used within an AccessibilityProvider");
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}


interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

function ToggleSwitch({ id, label, checked, onChange, description }: ToggleSwitchProps) {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-4 cursor-pointer">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </label>
  );
}

interface AccessibilityToolbarProps {
  onClose?: () => void;
}

function AccessibilityToolbar({ onClose }: AccessibilityToolbarProps) {
  const { settings, updateSetting, resetSettings } = useAccessibilityContext();
  return (
    <div className="rounded-2xl bg-card p-6 shadow-xl border" role="dialog" aria-label="إعدادات إمكانية الوصول">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">إمكانية الوصول</h2>
        {onClose && (
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted" aria-label="إغلاق">
            ✕
          </button>
        )}
      </div>
      <div className="space-y-4">
        <ToggleSwitch
          id="high-contrast"
          label="تباين عالي"
          description="زيادة التباين بين النص والخلفية"
          checked={settings.highContrast}
          onChange={(checked) => updateSetting("highContrast", checked)}
        />
        <ToggleSwitch
          id="large-text"
          label="نص كبير"
          description="تكبير حجم الخط في جميع أنحاء التطبيق"
          checked={settings.largeText}
          onChange={(checked) => updateSetting("largeText", checked)}
        />
        <ToggleSwitch
          id="reduced-motion"
          label="تقليل الحركة"
          description="تقليل أو إيقاف الرسوم المتحركة"
          checked={settings.reducedMotion}
          onChange={(checked) => updateSetting("reducedMotion", checked)}
        />
      </div>
      <button
        onClick={resetSettings}
        className="mt-6 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        إعادة تعيين الإعدادات
      </button>
    </div>
  );
}

export { AccessibilityProvider, useAccessibilityContext as useAccessibility, AccessibilityToolbar };
function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const value = useAccessibility();
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}
function saveSettings(settings: AccessibilitySettings) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.localStorage.setItem(LEGACY_LARGE_TEXT_KEY, String(settings.largeText));
  } catch {
    // Storage unavailable
  }
}

function getMediaQuery(query: string): MediaQueryList | null {
  if (typeof window === "undefined" || !window.matchMedia) {
    return null;
  }
  return window.matchMedia(query);
}

function getSystemAccessibilitySettings(): AccessibilitySettings {
  const highContrast = getMediaQuery("(prefers-contrast: more)")?.matches ?? false;
  const reducedMotion = getMediaQuery("(prefers-reduced-motion: reduce)")?.matches ?? false;
  return { highContrast, largeText: false, reducedMotion };
}