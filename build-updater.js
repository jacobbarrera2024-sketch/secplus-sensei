const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectDir = __dirname;
const updaterNsi = path.join(projectDir, "build", "updater.nsi");
const updaterExe = path.join(projectDir, "build", "SecPlus Sensei Updater.exe");

async function main() {
  if (!fs.existsSync(updaterNsi)) {
    throw new Error("Missing build/updater.nsi");
  }

  const { getBinFromUrl } = require("app-builder-lib/out/binDownload");
  const nsisDir = await getBinFromUrl(
    "nsis",
    "3.0.4.1",
    "VKMiizYdmNdJOWpRGz4trl4lD++BvYP2irAXpMilheUP0pc93iKlWAoP843Vlraj8YG19CVn0j+dCo/hURz9+Q=="
  );
  const makensis = path.join(nsisDir, "Bin", "makensis.exe");
  if (!fs.existsSync(makensis)) {
    throw new Error("makensis.exe not found at " + makensis);
  }

  console.log("Using", makensis);
  execFileSync(makensis, ["/V2", updaterNsi], { stdio: "inherit", cwd: projectDir });

  if (!fs.existsSync(updaterExe)) {
    throw new Error("Updater exe was not created at " + updaterExe);
  }
  console.log("Created", updaterExe);
}

main().catch(function(err) {
  console.error(err && err.message ? err.message : err);
  process.exit(1);
});
