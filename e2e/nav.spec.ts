import { expect, test, type Page } from "@playwright/test";
import {
  ALL_ROUTES,
  collectPageErrors,
  settle,
  waitForHydration as sharedWaitForHydration,
} from "./support";
import { site } from "../src/lib/site";

/**
 * Routing and navigation.
 *
 * Everything here asserts behaviour that a user or a crawler can observe:
 * status codes, rendered headings, where a click lands, what focus does. There
 * are deliberately no "the element exists" assertions — an element that renders
 * but navigates nowhere would pass those and fail a real visitor.
 */

/** A URL that must never match a route. */
const UNKNOWN = "/this-route-does-not-exist-4c1f";

/**
 * The <h1> each route is expected to render, as normalised text content.
 *
 * Pinned literally rather than derived from `routes.ts`: the sitemap title and
 * the on-page headline are different pieces of copy, so deriving one from the
 * other would assert nothing. `h1 expectations cover every route` below fails
 * if a route is added to `routes.ts` without an entry here, so this map cannot
 * silently fall behind.
 */
const H1: Record<string, string> = {
  "/": "People move on.The know-how stays.",
  "/product": "One system for how your organization actually runs.",
  "/pilot": "Every org. And the office that stewards them.",
  "/trust": "What is actually built, and what is not.",
  "/story": "We kept watching good organizations start over.",
  "/contact": "See your own handoff in Tenure.",
  "/privacy": "Privacy",
  "/terms": "Terms of Use",
};

const NOT_FOUND_H1 = "That page moved on.";

type Anchor = {
  href: string;
  url: string;
  target: string;
  rel: string;
  text: string;
  hash: string;
  pathname: string;
  origin: string;
  protocol: string;
  /** For same-page fragment links: does the target id actually exist? */
  hashTargetExists: boolean;
};

/** Every `<a href>` under `scope` ("" = whole document), fully resolved. */
async function collectAnchors(page: Page, scope = ""): Promise<Anchor[]> {
  return page.evaluate((sel) => {
    const root = sel ? `${sel} a[href]` : "a[href]";
    return Array.from(document.querySelectorAll<HTMLAnchorElement>(root)).map((a) => {
      const u = new URL(a.href, document.baseURI);
      return {
        href: a.getAttribute("href") ?? "",
        url: a.href,
        target: a.target,
        rel: a.rel,
        text: (a.textContent ?? "").replace(/\s+/g, " ").trim(),
        hash: u.hash,
        pathname: u.pathname,
        origin: u.origin,
        protocol: u.protocol,
        hashTargetExists: u.hash ? !!document.getElementById(u.hash.slice(1)) : true,
      };
    });
  }, scope);
}

/**
 * Kills transition/animation timing so focus-driven position changes are
 * observable on the very next frame. This is a determinism tool, not a wait:
 * nothing here sleeps for a fixed duration hoping the UI caught up.
 */
async function freezeMotion(page: Page) {
  await page.addStyleTag({
    content: `*,*::before,*::after{
      animation-duration:0s!important;animation-delay:0s!important;
      transition-duration:0s!important;transition-delay:0s!important}`,
  });
}

/** What currently has focus, described well enough to name in a failure. */
async function focusInfo(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    const toggle = document.querySelector('button[aria-controls="mobile-menu"]');
    if (!el) return { tag: "none", href: "", text: "", inMobileMenu: false, isMenuToggle: false };
    return {
      tag: el.tagName,
      href: el.getAttribute("href") ?? "",
      text: (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40),
      inMobileMenu: !!el.closest("#mobile-menu"),
      isMenuToggle: el === toggle,
    };
  });
}

/**
 * Blocks until React has hydrated.
 *
 * `Reveal` adds `.is-revealed` from a client-side ref callback, so the class
 * cannot appear in server-rendered HTML — its presence is proof the bundle
 * booted. Without this, a click can land on server HTML before next/link is
 * listening, and a client-side navigation silently becomes a document load.
 */
async function waitForHydration(page: Page) {
  // Delegates to the shared implementation. This used to wait directly for the
  // first `[data-reveal].is-revealed`, which assumed one sat in the opening
  // viewport — no longer true since the hero's above-the-fold reveals were
  // removed, so on a phone it hung for 30 seconds on every mobile-menu test.
  await sharedWaitForHydration(page);
}

// ---------------------------------------------------------------------------
// 1. Every route resolves and renders the heading it is supposed to
// ---------------------------------------------------------------------------

