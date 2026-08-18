"use client";

import { useEffect, useState } from "react";
// AnimatePresence still comes from motion/react — it is not a `motion.*` element
// and has no lazy-feature variant. Only the animated elements move to `m`.
import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Container, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Panel, PanelBar } from "@/components/ui/Panel";
import { Logo } from "@/components/brand/Logo";
import { MemoryCurve } from "@/components/visuals/Charts";
import { cn } from "@/lib/cn";
import { useOnScreen } from "@/lib/use-on-screen";

const EASE = [0.16, 1, 0.3, 1] as const;

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
 * accumulating across handoffs. `MemoryCurve` draws the handoff boundaries as
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
    fresh: { tag: "Deal", t: "Aramark renewal, locked 15% rate" },
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

/** The accrual series, derived from the same data the panel rotates through, so
 *  the curve and the counter can never disagree. */
const CURVE = STEPS.map((s) => ({ label: s.term, value: s.records }));

/* Each line is a mechanism, not a restatement of the heading. */
const AFFIRMATIONS = [
  "The next holder shadows the seat before their term starts — read-only, knowledge cards included",
  "The outgoing holder becomes alumni: the record stays on the seat, the access does not",
  "Tenure AI answers from that record, with its sources linked",
];

/** The three states, stated once for the whole site. */
const LIFECYCLE: { label: string; when: string; tone: "shadow" | "active" | "alumni" }[] = [
  { label: "Shadow", when: "before the term — read-only", tone: "shadow" },
  { label: "Active", when: "during it — the same access, now write", tone: "active" },
  { label: "Alumni", when: "after it — record stays, access does not", tone: "alumni" },
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
          "flex h-7 w-7 items-center justify-center rounded-full font-mono text-[0.6rem] font-semibold",
          TONE[status],
        )}
      >
        {initials}
      </span>
      <span
        className={cn(
          "flex-1 text-[0.82rem] font-medium",
          status === "alumni" ? "text-ink-faint" : "text-ink",
        )}
      >
        {name}
      </span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-wide",
          TONE[status],
        )}
      >
        {status}
      </span>
    </div>
  );
}

