"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import type LenisInstance from "lenis";

/**
 * Momentum scrolling (Lenis), attached to the document rather than wrapped
 * around it.
 *
 * Two things this component deliberately does NOT do.
 *
 * 1. It never changes what it renders. It previously returned `<>{children}</>`
 *    on the server and on the first client render, then `<ReactLenis root>` one
 *    requestAnimationFrame later. Those are different element types in the same
 *    tree position, so React does not reconcile them — it unmounts the header,
 *    <main> and the footer and mounts a fresh copy: every DOM node recreated,
 *    every effect torn down and re-run, one frame after hydration, which is
 *    exactly when the visitor first tries to scroll or tap. `ReactLenis root`
 *    renders no wrapper element, so the wrapper was never the point; the type
 *    change alone was enough. The rendered output here is now a fragment on the
 *    server and a fragment forever after, and Lenis is constructed imperatively.
 *
 * 2. It never constructs Lenis on a touch device. Lenis leaves `syncTouch` off
 *    by default and its event gate only admits wheel events, so on a coarse
 *    pointer it intercepts nothing at all and scrolling is already native —
 *    while still costing the module, the instance, and a requestAnimationFrame
 *    loop that re-schedules itself for the rest of the session whether or not
 *    anything is animating. Momentum is a mouse-wheel affordance; a phone has
 *    its own scroll physics and does not want ours fighting them.
 *
 * Automation (navigator.webdriver) and reduced-motion stay excluded for the
 * reasons they always were: screenshots and assistive settings get native
 * scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (navigator.webdriver) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let instance: LenisInstance | null = null;
    let cancelled = false;

    // Imported here rather than at module scope so the library is fetched only
    // by the devices that will actually run it — a phone never requests it, and
    // it stays out of the initial chunk for everyone else.
    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      // autoRaf is false in the core (ReactLenis was what turned it on), so the
      // loop has to be requested explicitly.
      instance = new Lenis({ lerp: 0.09, autoRaf: true });
    });

    return () => {
      cancelled = true;
      instance?.destroy();
      instance = null;
    };
  }, []);

  return <>{children}</>;
}