test("h1 expectations cover every route in routes.ts", () => {
  expect(Object.keys(H1).sort()).toEqual([...ALL_ROUTES].sort());
});

for (const route of ALL_ROUTES) {
  test(`GET ${route} returns 200 and renders its h1`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response, `no response for ${route}`).not.toBeNull();
    expect(response!.status(), `status for ${route}`).toBe(200);

    const h1 = page.locator("h1");
    await expect(h1, `${route} must have exactly one h1`).toHaveCount(1);
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText(H1[route]);
  });
}

// ---------------------------------------------------------------------------
// 2. The branded 404
// ---------------------------------------------------------------------------

test("an unknown URL returns a real 404 status and the branded copy", async ({ page }) => {
  const response = await page.goto(UNKNOWN);
  expect(response).not.toBeNull();
  // Next 16 answers 200 for a *streamed* not-found. This site has no suspending
  // fetch above the boundary, so a soft 200 here is a genuine SEO regression.
  expect(response!.status(), "unmatched URL must be a hard 404").toBe(404);

  const h1 = page.locator("h1");
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText(NOT_FOUND_H1);
  await expect(page.getByText("That page moved on")).toBeVisible();

  // Every ALL_ROUTES h1 belongs to a real page; the 404 must not be one of them.
  expect(Object.values(H1)).not.toContain(NOT_FOUND_H1);
});

test("the 404 page links back to the home page", async ({ page }) => {
  await page.goto(UNKNOWN);
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("h1")).toHaveText(H1["/"]);
});

test("the 404 page links to the product page", async ({ page }) => {
  await page.goto(UNKNOWN);
  await page.getByRole("link", { name: "See the product" }).click();
  await expect(page).toHaveURL(/\/product$/);
  await expect(page.locator("h1")).toHaveText(H1["/product"]);
});

// ---------------------------------------------------------------------------
// 3. Header navigation + aria-current
// ---------------------------------------------------------------------------

