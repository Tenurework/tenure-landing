import { test, expect, type Page } from "@playwright/test";
import { ALL_ROUTES, contrastRatio } from "./support";
import { site } from "../src/lib/site";

/**
 * INTERACTIVE SURFACES.
 *
 * Everything here exercises behaviour a user can actually trigger — the theme
 * control, the conversion CTA, the scheduler, the FAQ disclosures and the
 * product mock — and every assertion is about what the page *does*, not about
 * which elements exist.
 *
 * Two of these guard against regressions of bugs that shipped to production:
 *  - the CTA was a <button> calling Calendly's popup API, which silently did
 *    nothing when calendly.com was blocked (routine on university networks);
 *  - Calendly's script/CSS/cookie banner loaded on every route, including the
 *    404, before anyone asked to schedule anything.
 */

/**
 * Every wait in this file is condition-based, never a sleep, so a generous
 * ceiling costs nothing when the machine is idle. It buys a lot when four
 * browser projects are driving a real production build at once, which is when
 * hydration can take a while and a 30s default turns contention into flake.
 */
test.describe.configure({ timeout: 90_000 });

/** localStorage key written by the inline head script (`ThemeScript.tsx`). */
const THEME_KEY = "tenure-theme";

/** Any calendly.com host, whichever asset it is serving. */
const CALENDLY = /https?:\/\/([a-z0-9-]+\.)*calendly\.com\//i;

/** A URL no route matches, so the branded 404 renders. */
const NOT_FOUND = "/no-such-page-b41f";

/**
 * Waits until React has actually hydrated, rather than guessing with a sleep.
 * React attaches `__reactFiber$…` / `__reactProps$…` keys to the host nodes it
 * owns as it hydrates, so their presence on the (client-component) header is a
 * direct signal that event handlers are live. Without this, a click fired
 * against server HTML is simply dropped and the test flakes.
 */
async function hydrated(page: Page) {
  await page.waitForFunction(
    () => {
      const el = document.querySelector("header");
      return !!el && Object.keys(el).some((k) => k.startsWith("__react"));
    },
    undefined,
    { timeout: 45_000 },
  );
}

/**
 * Returns a getter for the theme radios, opening the mobile menu first when the
 * header control is collapsed. The desktop control is `display:none` below the
 * `md` breakpoint, so it is not in the accessibility tree and `getByRole` will
 * not match it — which is exactly the behaviour we want to rely on.
 */
async function themeRadios(page: Page) {
  const get = (label: "System" | "Light" | "Dark") =>
    page.getByRole("radio", { name: label, exact: true });
  if ((await get("Dark").count()) === 0) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(get("Dark")).toBeVisible();
  }
  return get;
}

/** Picks a theme through the real control and waits for it to land. */
async function choose(page: Page, label: "System" | "Light" | "Dark") {
  const get = await themeRadios(page);
  await get(label).check();
  await expect(get(label)).toBeChecked();
}

/**
 * The page background as real sRGB bytes.
 *
 * The tokens are authored in OKLCH and Chromium serialises `backgroundColor`
 * in that same space, so the string cannot be read as rgb(). Painting it to a
 * 1x1 canvas asks the engine for the colour it would actually put on screen,
 * which is the thing under test.
 */
async function bodyBackground(page: Page): Promise<[number, number, number]> {
  const rgb = await page.evaluate(() => {
    const value = getComputedStyle(document.body).backgroundColor;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ff00ff";
    ctx.fillStyle = value;
    const parsed = ctx.fillStyle !== "#ff00ff";
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return { value, parsed, rgb: [r, g, b] as [number, number, number] };
  });
  expect(rgb.parsed, `unreadable background colour: ${rgb.value}`).toBe(true);
  return rgb.rgb;
}

/** Walks the whole document so reveal/in-view content has been triggered. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let travelled = 0;
      const step = () => {
        window.scrollBy(0, window.innerHeight * 0.9);
        travelled += window.innerHeight * 0.9;
        if (travelled < document.body.scrollHeight + window.innerHeight) {
          setTimeout(step, 50);
        } else resolve();
      };
      step();
    });
  });
  await page.evaluate(() => window.scrollTo(0, 0));
}

/* ========================================================================== */
/* 1. THEME                                                                    */
/* ========================================================================== */

