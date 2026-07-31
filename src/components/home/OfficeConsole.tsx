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

const svgSm = { ...svg, className: "h-4 w-4" };

type Nav = { label: string; badge?: string; icon: ReactNode };

/** The six sections the console actually ships with. */
const NAV: Nav[] = [
  {
    label: "Overview",
    icon: (
      <svg {...svgSm}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
      </svg>
    ),
  },
  {
    label: "Clubs",
    icon: (
      <svg {...svgSm}>
        <rect x="3.5" y="8.5" width="7.5" height="12" rx="1.6" />
        <rect x="13" y="4" width="7.5" height="16.5" rx="1.6" />
        <path d="M6 12h2.5M6 15.5h2.5M15.5 8h2.5M15.5 11.5h2.5M15.5 15h2.5" />
      </svg>
    ),
  },
  {
    label: "People",
    icon: (
      <svg {...svgSm}>
        <rect x="3.5" y="5" width="17" height="14" rx="2.2" />
        <rect x="6.5" y="8" width="4.5" height="4.5" rx="1.2" />
        <path d="M14 9h3.5M14 12h2.5M6.75 15.5h10.75" />
      </svg>
    ),
  },
  {
    label: "Approvals",
    badge: "3",
    icon: (
      <svg {...svgSm}>
        <rect x="3.5" y="4" width="17" height="6.5" rx="2" />
        <rect x="3.5" y="13.5" width="17" height="6.5" rx="2" />
        <path d="M7 7.2l1.3 1.3L11 5.9" />
      </svg>
    ),
  },
  {
    label: "Overrides",
    icon: (
      <svg {...svgSm}>
        <rect x="3.5" y="6" width="17" height="4.5" rx="2.25" />
        <rect x="3.5" y="13.5" width="17" height="4.5" rx="2.25" />
        <path d="M8.5 6v4.5M15.5 13.5v4.5" />
      </svg>
    ),
  },
  {
    label: "Audit",
    icon: (
      <svg {...svgSm}>
        <rect x="4" y="4" width="16" height="16" rx="2.2" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    ),
  },
];

type Power = { title: string; body: string; chips: string[]; icon: ReactNode };

const POWERS: Power[] = [
  {
    title: "Three staff levels",
    body: "A director inherits everything staff can do, and staff inherit everything an advisor can do. So an advisor sees advising and a director sees everything, without anybody maintaining a permissions spreadsheet.",
    chips: ["Advisor", "Staff", "Director"],
    icon: (
      <svg {...svg}>
        <path d="M12 3.5l8 4-8 4-8-4z" />
        <path d="M4 11.5l8 4 8-4M4 15.5l8 4 8-4" />
      </svg>
    ),
  },
  {
    title: "Sixteen named powers",
    body: "Publish or cancel an event, archive or restore a document or a memory card, adjust a budget, read the audit log. The console builds its own navigation from those powers, so nobody is shown a tab that would only turn them away.",
    chips: ["16 powers", "capability-derived nav"],
    icon: (
      <svg {...svg}>
        <path d="M14.5 4.5l5 5-8.5 8.5H6v-5z" />
        <path d="M12.5 6.5l5 5M4.5 20.5h6" />
      </svg>
    ),
  },
  {
    title: "Overrides, on the record",
    body: "Force-approve and force-reject work institution-wide and bypass both gates. Then they land in the audit log exactly like every other action, naming the seat that used them and when.",
    chips: ["force approve", "force reject", "audited"],
    icon: (
      <svg {...svg}>
        <path d="M12 3.5l8 3v6c0 4-3.2 6.8-8 9-4.8-2.2-8-5-8-9v-6z" />
        <path d="M12 8.5v4M12 15.5h.01" />
      </svg>
    ),
  },
];

const CHIP: Record<string, string> = {
  held: "bg-grove-soft text-grove-deep",
  pending: "bg-gold/20 text-[#9a6a12]",
  done: "bg-grove text-cloud",
};

type Step = { n: string; title: string; chip: string; tone: keyof typeof CHIP; body: string };

const SUCCESSION: Step[] = [
  {
    n: "01",
    title: "The director names a successor",
    chip: "Authority held",
    tone: "held",
    body: "Nothing moves yet. The outgoing director keeps every power they had a minute ago.",
  },
  {
    n: "02",
    title: "The successor accepts",
    chip: "Awaiting accept",
    tone: "pending",
    body: "Until they accept, the transfer does not exist. Nobody is half in, and nobody is holding a login that belongs to someone else.",
  },
  {
    n: "03",
    title: "One move, both sides",
    chip: "Transferred",
    tone: "done",
    body: "The grant and the step-down commit together, so the office is never without somebody who can approve.",
  },
];

const NO = [
  "No coverage gap between one director and the next",
  "No shared password, and no account handed down",
  "No week where nobody in the office can approve anything",
];

