import { expect, test, type Locator, type Page } from "@playwright/test";
import { ALL_ROUTES, settle } from "./support";
import { site } from "../src/lib/site";

/**
 * VISUAL REGRESSION BASELINES
 *
 * Coverage comes from the project matrix in playwright.config.ts rather than
 * from hand-rolled viewports: desktop-light, desktop-dark, mobile-light and
 * mobile-dark each run this file, and Playwright's default snapshot path
 * template stamps the project name into the file name, so one `toHaveScreenshot`
 * call here yields four independent baselines. Adding a fifth device is a config
 * change, not a change to this file.
 *
 * Nothing is masked. There is no live data on this site, so every pixel is
 * either content or chrome, and hiding any of it would turn a regression
 * detector into a proof that the page still exists.
 *
 * WHAT *IS* PINNED, AND WHY
 * Four surfaces animate forever on a timer, and each one would put a different
 * frame in the baseline on every run:
 *
 *   SeatMechanism      no timer — the three terms are a sticky stack, revealed by scroll
 *   DashboardMock      setInterval 4200ms, rotates through the hero's modules
 *   AuditTrailDemo     setInterval 3600ms, prepends a new audit row
 *   ProductAtWork      infinite opacity/position keyframe loops
 *
 * Every one of them is gated on `useReducedMotion()` in source, so emulating
 * reduced motion — a first-class Playwright media emulation, not a mask —
 * freezes all four at their first frame and leaves layout, colour and copy
 * untouched. `settle()` alone cannot do this: it neutralises CSS animation and
 * transition, and these four are JavaScript state changes. The same emulation
 * keeps Lenis smooth scroll off and makes `Reveal` resolve on mount instead of
 * on intersection.
 */
/**
 * Reduced motion is emulated per page rather than declared via
 * `test.use({ reducedMotion })`. Two reasons, and the second is the decisive
 * one: the fixture form does not type-check against this project's Playwright
 * 1.62 test options, and it does not reach the page at runtime either —
 * `matchMedia("(prefers-reduced-motion: reduce)")` still reports false, while
 * the same projects' `colorScheme` arrives fine. Emulating explicitly, before
 * the first navigation, does work. `visit()` then asserts the page really sees
 * it, so this can never silently revert to capturing random animation frames.
 */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

/**
 * Capturing pages this tall, four projects wide, costs real time — the home
 * page renders to roughly fifteen screens. The per-test budget is raised so a
 * slow machine reports a genuine pixel diff rather than a timeout that says
 * nothing about the site.
 */
test.describe.configure({ timeout: 240_000 });

/**
 * Waiting for hydration. Generous because it is a wait on a real condition, not
 * a sleep: the home page renders to ~12,800px and four device projects hydrate
 * it in parallel, so the budget has to cover a loaded machine. A slow machine
 * should cost seconds, never a false failure.
 */
const HYDRATION_TIMEOUT = 60_000;
/** Encoding and diffing a full-page PNG of the longest route. */
const SHOT_TIMEOUT = 60_000;

/** An unmatched URL, which must render the branded 404 rather than the stock one. */
const NOT_FOUND = "/no-such-page-exists-here";

/** Snapshot-safe file stem for a route path. */
function slug(path: string) {
  return path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-");
}

/**
 * Loads a route and holds until it is genuinely finished moving.
 *
 * `settle()` handles fonts, animation and the scroll pass that trips the
 * reveal-on-view observers. The assertion after it is the hydration gate: every
 * `Reveal` is server-rendered hidden behind the `.js` class and only gains
 * `is-revealed` once React has attached its callback ref. Waiting on that means
 * a screenshot can never catch the page with half its copy still invisible —
 * which is the one failure mode a full-page baseline would happily bless.
 */
async function visit(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "load" });
  expect(response, `no response for ${path}`).not.toBeNull();

  expect(
    await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
    "reduced-motion emulation is not in effect — the four timed surfaces would each " +
      "land on an arbitrary frame and every baseline below would be noise",
  ).toBe(true);

  await settle(page);
  await expect(
    page.locator("[data-reveal]:not(.is-revealed)"),
    "reveal-on-view content is still hidden — the page has not hydrated",
  ).toHaveCount(0, { timeout: HYDRATION_TIMEOUT });
  return response!;
}

/**
 * Takes one baseline, after proving the target is a real, singular, laid-out
 * element. Without these guards a selector that silently matched a collapsed
 * wrapper would still produce a green test and a 1x1 baseline.
 */
async function shoot(target: Locator, name: string) {
  await expect(target, `${name}: selector did not match exactly one element`).toHaveCount(1);
  await expect(target, `${name}: target is not visible`).toBeVisible();

  const box = await target.boundingBox();
  expect(box, `${name}: target has no layout box`).not.toBeNull();
  expect(box!.width, `${name}: target collapsed horizontally`).toBeGreaterThan(200);
  expect(box!.height, `${name}: target collapsed vertically`).toBeGreaterThan(100);

  await expect(target).toHaveScreenshot(`${name}.png`, { timeout: SHOT_TIMEOUT });
}

/** The one `<section>` in `<main>` that owns a given heading. */
function sectionByHeading(page: Page, level: 1 | 2, name: RegExp | string) {
  return page
    .locator("main section")
    .filter({ has: page.getByRole("heading", { level, name }) });
}

