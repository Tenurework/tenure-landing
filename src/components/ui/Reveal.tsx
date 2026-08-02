"use client";

import { useCallback, type CSSProperties, type ReactNode } from "react";

type As = "div" | "span" | "li";

/**
 * Scroll-into-view reveal.
 *
 * The previous implementation used motion's `initial={{ opacity: 0 }}`, which
 * React serialises into an inline style during server rendering. That shipped
 * 118 elements at `opacity: 0` on the home page alone (27 on /product, 23 on
 * /story, 30 on /pilot) — so with JavaScript unavailable or still loading, most
 * of the page was invisible while its text sat in the DOM.
 *
 * The logic is now inverted. The hidden state lives in CSS behind a `.js` class
 * that the inline <head> script adds, so:
 *   - no JavaScript  -> `.js` never matches -> everything renders visible;
 *   - JavaScript     -> `.js` is set before first paint, so there is no flash
 *                       of content appearing and then re-hiding.
 *
 * The observer is wired through a callback ref (which React 19 lets us return a
 * cleanup from) rather than an effect plus a ref object, so nothing reads a ref
 * during render.
 *
 * Reduced motion is handled in CSS as well as here, so content is visible even
 * before this callback runs.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: As;
}) {
  const attach = useCallback((el: HTMLElement | null) => {
    if (!el) return;

    // Respect reduced motion without waiting for an intersection.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -72px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = {
    "--reveal-y": `${y}px`,
    "--reveal-delay": `${delay}s`,
  } as CSSProperties;

  if (as === "span") {
    return (
      <span ref={attach} data-reveal="" className={className} style={style}>
        {children}
      </span>
    );
  }
  if (as === "li") {
    return (
      <li ref={attach} data-reveal="" className={className} style={style}>
        {children}
      </li>
    );
  }
  return (
    <div ref={attach} data-reveal="" className={className} style={style}>
      {children}
    </div>
  );
}
