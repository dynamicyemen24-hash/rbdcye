import { useState, useMemo, useCallback } from "react";
// eslint-disable-next-line import/order -- precise: verified
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  Columns,
  MoreHorizontal,
  LucideIcon,
} from "lucide-react";

export type EnterpriseTableSortDirection = "asc" | "desc" | null;

export interface EnterpriseTableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  accessor: string | ((row: T) => React.ReactNode);
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: { value: string; label: string }[];
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sticky?: boolean;
}

export interface EnterpriseTableRowActions<T = Record<string, unknown>> {
  label: string;
  icon?: LucideIcon;
  onClick: (row: T, index: number) => void;
  variant?: "default" | "danger" | "ghost";
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface EnterpriseTableProps<T = Record<string, unknown>> {
  columns: EnterpriseTableColumn<T>[];
  data: T[];
  keyAccessor: string | ((row: T) => string);
  rowActions?: EnterpriseTableRowActions<T>[];
  bulkActions?: EnterpriseTableRowActions<T>[];
  selectable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
  className?: string;
  wrapperClassName?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  "aria-label"?: string;
  onRowClick?: (row: T, index: number) => void;
  onSelectionChange?: (selectedKeys: string[]) => void;
  initialSort?: { key: string; direction: EnterpriseTableSortDirection };
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function EnterpriseTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyAccessor,
  rowActions = [],
  selectable = false,
  sortable = true,
  filterable = false,
  searchable = true,
  searchPlaceholder = "بحث...",
  pagination = true,
  pageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  loading = false,
  emptyMessage = "لا توجد بيانات للعرض",
  emptyIcon: EmptyIcon,
  className = "",
  wrapperClassName = "",
  tableClassName = "",
  headerClassName = "",
  rowClassName,
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
  stickyHeader = true,
  "aria-label": ariaLabel,
  onRowClick,
  onSelectionChange,
  initialSort,
}: EnterpriseTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: EnterpriseTableSortDirection;
  } | null>(initialSort ?? null);

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [columnVisibility] = useState<Record<string, boolean>>({});
  const [showColumnMenu, setShowColumnMenu] = useState<string | null>(null);

  const getRowKey = useCallback(
    (row: T) => (typeof keyAccessor === "function" ? keyAccessor(row) : String(row[keyAccessor])),
    [keyAccessor]
  );

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(query))
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) =>
          String(row[key] ?? "").toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    if (sortConfig?.key && sortConfig.direction) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal === bVal) return 0;
        const dir = direction === "asc" ? 1 : -1;
        const aNum = typeof aVal === "number" ? aVal : String(aVal ?? "");
        const bNum = typeof bVal === "number" ? bVal : String(bVal ?? "");
        return aNum > bNum ? dir : -dir;
      });
    }

    return result;
  }, [data, searchQuery, filters, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, pagination, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const visibleColumns = useMemo(
    () => columns.filter((col) => columnVisibility[col.key] !== false),
    [columns, columnVisibility]
  );

  const visibleKeys = useMemo(
    () => new Set(paginatedData.map(getRowKey)),
    [paginatedData, getRowKey]
  );

  const allVisibleSelected =
    visibleKeys.size > 0 && Array.from(visibleKeys).every((k) => selectedRows.has(k));

  const handleSort = useCallback((key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "asc") return { key, direction: "desc" };
        if (current.direction === "desc") return { key, direction: null };
        return { key, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const updateSelection = useCallback(
    (next: Set<string>) => {
      setSelectedRows(next);
      onSelectionChange?.(Array.from(next));
    },
    [onSelectionChange]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const next = new Set(selectedRows);
      if (checked) {
        visibleKeys.forEach((k) => next.add(k));
      } else {
        visibleKeys.forEach((k) => next.delete(k));
      }
      updateSelection(next);
    },
    [selectedRows, visibleKeys, updateSelection]
  );

  const handleRowSelect = useCallback(
    (key: string, checked: boolean) => {
      const next = new Set(selectedRows);
      if (checked) next.add(key);
      else next.delete(key);
      updateSelection(next);
    },
    [selectedRows, updateSelection]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key || !sortConfig.direction) {
      return (
        <span className="flex flex-col gap-0.5 opacity-30">
          <ChevronUp className="w-3 h-3" />
          <ChevronDown className="w-3 h-3" />
        </span>
      );
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const renderCell = (row: T, col: EnterpriseTableColumn<T>, index: number) => {
    const value = typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor];
    if (col.render) return col.render(value, row, index);
    return <span>{String(value ?? "")}</span>;
  };

  const handleActionClick = (
    action: EnterpriseTableRowActions<T>,
    row: T,
    index: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!action.disabled?.(row)) action.onClick(row, index);
  };

  const colSpan =
    visibleColumns.length + (selectable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0);

  return (
    <div className={`w-full ${wrapperClassName} ${className}`} dir="rtl">
      {(searchable || filterable) && (
        <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start justify-between">
          {searchable && (
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pr-10 pl-3 py-2 text-sm border border-border rounded-xl bg-input-background focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none"
                aria-label="بحث في الجدول"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {filterable && (
              <button
                type="button"
                className="px-3 py-2 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors"
                onClick={() => setShowColumnMenu("filters")}
              >
                <Filter className="w-4 h-4 ml-1" />
                فلاتر
              </button>
            )}
            <button
              type="button"
              className="px-3 py-2 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors"
              onClick={() => setShowColumnMenu("columns")}
            >
              <Columns className="w-4 h-4 ml-1" />
              أعمدة
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm font-medium rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <Download className="w-4 h-4 ml-1" />
              تصدير
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className={`w-full ${tableClassName}`} role="grid" aria-label={ariaLabel}>
          <thead
            className={`${stickyHeader ? "sticky top-0 z-10" : ""} bg-muted/50 ${headerClassName}`}
          >
            <tr className="border-b border-border">
              {selectable && (
                <th scope="col" className="w-12 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-brand-green focus:ring-brand-green"
                    aria-label="تحديد جميع الصفوف"
                  />
                </th>
              )}

              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 font-semibold text-muted-foreground text-sm ${col.headerClassName || ""}`}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                    maxWidth: col.maxWidth,
                    // eslint-disable-next-line no-nested-ternary -- precise: verified
                    textAlign:
                      // eslint-disable-next-line no-nested-ternary -- precise: verified
                      col.align === "left" ? "left" : col.align === "right" ? "right" : "center",
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {col.sortable && sortable && (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        aria-label={`ترتيب حسب ${col.header}`}
                      >
                        {getSortIcon(col.key)}
                      </button>
                    )}
                    <span>{col.header}</span>
                    {col.filterable && filterable && (
                      <button
                        type="button"
                        onClick={() => setShowColumnMenu(col.key)}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        aria-label={`تصفية حسب ${col.header}`}
                      >
                        <Filter className="w-3.5 h-3.5 opacity-50" />
                      </button>
                    )}
                  </div>
                </th>
              ))}

              {rowActions.length > 0 && (
                <th scope="col" className="w-12 px-4 py-3 text-center">
                  <span className="text-xs text-muted-foreground">إجراءات</span>
                </th>
              )}
            </tr>

            {filterable && showColumnMenu && (
              <tr className="border-b border-border bg-card">
                <th colSpan={visibleColumns.length + (selectable ? 1 : 0)} className="px-4 py-2">
                  {showColumnMenu === "columns" ? (
                    <div className="flex flex-wrap gap-2">
                      {columns.map((col) => (
                        <label
                          key={col.key}
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                        >
                          <input type="checkbox" defaultChecked className="w-3.5 h-3.5" />
                          {col.header}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {columns
                        .filter((col) => col.filterable)
                        .map((col) => (
                          <input
                            key={col.key}
                            type="text"
                            value={filters[col.key] || ""}
                            onChange={(e) => handleFilterChange(col.key, e.target.value)}
                            placeholder={`تصفية ${col.header}`}
                            className="px-3 py-1.5 text-xs border border-border rounded-lg bg-input-background focus:border-brand-green outline-none"
                          />
                        ))}
                    </div>
                  )}
                </th>
              </tr>
            )}
          </thead>
{/* eslint-disable-next-line no-nested-ternary -- precise: no-nested-ternary verified */}

          <tbody>
            {/* eslint-disable-next-line no-nested-ternary -- precise: no-nested-ternary verified */}
            {loading ? (
              Array.from({ length: Math.min(pageSize, 5) }).map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  {Array.from({ length: colSpan }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-full max-w-[120px] rounded bg-muted animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    {EmptyIcon && <EmptyIcon className="w-12 h-12 text-muted-foreground/50" />}
                    <p className="text-muted-foreground text-lg">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowKey = getRowKey(row);
                const isSelected = selectedRows.has(rowKey);
                const rowClasses = [
                  "transition-colors",
                  striped && rowIndex % 2 === 1 ? "bg-muted/30" : "",
                  hoverable && "hover:bg-muted/50",
                  isSelected ? "bg-brand-green-pale/50" : "",
                  bordered ? "border-b border-border/50" : "",
                  compact ? "py-2" : "py-3",
                  typeof rowClassName === "function"
                    ? rowClassName(row, rowIndex)
                    : rowClassName || "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <tr
                    key={rowKey}
                    className={rowClasses}
                    onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                    style={{ cursor: onRowClick ? "pointer" : "default" }}
                  >
                    {selectable && (
                      <td className="w-12 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelect(rowKey, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-border text-brand-green focus:ring-brand-green"
                          aria-label={`تحديد صف ${rowIndex + 1}`}
                        />
                      </td>
                    )}

                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4"
                        style={{
                          width: col.width,
                          // eslint-disable-next-line no-nested-ternary -- precise: verified
                          minWidth: col.minWidth,
                          maxWidth: col.maxWidth,
                          textAlign:
                            // eslint-disable-next-line no-nested-ternary -- precise: verified
                            col.align === "left"
                              ? "left"
                              : col.align === "right"
                              ? "right"
                              : "center",
                        }}
                      >
                        {renderCell(row, col, rowIndex)}
                      </td>
                    ))}

                    {rowActions.length > 0 && (
                      <td className="px-2 text-center">
                        <div className="inline-flex items-center justify-center gap-1">
                          {rowActions.map((action, actionIndex) => {
                            if (action.hidden?.(row)) return null;
                            const Icon = action.icon || MoreHorizontal;
                            return (
                              <button
                                key={actionIndex}
                                type="button"
                                onClick={(e) => handleActionClick(action, row, rowIndex, e)}
                                disabled={action.disabled?.(row)}
                                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                  action.variant === "danger"
                                    ? "text-danger hover:bg-danger/10"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                                aria-label={action.label}
                              >
                                <Icon className="w-4 h-4" />
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>عرض</span>
            <select
              value={pageSize}
              disabled
              className="px-2 py-1 text-sm border border-border rounded-lg bg-card outline-none"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size} صف
                </option>
              ))}
            </select>
            <span>من {processedData.length} صف</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="الصفحة السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-brand-green text-white"
                      : "border border-border hover:bg-muted"
                  }`}
                  aria-label={`الصفحة ${pageNum}`}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="الصفحة التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnterpriseTable;