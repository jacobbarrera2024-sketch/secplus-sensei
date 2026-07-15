export function Header({
  itemCount,
  feedCount,
  onFetchAll,
  onExportJson,
  onExportCsv,
  loading,
}: {
  itemCount: number;
  feedCount: number;
  onFetchAll: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  loading: boolean;
}) {
  const baseBtn =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <a
          href="https://jacobbarrera2024-sketch.github.io/"
          className="flex items-center gap-3 rounded-lg no-underline hover:opacity-90"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white"
            aria-hidden
          >
            F
          </span>
          <div className="leading-tight">
            <strong className="block text-sm font-bold text-slate-900">FeedCollector</strong>
            <span className="text-xs text-slate-500">Express · React · TypeScript · RSS export</span>
          </div>
        </a>

        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-xs text-slate-500 sm:inline">
            {feedCount} feed{feedCount === 1 ? "" : "s"} · {itemCount} item{itemCount === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            aria-label="Export visible items as JSON"
            onClick={onExportJson}
            className={`${baseBtn} bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 focus:ring-slate-400`}
          >
            Export JSON
          </button>
          <button
            type="button"
            aria-label="Export visible items as CSV"
            onClick={onExportCsv}
            className={`${baseBtn} bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 focus:ring-slate-400`}
          >
            Export CSV
          </button>
          <button
            type="button"
            aria-label="Fetch all saved feeds"
            disabled={loading || feedCount === 0}
            onClick={onFetchAll}
            className={`${baseBtn} bg-blue-600 text-white ring-blue-500 hover:bg-blue-700 focus:ring-blue-500`}
          >
            {loading ? "Fetching…" : "Fetch all"}
          </button>
        </div>
      </div>
    </header>
  );
}
