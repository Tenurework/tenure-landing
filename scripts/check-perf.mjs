/**
 * Lighthouse budget gate.
 *
 * The development bible (§13) sets numeric targets on mobile production builds
 * and says to use real measurements rather than visual intuition. Until this
 * script existed the payload reduction was measured but the scores were not, so
 * §13 was the one gate carrying an unverified claim.
 *
 * This is a *lab* measurement against a local `next start`, with Lighthouse's
 * simulated Slow-4G throttling. It is not field data: there is no real network
 * in front of it and no real device. It is reproducible and it is honest about
 * what it is, which is what the gate needs.
 *
 * Run: npm run build && npm run start -- -p 3100   (in one terminal)
 *      npm run check:perf                          (in another)
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { routes } from "../src/lib/routes.ts";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "lighthouse-reports");

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const RUNS = Number(process.argv.find((a) => a.startsWith("--runs="))?.slice(7) ?? 1);

/** §13. Scores are 0-100, LCP/TBT are milliseconds, CLS is unitless. */
const BUDGETS = {
  performance: { min: 90, label: "Performance" },
  accessibility: { min: 95, label: "Accessibility" },
  "best-practices": { min: 95, label: "Best Practices" },
  seo: { min: 95, label: "SEO" },
};
const METRIC_BUDGETS = {
  "largest-contentful-paint": { max: 2500, label: "LCP", unit: "ms" },
  "cumulative-layout-shift": { max: 0.1, label: "CLS", unit: "" },
  // The bible asks for an INP proxy. Total Blocking Time is the lab proxy
  // Lighthouse actually computes; INP itself needs real interactions.
  "total-blocking-time": { max: 200, label: "TBT (INP proxy)", unit: "ms" },
};

const targets = (ONLY ? routes.filter((r) => r.path === ONLY) : routes).map((r) => r.path);
if (!targets.length) {
  console.error(`No route matched --only=${ONLY}. Known: ${routes.map((r) => r.path).join(", ")}`);
  process.exit(1);
}

/** Median is stabler than a mean when one run hits a stray GC pause. */
function median(values) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

const results = [];
try {
  for (const path of targets) {
    const url = `${BASE}${path}`;
    const runs = [];

    for (let i = 0; i < RUNS; i++) {
      const run = await lighthouse(
        url,
        {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          formFactor: "mobile",
          screenEmulation: {
            mobile: true,
            width: 412,
            height: 823,
            deviceScaleFactor: 1.75,
            disabled: false,
          },
          throttlingMethod: "simulate",
          onlyCategories: Object.keys(BUDGETS),
        },
        undefined,
      );
      if (!run?.lhr) throw new Error(`Lighthouse returned nothing for ${url}`);
      runs.push(run);
    }

    const lhr = runs[runs.length - 1].lhr;
    const scores = {};
    for (const key of Object.keys(BUDGETS)) {
      scores[key] = Math.round(median(runs.map((r) => r.lhr.categories[key].score * 100)));
    }
    const metrics = {};
    for (const key of Object.keys(METRIC_BUDGETS)) {
      metrics[key] = median(runs.map((r) => r.lhr.audits[key].numericValue));
    }

    results.push({ path, scores, metrics });

    mkdirSync(outDir, { recursive: true });
    const slug = path === "/" ? "home" : path.replace(/\//g, "-").replace(/^-/, "");
    writeFileSync(join(outDir, `${slug}.json`), JSON.stringify(lhr, null, 2));

    const line = Object.entries(scores)
      .map(([k, v]) => `${BUDGETS[k].label} ${v}`)
      .join(" · ");
    console.log(`${path.padEnd(10)} ${line}`);
  }
} finally {
  // chrome-launcher removes its temp profile on kill, and on Windows Chrome often
  // still holds a handle for a moment — an EPERM there would otherwise throw away
  // a completed measurement run. The directory is in the OS temp folder either way.
  try {
    await chrome.kill();
  } catch (err) {
    console.warn(`Chrome cleanup failed (harmless): ${err.message}`);
  }
}

console.log(`\n${"Route".padEnd(10)} ${"Perf".padStart(5)} ${"A11y".padStart(5)} ${"BP".padStart(5)} ${"SEO".padStart(5)} ${"LCP".padStart(8)} ${"CLS".padStart(6)} ${"TBT".padStart(7)}`);

const failures = [];
for (const { path, scores, metrics } of results) {
  const lcp = metrics["largest-contentful-paint"];
  const cls = metrics["cumulative-layout-shift"];
  const tbt = metrics["total-blocking-time"];
  console.log(
    `${path.padEnd(10)} ${String(scores.performance).padStart(5)} ${String(scores.accessibility).padStart(5)} ${String(scores["best-practices"]).padStart(5)} ${String(scores.seo).padStart(5)} ${`${Math.round(lcp)}ms`.padStart(8)} ${cls.toFixed(3).padStart(6)} ${`${Math.round(tbt)}ms`.padStart(7)}`,
  );

  for (const [key, budget] of Object.entries(BUDGETS)) {
    if (scores[key] < budget.min) {
      failures.push(`${path}: ${budget.label} ${scores[key]} is below the ${budget.min} budget`);
    }
  }
  for (const [key, budget] of Object.entries(METRIC_BUDGETS)) {
    const value = metrics[key];
    if (value > budget.max) {
      const fmt = (v) => (budget.unit === "ms" ? `${Math.round(v)}ms` : v.toFixed(3));
      failures.push(`${path}: ${budget.label} ${fmt(value)} exceeds the ${fmt(budget.max)} budget`);
    }
  }
}

console.log(`\nReports written to lighthouse-reports/ (gitignored).`);
console.log(`Lab run: ${RUNS} run(s) per route, mobile emulation, simulated throttling.`);

if (failures.length) {
  console.error(`\n${failures.length} budget failure(s):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`\nAll ${results.length} route(s) meet every §13 budget.`);
