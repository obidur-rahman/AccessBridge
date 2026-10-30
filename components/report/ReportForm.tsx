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

function Step({ title }: { title: string }) {
  return (
    <h2 className="border-b border-line pb-3 text-[1.1rem] leading-snug">{title}</h2>
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
  const receiptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (Object.keys(errors).length > 0) errorRef.current?.focus();
  }, [errors]);

  // The form is taller than the receipt, so bring the result into view and
  // move focus there.
  useEffect(() => {
    if (!receipt) return;
    receiptRef.current?.scrollIntoView({ block: "start" });
    receiptRef.current?.focus({ preventScroll: true });
  }, [receipt]);

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
      <div
        ref={receiptRef}
        tabIndex={-1}
        aria-labelledby="receipt-heading"
        className="soft-in card scroll-mt-20 p-5 outline-none sm:p-6"
      >
        <p className="pill bg-signal-soft text-signal">{t(lang, "status.pending")}</p>
        <h2 id="receipt-heading" className="mt-3 max-w-[24ch] text-[1.6rem]">
          {t(lang, "report.receiptTitle")}
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">
          {t(lang, "report.receiptBody")}
        </p>

        <div className="mt-5 inline-block rounded-[0.625rem] border border-dashed border-line-strong bg-surface-sunk px-4 py-3">
          <p className="tag text-ink-faint">{t(lang, "report.receiptCode")}</p>
          <p className="tabular mt-0.5 text-xl font-medium tracking-[0.18em] text-accent-ink">
            {receipt}
          </p>
        </div>
        <p className="mt-2 text-xs text-ink-faint">{t(lang, "report.receiptKeep")}</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
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
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {Object.keys(errors).length > 0 ? (
        <div
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="card border-no/30 bg-no-soft p-4"
        >
          <p className="text-sm font-bold text-no">{t(lang, "report.errorValidation")}</p>
          {errorEntries.length > 0 ? (
            <ul className="mt-1.5 list-disc pl-5 text-sm text-ink-soft">
              {errorEntries.map(([key]) => (
                <li key={key}>{t(lang, ERROR_KEYS[key] ?? "report.errorGeneric")}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <section className="card p-4 sm:p-5">
        <Step title={t(lang, "report.stepPlaceTitle")} />
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
          <div className="mt-4 grid gap-4 rounded-[0.625rem] bg-surface-sunk p-3.5 sm:grid-cols-2">
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
                <span className="text-ink-faint">({t(lang, "common.optional")})</span>
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

      <section className="card p-4 sm:p-5">
        <Step title={t(lang, "report.featureLegend")} />
        <p id={`${uid}-feature-help`} className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
          {t(lang, "report.featureHelp")}
        </p>

        <fieldset aria-describedby={`${uid}-feature-help`} className="mt-3">
          <legend className="sr-only">{t(lang, "report.featureLegend")}</legend>
          <div className="divide-y divide-line rounded-[0.625rem] border border-line">
            {FEATURE_KEYS.map((key) => (
              <div
                key={key}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-2.5"
              >
                <label htmlFor={`${uid}-${key}`} className="text-sm font-bold text-ink">
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
                  className="field min-h-9 w-full max-w-[11rem] py-1.5 text-sm"
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

      <section className="card p-4 sm:p-5">
        <Step title={t(lang, "report.stepEvidenceTitle")} />
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
              <span className="text-ink-faint">({t(lang, "common.optional")})</span>
            </label>
            <textarea
              id={`${uid}-note`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
              rows={3}
              aria-describedby={`${uid}-note-help`}
              className={`${FIELD} resize-y`}
            />
            <p id={`${uid}-note-help`} className="mt-1.5 text-xs text-ink-faint">
              {t(lang, "report.noteHelp")}
            </p>
          </div>

          <div>
            <label htmlFor={`${uid}-source`} className={FIELD_LABEL}>
              {t(lang, "report.sourceUrl")}{" "}
              <span className="text-ink-faint">({t(lang, "common.optional")})</span>
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

      <section className="card p-4 sm:p-5">
        <Step title={t(lang, "report.contact")} />
        <div className="mt-4">
          {/* The section title already names this field. */}
          <label htmlFor={`${uid}-contact`} className="sr-only">
            {t(lang, "report.contact")} ({t(lang, "common.optional")})
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

      <div className="pt-1">
        <button type="submit" disabled={pending} className="btn btn-primary w-full px-6">
          {pending ? t(lang, "report.submitting") : t(lang, "report.submit")}
        </button>
        <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-faint">
          {t(lang, "report.receiptBody")}
        </p>
      </div>
    </form>
  );
}
