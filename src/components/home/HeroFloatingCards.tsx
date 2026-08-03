"use client";

import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

/** Floating UI cards over the hero dashboard, each dramatizing one real,
 *  hard-to-fake capability (conflict detection, an OSE approval clearing). */
export function HeroFloatingCards() {
  const reduce = useReducedMotion();

  const float = (dy: number, dur: number, delay: number) =>
    reduce
      ? {}
      : { animate: { y: [0, dy, 0] }, transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const, delay } };

  return (
    <LazyMotion features={domAnimation} strict>
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 hidden xl:block">
      {/* conflict toast, floating over the dashboard's top-left */}
      <m.div
        className="absolute -left-8 top-[10%] w-[14.5rem] -rotate-2 rounded-2xl border border-brand-coral/25 bg-cloud p-3 shadow-[var(--shadow-lg)] backdrop-blur"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* transform-gpu + will-change promotes this to its own compositor
            layer, so the perpetual float moves an already-rasterized layer
            instead of re-rendering the text every frame (which reads as the
            words shimmering). */}
        <m.div className="transform-gpu will-change-transform" {...float(-7, 6.5, 0)}>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-danger-subtle text-danger">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v5M12 16.5v.5" strokeLinecap="round" /><path d="M10.3 3.9 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
            </span>
            <span className="text-[0.72rem] font-semibold text-ink">Scheduling conflict</span>
          </div>
          <p className="mt-1.5 text-[0.7rem] leading-snug text-ink-soft">
            Schlegel 207 double-booked 5:00 to 6:30p. <span className="font-medium text-danger">Auto-flagged.</span>
          </p>
        </m.div>
      </m.div>

      {/* approval cleared, floating over the dashboard's bottom-left */}
      <m.div
        className="absolute -left-10 bottom-[12%] w-[15rem] rotate-[1.5deg] rounded-2xl border border-grove/25 bg-cloud p-3 shadow-[0_28px_54px_-18px_color-mix(in_oklab,var(--accent)_36%,transparent)] backdrop-blur"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* transform-gpu + will-change promotes this to its own compositor
            layer, so the perpetual float moves an already-rasterized layer
            instead of re-rendering the text every frame (which reads as the
            words shimmering). */}
        <m.div className="transform-gpu will-change-transform" {...float(8, 7.5, 0.6)}>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-grove-soft text-grove-deep">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="text-[0.72rem] font-semibold text-ink">Approval cleared</span>
          </div>
          <p className="mt-1.5 text-[0.7rem] leading-snug text-ink-soft">
            Spring Gala budget, $4,200. <span className="font-mono text-[0.62rem] text-grove-deep">VP Finance &middot; gate 2 of 2</span>
          </p>
        </m.div>
      </m.div>
    </div>
    </LazyMotion>
  );
}
