import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: `${t(lang, "auth.signUpTitle")} — ${t(lang, "app.name")}`,
    robots: { index: false },
  };
}

export default async function SignUpPage() {
  const lang = await getLang();

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-14 sm:px-6 sm:py-20">
      <div className="soft-in overflow-hidden border-y border-line bg-surface px-5 py-7 sm:px-8 sm:py-9">
        <h1 className="text-[clamp(1.8rem,4.5vw,2.5rem)]">{t(lang, "auth.signUpTitle")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t(lang, "auth.signUpIntro")}</p>

        <SignUpForm lang={lang} />

        <p className="mt-7 border-t border-line pt-6 text-sm text-ink-soft">
          {t(lang, "auth.haveAccount")}{" "}
          <Link
            href="/login"
            className="nav-link font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:text-accent"
          >
            {t(lang, "nav.signIn")}
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint">{t(lang, "app.pilot")}</p>
    </div>
  );
}
