import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/login/actions";
import { getReviewer } from "@/lib/auth";
import { listReviewQueue } from "@/lib/data/reports";
import { formatDate, t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return { title: `${t(lang, "review.title")} — ${t(lang, "app.name")}` };
}

export default async function ReviewQueuePage() {
  const [lang, reviewer] = await Promise.all([getLang(), getReviewer()]);

  if (!reviewer) redirect("/login");

  const queue = await listReviewQueue(reviewer);

  return (
    <div>
      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_90%_-20%,var(--color-accent-soft)_0%,transparent_65%)]"
        />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-12">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="tag text-ink-faint">{t(lang, "nav.review")}</p>
              <h1 className="mt-2 text-[clamp(1.9rem,4.5vw,2.9rem)]">{t(lang, "review.title")}</h1>
              <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-ink-soft">
                {t(lang, "review.intro")}
              </p>
            </div>
            <form action={signOutAction}>
              <button type="submit" className="btn btn-secondary min-h-10 px-3.5 text-sm">
                {t(lang, "nav.signOut")}
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {reviewer.demo ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-control border border-signal/30 bg-signal-soft px-4 py-2.5 text-sm leading-relaxed text-partial">
            <span className="pill shrink-0 bg-signal text-ink">{t(lang, "common.demoLabel")}</span>
            <span className="min-w-0">{t(lang, "review.demoNotice")}</span>
          </div>
        ) : null}

        {!queue.ok ? (
          <div role="alert" className="card card-pad mt-6 border-no/30 bg-no-soft">
            <p className="text-base font-semibold text-no">{t(lang, "common.errorTitle")}</p>
            <p className="mt-1 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
          </div>
        ) : queue.items.length === 0 ? (
          <p className="mt-10 rounded-card border border-dashed border-line-strong bg-surface px-6 py-12 text-center text-ink-faint">
            {t(lang, "review.empty")}
          </p>
        ) : (
          <section aria-labelledby="queue-heading" className="mt-8">
            <p className="tag tabular text-ink-faint">
              {queue.items.length === 1
                ? t(lang, "review.pendingCountOne")
                : t(lang, "review.pendingCount", { count: queue.items.length })}
            </p>

            <ol className="mt-3 list-none space-y-3">
              {queue.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/review/${item.id}`}
                    className="lift group block rounded-card border border-line bg-surface p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="pill bg-signal-soft text-partial">
                            {t(lang, "status.pending")}
                          </span>
                          {item.is_new_place ? (
                            <span className="pill bg-accent-soft text-accent-ink">
                              {t(lang, "review.proposedPlace")}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-2 text-[1.15rem] font-semibold leading-snug">
                          {item.listing_name ?? t(lang, "review.proposedPlace")}
                        </h3>
                        <p className="mt-1 text-sm text-ink-faint">
                          {item.listing_category ? t(lang, `category.${item.listing_category}`) : ""}
                          {item.listing_address ? ` · ${item.listing_address}` : ""}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink-faint transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                          <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>

                    <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-3 text-xs">
                      <div className="flex gap-2">
                        <dt className="text-ink-faint">{t(lang, "review.observedAt")}</dt>
                        <dd className="tabular text-ink-soft">{formatDate(item.observed_at, lang)}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-ink-faint">{t(lang, "review.submitted")}</dt>
                        <dd className="tabular text-ink-soft">{formatDate(item.submitted_at, lang)}</dd>
                      </div>
                    </dl>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}
