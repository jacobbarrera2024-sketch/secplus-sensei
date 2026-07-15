import type { QuoteDoc } from "./types";
import { addDaysISO, todayISO } from "./format";

let idCounter = 0;

export function newLineId(): string {
  idCounter += 1;
  return `line-${Date.now().toString(36)}-${idCounter}`;
}

export function emptyDoc(): QuoteDoc {
  return {
    docType: "invoice",
    number: "",
    date: todayISO(),
    dueDate: addDaysISO(14),
    business: { name: "", email: "", phone: "", address: "" },
    client: { name: "", company: "", email: "", address: "" },
    lines: [{ id: newLineId(), desc: "", qty: 1, rate: 0 }],
    taxRate: 0,
    notes: "",
    theme: "classic",
    currency: "USD",
  };
}

export function sampleDoc(): QuoteDoc {
  return {
    docType: "invoice",
    number: "INV-2026-014",
    date: todayISO(),
    dueDate: addDaysISO(14),
    business: {
      name: "Jacob Barrera",
      email: "jacobbarrera.jb@gmail.com",
      phone: "",
      address: "Freelance developer · Galveston, TX",
    },
    client: {
      name: "Alex Rivera",
      company: "Rivera Consulting",
      email: "alex@riveraconsulting.example",
      address: "Austin, TX",
    },
    lines: [
      { id: newLineId(), desc: "Landing page design & build", qty: 1, rate: 450 },
      { id: newLineId(), desc: "Contact form + email integration", qty: 1, rate: 125 },
      { id: newLineId(), desc: "Revisions (2 rounds included)", qty: 2, rate: 50 },
    ],
    taxRate: 8.25,
    notes:
      "Payment due within 14 days via bank transfer or PayPal.\nThank you for your business!",
    theme: "mint",
    currency: "USD",
  };
}
