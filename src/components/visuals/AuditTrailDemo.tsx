"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type Row = {
  id: number;
  actor: string;
  action: string;
  target: string;
  when: string;
  result: "allow" | "deny";
};

const POOL: Omit<Row, "id" | "when">[] = [
  { actor: "SCC-VP-FINA-OPER", action: "budget.approved", target: "Spring Gala · $4,200", result: "allow" },
  { actor: "SCC-VP-EVEN-PART", action: "event.conflict_overridden", target: "Schlegel 207", result: "allow" },
  { actor: "MEMBER", action: "budget.delete", target: "Q3 ledger", result: "deny" },
  { actor: "OSE_DIRECTOR", action: "approval.override", target: "All-campus email blast", result: "allow" },
  { actor: "SCC-PRES", action: "roster.role_reassigned", target: "SCC-VP-SPON", result: "allow" },
  { actor: "SCC-VP-MARK-COMM", action: "message.broadcast_sent", target: "All-board channel", result: "allow" },
  { actor: "OSE_ADVISOR", action: "content.override", target: "Aramark contract", result: "deny" },
  { actor: "SCC-VP-EVEN-PART", action: "vendor.created", target: "Prestige Catering", result: "allow" },
];

/**
 * Seeded at the full ROW_COUNT. The list must never change row count: this demo
 * sits in normal document flow, so a container that grows or shrinks by a row
 * shoves every section below it (and the footer) up and down on a loop.
 */
const ROW_COUNT = 6;

const SEED: Row[] = [
  { id: 0, ...POOL[0], when: "2m" },
  { id: 1, ...POOL[2], when: "6m" },
  { id: 2, ...POOL[3], when: "11m" },
  { id: 3, ...POOL[5], when: "18m" },
  { id: 4, ...POOL[6], when: "24m" },
  { id: 5, ...POOL[7], when: "31m" },
];

export function AuditTrailDemo({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [rows, setRows] = useState<Row[]>(SEED);

  useEffect(() => {
    if (reduce) return;
    let n = 100;
    let p = 1;
    const id = setInterval(() => {
      setRows((cur) => {
        const next: Row = { id: n++, ...POOL[p % POOL.length], when: "just now" };
        p += 1;
        const aged = cur.map((r) => ({ ...r, when: r.when === "just now" ? "1m" : r.when }));
        return [next, ...aged].slice(0, ROW_COUNT);
      });
    }, 3600);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-cloud shadow-[0_1px_2px_rgba(12,30,51,0.05),0_40px_100px_-50px_rgba(12,30,51,0.45)]",
        className,
      )}
    >
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-paper/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-grove-soft text-grove-deep">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <span className="font-display text-sm font-semibold text-ink">Audit log</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-grove-soft px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-wide text-grove-deep">
          <span className="h-1.5 w-1.5 rounded-full bg-grove" />
          Immutable · append-only
        </span>
      </div>

      {/* column header */}
      <div className="grid grid-cols-[1.4fr_1.2fr_0px_auto] gap-3 border-b border-line px-4 py-2 font-mono text-[0.56rem] uppercase tracking-wide text-ink-faint sm:grid-cols-[1.25fr_1.15fr_1.1fr_auto] sm:px-5">
        <span>Actor</span>
        <span>Action</span>
        <span className="hidden sm:block">Target</span>
        <span className="text-right">Result</span>
      </div>

      {/* rows */}
      <div className="divide-y divide-line">
        {/* popLayout takes the exiting row out of flow immediately, so the
            container stays exactly ROW_COUNT tall instead of briefly holding
            seven rows while the last one fades. */}
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((r) => (
            <motion.div
              key={r.id}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: -10, backgroundColor: "rgba(228,241,233,0.6)" }}
              animate={{ opacity: 1, y: 0, backgroundColor: "rgba(228,241,233,0)" }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[1.4fr_1.2fr_0px_auto] items-center gap-3 px-4 py-2.5 text-[0.72rem] sm:grid-cols-[1.25fr_1.15fr_1.1fr_auto] sm:px-5"
            >
              <span className="flex min-w-0 items-center gap-1.5 font-mono text-[0.66rem] text-ink-soft sm:text-[0.72rem]">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="shrink-0 text-ink-faint"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                <span className="truncate">{r.actor}</span>
              </span>
              <span className={cn("truncate font-mono", r.result === "deny" ? "text-[#b23a1f]" : "text-grove-deep")}>
                {r.action}
              </span>
              <span className="hidden truncate text-ink-soft sm:block">{r.target}</span>
              <span className="flex items-center justify-end gap-2">
                <span className="hidden font-mono text-[0.6rem] text-ink-faint sm:inline">{r.when}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 font-mono text-[0.54rem] font-medium uppercase",
                    r.result === "deny" ? "bg-coral/12 text-[#b23a1f]" : "bg-grove-soft text-grove-deep",
                  )}
                >
                  {r.result}
                </span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
