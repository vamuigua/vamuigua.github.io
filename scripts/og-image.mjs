// Renders the social preview (public/og.png) and PNG icons from the real site
// using the locally installed Chrome. Run against `npm run preview`:
//   npm run build && npm run preview  (in another terminal)
//   node scripts/og-image.mjs
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const BASE = process.env.SITE_URL ?? 'http://localhost:4321/devfolio/';
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.addStyleTag({
  content: `.hud,.title__menu,.title__scroll,.title__intro,.title__stats{display:none!important}
  .title{min-height:630px!important}
  .title__content{padding-top:150px!important}`,
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'public/og.png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

await sharp('public/favicon.svg', { density: 384 }).resize(64, 64, { kernel: 'nearest' }).png().toFile('public/favicon.png');
await sharp('public/favicon.svg', { density: 768 }).resize(180, 180, { kernel: 'nearest' }).png().toFile('public/apple-touch-icon.png');
console.log('og.png, favicon.png, apple-touch-icon.png written');
