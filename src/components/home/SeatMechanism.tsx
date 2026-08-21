"use client";

// NO MOTION IMPORTS. The rotating panel needed LazyMotion, domAnimation,
// AnimatePresence and `m` elements to cross-fade one term into the next. The
// stack does the same job with `position: sticky` and the scroll the reader is
// already doing, so the whole motion runtime leaves this section with it.
import { Container, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { useOnScreen } from "@/lib/use-on-screen";


/**
 * The differentiator, and the one section on this page that is protected from
 * compaction on content: a durable seat is the reason Tenure is not a wiki.
 *
 * WHAT THE COMPACTION PASS DID TAKE OUT — and it was a duplicate, not a cut.
 *
 * `Handoff` used to carry a second block titled "Shadow access", whose h3 read
 * "They read the seat before they sit in it", with three cards for SHADOW /
 * ACTIVE / ALUMNI. This section already rotated three occupants through exactly
 * those three states, and `AiOnboarding`'s h2 was the SAME SENTENCE, word for
 * word. Three surfaces, one idea, two identical headlines. The lifecycle now
 * lives here once, as a legend under the occupant list — which is where it is
 * actually explaining something — and the duplicate blocks are gone.
 *
 * The `records` count also became a picture. It was a bare NumberFlow digit going
 * 12 -> 34 -> 58, which reads as a counter animating rather than as a quantity
 * accumulating across handoffs. The stacked cards draw the handoff boundaries as
 * ticks *through* the series, so the point of the section — the line does not
 * reset when the person changes — is the shape of the mark rather than a claim in
 * the caption.
 */

type Step = {
  term: string;
  active: string;
  shadow: string;
  alumni: string[];
  records: number;
  fresh: { tag: string; t: string };
};

const STEPS: Step[] = [
  {
    term: "2026–27",
    active: "Marcus Lee",
    shadow: "Priya Nair",
    alumni: ["Maya Chen"],
    records: 12,
    fresh: { tag: "Vendor", t: "Prestige Catering, flat $3,800" },
  },
  {
    term: "2027–28",
    active: "Priya Nair",
    shadow: "Sana Ali",
    alumni: ["Maya Chen", "Marcus Lee"],
    records: 34,
    fresh: { tag: "Vendor", t: "Halden Catering renewal, locked 15% rate" },
  },
  {
    term: "2028–29",
    active: "Sana Ali",
    shadow: "Jordan Kim",
    alumni: ["Maya Chen", "Marcus Lee", "Priya Nair"],
    records: 58,
    fresh: { tag: "Lesson", t: "Move the gala off finals week" },
  },
];


/* Each line is a mechanism, not a restatement of the heading. */
const AFFIRMATIONS = [
  "The next holder shadows the seat before their term starts, read-only, knowledge cards included",
  "The outgoing holder becomes alumni: the record stays on the seat, the access does not",
  "Tenure AI answers from that record, with its sources linked",
];

/** The three states, stated once for the whole site. */
const LIFECYCLE: { label: string; when: string; tone: "shadow" | "active" | "alumni" }[] = [
  { label: "Shadow", when: "before the term, read-only", tone: "shadow" },
  { label: "Active", when: "during it, the same access, now write", tone: "active" },
  { label: "Alumni", when: "after it, record stays, access does not", tone: "alumni" },
];

const TONE = {
  active: "bg-grove text-on-accent",
  shadow: "bg-warning-subtle text-warning",
  alumni: "bg-surface-subtle text-text-secondary",
} as const;

function Occupant({
  name,
  status,
}: {
  name: string;
  status: "active" | "shadow" | "alumni";
}) {
  const initials = name.split(" ").map((p) => p[0]).join("");
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors",
        status === "active" && "border-grove/30 bg-grove-soft/60",
        status === "shadow" && "border-brand-gold/30 bg-brand-gold/10",
        status === "alumni" && "border-line bg-surface-subtle",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full font-mono text-mark",
          TONE[status],
        )}
      >
        {initials}
      </span>
      <span
        className={cn(
          "flex-1 text-caption font-medium",
          status === "alumni" ? "text-ink-faint" : "text-ink",
        )}
      >
        {name}
      </span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 font-mono text-mark uppercase tracking-wide",
          TONE[status],
        )}
      >
        {status}
      </span>
    </div>
  );
}

