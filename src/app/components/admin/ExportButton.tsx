import { useState, memo } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { exportService } from '@/services/admin/export.service';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  columns: { key: string; label: string }[];
  filename: string;
  title: string;
}

export const ExportButton = memo(function ExportButton({ 
  data, columns, filename, title 
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      exportService.downloadCSV(data, columns, filename);
    } finally {
      setExporting(false);
      setIsOpen(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const tableHTML = `
        <h2>${title}</h2>
        <table>
          <thead><tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
          <tbody>${data.map(row => 
            `<tr>${columns.map(c => `<td>${row[c.key] ?? ''}</td>`).join('')}</tr>`
          ).join('')}</tbody>
        </table>
      `;
      await exportService.downloadPDF(tableHTML, filename);
    } finally {
      setExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
      >
        <Download className="h-4 w-4" />
        تصدير
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-xl" dir="rtl">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[var(--muted)]"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
              تصدير CSV
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[var(--muted)]"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              تصدير PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
});