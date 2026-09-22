// Supabase Client Configuration
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that Supabase URL is a real domain (not a placeholder)
const IS_VALID_SUPABASE_URL = supabaseUrl && supabaseUrl.includes("supabase.co");

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey && IS_VALID_SUPABASE_URL);

export const supabase: SupabaseClient | null = hasSupabaseConfig
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- precise: non-null asserted after explicit null check above
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Types
export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          country_code: string;
          country: string | null;
          subject: string | null;
          message: string;
          status: "new" | "read" | "replied" | "archived";
          is_read: boolean;
          replied_at: string | null;
          replied_by: string | null;
          reply_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<MessageRow, "id" | "created_at" | "updated_at">;
        Update: Partial<MessageRow>;
      };
    };
  };
}

type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
