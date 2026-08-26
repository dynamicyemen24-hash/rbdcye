// ============================================================
// @nexora/shared - Unified Database Schema
// Single source of truth for all three applications
// ============================================================

import {
  pgTable, uuid, text, timestamp, numeric, integer,
  boolean, jsonb, date, index, uniqueIndex, check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ==========================================
// 1. ORGANIZATIONS (Multi-Tenant Root)
// ==========================================
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id'),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  website: text('website'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  country: text('country'),
  registrationNumber: text('registration_number'),
  taxNumber: text('tax_number'),
  licenseNumber: text('license_number'),
  typeCode: text('type_code').default('charity'),
  subscriptionPlan: text('subscription_plan').default('basic'),
  status: text('status').default('active'),
  settings: jsonb('settings').default({}),
  defaultCurrencyCode: text('default_currency_code').default('YER'),
  languageCodes: jsonb('language_codes').default(['ar']),
  securityPolicy: jsonb('security_policy').default({}),
  securityLevel: integer('security_level').default(5),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ==========================================
// 2. USERS & AUTH
// ==========================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  passwordHash: text('password_hash'),
  name: text('name'),
  nameAr: text('name_ar'),
  phone: text('phone'),
  imageUrl: text('image_url'),
  defaultLanguage: text('default_language').default('ar'),
  status: text('status').default('active'),
  securityLevel: integer('security_level').default(5),
  totpSecret: text('totp_secret'),
  refreshTokenHash: text('refresh_token_hash'),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const userOrgMemberships = pgTable('user_org_memberships', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  branchId: uuid('branch_id'),
  roleCode: text('role_code').default('MEMBER'),
  roleCodes: jsonb('role_codes').default([]),
  permissions: jsonb('permissions').default([]),
  status: text('status').default('active'),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table: any) => [
  index('idx_user_org_user').on(table.userId),
  index('idx_user_org_org').on(table.organizationId),
  uniqueIndex('idx_user_org_unique').on(table.userId, table.organizationId),
]);

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  code: text('code').notNull(),
  nameEn: text('name_en'),
  nameAr: text('name_ar'),
  description: text('description'),
  isSystem: boolean('is_system').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// 3. DEVICES (Mobile Sync)
// ==========================================
export const devices = pgTable('devices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  platform: text('platform').notNull(), // ios, android, web
  appVersion: text('app_version'),
  fingerprint: text('fingerprint'),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).defaultNow(),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
  status: text('status').default('active'), // active, revoked, expired
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table: any) => [
  index('idx_devices_user').on(table.userId),
  index('idx_devices_org').on(table.organizationId),
]);

