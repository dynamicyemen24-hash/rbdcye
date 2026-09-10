-- Seed data for donation_projects table
-- Run this after schema.sql to populate initial projects

INSERT INTO donation_projects (slug, title_ar, description_ar, icon, color, target_amount, current_amount, currency, is_active, is_featured, category, display_order) VALUES
('general', 'التبرع العام', 'تبرعك العام يُوجَّه لأكثر الاحتياجات عاجلة حسب تقييم الميدان', 'Heart', 'var(--brand-green)', 5000000, 3200000, 'YER', true, true, 'general', 1),
('food', 'الأمن الغذائي', 'توفير سلال غذائية متكاملة ووجبات ساخنة للأسر المحتاجة', 'Utensils', 'var(--brand-gold)', 3000000, 2100000, 'YER', true, true, 'food', 2),
('water', 'آبار المياه النقية', 'حفر آبار مياه عذبة تعمل بالطاقة الشمسية للمناطق النائية', 'Droplets', 'var(--brand-green-dark)', 7500000, 3375000, 'YER', true, true, 'water', 3),
('education', 'التعليم والتحفيظ', 'دعم حلقات التحفيظ والمدارس وتوفر المستلزمات التعليمية', 'BookOpen', 'var(--brand-green)', 2000000, 560000, 'YER', true, false, 'education', 4),
('orphans', 'كفالات الأيتام', 'كفالات شهرية مستمرة للأيتام تشمل الرعاية والتعليم والصحة', 'Users', 'var(--brand-gold)', 4000000, 2800000, 'YER', true, true, 'orphans', 5),
('zakat', 'زكاة المال', 'إخراج الزكاة عبر حملة رحماء بينهم مع ضمان الوصول للمستحقين', 'Coins', 'var(--brand-green-dark)', 6000000, 4500000, 'YER', true, false, 'zakat', 6),
('winter', 'كسوة الشتاء', 'توفير ملابس شتوية ودفايات للأسر المحتاجة في المناطق الباردة', 'Thermometer', 'var(--brand-gold)', 2500000, 800000, 'YER', true, true, 'winter', 7),
('medical', 'الرعاية الصحية', 'تقديم فحوصات طبية وعلاج مجاني للمحتاجين', 'Stethoscope', 'var(--brand-green)', 3500000, 1400000, 'YER', true, false, 'medical', 8);
