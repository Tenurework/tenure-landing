"use client";

import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";

/**
 * `m` + LazyMotion, not the `motion` proxy.
 *
 * Importing `motion` from "motion/react" statically pulls framer-motion's full
 * feature bundle — `{...animations, ...gestureAnimations, ...drag, ...layout}` —
 * because the proxy cannot know which features a given element will use. That is
 * 138 KB minified in the route chunk, which Lighthouse measured as 45.6% unused,
 * and it loaded on the only two routes still short of the performance budget.
 *
 * Nothing on this site uses drag or layout projection: a repo-wide search for
 * `layout`, `layoutId`, `drag`, `useScroll`, `useTransform` and `useSpring`
 * returns nothing. Every animation here is initial/animate/exit/transition,
 * whileInView, whileHover or AnimatePresence, all of which live in `domAnimation`
 * (animations + gestureAnimations, the latter including inView, hover, tap and
 * focus). `mode="popLayout"` was checked against the installed source rather than
 * assumed: PopChild measures in getSnapshotBeforeUpdate and injects an absolute
 * positioning rule, so it does NOT need the layout feature set.
 *
 * `strict` is deliberate. It throws at runtime on any `motion.*` that was missed,
 * which is the only way to be sure the migration was complete — all 19 elements
 * across five files. Rendering is unchanged, so the visual baselines do not move.
 */

type Shape = { className: string; dy: number; dur: number; content?: ReactNode };

const SHAPES: Shape[] = [
  { className: "left-[7%] top-[26%] h-7 w-7 rotate-[18deg] rounded-[7px] bg-brand-coral/85", dy: -14, dur: 7 },
  { className: "right-[9%] top-[20%] h-5 w-5 rotate-45 rounded-[4px] bg-brand-violet/80", dy: 12, dur: 8.5 },
  {
    className: "left-[47%] top-[11%] text-brand-gold",
    dy: -10,
    dur: 9,
    content: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l10 18H2z" />
      </svg>
    ),
  },
  {
    className: "right-[13%] top-[55%] h-7 w-7 text-brand-sky",
    dy: 13,
    dur: 7.5,
    content: (
      <>
        <span className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-current" />
        <span className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-current" />
      </>
    ),
  },
];

export function HeroShapes() {
  const reduce = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {SHAPES.map((s, i) => (
          <m.div
            key={i}
            // transform-gpu keeps the perpetual float on the compositor so the
            // shape's edges don't re-rasterize (and shimmer) every frame.
            className={`absolute transform-gpu will-change-transform ${s.className}`}
            initial={{ y: 0 }}
            animate={reduce ? undefined : { y: [0, s.dy, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
            }
          >
            {s.content}
          </m.div>
        ))}
      </div>
    </LazyMotion>
  );
}
