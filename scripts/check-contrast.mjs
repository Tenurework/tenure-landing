/**
 * WCAG 2.2 contrast gate for the design tokens.
 *
 * Parses the OKLCH values straight out of src/app/globals.css — so this checks
 * the tokens that actually ship, not a copy of them — converts OKLCH to linear
 * sRGB, and asserts every foreground/background pair the UI actually renders
 * meets its required ratio in BOTH themes.
 *
 * Thresholds (WCAG 2.2 AA):
 *   4.5:1  normal body text
 *   3.0:1  large text (>=24px, or >=18.66px bold)
 *   3.0:1  non-text: focus rings, borders that carry meaning, chart series
 *
 * Run: node scripts/check-contrast.mjs
 * Exits non-zero on any failure, so CI fails rather than shipping a regression.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const cssPath = join(here, "..", "src", "app", "globals.css");
const css = readFileSync(cssPath, "utf8");

/* ---------------------------------------------------------------- colour --- */

/** oklch(L% C H) or oklch(L% C H / a) -> {L, C, H} with L in 0..1 */
function parseOklch(value) {
  const m = value
    .trim()
    .match(/^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i);
  if (!m) return null;
  let L = parseFloat(m[1]);
  if (value.includes("%")) L /= 100;
  return { L, C: parseFloat(m[2]), H: parseFloat(m[3]), alpha: m[4] ? parseFloat(m[4]) : 1 };
}

/** OKLCH -> linear sRGB, gamut-clamped the way a browser would display it. */
function oklchToLinearRgb({ L, C, H }) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    clamp01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

