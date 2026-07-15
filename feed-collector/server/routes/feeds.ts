import { Router } from "express";
import { parseFeedBatch, parseFeedUrl } from "../lib/rss.js";
import { isValidFeedUrl } from "../lib/validate.js";
import type { ParseBatchRequest, ParseFeedRequest } from "../types.js";

export const feedsRouter = Router();

feedsRouter.post("/parse", async (req, res) => {
  const body = req.body as ParseFeedRequest;
  const url = typeof body?.url === "string" ? body.url : "";

  if (!isValidFeedUrl(url)) {
    res.status(400).json({ error: "Provide a valid http(s) feed URL." });
    return;
  }

  try {
    const feed = await parseFeedUrl(url);
    res.json(feed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not parse feed.";
    res.status(502).json({ error: message });
  }
});

feedsRouter.post("/parse-batch", async (req, res) => {
  const body = req.body as ParseBatchRequest;
  const urls = Array.isArray(body?.urls) ? body.urls : [];

  if (!urls.length) {
    res.status(400).json({ error: "Provide at least one feed URL." });
    return;
  }

  if (urls.length > 12) {
    res.status(400).json({ error: "Maximum 12 feeds per batch." });
    return;
  }

  const invalid = urls.find((url) => !isValidFeedUrl(url));
  if (invalid) {
    res.status(400).json({ error: `Invalid feed URL: ${invalid}` });
    return;
  }

  const result = await parseFeedBatch(urls);
  res.json(result);
});
