# SheetDash

Browser-based **CSV → dashboard** — upload a spreadsheet and get instant charts plus a sortable table. No signup, no server upload.

Try it live: **https://jacobbarrera2024-sketch.github.io/secplus-sensei/sheet-dash/**

CSV dashboard tool — demonstrates **data visibility** for small businesses with privacy-first, client-side parsing.

---

## What it demonstrates

- Vanilla JavaScript CSV parsing (quoted fields, commas)
- Auto-detect numeric columns for charts
- CSS bar charts (no chart library dependency)
- Sortable data table (click column headers)
- Drag-and-drop file upload
- Privacy-first: file never leaves the browser

---

## Features

- Drop or browse for `.csv` files
- Summary stats: rows, columns, numeric fields
- Up to 2 bar charts (top 8 rows per numeric column)
- Sortable table (first 200 rows displayed)
- **Load sample** — freelance income scenario

---

## Run locally

```bash
git clone https://github.com/jacobbarrera2024-sketch/secplus-sensei.git
cd secplus-sensei/sheet-dash
npx --yes serve .
```

Open `http://localhost:3000`

---

## Deploy note

Edit files in `sheet-dash/` only. The copy under `website/sheet-dash/` is synced automatically when the portfolio site deploys.

---

## Author

**Jacob** — freelance developer.

- Portfolio: https://jacobbarrera2024-sketch.github.io/secplus-sensei/
- LinkedIn: https://www.linkedin.com/in/jacob-barrera-515683152

---

## License

MIT — Copyright (c) 2026 Jacob
