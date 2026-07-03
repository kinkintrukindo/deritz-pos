import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

let cached: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the secret (service) key. Bypasses RLS —
 * NEVER import this into a client component. All data access in this app is
 * server-only (server components / server actions), so this is the only client.
 */
export function getSupabase(): SupabaseClient {
  if (!url || !secretKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY."
    );
  }
  if (!cached) {
    cached = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

export const MEDIA_BUCKET = "media";
