# Portfolio audit & redesign direction

_Prepared 2026-11-04 on branch `feature/game-inspired-portfolio-redesign`. Production commit at time of audit: `18b6992` (`main`)._

## Sources reviewed

- Live site at the time of the audit: https://vamuigua.github.io/devfolio/ (GitHub Pages, legacy build from `main` /root). The site now lives at https://vamuigua.github.io/
- Repository: `vamuigua/devfolio`: 13 HTML pages, Bootstrap 4 + jQuery template, ~26 MB of assets
- GitHub profile: 155 public repos (106 non-fork), 6 pinned, profile README
- CV: the Google Drive copy linked from the live site is **outdated**. The updated CV Victor supplied on 2026-11-04 is the source of truth (Solutech role, KCNA, .NET/Angular learning path). Copy is paraphrased, not lifted.
- Every outbound project link (checked live)

## 1. What currently works

- **Content exists for 12 projects**, with screenshots, a short description and a tech list each.
- **Clear contact path**: email, phone, LinkedIn and GitHub are all present.
- **Category filter** (Web / Mobile / Game) is a sensible idea.
- **CV is one click away** from the About section.
- Zero-build static hosting on GitHub Pages: simple and free.

## 2. What is outdated or ineffective

| Issue | Impact |
| --- | --- |
| Generic Bootstrap template (“DevFolio”), `< The Chief Engineer />` title | Forgettable; says nothing about Victor or gaming |
| No work experience on the site at all; Zydii and StepWise appear only in the CV | Recruiters can't see the career story without opening a PDF |
| About text: “close to 5 years” vs CV “4+ years”; typo “Larevel” in meta | Inconsistent, hurts credibility |
| 24 tech logos hot-linked from 5 third-party domains | Slow, fragile, and logos say nothing about depth |
| Project pages are 12 copies of one template; no problem/contribution story | Reads as a screenshot dump rather than engineering work |
| “Ninja Danger” title links to `remss.html` | Bug |
| `<meta name="…">` attributes are misused (content in the `name` attribute) | No usable SEO description or social preview |
| jQuery, Isotope, Owl, Venobox, Typed, Waypoints, CounterUp (9 vendor libraries) | Heavy for a static portfolio |
| Screenshots are uncompressed PNG (up to several MB each) | Slow on mobile data |
| `alt="img"` on almost every image | Fails accessibility |

### Broken links found

| Link | Status |
| --- | --- |
| `victorallenmuigua.xyz` (CV, GitHub profile & “Portfolio” field) | **Domain does not resolve (NXDOMAIN)** |
| `motorshop.victorallenmuigua.xyz` (Gemvist Motors demo) | **Down**: same domain |
| `remss.victorallenmuigua.xyz` / `remss.vicallendev.com` | **Down**: both domains NXDOMAIN |
| `car-parking.victorallenmuigua.xyz` + API docs | **Down** |
| `mall3.herokuapp.com` (e-MALL) | **404**: Heroku free tier retired |
| `reaction-time-game.netlify.app`, `vue-getweather.netlify.app`, `rgbs.netlify.app`, `stick-it-notes.netlify.app`, `vocastgames.itch.io/ninja-danger`, `zydii.com` | OK |

## 3. Missing content

