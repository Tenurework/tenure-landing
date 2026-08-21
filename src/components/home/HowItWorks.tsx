import type { ReactNode } from "react";
import { Container, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Panel, PanelBar, PanelTag } from "@/components/ui/Panel";

/**
 * How a handoff actually works, in three moves.
 *
 * WAS: three bordered cards in a row, each with a number badge, an icon, a
 * heading and a paragraph — 832px to carry sixty words. The cards were doing no
 * work: three steps in sequence are a sequence, and a row of equal boxes is the
 * one arrangement that hides the fact that step 2 follows step 1.
 *
 * NOW: one panel, three rows, with the connector drawn between them. Same three
 * steps, roughly half the height, and the order is visible rather than implied
 * by reading direction.
 */

type Step = { n: string; title: string; body: string; icon: ReactNode };

const svg = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Run it in Tenure",
    body: "Finances, events, members and decisions are logged as the work happens — no separate wiki anyone has to remember to update.",
    icon: (
      <svg {...svg}>
        <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
        <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "It stays with the seat",
    body: "Knowledge belongs to the role, not to the person who held it, so nothing walks out of the door at the end of a term.",
    icon: (
      <svg {...svg}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "The next holder inherits it",
    body: "They open a handoff packet assembled from the record itself, current the day they arrive, and search the seat for whatever it does not answer.",
    icon: (
      <svg {...svg}>
        <path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <Section id="how" tone="subtle" backdrop="grid">
      <Container>
        <SectionHead
          align="center"
          eyebrow="How it works"
          title={
            <>
              The role remembers, so the person{" "}
              <span className="text-grove">doesn&rsquo;t have to</span>.
            </>
          }
          lead="Tenure is not a binder someone hands over on their way out. The work itself becomes the record, so every transition starts from everything that came before rather than from a blank page."
        />

        <Reveal delay={0.12} className="mt-7">
          <Panel className="mx-auto max-w-3xl">
            <PanelBar
              title="One cycle, three moves"
              meta="the same loop whether the term is a year or a resignation"
              aside={<PanelTag>no handoff document</PanelTag>}
            />
            <ol>
              {STEPS.map((step, i) => (
                <li
                  key={step.n}
                  className="relative flex gap-4 border-b border-line-soft px-5 py-4 last:border-b-0 sm:px-6"
                >
                  <div className="flex flex-col items-center">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-grove-soft text-grove-deep">
                      {step.icon}
                    </span>
                    {/* The connector. Drawn between the rows rather than beside
                        them, so the sequence is a property of the layout and not
                        something the reader has to infer from three numbers. */}
                    {i < STEPS.length - 1 && (
                      <span aria-hidden className="mt-2 w-px flex-1 bg-line" />
                    )}
                  </div>
                  <div className="pb-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-display text-lead font-semibold text-ink">
                        {step.title}
                      </h3>
                      <span className="label-mono text-mark">{step.n}</span>
                    </div>
                    <p className="mt-1.5 text-body leading-relaxed text-ink-soft measure">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </Reveal>
      </Container>
    </Section>
  );
}
