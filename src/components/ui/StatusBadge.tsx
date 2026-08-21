import { cn } from "@/lib/cn";

/**
 * The status vocabulary used on the trust page.
 *
 * IT USED TO HAVE FIVE WORDS. Two of them — "Roadmap" ("Decided and specified.
 * Not built. Do not plan around it.") and "Not supported" ("Does not exist
 * today.") — existed to label things the product cannot do, on the page a buyer
 * reaches to find out what it can. Those rows are gone from the data, so the
 * words that described them are gone from the vocabulary.
 *
 * What remains distinguishes degrees of BUILT: running in the deployment, and
 * additionally asserted by a test on every release. A reviewer still needs that
 * distinction, and it is the one this page is for. Colour is never the only
 * carrier — the word itself is always rendered.
 */
export const STATUSES = {
  live: {
    label: "Live",
    hint: "Implemented and running in the deployed application.",
    className: "bg-success-subtle text-success border-success/25",
  },
  ci: {
    label: "Verified in CI",
    hint: "Implemented, and a test asserts it on every build.",
    className: "bg-success-subtle text-success border-success/25",
  },
  validating: {
    label: "In pilot validation",
    hint: "Built, and going into the first deployment this term.",
    className: "bg-info-subtle text-info border-info/25",
  },
} as const;

export type StatusKey = keyof typeof STATUSES;

export function StatusBadge({
  status,
  className,
}: {
  status: StatusKey;
  className?: string;
}) {
  const s = STATUSES[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-lg border px-2.5 py-1 font-mono text-meta font-medium uppercase tracking-[0.08em]",
        s.className,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
