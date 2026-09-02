/**
 * Sanity Schema Types for rbdcye Website
 * Headless CMS Integration - Ready for Production
 */

import { defineType, defineField } from "sanity";

// Dashboard Schema (for structure in admin)
export const dashboard = defineType({
  name: "dashboard",
  title: "لوحة التحكم",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "العنوان",
      type: "string",
      initialValue: "لوحة التحكم",
    }),
    defineField({
      name: "metrics",
      title: "المقاييس",
      type: "array",
      of: [
        {
          type: "object",
          name: "metric",
          fields: [
            defineField({
              name: "title",
              title: "العنوان",
              type: "string",
            }),
            defineField({
              name: "value",
              title: "القيمة",
              type: "string",
            }),
            defineField({
              name: "icon",
              title: "الأيقونة",
              type: "string",
            }),
            defineField({
              name: "color",
              title: "اللون",
              type: "string",
            }),
          ],
        },
      ],
    }),
  ],
});

// Project Schema
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
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, ""),
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
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "معرض الصور",
      type: "array",
      of: [{ type: "image" }],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "startDate",
      title: "تاريخ البدء",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      name: "endDate",
      title: "تاريخ الانتهاء",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      name: "team",
      title: "الفريق",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "الاسم",
              type: "string",
            }),
            defineField({
              name: "role",
              title: "الدور",
              type: "string",
            }),
            defineField({
              name: "photo",
              title: "الصورة",
              type: "image",
            }),
          ],
        },
      ],
    }),
    // Marketing Fields - Enhanced for promotional display
    defineField({
      name: "insights",
      title: "الرؤى الترويجية",
      type: "array",
      of: [{ type: "string" }],
      description: "نقاط مختصرة تُظهر فوائد المشروع",
    }),
    defineField({
      name: "achievements",
      title: "الإنجازات البارزة",
      type: "array",
      of: [{ type: "string" }],
      description: "إنجازات المشروع التي تُظهر التأثير",
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
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "عنوان Meta",
          type: "string",
          description: "عنوان SEO للمشروع",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "وصف Meta",
          type: "text",
          rows: 3,
          description: "وصف SEO للمشروع",
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: "ogImage",
          title: "صورة Open Graph",
          type: "image",
          description: "الصورة التي ستظهر عند المشاركة على وسائل التواصل",
        }),
      ],
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
        subtitle: `${subtitle} - ${status}`,
        media,
      };
    },
  },
});

// News Schema
export const news = defineType({
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
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, ""),
      },
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
      options: {
        hotspot: true,
      },
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
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "views",
      title: "عدد المشاهدات",
      type: "number",
      initialValue: 0,
      readOnly: true,
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
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "عنوان Meta",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "وصف Meta",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: "ogImage",
          title: "صورة Open Graph",
          type: "image",
        }),
      ],
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
        subtitle: `${subtitle} - ${status}`,
        media,
      };
    },
  },
});

// Success Story Schema
export const successStory = defineType({
  name: "successStory",
  title: "قصة نجاح",
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
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, ""),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "صاحب القصة",
      type: "string",
    }),
    defineField({
      name: "program",
      title: "البرنامج",
      type: "string",
    }),
    defineField({
      name: "quote",
      title: "اقتباس",
      type: "text",
      rows: 3,
      description: "اقتباس مميز من القصة",
    }),
    defineField({
      name: "content",
      title: "المحتوى",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "الصورة الرئيسية",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "معرض الصور",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "منشور", value: "published" },
          { title: "مسودة", value: "draft" },
        ],
      },
      initialValue: "draft",
    }),
    defineField({
      name: "featured",
      title: "قصة مميزة",
      type: "boolean",
      initialValue: false,
      description: "عرض في الصفحة الرئيسية",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "عنوان Meta",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "وصف Meta",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: "ogImage",
          title: "صورة Open Graph",
          type: "image",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "name",
      status: "status",
      media: "mainImage",
    },
    prepare({ title, subtitle, status, media }) {
      return {
        title,
        subtitle: `${subtitle} - ${status}`,
        media,
      };
    },
  },
});

