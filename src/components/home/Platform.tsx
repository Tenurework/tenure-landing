import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/brand/Logo";
import { SectionContour } from "@/components/visuals/SectionContour";
import { cn } from "@/lib/cn";

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[20px] w-[20px]",
  "aria-hidden": true,
};

function Cluster({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-line bg-paper/70 px-2 py-0.5 font-mono text-[0.54rem] uppercase tracking-wide text-ink-faint">
      {children}
    </span>
  );
}

function Head({
  icon,
  cluster,
}: {
  icon: ReactNode;
  cluster: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-grove-soft text-grove">
        {icon}
      </span>
      <Cluster>{cluster}</Cluster>
    </div>
  );
}

function Cell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        "lift group flex flex-col rounded-3xl border border-line bg-cloud p-5 shadow-[0_1px_2px_rgba(12,30,51,0.04),0_18px_44px_-30px_rgba(12,30,51,0.35)] hover:-translate-y-1 hover:border-grove/25 hover:shadow-[0_28px_60px_-30px_rgba(12,30,51,0.4)] sm:p-6",
        className,
      )}
    >
      {children}
    </article>
  );
}

function Title({ children }: { children: ReactNode }) {
  return <h3 className="mt-5 font-display text-[1.1rem] font-semibold text-ink">{children}</h3>;
}
function Desc({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-soft">{children}</p>;
}

/* small tag chips */
function Tags({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className="rounded-md border border-line bg-paper/50 px-1.5 py-0.5 font-mono text-[0.58rem] text-ink-soft">
          {t}
        </span>
      ))}
    </div>
  );
}

