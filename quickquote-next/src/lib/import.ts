import type { DocType, QuoteDoc, ThemeName } from "./types";
import { emptyDoc, newLineId } from "./sample";

const THEMES: ThemeName[] = ["classic", "slate", "mint"];
const DOC_TYPES: DocType[] = ["invoice", "quote"];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "MXN", "INR"];

/** Normalize imported or saved JSON into a valid QuoteDoc. */
export function normalizeDoc(raw: unknown): QuoteDoc | null {
  if (!raw || typeof raw !== "object") return null;
  const parsed = raw as Partial<QuoteDoc>;
  const base = emptyDoc();

  return {
    docType: DOC_TYPES.includes(parsed.docType as DocType)
      ? (parsed.docType as DocType)
      : base.docType,
    number: typeof parsed.number === "string" ? parsed.number : base.number,
    date: typeof parsed.date === "string" ? parsed.date : base.date,
    dueDate: typeof parsed.dueDate === "string" ? parsed.dueDate : base.dueDate,
    taxRate: typeof parsed.taxRate === "number" ? parsed.taxRate : base.taxRate,
    notes: typeof parsed.notes === "string" ? parsed.notes : base.notes,
    currency:
      typeof parsed.currency === "string" && CURRENCIES.includes(parsed.currency)
        ? parsed.currency
        : base.currency,
    theme: THEMES.includes(parsed.theme as ThemeName)
      ? (parsed.theme as ThemeName)
      : base.theme,
    business: {
      name: parsed.business?.name ?? "",
      email: parsed.business?.email ?? "",
      phone: parsed.business?.phone ?? "",
      address: parsed.business?.address ?? "",
    },
    client: {
      name: parsed.client?.name ?? "",
      company: parsed.client?.company ?? "",
      email: parsed.client?.email ?? "",
      address: parsed.client?.address ?? "",
    },
    lines:
      Array.isArray(parsed.lines) && parsed.lines.length
        ? parsed.lines.map((line) => ({
            id: typeof line?.id === "string" ? line.id : newLineId(),
            desc: line?.desc ?? "",
            qty: Number(line?.qty) || 0,
            rate: Number(line?.rate) || 0,
          }))
        : base.lines,
  };
}
