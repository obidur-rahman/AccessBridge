import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { demoSignInAction, signInAction } from "@/app/login/actions";
import { getReviewer } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo-mode";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: `${t(lang, "login.title")} — ${t(lang, "app.name")}`,
    alternates: { canonical: "/login" },
    robots: { index: false },
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [lang, reviewer, params] = await Promise.all([
    getLang(),
    getReviewer(),
    searchParams,
  ]);

  if (reviewer) redirect("/review");

  const demo = isDemoMode();

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-14 sm:px-6 sm:py-20">
      <div className="soft-in overflow-hidden border-y border-line bg-surface px-5 py-7 sm:px-8 sm:py-9">
        <h1 className="text-[clamp(1.8rem,4.5vw,2.5rem)]">{t(lang, "login.title")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t(lang, "login.intro")}</p>

        {params.error ? (
          <p
            role="alert"
            className="mt-5 rounded-control border border-no/25 bg-no-soft px-3.5 py-2.5 text-sm text-no"
          >
            {t(lang, "login.error")}
          </p>
        ) : null}

        <form action={signInAction} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="tag mb-1.5 block text-ink-soft">
              {t(lang, "login.email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="field"
            />
          </div>

          <div>
            <label htmlFor="password" className="tag mb-1.5 block text-ink-soft">
              {t(lang, "login.password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="field"
            />
          </div>

          <button type="submit" className="btn btn-primary mt-1 w-full">
            {t(lang, "login.submit")}
          </button>
        </form>

        {demo ? (
          <div className="mt-7 border-t border-line pt-6">
            <p className="tag text-ink-faint">
              {t(lang, "common.or")} · {t(lang, "common.demoLabel")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(lang, "login.demoHelp")}</p>
            <form action={demoSignInAction} className="mt-3">
              <button type="submit" className="btn btn-secondary w-full">
                {t(lang, "login.demo")}
              </button>
            </form>
          </div>
        ) : null}
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint">{t(lang, "app.pilot")}</p>

      <p className="mt-4 text-center text-sm text-ink-soft">
        <Link
          href="/signup"
          className="nav-link font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:text-accent"
        >
          {t(lang, "auth.signUpTitle")}
        </Link>
      </p>
    </div>
  );
}
