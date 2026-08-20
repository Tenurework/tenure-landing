"use client";

import { useEffect, useState } from "react";
// AnimatePresence stays on motion/react; the ten animated elements below use `m`.
// See HeroShapes.tsx for why this file no longer imports the `motion` proxy.
import { AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";
import { useOnScreen } from "@/lib/use-on-screen";

const EASE = [0.16, 1, 0.3, 1] as const;

type ModuleKey = "Finance" | "Calendar" | "Approvals" | "Members" | "Memory";
const NAV: ModuleKey[] = ["Finance", "Calendar", "Approvals", "Members", "Memory"];

/**
 * Inline marks, drawn rather than typed.
 *
 * These four positions used to hold `📅`, `🔒`, `▲` and `▶`/`⏸` as literal
 * characters. Three problems, all visible: an emoji renders from the system
 * colour font, so it ignored every token in the palette and put full-saturation
 * blue and yellow into a mock built entirely from `--chart-*`; the glyphs are
 * text, so they inherited the mono metrics and sat off the optical baseline of
 * the labels beside them; and `⏸` is absent from IBM Plex Mono, so it fell back
 * to whatever the platform had — on macOS a form that reads as a clipped `u`.
 * Every other mark on this site is a 1.5px stroked SVG on `currentColor`, so
 * these are too.
 */
const Mark = ({ d, className }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={cn("inline-block h-[1em] w-[1em] shrink-0 align-[-0.12em]", className)}
  >
    <path d={d} />
  </svg>
);

const MARK = {
  calendar: "M4 6h16v14H4zM4 9h16M8 3v4M16 3v4",
  lock: "M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3",
  rise: "M12 5l6 8H6z",
  play: "M8 5l11 7-11 7z",
  pause: "M9 5v14M15 5v14",
} as const;

const ICONS: Record<ModuleKey, string> = {
  Finance: "M3 21h18M5 21V11m4 10V7m4 14V9m4 12V5",
  Calendar: "M4 6h16v14H4zM4 9h16M8 3v4M16 3v4",
  Approvals: "M4 5h16v14H4zM8 12l2.5 2.5L16 9",
  Members:
    "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0 0-6M16 20a6 6 0 0 1 5-3",
  Memory: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5",
};

/**
 * Search queries against what is actually indexed.
 *
 * loadSearchCorpus in the deploying repo builds from exactly five sources: memory
 * records, document titles and descriptions, approval requests, events and
 * organizations. Budget, BudgetLine, Transaction, LedgerEntry, Vendor, User and
 * DirectoryPerson are absent — which is why /trust states that finance figures and
 * people records cannot be answered by the assistant. These prompts used to ask
 * exactly those questions, in full sentences the AND-matcher returns nothing for,
 * so the site's most prominent mock demonstrated the one thing its own security
 * page says the product cannot do. They are keyword-shaped and aimed at the
 * indexed kinds.
 *
 * They now live per dataset (`Dataset.asks`), because a prompt is the most
 * sector-specific string in the whole mock: "fall mixer" asked of a literacy
 * charity is the university default leaking through the one panel a visitor
 * reads most closely.
 */

/**
 * THE WORKED EXAMPLE, AS DATA — because there was only ever one of it.
 *
 * Every product illustration on this site was the same student organization:
 * "Rochester Finance Club" in the chrome, membership dues and a gala in the
 * ledger, SCC- seat codes throughout. The prose says Tenure serves universities,
 * nonprofits, SMEs and associations; the pictures said student government, on
 * every route, and a picture is what a visitor actually reads. The four
 * non-university seats in `site.audiences` were never rendered anywhere.
 *
 * It was also the same picture TWICE: the home hero and /product's "one screen"
 * section mounted this component with identical chrome and identical rows, four
 * screens of scrolling apart.
 *
 * So the identity-carrying strings are a parameter. The home hero keeps the
 * university set, because that is the sector the proposed pilot is in and the
 * page says so; /product runs the nonprofit set, so the second appearance is a
 * different organization doing different work rather than a repeat.
 *
 * Only the strings that carry sector identity live here. The mechanism the mock
 * demonstrates — a ledger, a term, an approval chain, a memory card with the
 * holder who filed it — is the same in every sector, which is the argument.
 */
export type DatasetKey = "university" | "nonprofit";

type Dataset = {
  org: string;
  term: string;
  ledger: { t: string; a: string; d: string; up: boolean }[];
  memory: { tag: string; t: string; from: string }[];
  /** Keyword-shaped prompts for the assistant rail. See the ASKS note below. */
  asks: Record<ModuleKey, string[]>;
};

const DATASETS: Record<DatasetKey, Dataset> = {
  university: {
    org: "Rochester Finance Club",
    term: "2025–26 · Fall",
    /*
      EVERY ROW IS A TRANSACTION TYPE THE PRODUCT ACTUALLY HAS.

      `TransactionType` in the deploying schema is ALLOCATION | SPEND |
      REIMBURSEMENT | ADJUSTMENT, and `LedgerKind` is SPEND | REIMBURSEMENT |
      ADJUSTMENT. There is no income type, and a repo-wide grep for "dues" or
      "paid" returns nothing — there is no per-member payment tracking anywhere
      in the schema.

      So the two rows that used to open this ledger were both unbuildable: a
      "+$840 Membership dues, 28 paid" income line, with a per-member paid count,
      in the most-viewed illustration on the site. They are now an allocation and
      a reimbursement, which is what money coming INTO a budget really looks like
      here.
    */
    ledger: [
      { t: "Term allocation from the office", a: "+$8,400", d: "Sep 14", up: true },
      { t: "Fenwick Print, banners", a: "−$240", d: "Oct 2", up: false },
      { t: "Reimbursed: Halden Catering overpay", a: "+$180", d: "Oct 9", up: true },
      { t: "Gala venue deposit", a: "−$1,500", d: "Oct 18", up: false },
    ],
    memory: [
      { tag: "Vendor", t: "Halden Catering, sponsorship renewal", from: "Maya Chen · 2023–24" },
      { tag: "Lesson", t: "Never book the gala on finals week", from: "Marcus Lee · 2024–25" },
      { tag: "Vendor", t: "Fenwick Print, 15% club rate", from: "Jordan Lee · 2024–25" },
    ],
    asks: {
      Finance: ["gala budget approval", "allocation decision"],
      Calendar: ["gala venue", "spring formal"],
      Approvals: ["OSE review", "vendor request"],
      Members: ["handover notes", "roster change approval"],
      Memory: ["fall mixer", "sponsor renewal"],
    },
  },
  nonprofit: {
    org: "Riverside Literacy Alliance",
    term: "FY26 · Q2",
    ledger: [
      { t: "Programme allocation, Ash Foundation", a: "+$25,000", d: "Sep 14", up: true },
      { t: "Tutor stipends, October", a: "−$6,400", d: "Oct 2", up: false },
      { t: "Reimbursed: duplicate room hire", a: "+$820", d: "Oct 9", up: true },
      { t: "Branch library room hire", a: "−$820", d: "Oct 18", up: false },
    ],
    memory: [
      { tag: "Budget", t: "Ash Foundation, renewal due each March", from: "Dana Osei · FY24" },
      { tag: "Lesson", t: "Report on outcomes, not attendance", from: "Priya Nair · FY25" },
      { tag: "Vendor", t: "Branch library, no charge before 4pm", from: "Sana Ali · FY25" },
    ],
    asks: {
      Finance: ["grant budget approval", "stipend decision"],
      Calendar: ["reading night venue", "volunteer training"],
      Approvals: ["board review", "vendor request"],
      Members: ["handover notes", "volunteer rota approval"],
      Memory: ["grant renewal", "outcome reporting"],
    },
  },
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
        tone === "amber" && "bg-warning-subtle text-warning",
        tone === "coral" && "bg-danger-subtle text-danger",
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
          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <m.path d={`${line}L${w} ${h}L0 ${h}Z`} fill="url(#dm-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.7, delay: 0.3 }} />
      {/* pathLength is an SVG attribute animation, part of the core animation
          feature set — not a layout or drag feature — so it survives domAnimation. */}
      <m.path d={line} fill="none" stroke="var(--chart-1)" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 1.1, ease: EASE }} />
      <m.circle cx={last[0]} cy={last[1]} r="3.5" fill="var(--chart-1)" stroke="var(--surface)" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: reduce ? 0 : 0.3, delay: 1.1 }} />
    </svg>
  );
}

