# Sync Protocol

## Overview

The sync protocol enables offline-first operation for the mobile app. It uses cursor-based delta sync with conflict detection and resolution.

## Endpoints

### POST /api/nexora/sync/push
Push local changes to the server.

**Request:**
```typescript
{
  operations: SyncOperationPayload[];
  lastCursor: string | null;
  deviceId: string;
}
```

**Response:**
```typescript
{
  results: SyncResult[];
  serverCursor: string;
  hasMore: boolean;
  serverTimestamp: string;
}
```

### POST /api/nexora/sync/pull
Pull server changes since last cursor.

**Request:**
```typescript
{
  cursor: string | null;
  limit: number;
  entityTypes?: string[];
  organizationId: string;
  deviceId: string;
}
```

**Response:**
```typescript
{
  changes: SyncChange[];
  nextCursor: string;
  hasMore: boolean;
  serverTimestamp: string;
}
```

### POST /api/nexora/sync/ack
Acknowledge received changes.

**Request:**
```typescript
{
  cursor: string;
  deviceId: string;
}
```

### GET /api/nexora/sync/status
Get sync status for current device.

**Response:**
```typescript
{
  lastSync: string;
  pendingChanges: number;
  conflicts: number;
  deviceStatus: 'active' | 'revoked';
}
```

## Data Types

### SyncOperationPayload
```typescript
{
  operationId: string;        // UUID
  organizationId: string;     // UUID
  entityType: string;         // task, expense_request, etc.
  entityId: string;           // UUID
  operation: string;          // create, update, delete
  baseVersion: number | null; // Version for conflict detection
  baseUpdatedAt: string | null;
  payload: Record<string, unknown>;
  clientCreatedAt: string;    // ISO timestamp
  deviceId: string;
}
```

### SyncChange
```typescript
{
  entityType: string;
  entityId: string;
  operation: string;
  version: number;
  payload: Record<string, unknown>;
  timestamp: string;
  deviceId: string;
}
```

## Conflict Detection

### Version Check
```typescript
function needsConflictDetection(
  clientBaseVersion: number | null,
  serverVersion: number
): boolean {
  if (clientBaseVersion === null) return false;
  return clientBaseVersion < serverVersion;
}
```

### Classification
```typescript
function classifyConflict(entityType: string, payload: Record<string, unknown>): ConflictClassification {
  if (['expense_request', 'inventory_issue', 'approval'].includes(entityType)) {
    return 'financial_controlled';
  }
  if (entityType === 'task' && ('status' in payload || 'amount' in payload)) {
    return 'workflow_or_amount';
  }
  return 'field_mergeable';
}
```

## Resolution Rules

| Entity Type | Classification | Strategy |
|------------|---------------|----------|
| task | workflow_or_amount | requires_review |
| expense_request | financial_controlled | requires_review |
| inventory_issue | financial_controlled | requires_review |
| approval | financial_controlled | server_wins |
| beneficiary | field_mergeable | merge |
| evidence | field_mergeable | merge |
| transaction | financial_controlled | requires_review |

## Sync Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Device                           │
│                                                             │
│  1. User performs action                                    │
│     ↓                                                       │
│  2. Save to local SQLite                                   │
│     ↓                                                       │
│  3. Add to outbox queue                                    │
│     ↓                                                       │
│  4. Check connection                                        │
│     ├─ Offline → Wait for connection                       │
│     └─ Online → Continue                                   │
│     ↓                                                       │
│  5. POST /api/nexora/sync/push                             │
│     ↓                                                       │
│  6. Server processes operations                            │
│     ├─ No conflict → Apply, return success                 │
│     └─ Conflict → Classify, flag for review                │
│     ↓                                                       │
│  7. Receive results + server cursor                        │
│     ↓                                                       │
│  8. POST /api/nexora/sync/pull                             │
│     ↓                                                       │
│  9. Apply server changes locally                           │
│     ↓                                                       │
│  10. POST /api/nexora/sync/ack                             │
│      ↓                                                      │
│  11. Update local cursor                                   │
│      ↓                                                      │
│  12. Update UI                                             │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling

### Network Errors
```typescript
function classifyNetworkError(error: unknown): 'transient' | 'permanent' | 'auth' {
  const message = error instanceof Error ? error.message : String(error);
  
  if (message.includes('401') || message.includes('403')) {
    return 'auth';
  }
  
  if (['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'].some(e => message.includes(e))) {
    return 'transient';
  }
  
  return 'permanent';
}
```

### Retry Logic
```typescript
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
};

function calculateRetryDelay(attempt: number, config = DEFAULT_RETRY_CONFIG): number {
  const delay = config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt);
  return Math.min(delay, config.maxDelayMs);
}
```

## Related
- [Architecture Overview](../architecture/overview.md)
- [Conflict Resolution](./conflict-resolution.md)
- [Offline Storage](./offline-storage.md)
