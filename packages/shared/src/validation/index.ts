// ============================================================
// @nexora/shared - Validation Schemas (Zod)
// ============================================================

import { z } from 'zod';

// ─── UUID ───
export const uuidSchema = z.string().regex(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  'Invalid UUID format'
);

// ─── Organization Context ───
export const organizationContextSchema = z.object({
  organizationId: uuidSchema,
  organizationName: z.string(),
  countryCode: z.string().length(2),
  branchId: uuidSchema.nullable(),
  locale: z.enum(['ar', 'en']),
  baseCurrency: z.string().length(3),
  fiscalPeriodId: uuidSchema.nullable(),
  policyVersion: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
});

// ─── Task Transition ───
export const taskTransitionSchema = z.object({
  taskId: uuidSchema,
  organizationId: uuidSchema,
  fromStatus: z.enum(['assigned', 'accepted', 'in_progress', 'submitted', 'review', 'approved', 'returned', 'closed']),
  toStatus: z.enum(['assigned', 'accepted', 'in_progress', 'submitted', 'review', 'approved', 'returned', 'closed']),
  baseUpdatedAt: z.string().datetime().nullable(),
  notes: z.string().max(4000).optional(),
  checkIn: z.boolean().optional(),
  checkOut: z.boolean().optional(),
});

// ─── Sync Operation ───
export const syncOperationSchema = z.object({
  operationId: uuidSchema,
  organizationId: uuidSchema,
  entityType: z.enum(['task', 'inventory_issue', 'expense_request', 'approval', 'evidence', 'beneficiary', 'transaction', 'field_result', 'field_message']),
  entityId: uuidSchema,
  operation: z.enum(['create', 'update', 'transition', 'approve', 'reject', 'submit', 'delete']),
  baseVersion: z.number().int().nonnegative().nullable(),
  baseUpdatedAt: z.string().datetime().nullable(),
  payload: z.record(z.string(), z.unknown()),
  clientCreatedAt: z.string().datetime(),
  deviceId: z.string().min(1).max(100),
});

// ─── Sync Batch ───
export const syncBatchRequestSchema = z.object({
  operations: z.array(syncOperationSchema).min(1).max(100),
  lastCursor: z.string().nullable(),
  deviceId: z.string().min(1).max(100),
});

// ─── Sync Pull ───
export const syncPullRequestSchema = z.object({
  cursor: z.string().nullable(),
  limit: z.number().int().min(1).max(500).default(100),
  entityTypes: z.array(z.string()).optional(),
  organizationId: uuidSchema,
  deviceId: z.string().min(1).max(100),
});

// ─── Conflict Resolution ───
export const conflictResolutionSchema = z.object({
  conflictId: uuidSchema,
  decision: z.enum(['keep_server', 'keep_client', 'merge', 'create_correction']),
  reason: z.string().min(3).max(1000),
});

// ─── Expense Request ───
export const expenseRequestSchema = z.object({
  organizationId: uuidSchema,
  projectId: uuidSchema.nullable(),
  activityId: uuidSchema.nullable(),
  currencyCode: z.string().length(3),
  amount: z.number().positive(),
  description: z.string().min(3).max(1000),
  budgetLineId: uuidSchema.nullable(),
  costCenterId: uuidSchema.nullable(),
  receiptUrl: z.string().url().nullable(),
});

// ─── Inventory Issue ───
export const inventoryIssueSchema = z.object({
  organizationId: uuidSchema,
  warehouseId: uuidSchema,
  projectId: uuidSchema.nullable(),
  activityId: uuidSchema.nullable(),
  issueType: z.string().min(1).max(20),
  notes: z.string().max(1000).optional(),
  lines: z.array(z.object({
    itemId: uuidSchema,
    quantity: z.number().positive(),
    unitCode: z.string().min(1).max(20),
    unitCost: z.number().nonnegative(),
    batchNumber: z.string().max(50).optional(),
    expiryDate: z.string().date().nullable().optional(),
  })).min(1),
});

// ─── Auth ───
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(2).max(100),
  organizationName: z.string().min(2).max(200).optional(),
});

// ─── Device Registration ───
export const deviceRegistrationSchema = z.object({
  platform: z.enum(['ios', 'android', 'web']),
  appVersion: z.string().max(20),
  fingerprint: z.string().max(255),
});

// ─── Pagination ───
export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

// ─── Date Range ───
export const dateRangeSchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});
