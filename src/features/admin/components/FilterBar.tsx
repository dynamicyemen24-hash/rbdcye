import { Search, X, Calendar } from 'lucide-react';
import React from 'react';

interface FilterBarProps {
  filters: {
    status: string;
    search: string;
    country: string;
    fromDate: string;
    toDate: string;
  };
  onFilterChange: (filters: any) => void;
  onClear: () => void;
}

export function FilterBar({ filters, onFilterChange, onClear }: FilterBarProps) {
  const statusOptions = [
    { value: 'all', label: 'الكل' },
    { value: 'new', label: 'جديد' },
    { value: 'read', label: 'مقروء' },
    { value: 'replied', label: 'تم الرد' },
    { value: 'archived', label: 'مؤرشف' },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex flex-wrap items-center gap-4">
        {/* شريط البحث */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="بحث بالاسم، البريد، أو محتوى الرسالة..."
              className="w-full pr-10 pl-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* فلتر الحالة */}
        <div className="min-w-[150px]">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* فلتر التاريخ */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onFilterChange({ ...filters, fromDate: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-sm text-gray-500">إلى</span>
          <div className="relative">
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => onFilterChange({ ...filters, toDate: e.target.value })}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* زر مسح الفلاتر */}
        {(filters.search || filters.status !== 'all' || filters.fromDate || filters.toDate) && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            مسح الفلاتر
          </button>
        )}
      </div>
    </div>
  );
}

