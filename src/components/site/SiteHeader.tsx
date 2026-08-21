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
    closeTimer.current = setTimeout(() => setMenu(null), 120);
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
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        surface,
      )}
    >
      {/*
          THE SHELL SITS ON THE SAME RAILS AS THE CONTENT. When the page container
          widened to 1360px with 40px margins, this kept `max-w-6xl px-5 sm:px-8`
          — so the logo sat at x=176 while the sections beneath it started at
          x=40. The nav floated in from the edges like a different document.

          60px of height rather than 68 is cohere.com's measurement: a fixed bar
          is permanent furniture, and every pixel of it is taken from the page.
        */}
        <div className="mx-auto flex h-[60px] w-full max-w-[90rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        <Wordmark />

        <nav
          aria-label="Main"
          className="relative hidden items-center gap-0.5 lg:flex"
          onMouseLeave={closeMenu}
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

                  Opening is now an explicit act — hover for a pointer, the
                  chevron button for a keyboard — so the set of focusable things
                  does not change as a side effect of moving through them.
                */}
                <div
                  className={cn(
                    "relative flex items-center rounded-md transition-colors duration-200",
                    active || isOpen ? "text-ink" : "text-ink-soft hover:text-ink",
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
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </div>
              </div>
            );
          })}

          {/*
            ONE PANEL POSITION FOR ALL FOUR ITEMS, centred on the nav rather than
            on the trigger. Anchored per item, the "Platform" panel hung out over
            the wordmark and the "About" panel would have run past the CTA — a
            46rem sheet cannot centre itself on a 5rem word near the edge of the
            bar without leaving the bar. Cohere centres under the nav for the same
            reason. Panels are stacked in one place and only the open one is
            visible, so switching between items cross-fades instead of jumping.
          */}
          {site.nav.map((item) => (
            <MegaPanel
              key={`panel-${item.href}`}
              item={item}
              open={menu === item.label}
              onEscape={() => setMenu(null)}
            />
          ))}
        </nav>

        <div className="hidden min-w-0 items-center gap-3 lg:flex">
          {/* On /contact the CTA would otherwise link to the page it is already
              on — a dead control in the most prominent slot on the site. There it
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
                    set — so a screen-reader user was told the current page and a
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
    </header>
  );
}


/**
 * THE PANEL THAT OPENS UNDER A RIBBON ITEM.
 *
 * It is `invisible` rather than unmounted when closed, and that is the detail
 * that makes it keyboard-reachable: `visibility: hidden` takes its links out of
 * the tab order, and the trigger's own focus is what turns visibility back on —
 * so tabbing to "Platform" reveals the panel, and the next Tab lands inside it.
 * An `opacity: 0` panel would leave four invisible links in the tab order of
 * every page, which is the usual way this component is got wrong.
 *
 * Escape closes it from anywhere inside, because a menu you can open with the
 * keyboard and not close with it is a trap.
 */
function MegaPanel({
  item,
  open,
  onEscape,
}: {
  item: (typeof site.nav)[number];
  open: boolean;
  onEscape: () => void;
}) {
  const panel = item.panel;
  if (!panel) return null;

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Escape") onEscape();
      }}
      id={`nav-panel-${item.label}`}
      className={cn(
        "absolute left-1/2 top-full z-50 w-[44rem] max-w-[calc(100vw-5rem)] -translate-x-1/2 pt-3",
        "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        open
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-1 opacity-0",
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-28px_oklch(20%_0.02_260/0.30)]">
        <div className="grid gap-0 sm:grid-cols-[1.15fr_1fr]">
          <div className="p-5">
            <p className="text-mark uppercase text-ink-faint">{panel.heading}</p>
            <ul className="mt-3 space-y-0.5">
              {panel.menu.map((link) => (
                <li key={link.label + link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-canvas"
                  >
                    <span className="block text-body text-ink">{link.label}</span>
                    <span className="mt-0.5 block text-body-sm leading-relaxed text-ink-soft">
                      {link.blurb}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* The feature tile is where the matte ground earns its keep: a flat
              grey block here would read as an empty column. */}
          <Link
            href={panel.feature.href}
            className="matte matte-sage group/feat flex flex-col justify-end p-5 transition-[filter] duration-200 hover:brightness-[0.985]"
          >
            <span className="text-title-sm text-ink">{panel.feature.label}</span>
            <span className="mt-2 text-body-sm leading-relaxed text-ink-soft">
              {panel.feature.blurb}
            </span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-body-sm text-accent-text">
              Open
              <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 transition-transform duration-200 group-hover/feat:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
