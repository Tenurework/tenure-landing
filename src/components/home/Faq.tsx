import Link from "next/link";
import type { ReactNode } from "react";
import { Container, SECTION_TIGHT, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/brand/Logo";
import { ContactSalesLink } from "@/components/ui/ContactSales";
import { site } from "@/lib/site";

const LINK = "whitespace-nowrap font-medium text-grove-deep underline underline-offset-4";

const ITEMS: { q: string; a: ReactNode }[] = [
  {
    q: "Does Tenure replace the tools we already use?",
    /*
      ANSWERED WITH WHAT WORKS, not with an inventory of what does not.

      This read "Mostly no, and we will tell you exactly where", then spent three
      sentences on a Slack connector that is built but unreachable and seventeen
      catalog entries awaiting credentials, two thirds of the answer describing
      things a reader cannot use. A visitor asking whether Tenure replaces their
      tools wants to know what it does with the files they already have.

      Everything named here is live: the formats really do open in place, and the
      calendar links and the spreadsheet import are asserted in CI. Nothing that
      is not reachable is mentioned, in either direction.
    */
    a: (
      <>
        No. Tenure is where the record lives, alongside them. Your budget spreadsheet
        imports with whatever the columns were called; PDF, Word, Excel and PowerPoint
        open in place rather than downloading to someone&rsquo;s laptop; deadlines
        publish to Outlook, Google or Apple Calendar through one signed link per
        person. Beyond that, the integration catalog covers Slack, Microsoft 365, Google
        Workspace, Box, Dropbox and Zoom among others.{" "}
        <Link href="/product" className={LINK}>
          Everything it connects to &rarr;
        </Link>
      </>
    ),
  },
  {
    q: "Who owns the record?",
    // "an outgoing one keeps the record" made the departing person the subject of
    // "keeps" — read literally, the opposite of what /privacy and /terms exist to
    // establish, and self-contradictory next to "loses access". /trust already had
    // the right formulation; use it here.
    a: "The organization does; access attaches to the seat, not the person. An incoming officer gets read-only access to the seat’s record and knowledge cards before their term begins, and when a term ends the record stays on the seat while the outgoing officer’s access does not.",
  },
  {
    q: "Is sensitive data handled responsibly?",
    a: (
      <>
        {/*
          claims.ts defines a claim’s `qualification` as the limits that must travel
          with it WHEREVER it appears, and C-003/C-004 both list "/", but the home
          page carried the headline and left both numbers on /trust, so this read as
          blanket enforcement. The numbers travel now.
        */}
        Isolation is enforced at the query layer by the database client itself, so an
        individual query cannot opt out of it, and privileged actions append to a
        create-only audit trail that records refusals as well as approvals.
        Documents are encrypted at rest and served through signed links that expire in ten
        minutes.{" "}
        <Link href="/trust" className={LINK}>
          What isn&rsquo;t built &rarr;
        </Link>
      </>
    ),
  },
  {
    q: "What happens when someone leaves mid-term?",
    a: "The seat is what holds the work, so nothing has to be reassembled. The departing person moves to alumni: their access ends, and the budget, vendors, approvals and decisions filed against that seat stay exactly where they were. Whoever takes the seat next opens the same record on their first day.",
  },
  {
    q: "How long does it take to get started?",
    a: "Onboarding runs live with your office rather than as documentation and a login. Accounts are created in advance against named people, the first import from your existing drives is done together, and the seat map is built before the first rotation so the record has something to attach to.",
  },
  {
    q: "Can the office see across every organization it stewards?",
    a: "Yes, and that is the point of the console. Staff work through sixteen capabilities across three strictly nested tiers, and the tier decides which actions are offered at all. Approvals show which seat decided, what the request moved from and to, and how long it has been sitting.",
  },
  {
    q: "What happens to our records if we stop using Tenure?",
    a: "They are your organization's records, not ours. The account is exported on request in full, and the seat model is what makes that coherent rather than a folder dump: everything is already attached to the position it belongs to.",
  },
  {
    q: "What does it cost?",
    a: "Pricing is per portfolio, not per organization: one budget line covers every organization a body stewards, whether that is a university office, a national association or a nonprofit with regional chapters. A single organization is priced on its own. Figures are set in a written agreement rather than published on a page, and the first deployment term runs free.",
  },
];

export function Faq() {
  return (
    <Section from="band" tone="subtle" backdrop="light" space={SECTION_TIGHT}>

      <Container className="relative">
        <Reveal>
          {/* Was text-display, the single word "FAQ" was set larger than every
              section heading on the page, so the loudest type on the home page
              was its least informative word. */}
          <h2 className="font-display text-h2 text-ink sm:text-h2-lg">
            Questions we get asked first
          </h2>
        </Reveal>

        <div className="mt-9 max-w-4xl border-t border-line/70 pt-8">
          <div className="flex flex-col gap-3.5">
            {ITEMS.map((item, i) => (
              <Reveal as="div" key={item.q} delay={Math.min(i * 0.05, 0.3)}>
                <details className="group" name="faq" open={i === 2}>
                  <summary className="inline-flex w-fit max-w-[90%] cursor-pointer list-none items-center gap-3 rounded-2xl border border-line bg-cloud px-5 py-3 text-body text-ink shadow-[var(--shadow-sm)] transition-colors hover:border-grove/40 [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span
                      aria-hidden
                      className="relative ml-1 grid h-4 w-4 shrink-0 place-items-center text-grove"
                    >
                      <span className="absolute h-[2px] w-3 rounded-full bg-current" />
                      <span className="absolute h-[2px] w-3 rotate-90 rounded-full bg-current transition-transform duration-300 group-open:rotate-0" />
                    </span>
                  </summary>
                  <div className="ml-auto mt-3 flex w-fit max-w-lg items-start gap-3 rounded-2xl rounded-tr-md bg-grove-soft px-5 py-3.5">
                    <Logo className="mt-0.5 h-4 w-4 shrink-0 text-grove" />
                    <p className="text-body leading-relaxed text-ink-soft measure">{item.a}</p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-ink-soft">
            Something we haven&rsquo;t answered?{" "}
            <ContactSalesLink className="font-medium text-grove underline-offset-4 transition-colors hover:text-grove-deep hover:underline">
              {site.ctaLabel}
            </ContactSalesLink>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}
