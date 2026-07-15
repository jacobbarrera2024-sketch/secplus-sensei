export function LoadingShell() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-8" aria-hidden>
      <div className="h-14 rounded-xl bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-48 rounded-2xl bg-slate-200" />
          <div className="h-40 rounded-2xl bg-slate-200" />
          <div className="h-56 rounded-2xl bg-slate-200" />
        </div>
        <div className="hidden h-[640px] rounded-2xl bg-slate-200 lg:block" />
      </div>
    </div>
  );
}
