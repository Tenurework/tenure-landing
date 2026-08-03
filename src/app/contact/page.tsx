import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/site/PageHeader";
import { Scheduler } from "@/components/site/Scheduler";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata("/contact");

const EXPECT = [
  {
    title: "You talk to a founder",
    body: "There is no SDR and no qualification call. Whoever picks up built the thing you are asking about.",
  },
  {
    // This used to promise "a real organization's record". Offering to
    // screen-share a real student organization's record with anyone who books a
    // slot is a privacy problem, not a copy problem — the walkthrough runs on a
    // demonstration organization and always did.
    title: "30 minutes, screen shared",
    body: "We open a demonstration organization built on the same model — seats, approvals, the budget, the handoff packet — and you ask what you want to see. It carries representative data, never a real organization's records.",
  },
  {
    title: "We will tell you what is not built",
    body: "Some of what you might want is planned rather than shipped. You will hear which is which on the call, not after a contract.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="See your own handoff in Tenure."
        intro="Book a walkthrough, or just email us. Whichever is less friction for you — both reach the same two people."
      />

      <Container>
        <div className="grid gap-14 pb-24 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-text">
              Book a walkthrough
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-text-secondary">
              Pick a time that works. If the calendar will not load on your
              network — which happens more often than you would think inside
              universities — the email below always works.
            </p>

            <Scheduler />
          </div>

          <div className="lg:pt-1">
            <div className="rounded-2xl border border-line bg-surface p-7">
              <h2 className="font-display text-xl font-semibold tracking-tight text-text">
                Or email us
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-text-secondary">
                Straight to both founders. We answer the same day, most days.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-canvas px-4 py-2.5 font-mono text-[0.9rem] text-accent-text transition-colors hover:border-accent/40 hover:bg-accent-muted"
              >
                {site.email}
              </a>

              <div className="mt-7 border-t border-line pt-6">
                <p className="label-mono">Security review?</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-text-secondary">
                  If you are evaluating Tenure for an institution, the{" "}
                  <a
                    href="/trust"
                    className="text-accent-text underline underline-offset-4 hover:text-accent"
                  >
                    trust page
                  </a>{" "}
                  documents tenant isolation, access model, audit behaviour and
                  our AI subprocessor, with what is live separated from what is
                  planned.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-line pb-24 pt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text">
            What to expect
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {EXPECT.map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-[1.05rem] font-semibold tracking-tight text-text">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-text-secondary">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
