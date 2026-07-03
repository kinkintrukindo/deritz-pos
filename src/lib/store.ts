import "server-only";
import { getSupabase } from "@/lib/supabase";

/**
 * Simple JSON key/value store backed by the Supabase `kv_store` table.
 * Replaces the previous local-JSON-file persistence so writes survive on
 * Vercel's read-only serverless filesystem.
 */
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("kv_store")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) throw new Error(`readJson(${key}) failed: ${error.message}`);
  if (!data) return fallback;
  return data.value as T;
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("kv_store")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) throw new Error(`writeJson(${key}) failed: ${error.message}`);
}
