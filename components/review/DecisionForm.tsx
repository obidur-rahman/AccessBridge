"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { SELECTABLE_STATES, featureLabel } from "@/lib/access-features";
import type { Decision } from "@/lib/data/reports";
import { t } from "@/lib/i18n/core";
import type { FeatureState, Lang } from "@/lib/types";

const OPTIONS: {
  value: Decision;
  labelKey: "review.accept" | "review.reject" | "review.needInfo";
}[] = [
  { value: "accept", labelKey: "review.accept" },
  { value: "reject", labelKey: "review.reject" },
  { value: "need_info", labelKey: "review.needInfo" },
];

export function DecisionForm({
  reportId,
  features,
  lang,
}: {
  reportId: string;
  features: Partial<Record<string, FeatureState>>;
  lang: Lang;
}) {
  const router = useRouter();
  const uid = useId();
  const [decision, setDecision] = useState<Decision>("accept");
  const [reason, setReason] = useState("");
  const [edits, setEdits] = useState<Partial<Record<string, FeatureState>>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const reasonRequired = decision === "reject" || decision === "need_info";
  const editableKeys = Object.keys(features).filter((key) => Boolean(features[key]));

  function changeEdit(key: string, value: string) {
    setEdits((current) => {
      const next = { ...current };
      if (!value) {
        delete next[key];
      } else {
        next[key] = value as FeatureState;
      }
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (reasonRequired && reason.trim().length === 0) {
      setError(t(lang, "review.reasonRequired"));
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: reportId,
          decision,
          reason,
          edits: decision === "accept" ? edits : {},
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(
          data.error === "reason_required"
            ? t(lang, "review.reasonRequired")
            : t(lang, "review.error"),
        );
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError(t(lang, "review.error"));
    } finally {
      setPending(false);
    }
  }

  if (saved) {
    return (
      <p
        role="status"
        className="rounded-control border border-yes/20 bg-yes-soft px-3.5 py-2.5 text-sm text-yes"
      >
        {t(lang, "review.saved")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <fieldset>
        <legend className="sr-only">{t(lang, "review.decision")}</legend>
        <div className="flex flex-col gap-2">
          {OPTIONS.map((option) => {
            const active = decision === option.value;
            return (
              <label
                key={option.value}
                className={`flex min-h-11 cursor-pointer items-center gap-2.5 border px-3 py-2 text-sm transition-[background-color,border-color,transform,box-shadow] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent hover:-translate-y-px hover:shadow-soft ${
                  active
                    ? "border-accent bg-accent-soft text-accent-ink"
                    : "border-line-strong bg-surface text-ink-soft hover:border-ink-faint hover:text-ink"
                }`}
              >
                <input
                  type="radio"
                  name={`${uid}-decision`}
                  value={option.value}
                  checked={active}
                  onChange={() => setDecision(option.value)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                    active ? "border-accent" : "border-line-strong"
                  }`}
                >
                  {active ? <span className="h-2 w-2 rounded-full bg-accent" /> : null}
                </span>
                {t(lang, option.labelKey)}
              </label>
            );
          })}
        </div>
      </fieldset>

      {decision === "accept" && editableKeys.length > 0 ? (
        <div className="rounded-control border border-line bg-surface-muted/70 p-3">
          <p className="text-sm font-medium text-ink">{t(lang, "review.correctionsTitle")}</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-faint">
            {t(lang, "review.correctionsHelp")}
          </p>

          <div className="mt-3 flex flex-col gap-2.5">
            {editableKeys.map((key) => (
              <div key={key} className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor={`${uid}-edit-${key}`} className="text-sm text-ink-soft">
                  {featureLabel(key, lang)}
                </label>
                <select
                  id={`${uid}-edit-${key}`}
                  value={edits[key] ?? ""}
                  onChange={(event) => changeEdit(key, event.target.value)}
                  className="field min-h-10 w-full max-w-[12rem] bg-surface text-sm"
                >
                  <option value="">{t(lang, "review.keepSubmitted")}</option>
                  {SELECTABLE_STATES.map((state) => (
                    <option key={state} value={state}>
                      {t(lang, `state.${state}`)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor={`${uid}-reason`} className="tag mb-1.5 block text-ink-soft">
          {t(lang, "review.reason")}
          {reasonRequired ? (
            <span className="ml-1 text-no" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        <textarea
          id={`${uid}-reason`}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          maxLength={500}
          aria-invalid={Boolean(error)}
          aria-describedby={`${uid}-reason-help`}
          className="field resize-y py-2.5"
        />
        <p id={`${uid}-reason-help`} className="mt-1.5 text-xs leading-relaxed text-ink-faint">
          {t(lang, "review.reasonHelp")}
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-control border border-no/25 bg-no-soft px-3.5 py-2.5 text-sm text-no"
        >
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? t(lang, "report.submitting") : t(lang, "review.save")}
      </button>
    </form>
  );
}