// Partner Schema
export const partner = defineType({
  name: "partner",
  title: "الشريك",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "اسم الشريك",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "نوع الشراكة",
      type: "string",
      options: {
        list: [
          { title: "حكومي", value: "حكومي" },
          { title: "خاص", value: "خاص" },
          { title: "منظمة غير حكومية", value: "منظمة غير حكومية" },
        ],
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
      name: "logo",
      title: "الشعار",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "website",
      title: "الموقع الإلكتروني",
      type: "url",
    }),
    defineField({
      name: "contactPerson",
      title: "الشخص المسؤول",
      type: "string",
    }),
    defineField({
      name: "contactEmail",
      title: "البريد الإلكتروني",
      type: "email",
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "نشط", value: "active" },
          { title: "غير نشط", value: "inactive" },
        ],
      },
      initialValue: "active",
    }),
  ],
});

// Media Schema - Enhanced for Professional Media Viewer
export const media = defineType({
  name: "media",
  title: "الوسائط",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "العنوان",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "نوع الوسائط",
      type: "string",
      options: {
        list: [
          { title: "🖼️ صورة", value: "image" },
          { title: "🎥 فيديو", value: "video" },
          { title: "📄 وثيقة", value: "document" },
        ],
      },
      initialValue: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "file",
      title: "الملف",
      type: "file",
      options: {
        accept: "image/*,video/*,.pdf,.doc,.docx",
      },
    }),
    defineField({
      name: "imageFile",
      title: "ملف الصورة",
      type: "image",
      options: {
        hotspot: true,
      },
      hidden: ({ document }) => document?.type !== "image",
    }),
    defineField({
      name: "altText",
      title: "النص البديل",
      type: "string",
      description: "نص بديل للصورة للوصولية",
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "text",
      rows: 3,
      description: "وصف تفصيلي للوسائط",
    }),
    defineField({
      name: "category",
      title: "التصنيف",
      type: "string",
      options: {
        list: [
          { title: "إغاثة", value: "relief" },
          { title: "تعليم", value: "education" },
          { title: "تنمية", value: "development" },
          { title: "شراكات", value: "partnership" },
          { title: "تبرعات", value: "donations" },
          { title: "مؤسسة", value: "organization" },
          { title: "أنشطة", value: "activities" },
        ],
      },
    }),
    defineField({
      name: "tags",
      title: "الوسوم",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "وسوم لتنظيم الوسائط",
    }),
    defineField({
      name: "albums",
      title: "الألبومات",
      type: "array",
      of: [{ type: "string" }],
      description: "تنظيم الوسائط في ألبومات",
    }),
    defineField({
      name: "isFeatured",
      title: "مميز",
      type: "boolean",
      initialValue: false,
      description: "عرض في المعرض المميز",
    }),
    defineField({
      name: "isCover",
      title: "صورة غلاف",
      type: "boolean",
      initialValue: false,
      description: "استخدام كصورة غلاف افتراضية",
    }),
    defineField({
      name: "order",
      title: "الترتيب",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "status",
      title: "حالة النشر",
      type: "string",
      options: {
        list: [
          { title: "منشور", value: "published" },
          { title: "مسودة", value: "draft" },
          { title: "مؤرشف", value: "archived" },
        ],
      },
      initialValue: "draft",
    }),
    defineField({
      name: "publishDate",
      title: "تاريخ النشر",
      type: "datetime",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "عنوان Meta",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "وصف Meta",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      type: "type",
      media: "imageFile",
      status: "status",
    },
    prepare({ title, type, media, status }) {
      const typeLabels = {
        image: "🖼️ صورة",
        video: "🎥 فيديو",
        document: "📄 وثيقة",
      };
      return {
        title,
        subtitle: `${typeLabels[type as keyof typeof typeLabels] || "📎 ملف"} - ${status}`,
        media,
      };
    },
  },
});

// Report Schema
export const report = defineType({
  name: "report",
  title: "التقرير",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "العنوان",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "النوع",
      type: "string",
      options: {
        list: [
          { title: "سنوي", value: "سنوي" },
          { title: "مشروع", value: "مشروع" },
          { title: "مالي", value: "مالي" },
        ],
      },
    }),
    defineField({
      name: "file",
      title: "الملف",
      type: "file",
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "منشور", value: "published" },
          { title: "مسودة", value: "draft" },
        ],
      },
      initialValue: "draft",
    }),
    defineField({
      name: "date",
      title: "التاريخ",
      type: "date",
    }),
  ],
});