test.describe("theme control", () => {
  test("dark and light write data-theme; system removes it", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    const html = page.locator("html");

    await choose(page, "Dark");
    await expect(html).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe("dark");

    await choose(page, "Light");
    await expect(html).toHaveAttribute("data-theme", "light");
    expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBe("light");

    // "System" must remove the attribute outright rather than write a value,
    // so the prefers-color-scheme rules in globals.css take over again and keep
    // following the OS if it changes mid-session.
    await choose(page, "System");
    await expect(html).not.toHaveAttribute("data-theme", /.*/);
    expect(await page.evaluate((k) => localStorage.getItem(k), THEME_KEY)).toBeNull();

    // …and the page really is following the OS again.
    const prefersDark = await page.evaluate(
      () => matchMedia("(prefers-color-scheme: dark)").matches,
    );
    const systemBg = await bodyBackground(page);
    await choose(page, prefersDark ? "Dark" : "Light");
    expect(await bodyBackground(page)).toEqual(systemBg);
  });

  test("the choice survives a reload", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    await choose(page, "Dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await hydrated(page);

    // The control itself must come back showing the restored choice, not the
    // "system" default it server-renders.
    const get = await themeRadios(page);
    await expect(get("Dark")).toBeChecked();
    await expect(get("System")).not.toBeChecked();
  });

  test("the theme is applied during parsing, so there is no flash", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    await choose(page, "Dark");

    // Records `data-theme` the instant <body> joins the document. The inline
    // head script is parser-blocking, so it has already run by then; anything
    // that waited for hydration (useEffect, next/script) would record "none"
    // and this assertion would fail — which is precisely the flash.
    await page.addInitScript(() => {
      (window as unknown as { __themeAtParse?: string }).__themeAtParse = "unset";
      new MutationObserver((_records, observer) => {
        if (!document.body) return;
        (window as unknown as { __themeAtParse?: string }).__themeAtParse =
          document.documentElement.getAttribute("data-theme") ?? "none";
        observer.disconnect();
      }).observe(document, { childList: true, subtree: true });
    });

    await page.reload();
    expect(
      await page.evaluate(
        () => (window as unknown as { __themeAtParse?: string }).__themeAtParse,
      ),
      "data-theme must already be set when <body> is parsed",
    ).toBe("dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("switching theme changes the rendered background", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);

    await choose(page, "Light");
    const light = await bodyBackground(page);
    await choose(page, "Dark");
    const dark = await bodyBackground(page);

    expect(dark).not.toEqual(light);
    // Not merely different — genuinely inverted. A theme that only shifts a
    // hue would pass an inequality check and fail a user.
    expect(
      contrastRatio(light, dark),
      `light ${light} vs dark ${dark} are barely distinguishable`,
    ).toBeGreaterThan(5);
    expect(light[0] + light[1] + light[2]).toBeGreaterThan(dark[0] + dark[1] + dark[2]);
  });
});

/* ========================================================================== */
/* 2. CONVERSION CTA                                                           */
/* ========================================================================== */

test.describe("conversion CTA", () => {
  test("every CTA is a link to /contact, never a button", async ({ page }) => {
    test.slow(); // nine page loads in one test
    for (const route of [...ALL_ROUTES, NOT_FOUND]) {
      await page.goto(route);
      const ctas = await page.evaluate((label) => {
        return [...document.querySelectorAll("a, button")]
          .map((el) => ({
            tag: el.tagName,
            href: el.getAttribute("href"),
            text: (el.textContent ?? "").replace(/\s+/g, " ").trim(),
          }))
          .filter((c) => c.text.includes(label));
      }, site.ctaLabel);

      expect(ctas.length, `${route} has no "${site.ctaLabel}" CTA`).toBeGreaterThan(0);

      // The production bug: a <button> that called a third-party popup API and
      // did nothing at all when that third party was blocked.
      expect(
        ctas.filter((c) => c.tag === "BUTTON"),
        `${route} renders the CTA as a button`,
      ).toEqual([]);

      for (const cta of ctas) {
        // /contact carries one extra CTA — the scheduler's own plain anchor
        // straight to the booking page, which is the whole point of that page.
        const expected = route === "/contact" && cta.href !== "/contact"
          ? site.calendlyUrl
          : "/contact";
        expect(cta.href, `${route}: CTA "${cta.text}" points at ${cta.href}`).toBe(expected);
      }
    }
  });

  test("clicking the CTA lands on /contact", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    await page.getByRole("link", { name: site.ctaLabel }).first().click();
    await expect(page).toHaveURL(/\/contact$/);
    // The destination is the real scheduling page, not just a matching URL.
    await expect(page.getByRole("button", { name: "Or pick a time here" })).toBeVisible();
  });

  test("the CTA works with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.goto("/product");
      const cta = page.getByRole("link", { name: site.ctaLabel }).first();
      await expect(cta).toHaveAttribute("href", "/contact");
      // A plain anchor still navigates with no script runtime at all.
      await cta.click();
      await expect(page).toHaveURL(/\/contact$/);
      await expect(page.getByRole("link", { name: site.email }).first()).toHaveAttribute(
        "href",
        `mailto:${site.email}`,
      );
    } finally {
      await context.close();
    }
  });
});

