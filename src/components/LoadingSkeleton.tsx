// Loading Skeletons - مكونات التحميل الموحدة

// Hero section skeleton - matches actual hero layout
export function HeroSkeleton() {
  return (
    <div
      className="min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--brand-green-dark) 0%, var(--brand-green) 30%, var(--brand-green-dark) 60%, var(--brand-green-dark) 100%)",
      }}
    >
      <div className="w-full py-28 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left column skeleton */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white/50 bg-white/20 animate-pulse"
                    />
                  ))}
                </div>
                <div className="h-4 w-48 bg-white/20 rounded animate-pulse" />
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <div className="h-12 bg-white/15 rounded-lg w-3/4 animate-pulse" />
                <div className="h-12 bg-white/15 rounded-lg w-1/2 animate-pulse" />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <div className="h-5 bg-white/10 rounded w-full animate-pulse" />
                <div className="h-5 bg-white/10 rounded w-4/5 animate-pulse" />
              </div>

              {/* CTAs */}
              <div className="flex gap-3">
                <div className="h-12 w-40 bg-white/20 rounded-xl animate-pulse" />
                <div className="h-12 w-32 bg-white/10 rounded-xl animate-pulse" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-sm mt-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="text-center p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="w-5 h-5 mx-auto mb-1.5 bg-white/15 rounded animate-pulse" />
                    <div className="h-6 w-12 mx-auto bg-white/15 rounded animate-pulse" />
                    <div className="h-3 w-10 mx-auto bg-white/10 rounded animate-pulse mt-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - verse card skeleton */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="rounded-2xl p-6 md:p-8 bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-24 bg-white/15 rounded-full animate-pulse" />
                  <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="space-y-3 mb-4">
                  <div className="h-6 bg-white/15 rounded w-full animate-pulse" />
                  <div className="h-6 bg-white/15 rounded w-4/5 animate-pulse" />
                  <div className="h-6 bg-white/15 rounded w-3/4 animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-white/10 rounded-full animate-pulse" />
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full animate-pulse ${i === 1 ? "w-8 bg-white/25" : "w-1.5 bg-white/15"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Card skeleton for news/projects
export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[var(--border)]">
      <div className="h-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-4/5 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// List skeleton
export function NewsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <NewsListItemSkeleton key={`news-list-item-${i}`} />
      ))}
    </div>
  );
}

export function NewsListItemSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-[var(--border)] flex gap-4">
      <div className="w-24 h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg flex-shrink-0 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  );
}

// Partner logo skeleton
export function PartnerSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`partner-${i}`}
          className="bg-white rounded-xl p-6 border border-[var(--border)] flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// Stats skeleton
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`stat-card-${i}`}
          className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--border)]"
        >
          <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-16 mb-2 animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[var(--border)] space-y-4">
      <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/4 mb-4 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
      <div className="h-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
      <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
    </div>
  );
}

// Table skeleton for admin
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="border-b border-[var(--border)]">
        <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={`table-header-${i}`}
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`table-row-${rowIndex}`}
          className="border-b border-[var(--border)] last:border-0"
        >
          <div
            className="grid gap-4 p-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`table-cell-${colIndex}`}
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Page skeleton for lazy-loaded pages
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="py-20 bg-gradient-to-b from-[var(--secondary)] to-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="h-8 w-48 mx-auto bg-gray-200 rounded-full animate-pulse" />
          <div className="h-10 w-96 mx-auto bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-5 w-80 mx-auto bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-[var(--border)] space-y-4"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default {
  NewsCard: NewsCardSkeleton,
  NewsList: NewsListSkeleton,
  Partner: PartnerSkeleton,
  Stats: StatsSkeleton,
  Form: FormSkeleton,
  Table: TableSkeleton,
  Hero: HeroSkeleton,
  Page: PageSkeleton,
};
