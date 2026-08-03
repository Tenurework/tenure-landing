import type { ReactNode } from "react";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ContactSales } from "@/components/ui/ContactSales";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { DashboardMock } from "@/components/visuals/DashboardMock";
import { ToolLogos } from "@/components/visuals/ToolLogos";
import { pageMetadata } from "@/lib/metadata";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProductAtWork } from "@/components/home/ProductAtWork";
import { WhoFor } from "@/components/home/WhoFor";

export const metadata = pageMetadata("/product");

const svgProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const RECORDS: { n: string; t: string; d: string; icon: ReactNode }[] = [
  {
    n: "01",
    t: "Contacts & relationships",
    d: "Sponsors, partners, and alumni, with the warm intro and the last conversation kept behind each name.",
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
    d: "Vendors, pricing, and budgets, the real terms the board agreed to, not a number someone half-remembers.",
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
    d: "What leadership chose and why it chose it, so next year doesn't relitigate a call that was already settled.",
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
    d: "Decks, timelines, and run-of-show checklists, the documents that actually carried the work, not a dead folder.",
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
    d: "Responses link back to the records, files, and decisions they were drawn from, and the model is only ever given records you're already allowed to see.",
  },
  {
    t: "The knowledge stays with the seat",
    d: "When this officer graduates, the next one inherits the same working memory, intact.",
  },
];

const QA: { q: string; a: string; src: string }[] = [
  {
    q: "Why did we move the gala off finals week?",
    a: "The board moved it after the October attendance review, and the new date cleared OSE the same week. See the decision card and the approval behind it.",
    src: "2 sources",
  },
  {
    q: "Why did we drop the fall mixer last year?",
    a: "The board moved that budget to the gala after low turnout. See the October decision log and the vote behind it.",
    src: "2 sources",
  },
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="The product"
        title={
          <>
            One system for how your organization actually{" "}
            <span className="text-grove">runs</span>.
          </>
        }
        // "and what is live versus planned" promised a status vocabulary this page
        // does not have: the prerendered product.html contained no "Roadmap", no
        // "Not supported", no status badge, and no body link to /trust — only the
        // header and footer nav links. Promising the qualification and not shipping
        // it is worse than not promising it, so the sentence now points at the page
        // that does carry the vocabulary.
        intro={
          <>
            Finance, events, members, documents and institutional memory in one
            governed record, and a handoff packet the next officer inherits
            already written. Below: the data model, and what a week looks like on
            each side of it. What is live, in validation, on the roadmap or not
            supported is set out on <Link href="/trust">Trust</Link>.
          </>
        }
      >
        <ContactSales size="lg" arrow />
        <Button href="/pilot" variant="secondary" size="lg">
          See the pilot
        </Button>
      </PageHeader>

      {/* 1, The workspace */}
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <Eyebrow index="01" className="justify-center">
                The workspace
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
                Finance, events, members, and memory, {" "}
                <span className="text-grove">one screen</span>.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="mt-12">
            <DashboardMock initialModule="Memory" className="mx-auto max-w-5xl" />
          </Reveal>

          <Reveal delay={0.08} className="mt-12">
            <div className="flex flex-col items-center gap-4">
              <p className="label-mono">Import the spreadsheets you keep. Subscribe your calendar.</p>
              <ToolLogos className="mt-1 max-w-3xl" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 2, What it captures */}
      <section className="relative border-t border-line bg-sand py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow index="02">What it captures</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
                The record fills itself as the team does the{" "}
                <span className="text-grove">work</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                No one writes the handoff doc at the end of the year. Tenure keeps
                four kinds of record current as the work happens, so the next
                board inherits the real thing, not a scramble of screenshots and
                a shared drive no one can navigate.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RECORDS.map((r, i) => (
              <Reveal
                as="div"
                key={r.n}
                delay={0.04 * i}
                className="flex h-full flex-col rounded-2xl border border-line bg-cloud p-6 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-grove-soft text-grove-deep">
                    {r.icon}
                  </span>
                  <span className="label-mono">Record {r.n}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                  {r.t}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                  {r.d}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 3, Onboarding, handled */}
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow index="03">Onboarding, handled</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
                They read the seat <span className="text-grove">before they sit in it</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-lg leading-relaxed text-ink-soft">
                When a leader leaves and the next one takes the seat, they
                don&rsquo;t start from zero. They search the seat&rsquo;s own
                record and get the sources back, with an answer whenever Tenure
                can ground one in them.
              </p>
            </Reveal>

            <ul className="mt-8 space-y-5">
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
                  <p className="text-[0.97rem] leading-relaxed text-ink-soft">
                    <span className="font-medium text-ink">{p.t}.</span> {p.d}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Q&A card */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-line bg-cloud p-5 shadow-[var(--shadow-lg)] sm:p-6">
              <div className="flex items-center justify-between border-b border-line pb-3.5">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-grove-soft px-2.5 py-1 text-[0.72rem] font-medium text-grove-deep">
                  <span className="h-1.5 w-1.5 rounded-sm bg-grove" />
                  Ask Tenure
                </span>
                <span className="label-mono">Treasurer · day 1</span>
              </div>

              <div className="mt-4 space-y-5">
                {QA.map((x) => (
                  <div key={x.q} className="space-y-2.5">
                    <div className="rounded-xl border border-line bg-paper/60 px-3.5 py-2.5">
                      <p className="label-mono">You asked</p>
                      <p className="mt-1 text-[0.92rem] font-medium text-ink">
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
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Moved here from the home page, where they were a second telling of an
          argument the hero and the seat mechanism had already made. On this
          route they answer the questions the page exists for: how a handoff
          actually works, what each surface does, and who the seat model serves. */}
      <HowItWorks />
      <ProductAtWork />
      <WhoFor />

      <CtaBand />
    </>
  );
}