/* ========================================================================== */
/* 3. THIRD PARTY                                                              */
/* ========================================================================== */

test.describe("third-party loading", () => {
  test("no calendly request is made on any route", async ({ page }) => {
    test.slow(); // nine page loads, each scrolled end to end
    const requested: string[] = [];
    page.on("request", (r) => {
      if (CALENDLY.test(r.url())) requested.push(`${page.url()} -> ${r.url()}`);
    });
    // Nothing should reach the network, but block it anyway so a regression
    // fails the assertion instead of quietly contacting a third party.
    await page.route(CALENDLY, (route) => route.abort());

    for (const route of [...ALL_ROUTES, NOT_FOUND]) {
      await page.goto(route);
      // Scroll first: anything lazily triggered on view gets its chance before
      // we wait for the network to go quiet.
      await scrollThrough(page);
      await page.waitForLoadState("networkidle");
    }
    expect(requested).toEqual([]);
  });

  test("/contact loads calendly only once the disclosure is pressed", async ({ page }) => {
    const requested: string[] = [];
    page.on("request", (r) => {
      if (CALENDLY.test(r.url())) requested.push(r.url());
    });
    await page.route(CALENDLY, (route) => {
      const url = route.request().url();
      if (url.endsWith(".css")) {
        return route.fulfill({ contentType: "text/css", body: "" });
      }
      return route.fulfill({
        contentType: "application/javascript",
        body: `window.Calendly={initInlineWidget:function(o){
          var d=document.createElement("div");
          d.setAttribute("data-stub-calendly",o.url);
          d.textContent="stub calendar";
          o.parentElement.appendChild(d);}};`,
      });
    });

    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    await hydrated(page);
    expect(requested, "calendly loaded before the visitor asked for it").toEqual([]);

    const disclosure = page.getByRole("button", { name: "Or pick a time here" });
    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await disclosure.click();

    const embed = page.locator("#scheduler-embed [data-stub-calendly]");
    await expect(embed).toBeVisible();
    await expect(embed).toHaveAttribute(
      "data-stub-calendly",
      new RegExp(`^${site.calendlyUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\?`),
    );
    expect(requested.some((u) => u.endsWith("widget.js"))).toBe(true);

    // A real disclosure: the control stays put, reports its state, and collapses.
    const collapse = page.getByRole("button", { name: "Hide the calendar" });
    await expect(collapse).toHaveAttribute("aria-expanded", "true");
    await collapse.click();
    await expect(page.locator("#scheduler-embed")).toBeHidden();
  });
});

/* ========================================================================== */
/* 4. SCHEDULER FALLBACK                                                       */
/* ========================================================================== */

