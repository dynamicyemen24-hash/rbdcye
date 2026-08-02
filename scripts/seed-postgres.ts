import { Client } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS partners (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT,
      type TEXT,
      status TEXT DEFAULT 'active',
      url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE TABLE IF NOT EXISTS success_stories (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT,
      quote TEXT,
      name TEXT,
      role TEXT,
      program TEXT,
      category TEXT,
      year TEXT,
      location TEXT,
      rating INT,
      image TEXT,
      status TEXT DEFAULT 'published',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      category TEXT,
      category_color TEXT,
      category_bg TEXT,
      date TEXT,
      date_en DATE,
      image TEXT,
      views INT DEFAULT 0,
      featured BOOLEAN DEFAULT FALSE,
      status TEXT DEFAULT 'PUBLISHED',
      tags TEXT[],
      location TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT,
      status TEXT DEFAULT 'active',
      beneficiaries TEXT,
      budget TEXT,
      progress INT,
      date DATE,
      description TEXT,
      location TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT,
      date TEXT,
      file TEXT,
      size TEXT,
      status TEXT DEFAULT 'published',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE TABLE IF NOT EXISTS media_library (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT,
      url TEXT,
      date TEXT,
      size TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE TABLE IF NOT EXISTS donations (
      id SERIAL PRIMARY KEY,
      donor TEXT,
      amount NUMERIC(12, 2),
      project TEXT,
      method TEXT,
      date TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE TABLE IF NOT EXISTS service_requests (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      type TEXT,
      message TEXT,
      date TEXT,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE TABLE IF NOT EXISTS volunteers (
      id SERIAL PRIMARY KEY,
      name TEXT,
      phone TEXT,
      email TEXT,
      field TEXT,
      status TEXT DEFAULT 'active',
      hours INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE TABLE IF NOT EXISTS dashboard_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      role TEXT DEFAULT 'editor',
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE NULL
    );

    CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
    CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_posts_date_en ON posts(date_en);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
    CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
    CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
    CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
  `);

  await client.query(`
    INSERT INTO partners (name, logo, type, status, url)
    VALUES
      ('منظمة الإغاثة الخيرية', '', 'شريك إستراتيجي', 'active', '#'),
      ('صندوق التنمية البشرية', '', 'جهة ممولة', 'active', '#'),
      ('جامعة العلوم والتكنولوجيا', '', 'شريك تنفيذي', 'active', '#'),
      ('هيئة الأعمال الخيرية', '', 'شريك داعم', 'active', '#'),
      ('اللجنة الإغاثية العربية', '', 'شريك إستراتيجي', 'active', '#'),
      ('بنك الطعام اليمني', '', 'شريك تنفيذي', 'active', '#')
    ON CONFLICT DO NOTHING;
  `);

  await client.query(`
    INSERT INTO success_stories (title, excerpt, quote, name, role, program, category, year, location, rating, image, status)
    VALUES
      ('من اللجوء إلى ريادة الأعمال', 'قصة نجاح للمستفيدة فاطمة أحمد التي تحولت من مستفيدة من برامج الإغاثة إلى سيدة أعمال ناجحة تدعم ٨ أسر في محافظة تعز.', 'لم أكن أتخيل أنني سأصبح سيدة أعمال تدعم أسرتي وثماني أسر أخرى. مؤسسة رحماء بينهم غيرت حياتي بالكامل.', 'فاطمة أحمد', 'مستفيدة سابقة - مشروع تمكين المرأة', 'تمكين المرأة', 'تنمية مجتمعية', '١٤٤٥هـ', 'تعز', 5, 'https://images.unsplash.com/photo-1642425145481-d59fbcfde153?w=600&h=400&auto=format&fit=crop&q=80', 'PUBLISHED'),
      ('أحمد يبني مستقبله', 'بعد انقطاعه عن التعليم بسبب الحرب، عاد أحمد إلى مقاعد الدراسة من خلال برنامج التعليم المستمر للمؤسسة.', 'كنت أظلم أن التعليم انتهى بالنسبة لي، لكن بفضل برنامج التعليم المستمر، الآن أدرس في كلية الهندسة.', 'أحمد محمد', 'طالب في برنامج التعليم', 'التعليم المستمر', 'تعليم', '١٤٤٦هـ', 'صنعاء', 5, 'https://images.unsplash.com/photo-1656416584402-b720e0d786dc?w=600&h=400&auto=format&fit=crop&q=80', 'PUBLISHED'),
      ('مبادرة مجتمعية تغير واقع قرية نائية', 'بفضل جهود المتطوعين ودعم المؤسسة، تحولت قرية نائية في محافظة حجة إلى قرية منتجة تمتلك مشروعًا مجتمعيًا مستدامًا.', 'كنا نحلم بمشروع يغير واقعنا، واليوم أصبح الحلم حقيقة بفضل الله ثم بفضل مؤسسة رحماء بينهم.', 'مصعب عبدالله', 'قائد مبادرة مجتمعية', 'التنمية المجتمعية', 'تنمية', '١٤٤٦هـ', 'حجة', 5, 'https://images.unsplash.com/photo-1733654039689-f0852bed75d6?w=600&h=400&auto=format&fit=crop&q=80', 'PUBLISHED');
  `);

  await client.query(`
    INSERT INTO posts (title, excerpt, content, category, category_color, category_bg, date, date_en, image, views, featured, status, tags, location)
    VALUES
      ('إطلاق مشروع التعليم المستدام في المناطق النائية لعام ١٤٤٦هـ', 'أطلقت مؤسسة رحماء بينهم مشروعها السنوي للتعليم المستدام الذي يستهدف أكثر من ٥٠٠ طالب وطالبة في المناطق النائية، ويشمل توفير الكتب والقرطاسية والحقائب المدرسية والتدريب المهني.', 'في إطار جهودها المتواصلة لدعم التعليم في اليمن، أطلقت مؤسسة رحماء بينهم مشروعها السنوي للتعليم المستدام لعام ١٤٤٦هـ، الذي يستهدف أكثر من ٥٠٠ طالب وطالبة في المناطق النائية. يشمل المشروع توزيع الكتب المدرسية والقرطاسية والحقائب المدرسية، إضافة إلى برامج التدريب المهني والتأهيل للطلاب المتسربين من التعليم. ويأتي هذا المشروع ضمن استراتيجية المؤسسة لتعزيز التعليم كأداة للتنمية المستدامة وتمكين الأجيال القادمة.', 'تعليم', '#2563EB', '#EFF6FF', '١٥ ربيع الثاني ١٤٤٦', '2024-10-18', 'https://images.unsplash.com/photo-1611907671216-7ec6ef949163?w=600&h=400&auto=format&fit=crop&q=80', 1240, TRUE, 'PUBLISHED', ARRAY['تعليم', 'تنمية', 'طلاب'], 'عدة محافظات'),
      ('توزيع ٨٠٠ سلة غذائية على الأسر المتضررة في محافظة تعز', 'نفّذ فريق الإغاثة الميداني التابع للمؤسسة حملة موسعة لتوزيع السلال الغذائية على الأسر الأكثر احتياجًا في عدة مديريات بمحافظة تعز.', 'نفذ فريق الإغاثة الميداني التابع لمؤسسة رحماء بينهم حملة موسعة لتوزيع ٨٠٠ سلة غذائية على الأسر المتضررة والنازحة في عدة مديريات بمحافظة تعز. تأتي هذه الحملة ضمن البرنامج الإغاثي الدوري للمؤسسة الذي يستهدف الأسر الأكثر احتياجاً في المناطق المتأثرة بالصراع. وتحتوي كل سلة غذائية على المواد الأساسية التي تكفي أسرة لمدة شهر كامل.', 'إغاثة', '#E74C3C', '#FEF2F2', '٨ ربيع الثاني ١٤٤٦', '2024-10-11', 'https://images.unsplash.com/photo-1733654039689-f0852bed75d6?w=600&h=400&auto=format&fit=crop&q=80', 986, TRUE, 'PUBLISHED', ARRAY['إغاثة', 'مساعدات', 'نازحين'], 'تعز');
  `);

  await client.query(`
    INSERT INTO projects (title, category, status, beneficiaries, budget, progress, date, description, location)
    VALUES
      ('مشروع الكساء الشتوي ١٤٤٦', 'إغاثة', 'active', '٢٠٠٠ أسرة', '٣٥٠,٠٠٠ ر.ي', 72, '2024-10-01', 'توزيع كسوة شتوية على الأسر المتضررة من البرد في المناطق المرتفعة', 'عدة محافظات'),
      ('مشروع التعليم في الريف', 'تعليم', 'completed', '٥٠٠ طالب', '١٨٠,٠٠٠ ر.ي', 100, '2024-08-01', 'دعم التعليم في المناطق الريفية النائية بالمحافظات', 'حجة، عمران'),
      ('مشروع تمكين المرأة الريفية', 'تنمية', 'pending', '١٢٠ سيدة', '٢٢٠,٠٠٠ ر.ي', 15, '2024-11-01', 'تمكين المرأة الريفية اقتصادياً عبر التدريب والتأهيل', 'تعز، الحديدة'),
      ('مشروع حفر الآبار', 'بنية تحتية', 'active', '٣ قرى', '٤٨٠,٠٠٠ ر.ي', 58, '2024-09-15', 'توفير مياه شرب نظيفة عبر حفر آبار في المناطق المحتاجة', 'مأرب، الجوف');
  `);

  await client.query(`
    INSERT INTO reports (title, type, date, file, size, status)
    VALUES
      ('التقرير السنوي ١٤٤٥هـ', 'تقرير سنوي', '١٤٤٦/١/١', '', '٤.٢ م.ب', 'published'),
      ('نشرة شهر ربيع الأول ١٤٤٦هـ', 'نشرة دورية', '١٤٤٦/٣/١', '', '١.٨ م.ب', 'published');
  `);

  await client.query(`
    INSERT INTO media_library (title, type, url, date, size)
    VALUES
      ('حفل تكريم المتفوقين', 'image', 'https://images.unsplash.com/photo-1642425149790-6067ff132526?w=600&h=400&auto=format&fit=crop&q=80', '١٤٤٦/٣/١٥', '١.٢ م.ب'),
      ('توزيع المساعدات في تعز', 'image', 'https://images.unsplash.com/photo-1733654039689-f0852bed75d6?w=600&h=400&auto=format&fit=crop&q=80', '١٤٤٦/٢/٢٠', '٠.٩ م.ب');
  `);

  await client.query(`
    INSERT INTO donations (donor, amount, project, method, date, status)
    VALUES
      ('أحمد محمد علي', 500, 'الصندوق العام', 'card', '١٤٤٦/٤/١', 'completed'),
      ('فاطمة عبدالله', 250, 'الإغاثة الإنسانية', 'mobile', '١٤٤٦/٤/٣', 'completed'),
      ('خالد صالح', 1000, 'دعم التعليم', 'transfer', '١٤٤٦/٣/٢٨', 'pending');
  `);

  await client.query(`
    INSERT INTO service_requests (name, email, type, message, date, status)
    VALUES
      ('مؤسسة الخير الدولية', 'info@alkhair.org', 'منظمة داعمة', 'نرغب في الشراكة مع المؤسسة في مشاريع المياه', 'منذ يوم', 'new'),
      ('محمد عبدالله العريفي', 'mohd@email.com', 'فاعل خير', 'أرغب في التبرع بمبلغ شهري للمؤسسة', 'منذ ساعتين', 'new');
  `);

  await client.query(`
    INSERT INTO volunteers (name, phone, email, field, status, hours)
    VALUES
      ('عبدالرحمن النجار', '+٩٦٧ ٧٧٧ ١١١ ٢٢٢', 'abdu@email.com', 'تعليمي', 'active', 120),
      ('نورة أحمد', '+٩٦٧ ٧٧٧ ٣٣٣ ٤٤٤', 'nora@email.com', 'صحي', 'active', 85);
  `);

  await client.query(`
    INSERT INTO subscribers (name, email, phone, status)
    VALUES
      ('علي القاضي', 'ali@example.com', '+٩٦٧ ٧٧٧ ٩٩٩ ٠٠٠', 'approved'),
      ('سارة عبدالله', 'sara@example.com', '+٩٦٧ ٧٧٧ ٨٨٨ ١١١', 'pending');
  `);

  await client.query(`
    INSERT INTO dashboard_users (email, full_name, role, status)
    VALUES
      ('admin@rbdcye.org', 'مدير النظام', 'admin', 'active'),
      ('editor@rbdcye.org', 'محرر المحتوى', 'editor', 'active')
    ON CONFLICT DO NOTHING;
  `);

  console.log('Database schema created and seed data inserted successfully.');
}

run()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(() => client.end());
