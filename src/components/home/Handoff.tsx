import type { ReactNode } from "react";
import { Container, SECTION_TIGHT, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Panel, PanelBar, PanelTag } from "@/components/ui/Panel";

/**
 * The packet, which is the proof: it is assembled from the database when you open
 * it, so there is nothing for the outgoing holder to remember to write.
 *
 * TWO THINGS WERE REMOVED HERE, BOTH DUPLICATES.
 *
 * 1. **The "Shadow access" sub-block.** An eyebrow, an h3 reading "They read the
 *    seat before they sit in it", a paragraph, and three cards for SHADOW /
 *    ACTIVE / ALUMNI — about 700px. `SeatMechanism` already rotates three
 *    occupants through those exact three states one section earlier, and
 *    `AiOnboarding`'s h2 was that same sentence *verbatim*. The lifecycle is now
 *    stated once, in the seat panel where it is labelling something.
 * 2. **The three standing figures as a separate strip.** "3 requests",
 *    "2 deliverables", "$12,400" sat in their own three-column band under the
 *    table. They are part of the packet, so they are in the packet's footer row —
 *    same three facts, no second surface.
 *
 * C-002 governs this section: the packet contains NO AI. The page must never
 * describe it as AI-generated or AI-written, because the route that builds it
 * imports no model code.
 */

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[18px] w-[18px]",
  "aria-hidden": true,
};

type SeatRow = {
  seat: string;
  code: string;
  holder: string | null;
  last: string;
  cards: number;
  shadow: string | null;
};

/** One row per seat, exactly what the packet page renders: every seat side by side. */
const SEATS: SeatRow[] = [
  {
    seat: "President",
    code: "SCC-PRES",
    holder: "Dana Osei",
    last: "Marcus Lee ’26",
    cards: 22,
    shadow: "Ariel Fonseca",
  },
  {
    seat: "VP Finance & Operations",
    code: "SCC-VP-FINA-OPER",
    holder: "Marcus Lee",
    last: "Maya Chen ’25",
    cards: 34,
    shadow: "Priya Nair",
  },
  {
    seat: "VP Events & Partnerships",
    code: "SCC-VP-EVEN-PART",
    holder: "Sana Ali",
    last: "Ines Duarte ’25",
    cards: 19,
    shadow: null,
  },
  {
    seat: "VP Sponsorship",
    code: "SCC-VP-SPON",
    holder: null,
    last: "Tomas Reyes ’26",
    cards: 27,
    shadow: "Jordan Kim",
  },
];

/** The three standings the packet carries alongside the seat table. */
const STANDING: { label: string; value: string; note: string; icon: ReactNode }[] = [
  {
    label: "Awaiting approval",
    value: "3 requests",
    note: "two sitting in the office gate",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="4" width="17" height="6.5" rx="2" />
        <rect x="3.5" y="13.5" width="17" height="6.5" rx="2" />
        <path d="M7 7.2l1.3 1.3L11 5.9" />
      </svg>
    ),
  },
  {
    label: "Due to the office",
    value: "2 deliverables",
    note: "next one closes in 6 days",
    icon: (
      <svg {...svg}>
        <path d="M9.5 4.75H7.25A1.25 1.25 0 0 0 6 6v13.25a1.25 1.25 0 0 0 1.25 1.25h9.5A1.25 1.25 0 0 0 18 19.25V6a1.25 1.25 0 0 0-1.25-1.25H14.5" />
        <rect x="9.5" y="3" width="5" height="3.5" rx="1.2" />
        <path d="M9 13l2 2 4-4.5" />
      </svg>
    ),
  },
  {
    label: "Where the budget stands",
    value: "$12,400",
    note: "of $18,000 committed this term",
    icon: (
      <svg {...svg}>
        <path d="M3.5 20.5h17" />
        <rect x="5" y="11" width="3.4" height="6" rx="1" />
        <rect x="10.3" y="6.5" width="3.4" height="10.5" rx="1" />
        <rect x="15.6" y="14" width="3.4" height="3" rx="1" />
      </svg>
    ),
  },
];

/**
 * Stacked label above the value on mobile, where the table collapses to one cell
 * per line. Must be block: some cells hold an inline value (the Vacant pill, the
 * Shadow badge, "not yet named"), and an inline label would sit on the same line.
 */
function ColumnLabel({ children }: { children: ReactNode }) {
  return (
    <span className="label-mono mb-0.5 block text-mark md:hidden">{children}</span>
  );
}

