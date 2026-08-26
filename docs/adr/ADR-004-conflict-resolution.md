# ADR-004: Conflict Resolution Strategy

## Status
Accepted

## Date
2026-08-23

## Context
When multiple devices or users modify the same data offline, conflicts can occur. The system needs a strategy to detect and resolve these conflicts while maintaining data integrity, especially for financial and workflow data.

## Decision
Implement **Classification-Based Conflict Resolution** with different strategies for different data types.

## Conflict Classification

### 1. Field Mergeable
- **Examples**: Beneficiary updates, evidence uploads, field messages
- **Strategy**: Automatic merge at field level
- **Resolution**: Server merges non-conflicting fields, flags true conflicts for review

### 2. Workflow/Amount
- **Examples**: Task status transitions, quantity changes
- **Strategy**: Server-side validation with optimistic concurrency
- **Resolution**: Check `base_version` and `base_updated_at`, reject if changed

### 3. Financial Controlled
- **Examples**: Expense requests, inventory issues, approvals
- **Strategy**: Requires explicit approval workflow
- **Resolution**: Queue for review, never auto-merge

## Resolution Rules
```typescript
const RESOLUTION_RULES = {
  task: {
    workflow_or_amount: 'requires_review',
    // Task status transitions require server validation
  },
  expense_request: {
    financial_controlled: 'requires_review',
    // Financial requests always go through approval
  },
  beneficiary: {
    field_mergeable: 'merge',
    // Beneficiary updates can be auto-merged
  },
  evidence: {
    field_mergeable: 'merge',
    // Evidence uploads are append-only
  },
  transaction: {
    financial_controlled: 'requires_review',
    // Financial transactions require reconciliation
  },
};
```

## Conflict Detection
```typescript
// Server-side detection during push
function detectConflict(operation: SyncOperation, serverVersion: number): ConflictType | null {
  if (operation.baseVersion === null) return null;
  if (operation.baseVersion < serverVersion) {
    return classifyConflict(operation.entityType, operation.payload);
  }
  return null;
}
```

## User-Initiated Resolution
When conflicts require user intervention:
```typescript
// Conflict UI shows:
{
  localValue: {...},
  serverValue: {...},
  whoChanged: 'user@email.com',
  whenChanged: '2026-08-23T10:30:00Z',
  recommendedResolution: 'keep_server',
  options: ['keep_server', 'keep_client', 'merge', 'review']
}
```

## Rationale
1. **Data Integrity**: Financial data never auto-merges
2. **User Experience**: Field-mergeable data resolves automatically
3. **Auditability**: All conflict resolutions are logged
4. **Flexibility**: Different strategies for different data types
5. **Server Authority**: Server is always the final arbiter

## Consequences
- Some conflicts require manual review
- Conflict resolution is logged in audit trail
- Users are notified of conflicts requiring attention
- Financial data integrity is preserved

## Alternatives Considered
- **Last Write Wins**: Too risky for financial data
- **CRDTs**: Overkill, complex implementation
- **Manual Resolution Only**: Poor user experience

## Related
- ADR-001: Central PostgreSQL
- ADR-003: Sync Protocol
- ADR-005: Authentication Strategy
