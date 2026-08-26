// ============================================================
// Create Admin User Script
// Creates the initial admin user with bcrypt-hashed password
// Run: node scripts/create-admin.js
// ============================================================

import { neon } from '@neondatabase/serverless';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rbdcye.org';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD environment variable is required');
  process.exit(1);
}

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function createAdmin() {
  console.log('🔄 Creating admin user...');

  try {
    // Check if admin already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${ADMIN_EMAIL}`;
    if (existing.length > 0) {
      console.log(`⚠️  Admin user ${ADMIN_EMAIL} already exists (id: ${existing[0].id})`);
      return;
    }

    // Hash password
    const passwordHash = await hash(ADMIN_PASSWORD, 12);
    const userId = randomUUID();

    // Create user
    await sql`
      INSERT INTO users (id, email, password_hash, name, role, status, security_level)
      VALUES (${userId}, ${ADMIN_EMAIL}, ${passwordHash}, 'مدير النظام', 'admin', 'active', 10)
    `;

    // Add to default organization
    await sql`
      INSERT INTO user_org_memberships (user_id, organization_id, role_codes, permissions, is_active, is_default)
      VALUES (
        ${userId},
        '00000000-0000-0000-0000-000000000001',
        '["ADMIN", "MANAGER", "MEMBER"]',
        '["*"]',
        true,
        true
      )
    `;

    console.log(`✅ Admin user created successfully`);
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Organization: 00000000-0000-0000-0000-000000000001`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();
