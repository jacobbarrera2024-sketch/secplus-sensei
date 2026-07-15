"use client";

import { useRef } from "react";

const baseBtn =
  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1";

export function Toolbar({
  onLoadSample,
  onNew,
  onSave,
  onImport,
  onExport,
  onPrint,
}: {
  onLoadSample: () => void;
  onNew: () => void;
  onSave: () => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onPrint: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur print:hidden supports-[padding:max(0px)]:pt-[max(0.75rem,env(safe-area-inset-top))]">
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
        <input
          ref={fileRef}
          id="import-json"
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Import JSON document"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          aria-label="Load sample invoice"
          onClick={onLoadSample}
          className={`${baseBtn} bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 focus:ring-slate-400`}
        >
          Sample
        </button>
        <button
          type="button"
          aria-label="Start new document"
          onClick={onNew}
          className={`${baseBtn} bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 focus:ring-slate-400`}
        >
          New
        </button>
        <button
          type="button"
          aria-label="Import JSON document"
          onClick={() => fileRef.current?.click()}
          className={`${baseBtn} bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 focus:ring-slate-400`}
        >
          Import
        </button>
        <button
          type="button"
          aria-label="Export document as JSON"
          onClick={onExport}
          className={`${baseBtn} bg-slate-100 text-slate-700 ring-slate-300 hover:bg-slate-200 focus:ring-slate-400`}
        >
          Export
        </button>
        <button
          type="button"
          aria-label="Save draft to this device"
          title="Save draft (Ctrl+S)"
          onClick={onSave}
          className={`${baseBtn} border border-teal-600 bg-white text-teal-700 ring-teal-500 hover:bg-teal-50 focus:ring-teal-500`}
        >
          Save
        </button>
        <button
          type="button"
          aria-label="Print or save as PDF"
          onClick={onPrint}
          className={`${baseBtn} bg-teal-600 text-white ring-teal-500 hover:bg-teal-700 focus:ring-teal-500`}
        >
          Print / PDF
        </button>
      </div>
    </header>
  );
}
