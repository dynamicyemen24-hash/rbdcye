import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "المشروع",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "العنوان",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "text",
      rows: 4,
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
          { title: "نشط", value: "active" },
          { title: "مكتمل", value: "completed" },
          { title: "قيد الانتظار", value: "pending" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "progress",
      title: "نسبة التقدم",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "budget",
      title: "الميزانية",
      type: "number",
    }),
    defineField({
      name: "beneficiaries",
      title: "عدد المستفيدين",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "location",
      title: "الموقع",
      type: "string",
      description: "المكان الجغرافي للمشروع",
    }),
    defineField({
      name: "mainImage",
      title: "الصورة الرئيسية",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "معرض الصور",
      type: "array",
      of: [{ type: "image" }],
      options: { layout: "grid" },
    }),
    defineField({
      name: "startDate",
      title: "تاريخ البدء",
      type: "date",
    }),
    defineField({
      name: "endDate",
      title: "تاريخ الانتهاء",
      type: "date",
    }),
    defineField({
      name: "featured",
      title: "مشروع مميز",
      type: "boolean",
      initialValue: false,
      description: "عرض المشروع في الصفحة الرئيسية كمشروع مميز",
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
