const fs = require("fs");
const path = require("path");

const projectDir = __dirname;
const distDir = path.resolve(projectDir, process.argv[2] || "dist");
const pkg = JSON.parse(fs.readFileSync(path.join(projectDir, "package.json"), "utf8"));
const ver = pkg.version;

if (!fs.existsSync(distDir)) {
  console.error("Dist folder not found:", distDir);
  process.exit(1);
}

function parseSemver(name) {
  var m = String(name).match(/Setup\s+([\d.]+)\.exe/i);
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

function pickSetupFile(distDir) {
  var ymlPath = path.join(distDir, "latest.yml");
  if (fs.existsSync(ymlPath)) {
    var ymlText = fs.readFileSync(ymlPath, "utf8");
    var m = ymlText.match(/^path:\s*(\S+)/m);
    if (m && fs.existsSync(path.join(distDir, m[1]))) return m[1];
  }
  var setups = fs.readdirSync(distDir).filter(function(f) {
    return /^SecPlus Sensei Setup.*\.exe$/i.test(f);
  });
  if (!setups.length) return null;
  var best = setups[0];
  setups.forEach(function(f) {
    var va = parseSemver(f) || "0.0.0";
    var vb = parseSemver(best) || "0.0.0";
    if (semverGt(va, vb)) best = f;
  });
  return best;
}

const setupFile = pickSetupFile(distDir);
if (!setupFile) {
  console.error("No SecPlus Sensei Setup *.exe in", distDir);
  process.exit(1);
}

const setupSrc = path.join(distDir, setupFile);
const docs = path.join(process.env.USERPROFILE || "", "Documents");
const upd = path.join(process.env.APPDATA || "", "SecPlus Sensei", "updates");

fs.mkdirSync(upd, { recursive: true });

function rmOldSetups(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(function(f) {
    if (/^SecPlus Sensei Setup/i.test(f) && f.endsWith(".exe")) {
      try { fs.unlinkSync(path.join(dir, f)); } catch (e) {}
    }
  });
}

rmOldSetups(upd);
rmOldSetups(docs);

var updDest = path.join(upd, setupFile);
var updGeneric = path.join(upd, "SecPlus Sensei Setup.exe");
var docsDest = path.join(docs, "SecPlus Sensei Setup.exe");

fs.copyFileSync(setupSrc, updDest);
fs.copyFileSync(setupSrc, updGeneric);
if (docs) fs.copyFileSync(setupSrc, docsDest);

function verifyCopy(label, src, dest) {
  if (!fs.existsSync(dest)) {
    console.error("Copy failed — missing:", dest);
    process.exit(1);
  }
  var a = fs.statSync(src).size;
  var b = fs.statSync(dest).size;
  if (a !== b) {
    console.error("Copy size mismatch for", label, a, "vs", b);
    process.exit(1);
  }
}

verifyCopy("updates/" + setupFile, setupSrc, updDest);
verifyCopy("updates/SecPlus Sensei Setup.exe", setupSrc, updGeneric);
if (docs) verifyCopy("Documents/SecPlus Sensei Setup.exe", setupSrc, docsDest);

if (fs.existsSync(path.join(distDir, "latest.yml"))) {
  fs.copyFileSync(path.join(distDir, "latest.yml"), path.join(upd, "latest.yml"));
}

const versionTxt = ver + "\n";
fs.writeFileSync(path.join(projectDir, "CURRENT_VERSION.txt"), versionTxt);
fs.writeFileSync(path.join(upd, "CURRENT_VERSION.txt"), versionTxt);

if (docs) {
  fs.writeFileSync(path.join(docs, "SecPlus Sensei Setup.version.txt"), versionTxt);
  fs.writeFileSync(
    path.join(docs, "RUN THIS INSTALLER.txt"),
    "Double-click this to update SecPlus Sensei:\r\n\r\n" +
    docs + "\\SecPlus Sensei Setup.exe\r\n\r\n" +
    "Current version: " + ver + "\r\n\r\n" +
    "On the first screen you should see INSTALLER v" + ver + " and an UPDATE button.\r\n"
  );
}

console.log("Staged v" + ver + " update:");
console.log("  ", updDest, "(" + fs.statSync(updDest).size + " bytes)");
console.log("  ", docsDest);
console.log("  ", path.join(docs, "RUN THIS INSTALLER.txt"));
