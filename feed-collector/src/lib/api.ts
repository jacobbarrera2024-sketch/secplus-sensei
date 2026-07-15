import type { BatchResult, ParsedFeed } from "./types";

const API = "/api/feeds";

export async function parseFeed(url: string): Promise<ParsedFeed> {
  const res = await fetch(`${API}/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const json = (await res.json()) as ParsedFeed & { error?: string };
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

export async function parseFeedBatch(urls: string[]): Promise<BatchResult> {
  const res = await fetch(`${API}/parse-batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  });
  const json = (await res.json()) as BatchResult & { error?: string };
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch("/api/health");
    return res.ok;
  } catch {
    return false;
  }
}
