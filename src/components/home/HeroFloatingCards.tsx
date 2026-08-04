import type { CSSProperties } from "react";

/**
 * Floating UI cards over the hero dashboard, each dramatizing one real,
 * hard-to-fake capability (conflict detection, an OSE approval clearing).
 *
 * A SERVER component. This drove two entrance animations and two perpetual floats
 * through motion, from behind `hidden xl:block` — so on the phone viewport
 * Lighthouse measures, none of it is visible and all of it was still shipped,
 * parsed and hydrated. Both animations are CSS now (see globals.css): the
 * entrance is a `from` frame with `backwards` fill, and the float is a 50%
 * keyframe on `translate`.
 *
 * The entrance is safe under reduced motion only because the global block now
 * zeroes `animation-delay` as well as duration — `backwards` fill would otherwise
 * hold the transparent starting frame for the full delay.
 */
export function HeroFloatingCards() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 hidden xl:block">
      {/* conflict toast, floating over the dashboard's top-left */}
      <div
        className="tn-rise absolute -left-8 top-[10%] w-[14.5rem] -rotate-2 rounded-2xl border border-brand-coral/25 bg-cloud p-3 shadow-[var(--shadow-lg)] backdrop-blur"
        style={{ "--tn-delay": "0.5s" } as CSSProperties}
      >
        {/* transform-gpu + will-change promotes this to its own compositor
            layer, so the perpetual float moves an already-rasterized layer
            instead of re-rendering the text every frame (which reads as the
            words shimmering). */}
        <div
          className="tn-float transform-gpu will-change-transform"
          style={{ "--tn-dy": "-7px", "--tn-dur": "6.5s" } as CSSProperties}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-danger-subtle text-danger">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v5M12 16.5v.5" strokeLinecap="round" /><path d="M10.3 3.9 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
            </span>
            <span className="text-[0.72rem] font-semibold text-ink">Scheduling conflict</span>
          </div>
          <p className="mt-1.5 text-[0.7rem] leading-snug text-ink-soft">
            Schlegel 207 double-booked 5:00 to 6:30p. <span className="font-medium text-danger">Auto-flagged.</span>
          </p>
        </div>
      </div>

      {/* approval cleared, floating over the dashboard's bottom-left */}
      <div
        className="tn-rise absolute -left-10 bottom-[12%] w-[15rem] rotate-[1.5deg] rounded-2xl border border-grove/25 bg-cloud p-3 shadow-[0_28px_54px_-18px_color-mix(in_oklab,var(--accent)_36%,transparent)] backdrop-blur"
        style={{ "--tn-delay": "0.9s" } as CSSProperties}
      >
        {/* transform-gpu + will-change promotes this to its own compositor
            layer, so the perpetual float moves an already-rasterized layer
            instead of re-rendering the text every frame (which reads as the
            words shimmering). */}
        <div
          className="tn-float transform-gpu will-change-transform"
          style={{ "--tn-dy": "8px", "--tn-dur": "7.5s", "--tn-delay": "0.6s" } as CSSProperties}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-grove-soft text-grove-deep">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="text-[0.72rem] font-semibold text-ink">Approval cleared</span>
          </div>
          <p className="mt-1.5 text-[0.7rem] leading-snug text-ink-soft">
            Spring Gala budget, $4,200. <span className="font-mono text-[0.62rem] text-grove-deep">VP Finance &middot; gate 2 of 2</span>
          </p>
        </div>
      </div>
    </div>
  );
}
