import { Container, Section } from "@/components/ui/layout";
import { PageHeader } from "@/components/site/PageHeader";
import { WalkthroughRequest } from "@/components/site/WalkthroughRequest";
import { Panel, PanelBar, PanelNote } from "@/components/ui/Panel";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata("/contact");

/**
 * /contact — first-party conversion.
 *
 * WHAT CHANGED, AND THE ORDER OF RELIABILITY IT PRESERVES.
 *
 * The primary surface here used to be Calendly's inline widget: a third party's
 * typography, form controls and cookie banner opening in the middle of a page
 * that had spent eight sections establishing that this product is careful about
 * where data goes. The first interactive thing a prospect touched was somebody
 * else's software.
 *
 * It is now a Tenure component — `WalkthroughRequest` — which composes the
 * request in the browser and hands it to the visitor's own mail client or
 * clipboard. Nothing is transmitted by this page, which is both the honest
 * description of a statically-exported site with no backend and a better outcome
 * than a form that POSTs: the visitor keeps a copy in their own sent items.
 *
 * The three paths are still offered in the same order of reliability, and the
 * two that never depended on JavaScript still do not:
 *
 *   1. the email address, as a plain `mailto:` anchor — works with scripts off,
 *      works with everything blocked, cannot fail;
 *   2. the request composer, which needs JavaScript and degrades to (1) without
 *      it, because it is rendered *beside* the address rather than instead of it;
 *   3. the scheduler, as a plain `<a target="_blank">` to Calendly — never an
 *      embed, never a script on this origin, and never a `window.open` call.
 *
 * (3) is deliberately still here and deliberately still an anchor. The old CTA
 * was a `<button>` that awaited Calendly's script and only then called
 * `window.open`, outside the user-gesture window — so with calendly.com blocked,
 * which is routine on university networks and with any content blocker, every
 * CTA on the site silently did nothing. A plain anchor cannot have that failure
 * mode. Calendly is a disclosed subprocessor (C-036) and stays disclosed.
 */

const EXPECT = [
  {
    title: "You talk to a founder",
    body: "There is no SDR and no qualification call. Whoever picks up built the thing you are asking about.",
  },
  {
    // This used to promise "a real organization's record". Offering to
    // screen-share a real organization's record with anyone who books a slot is a
    // privacy problem, not a copy problem — the walkthrough runs on a
    // demonstration organization and always did.
    title: "30 minutes, screen shared",
    body: "We open a demonstration organization built on the same model — seats, approvals, the budget, the handoff packet — and you ask what you want to see. It carries representative data, never a real organization’s records.",
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
        intro="Tell us what you want to see, or just email us. Whichever is less friction for you — both reach the same two people."
      />

      <Section backdropSeed={24} tone="canvas" backdrop="quiet" divide={false}>
        <Container>
          <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
            {/* The composer. `id` is the target of the header CTA when the
                visitor is already on /contact — see SiteHeader. `scroll-mt`
                clears the fixed header so the panel is not tucked under it. */}
            <Panel className="scroll-mt-24" id="request">
              <PanelBar
                title="Ask for a walkthrough"
                meta="composed here, sent from your own mail app"
              />
              <div className="p-5 sm:p-7">
                <p className="max-w-lg leading-relaxed text-ink-soft">
                  Tell us what kind of organization you run and which parts of
                  Tenure you want to see. We will open exactly those, on a
                  demonstration organization, and answer what is not built yet.
                </p>

                <div className="mt-6">
                  <WalkthroughRequest />
                </div>

                <p className="mt-4 text-caption leading-relaxed text-ink-faint">
                  Prefer to pick a slot yourself?{" "}
                  {/*
                    A plain anchor, always rendered, never a script-dependent
                    handler. This is the path that survives a blocked third party,
                    a popup blocker and JavaScript being off entirely — which is
                    exactly what the old button-plus-popup CTA did not.
                  */}
                  <a
                    href={site.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent-text underline underline-offset-4 hover:text-accent"
                  >
                    Open our calendar
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>{" "}
                  &mdash; that one is Calendly, a third party: it sets its own
                  cookies and receives the details you enter. Nothing from it loads
                  on this site.
                </p>
              </div>
            </Panel>

            {/* The fallback that cannot be blocked */}
            <div className="space-y-6">
              <Panel>
                <PanelBar title="Or just email us" meta="straight to both founders" />
                <div className="p-5 sm:p-7">
                  <p className="text-body leading-relaxed text-ink-soft">
                    No form, no dialog, no script. We answer the same day, most
                    days.
                  </p>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-border-strong bg-canvas px-4 py-2.5 font-mono text-body-sm text-accent-text transition-colors hover:border-accent/40 hover:bg-accent-muted"
                  >
                    {site.email}
                  </a>
                </div>
                <PanelNote>
                  Evaluating Tenure for an institution? The{" "}
                  <a
                    href="/trust"
                    className="font-medium text-accent-text underline underline-offset-4 hover:text-accent"
                  >
                    security page
                  </a>{" "}
                  documents tenant isolation, the access model, audit behaviour and
                  our AI subprocessor, with what is live separated from what is
                  planned. Send it to your reviewer before you send us.
                </PanelNote>
              </Panel>

              <Panel>
                <PanelBar title="What to expect" meta="three things, no surprises" />
                <ul>
                  {EXPECT.map((item) => (
                    <li
                      key={item.title}
                      className="border-b border-line-soft px-5 py-4 last:border-b-0 sm:px-7"
                    >
                      <h2 className="font-display text-body font-semibold tracking-tight text-ink">
                        {item.title}
                      </h2>
                      <p className="mt-1.5 text-body-sm leading-relaxed text-ink-soft">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
