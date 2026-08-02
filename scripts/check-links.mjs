/**
 * Static internal-link checker.
 *
 * Reads the prerendered HTML in .next/server/app and asserts that every
 * internal href resolves to a declared route, a real file in public/, or an
 * in-page anchor that exists in the document that links to it. Runs in about a
 * second and needs no server, so it can gate a commit; e2e/nav.spec.ts does the
 * same job against the live server for the cases only a browser can see.
 *
 * Run: npm run check:links   (after npm run build)
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { routes } from "../src/lib/routes.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const appDir = join(root, ".next", "server", "app");
const publicDir = join(root, "public");

if (!existsSync(appDir)) {
  console.error("No build output at .next/server/app — run `npm run build` first.");
  process.exit(1);
}

const knownRoutes = new Set(routes.map((r) => r.path));
// Routes Next generates that are not in routes.ts but are legitimate targets.
const extraRoutes = new Set(["/robots.txt", "/sitemap.xml", "/icon.svg"]);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (entry.endsWith(".html")) out.push(p);
  }
  return out;
}

const pages = walk(appDir);
const problems = [];
let checked = 0;

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const label = file.slice(appDir.length + 1).replace(/\\/g, "/");

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const hrefs = [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map((m) => m[1]);

  for (const href of new Set(hrefs)) {
    checked++;

    // External, mail and tel links are validated by nav.spec.ts (rel/target).
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;

    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (id && !ids.has(id)) {
        problems.push(`${label}: in-page anchor "${href}" has no matching id`);
      }
      continue;
    }

    if (!href.startsWith("/")) {
      problems.push(`${label}: relative href "${href}" — use a root-relative path`);
      continue;
    }

    const [path, hash] = href.split("#");
    const clean = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

    if (knownRoutes.has(clean) || extraRoutes.has(clean)) {
      // A cross-page anchor cannot be verified statically; nav.spec covers it.
      if (hash) continue;
      continue;
    }

    if (existsSync(join(publicDir, clean))) continue;

    problems.push(
      `${label}: "${href}" is not a declared route (src/lib/routes.ts) or a file in public/`,
    );
  }
}

console.log(`Checked ${checked} links across ${pages.length} prerendered pages.`);

if (problems.length) {
  console.error(`\n${problems.length} broken internal link(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log("No broken internal links.");
