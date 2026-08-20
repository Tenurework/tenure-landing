"use client";

import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- Finance: a budget that fills + a reimbursement that approves ---- */
function FinanceCard() {
  const reduce = useReducedMotion();
  return (
    <div className="rounded-2xl border border-line bg-cloud p-5 shadow-[var(--shadow-lg)]">
      <div className="flex items-center justify-between">
        <p className="label-mono text-mark">Finance · fall</p>
        <span className="rounded-md bg-grove-soft px-2 py-0.5 font-mono text-mark text-grove-deep">
          live
        </span>
      </div>
      <p className="mt-3 font-mono text-h3 font-semibold text-ink">
        $12,400{" "}
        <span className="text-body-sm font-normal text-text-secondary">/ $18,000</span>
      </p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
        <m.div
          className="h-full rounded-full bg-grove"
          initial={{ width: "0%" }}
          whileInView={{ width: "69%" }}
          viewport={{ once: true, margin: "-40px" }}
          transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE, delay: 0.2 }}
        />
      </div>

      <div className="mt-5 space-y-2">
        {[
          { who: "Print order, D. Reyes", amt: "$240" },
          { who: "Gala venue deposit", amt: "$1,500" },
        ].map((r) => (
          <div
            key={r.who}
            className="flex items-center justify-between rounded-lg border border-line bg-surface-subtle px-3 py-2 text-caption"
          >
            <span className="text-ink-soft">{r.who}</span>
            <span className="flex items-center gap-2">
              <span className="font-mono text-ink">{r.amt}</span>
              {/*
                Static. This was a Pending -> Approved crossfade, and it
                produced an accessibility defect in three successive forms:
                first as an infinite loop putting both labels below AA forever,
                then as a one-shot that left the incoming label invisible
                without JavaScript, then as one that left the outgoing label
                invisible under reduced motion.

                It was decoration. The row already shows a cleared
                reimbursement, and the approval mechanism is explained in words
                elsewhere on the page. Motion should explain a state change, not
                be a permanent tax — so this one is gone.
              */}
              <span className="flex h-[1.15rem] w-[4.6rem] items-center justify-center rounded-full bg-grove-soft text-mark font-medium text-grove-deep">
                Approved
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Handoff: a record crosses from the outgoing term to the next ---- */
function HandoffCard() {
  const reduce = useReducedMotion();
  return (
    <div className="rounded-2xl border border-line bg-cloud p-5 shadow-[var(--shadow-lg)]">
      <div className="flex items-center justify-between">
        <p className="label-mono text-mark">Term handoff</p>
        <span className="font-mono text-mark text-text-secondary">2024–25 → 2025–26</span>
      </div>

      <div className="relative mt-4 h-40">
        <Zone className="left-0" label="Outgoing" dim />
        <Zone className="right-0" label="Incoming" />

        {/* The trace the record leaves behind. Without it the OUTGOING zone rests
            as an empty dashed rectangle — 29% of the card showing nothing, which
            reads as a diagram that failed to render rather than as a handoff that
            completed. It also states the actual mechanism: the seat keeps its
            history, so the outgoing term is not blanked. */}
        <div className="absolute bottom-3 left-[3.5%] z-0 w-[40%] rounded-lg border border-dashed border-line bg-paper/40 p-2">
          <div className="flex items-center gap-1.5">
            <span className="rounded border border-line bg-cloud px-1 py-0.5 font-mono text-mark-xs uppercase text-text-secondary">
              Kept
            </span>
            <span className="truncate text-meta text-text-secondary">
              Halden Catering &middot; on the seat
            </span>
          </div>
        </div>

        {/* a record already inherited, so the incoming side is never empty */}
        <div className="absolute bottom-3 right-[3.5%] z-0 w-[40%] rounded-lg border border-line bg-paper/70 p-2">
          <div className="flex items-center gap-1.5">
            <span className="rounded border border-line bg-cloud px-1 py-0.5 font-mono text-mark-xs uppercase text-text-secondary">
              Lead
            </span>
            <span className="truncate text-meta text-ink-soft">Wegmans · ’24</span>
          </div>
        </div>

        {/*
          Moves once and stays. This used to run `opacity: [0,1,1,1,0]` on an
          infinite loop, so the card’s text was fully transparent — and below
          WCAG AA — for part of every cycle, forever. Contrast applies to text
          as presented, so a permanent fade loop is a permanent contrast
          failure, not a rendering detail.

          The handoff it illustrates is carried by the two zones and the card’s
          final position; the fade was decoration bought with legibility.
        */}
        <m.div
          className="absolute top-12 z-10 w-[44%] rounded-xl border border-grove/30 bg-cloud p-2.5 shadow-[var(--shadow-lg)]"
          initial={{ left: "4%", opacity: 1 }}
          whileInView={{ left: "52%", opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={reduce ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="flex items-center gap-1.5">
            {/* "Vendor", not "Deal". The seven creatable knowledge-card kinds are
                enforced from the product enum (claims.ts creatableCardTypes) and
                rendered on this same page; "Deal" is not one of them, so a card
                tagged with it was a kind the product cannot make. */}
            <span className="rounded border border-grove/30 bg-grove-soft px-1 py-0.5 font-mono text-mark-xs uppercase text-grove-deep">
              Vendor
            </span>
            <span className="text-meta text-ink">Halden Catering renewal</span>
          </div>
          <p className="mt-1 font-mono text-mark text-text-secondary">$4,000 · Maya ’24</p>
        </m.div>
      </div>
    </div>
  );
}

function Zone({
  className,
  label,
  dim,
}: {
  className?: string;
  label: string;
  dim?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute top-0 h-full w-[46%] rounded-xl border border-dashed border-line p-2.5",
        dim && "[&_*]:text-text-secondary",
        className,
      )}
    >
      <p className="font-mono text-mark-xs uppercase tracking-[0.14em] text-text-secondary">
        {label}
      </p>
    </div>
  );
}

type Feature = { eyebrow: string; title: ReactNode; body: string; visual: ReactNode };

const FEATURES: Feature[] = [
  {
    eyebrow: "Finance",
    title: (
      <>
        Every dollar, tracked and <span className="text-grove">approved in place</span>.
      </>
    ),
    body: "Budgets, allocations, and reimbursements live in one ledger. Officers request, leadership approves, and the whole history stays with the role, so next year’s treasurer sees exactly what things cost and who signed off.",
    visual: <FinanceCard />,
  },
  {
    eyebrow: "The handoff",
    title: (
      <>
        Records cross the term with their <span className="text-grove">history intact</span>.
      </>
    ),
    body: "When leadership rotates, the work doesn’t reset. Deals, contacts, and playbooks move to the incoming board with the context that made them matter, who built them, what they cost, and why.",
    visual: <HandoffCard />,
  },
];

export function ProductAtWork() {
  return (
    // One provider at the section root covers both m.div usages, which live in the
    // FinanceCard and handoff sub-components below. `strict` throws on any missed
    // motion.* — see the note in HeroShapes.tsx for why this file no longer imports
    // the full-feature `motion` proxy.
    <LazyMotion features={domAnimation} strict>
    <Section tone="canvas" backdrop="quiet" backdropSeed={10}>
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Tenure at work</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-5 text-h2 font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-display-sm lg:text-display-sm">
              Not a pitch deck. The mechanics,{" "}
              <span className="text-grove">exactly as they work</span>.
            </h2>
          </Reveal>
          {/*
            The heading previously read "The system, actually running" directly
            above two hand-drawn React illustrations, and a reviewer called that
            what it was. The behaviour depicted is real; the surfaces are not
            screenshots, and the page now says so before anyone has to ask.
            Replacing this with genuine screen captures of the seeded
            environment is a content deliverable, not a code change.
          */}
          <Reveal delay={0.1}>
            <p className="mt-5 text-body leading-relaxed text-ink-soft">
              The two panels below are illustrations, not screenshots. They draw
              behaviour the product really has — the ledger, the approval step,
              the record crossing a term — rather than showing captured screens.
              Ask for a walkthrough and you see the running application instead.
            </p>
          </Reveal>
        </div>

        <div className="mt-7 space-y-10 sm:space-y-12">
          {FEATURES.map((f, i) => (
            <div
              key={f.eyebrow}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
            >
              <Reveal className={cn(i % 2 === 1 && "lg:order-2")}>
                <Eyebrow>{f.eyebrow}</Eyebrow>
                <h3 className="font-display mt-4 text-h3 font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-h2">
                  {f.title}
                </h3>
                <p className="mt-4 text-title-sm leading-relaxed text-ink-soft">{f.body}</p>
              </Reveal>
              <Reveal delay={0.1} className={cn(i % 2 === 1 && "lg:order-1")}>
                {f.visual}
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </Section>
    </LazyMotion>
  );
}
