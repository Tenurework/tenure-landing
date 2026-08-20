import { Container, SECTION_TIGHT, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Panel, PanelBar, PanelTag } from "@/components/ui/Panel";

/**
 * What today's cold handoff costs, and what the seat keeps instead.
 *
 * WAS: two side-by-side cards, "Without Tenure" and "With Tenure", each with its
 * own heading, its own eyebrow and its own three-item list. Six list items and
 * four headings across two surfaces, and the reader had to hold the left column
 * in their head while reading the right one to see the point at all.
 *
 * NOW: one ledger. Each row is a loss on the left and the mechanism that answers
 * it on the right, so the comparison is read across a line instead of across a
 * gap. That is the same six facts in a third of the height, and it is the only
 * arrangement in which "the org pays for it twice" is legible as a structure
 * rather than asserted as a sentence.
 *
 * The copy is also no longer measured in semesters. "The next person spends a
 * semester relearning" put a university calendar on a claim that applies to an
 * operations lead at a 30-person company and a volunteer board chair, neither of
 * whom has one.
 */

/** Each row: the loss today, and the mechanism that answers it. Ordered so the
 *  pairs line up — a cold handoff answered by an assembled packet, and so on. */
const LEDGER: { lost: string; kept: string }[] = [
  {
    lost: "A cold handoff through a shared folder",
    kept: "A handoff packet assembled from the record itself",
  },
  {
    lost: "Sponsors, vendors and funders go quiet",
    kept: "Contacts, deals and terms stay attached to the seat",
  },
  {
    lost: "The same mistakes repeat every cycle",
    kept: "The next holder reads the seat before day one",
  },
];

function Cross() {
  return (
    <span
      aria-hidden
      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] bg-brand-coral/90 text-on-accent"
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Check() {
  return (
    <span
      aria-hidden
      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] bg-grove-soft text-grove-deep"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6.5l2.4 2.4L9.5 3.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Problem() {
  return (
    <Section from="canvas" tone="subtle" backdrop="grid" space={SECTION_TIGHT}>
      <Container>
        <SectionHead
          eyebrow="The cost of turnover"
          title={
            <>
              When a leader leaves, the organization pays for it{" "}
              <span className="text-grove">twice</span>.
            </>
          }
          lead="Once when a year of relationships, vendor terms, budgets and playbooks walk out the door, and again while the next person relearns what the organization already knew."
        />

        <Reveal delay={0.14} className="mt-7">
          <Panel>
            <PanelBar
              title="The handoff, both ways"
              meta="one row per thing that is lost, and what keeps it"
              aside={<PanelTag>read across, not down</PanelTag>}
            />

            {/* Column heads, wide screens only: on a phone each row stacks and the
                icons carry the distinction, so a header row would be noise. */}
            <div className="hidden gap-6 border-b border-line px-6 py-2.5 md:grid md:grid-cols-2">
              <span className="label-mono text-mark-xs text-brand-coral">
                Without Tenure &mdash; the handoff today
              </span>
              <span className="label-mono text-mark-xs text-grove">
                With Tenure &mdash; the seat remembers
              </span>
            </div>

            <ul>
              {LEDGER.map((row) => (
                <li
                  key={row.lost}
                  className="grid gap-3 border-b border-line-soft px-5 py-4 last:border-b-0 sm:px-6 md:grid-cols-2 md:gap-6"
                >
                  <div className="flex items-start gap-3">
                    <Cross />
                    <span className="text-body leading-relaxed text-ink-faint">
                      {row.lost}
                    </span>
                  </div>
                  {/* The hairline is on the cell, not between the columns: a
                      full-height divider would imply the rows are independent. */}
                  <div className="flex items-start gap-3 md:border-l md:border-line md:pl-6">
                    <Check />
                    <span className="text-body leading-relaxed text-ink">{row.kept}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
      </Container>
    </Section>
  );
}
