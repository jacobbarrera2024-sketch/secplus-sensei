const path = require("path");
const { rcedit } = require("rcedit");

module.exports = async function embedExeIcon(context) {
  if (context.electronPlatformName !== "win32") {
    return;
  }

  const { packager, appOutDir } = context;
  const appInfo = packager.appInfo;
  const exePath = path.join(appOutDir, `${appInfo.productFilename}.exe`);
  const iconPath = path.join(packager.projectDir, "assets", "icon.ico");

  await rcedit(exePath, {
    icon: iconPath,
    "file-version": appInfo.shortVersion || appInfo.buildVersion,
    "product-version": appInfo.shortVersionWindows || appInfo.getVersionInWeirdWindowsForm(),
    "version-string": {
      FileDescription: appInfo.description || appInfo.productName,
      ProductName: appInfo.productName,
    },
  });

  console.log(`Embedded duck icon in ${exePath}`);
};
