# Portfolio website

A clean, professional single-page portfolio — **not** tied to any one project's visual style. Works as a hub for multiple projects over time.

## Preview locally

```bash
cd website
npx --yes serve .
```

Or open `index.html` in your browser.

## Add a new project

Duplicate the first `<article class="project-item">` block in `index.html` and fill in:

- Thumbnail image in `assets/` (project screenshot or icon)
- Title, description, tags
- Links (GitHub, live demo, case study)

Remove or hide the "Coming soon" placeholder when you have a second project.

## Personalize before sharing

Edit `index.html`:

| Item | Current placeholder |
|------|---------------------|
| LinkedIn | `https://www.linkedin.com/in/` |
| Email | `hello@example.com` |

## Deploy (GitHub Pages)

1. Repo **Settings → Pages → Source → GitHub Actions**
2. Push to `main` — workflow deploys `website/` automatically
3. Live at: **https://jacobbarrera2024-sketch.github.io/secplus-sensei/**

## Design

- Neutral light theme — works for any project type
- SecPlus Sensei appears only as one project card, not as site branding
- No build step required
