// StyleGuidePage.tsx - دليل أنماط الزخارف والخلفيات الإسلامية لـ مؤسسة رحماء بينهم
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Sparkles, Code, Palette, Layers, Eye, FileCode2, Info, Compass, ShieldCheck } from 'lucide-react';

interface PatternItem {
  id: string;
  name: string;
  englishName: string;
  className: string;
  description: string;
  useCases: string[];
  cssCode: string;
  tailwindUsage: string;
  dataUriSvg: string;
  inlineSvgSnippet: string;
}

const PATTERNS: PatternItem[] = [
  {
    id: 'geometric-islamic',
    name: 'النمط الهندسي الإسلامي الثماني',
    englishName: 'Geometric 8-Fold Islamic Pattern',
    className: 'pattern-geometric-islamic',
    description: 'زخرفة هندسية إسلامية ثمانية الأضلاع مصممة بخطوط زاوية دقيقة وتداخل لوني رزين بين الذهبي والزمردي، مثالية للخلفيات العريضة والبانرات الأساسية.',
    useCases: [
      'القسم الرئيسي للموقع (Hero Banner)',
      'بطاقات التبرع المتميزة والرؤية الاستراتيجية',
      'خلفيات الترويسات والعناوين الكبرى',
    ],
    cssCode: `.pattern-geometric-islamic {
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L48.28 11.72L60 0L60 11.72L71.72 20L60 28.28L71.72 40L60 51.72L71.72 60L60 68.28L48.28 80L40 68.28L31.72 80L20 68.28L8.28 60L20 51.72L8.28 40L20 28.28L8.28 20L20 11.72L8.28 0L20 11.72L31.72 0Z' fill='none' stroke='%23C69E5A' stroke-width='0.75' stroke-opacity='0.25'/%3E%3Cpath d='M40 20L45.86 25.86L54.14 20L54.14 28.28L60 34.14L54.14 40L60 45.86L54.14 54.14L45.86 60L40 54.14L34.14 60L25.86 54.14L20 45.86L25.86 40L20 34.14L25.86 28.28L20 20L25.86 20L34.14 25.86Z' fill='none' stroke='%230D5C3E' stroke-width='0.5' stroke-opacity='0.2'/%3E%3C/svg%3E");
  background-size: 80px 80px;
}`,
    tailwindUsage: `<div className="relative bg-[#0F4C3A] text-white py-16 px-8 rounded-3xl overflow-hidden">
  {/* خلفية الزخرفة الإسلامية الهندسيّة */}
  <div className="absolute inset-0 pattern-geometric-islamic opacity-40 pointer-events-none" aria-hidden="true" />
  
  <div className="relative z-10">
    <h2 className="text-2xl font-bold font-cairo">عنوان القسم الفرعي</h2>
    <p className="mt-2 text-sm text-emerald-100">محتوى تفصيلي مع خلفية إسلامية موحدة.</p>
  </div>
</div>`,
    dataUriSvg: `data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L48.28 11.72L60 0L60 11.72L71.72 20L60 28.28L71.72 40L60 51.72L71.72 60L60 68.28L48.28 80L40 68.28L31.72 80L20 68.28L8.28 60L20 51.72L8.28 40L20 28.28L8.28 20L20 11.72L8.28 0L20 11.72L31.72 0Z' fill='none' stroke='%23C69E5A' stroke-width='0.75' stroke-opacity='0.25'/%3E%3Cpath d='M40 20L45.86 25.86L54.14 20L54.14 28.28L60 34.14L54.14 40L60 45.86L54.14 54.14L45.86 60L40 54.14L34.14 60L25.86 54.14L20 45.86L25.86 40L20 34.14L25.86 28.28L20 20L25.86 20L34.14 25.86Z' fill='none' stroke='%230D5C3E' stroke-width='0.5' stroke-opacity='0.2'/%3E%3C/svg%3E`,
    inlineSvgSnippet: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <path d="M40 0L48.28 11.72L60 0L60 11.72L71.72 20L60 28.28L71.72 40L60 51.72L71.72 60L60 68.28L48.28 80L40 68.28L31.72 80L20 68.28L8.28 60L20 51.72L8.28 40L20 28.28L8.28 20L20 11.72L8.28 0L20 11.72L31.72 0Z" fill="none" stroke="#C69E5A" strokeWidth="0.75" strokeOpacity="0.25"/>
  <path d="M40 20L45.86 25.86L54.14 20L54.14 28.28L60 34.14L54.14 40L60 45.86L54.14 54.14L45.86 60L40 54.14L34.14 60L25.86 54.14L20 45.86L25.86 40L20 34.14L25.86 28.28L20 20L25.86 20L34.14 25.86Z" fill="none" stroke="#0F4C3A" strokeWidth="0.5" strokeOpacity="0.2"/>
</svg>`,
  },
  {
    id: 'islamic-stars',
    name: 'نمط النجوم الثمانية الإسلامية',
    englishName: 'Islamic 8-Pointed Stars Pattern',
    className: 'pattern-islamic-stars',
    description: 'زخرفة النجمة الثمانية التقليدية (Islamic Octagram Ornament) بلون ذهبي هادئ وشفافية متزنة تزين البطاقات والتقارير الرسمية بلمسة عربية أصيلة.',
    useCases: [
      'بطاقات المشاريع وقصص النجاح',
      'شارات التكريم والشفافية والتراخيص',
      'مربعات الإحصائيات والأرقام الميدانية',
    ],
    cssCode: `.pattern-islamic-stars {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C69E5A' fill-opacity='0.12'%3E%3Cpath d='M30 0l3 9 9-3-3 9 9 3-9 3 3 9-9-3-3 9-3-9-9 3 3-9-9-3 9-3-3-9 9 3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-size: 60px 60px;
}`,
    tailwindUsage: `<div className="relative bg-white border border-amber-200/80 p-6 rounded-2xl shadow-sm">
  {/* خلفية النجوم الثمانية */}
  <div className="absolute inset-0 pattern-islamic-stars pointer-events-none rounded-2xl" aria-hidden="true" />
  
  <div className="relative z-10">
    <span className="badge-gold">مشروع مرخص</span>
    <h3 className="text-lg font-bold font-cairo mt-3 text-slate-900">مشروع حفر الآبار النقية</h3>
  </div>
</div>`,
    dataUriSvg: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C69E5A' fill-opacity='0.12'%3E%3Cpath d='M30 0l3 9 9-3-3 9 9 3-9 3 3 9-9-3-3 9-3-9-9 3 3-9-9-3 9-3-3-9 9 3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`,
    inlineSvgSnippet: `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fillRule="evenodd">
    <g fill="#C69E5A" fillOpacity="0.12">
      <path d="M30 0l3 9 9-3-3 9 9 3-9 3 3 9-9-3-3 9-3-9-9 3 3-9-9-3 9-3-3-9 9 3z"/>
    </g>
  </g>
</svg>`,
  },
  {
    id: 'sanaani-brick',
    name: 'طراز الآجر الصنعاني الزُخرفي',
    englishName: "Sana'ani Traditional Brick Pattern",
    className: 'pattern-sanaani-brick',
    description: 'نمط مهندس مستوحى من الطراز المعماري اليمني العريق لمدينة صنعاء القديمة، يعتمد على التدرجات الخطية المتصالبة بزاويتي (335° و 155°).',
    useCases: [
      'أقسام الهوية المؤسسية والتراث والتاريخ',
      'فواصل الأقسام الإغاثية والتنموية الميدانية',
      'خلفيات التذييل وخريطة الموقع',
    ],
    cssCode: `.pattern-sanaani-brick {
  background-image: 
    linear-gradient(335deg, rgba(13, 92, 62, 0.05) 23px, transparent 23px),
    linear-gradient(155deg, rgba(198, 158, 90, 0.05) 23px, transparent 23px);
  background-size: 58px 58px;
}`,
    tailwindUsage: `<div className="relative bg-slate-900 text-white p-8 rounded-3xl overflow-hidden">
  {/* طراز الآجر الصنعاني */}
  <div className="absolute inset-0 pattern-sanaani-brick opacity-30 pointer-events-none" aria-hidden="true" />
  
  <div className="relative z-10">
    <h3 className="text-xl font-bold font-cairo text-amber-300">مؤسسة رحماء بينهم في اليمن</h3>
    <p className="mt-2 text-sm text-slate-300 leading-relaxed">رسالة أمل ووفاء للإنسان في كافة المحافظات اليمنية.</p>
  </div>
</div>`,
    dataUriSvg: `linear-gradient(335deg, rgba(13, 92, 62, 0.05) 23px, transparent 23px), linear-gradient(155deg, rgba(198, 158, 90, 0.05) 23px, transparent 23px)`,
    inlineSvgSnippet: `/* CSS Linear Gradients Matrix */
background-image: 
  linear-gradient(335deg, rgba(13, 92, 62, 0.05) 23px, transparent 23px),
  linear-gradient(155deg, rgba(198, 158, 90, 0.05) 23px, transparent 23px);
background-size: 58px 58px;`,
  },
];

