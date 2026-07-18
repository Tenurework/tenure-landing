"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

type ModuleKey = "Finance" | "Calendar" | "Approvals" | "Members" | "Memory";
const NAV: ModuleKey[] = ["Finance", "Calendar", "Approvals", "Members", "Memory"];

const ICONS: Record<ModuleKey, string> = {
  Finance: "M3 21h18M5 21V11m4 10V7m4 14V9m4 12V5",
  Calendar: "M4 6h16v14H4zM4 9h16M8 3v4M16 3v4",
  Approvals: "M4 5h16v14H4zM8 12l2.5 2.5L16 9",
  Members:
    "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0 0-6M16 20a6 6 0 0 1 5-3",
  Memory: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5",
};

const ASKS: Record<ModuleKey, string[]> = {
  Finance: ["Are we on budget this term?", "What did the gala cost last year?"],
  Calendar: ["Which venues have we used before?", "Any conflicts next week?"],
  Approvals: ["What's stuck in OSE review?", "Under which policy was this approved?"],
  Members: ["Who handled sponsorship last year?", "How do we run elections?"],
  Memory: ["Why did we drop the fall mixer?", "Which sponsors should we renew?"],
};

/* -------------------------------------------------------------- primitives */
function Stat({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper/40 px-3 py-2.5">
      <p className="label-mono text-[0.54rem]">{k}</p>
      <p className="mt-1 font-mono text-base font-semibold tnum text-ink">{v}</p>
      {sub && <p className="text-[0.64rem] text-grove">{sub}</p>}
    </div>
  );
}
function Badge({
  children,
  tone = "grove",
}: {
  children: string;
  tone?: "grove" | "amber" | "coral";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 font-mono text-[0.56rem] font-medium",
        tone === "grove" && "bg-grove-soft text-grove-deep",
        tone === "amber" && "bg-gold/15 text-[#9a6a12]",
        tone === "coral" && "bg-coral/12 text-[#b23a1f]",
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ chart */
const PTS = [38, 52, 46, 60, 54, 70, 64, 82, 78, 96];
function AreaChart({ reduce }: { reduce: boolean | null }) {
  const w = 320;
  const h = 76;
  const max = 110;
  const step = w / (PTS.length - 1);
  const pt = (v: number, i: number): [number, number] => [i * step, h - (v / max) * h];
  let line = "";
  PTS.forEach((v, i) => {
    const [x, y] = pt(v, i);
    if (i === 0) line += `M${x.toFixed(1)} ${y.toFixed(1)}`;
    else {
      const [px, py] = pt(PTS[i - 1], i - 1);
      const cx = (px + x) / 2;
      line += `C${cx.toFixed(1)} ${py.toFixed(1)} ${cx.toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  });
  const last = pt(PTS[PTS.length - 1], PTS.length - 1);
  return (
    <svg viewBox={`0 0 ${w} ${h + 6}`} className="mt-2 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dm-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c8c5a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1c8c5a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={`${line}L${w} ${h}L0 ${h}Z`} fill="url(#dm-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.7, delay: 0.3 }} />
      <motion.path d={line} fill="none" stroke="#1c8c5a" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 1.1, ease: EASE }} />
      <motion.circle cx={last[0]} cy={last[1]} r="3.5" fill="#1c8c5a" stroke="#fff" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: reduce ? 0 : 0.3, delay: 1.1 }} />
    </svg>
  );
}

/* ------------------------------------------------------------- module views */
function FinanceView({ reduce }: { reduce: boolean | null }) {
  const cats = [
    { label: "Events", pct: 38, color: "#1c8c5a" },
    { label: "Operations", pct: 24, color: "#3e7cb1" },
    { label: "Marketing", pct: 16, color: "#e8b04b" },
    { label: "Reserve", pct: 22, color: "#c9d2cc" },
  ];
  const rows = [
    { t: "Membership dues, 28 paid", a: "+$840", d: "Sep 14", up: true },
    { t: "Aramark, fall sponsorship", a: "+$4,000", d: "Oct 2", up: true },
    { t: "Rochester Print, banners", a: "−$240", d: "Oct 9", up: false },
    { t: "Gala venue deposit", a: "−$1,500", d: "Oct 18", up: false },
  ];
  return (
    <>
      <div className="rounded-xl border border-line bg-paper/40 p-3.5">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-mono text-[0.54rem]">Treasury balance</p>
            <p className="mt-1 font-mono text-2xl font-semibold tnum text-ink">$12,400</p>
            <p className="text-[0.7rem] font-medium text-grove">▲ $1,300 · 11.7% this month</p>
          </div>
          <span className="rounded-md border border-line bg-cloud px-2 py-0.5 font-mono text-[0.6rem] text-ink-soft">$18,000 budget</span>
        </div>
        <AreaChart reduce={reduce} />
      </div>
      <div className="mt-3">
        <p className="label-mono text-[0.54rem]">Budget by category</p>
        <div className="mt-1.5 flex h-2.5 w-full overflow-hidden rounded-full">
          {cats.map((c) => (
            <motion.span key={c.label} style={{ backgroundColor: c.color }} initial={{ width: "0%" }} animate={{ width: `${c.pct}%` }} transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: 0.2 }} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1">
          {cats.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5 text-[0.66rem] text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-sm" style={{ backgroundColor: c.color }} />
              {c.label} <span className="text-ink-faint">{c.pct}%</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-line">
        {rows.map((r, i) => (
          <div key={r.t} className={cn("flex items-center gap-2 px-3 py-2 text-[0.74rem]", i > 0 && "border-t border-line")}>
            <span className="flex-1 truncate text-ink-soft">{r.t}</span>
            <span className={cn("font-mono tnum", r.up ? "text-grove" : "text-ink")}>{r.a}</span>
            <span className="w-10 text-right font-mono text-[0.6rem] text-ink-faint">{r.d}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function CalendarView({ reduce }: { reduce: boolean | null }) {
  const events = [
    { t: "Spring Gala", d: "Apr 12 · 7:00p", v: "Memorial Art Gallery", s: "Confirmed", tone: "grove" as const },
    { t: "Alumni Stock Pitch", d: "Feb 20 · 5:30p", v: "Schlegel Hall 207", s: "Room conflict", tone: "coral" as const },
    { t: "Sponsor Mixer", d: "Mar 8 · 6:00p", v: "Simon Atrium", s: "Soft overlap", tone: "amber" as const },
  ];
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Stat k="Upcoming" v="7" />
        <Stat k="RSVPs" v="142" sub="+38 this week" />
        <Stat k="Conflicts" v="2" sub="auto-flagged" />
      </div>
      <div className="mt-3 space-y-2">
        {events.map((e, i) => (
          <motion.div
            key={e.t}
            className={cn(
              "rounded-xl border bg-paper/40 p-3",
              e.tone === "coral" ? "border-coral/40" : "border-line",
            )}
            initial={reduce ? false : { opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduce ? 0 : 0.4, delay: 0.1 + i * 0.08, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.86rem] font-medium text-ink">{e.t}</span>
              <Badge tone={e.tone}>{e.s}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[0.66rem] text-ink-soft">
              <span>📅 {e.d}</span>
              <span className="text-ink-faint">{e.v}</span>
            </div>
            {e.tone === "coral" && (
              <p className="mt-1.5 flex items-center gap-1 text-[0.64rem] font-medium text-[#b23a1f]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-coral" />
                Hard conflict, Schlegel 207 double-booked 5:00–6:30p
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
}

const APPROVAL_STEPS = ["Draft", "Officer", "Advisor", "OSE", "Approved"];
function ApprovalsView({ reduce }: { reduce: boolean | null }) {
  const active = 3; // "OSE" pending
  const queue = [
    { t: "Spring Gala, $4,200 budget", tag: "budget", at: "OSE review", tone: "amber" as const },
    { t: "Aramark, vendor renewal", tag: "vendor", at: "Approved", tone: "grove" as const },
    { t: "All-campus email blast", tag: "comms", at: "Returned", tone: "coral" as const },
  ];
  return (
    <>
      <div className="rounded-xl border border-line bg-paper/40 p-3.5">
        <div className="flex items-center justify-between">
          <p className="label-mono text-[0.54rem]">Spring Gala · approval chain</p>
          <Badge tone="amber">Pending OSE</Badge>
        </div>
        <div className="mt-3.5 flex items-center">
          {APPROVAL_STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <motion.span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[0.58rem] font-semibold",
                    i < active && "border-grove bg-grove text-cloud",
                    i === active && "border-gold bg-gold/15 text-[#9a6a12]",
                    i > active && "border-line bg-cloud text-ink-faint",
                  )}
                  initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 0.3, delay: 0.1 + i * 0.12 }}
                >
                  {i < active ? "✓" : i + 1}
                </motion.span>
                <span className="text-[0.52rem] text-ink-faint">{s}</span>
              </div>
              {i < APPROVAL_STEPS.length - 1 && (
                <div className="mx-1 h-[2px] flex-1 overflow-hidden rounded-full bg-line">
                  <motion.span
                    className="block h-full bg-grove"
                    initial={{ width: "0%" }}
                    animate={{ width: i < active ? "100%" : "0%" }}
                    transition={{ duration: reduce ? 0 : 0.5, delay: 0.2 + i * 0.12, ease: EASE }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-lg border border-line bg-cloud px-2.5 py-1.5 font-mono text-[0.6rem] text-ink-soft">
          🔒 policy v4 · frozen 2026-09-12 · append-only snapshot
        </p>
      </div>
      <div className="mt-3 space-y-1.5">
        {queue.map((q) => (
          <div key={q.t} className="flex items-center gap-2 rounded-lg border border-line bg-paper/40 px-3 py-2 text-[0.74rem]">
            <span className="rounded border border-line bg-cloud px-1 py-0.5 font-mono text-[0.5rem] uppercase text-ink-faint">{q.tag}</span>
            <span className="flex-1 truncate text-ink">{q.t}</span>
            <Badge tone={q.tone}>{q.at}</Badge>
          </div>
        ))}
      </div>
    </>
  );
}

function MembersView() {
  const roster = [
    { n: "Aisha Khan", r: "President", seat: "PRES-01", y: "Active" },
    { n: "Dev Patel", r: "Treasurer", seat: "FIN-01", y: "Active" },
    { n: "Sam Rivera", r: "VP Events", seat: "EVT-01", y: "Active" },
    { n: "Leah Cohen", r: "Sponsorship", seat: "SPON-01", y: "Shadow" },
  ];
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Stat k="Members" v="84" sub="+9 this term" />
        <Stat k="Seats" v="12" sub="durable roles" />
        <Stat k="Shadowing" v="3" sub="onboarding" />
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-line">
        <div className="flex items-center gap-2 border-b border-line bg-paper/40 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-wide text-ink-faint">
          <span className="flex-1">Member</span>
          <span className="w-20">Seat</span>
          <span className="w-16">Status</span>
        </div>
        {roster.map((m, i) => (
          <div key={m.n} className={cn("flex items-center gap-2 px-3 py-2 text-[0.76rem]", i > 0 && "border-t border-line")}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grove-soft font-mono text-[0.56rem] font-semibold text-grove-deep">
              {m.n.split(" ").map((p) => p[0]).join("")}
            </span>
            <span className="flex-1 truncate text-ink">{m.n}</span>
            <span className="w-20 font-mono text-[0.62rem] text-ink-soft">{m.seat}</span>
            <span className={cn("w-16", m.y === "Shadow" ? "text-gold" : "text-grove")}>{m.y}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function MemoryView() {
  const recs = [
    { tag: "Deal", t: "Aramark, sponsorship renewal", from: "Maya Chen · 2023–24" },
    { tag: "Playbook", t: "Spring Gala, run of show", from: "Priya Nair · 2024–25" },
    { tag: "Vendor", t: "Rochester Print, 15% club rate", from: "Jordan Lee · 2024–25" },
    { tag: "Lesson", t: "Why we moved the fall mixer", from: "Board · 2022–23" },
  ];
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Stat k="Records" v="142" sub="carried across 3 terms" />
        <Stat k="Decisions logged" v="38" />
      </div>
      <div className="mt-3 space-y-1.5">
        {recs.map((r) => (
          <div key={r.t} className="rounded-lg border border-line bg-paper/40 p-2.5">
            <div className="flex items-center gap-1.5">
              <span className="rounded border border-line bg-cloud px-1 py-0.5 font-mono text-[0.52rem] uppercase tracking-wide text-ink-faint">{r.tag}</span>
              <span className="text-[0.78rem] text-ink">{r.t}</span>
            </div>
            <p className="mt-1 font-mono text-[0.62rem] text-ink-faint">↳ inherited from {r.from}</p>
          </div>
        ))}
      </div>
    </>
  );
}

const VIEWS: Record<ModuleKey, (p: { reduce: boolean | null }) => React.ReactNode> = {
  Finance: FinanceView,
  Calendar: CalendarView,
  Approvals: ApprovalsView,
  Members: () => <MembersView />,
  Memory: () => <MemoryView />,
};

/* -------------------------------------------------------------------- frame */
export function DashboardMock({
  className,
  tilt = false,
  auto = false,
  initialModule = "Finance",
}: {
  className?: string;
  tilt?: boolean;
  auto?: boolean;
  initialModule?: ModuleKey;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ModuleKey>(initialModule);
  const [paused, setPaused] = useState(false);
  const View = VIEWS[active];

  // Auto-advance through modules (hero surface); paused on hover, off for reduced motion.
  useEffect(() => {
    if (!auto || reduce || paused) return;
    const id = setInterval(() => {
      setActive((cur) => NAV[(NAV.indexOf(cur) + 1) % NAV.length]);
    }, 4200);
    return () => clearInterval(id);
  }, [auto, reduce, paused]);

  return (
    <div
      className={cn(tilt && "[perspective:2200px]", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="overflow-hidden rounded-2xl border border-line bg-cloud shadow-[0_1px_2px_rgba(12,30,51,0.05),0_50px_140px_-50px_rgba(12,30,51,0.5)] ring-1 ring-ink/[0.03]"
        style={tilt ? { transformStyle: "preserve-3d", transformOrigin: "50% 50%" } : undefined}
        initial={tilt ? { rotateX: 7, rotateY: -12, y: 36, opacity: 0 } : { opacity: 0, y: 16 }}
        whileInView={tilt ? { rotateX: 2, rotateY: -5, y: 0, opacity: 1 } : { opacity: 1, y: 0 }}
        whileHover={tilt && !reduce ? { rotateX: 0, rotateY: 0, scale: 1.004 } : undefined}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: reduce ? 0 : tilt ? 1 : 0.6, ease: EASE }}
      >
        {/* top bar */}
        <div className="flex items-center justify-between gap-3 border-b border-line bg-paper/60 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <Logo className="h-5 w-5 text-grove" />
            <span className="font-display text-sm font-semibold text-ink">Tenure</span>
            <span className="hidden text-ink-faint sm:inline">/</span>
            <span className="hidden text-[0.8rem] text-ink-soft sm:inline">Rochester Finance Club</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-lg border border-line bg-cloud px-2.5 py-1 text-[0.72rem] text-ink-faint lg:inline-flex">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
              Ask or jump to…
            </span>
            <span className="rounded-lg bg-grove px-2.5 py-1 text-[0.72rem] font-medium text-cloud">+ New</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[8.5rem_1fr] lg:grid-cols-[8.5rem_1fr_11rem]">
          {/* clickable module nav */}
          <aside className="hidden flex-col gap-0.5 border-r border-line bg-sand/40 p-3 sm:flex">
            {NAV.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => { setActive(n); setPaused(true); }}
                aria-pressed={n === active}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[0.8rem] transition-colors",
                  n === active ? "bg-cloud font-medium text-ink shadow-[0_1px_2px_rgba(12,30,51,0.06)]" : "text-ink-soft hover:bg-cloud/60",
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={n === active ? "#1c8c5a" : "currentColor"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[n]} /></svg>
                {n}
              </button>
            ))}
            <div className="my-2 h-px bg-line" />
            <p className="px-2 pb-1 font-mono text-[0.54rem] uppercase tracking-wider text-ink-faint">Term</p>
            <span className="px-2 text-[0.74rem] text-ink-soft">2025–26 · Fall</span>
          </aside>

          {/* main, animates on module switch */}
          <div className="min-h-[19.5rem] p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-ink">{active}</p>
              <span className="font-mono text-[0.62rem] text-ink-faint">
                {auto && !reduce ? "auto-touring ↺" : "click a module ↗"}
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
              >
                <View reduce={reduce} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* AI panel, contextual to the active module */}
          <aside className="hidden flex-col gap-3 border-l border-line bg-grove-soft/30 p-4 lg:flex">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cloud shadow-[0_1px_2px_rgba(12,30,51,0.08)]">
                <Logo className="h-3.5 w-3.5 text-grove" />
              </span>
              <span className="text-[0.78rem] font-semibold text-ink">Tenure AI</span>
              <motion.span className="ml-auto h-1.5 w-1.5 rounded-full bg-grove" initial={{ opacity: 1 }} animate={reduce ? undefined : { opacity: [1, 0.3, 1] }} transition={reduce ? undefined : { duration: 2, repeat: Infinity }} />
            </div>
            <p className="text-[0.74rem] leading-relaxed text-ink-soft">Ask anything about the <span className="font-medium text-ink">{active.toLowerCase()}</span> this seat has handled.</p>
            <div className="space-y-1.5">
              {ASKS[active].map((a) => (
                <span key={a} className="block rounded-lg border border-line bg-cloud px-2.5 py-1.5 text-[0.7rem] text-ink-soft">{a}</span>
              ))}
            </div>
            <div className="mt-auto rounded-lg border border-grove/25 bg-cloud p-2.5">
              <p className="text-[0.7rem] leading-relaxed text-ink-soft">Answers cite the real records, people, and decisions behind them.<span className="text-grove-deep"> ↗</span></p>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
