import { t } from "@/lib/i18n/core";
import type { FeatureState, Lang } from "@/lib/types";

const TONE: Record<FeatureState, { dot: string; pill: string }> = {
  yes: { dot: "bg-yes", pill: "bg-yes-soft text-yes" },
  no: { dot: "bg-no", pill: "bg-no-soft text-no" },
  partial: { dot: "bg-partial", pill: "bg-partial-soft text-partial" },
  not_checked: { dot: "border border-unknown bg-transparent", pill: "bg-unknown-soft text-unknown" },
  not_applicable: { dot: "border border-unknown/60 bg-transparent", pill: "bg-unknown-soft text-unknown" },
};

const LABEL_KEYS = {
  yes: "state.yes",
  no: "state.no",
  partial: "state.partial",
  not_checked: "state.not_checked",
  not_applicable: "state.not_applicable",
} as const;

/**
 * The word is the state. The dot repeats it, so the same result reads for a
 * visitor who cannot tell the colours apart.
 */
export function StateBadge({
  state,
  lang,
  needsRecheck = false,
}: {
  state: FeatureState;
  lang: Lang;
  needsRecheck?: boolean;
}) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5 align-middle">
      <span className={`pill ${TONE[state].pill}`}>
        <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${TONE[state].dot}`} />
        {t(lang, LABEL_KEYS[state])}
      </span>
      {needsRecheck ? (
        <span className="pill bg-signal-soft text-signal">
          {t(lang, "state.needsRecheck")}
        </span>
      ) : null}
    </span>
  );
}
