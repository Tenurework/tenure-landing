import { cn } from "@/lib/cn";

/**
 * Memphis-school decoration: arcs, terrazzo dots, a zigzag, a triangle, thin
 * rules. Flat geometry in the brand's secondary hues, which is the one ornament
 * vocabulary that reads as designed rather than as a stock gradient.
 *
 * Three constraints shaped it, and none of them are cosmetic:
 *
 * 1. **Every fill is a token.** `var(--chart-*)`, `var(--accent)`, `var(--warning)`
 *    — never a literal. The dark theme re-points those variables, so the same
 *    file paints a muted set on paper and a luminous one on navy without a
 *    `dark:` variant anywhere.
 * 2. **Element count is capped.** Each variant is ~14 nodes. The contour field
 *    this sits beside was 60 KB gzipped of inline path data before it moved to a
 *    CSS mask (see SectionContour.tsx); ornament that has to be shipped in the
 *    document has to stay small enough to be free.
 * 3. **`aria-hidden` and pointer-events-none.** It is decoration. It carries no
 *    information and must never be in the accessibility tree or the hit path.
 *
 * Opacity is applied by the CALLER, on the wrapping layer, so one variant serves
 * a loud hero and a quiet section footer.
 */

type Variant = "arcs" | "terrazzo" | "signal";

const S = {
  accent: "var(--accent)",
  coral: "var(--chart-4)",
  gold: "var(--chart-3)",
  sky: "var(--chart-2)",
  violet: "var(--chart-5)",
} as const;

/** Concentric quarter-arcs with a triangle and a rule stack. */
function Arcs() {
  return (
    <>
      <g fill="none" strokeLinecap="round">
        <path d="M20 220 A 200 200 0 0 1 220 20" stroke={S.accent} strokeWidth="14" />
        <path d="M20 176 A 156 156 0 0 1 176 20" stroke={S.gold} strokeWidth="9" />
        <path d="M20 136 A 116 116 0 0 1 136 20" stroke={S.coral} strokeWidth="6" />
      </g>
      <path d="M300 34 L336 100 L264 100 Z" fill={S.violet} />
      <circle cx="352" cy="176" r="17" fill={S.sky} />
      <g stroke={S.accent} strokeWidth="4" strokeLinecap="round">
        <path d="M258 150 h116" />
        <path d="M258 164 h84" />
        <path d="M258 178 h52" />
      </g>
      <rect x="150" y="182" width="30" height="30" rx="7" fill={S.gold} transform="rotate(18 165 197)" />
    </>
  );
}

/** Terrazzo: scattered chips of every hue, plus one bold half-disc. */
function Terrazzo() {
  const chips: [number, number, number, keyof typeof S][] = [
    [46, 60, 12, "accent"],
    [118, 34, 7, "coral"],
    [186, 82, 10, "gold"],
    [92, 132, 6, "sky"],
    [156, 176, 13, "violet"],
    [258, 52, 9, "accent"],
    [330, 118, 11, "coral"],
    [284, 190, 7, "gold"],
    [40, 196, 8, "sky"],
    [212, 132, 6, "accent"],
  ];
  return (
    <>
      <path d="M300 226 A 74 74 0 0 1 374 152 L374 226 Z" fill={S.accent} />
      {chips.map(([cx, cy, r, hue]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={S[hue]} />
      ))}
      <rect x="228" y="16" width="26" height="26" rx="6" fill={S.violet} transform="rotate(-14 241 29)" />
    </>
  );
}

/** A zigzag "signal" with a dot rail and two blocks. */
function Signal() {
  return (
    <>
      <path
        d="M14 150 l44 -52 44 52 44 -52 44 52 44 -52 44 52"
        fill="none"
        stroke={S.accent}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill={S.gold}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle key={i} cx={22 + i * 48} cy={206} r="6" />
        ))}
      </g>
      <rect x="286" y="30" width="72" height="18" rx="9" fill={S.coral} />
      <rect x="286" y="58" width="44" height="18" rx="9" fill={S.sky} />
      <path d="M96 42 L124 90 L68 90 Z" fill={S.violet} />
    </>
  );
}

const VARIANTS: Record<Variant, () => React.ReactElement> = {
  arcs: Arcs,
  terrazzo: Terrazzo,
  signal: Signal,
};

export function MemphisArt({
  variant = "arcs",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const Shapes = VARIANTS[variant];
  return (
    <svg
      viewBox="0 0 400 240"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      className={cn("pointer-events-none h-full w-full", className)}
    >
      <Shapes />
    </svg>
  );
}