export function Handoff() {
  /*
    THE `id` EXISTS SO THE RIBBON MENU CAN LINK HERE. Its "how a handoff works"
    entry first pointed at `#how`, which belonged to a HowItWorks section that had
    been cut from /product and was rendered by no page at all — a dead fragment
    the link test caught before it shipped. This is the section that actually
    answers the question.
  */
  return (
    <Section id="handoff" from="surface" tone="subtle" backdrop="grid" space={SECTION_TIGHT}>
      <Container>
        <SectionHead
          align="center"
          eyebrow="The handoff"
          title={
            <>
              The handoff document nobody has to{" "}
              <span className="text-gradient">write</span>.
            </>
          }
          lead="Tenure assembles it from the database when you open it. No AI, and nothing for the outgoing holder to remember."
        />

        <Reveal delay={0.14} className="mt-7">
          <Panel>
            <PanelBar
              icon={
                <svg {...svg}>
                  <path d="M7 3.5h7l4.5 4.5v11.25A1.25 1.25 0 0 1 17.25 20.5H7A1.25 1.25 0 0 1 5.75 19.25V4.75A1.25 1.25 0 0 1 7 3.5z" />
                  <path d="M14 3.5V8h4.5" />
                  <path d="M9 12h6M9 15.5h4" />
                </svg>
              }
              title="Handoff packet"
              meta="Student Culture Council · every seat · worked example"
              aside={<PanelTag>assembled from the record</PanelTag>}
            />

            {/* column heads, wide screens only */}
            <div className="hidden gap-4 border-b border-line px-6 py-2.5 md:grid md:grid-cols-[1.4fr_1fr_1.2fr_0.5fr_1fr]">
              <span className="label-mono text-mark">Seat</span>
              <span className="label-mono text-mark">Holds it now</span>
              <span className="label-mono text-mark">Held it last term</span>
              <span className="label-mono text-mark">Cards</span>
              <span className="label-mono text-mark">Shadowing in</span>
            </div>

            <ul>
              {SEATS.map((s) => (
                <li
                  key={s.code}
                  /*
                    TWO COLUMNS ON A PHONE, NOT ONE.

                    Below `md` this had no column count at all, so all five cells
                    went full width and each seat became nine stacked lines with
                    its column label above it — the four labels printed sixteen
                    times down the list. Measured: 1,835px, 2.17 mobile screens,
                    the tallest section on the site and the single largest reason
                    home ran 16 mobile screens against 10 on desktop.

                    Paired, the four value cells take two lines instead of four.
                    The seat name spans both columns because it is the row's
                    subject, and a name broken across half a phone width is the
                    one thing here that must not wrap.
                  */
                  className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-b border-line-soft px-5 py-3.5 last:border-b-0 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr_0.5fr_1fr] md:items-center md:gap-4"
                >
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-body-sm font-medium text-ink">{s.seat}</p>
                    <p className="font-mono text-mark text-text-secondary">{s.code}</p>
                  </div>

                  <div>
                    <ColumnLabel>Holds it now</ColumnLabel>
                    {s.holder ? (
                      <p className="text-body-sm text-ink">{s.holder}</p>
                    ) : (
                      <span className="inline-flex rounded-md border border-brand-coral/30 bg-danger-subtle px-2 py-0.5 font-mono text-mark font-medium uppercase tracking-wide text-danger">
                        Vacant
                      </span>
                    )}
                  </div>

                  <div>
                    <ColumnLabel>Held it last term</ColumnLabel>
                    <p className="text-body-sm text-ink-soft">{s.last}</p>
                  </div>

                  <div>
                    <ColumnLabel>Cards</ColumnLabel>
                    <p className="font-mono text-body-sm tnum text-ink">{s.cards}</p>
                  </div>

                  <div>
                    <ColumnLabel>Shadowing in</ColumnLabel>
                    {s.shadow ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="rounded-md bg-warning-subtle px-1.5 py-0.5 font-mono text-mark font-medium uppercase tracking-wide text-warning">
                          Shadow
                        </span>
                        <span className="text-caption text-ink-soft">{s.shadow}</span>
                      </span>
                    ) : (
                      <span className="text-caption text-ink-faint">not yet named</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* The three standings, in the packet’s own footer rather than in a
                second band below it. `gap-px` on a line-coloured background is what
                draws the two dividers without three nested borders. */}
            {/* Three across at every width. Stacked on a phone these cost ~350px to
                say three short numbers, and each is one line of value plus one of
                note — there is room for three columns at 390px. */}
            <div className="grid grid-cols-3 gap-px border-t border-line bg-line">
              {STANDING.map((st) => (
                <div key={st.label} className="bg-cloud px-3 py-4 sm:px-6">
                  <div className="flex items-center gap-2.5">
                    {/* The icon plate is desktop-only: at 390px three of them
                        push the labels onto a second line for no information. */}
                    <span className="hidden h-8 w-8 items-center justify-center rounded-lg bg-grove-soft text-grove sm:inline-flex">
                      {st.icon}
                    </span>
                    <span className="label-mono text-mark">{st.label}</span>
                  </div>
                  <p className="mt-2 font-display text-lead font-semibold tnum text-ink sm:mt-2.5 sm:text-title-sm">
                    {st.value}
                  </p>
                  <p className="text-caption leading-snug text-ink-soft sm:text-caption">{st.note}</p>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>
      </Container>
    </Section>
  );
}
