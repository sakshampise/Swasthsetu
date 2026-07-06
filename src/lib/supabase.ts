import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Central Supabase client.
 *
 * This project uses real Supabase Authentication and database access only.
 * There is no mock/local authentication fallback here. If the two public
 * environment variables are missing, the app intentionally reports a clear
 * configuration error on auth/database actions.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const missingSupabaseMessage =
  "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local or your hosting provider environment variables.";

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "swasthsetu-auth-session",
      },
    })
  : null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(missingSupabaseMessage);
  }
  return supabase;
}

export const isLive = () => isSupabaseConfigured;

export async function fetchMedicines() {
  const client = getSupabaseClient();
  const { data, error } = await client.from("medicines").select("*").order("centre");
  if (error) throw error;
  return data;
}
