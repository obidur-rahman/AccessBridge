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
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <div role="alert" className="card card-pad border-no/30 bg-no-soft">
          <p className="font-semibold text-no">{t(lang, "common.errorTitle")}</p>
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
      ? "bg-accent-soft text-accent-ink"
      : item.review_status === "rejected"
        ? "bg-no-soft text-no"
        : "bg-signal-soft text-partial";

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
      <header className="border-b border-line">
        <div className="w-full px-4 pb-8 pt-7 sm:px-6 sm:pb-10 lg:px-8">
          <Link
            href="/review"
            className="inline-flex items-center gap-1.5 rounded-control py-1 text-sm text-ink-faint transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span>
            {t(lang, "review.backToQueue")}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className={`pill ${statusTone}`}>{statusLabel}</span>
            {item.is_new_place ? (
              <span className="pill bg-accent-soft text-accent-ink">
                {t(lang, "review.proposedPlace")}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 max-w-[26ch] text-[clamp(1.8rem,4.4vw,2.7rem)]">
            {item.listing_name ?? t(lang, "review.proposedPlace")}
          </h1>
          <p className="mt-2 text-sm text-ink-faint">
            {item.listing_category ? t(lang, `category.${item.listing_category}`) : ""}
            {item.listing_address ? ` · ${item.listing_address}` : ""}
          </p>
        </div>
      </header>

      <div className="w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="min-w-0">
            <h2 className="text-[1.25rem]">{t(lang, "review.features")}</h2>
            <dl className="card mt-3 divide-y divide-line overflow-hidden">
              {Object.entries(item.feature_states).map(([key, state]) => (
                <div
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <dt className="text-sm font-medium">{featureLabel(key, lang)}</dt>
                  <dd>{state ? <StateBadge state={state as FeatureState} lang={lang} /> : null}</dd>
                </div>
              ))}
            </dl>

            {item.notes_public ? (
              <div className="mt-7">
                <p className="tag text-ink-faint">{t(lang, "review.note")}</p>
                <p className="mt-2 max-w-prose border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-ink-soft">
                  {item.notes_public}
                </p>
              </div>
            ) : null}

            {item.source_url ? (
              <div className="mt-6">
                <p className="tag text-ink-faint">{t(lang, "review.source")}</p>
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 block break-all text-sm text-accent underline decoration-accent/40 underline-offset-4 hover:text-ink"
                >
                  {item.source_url}
                </a>
              </div>
            ) : null}

            {item.contact_private ? (
              <div className="mt-6 rounded-control border border-line bg-signal-soft px-4 py-3">
                <p className="tag text-ink-faint">{t(lang, "review.contact")}</p>
                <p className="mt-1 text-sm font-medium">{item.contact_private}</p>
              </div>
            ) : null}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <dl className="card divide-y divide-line overflow-hidden px-4">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <dt className="tag text-ink-faint">{fact.label}</dt>
                  <dd className="tabular text-sm text-ink-soft">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <section aria-labelledby="decision-heading" className="card card-pad">
              <h2 id="decision-heading" className="text-base font-semibold">
                {t(lang, "review.decision")}
              </h2>

              <div className="mt-4">
                {decided ? (
                  <div>
                    <p className="tag text-ink-faint">{t(lang, "review.status")}</p>
                    <p className="mt-1 text-base font-medium">{statusLabel}</p>
                    {item.review_reason ? (
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                        {item.review_reason}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs text-ink-faint">{t(lang, "review.decided")}</p>
                  </div>
                ) : (
                  <DecisionForm
                    reportId={item.id}
                    features={item.feature_states}
                    lang={lang}
                  />
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
