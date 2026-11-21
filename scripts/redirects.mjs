// The site used to live at https://vamuigua.github.io/devfolio/ (first as a
// Bootstrap site, then as this Astro site). It now lives at the domain root.
// This writes redirect stubs into public/devfolio/ so old links keep working:
//   /devfolio/                 -> /
//   /devfolio/<old>.html       -> /missions/<slug>/   (original Bootstrap pages)
//   /devfolio/missions/<slug>/ -> /missions/<slug>/
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';

const SITE = 'https://vamuigua.github.io';
const OUT = 'public/devfolio';

const legacyPages = {
  'zydii.html': 'zydii',
  'remss.html': 'remss',
  'myparking.html': 'myparking',
  'motorshop.html': 'gemvist-motors',
  'restock.html': 'restock',
  'ninja_danger.html': 'ninja-danger',
  'never-nigh.html': 'never-nigh',
  'rgbs.html': 'rgbs',
  'reaction-time.html': 'reaction-time',
  'vue-weather.html': 'vue-weather',
  'stick-it.html': 'stick-it',
  'emall.html': 'e-mall',
};

const slugs = [...readFileSync('src/data/projects.ts', 'utf8').matchAll(/^\s*slug:\s*'([\w-]+)'/gm)].map((m) => m[1]);

const stub = (to) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved</title>` +
  `<link rel="canonical" href="${SITE}${to}">` +
  `<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${to}">` +
  `<script>location.replace(${JSON.stringify(to)} + location.hash)</script></head>` +
  `<body><p>This page moved to <a href="${to}">${SITE}${to}</a>.</p></body></html>\n`;

function write(path, to) {
  mkdirSync(path.replace(/\/[^/]+$/, ''), { recursive: true });
  writeFileSync(path, stub(to));
}

rmSync(OUT, { recursive: true, force: true });
write(`${OUT}/index.html`, '/');
for (const [file, slug] of Object.entries(legacyPages)) write(`${OUT}/${file}`, `/missions/${slug}/`);
for (const slug of slugs) write(`${OUT}/missions/${slug}/index.html`, `/missions/${slug}/`);
console.log(`redirect stubs written: ${1 + Object.keys(legacyPages).length + slugs.length}`);
