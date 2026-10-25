/**
 * Observation freshness rule (docs/08 §3).
 *
 * An accepted observation keeps its state and date after it ages. It gains a
 * "Needs re-check" label. The state is never downgraded and the row is never
 * removed.
 */

export const FRESHNESS_DAYS = 180;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Whole days between two date-only values, ignoring timezone shifts. */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = Date.parse(`${fromIso.slice(0, 10)}T00:00:00Z`);
  const to = Date.parse(`${toIso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(from) || Number.isNaN(to)) return 0;
  return Math.round((to - from) / MS_PER_DAY);
}

export type ObservationAge = "current" | "needs_recheck";

/**
 * Returns the age label for an accepted observation. A future date is treated
 * as current, not as an error, because device clocks can be wrong.
 */
export function observationAge(
  observedAt: string,
  todayIso: string,
  freshnessDays: number = FRESHNESS_DAYS,
): ObservationAge {
  const age = daysBetween(observedAt, todayIso);
  return age > freshnessDays ? "needs_recheck" : "current";
}
