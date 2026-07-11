/**
 * One-shot fix: embed duck icon in the installed SecPlus Sensei.exe
 * and refresh desktop + Start Menu shortcuts to use appIcon.ico.
 *
 * Run from project folder:  node fix-installed-icon.js
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");
const { rcedit } = require("rcedit");

const PRODUCT = "SecPlus Sensei";
const UNINSTALL_KEY =
  "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\3686bf70-8cef-5970-b83c-ce8707707bb8";

function findInstallDir() {
  try {
    const out = execSync(`reg query "${UNINSTALL_KEY}" /v UninstallString`, {
      encoding: "utf8",
    });
    const m = out.match(/UninstallString\s+REG_SZ\s+"(.+?)"/);
    if (m) {
      const uninstaller = m[1].replace(/\\ /g, " ");
      const dir = path.dirname(uninstaller);
      if (fs.existsSync(path.join(dir, `${PRODUCT}.exe`))) return dir;
    }
  } catch (_) {}

  const candidates = [
    path.join(process.env.ProgramFiles || "C:\\Program Files", PRODUCT, PRODUCT),
    path.join(process.env.ProgramFiles || "C:\\Program Files", PRODUCT),
    path.join(process.env.USERPROFILE || "", "Desktop", PRODUCT),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, `${PRODUCT}.exe`))) return dir;
  }
  return null;
}

function refreshShortcut(lnkPath, targetExe, iconIco) {
  const script = [
    "$ws = New-Object -ComObject WScript.Shell",
    `$sc = $ws.CreateShortcut('${lnkPath.replace(/'/g, "''")}')`,
    `$sc.TargetPath = '${targetExe.replace(/'/g, "''")}'`,
    `$sc.WorkingDirectory = '${path.dirname(targetExe).replace(/'/g, "''")}'`,
    `$sc.IconLocation = '${iconIco.replace(/'/g, "''")},0'`,
    "$sc.Description = 'CompTIA Security+ SY0-701 study app'",
    "$sc.Save()",
  ].join("; ");
  const tmp = path.join(os.tmpdir(), "secplus-fix-shortcut.ps1");
  fs.writeFileSync(tmp, script, "utf8");
  execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tmp}"`, { stdio: "inherit" });
  try { fs.unlinkSync(tmp); } catch (_) {}
}

async function main() {
  const projectDir = __dirname;
  const srcIcon = path.join(projectDir, "assets", "icon.ico");
  if (!fs.existsSync(srcIcon)) {
    console.error("Missing assets/icon.ico — run: node build-icon.js");
    process.exit(1);
  }

  const installDir = findInstallDir();
  if (!installDir) {
    console.error("Could not find SecPlus Sensei install folder.");
    process.exit(1);
  }

  const exePath = path.join(installDir, `${PRODUCT}.exe`);
  const iconDest = path.join(installDir, "appIcon.ico");
  fs.copyFileSync(srcIcon, iconDest);

  console.log("Embedding duck icon in:", exePath);
  await rcedit(exePath, { icon: srcIcon });

  const shortcuts = [
    path.join(process.env.USERPROFILE, "Desktop", `${PRODUCT}.lnk`),
    path.join(
      process.env.ProgramData || "C:\\ProgramData",
      "Microsoft", "Windows", "Start Menu", "Programs",
      PRODUCT, `${PRODUCT}.lnk`
    ),
    path.join(
      process.env.ProgramData || "C:\\ProgramData",
      "Microsoft", "Windows", "Start Menu", "Programs",
      `${PRODUCT}.lnk`
    ),
  ];

  for (const lnk of shortcuts) {
    try {
      refreshShortcut(lnk, exePath, iconDest);
      console.log("Updated shortcut:", lnk);
    } catch (e) {
      console.log("Skipped shortcut:", lnk, "-", e.message);
    }
  }

  console.log("\nDone. If the old atom icon still shows, delete the desktop shortcut and drag a fresh one from Start Menu.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