/* ------------------------------------------------------------- module views */
function FinanceView({ reduce, data }: { reduce: boolean | null; data: Dataset }) {
  // Categorical chart tokens, not literals — chart-6 is the neutral slate, which
  // is what "Reserve" (the unallocated remainder) needs; chart-4 is the red that
  // --danger is built on and would read as an alert here.
  const cats = [
    { label: "Events", pct: 38, color: "var(--chart-1)" },
    { label: "Operations", pct: 24, color: "var(--chart-2)" },
    { label: "Marketing", pct: 16, color: "var(--chart-3)" },
    { label: "Reserve", pct: 22, color: "var(--chart-6)" },
  ];
  const rows = data.ledger;
  return (
    <>
      <div className="rounded-xl border border-line bg-paper/40 p-3.5">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-mono text-[0.54rem]">Treasury balance</p>
            <p className="mt-1 font-mono text-2xl font-semibold tnum text-ink">$12,400</p>
            <p className="flex items-center gap-1 text-[0.7rem] font-medium text-grove">
              <Mark d={MARK.rise} className="h-[0.72em] w-[0.72em] fill-current" />
              $1,300 · 11.7% this month
            </p>
          </div>
          <span className="rounded-md border border-line bg-cloud px-2 py-0.5 font-mono text-[0.6rem] text-ink-soft">$18,000 budget</span>
        </div>
        <AreaChart reduce={reduce} />
      </div>
      <div className="mt-3">
        <p className="label-mono text-[0.54rem]">Budget by category</p>
        <div className="mt-1.5 flex h-2.5 w-full overflow-hidden rounded-full">
          {cats.map((c) => (
            <m.span key={c.label} style={{ backgroundColor: c.color }} initial={{ width: "0%" }} animate={{ width: `${c.pct}%` }} transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: 0.2 }} />
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
    { t: "Spring Gala", d: "Apr 12 · 7:00p", v: "The Old Exchange", s: "Confirmed", tone: "grove" as const },
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
          <m.div
            key={e.t}
            className={cn(
              "rounded-xl border bg-paper/40 p-3",
              e.tone === "coral" ? "border-brand-coral/40" : "border-line",
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
              <span className="inline-flex items-center gap-1">
                <Mark d={MARK.calendar} />
                {e.d}
              </span>
              <span className="text-ink-faint">{e.v}</span>
            </div>
            {e.tone === "coral" && (
              <p className="mt-1.5 flex items-center gap-1 text-[0.64rem] font-medium text-danger">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-coral" />
                Hard conflict, Schlegel 207 double-booked 5:00–6:30p
              </p>
            )}
          </m.div>
        ))}
      </div>
    </>
  );
}

