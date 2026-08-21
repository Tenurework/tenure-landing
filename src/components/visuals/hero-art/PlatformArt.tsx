import { ArtFrame, Grain } from "./art-shared";

/**
 * PLATFORM — five strands enter, one body leaves.
 *
 * THE ARGUMENT THIS DRAWS. /product says finance, events, members, documents and
 * memory are separate modules that resolve to a single governed record. So five
 * soft capsules of unequal thickness enter from the left at five shallow,
 * unequal angles, and one resolved mass sits at the right. The convergence
 * happens BEHIND the headline, where it cannot be seen — the page states the
 * resolution in words, and the picture would be redundant if it drew the node.
 *
 * The angles are unequal (-4deg to -14deg) and the gaps between strands are
 * unequal (26/44/18/62) for one reason: five evenly spaced parallel bars read as
 * lanes on a chart. Unequal spacing reads as material.
 *
 * WHERE TWO CROSS, THE OVERLAP DARKENS, once, deliberately. That single patch is
 * accretion — the one place where two records compound rather than merely stack.
 * Everywhere else the strands pass without touching.
 *
 * REJECTED: a grid, a dashboard frame, interlocking puzzle shapes, and gears.
 * Each is the same diagram with the detail sanded off.
 *
 * Nothing animates. A drifting gradient behind a headline is motion for its own
 * sake, and it costs a compositor layer on every route this ships to.
 */
const STRANDS = [
  { y: 96, w: 34, len: 430, rot: -4, o: 0.9 },
  { y: 158, w: 22, len: 360, rot: -9, o: 0.75 },
  { y: 224, w: 48, len: 470, rot: -6, o: 1 },
  { y: 306, w: 18, len: 330, rot: -12, o: 0.7 },
  { y: 372, w: 29, len: 400, rot: -14, o: 0.85 },
];

export function PlatformArt({ className }: { className?: string }) {
  return (
    <ArtFrame className={className}>
      <defs>
        <Grain id="pa-grain" />
        <linearGradient id="pa-strand" x1="0" y1="0" x2="1" y2="0">
          {/* Zero alpha at the cropped outer end: nothing begins at the frame,
              it was already running before the picture started. */}
          <stop offset="0%" stopColor="oklch(88% 0.055 172)" stopOpacity="0" />
          <stop offset="42%" stopColor="oklch(84% 0.082 168)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="oklch(76% 0.105 164)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="pa-body" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="oklch(82% 0.095 170)" />
          <stop offset="60%" stopColor="oklch(72% 0.115 162)" />
          <stop offset="100%" stopColor="oklch(66% 0.105 158)" stopOpacity="0.92" />
        </linearGradient>
      </defs>

      <g filter="url(#pa-grain)">
        {STRANDS.map((s, i) => (
          <rect
            key={i}
            x={-40}
            y={s.y - s.w / 2}
            width={s.len}
            height={s.w}
            rx={s.w / 2}
            fill="url(#pa-strand)"
            opacity={s.o}
            transform={`rotate(${s.rot} ${-40 + s.len} ${s.y})`}
          />
        ))}

        {/* The one compounding overlap. Multiply, so it darkens rather than
            merely sitting on top — stacking and accreting are different verbs. */}
        <ellipse
          cx={300}
          cy={196}
          rx={54}
          ry={26}
          fill="oklch(70% 0.098 168)"
          opacity="0.55"
          style={{ mixBlendMode: "multiply" }}
          transform="rotate(-7 300 196)"
        />

        {/* The resolved body. One mass, no seams, cropped by the right edge so it
            reads as continuing rather than as an object placed on the page. */}
        <ellipse
          cx={1385}
          cy={240}
          rx={215}
          ry={196}
          fill="url(#pa-body)"
          transform="rotate(-12 1385 240)"
        />
        <ellipse
          cx={1300}
          cy={126}
          rx={92}
          ry={78}
          fill="oklch(86% 0.070 174)"
          opacity="0.7"
          transform="rotate(18 1300 126)"
        />
      </g>
    </ArtFrame>
  );
}
