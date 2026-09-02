// Skeleton Components for Loading States - Enhanced with shimmer effect
import { motion } from 'motion/react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({ width = '100%', height = '1rem', className = '', rounded = true }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${rounded ? 'rounded-lg' : ''} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-screen min-h-[700px] overflow-hidden bg-gradient-to-br from-[var(--brand-green)]/5 to-[var(--brand-gold)]/5">
      <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center" dir="rtl">
        <Skeleton width="80px" height="80px" className="rounded-full mb-8" />
        <Skeleton height="3rem" width="60%" className="mb-4 mx-auto" />
        <Skeleton height="1.5rem" width="80%" className="mb-8 mx-auto" />
        <div className="flex gap-4 mb-12">
          <Skeleton width="150px" height="48px" className="rounded-full" />
          <Skeleton width="120px" height="48px" className="rounded-full" />
        </div>
        <div className="flex gap-8">
          <Skeleton width="100px" height="60px" className="rounded-xl" />
          <Skeleton width="100px" height="60px" className="rounded-xl" />
          <Skeleton width="100px" height="60px" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${className}`}>
      <Skeleton height="192px" className="rounded-none" />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <Skeleton width="80px" height="24px" />
          <Skeleton width="60px" height="24px" />
        </div>
        <Skeleton height="20px" width="80%" />
        <Skeleton height="16px" />
        <Skeleton height="16px" width="60%" />
        <div className="pt-3 border-t border-gray-200 flex justify-between">
          <Skeleton width="80px" height="16px" />
          <Skeleton width="100px" height="32px" className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-center p-6 bg-white rounded-xl border border-gray-200">
          <Skeleton width="60px" height="40px" className="mx-auto mb-2 rounded-lg" />
          <Skeleton width="80px" height="16px" className="mx-auto rounded" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <Skeleton height="48px" className="rounded-lg" />
      <Skeleton height="48px" className="rounded-lg" />
      <Skeleton height="120px" className="rounded-lg" />
      <Skeleton height="48px" className="rounded-lg" />
    </div>
  );
}