// Contact Request Schema
export const contactRequest = defineType({
  name: "contactRequest",
  title: "طلب تواصل",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "الاسم",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "البريد الإلكتروني",
      type: "email",
    }),
    defineField({
      name: "phone",
      title: "رقم الهاتف",
      type: "string",
    }),
    defineField({
      name: "type",
      title: "النوع",
      type: "string",
      options: {
        list: [
          { title: "استفسار", value: "inquiry" },
          { title: "تبرع", value: "donation" },
          { title: "تطوع", value: "volunteer" },
          { title: "شراكة", value: "partnership" },
        ],
      },
    }),
    defineField({
      name: "subject",
      title: "الموضوع",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "الرسالة",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "جديد", value: "new" },
          { title: "مقروء", value: "read" },
          { title: "تم الرد", value: "replied" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "date",
      title: "التاريخ",
      type: "datetime",
    }),
  ],
});

// Volunteer Schema
export const volunteer = defineType({
  name: "volunteer",
  title: "المتطوع",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "الاسم",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "البريد الإلكتروني",
      type: "email",
    }),
    defineField({
      name: "phone",
      title: "رقم الهاتف",
      type: "string",
    }),
    defineField({
      name: "field",
      title: "المجال",
      type: "string",
      options: {
        list: [
          { title: "إغاثة", value: "إغاثة" },
          { title: "تعليم", value: "تعليم" },
          { title: "صحة", value: "صحة" },
          { title: "إدارة", value: "إدارة" },
          { title: "تسويق", value: "تسويق" },
        ],
      },
    }),
    defineField({
      name: "motivation",
      title: "الدافع",
      type: "text",
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "نشط", value: "active" },
          { title: "غير نشط", value: "inactive" },
        ],
      },
      initialValue: "inactive",
    }),
    defineField({
      name: "hours",
      title: "ساعات التطوع",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "date",
      title: "التاريخ",
      type: "datetime",
    }),
  ],
});

// User Schema
export const user = defineType({
  name: "user",
  title: "المستخدم",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "الاسم",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "البريد الإلكتروني",
      type: "email",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "الدور",
      type: "string",
      options: {
        list: [
          { title: "مدير النظام", value: "ADMIN" },
          { title: "مدير محتوى", value: "MANAGER" },
          { title: "محرر", value: "EDITOR" },
          { title: "مشاهد", value: "VIEWER" },
        ],
      },
      initialValue: "VIEWER",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "الصورة الشخصية",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "phone",
      title: "رقم الهاتف",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "نبذة",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "نشط", value: "active" },
          { title: "غير نشط", value: "inactive" },
        ],
      },
      initialValue: "active",
    }),
    defineField({
      name: "permissions",
      title: "الصلاحيات",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "إدارة المستخدمين", value: "manage_users" },
          { title: "إدارة المحتوى", value: "manage_content" },
          { title: "نشر المحتوى", value: "publish_content" },
          { title: "عرض التقارير", value: "view_reports" },
          { title: "إدارة المشاريع", value: "manage_projects" },
        ],
        layout: "tags",
      },
    }),
    defineField({
      name: "lastLogin",
      title: "آخر دخول",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "createdAt",
      title: "تاريخ الإنشاء",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      media: "avatar",
    },
  },
});

