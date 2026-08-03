import { expect, test, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  ALL_ROUTES,
  contrastRatio,
  expectSaneHeadings,
  settle,
  setTheme,
} from "./support";

/**
 * WCAG 2.2 AA.
 *
 * Two engines run side by side on purpose. axe-core is the breadth check — it
 * knows about ARIA misuse, name/role/value and a hundred rules nobody should
 * hand-write. Everything else in this file is a depth check for the things axe
 * either cannot see (target size across a real mobile layout, focus obscured by
 * the fixed header, reflow at 320px) or reports as "incomplete" and therefore
 * silently passes (colour contrast through `color-mix`, `oklch` and gradient
 * backgrounds — the case that hid 177 real failures before the token refactor).
 *
 * Every route is exercised in BOTH themes, because the palette is the only
 * thing that differs between them and it is the palette that breaks.
 */

/** Every public route plus an unmatched URL, which must render the branded 404. */
const PATHS = [...ALL_ROUTES, "/no-such-page-a11y-404"] as const;

const THEMES = ["light", "dark"] as const;

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** Only these two block. `moderate`/`minor` are advisory and would make the suite noise. */
const BLOCKING_IMPACTS = new Set(["critical", "serious"]);

const label = (p: string) => (p === "/" ? "/ (home)" : p);

/**
 * Loads a route and puts it in the one state every check below depends on:
 * fully revealed, fully settled, nothing animating.
 *
 * The order matters and is not cosmetic. Over a hundred elements on the home
 * page sit at `opacity: 0` behind `[data-reveal]` until an IntersectionObserver
 * that React wires up *after hydration* flips them. Scrolling before that
 * observer exists reveals nothing, so the page stays 70% invisible and every
 * contrast, target-size and focus assertion silently measures an empty page.
 * So: wait for the first reveal (proof the observer is live), scroll the page
 * end to end, then wait for the last one.
 */
async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: "load" });

  // Proof the observer is live. It used to simply wait for the first reveal,
  // which assumed one sat in the opening viewport — true until the hero's
  // above-the-fold reveals were removed so its copy and CTAs paint with the
  // document. At 320px the first remaining reveal is ~900px down, so nothing
  // ever intersected and this waited forever. It now nudges the page down until
  // something reveals, which proves the same thing without assuming where the
  // first reveal happens to live.
  await page.waitForFunction(
    () => {
      const all = document.querySelectorAll("[data-reveal]");
      if (all.length === 0) return true;
      if (document.querySelector("[data-reveal].is-revealed")) return true;
      window.scrollBy(0, window.innerHeight);
      return false;
    },
    undefined,
    { timeout: 30_000 },
  );
  await page.evaluate(() => window.scrollTo(0, 0));

  await settle(page);

  // Elements that are `display: none` at this breakpoint never intersect, so
  // they are excluded rather than waited on forever.
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("[data-reveal]:not(.is-revealed)")].filter(
        (el) => el.getClientRects().length > 0,
      ).length === 0,
  );
}

/* ==========================================================================
   1. axe-core
   ========================================================================== */

test.describe("axe (WCAG 2.2 AA)", () => {
  for (const path of PATHS) {
    test(`no critical or serious violations — ${label(path)}`, async ({ page }) => {
      await open(page, path);

      const findings: string[] = [];

      for (const theme of THEMES) {
        await setTheme(page, theme);

        const results = await new AxeBuilder({ page })
          .withTags(WCAG_TAGS)
          .analyze();

        for (const v of results.violations) {
          if (!BLOCKING_IMPACTS.has(v.impact ?? "")) continue;
          for (const node of v.nodes) {
            findings.push(
              [
                `[${theme}] ${v.id} (${v.impact})`,
                `  ${v.help}`,
                `  selector: ${node.target.join(" >>> ")}`,
                `  ${(node.failureSummary ?? "").replace(/\n/g, "\n  ")}`,
              ].join("\n"),
            );
          }
        }
      }

      expect(findings, `axe violations on ${label(path)}`).toEqual([]);
    });
  }
});

/* ==========================================================================
   2 + 3 + 10 + 11. Landmarks, headings, images, icon-only names
   --------------------------------------------------------------------------
   One page load, four independent soft assertions, so a broken heading order
   does not hide a missing alt attribute on the same route.
   ========================================================================== */

type Landmarks = {
  mains: number;
  headers: number;
  footers: number;
  navs: { name: string; visible: boolean; where: string }[];
  imagesWithoutAlt: string[];
};

