import { isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Demo mode uses the labelled demo records and an in-memory report store.
 *
 * It is on when NEXT_PUBLIC_DEMO_MODE is "1", or when Supabase variables are
 * missing. Turn it off after the database migration has been applied and real
 * records exist. Demo records are never mixed into a configured dataset.
 */
export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "1") return true;
  return !isSupabaseConfigured();
}
