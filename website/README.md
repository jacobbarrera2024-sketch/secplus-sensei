# Portfolio website

Clean, professional single-page portfolio — neutral design that works for any project type.

## Preview locally

```bash
cd website
npx --yes serve .
```

## Personalize (one file)

Edit the `SITE` object at the top of **`main.js`**:

```javascript
var SITE = {
  name: "Jacob",
  linkedin: "https://www.linkedin.com/in/jacob-barrera-515683152",
  email: "jacobbarrera.jb@gmail.com",
  github: "https://github.com/jacobbarrera2024-sketch"
};
```

All contact links update automatically.

## Add a new project

Copy the `<article class="project-item">` block in `index.html` and update:

- Thumbnail in `assets/`
- Title, description, stats, tags
- GitHub / demo / case study links

## Deploy (GitHub Pages)

1. Repo **Settings → Pages → Source → GitHub Actions**
2. Push to `main` — workflow deploys `website/` automatically
3. Live at: **https://jacobbarrera2024-sketch.github.io/secplus-sensei/**

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and content |
| `styles.css` | All styles |
| `main.js` | Contact config, nav, animations |
| `assets/og-image.png` | Social preview when sharing on LinkedIn/Twitter |
| `manifest.json` | Add to Home Screen on iPhone |
| `404.html` | Custom not-found page |

No build step. No dependencies.
