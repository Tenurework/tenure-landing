import type { CSSProperties, ReactNode } from "react";

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

/**
 * Decorative floating shapes over the hero. A SERVER component.
 *
 * This was a client component driving four perpetual float loops with motion.
 * The whole thing sits behind `hidden lg:block`, so on the phone viewport
 * Lighthouse measures it is `display: none` — and it was still being shipped,
 * parsed and hydrated, along with its share of the motion bundle, to animate
 * four squares nobody on that device can see.
 *
 * The float is now two CSS declarations (see globals.css). No client boundary, no
 * JavaScript, and `prefers-reduced-motion` is handled by the global block rather
 * than by a hook that has to boot first.
 */
export function HeroShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {SHAPES.map((s, i) => (
        <div
          key={i}
          // transform-gpu keeps the perpetual float on the compositor so the
          // shape's edges don't re-rasterize (and shimmer) every frame.
          className={`tn-float absolute transform-gpu will-change-transform ${s.className}`}
          style={
            {
              "--tn-dy": `${s.dy}px`,
              "--tn-dur": `${s.dur}s`,
              "--tn-delay": `${i * 0.5}s`,
            } as CSSProperties
          }
        >
          {s.content}
        </div>
      ))}
    </div>
  );
}