export function SeatMechanism() {
  const { ref: sectionRef, onScreen } = useOnScreen<HTMLDivElement>();
  void onScreen;

  /*
    NO TIMER ANY MORE. This used to advance through the three terms on a 3.4s
    `setInterval`, which meant the section showed a third of its own argument at
    rest and the reader had to wait for the rest, with a pause button, because
    WCAG 2.2.2 requires one for anything that moves on its own.

    The terms are stacked instead: all three are on the page, and SCROLLING is
    what reveals them. That removes the timer, the pause control, the hover-pause,
    the visibility gate that existed only to stop the timer burning ~615ms of
    style and layout per page-life, and the whole class of "did I miss one".
  */

  return (
      <Section id="seat" from="canvas" tone="canvas" backdrop="light" className="overflow-visible lg:pb-24">
        <Container>
          <div
            ref={sectionRef}
            /*
              `min-w-0` on the grid children, and it is a real fix rather than a
              guard. A grid item's automatic minimum size is its MIN-CONTENT, not
              zero, so any child that cannot wrap, an occupant row, a mono label,               props the whole column open and the page scrolls sideways. At 320px
              this section measured 407px wide.

              It did that before this commit too. `overflow: hidden` on Section was
              clipping it, so the reflow test passed while a phone-width reader
              still lost 87px of every row. Removing the clip for `position:
              sticky` is what surfaced it.
            */
            className="grid items-start gap-10 [&>*]:min-w-0 lg:grid-cols-2 lg:gap-14"
          >
            {/* LEFT, the thesis */}
            <div className="max-w-xl lg:sticky lg:top-24 lg:pt-4">
              <SectionHead
                eyebrow="Why Tenure is different"
                title={
                  <>
                    The person is new. The seat{" "}
                    <span className="text-gradient">remembers everything</span>.
                  </>
                }
                lead={
                  <>
                    Other tools model people, and the roster wipes clean every
                    cycle. Tenure models a durable{" "}
                    <span className="font-medium text-ink">seat</span>: a position
                    that keeps its money, contacts, playbooks and decisions no
                    matter who holds it.
                  </>
                }
              />

              <ul className="mt-7 space-y-3">
                {AFFIRMATIONS.map((a, idx) => (
                  <Reveal as="li" key={a} delay={0.12 + idx * 0.05} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md bg-grove-soft text-grove-deep">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path
                          d="M3.5 8.5l3 3 6-7"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-body leading-relaxed text-ink-soft measure">{a}</span>
                  </Reveal>
                ))}
              </ul>

              {/*
                THE LIFECYCLE LEGEND MOVED HERE rather than being deleted with the
                panel that used to hold it. It is the one place on the site where
                Shadow / Active / Alumni are defined, and it belongs with the
                thesis rather than inside an illustration of it.
              */}
              <dl className="mt-7 space-y-1.5 border-t border-line pt-5">
                {LIFECYCLE.map((l) => (
                  <div key={l.label} className="flex items-baseline gap-3">
                    <dt
                      className={cn(
                        "w-16 shrink-0 rounded-md px-1.5 py-0.5 text-center font-mono text-mark uppercase tracking-wide",
                        TONE[l.tone],
                      )}
                    >
                      {l.label}
                    </dt>
                    <dd className="text-body-sm leading-relaxed text-ink-soft measure">
                      {l.when}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/*
              RIGHT: THE TERMS, STACKED.

              Each card is `position: sticky` at a top offset 18px below the one
              before it, so scrolling pulls the next term up over the last and
              leaves its header peeking. The pile that builds at the top IS the
              argument, the record accrues, the people do not.

              TWO THINGS THIS DEPENDS ON, both easy to get wrong:

              1. No ancestor may have `overflow: hidden`. Section sets it by
                 default for bleeds, and it silently disables sticky in every
                 descendant, the cards simply scroll away and nothing errors.
                 This section overrides it.
              2. Each card needs a fixed height, or a tall card would cover the
                 next one's landing point and the stack would never separate.

              The matte grade runs ash -> clay -> sage across the three, so the
              stack reads as accumulation rather than as three copies.
            */}
            <div className="lg:pl-2">
              {STEPS.map((step, idx) => (
                <div
                  key={step.term}
                  className="sticky"
                  style={{ top: `${88 + idx * 18}px` }}
                >
                  <div
                    className={cn(
                      "matte mb-5 flex h-[23rem] flex-col rounded-2xl border border-line p-5 shadow-[0_18px_50px_-30px_oklch(20%_0.02_260/0.45)] sm:p-6",
                      ["matte-ash", "matte-clay", "matte-sage"][idx],
                    )}
                  >
                    <div className="flex items-baseline justify-between">
                      <p className="label-mono text-mark">Term {step.term}</p>
                      <span className="font-mono text-mark text-ink-faint">
                        {idx === 0 ? "the person rotates" : `handoff ${idx}`}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <Occupant name={step.active} status="active" />
                      <Occupant name={step.shadow} status="shadow" />
                      {step.alumni.slice(-1).map((a) => (
                        <Occupant key={a} name={a} status="alumni" />
                      ))}
                      {step.alumni.length > 1 && (
                        <p className="pl-1 font-mono text-mark text-ink-faint">
                          + {step.alumni.length - 1} more alumni on this seat
                        </p>
                      )}
                    </div>

                    <div className="mt-auto border-t border-line pt-3">
                      <div className="flex items-baseline justify-between">
                        <p className="label-mono text-mark text-grove-deep">
                          Institutional memory on this seat
                        </p>
                        <p className="font-display text-title tnum text-grove-deep">
                          {step.records}
                        </p>
                      </div>
                      <p className="text-mark text-ink-soft">
                        records, carried across every handoff
                      </p>
                      <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-grove/25 bg-surface/70 px-2.5 py-1.5">
                        <span className="rounded bg-grove-soft px-1.5 py-0.5 font-mono text-mark text-grove-deep">
                          {step.fresh.tag}
                        </span>
                        <span className="truncate text-caption text-ink-soft">
                          {step.fresh.t}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
  );
}
