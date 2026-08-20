"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Container, SECTION_TIGHT, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Panel, PanelBar, PanelRail, PanelNote } from "@/components/ui/Panel";
import { RailList, type SegmentItem } from "@/components/ui/Segmented";
import { TierNest } from "@/components/visuals/Charts";
import { cn } from "@/lib/cn";

/**
 * WHAT THE OVERSEEING BODY GETS — one console, three panes.
 *
 * This section was three stacked surfaces and about 2,000px: a console mock, then
 * a three-card row for "Three staff levels / Sixteen named powers / Overrides on
 * the record", then a fourth bordered block for succession with its own eyebrow,
 * h3, paragraph, two-item list and three numbered steps. The console at the top
 * had a working sidebar with six sections in it — five of which did nothing,
 * because every one of the three cards below was describing a pane the sidebar
 * already listed.
 *
 * So the sidebar is now real. Three of its sections are selectable and carry the
 * content the cards used to: Overrides (the mock), Capabilities (the tier nest),
 * and Succession (the three steps). The section says the same six things in about
 * a third of the height, and the console reads as a console rather than as a
 * picture of one with an essay underneath.
 *
 * THE OVERRIDE IS THE HIGHEST-PRIVILEGE ACTION IN THE PRODUCT (C-037), and the
 * page has always drawn it. Its limit is stated here rather than left on /trust:
 * nothing prevents it and no second party is required — it must never be
 * described as constrained, only as audited.
 *
 * The heading is also no longer "not a login to everyone else's". The word
 * "office" stays because that is the pilot counterparty, but a nonprofit's
 * national body and an association's head office read the same pane, so the copy
 * names the function rather than the university department.
 */

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-4 w-4",
  "aria-hidden": true,
};

type PaneKey =
  | "overview"
  | "organizations"
  | "people"
  | "capabilities"
  | "overrides"
  | "succession";

/**
 * The six sections the console ships with — and every one of them opens.
 *
 * The first draft of this rewrite made three of the six inert: they rendered as
 * rail rows that looked exactly like the working ones and did nothing when
 * clicked. That is worse than the grid it replaced. A control that is styled as a
 * control has to be one, so all six carry a pane; three of them are three lines
 * long, which is the honest amount there is to say about them here.
 */
const NAV: (SegmentItem & { pane: PaneKey })[] = [
  {
    key: "overview",
    label: "Overview",
    pane: "overview",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
      </svg>
    ),
  },
  {
    key: "organizations",
    label: "Organizations",
    pane: "organizations",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="8.5" width="7.5" height="12" rx="1.6" />
        <rect x="13" y="4" width="7.5" height="16.5" rx="1.6" />
        <path d="M6 12h2.5M6 15.5h2.5M15.5 8h2.5M15.5 11.5h2.5M15.5 15h2.5" />
      </svg>
    ),
  },
  {
    key: "people",
    label: "People",
    pane: "people",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="5" width="17" height="14" rx="2.2" />
        <rect x="6.5" y="8" width="4.5" height="4.5" rx="1.2" />
        <path d="M14 9h3.5M14 12h2.5M6.75 15.5h10.75" />
      </svg>
    ),
  },
  {
    key: "capabilities",
    label: "Capabilities",
    pane: "capabilities",
    icon: (
      <svg {...svg}>
        <path d="M12 3.5l8 4-8 4-8-4z" />
        <path d="M4 11.5l8 4 8-4M4 15.5l8 4 8-4" />
      </svg>
    ),
  },
  {
    key: "overrides",
    label: "Overrides",
    pane: "overrides",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="6" width="17" height="4.5" rx="2.25" />
        <rect x="3.5" y="13.5" width="17" height="4.5" rx="2.25" />
        <path d="M8.5 6v4.5M15.5 13.5v4.5" />
      </svg>
    ),
  },
  {
    key: "succession",
    label: "Succession",
    pane: "succession",
    icon: (
      <svg {...svg}>
        <path d="M4 7h9M13 4l3 3-3 3" />
        <path d="M20 17h-9M11 14l-3 3 3 3" />
      </svg>
    ),
  },
];

const CHIP = {
  held: "bg-grove-soft text-grove-deep",
  pending: "bg-warning-subtle text-warning",
  done: "bg-grove text-on-accent",
} as const;

const SUCCESSION: {
  n: string;
  title: string;
  chip: string;
  tone: keyof typeof CHIP;
  body: string;
}[] = [
  {
    n: "01",
    title: "You name a successor",
    chip: "Authority held",
    tone: "held",
    body: "Nothing moves yet. You keep every capability you had a moment ago.",
  },
  {
    n: "02",
    title: "They accept",
    chip: "Awaiting accept",
    tone: "pending",
    body: "No transfer exists until they do. There is no window where nobody can approve.",
  },
  {
    n: "03",
    title: "One move, both sides",
    chip: "Transferred",
    tone: "done",
    body: "The grant and the step-down commit together, in one transaction. No shared password, no account handed down.",
  },
];

