// ============================================================
// integration.service.ts - تكامل بين الصفحات العامة ولوحة التحكم
// ============================================================
import { logger } from "@/utils/monitoring";

import { DB_SCHEMA, supabase } from "./supabase.client";

import type { Subscriber, Donation, Volunteer, ServiceRequest } from "@/shared/types/database";

// ---------- Public ↔ Admin Bridge ----------
class IntegrationService {
  // --- Content Sync ---
  async syncContentToPublic(
    contentType: "posts" | "pages" | "projects" | "news",
    contentId: string
  ) {
    try {
      const tableMap = {
        posts: "posts",
        pages: "pages",
        projects: "projects",
        news: "posts",
      };

      const tableName = tableMap[contentType];
      if (!tableName) return;

      // Invalidate related caches
      this.invalidatePublicCache(contentType);
      this.invalidateAdminCache(tableName);

      logger.info("Content synced to public", { contentType, contentId });
    } catch (error) {
      logger.error("Failed to sync content", error, { contentType, contentId });
    }
  }

  // --- Form Submissions → Admin Dashboard ---

  // تحويل نموذج الاتصال إلى طلب خدمة
  async submitContactForm(form: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    type?: string;
  }) {
    try {
      // 1. حفظ في service_requests
      const { error: requestError } = await supabase
        .schema(DB_SCHEMA)
        .from("service_requests")
        .insert([
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            type: "contact",
            subject: form.subject,
            message: form.message,
            status: "new",
            created_at: new Date().toISOString(),
          },
        ]);

      if (requestError) throw requestError;

      // 2. تحديث/إنشاء subscriber
      await this.upsertSubscriber({
        email: form.email,
        name: form.name,
        phone: form.phone,
        source: "contact",
      });

      // 3. إرسال إشعار للمشرفين (اختياري)
      await this.createNotification({
        title: "رسالة جديدة",
        message: `رسالة من ${form.name}: ${form.subject}`,
        type: "info",
      });

      logger.info("Contact form submitted", { email: form.email });
      return { success: true };
    } catch (error) {
      logger.error("Contact form submission failed", error, { form });
      return { success: false, error };
    }
  }

  // تحويل نموذج التبرع إلى تبرع + طلب خدمة
  async submitDonationForm(form: {
    donor: string;
    email: string;
    phone?: string;
    amount: number;
    project: string;
    method: string;
    type: string;
  }) {
    try {
      // 1. حفظ التبرع
      const { data: donation, error: donationError } = await supabase
        .schema(DB_SCHEMA)
        .from("donations")
        .insert([
          {
            donor_name: form.donor,
            email: form.email,
            phone: form.phone,
            amount: form.amount,
            project: form.project,
            method: form.method,
            type: form.type,
            status: "pending",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (donationError) throw donationError;

      // 2. إنشاء طربقة متابعة
      const { error: requestError } = await supabase
        .schema(DB_SCHEMA)
        .from("service_requests")
        .insert([
          {
            name: form.donor,
            email: form.email,
            phone: form.phone,
            type: "donation",
            subject: `تبرع لمشروع ${form.project}`,
            message: `تبرع ${form.type} بمبلغ ${form.amount} ريال عبر ${form.method}`,
            status: "new",
            related_entity: "donation",
            related_id: donation.id,
            created_at: new Date().toISOString(),
          },
        ]);

      if (requestError) throw requestError;

      // 3. تحديث المشترك
      await this.upsertSubscriber({
        email: form.email,
        name: form.donor,
        phone: form.phone,
        source: "donation",
      });

      // 4. إشعار للمشرف
      await this.createNotification({
        title: "تبرع جديد",
        message: `تبرع جديد من ${form.donor} بمبلغ ${form.amount} ريال`,
        type: "success",
      });

      logger.info("Donation submitted", {
        donationId: donation.id,
        amount: form.amount,
      });

      return { success: true, donationId: donation.id };
    } catch (error) {
      logger.error("Donation submission failed", error, { form });
      return { success: false, error };
    }
  }

  // تحويل نموذج التطوع إلى متطوع + طلب خدمة
  async submitVolunteerForm(form: {
    name: string;
    email: string;
    phone: string;
    field?: string;
    motivation?: string;
  }) {
    try {
      // 1. حفظ المتطوع
      const { data: volunteer, error: volunteerError } = await supabase
        .schema(DB_SCHEMA)
        .from("volunteers")
        .insert([
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            field: form.field,
            motivation: form.motivation,
            status: "pending",
            hours: 0,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (volunteerError) throw volunteerError;

      // 2. إنشاء طلب خدمة
      const { error: requestError } = await supabase
        .schema(DB_SCHEMA)
        .from("service_requests")
        .insert([
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            type: "volunteer",
            subject: `طلب تطوع - ${form.field || "عام"}`,
            message: form.motivation || "طلب تطوع من الموقع",
            status: "new",
            related_entity: "volunteer",
            related_id: volunteer.id,
            created_at: new Date().toISOString(),
          },
        ]);

      if (requestError) throw requestError;

      // 3. تحديث المشترك
      await this.upsertSubscriber({
        email: form.email,
        name: form.name,
        phone: form.phone,
        source: "volunteer",
      });

      // 4. إشعار
      await this.createNotification({
        title: "متطوع جديد",
        message: `طلب تطوع من ${form.name} في مجال ${form.field || "عام"}`,
        type: "info",
      });

      logger.info("Volunteer application submitted", {
        volunteerId: volunteer.id,
      });

      return { success: true, volunteerId: volunteer.id };
    } catch (error) {
      logger.error("Volunteer submission failed", error, { form });
      return { success: false, error };
    }
  }

  // --- Cache Management ---
  invalidatePublicCache(type: string) {
    const publicRoutes = ["posts", "pages", "projects", "news", "events"];
    publicRoutes.forEach((route) => {
      if (type === route || type === "all") {
        localStorage.removeItem(`cache_${route}`);
      }
    });
  }

  invalidateAdminCache(table: string) {
    const adminTables = [
      "posts",
      "pages",
      "projects",
      "donations",
      "volunteers",
      "subscribers",
      "service_requests",
      "success_stories",
      "media_library",
    ];
    adminTables.forEach((t) => {
      if (table === t || table === "all") {
        localStorage.removeItem(t);
      }
    });
  }

  // --- Helper Methods ---
  private async upsertSubscriber(data: {
    email: string;
    name?: string;
    phone?: string;
    source: "contact" | "donation" | "volunteer" | "website";
  }) {
    try {
      // Check if exists
      const { data: existing } = await supabase
        .schema(DB_SCHEMA)
        .from("subscribers")
        .select("id")
        .eq("email", data.email)
        .maybeSingle();

      if (existing) {
        // Update
        await supabase
          .schema(DB_SCHEMA)
          .from("subscribers")
          .update({
            name: data.name,
            phone: data.phone,
            source: data.source,
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("email", data.email);
      } else {
        // Insert
        await supabase
          .schema(DB_SCHEMA)
          .from("subscribers")
          .insert([
            {
              email: data.email,
              name: data.name,
              phone: data.phone,
              source: data.source,
              status: "pending",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
      }
    } catch (error) {
      logger.warn("Subscriber upsert failed", { data, error });
    }
  }

  private async createNotification(notification: {
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "error";
  }) {
    try {
      await supabase
        .schema(DB_SCHEMA)
        .from("admin_notifications")
        .insert([
          {
            ...notification,
            is_read: false,
            created_at: new Date().toISOString(),
          },
        ]);
    } catch (error) {
      logger.warn("Notification creation failed", { notification, error });
    }
  }
}

// تصدير singleton
export const integrationService = new IntegrationService();

// --- Convenience exports ---
export const publicApi = {
  submitContact: (form: Parameters<typeof integrationService.submitContactForm>[0]) =>
    integrationService.submitContactForm(form),
  submitDonation: (form: Parameters<typeof integrationService.submitDonationForm>[0]) =>
    integrationService.submitDonationForm(form),
  submitVolunteer: (form: Parameters<typeof integrationService.submitVolunteerForm>[0]) =>
    integrationService.submitVolunteerForm(form),
};
