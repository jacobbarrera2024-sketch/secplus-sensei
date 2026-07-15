#!/usr/bin/env node
"use strict";

const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "docs", "screenshots");
const HTML = path.join(__dirname, "..", "secplus-sensei.html");

async function capture(win, filename) {
  var img = await win.webContents.capturePage();
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, filename), img.toPNG());
  console.log("Wrote", filename);
}

async function run() {
  var win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "..", "preload.js")
    }
  });

  await win.loadFile(HTML);
  await new Promise(function (r) {
    setTimeout(r, 3000);
  });

  await win.webContents.executeJavaScript(`
    (function(){
      try { localStorage.setItem("secplus_sensei_v1", JSON.stringify({ meta: { onboardDone: true, lastAppVersion: "1.1.7" } })); } catch(e) {}
      if (typeof closeOnboarding === "function") closeOnboarding();
      location.reload();
    })();
  `);

  await new Promise(function (r) {
    setTimeout(r, 3500);
  });

  await win.webContents.executeJavaScript(`closeOnboarding && closeOnboarding();`);
  await win.webContents.executeJavaScript(`showView("dashboard");`);
  await new Promise(function (r) {
    setTimeout(r, 800);
  });
  await capture(win, "dashboard.png");

  await win.webContents.executeJavaScript(`showView("study");`);
  await new Promise(function (r) {
    setTimeout(r, 800);
  });
  await capture(win, "study.png");

  await win.webContents.executeJavaScript(`showView("exam");`);
  await new Promise(function (r) {
    setTimeout(r, 800);
  });
  await capture(win, "exam.png");

  app.quit();
}

app.whenReady().then(run).catch(function (e) {
  console.error(e);
  app.exit(1);
});

app.on("window-all-closed", function () {
  app.quit();
});
