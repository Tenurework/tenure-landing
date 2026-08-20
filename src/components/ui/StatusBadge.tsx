import { cn } from "@/lib/cn";

/**
 * The status vocabulary used on the trust page.
 *
 * These five words are the whole point of that page: a university reviewer
 * needs to tell implemented-and-tested apart from operational-process apart
 * from roadmap, without reading between the lines. Colour is never the only
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
    hint: "Built, but not yet exercised at scale with real users.",
    className: "bg-info-subtle text-info border-info/25",
  },
  roadmap: {
    label: "Roadmap",
    hint: "Decided and specified. Not built. Do not plan around it.",
    className: "bg-warning-subtle text-warning border-warning/25",
  },
  unsupported: {
    label: "Not supported",
    hint: "Does not exist today. Listed so you do not have to ask.",
    className: "bg-danger-subtle text-danger border-danger/25",
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