/* -------------------------------------------------------------------------- */
/* 1. Full-page baselines: every route, plus the 404.                          */
/* -------------------------------------------------------------------------- */

test.describe("full page", () => {
  for (const path of ALL_ROUTES) {
    test(`${path} matches its baseline`, async ({ page }) => {
      const response = await visit(page, path);
      expect(response.status(), `${path} did not return 200`).toBe(200);

      await expect(page).toHaveScreenshot(`route-${slug(path)}.png`, {
        fullPage: true,
        timeout: SHOT_TIMEOUT,
      });
    });
  }

  test("an unmatched URL matches the branded 404 baseline", async ({ page }) => {
    const response = await visit(page, NOT_FOUND);

    // A stock framework 404 would also produce a stable screenshot, so the
    // baseline alone cannot tell us which one we captured. These two can.
    expect(response.status(), "an unmatched URL must be a real 404").toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "That page moved on." }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("route-404.png", {
      fullPage: true,
      timeout: SHOT_TIMEOUT,
    });
  });
});

/* -------------------------------------------------------------------------- */
/* 2. Home page components, found by their headings — never by position.       */
/* -------------------------------------------------------------------------- */

const HOME_COMPONENTS: { name: string; find: (page: Page) => Locator }[] = [
  {
    name: "home-hero",
    find: (page) => sectionByHeading(page, 1, /know-how\s*stays/i),
  },
  {
    name: "home-seat-mechanism",
    find: (page) => sectionByHeading(page, 2, /the seat remembers everything/i),
  },
  {
    name: "home-handoff",
    find: (page) => sectionByHeading(page, 2, /the handoff document nobody has to/i),
  },
  {
    name: "home-metrics-band",
    // The heading changed: the band no longer promises measured outcomes it
    // cannot deliver, so "whether the knowledge survived" is gone.
    find: (page) => sectionByHeading(page, 2, /exactly how it.s built/i),
  },
  {
    name: "home-office-console",
    find: (page) => sectionByHeading(page, 2, /the office gets its own system/i),
  },
  {
    name: "home-faq",
    // The heading was the bare word "FAQ", set larger than every section heading
    // on the page — the loudest type on the home page was its least informative
    // word. It now says what the section is.
    find: (page) => sectionByHeading(page, 2, /questions we get asked first/i),
  },
  {
    name: "home-footer",
    find: (page) => page.locator("footer"),
  },
];

test.describe("home page components", () => {
  for (const component of HOME_COMPONENTS) {
    test(`${component.name} matches its baseline`, async ({ page }) => {
      await visit(page, "/");
      await shoot(component.find(page), component.name);
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 3. The contact surface, and the mobile nav panel open.                      */
/* -------------------------------------------------------------------------- */

test("the contact surface matches its baseline", async ({ page }) => {
  await visit(page, "/contact");

  // The deepest element that holds both halves of the surface: the scheduler
  // column and the email card. Deepest rather than first, so we frame the grid
  // itself and not the page container that also happens to contain both.
  // The whole conversion surface: the first-party request composer on the left
  // and the email fallback on the right. The old locator framed a grid defined by
  // two headings that no longer exist — the Calendly embed it wrapped has been
  // replaced by components/site/WalkthroughRequest.tsx.
  const surface = page.getByRole("main").locator("div.grid").first();

  // The baseline is of the surface at REST, with the dialog closed. If the
  // composer were already open the shot would be of a different thing entirely,
  // and the point of this baseline — that the page reads correctly before any
  // interaction — would be lost.
  await expect(page.getByRole("button", { name: "Request a demo" })).toBeVisible();
  await expect(page.getByRole("dialog")).toBeHidden();

  await shoot(surface, "contact-surface");
});

test("the mobile navigation panel, open, matches its baseline", async ({ page }) => {
  const width = page.viewportSize()?.width ?? 0;
  test.skip(
    width >= 768,
    "the toggle and the panel are both md:hidden — above 768px there is no mobile nav to open",
  );

  // /product rather than /, so the panel also captures its active-route state.
  await visit(page, "/product");

  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();

  const panel = page.locator("#mobile-menu");
  await expect(panel).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close menu" }),
    "the toggle must report the panel it controls as expanded",
  ).toHaveAttribute("aria-expanded", "true");
  await expect(
    panel.getByRole("link"),
    "the open panel must expose every nav destination plus the CTA",
  ).toHaveCount(site.nav.length + 1);

  // The header is the component under test: it carries the panel, the tinted
  // backdrop it only gains while open, and the toggle's close icon.
  await shoot(page.locator("header"), "mobile-nav-open");
});

/* -------------------------------------------------------------------------- */
/* 4. Legal typography.                                                        */
/* -------------------------------------------------------------------------- */

test("the privacy legal typography block matches its baseline", async ({ page }) => {
  await visit(page, "/privacy");

  const legal = page.locator(".legal");

  // `.legal` styles descendants it does not itself declare. A baseline of an
  // empty container would be stable and worthless, so assert the block really
  // carries the structure those rules target.
  await expect(legal.locator("h2").first()).toBeVisible();
  await expect(legal.locator("li").first()).toBeVisible();

  await shoot(legal, "privacy-legal");
});
