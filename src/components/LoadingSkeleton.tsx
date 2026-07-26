// Loading Skeletons - مكونات التحميل الموحدة

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
        <div key={`partner-${i}`} className="bg-white rounded-xl p-6 border border-[var(--border)] flex items-center justify-center">
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
        <div key={`stat-card-${i}`} className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--border)]">
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
            <div key={`table-header-${i}`} className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`table-row-${rowIndex}`} className="border-b border-[var(--border)] last:border-0">
          <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
               <div key={`table-cell-${colIndex}`} className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-[var(--secondary)] to-white flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="text-center space-y-6">
          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-3/4 mx-auto animate-pulse" />
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-1/2 mx-auto animate-pulse" />
          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-48 mx-auto animate-pulse" />
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
};