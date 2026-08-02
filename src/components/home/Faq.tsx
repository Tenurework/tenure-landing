import Link from "next/link";
import type { ReactNode } from "react";
import { Ribbons } from "@/components/visuals/Ribbons";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/brand/Logo";
import { ContactSalesLink } from "@/components/ui/ContactSales";

const LINK = "whitespace-nowrap font-medium text-grove-deep underline underline-offset-4";

const ITEMS: { q: string; a: ReactNode }[] = [
  {
    q: "Does Tenure replace the tools we already use?",
    a: (
      <>
        No, and it connects to none of them. Tenure is where the record lives: your budget
        spreadsheet imports with whatever the columns were called, and PDF, Word, Excel and
        PowerPoint open in place.{" "}
        <Link href="/product" className={LINK}>
          What&rsquo;s built &rarr;
        </Link>
      </>
    ),
  },
  {
    q: "Who owns the record?",
    a: "The organization does; access attaches to the seat, not the person. An incoming officer gets read-only access to the seat's record and knowledge cards before their term begins, and an outgoing one keeps the record and loses access.",
  },
  {
    q: "Is sensitive data handled responsibly?",
    a: (
      <>
        Isolation is enforced at the query layer by the database client itself, and privileged
        actions append to a create-only audit trail that records refusals as well as approvals.
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
    a: "Pricing is per portfolio, not per club: one budget line for every organization an office stewards. The Fall 2026 pilot with Simon's Office of Student Engagement is planned, not contracted.",
  },
];

export function Faq() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-sand py-24 sm:py-32">
      {/* vibrant flowing ribbons cutting in from the top-right (no background) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-24 h-[82%] w-[60%] [mask-image:linear-gradient(250deg,black,black_42%,transparent_82%)]"
      >
        <Ribbons className="h-full w-full" />
      </div>

      <Container className="relative">
        <Reveal>
          <h2 className="font-display text-[2.4rem] font-semibold leading-[1] tracking-[-0.035em] text-ink sm:text-[3rem]">
            FAQ
          </h2>
        </Reveal>

        <div className="mt-10 max-w-3xl border-t border-line/70 pt-8">
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

          <p className="mt-8 text-ink-soft">
            Something we haven&rsquo;t answered?{" "}
            <ContactSalesLink className="font-medium text-grove underline-offset-4 transition-colors hover:text-grove-deep hover:underline">
              Contact sales
            </ContactSalesLink>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
