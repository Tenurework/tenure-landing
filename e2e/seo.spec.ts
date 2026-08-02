import { test, expect, type Page } from "@playwright/test";
import { PROD_ORIGIN, head, routes } from "./support";
import { indexableRoutes } from "../src/lib/routes";
import { site } from "../src/lib/site";

/**
 * SEO, indexing and structured data.
 *
 * This suite exists because of one specific regression: every sub-page used to
 * declare the HOME PAGE as its canonical URL and inherit the home page's
 * og:title / og:url. Search engines were being told /product, /pilot and /trust
 * were duplicates of /. Next merges metadata shallowly, so a route that simply
 * forgets `alternates` silently re-creates that bug — nothing throws, nothing
 * looks wrong in the browser, and the site quietly de-ranks.
 *
 * Everything below is driven off src/lib/routes.ts, so a new route is covered
 * the moment it is registered. The three assertions that make reintroducing the
 * original bug impossible are:
 *   - every canonical is DISTINCT from every other route's,
 *   - og:url equals that route's own canonical,
 *   - no two routes share a title or a description.
 */

/** The canonical URL a route must declare. `/` maps to the bare origin. */
function canonicalFor(path: string) {
  return path === "/" ? PROD_ORIGIN : `${PROD_ORIGIN}${path}`;
}

/**
 * Metadata is prerendered into the served HTML, so there is nothing to wait for
 * beyond the document itself. `domcontentloaded` keeps ~70 navigations honest
 * without waiting on fonts and images that no assertion here reads.
 */
async function open(page: Page, path: string) {
  return page.goto(path, { waitUntil: "domcontentloaded" });
}

/** A path that is guaranteed not to match a route, for the 404 assertions. */
const UNMATCHED_PATH = "/this-route-does-not-exist-4f2a91";

/** Search results truncate long descriptions; too short is a thin-content signal. */
const DESCRIPTION_MIN = 50;
const DESCRIPTION_MAX = 165;

/**
 * Routes whose description in src/lib/routes.ts is currently longer than a
 * search result will render (`/` is 191 chars, `/trust` is 169). Real defect,
 * owned by src/lib/routes.ts — the length test is marked fixme for these two
 * only, so every other route is still held to the limit. Delete the entry once
 * the copy is shortened.
 */
const KNOWN_OVERLONG_DESCRIPTIONS: string[] = [];

/** Open Graph "large card" ratio, 1200x630. */
const OG_ASPECT = 1200 / 630;

// ---------------------------------------------------------------------------
// Per-route metadata. Driven off routes.ts so new routes are covered for free.
// ---------------------------------------------------------------------------

