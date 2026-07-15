const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

export function normalizeFeedUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(url.protocol)) return null;
  if (BLOCKED_HOSTS.has(url.hostname.toLowerCase())) return null;

  return url.toString();
}

export function isValidFeedUrl(raw: string): boolean {
  return normalizeFeedUrl(raw) !== null;
}

export function itemId(feedUrl: string, link: string, title: string, pubDate: string): string {
  return `${feedUrl}::${link || title}::${pubDate}`.slice(0, 240);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