async function readLandmarks(page: Page): Promise<Landmarks> {
  return page.evaluate(() => {
    const visible = (el: Element) =>
      (el as HTMLElement).checkVisibility({
        opacityProperty: true,
        visibilityProperty: true,
        contentVisibilityAuto: true,
      });

    const where = (el: Element) => {
      const parts: string[] = [];
      let n: Element | null = el;
      while (n && n !== document.body && parts.length < 4) {
        parts.unshift(
          n.tagName.toLowerCase() +
            (n.className && typeof n.className === "string"
              ? "." + n.className.trim().split(/\s+/).slice(0, 2).join(".")
              : ""),
        );
        n = n.parentElement;
      }
      return parts.join(" > ");
    };

    /** Accessible name for a <nav>: the three sources the HTML-AAM allows. */
    const navName = (nav: Element) => {
      const labelledby = nav.getAttribute("aria-labelledby");
      if (labelledby) {
        const text = labelledby
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
          .join(" ")
          .trim();
        if (text) return text;
      }
      return (
        nav.getAttribute("aria-label")?.trim() ||
        nav.getAttribute("title")?.trim() ||
        ""
      );
    };

    return {
      mains: document.querySelectorAll("main").length,
      // Only top-level banner/contentinfo count as landmarks; a <header> nested
      // inside <article>/<section> is not one, and the site has none.
      headers: [...document.querySelectorAll("header")].filter(
        (h) => !h.closest("article, aside, main, nav, section"),
      ).length,
      footers: [...document.querySelectorAll("footer")].filter(
        (f) => !f.closest("article, aside, main, nav, section"),
      ).length,
      navs: [...document.querySelectorAll("nav")].map((n) => ({
        name: navName(n),
        visible: visible(n),
        where: where(n),
      })),
      imagesWithoutAlt: [...document.querySelectorAll("img")]
        .filter((img) => img.getAttribute("alt") === null)
        .map((img) => `${where(img)}  src=${img.getAttribute("src") ?? "?"}`),
    };
  });
}

/**
 * Marks every visible interactive control that renders no text of its own, so
 * the accessible name of each can be asserted through Playwright's own name
 * computation rather than a hand-rolled approximation of it.
 */
async function markIconOnlyControls(page: Page) {
  return page.evaluate(() => {
    const sel = 'a[href], button, input, select, textarea, summary, [role="button"]';
    const out: { key: string; where: string }[] = [];
    let i = 0;
    for (const el of document.querySelectorAll<HTMLElement>(sel)) {
      if (
        !el.checkVisibility({
          opacityProperty: true,
          visibilityProperty: true,
          contentVisibilityAuto: true,
        })
      ) {
        // A radio painted at opacity 0 under a styled <label> is still a real,
        // operable control and still needs a name.
        const isControl = el instanceof HTMLInputElement;
        if (!isControl) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) continue;
      }
      const rendered = (el.innerText ?? "").trim();
      if (rendered.length > 0) continue;
      const key = `io-${i++}`;
      el.setAttribute("data-a11y-icon-only", key);
      out.push({
        key,
        where: `${el.tagName.toLowerCase()}${el.getAttribute("type") ? `[type=${el.getAttribute("type")}]` : ""} .${(el.className || "").toString().trim().split(/\s+/).slice(0, 3).join(".")}`,
      });
    }
    return out;
  });
}

test.describe("landmarks, headings, images and names", () => {
  for (const path of PATHS) {
    test(`document structure — ${label(path)}`, async ({ page }) => {
      await open(page, path);

      const lm = await readLandmarks(page);

      // -- landmarks ------------------------------------------------------
      expect.soft(lm.mains, `${label(path)}: exactly one <main>`).toBe(1);
      expect.soft(lm.headers, `${label(path)}: exactly one banner <header>`).toBe(1);
      expect.soft(lm.footers, `${label(path)}: exactly one contentinfo <footer>`).toBe(1);

      const unnamed = lm.navs.filter((n) => n.name === "");
      expect
        .soft(
          unnamed.map((n) => n.where),
          `${label(path)}: every <nav> needs an accessible name`,
        )
        .toEqual([]);

      // Two navs that are both reachable must be told apart by name alone.
      const visibleNames = lm.navs.filter((n) => n.visible).map((n) => n.name);
      expect
        .soft(
          visibleNames.length - new Set(visibleNames).size,
          `${label(path)}: duplicate nav names ${JSON.stringify(visibleNames)}`,
        )
        .toBe(0);

      // -- images ---------------------------------------------------------
      expect
        .soft(lm.imagesWithoutAlt, `${label(path)}: <img> without an alt attribute`)
        .toEqual([]);

      // -- icon-only controls ---------------------------------------------
      const iconOnly = await markIconOnlyControls(page);
      for (const c of iconOnly) {
        const el = page.locator(`[data-a11y-icon-only="${c.key}"]`);
        await expect
          .soft(el, `${label(path)}: icon-only control ${c.where} has no accessible name`)
          .not.toHaveAccessibleName("");
      }

      // -- headings -------------------------------------------------------
      await expectSaneHeadings(page);
    });
  }
});

