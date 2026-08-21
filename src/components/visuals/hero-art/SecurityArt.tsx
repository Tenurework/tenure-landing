import { ArtFrame, Grain } from "./art-shared";

/**
 * SECURITY — nested laminae that abut and never intersect.
 *
 * THE GOVERNING RULE, derived from the page's copy rather than from taste:
 * FORMS MAY NEST AND ABUT, AND MAY NEVER INTERSECT. /trust says each
 * institution's record is separated at the data layer, that staff work through
 * strictly nested tiers, and that privileged actions append to a record nothing
 * rewrites. If two coloured fields intersected here — which is what the rest of
 * this site's artwork does, and what looks best — the picture would assert the
 * opposite of the page. That one rule forces stroked rings with real unpainted
 * channels between them instead of the soft blended washes used elsewhere, and
 * it is why this page's artwork is built from the same materials as the other
 * three and still does not look like them.
 *
 * NESTING CARRIES THE TIER MODEL. Four rings per mass, strictly nested: no ring
 * is partly inside and partly outside another. A ring's position in the stack is
 * its whole identity, which is what "strictly nested" means and what a Venn
 * arrangement would deny.
 *
 * THE CHANNELS CARRY ISOLATION. Between every pair of rings is bare page canvas,
 * widening outward — not a hairline standing in for a gap. You can trace an
 * unbroken path of unpainted ground around any single ring, and between the two
 * masses. A boundary that is a property of the construction is a different thing
 * from one drawn on afterwards, which is the distinction the page draws between
 * enforcement at the client layer and enforcement by convention.
 *
 * THE CENTRES ARE OFF-FRAME, so nothing ever closes on screen and the middle of
 * the picture is empty BY CONSTRUCTION rather than by cropping. The headline
 * sits in that gap. The keep-out is not a compromise this artwork survives; it
 * is the artwork's subject.
 *
 * THE RIGHT MASS IS NOT A MIRROR. Same rules, different instance — smaller radii,
 * rotated the other way. Two tenants, same construction, no path between them.
 * A mirrored pair would read as a certificate border.
 *
 * NOTHING MOVES. On the one page whose argument is that the record cannot be
 * rewritten, a drifting gradient argues with the copy. There is nothing for
 * prefers-reduced-motion to reduce.
 *
 * REJECTED: padlock, shield, key, keyhole, fingerprint — and their abstract
 * cousins, which are the same picture with the detail sanded off. Also a target
 * (one centre, and the centre is the point; here the centre is the one place
 * nothing is), a grid of cells (a spreadsheet), and chain-links (a claim this
 * product does not make).
 */
type Ring = { rx: number; ry: number; w: number; hue: string; o: number };

const LEFT: Ring[] = [
  { rx: 300, ry: 345, w: 60, hue: "oklch(46% 0.135 282)", o: 0.92 },
  { rx: 386, ry: 444, w: 48, hue: "oklch(58% 0.115 280)", o: 0.72 },
  { rx: 483, ry: 555, w: 34, hue: "oklch(70% 0.085 278)", o: 0.55 },
  { rx: 595, ry: 684, w: 22, hue: "oklch(80% 0.055 276)", o: 0.4 },
];

export function SecurityArt({ className }: { className?: string }) {
  return (
    <ArtFrame className={className}>
      <defs>
        <Grain id="sa-grain" />
      </defs>

      <g filter="url(#sa-grain)">
        {/* Left mass: centre at x = -210, well outside the frame. */}
        <g transform="rotate(-6 -210 310)">
          {LEFT.map((r, i) => (
            <ellipse
              key={`l${i}`}
              cx={-210}
              cy={310}
              rx={r.rx}
              ry={r.ry}
              fill="none"
              stroke={r.hue}
              strokeWidth={r.w}
              opacity={r.o}
            />
          ))}
        </g>

        {/* Right mass: same rule set, 0.86 of the radii, rotated the other way. */}
        <g transform="rotate(9 1650 232)">
          {LEFT.map((r, i) => (
            <ellipse
              key={`r${i}`}
              cx={1650}
              cy={232}
              rx={r.rx * 0.86}
              ry={r.ry * 0.86}
              fill="none"
              stroke={r.hue}
              strokeWidth={r.w * 0.9}
              opacity={r.o * 0.85}
            />
          ))}
        </g>
      </g>
    </ArtFrame>
  );
}
