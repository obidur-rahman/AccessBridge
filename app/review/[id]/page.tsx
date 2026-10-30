import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { StateBadge } from "@/components/accessibility/StateBadge";
import { DecisionForm } from "@/components/review/DecisionForm";
import { featureLabel } from "@/lib/access-features";
import { getReviewer } from "@/lib/auth";
import { getReviewItem } from "@/lib/data/reports";
import { formatDate, t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";
import type { FeatureState } from "@/lib/types";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, lang, reviewer] = await Promise.all([params, getLang(), getReviewer()]);

  if (!reviewer) redirect("/login");

  const result = await getReviewItem(id, reviewer);

  if (!result.ok) {
    return (
      <div className="sheet max-w-2xl py-14">
        <div role="alert" className="card border-no/30 bg-no-soft p-5">
          <p className="font-bold text-no">{t(lang, "common.errorTitle")}</p>
          <p className="mt-1 text-sm text-ink-soft">{t(lang, "common.errorBody")}</p>
        </div>
      </div>
    );
  }

  if (!result.item) notFound();

  const item = result.item;
  const decided = item.review_status !== "pending" && item.review_status !== "needs_more_info";
  const statusLabel = t(
    lang,
    `status.${item.review_status}` as "status.accepted" | "status.rejected" | "status.pending" | "status.needs_more_info",
  );
  const statusTone =
    item.review_status === "accepted"
      ? "bg-yes-soft text-yes"
      : item.review_status === "rejected"
        ? "bg-no-soft text-no"
        : "bg-signal-soft text-signal";

  const facts: { label: string; value: string }[] = [
    { label: t(lang, "review.observedAt"), value: formatDate(item.observed_at, lang) },
    { label: t(lang, "review.submitted"), value: formatDate(item.submitted_at, lang) },
    {
      label: t(lang, "review.source"),
      value:
        item.review_status === "accepted"
          ? t(lang, `source.${item.source_type}`)
          : t(lang, "source.community_report_pending"),
    },
    { label: t(lang, "review.status"), value: statusLabel },
  ];

  return (
    <div>
      <header className="sheet pb-4 pt-2 sm:pt-3">
        <Link
          href="/review"
          className="inline-flex min-h-9 items-center gap-1.5 text-sm text-ink-faint transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span>
          {t(lang, "review.backToQueue")}
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className={`pill ${statusTone}`}>{statusLabel}</span>
          {item.is_new_place ? (
            <span className="pill bg-accent-soft text-accent-ink">
              {t(lang, "review.proposedPlace")}
            </span>
          ) : null}
        </div>

        <h1 className="mt-2 max-w-[26ch] text-[clamp(1.8rem,4.2vw,2.5rem)]">
          {item.listing_name ?? t(lang, "review.proposedPlace")}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {item.listing_category ? t(lang, `category.${item.listing_category}`) : ""}
          {item.listing_address ? ` · ${item.listing_address}` : ""}
        </p>
      </header>

      <div className="sheet grid gap-5 pb-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="min-w-0 space-y-5">
          <section>
            <h2 className="text-[1.25rem]">{t(lang, "review.features")}</h2>
            <dl className="card mt-2 divide-y divide-line">
              {Object.entries(item.feature_states).map(([key, state]) => (
                <div
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <dt className="text-sm font-bold">{featureLabel(key, lang)}</dt>
                  <dd>{state ? <StateBadge state={state as FeatureState} lang={lang} /> : null}</dd>
                </div>
              ))}
            </dl>
          </section>

          {item.notes_public ? (
            <section>
              <h2 className="text-[1.15rem]">{t(lang, "review.note")}</h2>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
                {item.notes_public}
              </p>
            </section>
          ) : null}

          {item.source_url ? (
            <section>
              <h2 className="text-[1.15rem]">{t(lang, "review.source")}</h2>
              <a
                href={item.source_url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1 block break-all text-sm text-accent-ink underline decoration-accent/30 underline-offset-4 hover:text-ink"
              >
                {item.source_url}
              </a>
            </section>
          ) : null}

          {item.contact_private ? (
            <section className="card border-signal/40 bg-signal-soft p-4">
              <p className="tag text-signal">{t(lang, "review.contact")}</p>
              <p className="mt-1 text-sm font-bold text-ink">{item.contact_private}</p>
            </section>
          ) : null}
        </div>

        <aside className="space-y-3 lg:sticky lg:top-20 lg:block">
          <dl className="card divide-y divide-line px-4">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="tag text-ink-faint">{fact.label}</dt>
                <dd className="tabular text-right text-xs text-ink-soft">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="decision-heading" className="card p-4">
            <h2 id="decision-heading" className="text-[1.15rem]">
              {t(lang, "review.decision")}
            </h2>

            <div className="mt-3">
              {decided ? (
                <div>
                  <p className="tag text-ink-faint">{t(lang, "review.status")}</p>
                  <p className="mt-1 text-sm font-bold">{statusLabel}</p>
                  {item.review_reason ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                      {item.review_reason}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-ink-faint">{t(lang, "review.decided")}</p>
                </div>
              ) : (
                <DecisionForm reportId={item.id} features={item.feature_states} lang={lang} />
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
