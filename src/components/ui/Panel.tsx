import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * THE SINGLE CARD.
 *
 * Every section on this site used to answer its heading with a grid — two
 * columns on /pilot, three on /product, four on the audiences row, nine on the
 * platform section. A reader arriving at any of them met several arguments at
 * once and finished none, and the page paid a full viewport for each grid.
 *
 * A section now gets one `Panel`: a raised sheet with an app-window bar, one
 * live surface inside it, and at most one footnote strip. The parts below are
 * the vocabulary that makes those sheets look like the same product rather than
 * eight bespoke boxes.
 *
 *   Panel        the sheet
 *   PanelBar     its chrome: an identity on the left, state on the right
 *   PanelRail    a navigation column, so ten things are reachable but one is read
 *   PanelWell    the recessed area a mock/table/chart sits in
 *   PanelNote    the closing strip: a limit, a source, a qualifier
 *
 * The visual weight lives in `@utility panel` and `@utility well` in
 * globals.css, both keyed to `--surface` with `color-mix`, so the sheet inverts
 * with the theme instead of glowing on the navy canvas.
 */

export function Panel({
  id,
  className,
  children,
}: {
  /** Anchor target, for in-page links (see /contact, where the header CTA
      jumps to the composer rather than linking to the page it is already on). */
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className={cn("panel overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function PanelBar({
  icon,
  title,
  meta,
  aside,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3 sm:px-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-grove-soft text-grove">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-display text-body font-semibold text-ink">{title}</p>
          {meta && <p className="font-mono text-mark text-ink-faint">{meta}</p>}
        </div>
      </div>
      {aside}
    </div>
  );
}

/** The small state pill a PanelBar carries on its right. */
export function PanelTag({ children, dot = true }: { children: ReactNode; dot?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper/60 px-2.5 py-1 text-meta text-ink-faint">
      {dot && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-grove" />}
      {children}
    </span>
  );
}

export function PanelRail({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-b border-line p-3 md:border-b-0 md:border-r",
        className,
      )}
    >
      <p className="label-mono px-2 pb-2 text-mark">{label}</p>
      {children}
    </div>
  );
}

export function PanelWell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("well p-4 sm:p-5", className)}>{children}</div>;
}

/**
 * THE LABEL EVERY DRAWN SURFACE CARRIES.
 *
 * The product surfaces on this site are React components, not screenshots. That
 * has to be disclosed, and for a while it was — in three sentences of
 * pre-emptive defence in the LEAD position: "The two panels below are
 * illustrations, not screenshots… Ask for a walkthrough and you see the running
 * application instead." Deleting that was right; it apologised for the page
 * before the reader had looked at it.
 *
 * Deleting it WITHOUT REPLACING IT was not. The site then rendered eight drawn
 * application interfaces — a treasury balance, named people, vendor figures —
 * with no label anywhere, and a comment in Hero.tsx asserting the disclosure
 * "is stated once, on /trust", which was simply false: a rendered-text sweep of
 * all eight routes found no such sentence. That is the failure mode this
 * component exists to make impossible.
 *
 * Six words bound to the artwork is a STRONGER disclosure than a paragraph on
 * another route, and it reads as a spec-sheet caption rather than a hedge — the
 * way a museum label or an annual report captions a figure. Precision is not
 * apology.
 *
 * Do not delete a caption without adding one to the same surface in the same
 * commit.
 */
export function MockCaption({
  children = "Illustrated interface, with representative data.",
}: {
  children?: ReactNode;
}) {
  return <p className="mt-3 text-caption text-ink-faint">{children}</p>;
}

export function PanelNote({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "border-t border-line bg-paper/50 px-4 py-3 text-caption leading-relaxed text-ink-faint sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