export function SeatMechanism() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const { ref: sectionRef, onScreen } = useOnScreen<HTMLDivElement>();
  const step = STEPS[i];

  // Gated on visibility as well as reduced motion and hover. This had no viewport
  // check and — unlike DashboardMock — not even a backgrounded-tab check, so it
  // re-rendered the section and restarted a digit animation every 3.4 seconds for
  // the life of the page. Measured at roughly 615 ms of style and layout.
  useEffect(() => {
    if (reduce || paused || !onScreen) return;
    const id = setInterval(() => setI((v) => (v + 1) % STEPS.length), 3400);
    return () => clearInterval(id);
  }, [reduce, paused, onScreen]);

  return (
    <LazyMotion features={domAnimation} strict>
      <Section tone="canvas" backdrop="quiet" className="lg:pb-24">
        <Container>
          <div
            ref={sectionRef}
            className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14"
          >
            {/* LEFT, the thesis */}
            <div className="max-w-xl lg:pt-4">
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
                    <span className="text-[0.96rem] leading-relaxed text-ink-soft">{a}</span>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* RIGHT, the living seat: one panel, three regions */}
            <Reveal delay={0.08}>
              <Panel
                className="relative"
                // Hover pause is a convenience, not the accessible control: the
                // button in the bar below is what WCAG 2.2.2 requires.
              >
                <div
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  <PanelBar
                    icon={
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M6 19v-3M18 19v-3M5 16h14M7 16v-5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5M9 9V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    }
                    title="VP Finance & Operations"
                    meta="durable seat · SCC-VP-FINA-OPER"
                    aside={
                      <div className="flex items-center gap-1.5">
                        {/* WCAG 2.2.2: this rotated every 3.4s and could only be
                            paused with a mouse. */}
                        {!reduce && (
                          <button
                            type="button"
                            onClick={() => setPaused((v) => !v)}
                            aria-pressed={paused}
                            aria-label={
                              paused
                                ? "Resume the term walkthrough"
                                : "Pause the term walkthrough"
                            }
                            className="mr-1 inline-flex h-6 min-w-6 items-center justify-center rounded-md font-mono text-[0.66rem] text-text-secondary hover:text-ink"
                          >
                            {paused ? "▶" : "⏸"}
                          </button>
                        )}
                        {STEPS.map((s, idx) => (
                          <button
                            key={s.term}
                            type="button"
                            aria-label={`Term ${s.term}`}
                            aria-pressed={idx === i}
                            onClick={() => {
                              setI(idx);
                              setPaused(true);
                            }}
                            // The dot stays 6px; the TARGET is 24x24. These
                            // measured 6x6 CSS px against the WCAG 2.2 SC 2.5.8
                            // minimum, the smallest controls on the site.
                            className="group/dot flex h-6 min-w-6 items-center justify-center"
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "block h-1.5 rounded-full transition-all",
                                idx === i
                                  ? "w-6 bg-grove"
                                  : "w-1.5 bg-line group-hover/dot:bg-grove/40",
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    }
                  />

                  <div className="p-4 sm:p-5">
                    {/* occupant timeline */}
                    <div className="flex items-baseline justify-between">
                      <p className="label-mono text-[0.56rem]">
                        Occupant · term {step.term}
                      </p>
                      <span className="font-mono text-[0.62rem] text-ink-faint">
                        the person rotates ↻
                      </span>
                    </div>
                    <AnimatePresence mode="wait">
                      <m.div
                        key={step.term}
                        className="mt-2.5 space-y-2"
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                      >
                        <Occupant name={step.active} status="active" />
                        <Occupant name={step.shadow} status="shadow" />
                        {step.alumni.slice(-1).map((a) => (
                          <Occupant key={a} name={a} status="alumni" />
                        ))}
                        {step.alumni.length > 1 && (
                          <p className="pl-1 font-mono text-[0.6rem] text-ink-faint">
                            + {step.alumni.length - 1} more alumni on this seat
                          </p>
                        )}
                      </m.div>
                    </AnimatePresence>

                    {/* The lifecycle legend. Absorbed from Handoff's "Shadow
                        access" block, which said the same three things in three
                        cards under a headline AiOnboarding also used verbatim. */}
                    <dl className="mt-3 space-y-1 border-t border-line pt-3">
                      {LIFECYCLE.map((l) => (
                        <div key={l.label} className="flex items-baseline gap-2">
                          <dt
                            className={cn(
                              "w-16 shrink-0 rounded-md px-1.5 py-0.5 text-center font-mono text-[0.54rem] font-medium uppercase tracking-wide",
                              TONE[l.tone],
                            )}
                          >
                            {l.label}
                          </dt>
                          <dd className="text-[0.74rem] leading-relaxed text-ink-soft">
                            {l.when}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {/* the accruing record */}
                    <div className="mt-4 rounded-2xl border border-grove/20 bg-grove-mist/60 p-3.5">
                      <div className="flex items-baseline justify-between">
                        <p className="label-mono text-[0.56rem] text-grove-deep">
                          Institutional memory on this seat
                        </p>
                        <p className="font-display text-xl font-semibold tnum text-grove-deep">
                          {step.records}
                        </p>
                      </div>
                      <p className="text-[0.66rem] text-ink-soft">
                        records, carried across every handoff
                      </p>
                      <MemoryCurve points={CURVE} className="mt-2" />
                      {/* popLayout is safe under domAnimation: PopChild measures in
                          getSnapshotBeforeUpdate and injects an absolute-positioning
                          rule rather than using layout projection. Verified in the
                          installed source, not assumed. */}
                      <AnimatePresence mode="popLayout">
                        <m.div
                          key={step.fresh.t}
                          className="mt-2 flex items-center gap-2 rounded-lg border border-grove/25 bg-cloud px-2.5 py-1.5"
                          initial={reduce ? false : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={reduce ? undefined : { opacity: 0, x: 10 }}
                          transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                        >
                          <span className="rounded border border-grove/25 bg-grove-soft px-1 py-0.5 font-mono text-[0.5rem] uppercase text-grove-deep">
                            + {step.fresh.tag}
                          </span>
                          <span className="text-[0.72rem] text-ink">{step.fresh.t}</span>
                        </m.div>
                      </AnimatePresence>
                    </div>

                    {/* ask this seat */}
                    <div className="mt-3 rounded-2xl border border-line bg-surface-subtle p-3.5">
                      <div className="flex items-center gap-2">
                        <Logo className="h-4 w-4 text-grove" />
                        {/* Not "ask anything": C-007 limits retrieval to five record kinds. */}
                        <span className="text-[0.74rem] font-semibold text-ink">
                          Ask this seat
                        </span>
                      </div>
                      {/*
                        A keyword query, not a sentence. This read "Who did we use
                        for catering, and why did we switch?" — eleven terms, and
                        search.ts:39 requires EVERY one of them to appear literally
                        in a single record ("who", "did", "we", "and" included), with
                        no stemming or stopword removal. In practice it returns
                        nothing, and with zero sources the route never calls the
                        model at all.
                      */}
                      <p className="mt-2 rounded-xl rounded-br-sm bg-cloud px-3 py-2 text-[0.78rem] text-ink-soft ring-1 ring-line">
                        catering vendor
                      </p>
                      <p className="mt-2 rounded-xl rounded-bl-sm bg-grove-soft/70 px-3 py-2 text-[0.78rem] leading-relaxed text-ink">
                        Prestige Catering. Marcus renegotiated after the &rsquo;25 gala
                        ran over &mdash; the vendor card and the approval behind it are
                        attached.
                        <span className="ml-1 whitespace-nowrap font-mono text-[0.6rem] text-grove-deep">
                          3 sources ↗
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Panel>
            </Reveal>
          </div>
        </Container>
      </Section>
    </LazyMotion>
  );
}