for (const route of routes) {
  const { path } = route;

  test(`${path} · title and description are route-specific and match routes.ts`, async ({
    page,
  }) => {
    await open(page, path);

    const title = await page.title();
    expect(title, "page declares a non-empty <title>").not.toBe("");
    expect(title, "title carries the brand").toContain(site.name);
    expect(title, `title is specific to "${route.title}"`).toContain(route.title);
    // Not the SERP truncation point — a ceiling that catches a description or a
    // whole sentence pasted into the title slot.
    expect(title.length, "title is not absurdly long").toBeLessThanOrEqual(90);

    const description = await head(page, 'meta[name="description"]');
    expect(description, "route declares its own meta description").toBe(
      route.description,
    );
  });

  const lengthTitle = `${path} · meta description length fits a search result`;
  const lengthBody = async ({ page }: { page: Page }) => {
    await open(page, path);
    const description = (await head(page, 'meta[name="description"]')) ?? "";
    expect(
      description.length,
      `description is ${description.length} chars; search results want ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}`,
    ).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
    expect(
      description.length,
      `description is ${description.length} chars; search results want ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}`,
    ).toBeLessThanOrEqual(DESCRIPTION_MAX);
  };
  if (KNOWN_OVERLONG_DESCRIPTIONS.includes(path)) {
    // Fails today: the copy in src/lib/routes.ts exceeds DESCRIPTION_MAX.
    test.fixme(lengthTitle, lengthBody);
  } else {
    test(lengthTitle, lengthBody);
  }

  test(`${path} · canonical points at exactly this route on the production origin`, async ({
    page,
  }) => {
    await open(page, path);

    const canonical = await head(page, 'link[rel="canonical"]', "href");
    expect(canonical, "route declares a canonical").not.toBeNull();
    // The historical bug: this was the home page URL on every sub-page.
    expect(canonical, "canonical is this route's own production URL").toBe(
      canonicalFor(path),
    );

    const links = await page.locator('head link[rel="canonical"]').count();
    expect(links, "exactly one canonical link").toBe(1);
  });

  test(`${path} · OpenGraph block is complete and route-specific`, async ({ page }) => {
    await open(page, path);

    const title = await page.title();
    const ogTitle = await head(page, 'meta[property="og:title"]');
    const ogDescription = await head(page, 'meta[property="og:description"]');
    const ogUrl = await head(page, 'meta[property="og:url"]');
    const ogImage = await head(page, 'meta[property="og:image"]');
    const ogType = await head(page, 'meta[property="og:type"]');
    const ogSiteName = await head(page, 'meta[property="og:site_name"]');

    expect(ogType, "og:type").toBe("website");
    expect(ogSiteName, "og:site_name").toBe(site.name);

    // og:title used to be inherited from the root layout on every sub-page.
    expect(ogTitle, "og:title is present").not.toBeNull();
    expect(ogTitle, `og:title is specific to "${route.title}"`).toContain(route.title);
    expect(ogTitle, "og:title matches the resolved document title").toBe(title);

    expect(ogDescription, "og:description is this route's description").toBe(
      route.description,
    );

    // The share URL and the canonical must agree, or a shared link consolidates
    // signals onto a different page than the one that was shared.
    expect(ogUrl, "og:url equals the canonical").toBe(canonicalFor(path));

    expect(ogImage, "og:image is present").not.toBeNull();
    expect(ogImage, "og:image is absolute and on the production origin").toMatch(
      new RegExp(`^${PROD_ORIGIN}/[^\\s]+$`),
    );
  });

  test(`${path} · Twitter card is summary_large_image with route-specific text`, async ({
    page,
  }) => {
    await open(page, path);

    expect(await head(page, 'meta[name="twitter:card"]'), "twitter:card").toBe(
      "summary_large_image",
    );

    const twTitle = await head(page, 'meta[name="twitter:title"]');
    expect(twTitle, `twitter:title is specific to "${route.title}"`).toContain(
      route.title,
    );
    expect(twTitle, "twitter:title matches the document title").toBe(await page.title());

    expect(
      await head(page, 'meta[name="twitter:description"]'),
      "twitter:description is this route's description",
    ).toBe(route.description);

    expect(
      await head(page, 'meta[name="twitter:image"]'),
      "twitter:image is absolute",
    ).toMatch(new RegExp(`^${PROD_ORIGIN}/[^\\s]+$`));
  });

  test(`${path} · one h1, lang="en", and a robots meta that agrees with routes.ts`, async ({
    page,
  }) => {
    await open(page, path);

    // Counted from the DOM rather than by visibility: a visually hidden h1 is
    // still the document's heading as far as a crawler is concerned.
    const h1s = await page.locator("h1").count();
    expect(h1s, "exactly one h1").toBe(1);
    expect(
      (await page.locator("h1").first().innerText()).trim(),
      "the h1 is not empty",
    ).not.toBe("");

    expect(
      await page.locator("html").getAttribute("lang"),
      'html lang="en"',
    ).toBe("en");

    const robots = (await head(page, 'meta[name="robots"]')) ?? "";
    if (route.indexable) {
      expect(
        robots,
        `${path} is indexable:true in routes.ts but emits robots="${robots}"`,
      ).not.toMatch(/noindex|none/i);
    } else {
      expect(
        robots,
        `${path} is indexable:false in routes.ts and must emit noindex`,
      ).toMatch(/noindex/i);
    }
  });

  test(`${path} · JSON-LD declares Organization + WebSite and invents nothing`, async ({
    page,
  }) => {
    await open(page, path);

    const docs = await readJsonLd(page);
    expect(
      docs.some((d) => Array.isArray((d as Record<string, unknown>)["@graph"])),
      "JSON-LD uses an @graph",
    ).toBe(true);

    const nodes = graphNodes(docs);

    const org = nodes.find((n) => typeOf(n).includes("Organization"));
    expect(org, "@graph contains an Organization").toBeDefined();
    expect(org!.name, "Organization.name").toBe(site.name);
    expect(org!.url, "Organization.url").toBe(PROD_ORIGIN);
    expect(logoUrl(org!), "Organization.logo resolves to an absolute URL").toMatch(
      /^https:\/\/\S+$/,
    );
    const founders = asArray(org!.founder);
    expect(founders.length, "Organization.founder is non-empty").toBeGreaterThan(0);
    for (const f of founders) {
      expect(
        typeof f === "object" && f !== null
          ? (f as Record<string, unknown>).name
          : f,
        "each founder has a name",
      ).toBeTruthy();
    }
    const sameAs = asArray(org!.sameAs);
    expect(sameAs.length, "Organization.sameAs is non-empty").toBeGreaterThan(0);
    for (const s of sameAs) {
      expect(String(s), "sameAs entries are absolute URLs").toMatch(/^https:\/\/\S+$/);
    }

    const website = nodes.find((n) => typeOf(n).includes("WebSite"));
    expect(website, "@graph contains a WebSite").toBeDefined();
    expect(website!.url, "WebSite.url").toBe(PROD_ORIGIN);
    expect(website!.name, "WebSite.name").toBe(site.name);

    // The point of this test. None of these are known facts about this company,
    // and Google penalises structured data that claims them. Fabricating a
    // rating or a price to look established is exactly what must never ship.
    const keys = collectKeys(docs);
    for (const forbidden of FORBIDDEN_LD_KEYS) {
      expect(
        keys.has(forbidden),
        `JSON-LD must not claim "${forbidden}" — it is not a known fact about this company`,
      ).toBe(false);
    }
    const types = new Set(nodes.flatMap((n) => typeOf(n)));
    for (const forbidden of FORBIDDEN_LD_TYPES) {
      expect(
        types.has(forbidden),
        `JSON-LD must not declare a ${forbidden} node`,
      ).toBe(false);
    }
  });
}

