export function LoadingShell() {
  return (
    <div
      className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-8 motion-reduce:animate-none"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <p className="sr-only">Loading FeedCollector…</p>
      <div className="h-14 rounded-xl bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <div className="h-80 rounded-2xl bg-slate-200" />
        <div className="space-y-3">
          <div className="h-16 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
