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

## Deploy (GitHub Pages)

This site is static (`index.html`, `styles.css`, `app.js`).

1. Repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` (or `arena/01a0bb67-arenaaiautomatemytask`) · folder `/ (root)`
4. Save — site is public at the URL above after a minute or two

Or enable via CLI:

```bash
gh api -X POST repos/davidoyetayo56-afk/arenaaiautomatemytask/pages \
  -f build_type=legacy \
  -f source='{"branch":"main","path":"/"}'
```

## Stack

- HTML5 · CSS3 (custom properties, keyframe animations)
- Vanilla JS (no build step)
- Google Fonts: DM Sans + JetBrains Mono

## License

MIT
