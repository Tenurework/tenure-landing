/**
 * Writes one static SVG per contour seed into public/contours/.
 *
 * The contour backgrounds are deterministic decoration. Rendering them through
 * React put 60,349 gzipped bytes into the home document — 59.4% of the whole
 * transferred page — and again into the RSC flight payload, for something drawn
 * at 5-13% opacity. As static files they are fetched off the critical path,
 * content-hashed by the CDN, shared across every route, and absent from the
 * document entirely.
 *
 * Runs from `prebuild`, so `npm run build` regenerates them. Output is committed
 * so that a change to the generator shows up as a reviewable diff rather than
 * silently altering the site's backgrounds.
 *
 * Run: npm run build:contours
 */
import { mkdirSync, writeFileSync, readdirSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { gzipSync } from "node:zlib";
import { SEEDS, contourSvg } from "../src/lib/contours.ts";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "contours");

// Clear stale seeds so a removed call site does not leave an orphan file behind.
if (existsSync(outDir)) {
  for (const f of readdirSync(outDir)) {
    if (f.endsWith(".svg")) rmSync(join(outDir, f));
  }
}
mkdirSync(outDir, { recursive: true });

let raw = 0;
let gz = 0;
for (const seed of SEEDS) {
  const svg = contourSvg(seed);
  writeFileSync(join(outDir, `s${seed}.svg`), svg);
  raw += svg.length;
  gz += gzipSync(Buffer.from(svg)).length;
}

console.log(
  `Wrote ${SEEDS.length} contour SVGs to public/contours/ — ${Math.round(raw / 1024)} KB raw, ${Math.round(gz / 1024)} KB gzipped.`,
);
console.log("These are cached static assets; none of it ships in the HTML or the RSC payload.");
