import React, { useEffect } from 'react';
import { Type, Sun, Moon, Coffee, Eye, RotateCcw, AlignJustify, Sparkles } from 'lucide-react';

export type FontSizeLevel = 'normal' | 'large' | 'xlarge' | 'xxlarge';
export type ReaderThemeMode = 'light' | 'sepia' | 'dark' | 'contrast';
export type LineHeightMode = 'normal' | 'relaxed' | 'loose';

export interface ReadabilityState {
  fontSize: FontSizeLevel;
  theme: ReaderThemeMode;
  lineHeight?: LineHeightMode;
}

interface ReadabilityControlsProps {
  fontSize: FontSizeLevel;
  theme: ReaderThemeMode;
  lineHeight?: LineHeightMode;
  onFontSizeChange: (size: FontSizeLevel) => void;
  onThemeChange: (theme: ReaderThemeMode) => void;
  onLineHeightChange?: (height: LineHeightMode) => void;
  onReset?: () => void;
  className?: string;
  showLabels?: boolean;
}

export const FONT_SIZE_CLASSES: Record<FontSizeLevel, string> = {
  normal: 'text-base sm:text-lg',
  large: 'text-lg sm:text-xl',
  xlarge: 'text-xl sm:text-2xl',
  xxlarge: 'text-2xl sm:text-3xl',
};

export const LINE_HEIGHT_CLASSES: Record<LineHeightMode, string> = {
  normal: 'leading-[1.95]',
  relaxed: 'leading-[2.25]',
  loose: 'leading-[2.55]',
};

export const READER_THEME_CLASSES: Record<ReaderThemeMode, string> = {
  light: 'bg-white text-slate-800 border-slate-200',
  sepia: 'bg-[#FAF5E8] text-[#3A2F1D] border-[#E8DFC8]',
  dark: 'bg-[#0F172A] text-slate-100 border-slate-800',
  contrast: 'bg-black text-[#FACC15] border-yellow-500 font-semibold',
};

export const READER_CARD_THEME_CLASSES: Record<ReaderThemeMode, string> = {
  light: 'bg-slate-50 border-slate-200 text-slate-800',
  sepia: 'bg-[#F2EBD9] border-[#E2D8C0] text-[#3A2F1D]',
  dark: 'bg-[#1E293B] border-slate-700 text-slate-200',
  contrast: 'bg-zinc-900 border-yellow-400 text-[#FACC15]',
};

export const READER_TOOLBAR_CLASSES: Record<ReaderThemeMode, string> = {
  light: 'bg-slate-100/90 text-slate-700 border-slate-200',
  sepia: 'bg-[#EFE6D1]/90 text-[#3A2F1D] border-[#DFCFA8]',
  dark: 'bg-slate-800/90 text-slate-200 border-slate-700',
  contrast: 'bg-zinc-900/90 text-yellow-300 border-yellow-500',
};

const STORAGE_KEYS = {
  fontSize: 'rh_reader_fontSize',
  theme: 'rh_reader_theme',
  lineHeight: 'rh_reader_lineHeight',
};

export const getSavedReaderPreferences = (): ReadabilityState => {
  try {
    const savedFontSize = localStorage.getItem(STORAGE_KEYS.fontSize) as FontSizeLevel;
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) as ReaderThemeMode;
    const savedLineHeight = localStorage.getItem(STORAGE_KEYS.lineHeight) as LineHeightMode;

    return {
      fontSize: savedFontSize && ['normal', 'large', 'xlarge', 'xxlarge'].includes(savedFontSize) ? savedFontSize : 'normal',
      theme: savedTheme && ['light', 'sepia', 'dark', 'contrast'].includes(savedTheme) ? savedTheme : 'light',
      lineHeight: savedLineHeight && ['normal', 'relaxed', 'loose'].includes(savedLineHeight) ? savedLineHeight : 'relaxed',
    };
  } catch {
    return { fontSize: 'normal', theme: 'light', lineHeight: 'relaxed' };
  }
};

export const saveReaderPreferences = (state: Partial<ReadabilityState>) => {
  try {
    if (state.fontSize) localStorage.setItem(STORAGE_KEYS.fontSize, state.fontSize);
    if (state.theme) localStorage.setItem(STORAGE_KEYS.theme, state.theme);
    if (state.lineHeight) localStorage.setItem(STORAGE_KEYS.lineHeight, state.lineHeight);
  } catch {
    // ignore
  }
};

