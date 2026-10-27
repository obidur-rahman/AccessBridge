"use client";

import Link from "next/link";
import { LANGS, t } from "@/lib/i18n/core";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div role="alert" className="card card-pad">
        {/* The boundary may render before the language cookie is readable on the
            client, so it states the failure in both interface languages. */}
        {LANGS.map((lang) => (
          <div key={lang} lang={lang} className={lang === "bn" ? "mt-5 border-t border-line pt-5" : ""}>
            <h1 className="text-[clamp(1.5rem,3.6vw,2rem)]">{t(lang, "common.errorTitle")}</h1>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
              {t(lang, "common.errorBody")}
            </p>
          </div>
        ))}

        {error.digest ? (
          <p className="tabular mt-4 text-xs text-ink-faint">ref {error.digest}</p>
        ) : null}

        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn btn-primary px-5">
            {t("en", "common.retry")} / {t("bn", "common.retry")}
          </button>
          <Link href="/" className="btn btn-secondary px-5">
            {t("en", "common.backHome")} / {t("bn", "common.backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
