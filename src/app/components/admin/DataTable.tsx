import { Search, ChevronDown } from 'lucide-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { memo, useState, useMemo, useCallback } from 'react';

import { Pagination } from './Pagination';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data, columns, searchable = true, searchPlaceholder = 'بحث...', 
  pageSize = 25, onRowClick, emptyMessage = 'لا توجد بيانات'
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(row => 
        columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        const cmp = String(aVal).localeCompare(String(bVal), 'ar');
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, sortKey, sortDir, columns]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = useCallback((key: string) => {
    setSortKey(prev => prev === key ? null : key);
    setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  return (
    <div className="space-y-4" dir="rtl">
      {searchable && (
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 pr-10 pl-4 text-sm"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    className={`px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] ${
                      col.sortable !== false ? 'cursor-pointer hover:text-[var(--foreground)]' : ''
                    }`}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        <ChevronDown className={`h-3 w-3 transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedData.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-[var(--border)] last:border-0 transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-[var(--muted)]' : ''
                  }`}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-[var(--foreground)]">
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagedData.length === 0 && (
          <div className="py-12 text-center text-[var(--muted-foreground)]">{emptyMessage}</div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filteredData.length}
        pageSize={pageSize}
      />
    </div>
  );
}