const GLASS_UTILITIES = [
  {
    name: 'Hero Glass Panel',
    className: 'hero-glass-panel',
    css: `background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(18px);
border: 1px solid rgba(255, 255, 255, 0.18);
box-shadow: 0 20px 50px rgba(var(--foreground-rgb), 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.22);`,
  },
  {
    name: 'Hero Glass Card',
    className: 'hero-glass-card',
    css: `background: rgba(255, 255, 255, 0.06);
backdrop-filter: blur(14px);
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 12px 36px rgba(var(--foreground-rgb), 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.18);`,
  },
  {
    name: 'Glass Badge',
    className: 'glass-badge',
    css: `background: rgba(255, 255, 255, 0.12);
backdrop-filter: blur(8px);
border: 1px solid rgba(255, 255, 255, 0.2);`,
  },
];

export default function StyleGuidePage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bgPreviewTheme, setBgPreviewTheme] = useState<Record<string, 'emerald' | 'gold' | 'dark' | 'white'>>({
    'geometric-islamic': 'emerald',
    'islamic-stars': 'white',
    'sanaani-brick': 'dark',
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getThemeBackgroundClass = (theme: 'emerald' | 'gold' | 'dark' | 'white') => {
    switch (theme) {
      case 'emerald':
        return 'bg-[#0F4C3A] text-white';
      case 'gold':
        return 'bg-[#FDF8EE] text-slate-900 border border-amber-200/80';
      case 'dark':
        return 'bg-[#090D16] text-white border border-slate-800';
      case 'white':
        return 'bg-white text-slate-900 border border-slate-200';
      default:
        return 'bg-[#0F4C3A] text-white';
    }
  };

  return (
    <div className="space-y-8 font-cairo" dir="rtl">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-[var(--brand-green)] via-[var(--brand-green-light)] to-[var(--brand-green-dark)] text-white p-8 sm:p-10 rounded-3xl shadow-xl overflow-hidden border border-emerald-800/50">
        <div className="absolute inset-0 pattern-geometric-islamic opacity-20 pointer-events-none" aria-hidden="true" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>نظام التصميم والدليل الموحد</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            دليل أنماط الزخارف والخلفيات الإسلامية
          </h1>
          <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
            دليل أسلوب العمل لزخارف وأكواد الخلفيات الرسمية لمؤسسة «رحماء بينهم للإغاثة والتنمية باليمن». يتيح للمطورين والمصممين استدعاء الأنماط بدقة عالية لضمان التوافق البصري والهوية المؤسسية الموحدة.
          </p>
        </div>
      </div>

      {/* Islamic Background Patterns Showcase */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Palette className="w-6 h-6 text-[var(--brand-green)]" />
              <span>أنماط الزخارف والخلفيات (Islamic Background Patterns)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              جميع الأنماط أدناه معرفة في المورد العالمي للأنماط <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[11px]">src/index.css</code>
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {PATTERNS.map((pattern) => {
            const currentTheme = bgPreviewTheme[pattern.id] || 'emerald';
            const themeClass = getThemeBackgroundClass(currentTheme);

            return (
              <div
                key={pattern.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden transition-all"
              >
                {/* Header info */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[var(--brand-gold)]" />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {pattern.name}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">({pattern.englishName})</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {pattern.description}
                    </p>
                  </div>

                  {/* Theme Selector Controls for Interactive Preview */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">معاينة الخلفية:</span>
                    {(['emerald', 'gold', 'dark', 'white'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setBgPreviewTheme((prev) => ({ ...prev, [pattern.id]: t }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentTheme === t
                            ? 'bg-[var(--brand-green)] text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {t === 'emerald' && 'زمردي'}
                        {t === 'gold' && 'ذهبي'}
                        {t === 'dark' && 'داكن'}
                        {t === 'white' && 'أبيض'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid: Live Preview & Code snippets */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                  {/* Interactive Live Canvas Box */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <span>المعاينة المباشرة على الصفحة:</span>
                    </div>

                    <div className={`relative min-h-[220px] rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-inner transition-all ${themeClass}`}>
                      {/* Islamic Pattern Background layer */}
                      <div className={`absolute inset-0 ${pattern.className} opacity-40 pointer-events-none`} aria-hidden="true" />

                      <div className="relative z-10 space-y-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 inline-block">
                          معاينة النمط الميداني
                        </span>
                        <h4 className="text-base font-bold font-cairo leading-snug">
                          مؤسسة رحماء بينهم للإغاثة والتنمية
                        </h4>
                        <p className="text-xs opacity-90 leading-relaxed">
                          نُترجم كل تبرع ومساهمة إنسانية إلى أثرٍ وإنجازاتٍ ملموسة في أوساط الفئات الأكثر احتياجاً.
                        </p>
                      </div>

                      <div className="relative z-10 pt-4 flex items-center justify-between border-t border-current/10">
                        <span className="text-[11px] font-mono opacity-80">Class: .{pattern.className}</span>
                        <button className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-xs">
                          تبرع الآن
                        </button>
                      </div>
                    </div>

                    {/* Use Cases List */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-2">أبرز حالات الاستخدام الموصى بها:</span>
                      <ul className="space-y-1.5">
                        {pattern.useCases.map((uc, i) => (
                          <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-green)]" />
                            <span>{uc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Code Snippets & Tabs */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* CSS Class Code Snippet */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Code className="w-4 h-4 text-emerald-600" />
                          <span>1. كود تعريف CSS (`src/index.css`):</span>
                        </span>
                        <button
                          onClick={() => handleCopy(pattern.cssCode, `${pattern.id}-css`)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {copiedId === `${pattern.id}-css` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">تم النسخ!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>نسخ الـ CSS</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto dir-ltr text-left border border-slate-800 shadow-inner">
                        <code>{pattern.cssCode}</code>
                      </pre>
                    </div>

                    {/* React / Tailwind Usage Snippet */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <FileCode2 className="w-4 h-4 text-emerald-600" />
                          <span>2. طريقة الاستخدام في React & Tailwind:</span>
                        </span>
                        <button
                          onClick={() => handleCopy(pattern.tailwindUsage, `${pattern.id}-tw`)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {copiedId === `${pattern.id}-tw` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">تم النسخ!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>نسخ الكود</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-4 rounded-2xl bg-slate-950 text-amber-300 font-mono text-xs overflow-x-auto dir-ltr text-left border border-slate-800 shadow-inner">
                        <code>{pattern.tailwindUsage}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Glassmorphism Panels Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[var(--brand-green)]" />
            <span>أنماط الزجاج والشفافية (Glassmorphism Panels & Badges)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GLASS_UTILITIES.map((glass) => (
            <div key={glass.className} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">.{glass.className}</span>
                <button
                  onClick={() => handleCopy(glass.css, glass.className)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-emerald-600 text-xs transition-colors cursor-pointer"
                  title="نسخ CSS"
                >
                  {copiedId === glass.className ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Glass live demo on emerald background */}
              <div className="relative bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-dark)] p-6 rounded-2xl overflow-hidden min-h-[120px] flex items-center justify-center">
                <div className="absolute inset-0 pattern-geometric-islamic opacity-20 pointer-events-none" />
                <div className={`relative z-10 p-4 rounded-xl text-center text-white text-xs font-bold font-cairo ${glass.className}`}>
                  {glass.name} (.
                  {glass.className})
                </div>
              </div>

              <pre className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto dir-ltr text-left border border-slate-800">
                <code>{glass.css}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Colors Reference */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-[var(--brand-green)]" />
          <span>الألوان المؤسسية الأساسية (Enterprise Color Palette)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0F4C3A] text-white shadow-sm space-y-1">
            <span className="text-xs font-bold block">Institutional Emerald</span>
            <span className="text-xs font-mono opacity-80 block">#0F4C3A</span>
            <span className="text-[10px] opacity-70 block">--brand-green</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#C69E5A] text-slate-950 shadow-sm space-y-1">
            <span className="text-xs font-bold block">Dignity Gold</span>
            <span className="text-xs font-mono opacity-80 block">#C69E5A</span>
            <span className="text-[10px] opacity-70 block">--brand-gold</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F7F4] text-[#0F4C3A] border border-emerald-200 shadow-sm space-y-1">
            <span className="text-xs font-bold block">Emerald Pale</span>
            <span className="text-xs font-mono opacity-80 block">#F0F7F4</span>
            <span className="text-[10px] opacity-70 block">--brand-green-pale</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDF8EE] text-[#A47E3A] border border-amber-200 shadow-sm space-y-1">
            <span className="text-xs font-bold block">Gold Pale</span>
            <span className="text-xs font-mono opacity-80 block">#FDF8EE</span>
            <span className="text-[10px] opacity-70 block">--brand-gold-pale</span>
          </div>
        </div>
      </div>
    </div>
  );
}