function Pane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-title-sm font-semibold text-ink">{label}</h3>
        <span className="label-mono text-mark-xs">institution-wide</span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/** A compact row of the shape the console's list views use. */
function Row({
  title,
  meta,
  tag,
  tone = "quiet",
}: {
  title: string;
  meta: string;
  tag: string;
  tone?: "quiet" | "warn" | "good";
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg border border-line bg-paper/50 px-3 py-2">
      <span className="min-w-0">
        <span className="block truncate text-body-sm text-ink">{title}</span>
        <span className="block font-mono text-mark text-ink-faint">{meta}</span>
      </span>
      <span
        className={cn(
          "shrink-0 rounded-md px-2 py-0.5 font-mono text-mark-xs font-medium uppercase tracking-wide",
          tone === "good" && "bg-grove-soft text-grove-deep",
          tone === "warn" && "bg-warning-subtle text-warning",
          tone === "quiet" && "bg-surface-subtle text-text-secondary",
        )}
      >
        {tag}
      </span>
    </li>
  );
}

export function OfficeConsole() {
  const [active, setActive] = useState<string>("overrides");
  const pane: PaneKey = NAV.find((n) => n.key === active)?.pane ?? "overrides";

  return (
    <Section from="band" tone="surface" backdrop="grid" space={SECTION_TIGHT}>
      <Container>
        <SectionHead
          align="center"
          eyebrow="Oversight"
          title={
            <>
              The office gets its own system, not a login to{" "}
              <span className="text-gradient">everyone else&rsquo;s</span>.
            </>
          }
          lead="Every organization you steward on one screen: who holds which seat, what is pending, what got denied — and a console whose navigation is derived from the capabilities your own seat actually holds."
        />

        <Reveal delay={0.14} className="mt-7">
          <Panel>
            <PanelBar
              title="Administration console"
              meta="Office of Student Engagement · worked example"
              aside={
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-cloud px-2.5 py-1 font-mono text-mark text-ink-faint">
                  signed in as Director
                </span>
              }
            />

            <div className="grid md:grid-cols-[13.5rem_1fr]">
              <PanelRail label="Sections">
                <RailList
                  label="Console sections"
                  items={NAV}
                  active={active}
                  onSelect={setActive}
                />
              </PanelRail>

              {/* min-h from the tallest pane, so switching does not jump the page. */}
              <div className="min-h-[19rem]">
                {pane === "overview" && (
                  <Pane label="Overview">
                    <p className="text-body leading-relaxed text-ink-soft">
                      What needs a decision, across every organization at once. The
                      queue is the home screen because it is the only thing an
                      overseeing body opens a console to see.
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      <Row
                        title="3 requests awaiting a decision"
                        meta="two sitting in this body’s own gate"
                        tag="6 days"
                        tone="warn"
                      />
                      <Row
                        title="2 deliverables due"
                        meta="published once, every organization sees them"
                        tag="in 6 days"
                        tone="quiet"
                      />
                      <Row
                        title="1 seat vacant on a rotating board"
                        meta="no shadow holder named yet"
                        tag="flagged"
                        tone="warn"
                      />
                    </ul>
                  </Pane>
                )}

                {pane === "organizations" && (
                  <Pane label="Organizations">
                    <p className="text-body leading-relaxed text-ink-soft">
                      Every organization on one record, with how much of its seat map
                      is actually filled &mdash; which is the number that predicts
                      whether a handoff will go well.
                    </p>
                    {/*
                      THE RATIO IS THE REAL ONE, AND IT USED TO BE INVERTED.

                      These three rows read 8/7, 12/12 and 6/6 — twenty-five of
                      twenty-six seats held, a portfolio with essentially nothing
                      wrong with it. The seeded roster this whole section is drawn
                      from is 209 seats with 106 filled and 103 VACANT (C-014's own
                      evidence line), so the mock showed the opposite of the
                      problem the product exists to solve, in the one pane whose
                      stated subject is "how much of its seat map is actually
                      filled". A reader who believed it would wonder what Tenure
                      was for.
                    */}
                    <ul className="mt-4 space-y-1.5">
                      <Row title="Student Culture Council" meta="8 seats · 4 held" tag="4 vacant" tone="warn" />
                      <Row title="Rochester Finance Club" meta="12 seats · 7 held" tag="5 vacant" tone="warn" />
                      <Row title="Consulting Association" meta="6 seats · 6 held" tag="complete" tone="good" />
                    </ul>
                  </Pane>
                )}

                {pane === "people" && (
                  <Pane label="People">
                    <p className="text-body leading-relaxed text-ink-soft">
                      People are listed by the seat they hold, not by an account.
                      Someone with no seat has no access, and someone who has left
                      appears here as alumni rather than disappearing.
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      <Row title="Dev Patel" meta="VP Finance & Operations · SCC" tag="active" tone="good" />
                      <Row title="Leah Cohen" meta="VP Sponsorship · SCC" tag="shadow" tone="warn" />
                      <Row title="Maya Chen" meta="VP Finance & Operations · 2024–25" tag="alumni" tone="quiet" />
                    </ul>
                  </Pane>
                )}

                {pane === "overrides" && (
                  <Pane label="Overrides">
                    <div className="well p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-body font-medium text-ink">
                            Spring Gala vendor contract
                          </p>
                          <p className="font-mono text-mark text-ink-faint">
                            $4,200 · Student Culture Council · SCC-VP-EVEN-PART
                          </p>
                        </div>
                        <span className="rounded-md bg-warning-subtle px-2 py-0.5 font-mono text-mark-xs font-medium text-warning">
                          6 days in gate 1
                        </span>
                      </div>
                      <div className="mt-3.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-lg border border-grove/30 bg-grove-soft px-2.5 py-1 font-mono text-mark font-medium text-grove-deep">
                          Force approve
                        </span>
                        <span className="rounded-lg border border-line bg-paper px-2.5 py-1 font-mono text-mark text-ink-soft">
                          Force reject
                        </span>
                        <span className="text-meta text-ink-faint">
                          both gates bypassed
                        </span>
                      </div>
                      <p className="mt-3 rounded-lg border border-line-dark bg-band px-2.5 py-1.5 font-mono text-mark leading-relaxed text-inverse/70">
                        <span className="text-grove-bright">approval.force_approved</span> ·
                        Director · allow
                      </p>
                    </div>
                    {/*
                      C-037's limit used to be restated here, beside the mock, in
                      full — "nothing prevents it and no second party is required".
                      It is set out control by control on Security, which is where
                      somebody assessing an override control is reading. Repeating
                      it under the illustration made the strongest governance
                      feature on the page read as a warning about itself.
                    */}
                  </Pane>
                )}

                {pane === "capabilities" && (
                  <Pane label="Capabilities">
                    <p className="text-body leading-relaxed text-ink-soft">
                      Sixteen named capabilities across three strictly nested tiers.
                      A director inherits everything staff can do, and staff
                      everything an advisor can do &mdash; so the tiers are drawn as
                      containment rather than as three separate bars.
                    </p>
                    <TierNest
                      className="mt-4"
                      tiers={[
                        { label: "Director", count: 16 },
                        { label: "Staff", count: 5 },
                        { label: "Advisor", count: 1 },
                      ]}
                    />
                    <p className="mt-3.5 text-caption leading-relaxed text-ink-faint">
                      Navigation follows the capabilities the signed-in seat holds,
                      so a reviewer is never shown a surface they cannot use. The
                      capability guard writes an audit row for the denial as well as
                      the allow.
                    </p>
                  </Pane>
                )}

                {pane === "succession" && (
                  <Pane label="Succession">
                    <p className="text-body leading-relaxed text-ink-soft">
                      The body above hands off too. You keep every power until your
                      named successor accepts.
                    </p>
                    <ol className="mt-4 space-y-2">
                      {SUCCESSION.map((s) => (
                        <li
                          key={s.n}
                          className="rounded-xl border border-line bg-paper/50 p-3.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-grove-soft font-mono text-meta font-semibold text-grove-deep">
                                {s.n}
                              </span>
                              <p className="text-body font-medium text-ink">
                                {s.title}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "shrink-0 rounded-md px-2 py-0.5 font-mono text-mark-xs font-medium uppercase tracking-wide",
                                CHIP[s.tone],
                              )}
                            >
                              {s.chip}
                            </span>
                          </div>
                          <p className="mt-2 text-body-sm leading-relaxed text-ink-soft">
                            {s.body}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </Pane>
                )}
              </div>
            </div>

            <PanelNote>
              Scope, capability tiers and the current limits of advisor access are
              set out control by control on{" "}
              <Link
                href="/trust"
                className="font-medium text-accent-text underline underline-offset-4 hover:text-accent"
              >
                Security
              </Link>
              .
            </PanelNote>
          </Panel>
        </Reveal>
      </Container>
    </Section>
  );
}
