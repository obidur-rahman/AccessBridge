/**
 * Demo mode uses the labelled demo records and an in-memory report store.
 *
 * It is on by default, in every environment, so the pilot can be shown from a
 * fresh deployment before the database holds any records. Set
 * NEXT_PUBLIC_DEMO_MODE=0 to read and write Supabase instead. Demo records are
 * never mixed into a database dataset.
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE !== "0";
}
