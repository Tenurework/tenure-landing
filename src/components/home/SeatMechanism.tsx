"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

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

const AFFIRMATIONS = [
  "Knowledge attaches to the position, not the student who held it",
  "Occupants rotate through the seat; the record never resets",
  "That growing record is what Tenure AI draws on to bring the next leader up to speed",
];

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
        status === "alumni" && "border-line bg-paper/50 opacity-70",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full font-mono text-[0.6rem] font-semibold",
          status === "active" && "bg-grove text-on-accent",
          status === "shadow" && "bg-brand-gold/25 text-warning",
          status === "alumni" && "bg-line text-ink-faint",
        )}
      >
        {initials}
      </span>
      <span className="flex-1">
        <span className={cn("block text-[0.82rem] font-medium", status === "alumni" ? "text-ink-faint" : "text-ink")}>
          {name}
        </span>
      </span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-wide",
          status === "active" && "bg-grove text-on-accent",
          status === "shadow" && "bg-brand-gold/20 text-warning",
          status === "alumni" && "bg-line/60 text-ink-faint",
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
  const step = STEPS[i];

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % STEPS.length), 3400);
    return () => clearInterval(id);
  }, [reduce, paused]);

  return (
    <section className="relative isolate overflow-hidden border-t border-line py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(50%_50%_at_18%_25%,color-mix(in_oklab,var(--accent)_6%,transparent),transparent_70%)]"
      />
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* LEFT, the thesis */}
        <div className="max-w-xl">
          <Reveal>
            <Eyebrow>Why Tenure is different</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
              The person is new. The seat{" "}
              <span className="text-gradient">remembers everything</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Every other tool models people and rosters that wipe clean each year.
              Tenure models a durable <span className="font-medium text-ink">seat</span>, 
              a position that keeps its money, contacts, playbooks, and decisions no
              matter who is sitting in it this term.
            </p>
          </Reveal>

          <ul className="mt-8 space-y-3.5">
            {AFFIRMATIONS.map((a, idx) => (
              <Reveal as="li" key={a} delay={0.14 + idx * 0.06} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md bg-grove-soft text-grove-deep">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-[0.98rem] leading-relaxed text-ink-soft">{a}</span>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* RIGHT, the living seat */}
        <Reveal delay={0.1}>
          <div
            className="relative rounded-[26px] border border-line bg-cloud p-5 shadow-[var(--shadow-sm),var(--shadow-lg)] sm:p-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* seat header */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-grove-soft text-grove">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 19v-3M18 19v-3M5 16h14M7 16v-5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5M9 9V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                </span>
                <div>
                  <p className="font-display text-[1.05rem] font-semibold text-ink">VP Finance &amp; Operations</p>
                  <p className="font-mono text-[0.66rem] text-ink-faint">durable seat · SCC-VP-FINA-OPER</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {STEPS.map((s, idx) => (
                  <button
                    key={s.term}
                    type="button"
                    aria-label={`Term ${s.term}`}
                    aria-pressed={idx === i}
                    onClick={() => { setI(idx); setPaused(true); }}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      idx === i ? "w-6 bg-grove" : "w-1.5 bg-line hover:bg-grove/40",
                    )}
                  />
                ))}
              </div>
            </div>

            {/* occupant timeline */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="label-mono text-[0.56rem]">Occupant · term {step.term}</p>
                <span className="font-mono text-[0.62rem] text-ink-faint">the person rotates ↻</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
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
                      + {step.alumni.length - 1} more alumni on the seat&rsquo;s rail
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* growing memory ledger */}
            <div className="mt-4 rounded-2xl border border-grove/20 bg-grove-mist/60 p-3.5">
              <div className="flex items-baseline justify-between">
                <p className="label-mono text-[0.56rem] text-grove-deep">Institutional memory on this seat</p>
                <p className="font-display text-2xl font-semibold tnum text-grove-deep">
                  {reduce ? step.records : <NumberFlow value={step.records} />}
                </p>
              </div>
              <p className="text-[0.66rem] text-ink-soft">records, carried across every handoff</p>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={step.fresh.t}
                  className="mt-3 flex items-center gap-2 rounded-lg border border-grove/25 bg-cloud px-2.5 py-1.5"
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: 10 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                >
                  <span className="rounded border border-grove/25 bg-grove-soft px-1 py-0.5 font-mono text-[0.5rem] uppercase text-grove-deep">
                    + {step.fresh.tag}
                  </span>
                  <span className="text-[0.72rem] text-ink">{step.fresh.t}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ask this seat */}
            <div className="mt-4 rounded-2xl border border-line bg-paper/50 p-3.5">
              <div className="flex items-center gap-2">
                <Logo className="h-4 w-4 text-grove" />
                <span className="text-[0.74rem] font-semibold text-ink">Ask this seat anything</span>
              </div>
              <p className="mt-2 rounded-xl rounded-br-sm bg-cloud px-3 py-2 text-[0.78rem] text-ink-soft ring-1 ring-line">
                Who&rsquo;s our banquet caterer, and what did we overpay last year?
              </p>
              <p className="mt-2 rounded-xl rounded-bl-sm bg-grove-soft/70 px-3 py-2 text-[0.78rem] leading-relaxed text-ink">
                Prestige Catering. The &rsquo;25 gala ran <span className="font-medium">$1,240 over</span>, Marcus
                renegotiated it to a flat $3,800.
                <span className="ml-1 whitespace-nowrap font-mono text-[0.6rem] text-grove-deep">3 sources ↗</span>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
