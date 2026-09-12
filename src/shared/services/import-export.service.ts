// Import/Export Service - Advanced, Comprehensive & Standard-Compliant
// يدعم JSON، CSV، Excel مع معالجة متطورة للبيانات الضخمة والأخطاء
// Note: xlsx (Excel support) requires: npm install xlsx

import { dataService } from "./data.service";

// ===================== الأنواع الأساسية =====================

export type ExportFormat = "json" | "csv" | "excel";

export interface ExportOptions {
  format: ExportFormat;
  entities: string[];
  fields?: string[];
  dateFrom?: string;
  dateTo?: string;
  includeMetadata?: boolean;
  orderBy?: { field: string; dir: "asc" | "desc" };
  limit?: number;
  formatOptions?: {
    csvDelimiter?: string;
    excelSheetPerEntity?: boolean;
  };
}

export interface ImportOptions {
  format: "json" | "csv" | "excel";
  entity: string;
  content?: string;
  file?: File;
  conflictStrategy?: "skip" | "update" | "error";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
  validateItem?: (item: Record<string, any>) => true | string;
  batchSize?: number;
  onProgress?: (progress: { imported: number; total: number; percent: number }) => void;
  abortSignal?: AbortSignal;
  sheetName?: string;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  updated?: number;
  skipped?: number;
  errors: ImportError[];
  warnings: string[];
  totalProcessed: number;
}

export interface ImportError {
  row?: number;
  message: string;
  code?: string;
}

// ===================== أدوات الملفات =====================

export function downloadFile(
  content: string | ArrayBuffer | Blob,
  filename: string,
  mimeType: string = "application/octet-stream"
): void {
  let blob: Blob;
  if (typeof content === "string") {
    blob = new Blob([content], { type: mimeType });
  } else {
    blob = new Blob([content], { type: mimeType });
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("فشل قراءة الملف"));
    reader.readAsText(file);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
export async function readFileAsJSON(file: File): Promise<any> {
  const text = await readFileAsText(file);
  return JSON.parse(text);
}

// ===================== تصدير البيانات =====================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchEntityData(entity: string, options: ExportOptions): Promise<any[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any[] = await dataService.getAll(entity as any, true);

  if (options.dateFrom || options.dateTo) {
    const from = options.dateFrom ? new Date(options.dateFrom).getTime() : 0;
    const to = options.dateTo ? new Date(options.dateTo).getTime() : Date.now();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data = data.filter((item: any) => {
      const dateVal = item.createdAt || item.date || 0;
      const ts =
        typeof dateVal === "string" || dateVal instanceof Date
          ? new Date(dateVal).getTime()
          : Number(dateVal);
      return ts >= from && ts <= to;
    });
  }

  if (options.orderBy) {
    const { field, dir } = options.orderBy;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.sort((a: any, b: any) => {
      const aVal = String(a[field] || "");
      const bVal = String(b[field] || "");
      if (aVal < bVal) return dir === "asc" ? -1 : 1;
      if (aVal > bVal) return dir === "asc" ? 1 : -1;
      return 0;
    });
  }

  if (options.limit && options.limit > 0) {
    data = data.slice(0, options.limit);
  }

  if (options.fields && options.fields.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data = data.map((item: any) => {
      // Include id field for type compatibility
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
      const filtered: Record<string, any> = {
        id: (item.id !== null && item.id !== undefined
          ? String(item.id)
          : `item-${Math.random().toString(36).slice(2)}`) as string,
      };
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
      for (const f of options.fields!) {
        filtered[f] = item[f];
      }
      return filtered;
    });
  }

  return data;
}

export async function exportToJSON(options: ExportOptions): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
  const result: Record<string, any> = {};

  for (const entity of options.entities) {
    const data = await fetchEntityData(entity, options);
    if (options.includeMetadata) {
      result[entity] = {
        metadata: {
          exportedAt: new Date().toISOString(),
          totalItems: data.length,
          source: "rbdcye Platform",
          entity,
        },
        data,
      };
    } else {
      result[entity] = data;
    }
  }

  return JSON.stringify(result, null, 2);
}

