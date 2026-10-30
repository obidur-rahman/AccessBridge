import Link from "next/link";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

export default async function NotFound() {
  const lang = await getLang();

  return (
    <div className="relative overflow-hidden">
      <div className="aurora" aria-hidden="true" />
      <div className="sheet relative max-w-xl py-14 sm:py-20">
        <div className="card p-6">
          <p className="tag text-ink-faint">404</p>
          <h1 className="mt-1 text-[clamp(1.8rem,4.4vw,2.4rem)]">
            {t(lang, "common.notFoundTitle")}
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft sm:text-base">
            {t(lang, "common.notFoundBody")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/directory" className="btn btn-primary px-4">
              {t(lang, "common.backHome")}
            </Link>
            <Link href="/report" className="btn btn-secondary px-4">
              {t(lang, "nav.report")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
