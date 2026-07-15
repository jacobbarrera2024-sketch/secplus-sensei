"use client";

import type { DocType, LineItem, Party, QuoteDoc, ThemeName } from "@/lib/types";
import { computeTotals } from "@/lib/calc";
import { CURRENCIES } from "@/lib/currencies";
import { Card, Field, Select, TextArea, TextInput } from "./fields";
import { LineItems } from "./LineItems";
import { CurrencyConverter } from "./CurrencyConverter";

export function EditorPanel({
  doc,
  setField,
  setBusiness,
  setClient,
  addLine,
  updateLine,
  removeLine,
}: {
  doc: QuoteDoc;
  setField: <K extends keyof QuoteDoc>(key: K, value: QuoteDoc[K]) => void;
  setBusiness: (patch: Partial<Party>) => void;
  setClient: (patch: Partial<Party>) => void;
  addLine: () => void;
  updateLine: (id: string, patch: Partial<LineItem>) => void;
  removeLine: (id: string) => void;
}) {
  const totals = computeTotals(doc);

  return (
    <div className="space-y-4">
      <p className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
        Portfolio demo · No signup · Saves locally
      </p>

      <Card title="Document">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type" htmlFor="docType">
            <Select
              id="docType"
              value={doc.docType}
              onChange={(e) => setField("docType", e.target.value as DocType)}
            >
              <option value="invoice">Invoice</option>
              <option value="quote">Quote</option>
            </Select>
          </Field>
          <Field label="Number" htmlFor="docNumber">
            <TextInput
              id="docNumber"
              value={doc.number}
              placeholder="INV-001"
              onChange={(e) => setField("number", e.target.value)}
            />
          </Field>
          <Field label="Date" htmlFor="docDate">
            <TextInput
              id="docDate"
              type="date"
              value={doc.date}
              onChange={(e) => setField("date", e.target.value)}
            />
          </Field>
          <Field label="Due / valid until" htmlFor="dueDate">
            <TextInput
              id="dueDate"
              type="date"
              value={doc.dueDate}
              onChange={(e) => setField("dueDate", e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Your business">
        <div className="space-y-4">
          <Field label="Name / company" htmlFor="bizName">
            <TextInput
              id="bizName"
              value={doc.business.name}
              placeholder="Jacob Barrera"
              onChange={(e) => setBusiness({ name: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" htmlFor="bizEmail">
              <TextInput
                id="bizEmail"
                type="email"
                value={doc.business.email}
                placeholder="you@email.com"
                onChange={(e) => setBusiness({ email: e.target.value })}
              />
            </Field>
            <Field label="Phone" htmlFor="bizPhone">
              <TextInput
                id="bizPhone"
                type="tel"
                value={doc.business.phone ?? ""}
                placeholder="(555) 123-4567"
                onChange={(e) => setBusiness({ phone: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Address" htmlFor="bizAddress">
            <TextArea
              id="bizAddress"
              rows={2}
              value={doc.business.address}
              placeholder="City, State"
              onChange={(e) => setBusiness({ address: e.target.value })}
            />
          </Field>
        </div>
      </Card>

      <Card title="Client">
        <div className="space-y-4">
          <Field label="Name" htmlFor="clientName">
            <TextInput
              id="clientName"
              value={doc.client.name}
              placeholder="Client name"
              onChange={(e) => setClient({ name: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company" htmlFor="clientCompany">
              <TextInput
                id="clientCompany"
                value={doc.client.company ?? ""}
                placeholder="Acme Co."
                onChange={(e) => setClient({ company: e.target.value })}
              />
            </Field>
            <Field label="Email" htmlFor="clientEmail">
              <TextInput
                id="clientEmail"
                type="email"
                value={doc.client.email}
                placeholder="client@email.com"
                onChange={(e) => setClient({ email: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Address" htmlFor="clientAddress">
            <TextArea
              id="clientAddress"
              rows={2}
              value={doc.client.address}
              placeholder="Client address"
              onChange={(e) => setClient({ address: e.target.value })}
            />
          </Field>
        </div>
      </Card>

      <Card title="Line items">
        <LineItems
          lines={doc.lines}
          currency={doc.currency}
          onAdd={addLine}
          onChange={updateLine}
          onRemove={removeLine}
        />
      </Card>

      <Card title="Totals, currency &amp; notes">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Tax rate (%)" htmlFor="taxRate">
              <TextInput
                id="taxRate"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={doc.taxRate}
                onChange={(e) => setField("taxRate", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Currency" htmlFor="currency">
              <Select
                id="currency"
                value={doc.currency}
                onChange={(e) => setField("currency", e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Theme" htmlFor="theme">
              <Select
                id="theme"
                value={doc.theme}
                onChange={(e) => setField("theme", e.target.value as ThemeName)}
              >
                <option value="classic">Classic</option>
                <option value="slate">Slate</option>
                <option value="mint">Mint</option>
              </Select>
            </Field>
          </div>
          <Field label="Notes / payment terms" htmlFor="notes">
            <TextArea
              id="notes"
              rows={3}
              value={doc.notes}
              placeholder="Payment due within 14 days. Thank you for your business."
              onChange={(e) => setField("notes", e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="Live currency check">
        <CurrencyConverter key={doc.currency} base={doc.currency} total={totals.total} />
      </Card>
    </div>
  );
}
