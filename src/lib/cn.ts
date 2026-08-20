import { clsx, type ClassValue } from "clsx";

/**
 * Join conditional class names.
 *
 * This used to wrap `clsx` in `tailwind-merge`. twMerge shipped a 27,366-byte
 * class-group table (8,548 gzipped) to EVERY route — `cn` is reachable from
 * SiteHeader, ThemeToggle, Container, Eyebrow and buttonClasses, so it loaded on
 * /privacy and /terms too, the routes already closest to the performance budget.
 *
 * It was resolving almost nothing, and the one thing it did resolve was wrong.
 * The swap was verified by rebuilding the whole site and diffing every rendered
 * class attribute against the twMerge output: 2,642 attributes across ten
 * documents, of which 25 changed — all the same Button, and all the same single
 * class.
 *
 * twMerge was deleting `leading-none` from Button's `base`. It does that because
 * Tailwind's `text-*` utilities CAN carry a line-height (`text-body-sm/6`), so
 * tailwind-merge treats font-size as conflicting with `leading`, and Button
 * concatenates `sizes` (`text-body`) after `base`. But those are arbitrary
 * font-size values with no line-height component, so nothing actually conflicted:
 * twMerge was silently discarding a style the author wrote on purpose. Removing it
 * restores that intent. Buttons are fixed-height `inline-flex` with `items-center`
 * and `whitespace-nowrap`, so the recovered `line-height: 1` re-centres within the
 * same box rather than moving anything — confirmed against the visual baselines.
 *
 * Every other call site was audited and has no conflict to settle: Container's
 * overrides are grid/gap/py/relative against a base of mx-auto/w-full/max-w/px,
 * Eyebrow's are justify/text-colour, SiteHeader mixes border-COLOUR with
 * border-WIDTH (different twMerge groups), and the Badge/Zone variants use
 * mutually exclusive booleans. The class diff above is the evidence for that, not
 * the audit.
 *
 * If a future call site DOES need conflict resolution, write the class
 * conditionally; do not reintroduce a 27 KB table on every page to do it.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