export function OfficeConsole() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-cloud py-24 sm:py-32">
      <SectionContour place="tr" seed={11} className="text-ink/[0.05]" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">For the office</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
              The office gets its own system, not a login to{" "}
              <span className="text-gradient">everyone else&rsquo;s</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 text-lg leading-relaxed text-ink-soft">
              The pilot runs on both sides of the record at once: every
              organization the office stewards, and the office&rsquo;s own
              administrators. One console across all of them, what is pending,
              what is vacant, and what got denied.
            </p>
          </Reveal>
        </div>

        {/* the console */}
        <Reveal delay={0.1} className="mt-14">
          <div className="overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_1px_2px_rgba(12,30,51,0.05),0_40px_100px_-56px_rgba(12,30,51,0.45)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
              <div>
                <p className="font-display text-[1.05rem] font-semibold text-ink">
                  Administration console
                </p>
                <p className="font-mono text-[0.66rem] text-ink-faint">
                  Office of Student Engagement · every organization it stewards
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-cloud px-2.5 py-1.5 font-mono text-[0.62rem] text-ink-faint">
                signed in as Director
              </span>
            </div>

            <div className="grid md:grid-cols-[13.5rem_1fr]">
              {/* six sections */}
              <nav className="border-b border-line p-4 md:border-b-0 md:border-r">
                <p className="label-mono px-2 text-[0.55rem]">Sections</p>
                <ul className="mt-3 space-y-1">
                  {NAV.map((n) => {
                    const on = n.label === "Overrides";
                    return (
                      <li key={n.label}>
                        <span
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[0.85rem]",
                            on
                              ? "bg-grove-soft font-medium text-grove-deep"
                              : "text-ink-soft",
                          )}
                        >
                          <span className={on ? "text-grove" : "text-ink-faint"}>
                            {n.icon}
                          </span>
                          <span className="flex-1">{n.label}</span>
                          {n.badge && (
                            <span className="rounded-md bg-gold/20 px-1.5 py-0.5 font-mono text-[0.55rem] font-medium text-[#9a6a12]">
                              {n.badge}
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* the overrides panel */}
              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-[1.1rem] font-semibold text-ink">
                    Overrides
                  </h3>
                  <span className="label-mono text-[0.55rem]">
                    institution-wide
                  </span>
                </div>

                <div className="mt-4 rounded-2xl border border-line bg-cloud p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.92rem] font-medium text-ink">
                        Spring Gala vendor contract
                      </p>
                      <p className="font-mono text-[0.62rem] text-ink-faint">
                        $4,200 · Student Culture Council · SCC-VP-EVEN-PART
                      </p>
                    </div>
                    <span className="rounded-md bg-gold/15 px-2 py-0.5 font-mono text-[0.56rem] font-medium text-[#9a6a12]">
                      6 days in gate 1
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-lg border border-grove/30 bg-grove-soft px-2.5 py-1 font-mono text-[0.62rem] font-medium text-grove-deep">
                      Force approve
                    </span>
                    <span className="rounded-lg border border-line bg-paper px-2.5 py-1 font-mono text-[0.62rem] text-ink-soft">
                      Force reject
                    </span>
                    <span className="self-center text-[0.72rem] text-ink-faint">
                      both gates bypassed, both outcomes logged
                    </span>
                  </div>
                </div>

                <p className="mt-4 rounded-lg border border-line bg-ink px-2.5 py-1.5 font-mono text-[0.6rem] leading-relaxed text-paper/70">
                  <span className="text-grove-bright">approval.force_approved</span>{" "}
                  · Director, Office of Student Engagement · allow
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* what the console carries */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {POWERS.map((p, i) => (
            <Reveal as="div" key={p.title} delay={0.05 * i}>
              <div className="lift flex h-full flex-col rounded-3xl border border-line bg-paper p-6 shadow-[0_1px_2px_rgba(12,30,51,0.04)] hover:-translate-y-1 hover:border-grove/25 hover:shadow-[0_24px_54px_-30px_rgba(12,30,51,0.4)] sm:p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-grove-soft text-grove">
                  {p.icon}
                </span>
                <h3 className="mt-5 font-display text-[1.2rem] font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">
                  {p.body}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {p.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-md border border-line bg-cloud px-1.5 py-0.5 font-mono text-[0.58rem] text-ink-soft"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* the office hands off too */}
        <div className="mt-16 grid items-center gap-10 rounded-3xl border border-line bg-paper p-7 sm:p-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>Succession</Eyebrow>
            <h3 className="font-display mt-5 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[1.85rem]">
              The office hands off{" "}
              <span className="text-grove">too</span>.
            </h3>
            <p className="mt-5 text-[1rem] leading-relaxed text-ink-soft">
              The outgoing director keeps their authority until the named
              successor accepts. Then the grant and the step-down happen
              together, in one move.
            </p>
            <ul className="mt-6 space-y-3.5">
              {NO.map((n) => (
                <li key={n} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md bg-grove-soft text-grove-deep">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3.5 8.5l3 3 6-7"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[0.97rem] leading-relaxed text-ink-soft">
                    {n}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <ol>
              {SUCCESSION.map((s, i) => (
                <li key={s.n}>
                  <div className="rounded-2xl border border-line bg-cloud p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-grove-soft font-mono text-[0.78rem] font-semibold text-grove-deep">
                          {s.n}
                        </span>
                        <p className="text-[0.95rem] font-medium text-ink">
                          {s.title}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "hidden shrink-0 rounded-md px-2 py-0.5 font-mono text-[0.54rem] font-medium uppercase tracking-wide sm:inline",
                          CHIP[s.tone],
                        )}
                      >
                        {s.chip}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[0.88rem] leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                  {i < SUCCESSION.length - 1 && (
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
