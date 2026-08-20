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
      <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Wordmark />

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {site.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3.5 py-2 text-body transition-colors duration-200",
                  active ? "text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3.5 bottom-1 h-0.5 origin-left rounded-full bg-grove transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
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
