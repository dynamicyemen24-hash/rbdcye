ه # دليل النشر الاحترافي - مؤسسة رحماء بينهم

## الدومينات والروابط

### الدومين الرئيسي
- **rbdcye.org** - الموقع الالكتروني الرئيسي

### لوحة التحكم
- **rbdcye.org/admin** - لوحة التحكم الرئيسية
- **rbdcye.org/admin?tab=messages** - إدارة الرسائل

### الروابط الداخلية
- `/` - الصفحة الرئيسية
- `/about` - من نحن
- `/programs` - برامجنا
- `/projects` - مشاريعنا
- `/success` - قصص النجاح
- `/news` - الأخبار
- `/media` - معرض الوسائط
- `/reports` - التقارير
- `/partners` - الشركاء
- `/contact` - تواصل معنا
- `/donate` - التبرع
- `/admin` - لوحة التحكم

## متطلبات Supabase

### الجداول المطلوبة

```sql
-- جدول الرسائل
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  country_code VARCHAR(5) DEFAULT '+966',
  country VARCHAR(100),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  is_read BOOLEAN DEFAULT FALSE,
  replied_at TIMESTAMP,
  replied_by UUID,
  reply_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- الفهارس
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_country ON messages(country);
```

## متغيرات البيئة (.env.local)

```bash
# Sanity CMS
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01

# Supabase (لوحة التحكم)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Email Service (اختياري)
VITE_RESEND_API_KEY=your-resend-key
```

## أوامر النشر

```bash
# تركيب المشروع
pnpm install

# اختبار البناء
pnpm run build

# نشر على Vercel
vercel --prod
```

## البنية التحتية

### الطبقات
```
المتصفح (React SPA)
    ↓
Vercel CDN (Static Files)
    ↓
Sanity CMS (المحتوى)
    ↓
Supabase (قاعدة البيانات للرسائل)
```

### دورة حياة البيانات
```
المحتوى ←→ Sanity Studio ←→ الموقع (CDN)

الرسائل ←→ Supabase ←→ لوحة التحكم