// ============================================================
// @nexora/shared - Sync Protocol
// Delta Sync + Conflict Detection + Resolution Rules
// ============================================================

import type {
  SyncOperationPayload,
  SyncChange,
  SyncEntityType,
  ConflictClassification,
  SyncOperation,
} from '../types/index.js';

// ─── Conflict Classification ───
export function classifyConflict(entityType: string, payload: Record<string, unknown>): ConflictClassification {
  // Financial data requires controlled review
  if (entityType === 'expense_request' || entityType === 'inventory_issue' || entityType === 'approval') {
    return 'financial_controlled';
  }

  // Workflow transitions and amount changes require server validation
  if (entityType === 'task' && ('status' in payload || 'amount' in payload || 'quantity' in payload)) {
    return 'workflow_or_amount';
  }

  // Everything else can be field-merged
  return 'field_mergeable';
}

// ─── Version Comparison ───
export function needsConflictDetection(
  clientBaseVersion: number | null,
  serverVersion: number
): boolean {
  if (clientBaseVersion === null) return false;
  return clientBaseVersion < serverVersion;
}

// ─── Conflict Resolution Rules ───
export interface ResolutionRule {
  entityType: SyncEntityType;
  classification: ConflictClassification;
  strategy: 'server_wins' | 'client_wins' | 'merge' | 'requires_review';
  description: string;
}

export const RESOLUTION_RULES: ResolutionRule[] = [
  {
    entityType: 'task',
    classification: 'workflow_or_amount',
    strategy: 'requires_review',
    description: 'Task status transitions require server-side validation',
  },
  {
    entityType: 'expense_request',
    classification: 'financial_controlled',
    strategy: 'requires_review',
    description: 'Financial requests require approval workflow',
  },
  {
    entityType: 'inventory_issue',
    classification: 'financial_controlled',
    strategy: 'requires_review',
    description: 'Inventory issues require controlled review',
  },
  {
    entityType: 'approval',
    classification: 'financial_controlled',
    strategy: 'server_wins',
    description: 'Approval decisions are server-authoritative',
  },
  {
    entityType: 'beneficiary',
    classification: 'field_mergeable',
    strategy: 'merge',
    description: 'Beneficiary updates can be field-merged',
  },
  {
    entityType: 'evidence',
    classification: 'field_mergeable',
    strategy: 'merge',
    description: 'Evidence uploads are append-only',
  },
  {
    entityType: 'transaction',
    classification: 'financial_controlled',
    strategy: 'requires_review',
    description: 'Financial transactions require reconciliation',
  },
];

export function getResolutionRule(
  entityType: SyncEntityType,
  classification: ConflictClassification
): ResolutionRule | undefined {
  return RESOLUTION_RULES.find(
    (rule) => rule.entityType === entityType && rule.classification === classification
  );
}

// ─── Task Workflow Rules ───
const TASK_TRANSITIONS: Record<string, string[]> = {
  assigned: ['accepted'],
  accepted: ['in_progress'],
  in_progress: ['submitted'],
  submitted: ['review'],
  review: ['approved', 'returned'],
  returned: ['in_progress'],
  approved: ['closed'],
  closed: [],
};

export function canTransition(from: string, to: string): boolean {
  return TASK_TRANSITIONS[from]?.includes(to) ?? false;
}

// ─── Idempotency Key Generation ───
export function generateIdempotencyKey(
  entityType: string,
  entityId: string,
  operation: string,
  clientTimestamp: string
): string {
  return `${entityType}:${entityId}:${operation}:${clientTimestamp}`;
}

// ─── Delta Sync Helpers ───
export function filterChangesByEntityTypes(
  changes: SyncChange[],
  entityTypes?: SyncEntityType[]
): SyncChange[] {
  if (!entityTypes || entityTypes.length === 0) return changes;
  return changes.filter((change) => entityTypes.includes(change.entityType));
}

export function sortByVersion(changes: SyncChange[]): SyncChange[] {
  return [...changes].sort((a, b) => a.version - b.version);
}

// ─── Tombstone Detection ───
export function isTombstone(change: SyncChange): boolean {
  return change.operation === 'delete';
}

// ─── Batch Splitting ───
export function splitBatch<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

// ─── Retry Logic ───
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
};

export function calculateRetryDelay(attempt: number, config: RetryConfig = DEFAULT_RETRY_CONFIG): number {
  const delay = config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt);
  return Math.min(delay, config.maxDelayMs);
}

// ─── Network State Detection ───
export function classifyNetworkError(error: unknown): 'transient' | 'permanent' | 'auth' {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('401') || message.includes('403') || message.includes('Unauthorized')) {
    return 'auth';
  }

  if (
    message.includes('ECONNRESET') ||
    message.includes('ETIMEDOUT') ||
    message.includes('ENOTFOUND') ||
    message.includes('fetch') ||
    message.includes('NetworkError')
  ) {
    return 'transient';
  }

  return 'permanent';
}

// Re-export engine functions
export {
  handleSyncPush,
  handleSyncPull,
  encodeCursor,
  decodeCursor,
  getTableName,
} from './engine.js';

export { default as syncRouter } from './router.js';

export type {
  SyncPushRequest,
  SyncOperation,
  SyncPushResult,
  SyncResult,
  ConflictInfo,
  SyncPullRequest,
  SyncPullResponse,
  SyncChange as SyncChangeDetail,
} from './engine.js';
