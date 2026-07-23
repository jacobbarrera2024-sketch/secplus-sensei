# Split into separate repositories

The monorepo can be split into **5 standalone GitHub repos**. Run this on your **Windows desktop** (or any machine with `git` and `gh` logged in as **jacobbarrera2024-sketch**).

## What you get

| Repo name | Contents | Live URL (after Pages enabled) |
|-----------|----------|--------------------------------|
| `secplus-sensei` | Desktop app (existing) | GitHub Releases / repo only |
| `jacobbarrera2024-sketch.github.io` | Portfolio website | **https://jacobbarrera2024-sketch.github.io/** |
| `secplus-ai-demo` | AI assessment demo | https://jacobbarrera2024-sketch.github.io/secplus-ai-demo/ |
| `quick-quote` | Invoice / quote tool | https://jacobbarrera2024-sketch.github.io/quick-quote/ |
| `sheet-dash` | CSV dashboard | https://jacobbarrera2024-sketch.github.io/sheet-dash/ |

Your portfolio moves from `/secplus-sensei/` to the **root** URL — cleaner for Upwork and LinkedIn.

---

## Step 1 — Generate the repos locally

From the `secplus-sensei` repo root.

### Windows (Command Prompt — no bash needed)

```cmd
scripts\split-repos.bat
```

### Windows (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File scripts\split-into-repos.ps1
```

### Mac / Linux / Git Bash

```bash
bash scripts/split-into-repos.sh
```

This creates `../secplus-split/` with four ready-to-push git repos (demos + portfolio).

---

## Step 2 — Create GitHub repos and push

### Option A — No `gh` CLI (easiest on Windows CMD)

1. Open https://github.com/new while logged in as **jacobbarrera2024-sketch**
2. Create **four empty public repos** (no README, no .gitignore, no license):

   - `jacobbarrera2024-sketch.github.io`
   - `secplus-ai-demo`
   - `quick-quote`
   - `sheet-dash`

3. From `secplus-sensei` repo root:

```cmd
scripts\push-repos-manual.bat
```

Or push each folder yourself:

```cmd
cd C:\Users\Jacob\Documents\MyRobloxGame\secplus-split\jacobbarrera2024-sketch.github.io
git remote add origin https://github.com/jacobbarrera2024-sketch/jacobbarrera2024-sketch.github.io.git
git push -u origin main
```

Repeat for `secplus-ai-demo`, `quick-quote`, and `sheet-dash` (change folder name and repo URL each time).

### Option B — With GitHub CLI

Requires [GitHub CLI](https://cli.github.com/) logged in as **jacobbarrera2024-sketch** (`gh auth login`).

#### Windows (Command Prompt)

```cmd
scripts\push-repos.bat
```

### Windows (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File scripts\push-split-repos.ps1
```

### Mac / Linux / Git Bash

```bash
bash scripts/push-split-repos.sh ../secplus-split
```

Or manually:

```bash
cd ../secplus-split
GH=jacobbarrera2024-sketch

# Portfolio (special name → root github.io URL)
gh repo create $GH/jacobbarrera2024-sketch.github.io --public --source=jacobbarrera2024-sketch.github.io --remote=origin --push

# Demos
gh repo create $GH/secplus-ai-demo --public --source=secplus-ai-demo --remote=origin --push
gh repo create $GH/quick-quote --public --source=quick-quote --remote=origin --push
gh repo create $GH/sheet-dash --public --source=sheet-dash --remote=origin --push
```

If a repo already exists, skip `gh repo create` and instead:

```bash
cd secplus-ai-demo
git remote add origin https://github.com/jacobbarrera2024-sketch/secplus-ai-demo.git
git push -u origin main
```

---

## Step 3 — Enable GitHub Pages (each new repo)

**Do this BEFORE re-running failed deploys** if workflows already ran on push.

For **each** repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**

The included workflow `deploy-pages.yml` runs on push to `main`.

