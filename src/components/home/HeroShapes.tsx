"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

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
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {SHAPES.map((s, i) => (
        <motion.div
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
        </motion.div>
      ))}
    </div>
  );
}
