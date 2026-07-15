import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { feedsRouter } from "./routes/feeds.js";
import type { HealthResponse } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const isProd = process.env.NODE_ENV === "production";

const app = express();

app.use(express.json({ limit: "32kb" }));
app.use(
  cors(
    isProd
      ? undefined
      : {
          origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        },
  ),
);

app.get("/api/health", (_req, res) => {
  const payload: HealthResponse = {
    ok: true,
    service: "feed-collector",
    version: "1.0.0",
  };
  res.json(payload);
});

app.use("/api/feeds", feedsRouter);

if (isProd) {
  const clientDir = path.join(__dirname, "../client");
  app.use(express.static(clientDir));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`FeedCollector API listening on http://localhost:${PORT}`);
});
