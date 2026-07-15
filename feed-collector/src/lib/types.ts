export type FeedItem = {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  summary: string;
  feedTitle: string;
  feedUrl: string;
};

export type ParsedFeed = {
  url: string;
  title: string;
  items: FeedItem[];
};

export type BatchResult = {
  feeds: ParsedFeed[];
  errors: { url: string; error: string }[];
};

export type SavedFeed = {
  url: string;
  label: string;
};

export type FetchStatus = "idle" | "loading" | "ok" | "error";
