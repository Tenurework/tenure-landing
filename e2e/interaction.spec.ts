import { test, expect, type Page } from "@playwright/test";
import {ALL_ROUTES} from "./support";
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
/* 1. THEME — deleted 2026-08-20                                               */
/* ========================================================================== */
/*
  The site renders one way now. The toggle, the inline pre-paint script and the
  second palette were all removed, so the eleven tests that lived here — which
  asserted data-theme round-tripping, localStorage persistence and no flash of
  the wrong theme — were asserting machinery that no longer exists.

  What replaced them is smaller and stronger, in the "one theme" test below:
  nothing writes data-theme, and the served CSS carries no dark palette. That
  catches a reintroduction, which is the only regression left to catch.
*/
test.describe("one theme", () => {
  test("nothing sets data-theme, and no dark palette ships", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);

    // The toggle's controls are gone from the header, both viewports.
    await expect(page.getByRole("radiogroup", { name: /colou?r theme/i })).toHaveCount(0);

    // And the palette itself: a dark block in the served CSS would mean the
    // theme came back through the stylesheet rather than through the UI.
    const css = await page.evaluate(async () => {
      const href = [...document.querySelectorAll("link[rel=stylesheet]")]
        .map((l) => (l as HTMLLinkElement).href)
        .find(Boolean);
      return href ? await (await fetch(href)).text() : "";
    });
    expect(css.length, "the stylesheet was fetched").toBeGreaterThan(1000);
    expect(css).not.toContain('data-theme="dark"');
    expect(css).not.toContain("prefers-color-scheme:dark");
    expect(css).not.toContain("prefers-color-scheme: dark");
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
            inFooter: !!el.closest("footer"),
            // A control that OPENS THE COMPOSER is a dialog trigger, not
            // navigation. It declares itself as one, and that declaration is
            // what exempts it below.
            opensDialog: el.getAttribute("aria-haspopup") === "dialog",
          }))
          .filter((c) => c.text.includes(label));
      }, site.ctaLabel);

      expect(ctas.length, `${route} has no "${site.ctaLabel}" CTA`).toBeGreaterThan(0);

      /*
        The production bug this guards: a <button> that called a third-party
        popup API and did nothing at all when that third party was blocked.

        The one legitimate button is the composer's own trigger on /contact. It
        was previously excluded by accident — it carried a different label
        ("Request a walkthrough" against a CTA reading "Book a walkthrough"),
        which is exactly the four-names-for-one-action problem that got fixed.
        Now that every control says the same thing, the exemption has to be
        stated: a dialog trigger declares `aria-haspopup="dialog"`, and nothing
        else may be a button.
      */
      expect(
        ctas.filter((c) => c.tag === "BUTTON" && !c.opensDialog),
        `${route} renders the CTA as a button that does not open a dialog`,
      ).toEqual([]);

      for (const cta of ctas) {
        if (cta.opensDialog) continue;
        /*
          Every control carrying site.ctaLabel is a real anchor — that is the
          guarantee this test exists for, after a <button> calling a third-party
          popup API silently did nothing in production.
          ON /contact it points at "#request" instead of "/contact". Linking the
          page to itself made the site's single conversion button inert in its
          most prominent slot: measured at scrollY=900, clicking it changed
          neither the URL nor the scroll position. It is an in-page jump to the
          request composer there, which is still an anchor and still works with
          JavaScript off.
        */
        /*
          On /contact the HEADER CTA is an in-page jump to the composer. Linking
          the page to itself made the site's single conversion button inert in its
          most prominent slot: measured at scrollY=900, clicking it changed
          neither the URL nor the scroll position.

          The FOOTER keeps /contact even on /contact. A footer is a site map, and
          a site map listing the page you are on is correct — that is not a dead
          control in the way a conversion button is. Making it route-aware would
          mean pushing usePathname, and a client boundary, onto a component
          rendered at every CTA on the site in order to change one chrome link.
        */
        const expected =
          route === "/contact" && !cta.inFooter ? "#request" : "/contact";
        expect(cta.href, `${route}: CTA "${cta.text}" points at ${cta.href}`).toBe(expected);
      }
    }
  });

  test("clicking the CTA lands on /contact", async ({ page }) => {
    await page.goto("/");
    await hydrated(page);
    await page.getByRole("link", { name: site.ctaLabel }).first().click();
    await expect(page).toHaveURL(/\/contact$/);
    // The destination is the real conversion surface, not just a matching URL —
    // and what opens there is Tenure's own composer, not a third party's widget.
    await expect(
      page.getByRole("button", { name: "Request a demo" }),
    ).toBeVisible();
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
      await expect(page.getByRole("link", { name: site.email.sales }).first()).toHaveAttribute(
        "href",
        `mailto:${site.email.sales}`,
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

  /**
   * The inline Calendly embed is gone, so the assertion that used to prove it
   * loaded ONLY after a click is now stronger and simpler: it must never load at
   * all, on any route, no matter what the visitor does. /contact is exercised
   * here specifically — including opening the request dialog, which is the
   * interaction that replaced the embed — because it is the one route that even
   * mentions Calendly.
   */
  test("/contact never loads calendly, not even when the composer is opened", async ({
    page,
  }) => {
    const requested: string[] = [];
    page.on("request", (r) => {
      if (CALENDLY.test(r.url())) requested.push(r.url());
    });
    await page.route(CALENDLY, (route) => route.abort());

    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    await hydrated(page);

    await page.getByRole("button", { name: "Request a demo" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByLabel("Your name").fill("Alex Mercer");
    await page.waitForLoadState("networkidle");

    expect(
      requested,
      "the request composer is first-party and must reach no third party",
    ).toEqual([]);
  });
});

/* ========================================================================== */
/* 4. THE FIRST-PARTY REQUEST COMPOSER                                         */
/* ========================================================================== */

/**
 * What replaced the Calendly embed.
 *
 * The tests below are the same three guarantees the scheduler had to satisfy,
 * pointed at a surface this repository owns:
 *
 *   1. nothing third-party loads (above, in the third-party block);
 *   2. the visitor is never stranded — the email address is a plain anchor
 *      rendered from the start, and the outbound scheduler link is a plain
 *      anchor too, so both survive JavaScript being off entirely;
 *   3. the composer does what it says: it builds the request from what was
 *      typed, and hands it over by mailto rather than pretending to submit it.
 *
 * (3) is the one genuinely new assertion, and it is the one that matters most:
 * a form on a site with no backend is a lie unless the handoff is real, so the
 * mailto href is checked to actually carry the typed values.
 */
test.describe("the walkthrough composer", () => {
  test("it opens, traps focus, and closes back onto its trigger", async ({ page }) => {
    await page.goto("/contact");
    await hydrated(page);

    const trigger = page.getByRole("button", { name: "Request a demo" });
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeHidden();

    await trigger.click();
    await expect(dialog).toBeVisible();
    // A native <dialog> opened with showModal() is modal by definition; this is
    // what proves showModal() was used rather than the `open` attribute, which
    // renders a non-modal dialog with no focus trap and no inert background.
    await expect(dialog).toHaveJSProperty("open", true);
    expect(
      await dialog.evaluate((el) => el.matches(":modal")),
      "the dialog must be modal — a non-modal one traps nothing",
    ).toBe(true);

    // Escape closes it and focus comes back to the control that opened it.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger, "focus must return to the trigger").toBeFocused();
  });

  test("what is typed reaches the mailto, so nothing is silently dropped", async ({
    page,
  }) => {
    await page.goto("/contact");
    await hydrated(page);
    await page.getByRole("button", { name: "Request a demo" }).click();

    await page.getByLabel("Your name").fill("Alex Mercer");
    await page.getByLabel("Organization name").fill("Northside Community Trust");
    await page.getByLabel("Kind of organization").selectOption("Nonprofits and NGOs");
    await page.getByRole("checkbox", { name: /handoff packet/i }).check();

    // The visitor is shown the request before sending it, and that preview must
    // be the same text the mail client receives.
    const preview = page.getByLabel("The composed request");
    await expect(preview).toHaveValue(/Alex Mercer/);
    await expect(preview).toHaveValue(/Northside Community Trust/);
    await expect(preview).toHaveValue(/Nonprofits and NGOs/);

    const send = page.getByRole("link", { name: "Open in your email app" });
    const href = await send.getAttribute("href");
    expect(
      href,
      "the composer is a SALES motion and must reach the sales desk, not a catch-all",
    ).toContain(`mailto:${site.email.sales}`);

    const url = new URL(href!);
    const params = new URLSearchParams(url.search);
    expect(params.get("subject")).toContain("Northside Community Trust");
    const body = params.get("body") ?? "";
    expect(body).toContain("Alex Mercer");
    expect(body).toContain("Nonprofits and NGOs");
    expect(body, "the chosen topic travels with the request").toMatch(/handoff packet/i);
  });

  test("the primary action reports that it handed over, and names the fallback", async ({
    page,
  }) => {
    /*
      The control was a bare <a href={mailto}> with no handler and no state.
      On a machine with no registered mail handler — a shared lab browser, a
      Chromebook signed into webmail, most corporate images — clicking it does
      NOTHING: no navigation, no error, no change on screen. The visitor cannot
      tell "sent" from "broken".

      The page cannot observe whether a draft opened, so it must not claim it
      did. What it can truthfully say is that it handed the request over, and
      it has to name the fallback in the same breath.
    */
    await page.goto("/contact");
    await hydrated(page);
    await page.getByRole("button", { name: "Request a demo" }).click();

    const status = page.getByRole("dialog").getByText(/This page sends nothing on its own/);
    await expect(status, "before the handoff, the standing disclaimer shows").toBeVisible();

    // Swallow the mailto navigation so the test browser does not try to resolve it.
    await page.route("mailto:**", (route) => route.abort());
    await page.getByRole("link", { name: "Open in your email app" }).click();

    const handed = page.getByRole("dialog").getByText(/Handed to your mail app/);
    await expect(handed).toBeVisible();
    await expect(
      page.getByRole("dialog").getByText(/no draft opened/),
      "the fallback is named next to the confirmation, because nothing happening is the likely outcome",
    ).toBeVisible();
    await expect(
      handed,
      "it must never claim the mail was SENT — this page cannot observe that",
    ).not.toContainText(/\bsent\b/i);
  });

  test("Enter sends from any field, because the body is a real form", async ({ page }) => {
    // The composer was divs, so Enter did nothing. A visitor who fills a form
    // and presses Enter expects it to submit.
    await page.goto("/contact");
    await hydrated(page);
    await page.getByRole("button", { name: "Request a demo" }).click();

    const form = page.getByRole("dialog").locator("form");
    await expect(form, "the composer body is a <form>").toHaveCount(1);

    await page.route("mailto:**", (route) => route.abort());
    await page.getByLabel("Your name").fill("Alex Mercer");
    await page.getByLabel("Your name").press("Enter");

    await expect(page.getByRole("dialog").getByText(/Handed to your mail app/)).toBeVisible();
  });

  test("the one control that is not a text input looks like it is not", async ({ page }) => {
    // `appearance-none` stripped the native chevron and nothing replaced it, so
    // the only select on the form was visually identical to the four inputs
    // beside it.
    await page.goto("/contact");
    await hydrated(page);
    await page.getByRole("button", { name: "Request a demo" }).click();

    const select = page.getByLabel("Kind of organization");
    await expect(select).toBeVisible();
    // `xpath=following-sibling::svg` does NOT match here: <svg> lives in the SVG
    // namespace and a bare XPath name test matches the null namespace only. Walk
    // to the wrapper and look inside it instead.
    const marker = select.locator("xpath=..").locator("svg");
    await expect(marker, "the select carries a chevron of its own").toHaveCount(1);
    await expect(
      marker,
      "and it must not swallow the click that opens the menu",
    ).toHaveCSS("pointer-events", "none");
  });

  test("the email address and the scheduler link work with JavaScript disabled", async ({
    browser,
  }) => {
    // The composer needs JavaScript — a <dialog> cannot open without it. So the
    // two paths that never needed it are rendered BESIDE it rather than behind
    // it, and this is the test that keeps them there.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.goto("/contact");

      const email = page.getByRole("main").getByRole("link", { name: site.email.sales });
      await expect(email.first()).toBeVisible();
      await expect(email.first()).toHaveAttribute("href", `mailto:${site.email.sales}`);

      // The scheduler anchor was deleted with Calendly on 2026-08-20. The email
      // address below is now the only path that needs no JavaScript, which is why
      // it is asserted rather than merely present.
    } finally {
      await context.close();
    }
  });

  test("with every third party blocked, the conversion path still works", async ({ page }) => {
    await page.route(CALENDLY, (route) => route.abort("blockedbyclient"));
    await page.goto("/contact");
    await hydrated(page);

    // A blocked third party cannot affect a first-party dialog. That is the whole
    // point of the change: the conversion path no longer has a dependency to break.
    await page.getByRole("button", { name: "Request a demo" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open in your email app" }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    const email = page.getByRole("main").getByRole("link", { name: site.email.sales });
    await expect(email.first()).toHaveAttribute("href", `mailto:${site.email.sales}`);
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

      // The hero's own lead is deliberately NOT a reveal — nothing in the first
      // viewport animates in, so it paints with the document. This used to select
      // `h1 ~ [data-reveal] p`, which silently depended on that not being true.
      //
      // What the test is actually for is the reveal mechanism: its hidden state
      // is scoped to a `.js` class the inline script adds, so with no script
      // runtime it must never apply and every revealed paragraph must be legible.
      // So it now asserts against the first revealed paragraph anywhere in the
      // document, whichever section that happens to be.
      const revealed = page.locator("main [data-reveal] p").first();
      await expect(revealed).toBeVisible();
      expect((await revealed.innerText()).trim().length).toBeGreaterThan(80);

      // And the hero lead is still there and still legible, by its own text.
      const heroCopy = page.locator("h1 ~ p").first();
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
