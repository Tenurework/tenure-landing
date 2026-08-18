"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The one-of-many selector, in two shapes.
 *
 * `Segmented` is the horizontal pill row; `RailList` is the vertical column a
 * `PanelRail` holds. Both exist so the site has exactly one way to say "you are
 * looking at one of these", instead of the four hand-rolled variants it had.
 *
 * Three details are load-bearing rather than decorative:
 *
 * 1. **Real `<button>`s carrying `aria-pressed`.** These select a view, they do
 *    not navigate, so they are buttons — and `aria-pressed` is what tells a
 *    screen-reader user which one is showing. `interaction.spec.ts` reads exactly
 *    that attribute off the hero mock's rail, which is the pattern this
 *    generalises.
 * 2. **A 44px minimum hit box (`min-h-11` / `py-2.5`).** WCAG 2.2 SC 2.5.8 wants
 *    24x24 and `a11y.spec.ts` enforces it on a 390px viewport against the
 *    spacing exception; a row of adjacent pills has no spacing exception to
 *    claim, so the target itself has to be big enough.
 * 3. **The active state is never colour alone.** The selected item gains a
 *    filled surface, a weight change and a marker, so it survives greyscale and
 *    forced-colors.
 */

export type SegmentItem = {
  key: string;
  label: string;
  /** Optional trailing hint — a count, a status word. */
  hint?: string;
  icon?: ReactNode;
};

export function Segmented({
  label,
  items,
  active,
  onSelect,
  className,
}: {
  /** Accessible name for the group. */
  label: string;
  items: SegmentItem[];
  active: string;
  onSelect: (key: string) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-2xl border border-line bg-paper/70 p-1",
        className,
      )}
    >
      {items.map((item) => {
        const on = item.key === active;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key)}
            aria-pressed={on}
            className={cn(
              "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3.5 text-[0.86rem] transition-colors duration-200 sm:flex-none",
              on
                ? "bg-cloud font-medium text-ink shadow-[var(--shadow-sm)]"
                : "text-ink-soft hover:bg-cloud/60 hover:text-ink",
            )}
          >
            {item.icon && (
              <span className={on ? "text-grove" : "text-ink-faint"}>{item.icon}</span>
            )}
            {item.label}
            {item.hint && (
              <span className="font-mono text-[0.62rem] text-ink-faint">{item.hint}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function RailList({
  label,
  items,
  active,
  onSelect,
  className,
}: {
  label: string;
  items: SegmentItem[];
  active: string;
  onSelect: (key: string) => void;
  className?: string;
}) {
  return (
    /* No role="group" here. Overriding a <ul> with role=group removes its list
       role, which orphans every <li> inside it — axe reported one serious
       "listitem" violation per row, eleven of them on the home page alone. A
       named list is already the right semantics for a rail, and each button
       reports its own state through aria-pressed, so the role bought nothing. */
    <ul aria-label={label} className={cn("space-y-0.5", className)}>
      {items.map((item) => {
        const on = item.key === active;
        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => onSelect(item.key)}
              aria-pressed={on}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-[0.85rem] transition-colors duration-200",
                on
                  ? "bg-cloud font-medium text-ink shadow-[var(--shadow-sm)]"
                  : "text-ink-soft hover:bg-cloud/60 hover:text-ink",
              )}
            >
              {item.icon && (
                <span className={cn("shrink-0", on ? "text-grove" : "text-ink-faint")}>
                  {item.icon}
                </span>
              )}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.hint ? (
                <span className="shrink-0 rounded-md border border-line bg-paper/60 px-1.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-wide text-ink-faint">
                  {item.hint}
                </span>
              ) : (
                /* The marker, so "selected" is not carried by colour alone. */
                <span
                  aria-hidden
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                    on ? "bg-grove" : "bg-transparent",
                  )}
                />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
