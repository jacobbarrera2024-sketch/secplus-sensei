const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const APP_VERSION = require("./package.json").version;
const PROGRESS_FILE = () => path.join(app.getPath("userData"), "progress.json");
const PROGRESS_BACKUP = () => path.join(app.getPath("userData"), "progress.backup.json");
const UPDATES_DIR = () => path.join(app.getPath("userData"), "updates");
const DISMISS_MS = 24 * 60 * 60 * 1000;

let mainWindow = null;
let pendingUpdate = null;
let updateInstalling = false;

if (process.platform === "win32") {
  app.setAppUserModelId("com.secplus.sensei");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeProgress(json) {
  ensureDir(app.getPath("userData"));
  const file = PROGRESS_FILE();
  if (fs.existsSync(file)) {
    try { fs.copyFileSync(file, PROGRESS_BACKUP()); } catch (e) {}
  }
  fs.writeFileSync(file, json, "utf8");
}

function readProgress() {
  const file = PROGRESS_FILE();
  if (!fs.existsSync(file)) return null;
  try { return fs.readFileSync(file, "utf8"); } catch (e) { return null; }
}

function readDismissedUpdate() {
  const raw = readProgress();
  if (!raw) return null;
  try {
    const state = JSON.parse(raw);
    const d = state.meta && state.meta.dismissedUpdate;
    if (!d || !d.version) return null;
    if (d.at && Date.now() - d.at < DISMISS_MS) return d.version;
    return null;
  } catch (e) {
    return null;
  }
}

function parseVersionFromYml(text) {
  var m = String(text).match(/^version:\s*(\S+)/m);
  return m ? m[1] : null;
}

function parsePathFromYml(text) {
  var m = String(text).match(/^path:\s*(\S+)/m);
  return m ? m[1] : null;
}

function semverGt(a, b) {
  var pa = String(a).split(".").map(Number);
  var pb = String(b).split(".").map(Number);
  for (var i = 0; i < 3; i++) {
    var na = pa[i] || 0, nb = pb[i] || 0;
    if (na > nb) return true;
    if (na < nb) return false;
  }
  return false;
}

function readTextIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) return fs.readFileSync(filePath, "utf8").trim();
  } catch (e) {}
  return null;
}

function findSetupExeInDir(dir) {
  if (!dir || !fs.existsSync(dir)) return null;
  try {
    var files = fs.readdirSync(dir);
    var versioned = files.find(function(f) {
      return /^SecPlus Sensei Setup\s+[\d.]+\.exe$/i.test(f);
    });
    if (versioned && fs.existsSync(path.join(dir, versioned))) return path.join(dir, versioned);
    var generic = path.join(dir, "SecPlus Sensei Setup.exe");
    if (fs.existsSync(generic)) return generic;
  } catch (e) {}
  return null;
}

function checkForLocalUpdate() {
  var dismissed = readDismissedUpdate();
  var best = null;
  var updDir = UPDATES_DIR();
  ensureDir(updDir);

  var stagedVer = readTextIfExists(path.join(updDir, "CURRENT_VERSION.txt"));
  var ymlPath = path.join(updDir, "latest.yml");
  if (fs.existsSync(ymlPath)) {
    try {
      var ymlText = fs.readFileSync(ymlPath, "utf8");
      var remoteVer = parseVersionFromYml(ymlText) || stagedVer;
      if (dismissed && dismissed === remoteVer) return null;
      var setupName = parsePathFromYml(ymlText);
      var candidates = [];
      if (setupName) candidates.push(path.join(updDir, setupName));
      candidates.push(path.join(updDir, "SecPlus Sensei Setup.exe"));
      var setupInUpd = findSetupExeInDir(updDir);
      if (setupInUpd) candidates.push(setupInUpd);
      for (var i = 0; i < candidates.length; i++) {
        if (candidates[i] && fs.existsSync(candidates[i]) && remoteVer && semverGt(remoteVer, APP_VERSION)) {
          best = { version: remoteVer, currentVersion: APP_VERSION, installerPath: candidates[i] };
          break;
        }
      }
    } catch (e) {}
  }

  if (!best && stagedVer && semverGt(stagedVer, APP_VERSION) && dismissed !== stagedVer) {
    var stagedSetup = findSetupExeInDir(updDir);
    if (stagedSetup) {
      best = { version: stagedVer, currentVersion: APP_VERSION, installerPath: stagedSetup };
    }
  }

  var docsDir = app.getPath("documents");
  var docsSetup = path.join(docsDir, "SecPlus Sensei Setup.exe");
  if (!best && fs.existsSync(docsSetup)) {
    var docsVer = readTextIfExists(path.join(docsDir, "SecPlus Sensei Setup.version.txt")) || stagedVer;
    if (docsVer && semverGt(docsVer, APP_VERSION) && dismissed !== docsVer) {
      best = { version: docsVer, currentVersion: APP_VERSION, installerPath: docsSetup };
    }
  }

  return best;
}

