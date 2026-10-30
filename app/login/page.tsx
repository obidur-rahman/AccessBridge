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
    <div className="relative -mt-[5rem] overflow-hidden sm:-mt-[5.5rem]">
      <div className="aurora" aria-hidden="true" />
      <div className="sheet relative max-w-md pb-10 pt-[7rem] sm:pb-14 sm:pt-[7.5rem]">
        <div className="soft-in card p-5 sm:p-6">
          <h1 className="text-[clamp(1.7rem,4vw,2.1rem)]">{t(lang, "login.title")}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t(lang, "login.intro")}</p>

          {params.error ? (
            <p
              role="alert"
              className="mt-4 rounded-[0.625rem] border border-no/30 bg-no-soft px-3.5 py-2.5 text-sm text-no"
            >
              {t(lang, "login.error")}
            </p>
          ) : null}

          <form action={signInAction} className="mt-5 flex flex-col gap-4">
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
            <div className="mt-5 border-t border-line pt-4">
              <p className="tag text-ink-faint">
                {t(lang, "common.or")} · {t(lang, "common.demoLabel")}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t(lang, "login.demoHelp")}</p>
              <form action={demoSignInAction} className="mt-2.5">
                <button type="submit" className="btn btn-secondary w-full">
                  {t(lang, "login.demo")}
                </button>
              </form>
            </div>
          ) : null}
        </div>


        <p className="mt-3 text-center text-sm text-ink-soft">
          <Link
            href="/signup"
            className="font-bold text-accent-ink underline decoration-accent/30 underline-offset-4 hover:text-accent"
          >
            {t(lang, "auth.signUpTitle")}
          </Link>
        </p>
      </div>
    </div>
  );
}
