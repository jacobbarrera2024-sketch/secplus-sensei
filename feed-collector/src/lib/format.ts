import type { FeedItem } from "./types";

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function sortItems(items: FeedItem[]): FeedItem[] {
  return [...items].sort((a, b) => {
    const ta = new Date(a.pubDate).getTime() || 0;
    const tb = new Date(b.pubDate).getTime() || 0;
    return tb - ta;
  });
}

export function filterItems(items: FeedItem[], query: string): FeedItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.feedTitle.toLowerCase().includes(q),
  );
}

export function downloadText(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportJson(items: FeedItem[]): void {
  downloadText(
    `feed-export-${Date.now()}.json`,
    JSON.stringify(items, null, 2),
    "application/json",
  );
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function exportCsv(items: FeedItem[]): void {
  const header = ["title", "link", "pubDate", "feedTitle", "feedUrl", "summary"];
  const rows = items.map((item) =>
    [
      item.title,
      item.link,
      item.pubDate,
      item.feedTitle,
      item.feedUrl,
      item.summary,
    ]
      .map(csvEscape)
      .join(","),
  );
  downloadText(
    `feed-export-${Date.now()}.csv`,
    [header.join(","), ...rows].join("\n"),
    "text/csv;charset=utf-8",
  );
}

export function flattenFeeds(
  feeds: { items: FeedItem[] }[],
): FeedItem[] {
  return sortItems(feeds.flatMap((feed) => feed.items));
}
