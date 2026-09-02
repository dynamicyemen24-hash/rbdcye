import { defineField, defineType } from "sanity";

/**
 * Reusable SEO Object Type
 * استخدم هذا الكائن في أي نوع مستند للحصول على خصائص SEO موحدة
 */
export const seoType = defineType({
  name: "seo",
  title: "تحسين محركات البحث (SEO)",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "عنوان Meta",
      type: "string",
      description: "عنوان مخصص لمحركات البحث (يُستخدم العنوان الرئيسي كبديل إذا تُرك فارغاً)",
      validation: (Rule) =>
        Rule.max(60).warning("يُفضل ألا يتجاوز 60 حرفاً لعرض أفضل في نتائج البحث"),
    }),
    defineField({
      name: "metaDescription",
      title: "وصف Meta",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(160).warning("يُفضل ألا يتجاوز 160 حرفاً لعرض أفضل في نتائج البحث"),
    }),
    defineField({
      name: "ogImage",
      title: "صورة المشاركة (Open Graph)",
      type: "image",
      description: "الصورة التي ستظهر عند مشاركة الرابط (مقاس 1200×630 يُوصى به)",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "نص بديل للصورة",
        }),
      ],
    }),
    defineField({
      name: "noIndex",
      title: "منع الفهرسة",
      type: "boolean",
      initialValue: false,
      description: "اختر هذا لمنع محركات البحث من فهرسة هذه الصفحة",
    }),
    defineField({
      name: "canonicalUrl",
      title: "الرابط الأساسي (Canonical)",
      type: "url",
      description: "الرابط الأساسي إذا كان هناك نسخ متعددة لهذه الصفحة",
    }),
  ],
});