/* ==========================================================================
   4 + 5. Keyboard: focus visibility, focus not obscured, no trap
   ========================================================================== */

type Stop = {
  index: number;
  tag: string;
  text: string;
  inHeader: boolean;
  ring: { outline: string; outlineWidth: number; shadow: boolean; source: string } | null;
  obscuredBy: string | null;
  rect: { x: number; y: number; w: number; h: number };
};

/** Reads everything the two keyboard tests need about the currently focused element. */
async function readFocusStop(page: Page, index: number): Promise<Stop | null> {
  return page.evaluate((i) => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body || el === document.documentElement) return null;

    const effOpacity = (n: Element | null) => {
      let o = 1;
      let cur: Element | null = n;
      while (cur && cur !== document.documentElement) {
        o *= parseFloat(getComputedStyle(cur).opacity || "1");
        cur = cur.parentElement;
      }
      return o;
    };

    /** A focus indicator is a non-`none` outline or a box-shadow. */
    const ringOf = (n: Element) => {
      const cs = getComputedStyle(n);
      const width = parseFloat(cs.outlineWidth || "0") || 0;
      const outline =
        cs.outlineStyle !== "none" && width >= 1
          ? `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`
          : "";
      const shadow = cs.boxShadow !== "none" && cs.boxShadow !== "";
      if (!outline && !shadow) return null;
      return { outline, outlineWidth: width, shadow };
    };

    // The element itself, or — for a control deliberately painted at opacity 0
    // under a styled label, like the theme radios — the wrapper that paints the
    // ring on its behalf via `has-[:focus-visible]`.
    let ring: Stop["ring"] = null;
    let node: Element | null = el;
    for (let depth = 0; node && depth < 4; depth++, node = node.parentElement) {
      const r = ringOf(node);
      if (r && effOpacity(node) > 0.05) {
        ring = { ...r, source: depth === 0 ? "self" : `ancestor+${depth}` };
        break;
      }
    }

    const rect = el.getBoundingClientRect();
    const header = document.querySelector("header");
    let obscuredBy: string | null = null;

    if (header && !header.contains(el)) {
      const hcs = getComputedStyle(header);
      const bgAlpha = (() => {
        const m = hcs.backgroundColor.match(/[\d.]+\s*\)$/);
        if (/rgba?\(/.test(hcs.backgroundColor) && m) {
          const parts = hcs.backgroundColor.replace(/[^\d.,\s/]/g, "").split(/[\s,/]+/).filter(Boolean);
          return parts.length > 3 ? Number(parts[3]) : 1;
        }
        return hcs.backgroundColor === "transparent" ? 0 : 1;
      })();
      // A header with no painted background and no backdrop filter sits above
      // the content in z-order but does not hide it.
      const paints = bgAlpha > 0.1 || hcs.backdropFilter !== "none";

      if (paints) {
        const hr = header.getBoundingClientRect();
        // The focus ring extends past the element: 2px outline + 3px offset.
        const pad = 5;
        const box = {
          left: rect.left - pad,
          top: rect.top - pad,
          right: rect.right + pad,
          bottom: rect.bottom + pad,
        };
        const overlaps =
          box.left < hr.right && box.right > hr.left && box.top < hr.bottom && box.bottom > hr.top;

        if (overlaps) {
          const cx = Math.max(box.left, hr.left) + (Math.min(box.right, hr.right) - Math.max(box.left, hr.left)) / 2;
          const cy = Math.max(box.top, hr.top) + (Math.min(box.bottom, hr.bottom) - Math.max(box.top, hr.top)) / 2;
          const hit = document.elementFromPoint(cx, cy);
          if (hit && header.contains(hit)) {
            obscuredBy = `header covers (${Math.round(cx)}, ${Math.round(cy)}); header bottom=${Math.round(hr.bottom)}, element top=${Math.round(rect.top)}`;
          }
        }
      }
    }

    return {
      index: i,
      tag: el.tagName.toLowerCase() + (el.getAttribute("type") ? `[${el.getAttribute("type")}]` : ""),
      text: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 40),
      inHeader: !!header?.contains(el),
      ring,
      obscuredBy,
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
    };
  }, index);
}

const describeStop = (s: Stop) => `#${s.index} <${s.tag}> "${s.text}"`;

