# Screenshot guide

Add real app screenshots when you have them — the README and portfolio site intentionally omit wireframe placeholders until then.

## What to capture

| # | View | Filename | What to show |
|---|------|----------|--------------|
| 1 | **Dashboard** | `dashboard.png` | Readiness ring, stats, daily quests, domain bars |
| 2 | **Study** | `study.png` | A flashcard mid-review (front or back visible) |
| 3 | **Exam** | `exam.png` | Exam setup screen or results with scaled score |
| 4 | **Quiz** (optional) | `quiz.png` | A question with answer feedback |

## How to capture (Windows)

1. Open **SecPlus Sensei** (installed app or `npm start`)
2. Navigate to each view
3. Press **Win + Shift + S** → select area → save PNG
4. Drop files into `docs/screenshots/`
5. Add a Screenshots section to `README.md`:

```markdown
## Screenshots

<p align="center">
  <img src="docs/screenshots/dashboard.png" alt="Dashboard with readiness tracking" width="720" />
</p>

<p align="center">
  <img src="docs/screenshots/study.png" alt="Flashcard study view" width="350" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/exam.png" alt="Exam simulation" width="350" />
</p>
```

## Optional: demo video

A 60–90 second screen recording (Loom, OBS, or Win+G) walking through Dashboard → Study → Quiz is worth more than extra screenshots. Link it in LinkedIn Featured and Upwork portfolio.

## Portfolio website

Replace `website/assets/secplus-sensei-thumb.svg` with a real screenshot or a cropped app capture when ready.
