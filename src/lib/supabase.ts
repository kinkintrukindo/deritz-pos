import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Agent } from "undici";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

let cached: SupabaseClient | null = null;

// Node's built-in fetch (undici) aborts with "fetch failed" after its default
// 300s headers/body timeout, which large (100MB+) media uploads routinely exceed.
// This dispatcher removes that ceiling for Supabase requests specifically,
// instead of touching the global fetch timeout for the whole process.
//
// Important: this calls the platform's global `fetch`, NOT `fetch` imported from
// the `undici` package. The npm package bundles its own FormData/Blob classes that
// are a different realm from Node's built-in globals, so passing a FormData body
// (as supabase-js does) through the package's fetch fails `instanceof FormData`
// checks and silently serializes the body to the literal string "[object FormData]".
// Using global fetch with just a custom `dispatcher` avoids that mismatch.
const uploadAgent = new Agent({
  headersTimeout: 0,
  bodyTimeout: 0,
  connectTimeout: 0,
});

function fetchWithNoTimeout(input: string | URL | Request, init?: RequestInit) {
  return fetch(input, { ...init, dispatcher: uploadAgent } as RequestInit);
}

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
      global: { fetch: fetchWithNoTimeout },
    });
  }
  return cached;
}

export const MEDIA_BUCKET = "media";
