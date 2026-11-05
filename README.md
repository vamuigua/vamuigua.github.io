# devfolio: Victor Allen Muigua

Personal portfolio of **Victor Allen Muigua**, Senior Full Stack Engineer (Nairobi). The concept is **Pixel Universe + RPG Developer**: a hand-coded pixel-art world (a campfire camp at dusk) wrapped around a clean, modern interface. The portfolio comes first and the game theme second, so everything a recruiter needs is one click away and nothing requires "playing".

- **Live (current production):** https://vamuigua.github.io/devfolio/
- **Design rationale & audit:** [docs/AUDIT.md](docs/AUDIT.md)

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | [Astro 7](https://astro.build) (static output) | Pre-rendered HTML for SEO and speed; no client framework |
| Styling | Plain modern CSS + design tokens (`src/styles/tokens.css`) | Small bespoke system, no build-time CSS framework |
| Pixel world | `src/scripts/scene.ts`, a 2D canvas at ~320×180, scaled with `image-rendering: pixelated` | ~5 KB gzipped, no art packs or licensing; pauses offscreen; static under reduced motion |
| Images | `astro:assets` → AVIF + WebP, responsive `srcset` | The original 26 MB of PNG screenshots now ship as a few KB each |
| Fonts | Fontsource: Bricolage Grotesque, Inter, Silkscreen (SIL OFL 1.1), self-hosted | No third-party requests |
| Icons | Lucide (ISC), inlined at build time; brand marks from Simple Icons (CC0) | No icon font, no runtime |
| Sound | WebAudio synth (`src/scripts/sound.ts`), off by default | No audio files |

Client JavaScript totals about 10 KB gzipped. All content works without JavaScript.

## Editing content

All copy lives in typed data files, so most updates never touch a component:

| File | What |
| --- | --- |
| `src/data/profile.ts` | Name, role, bio, links, certification, current objective, traits |
| `src/data/experience.ts` | Career chapters (roles, dates, key quests, stack) |
| `src/data/projects.ts` | Missions: summary, problem, contribution, stack, links, screenshot alt text |
| `src/data/skills.ts` | Skill tree: tier (`pro` / `shipped` / `training`) + evidence |
| `src/data/achievements.ts` | Verified milestones and secret achievements |

**Screenshots:** add to `src/assets/missions/<slug>/<slug>-<n>.png` and add one alt-text line per image to that mission's `shots` array. Missions with no screenshots get a generated pixel-art emblem (`emblem: '<lucide-icon-name>'`).

**CV:** replace `public/Victor_Allen_Muigua_CV.pdf` (keep the filename).

## Running locally

### Prerequisites

- **Node.js 22.23 or newer** (Astro 7 requirement; developed on Node 24). Check with `node -v`.
- **npm** (bundled with Node).
- **Git**.
- *Optional:* Google Chrome, which is only needed for the QA and OG-image scripts.

### 1. Clone and install

```bash
git clone https://github.com/vamuigua/devfolio.git
cd devfolio
git checkout feature/game-inspired-portfolio-redesign   # until the redesign is merged into main
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Open **http://localhost:4321/devfolio/**. The `/devfolio/` path is required because the site is configured for GitHub Pages at that base (`astro.config.mjs`), so `http://localhost:4321/` on its own shows a 404. Saving a file reloads the page automatically.

To use another port: `npm run dev -- --port 3000`.

### 3. Build and preview the production version

```bash
npm run build      # outputs the static site to dist/
npm run preview    # serves dist/ at http://localhost:4321/devfolio/
```

### Other commands

| Command | What it does |
| --- | --- |
| `npm run check` | Type-checks `.astro` and `.ts` files |
| `npm run qa` | Runs accessibility (axe-core), broken-link, overflow, console-error and interaction checks against a running server |
| `npm run og` | Regenerates `public/og.png` and the PNG favicons from the running site |
| `npm run redirects` | Regenerates the legacy `*.html` redirect stubs in `public/` |

`npm run qa` and `npm run og` drive your installed Chrome through `playwright-core`, so no browser download is needed. Start `npm run preview` (or `npm run dev`) in another terminal first. Set `CHROME_PATH` if Chrome isn't at the default Windows location, and `SITE_URL` if the server isn't at `http://localhost:4321/devfolio/`:

```bash
CHROME_PATH="/usr/bin/google-chrome" SITE_URL="http://localhost:4321/devfolio/" npm run qa
```

### Troubleshooting

- **404 at `localhost:4321`**: add `/devfolio/` to the URL.
- **`Unsupported engine` or Astro fails to start**: upgrade Node to 22.23 or newer.
- **Port already in use**: stop the other process or pass `--port` as shown above.
- **Images look stale after replacing a screenshot**: stop the server, delete `node_modules/.astro`, then run `npm run dev` again.

## Deploying (after approval)

The original site deploys from `main` with GitHub Pages' **legacy branch build**. This site needs a build step, so:

1. Merge the redesign branch into `main`.
2. In **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main`.

Do steps 1 and 2 together. With the legacy source still selected, `main` would serve this README instead of the site.

Links to the old project pages (`/devfolio/zydii.html` etc.) keep working through redirect stubs in `public/` (generated by `npm run redirects`).

## Repository layout

```
src/
  components/   UI sections (TitleScreen, Profile, Journey, Missions, SkillTree, Achievements, Contact…)
  data/         All site content (typed)
  layouts/      Base layout: SEO, HUD, quick view, toasts
  pages/        index, missions/[slug], 404, sitemap.xml
  scripts/      app.ts (interactions), scene.ts (pixel world), sound.ts
  styles/       tokens.css, global.css
public/         CV, favicons, og.png, redirect stubs, demo video
scripts/        og-image.mjs, qa.mjs, redirects.mjs
legacy/         The original Bootstrap site, kept for side-by-side review (safe to delete after approval)
```

## Easter eggs

There are a few, and none are required. Hints: a classic code, a friend at the camp, and exploring every region.
