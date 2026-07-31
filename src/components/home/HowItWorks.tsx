import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";

type Step = {
  n: string;
  title: string;
  body: string;
  icon: ReactNode;
};

/** Honest, real sequence, the work becomes the record, the record onboards the next leader. */
const STEPS: Step[] = [
  {
    n: "01",
    title: "Run it in Tenure",
    body: "Finances, events, members, and decisions get logged as the work happens, no separate wiki anyone has to remember to update.",
    icon: (
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
        <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
        <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "It stays with the seat",
    body: "Knowledge belongs to the role, not the person who held it, so nothing walks out the door at term’s end.",
    icon: (
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
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "The next leader inherits it",
    body: "They open a handoff packet assembled from the record itself, current the day they arrive, then ask Tenure AI about anything in it.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
      </svg>
    ),
  },
];

function Connector() {
  return (
    <span
      aria-hidden
      className="absolute -right-6 top-[3.1rem] hidden -translate-y-1/2 text-line lg:block"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 3l5 5-5 5" />
      </svg>
    </span>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative scroll-mt-24 border-t border-line bg-sand py-24 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">How it works</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
              The role remembers, so the person{" "}
              <span className="text-grove">doesn&rsquo;t have to</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 text-lg leading-relaxed text-ink-soft">
              Tenure isn&rsquo;t a binder someone hands over on their way out.
              The work itself becomes the record, so every transition starts
              from everything that came before, not a blank page.
            </p>
          </Reveal>
        </div>

        <ul className="relative mt-14 grid gap-8 sm:mt-16 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.n}
              delay={0.06 * i}
              className="relative"
            >
              <div className="h-full rounded-2xl border border-line bg-cloud p-7 shadow-[0_1px_2px_rgba(12,30,51,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(12,30,51,0.25)]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-grove-soft font-mono text-[0.9rem] font-semibold text-grove-deep">
                    {step.n}
                  </span>
                  <span className="text-grove/70">{step.icon}</span>
                </div>

                <h3 className="mt-6 text-lg font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>

              {i < STEPS.length - 1 && <Connector />}
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
