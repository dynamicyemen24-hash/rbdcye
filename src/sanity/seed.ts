/**
 * Sanity Seed Data - rbdcye Website
 * Creates initial content for the CMS
 *
 * Usage: npx tsx src/sanity/seed.ts
 */

import { createClient } from "@sanity/client";

const projectId = "xd0ohyiz";
const dataset = "production";
const token = process.env.SANITY_AUTH_TOKEN;
if (!token) {
  throw new Error("SANITY_AUTH_TOKEN environment variable is required");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function seed() {
  try {
    const items: string[] = [];

    await client.create({
      _type: "siteSettings",
      siteName: "رحماء بينهم",
      tagline: "أثرٌ يدوم - مستقبلٌ يُبنى",
      description: "حملة رحماء بينهم منظمة إنسانية تنموية رائدة في اليمن.",
      heroVideoUrl: "/videos/hero-background.mp4",
      heroVideoMuted: true,
      heroVideoLoop: true,
      youtubeChannelUrl: "https://www.youtube.com/@RahmaaBenahum",
      socialLinks: [
        { platform: "facebook", url: "https://facebook.com/rbdcye" },
        { platform: "twitter", url: "https://twitter.com/rbdcye" },
        { platform: "instagram", url: "https://instagram.com/rbdcye" },
        { platform: "youtube", url: "https://youtube.com/@RahmaaBenahum" },
        { platform: "whatsapp", url: "https://wa.me/967777888194" },
        { platform: "telegram", url: "https://t.me/rbdcye" },
      ],
      contactInfo: {
        phone: "+967 777 888 195",
        phoneSecondary: "+967 777 888 194",
        whatsapp: "+967777888194",
        email: "info@rbdcye.org",
        emailInfo: "donations@rbdcye.org",
        address: "صنعاء - اليمن",
        workingHours: "السبت - الخميس: 8:00 ص - 4:00 م",
      },
      seo: {
        metaTitle: "حملة رحماء بينهم - إغاثة وتنمية",
        metaDescription: "حملة رحماء بينهم منظمة إنسانية تنموية رائدة في اليمن.",
        keywords: ["رحماء بينهم", "إغاثة", "تنمية", "يمن"],
      },
    });
    items.push("siteSettings");

    const projects = [
      { _type: "project", title: "مشروع الكساء الشتوي ١٤٤٦", slug: { _type: "slug", current: "winter-clothing-1446" }, description: "توزيع كسوة شتوية على الأسر المتضررة.", category: "إغاثة", status: "active", progress: 72, budget: 350000, beneficiaries: 2000, location: "ذمار - عمران - صنعاء", startDate: "2024-10-01", endDate: "2025-02-28" },
      { _type: "project", title: "مشروع إفطار الصائم ١٤٤٦", slug: { _type: "slug", current: "ramadan-iftar-1446" }, description: "إفطار الصائمين في شهر رمضان.", category: "إغاثة", status: "active", progress: 45, budget: 500000, beneficiaries: 15000, location: "جميع المحافظات", startDate: "2025-02-01", endDate: "2025-03-30" },
      { _type: "project", title: "مشروع المياه النظيفة", slug: { _type: "slug", current: "clean-water-project" }, description: "حفر آبار وتوفير مياه نظيفة.", category: "تنمية", status: "active", progress: 30, budget: 750000, beneficiaries: 5000, location: "حجة - الحديدة - تعز", startDate: "2024-09-01", endDate: "2025-08-31" },
      { _type: "project", title: "مشروع التعليم المستدام", slug: { _type: "slug", current: "sustainable-education" }, description: "دعم التعليم في المناطق النائية.", category: "تعليم", status: "active", progress: 60, budget: 400000, beneficiaries: 3500, location: "عدة محافظات", startDate: "2024-08-01", endDate: "2025-07-31" },
      { _type: "project", title: "مشروع التدريب المهني للشباب", slug: { _type: "slug", current: "vocational-training" }, description: "تدريب الشباب على المهارات الحرفية.", category: "تدريب", status: "active", progress: 25, budget: 250000, beneficiaries: 500, location: "صنعاء - عدن - تعز", startDate: "2024-11-01", endDate: "2025-10-31" },
    ];
    await Promise.all(projects.map((p) => client.create(p)));
    items.push("projects(5)");

    const newsItems = [
      { _type: "news", title: "إطلاق مشروع التعليم المستدام", slug: { _type: "slug", current: "sustainable-education-launch" }, excerpt: "أطلقت حملة رحماء بينهم مشروعها السنوي للتعليم المستدام.", content: [{ _type: "block", style: "normal", children: [{ _type: "span", text: "في إطار جهودها المتواصلة لدعم التعليم في اليمن." }] }], category: "تعليم", status: "PUBLISHED", author: "فريق التحرير", views: 1240, featured: true, tags: ["تعليم", "تنمية"], publishDate: "2024-10-18T10:00:00Z" },
      { _type: "news", title: "توزيع ٢٠٠٠ سلة غذائية", slug: { _type: "slug", current: "food-baskets-hajjah" }, excerpt: "وزعت حملة رحماء بينهم ٢٠٠٠ سلة غذائية.", content: [{ _type: "block", style: "normal", children: [{ _type: "span", text: "في حملة الإغاثة الطارئة." }] }], category: "إغاثة", status: "PUBLISHED", author: "فريق التحرير", views: 890, featured: true, tags: ["إغاثة"], publishDate: "2024-09-15T10:00:00Z" },
      { _type: "news", title: "اختتام برنامج التدريب المهني", slug: { _type: "slug", current: "vocational-training-conclusion" }, excerpt: "اختتمت الحملة برنامج التدريب المهني.", content: [{ _type: "block", style: "normal", children: [{ _type: "span", text: "اختتمت الحملة برنامج التدريب المهني." }] }], category: "تدريب", status: "PUBLISHED", author: "فريق التحرير", views: 650, featured: false, tags: ["تدريب"], publishDate: "2024-08-20T10:00:00Z" },
    ];
    await Promise.all(newsItems.map((n) => client.create(n)));
    items.push("news(3)");

    const stories = [
      { _type: "successStory", title: "من اللجوء إلى ريادة الأعمال", slug: { _type: "slug", current: "from-displacement-to-entrepreneurship" }, name: "فاطمة أحمد", program: "تمكين المرأة", quote: "بدأت فاطمة رحلتها مع الحملة.", content: [{ _type: "block", style: "normal", children: [{ _type: "span", text: "بفضل برنامج تمكين المرأة." }] }], status: "published", featured: true },
      { _type: "successStory", title: "عودة الأمل بعد اليأس", slug: { _type: "slug", current: "return-of-hope" }, name: "أحمد محمد", program: "الإغاثة الطارئة", quote: "أعادت لي ولأسرتي الحياة.", content: [{ _type: "block", style: "normal", children: [{ _type: "span", text: "تلقى أحمد وأسرته دعماً شاملاً." }] }], status: "published", featured: true },
    ];
    await Promise.all(stories.map((s) => client.create(s)));
    items.push("stories(2)");

    const partners = [
      { name: "الهيئة الخيرية للإغاثة", type: "منظمة غير حكومية", status: "active", description: "شريك استراتيجي" },
      { name: "وزارة الشؤون الاجتماعية", type: "حكومي", status: "active", description: "الجهة الرسمية" },
      { name: "بنك التضامن الإسلامي", type: "خاص", status: "active", description: "شريك مالي" },
      { name: "مؤسسة العون للتنمية", type: "منظمة غير حكومية", status: "active", description: "شريك تنمية" },
      { name: "شركة الاتصالات اليمنية", type: "خاص", status: "active", description: "شريك تقني" },
    ];
    await Promise.all(partners.map((p) => client.create({ _type: "partner", name: p.name, slug: { _type: "slug", current: p.name.replace(/\s+/g, "-") }, type: p.type, status: p.status, description: p.description })));
    items.push("partners(5)");

    const videos = [
      { _type: "video", title: "الفيديو التعريفي", slug: { _type: "slug", current: "intro-video" }, description: "فيديو تعريفي.", videoUrl: "/videos/hero-background.mp4", duration: "3:45", category: "تعريفي", isFeatured: true, isStoryVideo: true, status: "published", tags: ["تعريفي"], publishDate: "2024-01-01T10:00:00Z", views: 5000, likes: 350 },
      { _type: "video", title: "مشروع الكساء الشتوي", slug: { _type: "slug", current: "winter-clothing-video" }, description: "تقرير مصور.", videoUrl: "/videos/hero-background.mp4", duration: "5:20", category: "مشاريع", isFeatured: true, isStoryVideo: false, status: "published", tags: ["كساء شتوي"], publishDate: "2024-11-01T10:00:00Z", views: 2300, likes: 180 },
    ];
    await Promise.all(videos.map((v) => client.create(v)));
    items.push("videos(2)");

    const faqs = [
      { question: "كيف يمكنني التبرع للحملة؟", answer: "يمكنك التبرع عبر موقعنا.", category: "donations", order: 1 },
      { question: "هل تبرعاتي تصل إلى المستحقين؟", answer: "نعم، تصل تبرعاتكم.", category: "donations", order: 2 },
      { question: "كيف يمكنني التطوع؟", answer: "سجّل في قسم التطوع.", category: "volunteering", order: 3 },
      { question: "ما هي مجالات عمل الحملة؟", answer: "الإغاثة، التعليم، التنمية.", category: "general", order: 4 },
      { question: "هل يمكنني تخصيص تبرعي؟", answer: "نعم، اختر المشروع.", category: "donations", order: 5 },
      { question: "كيف التواصل مع الحملة؟", answer: "info@rbdcye.org", category: "general", order: 6 },
    ];
    await Promise.all(faqs.map((f) => client.create({ _type: "faq", ...f, helpful: true })));
    items.push("faqs(6)");

    const events = [
      { _type: "event", title: "حملة الشتاء الدافئ ١٤٤٦", slug: { _type: "slug", current: "warm-winter-campaign-1446" }, description: "حملة لتوزيع الكسوة الشتوية.", type: "campaign", status: "ongoing", featured: true, startDate: "2024-12-01T08:00:00Z", endDate: "2025-02-28T17:00:00Z", location: "جميع المحافظات", capacity: 10000, registeredCount: 4500 },
      { _type: "event", title: "اليوم المفتوح للتوعية الصحية", slug: { _type: "slug", current: "health-awareness-day" }, description: "يوم توعوي صحي مجاني.", type: "charity", status: "upcoming", featured: false, startDate: "2025-03-15T09:00:00Z", endDate: "2025-03-15T17:00:00Z", location: "صنعاء", capacity: 500, registeredCount: 120 },
    ];
    await Promise.all(events.map((e) => client.create(e)));
    items.push("events(2)");

    const testimonials = [
      { name: "أم محمد", role: "مستفيدة", quote: "جزى الله القائمين.", rating: 5, status: "published" },
      { name: "سامي عبدالله", role: "متطوع", quote: "التطوع تجربة رائعة.", rating: 5, status: "published" },
      { name: "خالد حسن", role: "مستفيد", quote: "تمكنت من فتح مشروعي.", rating: 4, status: "published" },
    ];
    await Promise.all(testimonials.map((t) => client.create({ _type: "testimonial", ...t })));
    items.push("testimonials(3)");

    await client.create({
      _type: "dashboard",
      title: "لوحة التحكم",
      metrics: [
        { title: "إجمالي المستفيدين", value: "12,847", icon: "users" },
        { title: "المشاريع المنجزة", value: "24", icon: "check" },
        { title: "الشركاء الاستراتيجيون", value: "48", icon: "handshake" },
        { title: "المتطوعون النشطون", value: "350", icon: "volunteer" },
      ],
    });
    items.push("dashboard");

    process.exit(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    process.exit(1);
  }
}

seed();
