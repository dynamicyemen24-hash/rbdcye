// Main services index file
export { dataService } from "./data.service";
export { postgresService } from "./postgres.service";
export { sanityService } from "./sanity.service";
export { notificationService } from "./notification.service";
export { authEnhanced } from "./auth-enhanced.service";

// Re-export supabase client
export { supabase, hasSupabaseConfig, DB_SCHEMA } from "./supabase.client";

// News service
import { DB_SCHEMA, supabase } from "./supabase.client";

export const newsService = {
  async getAll() {
    const { data, error } = await supabase
      .schema(DB_SCHEMA)
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async create(item: any) {
    const { data, error } = await supabase
      .schema(DB_SCHEMA)
      .from("posts")
      .insert([item])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async update(id: string | number, updates: any) {
    const { data, error } = await supabase
      .schema(DB_SCHEMA)
      .from("posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async delete(id: string | number) {
    const { error } = await supabase.schema(DB_SCHEMA).from("posts").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// Payment service
export {
  processDonation,
  openPaymentModal,
  createCheckoutSession,
  usePayment,
} from "./payment.service";