test.describe("keyboard", () => {
  test("every one of the first 25 focus stops has a visible focus indicator", async ({ page }) => {
    await open(page, "/");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("body").click({ position: { x: 2, y: 2 } });
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());

    const missing: string[] = [];
    const stops: Stop[] = [];

    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const stop = await readFocusStop(page, i);
      if (!stop) break;
      stops.push(stop);
      if (!stop.ring) {
        missing.push(`${describeStop(stop)} — outline:none and no box-shadow while focused`);
      }
    }

    // Guards against the whole test quietly becoming a no-op.
    expect(stops.length, "the home page should expose at least 20 tab stops").toBeGreaterThanOrEqual(20);
    expect(missing, "focus stops with no visible focus indicator").toEqual([]);
  });

  test("no focus ring is obscured by the fixed header (SC 2.4.11)", async ({ page }) => {
    await open(page, "/");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("body").click({ position: { x: 2, y: 2 } });
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());

    const obscured: string[] = [];
    let seen = 0;

    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const stop = await readFocusStop(page, i);
      if (!stop) break;
      seen++;
      // Controls that live inside the header cannot be hidden by it.
      if (stop.inHeader) continue;
      if (stop.obscuredBy) obscured.push(`${describeStop(stop)} at y=${stop.rect.y} — ${stop.obscuredBy}`);
    }

    expect(seen, "the home page should expose at least 20 tab stops").toBeGreaterThanOrEqual(20);
    expect(obscured, "focus rings hidden behind the sticky header").toEqual([]);
  });

  test("tab order escapes the page and reverses (no keyboard trap)", async ({ page }) => {
    await open(page, "/");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("body").click({ position: { x: 2, y: 2 } });
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());

    const id = () =>
      page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body || el === document.documentElement) return "<document>";
        const attr = el.getAttribute("data-tabid");
        if (attr) return attr;
        const next = String(document.querySelectorAll("[data-tabid]").length);
        el.setAttribute("data-tabid", next);
        return next;
      });

    // Walk forward until focus leaves the document. A cap well above the real
    // number of controls is what turns "trapped" into a failure instead of a hang.
    const CAP = 200;
    const forward: string[] = [];
    let escaped = false;

    for (let i = 0; i < CAP; i++) {
      await page.keyboard.press("Tab");
      const stop = await id();
      if (stop === "<document>") {
        escaped = true;
        break;
      }
      forward.push(stop);
    }

    expect(
      escaped,
      `Tab never left the page after ${CAP} presses — the last stops were ${forward.slice(-6).join(", ")}`,
    ).toBe(true);
    expect(new Set(forward).size, "every forward tab stop should be a distinct element").toBe(forward.length);
    expect(forward.length, "expected a non-trivial tab sequence").toBeGreaterThan(20);

    // Re-enter from the top and walk back out with Shift+Tab: the reverse order
    // must mirror the forward one exactly.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("body").click({ position: { x: 2, y: 2 } });
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());

    const walkTo = Math.min(forward.length, 12);
    for (let i = 0; i < walkTo; i++) await page.keyboard.press("Tab");

    const backward: string[] = [];
    for (let i = 0; i < walkTo - 1; i++) {
      await page.keyboard.press("Shift+Tab");
      backward.push(await id());
    }

    expect(backward, "Shift+Tab must retrace the forward order").toEqual(
      forward.slice(0, walkTo - 1).reverse(),
    );
  });
});

/* ==========================================================================
   6. Target size — WCAG 2.2 SC 2.5.8 (24 x 24 minimum)
   ========================================================================== */

type SmallTarget = {
  text: string;
  tag: string;
  w: number;
  h: number;
  where: string;
  nearest: string;
};

/**
 * SC 2.5.8 is not "everything is 24px". It has two exceptions this implements,
 * because a check that ignores them reports links that genuinely conform:
 *
 *  - INLINE: a target inside a sentence, whose height is set by the line-height
 *    of the prose around it.
 *  - SPACING: an undersized target whose 24px-diameter circle does not reach
 *    another target (or another undersized target's circle).
 */
