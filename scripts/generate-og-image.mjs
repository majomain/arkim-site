import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'og-image.html');
const outPath = path.join(__dirname, '../uploads/og-image.png');

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

const stats = fs.statSync(outPath);
console.log(`Wrote ${outPath} (${Math.round(stats.size / 1024)} KB)`);
