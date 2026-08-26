// ============================================================
// Database Migration Script (Neon tagged-template compatible)
// Run: node scripts/migrate-db.js
// ============================================================

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load DATABASE_URL from .env
let DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  try {
    const envFile = readFileSync(join(__dirname, '..', '.env'), 'utf-8');
    const match = envFile.match(/^DATABASE_URL=(.+)$/m);
    if (match) DATABASE_URL = match[1].trim();
  } catch {}
}

if (!DATABASE_URL || DATABASE_URL.includes('YOUR_PASSWORD')) {
  console.error('❌ DATABASE_URL not configured');
  console.error('   Edit .env and replace YOUR_PASSWORD with your Neon database password');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function run(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    return true;
  } catch (e) {
    if (e.message?.includes('already exists')) {
      console.log(`  ⏭️  ${name} (already exists)`);
      return true;
    }
    console.error(`  ❌ ${name}: ${e.message?.slice(0, 120)}`);
    return false;
  }
}

async function migrate() {
  console.log('🔄 Database Migration\n');

  let ok = 0, skip = 0, fail = 0;

  const result = async (name, success) => {
    if (success) ok++; else fail++;
  };

  // Tables
  console.log('Creating tables...');

  await result('organizations', await run('organizations', () => sql`CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar TEXT NOT NULL, name_en TEXT NOT NULL,
    description TEXT, email TEXT, phone TEXT, address TEXT, city TEXT,
    country TEXT DEFAULT 'Yemen', registration_number TEXT, license_number TEXT,
    type_code TEXT DEFAULT 'charity', status TEXT DEFAULT 'active',
    default_currency_code TEXT DEFAULT 'YER', settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
  )`));

  await result('users', await run('users', () => sql`CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE, password_hash TEXT,
    name TEXT, name_ar TEXT, phone TEXT, image_url TEXT,
    role TEXT DEFAULT 'admin', status TEXT DEFAULT 'active',
    security_level INTEGER DEFAULT 5, last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
  )`));

  await result('user_org_memberships', await run('user_org_memberships', () => sql`CREATE TABLE IF NOT EXISTS user_org_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role_codes JSONB DEFAULT '["MEMBER"]', permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true, is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
  )`));

  await result('projects', await run('projects', () => sql`CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name_ar TEXT NOT NULL, name_en TEXT, description_ar TEXT, description_en TEXT,
    category TEXT, status TEXT DEFAULT 'active', budget NUMERIC DEFAULT 0,
    progress NUMERIC DEFAULT 0, location TEXT, start_date DATE, end_date DATE,
    image_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
  )`));

  await result('donations', await run('donations', () => sql`CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    donor TEXT, email TEXT, phone TEXT, amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'YER', project TEXT, method TEXT,
    type TEXT DEFAULT 'once', status TEXT DEFAULT 'pending',
    anonymous BOOLEAN DEFAULT false, notes TEXT, receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
  )`));

  await result('contact_messages', await run('contact_messages', () => sql`CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT,
    subject TEXT NOT NULL, message TEXT NOT NULL, status TEXT DEFAULT 'new',
    replied_at TIMESTAMPTZ, replied_by TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
  )`));

  await result('volunteers', await run('volunteers', () => sql`CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT,
    skills TEXT, availability TEXT, message TEXT,
    status TEXT DEFAULT 'pending', applied_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ, approved_by TEXT
  )`));

  await result('subscribers', await run('subscribers', () => sql`CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE, name TEXT, status TEXT DEFAULT 'active',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(), unsubscribed_at TIMESTAMPTZ
  )`));

  await result('beneficiaries', await run('beneficiaries', () => sql`CREATE TABLE IF NOT EXISTS beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    full_name TEXT NOT NULL, gender TEXT, birth_date DATE,
    phone TEXT, address TEXT, governorate TEXT, district TEXT,
    family_members INTEGER DEFAULT 1, vulnerability_status TEXT,
    eligibility_status TEXT DEFAULT 'pending', notes TEXT,
    status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(), deleted_at TIMESTAMPTZ
  )`));

  await result('transactions', await run('transactions', () => sql`CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    transaction_number TEXT, transaction_date DATE NOT NULL,
    transaction_type TEXT NOT NULL, description TEXT, reference_no TEXT,
    total_debit NUMERIC DEFAULT 0, total_credit NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'draft', version INTEGER DEFAULT 1, created_by_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
  )`));

  await result('audit_logs', await run('audit_logs', () => sql`CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID, device_id TEXT, action TEXT NOT NULL,
    entity_type TEXT, entity_id UUID, before_data JSONB, after_data JSONB,
    ip_address TEXT, user_agent TEXT, request_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`));

  await result('notifications', await run('notifications', () => sql`CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    type TEXT NOT NULL, title TEXT NOT NULL, message TEXT,
    recipient_email TEXT, recipient_id UUID, data JSONB,
    priority TEXT DEFAULT 'normal', is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`));

  await result('site_settings', await run('site_settings', () => sql`CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY, value JSONB NOT NULL,
    category TEXT, updated_at TIMESTAMPTZ DEFAULT NOW()
  )`));

  await result('sync_queue', await run('sync_queue', () => sql`CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY, organization_id UUID REFERENCES organizations(id),
    device_id TEXT, entity_type TEXT NOT NULL, entity_id UUID NOT NULL,
    operation TEXT NOT NULL, payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', error_message TEXT,
    synced_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`));

  await result('devices', await run('devices', () => sql`CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    platform TEXT NOT NULL, app_version TEXT, fingerprint TEXT,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(), last_sync_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active', created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`));

  // Indexes
  console.log('Creating indexes...');
  const indexes = [
    () => sql`CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at DESC)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_contacts_status ON contact_messages(status)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_contacts_created ON contact_messages(created_at DESC)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_devices_user ON devices(user_id)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  ];
  for (const idx of indexes) {
    await result('index', await run('index', idx));
  }

  // Default organization
  console.log('Seeding data...');
  await result('default org', await run('default org', () => sql`INSERT INTO organizations (id, name_ar, name_en, email, phone, country, license_number, type_code)
    VALUES ('00000000-0000-0000-0000-000000000001',
      'مؤسسة رحماء بينهم للإغاثة والتنمية باليمن',
      'Rohamaa Foundation for Relief and Development in Yemen',
      'info@rbdcye.org', '+967780777007', 'Yemen', '482', 'charity')
    ON CONFLICT (id) DO NOTHING`));

  console.log(`\n✅ Migration complete: ${ok} succeeded, ${fail} failed`);
}

migrate().catch(e => {
  console.error('❌ Migration failed:', e.message);
  process.exit(1);
});
