// Dynamic import declaration for optional xlsx module
declare module "xlsx" {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [sheet: string]: WorkSheet };
  }
  export interface WorkSheet {
    [cell: string]: CellObject;
  }
  export interface CellObject {
    v: unknown;
    w?: string;
    t?: string;
  }
  export function write(wb: WorkBook, opts?: WriteOptions): ArrayBuffer;
  export function read(data: ArrayBuffer, opts?: ReadOptions): WorkBook;
  export namespace utils {
    function book_new(): WorkBook;
    function book_append_sheet(wb: WorkBook, ws: WorkSheet, name: string): void;
    function json_to_sheet(data: unknown[], opts?: SheetOptions): WorkSheet;
    function sheet_add_json(ws: WorkSheet, data: unknown[], opts?: AddOptions): void;
  }
}

interface WriteOptions {
  bookType: "xlsx" | "xls" | "csv";
  type: "array" | "string" | "buffer";
}

interface SheetOptions {
  header?: string[];
}

interface AddOptions {
  skipHeader?: boolean;
  origin?: string | number;
}

interface ReadOptions {
  type?: string;
}