// Donation Schema
export const donation = defineType({
  name: "donation",
  title: "التبرع",
  type: "document",
  fields: [
    defineField({
      name: "donor",
      title: "المتبرع",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "البريد الإلكتروني",
      type: "email",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "رقم الهاتف",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amount",
      title: "المبلغ",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "currency",
      title: "العملة",
      type: "string",
      initialValue: "YER",
      options: {
        list: [
          { title: "ريال يمني", value: "YER" },
          { title: "دولار أمريكي", value: "USD" },
          { title: "يورو", value: "EUR" },
        ],
      },
    }),
    defineField({
      name: "project",
      title: "المشروع",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "method",
      title: "طريقة الدفع",
      type: "string",
      options: {
        list: [
          { title: "بطاقة ائتمال", value: "card" },
          { title: "تحويل بنكي", value: "bank" },
          { title: "نقدي", value: "cash" },
          { title: "أونلاين", value: "online" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "نوع التبرع",
      type: "string",
      options: {
        list: [
          { title: "مرة واحدة", value: "once" },
          { title: "شهري", value: "monthly" },
          { title: "سنوي", value: "yearly" },
        ],
      },
      initialValue: "once",
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "معلق", value: "pending" },
          { title: "مكتمل", value: "completed" },
          { title: "فاشل", value: "failed" },
          { title: "مسترجع", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "date",
      title: "التاريخ",
      type: "datetime",
    }),
    defineField({
      name: "notes",
      title: "ملاحظات",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "anonymous",
      title: "متبرع مجهول",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "donor",
      subtitle: "amount",
      status: "status",
    },
  },
});

// Subscriber Schema
export const subscriber = defineType({
  name: "subscriber",
  title: "المشترك",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "الاسم",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "البريد الإلكتروني",
      type: "email",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "رقم الهاتف",
      type: "string",
    }),
    defineField({
      name: "interests",
      title: "الاهتمامات",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "أخبار", value: "news" },
          { title: "تبرعات", value: "donations" },
          { title: "تطوع", value: "volunteering" },
          { title: "فعاليات", value: "events" },
        ],
        layout: "tags",
      },
    }),
    defineField({
      name: "source",
      title: "المصدر",
      type: "string",
      options: {
        list: [
          { title: "تواصل", value: "contact" },
          { title: "تبرع", value: "donation" },
          { title: "تطوع", value: "volunteer" },
          { title: "موقع", value: "website" },
          { title: "وسائل التواصل", value: "social" },
        ],
      },
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "قيد المراجعة", value: "pending" },
          { title: "نشط", value: "active" },
          { title: "مشترك مؤكد", value: "confirmed" },
          { title: "مشترك ملغى", value: "unsubscribed" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "confirmedAt",
      title: "تاريخ التأكيد",
      type: "datetime",
    }),
    defineField({
      name: "createdAt",
      title: "تاريخ التسجيل",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "آخر تحديث",
      type: "datetime",
    }),
  ],
});

// Video Schema
export const video = defineType({
  name: "video",
  title: "فيديو",
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
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, ""),
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
      name: "thumbnail",
      title: "الصورة المصغرة",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "videoFile",
      title: "ملف الفيديو المحلي",
      type: "file",
      options: {
        accept: "video/*",
      },
    }),
    defineField({
      name: "videoUrl",
      title: "رابط الفيديو الخارجي (يوتيوب/vimeo)",
      type: "url",
      description: "استخدم هذا الرابط إذا كان الفيديو مستضافاً على منصة خارجية",
    }),
    defineField({
      name: "duration",
      title: "المدة",
      type: "string",
      description: "مثال: 10:30",
    }),
    defineField({
      name: "category",
      title: "التصنيف",
      type: "string",
      options: {
        list: [
          { title: "تعريفي", value: "تعريفي" },
          { title: "مشاريع", value: "مشاريع" },
          { title: "قصص نجاح", value: "قصص نجاح" },
          { title: "تطوع", value: "تطوع" },
          { title: "تعليم", value: "تعليم" },
          { title: "إغاثة", value: "إغاثة" },
          { title: "عام", value: "عام" },
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "مميز",
      type: "boolean",
      initialValue: false,
      description: "عرض في صفحة الفيديوهات الرئيسية",
    }),
    defineField({
      name: "isStoryVideo",
      title: "فيديو قصة المؤسسة",
      type: "boolean",
      initialValue: false,
      description: "فيديو قصة نجاح المؤسسة الرئيسي",
    }),
    defineField({
      name: "tags",
      title: "الوسوم",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "publishDate",
      title: "تاريخ النشر",
      type: "datetime",
    }),
    defineField({
      name: "views",
      title: "عدد المشاهدات",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "likes",
      title: "عدد الإعجابات",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "chapters",
      title: "فصول الفيديو",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "time",
              title: "الوقت (بالثواني)",
              type: "number",
            }),
            defineField({
              name: "title",
              title: "عنوان الفصل",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "عنوان Meta",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "وصف Meta",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      status: "isFeatured",
      media: "thumbnail",
    },
    prepare({ title, subtitle, status, media }) {
      return {
        title,
        subtitle: `${subtitle} ${status ? "⭐" : ""}`,
        media,
      };
    },
  },
});

