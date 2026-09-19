# Automate My Task

AI-powered workflow automation with **live animated examples** — every demo explains itself step by step.

![License](https://img.shields.io/badge/license-MIT-blue)
![Pages](https://img.shields.io/badge/demo-GitHub%20Pages-7c5cff)

## Live demo

**https://davidoyetayo56-afk.github.io/arenaaiautomatemytask/**

## What’s inside

- Modern dark/light UI with smooth scroll reveals
- Interactive “describe a task” runner that builds an animated plan
- 8 category examples (email, files, team, web) — each with a looping explanation animation
- Step lists that stay in sync with the animation
- Replay controls, theme toggle, mobile-friendly nav

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then visit `http://localhost:8080`.

## Deploy (GitHub Pages) — one-time setup

The repo is **public** and a deploy workflow is already on `main`.
You only need to flip Pages on once (GitHub requires the repo owner):

### Option A — Branch deploy (fastest)

1. Open **[Settings → Pages](https://github.com/davidoyetayo56-afk/arenaaiautomatemytask/settings/pages)**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Branch: **`main`** · folder: **`/ (root)`** → **Save**
4. Wait ~1 minute → site is live at the URL above

### Option B — GitHub Actions

1. Same Pages settings page
2. Source: **GitHub Actions**
3. Re-run the latest **Deploy to GitHub Pages** workflow under Actions
   (workflow file: `.github/workflows/pages.yml`)

## Stack

- HTML5 · CSS3 (custom properties, keyframe animations)
- Vanilla JS (no build step)
- Google Fonts: DM Sans + JetBrains Mono

## License

MIT
