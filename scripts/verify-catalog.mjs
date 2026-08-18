// Real browser QA for the catalog page: loads the live (or local preview)
// site, clicks every play button, and verifies a working player actually
// appears for every single track - not just that the page returns 200.
//
// Usage:
//   node scripts/verify-catalog.mjs https://shed-studio-sync.netlify.app
//   node scripts/verify-catalog.mjs http://localhost:4321   (local preview)

import { chromium } from 'playwright';

const baseUrl = process.argv[2] || 'https://shed-studio-sync.netlify.app';

const browser = await chromium.launch();
const page = await browser.newPage();

const results = [];
let hadConsoleErrors = false;

page.on('pageerror', (err) => {
  hadConsoleErrors = true;
  console.error('PAGE ERROR:', err.message);
});

await page.goto(`${baseUrl}/catalog`, { waitUntil: 'networkidle' });

const cards = await page.locator('[data-track]').all();
console.log(`Found ${cards.length} track cards on ${baseUrl}/catalog\n`);

for (const [i, card] of cards.entries()) {
  const title = (await card.locator('h3').textContent())?.trim() ?? `(track ${i + 1})`;
  const button = card.locator('.vinyl-toggle');

  await button.click();
  await page.waitForTimeout(400); // let the click handler run and inject the player

  const slot = card.locator('.player-slot');
  const isHidden = await slot.evaluate((el) => el.classList.contains('hidden'));
  const iframeCount = await slot.locator('iframe').count();
  const audioCount = await slot.locator('audio').count();
  const spinning = await card.locator('.vinyl-disc').evaluate((el) => el.classList.contains('spinning'));

  const working = !isHidden && (iframeCount > 0 || audioCount > 0) && spinning;
  results.push({ title, working, iframeCount, audioCount, spinning, isHidden });

  console.log(`${working ? 'PASS' : 'FAIL'}  ${title}`);
  if (!working) {
    console.log(`      hidden=${isHidden} iframe=${iframeCount} audio=${audioCount} spinning=${spinning}`);
  }
}

const failed = results.filter((r) => !r.working);
console.log(`\n${results.length - failed.length}/${results.length} tracks working.`);
if (failed.length > 0) {
  console.log(`FAILED: ${failed.map((f) => f.title).join(', ')}`);
}
if (hadConsoleErrors) {
  console.log('Page threw JS errors during the run - see above.');
}

await browser.close();
process.exit(failed.length > 0 || hadConsoleErrors ? 1 : 0);