async function findSmallTargets(page: Page): Promise<SmallTarget[]> {
  return page.evaluate(() => {
    const SEL = 'a[href], button, input, summary, [role="button"]';
    const MIN = 24;

    const where = (el: Element) => {
      const parts: string[] = [];
      let n: Element | null = el;
      while (n && n !== document.body && parts.length < 3) {
        parts.unshift(n.tagName.toLowerCase());
        n = n.parentElement;
      }
      return parts.join(">");
    };

    const targets = [...document.querySelectorAll<HTMLElement>(SEL)]
      .filter((el) => {
        if (el instanceof HTMLInputElement && el.type === "hidden") return false;
        return el.checkVisibility({
          opacityProperty: true,
          visibilityProperty: true,
          contentVisibilityAuto: true,
        });
      })
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter((t) => t.r.width > 0 && t.r.height > 0);

    const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    const undersized = (r: DOMRect) => r.width < MIN || r.height < MIN;

    const distToRect = (p: { x: number; y: number }, r: DOMRect) => {
      const dx = Math.max(r.left - p.x, 0, p.x - r.right);
      const dy = Math.max(r.top - p.y, 0, p.y - r.bottom);
      return Math.hypot(dx, dy);
    };

    const out: SmallTarget[] = [];

    for (const t of targets) {
      if (!undersized(t.r)) continue;

      // -- inline exception ------------------------------------------------
      const prose = t.el.closest("p, li");
      if (prose && prose !== t.el) {
        const own = (t.el.textContent ?? "").trim().length;
        const all = (prose.textContent ?? "").trim().length;
        if (all > own + 1) continue;
      }

      // -- spacing exception ------------------------------------------------
      const c = centre(t.r);
      let nearest = Infinity;
      let nearestDesc = "nothing";
      let crowded = false;

      for (const o of targets) {
        if (o === t) continue;
        if (t.el.contains(o.el) || o.el.contains(t.el)) continue;
        const gap = undersized(o.r)
          ? Math.hypot(c.x - centre(o.r).x, c.y - centre(o.r).y) // circle vs circle
          : distToRect(c, o.r); // circle vs target
        const limit = undersized(o.r) ? MIN : MIN / 2;
        if (gap < nearest) {
          nearest = gap;
          nearestDesc = `${o.el.tagName.toLowerCase()} "${(o.el.textContent ?? "").trim().slice(0, 24)}" at ${gap.toFixed(1)}px (needs ${limit})`;
        }
        if (gap < limit) crowded = true;
      }

      if (!crowded) continue;

      out.push({
        text: (t.el.innerText || t.el.getAttribute("aria-label") || "").trim().slice(0, 48) || "(no text)",
        tag: t.el.tagName.toLowerCase(),
        w: Math.round(t.r.width * 10) / 10,
        h: Math.round(t.r.height * 10) / 10,
        where: where(t.el),
        nearest: nearestDesc,
      });
    }

    return out;
  });
}

test.describe("target size on mobile (SC 2.5.8)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of PATHS) {
    test(`targets are 24x24 or spaced — ${label(path)}`, async ({ page }) => {
      await open(page, path);

      const small = await findSmallTargets(page);

      expect(
        small.map((s) => `"${s.text}" <${s.where}> ${s.w}x${s.h}px — nearest target ${s.nearest}`),
        `${label(path)}: targets under 24x24 that also fail the spacing exception`,
      ).toEqual([]);
    });
  }
});

/* ==========================================================================
   7. Reflow at 320 CSS px (SC 1.4.10)
   ========================================================================== */

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const limit = window.innerWidth;

    const offenders = [...document.querySelectorAll<HTMLElement>("body *")]
      .filter((el) => {
        if (!el.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true })) return false;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        if (r.right <= limit + 1) return false;
        // A pane that scrolls sideways on purpose is not a page-level reflow bug.
        let p: HTMLElement | null = el.parentElement;
        while (p && p !== document.body) {
          const ox = getComputedStyle(p).overflowX;
          if (ox === "auto" || ox === "scroll" || ox === "hidden") return false;
          p = p.parentElement;
        }
        return true;
      })
      .map((el) => ({
        el,
        right: el.getBoundingClientRect().right,
        desc: `${el.tagName.toLowerCase()}.${(el.className || "").toString().trim().split(/\s+/).slice(0, 3).join(".")}`,
        text: (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40),
      }));

    // Report the outermost offender of each chain; its children are collateral.
    const outermost = offenders.filter((o) => !offenders.some((p) => p.el !== o.el && p.el.contains(o.el)));

    return {
      scrollWidth: doc.scrollWidth,
      innerWidth: limit,
      offenders: outermost
        .sort((a, b) => b.right - a.right)
        .slice(0, 10)
        .map((o) => `${o.desc} right=${Math.round(o.right)}px "${o.text}"`),
    };
  });
}

test.describe("reflow at 320px (SC 1.4.10)", () => {
  test.use({ viewport: { width: 320, height: 800 } });

  for (const path of PATHS) {
    test(`no horizontal scrolling — ${label(path)}`, async ({ page }) => {
      await open(page, path);

      const r = await horizontalOverflow(page);

      expect(
        r.scrollWidth,
        `${label(path)} scrolls sideways at 320px (scrollWidth ${r.scrollWidth} > ${r.innerWidth}).\nOffenders:\n  ${r.offenders.join("\n  ")}`,
      ).toBeLessThanOrEqual(r.innerWidth + 1);
    });
  }
});

/* ==========================================================================
   8. Text resized to 200% (SC 1.4.4)
   ========================================================================== */

