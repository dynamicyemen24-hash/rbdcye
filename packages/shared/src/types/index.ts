// ============================================================
// @nexora/shared - Core Types
// المشتركات بين NexoraOS + NexWebSite + NexOSMobile
// ============================================================

// ─── Organization & Multi-Tenant ───
export interface OrganizationContext {
  organizationId: string;
  organizationName: string;
  countryCode: string;
  branchId: string | null;
  locale: 'ar' | 'en';
  baseCurrency: string;
  fiscalPeriodId: string | null;
  policyVersion: string;
  roles: string[];
  permissions: string[];
}

// ─── User & Auth ───
export interface User {
  id: string;
  email: string;
  name: string | null;
  nameAr: string | null;
  phone: string | null;
  imageUrl: string | null;
  defaultLanguage: string;
  status: string;
  securityLevel: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserMembership {
  id: string;
  userId: string;
  organizationId: string;
  branchId: string | null;
  roleCode: string;
  status: string;
  isDefault: boolean;
}

export interface AuthTokenPayload {
  id: string;
  email: string;
  role: string;
  org_id: string;
  security_level: number;
  iat: number;
  exp: number;
}

export interface AuthResult {
  user: User;
  token: string;
  refreshToken: string;
  organization: OrganizationContext;
}

// ─── Device Management ───
export interface Device {
  id: string;
  userId: string;
  organizationId: string;
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  lastSeen: Date;
  lastSync: Date | null;
  status: 'active' | 'revoked' | 'expired';
  fingerprint: string;
  createdAt: Date;
}

// ─── Sync Protocol ───
export type SyncEntityType =
  | 'task'
  | 'inventory_issue'
  | 'expense_request'
  | 'approval'
  | 'evidence'
  | 'beneficiary'
  | 'transaction'
  | 'field_result'
  | 'field_message';

export type SyncOperation = 'create' | 'update' | 'transition' | 'approve' | 'reject' | 'submit' | 'delete';

export interface SyncOperationPayload {
  operationId: string;
  organizationId: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  baseVersion: number | null;
  baseUpdatedAt: string | null;
  payload: Record<string, unknown>;
  clientCreatedAt: string;
  deviceId: string;
}

export interface SyncBatchRequest {
  operations: SyncOperationPayload[];
  lastCursor: string | null;
  deviceId: string;
}

export interface SyncBatchResponse {
  results: SyncResult[];
  serverCursor: string;
  hasMore: boolean;
  serverTimestamp: string;
}

export interface SyncResult {
  operationId: string;
  status: 'accepted' | 'conflict' | 'rejected' | 'duplicate';
  conflictType?: 'field_mergeable' | 'financial_controlled' | 'workflow_or_amount';
  serverVersion?: number;
  error?: string;
}

export interface SyncPullRequest {
  cursor: string | null;
  limit: number;
  entityTypes?: SyncEntityType[];
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
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  version: number;
  payload: Record<string, unknown>;
  timestamp: string;
  deviceId: string;
}

// ─── Conflict Resolution ───
export type ConflictClassification = 'field_mergeable' | 'financial_controlled' | 'workflow_or_amount';

export interface ConflictResolution {
  conflictId: string;
  decision: 'keep_server' | 'keep_client' | 'merge' | 'create_correction';
  reason: string;
}

// ─── Workflow ───
export type TaskStatus = 'assigned' | 'accepted' | 'in_progress' | 'submitted' | 'review' | 'approved' | 'returned' | 'closed';

export interface TaskTransition {
  taskId: string;
  organizationId: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  baseUpdatedAt: string | null;
  notes?: string;
  checkIn?: boolean;
  checkOut?: boolean;
}

// ─── Permissions ───
export const PERMISSIONS = {
  taskRead: 'field.task.read',
  taskExecute: 'field.task.execute',
  taskApprove: 'field.task.approve',
  inventoryRead: 'inventory.read',
  inventoryIssue: 'inventory.issue',
  financeRead: 'finance.read',
  financeRequest: 'finance.request',
  financeApprove: 'finance.approve',
  financePost: 'finance.post',
  financeReconcile: 'finance.reconcile',
  conflictResolve: 'sync.conflict.resolve',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ─── Audit ───
export interface AuditEntry {
  id: string;
  organizationId: string;
  userId: string;
  deviceId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  reason: string | null;
  requestId: string | null;
  createdAt: Date;
}

// ─── Connection State ───
export type ConnectionState = 'online' | 'offline' | 'syncing' | 'pending_changes' | 'sync_failed' | 'conflict' | 'authenticated_but_offline';

// ─── API Response ───
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}
