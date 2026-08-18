/**
 * Viewport-sized screenshots taken down a page, so a section can actually be
 * read. A full-page shot of a 13-screen document scales to unreadable.
 *
 * Usage: node scripts/strip.mjs /product [theme]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.env.BASE || "http://localhost:3000";
const path = process.argv[2] || "/";
const theme = process.argv[3] || "light";
const width = Number(process.env.W || 1440);
const height = Number(process.env.H || 900);
const outDir = process.env.OUT || "C:/Users/adiab/tenure-landing/.shots/strip";
mkdirSync(outDir, { recursive: true });

const slug = path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "_");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
await page.addInitScript((t) => {
  localStorage.setItem("tenure-theme", t);
  document.documentElement.setAttribute("data-theme", t);
}, theme);
await page.goto(base + path, { waitUntil: "networkidle" });
await page.addStyleTag({
  content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;
    transition-duration:0s!important;transition-delay:0s!important}
    .js [data-reveal]{opacity:1!important;transform:none!important}`,
});
await page.waitForTimeout(600);

const total = await page.evaluate(() => document.documentElement.scrollHeight);
const step = Math.round(height * 0.92);
let i = 0;
for (let y = 0; y < total; y += step) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${outDir}/${slug}-${theme}-${String(i).padStart(2, "0")}.png` });
  i++;
}
await browser.close();
console.log(`${slug}: ${i} frames, ${total}px`);
