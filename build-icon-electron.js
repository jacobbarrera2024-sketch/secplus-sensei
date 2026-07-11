const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const pngToIco = require("png-to-ico");
const sharp = require("sharp");

async function buildIcon() {
  const size = 512;
  const win = new BrowserWindow({
    width: size,
    height: size,
    show: false,
    transparent: true,
    backgroundColor: "#00000000",
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  await win.loadFile(path.join(__dirname, "build-icon-render.html"));
  await win.webContents.executeJavaScript("window.waitForDuckReady()", true);
  await new Promise((r) => setTimeout(r, 300));

  const image = await win.capturePage();
  const assetsDir = path.join(__dirname, "assets");
  fs.mkdirSync(assetsDir, { recursive: true });

  const png512 = path.join(assetsDir, "icon-512.png");
  const pngOut = path.join(assetsDir, "icon.png");
  const icoOut = path.join(assetsDir, "icon.ico");
  const pngBuf = image.toPNG();
  const squarePng = await sharp(pngBuf)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync(png512, squarePng);
  fs.writeFileSync(pngOut, squarePng);

  const icoSizes = [16, 32, 48, 64, 128, 256];
  const icoBuffers = await Promise.all(
    icoSizes.map((s) => sharp(squarePng).resize(s, s).png().toBuffer())
  );
  fs.writeFileSync(icoOut, await pngToIco(icoBuffers));

  console.log("Created assets/icon.ico from the ninja duck 3D model");
}

app.whenReady()
  .then(buildIcon)
  .then(() => app.quit())
  .catch((err) => {
    console.error(err);
    app.exit(1);
  });
