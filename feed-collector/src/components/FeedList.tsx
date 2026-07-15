import type { FeedItem } from "@/lib/types";

export function FeedList({
  items,
  loading,
  formatDate,
}: {
  items: FeedItem[];
  loading: boolean;
  formatDate: (iso: string) => string;
}) {
  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading feed items">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 motion-reduce:animate-none"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm font-semibold text-slate-700">No headlines yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Add feed URLs, then click <strong>Fetch all</strong> to pull the latest items.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold text-slate-900 hover:text-blue-700 hover:underline"
                >
                  {item.title}
                </a>
              ) : (
                <p className="text-base font-semibold text-slate-900">{item.title}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                {item.feedTitle} · {formatDate(item.pubDate)}
              </p>
            </div>
          </div>
          {item.summary && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.summary}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