test.describe("200% text zoom (SC 1.4.4)", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const path of PATHS) {
    test(`no sideways scroll at a 200% root font size — ${label(path)}`, async ({ page }) => {
      // `prefers-reduced-motion` is the site's own no-JavaScript-needed path to a
      // fully revealed page (globals.css opts `[data-reveal]` out of the hidden
      // state). Using it here keeps the measurement layout-only and avoids
      // scrolling a page that just doubled in height.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path, { waitUntil: "load" });
      await page.addStyleTag({
        content: `html{font-size:200%!important;scroll-behavior:auto!important}
          *,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}`,
      });
      await page.evaluate(() => document.fonts?.ready);

      const r = await horizontalOverflow(page);

      expect(
        r.scrollWidth,
        `${label(path)} scrolls sideways at 200% text size (scrollWidth ${r.scrollWidth} > ${r.innerWidth}).\nOffenders:\n  ${r.offenders.join("\n  ")}`,
      ).toBeLessThanOrEqual(r.innerWidth + 1);
    });
  }
});

/* ==========================================================================
   9. Contrast, computed independently of axe
   ========================================================================== */

type ContrastSample = {
  text: string;
  where: string;
  fg: [number, number, number];
  bg: [number, number, number];
  fontSize: number;
  bold: boolean;
  bgSource: string;
};

type ContrastScan = { samples: ContrastSample[]; skipped: string[] };

/**
 * Walks every rendered text node and resolves the colour it is actually painted
 * in against the colour actually behind it.
 *
 * Resolution goes through a 1x1 canvas rather than a regex, because the computed
 * values here are `lab()`, `oklab()` and `color-mix()` — none of which parse as
 * `rgb()`, which is exactly how a whole palette can look fine to a naive check.
 * Alpha is composited, ancestor `opacity` is folded in, and a gradient
 * background is expanded into its resolved stops so the worst stop is the one
 * that gets asserted.
 */
