// ============================================================
// @nexora/shared - Unified Database Connection
// Pool واحد موحد لكل المشاريع
// ============================================================

import { Pool, PoolConfig } from 'pg';

// ─── Configuration ───
const DATABASE_URL = process.env.DATABASE_URL || process.env.NEXORA_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL or NEXORA_DATABASE_URL environment variable is required');
}

// ─── Pool Configuration ───
const poolConfig: PoolConfig = {
  connectionString: DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX || '15', 10),
  min: parseInt(process.env.DB_POOL_MIN || '2', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '45000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '15000', 10),
  statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '60000', 10),
  query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000', 10),
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
};

// ─── Singleton Pool ───
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(poolConfig);

    pool.on('error', (err) => {
      console.error('[Database] Unexpected error on idle pool client:', err.message);
    });

    pool.on('connect', () => {
      console.debug('[Database] New client connected to pool');
    });
  }
  return pool;
}

// ─── Health Check ───
export async function healthCheck(): Promise<{ healthy: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const client = await pool?.connect();
    if (!client) {
      return { healthy: false, latencyMs: 0, error: 'Pool not initialized' };
    }
    try {
      await client.query('SELECT 1 as ok');
      return { healthy: true, latencyMs: Date.now() - start };
    } finally {
      client.release();
    }
  } catch (error) {
    return {
      healthy: false,
      latencyMs: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ─── Query Helper ───
export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 };
  } finally {
    client.release();
  }
}

// ─── Transaction Helper ───
export async function transaction<T>(
  fn: (client: any) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// ─── Retry Query ───
export async function queryWithRetry<T = any>(
  text: string,
  params?: any[],
  maxRetries: number = 3
): Promise<{ rows: T[]; rowCount: number }> {
  const RETRYABLE_ERRORS = ['ECONNRESET', 'EPIPE', '57P01', 'ETIMEDOUT', '57P03'];

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await query<T>(text, params);
    } catch (error: any) {
      const isRetryable = RETRYABLE_ERRORS.some((e) => error.message?.includes(e));
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }
      const delay = 500 * attempt;
      console.warn(`[Database] Query retry ${attempt}/${maxRetries} after ${delay}ms:`, error.message);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Query failed after retries');
}

// ─── Circuit Breaker ───
let failureCount = 0;
let lastFailureTime = 0;
const FAILURE_THRESHOLD = 5;
const RECOVERY_TIMEOUT = 30000;

export function isCircuitOpen(): boolean {
  if (failureCount < FAILURE_THRESHOLD) return false;
  if (Date.now() - lastFailureTime > RECOVERY_TIMEOUT) {
    failureCount = 0;
    return false;
  }
  return true;
}

export function recordFailure(): void {
  failureCount++;
  lastFailureTime = Date.now();
}

export function recordSuccess(): void {
  failureCount = 0;
}

// ─── Graceful Shutdown ───
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('[Database] Pool closed gracefully');
  }
}

// ─── Process Handlers ───
if (typeof process !== 'undefined') {
  process.on('SIGTERM', closePool);
  process.on('SIGINT', closePool);
  process.on('beforeExit', closePool);
}
