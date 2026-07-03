import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be created on the client side');
  }

  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return supabaseClient;
}
