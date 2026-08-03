import { useEffect, useRef, useState } from "react";

/**
 * True while the element is on screen.
 *
 * Exists because two auto-advancing surfaces were re-rendering for the whole
 * session regardless of whether anyone could see them. A CDP-traced harness
 * measured the pair at a median 1,053 ms of style and layout on the home page —
 * out of 2,143 ms total — with every one of six interleaved cycles positive, and
 * roughly 957 ms of it landing after the page was otherwise idle. That work does
 * nothing for perceived load; it just keeps the main thread from reaching idle,
 * which is exactly what Total Blocking Time measures.
 *
 * `document.visibilityState` was already checked in one of the two. That covers a
 * backgrounded TAB and nothing else: the home page is 19,641 px tall against an
 * 823 px mobile viewport, so the hero leaves the screen on the first scroll and
 * kept animating anyway.
 *
 * Defaults to visible where IntersectionObserver is unavailable, so the surface
 * animates rather than freezing if the API is missing.
 */
export function useOnScreen<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  // Lazily initialised rather than set from inside the effect: where there is no
  // IntersectionObserver the answer is known before the first render, and calling
  // setState in an effect to say so is both an extra render and a lint error
  // (react-hooks/set-state-in-effect). `onScreen` gates a timer and is never
  // rendered, so the server evaluating this branch differently is not a hydration
  // concern.
  const [onScreen, setOnScreen] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setOnScreen(entry.isIntersecting);
      },
      // No rootMargin: the point is to stop work for a surface nobody is looking
      // at, so the gate should track the viewport exactly.
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, onScreen };
}
