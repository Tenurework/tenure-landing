import { expect, type Page } from "@playwright/test";
import { routes, indexableRoutes } from "../src/lib/routes";

export const ALL_ROUTES = routes.map((r) => r.path);
export const INDEXABLE = indexableRoutes.map((r) => r.path);
export { routes };

/** Production host the canonical URLs are expected to resolve against. */
export const PROD_ORIGIN = "https://www.tenurework.com";

/**
 * Freezes everything that would otherwise make a screenshot or a measurement
 * non-deterministic, and waits for fonts so text metrics are stable.
 *
 * Deliberately does NOT hide any layout: masking a defect is the difference
 * between a visual test that catches regressions and one that only proves the
 * page still exists.
 */
export async function settle(page: Page) {
  await page.addStyleTag({
    content: `*,*::before,*::after{
      animation-duration:0s!important;animation-delay:0s!important;
      transition-duration:0s!important;transition-delay:0s!important;
      caret-color:transparent!important;scroll-behavior:auto!important}`,
  });
  await page.evaluate(() => document.fonts?.ready);
  // Reveal-on-scroll content must be shown before a full-page screenshot.
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, window.innerHeight * 0.9);
        y += window.innerHeight * 0.9;
        if (y < document.body.scrollHeight + window.innerHeight) setTimeout(step, 60);
        else resolve();
      };
      step();
    });
  });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(250);
}

/**
 * Waits until React has hydrated and the reveal observer is live.
 *
 * The obvious implementation — wait for the first `[data-reveal].is-revealed`
 * — silently assumed a reveal sat in the opening viewport. That held until the
 * hero's above-the-fold reveals were removed so its copy and CTAs paint with
 * the document. On a phone the first remaining reveal is roughly 900px down, so
 * nothing ever intersected and every spec using this hung for 30 seconds.
 *
 * This nudges the page down until something reveals, which proves the same
 * thing without assuming where the first reveal happens to be, then returns the
 * scroll position to the top so callers see the page as a visitor would.
 */
export async function waitForHydration(page: Page) {
  /**
   * Smooth scrolling off first — the same defect, and the same fix, as in
   * `a11y.spec.ts`'s `open()`, where it is documented at length.
   *
   * The loop below calls `window.scrollBy` per poll. With
   * `html { scroll-behavior: smooth }` each call starts an animation the next
   * poll interrupts, so the page crawls: 28,549ms to reach a reveal 1,969px
   * down, against 30ms with it off.
   *
   * `.catch()` because this helper is also called on pages that may already
   * have navigated away under it; a style tag that cannot attach must not fail
   * a hydration wait.
   */
  await page
    .addStyleTag({ content: "html{scroll-behavior:auto!important}" })
    .catch(() => {});

  /*
    SCROLL ONCE, THEN WAIT. Both halves of that matter, and I got each wrong in turn.

    The original swept a full viewport per poll until something revealed, which can
    outrun the IntersectionObserver it is waiting on: reproduced on /trust, whose
    single reveal ended up 1,392px above the viewport having never intersected, so
    the observer had nothing to fire on.

    My first fix called `scrollIntoView` INSIDE the polled function. `waitForFunction`
    polls on animation frames, so that scrolled the page every frame and starved the
    observer of a stable frame to measure against — it hung deterministically, which
    is worse than the flake it replaced.

    Scrolling once, outside the poll, is what both attempts were reaching for: the
    element is in view, the page is still, and the observer fires on the next frame.
  */
  await page.evaluate(() => {
    /*
      SCROLL BY COORDINATE, NOT `scrollIntoView`.

      `scrollIntoView` also moves the browser's sequential focus navigation
      starting point to the element it scrolled to. Nothing is focused, so it is
      invisible — until a test presses Tab, which then resumes from the middle of
      the document. nav.spec.ts's keyboard sweep began on the industries rail,
      never reached the header, and reported "tabbing never reached the menu
      toggle": a true statement about a starting point this helper had moved.
      Focusing <body> afterwards does not put it back.

      Computing the offset and calling `window.scrollTo` has no focus semantics at
      all, which is the property this helper needs.
    */
    const el = document.querySelector<HTMLElement>("[data-reveal]");
    if (!el) return;
    const box = el.getBoundingClientRect();
    const target = window.scrollY + box.top - window.innerHeight / 2 + box.height / 2;
    window.scrollTo(0, Math.max(0, target));
  });

  await page.waitForFunction(
    () =>
      document.querySelectorAll("[data-reveal]").length === 0 ||
      !!document.querySelector("[data-reveal].is-revealed"),
    undefined,
    { timeout: 15_000 },
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
}


/**
 * Collects genuine first-party page errors. Third-party noise and the
 * favicon/devtools chatter that every site emits are excluded, so a failure
 * here means our code threw.
 */
export function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (/favicon|third-party|calendly|Download the React DevTools/i.test(text)) return;
    errors.push(`console: ${text}`);
  });
  return errors;
}

/** Reads a meta/link value out of the document head. */
export async function head(page: Page, selector: string, attr = "content") {
  const el = page.locator(`head ${selector}`).first();
  if ((await el.count()) === 0) return null;
  return el.getAttribute(attr);
}

/** Applies an explicit theme the way the UI does, then waits for it to land. */
export async function setTheme(page: Page, theme: "light" | "dark" | "system") {
  await page.evaluate((t) => {
    const root = document.documentElement;
    if (t === "system") {
      root.removeAttribute("data-theme");
      localStorage.removeItem("tenure-theme");
    } else {
      root.setAttribute("data-theme", t);
      localStorage.setItem("tenure-theme", t);
    }
    root.setAttribute("data-theme-choice", t);
  }, theme);
  await page.waitForTimeout(80);
}

/** WCAG 2.2 relative luminance contrast between two computed CSS colours. */
export function contrastRatio(fg: [number, number, number], bg: [number, number, number]) {
  const lum = (c: [number, number, number]) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = lum(fg);
  const l2 = lum(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Asserts the page has exactly one <h1> and no skipped heading levels. */
export async function expectSaneHeadings(page: Page) {
  const levels = await page.evaluate(() =>
    [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
      .filter((h) => {
        const s = getComputedStyle(h);
        return s.display !== "none" && s.visibility !== "hidden";
      })
      .map((h) => Number(h.tagName[1])),
  );

  expect(levels.filter((l) => l === 1), "exactly one h1").toHaveLength(1);
  expect(levels[0], "first heading is the h1").toBe(1);

  for (let i = 1; i < levels.length; i++) {
    const jump = levels[i] - levels[i - 1];
    expect(
      jump,
      `heading level jumped from h${levels[i - 1]} to h${levels[i]} (index ${i})`,
    ).toBeLessThanOrEqual(1);
  }
}
