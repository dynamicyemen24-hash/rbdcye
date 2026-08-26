// ============================================================
// @nexora/shared - Sync Engine
// Cursor-based delta sync with conflict detection
// ============================================================

import { query, transaction } from '../database.js';
import { classifyConflict, getResolutionRule, generateIdempotencyKey } from './index.js';
import { generateId } from '../utils/index.js';

// ─── Types ───
export interface SyncPushRequest {
  operations: SyncOperation[];
  lastCursor: string | null;
  deviceId: string;
}

export interface SyncOperation {
  operationId: string;
  organizationId: string;
  entityType: string;
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  baseVersion: number | null;
  baseUpdatedAt: string | null;
  payload: Record<string, unknown>;
  clientCreatedAt: string;
  deviceId: string;
}

export interface SyncPushResult {
  results: SyncResult[];
  serverCursor: string;
  hasMore: boolean;
  serverTimestamp: string;
}

export interface SyncResult {
  operationId: string;
  status: 'applied' | 'conflict' | 'error' | 'duplicate';
  serverVersion?: number;
  conflict?: ConflictInfo;
  error?: string;
}

export interface ConflictInfo {
  entityType: string;
  entityId: string;
  classification: 'field_mergeable' | 'workflow_or_amount' | 'financial_controlled';
  localValue: Record<string, unknown>;
  serverValue: Record<string, unknown>;
  recommendedResolution: 'merge' | 'keep_server' | 'keep_client' | 'requires_review';
  serverVersion: number;
}

export interface SyncPullRequest {
  cursor: string | null;
  limit: number;
  entityTypes?: string[];
  organizationId: string;
  deviceId: string;
}

export interface SyncPullResponse {
  changes: SyncChange[];
  nextCursor: string;
  hasMore: boolean;
  serverTimestamp: string;
}

export interface SyncChange {
  entityType: string;
  entityId: string;
  operation: string;
  version: number;
  payload: Record<string, unknown>;
  timestamp: string;
  deviceId: string;
}

