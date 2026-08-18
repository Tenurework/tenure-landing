import type { ReactNode } from "react";
import Link from "next/link";
import { Container, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ContactSales } from "@/components/ui/ContactSales";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { Panel, PanelBar, PanelNote, PanelTag } from "@/components/ui/Panel";
import { DashboardMock } from "@/components/visuals/DashboardMock";
import { ConnectorMatrix } from "@/components/visuals/ConnectorMatrix";
import { pageMetadata } from "@/lib/metadata";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProductAtWork } from "@/components/home/ProductAtWork";

export const metadata = pageMetadata("/product");

/**
 * /product: mechanisms and surfaces, for a reader who is already interested.
 *
 * WHAT THE COMPACTION PASS CHANGED HERE.
 *
 * The page ran eight sections and 9.2 desktop viewports, and three of them were
 * grids: four "what it captures" record cards, three "how it works" steps, four
 * audience cards. The audience cards were the worst of them — they were the only
 * place on the whole site that said Tenure serves nonprofits, SMEs and
 * associations, and they were parked three routes deep where none of those
 * readers would ever reach them. They now open the argument on the HOME page and
 * are gone from here rather than rendered twice.
 *
 * `ToolLogos` is gone too. It rendered three file-format lanes that were a near
 * verbatim copy of the home page's `Integrations` section — the same three
 * headings, the same sentences, and ".xlsx" listed twice inside each. Both are
 * replaced by one `ConnectorMatrix`, which answers the question a buyer actually
 * asks ("does it work with Slack, Drive, Teams?") instead of the narrower one
 * those two sections were willing to answer.
 */

const svgProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** The four kinds of record that fill as the work happens. */
const RECORDS: { n: string; t: string; d: string; icon: ReactNode }[] = [
  {
    n: "01",
    t: "Contacts & relationships",
    d: "Sponsors, funders, partners and alumni, with the warm intro and the last conversation kept behind each name.",
    icon: (
      <svg {...svgProps} aria-hidden>
        <rect x="3" y="4" width="7" height="6" rx="1.5" />
        <rect x="14" y="14" width="7" height="6" rx="1.5" />
        <path d="M10 7h4a3 3 0 0 1 3 3v4" />
      </svg>
    ),
  },
  {
    n: "02",
    t: "Deals & numbers",
    d: "Vendors, pricing and budgets — the real terms that were agreed, not a number someone half-remembers.",
    icon: (
      <svg {...svgProps} aria-hidden>
        <path d="M3 21h18" />
        <rect x="5" y="11" width="3.4" height="7" rx="1" />
        <rect x="10.3" y="6" width="3.4" height="12" rx="1" />
        <rect x="15.6" y="14" width="3.4" height="4" rx="1" />
      </svg>
    ),
  },
  {
    n: "03",
    t: "Decisions & rationale",
    d: "What leadership chose and why, so next year does not relitigate a call that was already settled.",
    icon: (
      <svg {...svgProps} aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M8.5 12.5l2.4 2.4 4.6-5" />
      </svg>
    ),
  },
  {
    n: "04",
    t: "Files & playbooks",
    d: "Decks, timelines and run-of-show checklists — the documents that carried the work, not a dead folder.",
    icon: (
      <svg {...svgProps} aria-hidden>
        <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
];

const POINTS: { t: string; d: string }[] = [
  {
    t: "Ready on day one",
    // This was the one unqualified promise on the site: "a brand-new officer's
    // first question gets a sourced answer rather than a shrug", against a
    // retriever that requires every word of the question to appear literally in
    // one record. The limit travels with the claim now.
    d: "Tenure AI answers from the knowledge, decisions and events recorded against the seat, from day one. Retrieval is literal keyword matching — every word of a question has to appear in a record — so short, specific queries work and full sentences often return nothing.",
  },
  {
    // "Every answer cites its sources" is not an enforced property. Citation is an
    // instruction in the system prompt with no verification, and the route calls
    // the model even when nothing matched. /trust's wording is the accurate one.
    t: "Answers link the records they came from",
    d: "Responses link back to the records, files and decisions they were drawn from, and the model is only ever given records you are already allowed to see.",
  },
  {
    t: "The knowledge stays with the seat",
    d: "When this holder moves on, the next one inherits the same working memory, intact.",
  },
];

const QA: { q: string; a: string; src: string }[] = [
  {
    q: "gala date change",
    a: "The board moved it after the October attendance review, and the new date cleared the office the same week. See the decision card and the approval behind it.",
    src: "2 sources",
  },
  {
    q: "fall mixer",
    a: "The board moved that budget to the gala after low turnout. See the October decision log and the vote behind it.",
    src: "2 sources",
  },
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="The platform"
        title={
          <>
            One system for how your organization actually{" "}
            <span className="text-grove">runs</span>.
          </>
        }
        // "and what is live versus planned" promised a status vocabulary this page
        // did not have. Promising the qualification and not shipping it is worse
        // than not promising it, so the sentence points at the page that carries it
        // — and the connector matrix below now uses the same badges.
        intro={
          <>
            Finance, events, members, documents and institutional memory in one
            governed record, and a handoff packet the next holder inherits already
            written. Below: the data model, what a week looks like on each side of
            it, and exactly what Tenure connects to. What is live, in validation,
            on the roadmap or not supported is set out on{" "}
            <Link href="/trust">Security</Link>.
          </>
        }
      >
        <ContactSales size="lg" arrow />
        <Button href="/pilot" variant="secondary" size="lg">
          See the pilot
        </Button>
      </PageHeader>

      {/* 1 — the workspace */}
      <Section tone="canvas" backdrop="quiet">
        <Container>
          <SectionHead
            align="center"
            index="01"
            eyebrow="The workspace"
            title={
              <>
                Finance, events, members and memory,{" "}
                <span className="text-grove">one screen</span>.
              </>
            }
          />
          <Reveal delay={0.12} className="mt-9">
            <DashboardMock initialModule="Memory" className="mx-auto max-w-5xl" />
          </Reveal>
        </Container>
      </Section>

      {/* 2 — what it captures. Four records, as one panel rather than four cards. */}
      <Section tone="subtle" backdrop="drafting">
        <Container>
          <SectionHead
            index="02"
            eyebrow="What it captures"
            title={
              <>
                The record fills itself as the team does the{" "}
                <span className="text-grove">work</span>.
              </>
            }
            lead="Nobody writes the handoff document at the end of the cycle. Tenure keeps four kinds of record current as the work happens, so the next board inherits the real thing rather than a scramble of screenshots and a shared drive nobody can navigate."
          />

          <Reveal delay={0.14} className="mt-9">
            <Panel>
              <PanelBar
                title="What lives on the seat"
                meta="four kinds of record, kept current by the work itself"
                aside={<PanelTag>no separate wiki</PanelTag>}
              />
              <ul className="grid sm:grid-cols-2">
                {RECORDS.map((r, i) => (
                  <li
                    key={r.n}
                    className={[
                      "flex gap-4 border-line-soft px-5 py-4 sm:px-6",
                      // Hairlines drawn per cell rather than with a wrapper grid
                      // gap: the last row must not carry a bottom border, and in a
                      // single column the vertical divider has to disappear.
                      i < RECORDS.length - 1 ? "border-b" : "",
                      i % 2 === 0 ? "sm:border-r" : "",
                      i === RECORDS.length - 2 ? "sm:border-b-0" : "",
                    ].join(" ")}
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-grove-soft text-grove-deep">
                      {r.icon}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-display text-[1rem] font-semibold text-ink">
                          {r.t}
                        </h3>
                        <span className="label-mono text-[0.55rem]">{r.n}</span>
                      </div>
                      <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-soft">
                        {r.d}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        </Container>
      </Section>

      {/* 3 — onboarding */}
      <Section tone="canvas" backdrop="quiet">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="max-w-xl">
            <SectionHead
              index="03"
              eyebrow="Onboarding, handled"
              title={
                <>
                  The next holder starts from{" "}
                  <span className="text-grove">everything that came before</span>.
                </>
              }
              lead="When a leader leaves and the next one takes the seat, they do not start from zero. They search the seat's own record and get the sources back, with an answer whenever Tenure can ground one in them."
            />
            <ul className="mt-7 space-y-4">
              {POINTS.map((p, i) => (
                <Reveal as="li" key={p.t} delay={0.06 + 0.05 * i} className="flex gap-3.5">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-grove-soft text-grove-deep">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M3.5 8.5l3 3 6-7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <p className="text-[0.95rem] leading-relaxed text-ink-soft">
                    <span className="font-medium text-ink">{p.t}.</span> {p.d}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1}>
            <Panel>
              <PanelBar
                title="Ask Tenure"
                meta="Treasurer seat · day 1"
                aside={<PanelTag>sources linked</PanelTag>}
              />
              <div className="space-y-4 p-4 sm:p-5">
                {QA.map((x) => (
                  <div key={x.q} className="space-y-2">
                    <div className="rounded-xl border border-line bg-paper/60 px-3.5 py-2.5">
                      <p className="label-mono text-[0.55rem]">You searched</p>
                      {/*
                        Keyword-shaped, not a sentence: retrieval is an AND over
                        every query token longer than one character, with no
                        stemming, synonyms or stopword removal. "Why did we move the
                        gala off finals week?" is a nine-term AND including "why",
                        "did" and "we", and returns nothing (C-007).
                      */}
                      <p className="mt-1 font-mono text-[0.9rem] font-medium text-ink">
                        {x.q}
                      </p>
                    </div>
                    <div className="rounded-xl border border-grove/25 bg-grove-soft/50 px-3.5 py-3">
                      <p className="text-[0.9rem] leading-relaxed text-ink-soft">
                        {x.a}{" "}
                        <span className="whitespace-nowrap font-medium text-grove-deep">
                          {x.src} ↗
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <PanelNote>
                Retrieval covers five record kinds &mdash; knowledge cards, document
                titles and descriptions, approvals, events and organization records.
                Finance figures, people records and file contents are not in the
                corpus.
              </PanelNote>
            </Panel>
          </Reveal>
        </Container>
      </Section>

      {/* 4 — how a handoff actually works, and two surfaces at work */}
      <HowItWorks />
      <ProductAtWork />

      {/* 5 — connectors. One matrix, replacing two near-identical format sections. */}
      <Section tone="canvas" backdrop="quiet">
        <Container>
          <SectionHead
            index="04"
            eyebrow="Fits your stack"
            title={
              <>
                What it connects to &mdash; including{" "}
                <span className="text-grove">what it does not</span>.
              </>
            }
            lead="Most of this page describes what Tenure does. This part describes what it will not do for you, in the same words we would use in a security review, because finding out in week three is worse for both of us."
          />
          <Reveal delay={0.14} className="mt-9">
            <ConnectorMatrix />
          </Reveal>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
