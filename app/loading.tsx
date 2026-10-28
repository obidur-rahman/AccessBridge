export default function Loading() {
  return (
    <div
      aria-busy="true"
      className="w-full px-4 py-16 sm:px-6 lg:px-8"
    >
      <p className="sr-only">Loading</p>
      <div className="h-2 w-28 bg-surface-sunk" />
      <div className="mt-6 h-10 w-3/4 max-w-xl bg-surface-sunk" />
      <div className="mt-3 h-4 w-1/2 max-w-md bg-surface-sunk" />
      <div className="mt-10 divide-y divide-line border-y border-line">
        <div className="h-24 bg-surface-sunk/70" />
        <div className="h-24 bg-surface-sunk/70" />
        <div className="h-24 bg-surface-sunk/70" />
      </div>
    </div>
  );
}
