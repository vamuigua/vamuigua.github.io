// Generates public/<legacy>.html redirect stubs so links to the original
// portfolio's project pages (e.g. /devfolio/zydii.html) keep working.
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = '/devfolio/';
const map = {
  'index.html': null, // handled by Astro
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

mkdirSync('public', { recursive: true });
for (const [file, slug] of Object.entries(map)) {
  if (!slug) continue;
  const to = `${BASE}missions/${slug}/`;
  writeFileSync(
    `public/${file}`,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved</title>` +
      `<link rel="canonical" href="https://vamuigua.github.io${to}">` +
      `<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${to}">` +
      `<script>location.replace(${JSON.stringify(to)} + location.hash)</script></head>` +
      `<body><p>This page moved to <a href="${to}">${to}</a>.</p></body></html>\n`,
  );
}
console.log('redirect stubs written');
