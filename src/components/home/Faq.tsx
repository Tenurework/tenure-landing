import Link from "next/link";
import type { ReactNode } from "react";
import { Ribbons } from "@/components/visuals/Ribbons";
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
      This answer used to be "No, and it connects to none of them", which was the
      whole answer a visitor got on the home page — no tool named, and the real
      detail two routes away behind a collapsed accordion. It is also no longer
      true: a Slack connector is built in the deploying repo, and seventeen more
      products sit in the integration catalog.

      The vendor names are legal here because "built, not yet in the product" and
      "awaiting credentials" are the two status phrases claims.spec.ts accepts as
      excuses (C-029a / C-029b). Neither can be read as availability.
    */
    a: (
      <>
        Mostly no, and we will tell you exactly where. Tenure is where the record lives:
        your budget spreadsheet imports with whatever the columns were called, and PDF,
        Word, Excel and PowerPoint open in place. A Slack connector is written and tested
        but built, not reachable &mdash; nothing calls it, so it is not yet in the product.
        Seventeen more, Box and Teams among them, are declared in the catalog awaiting
        credentials, which is not the same as working.{" "}
        <Link href="/product" className={LINK}>
          The whole matrix &rarr;
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
          with it WHEREVER it appears, and C-003/C-004 both list "/" — but the home
          page carried the headline and left both numbers on /trust, so this read as
          blanket enforcement. The numbers travel now.
        */}
        Isolation is enforced at the query layer by the database client itself, on the 18 of 41
        models that carry a tenant column, and privileged actions append to a create-only audit
        trail that records refusals as well as approvals.
        Documents are encrypted at rest and served through signed links that expire in ten
        minutes.{" "}
        <Link href="/trust" className={LINK}>
          What isn&rsquo;t built &rarr;
        </Link>
      </>
    ),
  },
  {
    q: "What does it cost?",
    a: "Pricing is per portfolio, not per organization: one budget line covers every organization a body stewards, whether that is a university office, a national association or a nonprofit with regional chapters. A single organization is priced on its own. Nothing is published as a figure yet — the planned Fall 2026 pilot is free for its term, and anything beyond it would be a written agreement rather than an update to a page.",
  },
];

export function Faq() {
  return (
    <Section from="band" tone="subtle" backdrop="quiet" backdropSeed={8} space={SECTION_TIGHT}>
      {/* vibrant flowing ribbons cutting in from the top-right (no background) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-24 hidden h-[82%] w-[60%] sm:block [mask-image:linear-gradient(250deg,black,black_42%,transparent_82%)]"
      >
        <Ribbons className="h-full w-full" />
      </div>

      <Container className="relative">
        <Reveal>
          {/* Was text-[3rem] — the single word "FAQ" was set larger than every
              section heading on the page, so the loudest type on the home page
              was its least informative word. */}
          <h2 className="font-display text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.2rem]">
            Questions we get asked first
          </h2>
        </Reveal>

        <div className="mt-7 max-w-3xl border-t border-line/70 pt-6">
          <div className="flex flex-col gap-3.5">
            {ITEMS.map((item, i) => (
              <Reveal as="div" key={item.q} delay={Math.min(i * 0.05, 0.3)}>
                <details className="group" name="faq" open={i === 2}>
                  <summary className="inline-flex w-fit max-w-[90%] cursor-pointer list-none items-center gap-3 rounded-2xl border border-line bg-cloud px-5 py-3 text-[0.98rem] text-ink shadow-[var(--shadow-sm)] transition-colors hover:border-grove/40 [&::-webkit-details-marker]:hidden">
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
                    <p className="text-[0.95rem] leading-relaxed text-ink-soft">{item.a}</p>
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
