"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { FEATURE_KEYS, SELECTABLE_STATES, featureLabel } from "@/lib/access-features";
import { t, type TranslationKey } from "@/lib/i18n/core";
import { CATEGORIES, type Category, type FeatureState, type Lang } from "@/lib/types";

const FIELD = "field";
const FIELD_LABEL = "tag mb-1.5 block text-ink-soft";

const ERROR_KEYS: Record<string, TranslationKey> = {
  newPlaceName: "report.newPlaceName",
  newPlaceCategory: "report.newPlaceCategory",
  featureStates: "report.atLeastOneFeature",
  observedAt: "report.observedAt",
  sourceUrl: "report.sourceUrl",
};

function Step({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="tabular grid h-7 w-7 shrink-0 place-items-center rounded-control bg-accent-soft text-xs font-medium text-accent-ink"
      >
        {number}
      </span>
      <h2 className="text-[1.15rem] leading-tight">{title}</h2>
    </div>
  );
}

export function ReportForm({
  places,
  lang,
  initialPlaceId,
  today,
}: {
  places: { id: string; label: string }[];
  lang: Lang;
  initialPlaceId?: string;
  /** Date supplied by the server so the default cannot disagree on hydration. */
  today: string;
}) {
  const uid = useId();
  const [placeId, setPlaceId] = useState(
    initialPlaceId && places.some((place) => place.id === initialPlaceId)
      ? initialPlaceId
      : "new",
  );
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceCategory, setNewPlaceCategory] = useState<Category | "">("");
  const [newPlaceAddress, setNewPlaceAddress] = useState("");
  const [observedAt, setObservedAt] = useState(today);
  const [note, setNote] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [contact, setContact] = useState("");
  const [featureStates, setFeatureStates] = useState<Partial<Record<string, FeatureState>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);

  const errorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (Object.keys(errors).length > 0) errorRef.current?.focus();
  }, [errors]);

  const isNewPlace = placeId === "new";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          listingId: placeId,
          newPlaceName,
          newPlaceCategory,
          newPlaceAddress,
          featureStates,
          observedAt,
          note,
          sourceUrl,
          contact,
        }),
      });

      const data = (await response.json()) as {
        receipt?: string;
        errors?: Record<string, string>;
      };

      if (response.ok && data.receipt) {
        setReceipt(data.receipt);
        return;
      }

      setErrors(data.errors ?? { form: "failed" });
    } catch {
      setErrors({ form: "failed" });
    } finally {
      setPending(false);
    }
  }

  if (receipt) {
    return (
      <div className="soft-in border-y border-line bg-surface px-5 py-7 sm:px-8 sm:py-9">
        <p className="pill bg-signal-soft text-partial">
          {t(lang, "status.pending")}
        </p>
        <h2 className="mt-4 max-w-[22ch] text-[clamp(1.6rem,4vw,2.1rem)]">
          {t(lang, "report.receiptTitle")}
        </h2>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-soft">
          {t(lang, "report.receiptBody")}
        </p>

        <div className="mt-8 inline-block border-y border-line bg-canvas px-5 py-4">
          <p className="tag text-ink-faint">{t(lang, "report.receiptCode")}</p>
          <p className="tabular mt-1 text-2xl font-semibold tracking-[0.2em]">{receipt}</p>
        </div>
        <p className="mt-3 text-xs text-ink-faint">{t(lang, "report.receiptKeep")}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setReceipt(null);
              setFeatureStates({});
              setNote("");
              setSourceUrl("");
              setContact("");
            }}
            className="btn btn-primary px-5"
          >
            {t(lang, "report.another")}
          </button>
          <Link href="/directory" className="btn btn-secondary px-5">
            {t(lang, "place.backToSearch")}
          </Link>
        </div>
      </div>
    );
  }

  const errorEntries = Object.entries(errors).filter(([key]) => key !== "form");

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {Object.keys(errors).length > 0 ? (
        <div
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="border-y border-no/25 bg-no-soft px-4 py-4"
        >
          <p className="font-medium text-no">{t(lang, "report.errorValidation")}</p>
          {errorEntries.length > 0 ? (
            <ul className="mt-2 list-inside list-disc text-sm text-ink-soft">
              {errorEntries.map(([key]) => (
                <li key={key}>{t(lang, ERROR_KEYS[key] ?? "report.errorGeneric")}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <section className="border-y border-line bg-surface px-4 py-5 sm:px-6 sm:py-6">
        <Step number="01" title={t(lang, "report.stepPlaceTitle")} />
        <div className="mt-4">
          <label htmlFor={`${uid}-place`} className={FIELD_LABEL}>
            {t(lang, "report.place")}
          </label>
          <select
            id={`${uid}-place`}
            value={placeId}
            onChange={(event) => setPlaceId(event.target.value)}
            className={FIELD}
          >
            <option value="new">{t(lang, "report.newPlaceOption")}</option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.label}
              </option>
            ))}
          </select>
        </div>

        {isNewPlace ? (
          <div className="mt-5 grid gap-4 border-y border-line bg-canvas p-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-new-name`} className={FIELD_LABEL}>
                {t(lang, "report.newPlaceName")}
              </label>
              <input
                id={`${uid}-new-name`}
                value={newPlaceName}
                onChange={(event) => setNewPlaceName(event.target.value)}
                maxLength={120}
                aria-invalid={Boolean(errors.newPlaceName)}
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor={`${uid}-new-category`} className={FIELD_LABEL}>
                {t(lang, "report.newPlaceCategory")}
              </label>
              <select
                id={`${uid}-new-category`}
                value={newPlaceCategory}
                onChange={(event) => setNewPlaceCategory(event.target.value as Category | "")}
                aria-invalid={Boolean(errors.newPlaceCategory)}
                className={FIELD}
              >
                <option value="">{t(lang, "report.chooseCategory")}</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {t(lang, `category.${category}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`${uid}-new-address`} className={FIELD_LABEL}>
                {t(lang, "report.newPlaceAddress")}{" "}
                <span className="normal-case tracking-normal text-ink-faint">
                  ({t(lang, "common.optional")})
                </span>
              </label>
              <input
                id={`${uid}-new-address`}
                value={newPlaceAddress}
                onChange={(event) => setNewPlaceAddress(event.target.value)}
                maxLength={200}
                className={FIELD}
              />
            </div>
          </div>
        ) : null}
      </section>

      <section className="border-y border-line bg-surface px-4 py-5 sm:px-6 sm:py-6">
        <Step number="02" title={t(lang, "report.featureLegend")} />
        <p id={`${uid}-feature-help`} className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
          {t(lang, "report.featureHelp")}
        </p>

        <fieldset aria-describedby={`${uid}-feature-help`} className="mt-4">
          <legend className="sr-only">{t(lang, "report.featureLegend")}</legend>
          <div className="divide-y divide-line border-y border-line">
            {FEATURE_KEYS.map((key) => (
              <div
                key={key}
                className="instrument-row flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <label htmlFor={`${uid}-${key}`} className="text-sm font-medium text-ink">
                  {featureLabel(key, lang)}
                </label>
                <select
                  id={`${uid}-${key}`}
                  value={featureStates[key] ?? ""}
                  onChange={(event) =>
                    setFeatureStates((current) => ({
                      ...current,
                      [key]: (event.target.value || undefined) as FeatureState | undefined,
                    }))
                  }
                  aria-invalid={Boolean(errors.featureStates)}
                  className="field min-h-10 w-full max-w-[13rem] text-sm"
                >
                  <option value="">{t(lang, "report.selectFeatureState")}</option>
                  {SELECTABLE_STATES.map((state) => (
                    <option key={state} value={state}>
                      {t(lang, `state.${state}`)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="border-y border-line bg-surface px-4 py-5 sm:px-6 sm:py-6">
        <Step number="03" title={t(lang, "report.stepEvidenceTitle")} />
        <div className="mt-4 grid gap-5">
          <div>
            <label htmlFor={`${uid}-date`} className={FIELD_LABEL}>
              {t(lang, "report.observedAt")}
            </label>
            <input
              id={`${uid}-date`}
              type="date"
              value={observedAt}
              max={today}
              onChange={(event) => setObservedAt(event.target.value)}
              aria-describedby={`${uid}-date-help`}
              aria-invalid={Boolean(errors.observedAt)}
            className={`${FIELD} max-w-[14rem]`}
            />
            <p id={`${uid}-date-help`} className="mt-1.5 text-xs text-ink-faint">
              {t(lang, "report.observedAtHelp")}
            </p>
          </div>

          <div>
            <label htmlFor={`${uid}-note`} className={FIELD_LABEL}>
              {t(lang, "report.note")}{" "}
              <span className="normal-case tracking-normal text-ink-faint">
                ({t(lang, "common.optional")})
              </span>
            </label>
            <textarea
              id={`${uid}-note`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
              rows={3}
              aria-describedby={`${uid}-note-help`}
              className={FIELD}
            />
            <p id={`${uid}-note-help`} className="mt-1.5 text-xs text-ink-faint">
              {t(lang, "report.noteHelp")}
            </p>
          </div>

          <div>
            <label htmlFor={`${uid}-source`} className={FIELD_LABEL}>
              {t(lang, "report.sourceUrl")}{" "}
              <span className="normal-case tracking-normal text-ink-faint">
                ({t(lang, "common.optional")})
              </span>
            </label>
            <input
              id={`${uid}-source`}
              type="url"
              inputMode="url"
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              aria-describedby={`${uid}-source-help`}
              aria-invalid={Boolean(errors.sourceUrl)}
              maxLength={500}
              className={FIELD}
            />
            <p id={`${uid}-source-help`} className="mt-1.5 text-xs text-ink-faint">
              {t(lang, "report.sourceUrlHelp")}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface px-4 py-5 sm:px-6 sm:py-6">
        <Step number="04" title={t(lang, "report.contact")} />
        <div className="mt-4">
          <label htmlFor={`${uid}-contact`} className={FIELD_LABEL}>
            {t(lang, "report.contact")} <span className="normal-case tracking-normal text-ink-faint">({t(lang, "common.optional")})</span>
          </label>
          <input
            id={`${uid}-contact`}
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            aria-describedby={`${uid}-contact-help`}
            maxLength={200}
            autoComplete="off"
            className={FIELD}
          />
          <p id={`${uid}-contact-help`} className="mt-1.5 text-xs text-ink-faint">
            {t(lang, "report.contactHelp")}
          </p>
        </div>
      </section>

      <div className="pt-2">
        <button type="submit" disabled={pending} className="btn btn-primary w-full px-6">
          {pending ? t(lang, "report.submitting") : t(lang, "report.submit")}
          <span aria-hidden="true" className="travel">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </button>
        <p className="mt-3 max-w-prose text-xs leading-relaxed text-ink-faint">
          {t(lang, "report.receiptBody")}
        </p>
      </div>
    </form>
  );
}
