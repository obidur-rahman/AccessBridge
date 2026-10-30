import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/login/actions";
import { getReviewer } from "@/lib/auth";
import { urgentCorrections, type FeatureKey } from "@/lib/access-features";
import { listReviewQueue } from "@/lib/data/reports";
import { getPlace } from "@/lib/data/places";
import { formatDate, t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";
import type { FeatureState } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    title: `${t(lang, "review.title")} — ${t(lang, "app.name")}`,
    robots: { index: false },
  };
}

export default async function ReviewQueuePage() {
  const [lang, reviewer] = await Promise.all([getLang(), getReviewer()]);

  if (!reviewer) redirect("/login");

  const queue = await listReviewQueue(reviewer);

  // Flag corrections that remove a facility the public page shows today.
  const rows = !queue.ok
    ? []
    : await Promise.all(
        queue.items.map(async (item) => {
          if (!item.listing_id) return { item, urgent: [] as FeatureKey[] };
          const place = await getPlace(item.listing_id);
          if (!place.ok || !place.place) return { item, urgent: [] as FeatureKey[] };
          const current: Partial<Record<string, FeatureState>> = {};
          for (const feature of place.place.features) {
            current[feature.feature_key] = feature.state;
          }
          return { item, urgent: urgentCorrections(current, item.feature_states) };
        }),
      );

  return (
    <div>
      <header className="sheet pb-4 pt-3 sm:pt-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[clamp(1.9rem,4.4vw,2.7rem)]">{t(lang, "review.title")}</h1>
            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-soft">
              {t(lang, "review.intro")}
            </p>
          </div>
          <form action={signOutAction}>
            <button type="submit" className="btn btn-secondary min-h-9 px-3 text-sm">
              {t(lang, "nav.signOut")}
            </button>
          </form>
        </div>
      </header>

      <div className="sheet pb-10">
        {reviewer.demo ? (
          <div className="mb-4 flex flex-wrap items-center gap-2 border-y border-signal/25 bg-signal-soft px-3 py-2.5 text-xs leading-relaxed text-signal">
            <span className="pill shrink-0 bg-signal-soft text-signal">
              {t(lang, "common.demoLabel")}
            </span>
            <span className="min-w-0">{t(lang, "review.demoNotice")}</span>
          </div>
        ) : null}

        {!queue.ok ? (
          <div role="alert" className="card border-no/30 bg-no-soft p-5">
            <p className="text-base font-bold text-no">{t(lang, "common.errorTitle")}</p>
            <p className="mt-1 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
          </div>
        ) : queue.items.length === 0 ? (
          <div className="card px-5 py-8 text-center">
            <p className="text-sm text-ink-faint">{t(lang, "review.empty")}</p>
            {reviewer.demo ? (
              <p className="mx-auto mt-2 max-w-[54ch] text-xs leading-relaxed text-ink-faint">
                {t(lang, "review.demoEmptyHint")}
              </p>
            ) : null}
          </div>
        ) : (
          <section aria-label={t(lang, "review.title")}>
            <div className="flex items-center justify-between gap-3">
              <p className="tag tabular text-ink-faint">
                {queue.items.length === 1
                  ? t(lang, "review.pendingCountOne")
                  : t(lang, "review.pendingCount", { count: queue.items.length })}
              </p>
            </div>

            <ol className="mt-2 grid list-none gap-2.5">
              {rows.map(({ item, urgent }) => (
                <li key={item.id}>
                  <Link href={`/review/${item.id}`} className="card card-hover group block p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="pill bg-signal-soft text-signal">
                            {t(lang, "status.pending")}
                          </span>
                          {item.is_new_place ? (
                            <span className="pill bg-accent-soft text-accent-ink">
                              {t(lang, "review.proposedPlace")}
                            </span>
                          ) : null}
                          {urgent.length > 0 ? (
                            <span className="pill bg-no-soft text-no">{t(lang, "review.urgent")}</span>
                          ) : null}
                        </div>
                        <h2 className="mt-1.5 font-display text-[1.2rem] font-medium leading-snug transition-colors group-hover:text-accent-ink">
                          {item.listing_name ?? t(lang, "review.proposedPlace")}
                        </h2>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          {item.listing_category ? t(lang, `category.${item.listing_category}`) : ""}
                          {item.listing_address ? ` · ${item.listing_address}` : ""}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong text-ink-faint transition-[transform,background-color,color,border-color] duration-200 group-hover:translate-x-0.5 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                          <path
                            d="M7 17 17 7M9 7h8v8"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>

                    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-2.5 text-xs">
                      <div className="flex gap-1.5">
                        <dt className="text-ink-faint">{t(lang, "review.observedAt")}</dt>
                        <dd className="tabular text-ink-soft">{formatDate(item.observed_at, lang)}</dd>
                      </div>
                      <div className="flex gap-1.5">
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
