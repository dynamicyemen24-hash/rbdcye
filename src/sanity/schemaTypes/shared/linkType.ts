import { defineField, defineType } from "sanity";

/**
 * Reusable Link Object Type
 * رابط داخلي أو خارجي مع خيار الفتح في نافذة جديدة
 */
export const linkType = defineType({
  name: "link",
  title: "رابط",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "نص الرابط",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkType",
      title: "نوع الرابط",
      type: "string",
      options: {
        list: [
          { title: "داخلي", value: "internal" },
          { title: "خارجي", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "internalLink",
      title: "الرابط الداخلي",
      type: "string",
      description: "مثال: /about, /programs, /donate",
      hidden: ({ parent }) => (parent as any)?.linkType !== "internal",
    }),
    defineField({
      name: "externalUrl",
      title: "الرابط الخارجي",
      type: "url",
      hidden: ({ parent }) => (parent as any)?.linkType !== "external",
    }),
    defineField({
      name: "openInNewTab",
      title: "فتح في نافذة جديدة",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "internalLink",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "بدون نص",
        subtitle: subtitle ? `→ ${subtitle}` : "🔗 رابط خارجي",
      };
    },
  },
});
