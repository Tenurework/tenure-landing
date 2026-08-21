"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { ContactSales } from "@/components/ui/ContactSales";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  /**
   * The panel stores the route it was opened on rather than a boolean, so a
   * client navigation (or a browser back/forward) closes it as a consequence of
   * rendering the new route — no effect watching `pathname` to push state back
   * down, which is both a cascading render and easy to forget.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (next: boolean) => setOpenedAt(next ? pathname : null);

  /*
    THE MEGA MENU opens on hover AND on keyboard focus, and closes on a short
    timer rather than immediately.

    A menu that closes the instant the pointer leaves its trigger is unusable:
    there is a diagonal gap between a nav item and the panel below it, and
    crossing it takes the cursor outside both. The close is deferred ~120ms and
    cancelled if the pointer arrives anywhere in the menu, which is what makes
    that diagonal survivable.

    It is keyed by label rather than a boolean so moving sideways between two nav
    items swaps panels without a close/open flash.
  */
  const [menu, setMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const closeMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 220);
  };
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Modal-ish behaviour for the mobile panel: Escape closes it, focus moves into
   * it on open and returns to the trigger on close, and Tab is contained while
   * it is open. Previously Escape worked but focus was never moved or restored,
   * so a keyboard user who opened the menu was left at the top of the document
   * and had to tab back through the whole header.
   */
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const firstLink = panel?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // setOpenedAt rather than the setOpen helper: the helper is recreated
        // each render, which would make this effect re-subscribe on every one.
        setOpenedAt(null);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const focusables = [
        toggleRef.current,
        ...Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled])',
          ),
        ),
      ].filter(Boolean) as HTMLElement[];
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /**
   * The surface, priced per frame.
   *
   * `scrolled` flips 12px in, so whatever it selects is on for essentially the
   * whole visit — and a full-width backdrop-filter is the most expensive thing
   * on this page: the compositor has to read back the strip behind the header
   * and re-blur it on every frame the content beneath it moves, and what moves
   * beneath it is thousands of SVG contour paths and several large gradients.
   * So the session-long surface is a near-opaque fill instead. At 95% the fill
   * carries the legibility on its own in both themes, and the small blur that
   * remains is a depth cue rather than the thing doing the work — kept only for
   * fine pointers, where the compositor is not the bottleneck.
   *
   * The open mobile panel keeps the deeper treatment: it is transient, it is
   * dismissed rather than scrolled past, and its tint is part of how the panel
   * reads as a layer above the page.
   */
  const surface = open
    ? "border-line bg-canvas/85 backdrop-blur-xl"
    : scrolled
      ? "border-line bg-canvas/95 pointer-fine:backdrop-blur-sm"
      : "border-transparent";

  return (
    <header
      // THE HOVER REGION IS THE WHOLE HEADER, not the <nav>.
      //
      // `onMouseLeave` used to sit on <nav>, and the sheets render as siblings of
      // it at header level. Travelling from a ribbon item down into the panel
      // therefore crossed a strip of header belonging to neither — the pointer
      // left the nav, armed the close, and the sheet shut before anything in it
      // could be clicked. Measured: ~180ms to cross, against a 120ms timer.
      //
      // Hanging the handler on the header makes that strip part of the same
      // region, so the timer never arms while the pointer is anywhere in the
      // menu. The sheet keeps its own enter/leave as well, which is what lets it
      // close when the pointer leaves downward into the page.
      onMouseLeave={closeMenu}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        // `relative` is implied by `fixed`, but the sheet below positions against
        // THIS element with `top-full`, so the header must stay the containing
        // block for it — which it is, being fixed.
        surface,
      )}
    >
      {/*
          THE SHELL SITS ON THE SAME RAILS AS THE CONTENT. When the page container
          widened to 1360px with 40px margins, this kept `max-w-6xl px-5 sm:px-8`
, so the logo sat at x=176 while the sections beneath it started at
          x=40. The nav floated in from the edges like a different document.

          60px of height rather than 68 is cohere.com's measurement: a fixed bar
          is permanent furniture, and every pixel of it is taken from the page.
        */}
        <div className="mx-auto flex h-[60px] w-full max-w-[90rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Wordmark />

        <nav
          aria-label="Main"
          className="relative hidden items-center gap-0.5 lg:flex"
          onBlur={(e) => {
            // Only close when focus leaves the whole nav, not when it moves
            // between the trigger and the links inside its own panel.
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(null);
          }}
        >
          {site.nav.map((item) => {
            const active = pathname === item.href;
            const isOpen = menu === item.label;
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => openMenu(item.label)}
              >
                {/*
                  A LINK AND A DISCLOSURE, not one control doing both.

                  The panel used to open on focus, which broke reverse tab order
                  for real: tabbing forward off a trigger opened its panel and put
                  three more links in the sequence, but Shift+Tab arrived from the
                  next item with that panel already closed, so those links were
                  `visibility: hidden` and got skipped. Focus went somewhere it had
                  not come from. The a11y suite called it as "Shift+Tab must
                  retrace the forward order", which is exactly what it was.

                  Opening is now an explicit act, hover for a pointer, the
                  chevron button for a keyboard, so the set of focusable things
                  does not change as a side effect of moving through them.
                */}
                <div
                  className={cn(
                    // The pill marks the OPEN item, the way the reference marks
                    // its own. It is a state, not a decoration: with a full-bleed
                    // sheet below and the page dimmed behind it, the one thing a
                    // reader cannot otherwise tell is which word they opened.
                    "relative flex items-center rounded-full transition-colors duration-200",
                    isOpen ? "bg-sand text-ink" : active ? "text-ink" : "text-ink-soft hover:text-ink",
                  )}
                >
                  <Link
                    href={item.href}
                    data-nav-top=""
                    aria-current={active ? "page" : undefined}
                    className="py-2 pl-3.5 pr-1 text-body"
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`nav-panel-${item.label}`}
                    aria-label={`${item.label} menu`}
                    onClick={() => (isOpen ? setMenu(null) : openMenu(item.label))}
                    className="flex h-8 w-6 items-center justify-center rounded-md"
                  >
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden
                      className={cn(
                        "h-2.5 w-2.5 transition-transform duration-200",
                        isOpen ? "rotate-180" : "rotate-0",
                      )}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
                    </svg>
                  </button>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3.5 bottom-1 h-0.5 origin-left rounded-full bg-grove transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      active && !isOpen ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </div>
              </div>
            );
          })}

        </nav>

        <div className="hidden min-w-0 items-center gap-3 lg:flex">
          {/* On /contact the CTA would otherwise link to the page it is already
              on, a dead control in the most prominent slot on the site. There it
              becomes an in-page jump to the request composer instead. */}
          {pathname === "/contact" ? (
            <Button href="#request" size="sm" arrow>
              {site.ctaLabel}
            </Button>
          ) : (
            <ContactSales size="sm" arrow />
          )}
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-ink lg:hidden"
        >
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200",
                open ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </div>

      {/* Rendered only when open so its links are never reachable by Tab while
          the panel is visually collapsed. */}
      {open && (
        <div id="mobile-menu" ref={panelRef} className="lg:hidden">
          <nav aria-label="Main" className="flex flex-col gap-1 px-5 pb-6 pt-2">
            {site.nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  /*
                    The current page is MARKED here, not only announced.

                    This branch rendered one fixed className for every link, so
                    the four rows were byte-identical in the open panel: the
                    desktop ribbon shows where you are with an underline, and the
                    phone panel showed nothing at all. `aria-current` was already
                    set, so a screen-reader user was told the current page and a
                    sighted phone user was not, which is the wrong way round for a
                    marker that costs one class.

                    The accent bar carries it rather than colour alone, so it
                    survives greyscale and forced-colors.
                  */
                  className={cn(
                    "flex items-center gap-3 rounded-md py-3 pl-2 pr-2 text-title-sm transition-colors",
                    active
                      ? "bg-grove-soft/50 font-medium text-ink"
                      : "text-ink/90 hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-5 w-0.5 rounded-full transition-colors",
                      active ? "bg-grove" : "bg-transparent",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 flex items-center justify-between gap-3 px-2">
            </div>
            <div className="mt-3 px-2">
              {pathname === "/contact" ? (
                <Button href="#request" size="md" arrow className="w-full">
                  {site.ctaLabel}
                </Button>
              ) : (
                <ContactSales size="md" arrow className="w-full" />
              )}
            </div>
          </nav>
        </div>
      )}

      {/*
        THE SCRIM AND THE SHEETS, rendered once for the whole header rather than
        once per nav item.

        The scrim is what turns a dropdown into a mode: `rgba(33,33,33,0.2)` with
        a 30px backdrop blur over everything below the header, exactly as measured
        on the reference. It is also the click target that closes the menu, which
        is the behaviour people reach for before they look for Escape.

        `aria-hidden` because it is a surface, not a control with a name, the
        keyboard route out is Escape, which the sheet handles.
      */}
      <div
        aria-hidden
        onClick={() => setMenu(null)}
        className={cn(
          "fixed inset-x-0 top-[60px] bottom-0 -z-10 hidden bg-[rgb(33_33_33/0.2)] backdrop-blur-[30px] lg:block",
          "transition-opacity duration-200",
          menu ? "visible opacity-100" : "invisible opacity-0",
        )}
      />

      {site.nav.map((item) => (
        <MegaSheet
          key={`sheet-${item.href}`}
          item={item}
          open={menu === item.label}
          onClose={() => setMenu(null)}
          // THE SHEET MUST CANCEL THE PENDING CLOSE. It renders at header level,
          // outside <nav>, so moving the pointer down from a ribbon item into the
          // panel LEAVES the nav — which armed the 120ms close and shut the sheet
          // before anything in it could be clicked. Re-opening on enter cancels
          // that timer; leaving the sheet arms it again.
          onPointerEnter={() => openMenu(item.label)}
          onPointerLeave={closeMenu}
        />
      ))}
    </header>
  );
}


/**
 * THE SHEET THAT DROPS OUT OF THE HEADER.
 *
 * Measured on cohere.com: the panel is FULL BLEED — x=0, the whole viewport
 * wide, starting at exactly the 60px header's bottom edge — pure white, with no
 * radius, no border and NO SHADOW. Its columns start on the same 40px page rail
 * as everything else, and the rest of the page sits behind a
 * `rgba(33,33,33,0.2)` scrim with a 30px backdrop blur.
 *
 * That is a materially different object from the floating 44rem card this
 * replaced. A floating card is a widget attached to a button; a full-width sheet
 * with the page dimmed behind it is a MODE — it says the site is waiting for you
 * to choose, which is exactly the difference in authority between the two.
 *
 * No shadow is the part that looks wrong until you see it: a sheet this size
 * casting a drop shadow reads as a floating rectangle, and what sells it as a
 * surface unfolding from the header is the scrim behind it doing that job.
 *
 * `visibility` still gates it rather than opacity alone, so its links leave the
 * tab order when it is closed. The trigger is a real `aria-expanded` button, so
 * opening never happens as a side effect of focus moving — which is what broke
 * reverse tab order the first time this was built.
 */
function MegaSheet({
  item,
  open,
  onClose,
  onPointerEnter,
  onPointerLeave,
}: {
  item: (typeof site.nav)[number];
  open: boolean;
  onClose: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const groups = item.groups;
  if (!groups) return null;

  return (
    <div
      id={`nav-panel-${item.label}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      className={cn(
        "absolute inset-x-0 top-full hidden border-b border-line bg-surface lg:block",
        "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
      )}
    >
      <div className="mx-auto w-full max-w-[90rem] px-4 pb-12 pt-10 sm:px-6 lg:px-10">
        {/*
          COLUMNS ARE FIXED-WIDTH AND PACKED LEFT, not three equal thirds of the
          container. Measured on the reference, its three column heads sit at
          x=40, 336 and 608, roughly 272px apiece, occupying a little over half
          the sheet and leaving the right side empty. Spread across 1360px the
          same content reads as a sitemap; packed, it reads as a menu, and the
          empty right half is what tells you the sheet is a surface rather than a
          page.
        */}
        <div className="grid grid-cols-[repeat(3,minmax(0,17rem))] gap-x-12 gap-y-8">
          {groups.map((group) => {
            // `site` is `as const`, so a group without a trailing link has no
            // `more` property at all rather than an undefined one. `in` is the
            // narrowing that actually holds for a readonly union.
            const more = "more" in group ? group.more : null;
            return (
            <div key={group.label}>
              <p className="text-mark text-ink-faint">{group.label}</p>
              <ul className="mt-5 space-y-6">
                {group.items.map((link) => (
                  <li key={link.label + link.href}>
                    <Link href={link.href} className="group/mi block">
                      <span className="block text-title-sm text-ink transition-colors group-hover/mi:text-accent-text">
                        {link.label}
                      </span>
                      <span className="mt-1 block max-w-[26rem] text-body-sm leading-relaxed text-ink-soft">
                        {link.blurb}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {more && (
                <Link
                  href={more.href}
                  className="group/more mt-7 inline-flex items-center gap-2 text-body text-ink transition-colors hover:text-accent-text"
                >
                  {more.label}
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover/more:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
