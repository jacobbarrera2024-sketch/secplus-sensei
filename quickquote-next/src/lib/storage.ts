import type { QuoteDoc } from "./types";
import { normalizeDoc } from "./import";
import { emptyDoc } from "./sample";

const STORAGE_KEY = "quickquote_next_draft_v1";

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

export function loadDraft(): QuoteDoc | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeDoc(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function parseImportFile(text: string): QuoteDoc | null {
  try {
    return normalizeDoc(JSON.parse(text));
  } catch {
    return null;
  }
}

export { emptyDoc };
