/**
 * Sanity Seed Data - rbdcye Website
 * Creates initial content for the CMS
 * 
 * Usage: npx tsx src/sanity/seed.ts
 */

import { createClient } from '@sanity/client';

// Use the same config as sanity.cli.ts for consistency
const projectId = 'xd0ohyiz';
const dataset = 'production';
const token = process.env.SANITY_AUTH_TOKEN;
if (!token) {
  throw new Error('SANITY_AUTH_TOKEN environment variable is required');
}

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
    // =============================================
    // 1. إعدادات الموقع
    // =============================================
    console.log('📋 Creating site settings...');
    const siteSettings = await client.create({
      _type: 'siteSettings',
      siteName: 'رحماء بينهم',
      tagline: 'أثرٌ يدوم - مستقبلٌ يُبنى',
      description: 'مؤسسة رحماء بينهم منظمة إنسانية تنموية رائدة في اليمن، تعمل على تخفيف معاناة الأسرة اليمنية وتحقيق التنمية المستدامة عبر برامج متكاملة.',
      heroVideoUrl: '/videos/hero-background.mp4',
      heroVideoMuted: true,
      heroVideoLoop: true,
      youtubeChannelUrl: 'https://www.youtube.com/@RahmaaBenahum',
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/rbdcye' },
        { platform: 'twitter', url: 'https://twitter.com/rbdcye' },
        { platform: 'instagram', url: 'https://instagram.com/rbdcye' },
        { platform: 'youtube', url: 'https://youtube.com/@RahmaaBenahum' },
        { platform: 'whatsapp', url: 'https://wa.me/967777888194' },
        { platform: 'telegram', url: 'https://t.me/rbdcye' },
      ],
      contactInfo: {
        phone: '+967 777 888 195',
        phoneSecondary: '+967 777 888 194',
        whatsapp: '+967777888194',
        email: 'info@rbdcye.org',
        emailInfo: 'donations@rbdcye.org',
        address: 'صنعاء - اليمن',
        workingHours: 'السبت - الخميس: 8:00 ص - 4:00 م',
      },
      seo: {
        metaTitle: 'مؤسسة رحماء بينهم - إغاثة وتنمية',
        metaDescription: 'مؤسسة رحماء بينهم منظمة إنسانية تنموية رائدة في اليمن، تعمل على تخفيف معاناة الأسرة اليمنية وتحقيق التنمية المستدامة عبر برامج متكاملة.',
        keywords: ['رحماء بينهم', 'إغاثة', 'تنمية', 'يمن', 'عمل خيري', 'تبرعات', 'أعمال إنسانية'],
      },
    });
    console.log('   ✅ Site settings created:', siteSettings._id);

    // =============================================
    // 2. المشاريع
    // =============================================
    console.log('\n📁 Creating projects...');
    
    const project1 = await client.create({
      _type: 'project',
      title: 'مشروع الكساء الشتوي ١٤٤٦',
      slug: { _type: 'slug', current: 'winter-clothing-1446' },
      description: 'توزيع كسوة شتوية على الأسر المتضررة من البرد في المناطق المرتفعة في عدة محافظات يمنية.',
      category: 'إغاثة',
      status: 'active',
      progress: 72,
      budget: 350000,
      beneficiaries: 2000,
      location: 'ذمار - عمران - صنعاء',
      startDate: '2024-10-01',
      endDate: '2025-02-28',
    });
    console.log('   ✅ Project created:', project1.title);

    const project2 = await client.create({
      _type: 'project',
      title: 'مشروع إفطار الصائم ١٤٤٦',
      slug: { _type: 'slug', current: 'ramadan-iftar-1446' },
      description: 'إفطار الصائمين في شهر رمضان المبارك في مختلف المحافظات اليمنية.',
      category: 'إغاثة',
      status: 'active',
      progress: 45,
      budget: 500000,
      beneficiaries: 15000,
      location: 'جميع المحافظات',
      startDate: '2025-02-01',
      endDate: '2025-03-30',
    });
    console.log('   ✅ Project created:', project2.title);

    const project3 = await client.create({
      _type: 'project',
      title: 'مشروع المياه النظيفة',
      slug: { _type: 'slug', current: 'clean-water-project' },
      description: 'حفر آبار وتوفير مياه نظيفة للمناطق التي تعاني من شح المياه.',
      category: 'تنمية',
      status: 'active',
      progress: 30,
      budget: 750000,
      beneficiaries: 5000,
      location: 'حجة - الحديدة - تعز',
      startDate: '2024-09-01',
      endDate: '2025-08-31',
    });
    console.log('   ✅ Project created:', project3.title);

    const project4 = await client.create({
      _type: 'project',
      title: 'مشروع التعليم المستدام',
      slug: { _type: 'slug', current: 'sustainable-education' },
      description: 'دعم التعليم في المناطق النائية وتوفير المستلزمات المدرسية للطلاب المحتاجين.',
      category: 'تعليم',
      status: 'active',
      progress: 60,
      budget: 400000,
      beneficiaries: 3500,
      location: 'عدة محافظات',
      startDate: '2024-08-01',
      endDate: '2025-07-31',
    });
    console.log('   ✅ Project created:', project4.title);

    const project5 = await client.create({
      _type: 'project',
      title: 'مشروع التدريب المهني للشباب',
      slug: { _type: 'slug', current: 'vocational-training' },
      description: 'تدريب الشباب على المهارات الحرفية والمهنية لتمكينهم اقتصادياً.',
      category: 'تدريب',
      status: 'active',
      progress: 25,
      budget: 250000,
      beneficiaries: 500,
      location: 'صنعاء - عدن - تعز',
      startDate: '2024-11-01',
      endDate: '2025-10-31',
    });
    console.log('   ✅ Project created:', project5.title);

    // =============================================
    // 3. الأخبار
    // =============================================
    console.log('\n📰 Creating news articles...');
    
    const news1 = await client.create({
      _type: 'news',
      title: 'إطلاق مشروع التعليم المستدام في المناطق النائية لعام ١٤٤٦هـ',
      slug: { _type: 'slug', current: 'sustainable-education-launch-1446' },
      excerpt: 'أطلقت مؤسسة رحماء بينهم مشروعها السنوي للتعليم المستدام الذي يستهدف أكثر من ٥٠٠ طالب وطالبة في المناطق النائية.',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: 'في إطار جهودها المتواصلة لدعم التعليم في اليمن، أطلقت مؤسسة رحماء بينهم مشروعها السنوي للتعليم المستدام لعام ١٤٤٦هـ.' },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: 'يستهدف المشروع أكثر من ٥٠٠ طالب وطالبة في المناطق النائية، ويشمل توفير المستلزمات المدرسية وحوافز للطلاب والمعلمين.' },
          ],
        },
      ],
      category: 'تعليم',
      status: 'PUBLISHED',
      author: 'فريق التحرير',
      views: 1240,
      featured: true,
      tags: ['تعليم', 'تنمية', 'طلاب', 'مناطق نائية'],
      publishDate: '2024-10-18T10:00:00Z',
    });
    console.log('   ✅ News created:', news1.title);

    const news2 = await client.create({
      _type: 'news',
      title: 'توزيع ٢٠٠٠ سلة غذائية في محافظة حجة',
      slug: { _type: 'slug', current: 'food-baskets-hajjah' },
      excerpt: 'وزعت مؤسسة رحماء بينهم ٢٠٠٠ سلة غذائية على الأسر المتضررة في محافظة حجة.',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: 'ضمن حملة الإغاثة الطارئة، وزعت مؤسسة رحماء بينهم ٢٠٠٠ سلة غذائية على الأسر المتضررة في محافظة حجة.' },
          ],
        },
      ],
      category: 'إغاثة',
      status: 'PUBLISHED',
      author: 'فريق التحرير',
      views: 890,
      featured: true,
      tags: ['إغاثة', 'سلة غذائية', 'حجة'],
      publishDate: '2024-09-15T10:00:00Z',
    });
    console.log('   ✅ News created:', news2.title);

    const news3 = await client.create({
      _type: 'news',
      title: 'اختتام برنامج التدريب المهني للشباب',
      slug: { _type: 'slug', current: 'vocational-training-conclusion' },
      excerpt: 'اختتمت المؤسسة برنامج التدريب المهني للشباب بمشاركة ١٢٠ شاباً وشابة.',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: 'اختتمت مؤسسة رحماء بينهم برنامج التدريب المهني للشباب الذي استمر لمدة ٣ أشهر.' },
          ],
        },
      ],
      category: 'تدريب',
      status: 'PUBLISHED',
      author: 'فريق التحرير',
      views: 650,
      featured: false,
      tags: ['تدريب', 'شباب', 'تمكين'],
      publishDate: '2024-08-20T10:00:00Z',
    });
    console.log('   ✅ News created:', news3.title);

    // =============================================
    // 4. قصص النجاح
    // =============================================
    console.log('\n⭐ Creating success stories...');
    
    const story1 = await client.create({
      _type: 'successStory',
      title: 'من اللجوء إلى ريادة الأعمال',
      slug: { _type: 'slug', current: 'from-displacement-to-entrepreneurship' },
      name: 'فاطمة أحمد',
      program: 'تمكين المرأة',
      quote: 'لم أكن أتخيل أنني سأصبح سيدة أعمال تدعم أسرتي وثماني أسر أخرى. مؤسسة رحماء بينهم غيرت حياتي بالكامل.',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: 'بدأت فاطمة رحلتها مع المؤسسة بعد أن فقدت زوجها في الحرب. بفضل برنامج تمكين المرأة، تمكنت من إنشاء مشروع خياطة صغير أصبح الآن يدعم ٩ أسر.' },
          ],
        },
      ],
      status: 'published',
      featured: true,
    });
    console.log('   ✅ Story created:', story1.title);

    const story2 = await client.create({
      _type: 'successStory',
      title: 'عودة الأمل بعد اليأس',
      slug: { _type: 'slug', current: 'return-of-hope' },
      name: 'أحمد محمد',
      program: 'الإغاثة الطارئة',
      quote: 'كنت على وشك فقدان الأمل، لكن المساعدة التي تلقيتها من المؤسسة أعادت لي ولأسرتي الحياة.',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            { _type: 'span', text: 'بعد أن دمرت الحرب منزله، تلقى أحمد وأسرته دعماً شاملاً من المؤسسة شمل المأوى والغذاء والرعاية الصحية.' },
          ],
        },
      ],
      status: 'published',
      featured: true,
    });
    console.log('   ✅ Story created:', story2.title);

    // =============================================
    // 5. الشركاء
    // =============================================
    console.log('\n🤝 Creating partners...');
    
    const partners = [
      { name: 'الهيئة الخيرية للإغاثة', type: 'منظمة غير حكومية', status: 'active', description: 'شريك استراتيجي في البرامج الإغاثية' },
      { name: 'وزارة الشؤون الاجتماعية', type: 'حكومي', status: 'active', description: 'الجهة الرسمية المشرفة على العمل الإنساني' },
      { name: 'بنك التضامن الإسلامي', type: 'خاص', status: 'active', description: 'شريك مالي رئيسي' },
      { name: 'مؤسسة العون للتنمية', type: 'منظمة غير حكومية', status: 'active', description: 'شريك في برامج التنمية المستدامة' },
      { name: 'شركة الاتصالات اليمنية', type: 'خاص', status: 'active', description: 'شريك تقني وداعم للحملات' },
    ];

    for (const p of partners) {
      const partner = await client.create({
        _type: 'partner',
        name: p.name,
        slug: { _type: 'slug', current: p.name.replace(/\s+/g, '-') },
        type: p.type,
        status: p.status,
        description: p.description,
      });
      console.log('   ✅ Partner created:', partner.name);
    }

    // =============================================
    // 6. الفيديوهات
    // =============================================
    console.log('\n🎥 Creating videos...');
    
    const video1 = await client.create({
      _type: 'video',
      title: 'الفيديو التعريفي للمؤسسة',
      slug: { _type: 'slug', current: 'intro-video' },
      description: 'فيديو تعريفي بمؤسسة رحماء بينهم وأنشطتها الإغاثية والتنموية في اليمن.',
      videoUrl: '/videos/hero-background.mp4',
      duration: '3:45',
      category: 'تعريفي',
      isFeatured: true,
      isStoryVideo: true,
      status: 'published',
      tags: ['تعريفي', 'مؤسسة', 'إغاثة', 'تنمية'],
      publishDate: '2024-01-01T10:00:00Z',
      views: 5000,
      likes: 350,
    });
    console.log('   ✅ Video created:', video1.title);

    const video2 = await client.create({
      _type: 'video',
      title: 'مشروع الكساء الشتوي',
      slug: { _type: 'slug', current: 'winter-clothing-video' },
      description: 'تقرير مصور عن مشروع الكساء الشتوي وتوزيعه على الأسر المتضررة.',
      videoUrl: '/videos/hero-background.mp4',
      duration: '5:20',
      category: 'مشاريع',
      isFeatured: true,
      isStoryVideo: false,
      status: 'published',
      tags: ['كساء شتوي', 'إغاثة', 'مشاريع'],
      publishDate: '2024-11-01T10:00:00Z',
      views: 2300,
      likes: 180,
    });
    console.log('   ✅ Video created:', video2.title);

    // =============================================
    // 7. الأسئلة الشائعة
    // =============================================
    console.log('\n❓ Creating FAQs...');
    
    const faqs = [
      { question: 'كيف يمكنني التبرع للمؤسسة؟', answer: 'يمكنك التبرع عبر موقعنا الإلكتروني من خلال قسم التبرع السريع، أو عبر التحويل البنكي، أو من خلال زيارة مقر المؤسسة.', category: 'donations', order: 1 },
      { question: 'هل تبرعاتي تصل إلى المستحقين؟', answer: 'نعم، تصل تبرعاتكم إلى المستحقين عبر فرقنا الميدانية المنتشرة في جميع المحافظات، مع تقارير دورية توضح أثر التبرع.', category: 'donations', order: 2 },
      { question: 'كيف يمكنني التطوع مع المؤسسة؟', answer: 'يمكنك التسجيل في قسم التطوع عبر موقعنا، وسيتواصل معك فريق التطوع لتحديد المجال المناسب لمهاراتك.', category: 'volunteering', order: 3 },
      { question: 'ما هي مجالات عمل المؤسسة؟', answer: 'تعمل المؤسسة في مجالات الإغاثة الطارئة، التعليم، التنمية المستدامة، التدريب المهني، وتمكين المرأة.', category: 'general', order: 4 },
      { question: 'هل يمكنني تخصيص تبرعي لمشروع معين؟', answer: 'نعم، يمكنك اختيار المشروع الذي ترغب في دعمه من قائمة المشاريع المتاحة على موقعنا.', category: 'donations', order: 5 },
      { question: 'كيف يمكنني التواصل مع المؤسسة؟', answer: 'يمكنك التواصل عبر البريد الإلكتروني info@rbdcye.org أو عبر الهاتف +967 1 234 567 أو عبر واتساب.', category: 'general', order: 6 },
    ];

    for (const faq of faqs) {
      const created = await client.create({
        _type: 'faq',
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order: faq.order,
        helpful: true,
      });
      console.log('   ✅ FAQ created:', created.question);
    }

    // =============================================
    // 8. الفعاليات
    // =============================================
    console.log('\n📅 Creating events...');
    
    const event1 = await client.create({
      _type: 'event',
      title: 'حملة الشتاء الدافئ ١٤٤٦',
      slug: { _type: 'slug', current: 'warm-winter-campaign-1446' },
      description: 'حملة لجمع التبرعات لتوزيع الكسوة الشتوية على الأسر المتضررة.',
      type: 'campaign',
      status: 'ongoing',
      featured: true,
      startDate: '2024-12-01T08:00:00Z',
      endDate: '2025-02-28T17:00:00Z',
      location: 'جميع المحافظات',
      capacity: 10000,
      registeredCount: 4500,
    });
    console.log('   ✅ Event created:', event1.title);

    const event2 = await client.create({
      _type: 'event',
      title: 'اليوم المفتوح للتوعية الصحية',
      slug: { _type: 'slug', current: 'health-awareness-day' },
      description: 'يوم توعوي صحي مجاني للمجتمع المحلي.',
      type: 'charity',
      status: 'upcoming',
      featured: false,
      startDate: '2025-03-15T09:00:00Z',
      endDate: '2025-03-15T17:00:00Z',
      location: 'صنعاء - قاعة المؤسسة',
      capacity: 500,
      registeredCount: 120,
    });
    console.log('   ✅ Event created:', event2.title);

    // =============================================
    // 9. آراء المستفيدين
    // =============================================
    console.log('\n💬 Creating testimonials...');
    
    const testimonials = [
      { name: 'أم محمد', role: 'مستفيدة من برنامج الإغاثة', quote: 'جزى الله القائمين على هذه المؤسسة كل خير، لقد كانوا سنداً لنا في أصعب الظروف.', rating: 5, status: 'published' },
      { name: 'سامي عبدالله', role: 'متطوع', quote: 'التطوع مع رحماء بينهم تجربة رائعة، أشعر أنني أساهم في تغيير حقيقي.', rating: 5, status: 'published' },
      { name: 'خالد حسن', role: 'مستفيد من برنامج التدريب', quote: 'بفضل التدريب المهني الذي حصلت عليه، تمكنت من فتح مشروعي الخاص.', rating: 4, status: 'published' },
    ];

    for (const t of testimonials) {
      const testimonial = await client.create({
        _type: 'testimonial',
        name: t.name,
        role: t.role,
        quote: t.quote,
        rating: t.rating,
        status: t.status,
      });
      console.log('   ✅ Testimonial created:', testimonial.name);
    }

    // =============================================
    // 10. لوحة التحكم - المقاييس
    // =============================================
    console.log('\n📊 Creating dashboard metrics...');
    
    const dashboard = await client.create({
      _type: 'dashboard',
      title: 'لوحة التحكم',
      metrics: [
        { title: 'إجمالي المستفيدين', value: '12,847', icon: 'users' },
        { title: 'المشاريع المنجزة', value: '24', icon: 'check' },
        { title: 'الشركاء الاستراتيجيون', value: '48', icon: 'handshake' },
        { title: 'المتطوعون النشطون', value: '350', icon: 'volunteer' },
      ],
    });
    console.log('   ✅ Dashboard created:', dashboard._id);

    console.log('\n' + '='.repeat(50));
    console.log('✅✅✅ Seeding completed successfully! ✅✅✅');
    console.log('='.repeat(50));
    console.log('\n📊 Summary:');
    console.log('   - Site Settings: 1');
    console.log('   - Projects: 5');
    console.log('   - News: 3');
    console.log('   - Success Stories: 2');
    console.log('   - Partners: 5');
    console.log('   - Videos: 2');
    console.log('   - FAQs: 6');
    console.log('   - Events: 2');
    console.log('   - Testimonials: 3');
    console.log('   - Dashboard: 1');
    console.log('\n🔗 You can now view your content in Sanity Studio at /admin/studio');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();