test.describe("header navigation", () => {
  // The header nav is `hidden md:flex`, so it is only a real control above the
  // md breakpoint. Forcing a desktop viewport makes this block meaningful in
  // the mobile projects too, instead of silently testing a display:none node.
  test.use({ viewport: { width: 1440, height: 1000 } });

  const headerNav = (page: Page) => page.locator("header nav[aria-label='Main']").first();

  for (const item of site.nav) {
    test(`a direct load of ${item.href} marks its header link aria-current="page"`, async ({
      page,
    }) => {
      await page.goto(item.href);
      const nav = headerNav(page);
      await expect(nav).toBeVisible();

      await expect(nav.locator(`a[href="${item.href}"]`)).toHaveAttribute("aria-current", "page");

      for (const other of site.nav.filter((n) => n.href !== item.href)) {
        await expect(
          nav.locator(`a[href="${other.href}"]`),
          `${other.href} must not be current on ${item.href}`,
        ).not.toHaveAttribute("aria-current", "page");
      }
      // Exactly one current link in the header, ever.
      await expect(nav.locator("a[aria-current='page']")).toHaveCount(1);
    });
  }

  test("header links navigate client-side and move aria-current with the route", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForHydration(page);
    // Survives a client-side transition, is wiped by a document load.
    await page.evaluate(() => {
      (window as unknown as { __clientNav?: string }).__clientNav = "alive";
    });

    const nav = headerNav(page);
    // Home is not in site.nav, so nothing is current on "/".
    await expect(nav.locator("a[aria-current='page']")).toHaveCount(0);

    for (const item of site.nav) {
      await nav.getByRole("link", { name: item.label, exact: true }).click();

      await expect(page).toHaveURL(new RegExp(`${item.href}$`));
      await expect(page.locator("h1")).toHaveText(H1[item.href]);
      await expect(nav.locator(`a[href="${item.href}"]`)).toHaveAttribute("aria-current", "page");
      await expect(nav.locator("a[aria-current='page']")).toHaveCount(1);

      const survived = await page.evaluate(
        () => (window as unknown as { __clientNav?: string }).__clientNav,
      );
      expect(survived, `navigating to ${item.href} did a full document load`).toBe("alive");
    }
  });

  test("the wordmark returns home with a full document load", async ({ page }) => {
    await page.goto("/product");
    await waitForHydration(page);
    await page.evaluate(() => {
      (window as unknown as { __clientNav?: string }).__clientNav = "alive";
    });

    await page.getByRole("link", { name: "Tenure, home" }).first().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("h1")).toHaveText(H1["/"]);

    // Documented behaviour: the logo is a plain anchor, not next/link, so it
    // hard-reloads. If it ever becomes a <Link> this is the test that says so.
    const survived = await page.evaluate(
      () => (window as unknown as { __clientNav?: string }).__clientNav,
    );
    expect(survived, "the wordmark should hard-navigate, not push state").toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 4. Internal link checker
// ---------------------------------------------------------------------------

test("every internal link on every route resolves", async ({ page, request, baseURL }) => {
  test.setTimeout(90_000);
  const origin = new URL(baseURL!).origin;

  /** pathname -> the first page we saw it linked from, for the failure message. */
  const internal = new Map<string, string>();
  const deadFragments: string[] = [];

  for (const route of [...ALL_ROUTES, UNKNOWN]) {
    await page.goto(route);
    for (const a of await collectAnchors(page)) {
      if (a.protocol !== "http:" && a.protocol !== "https:") continue;
      if (a.origin !== origin) continue;

      if (a.hash && a.pathname === new URL(page.url()).pathname && !a.hashTargetExists) {
        deadFragments.push(`${route} links to ${a.href} but #${a.hash.slice(1)} is not on the page`);
      }
      // A bare `#fragment` is a link to a place on this page, not to a route.
      if (a.href.startsWith("#")) continue;
      if (!internal.has(a.pathname)) internal.set(a.pathname, route);
    }
  }

  // Guard against a crawl that silently found nothing.
  expect(internal.size, "crawler found too few internal links").toBeGreaterThanOrEqual(
    ALL_ROUTES.length,
  );
  for (const route of ALL_ROUTES) {
    expect([...internal.keys()], `${route} is never linked to from anywhere`).toContain(route);
  }

  const broken: string[] = [];
  for (const [pathname, from] of internal) {
    const res = await request.get(pathname);
    if (res.status() >= 400) broken.push(`${pathname} -> ${res.status()} (linked from ${from})`);
  }

  expect(broken, "internal links returning an error status").toEqual([]);
  expect(deadFragments, "fragment links with no matching id").toEqual([]);
});

test("footer links cover nav, legal, contact and social, and every internal one resolves", async ({
  page,
  request,
  baseURL,
}) => {
  const origin = new URL(baseURL!).origin;
  await page.goto("/");

  const anchors = await collectAnchors(page, "footer");
  const hrefs = anchors.map((a) => a.href);

  for (const item of [...site.nav, ...site.legal]) {
    expect(hrefs, `footer is missing a link to ${item.href}`).toContain(item.href);
  }
  expect(hrefs, "footer is missing the contact CTA").toContain("/contact");
  expect(hrefs, "footer is missing the email link").toContain(`mailto:${site.email}`);
  expect(hrefs).toContain(site.socials.linkedin);
  expect(hrefs).toContain(site.socials.x);

  const broken: string[] = [];
  for (const a of anchors) {
    if (a.protocol !== "http:" && a.protocol !== "https:") continue;
    if (a.origin !== origin) continue;
    const res = await request.get(a.pathname);
    if (res.status() >= 400) broken.push(`${a.href} -> ${res.status()}`);
  }
  expect(broken, "footer links returning an error status").toEqual([]);

  // And the footer nav genuinely navigates, not just points. Derived from
  // site.nav rather than pinned to a label: the ribbon was renamed once
  // (Product/Pilot/Trust/Story -> Platform/Pilot/Security/About) and this line
  // was the only place in the suite that hard-coded one of the old words.
  const security = site.nav.find((n) => n.href === "/trust")!;
  await page.locator("footer").getByRole("link", { name: security.label, exact: true }).click();
  await expect(page).toHaveURL(/\/trust$/);
  await expect(page.locator("h1")).toHaveText(H1["/trust"]);
});

// ---------------------------------------------------------------------------
// 5. External links
// ---------------------------------------------------------------------------

test.describe("external links", () => {
  // Stub every off-origin request. Popup behaviour is then verified for real
  // without the suite depending on linkedin.com or calendly.com being up.
  test.beforeEach(async ({ context, baseURL }) => {
    const host = new URL(baseURL!).hostname;
    await context.route(
      (url) => url.hostname !== host,
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<!doctype html><title>stub</title><p>stub</p>",
        }),
    );
  });

  test("every external link opens in a new tab with rel noopener and noreferrer", async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(60_000);
    const origin = new URL(baseURL!).origin;
    const offenders: string[] = [];
    const seen = new Set<string>();

    for (const route of [...ALL_ROUTES, UNKNOWN]) {
      await page.goto(route);
      for (const a of await collectAnchors(page)) {
        if (a.protocol !== "http:" && a.protocol !== "https:") continue;
        if (a.origin === origin) continue;
        seen.add(a.url);

        const rel = a.rel.toLowerCase().split(/\s+/);
        if (a.target !== "_blank") offenders.push(`${route}: ${a.url} target="${a.target}"`);
        if (!rel.includes("noopener")) offenders.push(`${route}: ${a.url} rel missing noopener`);
        if (!rel.includes("noreferrer")) offenders.push(`${route}: ${a.url} rel missing noreferrer`);
      }
    }

    // The site really does link off-site; an empty crawl must not pass.
    expect([...seen].sort()).toEqual(
      [site.socials.linkedin, site.socials.x, site.calendlyUrl].sort(),
    );
    expect(offenders, "external links without a safe new-tab contract").toEqual([]);
  });

  test("the footer LinkedIn link opens a new tab that cannot reach window.opener", async ({
    page,
  }) => {
    await page.goto("/");
    const link = page.locator(`footer a[href="${site.socials.linkedin}"]`);
    await expect(link).toHaveAttribute("target", "_blank");

    const [popup] = await Promise.all([page.waitForEvent("popup"), link.click()]);
    await popup.waitForLoadState("domcontentloaded");

    expect(popup.url()).toBe(site.socials.linkedin);
    // rel="noopener" is only real if the new tab genuinely has no opener.
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    // The original tab stayed put.
    await expect(page).toHaveURL(/\/$/);
    await popup.close();
  });

  test("the Calendly link on /contact opens a new tab that cannot reach window.opener", async ({
    page,
  }) => {
    await page.goto("/contact");
    const link = page.locator(`a[href="${site.calendlyUrl}"]`).first();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
    await expect(link).toHaveAttribute("rel", /noreferrer/);

    const [popup] = await Promise.all([page.waitForEvent("popup"), link.click()]);
    await popup.waitForLoadState("domcontentloaded");

    expect(popup.url()).toBe(site.calendlyUrl);
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    await expect(page).toHaveURL(/\/contact$/);
    await popup.close();
  });
});

