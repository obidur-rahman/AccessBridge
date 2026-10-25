import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when the public Supabase environment variables are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/**
 * Supabase client bound to the visitor's cookies.
 *
 * Returns null when Supabase is not configured yet, so the app can fall back to
 * clearly labelled demo data instead of crashing on a missing environment.
 */
export async function createSupabaseServer() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  const store = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            store.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render: cookie writes are handled by
          // middleware or the next request. Safe to ignore.
        }
      },
    },
  });
}
