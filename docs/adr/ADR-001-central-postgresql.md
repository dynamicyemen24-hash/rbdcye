# ADR-001: Central PostgreSQL as Single Source of Truth

## Status
Accepted

## Date
2026-08-23

## Context
The NexoraOS ecosystem consists of three applications:
- NexoraOS (ERP Web/Desktop)
- NexWebSite (Public Website)
- NexOSMobile (Mobile App for Field Workers)

Each application needs access to the same data (donations, beneficiaries, projects, transactions, etc.). Currently, they all connect to the same Neon PostgreSQL database, but through different connection methods and with some schema inconsistencies.

## Decision
Use PostgreSQL (Neon) as the single authoritative data store for all three applications.

## Rationale
1. **Data Integrity**: Single source of truth prevents data inconsistency
2. **Existing Infrastructure**: All three projects already connect to the same Neon PostgreSQL
3. **ACID Compliance**: PostgreSQL provides transactional integrity for financial data
4. **Multi-Tenant Support**: `organization_id` isolation is already implemented
5. **JSONB Support**: Flexible metadata storage without schema changes
6. **Full-Text Search**: Arabic text search capabilities
7. **Extensions**: PostGIS for geographic data, pg_trgm for fuzzy search

## Consequences
- All data writes must go through the central API (NexoraOS backend)
- Mobile app uses local SQLite for offline cache, syncs to central PostgreSQL
- NexWebSite uses API endpoints instead of direct database access
- Schema changes must be coordinated across all applications

## Alternatives Considered
- **MySQL**: Already in NexOSMobile schema, but PostgreSQL is the actual data store
- **MongoDB**: NoSQL flexibility not needed for structured financial data
- **Supabase**: Used by NexWebSite, but adds another layer of abstraction

## Related
- ADR-002: Offline Storage Technology
- ADR-003: Sync Protocol
- ADR-006: Multi-Tenant Isolation