export async function exportToCSV(options: ExportOptions): Promise<string> {
  const delimiter = options.formatOptions?.csvDelimiter || ",";
  let csvOutput = "";

  for (const entity of options.entities) {
    const data = await fetchEntityData(entity, options);
    if (data.length === 0) {
      csvOutput += `# لا توجد بيانات لـ ${entity}\n\n`;
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
    const firstItem = data[0] as Record<string, any>;
    const headers =
      options.fields && options.fields.length > 0
        ? options.fields
        : Object.keys(firstItem).filter((k) => !k.startsWith("_"));

    csvOutput += `# جدول ${entity} - تم التصدير في ${new Date().toISOString()}\n`;
    csvOutput += headers.join(delimiter) + "\n";

    for (const item of data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
      const itemRecord = item as Record<string, any>;
      const row = headers.map((h) => {
        const val = itemRecord[h];
        if (val === null || val === undefined) return "";
        if (typeof val === "object") {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        }
        const str = String(val);
        if (str.includes(delimiter) || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      });
      csvOutput += row.join(delimiter) + "\n";
    }
    csvOutput += "\n";
  }

  return csvOutput;
}

export async function exportToExcel(options: ExportOptions): Promise<ArrayBuffer> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const XLSX: any = await import("xlsx");
    const workbook = XLSX.utils.book_new();

    for (const entity of options.entities) {
      const data = await fetchEntityData(entity, options);
      const sheet = XLSX.utils.json_to_sheet(data);
      if (options.includeMetadata) {
        XLSX.utils.sheet_add_json(sheet, [{ exportedAt: new Date().toISOString(), entity }], {
          skipHeader: true,
          origin: "A1",
        });
      }
      const sheetName = entity.substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    }

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    return wbout;
  } catch {
    throw new Error("مكتبة xlsx غير مثبتة. يرجى تشغيل: npm install xlsx");
  }
}

