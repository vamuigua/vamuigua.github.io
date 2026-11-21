// Automated QA against a running preview (`npm run preview`):
// axe-core accessibility scan, broken internal links/assets, horizontal
// overflow and console errors across desktop, tablet and phone viewports.
//   node scripts/qa.mjs
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

const BASE = process.env.SITE_URL ?? 'http://localhost:4321/';
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

const pages = ['', 'missions/zydii/', 'missions/powerwatch/', 'missions/never-nigh/', 'missions/restock/', '404.html'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 375, height: 812 },
];

const browser = await chromium.launch({ executablePath: CHROME });
let failures = 0;
const report = (ok, msg) => {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`);
};

// 1. Accessibility + console + overflow per page/viewport
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  for (const p of pages) {
    const errors = [];
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    // reveal everything so axe sees final colours
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-visible')));
    await page.evaluate(() => document.querySelectorAll('.is-locked').forEach((e) => e.classList.remove('is-locked')));
    await page.waitForTimeout(700);
    const label = `[${vp.name}] /${p}`;
    report(errors.length === 0, `${label} console errors: ${errors.length ? errors.join(' | ') : 'none'}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    report(overflow <= 0, `${label} horizontal overflow: ${overflow}px`);
    if (vp.name !== 'tablet') {
      await page.addScriptTag({ content: axeSource });
      const res = await page.evaluate(async () =>
        // @ts-ignore
        (await window.axe.run(document, { resultTypes: ['violations'] })).violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          n: v.nodes.length,
          sample: v.nodes.slice(0, 2).map((n) => n.target.join(' ')),
        })),
      );
      report(res.length === 0, `${label} axe violations: ${res.length ? JSON.stringify(res) : 'none'}`);
    }
  }
  await ctx.close();
}

// 2. Internal links & assets resolve
{
  const page = await browser.newPage();
  const seen = new Set();
  const toCheck = new Set();
  for (const p of pages.filter((p) => p !== '404.html')) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    const urls = await page.evaluate(() =>
      [...document.querySelectorAll('a[href], img[src], source[srcset], link[href], script[src], video[src]')].flatMap((el) => {
        const v = el.getAttribute('href') ?? el.getAttribute('src') ?? el.getAttribute('srcset') ?? '';
        return v.split(',').map((s) => s.trim().split(' ')[0]).filter(Boolean).map((u) => new URL(u, location.href).href);
      }),
    );
    urls.filter((u) => u.startsWith(new URL(BASE).origin)).forEach((u) => toCheck.add(u.split('#')[0]));
  }
  for (const u of toCheck) {
    if (seen.has(u)) continue;
    seen.add(u);
    const r = await page.request.get(u);
    if (r.status() >= 400) report(false, `broken internal link/asset ${r.status()} ${u}`);
  }
  report(true, `checked ${seen.size} internal URLs`);
  // legacy redirects
  for (const legacy of ['devfolio/zydii.html', 'devfolio/ninja_danger.html', 'devfolio/motorshop.html', 'devfolio/missions/powerwatch/']) {
    await page.goto(BASE + legacy);
    await page.waitForURL((u) => !u.pathname.startsWith('/devfolio'), { timeout: 5000 }).catch(() => {});
    report(/missions\/[\w-]+\/$/.test(page.url()) && !page.url().includes('/devfolio/'), `legacy /${legacy} redirects → ${page.url()}`);
  }
  await page.goto(BASE + 'devfolio/');
  await page.waitForURL((u) => !u.pathname.startsWith('/devfolio'), { timeout: 5000 }).catch(() => {});
  report(new URL(page.url()).pathname === '/', `legacy /devfolio/ redirects → ${page.url()}`);
  await page.close();
}

// 3. Interactions: filters, quick view, keyboard menu, reduced motion
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.click('[data-filter="game"]');
  const visible = await page.$$eval('[data-mission]:not([hidden])', (els) => els.length);
  report(visible === 4, `filter "Games" shows ${visible} missions (expected 4)`);
  await page.click('[data-filter="all"]');
  await page.keyboard.press('q');
  report(await page.$eval('#quickview', (d) => d.open), 'Q opens quick view');
  await page.keyboard.press('Escape');
  report(!(await page.$eval('#quickview', (d) => d.open)), 'Escape closes quick view');
  await page.focus('[data-menu-item]');
  await page.keyboard.press('ArrowDown');
  const active = await page.evaluate(() => document.activeElement?.textContent?.trim());
  report(/View projects/.test(active ?? ''), `ArrowDown moves start-menu focus (${active})`);
  const anim = await page.evaluate(() => {
    const el = document.querySelector('.objective__marker');
    return el ? getComputedStyle(el).animationDuration : 'n/a';
  });
  report(anim === '0.001ms' || anim === '1e-06s' || anim.startsWith('0'), `reduced motion disables animations (${anim})`);
  const unlocked = await page.$$eval('.ach.is-locked', (e) => e.length);
  report(unlocked === 0, 'reduced motion shows achievements unlocked');
  const cv = await page.request.get(BASE + 'Victor_Allen_Muigua_CV.pdf');
  report(cv.status() === 200 && (cv.headers()['content-type'] ?? '').includes('pdf'), `CV download served (${cv.status()})`);
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
