import { cn } from "@/lib/cn";

/**
 * The small visualisations the copy needs, built to one set of rules.
 *
 * Rules applied throughout, all of them the reason the marks look the way they
 * do rather than stylistic preference:
 *
 * - **One axis, one job per chart.** No chart here plots two measures on two
 *   scales. `TierNest` is containment; `Share` is composition. Each answers one
 *   question.
 * - **Categorical hues in a fixed order, never cycled.** `Share` walks
 *   `--chart-1 … --chart-6` in order and folds anything past the sixth into a
 *   neutral remainder, because a seventh generated hue is not distinguishable
 *   from the sixth for a colourblind reader.
 * - **Text wears text tokens.** Every label, value and legend entry is
 *   `--text-*`; the colour sits in a swatch beside the word, never in the word.
 *   That is what keeps them legible in both themes and under the contrast gate.
 * - **A 2px surface gap between adjacent fills.** Stacked segments read as
 *   separate quantities only if something separates them, and a hairline border
 *   in the same family as the fills does not.
 * - **No number on every point.** One direct label, on the value the sentence is
 *   about.
 *
 * All of them are pure SVG with token fills and no client boundary: they render
 * on the server, cost no JavaScript, and follow the theme through `var()`.
 */

/* -------------------------------------------------------------------------- */
/* Composition — a stacked share bar                                          */
/* -------------------------------------------------------------------------- */

export type ShareSlice = {
  label: string;
  pct: number;
  /**
   * Paint this slice in the neutral slate rather than the next categorical hue.
   *
   * For a REMAINDER — "Reserve", "Unallocated", "Everything else". Without it the
   * fourth slice takes `--chart-4`, which is the hue `--danger` is built on, so
   * the unspent part of a healthy budget rendered in alarm red. It also disagreed
   * with the same figures in `DashboardMock`, which correctly used `--chart-6`:
   * one dataset, two colour schemes, on one page.
   */
  neutral?: boolean;
};

/**
 * One bar, one whole. Slices take `--chart-1 … --chart-6` in the order given;
 * anything beyond the sixth would need a hue nobody can tell from the fifth, so
 * pass at most six and fold the rest into an explicit "Reserve"-style remainder.
 *
 * The 2px gaps are flex `gap`, not borders: a border would be drawn in the
 * border token and read as part of whichever slice it touched.
 */
export function Share({
  slices,
  className,
  legend = true,
}: {
  slices: ShareSlice[];
  className?: string;
  legend?: boolean;
}) {
  // A remainder is not a category, so it never takes a categorical hue. Neutral
  // slices are also skipped when numbering the rest, or marking one neutral would
  // shift every colour after it.
  let cat = 0;
  const hues = slices.map((s) =>
    s.neutral ? "var(--chart-6)" : `var(--chart-${Math.min(++cat, 5)})`,
  );
  return (
    <div className={className}>
      <div className="flex h-2.5 w-full gap-[2px] overflow-hidden rounded-full">
        {slices.map((s, i) => (
          <span
            key={s.label}
            className="first:rounded-l-full last:rounded-r-full"
            style={{ width: `${s.pct}%`, backgroundColor: hues[i] }}
          />
        ))}
      </div>
      {legend && (
        <ul className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1">
          {slices.map((s, i) => (
            <li
              key={s.label}
              className="flex items-center gap-1.5 text-mark text-ink-soft"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-sm"
                style={{ backgroundColor: hues[i] }}
              />
              {s.label} <span className="text-ink-faint tnum">{s.pct}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Containment — strictly nested tiers                                        */
/* -------------------------------------------------------------------------- */

export type Tier = { label: string; count: number };

/**
 * Three nested rectangles, for a claim whose whole content is containment: a
 * Director holds everything Staff holds, and Staff everything an Advisor holds
 * (C-017 — sixteen capabilities across three strictly nested tiers).
 *
 * A bar chart of 16 / 5 / 1 would draw them as three independent quantities,
 * which is the one thing the claim says they are not. Nesting is the encoding
 * that carries the meaning, and the counts are direct-labelled because there are
 * only three of them.
 *
 * Pass tiers widest-first.
 */
export function TierNest({ tiers, className }: { tiers: Tier[]; className?: string }) {
  const widest = tiers[0]?.count ?? 1;
  return (
    <ol className={cn("space-y-1.5", className)}>
      {tiers.map((t, i) => {
        // Square-root scaling: the marks are read as areas, and a linear width on
        // 16 / 5 / 1 makes the Advisor tier a sliver that reads as nothing.
        const width = 34 + 66 * Math.sqrt(t.count / widest);
        return (
          <li key={t.label} style={{ marginInlineStart: `${i * 6}%` }}>
            <div
              className="flex items-center justify-between gap-3 rounded-lg border border-grove/25 bg-grove-soft/70 px-2.5 py-1.5"
              style={{ width: `${width}%` }}
            >
              <span className="truncate text-caption font-medium text-ink">{t.label}</span>
              <span className="shrink-0 font-mono text-meta tnum text-grove-deep">
                {t.count}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Sequence — a two-gate approval rail                                        */
/* -------------------------------------------------------------------------- */

/**
 * The real chain, which is two GATES across seven request types — not six steps,
 * and there is no advisor gate (C-006). `at` is the index of the stage the
 * request is currently sitting in.
 */
export function GateRail({
  stages,
  at,
  className,
}: {
  stages: string[];
  at: number;
  className?: string;
}) {
  return (
    <ol className={cn("flex items-center", className)}>
      {stages.map((s, i) => {
        const done = i < at;
        const here = i === at;
        return (
          <li key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border font-mono text-mark",
                  done && "border-grove bg-grove text-on-accent",
                  here && "border-brand-gold bg-warning-subtle text-warning",
                  !done && !here && "border-line bg-cloud text-ink-faint",
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className="whitespace-nowrap text-mark text-ink-faint">{s}</span>
            </div>
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "mx-1 mb-4 h-[2px] flex-1 rounded-full",
                  done ? "bg-grove" : "bg-line",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
