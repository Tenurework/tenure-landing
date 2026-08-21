import { Container, Section } from "@/components/ui/layout";
import { PageHeader } from "@/components/site/PageHeader";
import { WalkthroughRequest } from "@/components/site/WalkthroughRequest";
import { Panel, PanelBar, PanelNote } from "@/components/ui/Panel";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata("/contact");

/**
 * /contact — first-party, and addressed.
 *
 * TWO THINGS CHANGED HERE, AND THE SECOND IS THE ONE THAT MATTERS.
 *
 * Calendly is gone entirely — the embed first, then the outbound link, then the
 * CSP allowance that outlived both. A prospect's first interaction with a system
 * of record should not be somebody else's software asking for their details.
 *
 * And mail is ADDRESSED now. Every route on this page used to end at one
 * `hello@` inbox: a demo request, a security questionnaire, a data-protection
 * question and a legal notice all landed in the same place. An enterprise buyer
 * reads a single generic address as a company too small to have functions, and a
 * security reviewer who cannot find a security address assumes nobody owns it.
 * Each address below is a real group with an owner, and the page routes by what
 * the visitor is actually trying to do.
 */

const EXPECT = [
  {
    title: "You talk to the people who built it",
    body: "No qualification call and no discovery deck. The first conversation is with someone who can answer a question about the schema.",
  },
  {
    title: "Thirty minutes, on a live workspace",
    body: "Seats, approvals, the ledger and a handoff packet, opened in the product. The workspace carries representative data rather than another organization’s records.",
  },
  {
    title: "You leave knowing the roadmap",
    body: "What is shipped, what is in validation and what is scheduled, separated, on the call, in writing afterwards.",
  },
];

/**
 * Where to write, by what you need. These are real groups, each with an owner —
 * see the map in lib/site.ts.
 */
const DESKS = [
  { label: "Sales and procurement", address: site.email.sales },
  { label: "Security review", address: site.email.security },
  { label: "Data protection", address: site.email.privacy },
  { label: "Legal and contracts", address: site.email.legal },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="See Tenure on your own handoff."
        intro="Tell us what you run and which parts matter. We open exactly those."
      />

      <Section tone="canvas" backdrop="light" divide={false}>
        <Container>
          {/*
            A REGULAR GRID, because the old one was not.

            The layout was `lg:grid-cols-[1.1fr_0.9fr]` with `items-start`: the
            left column held one 255px card and the right stacked two of roughly
            400px each. That left about 700px of empty white below the primary
            call to action, the most important card on the page, ending in a void
, and two columns whose cards lined up at the top and nowhere else.
            Uneven column weights plus `items-start` guarantees ragged bottoms.

            Two equal columns that STRETCH to a shared height, then one full-width
            band beneath them. "What to expect" was always three parallel items,
            so it belongs across the page rather than stacked in a side column,
            and moving it there is what lets the two cards above it be equal.
          */}
          <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            {/* The composer. `id` is the target of the header CTA when the
                visitor is already on /contact, see SiteHeader. `scroll-mt`
                clears the fixed header so the panel is not tucked under it. */}
            <Panel className="flex h-full flex-col scroll-mt-24" id="request">
              <PanelBar
                title="Request a demo"
                meta="composed here, sent from your own mail app"
              />
              <div className="flex flex-1 flex-col p-5 sm:p-7">
                <p className="max-w-lg leading-relaxed text-ink-soft measure">
                  Tell us what kind of organization you run and which parts of
                  Tenure you want to see. We open exactly those, on a live
                  workspace, and answer what sits where on the roadmap.
                </p>

                <div className="mt-6">
                  <WalkthroughRequest />
                </div>
              </div>
            </Panel>

            {/* The fallback that cannot be blocked */}
            <Panel className="flex h-full flex-col">
              <PanelBar title="Write to us directly" meta="every address reaches an owner" />
              <div className="flex-1 p-5 sm:p-7">
                <p className="text-body leading-relaxed text-ink-soft measure">
                  No form and no routing queue. Pick the desk that matches what
                  you need.
                </p>
                <ul className="mt-4 space-y-2.5">
                  {DESKS.map((d) => (
                    <li
                      key={d.address}
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                    >
                      <span className="text-body-sm text-ink-soft">{d.label}</span>
                      <a
                        href={`mailto:${d.address}`}
                        className="font-mono text-body-sm text-accent-text underline-offset-4 transition-colors hover:text-accent hover:underline"
                      >
                        {d.address}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <PanelNote>
                Evaluating Tenure for an institution? The{" "}
                <a
                  href="/trust"
                  className="font-medium text-accent-text underline underline-offset-4 hover:text-accent"
                >
                  security page
                </a>{" "}
                covers tenant isolation, the access model, audit behaviour and
                the AI subprocessor, written for review. Send it to your
                reviewer before you send us.
              </PanelNote>
            </Panel>
          </div>

          <Panel className="mt-6 lg:mt-8">
            <PanelBar title="What to expect" meta="three things, no surprises" />
            {/*
              Three across, divided by a vertical rule rather than a horizontal
              one. `gap-px` on a lined background is how you get single-pixel
              dividers between grid cells without each cell drawing its own border
              and doubling them at the joins.
            */}
            <ul className="grid gap-px bg-line-soft sm:grid-cols-3">
              {EXPECT.map((item) => (
                <li key={item.title} className="bg-surface px-5 py-5 sm:px-7 sm:py-6">
                  <h2 className="font-display text-body text-ink">{item.title}</h2>
                  <p className="mt-1.5 text-body-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </Container>
      </Section>
    </>
  );
}
