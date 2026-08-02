"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionContour } from "@/components/visuals/SectionContour";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- Finance: a budget that fills + a reimbursement that approves ---- */
function FinanceCard() {
  const reduce = useReducedMotion();
  const loop = { duration: 5, repeat: Infinity, ease: "easeInOut" as const, times: [0, 0.4, 0.55, 0.9, 1] };
  return (
    <div className="rounded-2xl border border-line bg-cloud p-5 shadow-[var(--shadow-lg)]">
      <div className="flex items-center justify-between">
        <p className="label-mono text-[0.6rem]">Finance · fall</p>
        <span className="rounded-md bg-grove-soft px-2 py-0.5 font-mono text-[0.62rem] text-grove-deep">
          live
        </span>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold text-ink">
        $12,400{" "}
        <span className="text-sm font-normal text-text-secondary">/ $18,000</span>
      </p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
        <motion.div
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
        ].map((r, i) => (
          <div
            key={r.who}
            className="flex items-center justify-between rounded-lg border border-line bg-surface-subtle px-3 py-2 text-[0.8rem]"
          >
            <span className="text-ink-soft">{r.who}</span>
            <span className="flex items-center gap-2">
              <span className="font-mono text-ink">{r.amt}</span>
              <span className="relative h-[1.15rem] w-[4.6rem] overflow-hidden rounded-full text-[0.6rem] font-medium">
                <motion.span
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-warning-subtle text-warning"
                  initial={{ opacity: 1 }}
                  animate={reduce ? undefined : { opacity: [1, 1, 0, 0, 1] }}
                  transition={reduce ? undefined : { ...loop, delay: i * 0.3 }}
                >
                  Pending
                </motion.span>
                <motion.span
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-grove-soft text-grove-deep"
                  initial={{ opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0] }}
                  transition={reduce ? undefined : { ...loop, delay: i * 0.3 }}
                >
                  Approved
                </motion.span>
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
  const loop = { duration: 5.4, repeat: Infinity, ease: "easeInOut" as const };
  return (
    <div className="rounded-2xl border border-line bg-cloud p-5 shadow-[var(--shadow-lg)]">
      <div className="flex items-center justify-between">
        <p className="label-mono text-[0.6rem]">Term handoff</p>
        <span className="font-mono text-[0.62rem] text-text-secondary">2024–25 → 2025–26</span>
      </div>

      <div className="relative mt-4 h-40">
        <Zone className="left-0" label="Outgoing" dim />
        <Zone className="right-0" label="Incoming" />

        {/* a record already inherited, so the incoming side is never empty */}
        <div className="absolute bottom-3 right-[3.5%] z-0 w-[40%] rounded-lg border border-line bg-paper/70 p-2">
          <div className="flex items-center gap-1.5">
            <span className="rounded border border-line bg-cloud px-1 py-0.5 font-mono text-[0.55rem] uppercase text-text-secondary">
              Lead
            </span>
            <span className="truncate text-[0.7rem] text-ink-soft">Wegmans · ’24</span>
          </div>
        </div>

        <motion.div
          className="absolute top-12 z-10 w-[44%] rounded-xl border border-grove/30 bg-cloud p-2.5 shadow-[var(--shadow-lg)]"
          initial={{ left: "4%", opacity: 0 }}
          animate={
            reduce
              ? { left: "52%", opacity: 1 }
              : { left: ["4%", "4%", "52%", "52%", "52%"], opacity: [0, 1, 1, 1, 0] }
          }
          transition={reduce ? undefined : { ...loop, times: [0, 0.14, 0.5, 0.9, 1] }}
        >
          <div className="flex items-center gap-1.5">
            <span className="rounded border border-grove/30 bg-grove-soft px-1 py-0.5 font-mono text-[0.55rem] uppercase text-grove-deep">
              Deal
            </span>
            <span className="text-[0.74rem] text-ink">Aramark renewal</span>
          </div>
          <p className="mt-1 font-mono text-[0.62rem] text-text-secondary">$4,000 · Maya ’24</p>
        </motion.div>
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
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-text-secondary">
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
    body: "Budgets, dues, and reimbursements live in one ledger. Officers request, leadership approves, and the whole history stays with the role, so next year's treasurer sees exactly what things cost and who signed off.",
    visual: <FinanceCard />,
  },
  {
    eyebrow: "The handoff",
    title: (
      <>
        Records cross the term with their <span className="text-grove">history intact</span>.
      </>
    ),
    body: "When leadership rotates, the work doesn't reset. Deals, contacts, and playbooks move to the incoming board with the context that made them matter, who built them, what they cost, and why.",
    visual: <HandoffCard />,
  },
];

export function ProductAtWork() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-sand py-24 sm:py-32">
      <SectionContour place="cr" seed={6} className="text-grove/[0.06]" />
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Tenure at work</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
              Not a pitch deck. The system, <span className="text-grove">actually running</span>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 space-y-20 sm:space-y-28">
          {FEATURES.map((f, i) => (
            <div
              key={f.eyebrow}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <Reveal className={cn(i % 2 === 1 && "lg:order-2")}>
                <Eyebrow>{f.eyebrow}</Eyebrow>
                <h3 className="font-display mt-4 text-[1.6rem] font-semibold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2rem]">
                  {f.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">{f.body}</p>
              </Reveal>
              <Reveal delay={0.1} className={cn(i % 2 === 1 && "lg:order-1")}>
                {f.visual}
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