export function Platform() {
  return (
    <section id="platform" className="relative isolate overflow-hidden border-t border-line bg-paper py-24 scroll-mt-20 sm:py-32">
      <SectionContour place="tr" seed={2} className="text-grove/[0.06]" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">The platform</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
              One governed system for everything the org{" "}
              <span className="text-gradient">runs on</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 text-lg leading-relaxed text-ink-soft">
              Finance, scheduling, approvals, members, documents, messaging, and
              memory: the dozen tools an organization juggles across spreadsheets
              and logins, unified into one record that every transition inherits.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(0,auto)]">
          {/* Tenure AI, tall hero cell */}
          <Reveal as="div" className="lg:col-span-2 lg:row-span-2">
            <Cell className="h-full">
              <Head
                cluster="Remember"
                icon={<Logo className="h-5 w-5" />}
              />
              <Title>Tenure AI</Title>
              <Desc>
                Ask in your own words across everything the seat can see, plus the
                seat&rsquo;s own private memory. Every answer links the records,
                files, and decisions it came from. No model is trained on your data.
              </Desc>
              <div className="mt-5 space-y-2">
                <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm border border-line bg-paper/60 px-3 py-1.5 text-[0.76rem] text-ink-soft">
                  How do we run elections?
                </p>
                <div className="w-fit max-w-[92%] rounded-2xl rounded-bl-sm border border-grove/25 bg-grove-soft/60 px-3 py-2">
                  <p className="text-[0.76rem] leading-relaxed text-ink">
                    Nominations open week 10, two-week window, ranked-choice ballot in
                    the Members module.
                  </p>
                  <span className="mt-1.5 inline-block font-mono text-[0.58rem] uppercase text-grove-deep">
                    Bylaws §4 · 2 records ↗
                  </span>
                </div>
              </div>
              <div className="mt-auto pt-5">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper/50 px-2.5 py-1.5 text-[0.72rem] text-ink-faint">
                  <span className="h-1.5 w-1.5 rounded-full bg-grove" />
                  Grounded in your records · sources shown
                </span>
              </div>
            </Cell>
          </Reveal>

          {/* Approvals */}
          <Reveal as="div" className="lg:col-span-2">
            <Cell className="h-full">
              <Head
                cluster="Govern"
                icon={<svg {...svg}><rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8.5 12l2.4 2.4L16 9" /></svg>}
              />
              <Title>Approvals & oversight</Title>
              <Desc>
                Multi-step approval chains, routed by seat. Every decision snapshots
                the exact policy in force, so you can always prove the rules, not
                just who said yes.
              </Desc>
              <div className="mt-4 flex items-center gap-1">
                {["Draft", "President", "OSE", "Approved"].map((s, idx) => (
                  <div key={s} className="flex flex-1 items-center last:flex-none">
                    <span className={cn("h-2 w-2 rounded-full", idx < 2 ? "bg-grove" : idx === 2 ? "bg-gold" : "bg-line")} />
                    {idx < 3 && <span className={cn("mx-0.5 h-px flex-1", idx < 2 ? "bg-grove" : "bg-line")} />}
                  </div>
                ))}
              </div>
              <Tags items={["event", "budget", "vendor", "comms", "document", "roster", "exception"]} />
            </Cell>
          </Reveal>

          {/* Finance */}
          <Reveal as="div" className="lg:col-span-2">
            <Cell className="h-full">
              <Head
                cluster="Run"
                icon={<svg {...svg}><path d="M3 21h18" /><rect x="5" y="11" width="3.4" height="7" rx="1" /><rect x="10.3" y="6" width="3.4" height="12" rx="1" /><rect x="15.6" y="14" width="3.4" height="4" rx="1" /></svg>}
              />
              <Title>Finance</Title>
              <Desc>
                Budgets, dues, reimbursements, and vendors in one ledger. Request,
                approve, and reconcile in place, with the full history kept by seat.
              </Desc>
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-lg font-semibold tnum text-ink">$12,400</span>
                  <span className="font-mono text-[0.62rem] text-ink-faint">of $18,000</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
                  <span className="block h-full w-[69%] rounded-full bg-grove" />
                </div>
              </div>
            </Cell>
          </Reveal>

          {/* Calendar */}
          <Reveal as="div" className="lg:col-span-2">
            <Cell className="h-full">
              <Head
                cluster="Run"
                icon={<svg {...svg}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></svg>}
              />
              <Title>Conflict-aware calendar</Title>
              <Desc>
                Plan events, vendors, and run-of-show. Tenure catches hard and soft
                scheduling conflicts before they become a double-booked room.
              </Desc>
              <div className="mt-4 rounded-lg border border-coral/30 bg-coral/[0.06] px-2.5 py-1.5">
                <p className="flex items-center gap-1.5 text-[0.7rem] font-medium text-[#b23a1f]">
                  <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                  Hard conflict, Schlegel 207, 5:00 to 6:30p
                </p>
              </div>
            </Cell>
          </Reveal>

          {/* Memory */}
          <Reveal as="div" className="lg:col-span-2">
            <Cell className="h-full">
              <Head
                cluster="Remember"
                icon={<svg {...svg}><path d="M12 3l8.5 4.5-8.5 4.5L3.5 8z" /><path d="M3.5 12l8.5 4.5 8.5-4.5M3.5 15.5l8.5 4.5 8.5-4.5" /></svg>}
              />
              <Title>Institutional memory</Title>
              <Desc>
                The living record, decisions, context, and know-how that survives
                every turnover instead of leaving in someone&rsquo;s head.
              </Desc>
              <Tags items={["Contact", "Playbook", "Vendor", "Lesson", "Credential", "Deadline"]} />
            </Cell>
          </Reveal>

          {/* Members */}
          <Reveal as="div" className="lg:col-span-2">
            <Cell className="h-full">
              <Head
                cluster="Run"
                icon={<svg {...svg}><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><rect x="6.5" y="8" width="4.5" height="4.5" rx="1.2" /><path d="M14 9h3.5M14 12h2.5M6.75 15.5h10.75" /></svg>}
              />
              <Title>Members & durable seats</Title>
              <Desc>
                Roster, roles, and contacts, organized around positions that persist.
                Access follows the seat and revokes itself at graduation.
              </Desc>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-grove-soft px-2 py-0.5 font-mono text-[0.56rem] font-medium text-grove-deep">ACTIVE</span>
                <span className="rounded-md bg-gold/15 px-2 py-0.5 font-mono text-[0.56rem] font-medium text-[#9a6a12]">SHADOW</span>
                <span className="rounded-md bg-line/60 px-2 py-0.5 font-mono text-[0.56rem] font-medium text-ink-faint">ALUMNI</span>
              </div>
            </Cell>
          </Reveal>

          {/* Documents */}
          <Reveal as="div" className="lg:col-span-2">
            <Cell className="h-full">
              <Head
                cluster="Remember"
                icon={<svg {...svg}><path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>}
              />
              <Title>Documents</Title>
              <Desc>
                Contracts, decks, and spreadsheets open in Tenure: PDF, Word, Excel,
                and PowerPoint with speaker notes. Text files and spreadsheets can be
                edited in place, versioned, and Tenure warns you if someone else saved
                first.
              </Desc>
              <Tags items={["versioned", "opens in-app", "edit in place"]} />
            </Cell>
          </Reveal>

          {/* Audit */}
          <Reveal as="div" className="lg:col-span-2">
            <Cell className="h-full">
              <Head
                cluster="Govern"
                icon={<svg {...svg}><path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6z" /><path d="M9.5 12l1.8 1.8L15 10" /></svg>}
              />
              <Title>Immutable audit trail</Title>
              <Desc>
                Every allow and every deny, append-only. Denials are logged too, so you
                can prove nobody did something. Rows are only ever created, never
                updated or deleted.
              </Desc>
              <p className="mt-4 rounded-lg border border-line bg-ink px-2.5 py-1.5 font-mono text-[0.6rem] text-paper/70">
                <span className="text-grove-bright">budget.approved</span> · SCC-VP-FINA-OPER · allow
              </p>
            </Cell>
          </Reveal>

          {/* Messages */}
          <Reveal as="div" className="lg:col-span-2">
            <Cell className="h-full">
              <Head
                cluster="Remember"
                icon={<svg {...svg}><path d="M4 5h16v11H9l-4 3v-3H4z" /><path d="M8 9h8M8 12h5" /></svg>}
              />
              <Title>Messages</Title>
              <Desc>
                Role-aware conversations with sensitivity levels and delivery across
                in-app, email, and push, threaded to the work they&rsquo;re about.
              </Desc>
              <Tags items={["RBAC", "sensitivity", "in-app · email · push"]} />
            </Cell>
          </Reveal>

          {/* Collaboration */}
          <Reveal as="div" className="lg:col-span-2">
            <Cell className="h-full">
              <Head
                cluster="Govern"
                icon={<svg {...svg}><circle cx="7" cy="8" r="3" /><circle cx="17" cy="8" r="3" /><path d="M2.5 19a4.5 4.5 0 0 1 9 0M12.5 19a4.5 4.5 0 0 1 9 0" /></svg>}
              />
              <Title>Cross-org collaboration</Title>
              <Desc>
                A shared feed where teams co-host and partner. Every cross-org
                request is gated and audited by whoever oversees them.
              </Desc>
              <Tags items={["feed", "co-host", "approved & audited"]} />
            </Cell>
          </Reveal>

          {/* Reports & Search */}
          <Reveal as="div" className="lg:col-span-2">
            <Cell className="h-full">
              <Head
                cluster="Govern"
                icon={<svg {...svg}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>}
              />
              <Title>Reports & search</Title>
              <Desc>
                Roll spending, participation, and continuity into board-ready reports, 
                and search the entire record in one box, scoped to what you can see.
              </Desc>
              <Tags items={["board-ready", "RBAC-scoped", "sources linked"]} />
            </Cell>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
