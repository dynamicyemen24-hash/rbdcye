import { memo } from 'react';

export const SkipToContent = memo(function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-xl focus:bg-[var(--brand-green)] focus:px-6 focus:py-3 focus:text-white focus:shadow-lg"
    >
      تخطي إلى المحتوى الرئيسي
    </a>
  );
});