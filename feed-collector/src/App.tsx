import { useCallback, useEffect, useMemo, useState } from "react";
import { parseFeedBatch } from "@/lib/api";
import {
  exportCsv,
  exportJson,
  filterItems,
  flattenFeeds,
  formatDate,
} from "@/lib/format";
import { SAMPLE_FEEDS } from "@/lib/sample";
import { addFeed, loadSavedFeeds, removeFeed, saveFeeds } from "@/lib/storage";
import type { ParsedFeed, SavedFeed } from "@/lib/types";
import { FeedList } from "./components/FeedList";
import { FeedSidebar } from "./components/FeedSidebar";
import { Header } from "./components/Header";
import { LoadingShell } from "./components/LoadingShell";

export function App() {
  const [hydrated, setHydrated] = useState(false);
  const [savedFeeds, setSavedFeeds] = useState<SavedFeed[]>([]);
  const [feeds, setFeeds] = useState<ParsedFeed[]>([]);
  const [errors, setErrors] = useState<{ url: string; error: string }[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setSavedFeeds(loadSavedFeeds());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveFeeds(savedFeeds);
  }, [savedFeeds, hydrated]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3200);
    return () => window.clearTimeout(timer);
  }, [message]);

  const items = useMemo(() => flattenFeeds(feeds), [feeds]);
  const visibleItems = useMemo(() => filterItems(items, query), [items, query]);

  const handleAddFeed = useCallback((url: string, label?: string) => {
    setSavedFeeds((prev) => addFeed(prev, url, label));
    setMessage("Feed added.");
  }, []);

  const handleRemoveFeed = useCallback((url: string) => {
    setSavedFeeds((prev) => removeFeed(prev, url));
    setFeeds((prev) => prev.filter((feed) => feed.url !== url));
    setMessage("Feed removed.");
  }, []);

  const handleLoadSamples = useCallback(() => {
    setSavedFeeds(SAMPLE_FEEDS);
    setMessage("Sample feeds loaded — click Fetch all.");
  }, []);

  const handleFetchAll = useCallback(async () => {
    if (!savedFeeds.length) {
      setMessage("Add at least one feed URL first.");
      return;
    }

    setStatus("loading");
    setErrors([]);
    setMessage("");

    try {
      const result = await parseFeedBatch(savedFeeds.map((f) => f.url));
      setFeeds(result.feeds);
      setErrors(result.errors);
      setStatus("ok");
      const count = flattenFeeds(result.feeds).length;
      setMessage(
        result.errors.length
          ? `Fetched ${count} items (${result.errors.length} feed(s) failed).`
          : `Fetched ${count} items from ${result.feeds.length} feed(s).`,
      );
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Fetch failed.");
    }
  }, [savedFeeds]);

  const handleExport = useCallback(
    (format: "json" | "csv") => {
      const exportItems = visibleItems.length ? visibleItems : items;
      if (!exportItems.length) {
        setMessage("Nothing to export yet — fetch feeds first.");
        return;
      }
      if (format === "json") exportJson(exportItems);
      else exportCsv(exportItems);
      setMessage(`Exported ${exportItems.length} items as ${format.toUpperCase()}.`);
    },
    [items, visibleItems],
  );

  if (!hydrated) {
    return <LoadingShell />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <Header
        itemCount={visibleItems.length}
        feedCount={savedFeeds.length}
        onExportJson={() => handleExport("json")}
        onExportCsv={() => handleExport("csv")}
        onFetchAll={handleFetchAll}
        loading={status === "loading"}
      />

      <main
        id="main-content"
        className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]"
      >
        <FeedSidebar
          feeds={savedFeeds}
          onAdd={handleAddFeed}
          onRemove={handleRemoveFeed}
          onLoadSamples={handleLoadSamples}
        />

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label htmlFor="search" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Filter headlines
            </label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, summary, or source…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
            <p className="mt-2 text-xs text-slate-500">
              Showing {visibleItems.length} of {items.length} items
              {query ? ` matching “${query}”` : ""}.
            </p>
          </div>

          {errors.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
              <p className="font-semibold">Some feeds could not be loaded</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {errors.map((entry) => (
                  <li key={entry.url}>
                    <span className="font-medium">{entry.url}</span>: {entry.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <FeedList
            items={visibleItems}
            loading={status === "loading"}
            formatDate={formatDate}
          />

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`text-sm font-medium ${status === "error" ? "text-red-600" : "text-blue-700"}`}
            >
              {message}
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-500">
        <p>
          Built by <strong className="text-slate-700">Jacob Barrera</strong> ·{" "}
          <a className="font-medium text-blue-700 hover:underline" href="https://jacobbarrera2024-sketch.github.io/">
            Portfolio
          </a>{" "}
          ·{" "}
          <a
            className="font-medium text-blue-700 hover:underline"
            href="https://github.com/jacobbarrera2024-sketch/secplus-sensei/tree/main/feed-collector"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Express · Node.js · React · TypeScript · Tailwind CSS · RSS/Atom parsing · JSON/CSV export
        </p>
      </footer>
    </div>
  );
}
