import { memo } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'image' | 'button';
  lines?: number;
}

export const Skeleton = memo(function Skeleton({ className = '', variant = 'text', lines = 1 }: SkeletonProps) {
  const base = 'shimmer rounded-md';
  
  if (variant === 'card') {
    return (
      <div className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 ${className}`}>
        <div className={`${base} h-40 w-full mb-4`} />
        <div className={`${base} h-6 w-3/4 mb-2`} />
        <div className={`${base} h-4 w-full mb-1`} />
        <div className={`${base} h-4 w-5/6`} />
      </div>
    );
  }
  
  if (variant === 'avatar') {
    return <div className={`${base} h-12 w-12 rounded-full ${className}`} />;
  }
  
  if (variant === 'image') {
    return <div className={`${base} h-64 w-full rounded-2xl ${className}`} />;
  }
  
  if (variant === 'button') {
    return <div className={`${base} h-12 w-32 rounded-xl ${className}`} />;
  }
  
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`${base} h-4 mb-2 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
});

export const PageSkeleton = memo(function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-8" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <Skeleton variant="image" className="mb-8" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    </div>
  );
});
