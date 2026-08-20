import React from 'react';

interface ProjectCardSkeletonProps {
  count?: number;
}

export function ProjectCardSkeleton({ count = 6 }: ProjectCardSkeletonProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 font-cairo dir-rtl">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-md animate-pulse flex flex-col min-h-[460px]"
        >
          {/* Image Placeholder */}
          <div className="relative h-48 sm:h-52 w-full bg-slate-200 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-slate-300" />
            
            {/* Top Badges Overlay */}
            <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
              <div className="h-6 w-20 bg-slate-300/80 rounded-full" />
              <div className="h-6 w-24 bg-slate-300/80 rounded-full" />
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Category & Location */}
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-slate-200 rounded" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
              </div>

              {/* Title */}
              <div className="h-6 w-4/5 bg-slate-200 rounded-lg" />

              {/* Description lines */}
              <div className="space-y-2 pt-1">
                <div className="h-3.5 w-full bg-slate-200 rounded" />
                <div className="h-3.5 w-3/4 bg-slate-200 rounded" />
              </div>
            </div>

            {/* Progress Bar & Stats Skeleton */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-3 w-12 bg-slate-200 rounded" />
              </div>

              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 w-2/5" />
              </div>

              {/* Raised / Target Stats */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 space-y-1">
                  <div className="h-3 w-12 bg-slate-200 rounded" />
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 space-y-1">
                  <div className="h-3 w-12 bg-slate-200 rounded" />
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                </div>
              </div>

              {/* Action Button Skeleton */}
              <div className="h-11 w-full bg-slate-200 rounded-xl mt-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectCardSkeleton;
