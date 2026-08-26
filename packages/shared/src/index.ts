/**
 * @nexora/shared — Canonical Type Definitions
 * 
 * Single source of truth for ALL Nexora ecosystem projects.
 * NexoraOS (PostgreSQL), NexWebSite (Neon), NexOSMobile (PostgreSQL via Neon)
 * ALL must use these types for cross-project compatibility.
 * 
 * ARCHITECTURE:
 * - User IDs: UUID (string) — NOT integer
 * - JWT: HMAC-SHA256 with shared secret
 * - Timestamps: ISO 8601 strings
 * - Currency: ISO 4217 codes (YER primary)
 */

// ═══════════════════════════════════════════════════════════════
// User & Auth — Canonical Schema
// ═══════════════════════════════════════════════════════════════

export interface User {
  id: string;                    // UUID
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  org_id: string;               // UUID — organization/tenant
  security_level: number;       // 0-10
  avatar_url?: string;
  phone?: string;
  created_at: string;           // ISO 8601
  updated_at: string;           // ISO 8601
  last_login_at?: string;
  deleted_at?: string;          // Soft delete
}

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'officer'
  | 'viewer'
  | 'field_worker'
  | 'donor'
  | 'volunteer'
  | 'guest';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface JWTPayload {
  id: string;                   // User UUID
  email: string;
  role: UserRole;
  org_id: string;
  security_level: number;
  type: 'admin' | 'field' | 'donor';
  iat: number;
  exp: number;
}

// ═══════════════════════════════════════════════════════════════
// Organization / Tenant
// ═══════════════════════════════════════════════════════════════

export interface Organization {
  id: string;                   // UUID
  name: string;
  name_ar: string;
  registration_number: string;
  type: 'ngo' | 'charity' | 'government' | 'private';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// ═══════════════════════════════════════════════════════════════
// Financial — Donation & Currency
// ═══════════════════════════════════════════════════════════════

export type CurrencyCode = 'YER' | 'USD' | 'SAR' | 'AED' | 'EUR' | 'GBP' | 'EGP' | 'IQD' | 'JOD' | 'KWD';

export interface Donation {
  id: string;                   // UUID
  donor: string;
  email: string;
  phone?: string;
  amount: number;
  currency: CurrencyCode;
  project: string;
  method: string;
  type: 'once' | 'monthly' | 'annual';
  status: DonationStatus;
  notes?: string;
  anonymous: boolean;
  created_at: string;
  updated_at: string;
}

export type DonationStatus = 'pending' | 'completed' | 'rejected' | 'cancelled';

export interface Movement {
  id: string;                   // UUID
  type: 'donation' | 'expense' | 'transfer' | 'adjustment';
  category: string;
  amount: number;
  currency: CurrencyCode;
  reference_id?: string;
  reference_type?: string;
  description: string;
  status: 'pending' | 'completed' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════
// Project & Beneficiary
// ═══════════════════════════════════════════════════════════════

export interface Project {
  id: string;                   // UUID
  title: string;
  title_ar?: string;
  description: string;
  category: string;
  status: 'planning' | 'active' | 'completed' | 'suspended';
  budget: number;
  spent: number;
  currency: CurrencyCode;
  start_date: string;
  end_date?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Beneficiary {
  id: string;                   // UUID
  name: string;
  name_ar?: string;
  type: 'individual' | 'family' | 'group';
  status: 'active' | 'inactive';
  gender?: 'male' | 'female';
  age?: number;
  location?: string;
  needs?: string;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════
// API Response Types
// ═══════════════════════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════
// Sync & Offline — Cross-project
// ═══════════════════════════════════════════════════════════════

export interface SyncCursor {
  entity: string;
  version: number;
  revision: number;
  operation_id: string;
  device_id: string;
  timestamp: string;
}

export interface SyncOperation {
  id: string;                   // UUID — idempotency key
  entity: string;
  entity_id: string;
  operation: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  device_id: string;
  timestamp: string;
  applied: boolean;
}

// ═══════════════════════════════════════════════════════════════
// Common Utility Types
// ═══════════════════════════════════════════════════════════════

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Timestamped<T> = T & { created_at: string; updated_at: string };
export type SoftDeletable<T> = T & { deleted_at?: string };