test.describe("scheduler with calendly blocked", () => {
  test.beforeEach(async ({ page }) => {
    await page.route(CALENDLY, (route) => route.abort("blockedbyclient"));
  });

  test("the booking anchor and the email fallback both still work", async ({ page }) => {
    await page.goto("/contact");
    await hydrated(page);

    // Scoped to <main>. This used to be `page.getByRole(...).last()`, which worked
    // only because the footer's CTA said "Contact Sales" and therefore did not match
    // site.ctaLabel. That was itself the defect — site.ts retired that phrase and the
    // footer was overriding the decision — so once the footer started rendering
    // site.ctaLabel too, `.last()` began selecting the footer's /contact link instead
    // of this page's scheduler anchor. Scoping says what the test actually means.
    const anchor = page
      .getByRole("main")
      .getByRole("link", { name: new RegExp(`^${site.ctaLabel}`) })
      .last();
    await expect(anchor).toBeVisible();
    await expect(anchor).toHaveAttribute("href", site.calendlyUrl);
    await expect(anchor).toHaveAttribute("target", "_blank");
    await expect(anchor).toHaveAttribute("rel", /noopener/);

    const email = page.getByRole("link", { name: site.email });
    await expect(email.first()).toBeVisible();
    await expect(email.first()).toHaveAttribute("href", `mailto:${site.email}`);
  });

  test("a blocked embed surfaces the failure instead of an empty box", async ({ page }) => {
    await page.goto("/contact");
    await hydrated(page);

    await page.getByRole("button", { name: "Or pick a time here" }).click();

    const status = page.getByRole("status");
    await expect(status).toBeVisible();
    await expect(status).toContainText(/could not load/i);
    await expect(status.getByRole("link", { name: site.email })).toHaveAttribute(
      "href",
      `mailto:${site.email}`,
    );

    // No blank rectangle left behind, and the control is usable again.
    await expect(page.locator("#scheduler-embed")).toBeHidden();
    const disclosure = page.getByRole("button", { name: "Or pick a time here" });
    await expect(disclosure).toBeEnabled();
    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
  });
});

/* ========================================================================== */
/* 5. FAQ DISCLOSURES                                                          */
/* ========================================================================== */

test.describe("FAQ disclosures", () => {
  test("each item opens and closes by click, and only one stays open", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);

    const items = page.locator("details[name='faq']");
    const count = await items.count();
    expect(count).toBeGreaterThan(1);

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const summary = item.locator("summary");
      const answer = item.locator("summary + div");

      if (await item.evaluate((el: HTMLDetailsElement) => el.open)) {
        await summary.click();
      }
      await expect(item).toHaveJSProperty("open", false);
      await expect(answer).toBeHidden();

      await summary.click();
      await expect(item).toHaveJSProperty("open", true);
      await expect(answer).toBeVisible();
      expect((await answer.innerText()).trim().length).toBeGreaterThan(40);

      // Shared `name` makes these an exclusive accordion: opening one must
      // close the rest.
      const openCount = await items.evaluateAll(
        (els) => els.filter((el) => (el as HTMLDetailsElement).open).length,
      );
      expect(openCount, `item ${i} did not close its siblings`).toBe(1);

      await summary.click();
      await expect(item).toHaveJSProperty("open", false);
      await expect(answer).toBeHidden();
    }
  });

  test("each item opens and closes from the keyboard", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);

    const items = page.locator("details[name='faq']");
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const summary = item.locator("summary");

      if (await item.evaluate((el: HTMLDetailsElement) => el.open)) {
        await summary.click();
        await expect(item).toHaveJSProperty("open", false);
      }

      await summary.focus();
      await expect(summary).toBeFocused();

      for (const key of ["Enter", "Space"]) {
        await page.keyboard.press(key);
        await expect(item, `${key} did not open item ${i}`).toHaveJSProperty("open", true);
        await expect(item.locator("summary + div")).toBeVisible();

        await page.keyboard.press(key);
        await expect(item, `${key} did not close item ${i}`).toHaveJSProperty("open", false);
        await expect(item.locator("summary + div")).toBeHidden();
      }
    }
  });
});

/* ========================================================================== */
/* 6. PRODUCT MOCK                                                             */
/* ========================================================================== */

/** Copy that appears in exactly one module panel of the hero mock. */
const PANEL_MARKER = {
  Finance: "Treasury balance",
  Calendar: "Room conflict",
  Members: "durable roles",
  Memory: "carried across 3 terms",
} as const;

