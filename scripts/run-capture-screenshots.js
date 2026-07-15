#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const userData = path.join(ROOT, ".screenshot-userdata");
const progressFile = path.join(userData, "progress.json");

const seedProgress = {
  meta: { onboardDone: true, lastAppVersion: "1.1.7", totalReviews: 42 },
  cards: [],
  questions: [],
  pbqs: [],
  settings: { apiKey: "", model: "claude-haiku-4-5", soundOn: true },
  xp: { total: 850 },
  streak: { current: 4, best: 7, lastDate: "2026-07-13", totalDays: 12 },
  plan: { days: 30, startDate: "2026-07-01" },
  daily: {},
  achievements: {},
  examHistory: []
};

fs.mkdirSync(userData, { recursive: true });
fs.writeFileSync(progressFile, JSON.stringify(seedProgress));

var electron = path.join(ROOT, "node_modules", ".bin", "electron");
var args = [
  ".",
  "--capture-screenshots",
  "--enable-unsafe-swiftshader",
  "--use-gl=angle",
  "--use-angle=swiftshader",
  "--user-data-dir=" + userData
];

var cmd = process.platform === "win32" ? "npx" : "xvfb-run";
var spawnArgs =
  process.platform === "win32"
    ? ["electron", "."].concat(args.slice(1))
    : ["-a", electron].concat(args);

var result =
  process.platform === "win32"
    ? spawnSync("npx", ["electron", "."].concat(args.slice(1)), { cwd: ROOT, stdio: "inherit" })
    : spawnSync("xvfb-run", ["-a", electron].concat(args), { cwd: ROOT, stdio: "inherit" });

if (result.status !== 0) process.exit(result.status || 1);
console.log("Done. See docs/screenshots/");