// ---------------------------------------------------------------------------
// Cross-route uniqueness. One test each, visiting every route.
// ---------------------------------------------------------------------------

test("no two routes share a <title>", async ({ page }) => {
  const titles = new Map<string, string>();
  for (const route of routes) {
    await open(page, route.path);
    titles.set(route.path, await page.title());
  }
  expectAllDistinct(titles, "title");
});

test("no two routes share a meta description", async ({ page }) => {
  const descriptions = new Map<string, string>();
  for (const route of routes) {
    await open(page, route.path);
    descriptions.set(route.path, (await head(page, 'meta[name="description"]')) ?? "");
  }
  expectAllDistinct(descriptions, "meta description");
});

test("every route's canonical is distinct from every other route's", async ({ page }) => {
  const canonicals = new Map<string, string>();
  for (const route of routes) {
    await open(page, route.path);
    canonicals.set(
      route.path,
      (await head(page, 'link[rel="canonical"]', "href")) ?? "",
    );
  }
  // The exact historical bug: eight routes, one canonical (the home page).
  expectAllDistinct(canonicals, "canonical URL");
  expect(
    [...canonicals.values()].sort(),
    "canonicals are exactly the production URL of each route",
  ).toEqual(routes.map((r) => canonicalFor(r.path)).sort());
});

// ---------------------------------------------------------------------------
// The share image.
// ---------------------------------------------------------------------------

test("og:image is an absolute URL serving a real 1.91:1 PNG", async ({ page, request }) => {
  await open(page, "/");
  const ogImage = await head(page, 'meta[property="og:image"]');
  expect(ogImage, "og:image is present").not.toBeNull();

  const url = new URL(ogImage!);
  expect(url.origin, "og:image is served from the production origin").toBe(PROD_ORIGIN);

  // The declared URL points at production, which this run cannot reach. The
  // same path off the server under test is the same file from the same build,
  // so fetching it locally proves the asset exists without a network dependency.
  const res = await request.get(url.pathname);
  expect(res.status(), `${url.pathname} is served`).toBe(200);
  expect(res.headers()["content-type"], "og image content-type").toContain("image/png");

  const { width, height } = pngSize(await res.body());
  expect(width / height, "og image uses the 1.91:1 large-card ratio").toBeCloseTo(
    OG_ASPECT,
    2,
  );
  expect(width, "og image is at least 1200px wide").toBeGreaterThanOrEqual(1200);
  expect(height, "og image is at least 630px tall").toBeGreaterThanOrEqual(630);
});

test(
  "og:image:width/height match the actual pixels of the file",
  async ({ page, request }) => {
    // Fails today. src/lib/metadata.ts:56-57 declares width 1200 / height 630,
    // but public/og.png is 2400x1260 (a 2x render at the same aspect ratio).
    // Crawlers use the declared dimensions to lay out a card before downloading
    // the image, and Facebook's debugger flags the mismatch.
    await open(page, "/");
    const url = new URL((await head(page, 'meta[property="og:image"]'))!);
    const declaredWidth = Number(await head(page, 'meta[property="og:image:width"]'));
    const declaredHeight = Number(await head(page, 'meta[property="og:image:height"]'));

    const { width, height } = pngSize(await (await request.get(url.pathname)).body());
    expect(declaredWidth, "og:image:width matches the file").toBe(width);
    expect(declaredHeight, "og:image:height matches the file").toBe(height);
  },
);

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------

