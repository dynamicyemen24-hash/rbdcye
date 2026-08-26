declare module 'pg' {
  export interface QueryResultRow {
    [key: string]: any;
  }

  export interface QueryResult<T extends QueryResultRow = any> {
    rows: T[];
    rowCount: number | null;
    command: string;
    oid: number;
    fields: any[];
  }

  export interface PoolConfig {
    host?: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    ssl?: boolean | any;
    max?: number;
    min?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
    statement_timeout?: number;
    query_timeout?: number;
    connectionString?: string;
    application_name?: string;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    connect(): Promise<PoolClient>;
    query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
    end(): Promise<void>;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  export interface PoolClient {
    query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
    release(err?: Error): void;
  }

  export class Client {
    constructor(config?: PoolConfig);
    connect(): Promise<void>;
    query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
    end(): Promise<void>;
  }
}