- **Professional experience**: Solutech (Senior Full Stack Engineer, Oct 2024 to present), Zydii (Dec 2022 to Oct 2024), StepWise Inc. (Jun 2021 to Dec 2022), with outcomes.
- **Education**: Chuka University (BSc Applied Computer Science), Moringa School.
- **Engineering depth**: migrations, integrations (QuickBooks, Africa's Talking, M-Pesa, PayPal, Brevo), caching, CI/CD.
- **Backend/API work on GitHub** that never made the site: `webhook-machine` (pinned), `tdd-journey`, `tours_booking_app`, `k8_demos`.
- **Certifications**: KCNA (CNCF / Linux Foundation) is on the updated CV but on neither the site nor GitHub.
- **Gaming identity**: only a single “Hobbyist Game Dev” tagline.
- **SEO basics**: description, Open Graph image, canonical, structured data.

## 4. Projects that deserve prominence

**Main quests (featured)**: the strongest evidence of real-world engineering:

1. **Solutech (SAT platform)** and **Zydii**: professional, production, enterprise integrations (SAP, QuickBooks), measurable outcomes. Presented as role-based case files without confidential detail
2. **REMSS**: largest personal full-stack system; payments (M-Pesa, PayPal), invoicing, reporting; pinned, 3★
3. **myParking**: decoupled Laravel API + Vue 3 SPA, Sanctum auth, documented API
4. **Gemvist Motors**: Laravel marketplace with CI test workflows (MySQL + SQLite)
5. **REstock**: Flutter + Firebase cross-device sync

**Private projects (added at Victor's request, 2026-11-05)**: **PowerWatch** (IoT power-outage monitor: Laravel, MQTT, Flutter, ESP32) and **Meeting Minutes** (Nuxt 4 + LLM transcription pipeline) become main quests. Their repos are private, so the dossiers show a "Request a walkthrough" action instead of a code link, and they use generated pixel-art emblems because there are no screenshots.

**Game dev**: Ninja Danger (published on itch.io), **GravityPoint** (formerly Never Nigh; private repo `GravityPoint-2D`, revived Oct 2026 with milestones M0 to M5), The RGBs Game (PWA).

**Side quests**: Webhook Machine (pinned), Reaction Time, Vue Weather, TDD Journey, Tours Booking, Stick-it.

**Archived**: e-MALL (2018 group project, demo offline). Kept for history but de-emphasised.

**Left out**: 2017 bootcamp exercises (Ruby/Ember tutorials), forks, config repos, Flutter learning apps (`roll_dice_app`, `flutter_quiz_app`).

## 5. Information architecture

One fast, pre-rendered page, plus one static page per project:

```
/                      Title screen: who, what, CTAs (Explore · CV · Contact)
  #profile             Character profile: About, class, base, traits, current objective
  #journey             Career chapters: Solutech → Zydii → StepWise → Chuka → Moringa
  #missions            Projects: filterable (All · Web · Mobile · Games · APIs)
  #skills              Skill tree: Backend · Frontend · Mobile · Cloud & DevOps · Game dev
  #achievements        Verified milestones (+ two optional secret ones)
  #contact             Save point: email, LinkedIn, GitHub, CV
/missions/<slug>/      Mission dossier: brief, problem, contribution, stack, gallery, links
```

Recruiter shortcuts: a persistent nav using plain labels (“Experience”, not just “Journey”), a **Quick view** panel (one screen: role, stack, experience, CV, email), and CV/Contact always visible in the HUD. Nothing requires playing anything.

Old URLs (`restock.html`, `zydii.html`, …) redirect to their new dossier pages so existing links keep working.

## 6. Creative direction: “Dusk at the Highlands Camp”

The world is a **pixel-art highland valley at dusk**. Victor's character sits at a campfire with a laptop, the RPG **save point** where the journey is told. A single setting for the whole site: night sky, layered ridgelines, pines, fireflies and warm firelight. It is a cosy JRPG world, without cyberpunk or sci-fi.

- **The world is pixel; the interface is not.** Pixel art lives in the hero scene, section dividers, sprites, map nodes and achievement badges. All reading surfaces use crisp modern type on layered dark “glass” panels.
- **Palette**: deep indigo night (`#0B0D1A` to `#1A1E3A`), **ember amber** (`#FFB547`) for primary action and firelight, **moss/jade** (`#5EE6B0`) for progress and “unlocked” states, and dusty lavender for secondary text. Warm vs cool gives hierarchy without noise.
- **Type**: _Bricolage Grotesque_ (display, editorial character), _Inter_ (body/UI, readability), _Silkscreen_ (pixel font, used only for tiny HUD labels and eyebrows).
- **RPG mechanics, each with a job**:
  - Character sheet → fast “who is this” scan
  - Chapters → career timeline
  - Mission dossiers → project case studies with *problem / contribution / stack*
  - Skill tree → honest tiers (Professional · Shipped in projects · In training) with evidence links, no percentages
  - Achievements → verified milestones that unlock as you scroll
- **Motion**: slow ambient loops (fire, fireflies, twinkling), short UI easing (160 to 280 ms). Everything is disabled under `prefers-reduced-motion`.

## 7. Technical recommendations

- **Astro (static output)**: pre-rendered HTML for SEO and speed, data-driven pages from one `projects` data file, no client framework, and small TypeScript “islands” only where interaction is needed. It fits GitHub Pages via `base: '/devfolio'`.
- **Plain modern CSS** (custom properties, container-friendly layouts, `clamp()` type scale) instead of Tailwind. The design system is small and bespoke, and a single tokens file stays readable.
- **Pixel art drawn in code** (canvas at 320×180, scaled with `image-rendering: pixelated`). There are no external art packs, so there are no licensing questions, the payload is a few KB, and the scene is fully art-directable.
- **`astro:assets` + sharp** to convert the 26 MB of PNG screenshots to responsive WebP at build time.
- **Self-hosted fonts** via Fontsource (all SIL OFL 1.1) and **Lucide** icons (ISC) inlined at build time, so the site makes no third-party runtime requests.
- **Optional sound** is synthesised with WebAudio (no audio files) and off by default.
- **Deploy** with a GitHub Actions workflow that builds `dist/` and publishes to Pages. Switching Pages from “legacy branch” to “GitHub Actions” is a one-time settings change, deferred until approval.

### Not chosen (and why)

- **Three.js / React Three Fiber**: 3D adds GPU cost and doesn't serve a pixel-art world.
- **PixiJS / Phaser**: a game engine for one ambient scene would be 400 KB+ of runtime for what a 2D canvas handles in ~6 KB.
- **GSAP**: CSS transitions plus a tiny IntersectionObserver cover every animation here.
- **React/Vue**: the site has no shared client state, so a framework would only add bytes.

## Items for Victor to review

0. **Private & employer repos**: only PowerWatch, Meeting Minutes and GravityPoint from your private repos are shown, with no links. Solutech-Limited org repos are deliberately excluded; Solutech work stays at CV level, as you chose.
1. **KCNA**: ✅ Credly link added; the badge now links from the character sheet, achievements and quick view.
2. **Offline demos**: Gemvist Motors, REMSS and myParking. Renew the domain or redeploy, then add `live` URLs back in `src/data/projects.ts`.
3. **RabbitMQ and Nginx** appear on the old site but not on the current CV. They are shown under “shipped in projects”; remove them if you'd rather not claim them.
4. **Metrics** (40%, 25%, ~80%, 15%) are taken from the CV. Confirm you're comfortable showing them publicly.
5. **Solutech work** is described at the level of the CV only (SAT platform, SAP integration, Protobuf, fleet/logistics), with no client names or internals. Confirm that's within what you can share.
6. **CV download** now serves the updated PDF from the site itself (`public/Victor_Allen_Muigua_CV.pdf`) instead of the outdated Drive copy. It includes your phone number, which the old site already showed publicly.
7. The GitHub profile README still links to `victorallenmuigua.xyz`, which no longer resolves.
