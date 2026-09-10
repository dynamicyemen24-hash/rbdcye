import { memo, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export const Pagination = memo(function Pagination({ 
  currentPage, totalPages, onPageChange, totalItems, pageSize 
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row" dir="rtl">
      <span className="text-sm text-[var(--muted-foreground)]">
        عرض {startItem}–{endItem} من {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-[var(--muted)]"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-[var(--muted)]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {pageNumbers.map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-[var(--muted-foreground)]">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] rounded-lg px-2 py-1 text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-[var(--brand-green)] text-white'
                  : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-[var(--muted)]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-[var(--muted)]"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});