test("every mailto link points at the address in site.ts", async ({ page }) => {
  test.setTimeout(60_000);
  const offenders: string[] = [];
  let count = 0;

  for (const route of [...ALL_ROUTES, UNKNOWN]) {
    await page.goto(route);
    for (const a of await collectAnchors(page)) {
      if (a.protocol !== "mailto:") continue;
      count++;
      const address = a.href.replace(/^mailto:/, "").split("?")[0];
      if (address !== site.email) offenders.push(`${route}: ${a.href}`);
    }
  }

  expect(count, "no mailto links were found at all").toBeGreaterThan(0);
  expect(offenders, "mailto links not pointing at site.email").toEqual([]);
});

// ---------------------------------------------------------------------------
// 6. Mobile menu
// ---------------------------------------------------------------------------

test.describe("mobile menu", () => {
  // Narrow enough that the header collapses in every project, including the
  // desktop ones, so this behaviour is covered in all four.
  test.use({ viewport: { width: 390, height: 844 } });

  const toggle = (page: Page) => page.locator('button[aria-controls="mobile-menu"]');
  const panel = (page: Page) => page.locator("#mobile-menu");

  test("opens on tap and moves focus into the panel", async ({ page }) => {
    await page.goto("/");
    await freezeMotion(page);
    await waitForHydration(page);

    await expect(toggle(page)).toBeVisible();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
    await expect(toggle(page)).toHaveAccessibleName("Open menu");
    await expect(panel(page)).toHaveCount(0);

    await toggle(page).click();

    await expect(panel(page)).toBeVisible();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "true");
    await expect(toggle(page)).toHaveAccessibleName("Close menu");

    // Focus lands on the first control inside the panel, not left on <body>.
    const firstLink = panel(page).locator("a[href]").first();
    await expect(firstLink).toBeFocused();
    await expect(firstLink).toHaveAttribute("href", site.nav[0].href);

    // Every nav destination is present and pointing somewhere real.
    for (const item of site.nav) {
      await expect(panel(page).locator(`a[href="${item.href}"]`)).toBeVisible();
    }
  });

  test("Escape closes the panel and returns focus to the toggle", async ({ page }) => {
    await page.goto("/");
    await freezeMotion(page);
    await waitForHydration(page);

    await toggle(page).click();
    await expect(panel(page).locator("a[href]").first()).toBeFocused();

    await page.keyboard.press("Escape");

    await expect(panel(page)).toHaveCount(0);
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
    await expect(toggle(page), "focus must come back to the trigger").toBeFocused();
  });

  test("choosing a link inside the panel closes it and navigates", async ({ page }) => {
    await page.goto("/");
    await freezeMotion(page);
    await waitForHydration(page);

    await toggle(page).click();
    await expect(panel(page)).toBeVisible();

    await panel(page).locator('a[href="/trust"]').click();

    await expect(page).toHaveURL(/\/trust$/);
    await expect(page.locator("h1")).toHaveText(H1["/trust"]);
    await expect(panel(page), "the panel must not survive the navigation").toHaveCount(0);
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("panel links are not reachable by keyboard while the panel is closed", async ({ page }) => {
    await page.goto("/");
    await freezeMotion(page);
    await waitForHydration(page);
    await expect(panel(page)).toHaveCount(0);

    let reachedToggle = false;
    for (let i = 1; i <= 8; i++) {
      await page.keyboard.press("Tab");
      const info = await focusInfo(page);
      expect(
        info.inMobileMenu,
        `tab stop ${i} (${info.tag} "${info.text}") is inside the closed mobile menu`,
      ).toBe(false);
      if (info.isMenuToggle) reachedToggle = true;
    }

    // Proves the tab sweep above actually walked the header rather than
    // wandering somewhere the panel could never have appeared.
    expect(reachedToggle, "tabbing never reached the menu toggle").toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 7. Skip link
// ---------------------------------------------------------------------------

for (const route of ALL_ROUTES) {
  test(`skip link on ${route} is first, hidden until focused, and jumps to main`, async ({
    page,
  }) => {
    await page.goto(route);
    await freezeMotion(page);

    const skip = page.locator("a.skip-link");
    await expect(skip).toHaveCount(1);
    await expect(skip).toHaveAttribute("href", "#main");

    // Off-screen before it has focus: the whole box sits above the viewport.
    const hidden = await skip.boundingBox();
    expect(hidden, "skip link has no box").not.toBeNull();
    expect(
      hidden!.y + hidden!.height,
      `skip link should be off-screen when unfocused (y=${hidden!.y})`,
    ).toBeLessThanOrEqual(0);

    // First Tab from the document lands on it — before the logo, before nav.
    await page.keyboard.press("Tab");
    await expect(skip, "skip link must be the first focusable element").toBeFocused();
    await expect(skip).toHaveText("Skip to main content");

    // ...and now it is on screen.
    const shown = await skip.boundingBox();
    expect(shown!.y, "skip link should be visible once focused").toBeGreaterThanOrEqual(0);
    expect(shown!.y).toBeLessThan(page.viewportSize()!.height);
    expect(shown!.y, "focusing the skip link should move it").toBeGreaterThan(hidden!.y);

    // Activating it hands focus to <main>, not just the URL hash.
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`#main$`));
    await expect(page.locator("main#main")).toBeFocused();
  });
}

// ---------------------------------------------------------------------------
// 8. No first-party console or page errors
// ---------------------------------------------------------------------------

for (const route of ALL_ROUTES) {
  test(`${route} produces no console or page errors`, async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.goto(route);
    await settle(page);
    expect(errors, `first-party errors on ${route}`).toEqual([]);
  });
}

test("the 404 page produces no errors beyond its own 404 status", async ({ page }) => {
  const errors = collectPageErrors(page);

  // Nothing the 404 page pulls in may itself be missing. The document's own
  // 404 is the point of the page, so it is excluded — every other request is
  // held to the same standard as any other route.
  const badSubresources: string[] = [];
  page.on("response", (res) => {
    if (res.request().resourceType() === "document") return;
    if (res.status() >= 400) badSubresources.push(`${res.url()} -> ${res.status()}`);
  });

  await page.goto(UNKNOWN);
  await settle(page);

  // Chrome logs the document's own 404 status to the console. That status is
  // exactly what the 404 test above requires, so it is not a defect here.
  const unexpected = errors.filter(
    (e) => !/Failed to load resource: the server responded with a status of 404/.test(e),
  );
  expect(unexpected, "first-party errors on the 404 page").toEqual([]);
  expect(badSubresources, "sub-resources missing on the 404 page").toEqual([]);
});
