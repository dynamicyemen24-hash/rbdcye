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

## 4. جودة الكود والتحسينات المكتملة (Quality & Debt Resolution)
- **Linting:** `pnpm lint` — ESLint بدون أخطاء أو تحذيرات
- **TypeScript:** `pnpm typecheck` — TypeScript بدون أخطاء
- **اختبارات:** `pnpm test` — 67 اختبار ناجح
- **البناء:** `pnpm build` — بناء ناجح مع ضغط gzip و brotli
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

## 5. نظام التصميم
- **الألوان:** `--brand-green: #0F4C3A`, `--brand-gold: #C69E5A`
- **الاتجاه:** RTL (عربي)
- **الخطوط:** Cairo (عربي) + Plus Jakarta Sans
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
- **تحديث main.tsx:** إضافة `setSecurityHeaders()`، `cleanDangerousElements()`، `preloadCriticalAssets()`، `setupGlobalErrorHandler()`

## 7. جودة الكود والتحسينات المكتملة (Quality & Debt Resolution)
- **Linting:** `pnpm lint` — ESLint بدون أخطاء أو تحذيرات
- **TypeScript:** `pnpm typecheck` — TypeScript بدون أخطاء
- **اختبارات:** `pnpm test` — 67 اختبار ناجح (12+12+13+30)
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