// Site Settings Schema
export const siteSettings = defineType({
  name: "siteSettings",
  title: "إعدادات الموقع",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "اسم المؤسسة",
      type: "string",
      initialValue: "رحماء بينهم",
      description: "الاسم الرسمي للمؤسسة",
    }),
    defineField({
      name: "tagline",
      title: "الشعار المختصر",
      type: "string",
      description: "شعار قصير يصف المؤسسة",
    }),
    defineField({
      name: "description",
      title: "وصف المؤسسة",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "logo",
      title: "الشعار",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "favicon",
      title: "أيقونة الموقع",
      type: "image",
      options: {
        accept: "image/svg+xml,image/png",
      },
    }),
    defineField({
      name: "socialLinks",
      title: "روابط وسائل التواصل",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "المنصة",
              type: "string",
              options: {
                list: [
                  { title: "فيسبوك", value: "facebook" },
                  { title: "تويتر/X", value: "twitter" },
                  { title: "إنستغرام", value: "instagram" },
                  { title: "يوتيوب", value: "youtube" },
                  { title: "تيك توك", value: "tiktok" },
                  { title: "لينكد إن", value: "linkedin" },
                  { title: "واتساب", value: "whatsapp" },
                  { title: "تيليجرام", value: "telegram" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "الرابط",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      description: "روابط جميع منصات التواصل الاجتماعي",
    }),
    defineField({
      name: "youtubeChannelUrl",
      title: "رابط قناة اليوتيوب الرئيسية",
      type: "url",
      description: "الرابط الأساسي لقناة اليوتيوب",
    }),
    defineField({
      name: "contactInfo",
      title: "معلومات التواصل",
      type: "object",
      fields: [
        defineField({
          name: "phone",
          title: "رقم الهاتف الرئيسي",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "phoneSecondary",
          title: "رقم هاتف إضافي",
          type: "string",
        }),
        defineField({
          name: "whatsapp",
          title: "واتساب",
          type: "string",
          description: "رقم واتساب للتبرع (مع رمز الدولة)",
        }),
        defineField({
          name: "email",
          title: "البريد الإلكتروني الرئيسي",
          type: "email",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "emailInfo",
          title: "بريد المعلومات العام",
          type: "email",
        }),
        defineField({
          name: "address",
          title: "العنوان",
          type: "string",
        }),
        defineField({
          name: "workingHours",
          title: "ساعات العمل",
          type: "string",
        }),
        defineField({
          name: "mapUrl",
          title: "رابط الخريطة",
          type: "url",
          description: "رابط Google Maps للموقع",
        }),
      ],
    }),
    defineField({
      name: "heroVideo",
      title: "فيديو الخلفية الرئيسي (Hero)",
      type: "file",
      options: {
        accept: "video/*",
      },
      description: "ملف الفيديو المحلي للخلفية الرئيسية في الصفحة الرئيسية",
    }),
    defineField({
      name: "heroVideoUrl",
      title: "رابط فيديو الهيرو الخارجي (بديل)",
      type: "url",
      description: "رابط فيديو خارجي كبديل للفيديو المحلي - يستخدم عندما لا يتوفر ملف محلي",
    }),
    defineField({
      name: "heroPoster",
      title: "صورة الخلفية البديلة (Poster)",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "صورة تظهر قبل تحميل الفيديو وكخلفية احتياطية عند فشل التحميل",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroVideoMuted",
      title: "كتم صوت الفيديو افتراضياً",
      type: "boolean",
      initialValue: true,
      description: "إذا كان نشطاً، سيبدأ الفيديو بدون صوت (يوصى به للخلفيات)",
    }),
    defineField({
      name: "heroVideoLoop",
      title: "تكرار الفيديو",
      type: "boolean",
      initialValue: true,
      description: "تكرار تشغيل الفيديو تلقائياً",
    }),
    defineField({
      name: "seo",
      title: "إعدادات SEO العامة",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "عنوان الموقع العام",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "وصف الموقع العام",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: "ogImage",
          title: "صورة المشاركة الافتراضية",
          type: "image",
        }),
        defineField({
          name: "keywords",
          title: "الكلمات المفتاحية",
          type: "array",
          of: [{ type: "string" }],
        }),
      ],
    }),
  ],
});

