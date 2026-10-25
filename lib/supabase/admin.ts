import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/server";

/**
 * Service-role client. Server only.
 *
 * Used by the report endpoint, because anonymous visitors have no insert policy
 * on the tables. Never import this module from a Client Component, and never
 * expose the key through a NEXT_PUBLIC_ variable.
 */
export function createSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !serviceKey) return null;

  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
