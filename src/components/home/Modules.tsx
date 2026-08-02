import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionContour } from "@/components/visuals/SectionContour";

type Module = {
  name: string;
  tag: string;
  desc: string;
  icon: ReactNode;
};

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[22px] w-[22px]",
  "aria-hidden": true,
};

const MODULES: Module[] = [
  {
    name: "Finance",
    tag: "Money in & out",
    desc: "Budgets, reimbursements, and a clear record of what everything actually cost.",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="11" width="4" height="9" rx="1" />
        <rect x="10" y="5" width="4" height="15" rx="1" />
        <rect x="16.5" y="14" width="4" height="6" rx="1" />
      </svg>
    ),
  },
  {
    name: "Events",
    tag: "On the calendar",
    desc: "Planning, vendors, and run-of-show, every detail in one place, not a group chat.",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M3.5 9.5h17" />
        <path d="M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    name: "Members",
    tag: "Who's who",
    desc: "Roster, roles, and contacts, so you always know who does what and who to reach.",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
        <rect x="6.5" y="8" width="4.5" height="4.5" rx="1.2" />
        <path d="M14 9h3.5M14 12h2.5M6.75 15.5h10.75" />
      </svg>
    ),
  },
  {
    name: "Documents",
    tag: "Files & contracts",
    desc: "Files, contracts, and signed agreements, filed where the next person will find them.",
    icon: (
      <svg {...svg}>
        <path d="M13 3.5H6.75A1.25 1.25 0 0 0 5.5 4.75v14.5A1.25 1.25 0 0 0 6.75 20.5h10.5a1.25 1.25 0 0 0 1.25-1.25V9z" />
        <path d="M13 3.5V9h5.5" />
        <path d="M8.5 13h7M8.5 16h4.5" />
      </svg>
    ),
  },
  {
    name: "Memory",
    tag: "The record",
    desc: "The institutional record, decisions, context, and know-how that survives every turnover.",
    icon: (
      <svg {...svg}>
        <path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8z" />
        <path d="M3.5 12l8.5 4.5 8.5-4.5" />
        <path d="M3.5 15.5l8.5 4.5 8.5-4.5" />
      </svg>
    ),
  },
  {
    name: "Approvals & oversight",
    tag: "Who signs off",
    desc: "Seven kinds of request, two gates, president then office, and every decision names the seat that made it.",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="4" width="17" height="6.5" rx="2" />
        <rect x="3.5" y="13.5" width="17" height="6.5" rx="2" />
        <path d="M7 7.2l1.3 1.3L11 5.9" />
        <path d="M7 16.7l1.3 1.3L11 15.4" />
      </svg>
    ),
  },
  {
    name: "Deliverables & deadlines",
    tag: "What's due",
    desc: "The office publishes a deadline once, it reaches every org, and the seat that owns it gets reminded.",
    icon: (
      <svg {...svg}>
        <path d="M9.5 4.75H7.25A1.25 1.25 0 0 0 6 6v13.25a1.25 1.25 0 0 0 1.25 1.25h9.5A1.25 1.25 0 0 0 18 19.25V6a1.25 1.25 0 0 0-1.25-1.25H14.5" />
        <rect x="9.5" y="3" width="5" height="3.5" rx="1.2" />
        <path d="M9 13l2 2 4-4.5" />
      </svg>
    ),
  },
  {
    name: "Administration console",
    tag: "For the office",
    desc: "Every organization the office stewards in one place, what's pending, what's vacant, what got denied.",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9h17" />
        <path d="M9.5 9v10.5" />
        <path d="M12.75 12.5h5M12.75 15.5h3" />
      </svg>
    ),
  },
  {
    name: "Tenure AI",
    tag: "Ask anything",
    desc: "Ask anything about the role and get a sourced answer, onboarding in days, not a semester.",
    icon: (
      <svg {...svg}>
        <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z" />
        <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
      </svg>
    ),
  },
];

export function Modules() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-sand py-24 sm:py-32">
      <SectionContour place="tr" seed={2} className="text-grove/[0.07]" />
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">One system</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
              Everything the organization runs on, in{" "}
              <span className="text-grove">one place</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 text-lg leading-relaxed text-ink-soft">
              Finance, events, members, documents, approvals, the operations a
              club or office juggles across spreadsheets, inboxes, and a dozen
              logins, unified into one record that every transition inherits.
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <Reveal as="li" key={m.name} delay={i * 0.05}>
              <article className="h-full rounded-2xl border border-line bg-cloud p-6 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-grove-soft text-grove">
                    {m.icon}
                  </span>
                  <span className="label-mono">{m.tag}</span>
                </div>
                <h3 className="mt-5 text-[1.05rem] font-medium text-ink">
                  {m.name}
                </h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">
                  {m.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
