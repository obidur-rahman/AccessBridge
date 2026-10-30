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
    <div className="sheet max-w-xl py-12 sm:py-16">
      <div role="alert" className="card border-no/30 bg-no-soft p-5 sm:p-6">
        {/* The boundary may render before the language cookie is readable on the
            client, so it states the failure in both interface languages. */}
        {LANGS.map((lang) => (
          <div key={lang} lang={lang} className={lang === "bn" ? "mt-4 border-t border-no/20 pt-4" : ""}>
            <h1 className="text-[clamp(1.5rem,3.6vw,1.9rem)] text-ink">{t(lang, "common.errorTitle")}</h1>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-ink-soft">
              {t(lang, "common.errorBody")}
            </p>
          </div>
        ))}

        {error.digest ? (
          <p className="tabular mt-3 text-xs text-ink-faint">ref {error.digest}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={reset} className="btn btn-primary px-4">
            {t("en", "common.retry")} / {t("bn", "common.retry")}
          </button>
          <Link href="/directory" className="btn btn-secondary px-4">
            {t("en", "common.backHome")} / {t("bn", "common.backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
