export type DocType = "invoice" | "quote";

export type ThemeName = "classic" | "slate" | "mint";

export interface Party {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: string;
}

export interface LineItem {
  id: string;
  desc: string;
  qty: number;
  rate: number;
}

export interface QuoteDoc {
  docType: DocType;
  number: string;
  date: string;
  dueDate: string;
  business: Party;
  client: Party;
  lines: LineItem[];
  taxRate: number;
  notes: string;
  theme: ThemeName;
  currency: string;
}

export interface Totals {
  subtotal: number;
  tax: number;
  total: number;
}

export interface ExchangeResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}