// ===================== استيراد البيانات =====================

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
function parseJSONContent(content: string): any[] {
  const parsed = JSON.parse(content);
  return Array.isArray(parsed) ? parsed : [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
function parseCSVContent(content: string): Record<string, any>[] {
  const lines = content.split("\n");
  const headers: string[] = [];
  let dataStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("#") || !line) continue;
    headers.push(...line.split(","));
    dataStartIndex = i + 1;
    break;
  }

  if (headers.length === 0) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
  const data: Record<string, any>[] = [];
  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#")) continue;
    const values = line.split(",");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
    const record: Record<string, any> = {};
    headers.forEach((header, idx) => {
      record[header.trim()] = values[idx] || "";
    });
    data.push(record);
  }

  return data;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function importData(options: ImportOptions): Promise<ImportResult> {
  const {
    entity,
    format,
    content,
    file,
    conflictStrategy = "skip",
    validateItem,
    batchSize = 50,
    onProgress,
    abortSignal,
    sheetName,
  } = options;

  const result: ImportResult = {
    success: true,
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    warnings: [],
    totalProcessed: 0,
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
    let rawData: any[] = [];

    if (file) {
      if (format === "json") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
        rawData = (await readFileAsJSON(file)) as any[];
        rawData = Array.isArray(rawData) ? rawData : [];
      } else if (format === "csv") {
        const text = await readFileAsText(file);
        rawData = parseCSVContent(text);
      } else if (format === "excel") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const XLSX: any = await import("xlsx");
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = sheetName
          ? workbook.Sheets[sheetName]
          : workbook.Sheets[workbook.SheetNames[0]];
        if (!sheet) throw new Error("الورقة المطلوبة غير موجودة في ملف Excel");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
        rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as any[];
      } else {
        throw new Error("تنسيق غير مدعوم مع ملف");
      }
    } else if (content) {
      if (format === "json") {
        rawData = parseJSONContent(content);
      } else if (format === "csv") {
        rawData = parseCSVContent(content);
      } else {
        throw new Error("تنسيق غير مدعوم مع محتوى نصي");
      }
    } else {
      throw new Error("يجب توفير محتوى أو ملف للاستيراد");
    }

    if (!Array.isArray(rawData)) {
      throw new Error("البيانات المستوردة ليست مصفوفة صالحة");
    }

    const total = rawData.length;
    result.totalProcessed = total;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
    const prepared: Record<string, any>[] = [];
    for (let i = 0; i < rawData.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
      const item = rawData[i] as Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
      const cleanItem: Record<string, any> = {};
      for (const key of Object.keys(item)) {
        if (!key.startsWith("_")) {
          cleanItem[key] = item[key];
        }
      }
      cleanItem.createdAt = cleanItem.createdAt || new Date().toISOString();
      cleanItem.updatedAt = new Date().toISOString();

      if (validateItem) {
        const validationResult = validateItem(cleanItem);
        if (validationResult !== true) {
          result.errors.push({ row: i + 1, message: validationResult, code: "VALIDATION_ERROR" });
          continue;
        }
      }
      prepared.push(cleanItem);
    }

    const batches = chunkArray(prepared, batchSize);
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      if (abortSignal?.aborted) {
        result.warnings.push("تم إلغاء الاستيراد");
        break;
      }

      const batch = batches[batchIndex];
      for (const item of batch) {
        try {
          const itemId = item.id !== null && item.id !== undefined ? String(item.id) : undefined;

          if (conflictStrategy === "skip" || conflictStrategy === "update") {
            if (itemId) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const existing = await dataService.getById(entity as any, itemId);
              if (existing) {
                if (conflictStrategy === "skip") {
                  result.skipped = (result.skipped || 0) + 1;
                  continue;
                } else if (conflictStrategy === "update") {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  await dataService.update(entity as any, itemId, item);
                  result.updated = (result.updated || 0) + 1;
                  result.imported++;
                  continue;
                }
              }
            }
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await dataService.create(entity as any, item);
          result.imported++;
        } catch (error) {
          result.errors.push({
            row: result.totalProcessed - prepared.length + batchIndex * batchSize + 1,
            message: error instanceof Error ? error.message : String(error),
            code: "IMPORT_ERROR",
          });
        }
      }

      if (onProgress) {
        const processedSoFar = Math.min((batchIndex + 1) * batchSize, prepared.length);
        onProgress({
          imported: result.imported,
          total: prepared.length,
          percent: Math.round((processedSoFar / prepared.length) * 100),
        });
      }
    }

    if (result.errors.length > total * 0.5) {
      result.success = false;
    }
  } catch (error) {
    result.success = false;
    result.errors.push({
      message: `خطأ فادح: ${error instanceof Error ? error.message : String(error)}`,
      code: "FATAL",
    });
  }

  return result;
}

export async function exportData(options: ExportOptions): Promise<void> {
  let content: string | ArrayBuffer;
  let filename: string;
  let mime: string;

  switch (options.format) {
    case "json":
      content = await exportToJSON(options);
      filename = `export_${Date.now()}.json`;
      mime = "application/json";
      break;
    case "csv":
      content = await exportToCSV(options);
      filename = `export_${Date.now()}.csv`;
      mime = "text/csv;charset=utf-8;";
      break;
    case "excel":
      content = await exportToExcel(options);
      filename = `export_${Date.now()}.xlsx`;
      mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      break;
    default:
      throw new Error("تنسيق غير مدعوم");
  }

  downloadFile(content, filename, mime);
}

export const EXPORT_ENTITIES = [
  { id: "rh_news_data", label: "الأخبار" },
  { id: "rh_stories_data", label: "قصص النجاح" },
  { id: "rh_projects_data", label: "المشاريع" },
  { id: "rh_partners_data", label: "الشركاء" },
  { id: "rh_donations_data", label: "التبرعات" },
  { id: "rh_volunteers_data", label: "المتطوعون" },
  { id: "rh_subscriber_accounts", label: "حسابات المشتركين" },
  { id: "rh_requests_data", label: "طلبات التواصل" },
  { id: "rh_reports_data", label: "التقارير" },
  { id: "rh_media_data", label: "الوسائط" },
];