function luminance(linearRgb) {
  const [r, g, b] = linearRgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function toHex(linearRgb) {
  const enc = (c) => {
    const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.round(clamp01(v) * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return "#" + linearRgb.map(enc).join("");
}

/* ----------------------------------------------------------- token blocks --- */

/**
 * Extracts `--name: oklch(...)` declarations from a specific CSS block.
 * Light comes from the bare `:root {` block; dark from `:root[data-theme="dark"]`.
 */
function extractBlock(startPattern) {
  const start = css.indexOf(startPattern);
  if (start === -1) throw new Error(`Could not find block: ${startPattern}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  let i = open;
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const body = css.slice(open + 1, i);
  const tokens = {};
  for (const m of body.matchAll(/--([a-z0-9-]+)\s*:\s*(oklch\([^)]*\))\s*;/gi)) {
    const parsed = parseOklch(m[2]);
    if (parsed && parsed.alpha === 1) tokens[m[1]] = parsed;
  }
  return tokens;
}

/*
  ONE THEME. The dark palette and its drift guard were deleted on 2026-08-20 with
  the theme itself. The guard existed because the dark values were declared twice
  — once under `prefers-color-scheme` and once under `[data-theme="dark"]` — and
  could drift apart. Neither block exists now, so there is nothing to keep in sync
  and every pair below is checked against the one palette the site ships.
*/
const themes = {
  light: extractBlock(":root {"),
};

/* ------------------------------------------------------------------ pairs --- */

/** [foreground, background, minimum, description] */
const PAIRS = [
  // Body and heading text on each surface
  ["text", "canvas", 4.5, "body text on page canvas"],
  ["text", "surface", 4.5, "body text on cards"],
  ["text", "surface-subtle", 4.5, "body text on alternating sections"],
  ["text", "surface-elevated", 4.5, "body text on elevated surfaces"],

  ["text-secondary", "canvas", 4.5, "secondary text on canvas"],
  ["text-secondary", "surface", 4.5, "secondary text on cards"],
  ["text-secondary", "surface-subtle", 4.5, "secondary text on alt sections"],

  // The token that produced 58 of the 177 measured failures.
  ["text-muted", "canvas", 4.5, "muted text / eyebrows on canvas"],
  ["text-muted", "surface", 4.5, "muted text on cards"],
  ["text-muted", "surface-subtle", 4.5, "muted text on alt sections"],

  // Inverse (navy) bands
  ["text-inverse", "inverse", 4.5, "text on inverse band"],
  ["text-inverse", "inverse-deep", 4.5, "text on deep inverse band"],
  ["text-inverse", "inverse-raised", 4.5, "text on raised inverse band"],

  // Accent. White-on-grove measured 4.24:1 before this change — the primary
  // CTA itself failed AA.
  ["on-accent", "accent", 4.5, "primary button label"],
  ["on-accent", "accent-hover", 4.5, "primary button label, hover"],
  ["on-accent", "accent-active", 4.5, "primary button label, active"],
  ["accent-text", "canvas", 4.5, "accent text on canvas"],
  ["accent-text", "surface", 4.5, "accent text on cards"],
  ["accent-text", "accent-subtle", 4.5, "accent text on accent chip"],
  ["accent-text", "accent-muted", 4.5, "accent text on faint accent fill"],

  // Status text on its own tint
  ["success", "success-subtle", 4.5, "success text on success chip"],
  ["warning", "warning-subtle", 4.5, "warning text on warning chip"],
  ["danger", "danger-subtle", 4.5, "danger text on danger chip"],
  ["info", "info-subtle", 4.5, "info text on info chip"],

  // Non-text: 3:1 is the AA requirement for UI components and focus indicators
  ["focus-ring", "canvas", 3, "focus ring on canvas"],
  ["focus-ring", "surface", 3, "focus ring on cards"],
  ["focus-ring-inverse", "inverse", 3, "focus ring on inverse band"],
  ["focus-ring-inverse", "inverse-deep", 3, "focus ring on deep inverse band"],
  ["border-strong", "canvas", 3, "meaningful border on canvas"],
  ["border-strong", "surface", 3, "meaningful border on cards"],

  // Chart series must be distinguishable from the plotting surface
  ["chart-1", "surface", 3, "chart series 1"],
  ["chart-2", "surface", 3, "chart series 2"],
  ["chart-3", "surface", 3, "chart series 3"],
  ["chart-4", "surface", 3, "chart series 4"],
  ["chart-5", "surface", 3, "chart series 5"],
  ["chart-6", "surface", 3, "chart series 6"],
];

/* ------------------------------------------------------------------- run --- */

let failures = 0;
let checks = 0;
const rows = [];

for (const [themeName, tokens] of Object.entries(themes)) {
  for (const [fgName, bgName, min, label] of PAIRS) {
    const fg = tokens[fgName];
    const bg = tokens[bgName];
    if (!fg || !bg) {
      console.error(`  MISSING  ${themeName}: --${!fg ? fgName : bgName} not found`);
      failures++;
      continue;
    }
    const fgRgb = oklchToLinearRgb(fg);
    const bgRgb = oklchToLinearRgb(bg);
    const ratio = contrast(fgRgb, bgRgb);
    const pass = ratio >= min;
    checks++;
    if (!pass) failures++;
    rows.push({
      theme: themeName,
      label,
      pair: `${fgName} on ${bgName}`,
      hex: `${toHex(fgRgb)} on ${toHex(bgRgb)}`,
      ratio: ratio.toFixed(2),
      min,
      pass,
    });
  }
}

const width = Math.max(...rows.map((r) => r.pair.length));
for (const r of rows) {
  const mark = r.pass ? "PASS" : "FAIL";
  const line = `  ${mark}  ${r.theme.padEnd(5)}  ${r.pair.padEnd(width)}  ${String(r.ratio).padStart(6)} : 1  (min ${r.min})  ${r.hex}  ${r.label}`;
  if (r.pass) console.log(line);
  else console.error(line);
}

console.log(
  `\n${checks - failures}/${checks} contrast checks passed across ${Object.keys(themes).length} themes.`,
);

if (failures > 0) {
  console.error(`\n${failures} contrast check(s) FAILED. Adjust the tokens in src/app/globals.css.`);
  process.exit(1);
}
console.log("All token contrast pairs meet WCAG 2.2 AA.");
