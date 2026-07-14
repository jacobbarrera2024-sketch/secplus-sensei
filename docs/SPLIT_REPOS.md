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

Requires [GitHub CLI](https://cli.github.com/) logged in as **jacobbarrera2024-sketch** (`gh auth login`).

### Windows (Command Prompt)

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

For **each** repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**

The included workflow `deploy-pages.yml` runs on push to `main`.

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

## Troubleshooting

- **`'bash' is not recognized`** (Windows CMD) — Use `scripts\split-repos.bat` and `scripts\push-repos.bat` instead of the `.sh` scripts. Or open **Git Bash** (installed with Git for Windows) and run the bash commands there.
- **`gh: Resource not accessible`** — Run `gh auth login` on your machine as your GitHub account.
- **Pages 404** — Wait 2–5 min after first deploy; confirm Actions tab shows green checkmark.
- **Portfolio icons missing** — Re-run deploy on demo repos first, then portfolio.
