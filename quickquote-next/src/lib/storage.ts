import type { DocType, QuoteDoc, ThemeName } from "./types";
import { emptyDoc, newLineId } from "./sample";

const STORAGE_KEY = "quickquote_next_draft_v1";

const THEMES: ThemeName[] = ["classic", "slate", "mint"];
const DOC_TYPES: DocType[] = ["invoice", "quote"];

export function saveDraft(doc: QuoteDoc): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Loads a saved draft and normalizes it against the current shape.
 * Returns null when nothing valid is stored.
 */
export function loadDraft(): QuoteDoc | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<QuoteDoc>;
    if (!parsed || typeof parsed !== "object") return null;

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
      currency: typeof parsed.currency === "string" ? parsed.currency : base.currency,
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
  } catch {
    return null;
  }
}