// Event Schema
export const event = defineType({
  name: "event",
  title: "فعالية",
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
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, ""),
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
      name: "content",
      title: "التفاصيل",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "mainImage",
      title: "الصورة الرئيسية",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "نوع الفعالية",
      type: "string",
      options: {
        list: [
          { title: "حملة", value: "campaign" },
          { title: "فعالية خيرية", value: "charity" },
          { title: "تدريب", value: "training" },
          { title: "مؤتمر", value: "conference" },
          { title: "معرض", value: "exhibition" },
          { title: "عام", value: "general" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "تاريخ البدء",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "تاريخ الانتهاء",
      type: "datetime",
    }),
    defineField({
      name: "location",
      title: "الموقع",
      type: "string",
    }),
    defineField({
      name: "registrationUrl",
      title: "رابط التسجيل",
      type: "url",
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "قادمة", value: "upcoming" },
          { title: "جارية", value: "ongoing" },
          { title: "منتهية", value: "completed" },
          { title: "ملغاة", value: "cancelled" },
        ],
      },
      initialValue: "upcoming",
    }),
    defineField({
      name: "featured",
      title: "فعالية مميزة",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "capacity",
      title: "السعة",
      type: "number",
      description: "العدد الأقصى للمشاركين",
    }),
    defineField({
      name: "registeredCount",
      title: "عدد المسجلين",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "عنوان Meta",
          type: "string",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "وصف Meta",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "type",
      status: "status",
      media: "mainImage",
    },
    prepare({ title, subtitle, status, media }) {
      return {
        title,
        subtitle: `${subtitle} - ${status}`,
        media,
      };
    },
  },
});

// Testimonial Schema
export const testimonial = defineType({
  name: "testimonial",
  title: "شهادة",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "الاسم",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "الصفة",
      type: "string",
      description: "المسمى الوظيفي أو الصلة بالمؤسسة",
    }),
    defineField({
      name: "quote",
      title: "الشهادة",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "الصورة الشخصية",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "project",
      title: "المشروع المرتبط",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "rating",
      title: "التقييم",
      type: "number",
      options: {
        list: [
          { title: "⭐ 1", value: 1 },
          { title: "⭐⭐ 2", value: 2 },
          { title: "⭐⭐⭐ 3", value: 3 },
          { title: "⭐⭐⭐⭐ 4", value: 4 },
          { title: "⭐⭐⭐⭐⭐ 5", value: 5 },
        ],
      },
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: "status",
      title: "الحالة",
      type: "string",
      options: {
        list: [
          { title: "منشور", value: "published" },
          { title: "مسودة", value: "draft" },
        ],
      },
      initialValue: "draft",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "photo",
    },
  },
});

// FAQ Schema
export const faq = defineType({
  name: "faq",
  title: "سؤال شائع",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "السؤال",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "الجواب",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "التصنيف",
      type: "string",
      options: {
        list: [
          { title: "عام", value: "general" },
          { title: "تبرعات", value: "donations" },
          { title: "تطوع", value: "volunteering" },
          { title: "شراكات", value: "partnerships" },
          { title: "برامج", value: "programs" },
        ],
      },
    }),
    defineField({
      name: "order",
      title: "الترتيب",
      type: "number",
      initialValue: 0,
      description: "لترتيب الأسئلة في العرض",
    }),
    defineField({
      name: "helpful",
      title: "مفيد",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "category",
    },
  },
});

// Export all schema types
export const schemaTypes = [
  dashboard,
  siteSettings,
  project,
  news,
  successStory,
  partner,
  media,
  report,
  contactRequest,
  volunteer,
  user,
  donation,
  subscriber,
  video,
  event,
  testimonial,
  faq,
];
