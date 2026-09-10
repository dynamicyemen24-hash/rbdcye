-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table (admin-managed)
CREATE TABLE IF NOT EXISTS donation_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_ar TEXT NOT NULL,
  description_ar TEXT,
  icon TEXT DEFAULT 'Heart',
  color TEXT DEFAULT 'var(--brand-green)',
  target_amount NUMERIC DEFAULT 0,
  current_amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'YER',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  donation_type TEXT NOT NULL CHECK (donation_type IN ('financial', 'in_kind', 'material')),
  amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'YER',
  project_id UUID REFERENCES donation_projects(id),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  receipt_number TEXT UNIQUE,
  message TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurring_interval TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- In-kind donations table
CREATE TABLE IF NOT EXISTS in_kind_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_category TEXT NOT NULL CHECK (item_category IN ('clothing', 'food', 'blankets', 'medical', 'stationery', 'other')),
  quantity NUMERIC DEFAULT 1,
  unit TEXT DEFAULT 'قطعة',
  condition TEXT DEFAULT 'جديد' CHECK (condition IN ('جديد', 'مستعمل - جيد', 'يحتاج صيانة')),
  estimated_value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'YER',
  delivery_method TEXT CHECK (delivery_method IN ('pickup', 'dropoff', 'shipping')),
  delivery_address TEXT,
  delivery_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'distributed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donation policies (configurable by admin)
CREATE TABLE IF NOT EXISTS donation_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default policies
INSERT INTO donation_policies (key, value, description) VALUES
('min_donation_amount', '{"YER": 500, "SAR": 10, "USD": 2, "AED": 5, "EUR": 2, "GBP": 2}', 'الحد الأدنى للتبرع حسب العملة'),
('enable_recurring', 'true', 'تفعيل التبرعات الدورية'),
('enable_anonymous', 'true', 'التبرع المجهول'),
('enable_in_kind', 'true', 'التبرع العيني'),
('enable_material', 'true', 'التبرع المادي'),
('require_phone', 'true', 'إلزامية رقم الهاتف'),
('receipt_email', 'true', 'إرسال إيصال بالبريد')
ON CONFLICT (key) DO NOTHING;

-- Create indexes
CREATE INDEX idx_donations_donor_email ON donations(donor_email);
CREATE INDEX idx_donations_project_id ON donations(project_id);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_type ON donations(donation_type);
CREATE INDEX idx_projects_active ON donation_projects(is_active);
CREATE INDEX idx_in_kind_donation_id ON in_kind_donations(donation_id);

-- RLS policies
ALTER TABLE donation_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE in_kind_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_policies ENABLE ROW LEVEL SECURITY;

-- Public can view active projects
CREATE POLICY "Public can view active projects" ON donation_projects
  FOR SELECT USING (is_active = true);

-- Public can view their own donations
CREATE POLICY "Donors can view own donations" ON donations
  FOR SELECT USING (donor_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Public can insert donations
CREATE POLICY "Anyone can create donations" ON donations
  FOR INSERT WITH CHECK (true);

-- Public can insert in-kind donations
CREATE POLICY "Anyone can create in-kind donations" ON in_kind_donations
  FOR INSERT WITH CHECK (true);

-- Public can view active policies
CREATE POLICY "Public can view active policies" ON donation_policies
  FOR SELECT USING (is_active = true);

-- Admin full access (using service_role key)
CREATE POLICY "Admin full access" ON donation_projects
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access" ON donations
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access" ON in_kind_donations
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access" ON donation_policies
  FOR ALL USING (true) WITH CHECK (true);

-- Beneficiary Requests
CREATE TABLE IF NOT EXISTS beneficiary_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_number SERIAL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  governorate TEXT NOT NULL,
  district TEXT,
  address TEXT,
  request_type TEXT NOT NULL CHECK (request_type IN ('assistance', 'medical', 'educational', 'food', 'shelter', 'water', 'other')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
  description TEXT NOT NULL,
  family_size INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'in_progress', 'completed', 'rejected')),
  admin_notes TEXT,
  assigned_to TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Complaints & Suggestions
CREATE TABLE IF NOT EXISTS complaints_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_number SERIAL,
  type TEXT NOT NULL CHECK (type IN ('complaint', 'suggestion', 'feedback', 'inquiry')),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  department TEXT CHECK (department IN ('programs', 'finance', 'hr', 'field', 'admin', 'other')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'investigating', 'resolved', 'closed')),
  admin_response TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Catalog
CREATE TABLE IF NOT EXISTS services_catalog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  eligibility TEXT,
  required_documents TEXT,
  available_governorates TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  application_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Applications
CREATE TABLE IF NOT EXISTS service_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services_catalog(id),
  applicant_name TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  applicant_email TEXT,
  applicant_governorate TEXT NOT NULL,
  applicant_address TEXT,
  family_size INTEGER,
  monthly_income NUMERIC,
  additional_info TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'documents_needed', 'approved', 'in_progress', 'completed', 'rejected')),
  documents_url TEXT[],
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE beneficiary_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_applications ENABLE ROW LEVEL SECURITY;

-- Public read for services catalog
CREATE POLICY "Public can view active services" ON services_catalog FOR SELECT USING (is_active = true);

-- Public insert for requests/complaints/applications
CREATE POLICY "Anyone can submit requests" ON beneficiary_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit feedback" ON complaints_suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can apply for services" ON service_applications FOR INSERT WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admins manage requests" ON beneficiary_requests FOR ALL USING (true);
CREATE POLICY "Admins manage feedback" ON complaints_suggestions FOR ALL USING (true);
CREATE POLICY "Admins manage catalog" ON services_catalog FOR ALL USING (true);
CREATE POLICY "Admins manage applications" ON service_applications FOR ALL USING (true);

-- Indexes
CREATE INDEX idx_requests_status ON beneficiary_requests(status);
CREATE INDEX idx_requests_type ON beneficiary_requests(request_type);
CREATE INDEX idx_requests_governorate ON beneficiary_requests(governorate);
CREATE INDEX idx_feedback_type ON complaints_suggestions(type);
CREATE INDEX idx_feedback_status ON complaints_suggestions(status);
CREATE INDEX idx_services_category ON services_catalog(category);
CREATE INDEX idx_applications_status ON service_applications(status);
