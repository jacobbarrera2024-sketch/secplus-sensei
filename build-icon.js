const { spawnSync } = require("child_process");
const path = require("path");
const electron = require("electron");

const result = spawnSync(electron, [path.join(__dirname, "build-icon-electron.js")], {
  cwd: __dirname,
  stdio: "inherit",
  env: { ...process.env, ELECTRON_RUN_AS_NODE: undefined },
});

process.exit(result.status ?? 1);
