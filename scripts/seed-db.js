// ============================================================
// Seed Database - Run schema + initial data
// Usage: node scripts/seed-db.js
// Requires: DATABASE_URL in environment
// ============================================================
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  console.log('🔗 Connecting to database...');

  // Test connection
  try {
    const test = await sql`SELECT 1 as ok`;
    if (test[0]?.ok === 1) {
      console.log('✅ Database connection successful');
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }

  // Run schema
  console.log('\n📋 Running schema migration...');
  try {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      try {
        await sql(stmt);
      } catch (err) {
        // Some statements may fail if table already exists — that's OK
        if (!err.message.includes('already exists')) {
          console.warn(`⚠️ Statement warning: ${err.message}`);
        }
      }
    }
    console.log('✅ Schema migration complete');
  } catch (err) {
    console.error('❌ Schema error:', err.message);
    process.exit(1);
  }

  // Seed admin user
  console.log('\n👤 Seeding admin user...');
  try {
    await sql(`
      -- WARNING: This seed script inserts an unhashed placeholder password.
      -- Do NOT use this in production. Use the create-admin.js script instead.
      INSERT INTO users (email, password_hash, name, role, permissions) 
      VALUES ('admin@rbdcye.org', '$2a$12$LJ3m4ris4Qn0Rf.vS5bX5eRZxKtqBHG5XGp3Rn6L8Kz9Y0V2N4X6a', 'مدير النظام', 'admin', '["all"]')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Admin user ready (email: admin@rbdcye.org)');
    console.log('⚠️ IMPORTANT: Change the password on first login!');
  } catch (err) {
    console.warn('⚠️ Admin seed:', err.message);
  }

  // Seed sample projects
  console.log('\n📁 Seeding sample projects...');
  try {
    const projects = [
      { title: 'السلال الغذائية', category: 'إغاثة', status: 'active', location: 'صنعاء' },
      { title: 'حفر الآبار', category: 'مياه', status: 'active', location: 'إب' },
      { title: 'كفالة الأيتام', category: 'اجتماعي', status: 'active', location: 'عدة محافظات' },
      { title: 'التعليم والقرآن', category: 'تعليم', status: 'active', location: 'صنعاء' },
      { title: 'دفء الشتاء', category: 'إغاثة', status: 'planning', location: 'عدة محافظات' },
      { title: 'المساعدات الطبية', category: 'صحي', status: 'active', location: 'تعز' },
    ];

    for (const p of projects) {
      await sql(`
        INSERT INTO projects (title, category, status, location)
        VALUES (${p.title}, ${p.category}, ${p.status}, ${p.location})
        ON CONFLICT DO NOTHING
      `);
    }
    console.log('✅ Sample projects seeded');
  } catch (err) {
    console.warn('⚠️ Projects seed:', err.message);
  }

  console.log('\n🎉 Database setup complete!');
  console.log('\n📌 Next steps:');
  console.log('   1. Add DATABASE_URL to wrangler.toml [vars]');
  console.log('   2. Run: npm run build && npm run cf-deploy');
  console.log('   3. Open /admin to manage content');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
