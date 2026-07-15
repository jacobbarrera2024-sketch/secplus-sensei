import Parser from "rss-parser";
import type { FeedItem, ParsedFeed } from "../types.js";
import { itemId, normalizeFeedUrl, stripHtml } from "./validate.js";

const parser = new Parser({
  timeout: 8000,
  headers: {
    Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
    "User-Agent": "FeedCollector/1.0 (portfolio demo)",
  },
});

export async function parseFeedUrl(rawUrl: string): Promise<ParsedFeed> {
  const url = normalizeFeedUrl(rawUrl);
  if (!url) {
    throw new Error("Invalid feed URL. Use http:// or https://.");
  }

  const feed = await parser.parseURL(url);
  const feedTitle = feed.title?.trim() || url;

  const items: FeedItem[] = (feed.items ?? []).map((item) => {
    const title = item.title?.trim() || "Untitled";
    const link = item.link?.trim() || item.guid?.trim() || "";
    const pubDate = item.isoDate || item.pubDate || "";
    const summary = stripHtml(item.contentSnippet || item.content || item.summary || "");

    return {
      id: itemId(url, link, title, pubDate),
      title,
      link,
      pubDate,
      summary,
      feedTitle,
      feedUrl: url,
    };
  });

  return { url, title: feedTitle, items };
}

export async function parseFeedBatch(urls: string[]): Promise<{
  feeds: ParsedFeed[];
  errors: { url: string; error: string }[];
}> {
  const unique = [...new Set(urls.map((u) => u.trim()).filter(Boolean))].slice(0, 12);
  const feeds: ParsedFeed[] = [];
  const errors: { url: string; error: string }[] = [];

  await Promise.all(
    unique.map(async (raw) => {
      try {
        feeds.push(await parseFeedUrl(raw));
      } catch (error) {
        errors.push({
          url: raw,
          error: error instanceof Error ? error.message : "Could not parse feed.",
        });
      }
    }),
  );

  return { feeds, errors };
}
