/**
 * Sanity Seed Data - CJS Version (No TypeScript needed)
 * Creates comprehensive initial content for the CMS
 * 
 * Usage: node src/sanity/seed.cjs
 */

const { createClient } = require('@sanity/client');

// Use the same config as sanity.cli.ts for consistency
const projectId = 'xd0ohyiz';
const dataset = 'production';
const token = 'sk0NwGw7BWERpcmoisNT62WV3BGsbZGyYpZOGZPu0BR02aQwJdccFIML5ESvFjzA8ZG7pDOb1c4RuO1PY9WKfIjmNjjLv80PWf7bAtmWW0DmafvwHHpcFawfL19xRACbic8AoMnXlgIbAZaju6mJwkGrcdXEaRZhOxLIIdgRqThCnTARsnEL';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

async function seed() {
  console.log('🌱 Seeding Sanity CMS with comprehensive content...\n');

  if (!token) {
    console.error('❌ Error: Sanity write token is required');
    process.exit(1);
  }

  try {
    // ==================== NEWS ====================
    console.log('📰 Creating news articles...');
    const news1 = await client.create({
      _type: 'news',
      title: 'إطلاق مشروع التعليم المستدام في المناطق النائية لعام ١٤٤٦هـ',
      excerpt: 'أطلقت مؤسسة رحماء بينهم مشروعها السنوي للتعليم المستدام الذي يستهدف أكثر من ٥٠٠ طالب وطالبة في المناطق النائية.',
      content: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'في إطار جهودها المتواصلة لدعم التعليم في اليمن، أطلقت مؤسسة رحماء بينهم مشروعها السنوي للتعليم المستدام لعام ١٤٤٦هـ. يهدف المشروع إلى توفير بيئة تعليمية آمنة ومحفزة للطلاب في المناطق النائية، مع توفير جميع المستلزمات التعليمية وتأهيل المعلمين.' }],
        },
      ],
      category: 'تعليم',
      status: 'PUBLISHED',
      views: 1240,
      tags: ['تعليم', 'تنمية', 'طلاب', 'مناطق نائية'],
      publishDate: '2024-10-18',
      featured: true,
    });
    console.log('  ✅ Created news:', news1._id);

    const news2 = await client.create({
      _type: 'news',
      title: 'توقيع مذكرة تفاهم مع منظمة الإغاثة الدولية',
      excerpt: 'تم التوقيع على مذكرة تفاهم استراتيجية لتنفيذ برامج إغاثية مشتركة في المحافظات المتضررة.',
      content: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'في خطوة تعزز الشراكات الإستراتيجية، وقعت مؤسسة رحماء بينهم مذكرة تفاهم مع منظمة الإغاثة الدولية لتنفيذ برامج إغاثية مشتركة تستهدف آلاف الأسر المتضررة في المحافظات اليمنية.' }],
        },
      ],
      category: 'شراكات',
      status: 'PUBLISHED',
      views: 856,
      tags: ['شراكات', 'إغاثة', 'اتفاقيات'],
      publishDate: '2024-10-15',
    });
    console.log('  ✅ Created news:', news2._id);

    // ==================== PROJECTS ====================
    console.log('\n📁 Creating projects...');
    const project1 = await client.create({
      _type: 'project',
      title: 'مشروع الكساء الشتوي ١٤٤٦',
      description: 'توزيع كسوة شتوية على الأسر المتضررة من البرد في المناطق المرتفعة',
      category: 'إغاثي',
      status: 'active',
      progress: 72,
      budget: 350000,
      beneficiaries: 2000,
      location: 'عدة محافظات',
      startDate: '2024-10-01',
      slug: { _type: 'slug', current: 'winter-clothing-1446' },
    });
    console.log('  ✅ Created project:', project1._id);

    const project2 = await client.create({
      _type: 'project',
      title: 'مشروع التعليم المستدام ١٤٤٦',
      description: 'توفير بيئة تعليمية محفزة وملائمة للطلاب في المناطق النائية',
      category: 'تعليم',
      status: 'active',
      progress: 45,
      budget: 500000,
      beneficiaries: 500,
      location: 'المناطق النائية',
      startDate: '2024-09-01',
      slug: { _type: 'slug', current: 'sustainable-education-1446' },
    });
    console.log('  ✅ Created project:', project2._id);

    // ==================== PARTNERS ====================
    console.log('\n🤝 Creating partners...');
    const partner1 = await client.create({
      _type: 'partner',
      name: 'منظمة الإغاثة الخيرية',
      type: 'حكومي',
      status: 'active',
      description: 'شريك استراتيجي في البرامج الإغاثية والتنموية',
      website: 'https://example.com',
    });
    console.log('  ✅ Created partner:', partner1._id);

    const partner2 = await client.create({
      _type: 'partner',
      name: 'مؤسسة التنمية البشرية',
      type: 'خاص',
      status: 'active',
      description: 'شريك في برامج التمكين الاقتصادي وتنمية المجتمع',
    });
    console.log('  ✅ Created partner:', partner2._id);

    // ==================== SUCCESS STORIES ====================
    console.log('\n⭐ Creating success stories...');
    const story1 = await client.create({
      _type: 'successStory',
      title: 'من اللجوء إلى ريادة الأعمال',
      name: 'فاطمة أحمد',
      program: 'تمكين المرأة',
      content: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'لم أكن أتخيل أنني سأصبح سيدة أعمال تدعم أسرتي وثماني أسر أخرى. مؤسسة رحماء بينهم غيرت حياتي بالكامل من خلال برنامج التمكين الاقتصادي الذي علمني مهارات الخياطة وإدارة المشاريع الصغيرة.' }],
        },
      ],
      status: 'published',
      featured: true,
    });
    console.log('  ✅ Created success story:', story1._id);

    const story2 = await client.create({
      _type: 'successStory',
      title: 'حلم التعليم يتحقق',
      name: 'محمد علي',
      program: 'تعليم',
      content: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'بعد أن حلماً بالاستمرار في التعليم، حصلت على منحة دراسية كاملة من المؤسسة. اليوم أنا في السنة الثالثة جامعة وأساعد طلاب آخرين لتحقيق أحلامهم.' }],
        },
      ],
      status: 'published',
    });
    console.log('  ✅ Created success story:', story2._id);

    // ==================== EVENTS ====================
    console.log('\n📅 Creating events...');
    const event1 = await client.create({
      _type: 'event',
      title: 'حملة إغاثة شتوية ١٤٤٦',
      description: 'حملة لتوزيع الكسوة والغذاء على الأسر المتضررة',
      type: 'حملة',
      startDate: '2024-12-01T08:00:00',
      endDate: '2024-12-31T18:00:00',
      location: 'عدة محافظات',
      status: 'upcoming',
      featured: true,
      capacity: 5000,
    });
    console.log('  ✅ Created event:', event1._id);

    // ==================== TESTIMONIALS ====================
    console.log('\n💬 Creating testimonials...');
    const testimonial1 = await client.create({
      _type: 'testimonial',
      name: 'أحمد محمد',
      role: 'متطوع',
      quote: 'تجربة التطوع مع رحماء بينهم غيرت نظرتي للحياة. الخير ليس في المال فقط، بل في العطاء بالوقت والجهد.',
      rating: 5,
      status: 'published',
    });
    console.log('  ✅ Created testimonial:', testimonial1._id);

    // ==================== FAQs ====================
    console.log('\n❓ Creating FAQs...');
    const faq1 = await client.create({
      _type: 'faq',
      question: 'كيف يمكنني التبرع للمؤسسة؟',
      answer: 'يمكنكم التبرع من خلال الموقع الإلكتروني، أو عبر التحويل البنكي، أو بالاتصال بنا مباشرة. نوفر طرق دفع متعددة لراحتكم.',
      category: 'تبرعات',
      order: 1,
    });
    console.log('  ✅ Created FAQ:', faq1._id);

    const faq2 = await client.create({
      _type: 'faq',
      question: 'هل يمكنني التطوع مع المؤسسة؟',
      answer: 'نعم، نرحب بالتطوع في جميع برامجنا. يمكنكم التسجيل في صفحة التطوع أو التواصل معنا مباشرة.',
      category: 'تطوع',
      order: 2,
    });
    console.log('  ✅ Created FAQ:', faq2._id);

    // ==================== VIDEOS ====================
    console.log('\n🎥 Creating videos...');
    const video1 = await client.create({
      _type: 'video',
      title: 'فيديو قصة المؤسسة',
      description: 'تعرف على قصة تأسيس مؤسسة رحماء بينهم وإنجازاتها',
      category: 'تعريفي',
      thumbnail: null,
      videoUrl: 'https://www.youtube.com/watch?v=example',
      duration: '5:30',
      isFeatured: true,
      views: 15000,
      publishDate: '2024-01-01',
    });
    console.log('  ✅ Created video:', video1._id);

    // ==================== MEDIA ====================
    console.log('\n🖼️ Creating media...');
    const media1 = await client.create({
      _type: 'media',
      title: 'صورة الحملة الشتوية',
      type: 'image',
      date: '2024-10-01',
    });
    console.log('  ✅ Created media:', media1._id);

    // ==================== REPORTS ====================
    console.log('\n📊 Creating reports...');
    const report1 = await client.create({
      _type: 'report',
      title: 'التقرير السنوي ٢٠٢٤',
      type: 'سنوي',
      status: 'published',
      date: '2024-12-31',
    });
    console.log('  ✅ Created report:', report1._id);

    // ==================== CONTACT REQUESTS ====================
    console.log('\n📧 Creating contact requests...');
    const contact1 = await client.create({
      _type: 'contactRequest',
      name: 'خالد الرشيدي',
      email: 'khaled@example.com',
      phone: '77xxxxxxxx',
      type: 'استفسار',
      subject: 'الاستفسار عن التبرعات',
      message: 'أريد التبرع لمشروع التعليم المستدام',
      status: 'new',
      date: new Date().toISOString(),
    });
    console.log('  ✅ Created contact request:', contact1._id);

    // ==================== VOLUNTEERS ====================
    console.log('\n🙋 Creating volunteers...');
    const volunteer1 = await client.create({
      _type: 'volunteer',
      name: 'سارة علي',
      email: 'sara@example.com',
      phone: '77xxxxxxxx',
      field: 'تعليم',
      motivation: 'أحب مساعدة الأطفال وتحسين مستقبلهم',
      status: 'active',
      hours: 120,
      date: new Date().toISOString(),
    });
    console.log('  ✅ Created volunteer:', volunteer1._id);

    // ==================== USERS ====================
    console.log('\n👥 Creating users...');
    const user1 = await client.create({
      _type: 'user',
      name: 'أحمد المدير',
      email: 'admin@rbdcye.org',
      role: 'ADMIN',
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    console.log('  ✅ Created user:', user1._id);

    // ==================== DONATIONS ====================
    console.log('\n💝 Creating donations...');
    const donation1 = await client.create({
      _type: 'donation',
      donor: 'مؤسسة الخير',
      email: 'charity@example.com',
      phone: '77xxxxxxxx',
      amount: 100000,
      currency: 'YER',
      method: 'تحويل بنكي',
      type: 'مرة واحدة',
      status: 'completed',
      date: '2024-10-01',
      anonymous: false,
    });
    console.log('  ✅ Created donation:', donation1._id);

    // ==================== SUBSCRIBERS ====================
    console.log('\n📬 Creating subscribers...');
    const subscriber1 = await client.create({
      _type: 'subscriber',
      name: 'محمد المشترك',
      email: 'mohammed@example.com',
      phone: '77xxxxxxxx',
      interests: ['news', 'donations'],
      source: 'website',
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('  ✅ Created subscriber:', subscriber1._id);

    // ==================== SITE SETTINGS ====================
    console.log('\n⚙️ Creating site settings...');
    const settings = await client.create({
      _type: 'siteSettings',
      siteName: 'رحماء بينهم',
      tagline: 'أثرٌ يدوم، مستقبلٌ يُبنى',
      description: 'مؤسسة رحماء بينهم منظمة إنسانية تنموية رائدة في اليمن',
      socialLinks: [
        {
          _type: 'object',
          platform: 'facebook',
          url: 'https://facebook.com/rbdcye',
        },
        {
          _type: 'object',
          platform: 'twitter',
          url: 'https://twitter.com/rbdcye',
        },
        {
          _type: 'object',
          platform: 'youtube',
          url: 'https://youtube.com/rbdcye',
        },
      ],
      contactInfo: {
        phone: '777123456',
        whatsapp: '967777123456',
        email: 'info@rbdcye.org',
        address: 'صنعاء، اليمن',
      },
    });
    console.log('  ✅ Created site settings:', settings._id);

    // ==================== DASHBOARD ====================
    console.log('\n📊 Creating dashboard...');
    const dashboard = await client.create({
      _type: 'dashboard',
      title: 'لوحة التحكم الرئيسية',
    });
    console.log('  ✅ Created dashboard:', dashboard._id);

    console.log('\n✅ Seeding completed successfully!');
    console.log('📊 Total documents created: 15');
    console.log('\n📝 Summary:');
    console.log('  - 2 news articles');
    console.log('  - 2 projects');
    console.log('  - 2 partners');
    console.log('  - 2 success stories');
    console.log('  - 1 event');
    console.log('  - 1 testimonial');
    console.log('  - 2 FAQs');
    console.log('  - 1 video');
    console.log('  - 1 media');
    console.log('  - 1 report');
    console.log('  - 1 contact request');
    console.log('  - 1 volunteer');
    console.log('  - 1 user');
    console.log('  - 1 donation');
    console.log('  - 1 subscriber');
    console.log('  - 1 site settings');
    console.log('  - 1 dashboard');
    console.log('\n🎉 You can now view your content in Sanity Studio at /admin/studio');
    console.log('🌐 Or publish from: https://sanity.io/manage\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

seed();