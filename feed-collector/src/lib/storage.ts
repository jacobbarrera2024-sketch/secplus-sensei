import type { SavedFeed } from "./types";

const STORAGE_KEY = "feed_collector_urls_v1";

export function loadSavedFeeds(): SavedFeed[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedFeed[];
    return Array.isArray(parsed) ? parsed.filter((f) => f?.url) : [];
  } catch {
    return [];
  }
}

export function saveFeeds(feeds: SavedFeed[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feeds));
}

export function addFeed(feeds: SavedFeed[], url: string, label = ""): SavedFeed[] {
  const trimmed = url.trim();
  if (!trimmed || feeds.some((f) => f.url === trimmed)) return feeds;
  return [...feeds, { url: trimmed, label: label.trim() || trimmed }];
}

export function removeFeed(feeds: SavedFeed[], url: string): SavedFeed[] {
  return feeds.filter((f) => f.url !== url);
}
