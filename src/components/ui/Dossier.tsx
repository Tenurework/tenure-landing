import type { ReactNode } from "react";
import { Panel, PanelBar, PanelTag } from "@/components/ui/Panel";
import { cn } from "@/lib/cn";

/**
 * THE DOSSIER — a long reference document as one card, read one section at a time.
 *
 * /trust ran 8.9 desktop viewports and /pilot ran 14.4, and neither is padding:
 * every sentence on them is load-bearing. /trust is what a security reviewer is
 * sent instead of a questionnaire, and /pilot is a written proposal with the
 * limits stated up front. Cutting words there would be cutting the thing that
 * makes those pages worth anything.
 *
 * So the compaction is structural. Each page becomes a small number of collapsed
 * sections with a summary line that says what is inside — including a tally of
 * how many controls are live versus not supported, which is genuinely the first
 * thing a reviewer wants — and the reader opens the one they came for.
 *
 * WHY NATIVE `<details>` AND NOT A JAVASCRIPT RAIL.
 *
 * The rail pattern used elsewhere on this site (Platform, OfficeConsole) renders
 * only the selected pane, and that would be wrong here, three times over:
 *
 *  1. `claims.spec.ts` reads the whole public surface and asserts that /trust
 *     still says "separation of duties", "hash chain", "row-level security",
 *     "single sign-on" and "SOC 2" WITH their disclaimers beside them. Content
 *     that is not in the DOM cannot be audited — the ratchet would go green
 *     because the page stopped saying anything, which is the worst possible way
 *     for it to pass. The spec opens every `<details>` before reading, so this
 *     pattern keeps the whole page auditable.
 *  2. Ctrl+F has to work. A procurement reviewer searches this page for "SOC 2"
 *     and "backup retention"; browsers find text inside a closed `<details>` and
 *     open it, and find nothing at all in an unmounted React subtree.
 *  3. It works with no JavaScript, which a reference document should.
 *
 * The `name` attribute makes each dossier an exclusive accordion — opening one
 * closes its siblings — so the page can never be expanded into the wall it used
 * to be. The ratchet strips that attribute before opening everything, which is
 * why it can audit all sections at once.
 */

export type DossierItem = {
  key: string;
  title: string;
  /** One line, shown collapsed: what is inside and why you would open it. */
  blurb: string;
  /** Small counts shown on the summary row — "6 controls", "2 not supported". */
  tally?: { label: string; tone?: "quiet" | "good" | "warn" | "bad" }[];
  children: ReactNode;
};

const TALLY_TONE = {
  quiet: "border-line bg-paper/70 text-ink-faint",
  good: "border-success/25 bg-success-subtle text-success",
  warn: "border-warning/25 bg-warning-subtle text-warning",
  bad: "border-danger/25 bg-danger-subtle text-danger",
} as const;

export function Dossier({
  name,
  title,
  meta,
  items,
  openFirst = true,
  footer,
}: {
  /** Groups these sections into one exclusive accordion. Must be unique per page. */
  name: string;
  title: string;
  meta?: string;
  items: DossierItem[];
  openFirst?: boolean;
  footer?: ReactNode;
}) {
  return (
    <Panel>
      <PanelBar
        title={title}
        meta={meta}
        aside={<PanelTag dot={false}>{`${items.length} sections`}</PanelTag>}
      />

      <ul>
        {items.map((item, i) => (
          <li key={item.key} className="border-b border-line-soft last:border-b-0">
            <details name={name} open={openFirst && i === 0} className="group">
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-start gap-4 px-5 py-4 transition-colors sm:px-6",
                  "hover:bg-sand/50 [&::-webkit-details-marker]:hidden",
                )}
              >
                {/* The chevron. `group-open:` rotates it, so the control reports
                    its own state without a second element appearing or vanishing. */}
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line bg-paper/70 text-ink-soft transition-transform duration-200 group-open:rotate-90"
                >
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    {/*
                      A real <h2>, inside the <summary>.

                      As a <span> this produced a heading-order violation on
                      /trust: the page went h1 (page title) straight to h3 (the
                      individual controls inside a section), because the thing
                      naming each section was not a heading at all. That also
                      breaks the way a screen-reader user actually navigates a
                      reference document this long — by jumping heading to
                      heading — which is the one audience most likely to be
                      reading /trust end to end.

                      A heading inside a summary is well-supported: the summary
                      keeps its button role and the heading stays in the outline.
                    */}
                    <h2 className="font-display text-lead font-semibold tracking-tight text-ink">
                      {item.title}
                    </h2>
                    {item.tally?.map((t) => (
                      <span
                        key={t.label}
                        className={cn(
                          "rounded-md border px-1.5 py-0.5 font-mono text-mark-xs font-medium uppercase tracking-wide",
                          TALLY_TONE[t.tone ?? "quiet"],
                        )}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-body-sm leading-relaxed text-ink-soft">
                    {item.blurb}
                  </p>
                </div>
              </summary>

              <div className="border-t border-line-soft bg-paper/40 px-5 py-5 sm:px-6">
                {item.children}
              </div>
            </details>
          </li>
        ))}
      </ul>

      {footer}
    </Panel>
  );
}
