"use client";

import type { QuoteDoc, ThemeName } from "@/lib/types";
import { computeTotals, lineAmount } from "@/lib/calc";
import { formatDate, formatMoney } from "@/lib/format";

const THEME_STYLES: Record<ThemeName, { accent: string; headBg: string; headText: string }> = {
  classic: { accent: "text-teal-700", headBg: "bg-teal-600", headText: "text-white" },
  slate: { accent: "text-slate-700", headBg: "bg-slate-800", headText: "text-white" },
  mint: { accent: "text-emerald-700", headBg: "bg-emerald-500", headText: "text-white" },
};

function PartyLine({ value }: { value?: string }) {
  if (!value) return null;
  return <p className="text-sm text-slate-600">{value}</p>;
}

export function DocumentPreview({ doc }: { doc: QuoteDoc }) {
  const totals = computeTotals(doc);
  const isQuote = doc.docType === "quote";
  const theme = THEME_STYLES[doc.theme];
  const visibleLines = doc.lines.filter((line) => line.desc || line.rate);

  return (
    <article
      id="doc-preview"
      className="mx-auto w-full max-w-[820px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none"
    >
      <div className={`flex items-start justify-between gap-4 px-8 py-6 ${theme.headBg} ${theme.headText}`}>
        <div>
          <h1 className="text-3xl font-black tracking-tight">{isQuote ? "QUOTE" : "INVOICE"}</h1>
          <p className="mt-1 text-sm opacity-90">
            {doc.number || (isQuote ? "QTE-001" : "INV-001")}
          </p>
        </div>
        <div className="text-right text-sm">
          <div className="flex justify-end gap-3">
            <span className="opacity-80">Date</span>
            <strong>{formatDate(doc.date)}</strong>
          </div>
          <div className="mt-1 flex justify-end gap-3">
            <span className="opacity-80">{isQuote ? "Valid until" : "Due"}</span>
            <strong>{formatDate(doc.dueDate)}</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-8 py-6 sm:grid-cols-2">
        <div>
          <h3 className={`mb-1 text-xs font-bold uppercase tracking-wide ${theme.accent}`}>From</h3>
          <p className="font-semibold text-slate-900">{doc.business.name || "Your name"}</p>
          <PartyLine value={doc.business.email} />
          <PartyLine value={doc.business.phone} />
          <PartyLine value={doc.business.address} />
        </div>
        <div>
          <h3 className={`mb-1 text-xs font-bold uppercase tracking-wide ${theme.accent}`}>
            {isQuote ? "Prepared for" : "Bill to"}
          </h3>
          <p className="font-semibold text-slate-900">{doc.client.name || "Client name"}</p>
          <PartyLine value={doc.client.company} />
          <PartyLine value={doc.client.email} />
          <PartyLine value={doc.client.address} />
        </div>
      </div>

      <div className="px-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {visibleLines.length > 0 ? (
              visibleLines.map((line) => (
                <tr key={line.id} className="border-b border-slate-100">
                  <td className="py-2 text-slate-800">{line.desc || "—"}</td>
                  <td className="py-2 text-right text-slate-600">{line.qty}</td>
                  <td className="py-2 text-right text-slate-600">
                    {formatMoney(line.rate, doc.currency)}
                  </td>
                  <td className="py-2 text-right font-medium text-slate-800">
                    {formatMoney(lineAmount(line), doc.currency)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-400">
                  Add line items to see them here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end px-8 py-6">
        <div className="w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <strong className="text-slate-800">{formatMoney(totals.subtotal, doc.currency)}</strong>
          </div>
          {doc.taxRate > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Tax ({doc.taxRate}%)</span>
              <strong className="text-slate-800">{formatMoney(totals.tax, doc.currency)}</strong>
            </div>
          )}
          <div className={`mt-2 flex justify-between border-t border-slate-300 pt-2 text-base font-bold ${theme.accent}`}>
            <span>Total</span>
            <span>{formatMoney(totals.total, doc.currency)}</span>
          </div>
        </div>
      </div>

      {doc.notes && (
        <footer className="border-t border-slate-100 px-8 py-5 text-sm whitespace-pre-line text-slate-600">
          {doc.notes}
        </footer>
      )}
    </article>
  );
}
