/**
 * Sanity Studio Custom Structure
 * هيكل منظم مع Singletons للصفحات الرئيسية
 */
import type { StructureResolver } from "sanity/structure";

const SINGLETONS = ["siteSettings", "dashboard"];

function singletonListItem(S: Parameters<StructureResolver>[0], typeName: string, title: string) {
  return S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("المحتوى")
    .items([
      // === Settings (Singletons) ===
      S.listItem()
        .title("إعدادات الموقع")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings").title("إعدادات الموقع")
        ),

      S.listItem().title("لوحة التحكم").child(S.documentTypeList("dashboard")),

      S.divider(),

      // === Main Content Groups ===
      S.listItem()
        .title("المحتوى الرئيسي")
        .child(
          S.list()
            .title("المحتوى الرئيسي")
            .items([
              S.documentTypeListItem("news").title("الأخبار"),
              S.documentTypeListItem("successStory").title("قصص النجاح"),
              S.documentTypeListItem("project").title("المشاريع"),
              S.documentTypeListItem("event").title("الفعاليات"),
            ])
        ),

      S.listItem()
        .title("الوسائط والمحتوى البصري")
        .child(
          S.list()
            .title("الوسائط")
            .items([
              S.documentTypeListItem("media").title("الوسائط"),
              S.documentTypeListItem("video").title("فيديو"),
            ])
        ),

      S.listItem()
        .title("التقارير والشركاء")
        .child(
          S.list()
            .title("التقارير والشركاء")
            .items([
              S.documentTypeListItem("report").title("التقارير"),
              S.documentTypeListItem("partner").title("الشركاء"),
              S.documentTypeListItem("testimonial").title("الشهادات"),
            ])
        ),

      S.divider(),

      // === Interactions ===
      S.listItem()
        .title("التفاعلات")
        .child(
          S.list()
            .title("التفاعلات")
            .items([
              S.documentTypeListItem("contactRequest").title("طلبات التواصل"),
              S.documentTypeListItem("volunteer").title("المتطوعون"),
              S.documentTypeListItem("subscriber").title("المشتركون"),
              S.documentTypeListItem("donation").title("التبرعات"),
            ])
        ),

      S.divider(),

      // === Admin ===
      S.listItem()
        .title("الإدارة")
        .child(
          S.list()
            .title("الإدارة")
            .items([
              S.documentTypeListItem("user").title("المستخدمون"),
              S.documentTypeListItem("faq").title("الأسئلة الشائعة"),
            ])
        ),
    ]);
