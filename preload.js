const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("SECPLUS_DESKTOP", {
  platform: process.platform,
  isDesktop: true,
  getAppInfo: function() { return ipcRenderer.invoke("app-info"); },
  loadProgress: function() { return ipcRenderer.invoke("progress-load"); },
  saveProgress: function(json) { return ipcRenderer.invoke("progress-save", json); },
  saveProgressSync: function(json) { return ipcRenderer.sendSync("progress-save-sync", json); },
  checkUpdate: function() { return ipcRenderer.invoke("check-update"); },
  applyUpdate: function(installerPath, relaunch) { return ipcRenderer.invoke("apply-update", installerPath, !!relaunch); },
  runUpdate: function(installerPath) { return ipcRenderer.invoke("apply-update", installerPath, true); },
  onUpdateAvailable: function(fn) {
    ipcRenderer.on("update-available", function(_e, info) { fn(info); });
  },
  onFlushSave: function(fn) {
    ipcRenderer.on("app-flush-save", function() { fn(); });
  }
});