function launchInstallerSilent(installerPath) {
  if (process.platform === "win32") {
    var cmd = 'Start-Process -FilePath "' + installerPath.replace(/"/g, '""') + '" -ArgumentList "/S" -Verb RunAs';
    spawn("powershell.exe", ["-NoProfile", "-Command", cmd], { detached: true, stdio: "ignore" }).unref();
    return true;
  }
  shell.openPath(installerPath);
  return true;
}

function applyUpdateAndRelaunch(installerPath) {
  if (process.platform === "win32") {
    var appExe = process.execPath;
    var cmd =
      '$i="' + installerPath.replace(/"/g, '""') + '";' +
      '$a="' + appExe.replace(/"/g, '""') + '";' +
      'Start-Process -FilePath $i -ArgumentList "/S" -Wait -Verb RunAs;' +
      'Start-Sleep -Seconds 1;' +
      'Start-Process $a';
    spawn("powershell.exe", ["-NoProfile", "-Command", cmd], { detached: true, stdio: "ignore" }).unref();
    return true;
  }
  shell.openPath(installerPath);
  return true;
}

function launchInstaller(installerPath) {
  return launchInstallerSilent(installerPath);
}

function notifyUpdateAvailable(info) {
  if (!info || !mainWindow || mainWindow.isDestroyed()) return;
  try { mainWindow.webContents.send("update-available", info); } catch (e) {}
}

function backgroundUpdateCheck() {
  var info = checkForLocalUpdate();
  if (info) {
    pendingUpdate = info;
    notifyUpdateAvailable(info);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1120,
    height: 820,
    minWidth: 820,
    minHeight: 620,
    title: "SecPlus Sensei",
    icon: path.join(__dirname, "assets", "icon.ico"),
    backgroundColor: "#0a0e1c",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow = win;
  win.loadFile(path.join(__dirname, "secplus-sensei.html"));

  win.webContents.setWindowOpenHandler(function(details) {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  win.webContents.once("did-finish-load", function() {
    setTimeout(backgroundUpdateCheck, 1200);
  });

  win.on("close", function() {
    try { win.webContents.send("app-flush-save"); } catch (e) {}
  });

  win.on("closed", function() {
    if (mainWindow === win) mainWindow = null;
  });
}

ipcMain.handle("app-info", function() {
  return {
    version: APP_VERSION,
    userDataPath: app.getPath("userData"),
    progressPath: PROGRESS_FILE(),
    isDesktop: true
  };
});

ipcMain.handle("progress-load", function() {
  return readProgress();
});

ipcMain.handle("progress-save", function(_e, json) {
  writeProgress(json);
  return true;
});

ipcMain.on("progress-save-sync", function(e, json) {
  try {
    writeProgress(json);
    e.returnValue = true;
  } catch (err) {
    e.returnValue = false;
  }
});

ipcMain.handle("check-update", function() {
  var info = checkForLocalUpdate();
  if (info) pendingUpdate = info;
  return info;
});

ipcMain.handle("apply-update", function(_e, installerPath, relaunch) {
  if (!installerPath || !fs.existsSync(installerPath)) return { ok: false, error: "Installer not found" };
  updateInstalling = true;
  if (relaunch) applyUpdateAndRelaunch(installerPath);
  else launchInstallerSilent(installerPath);
  setTimeout(function() { app.quit(); }, 500);
  return { ok: true };
});

ipcMain.handle("run-update", function(_e, installerPath) {
  if (!installerPath || !fs.existsSync(installerPath)) return { ok: false, error: "Installer not found" };
  updateInstalling = true;
  applyUpdateAndRelaunch(installerPath);
  setTimeout(function() { app.quit(); }, 500);
  return { ok: true };
});

app.on("will-quit", function() {
  if (updateInstalling) return;
  var dismissed = readDismissedUpdate();
  var info = pendingUpdate || checkForLocalUpdate();
  if (info && info.installerPath && fs.existsSync(info.installerPath) && dismissed !== info.version) {
    launchInstallerSilent(info.installerPath);
  }
});

app.whenReady().then(function() {
  ensureDir(UPDATES_DIR());
  createWindow();
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});
