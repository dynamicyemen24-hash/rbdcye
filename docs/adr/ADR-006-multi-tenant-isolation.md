# ADR-006: Multi-Tenant Isolation

## Status
Accepted

## Date
2026-08-23

## Context
The system supports multiple organizations (tenants). Data isolation between organizations is critical for security and compliance. Currently, isolation relies on application-level `WHERE organization_id = ...` clauses, which is error-prone.

## Decision
Implement **Defense-in-Depth Multi-Tenant Isolation** with multiple layers of protection.

## Isolation Layers

### 1. Database Level
```sql
-- Every table has organization_id
CREATE TABLE donations (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  -- ... other columns
);

-- Index for tenant isolation
CREATE INDEX idx_donations_org ON donations(organization_id);
```

### 2. API Level
```typescript
// Middleware forces organization_id from JWT
function extractTenantId(req: Request): string {
  const user = req.user;
  if (!user?.org_id) throw new Error('Unauthorized');
  return user.org_id;
}

// Never trust client-provided organization_id
app.post('/api/donations', (req, res) => {
  const orgId = extractTenantId(req); // From JWT, not body
  // Use orgId in all queries
});
```

### 3. Query Level
```typescript
// Helper function for tenant-scoped queries
async function tenantQuery(pool: Pool, orgId: string, sql: string, params: any[]) {
  // Always include organization_id filter
  const tenantSql = `${sql} WHERE organization_id = $1`;
  return pool.query(tenantSql, [orgId, ...params]);
}
```

### 4. Cache Level
```typescript
// Cache keys include organization prefix
const cacheKey = `org:${orgId}:${entity}:${id}`;
```

### 5. Sync Level
```typescript
// Sync operations are organization-scoped
syncBatchRequest.operations.forEach(op => {
  if (op.organizationId !== userOrgId) {
    throw new Error('Cross-organization sync forbidden');
  }
});
```

## Rationale
1. **Defense-in-Depth**: Multiple layers prevent single point of failure
2. **Error Prevention**: Middleware prevents accidental cross-tenant access
3. **Audit Trail**: All operations are logged with organization context
4. **Compliance**: Required for humanitarian data protection
5. **Performance**: Organization_id indexes enable fast tenant queries

## Implementation Checklist
- [ ] Every table has `organization_id` column
- [ ] Every query includes `organization_id` filter
- [ ] API middleware extracts tenant from JWT
- [ ] Cache keys include organization prefix
- [ ] Sync operations are organization-scoped
- [ ] Audit logs include organization context
- [ ] File uploads are organization-scoped
- [ ] Reports are organization-scoped

## Consequences
- All queries must include organization_id
- Cross-organization queries require admin privileges
- Tenant isolation is enforced at multiple levels
- Performance impact is minimal with proper indexing

## Alternatives Considered
- **Row Level Security (RLS)**: PostgreSQL feature, adds complexity
- **Schema-per-Tenant**: Too much overhead for this scale
- **Database-per-Tenant**: Overkill for humanitarian organization

## Related
- ADR-001: Central PostgreSQL
- ADR-005: Authentication Strategy
- ADR-007: Financial Consistency
