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

export type ParseFeedRequest = {
  url: string;
};

export type ParseBatchRequest = {
  urls: string[];
};

export type ApiError = {
  error: string;
};

export type HealthResponse = {
  ok: true;
  service: string;
  version: string;
};