// The real chain has TWO gates, not four steps, and there is no Advisor gate:
// DRAFT -> PENDING_PRESIDENT -> PENDING_OSE -> APPROVED.
const APPROVAL_STEPS = ["Draft", "President", "OSE", "Approved"];
function ApprovalsView({ reduce }: { reduce: boolean | null }) {
  const active = 3; // "OSE" pending
  const queue = [
    { t: "Spring Gala, $4,200 budget", tag: "budget", at: "OSE review", tone: "amber" as const },
    { t: "Halden Catering, vendor renewal", tag: "vendor", at: "Approved", tone: "grove" as const },
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
                <m.span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[0.58rem] font-semibold",
                    i < active && "border-grove bg-grove text-on-accent",
                    i === active && "border-brand-gold bg-warning-subtle text-warning",
                    i > active && "border-line bg-cloud text-ink-faint",
                  )}
                  initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 0.3, delay: 0.1 + i * 0.12 }}
                >
                  {i < active ? "✓" : i + 1}
                </m.span>
                <span className="text-[0.52rem] text-ink-faint">{s}</span>
              </div>
              {i < APPROVAL_STEPS.length - 1 && (
                <div className="mx-1 h-[2px] flex-1 overflow-hidden rounded-full bg-line">
                  <m.span
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
          <Mark d={MARK.lock} />{" "}
          decided by VP Finance &amp; Operations · append-only step
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
    { n: "Aisha Khan", r: "President", seat: "RFC-PRES", y: "Active" },
    { n: "Dev Patel", r: "VP Finance & Operations", seat: "RFC-VP-FINA-OPER", y: "Active" },
    { n: "Sam Rivera", r: "VP Events & Partnerships", seat: "RFC-VP-EVEN-PART", y: "Active" },
    { n: "Leah Cohen", r: "VP Sponsorship", seat: "RFC-VP-SPON", y: "Shadow" },
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
          <span className="w-24">Seat</span>
          <span className="w-16">Status</span>
        </div>
        {roster.map((m, i) => (
          <div key={m.n} className={cn("flex items-center gap-2 px-3 py-2 text-[0.76rem]", i > 0 && "border-t border-line")}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-grove-soft font-mono text-[0.56rem] font-semibold text-grove-deep">
              {m.n.split(" ").map((p) => p[0]).join("")}
            </span>
            <span className="flex-1 truncate text-ink">{m.n}</span>
            <span className="w-24 truncate font-mono text-[0.58rem] text-ink-soft">{m.seat}</span>
            <span className={cn("w-16", m.y === "Shadow" ? "text-brand-gold" : "text-grove")}>{m.y}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function MemoryView({ data }: { data: Dataset }) {
  const recs = [
    ...data.memory,
    { tag: "Playbook", t: "Annual fundraiser, run of show", from: "Priya Nair · last term" },
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

type ViewProps = { reduce: boolean | null; data: Dataset };

const VIEWS: Record<ModuleKey, (p: ViewProps) => React.ReactNode> = {
  Finance: FinanceView,
  Calendar: CalendarView,
  Approvals: ApprovalsView,
  Members: () => <MembersView />,
  Memory: ({ data }) => <MemoryView data={data} />,
};

/* -------------------------------------------------------------------- frame */
export function DashboardMock({
  className,
  tilt = false,
  auto = false,
  initialModule = "Finance",
  dataset = "university",
}: {
  className?: string;
  tilt?: boolean;
  auto?: boolean;
  initialModule?: ModuleKey;
  /**
   * Which worked example to render. Two placements mount this component; they
   * must not pass the same one, or the site shows the same organization twice
   * and reads as university-only whatever the prose beside it says.
   */
  dataset?: DatasetKey;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<ModuleKey>(initialModule);
  const [paused, setPaused] = useState(false);
  const { ref: frameRef, onScreen } = useOnScreen<HTMLDivElement>();
  const View = VIEWS[active];
  const data = DATASETS[dataset];

  // Auto-advance through modules (hero surface); paused on hover, off for reduced
  // motion, and — added after measurement — stopped while the mock is off screen.
  //
  // Each tick swaps a whole dashboard subtree, and this ran for the entire session:
  // on a mobile viewport the hero scrolls away almost immediately and the tour kept
  // re-rendering behind the reader for as long as the tab stayed open. Gating it on
  // visibility was measured at ~438 ms of style and layout on its own, and ~1,053 ms
  // together with SeatMechanism's timer.
  useEffect(() => {
    if (!auto || reduce || paused || !onScreen) return;
    const id = setInterval(() => {
      // Checked per tick, not once: a gate evaluated when the effect runs would
      // strand the tour permanently if the page happened to start backgrounded.
      if (document.visibilityState === "hidden") return;
      setActive((cur) => NAV[(NAV.indexOf(cur) + 1) % NAV.length]);
    }, 4200);
    return () => clearInterval(id);
  }, [auto, reduce, paused, onScreen]);

  return (
    <div
      ref={frameRef}
      className={cn(tilt && "[perspective:2200px]", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <LazyMotion features={domAnimation} strict>
      <m.div
        className="overflow-hidden rounded-2xl border border-line bg-cloud shadow-[var(--shadow-lg)] ring-1 ring-ink/[0.03]"
        style={tilt ? { transformStyle: "preserve-3d", transformOrigin: "50% 50%" } : undefined}
        // Starts visible. This is the hero product surface: rendering the whole
        // mock at opacity:0 meant the primary visual was absent until the
        // bundle booted, and absent entirely without JavaScript. The tilt is
        // still animated in, which is the part that reads as motion.
        initial={tilt ? { rotateX: 7, rotateY: -12, y: 36, opacity: 1 } : { opacity: 1, y: 16 }}
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
            <span className="hidden text-[0.8rem] text-ink-soft sm:inline">{data.org}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-lg border border-line bg-cloud px-2.5 py-1 text-[0.72rem] text-ink-faint lg:inline-flex">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
              Ask or jump to…
            </span>
            <span className="rounded-lg bg-grove px-2.5 py-1 text-[0.72rem] font-medium text-on-accent">+ New</span>
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
                  n === active ? "bg-cloud font-medium text-ink shadow-[var(--shadow-sm)]" : "text-ink-soft hover:bg-cloud/60",
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={n === active ? "var(--accent)" : "currentColor"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[n]} /></svg>
                {n}
              </button>
            ))}
            <div className="my-2 h-px bg-line" />
            <p className="px-2 pb-1 font-mono text-[0.54rem] uppercase tracking-wider text-ink-faint">Term</p>
            <span className="px-2 text-[0.74rem] text-ink-soft">{data.term}</span>
          </aside>

          {/* main, animates on module switch */}
          <div className="min-h-[19.5rem] p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-ink">{active}</p>
              {/*
                A real control, not a status label. WCAG 2.2.2 (Level A)
                requires a way to pause anything that auto-updates for more
                than five seconds; this rotated every 4.2s and could only be
                stopped by hovering a mouse, which a touch or keyboard user
                does not have.
              */}
              {auto && !reduce ? (
                <button
                  type="button"
                  onClick={() => setPaused((v) => !v)}
                  aria-pressed={paused}
                  className="inline-flex h-6 min-w-6 items-center gap-1 rounded-md px-1.5 font-mono text-[0.62rem] text-text-secondary hover:text-ink"
                >
                  <Mark d={paused ? MARK.play : MARK.pause} className={paused ? "fill-current" : undefined} />
                  {paused ? "resume tour" : "pause tour"}
                </button>
              ) : (
                <span className="font-mono text-[0.62rem] text-text-secondary">
                  click a module ↗
                </span>
              )}
            </div>
            <AnimatePresence mode="wait">
              <m.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
              >
                <View reduce={reduce} data={data} />
              </m.div>
            </AnimatePresence>
          </div>

          {/* AI panel, contextual to the active module */}
          <aside className="hidden flex-col gap-3 border-l border-line bg-grove-soft/30 p-4 lg:flex">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cloud shadow-[var(--shadow-sm)]">
                <Logo className="h-3.5 w-3.5 text-grove" />
              </span>
              <span className="text-[0.78rem] font-semibold text-ink">Tenure AI</span>
              <m.span className="ml-auto h-1.5 w-1.5 rounded-full bg-grove" initial={{ opacity: 1 }} animate={reduce ? undefined : { opacity: [1, 0.3, 1] }} transition={reduce ? undefined : { duration: 2, repeat: Infinity }} />
            </div>
            {/* Module-independent: the caption used to interpolate the active module,
                so it promised answers "about the finance" and "about the members" —
                the two kinds that are not in the search corpus at all. */}
            <p className="text-[0.74rem] leading-relaxed text-ink-soft">Search the decisions, events and records this seat has filed.</p>
            <div className="space-y-1.5">
              {data.asks[active].map((a) => (
                <span key={a} className="block rounded-lg border border-line bg-cloud px-2.5 py-1.5 text-[0.7rem] text-ink-soft">{a}</span>
              ))}
            </div>
            <div className="mt-auto rounded-lg border border-grove/25 bg-cloud p-2.5">
              <p className="text-[0.7rem] leading-relaxed text-ink-soft">Answers link the records, files, and decisions behind them.<span className="text-grove-deep"> ↗</span></p>
            </div>
          </aside>
        </div>
      </m.div>
      </LazyMotion>
    </div>
  );
}
