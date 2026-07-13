# Local finish steps

Run these on your home PC when you have ~20–30 minutes. Your repo and portfolio site are already live — this is polish, not a relaunch.

---

## 1. Capture three app screenshots (~10 min)

1. Open **SecPlus Sensei** (installed app or `npm start` in the project folder).
2. Navigate to each view and capture with **Win + Shift + S** (save as PNG):

| View | Save as |
|------|---------|
| Dashboard (readiness ring, stats, quests) | `docs\screenshots\dashboard.png` |
| Study (flashcard mid-review) | `docs\screenshots\study.png` |
| Exam (setup or results screen) | `docs\screenshots\exam.png` |

3. Replace any existing files in `docs\screenshots\` if prompted.

**Tip:** Maximize the app window first. Crop tight to the app — no desktop wallpaper or taskbar.

---

## 2. Push screenshots to GitHub

Open **Command Prompt** or **PowerShell** in the project folder:

```bat
cd C:\Users\Jacob\Documents\MyRobloxGame\secplus-sensei
git pull origin main
git add docs\screenshots\dashboard.png docs\screenshots\study.png docs\screenshots\exam.png
git commit -m "Add app screenshots"
git push origin main
```

If Git asks for identity on this machine:

```bat
git config user.email "jacobbarrera.jb@gmail.com"
git config user.name "Jacob Barrera"
```

---

## 3. Wire README + portfolio site

After the push, open **Cursor** on this project and ask:

> Screenshots are pushed — add them to the README and portfolio website.

That updates the GitHub README and the live site at  
https://jacobbarrera2024-sketch.github.io/secplus-sensei/

**Or do it yourself:** follow [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md).

---

## 4. Profile copy consistency (~5 min)

Your LinkedIn post uses the right numbers. Double-check these match everywhere:

| Location | Flashcards | Questions |
|----------|------------|-----------|
| GitHub README / case study | 452 | 481 (say **480+** in marketing copy) |
| LinkedIn About + Featured | 452 | **480+** (not 500+) |
| Upwork portfolio project | 452 | **480+**, dates **July 2026** |

No rush — just align when you edit profiles next.

---

## 5. Upwork (when you have Connects)

1. Buy or claim Connects (free monthly allotment or small pack).
2. Search **JavaScript** or **Electron**, filter **Entry level**.
3. Apply to 2–3 jobs that match desktop/web + optional AI — skip Expert/Senior posts and anything requiring Loom or code signing you don't have yet.
4. Rate: start around **$22–25/hr** on first bids; profile lists $30/hr.

---

## 6. GitHub housekeeping (optional)

- **Pin** the secplus-sensei repo on your GitHub profile (Profile → Customize → Pinned repositories).
- **Close** any open draft PRs you don't want merged (e.g. tooling/agent notes) — Profile → Your repositories → Pull requests.

---

## 7. Optional polish

- **Demo video:** 60–90 sec screen recording (Win + G or OBS): Dashboard → Study → Quiz. Add to LinkedIn Featured.
- **LinkedIn:** Pin your launch post to your profile if you haven't already.

---

## Quick reference

| Link | URL |
|------|-----|
| Live portfolio | https://jacobbarrera2024-sketch.github.io/secplus-sensei/ |
| GitHub repo | https://github.com/jacobbarrera2024-sketch/secplus-sensei |
| Case study | https://github.com/jacobbarrera2024-sketch/secplus-sensei/blob/main/docs/PORTFOLIO.md |
| LinkedIn | https://www.linkedin.com/in/jacob-barrera-515683152 |

---

*This file is for your local use only — it is not published to the public repo.*
