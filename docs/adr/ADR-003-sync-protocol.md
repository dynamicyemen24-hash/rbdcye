# ADR-003: Sync Protocol

## Status
Accepted

## Date
2026-08-23

## Context
The mobile app needs to synchronize data with the central PostgreSQL database. The sync must handle:
- Offline writes (outbox pattern)
- Delta sync (only changed data)
- Conflict detection and resolution
- Idempotent operations
- Resume after interruption

## Decision
Implement a **Cursor-Based Delta Sync** protocol with the following endpoints:

```
POST /api/nexora/sync/push    # Client pushes local changes
POST /api/nexora/sync/pull    # Client pulls server changes
POST /api/nexora/sync/ack     # Client acknowledges received changes
GET  /api/nexora/sync/status  # Check sync status
```

## Protocol Details

### Push (Client → Server)
```typescript
// Request
{
  operations: SyncOperationPayload[],
  lastCursor: string | null,
  deviceId: string
}

// Response
{
  results: SyncResult[],
  serverCursor: string,
  hasMore: boolean,
  serverTimestamp: string
}
```

### Pull (Server → Client)
```typescript
// Request
{
  cursor: string | null,
  limit: number,
  entityTypes?: string[],
  organizationId: string,
  deviceId: string
}

// Response
{
  changes: SyncChange[],
  nextCursor: string,
  hasMore: boolean,
  serverTimestamp: string
}
```

## Rationale
1. **Cursor-Based**: More reliable than timestamp-based sync
2. **Delta Sync**: Only transfers changed data, reducing bandwidth
3. **Idempotency**: Operations can be safely retried
4. **Batch Processing**: Reduces network round trips
5. **Entity-Type Filtering**: Allows selective sync
6. **Conflict Detection**: Server detects conflicts during push

## Sync Flow
```
1. Client collects local changes in outbox
2. Client pushes changes via /sync/pull
3. Server processes each operation:
   a. Validate permissions
   b. Check version conflicts
   c. Apply or flag for review
   d. Generate new version
4. Server returns results + new cursor
5. Client pulls changes via /sync/pull
6. Client applies server changes locally
7. Client acknowledges via /sync/ack
```

## Consequences
- Server is authoritative for conflict resolution
- Client must handle conflict notifications
- Sync can be interrupted and resumed safely
- Large batches are split automatically

## Alternatives Considered
- **Timestamp-Based Sync**: Prone to clock skew issues
- **CRDTs**: Overkill for this use case
- **GraphQL Subscriptions**: Not suitable for offline-first

## Related
- ADR-001: Central PostgreSQL
- ADR-004: Conflict Resolution
- ADR-002: Offline Storage
