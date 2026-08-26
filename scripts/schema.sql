-- ============================================================
-- RBDCYE Database Schema — PostgreSQL (Neon)
-- مؤسسة رحماء بينهم — نظام إدارة البيانات
-- ============================================================

-- ─── UUID extension ───
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
-- 1. التبرعات
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS donations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor         VARCHAR(100) NOT NULL,
  email         VARCHAR(254) NOT NULL,
  phone         VARCHAR(20),
  amount        NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  currency      VARCHAR(10) NOT NULL DEFAULT 'YER',
  amount_yer    NUMERIC(15,2),
  project       VARCHAR(100),
  method        VARCHAR(50),
  type          VARCHAR(20) DEFAULT 'once',
  status        VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed','rejected','cancelled','refunded')),
  notes         TEXT,
  anonymous     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_project ON donations(project);

-- ═══════════════════════════════════════════════════════════════
-- 2. الموافقات على التبرعات
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS donation_approvals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id     UUID REFERENCES donations(id) ON DELETE CASCADE,
  action          VARCHAR(50) NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending',
  reviewed_by     VARCHAR(100),
  review_notes    TEXT,
  notification_sent BOOLEAN DEFAULT FALSE,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 3. الحركات المالية
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS movements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            VARCHAR(50) NOT NULL,
  category        VARCHAR(100),
  amount          NUMERIC(15,2) NOT NULL,
  currency        VARCHAR(10) DEFAULT 'YER',
  reference_id    UUID,
  reference_type  VARCHAR(50),
  description     TEXT,
  status          VARCHAR(20) DEFAULT 'pending',
  approved_by     VARCHAR(100),
  approved_at     TIMESTAMPTZ,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movements_status ON movements(status);
CREATE INDEX IF NOT EXISTS idx_movements_type ON movements(type);

-- ═══════════════════════════════════════════════════════════════
-- 4. المشاريع
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  category        VARCHAR(100),
  status          VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning','active','completed','paused','cancelled')),
  budget          NUMERIC(15,2),
  currency        VARCHAR(10) DEFAULT 'YER',
  spent           NUMERIC(15,2) DEFAULT 0,
  beneficiaries   INTEGER DEFAULT 0,
  start_date      DATE,
  end_date        DATE,
  location        VARCHAR(200),
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 5. المستفيدين
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS beneficiaries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(100),
  family_size     INTEGER,
  governorate    VARCHAR(100),
  district        VARCHAR(100),
  status          VARCHAR(20) DEFAULT 'active',
  needs           TEXT,
  project_id      UUID REFERENCES projects(id),
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 6. رسائل التواصل
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS contact_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(254) NOT NULL,
  phone           VARCHAR(20),
  subject         VARCHAR(200) NOT NULL,
  message         TEXT NOT NULL,
  status          VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  replied_at      TIMESTAMPTZ,
  replied_by      VARCHAR(100),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);

-- ═══════════════════════════════════════════════════════════════
-- 7. المتطوعون
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS volunteers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(254) NOT NULL,
  phone           VARCHAR(20),
  skills          TEXT,
  availability    VARCHAR(200),
  message         TEXT,
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','active','inactive','rejected')),
  applied_at      TIMESTAMPTZ DEFAULT NOW(),
  approved_at     TIMESTAMPTZ,
  approved_by     VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);

-- ═══════════════════════════════════════════════════════════════
-- 8. المشتركون في النشرة البريدية
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS subscribers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           VARCHAR(254) UNIQUE NOT NULL,
  name            VARCHAR(100),
  phone           VARCHAR(20),
  country         VARCHAR(100),
  status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','unsubscribed','bounced')),
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════
-- 9. الإشعارات
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            VARCHAR(50) NOT NULL,
  title           VARCHAR(200) NOT NULL,
  message         TEXT,
  recipient_email VARCHAR(254),
  recipient_id    UUID,
  data            JSONB,
  priority        VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  read            BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 10. المستخدمون (Admin)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           VARCHAR(254) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(100) NOT NULL,
  role            VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin','editor','manager','viewer')),
  permissions     JSONB DEFAULT '[]',
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 11. إعدادات الموقع
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS site_settings (
  key             VARCHAR(100) PRIMARY KEY,
  value           JSONB NOT NULL,
  category        VARCHAR(50),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 12. سجل التدقيق (Audit Log)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS audit_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID,
  action          VARCHAR(50) NOT NULL,
  entity_type     VARCHAR(50),
  entity_id       UUID,
  old_value       JSONB,
  new_value       JSONB,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
