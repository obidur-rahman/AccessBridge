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
    <div className="relative -mt-[5rem] overflow-hidden sm:-mt-[5.5rem]">
      <div className="aurora" aria-hidden="true" />
      <div className="sheet relative max-w-md pb-10 pt-[7rem] sm:pb-14 sm:pt-[7.5rem]">
        <div className="soft-in card p-5 sm:p-6">
          <h1 className="text-[clamp(1.7rem,4vw,2.1rem)]">{t(lang, "auth.signUpTitle")}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t(lang, "auth.signUpIntro")}</p>

          <SignUpForm lang={lang} />

          <p className="mt-5 border-t border-line pt-4 text-sm text-ink-soft">
            {t(lang, "auth.haveAccount")}{" "}
            <Link
              href="/login"
              className="font-bold text-accent-ink underline decoration-accent/30 underline-offset-4 hover:text-accent"
            >
              {t(lang, "nav.signIn")}
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