test("/robots.txt is served as text/plain, allows crawling and advertises the sitemap absolutely", async ({
  request,
}) => {
  const res = await request.get("/robots.txt");
  expect(res.status(), "/robots.txt returns 200").toBe(200);
  expect(res.headers()["content-type"], "robots.txt content-type").toContain(
    "text/plain",
  );

  const body = await res.text();
  expect(body, "declares a user-agent group").toMatch(/^user-agent:\s*\*/im);
  expect(body, "allows crawling").toMatch(/^allow:\s*\/\s*$/im);

  const sitemapLine = body.match(/^sitemap:\s*(\S+)\s*$/im);
  expect(sitemapLine, "robots.txt references a sitemap").not.toBeNull();
  // Relative sitemap references are ignored by crawlers.
  expect(sitemapLine![1], "sitemap is referenced by absolute URL").toBe(
    `${PROD_ORIGIN}/sitemap.xml`,
  );
});

test("/robots.txt does not de-index the site", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  // `Disallow: /` on its own hides the entire site. A scoped `Disallow: /admin`
  // is legitimate, so only the bare form is a failure.
  const siteWide = body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^disallow:\s*\/\s*$/i.test(l));
  expect(siteWide, "robots.txt contains a site-wide Disallow: /").toEqual([]);
});

// ---------------------------------------------------------------------------
// sitemap.xml
// ---------------------------------------------------------------------------

test("/sitemap.xml is served as well-formed sitemap XML", async ({ page, request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status(), "/sitemap.xml returns 200").toBe(200);
  expect(res.headers()["content-type"], "sitemap content-type").toMatch(/xml/);

  const parsed = await parseSitemap(page, await res.text());
  expect(parsed.error, "sitemap parses as XML").toBeNull();
  expect(parsed.root, "root element is <urlset>").toBe("urlset");
  expect(parsed.namespace, "sitemap namespace").toBe(
    "http://www.sitemaps.org/schemas/sitemap/0.9",
  );
  expect(parsed.entries.length, "sitemap is not empty").toBeGreaterThan(0);
});

test("sitemap <loc> set is exactly the indexable routes — nothing missing, nothing extra", async ({
  page,
  request,
}) => {
  const { entries } = await parseSitemap(page, await (await request.get("/sitemap.xml")).text());
  const locs = entries.map((e) => e.loc).sort();

  expect(locs, "sitemap has no duplicate <loc>").toEqual([...new Set(locs)].sort());
  expect(locs, "sitemap lists exactly the indexable routes from routes.ts").toEqual(
    indexableRoutes.map((r) => canonicalFor(r.path)).sort(),
  );
});