// ==========================================
// 4. SYNC QUEUE
// ==========================================
export const syncQueue = pgTable('sync_queue', {
  id: text('id').primaryKey(), // operationId
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  deviceId: text('device_id'),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  operation: text('operation').notNull(), // create, update, delete
  payload: jsonb('payload').notNull(),
  status: text('status').notNull(), // PENDING, CONFLICT_REVIEW, RESOLVED_SERVER, RESOLVED_REVIEW, FAILED
  errorMessage: text('error_message'),
  syncedAt: timestamp('synced_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table: any) => [
  index('idx_sync_queue_org').on(table.organizationId),
  index('idx_sync_queue_status').on(table.status),
  index('idx_sync_queue_entity').on(table.entityType, table.entityId),
]);

// ==========================================
// 5. BRANCHES & FISCAL YEARS
// ==========================================
export const branches = pgTable('branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  code: text('code').notNull(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  status: text('status').default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const fiscalYears = pgTable('fiscal_years', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  yearNumber: integer('year_number').notNull(),
  nameAr: text('name_ar').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: text('status').default('open'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// 6. PROGRAMS & PROJECTS
// ==========================================
export const programs = pgTable('programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  code: text('code').notNull(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  categoryCode: text('category_code'),
  budget: numeric('budget').default('0'),
  progressPercent: numeric('progress_percent').default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  programId: uuid('program_id').references(() => programs.id),
  projectCode: text('project_code').notNull(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  statusCode: text('status_code').default('PLANNING'),
  budget: numeric('budget').default('0'),
  progressPercent: numeric('progress_percent').default('0'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table: any) => [
  index('idx_projects_org').on(table.organizationId),
  index('idx_projects_program').on(table.programId),
]);

// ==========================================
// 7. ACTIVITIES & FIELD TASKS
// ==========================================
export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  projectId: uuid('project_id').references(() => projects.id),
  code: text('code').notNull(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en'),
  budgetAllocated: numeric('budget_allocated').default('0'),
  spentAmount: numeric('spent_amount').default('0'),
  progressPct: numeric('progress_pct').default('0'),
  statusCode: text('status_code').default('PLANNING'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const fieldTasks = pgTable('field_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  taskCode: text('task_code').notNull(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en'),
  descriptionAr: text('description_ar'),
  status: text('status').notNull().default('assigned'),
  priorityCode: text('priority_code'),
  scheduledDate: date('scheduled_date'),
  dueDate: date('due_date'),
  locationName: text('location_name'),
  latitude: numeric('latitude'),
  longitude: numeric('longitude'),
  checkInTime: timestamp('check_in_time', { withTimezone: true }),
  checkOutTime: timestamp('check_out_time', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  completionNotes: text('completion_notes'),
  evidencePhotos: jsonb('evidence_photos').default([]),
  activityId: uuid('activity_id'),
  projectId: uuid('project_id'),
  assignedTo: uuid('assigned_to'),
  assignedBy: uuid('assigned_by'),
  version: integer('version').default(1),
  dataClassification: text('data_classification').default('PRODUCTION'),
  verificationStatus: text('verification_status').default('PENDING'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table: any) => [
  index('idx_field_tasks_org').on(table.organizationId),
  index('idx_field_tasks_status').on(table.status),
  index('idx_field_tasks_assigned').on(table.assignedTo),
  index('idx_field_tasks_project').on(table.projectId),
]);

// ==========================================
// 8. BENEFICIARIES & PARTIES
// ==========================================
export const parties = pgTable('parties', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  partyType: text('party_type'),
  nameAr: text('name_ar'),
  nameEn: text('name_en'),
  phone: text('phone'),
  email: text('email'),
  nationalId: text('national_id'),
  address: text('address'),
  roleCodes: jsonb('role_codes').default([]),
  isActive: boolean('is_active').default(true),
  status: text('status').default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const beneficiaries = pgTable('beneficiaries', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  partyId: uuid('party_id').references(() => parties.id),
  beneficiaryCode: text('beneficiary_code'),
  fullNameAr: text('full_name_ar'),
  fullNameEn: text('full_name_en'),
  gender: text('gender'),
  birthDate: date('birth_date'),
  familyMembersCount: integer('family_members_count'),
  vulnerabilityStatus: text('vulnerability_status'),
  eligibilityStatus: text('eligibility_status').default('review'),
  attendanceStatus: text('attendance_status').default('pending'),
  eligibilityReasonAr: text('eligibility_reason_ar'),
  governorate: text('governorate'),
  district: text('district'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table: any) => [
  index('idx_beneficiaries_org').on(table.organizationId),
  index('idx_beneficiaries_party').on(table.partyId),
]);

// ==========================================
// 9. FINANCE
// ==========================================
export const chartOfAccounts = pgTable('chart_of_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  accountCode: text('account_code').notNull(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en'),
  accountType: text('account_type'),
  parentAccountId: uuid('parent_account_id'),
  level: integer('level').default(1),
  isHeader: boolean('is_header').default(false),
  isActive: boolean('is_active').default(true),
  currentBalance: numeric('current_balance').default('0'),
  currencyCode: text('currency_code').default('YER'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const currencies = pgTable('currencies', {
  code: text('code').primaryKey(),
  nameAr: text('name_ar'),
  nameEn: text('name_en'),
  symbol: text('symbol'),
  exchangeRate: numeric('exchange_rate').default('1'),
  isBaseCurrency: boolean('is_base_currency').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  transactionNumber: text('transaction_number'),
  transactionDate: date('transaction_date').notNull(),
  postingDate: date('posting_date'),
  transactionType: text('transaction_type').notNull(),
  description: text('description'),
  referenceNo: text('reference_no'),
  fiscalYearId: uuid('fiscal_year_id'),
  totalDebit: numeric('total_debit').default('0'),
  totalCredit: numeric('total_credit').default('0'),
  status: text('status').default('draft'),
  version: integer('version').default(1),
  createdById: uuid('created_by_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table: any) => [
  index('idx_transactions_org').on(table.organizationId),
  index('idx_transactions_date').on(table.transactionDate),
  index('idx_transactions_status').on(table.status),
  check('chk_transactions_balanced', sql`${table.totalDebit} = ${table.totalCredit}`),
]);

export const transactionLines = pgTable('transaction_lines', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  organizationId: uuid('organization_id').references(() => organizations.id).notNull(),
  lineNumber: integer('line_number').notNull(),
  accountId: uuid('account_id').references(() => chartOfAccounts.id).notNull(),
  debit: numeric('debit').default('0'),
  credit: numeric('credit').default('0'),
  currencyCode: text('currency_code').default('YER'),
  description: text('description'),
  projectId: uuid('project_id'),
  activityId: uuid('activity_id'),
  partyId: uuid('party_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table: any) => [
  index('idx_txn_lines_txn').on(table.transactionId),
  index('idx_txn_lines_org').on(table.organizationId),
]);

// ==========================================
// 10. DONATIONS (NexWebSite)
// ==========================================
export const donations = pgTable('donations', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  donorPartyId: uuid('donor_party_id').references(() => parties.id),
  campaignId: uuid('campaign_id'),
  donationNumber: text('donation_number'),
  donor: text('donor'),
  email: text('email'),
  phone: text('phone'),
  amount: numeric('amount').notNull(),
  currencyCode: text('currency_code').default('YER'),
  paymentMethod: text('payment_method'),
  paymentReference: text('payment_reference'),
  project: text('project'),
  type: text('type').default('once'),
  status: text('status').default('pending'),
  anonymous: boolean('anonymous').default(false),
  notes: text('notes'),
  donationDate: date('donation_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table: any) => [
  index('idx_donations_org').on(table.organizationId),
  index('idx_donations_status').on(table.status),
]);

// ==========================================
// 11. CONTACT MESSAGES (NexWebSite)
// ==========================================
export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('new'),
  repliedAt: timestamp('replied_at', { withTimezone: true }),
  repliedBy: text('replied_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// 12. VOLUNTEERS
// ==========================================
export const volunteers = pgTable('volunteers', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  partyId: uuid('party_id').references(() => parties.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  skills: text('skills'),
  availability: text('availability'),
  message: text('message'),
  status: text('status').default('pending'),
  appliedAt: timestamp('applied_at', { withTimezone: true }).defaultNow(),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  approvedBy: text('approved_by'),
});

// ==========================================
// 13. NOTIFICATIONS
// ==========================================
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message'),
  recipientEmail: text('recipient_email'),
  recipientId: uuid('recipient_id'),
  data: jsonb('data'),
  priority: text('priority').default('normal'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// 14. AUDIT LOG
// ==========================================
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').references(() => organizations.id),
  userId: uuid('user_id'),
  deviceId: text('device_id'),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: uuid('entity_id'),
  before: jsonb('before'),
  after: jsonb('after'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  reason: text('reason'),
  requestId: text('request_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table: any) => [
  index('idx_audit_org').on(table.organizationId),
  index('idx_audit_user').on(table.userId),
  index('idx_audit_entity').on(table.entityType, table.entityId),
  index('idx_audit_created').on(table.createdAt),
]);

// ==========================================
// 15. SITE SETTINGS
// ==========================================
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  category: text('category'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
