import { createClient } from "@supabase/supabase-js";

/* Live-mode data layer. With NEXT_PUBLIC_USE_MOCK=true (default) the app never
   calls this; set the two env vars + run supabase/schema.sql to go live. */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
export const isLive = () => process.env.NEXT_PUBLIC_USE_MOCK !== "true" && !!supabase;

export async function fetchMedicines() {
  if (!supabase) throw new Error("Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL / ANON_KEY");
  const { data, error } = await supabase.from("medicines").select("*").order("centre");
  if (error) throw error;
  return data;
}
