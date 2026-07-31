import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionContour } from "@/components/visuals/SectionContour";
import { cn } from "@/lib/cn";

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[20px] w-[20px]",
  "aria-hidden": true,
};

type SeatRow = {
  seat: string;
  code: string;
  holder: string | null;
  last: string;
  reach: string;
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
    reach: "m.lee@u.rochester.edu",
    cards: 22,
    shadow: "Ariel Fonseca",
  },
  {
    seat: "VP Finance & Operations",
    code: "SCC-VP-FINA-OPER",
    holder: "Marcus Lee",
    last: "Maya Chen ’25",
    reach: "maya.chen@alum.rochester.edu",
    cards: 34,
    shadow: "Priya Nair",
  },
  {
    seat: "VP Events & Partnerships",
    code: "SCC-VP-EVEN-PART",
    holder: "Sana Ali",
    last: "Ines Duarte ’25",
    reach: "i.duarte@alum.rochester.edu",
    cards: 19,
    shadow: null,
  },
  {
    seat: "VP Sponsorship",
    code: "SCC-VP-SPON",
    holder: null,
    last: "Tomas Reyes ’26",
    reach: "t.reyes@u.rochester.edu",
    cards: 27,
    shadow: "Jordan Kim",
  },
];

type Standing = { label: string; value: string; note: string; icon: ReactNode };

