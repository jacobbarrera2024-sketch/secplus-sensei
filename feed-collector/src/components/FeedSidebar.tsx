import { useState, type FormEvent } from "react";
import type { SavedFeed } from "@/lib/types";

export function FeedSidebar({
  feeds,
  onAdd,
  onRemove,
  onLoadSamples,
}: {
  feeds: SavedFeed[];
  onAdd: (url: string, label?: string) => void;
  onRemove: (url: string) => void;
  onLoadSamples: () => void;
}) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!url.trim()) return;
    onAdd(url, label);
    setUrl("");
    setLabel("");
  };

  return (
    <aside className="space-y-4">
      <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        Portfolio demo · Server-side RSS parsing
      </p>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Feed sources</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          URLs are saved in this browser. Parsing runs on the Express API so feeds work without CORS
          issues.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="feed-url" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              RSS / Atom URL
            </label>
            <input
              id="feed-url"
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/feed.xml"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label htmlFor="feed-label" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Label (optional)
            </label>
            <input
              id="feed-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Tech news"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add feed
          </button>
        </form>

        <button
          type="button"
          onClick={onLoadSamples}
          className="mt-3 w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-blue-700 hover:border-blue-400 hover:bg-blue-50"
        >
          Load sample feeds
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Saved ({feeds.length})
        </h3>
        {feeds.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No feeds yet. Add a URL or load samples.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {feeds.map((feed) => (
              <li
                key={feed.url}
                className="flex items-start justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {feed.label || feed.url}
                  </p>
                  <p className="truncate text-xs text-slate-500">{feed.url}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${feed.label || feed.url}`}
                  onClick={() => onRemove(feed.url)}
                  className="shrink-0 rounded-md px-2 text-lg leading-none text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