async function scanContrast(page: Page): Promise<ContrastScan> {
  return page.evaluate(() => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const ctx = cv.getContext("2d", { willReadFrequently: true })!;

    /**
     * Resolves ANY computed colour to RGBA. It has to go through a canvas
     * because Chrome serialises this palette as `lab()` / `oklab()` and
     * `color-mix()` results — none of which a `rgb()` regex would parse, which
     * is precisely how a naive checker reports a clean sweep on a broken theme.
     *
     * Validity is decided by setting `fillStyle` from two different priors: a
     * colour the canvas understands lands on the same serialisation both times,
     * an unparseable one leaves the prior in place.
     */
    const toRGBA = (css: string): [number, number, number, number] | null => {
      if (!css || css === "none") return null;
      ctx.fillStyle = "#000000";
      ctx.fillStyle = css;
      const a = ctx.fillStyle;
      ctx.fillStyle = "#ffffff";
      ctx.fillStyle = css;
      if (ctx.fillStyle !== a) return null;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };

    const over = (
      fg: [number, number, number, number],
      bg: [number, number, number],
    ): [number, number, number] => [
      Math.round(fg[0] * fg[3] + bg[0] * (1 - fg[3])),
      Math.round(fg[1] * fg[3] + bg[1] * (1 - fg[3])),
      Math.round(fg[2] * fg[3] + bg[2] * (1 - fg[3])),
    ];

    const COLOUR_RE =
      /(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^()]*\)|#[0-9a-fA-F]{3,8}\b/g;

    const where = (el: Element) => {
      const parts: string[] = [];
      let n: Element | null = el;
      while (n && n !== document.body && parts.length < 3) {
        const cls = (n.className || "").toString().trim().split(/\s+/).filter(Boolean).slice(0, 2).join(".");
        parts.unshift(n.tagName.toLowerCase() + (cls ? "." + cls : ""));
        n = n.parentElement;
      }
      return parts.join(" > ");
    };

    /** True for `.sr-only` and friends: laid out normally, then clipped to nothing. */
    const isScreenReaderOnly = (el: Element) => {
      let n: Element | null = el;
      for (let depth = 0; n && n !== document.body && depth < 5; depth++, n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.clip === "rect(0px, 0px, 0px, 0px)") return true;
        if (cs.clipPath === "inset(50%)") return true;
        const r = (n as HTMLElement).getBoundingClientRect();
        if (r.width <= 1 && r.height <= 1 && cs.overflow === "hidden") return true;
      }
      return false;
    };

    const effOpacity = (el: Element) => {
      let o = 1;
      let n: Element | null = el;
      while (n && n !== document.documentElement) {
        o *= parseFloat(getComputedStyle(n).opacity || "1");
        n = n.parentElement;
      }
      return o;
    };

    /**
     * Composites the background stack behind `el` down to the first opaque
     * layer. Returns every candidate backdrop when a gradient is involved, so
     * the caller can assert against the worst one.
     */
    const backgrounds = (el: Element): { colours: [number, number, number][]; source: string } | null => {
      const stack: { colour: [number, number, number, number]; gradient: string[] }[] = [];
      let n: Element | null = el;
      let source = "";

      while (n) {
        const cs = getComputedStyle(n);
        const img = cs.backgroundImage;
        let gradient: string[] = [];

        if (img && img !== "none") {
          if (/url\(/.test(img)) return null; // a photo behind text: unresolvable
          gradient = img.match(COLOUR_RE) ?? [];
          if (gradient.length === 0) return null;
        }

        const c = toRGBA(cs.backgroundColor);
        if (c && (c[3] > 0 || gradient.length)) {
          stack.push({ colour: c, gradient });
          if (!source) source = `${n.tagName.toLowerCase()} ${cs.backgroundColor}`;
          if (c[3] >= 0.999 && gradient.length === 0) break;
        }
        if (n === document.documentElement) break;
        n = n.parentElement ?? (n === document.body ? document.documentElement : null);
      }

      // Nothing opaque anywhere: fall back to the UA canvas.
      let bases: [number, number, number][] = [[255, 255, 255]];

      // Painted bottom-up. Within a layer the background-color goes down first,
      // then each resolved gradient stop on top of it — every stop is kept as a
      // separate candidate backdrop so the caller can assert the worst one.
      for (let i = stack.length - 1; i >= 0; i--) {
        const layer = stack[i];
        const next: [number, number, number][] = [];
        for (const base of bases) {
          const solid = layer.colour[3] > 0 ? over(layer.colour, base) : base;
          next.push(solid);
          for (const stop of layer.gradient) {
            const s = toRGBA(stop);
            if (s && s[3] > 0.02) next.push(over(s, solid));
          }
        }
        bases = next.slice(0, 8);
      }

      return { colours: bases, source: source || "canvas" };
    };

    const samples: ContrastSample[] = [];
    const skipped: string[] = [];
    const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TITLE", "TEMPLATE", "OPTION"]);

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node: Node | null;

    while ((node = walker.nextNode())) {
      const text = (node.nodeValue ?? "").replace(/\s+/g, " ").trim();
      if (!text) continue;

      const el = node.parentElement;
      if (!el || SKIP_TAGS.has(el.tagName)) continue;
      if (
        !el.checkVisibility({
          opacityProperty: true,
          visibilityProperty: true,
          contentVisibilityAuto: true,
        })
      )
        continue;
      if (isScreenReaderOnly(el)) continue;

      const range = document.createRange();
      range.selectNodeContents(node);
      const r = range.getBoundingClientRect();
      if (r.width <= 1 || r.height <= 1) continue;

      const cs = getComputedStyle(el);
      const fgRaw = toRGBA(cs.color);
      if (!fgRaw) {
        skipped.push(`${where(el)} — unresolvable colour ${cs.color}`);
        continue;
      }
      // Gradient-filled text (`background-clip: text`) paints from the
      // background, not from `color`; there is no single value to measure.
      if (fgRaw[3] < 0.02) {
        skipped.push(`${where(el)} — transparent text (background-clip)`);
        continue;
      }

      const bgs = backgrounds(el);
      if (!bgs) {
        skipped.push(`${where(el)} — background image behind text`);
        continue;
      }

      const alpha = Math.min(1, fgRaw[3] * effOpacity(el));
      const size = parseFloat(cs.fontSize);
      const weight = Number(cs.fontWeight) || (cs.fontWeight === "bold" ? 700 : 400);

      for (const bg of bgs.colours) {
        samples.push({
          text: text.slice(0, 60),
          where: where(el),
          fg: over([fgRaw[0], fgRaw[1], fgRaw[2], alpha], bg),
          bg,
          fontSize: size,
          bold: weight >= 700,
          bgSource: bgs.source,
        });
      }
    }

    return { samples, skipped };
  });
}

const required = (s: ContrastSample) =>
  s.fontSize >= 24 || (s.fontSize >= 18.66 && s.bold) ? 3 : 4.5;