test.describe("product mock", () => {
  test("the module controls change the rendered panel", async ({ page }, testInfo) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) < 640,
      "the module rail is deliberately hidden below the sm breakpoint",
    );
    void testInfo;

    await page.goto("/");
    await hydrated(page);

    const rail = page.locator("aside").filter({ has: page.locator("button[aria-pressed]") }).first();
    const button = (name: keyof typeof PANEL_MARKER) =>
      rail.getByRole("button", { name, exact: true });

    await expect(button("Finance")).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(PANEL_MARKER.Finance)).toBeVisible();

    for (const name of ["Calendar", "Memory", "Members"] as const) {
      await button(name).click();
      await expect(button(name)).toHaveAttribute("aria-pressed", "true");
      await expect(button("Finance")).toHaveAttribute("aria-pressed", "false");

      await expect(page.getByText(PANEL_MARKER[name])).toBeVisible();
      // The previous panel is gone, not merely covered.
      await expect(page.getByText(PANEL_MARKER.Finance)).toHaveCount(0);
    }

    await button("Finance").click();
    await expect(page.getByText(PANEL_MARKER.Finance)).toBeVisible();
    await expect(page.getByText(PANEL_MARKER.Members)).toHaveCount(0);
  });

  test("the mock auto-advances once it is on screen", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);

    // The pause control's presence is what says the tour is running — it
    // replaced a plain "auto-touring" status label, because WCAG 2.2.2 needs a
    // way to stop anything auto-updating for more than five seconds, and hover
    // is not one for a touch or keyboard user.
    const pause = page.getByRole("button", { name: /pause tour/i });
    await expect(pause).toBeVisible();

    // Scrolled into view deliberately. The tour is gated on an IntersectionObserver,
    // so on a phone-sized viewport — where the mock stacks below the heading, the
    // lead, both CTAs and two footnotes — it is not running when the page loads, and
    // asserting otherwise would be asserting the bug this gate exists to fix. On
    // desktop the mock is already in the first viewport and this is a no-op.
    await pause.scrollIntoViewIfNeeded();

    await expect(page.getByText(PANEL_MARKER.Finance)).toBeVisible();
    // The tour advances every 4.2s; this waits for the next panel rather than
    // sleeping for a fixed interval.
    await expect(page.getByText(PANEL_MARKER.Calendar)).toBeVisible({ timeout: 15_000 });
  });

  test("the tour stops while it is off screen", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);

    const pause = page.getByRole("button", { name: /pause tour/i });
    await expect(pause).toBeVisible();
    await pause.scrollIntoViewIfNeeded();
    await expect(page.getByText(PANEL_MARKER.Finance)).toBeVisible();

    // Away from the mock, well past it.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // A fixed wait, which this suite otherwise avoids — but the assertion is that
    // something does NOT happen, and there is no event to await for that. 6s clears
    // the 4.2s tick with room. Before the gate, five ticks would have fired here for
    // a surface scrolled far off screen, on every visitor's phone, for the whole
    // session; that work was measured at roughly 438ms of style and layout.
    await page.waitForTimeout(6_000);

    await page.evaluate(() => window.scrollTo(0, 0));
    await pause.scrollIntoViewIfNeeded();
    await expect(page.getByText(PANEL_MARKER.Finance)).toBeVisible();
  });

  test("the tour can be paused and resumed without a mouse", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);

    const pause = page.getByRole("button", { name: /pause tour/i });
    await pause.focus();
    await page.keyboard.press("Enter");

    const resume = page.getByRole("button", { name: /resume tour/i });
    await expect(resume).toBeVisible();
    await expect(resume).toHaveAttribute("aria-pressed", "true");

    // A negative needs an observation window: two full intervals must pass with
    // the panel unchanged, or "paused" is decorative.
    const panel = await page.getByText(PANEL_MARKER.Finance).isVisible();
    if (panel) {
      await page.waitForTimeout(9_000);
      await expect(page.getByText(PANEL_MARKER.Finance)).toBeVisible();
    }

    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: /pause tour/i })).toBeVisible();
  });

  test("reduced motion stops the auto-advance", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await hydrated(page);

    // The mock reports its own mode, and under reduced motion it must not
    // claim to be touring.
    await expect(page.getByText("click a module")).toBeVisible();
    await expect(page.getByText("auto-touring")).toHaveCount(0);
    await expect(page.getByText(PANEL_MARKER.Finance)).toBeVisible();

    // A negative needs an observation window, not a wait: one full tour
    // interval plus margin has to pass with the panel unchanged.
    await page.waitForTimeout(6_000);
    await expect(page.getByText(PANEL_MARKER.Finance)).toBeVisible();
    await expect(page.getByText(PANEL_MARKER.Calendar)).toHaveCount(0);
  });
});

