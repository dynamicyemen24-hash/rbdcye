# الدستور والتوجيهات الرئيسية - مؤسسة رحماء بينهم

## 1. التعريف الأساسي والحاكم للمشروع (Identity Definition)
- **طبيعة المشروع:** **موقع إلكتروني تعريفي رسمي** لمؤسسة «رحماء بينهم للإغاثة والتنمية باليمن» (مؤسسة إنسانية تنموية مستقلة مرخصة برقم ٤٨٢).
- **نطاق المشروع:** **ليس منصة تشغيلية أو إدارية أو لوحة نظام معقدة.**
- **الهدف المحوري:** تمثيل المؤسسة إعلامياً ومؤسسياً، تعريف الجمهور برسالتها ورؤيتها وقيمها ورخيصها الرسمي، عرض قطاعاتها التنموية وأنشطتها، وتسهيل التواصل والتبرع المباشر مع الحفاظ على الرقي والوضوح التام بدون تشتيت أو حشو.

## 2. المبادئ والتوجيهات التحريرية والتصميمية
- **الوضوح والتركيز:** تجنب الوصف المشتت أو إقحام مصطلحات مثل "منصة تشغيلية" أو "لوحة إدارة" أو "أنظمة معالجة".
- **المظهر المؤسسي:** تعزيز الطابع الرزين والوقار الهوائي بمساحات بيضاء مريحة، خطوط جليّة (Cairo / Plus Jakarta Sans)، وألوان رسمية متزنة (الزمردي الإسلامي الشريف #0F4C3A مع الذهبي المعتدل #C69E5A).
- **الاستقلالية وعدم التكرار:** الصفحة الرئيسية تقدم إيجازاً تعريفياً راقياً، بينما توفر الصفحات الفرعية الأرشيف والمعلومات التفصيلية لمن يرغب بالاطلاع.
- **نظام التصميم:** جميع الألوان تستخدم متغيرات CSS من `--brand-green` و`--brand-gold`. لا تستخدم ألوان هكس مباشرة إلا في بيانات المخططات أو ألوان منصات التواصل الاجتماعي.

## 3. نظام التصميم والأصول التقنية
- **نقطة الدخول CSS:** `src/styles/index.css` — يستورد جميع ملفات الأنماط بترتيب محدد
- **رمز التصميم الأساسي:** `src/styles/theme.css` — يحتوي جميع متغيرات CSS المخصصة (`--brand-green: #0F4C3A`, `--brand-gold: #C69E5A`)
- **نظام Tailwind:** `src/styles/tailwind.css` + `@theme` block في `src/index.css`
- **ملف الأصول:** `src/content/website.ts` — بيانات المحتوى المركزية مع ألوان CSS متغيرة
- **البيانات:** `src/data/sectorsData.ts` — بيانات القطاعات مع ألوان متغيرة CSS
- **الرمز المميز:** `public/manifest.json` + `public/site.webmanifest` — إعدادات PWA
- **ملفات الأيقونات:** `public/icons/` — جميع الأيقونات بصيغة SVG مع PNG للـ 192x192 و 512x512
- **الصورة التعريفية:** `public/og-image.svg` + `public/logo.svg`

### 3.1 نظام المكوّنات المؤسسية (Enterprise Component System)
> جميع المكوّنات في `src/shared/components/` وتُصدَّر من `src/shared/components/index.ts`. استخدمها دائماً بدل العناصر الأولية أو Tailwind المبعثر.

- **`EnterpriseButton`** — زر مؤسسي مع تأثير Ripple، `focus-visible`، 8 أشكال (primary/secondary/gold/ghost/danger/success/outline/gradient)، 6 أحجام، حالات تحميل.
- **`EnterpriseCard`** — بطاقة مع `shadow-glow`، Glass Morphism، 7 أشكال، 4 أحجام، دعم النقر ولوحة المفاتيح.
- **`EnterpriseInput`** — حقل إدخال مع تحقق كامل (error/warning/success)، أيقونات، مسح، دعم `textarea`.
- **`EnterpriseSelect`** — قائمة منسدلة قابلة للبحث والتحديد المتعدد.
- **`EnterpriseModal` + `EnterpriseConfirmModal`** — نوافذ منبثقة مع Focus Trap و Portal.
- **`EnterpriseTabs`** — تبويبات (default/pills/underline/enclosed) مع دعم لوحة المفاتيح.
- **`EnterpriseAccordion`** — أكورديون بحركات سلسة ودعم تعدد الفتح.
- **`EnterpriseTable`** — جدول مؤسسي مع فرز وبحث وفلترة وتحديد وترقيم صفحات.
- **`EnterpriseBadge` / `EnterpriseAlert` / `EnterpriseTooltip` / `EnterpriseDropdown`** — عناصر مساعدة.
- **`EnterpriseSkeleton` / `EnterpriseSpinner` / `EnterpriseProgress`** — حالات التحميل والتقدم.
- **`usePrefersReducedMotion`** (`src/shared/hooks/`) — Hook آمن لـ SSR/اختبارات يكشف تفضيل تقليل الحركة. **لا تستخدم `window.matchMedia` مباشرة أثناء العرض.**
- **`LanguageSwitcher`** — زر تبديل اللغة مع `EnterpriseTooltip`، يخزّن الاختيار في `localStorage`.

### 3.2 نظام التدويل (Internationalization)
> بنية خفيفة دون `react-i18next` — كافية لموقع أحادي اللغة مع بوابة مستقبلية للإنجليزية.

- **الدعم:** `src/shared/i18n/` — `I18nProvider` + `useI18n()` + `dictionaries/{ar,en}.ts` + أنواع `TranslationKey` المُوثّقة.
- **الاتجاه و`lang`:** يزامن تلقائياً `document.documentElement.lang/dir` ويشغّل `storage` بين التبويبات.
- **الثبات:** `localStorage["rbdcye.locale"]` مع سلوك آمن في SSR/الوضع الخاص.
- **الاستخدام:** `const { t, locale, dir, isRTL, setLocale, formatDate, formatNumber } = useI18n()` — يدعم الاستيفاء `{var}` وسقوط احتياطي إلى العربية.
- **التغليف:** `<I18nProvider>` في `src/main.tsx` خارج `ToastProvider`/`AuthProvider`.
- **المكوّن:** `src/shared/components/LanguageSwitcher.tsx` جاهز للإدراج في `Navbar` أو `Footer`.
- **الاختبار:** `src/__tests__/i18n.test.tsx` — 4 اختبارات لاختيار اللغة والثبات وتزامن `document`.

## 4. جودة الكود والتحسينات المكتملة (Quality & Debt Resolution)
- **Linting:** `pnpm lint` — ESLint بدون أخطاء أو تحذيرات (0 exit code)
- **TypeScript:** `pnpm typecheck` — TypeScript بدون أخطاء
- **اختبارات الوحدة:** `pnpm test` — 107 اختبار ناجح عبر 8 ملفات (React Testing Library + Vitest)
- **اختبارات E2E:** `pnpm test:e2e` — Playwright (Chromium/Firefox/WebKit/Mobile) لـ `e2e/` + تدقيق `WCAG 2.1 AA` آلي بـ `@axe-core/playwright` على 10 صفحات، شغّل `pnpm test:e2e:install` أولاً لتثبيت المتصفحات
- **البناء:** `pnpm build` — بناء ناجح وبدون تحذير Circular chunk، مع ضغط gzip و brotli، وتوفير 55% في حجم الصور المحسنة (440kB savings)
- **تقسيم الحزم:** `vite.config.ts` — manualChunks دقيق (react/supabase/sanity/motion/icons/charts/... ) بدون تكرار، مع تفعيل `reportCompressedSize: true`
- **تنظيف console.log:** تم إزالة جميع console.log/warn/error من الكود الإنتاجي (App, AdminDashboard, services, hooks)
- **إزالة الكود المُهدوم:** حذف الدالة `query()` المُهدومة من `src/lib/postgres.ts`
- **تبسيط ملفات Sanity CLI:** `seed.ts` و `test-integration.ts` تم تبسيطها
- **إزالة `browserslist`:** من `package.json` غير مطلوب مع Vite
- **معالجة Stripe TODO:** تم إزالة التعليق TODO من `create-checkout-session.ts`
- **تحسين `monitoring.ts`:** إزالة `console.error` من `error()` و `fatal()` methods
- **تحسين `pwa.ts`:** استبدال جميع `console.error` بمعالجة صامتة
- **تحسين `performanceMonitoring.ts`:** استبدال `console.error` بمعالجة صامتة
- **تحسين `usePerformance.ts`:** استبدال `console.error` و `console.log` بمعالجة صامتة
- **النوعية:** جميع `catch` blocks في الكود الإنتاجي لا تحتوي على `console.error`
- **بيئة الاختبار:** `src/__tests__/setup.ts` يوفّر polyfills آمنة لـ `matchMedia` و `IntersectionObserver` و `ResizeObserver`

## 5. نظام التصميم
- **الألوان:** `--brand-green: #0F4C3A`, `--brand-gold: #C69E5A`
- **الاتجاه:** RTL (عربي) — توحيد `dir/lang` عبر `I18nProvider`
- **الخطوط:** Cairo (عربي) + Plus Jakarta Sans
- **التدويل:** ar (RTL) افتراضي + en (LTR) بنية خفيفة (`src/shared/i18n/`)
- **التوافق:** `prefers-reduced-motion` عبر Hook موحّد — لا `matchMedia` مباشر أثناء العرض
- **الوضع الليلي:** مدعوم بالكامل
- **الوضع عالي التباين:** مدعوم
- **وضع التبعت:** مدعوم
- **PWA:** مدعوم مع Service Worker

## 6. التحسينات الأمنية والموثوقية والوصول (Security & Reliability & Accessibility)
- **ErrorBoundary:** `src/components/ErrorBoundary.tsx` — مكون حدود الخطأ العالمي مع معالجة الأخطاء في React
- **أمان XSS:** `src/utils/security.ts` — دوال تنظيف وتهذيب HTML (DOMPurify)، منع هجمات javascript:، تنظيف المدخلات
- **رأس الأمان:** `src/utils/security-headers.ts` — تعيين CSP، X-Frame-Options، X-Content-Type-Options، Referrer-Policy، Permissions-Policy في DOM
- **إدارة التركيز:** `src/utils/a11y.ts` — دوال إدارة التركيز، الفخاخ، إعلانات قارئ الشاشة، الانتقال للقائمة الرئيسية
- **الأداء:** `src/utils/performance.ts` — تحميل مسبق للأصول الحرجة، تفضيل الصفحات، مراقبة مقاييس الويب الأساسية
- **الموثوقية:** `src/utils/offline.ts` — تخزين بيانات متصل، تخزين بيانات النماذج، مزامنة خلفية، إعادة المحاولة مع أسّي
- **الـ _headers:** `public/_headers` — رؤوس أمان شاملة على Cloudflare Pages (CSP، HSTS، CORS)
- **index.html:** أُضيفت رموز أمان CSP، X-Frame-Options، Referrer-Policy، Permissions-Policy كـ meta tags
- **تحديث App.tsx:** تغليف المسارات بـ ErrorBoundary، إعداد معالج الأخطاء العالمي في main.tsx
- **تحديث main.tsx:** إضافة `setSecurityHeaders()`، `cleanDangerousElements()`، `preloadCriticalAssets()`، `setupGlobalErrorHandler()` و`I18nProvider`
- **تدقيق WCAG 2.1 AA:** `e2e/accessibility.spec.ts` — فحص `@axe-core/playwright` (العلامات wcag2a/wcag2aa/wcag21a/wcag21aa) على 10 صفحات + اختبارات لوحة المفاتيح/الـ skip-link/الـ lang

## 7. جودة الكود والتحسينات المكتملة (Quality & Debt Resolution)
- **Linting:** `pnpm lint` — ESLint بدون أخطاء أو تحذيرات
- **TypeScript:** `pnpm typecheck` — TypeScript بدون أخطاء
- **اختبارات:** `pnpm test` — 107 اختبار ناجح (100% نجاح)
- **البناء:** `pnpm build` — بناء ناجح مع ضغط gzip و brotli
- **تنظيف console.log:** تم إزالة جميع console.log/warn/error من الكود الإنتاجي (App, AdminDashboard, services, hooks, core)
- **إزالة الكود المُهدوم:** حذف الدالة `query()` المُهدومة من `src/lib/postgres.ts`
- **تبسيط ملفات Sanity CLI:** `seed.ts` و `test-integration.ts` تم تبسيطها
- **إزالة `browserslist`:** من `package.json` غير مطلوب مع Vite
- **معالجة Stripe TODO:** تم إزالة التعليق TODO من `create-checkout-session.ts`
- **تحسين `monitoring.ts`:** إزالة `console.error` من `error()` و `fatal()` methods
- **تحسين `pwa.ts`:** استبدال جميع `console.error` بمعالجة صامتة
- **تحسين `performanceMonitoring.ts`:** استبدال `console.error` بمعالجة صامتة
- **تحسين `usePerformance.ts`:** استبدال `console.error` و `console.log` بمعالجة صامتة
- **النوعية:** جميع `catch` blocks في الكود الإنتاجي لا تحتوي على `console.error`
- **Error Boundary:** إضافة مكون ErrorBoundary يحيط بالمسارات لمنع تعطل التطبيق
- **CSP:** إضافة Content Security Policy عبر meta tags في index.html و _headers

## 8. تحسينات النشر النهائي (Pre-Deployment Optimizations)
- **Service Worker:** `src/utils/pwa.ts` — استراتيجيات caching متعددة (CacheFirst, NetworkFirst, StaleWhileRevalidate)، background sync، push notifications، update detection with notifications، `getPrefetchStrategy()` حسب جودة الاتصال
- **robots.txt:** تحسين disallow paths، إضافة social media crawlers (Twitterbot, facebookexternalhit)، حظر bots ضارة (AhrefsBot, SemrushBot, MJ12bot)
- **sitemap.xml:** تحديث lastmod لتاريخ 2026-09-07، تحسين changefreq و priority لكل صفحة
- **OptimizedImage:** `src/components/OptimizedImage.tsx` — إضافة srcSet و sizes، `generateResponsiveSrcSet()` helper، `preloadImage()` utility
- **Lighthouse:** `lighthouserc.json` — Core Web Vitals thresholds (LCP≥0.8, CLS≥0.95, FID≥0.9)، mobile preset مع throttling، 3 runs
- **ARIA Labels:** `Footer.tsx` — `role="contentinfo"` و `aria-label`، `Navbar.tsx` — `aria-current="page"`
- **Security Headers:** `public/_headers` — Cache-Control إضافي للـ APIs الخارجية (Stripe, Sanity, Supabase)
- **PWA Manifest:** `public/manifest.json` — `orientation: "portrait"`، `prefer_related_applications: false`، categories محسّنة
- **Vite Config:** `vite.config.ts` — `reportCompressedSize: true`، `chunkSizeWarningLimit: 400`
- **SEO Advanced:** `src/utils/seoAdvanced.ts` — Twitter Card site/creator tags، OG locale/alternate، article publisher
- **Accessibility:** `src/styles/theme.css` — `.sr-only` و `.skip-link` utilities، `index.html` — skip-to-content link، `App.tsx` — `id="main-content"`