// ─── Push Handler ───
export async function handleSyncPush(
  orgId: string,
  operations: SyncOperation[],
  deviceId: string
): Promise<SyncPushResult> {
  const results: SyncResult[] = [];

  for (const op of operations) {
    try {
      // Validate organization matches
      if (op.organizationId !== orgId) {
        results.push({
          operationId: op.operationId,
          status: 'error',
          error: 'Organization mismatch',
        });
        continue;
      }

      // Check for duplicate operation
      const isDuplicate = await checkDuplicateOperation(op.operationId);
      if (isDuplicate) {
        results.push({
          operationId: op.operationId,
          status: 'duplicate',
        });
        continue;
      }

      // Detect conflict
      const conflict = await detectConflict(op);
      if (conflict) {
        results.push({
          operationId: op.operationId,
          status: 'conflict',
          conflict,
        });
        continue;
      }

      // Apply operation
      const serverVersion = await applyOperation(op, deviceId);
      results.push({
        operationId: op.operationId,
        status: 'applied',
        serverVersion,
      });
    } catch (error) {
      results.push({
        operationId: op.operationId,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get current server cursor
  const serverCursor = await getServerCursor(orgId);

  return {
    results,
    serverCursor,
    hasMore: false,
    serverTimestamp: new Date().toISOString(),
  };
}

// ─── Pull Handler ───
export async function handleSyncPull(
  orgId: string,
  cursor: string | null,
  limit: number,
  entityTypes?: string[],
  deviceId?: string
): Promise<SyncPullResponse> {
  const cursorTimestamp = cursor ? decodeCursor(cursor) : new Date(0).toISOString();

  let sql = `
    SELECT 
      entity_type,
      entity_id,
      operation,
      version,
      payload,
      created_at as timestamp,
      device_id
    FROM audit_logs
    WHERE organization_id = $1
      AND created_at > $2
  `;

  const params: any[] = [orgId, cursorTimestamp];

  if (entityTypes && entityTypes.length > 0) {
    sql += ` AND entity_type = ANY($${params.length + 1})`;
    params.push(entityTypes);
  }

  sql += ` ORDER BY created_at ASC LIMIT $${params.length + 1}`;
  params.push(limit);

  const result = await query<{
    entity_type: string;
    entity_id: string;
    operation: string;
    version: number;
    payload: Record<string, unknown>;
    timestamp: string;
    device_id: string;
  }>(sql, params);

  const changes: SyncChange[] = result.rows.map((row) => ({
    entityType: row.entity_type,
    entityId: row.entity_id,
    operation: row.operation,
    version: row.version,
    payload: row.payload,
    timestamp: row.timestamp,
    deviceId: row.device_id,
  }));

  const hasMore = result.rowCount === limit;
  const nextCursor = hasMore && changes.length > 0
    ? encodeCursor(changes[changes.length - 1].timestamp)
    : cursor || encodeCursor(new Date().toISOString());

  return {
    changes,
    nextCursor,
    hasMore,
    serverTimestamp: new Date().toISOString(),
  };
}

// ─── Conflict Detection ───
async function detectConflict(op: SyncOperation): Promise<ConflictInfo | null> {
  if (op.baseVersion === null) return null;

  // Get current server version
  const tableName = getTableName(op.entityType);
  if (!tableName) return null;

  const result = await query<{
    version: number;
    updated_at: string;
    [key: string]: any;
  }>(
    `SELECT version, updated_at, * FROM ${tableName} 
     WHERE id = $1 AND organization_id = $2`,
    [op.entityId, op.organizationId]
  );

  if (result.rowCount === 0) return null;

  const serverRecord = result.rows[0];
  if (op.baseVersion < serverRecord.version) {
    // Conflict detected
    const classification = classifyConflict(op.entityType, op.payload);
    const rule = getResolutionRule(op.entityType as any, classification);

    const strategy = rule?.strategy || 'requires_review';
    const recommendedResolution = strategy === 'server_wins' ? 'keep_server' :
      strategy === 'client_wins' ? 'keep_client' : strategy as 'merge' | 'requires_review';

    return {
      entityType: op.entityType,
      entityId: op.entityId,
      classification,
      localValue: op.payload,
      serverValue: serverRecord,
      recommendedResolution,
      serverVersion: serverRecord.version,
    };
  }

  return null;
}

// ─── Apply Operation ───
async function applyOperation(op: SyncOperation, deviceId: string): Promise<number> {
  return transaction(async (client) => {
    const tableName = getTableName(op.entityType);
    if (!tableName) throw new Error(`Unknown entity type: ${op.entityType}`);

    let serverVersion: number;

    switch (op.operation) {
      case 'create':
        const insertResult = await client.query(
          `INSERT INTO ${tableName} (id, organization_id, version, created_at, updated_at)
           VALUES ($1, $2, 1, NOW(), NOW())
           RETURNING version`,
          [op.entityId, op.organizationId]
        );
        serverVersion = insertResult.rows[0].version;
        break;

      case 'update':
        const updateResult = await client.query(
          `UPDATE ${tableName} 
           SET version = version + 1, updated_at = NOW()
           WHERE id = $1 AND organization_id = $2
           RETURNING version`,
          [op.entityId, op.organizationId]
        );
        if (updateResult.rowCount === 0) throw new Error('Record not found');
        serverVersion = updateResult.rows[0].version;
        break;

      case 'delete':
        await client.query(
          `UPDATE ${tableName} 
           SET deleted_at = NOW(), version = version + 1, updated_at = NOW()
           WHERE id = $1 AND organization_id = $2`,
          [op.entityId, op.organizationId]
        );
        serverVersion = 1;
        break;

      default:
        throw new Error(`Unknown operation: ${op.operation}`);
    }

    // Log to audit
    await client.query(
      `INSERT INTO audit_logs (id, organization_id, device_id, action, entity_type, entity_id, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        generateId(),
        op.organizationId,
        deviceId,
        `sync_${op.operation}`,
        op.entityType,
        op.entityId,
        JSON.stringify(op.payload),
      ]
    );

    return serverVersion;
  });
}

// ─── Helpers ───
async function checkDuplicateOperation(operationId: string): Promise<boolean> {
  const result = await query(
    `SELECT id FROM sync_queue WHERE id = $1`,
    [operationId]
  );
  return result.rowCount > 0;
}

async function getServerCursor(orgId: string): Promise<string> {
  const result = await query<{ created_at: string }>(
    `SELECT created_at FROM audit_logs 
     WHERE organization_id = $1 
     ORDER BY created_at DESC LIMIT 1`,
    [orgId]
  );

  return result.rowCount > 0
    ? encodeCursor(result.rows[0].created_at)
    : encodeCursor(new Date().toISOString());
}

function getTableName(entityType: string): string | null {
  const tableMap: Record<string, string> = {
    task: 'field_tasks',
    beneficiary: 'beneficiaries',
    donation: 'donations',
    transaction: 'transactions',
    expense_request: 'approval_requests',
    inventory_issue: 'inventory_issues',
    evidence: 'evidence',
    volunteer: 'volunteers',
    project: 'projects',
    activity: 'activities',
  };
  return tableMap[entityType] || null;
}

function encodeCursor(timestamp: string): string {
  return Buffer.from(timestamp).toString('base64');
}

function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64').toString('utf-8');
}

// ─── Exports ───
export {
  encodeCursor,
  decodeCursor,
  getTableName,
};
