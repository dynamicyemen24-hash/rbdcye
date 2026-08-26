declare module 'drizzle-orm/pg-core' {
  export interface ColumnBuilder {
    primaryKey(): ColumnBuilder;
    notNull(): ColumnBuilder;
    default(value: any): ColumnBuilder;
    defaultNow(): ColumnBuilder;
    defaultRandom(): ColumnBuilder;
    references(ref: any): ColumnBuilder;
    unique(): ColumnBuilder;
  }

  export interface Column {
    name: string;
    type: string;
  }

  export interface Table {
    [key: string]: Column;
  }

  export function pgTable(name: string, columns: Record<string, any>, extra?: any): Table;
  export function uuid(name: string): ColumnBuilder;
  export function text(name: string): ColumnBuilder;
  export function timestamp(name: string, options?: { withTimezone?: boolean }): ColumnBuilder;
  export function numeric(name: string): ColumnBuilder;
  export function integer(name: string): ColumnBuilder;
  export function boolean(name: string): ColumnBuilder;
  export function jsonb(name: string): ColumnBuilder;
  export function date(name: string): ColumnBuilder;
  export function index(name: string): {
    on(...columns: any[]): any;
  };
  export function uniqueIndex(name: string): {
    on(...columns: any[]): any;
  };
  export function check(name: string, expression: any): any;
}

declare module 'drizzle-orm' {
  export function sql(strings: TemplateStringsArray, ...values: any[]): any;
}
