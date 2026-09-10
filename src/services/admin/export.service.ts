// Export service for CSV/PDF generation

export class ExportService {
  toCSV(data: Record<string, unknown>[], columns: { key: string; label: string }[]): string {
    const headers = columns.map(c => c.label).join(',');
    const rows = data.map(row =>
      columns.map(c => {
        const val = String(row[c.key] ?? '');
        return val.includes(',') ? `"${val}"` : val;
      }).join(',')
    );
    return [headers, ...rows].join('\n');
  }

  downloadCSV(data: Record<string, unknown>[], columns: { key: string; label: string }[], filename: string): void {
    const csv = this.toCSV(data, columns);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async downloadPDF(content: string, filename: string): Promise<void> {
    // Simple HTML-to-print PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: 'Cairo', sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background: #059669; color: white; }
            .header { text-align: center; margin-bottom: 20px; }
            .date { color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>حملة رحماء بينهم</h1>
            <p class="date">${new Date().toLocaleDateString('ar-YE')}</p>
          </div>
          ${content}
          <script>window.onload=()=>window.print();</script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}

export const exportService = new ExportService();
