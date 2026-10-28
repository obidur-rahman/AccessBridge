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
        <div className="flex items-start gap-4 border-b border-line pb-6 sm:gap-6">
          <Gauge state="not_checked" size={56} idle />
          <div>
            <h1 className="max-w-[20ch] text-[clamp(2.2rem,5vw,3.5rem)]">
              {t(lang, "common.notFoundTitle")}
            </h1>
          </div>
        </div>
        <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-ink-soft">
          {t(lang, "common.notFoundBody")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/directory" className="btn btn-primary px-5">
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
