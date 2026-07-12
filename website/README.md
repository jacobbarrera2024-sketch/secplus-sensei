# Portfolio website

A simple, self-contained showcase site for Jacob's work — featuring **SecPlus Sensei**.

## Preview locally

Open `index.html` in your browser, or run a quick server:

```bash
cd website
npx --yes serve .
# visit http://localhost:3000
```

## Before you share

Edit `index.html` and replace these placeholders:

| Placeholder | What to set |
|-------------|-------------|
| LinkedIn link (`id="linkedinLink"`) | Your real LinkedIn profile URL |
| Email link (`id="emailLink"`) | Your real email address |

## Deploy to GitHub Pages (free)

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to **repo Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main` — the workflow `.github/workflows/deploy-website.yml` publishes the `website/` folder automatically.
5. Your site will be live at:

   **https://jacobbarrera2024-sketch.github.io/secplus-sensei/**

   (GitHub username + repo name — adjust if your username differs.)

## Files

```
website/
├── index.html      # Single-page portfolio
├── styles.css      # All styles
├── main.js         # Mobile menu + scroll reveal
├── assets/         # App icon
└── README.md       # This file
```

No build step. No npm install. Just HTML, CSS, and JS.
