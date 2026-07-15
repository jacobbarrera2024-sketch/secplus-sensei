"use client";

import type { LineItem } from "@/lib/types";
import { lineAmount } from "@/lib/calc";
import { formatMoney } from "@/lib/format";

export function LineItems({
  lines,
  currency,
  onChange,
  onRemove,
  onAdd,
}: {
  lines: LineItem[];
  currency: string;
  onChange: (id: string, patch: Partial<LineItem>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  const cell = "rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30";

  return (
    <div className="space-y-3">
      {/* Header row on wider screens */}
      <div className="hidden grid-cols-[1fr_5rem_7rem_6rem_2rem] gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
        <span>Description</span>
        <span>Qty</span>
        <span>Rate</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      {lines.map((line) => (
        <div
          key={line.id}
          className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-2 sm:grid-cols-[1fr_5rem_7rem_6rem_2rem] sm:items-center sm:border-0 sm:p-0"
        >
          <input
            aria-label="Description"
            type="text"
            value={line.desc}
            placeholder="Service or product"
            onChange={(e) => onChange(line.id, { desc: e.target.value })}
            className={`${cell} col-span-2 sm:col-span-1`}
          />
          <input
            aria-label="Quantity"
            type="number"
            min={0}
            step={1}
            value={line.qty}
            onChange={(e) => onChange(line.id, { qty: Number(e.target.value) })}
            className={cell}
          />
          <input
            aria-label="Rate"
            type="number"
            min={0}
            step={0.01}
            value={line.rate}
            onChange={(e) => onChange(line.id, { rate: Number(e.target.value) })}
            className={cell}
          />
          <span className="self-center text-right text-sm font-semibold text-slate-700 sm:col-auto">
            <span className="mr-1 text-xs font-normal text-slate-400 sm:hidden">Amt</span>
            {formatMoney(lineAmount(line), currency)}
          </span>
          <button
            type="button"
            aria-label="Remove line"
            title="Remove line"
            onClick={() => onRemove(line.id)}
            className="justify-self-end rounded-md px-2 text-lg leading-none text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-teal-700 transition hover:border-teal-400 hover:bg-teal-50"
      >
        + Add row
      </button>
    </div>
  );
}
