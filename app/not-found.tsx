import Link from "next/link";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

export default async function NotFound() {
  const lang = await getLang();

  return (
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden px-4 py-20 sm:px-6 sm:py-24">
      <div
        aria-hidden="true"
        className="arch-drift pointer-events-none absolute -right-40 top-0 hidden h-[26rem] w-[26rem] rounded-t-full border border-accent/30 lg:block"
      >
        <div className="absolute inset-10 rounded-t-full border border-accent/20" />
      </div>
      <div className="soft-in relative max-w-2xl">
        <p className="tag text-ink-faint">404</p>
        <h1 className="mt-3 max-w-[20ch] text-[clamp(2rem,5vw,3.2rem)]">
          {t(lang, "common.notFoundTitle")}
        </h1>
        <p className="mt-4 max-w-prose text-[1.0625rem] leading-relaxed text-ink-soft">
          {t(lang, "common.notFoundBody")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary px-5">
            {t(lang, "common.backHome")}
          </Link>
          <Link href="/report" className="btn btn-secondary px-5">
            {t(lang, "nav.report")}
          </Link>
        </div>
      </div>
    </div>
  );
}
