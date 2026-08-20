import React from 'react';

interface SkipToContentProps {
  targetId?: string;
}

export function SkipToContent({ targetId = 'main-content' }: SkipToContentProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[99999] focus:px-5 focus:py-3 focus:bg-[var(--brand-green)] focus:text-white focus:rounded-2xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-400 font-bold text-sm transition-all"
    >
      الانتقال إلى المحتوى الرئيسي (اضغط Enter)
    </a>
  );
}

export default SkipToContent;