### If you see 404 after enabling Pages

The first deploy often **fails** if the workflow ran before Pages was set to GitHub Actions. Fix:

1. Confirm **Source: GitHub Actions** on that repo's Settings → Pages
2. Open the repo's **Actions** tab
3. Click the failed **Deploy to GitHub Pages** run (red X)
4. Click **Re-run all jobs** (top right)

Or: **Actions → Deploy to GitHub Pages → Run workflow → Run workflow**

Repeat for each demo repo. Wait 2–5 minutes after green checkmarks.

**Portfolio root** (should work once deploy succeeds): https://jacobbarrera2024-sketch.github.io/

**Demo URLs** (only work after their repo deploy succeeds):

- https://jacobbarrera2024-sketch.github.io/secplus-ai-demo/
- https://jacobbarrera2024-sketch.github.io/quick-quote/
- https://jacobbarrera2024-sketch.github.io/sheet-dash/

---

## Step 4 — Slim down `secplus-sensei` (optional)

After the split works, you can remove from the desktop repo:

- `ai-demo/`, `quick-quote/`, `sheet-dash/`, `website/`
- `.github/workflows/deploy-website.yml`

Keep the Electron app, docs, and point README links to the new URLs.

---

## Step 5 — Update LinkedIn / Upwork links

| Old | New |
|-----|-----|
| `.../secplus-sensei/` | `https://jacobbarrera2024-sketch.github.io/` |
| `.../secplus-sensei/ai-demo/` | `https://jacobbarrera2024-sketch.github.io/secplus-ai-demo/` |
| `.../secplus-sensei/quick-quote/` | `https://jacobbarrera2024-sketch.github.io/quick-quote/` |
| `.../secplus-sensei/sheet-dash/` | `https://jacobbarrera2024-sketch.github.io/sheet-dash/` |

---

## If you already split/pushed before this fix (broken links)

An earlier version of `split-into-repos.ps1` had a bug: some links on the
live demo sites render as `https://https://jacobbarrera2024-sketch.github.io/...`
or as a repo URL with a doubled path segment. This was a PowerShell
hashtable-ordering issue in the script — it's fixed now.

**Fix (Windows Command Prompt):**

```cmd
cd C:\Users\Jacob\Documents\MyRobloxGame\secplus-sensei
git pull origin cursor/split-repos-e295
scripts\split-repos.bat
```

This regenerates `../secplus-split/` with corrected links. Then force-push
just the three demo repos (safe here — they're brand-new solo repos with a
single commit each, no collaborators):

```cmd
cd ..\secplus-split\secplus-ai-demo
git push -u origin main --force

cd ..\quick-quote
git push -u origin main --force

cd ..\sheet-dash
git push -u origin main --force
```

You do **not** need to re-push the portfolio repo
(`jacobbarrera2024-sketch.github.io`) — it deployed correctly.

After pushing, each repo's **Deploy to GitHub Pages** workflow re-runs
automatically. Wait ~30 seconds, then re-check the live demo links from the
portfolio.

---

## Troubleshooting

- **`'bash' is not recognized`** (Windows CMD) — Use `scripts\split-repos.bat` and `scripts\push-repos-manual.bat` instead of the `.sh` scripts. Or open **Git Bash** (installed with Git for Windows) and run the bash commands there.
- **`'gh' is not recognized`** — You don't need GitHub CLI. Create the four repos on https://github.com/new (empty, no README), then run `scripts\push-repos-manual.bat`.
- **`gh: Resource not accessible`** — Run `gh auth login` on your machine as your GitHub account, or use Option A above without `gh`.
- **Pages 404** — Check **Actions** for a red X on "Deploy to GitHub Pages". If `configure-pages` failed, enable **Source: GitHub Actions** in repo Settings → Pages, then **Re-run all jobs**. The portfolio root may work while demos are still failing.
- **Portfolio icons missing** — Re-run deploy on demo repos first, then portfolio.
