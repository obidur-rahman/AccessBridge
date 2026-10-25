import { cookies } from "next/headers";
import { isDemoMode } from "@/lib/demo-mode";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase/server";

/** Demo-only reviewer session. Ignored as soon as Supabase is configured. */
export const DEMO_REVIEWER_COOKIE = "ab_demo_reviewer";

export interface Reviewer {
  id: string;
  role: "reviewer" | "admin";
  demo: boolean;
  email: string | null;
}

/**
 * Resolve the signed-in reviewer from the database, never from a value the
 * browser sent. Returns null for anonymous visitors and for disabled accounts.
 */
export async function getReviewer(): Promise<Reviewer | null> {
  if (isDemoMode()) {
    const store = await cookies();
    if (store.get(DEMO_REVIEWER_COOKIE)?.value !== "1") return null;
    // The demo session acts as an admin so the whole queue is reachable.
    return { id: "demo-reviewer", role: "admin", demo: true, email: null };
  }

  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile || profile.active !== true) return null;
  if (profile.role !== "reviewer" && profile.role !== "admin") return null;

  return {
    id: user.id,
    role: profile.role,
    demo: false,
    email: user.email ?? null,
  };
}
