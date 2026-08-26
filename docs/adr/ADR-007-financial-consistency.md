# ADR-007: Financial Consistency Model

## Status
Accepted

## Date
2026-08-23

## Context
The system handles financial transactions (donations, expenses, inventory issues) that require strict consistency. Offline operations and sync must not compromise financial integrity.

## Decision
Implement **Transaction-First Financial Consistency** with the following principles:

## Principles

### 1. Transactions are Atomic
```typescript
// Every financial operation is wrapped in a transaction
async function createExpense(pool: Pool, input: ExpenseRequest) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Create approval request
    await client.query('INSERT INTO approval_requests ...');
    
    // 2. Log audit trail
    await client.query('INSERT INTO system_audit_trail ...');
    
    // 3. Queue for sync
    await client.query('INSERT INTO sync_queue ...');
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### 2. Never Sync Balances
```typescript
// WRONG: Syncing final balance
{ balance: 1500000 } // ❌ Conflicts are unresolvable

// RIGHT: Syncing transactions
{
  operation: 'create',
  entityType: 'transaction',
  payload: {
    amount: 50000,
    type: 'expense',
    description: 'Field supplies'
  }
}
// Server calculates balance from transactions
```

### 3. Idempotent Operations
```typescript
// Every financial operation has an idempotency key
const idempotencyKey = `${entityType}:${entityId}:${operation}:${timestamp}`;

// Server checks for duplicate before processing
const existing = await pool.query(
  'SELECT id FROM sync_queue WHERE id = $1',
  [idempotencyKey]
);
if (existing.rowCount > 0) {
  return { status: 'duplicate', idempotent: true };
}
```

### 4. Optimistic Concurrency
```typescript
// Check version before update
const result = await client.query(
  `UPDATE transactions 
   SET status = $1, updated_at = NOW()
   WHERE id = $2 AND version = $3
   RETURNING id, version`,
  [newStatus, transactionId, expectedVersion]
);

if (result.rowCount === 0) {
  throw new Error('Transaction conflict: version mismatch');
}
```

### 5. Audit Trail for Every Change
```typescript
// Before/after for every financial change
await client.query(
  `INSERT INTO system_audit_trail (
    event_type, event_source, event_message,
    severity, user_id, organization_id,
    metadata
  ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  [
    'FINANCIAL_TRANSACTION_CREATED',
    'mobile',
    `Expense request created: ${amount} ${currency}`,
    'INFO',
    userId,
    orgId,
    JSON.stringify({ before: null, after: transaction })
  ]
);
```

## Financial Data Rules

### Expense Requests
- Always require approval workflow
- Never auto-approve offline
- Sync as pending, await server approval

### Inventory Issues
- Require controlled review
- Check stock levels server-side
- Generate journal entries atomically

### Donations
- Validate amount and currency
- Generate receipt server-side
- Never allow negative amounts

### Journal Entries
- Must balance (debit = credit)
- Reference original transaction
- Immutable after posting

## Rationale
1. **Data Integrity**: Financial data must be accurate
2. **Auditability**: Every change is traceable
3. **Compliance**: Required for humanitarian accounting
4. **Consistency**: Server is authoritative for financial state
5. **Recoverability**: Transactions can be reconstructed from audit trail

## Consequences
- Financial operations are slower (require server validation)
- Offline financial operations are queued, not executed
- Conflict resolution for financial data always requires review
- Balance calculations happen server-side only

## Alternatives Considered
- **Event Sourcing**: Overkill for this scale
- **CQRS**: Adds complexity without clear benefit
- ** Eventually Consistent**: Unacceptable for financial data

## Related
- ADR-001: Central PostgreSQL
- ADR-003: Sync Protocol
- ADR-004: Conflict Resolution
