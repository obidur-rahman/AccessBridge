export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="mx-auto w-full max-w-6xl animate-pulse px-4 py-16 sm:px-6"
    >
      <p className="sr-only">Loading</p>
      <div className="h-2.5 w-28 rounded-control bg-surface-sunk" />
      <div className="mt-6 h-10 w-3/4 max-w-xl rounded-control bg-surface-sunk" />
      <div className="mt-3 h-4 w-1/2 max-w-md rounded bg-surface-sunk" />
      <div className="mt-10 space-y-3">
        <div className="h-24 rounded-card bg-surface-sunk/70" />
        <div className="h-24 rounded-card bg-surface-sunk/70" />
        <div className="h-24 rounded-card bg-surface-sunk/70" />
      </div>
    </div>
  );
}
