"use client";

import { useState, type ReactNode } from "react";
import { Container, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Panel, PanelBar, PanelNote, PanelTag } from "@/components/ui/Panel";
import { Segmented, type SegmentItem } from "@/components/ui/Segmented";
import { Logo } from "@/components/brand/Logo";
import { Share, GateRail } from "@/components/visuals/Charts";
import { creatableCardTypes } from "@/lib/claims";

/**
 * WHAT TENURE RUNS — twelve modules, one at a time.
 *
 * THIS SECTION IS THE REASON THE COMPACTION PASS EXISTS.
 *
 * It used to be a nine-cell bento grid: nine bordered cards, each with an icon, a
 * cluster tag, a heading, a description and a row of chips, all painted at once.
 * Forty-five pieces of information in one viewport, at a point in the page where
 * the reader has been told what a seat is and nothing else. Nobody reads a
 * nine-card grid; they scan two cards, conclude "it does a lot of things", and
 * scroll. It also cost roughly 1,600px — an eighth of the entire home page — to
 * say something a rail of eleven names says better.
 *
 * The rewrite is one panel. The rail on the left lists all eleven module names,
 * so the completeness argument the grid was making is still made — and made more
 * legibly, because eleven names scan in about two seconds where nine cards do
 * not. The pane on the right shows ONE module: its sentence, and whatever
 * artefact makes that module concrete (a gate rail, a budget share, a conflict, a
 * record list). One thing to read at a time.
 *
 * TWO DETAILS THAT ARE NOT FREE TO CHANGE
 *
 * 1. **The card-kind chips are in the permanent footer, not in the Memory
 *    pane.** `claims.spec.ts` asserts `getByTestId("memory-card-kinds")` is
 *    *visible* on a fresh load of "/" and equals `creatableCardTypes` exactly.
 *    Inside a switchable pane that assertion would depend on which module happens
 *    to be selected by default — a test that passes for a reason unrelated to
 *    what it is checking. In the footer it is unconditional.
 * 2. **"Credential" is not in that list and must never return.** The product
 *    retired the type because MemoryRecord.content is an unencrypted Json column
 *    that any ACTIVE seat can write and that is indexed for search, so a kind
 *    called "Login or access info" invited people to paste passwords into a shared
 *    database against a control that was never written. The list is imported from
 *    the register's mirror of the product enum rather than typed here, which is
 *    what makes that enforceable.
 */

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-4 w-4",
  "aria-hidden": true,
};

type Cluster = "Run" | "Govern" | "Remember";

type Module = {
  key: string;
  /** Rail label. Short enough not to truncate at the rail's width. */
  label: string;
  cluster: Cluster;
  icon: ReactNode;
  /** The one sentence. */
  body: string;
  /** The artefact that makes it concrete. */
  detail: ReactNode;
};