test.describe("contrast (SC 1.4.3)", () => {
  for (const path of PATHS) {
    test(`text meets AA in both themes — ${label(path)}`, async ({ page }) => {
      await open(page, path);

      const failures: string[] = [];
      let checked = 0;

      for (const theme of THEMES) {
        await setTheme(page, theme);
        const { samples } = await scanContrast(page);
        checked += samples.length;

        const seen = new Set<string>();
        for (const s of samples) {
          const need = required(s);
          const ratio = contrastRatio(s.fg, s.bg);
          if (ratio >= need) continue;
          const key = `${theme}|${s.where}|${s.fg.join()}|${s.bg.join()}`;
          if (seen.has(key)) continue;
          seen.add(key);
          failures.push(
            `[${theme}] ${ratio.toFixed(2)}:1 (needs ${need}:1) — "${s.text}"\n` +
              `    ${s.where} @ ${s.fontSize}px${s.bold ? " bold" : ""}\n` +
              `    fg rgb(${s.fg.join(", ")})  bg rgb(${s.bg.join(", ")})  from ${s.bgSource}`,
          );
        }
      }

      // Without this the whole walk could silently match nothing and "pass".
      expect(checked, `${label(path)}: contrast walk found no text to measure`).toBeGreaterThan(20);
      expect(failures, `${label(path)}: text below WCAG AA contrast`).toEqual([]);
    });
  }
});

/* ==========================================================================
   12. Reduced motion
   ========================================================================== */

/** Everything still painted at ~zero opacity once the page has settled. */
async function invisibleContent(page: Page) {
  return page.evaluate(() => {
    const invisible: string[] = [];
    const reveals = document.querySelectorAll("[data-reveal]");

    const describe = (el: Element) =>
      `${el.tagName.toLowerCase()}.${(el.className || "").toString().trim().split(/\s+/).slice(0, 2).join(".")} "${(el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 50)}"`;

    for (const el of reveals) {
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.99) {
        invisible.push(`[data-reveal] opacity=${cs.opacity} ${describe(el)}`);
      }
      if (cs.transform !== "none" && cs.transform !== "matrix(1, 0, 0, 1, 0, 0)") {
        invisible.push(`[data-reveal] still displaced ${cs.transform} ${describe(el)}`);
      }
    }

    // Anything else carrying its own text and painted at ~zero: a label that
    // only an animation would ever have brought into view.
    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      const own = [...el.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => (n.nodeValue ?? "").trim())
        .join("");
      if (!own) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (parseFloat(cs.opacity) < 0.1) invisible.push(`opacity=${cs.opacity} ${describe(el)}`);
    }

    return { invisible, reveals: reveals.length };
  });
}

test.describe("prefers-reduced-motion", () => {
  for (const path of PATHS) {
    test(`nothing is left invisible when animation is off — ${label(path)}`, async ({ page }) => {
      // Set before the first navigation: both the CSS opt-out and `Reveal`'s
      // own check read the media query at parse/mount time.
      await page.emulateMedia({ reducedMotion: "reduce" });

      // Deliberately no scrolling: nothing is brought into view, so anything
      // still hidden is content only an animation would ever have revealed.
      await page.goto(path, { waitUntil: "load" });
      await page.evaluate(() => document.fonts?.ready);

      // Polls rather than sleeps: motion-driven components settle their own
      // reduced-motion state during hydration, a frame or two after load.
      await expect
        .poll(async () => (await invisibleContent(page)).invisible, {
          message: `${label(path)}: content hidden under prefers-reduced-motion`,
          timeout: 10_000,
        })
        .toEqual([]);

      const { reveals } = await invisibleContent(page);
      if (path === "/") {
        expect(reveals, "the home page should use scroll reveals at all").toBeGreaterThan(0);
      }
    });
  }
});

/* ==========================================================================
   11b. The two icon-only controls that only exist on the mobile layout
   ========================================================================== */

test.describe("mobile chrome has accessible names", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("menu button and theme radios are named and stay named", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });

    const openBtn: Locator = page.getByRole("button", { name: "Open menu", exact: true });
    await expect(openBtn, "the hamburger is icon-only and needs a name").toBeVisible();
    await expect(openBtn).toHaveAttribute("aria-expanded", "false");

    // The panel is client state, so the click only does anything once React has
    // hydrated. Retrying the click is the deterministic way to wait for that —
    // there is no sleep long enough to be correct on every machine.
    const closeBtn = page.getByRole("button", { name: "Close menu", exact: true });
    await expect(async () => {
      await openBtn.click();
      await expect(closeBtn).toBeVisible({ timeout: 1500 });
    }).toPass({ timeout: 20_000 });

    // The same control, renamed for its new state — not a second button.
    await expect(closeBtn).toHaveAttribute("aria-expanded", "true");

    const group = page.getByRole("group", { name: "Colour theme" });
    await expect(group, "the theme control needs a group name").toBeVisible();

    for (const name of ["System", "Light", "Dark"]) {
      await expect(
        group.getByRole("radio", { name, exact: true }),
        `theme radio "${name}" must expose its name`,
      ).toHaveCount(1);
    }

    // Names are only useful if the control does something.
    await group.getByRole("radio", { name: "Dark", exact: true }).check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
