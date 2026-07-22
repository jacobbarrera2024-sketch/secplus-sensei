# AGENTS.md

## Cursor Cloud specific instructions

SecPlus Sensei is a single **Electron desktop app** (a CompTIA Security+ SY0-701 study
tool). The entire UI lives in `secplus-sensei.html`, loaded by `main.js` into a
`BrowserWindow`; there is no web server, backend, or database — progress persists to a
local `progress.json` under the OS user-data dir.

### Running the app (dev)

- Standard dev command is `npm start` (`electron .`). See `package.json` `scripts`.
- A display is available at `DISPLAY=:1`. Run e.g. `DISPLAY=:1 npm start`.
- **Headless GPU caveat (non-obvious):** the header renders a 3D "ninja duck" via
  Three.js/WebGL. In this cloud VM there is no real GPU, so `electron .` on its own
  paints a **black window** (the whole page fails to show). Launch Electron with the
  software-WebGL flag instead:
  `DISPLAY=:1 ./node_modules/.bin/electron . --enable-unsafe-swiftshader`
  With that flag the full UI (dashboard, quiz, flashcards) renders correctly. A brief
  white flash may appear when opening dropdowns — a harmless software-rendering
  artifact, not an app bug.
- Harmless startup noise: `Failed to connect to the bus` (DBus) and GPU/`viz` errors
  can be ignored in this environment.

### Lint / test / build

- There are **no lint or test scripts** defined in `package.json`; there is no test
  suite in this repo.
- `npm run build` / `npm run build:portable` use `electron-builder --win nsis`
  (Windows-only targets) and are not expected to produce output on Linux; they are for
  packaging the Windows installer on a dev PC, not for cloud dev iteration.

### Versioning

- Per `AI_VERSION_NOTE.md`, any code change should bump the version in all three of
  `CURRENT_VERSION.txt`, `package.json`, and `secplus-sensei.html` (or run
  `node sync-version.js <version>`).
