// Enterprise Loading Skeletons - Performance Optimized
// cSpell:ignore جاري التحميل
import { memo } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = memo(function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-skeleton-shimmer',
    none: ''
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <output className={`space-y-2 ${className}`} aria-label="جاري التحميل">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]}`}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : width || '100%',
              height: height || '1em'
            }}
          />
        ))}
      </output>
    );
  }

  return (
    <output
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-label="جاري التحميل"
    />
  );
});

// Pre-built skeleton components for common use cases
export const CardSkeleton = memo(function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)] animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
});

export const ProjectCardSkeleton = memo(function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--border)] animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-gray-200 rounded-lg flex-1" />
          <div className="h-8 bg-gray-200 rounded-lg flex-1" />
        </div>
      </div>
    </div>
  );
});

export const StatsCardSkeleton = memo(function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-[var(--border)] animate-pulse">
      <div className="w-14 h-14 rounded-xl bg-gray-200 mb-5" />
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  );
});

export const FormFieldSkeleton = memo(function FormFieldSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-12 bg-gray-200 rounded-lg" />
    </div>
  );
});

export const TableRowSkeleton = memo(function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={`cell-${i}`} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
});

export const ArticleSkeleton = memo(function ArticleSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--border)] animate-pulse">
      <div className="w-full h-56 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="h-5 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="flex items-center gap-3 pt-2">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-2 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
});

// Skeleton presets for common pages
export const PageSkeletons = {
  home: () => (
    <div className="space-y-8">
      <div className="h-[600px] bg-gray-200 rounded-3xl animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  ),

  projects: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  ),

  news: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ArticleSkeleton key={i} />
      ))}
    </div>
  ),

  contact: () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <FormFieldSkeleton />
      <FormFieldSkeleton />
      <div className="h-40 bg-gray-200 rounded-lg animate-pulse" />
      <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  ),

  table: ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};