"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LineItem, Party, QuoteDoc } from "@/lib/types";
import { emptyDoc, newLineId, sampleDoc } from "@/lib/sample";
import { clearDraft, loadDraft, parseImportFile, saveDraft } from "@/lib/storage";
import { downloadJson } from "@/lib/format";
import { Toolbar } from "./Toolbar";
import { EditorPanel } from "./EditorPanel";
import { DocumentPreview } from "./DocumentPreview";
import { LoadingShell } from "./LoadingShell";

type Tab = "edit" | "preview";
type Status = { message: string; tone: "ok" | "error" } | null;

export function QuickQuote() {
  const [doc, setDoc] = useState<QuoteDoc>(() => emptyDoc());
  const [tab, setTab] = useState<Tab>("edit");
  const [status, setStatus] = useState<Status>(null);
  const [hydrated, setHydrated] = useState(false);
  const skipAutoSave = useRef(true);

  useEffect(() => {
    const saved = loadDraft();
    queueMicrotask(() => {
      if (saved) {
        skipAutoSave.current = true;
        setDoc(saved);
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipAutoSave.current) {
      skipAutoSave.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      if (saveDraft(doc)) {
        setStatus({ message: "Draft auto-saved.", tone: "ok" });
      }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [doc, hydrated]);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(null), 2800);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        const ok = saveDraft(doc);
        setStatus(
          ok
            ? { message: "Draft saved.", tone: "ok" }
            : { message: "Could not save draft.", tone: "error" },
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [doc]);

  const setField = useCallback(
    <K extends keyof QuoteDoc>(key: K, value: QuoteDoc[K]) => {
      setDoc((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setBusiness = useCallback((patch: Partial<Party>) => {
    setDoc((prev) => ({ ...prev, business: { ...prev.business, ...patch } }));
  }, []);

  const setClient = useCallback((patch: Partial<Party>) => {
    setDoc((prev) => ({ ...prev, client: { ...prev.client, ...patch } }));
  }, []);

  const addLine = useCallback(() => {
    setDoc((prev) => ({
      ...prev,
      lines: [...prev.lines, { id: newLineId(), desc: "", qty: 1, rate: 0 }],
    }));
  }, []);

  const updateLine = useCallback((id: string, patch: Partial<LineItem>) => {
    setDoc((prev) => ({
      ...prev,
      lines: prev.lines.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    }));
  }, []);

  const removeLine = useCallback((id: string) => {
    setDoc((prev) => {
      if (prev.lines.length <= 1) {
        return { ...prev, lines: [{ id: newLineId(), desc: "", qty: 1, rate: 0 }] };
      }
      return { ...prev, lines: prev.lines.filter((line) => line.id !== id) };
    });
  }, []);

  const handleSave = useCallback(() => {
    const ok = saveDraft(doc);
    setStatus(
      ok
        ? { message: "Draft saved on this device.", tone: "ok" }
        : { message: "Could not save — storage may be full.", tone: "error" },
    );
  }, [doc]);

  const handleExport = useCallback(() => {
    const slug = doc.number.trim().replace(/\s+/g, "-").toLowerCase() || "draft";
    downloadJson(`quickquote-${slug}.json`, doc);
    setStatus({ message: "JSON exported.", tone: "ok" });
  }, [doc]);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseImportFile(String(reader.result ?? ""));
      if (!parsed) {
        setStatus({ message: "Invalid JSON file.", tone: "error" });
        return;
      }
      skipAutoSave.current = true;
      setDoc(parsed);
      saveDraft(parsed);
      setStatus({ message: "Document imported.", tone: "ok" });
    };
    reader.onerror = () => setStatus({ message: "Could not read file.", tone: "error" });
    reader.readAsText(file);
  }, []);

  const handleNew = useCallback(() => {
    const hasContent =
      doc.number ||
      doc.client.name ||
      doc.lines.some((l) => l.desc || l.rate);
    if (hasContent && !window.confirm("Start a new document? Your current draft stays saved until you overwrite it.")) {
      return;
    }
    clearDraft();
    skipAutoSave.current = true;
    setDoc((prev) => ({
      ...emptyDoc(),
      business: prev.business,
      theme: prev.theme,
      currency: prev.currency,
    }));
    setStatus({ message: "New document started.", tone: "ok" });
  }, [doc]);

  const handleSample = useCallback(() => {
    skipAutoSave.current = true;
    setDoc(sampleDoc());
    setStatus({ message: "Sample invoice loaded.", tone: "ok" });
  }, []);

  const handlePrint = useCallback(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setTab("preview");
      window.setTimeout(() => window.print(), 300);
    } else {
      window.print();
    }
  }, []);

  if (!hydrated) {
    return <LoadingShell />;
  }

  return (
    <>
      <Toolbar
        onLoadSample={handleSample}
        onNew={handleNew}
        onSave={handleSave}
        onImport={handleImport}
        onExport={handleExport}
        onPrint={handlePrint}
      />

      <nav
        className="flex border-b border-slate-200 bg-white lg:hidden print:hidden"
        aria-label="Editor navigation"
      >
        {(["edit", "preview"] as Tab[]).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setTab(name)}
            aria-current={tab === name ? "page" : undefined}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition ${
              tab === name
                ? "border-b-2 border-teal-600 text-teal-700"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {name}
          </button>
        ))}
      </nav>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className={`${tab === "edit" ? "block" : "hidden"} lg:block print:hidden`}>
          <EditorPanel
            doc={doc}
            setField={setField}
            setBusiness={setBusiness}
            setClient={setClient}
            addLine={addLine}
            updateLine={updateLine}
            removeLine={removeLine}
          />
          {status && (
            <p
              role="status"
              aria-live="polite"
              className={`mt-3 text-sm font-medium ${
                status.tone === "ok" ? "text-teal-700" : "text-red-600"
              }`}
            >
              {status.message}
            </p>
          )}
        </section>

        <section className={`${tab === "preview" ? "block" : "hidden"} lg:block print:block`}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden print:hidden">
            Preview
          </p>
          <div className="lg:sticky lg:top-[4.75rem]">
            <DocumentPreview doc={doc} />
          </div>
        </section>
      </div>
    </>
  );
}
