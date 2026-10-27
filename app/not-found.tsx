import Link from "next/link";
import { Gauge } from "@/components/accessibility/Gauge";
import { t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

export default async function NotFound() {
  const lang = await getLang();

  return (
    <div className="relative w-full overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div
        aria-hidden="true"
        className="tick-rail pointer-events-none absolute inset-x-0 top-0 h-2.5 opacity-80"
      />
      <div className="soft-in relative max-w-2xl">
        <div className="flex items-start gap-6">
          <Gauge state="not_checked" size={96} idle />
          <div>
            <p className="tag text-ink-faint">404</p>
            <h1 className="mt-3 max-w-[20ch] text-[clamp(2rem,5vw,3.2rem)]">
              {t(lang, "common.notFoundTitle")}
            </h1>
          </div>
        </div>
        <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-ink-soft">
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