test("every sitemap <loc> is an absolute URL on the production host", async ({
  page,
  request,
}) => {
  const { entries } = await parseSitemap(page, await (await request.get("/sitemap.xml")).text());
  for (const entry of entries) {
    expect(entry.loc, "loc is absolute").toMatch(/^https:\/\//);
    expect(new URL(entry.loc).origin, "loc uses the production host").toBe(PROD_ORIGIN);
  }
});

test("sitemap priority and changefreq match routes.ts", async ({ page, request }) => {
  const { entries } = await parseSitemap(page, await (await request.get("/sitemap.xml")).text());
  const byLoc = new Map(entries.map((e) => [e.loc, e]));

  for (const route of indexableRoutes) {
    const entry = byLoc.get(canonicalFor(route.path));
    expect(entry, `sitemap entry for ${route.path}`).toBeDefined();
    expect(Number(entry!.priority), `priority for ${route.path}`).toBeCloseTo(
      route.priority,
      5,
    );
    expect(entry!.changefreq, `changefreq for ${route.path}`).toBe(route.changeFrequency);
  }
});

// ---------------------------------------------------------------------------
// Things that must never be indexed.
// ---------------------------------------------------------------------------

test("an unmatched URL returns a real HTTP 404", async ({ page }) => {
  const res = await open(page, UNMATCHED_PATH);
  // A streamed not-found would return 200 and let the page be indexed.
  expect(res?.status(), "unmatched URL status").toBe(404);
});

test("every non-indexable target emits noindex and stays out of the sitemap", async ({
  page,
  request,
}) => {
  const { entries } = await parseSitemap(page, await (await request.get("/sitemap.xml")).text());
  const locs = new Set(entries.map((e) => e.loc));

  // The 404 is the site's one permanently non-indexable response. Any route
  // marked indexable:false in routes.ts is held to the same rule, so this test
  // grows automatically the day one is added.
  const targets = [
    { path: UNMATCHED_PATH, label: "the 404 page" },
    ...routes
      .filter((r) => !r.indexable)
      .map((r) => ({ path: r.path, label: `${r.path} (indexable:false)` })),
  ];

  for (const target of targets) {
    await open(page, target.path);
    expect(
      (await head(page, 'meta[name="robots"]')) ?? "",
      `${target.label} must emit a noindex robots meta`,
    ).toMatch(/noindex/i);
    expect(
      locs.has(canonicalFor(target.path)),
      `${target.label} must not appear in the sitemap`,
    ).toBe(false);
  }
});

// ---------------------------------------------------------------------------
// Helpers.
// ---------------------------------------------------------------------------

const FORBIDDEN_LD_KEYS = [
  "aggregaterating",
  "ratingvalue",
  "reviewcount",
  "review",
  "reviews",
  "offers",
  "offer",
  "price",
  "pricerange",
  "pricecurrency",
  "address",
  "foundingdate",
  "numberofemployees",
] as const;

const FORBIDDEN_LD_TYPES = [
  "AggregateRating",
  "Review",
  "Offer",
  "AggregateOffer",
  "PostalAddress",
] as const;

type LdNode = Record<string, unknown>;

async function readJsonLd(page: Page): Promise<LdNode[]> {
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(blocks.length, "page carries JSON-LD").toBeGreaterThan(0);

  return blocks.map((raw, i) => {
    try {
      return JSON.parse(raw) as LdNode;
    } catch (e) {
      throw new Error(
        `JSON-LD block ${i} is not parseable: ${(e as Error).message}\n${raw.slice(0, 200)}`,
      );
    }
  });
}

/** Flattens `@graph` documents (and bare nodes) into a single node list. */
function graphNodes(docs: LdNode[]): LdNode[] {
  return docs.flatMap((doc) => {
    const graph = doc["@graph"];
    return Array.isArray(graph) ? (graph as LdNode[]) : [doc];
  });
}

function typeOf(node: LdNode): string[] {
  const t = node["@type"];
  return Array.isArray(t) ? t.map(String) : t ? [String(t)] : [];
}

function asArray(value: unknown): unknown[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function logoUrl(org: LdNode): string {
  const logo = org.logo;
  if (typeof logo === "string") return logo;
  if (logo && typeof logo === "object") return String((logo as LdNode).url ?? "");
  return "";
}

/** Every property name anywhere in the structured data, lower-cased. */
function collectKeys(node: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(node)) {
    for (const item of node) collectKeys(item, out);
    return out;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      out.add(key.toLowerCase());
      collectKeys(value, out);
    }
  }
  return out;
}

function expectAllDistinct(values: Map<string, string>, label: string) {
  const seen = new Map<string, string>();
  for (const [path, value] of values) {
    expect(value, `${path} has a ${label}`).not.toBe("");
    const owner = seen.get(value);
    expect(
      owner,
      `${path} shares its ${label} with ${owner} — "${value}"`,
    ).toBeUndefined();
    seen.set(value, path);
  }
  expect(seen.size, `${values.size} routes produce ${values.size} distinct ${label}s`).toBe(
    values.size,
  );
}

/** Reads width/height out of a PNG IHDR chunk. */
function pngSize(buffer: Buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  expect(signature, "file is a PNG").toBe("89504e470d0a1a0a");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

type SitemapEntry = {
  loc: string;
  changefreq: string | null;
  priority: string | null;
  lastmod: string | null;
};

/**
 * Parses the sitemap with the browser's own XML parser, so "valid XML" means
 * what a crawler's parser means rather than what a regex would accept.
 */
async function parseSitemap(page: Page, xml: string) {
  return page.evaluate((text) => {
    const doc = new DOMParser().parseFromString(text, "application/xml");
    if (doc.getElementsByTagName("parsererror").length > 0) {
      return {
        error: doc.getElementsByTagName("parsererror")[0].textContent ?? "parse error",
        root: null as string | null,
        namespace: null as string | null,
        entries: [] as SitemapEntry[],
      };
    }
    const text_ = (el: Element, tag: string) =>
      el.getElementsByTagName(tag)[0]?.textContent?.trim() ?? null;

    return {
      error: null as string | null,
      root: doc.documentElement.tagName as string | null,
      namespace: doc.documentElement.namespaceURI as string | null,
      entries: Array.from(doc.getElementsByTagName("url")).map((url) => ({
        loc: text_(url, "loc") ?? "",
        changefreq: text_(url, "changefreq"),
        priority: text_(url, "priority"),
        lastmod: text_(url, "lastmod"),
      })) as SitemapEntry[],
    };
  }, xml);
}
