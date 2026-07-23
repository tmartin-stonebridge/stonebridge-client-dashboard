import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client. Returns null when env is not configured, which
// signals the data layer to fall back to seed data (see families.ts).
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role — server only
  if (!url || !key) {
    cached = null;
    return cached;
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
