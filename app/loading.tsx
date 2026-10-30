export default function Loading() {
  return (
    <div aria-busy="true" className="sheet py-8">
      <p className="sr-only">Loading</p>
      <div className="h-2.5 w-24 rounded-full bg-line/70" />
      <div className="mt-3 h-9 w-3/4 max-w-md rounded-lg bg-line/60" />
      <div className="mt-2 h-4 w-1/2 max-w-sm rounded bg-line/40" />
      <div className="card mt-6 h-28 bg-surface-sunk" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card h-40 bg-surface-sunk" />
        <div className="card h-40 bg-surface-sunk" />
        <div className="card h-40 bg-surface-sunk" />
        <div className="card h-40 bg-surface-sunk" />
      </div>
    </div>
  );
}
