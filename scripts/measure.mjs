/**
 * Page-length audit. Reports, per route, the document height in viewport
 * multiples, the visible word count, and the number of top-level sections —
 * the three numbers "the page is too long" actually decomposes into.
 *
 * Usage: node scripts/measure.mjs [/,/product,...]
 */
import { chromium } from "playwright";
import { routes } from "../src/lib/routes.ts";

const base = process.env.BASE || "http://localhost:3000";
const paths = process.argv[2] ? process.argv[2].split(",") : routes.map((r) => r.path);

const browser = await chromium.launch();
const rows = [];

for (const p of paths) {
  for (const v of [
    { tag: "desktop", width: 1440, height: 900 },
    { tag: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: v.width, height: v.height } });
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const m = await page.evaluate(() => {
      const text = document.body.innerText.replace(/\s+/g, " ").trim();
      return {
        height: document.documentElement.scrollHeight,
        vh: window.innerHeight,
        words: text.split(" ").filter(Boolean).length,
        sections: document.querySelectorAll("main > section, main > div > section").length,
        h2: document.querySelectorAll("h2").length,
        h3: document.querySelectorAll("h3").length,
        cards: document.querySelectorAll('[class*="rounded-2xl"],[class*="rounded-xl"]').length,
      };
    });
    rows.push({
      route: p,
      view: v.tag,
      screens: +(m.height / m.vh).toFixed(1),
      px: m.height,
      words: m.words,
      sections: m.sections,
      h2: m.h2,
      h3: m.h3,
      cards: m.cards,
    });
    await page.close();
  }
}
await browser.close();

const desktop = rows.filter((r) => r.view === "desktop");
console.table(desktop);
console.table(rows.filter((r) => r.view === "mobile"));
console.log(
  "TOTAL desktop screens:",
  desktop.reduce((a, r) => a + r.screens, 0).toFixed(1),
  "| words:",
  desktop.reduce((a, r) => a + r.words, 0),
);