export const ReadabilityControls: React.FC<ReadabilityControlsProps> = ({
  fontSize,
  theme,
  lineHeight = 'relaxed',
  onFontSizeChange,
  onThemeChange,
  onLineHeightChange,
  onReset,
  className = '',
  showLabels = true,
}) => {
  const fontSizes: { key: FontSizeLevel; label: string; tooltip: string; sizeDisplay: string }[] = [
    { key: 'normal', label: 'أ', tooltip: 'حجم عادي (١٠٠٪)', sizeDisplay: 'text-xs' },
    { key: 'large', label: 'أ+', tooltip: 'حجم مريح (١٢٠٪)', sizeDisplay: 'text-sm font-semibold' },
    { key: 'xlarge', label: 'أ++', tooltip: 'حجم كبير (١٤٠٪)', sizeDisplay: 'text-base font-bold' },
    { key: 'xxlarge', label: 'أ+++', tooltip: 'حجم أقصى (١٦٥٪)', sizeDisplay: 'text-lg font-black' },
  ];

  const themes: { key: ReaderThemeMode; label: string; icon: React.ReactNode; bgClass: string }[] = [
    { key: 'light', label: 'نهاري', icon: <Sun className="w-3.5 h-3.5" />, bgClass: 'bg-white text-slate-800 border-slate-300' },
    { key: 'sepia', label: 'دافئ', icon: <Coffee className="w-3.5 h-3.5" />, bgClass: 'bg-[#FAF5E8] text-[#3D3222] border-[#E0D5BC]' },
    { key: 'dark', label: 'ليلي', icon: <Moon className="w-3.5 h-3.5" />, bgClass: 'bg-slate-900 text-slate-100 border-slate-700' },
    { key: 'contrast', label: 'تباين عالي', icon: <Eye className="w-3.5 h-3.5" />, bgClass: 'bg-black text-yellow-300 border-yellow-400 font-bold' },
  ];

  const lineHeights: { key: LineHeightMode; label: string; tooltip: string }[] = [
    { key: 'normal', label: 'مضغوط', tooltip: 'تباعد أسطر عادي' },
    { key: 'relaxed', label: 'مريح', tooltip: 'تباعد أسطر مريح للقراءة' },
    { key: 'loose', label: 'واسع', tooltip: 'تباعد أسطر واسع' },
  ];

  const handleFontSize = (size: FontSizeLevel) => {
    onFontSizeChange(size);
    saveReaderPreferences({ fontSize: size });
  };

  const handleTheme = (t: ReaderThemeMode) => {
    onThemeChange(t);
    saveReaderPreferences({ theme: t });
  };

  const handleLineHeight = (lh: LineHeightMode) => {
    if (onLineHeightChange) {
      onLineHeightChange(lh);
      saveReaderPreferences({ lineHeight: lh });
    }
  };

  return (
    <div 
      className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-500/10 backdrop-blur-md border border-slate-300/30 font-cairo ${className}`}
      role="toolbar"
      aria-label="خيارات القراءة المريحة والتحكم بالخط والتباين"
    >
      {/* Feature Label */}
      {showLabels && (
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--brand-green)]/10 text-[var(--brand-green)] text-xs font-bold shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#C69E5A]" />
          <span>القراءة المريحة:</span>
        </div>
      )}

      {/* Font Size Selector */}
      <div 
        className="flex items-center bg-slate-200/60 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-300/30"
        role="group"
        aria-label="تغيير حجم الخط"
      >
        <span className="sr-only">حجم الخط:</span>
        <Type className="w-3.5 h-3.5 mx-1.5 opacity-60 shrink-0" aria-hidden="true" />
        {fontSizes.map((item) => (
          <button
            key={item.key}
            onClick={() => handleFontSize(item.key)}
            className={`px-2 py-1 rounded-lg transition-all text-xs font-bold ${
              fontSize === item.key
                ? 'bg-white text-[var(--brand-green)] shadow-xs scale-105'
                : 'opacity-60 hover:opacity-100 text-slate-700 hover:text-slate-900'
            } ${item.sizeDisplay}`}
            title={item.tooltip}
            aria-pressed={fontSize === item.key}
            aria-label={item.tooltip}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Theme & Contrast Selector */}
      <div 
        className="flex items-center bg-slate-200/60 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-300/30"
        role="group"
        aria-label="تغيير تباين وألوان القراءة"
      >
        {themes.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTheme(t.key)}
            className={`p-1.5 sm:px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all border ${t.bgClass} ${
              theme === t.key
                ? 'ring-2 ring-[var(--brand-green)] shadow-xs scale-105'
                : 'opacity-70 hover:opacity-100 border-transparent'
            }`}
            title={`نمط الألوان والتباين: ${t.label}`}
            aria-pressed={theme === t.key}
            aria-label={`نمط الألوان: ${t.label}`}
          >
            {t.icon}
            <span className="hidden sm:inline text-[11px]">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Line Height Selector (Optional) */}
      {onLineHeightChange && (
        <div 
          className="hidden md:flex items-center bg-slate-200/60 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-300/30"
          role="group"
          aria-label="تباعد الأسطر"
        >
          <AlignJustify className="w-3.5 h-3.5 mx-1.5 opacity-60 shrink-0" aria-hidden="true" />
          {lineHeights.map((lh) => (
            <button
              key={lh.key}
              onClick={() => handleLineHeight(lh.key)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                lineHeight === lh.key
                  ? 'bg-white text-[var(--brand-green)] shadow-xs'
                  : 'opacity-60 hover:opacity-100 text-slate-700'
              }`}
              title={lh.tooltip}
              aria-pressed={lineHeight === lh.key}
              aria-label={lh.tooltip}
            >
              {lh.label}
            </button>
          ))}
        </div>
      )}

      {/* Reset Button */}
      {onReset && (
        <button
          onClick={onReset}
          className="p-1.5 rounded-xl opacity-60 hover:opacity-100 hover:bg-slate-200/60 transition-all text-xs font-semibold text-slate-700"
          title="إعادة ضبط إعدادات القراءة الافتراضية"
          aria-label="إعادة ضبط القراءة"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
