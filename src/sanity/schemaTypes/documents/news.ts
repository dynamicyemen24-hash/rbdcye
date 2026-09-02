import { defineField, defineType } from "sanity";

export const newsArticle = defineType({
  name: "news",
  title: "الخبر",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "العنوان",
      type: "string",
      validation: (Rule) => Rule.required().max(150),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "المحتوى",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "الملخص",
      type: "text",
      rows: 3,
      description: "ملخص قصير للخبر",
    }),
    defineField({
      name: "author",
      title: "الكاتب",
      type: "string",
      description: "اسم كاتب المقال",
    }),
    defineField({
      name: "category",
      title: "التصنيف",
      type: "string",
      options: {
        list: [
          { title: "إغاثة", value: "إغاثة" },
          { title: "تعليم", value: "تعليم" },
          { title: "تنمية", value: "تنمية" },
          { title: "شراكات", value: "شراكات" },
          { title: "تدريب", value: "تدريب" },
          { title: "عام", value: "عام" },
        ],
      },
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "منشور", value: "PUBLISHED" },
          { title: "مسودة", value: "DRAFT" },
          { title: "مؤرشف", value: "ARCHIVED" },
        ],
      },
      initialValue: "DRAFT",
    }),
    defineField({
      name: "mainImage",
      title: "الصورة الرئيسية",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishDate",
      title: "تاريخ النشر",
      type: "datetime",
    }),
    defineField({
      name: "tags",
      title: "الوسوم",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "featured",
      title: "خبر مميز",
      type: "boolean",
      initialValue: false,
      description: "عرض في الصفحة الرئيسية",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      status: "status",
      media: "mainImage",
    },
    prepare({ title, subtitle, status, media }) {
      return {
        title,
        subtitle: `${subtitle || "بدون تصنيف"} - ${status}`,
        media,
      };
    },
  },
});