/** The three standings the packet carries alongside the seat table. */
const STANDING: Standing[] = [
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

const TONE: Record<string, string> = {
  shadow: "bg-gold/20 text-[#9a6a12]",
  active: "bg-grove text-cloud",
  alumni: "bg-line/60 text-ink-faint",
};

type Stage = { tone: keyof typeof TONE; label: string; when: string; body: string };

const STAGES: Stage[] = [
  {
    tone: "shadow",
    label: "Shadow",
    when: "Before the term begins",
    body: "The incoming officer is added to the seat with read-only access to everything it knows: past decisions, vendor terms, and the reasons behind them.",
  },
  {
    tone: "active",
    label: "Active",
    when: "Day one",
    body: "The same access becomes write access. Nothing is copied over and nothing is rebuilt, the seat simply changes hands.",
  },
  {
    tone: "alumni",
    label: "Alumni",
    when: "After the term",
    body: "The outgoing officer keeps their record and loses the keys. A seat that carries history is retired, never deleted, so the record stays where the work happened.",
  },
];

/**
 * Stacked label above the value on mobile, where the table collapses to one
 * cell per line. Must be block: some cells hold an inline value (the Vacant
 * pill, the Shadow badge, "not yet named"), and an inline label would sit on
 * the same line as those with no separation.
 */
function ColumnLabel({ children }: { children: ReactNode }) {
  return (
    <span className="label-mono mb-0.5 block text-[0.55rem] md:hidden">
      {children}
    </span>
  );
}

export function Handoff() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-paper py-24 sm:py-32">
      <SectionContour place="cl" seed={5} className="text-grove/[0.06]" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">The handoff</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
              The handoff document nobody has to{" "}
              <span className="text-gradient">write</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 text-lg leading-relaxed text-ink-soft">
              Every seat, side by side: who holds it now, who held it last term
              and how to reach them, how many knowledge cards are attached, and
              who is shadowing in. It isn&rsquo;t a document someone remembered
              to write on their way out. It is assembled from the record, so it
              is current the day you open it.
            </p>
          </Reveal>
        </div>

        {/* the packet itself */}
        <Reveal delay={0.1} className="mt-14">
          <div className="overflow-hidden rounded-3xl border border-line bg-cloud shadow-[0_1px_2px_rgba(12,30,51,0.05),0_40px_100px_-56px_rgba(12,30,51,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-grove-soft text-grove">
                  <svg {...svg}>
                    <path d="M7 3.5h7l4.5 4.5v11.25A1.25 1.25 0 0 1 17.25 20.5H7A1.25 1.25 0 0 1 5.75 19.25V4.75A1.25 1.25 0 0 1 7 3.5z" />
                    <path d="M14 3.5V8h4.5" />
                    <path d="M9 12h6M9 15.5h4" />
                  </svg>
                </span>
                <div>
                  <p className="font-display text-[1.05rem] font-semibold text-ink">
                    Handoff packet
                  </p>
                  <p className="font-mono text-[0.66rem] text-ink-faint">
                    Student Culture Council · every seat, as of today
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper/60 px-2.5 py-1.5 text-[0.7rem] text-ink-faint">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-grove" />
                assembled from the record
              </span>
            </div>

            {/* column heads, wide screens only */}
            <div className="hidden gap-4 border-b border-line px-7 py-2.5 md:grid md:grid-cols-[1.35fr_1fr_1.3fr_0.6fr_1fr]">
              <span className="label-mono text-[0.55rem]">Seat</span>
              <span className="label-mono text-[0.55rem]">Holds it now</span>
              <span className="label-mono text-[0.55rem]">Held it last term</span>
              <span className="label-mono text-[0.55rem]">Cards</span>
              <span className="label-mono text-[0.55rem]">Shadowing in</span>
            </div>

            <ul>
              {SEATS.map((s) => (
                <li
                  key={s.code}
                  className="grid gap-3 border-b border-line-soft px-5 py-4 last:border-b-0 sm:px-7 md:grid-cols-[1.35fr_1fr_1.3fr_0.6fr_1fr] md:items-center md:gap-4"
                >
                  <div>
                    <p className="text-[0.92rem] font-medium text-ink">{s.seat}</p>
                    <p className="font-mono text-[0.6rem] text-ink-faint">{s.code}</p>
                  </div>

                  <div>
                    <ColumnLabel>Holds it now</ColumnLabel>
                    {s.holder ? (
                      <p className="text-[0.9rem] text-ink">{s.holder}</p>
                    ) : (
                      <span className="inline-flex rounded-md border border-coral/30 bg-coral/[0.07] px-2 py-0.5 font-mono text-[0.56rem] font-medium uppercase tracking-wide text-[#b23a1f]">
                        Vacant
                      </span>
                    )}
                  </div>

                  <div>
                    <ColumnLabel>Held it last term</ColumnLabel>
                    <p className="text-[0.9rem] text-ink-soft">{s.last}</p>
                    <p className="font-mono text-[0.6rem] text-ink-faint">{s.reach}</p>
                  </div>

                  <div>
                    <ColumnLabel>Cards</ColumnLabel>
                    <p className="font-mono text-[0.9rem] tnum text-ink">{s.cards}</p>
                  </div>

                  <div>
                    <ColumnLabel>Shadowing in</ColumnLabel>
                    {s.shadow ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="rounded-md bg-gold/20 px-1.5 py-0.5 font-mono text-[0.54rem] font-medium uppercase tracking-wide text-[#9a6a12]">
                          Shadow
                        </span>
                        <span className="text-[0.85rem] text-ink-soft">{s.shadow}</span>
                      </span>
                    ) : (
                      <span className="text-[0.85rem] text-ink-faint">not yet named</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="grid gap-px border-t border-line bg-line sm:grid-cols-3">
              {STANDING.map((st) => (
                <div key={st.label} className="bg-cloud px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-grove-soft text-grove">
                      {st.icon}
                    </span>
                    <span className="label-mono text-[0.55rem]">{st.label}</span>
                  </div>
                  <p className="mt-3 font-display text-[1.15rem] font-semibold tnum text-ink">
                    {st.value}
                  </p>
                  <p className="text-[0.82rem] text-ink-soft">{st.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[0.86rem] text-ink-faint">
            No departing officer writes this. Tenure assembles it from the seats,
            the approvals, the deliverables, and the ledger already on file.
          </p>
        </Reveal>

        {/* shadow access */}
        <div className="mt-16 grid items-center gap-10 rounded-3xl border border-line bg-cloud p-7 sm:p-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>Shadow access</Eyebrow>
            <h3 className="font-display mt-5 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[1.85rem]">
              They read the seat before they{" "}
              <span className="text-grove">sit in it</span>.
            </h3>
            <p className="mt-5 text-[1rem] leading-relaxed text-ink-soft">
              There is no first day where somebody opens an empty account.
              Access attaches to the seat, so a handoff is a change of status,
              not a transfer of files, passwords, and folders somebody has to
              remember to send.
            </p>
            <p className="mt-6 rounded-xl border border-line bg-paper/50 px-4 py-3 text-[0.86rem] leading-relaxed text-ink-soft">
              <span className="font-medium text-ink">What the incoming officer sees:</span>{" "}
              everything the seat can see, read-only, from the day they are named
              to the day their term starts.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ol>
              {STAGES.map((st, i) => (
                <li key={st.label}>
                  <div className="rounded-2xl border border-line bg-paper/60 p-4 sm:p-5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 font-mono text-[0.56rem] font-medium uppercase tracking-wide",
                          TONE[st.tone],
                        )}
                      >
                        {st.label}
                      </span>
                      <span className="text-[0.72rem] text-ink-faint">{st.when}</span>
                    </div>
                    <p className="mt-2.5 text-[0.88rem] leading-relaxed text-ink-soft">
                      {st.body}
                    </p>
                  </div>
                  {i < STAGES.length - 1 && (
                    <span aria-hidden className="mx-auto my-2 block h-5 w-px bg-line" />
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
