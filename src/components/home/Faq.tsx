import { Ribbons } from "@/components/visuals/Ribbons";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Logo } from "@/components/brand/Logo";
import { ContactSalesLink } from "@/components/ui/ContactSales";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "Does Tenure replace our Google Drive, Slack, or Notion?",
    a: "No. Tenure doesn't connect to them, it's where the record itself lives. Bring your spreadsheets, decks, and documents in, subscribe your calendar to Tenure's, and the files and decisions that define how the organization runs stop living in someone's personal account and start belonging to the role.",
  },
  {
    q: "Is Tenure only for universities?",
    a: "No. It's built for any organization where people rotate faster than knowledge transfers, student clubs, university offices, companies, nonprofits, and volunteer boards. The seat model is identical everywhere: knowledge stays with the role, not the person who holds it this term.",
  },
  {
    q: "Who owns the data?",
    a: "The organization does. Access passes cleanly to the next occupant at every transition, and nothing leaves with an individual when they graduate, resign, or roll off the board.",
  },
  {
    q: "How fast is onboarding, really?",
    a: "Days instead of a semester. Because the memory stays with the seat, Tenure AI answers from the role's own record, budgets, vendors, past events, and the reasons behind decisions. It doesn't train a model on your data; it surfaces and explains what's already in your record.",
  },
  {
    q: "Is sensitive data handled responsibly?",
    a: "Yes. Tenure runs least-access by default, isolates each organization's data at the query layer, and logs every action to an immutable audit trail. The organization owns its records, not Tenure, not any individual. Documents are encrypted at rest and only ever served through short-lived signed links, never a raw file URL.",
  },
  {
    q: "What does it cost?",
    a: "We're setting pilot pricing with Simon's Office of Student Engagement directly, at the level of the whole portfolio it stewards rather than per club, so it fits a real budget. Contact sales and we'll walk you through it.",
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
                  <summary className="inline-flex w-fit max-w-[90%] cursor-pointer list-none items-center gap-3 rounded-2xl border border-line bg-cloud px-5 py-3 text-[0.98rem] text-ink shadow-[0_1px_2px_rgba(12,30,51,0.05)] transition-colors hover:border-grove/40 [&::-webkit-details-marker]:hidden">
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
            Still deciding whether Tenure fits your organization?{" "}
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
