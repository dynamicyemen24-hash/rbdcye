import { 
  Sparkles, 
  Type, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  BookOpen, 
  Sliders, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { 
  TypographyFamily, 
  FONT_OPTIONS, 
  ISLAMIC_TEXTS 
} from "./types";

export function HeroWisdomCard() {
  const [verseIndex, setVerseIndex] = useState(0);
  const [selectedFont, setSelectedFont] = useState<TypographyFamily>('sans-cairo');
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);
  const [showFontToolbar, setShowFontToolbar] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedFont = localStorage.getItem('rbdcye_reading_font') as TypographyFamily;
      if (savedFont && FONT_OPTIONS.some(f => f.id === savedFont)) {
        setSelectedFont(savedFont);
      }
      const savedSize = localStorage.getItem('rbdcye_reading_size');
      if (savedSize !== null) {
        setFontSizeOffset(Number(savedSize));
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Ignore
      }
    }
  };

  const handleFontChange = (fontId: TypographyFamily) => {
    triggerHaptic();
    setSelectedFont(fontId);
    try {
      localStorage.setItem('rbdcye_reading_font', fontId);
    } catch {
      // Ignore
    }
  };

  const handleSizeChange = (delta: number) => {
    triggerHaptic();
    setFontSizeOffset(prev => {
      const next = Math.max(-2, Math.min(6, prev + delta));
      try {
        localStorage.setItem('rbdcye_reading_size', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleResetTypography = () => {
    triggerHaptic();
    setSelectedFont('sans-cairo');
    setFontSizeOffset(0);
    try {
      localStorage.removeItem('rbdcye_reading_font');
      localStorage.removeItem('rbdcye_reading_size');
    } catch {
      // Ignore
    }
  };

  const nextVerse = () => {
    triggerHaptic();
    setVerseIndex(prev => (prev + 1) % ISLAMIC_TEXTS.length);
  };
  const prevVerse = () => {
    triggerHaptic();
    setVerseIndex(prev => (prev - 1 + ISLAMIC_TEXTS.length) % ISLAMIC_TEXTS.length);
  };

  const current = ISLAMIC_TEXTS[verseIndex];
  const currentFontConfig = FONT_OPTIONS.find(f => f.id === selectedFont) || FONT_OPTIONS[0];

  return (
    <div className="max-w-4xl mx-auto">
      <div 
        className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 bg-white border border-emerald-200/80 shadow-xs flex flex-col justify-between overflow-hidden text-center transition-all duration-300"
        role="region"
        aria-label="Ù‚Ø¨Ø³ Ù…Ù† Ø§Ù„Ù‡Ø¯ÙŠ Ø§Ù„Ù‚Ø±Ø¢Ù†ÙŠ ÙˆØ§Ù„Ù†Ø¨ÙˆÙŠ Ù…Ø¹ Ø®ÙŠØ§Ø±Ø§Øª Ø§Ù„Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ù…Ø±ÙŠØ­Ø©"
      >
        {/* Internal Soft Glass Highlight Accents */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-emerald-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-amber-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header Tag, Reference & Reading Toolbar Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 text-amber-950 text-xs sm:text-sm font-extrabold font-cairo border border-amber-300 shadow-2xs">
                <Sparkles className="w-4 h-4 text-[#8F6A1A]" aria-hidden="true" />
                <span>{current.type === 'ayah' ? 'Ù…Ù† Ø§Ù„Ù‡Ø¯ÙŠ Ø§Ù„Ù‚Ø±Ø¢Ù†ÙŠ' : 'Ù…Ù† Ø§Ù„Ù‚Ø¨Ø³ Ø§Ù„Ù†Ø¨ÙˆÙŠ'}</span>
              </span>

              <span className="text-slate-700 text-xs sm:text-sm md:text-base font-bold font-cairo">
                {current.reference}
              </span>
            </div>

            {/* Comfortable Reading Quick Toolbar Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFontToolbar(!showFontToolbar)}
                aria-expanded={showFontToolbar}
                aria-controls="reading-typography-toolbar"
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold font-cairo transition-all border ${
                  showFontToolbar 
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
                title="ØªØ®ØµÙŠØµ Ø®Ø· ÙˆÙ†Ù…Ø· Ø§Ù„Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ù…Ø±ÙŠØ­Ø©"
              >
                <Sliders className="w-3.5 h-3.5 text-[#8F6A1A]" aria-hidden="true" />
                <span>ØªØ®ØµÙŠØµ Ø§Ù„Ù‚Ø±Ø§Ø¡Ø© ({currentFontConfig.category === 'serif' ? 'Serif' : 'Sans'})</span>
              </button>
            </div>
          </div>

          {/* Collapsible / Interactive Reading Customization Panel */}
          <AnimatePresence>
            {showFontToolbar && (
              <motion.div
                id="reading-typography-toolbar"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-6"
              >
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-right space-y-4 shadow-inner">
                  
                  {/* Serif vs Sans-serif Quick Selector Tabs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-cairo flex items-center gap-1.5">
                        <Type className="w-4 h-4 text-emerald-800" />
                        <span>Ù†Ù…Ø· Ø®Ø· Ø§Ù„Ø¹Ø±Ø¶ (Serif / Sans-serif):</span>
                      </span>
                      <span className="text-xs font-semibold text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-full font-cairo">
                        {currentFontConfig.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2" role="radiogroup" aria-label="Ø£Ù†Ù…Ø§Ø· Ø§Ù„Ø®Ø·ÙˆØ· Ø§Ù„Ù…ØªØ§Ø­Ø©">
                      {FONT_OPTIONS.map((font) => {
                        const isSelected = selectedFont === font.id;
                        return (
                          <button
                            key={font.id}
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => handleFontChange(font.id)}
                            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all text-center ${
                              isSelected 
                                ? 'bg-white border-emerald-700 shadow-sm text-emerald-950 font-bold' 
                                : 'bg-white/80 hover:bg-white border-slate-300 text-slate-700 hover:text-slate-900'
                            }`}
                          >
                            <span 
                              className="text-lg sm:text-xl font-bold mb-1"
                              style={{ fontFamily: font.fontFamily }}
                            >
                              {font.category === 'serif' ? 'Ø§Ù‚Ù’Ø±ÙŽØ£Ù’' : 'Ø§Ù‚Ø±Ø£'}
                            </span>
                            <span className="text-xs font-bold leading-tight font-cairo">
                              {font.name.split(' (')[0]}
                            </span>
                            <span className={`text-[10px] mt-0.5 px-1.5 py-0.2 rounded font-mono ${
                              font.category === 'serif' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-800'
                            }`}>
                              {font.category.toUpperCase()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Font Size & Reset Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 font-cairo">Ø­Ø¬Ù… Ø§Ù„Ø®Ø·:</span>
                      <button
                        onClick={() => handleSizeChange(-1)}
                        disabled={fontSizeOffset <= -2}
                        className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-800 transition-colors shadow-2xs"
                        aria-label="ØªØµØºÙŠØ± Ø­Ø¬Ù… Ø§Ù„Ø®Ø·"
                        title="ØªØµØºÙŠØ±"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono font-bold px-2 py-1 bg-white rounded border border-slate-300 text-slate-800 min-w-[40px] text-center">
                        {100 + fontSizeOffset * 10}%
                      </span>
                      <button
                        onClick={() => handleSizeChange(1)}
                        disabled={fontSizeOffset >= 6}
                        className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-800 transition-colors shadow-2xs"
                        aria-label="ØªÙƒØ¨ÙŠØ± Ø­Ø¬Ù… Ø§Ù„Ø®Ø·"
                        title="ØªÙƒØ¨ÙŠØ±"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleResetTypography}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold font-cairo py-1 px-2.5 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Ø§Ø³ØªØ¹Ø§Ø¯Ø© Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠØ©"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ø¥Ø¹Ø§Ø¯Ø© Ø¶Ø¨Ø· Ø§Ù„Ø®Ø·</span>
                    </button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative High-Contrast Gold Accent Line */}
          <div className="w-16 h-1 bg-[#8F6A1A] mx-auto mb-6 rounded-full" />

          {/* Verse Arabic Text - Configurable Font & Size */}
          <div 
            className="min-h-[120px] sm:min-h-[145px] flex items-center justify-center my-3 px-2 sm:px-6 transition-all duration-200" 
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${verseIndex}-${selectedFont}-${fontSizeOffset}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="w-full text-center"
              >
                <p 
                  className="text-slate-950 font-medium leading-[2.2] sm:leading-[2.4] text-center"
                  style={{ 
                    fontFamily: currentFontConfig.fontFamily,
                    fontSize: `clamp(${1.25 + fontSizeOffset * 0.1}rem, ${3 + fontSizeOffset * 0.25}vw, ${2.15 + fontSizeOffset * 0.2}rem)`
                  }}
                >
                  Â« {current.arabic} Â»
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Card Footer Navigation & Indicator - Crisp Visibility */}
          <div className="pt-5 mt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={prevVerse}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 shadow-2xs hover:shadow-xs border border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Ø§Ù„Ù†Øµ Ø§Ù„Ø³Ø§Ø¨Ù‚"
                title="Ø§Ù„Ø³Ø§Ø¨Ù‚"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" aria-hidden="true" />
              </button>
              
              <div className="flex gap-2 items-center" dir="ltr" role="tablist" aria-label="Ù…Ø¤Ø´Ø±Ø§Øª Ø§Ù„ØªØµÙØ­">
                {ISLAMIC_TEXTS.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === verseIndex}
                    aria-label={`Ø§Ù„Ù†Øµ ${i + 1}`}
                    onClick={() => setVerseIndex(i)}
                    className="p-1"
                  >
                    <span className={`block h-2.5 rounded-full transition-all duration-200 ${
                      i === verseIndex ? 'w-8 bg-[#8F6A1A]' : 'w-2.5 bg-slate-400 hover:bg-slate-600'
                    }`} />
                  </button>
                ))}
              </div>

              <button
                onClick={nextVerse}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 shadow-2xs hover:shadow-xs border border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Ø§Ù„Ù†Øµ Ø§Ù„ØªØ§Ù„ÙŠ"
                title="Ø§Ù„ØªØ§Ù„ÙŠ"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 font-cairo font-bold">
                <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
                <span>Ù†Ù…Ø· Ø§Ù„Ø®Ø·: {currentFontConfig.name.split(' (')[0]}</span>
              </span>
              <span className="text-slate-400 font-bold">â€¢</span>
              <span className="text-slate-700 text-xs sm:text-sm font-bold font-cairo">
                Ø±Ø­Ù…Ø§Ø¡ Ø¨ÙŠÙ†Ù‡Ù… â€¢ Ø£Ø«Ø± ÙŠØªØ¬Ø¯Ø¯
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroWisdomCard;
