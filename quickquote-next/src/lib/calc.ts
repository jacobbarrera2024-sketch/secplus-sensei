import type { LineItem, QuoteDoc, Totals } from "./types";

export function lineAmount(line: LineItem): number {
  return (Number(line.qty) || 0) * (Number(line.rate) || 0);
}

export function computeTotals(doc: QuoteDoc): Totals {
  const subtotal = doc.lines.reduce((sum, line) => sum + lineAmount(line), 0);
  const tax = subtotal * ((Number(doc.taxRate) || 0) / 100);
  return {
    subtotal,
    tax,
    total: subtotal + tax,
  };
}
