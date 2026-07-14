#!/usr/bin/env node
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "docs", "screenshots");
const PORT = 8765;

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".json": "application/json",
  ".glb": "model/gltf-binary"
};

function serve(req, res) {
  var url = req.url.split("?")[0];
  if (url === "/") url = "/secplus-sensei.html";
  var filePath = path.join(ROOT, decodeURIComponent(url.replace(/^\//, "")));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end();
  }
  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404);
      return res.end("Not found");
    }
    var ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

async function wait(ms) {
  return new Promise(function (r) {
    setTimeout(r, ms);
  });
}

async function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  var server = http.createServer(serve);
  await new Promise(function (resolve) {
    server.listen(PORT, "127.0.0.1", resolve);
  });

  var browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"]
  });

  try {
    var page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2
    });

    await page.addInitScript(function () {
      localStorage.setItem(
        "secplus_sensei_v1",
        JSON.stringify({
          meta: { onboardDone: true, lastAppVersion: "1.1.7" }
        })
      );
    });

    await page.goto("http://127.0.0.1:" + PORT + "/secplus-sensei.html", {
      waitUntil: "networkidle",
      timeout: 60000
    });

    await wait(2500);

    if (await page.locator("#onboardStartBtn").isVisible()) {
      await page.locator("#onboardStartBtn").click();
      await wait(400);
    }

    await page.evaluate(function () {
      if (typeof closeOnboarding === "function") closeOnboarding();
    });
    await wait(300);

    async function shotView(viewId, filename) {
      await page.evaluate(function (id) {
        if (typeof showView === "function") showView(id);
      }, viewId);
      await wait(1000);
      await page.screenshot({
        path: path.join(OUT, filename),
        clip: { x: 0, y: 56, width: 1280, height: 720 }
      });
    }

    await shotView("dashboard", "dashboard.png");
    await shotView("study", "study.png");
    await shotView("exam", "exam.png");

    console.log("Saved screenshots to docs/screenshots/");
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(function (e) {
  console.error(e);
  process.exit(1);
});
