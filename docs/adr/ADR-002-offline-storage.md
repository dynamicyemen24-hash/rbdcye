# ADR-002: Offline Storage Technology

## Status
Accepted

## Date
2026-08-23

## Context
NexOSMobile needs to work offline in areas with poor connectivity. Field workers must be able to:
- View assigned tasks
- Record field evidence (photos, GPS)
- Submit results
- Create expense requests
- View beneficiary information

All changes must be synced when connectivity is restored.

## Decision
Use **SQLite** via `expo-sqlite` for local offline storage on mobile devices.

## Rationale
1. **Mature Ecosystem**: SQLite is battle-tested for mobile offline storage
2. **Expo Support**: `expo-sqlite` is well-maintained and compatible with Expo SDK 54
3. **Drizzle ORM**: Drizzle supports SQLite, allowing schema sharing with PostgreSQL
4. **ACID Transactions**: Local transactions ensure data consistency
5. **Full-Text Search**: FTS5 extension for offline search
6. **Encryption**: SQLCipher for encrypting sensitive data at rest
7. **Size Limits**: SQLite handles databases up to 140TB (more than sufficient)
8. **Performance**: Single-file database with minimal overhead

## Implementation
```typescript
// Local SQLite schema (subset of central PostgreSQL schema)
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const localTasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  titleAr: text('title_ar').notNull(),
  status: text('status').notNull(),
  // ... synced fields only
});

export const localOutbox = sqliteTable('outbox', {
  id: text('id').primaryKey(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  operation: text('operation').notNull(),
  payload: text('payload').notNull(), // JSON
  status: text('status').notNull(), // pending, synced, failed
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

## Consequences
- Local database is a cache, not authoritative
- Conflict resolution happens on the server
- Sensitive data (passwords, tokens) are NOT stored locally
- Local database is wiped on logout or device revocation

## Alternatives Considered
- **IndexedDB**: Browser-based, not suitable for React Native
- **MMKV**: Key-value store, not suitable for relational data
- **WatermelonDB**: Overhead not justified for this use case
- **Realm**: Licensing concerns, larger binary size

## Related
- ADR-001: Central PostgreSQL
- ADR-003: Sync Protocol
- ADR-004: Conflict Resolution
