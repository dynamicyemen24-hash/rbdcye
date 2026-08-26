-- ============================================================
-- Migration: Programs, Agreements, Donation Config, Messaging
-- Adds missing tables for complete donation workflow
-- ============================================================

-- ═══════════════════════════════════════════════════════════════
-- 1. البرامج (Programs) — مع تفعيل/تعطيل
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS programs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           VARCHAR(200) NOT NULL,
  title_ar        VARCHAR(200),
  description     TEXT,
  category        VARCHAR(100),
  icon            VARCHAR(50),
  color           VARCHAR(20) DEFAULT '#0F4C3A',
  status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','archived')),
  budget          NUMERIC(15,2) DEFAULT 0,
  spent           NUMERIC(15,2) DEFAULT 0,
  currency        VARCHAR(10) DEFAULT 'YER',
  start_date      DATE,
  end_date        DATE,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);

-- ═══════════════════════════════════════════════════════════════
-- 2. أنواع التبرعات (Donation Types) — الإعدادات
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS donation_types (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            VARCHAR(50) UNIQUE NOT NULL,
  name_ar         VARCHAR(100) NOT NULL,
  name_en         VARCHAR(100),
  description     TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  requires_agreement BOOLEAN DEFAULT FALSE,
  min_amount      NUMERIC(15,2) DEFAULT 0,
  max_amount      NUMERIC(15,2),
  approval_threshold NUMERIC(15,2) DEFAULT 100000,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- إدراج الأنواع الافتراضية
INSERT INTO donation_types (code, name_ar, name_en, description, requires_agreement, approval_threshold) VALUES
  ('cash_once', 'تبرع نقدي لمرة', 'One-time Cash', 'تبرع نقدي مرة واحدة', FALSE, 100000),
  ('cash_monthly', 'تبرع نقدي شهري', 'Monthly Cash', 'تبرع نقدي متكرر شهرياً', FALSE, 50000),
  ('cash_annual', 'تبرع نقدي سنوي', 'Annual Cash', 'تبرع نقدي سنوي', FALSE, 200000),
  ('in_kind', 'تبرع عيني', 'In-Kind', 'تبرع عيني (ملابس، غذاء، أدوية...)', TRUE, 0),
  ('zakat', 'زكاة', 'Zakat', 'زكاة مالية', FALSE, 0),
  ('sadaqa', 'صدقة', 'Sadaqa', 'صدقة تطوعية', FALSE, 0),
  ('waqf', 'وقف', 'Waqf', 'وقف خيري', TRUE, 500000),
  ('grant', 'منحة', 'Grant', 'منحة من جهة داعمة', TRUE, 0),
  ('partnership', 'شراكة', 'Partnership', 'شراكة استراتيجية', TRUE, 1000000)
ON CONFLICT (code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 3. طرق الدفع (Payment Methods)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS payment_methods (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            VARCHAR(50) UNIQUE NOT NULL,
  name_ar         VARCHAR(100) NOT NULL,
  name_en         VARCHAR(100),
  icon            VARCHAR(50),
  is_active       BOOLEAN DEFAULT TRUE,
  currencies      JSONB DEFAULT '["YER","USD"]',
  requires_verification BOOLEAN DEFAULT FALSE,
  fee_percentage  NUMERIC(5,2) DEFAULT 0,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO payment_methods (code, name_ar, name_en, icon, currencies, fee_percentage) VALUES
  ('bank_transfer', 'تحويل بنكي', 'Bank Transfer', 'building', '["YER","USD","SAR"]', 0),
  ('mobile_wallet', 'محفظة إلكترونية', 'Mobile Wallet', 'smartphone', '["YER"]', 1.5),
  ('cash', 'نقدي', 'Cash', 'banknote', '["YER"]', 0),
  ('stripe', 'بطاقة ائتمان', 'Credit Card', 'credit-card', '["USD","EUR","GBP"]', 2.9),
  ('paypal', 'PayPal', 'PayPal', 'globe', '["USD","EUR","GBP"]', 3.5),
  ('check', 'شيك', 'Check', 'file-text', '["YER","USD"]', 0)
ON CONFLICT (code) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- 4. الاتفاقيات (Agreements) — للمتبرعات الكبيرة
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS agreements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agreement_number VARCHAR(50) UNIQUE NOT NULL,
  donor_name      VARCHAR(200) NOT NULL,
  donor_email     VARCHAR(254),
  donor_phone     VARCHAR(20),
  organization    VARCHAR(200),
  type            VARCHAR(50) NOT NULL,
  status          VARCHAR(30) DEFAULT 'draft' CHECK (status IN (
    'draft', 'proposed', 'under_review', 'negotiating',
    'pending_approval', 'approved', 'active',
    'suspended', 'completed', 'cancelled', 'rejected'
  )),
  total_amount    NUMERIC(15,2),
  currency        VARCHAR(10) DEFAULT 'YER',
  payment_schedule JSONB DEFAULT '[]',
  terms           TEXT,
  conditions      TEXT,
  start_date      DATE,
  end_date        DATE,
  project_id      UUID REFERENCES projects(id),
  program_id      UUID REFERENCES programs(id),
  assigned_to     VARCHAR(100),
  approved_by     VARCHAR(100),
  approved_at     TIMESTAMPTZ,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agreements_status ON agreements(status);
CREATE INDEX IF NOT EXISTS idx_agreements_donor ON agreements(donor_email);

-- ═══════════════════════════════════════════════════════════════
-- 5. جدول التفاوض (Negotiation Messages)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS agreement_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agreement_id    UUID REFERENCES agreements(id) ON DELETE CASCADE,
  sender_name     VARCHAR(100) NOT NULL,
  sender_email    VARCHAR(254),
  sender_role     VARCHAR(50) DEFAULT 'donor',
  message         TEXT NOT NULL,
  attachments     JSONB DEFAULT '[]',
  is_internal     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agreement_messages_agreement ON agreement_messages(agreement_id);

-- ═══════════════════════════════════════════════════════════════
-- 6. الرسائل بين الأطراف (Inter-party Messaging)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID,
  sender_type     VARCHAR(50) NOT NULL,
  sender_id       UUID,
  sender_name     VARCHAR(100),
  recipient_type  VARCHAR(50),
  recipient_id    UUID,
  recipient_email VARCHAR(254),
  subject         VARCHAR(200),
  body            TEXT NOT NULL,
  type            VARCHAR(50) DEFAULT 'general',
  reference_type  VARCHAR(50),
  reference_id    UUID,
  is_read         BOOLEAN DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_email, is_read);

-- ═══════════════════════════════════════════════════════════════
-- 7. سجل التبرعات المحاسبي (Donation Accounting Ledger)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS donation_ledger (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id     UUID REFERENCES donations(id),
  agreement_id    UUID REFERENCES agreements(id),
  entry_type      VARCHAR(50) NOT NULL,
  debit_account   VARCHAR(100),
  credit_account  VARCHAR(100),
  amount          NUMERIC(15,2) NOT NULL,
  currency        VARCHAR(10) DEFAULT 'YER',
  exchange_rate   NUMERIC(10,4) DEFAULT 1,
  description     TEXT,
  voucher_number  VARCHAR(50),
  posted_by       VARCHAR(100),
  posted_at       TIMESTAMPTZ DEFAULT NOW(),
  reversed        BOOLEAN DEFAULT FALSE,
  reversal_of     UUID
);

CREATE INDEX IF NOT EXISTS idx_donation_ledger_donation ON donation_ledger(donation_id);
CREATE INDEX IF NOT EXISTS idx_donation_ledger_type ON donation_ledger(entry_type);

-- ═══════════════════════════════════════════════════════════════
-- 8. تعريف الحسابات المحاسبية (Chart of Accounts Subset)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_code    VARCHAR(20) UNIQUE NOT NULL,
  name_ar         VARCHAR(200) NOT NULL,
  name_en         VARCHAR(200),
  account_type    VARCHAR(50) NOT NULL,
  parent_code     VARCHAR(20),
  level           INTEGER DEFAULT 1,
  is_header       BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  currency        VARCHAR(10) DEFAULT 'YER',
  balance         NUMERIC(15,2) DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- إدراج الحسابات الأساسية
INSERT INTO chart_of_accounts (account_code, name_ar, name_en, account_type, level) VALUES
  ('1100', 'الصندوق', 'Cash', 'asset', 2),
  ('1200', 'البنوك', 'Banks', 'asset', 2),
  ('1300', 'الذمم المدينة', 'Accounts Receivable', 'asset', 2),
  ('2100', 'الذمم الدائنة', 'Accounts Payable', 'liability', 2),
  ('3100', 'رأس المال', 'Equity', 'equity', 2),
  ('4100', 'إيرادات التبرعات', 'Donation Revenue', 'revenue', 2),
  ('4200', 'إيرادات المنح', 'Grant Revenue', 'revenue', 2),
  ('4300', 'إيرادات أخرى', 'Other Revenue', 'revenue', 2),
  ('5100', 'مصاريف المشاريع', 'Project Expenses', 'expense', 2),
  ('5200', 'مصاريف إدارية', 'Administrative Expenses', 'expense', 2),
  ('5300', 'مصاريف الرواتب', 'Salary Expenses', 'expense', 2)
ON CONFLICT (account_code) DO NOTHING;
