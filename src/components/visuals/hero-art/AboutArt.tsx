import { ArtFrame, Grain } from "./art-shared";

/**
 * ABOUT — nine identical lozenges, and one line that survives all of them.
 *
 * EQUAL WEIGHT IS THE CLAIM, and it is the load-bearing negative decision here.
 * The obvious instinct is to fade and blur the earlier shapes so the sequence
 * reads as receding into the past. It would be prettier, and it would argue the
 * exact opposite of the page: a record that fades is the problem Tenure exists
 * to fix. So all nine carry the SAME opacity, the same profile, the same fill.
 * The lozenge is the seat, and the seat does not change.
 *
 * WHAT CHANGES IS ROTATION, 1.3 degrees per step. Nine holders pass through one
 * position; the position turns slowly under them. Nothing else about it moves.
 *
 * THE HAIRLINE IS THE RECORD. One unbroken stroke crosses all nine, submerged
 * beneath the flanks where the mass is three deep and surfacing in the middle
 * where the overlap parts. It is never redrawn and never interrupted — it passes
 * under and comes out the other side, which is what "carried across every
 * handoff" means. The place it surfaces is the place the headline sits, so the
 * one continuous element in the picture is the one the reader is looking through.
 *
 * ASH WITH A SINGLE RESTRAINED ACCENT, and the quietest of the four. The story
 * page should not shout over the pages that carry the product.
 *
 * REJECTED: a timeline with ticks, a relay baton, a chain, footprints, and a
 * family tree. Each depicts succession instead of drawing it.
 */
const COUNT = 9;

export function AboutArt({ className }: { className?: string }) {
  // Laid along a shallow arc so the sequence has a direction without an arrow.
  const items = Array.from({ length: COUNT }, (_, i) => {
    const t = i / (COUNT - 1);
    return {
      cx: 150 + t * 1140,
      // Pushed below the headline band. The hairline crossing the letterforms
      // was the artwork competing with the sentence it sits behind.
      cy: 372 - Math.sin(t * Math.PI) * 40,
      rot: -14 + i * 1.3,
    };
  });

  return (
    <ArtFrame className={className}>
      <defs>
        <Grain id="ab-grain" />
        <linearGradient id="ab-seat" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="oklch(90% 0.020 250)" />
          <stop offset="100%" stopColor="oklch(83.5% 0.030 252)" />
        </linearGradient>
      </defs>

      <g filter="url(#ab-grain)">
        {/* Multiply, so the three-deep overlaps at the flanks darken and the
            single-deep middle stays light. The mass parting in the centre is
            what opens the gap the headline needs — composition, not a mask. */}
        <g style={{ mixBlendMode: "multiply" }}>
          {items.map((it, i) => (
            <ellipse
              key={i}
              cx={it.cx}
              cy={it.cy}
              rx={132}
              ry={104}
              fill="url(#ab-seat)"
              opacity={0.42}
              transform={`rotate(${it.rot} ${it.cx} ${it.cy})`}
            />
          ))}
        </g>

        {/* The record. One stroke, never broken. Its own path follows the same
            arc the seats sit on, so it reads as passing through them rather than
            as a line laid over the top. */}
        <path
          d="M -30 372 C 260 320, 460 314, 720 328 C 980 342, 1180 336, 1470 372"
          fill="none"
          stroke="oklch(58% 0.105 158)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>
    </ArtFrame>
  );
}
