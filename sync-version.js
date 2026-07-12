const fs = require("fs");
const path = require("path");

const projectDir = __dirname;
const pkgPath = path.join(projectDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const ver = process.argv[2] || pkg.version;

if (!/^\d+\.\d+\.\d+$/.test(ver)) {
  console.error("Version must be semver like 1.0.4");
  process.exit(1);
}

pkg.version = ver;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

fs.writeFileSync(path.join(projectDir, "CURRENT_VERSION.txt"), ver + "\n");

const htmlPath = path.join(projectDir, "secplus-sensei.html");
let html = fs.readFileSync(htmlPath, "utf8");
html = html.replace(/var APP_VERSION="[^"]+"/, 'var APP_VERSION="' + ver + '"');
fs.writeFileSync(htmlPath, html);

const notePath = path.join(projectDir, "VERSION_NOTE.md");
if (fs.existsSync(notePath)) {
  let note = fs.readFileSync(notePath, "utf8");
  note = note.replace(/\*\*Current version\*\*\s*\n\n\*\*[\d.]+\*\*/,
    "**Current version**\n\n**" + ver + "**");
  note = note.replace(/`CURRENT_VERSION\.txt` \| Single line: `[\d.]+`/,
    "`CURRENT_VERSION.txt` | Single line: `" + ver + "`");
  note = note.replace(/`package\.json` \| `"version": "[\d.]+"`/,
    '`package.json` | `"version": "' + ver + '"`');
  note = note.replace(/`secplus-sensei\.html` \| `var APP_VERSION="[\d.]+"`/,
    '`secplus-sensei.html` | `var APP_VERSION="' + ver + '"`');
  fs.writeFileSync(notePath, note);
}

console.log("Synced version to", ver);
