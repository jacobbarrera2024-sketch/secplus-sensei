import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-sm font-bold text-white">
            LD
          </span>
          <div>
            <p className="text-sm font-bold text-white">LeadDesk</p>
            <p className="text-xs text-slate-400">AI intake + admin dashboard</p>
          </div>
        </Link>
        <Link
          href="/admin"
          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:border-indigo-400 hover:text-white"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