function Chips({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-md border border-line bg-paper/60 px-1.5 py-0.5 font-mono text-mark text-ink-soft"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="label-mono text-mark">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const MODULES: Module[] = [
  {
    key: "ai",
    label: "Tenure AI",
    cluster: "Remember",
    icon: <Logo className="h-4 w-4" />,
    body: "Answers drawn only from records your seat can already open, with the sources linked.",
    detail: (
      <Field label="A question against the record">
        <div className="space-y-2">
          {/* Keyword-shaped, not a sentence. Retrieval is an AND over every query
              token longer than one character, with no stemming or stopword
              removal, so "How do we run elections?" is a five-term AND including
              "how", "do" and "we" and returns nothing (C-007). */}
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm border border-line bg-paper/60 px-3 py-1.5 text-caption text-ink-soft">
            venue deposit
          </p>
          <div className="w-fit max-w-[92%] rounded-2xl rounded-bl-sm border border-grove/25 bg-grove-soft/60 px-3 py-2">
            <p className="text-caption leading-relaxed text-ink">
              Held against the Spring Gala booking: $1,500, refundable to 14 days out.
            </p>
            <span className="mt-1.5 inline-block font-mono text-mark uppercase text-grove-deep">
              2 records ↗
            </span>
          </div>
          <p className="pt-1 text-meta text-ink-faint">
            Short, specific queries work. If the model is unavailable the ranked
            sources still come back.
          </p>
        </div>
      </Field>
    ),
  },
  {
    key: "approvals",
    label: "Approvals",
    cluster: "Govern",
    icon: (
      <svg {...svg}>
        <rect x="4" y="4" width="16" height="16" rx="2.5" />
        <path d="M8.5 12l2.4 2.4L16 9" />
      </svg>
    ),
    body: "Two gates, president then office, routed by seat across seven request types.",
    detail: (
      <div className="space-y-4">
        <Field label="Spring Gala · $4,200 budget">
          <GateRail stages={["Draft", "President", "Office", "Approved"]} at={2} />
        </Field>
        <Field label="Request types">
          <Chips
            items={["event", "budget", "vendor", "comms", "document", "roster", "exception"]}
          />
        </Field>
      </div>
    ),
  },
  {
    key: "finance",
    label: "Finance",
    cluster: "Run",
    icon: (
      <svg {...svg}>
        <path d="M3 21h18" />
        <rect x="5" y="11" width="3.4" height="7" rx="1" />
        <rect x="10.3" y="6" width="3.4" height="12" rx="1" />
        <rect x="15.6" y="14" width="3.4" height="4" rx="1" />
      </svg>
    ),
    body: "Budgets, allocations, spend, reimbursements and vendor terms in one ledger, approved in place.",
    /*
      THE SAME NUMBERS TWICE, IN TWO COLOUR SCHEMES.

      This pane used to repeat the hero mock's ledger exactly, $12,400 of
      $18,000 and the identical Events 38 / Operations 24 / Marketing 16 /
      Reserve 22 bar, about four screens further down the same page. Worse, the
      two disagreed: `DashboardMock` painted Reserve in `--chart-6`, the neutral
      slate, while `Share` handed the fourth slice `--chart-4`, the hue `--danger`
      is built on. One dataset, two pictures, one of them alarming.

      So this pane shows a different FACET of Finance rather than the same chart
      again: where the money actually goes once it is committed. The hero keeps
      the category split, and nothing on the page is drawn twice.
    */
    detail: (
      <div className="space-y-4">
        <Field label="Where a committed dollar sits">
          <Share
            slices={[
              { label: "Paid out", pct: 46 },
              { label: "Approved, not yet invoiced", pct: 31 },
              { label: "In the approval chain", pct: 12 },
              { label: "Uncommitted", pct: 11, neutral: true },
            ]}
          />
        </Field>
        <Field label="Reimbursements this term">
          <Chips items={["14 filed", "11 approved", "2 in gate 2", "1 returned"]} />
        </Field>
      </div>
    ),
  },
  {
    key: "calendar",
    label: "Calendar",
    cluster: "Run",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      </svg>
    ),
    body: "Hard and soft conflicts caught before anything is published, not after.",
    detail: (
      <Field label="Caught on publish">
        <div className="space-y-2">
          <p className="flex items-center gap-2 rounded-lg border border-brand-coral/30 bg-brand-coral/[0.06] px-2.5 py-2 text-meta font-medium text-danger">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-coral" />
            Hard conflict, Schlegel 207 double-booked 5:00 to 6:30p
          </p>
          <p className="flex items-center gap-2 rounded-lg border border-brand-gold/30 bg-warning-subtle/60 px-2.5 py-2 text-meta font-medium text-warning">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
            Soft overlap, two sponsor events the same evening
          </p>
        </div>
      </Field>
    ),
  },
  {
    key: "memory",
    label: "Institutional memory",
    cluster: "Remember",
    icon: (
      <svg {...svg}>
        <path d="M12 3l8.5 4.5-8.5 4.5L3.5 8z" />
        <path d="M3.5 12l8.5 4.5 8.5-4.5M3.5 15.5l8.5 4.5 8.5-4.5" />
      </svg>
    ),
    body: "Decisions and know-how filed against the seat as the work happens, not written up afterwards.",
    detail: (
      <Field label="Filed against this seat">
        <ul className="space-y-1.5">
          {[
            { tag: "Vendor", t: "Halden Catering, sponsorship renewal", from: "Maya Chen · 2023–24" },
            { tag: "Playbook", t: "Spring Gala, run of show", from: "Priya Nair · 2024–25" },
            { tag: "Lesson", t: "Why we moved the fall mixer", from: "Board · 2022–23" },
          ].map((r) => (
            <li key={r.t} className="rounded-lg border border-line bg-paper/50 p-2.5">
              <div className="flex items-center gap-1.5">
                <span className="rounded border border-line bg-cloud px-1 py-0.5 font-mono text-mark uppercase tracking-wide text-ink-faint">
                  {r.tag}
                </span>
                <span className="text-caption text-ink">{r.t}</span>
              </div>
              <p className="mt-1 font-mono text-mark text-ink-faint">
                ↳ inherited from {r.from}
              </p>
            </li>
          ))}
        </ul>
      </Field>
    ),
  },
  {
    key: "members",
    label: "Members & seats",
    cluster: "Run",
    icon: (
      <svg {...svg}>
        <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
        <rect x="6.5" y="8" width="4.5" height="4.5" rx="1.2" />
        <path d="M14 9h3.5M14 12h2.5M6.75 15.5h10.75" />
      </svg>
    ),
    body: "Access follows the seat: read-only before the term, revoked after it, record kept.",
    detail: (
      <Field label="Seat states">
        <div className="space-y-2">
          {[
            { s: "Active", n: "Dev Patel", note: "write access, this term" },
            { s: "Shadow", n: "Leah Cohen", note: "read-only, term starts in May" },
            { s: "Alumni", n: "Maya Chen", note: "access revoked, record kept" },
          ].map((r) => (
            <div
              key={r.s}
              className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-lg border border-line bg-paper/50 px-2.5 py-2"
            >
              <span className="rounded-md bg-surface-subtle px-1.5 py-0.5 font-mono text-mark font-medium uppercase tracking-wide text-text-secondary">
                {r.s}
              </span>
              <span className="text-caption text-ink">{r.n}</span>
              <span className="text-meta text-ink-faint">{r.note}</span>
            </div>
          ))}
        </div>
      </Field>
    ),
  },
  {
    key: "documents",
    label: "Documents",
    cluster: "Remember",
    icon: (
      <svg {...svg}>
        <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    ),
    body: "Contracts, decks and spreadsheets open inside Tenure rather than downloading to a laptop.",
    detail: (
      <div className="space-y-4">
        <Field label="Opens in place">
          <Chips items={[".pdf", ".docx", ".xlsx", ".pptx"]} />
        </Field>
        <Field label="Editing">
          {/*
            "versioned" is deliberately absent, and `forbiddenPhrases` blocks it.
            Document.version is a bare Int used for the optimistic lock and the
            audit row, there is no DocumentVersion model, no prior-version
            retrieval and no restore UI, and saves overwrite the same object key.
            Sitting between two genuine editing features, the word read as
            version history.
          */}
          <Chips items={["text and spreadsheets edit in place", "save-conflict check"]} />
        </Field>
      </div>
    ),
  },
  {
    key: "audit",
    label: "Audit trail",
    cluster: "Govern",
    icon: (
      <svg {...svg}>
        <path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6z" />
        <path d="M9.5 12l1.8 1.8L15 10" />
      </svg>
    ),
    body: "Refusals are recorded as permanently as approvals, and rows are only ever created.",
    detail: (
      <Field label="Two rows, one action each">
        <div className="space-y-1.5">
          <p className="rounded-lg border border-line-dark bg-band px-2.5 py-1.5 font-mono text-mark text-inverse/75">
            <span className="text-grove-bright">budget.approved</span> · SCC-VP-FINA-OPER · allow
          </p>
          <p className="rounded-lg border border-line-dark bg-band px-2.5 py-1.5 font-mono text-mark text-inverse/75">
            <span className="text-brand-coral">roster.export</span> · SCC-VP-SPON · deny
          </p>
          <p className="pt-1 text-meta text-ink-faint">
            Coverage is partial and append-only is enforced by the application, not
            by cryptography. The full scope is on Security.
          </p>
        </div>
      </Field>
    ),
  },
  {
    key: "messages",
    label: "Messages",
    cluster: "Remember",
    icon: (
      <svg {...svg}>
        <path d="M4 5h16v11H9l-4 3v-3H4z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    ),
    body: "Read and post rules differ by conversation type, so a board channel is not a group chat.",
    detail: (
      <Field label="Conversation types">
        <Chips items={["DM", "board channel", "approval thread", "broadcast"]} />
      </Field>
    ),
  },
  {
    key: "cross-org",
    label: "Cross-org work",
    cluster: "Govern",
    icon: (
      <svg {...svg}>
        <circle cx="7" cy="8" r="3" />
        <circle cx="17" cy="8" r="3" />
        <path d="M2.5 19a4.5 4.5 0 0 1 9 0M12.5 19a4.5 4.5 0 0 1 9 0" />
      </svg>
    ),
    /*
      REWRITTEN AGAINST THE SCHEMA. This said "Two organizations co-hosting run
      the same approval path", the two-gate chain the site advertises elsewhere.
      The product does not do that: `CollabStatus` in the deploying schema is
      PENDING_OSE | APPROVED | DECLINED, a SINGLE office decision, and the
      schema's own comment says "clubs post collaboration calls; other clubs
      raise interest; the OSE Director sits in the middle and approves each
      collaboration". Claiming the fuller mechanism overstated a governance
      control, which is the one direction this site must never round in.
    */
    body: "One organization posts work it wants help with, another raises its hand, and the office above them approves the pairing in one recorded decision.",
    detail: (
      <Field label="Collaboration request">
        <Chips items={["posted to the feed", "interest raised", "one office decision"]} />
      </Field>
    ),
  },
  {
    /*
      ADDED. The rail makes an explicit completeness argument, "eleven modules",
      "the rail lists all eleven", and omitted a module the product ships and
      routes by seat. A completeness claim with a hole in it is worse than no
      claim: the reader who finds the hole discounts the whole list.
    */
    key: "resources",
    label: "Board resources",
    cluster: "Run",
    icon: (
      <svg {...svg}>
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
        <path d="M12 4h6.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H12" />
        <path d="M7.5 8.5h2M14.5 8.5h2" />
      </svg>
    ),
    body: "The forms, guides, policies and checklists a board actually needs, routed to the seats that need them.",
    detail: (
      <Field label="Held as records, not code">
        <Chips items={["form", "guide", "policy", "tool", "checklist"]} />
      </Field>
    ),
  },
  {
    key: "reports",
    label: "Reports & search",
    cluster: "Govern",
    icon: (
      <svg {...svg}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" />
      </svg>
    ),
    body: "Spending, participation and continuity in one report the board can read without a spreadsheet.",
    detail: (
      <Field label="Scope">
        <Chips items={["board-ready", "seat-scoped search"]} />
      </Field>
    ),
  },
];

const RAIL: SegmentItem[] = MODULES.map((m) => ({
  key: m.key,
  label: m.label,
  icon: m.icon,
}));

export function Platform() {
  // Defaults to Finance, not the first module. Tenure AI is the shortest pane of
  // the eleven and left 267px of the 549px right-hand pane empty on load — the
  // tallest card on the page, opening half blank. Finance renders a real chart
  // and fills it.
  const [active, setActive] = useState("finance");
  const mod = MODULES.find((m) => m.key === active) ?? MODULES[0];

  return (
    <Section id="platform" from="canvas" tone="surface" backdrop="grid">
      <Container>
        <SectionHead
          align="center"
          eyebrow="The platform"
          title={
            <>
              One governed system for everything the organization{" "}
              <span className="text-gradient">runs on</span>.
            </>
          }
          lead="Twelve modules on one record. Work happens here, so the record writes itself, pick any one to see what it actually does."
        />

        <Reveal delay={0.14} className="mt-7">
          <Panel>
            <PanelBar
              title="Tenure"
              meta="one organization · one term · one record"
              aside={<PanelTag>{`${MODULES.length} modules`}</PanelTag>}
            />

            {/*
              THE SELECTOR IS ABOVE THE PANE, NOT BESIDE IT.

              It was a `PanelRail` in a `md:grid-cols-[13.5rem_1fr]`. Eleven rail
              rows measure 549px; the tallest detail pane is about 290px, and a
              grid row stretches its cells to the tallest sibling, so the right
              half of the biggest card on the home page rendered 440px of blank
              white on every module except one. Widening the pane could not fix
              it, because the rail's height is set by the module COUNT, which is
              the one number this section exists to show.

              Above it, the rail's height is one wrapped chip row, the detail
              takes the full 1,152px measure, enough to set the sentence beside
              its artefact rather than under it, and the section loses ~200px.

              It also stops this panel and `OfficeConsole` being the same
              picture twice on one page. Both were a left rail against a right
              detail pane closed by a footnote; the reader met the second one
              and read it as the first one scrolling past again.

              `Segmented` wraps here and scrolls below `sm`, which is the split
              its own comment argues for: wrapping is what broke the connector
              tabs at 390px, and a scrolling row is what fixed them.
            */}
            <div className="border-b border-line px-4 py-3 sm:px-6">
              <Segmented
                label="Platform modules"
                items={RAIL}
                active={active}
                onSelect={setActive}
                wrap
                className="border-0 bg-transparent p-0"
              />
            </div>

            {/* The single view. `min-h` is set from the tallest pane so switching
                modules does not jump the page under the reader’s cursor, the
                one thing a tab control must never do. */}
            <div className="min-h-[12.5rem] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-title-sm text-ink">
                  {mod.label}
                </h3>
                <span className="rounded-full border border-line bg-paper/70 px-2 py-0.5 font-mono text-mark uppercase tracking-wide text-ink-faint">
                  {mod.cluster}
                </span>
              </div>
              <div className="mt-2 grid gap-x-10 gap-y-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
                <p className="text-body leading-relaxed text-ink-soft measure">
                  {mod.body}
                </p>
                <div className="max-w-xl">{mod.detail}</div>
              </div>
            </div>

            <PanelNote className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="label-mono">Knowledge card kinds</span>
              {/* testId: claims.spec.ts asserts this row equals creatableCardTypes,
                  and asserts it is VISIBLE on a fresh load, which is why it lives
                  in the permanent footer rather than inside the Memory pane. A
                  <div>, because the spec reads the row with allInnerTexts() and
                  splits on newlines: flex children of a block container give one
                  chip per line, which is the shape it compares against. */}
              <div data-testid="memory-card-kinds" className="flex flex-wrap gap-1.5">
                {creatableCardTypes.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-line bg-cloud px-1.5 py-0.5 font-mono text-mark text-ink-soft"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </PanelNote>
          </Panel>
        </Reveal>
      </Container>
    </Section>
  );
}
