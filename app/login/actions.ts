"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_REVIEWER_COOKIE } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { createSupabaseServer, isSupabaseConfigured } from "@/lib/supabase/server";

/** Sign in with a staff account. Roles are read from the database, not the form. */
export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password || !isSupabaseConfigured()) {
    redirect("/login?error=1");
  }

  const supabase = await createSupabaseServer();
  if (!supabase) redirect("/login?error=1");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/login?error=1");

  // An auth user without a staff profile can sign in, but cannot review. Sign it
  // out and say why, instead of bouncing back to this page without a message.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, active")
    .eq("user_id", data.user.id)
    .maybeSingle();

  const isStaff =
    profile?.active === true && (profile.role === "reviewer" || profile.role === "admin");

  if (!isStaff) {
    await supabase.auth.signOut();
    redirect("/login?error=no_staff_profile");
  }

  redirect("/review");
}

/**
 * Demo session. Only available while Supabase is not configured, so it can
 * never bypass real authentication in a deployed pilot.
 */
export async function demoSignInAction() {
  if (!isDemoMode()) redirect("/login");

  const store = await cookies();
  store.set(DEMO_REVIEWER_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/review");
}

export async function signOutAction() {
  const store = await cookies();
  store.delete(DEMO_REVIEWER_COOKIE);

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    await supabase?.auth.signOut();
  }

  redirect("/");
}
