import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionContour } from "@/components/visuals/SectionContour";

/* What today's cold handoff costs. Three rows, not four: "weeks of ramp before
   anyone is useful" was the paragraph's "spends a semester relearning" again,
   and disagreed with it on the duration. No vendor is named — a shared drive
   folder is the habit, not a connector (C-029). */
const lost = [
  "A cold handoff through a shared folder",
  "Sponsors and vendors go quiet",
  "The same mistakes repeat every year",
];

/* What the seat keeps, answering each loss in order. "The next leader is
   productive in days" was an outcome nothing measures; shadow access before the
   term starts is the mechanism that was meant by it. */
const kept = [
  "A handoff packet assembled from the record",
  "Vendors, contacts and deals stay on the seat",
  "The next leader reads the seat before day one",
];

function CrossMark() {
  return (
    <span
      aria-hidden
      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] bg-brand-coral/90 text-on-accent"
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path
          d="M3 3l6 6M9 3l-6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function CheckMark() {
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
    <section className="relative isolate overflow-hidden border-t border-line bg-sand py-24 sm:py-32">
      <SectionContour place="bl" seed={5} className="text-ink/[0.06]" />
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>The cost of turnover</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
              When a leader leaves, the org pays for it{" "}
              <span className="text-grove">twice</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              A year of relationships, vendor deals, budgets and playbooks walks
              out the door, and the next person spends a semester relearning what
              the org already knew.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {/* Without Tenure, the cold handoff. */}
          <Reveal delay={0.16}>
            <div className="h-full rounded-2xl border border-line bg-cloud p-6 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-7">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
                  Without Tenure
                </h3>
                <span className="label-mono text-brand-coral">The handoff today</span>
              </div>
              <ul className="mt-6 space-y-3.5">
                {lost.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.97rem] leading-relaxed text-ink-faint"
                  >
                    <CrossMark />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* With Tenure, the seat remembers. */}
          <Reveal delay={0.22}>
            <div className="h-full rounded-2xl border border-grove/25 bg-cloud p-6 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_color-mix(in_oklab,var(--accent)_28%,transparent)] sm:p-7">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
                  With Tenure
                </h3>
                <span className="label-mono text-grove">The seat remembers</span>
              </div>
              <ul className="mt-6 space-y-3.5">
                {kept.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.97rem] leading-relaxed text-ink"
                  >
                    <CheckMark />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
