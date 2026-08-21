import { ArtFrame, Grain } from "./art-shared";

/**
 * PILOT — one continuous band with two cuts in it.
 *
 * THE OPPOSITION IS THE WHOLE THESIS. The band's top and bottom silhouette is
 * soft and organic, the kind of edge a palette knife leaves. Its left and right
 * ends are dead-straight vertical cuts. Everything about a deployment is soft
 * and human except its boundaries, and its boundaries are decisions. A term is
 * not a shape that fades in and fades out; it is a continuous thing with two
 * cuts in it.
 *
 * IT ACCUMULATES ALONG ITS LENGTH. The band enters at the left cut almost the
 * colour of the canvas — wheat, barely there — and gains chroma while losing
 * lightness, monotonically, to a deep amber at the right cut. Lightness falls
 * about 16 points; chroma rises about 0.085. Nothing is ADDED across the term:
 * the same body simply becomes denser, which is what /pilot says a record does.
 * Density is the argument, so a second shape appearing partway along would be
 * the wrong picture.
 *
 * THE SECOND CAPSULE IS UNCUT and sits under the first, entering and leaving the
 * frame. It is the thing that was already running before the term started and
 * continues after it ends. Where the cut band begins inside it, the overlap
 * darkens — the one moment the deployment marks something that was already there.
 *
 * WARM, AND THE ONLY WARM ARTWORK OF THE FOUR, so this page is recognisable at a
 * glance from the other three.
 *
 * REJECTED: an arrow, a runway, a progress bar, a calendar grid, a countdown.
 * Each draws "a beginning" by depicting one.
 */
export function PilotArt({ className }: { className?: string }) {
  return (
    <ArtFrame className={className}>
      <defs>
        <Grain id="pl-grain" />

        {/* Monotonic: lightness only falls, chroma only rises. A stop that
            reversed either would break the claim the gradient is making. */}
        <linearGradient id="pl-term" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(95.5% 0.030 92)" />
          <stop offset="34%" stopColor="oklch(90% 0.062 74)" />
          <stop offset="68%" stopColor="oklch(85% 0.092 58)" />
          <stop offset="100%" stopColor="oklch(79.5% 0.115 44)" />
        </linearGradient>

        <linearGradient id="pl-under" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="oklch(93% 0.038 86)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(88% 0.058 66)" stopOpacity="0.75" />
        </linearGradient>

        {/* The soft silhouette. Applied to the band's fill only, so the vertical
            cuts stay razor-sharp while the long edges stay organic. */}
        <filter id="pl-soft" x="-8%" y="-40%" width="116%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>

        {/* The cuts. A clip rectangle, not a blurred stop: a fade would say the
            term tapers off, and a term does not taper — it ends. */}
        <clipPath id="pl-cut">
          <rect x="196" y="0" width="1052" height="460" />
        </clipPath>
      </defs>

      <g filter="url(#pl-grain)">
        {/* Uncut, underneath: what was already running. */}
        <ellipse
          cx={700}
          cy={392}
          rx={860}
          ry={62}
          fill="url(#pl-under)"
          filter="url(#pl-soft)"
          transform="rotate(-2 700 392)"
        />

        {/* The term itself. */}
        <g clipPath="url(#pl-cut)">
          <ellipse
            cx={722}
            cy={352}
            rx={720}
            ry={86}
            fill="url(#pl-term)"
            filter="url(#pl-soft)"
            transform="rotate(-3 722 352)"
          />
        </g>

        {/* Where the term begins inside what was already there. */}
        <ellipse
          cx={236}
          cy={378}
          rx={70}
          ry={40}
          fill="oklch(84% 0.075 62)"
          opacity="0.5"
          style={{ mixBlendMode: "multiply" }}
          filter="url(#pl-soft)"
        />
      </g>
    </ArtFrame>
  );
}