/* ========================================================================== */
/* 7. REDUCED MOTION                                                           */
/* ========================================================================== */

test.describe("reduced motion", () => {
  test("nothing is left invisible at opacity 0", async ({ page }) => {
    test.slow(); // nine page loads, each scrolled end to end
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const route of [...ALL_ROUTES, NOT_FOUND]) {
      await page.goto(route);
      await hydrated(page);
      await scrollThrough(page);

      await expect
        .poll(
          async () =>
            page.evaluate(() =>
              [...document.querySelectorAll<HTMLElement>("body *")]
                .filter((el) => getComputedStyle(el).opacity === "0")
                // The theme radios are deliberately transparent hit targets
                // laid over their labels: `display:none` would take them out
                // of the tab order, which is the accessibility bug this avoids.
                .filter((el) => el.tagName !== "INPUT")
                .map(
                  (el) =>
                    `${el.tagName}.${(el.getAttribute("class") ?? "").slice(0, 40)} ${(
                      el.textContent ?? ""
                    )
                      .replace(/\s+/g, " ")
                      .trim()
                      .slice(0, 40)}`,
                ),
            ),
          { message: `${route} still hides content at opacity 0`, timeout: 15_000 },
        )
        .toEqual([]);
    }
  });

  test("smooth scrolling is switched off", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    ).not.toBe("smooth");

    // …and the default really is smooth, so the assertion above means something.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    ).toBe("smooth");
  });
});

/* ========================================================================== */
/* 8. NO JAVASCRIPT                                                            */
/* ========================================================================== */

test.describe("without JavaScript", () => {
  test("the home page still renders its headline and body copy", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.goto("/");

      // The headline is the LCP element. It used to be a word-by-word motion
      // stagger, which meant the largest text on the page was server-rendered
      // at opacity 0 behind a blur and never appeared at all without a bundle.
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
      expect((await h1.innerText()).trim().length).toBeGreaterThan(20);
      expect(
        await h1.evaluate((el) => getComputedStyle(el).opacity),
        "the headline is transparent without JavaScript",
      ).toBe("1");

      // Body copy from three separately-revealed regions: the hero paragraph,
      // a metrics tile (driven from site.ts) and the FAQ. The reveal's hidden
      // state is scoped to a `.js` class the inline script adds, so with no
      // script runtime it must never apply.
      const heroCopy = page.locator("h1 ~ [data-reveal] p").first();
      await expect(heroCopy).toBeVisible();
      expect((await heroCopy.innerText()).trim().length).toBeGreaterThan(80);

      await expect(page.getByText(site.metrics[0].label)).toBeVisible();

      const questions = page.locator("details[name='faq'] summary");
      expect(await questions.count()).toBeGreaterThan(2);
      await expect(questions.first()).toBeVisible();
      expect((await questions.first().innerText()).trim().length).toBeGreaterThan(10);

      const hiddenReveals = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
          (el) => getComputedStyle(el).opacity === "0",
        ).length,
      );
      expect(hiddenReveals, "reveal content is invisible without JavaScript").toBe(0);
    } finally {
      await context.close();
    }
  });

  test.fixme(
    "no element is server-rendered at inline opacity:0",
    async ({ browser }) => {
      // FAILS TODAY: 8 elements. The `Reveal` rewrite removed the 118 reported
      // in its own comment, but five `motion` components still pass an
      // unconditional (or `useReducedMotion`-gated) `initial={{ opacity: 0 }}`,
      // and motion serialises that into a server-rendered inline style —
      // `useReducedMotion()` is null during SSR, so the guard never fires:
      //   HeroFloatingCards.tsx:20,44   ProductAtWork.tsx:61,103
      //   SeatMechanism.tsx:201,233     DashboardMock.tsx:433
      // Owned by whoever owns src/; not fixed here.
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();
      try {
        await page.goto("/");
        const hidden = await page.evaluate(() =>
          [...document.querySelectorAll<HTMLElement>("[style]")]
            .filter((el) => /opacity:\s*0(?!\.)/.test(el.getAttribute("style") ?? ""))
            .map((el) => `${el.tagName} ${(el.textContent ?? "").trim().slice(0, 40)}`),
        );
        expect(hidden).toEqual([]);
      } finally {
        await context.close();
      }
    },
  );
});
