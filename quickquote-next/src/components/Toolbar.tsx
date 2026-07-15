"use client";

const baseBtn =
  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50";

export function Toolbar({
  onLoadSample,
  onNew,
  onSave,
  onExport,
  onPrint,
}: {
  onLoadSample: () => void;
  onNew: () => void;
  onSave: () => void;
  onExport: () => void;
  onPrint: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur print:hidden">
      <a
        href="https://jacobbarrera2024-sketch.github.io/"
        className="flex items-center gap-3 rounded-lg no-underline hover:opacity-90"
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-lg font-black text-white"
          aria-hidden
        >
          Q
        </span>
        <div className="leading-tight">
          <strong className="block text-sm font-bold text-slate-900">QuickQuote</strong>
          <span className="text-xs text-slate-500">Next.js · React · TypeScript · Tailwind</span>
        </div>
      </a>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onLoadSample}
          className={`${baseBtn} bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 focus:ring-slate-400`}
        >
          Sample
        </button>
        <button
          type="button"
          onClick={onNew}
          className={`${baseBtn} bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 focus:ring-slate-400`}
        >
          New
        </button>
        <button
          type="button"
          onClick={onExport}
          className={`${baseBtn} bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 focus:ring-slate-400`}
        >
          Export JSON
        </button>
        <button
          type="button"
          onClick={onSave}
          title="Save draft (Ctrl+S)"
          className={`${baseBtn} border border-teal-600 bg-white text-teal-700 ring-teal-500 hover:bg-teal-50 focus:ring-teal-500`}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onPrint}
          className={`${baseBtn} bg-teal-600 text-white ring-teal-500 hover:bg-teal-700 focus:ring-teal-500`}
        >
          Print / PDF
        </button>
      </div>
    </header>
  );
}
