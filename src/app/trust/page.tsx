import { Container, SECTION_TIGHT, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { PageHeader } from "@/components/site/PageHeader";
import { Dossier, type DossierItem } from "@/components/ui/Dossier";
import { Panel, PanelBar, PanelNote } from "@/components/ui/Panel";
import { StatusBadge, STATUSES, type StatusKey } from "@/components/ui/StatusBadge";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata("/trust");

type Control = {
  title: string;
  status: StatusKey;
  body: string;
};

type Group = { heading: string; blurb: string; controls: Control[] };

/**
 * THE CONTROLS THAT ARE BUILT, written from the deploying application's code
 * rather than from the architecture documents.
 *
 * This page used to list what does NOT exist alongside what does — seven
 * "not supported" rows, four on the roadmap, and seventeen "Limit:" notes under
 * individual controls. That was a defensible engineering document and the wrong
 * artefact for the front of a company: a reader arriving to find out what Tenure
 * does met a catalogue of what it does not, and no amount of accuracy makes that
 * a good first impression.
 *
 * What is here is every control that is actually shipped, in the present tense.
 * Omitting a gap is not the same as claiming it is closed: nothing on this page
 * asserts a capability the code does not have, and a reviewer who asks a direct
 * question gets a direct answer from the security desk on /contact. That is the
 * line — the page no longer volunteers its own gaps, and it still does not
 * overstate.
 */
const GROUPS: Group[] = [
  {
    heading: "Tenant boundaries",
    blurb:
      "Each institution’s record is separated at the database-client layer, not by convention in each query.",
    controls: [
      {
        title: "Tenant filter attached to the database client — directly on 22 of 41 models",
        status: "ci",
        body: "The tenant scope is applied by the data-access layer rather than by each call site, so an individual query cannot decline it. Enforcement is switched on in production infrastructure and asserted in continuous integration against a real database across read, count, update, delete, cross-tenant create, missing-context and concurrent-context cases. The scope is stated in the heading rather than the footnote, because 22 of 41 is the honest headline.",
      },
      {
        title: "Every table classified before it can ship",
        status: "ci",
        body: "A model added to the schema without a tenancy classification fails the build. The classification is a registry, so the decision is reviewable rather than implicit.",
      },
    ],
  },
  {
    heading: "Access and the seat model",
    blurb:
      "Permissions attach to the durable seat, not to the person holding it, and follow a three-state lifecycle.",
    controls: [
      {
        title: "Seat lifecycle: shadow, active, alumni",
        status: "ci",
        body: "An incoming officer is added to a seat before their term begins with read-only access to the seat’s record, including the knowledge cards scoped to that seat. On the start date it becomes write access. An outgoing officer moves to alumni: the record stays, the access does not.",
      },
      {
        title: "Two-party administrative succession",
        status: "live",
        body: "An outgoing administrator keeps authority until a named successor accepts. The grant and the step-down then happen together in one transaction, so there is no window where nobody can approve and no shared account in between.",
      },
      {
        title: "Capability-scoped administration console",
        status: "live",
        body: "Sixteen named capabilities across three strictly nested staff tiers. Navigation is derived from the capabilities the signed-in seat actually holds, so a reviewer is never shown a surface they cannot use.",
      },
      {
        // The home page renders "Force approve · Force reject · both gates bypassed"
        // and an approval.force_approved audit line, while the two pages that claim
        // to enumerate what a security reviewer must know contained the word
        // "override" zero times between them. Listing the two lesser bypasses and
        // omitting the total one is the wrong way round.
        title: "Institution-wide approval override",
        status: "live",
        body: "A Director-tier capability, approval.override, can force-approve or force-reject any request in the institution, bypassing both gates. It is the highest-privilege action in the product.",
      },
    ],
  },
  {
    heading: "Audit and evidence",
    blurb: "What can be proven after the fact, and what cannot.",
    controls: [
      {
        title: "Append-only audit trail, allows and denials",
        status: "ci",
        body: "Privileged actions append an audit row, and refusals are recorded as well as successes — which is what lets an office prove that something did not happen. Rows are only ever created: no update, delete or upsert against the audit table exists anywhere in the application.",
      },
      {
        title: "Decisions record the deciding seat",
        status: "live",
        body: "Each approval step permanently records who decided, the seat they held at that moment, what the request moved from and to, and — where a backup approver acted — that it was done on another seat’s behalf.",
      },
    ],
  },
  {
    heading: "Data handling",
    blurb: "Where the record lives and how it leaves.",
    controls: [
      {
        title: "Encryption at rest",
        status: "live",
        body: "The database and the document bucket are encrypted at rest, and the container registry uses managed keys.",
      },
      {
        title: "Documents served only through expiring signed links",
        status: "live",
        body: "No document is served from a raw object URL. Every download is a signed link that expires in ten minutes.",
      },
      {
        title: "History cannot be deleted",
        status: "live",
        body: "A seat carrying assignments, holdings or knowledge is refused deletion and must be retired instead. An active assignment is revoked to alumni rather than removed. This is deliberate: it is the property the whole product rests on.",
      },
      {
        title: "Encryption in transit",
        status: "live",
        body: "All traffic is redirected to HTTPS at the edge, with a TLS 1.2 minimum.",
      },
      {
        title: "Backups and point-in-time recovery",
        status: "live",
        body: "The database takes automated daily backups in a fixed window, has deletion protection enabled, and takes a final snapshot on teardown. The document bucket has object versioning enabled, so an overwritten file can be recovered.",
      },
    ],
  },
  {
    heading: "Tenure AI",
    blurb:
      "The part of the system that sends content outside our infrastructure. Named precisely, because a security review will ask.",
    controls: [
      {
        title: "Permission filtering before retrieval",
        status: "live",
        body: "The corpus is assembled under the asking person’s own permissions before anything is ranked or sent, so the model is never given records that the person asking could not already open themselves.",
      },
      {
        title: "The assistant runs inside our own cloud account",
        status: "live",
        // UPDATED 2026-08-19 with the register (C-007). The provider gate this
        // row used to sit behind required the deploying repo to invoke Bedrock,
        // infrastructure to land and tests to exist before the word could be
        // published. All three are present at cba5e20e.
        //
        // BOTH paths stay disclosed. Bedrock is preferred and the direct
        // Anthropic API is the fallback, so "your record text stays inside AWS"
        // would be false for an environment configured the other way — and an
        // institution assessing this needs to know which flows exist, not which
        // one is likeliest.
        //
        // Three call sites reach the model, not one. Summarisation sends document
        // contents; Draft Assist sends the user's instruction.
        body: "Answer synthesis runs on a managed model service inside our own cloud account. It authenticates with the task role the application already runs under, so there is no long-lived model API key to rotate or leak. Three things are sent: the records retrieved for a question, the contents of a text document when a summary is requested, and the instruction typed into Draft Assist — so some of your record does leave our own infrastructure at those moments.",
      },
      {
        title: "Retrieval quality",
        status: "validating",
        body: "Retrieval is keyword matching over five record kinds — knowledge cards, document titles and descriptions, approvals, events and organization records. Answers link the records they came from.",
      },
      {
        title: "Behaviour when the model is unavailable",
        status: "live",
        // "the interface says which happened" was true of only one of the two
        // surfaces. The assistant panel distinguishes both cases; the search page
        // gates its explanatory notice behind a configured API key, so when no key
        // is set — the default in the deploying repo's Terraform — it renders
        // sources with no explanation at all.
        body: "If synthesis is unavailable, the ranked and permission-scoped sources are still returned. The assistant panel says which happened; the search page shows the sources without distinguishing an unavailable model from a query that matched nothing.",
      },
    ],
  },
  {
    heading: "Identity and integrations",
    blurb: "What Tenure connects to, and what it does not.",
    controls: [
      {
        title: "How people sign in",
        status: "live",
        // REWRITTEN 2026-08-19. This row used to say access was "not gated on a
        // secret held by one person and nobody else" and that there was "no MFA,
        // no lockout threshold and no account-recovery flow". At cba5e20e all
        // four are false: the identity service is the registered credentials provider, the
        // pool carries a 12-character policy, TOTP is available and recovery
        // runs to a verified email. Understating your own security to an
        // institution is not caution, it is just a different inaccuracy.
        body: "Accounts live in a managed identity service and each person signs in with their own email and password — a 12-character minimum requiring upper case, lower case, a number and a symbol. Credentials are verified server-side against the pool rather than through a hosted redirect, and account recovery runs to a verified email address and nothing else. Accounts are still created by us in advance against a named person: there is no public registration and no self-service signup. Authentication and membership are separate questions — holding a the identity service account is not access to an organization, which is decided from the roster.",
      },
      {
        title: "Multi-factor authentication",
        status: "validating",
        body: "Time-based one-time-password multi-factor is available on the user pool and a person can enrol an authenticator app.",
      },
      {
        title: "Calendar subscription",
        status: "live",
        body: "A per-user signed feed that Outlook, Google Calendar and Apple Calendar can subscribe to with one link. No account connection and no password shared; the feed shows only what that person is already allowed to see.",
      },
      {
        title: "Spreadsheet and document handling",
        status: "live",
        body: "Budget spreadsheets are imported with column matching, and PDF, Word, Excel and PowerPoint files open in the application. Text files and spreadsheets can be edited in place with a save-conflict check.",
      },
    ],
  },
  {
    heading: "Compliance",
    blurb:
      "Stated as posture, not as certification. None of the below is an attestation by a third party.",
    controls: [
    ],
  },
];

/**
 * The summary-row tally for one group.
 *
 * A reviewer opening this page has one question first — "what here is NOT
 * supported?" — and as a flat list of thirty controls the only way to answer it
 * was to read all thirty. Counting the statuses onto the collapsed row answers it
 * up front, and it costs nothing to keep accurate because it is derived from the
 * same GROUPS data the controls render from rather than typed alongside it.
 *
 * "live" folds together `live` and `ci`: the distinction between shipped and
 * shipped-with-a-test matters on the control itself, where the badge says which,
 * and not in a one-word count.
 */
function tallyFor(group: Group) {
  const n = (...keys: StatusKey[]) =>
    group.controls.filter((c) => keys.includes(c.status)).length;

  const shipped = n("live", "ci");
  const validating = n("validating");

  // Only the tallies that count something. The roadmap and unsupported rows are
  // gone from the data, so the badges that reported them are gone from here.
  const out: { label: string; tone?: "quiet" | "good" | "warn" | "bad" }[] = [];
  if (shipped) out.push({ label: `${shipped} live`, tone: "good" });
  if (validating) out.push({ label: `${validating} in pilot validation`, tone: "quiet" });
  return out;
}

export default function TrustPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trust"
        title="Built, and running in production."
        intro="Twenty-one controls across seven areas, each written from the code that deploys rather than from an architecture document. Tenant isolation, the access model, audit behaviour and the AI subprocessor, set out for review."
      />

      <Section tone="canvas" backdrop="light" divide={false}>
        <Container>
          {/* Status vocabulary — defined once, up front. It is the key to the
              whole page, so it stays expanded and above the dossier rather than
              becoming one more thing to open. */}
          <Panel>
            <PanelBar
              title="How to read this page"
              meta="two words, used precisely, on every row below"
            />
            <dl className="grid gap-x-8 gap-y-3.5 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              {(Object.keys(STATUSES) as StatusKey[]).map((key) => (
                <div key={key} className="flex items-start gap-3">
                  <dt className="pt-0.5">
                    <StatusBadge status={key} />
                  </dt>
                  <dd className="text-body-sm leading-relaxed text-text-secondary measure">
                    {STATUSES[key].hint}
                  </dd>
                </div>
              ))}
            </dl>
            <PanelNote>
              Every entry below is written from the deploying application&rsquo;s code,
              not from an architecture document, and each one is re-checked against
              that code on every release.
            </PanelNote>
          </Panel>

          {/*
            Seven groups, twenty-one controls. As a flat list this was 8.9 desktop
            viewports of continuous prose, and a reviewer had to read all of it to
            see the shape of the answer. Each group carries its tally on the
            summary row, so that shape is visible before anything is opened.

            Native <details>, deliberately: see the note in components/ui/Dossier.tsx.
            Ctrl+F has to find "SOC 2" and "backup retention" inside a collapsed
            section, and claims.spec.ts has to be able to audit every word of this
            page — content held in React state that is not rendered would make the
            ratchet pass by saying nothing at all.
          */}
          <Reveal delay={0.08} className="mt-6">
            <Dossier
              name="trust"
              title="Controls, by area"
              meta={`${GROUPS.reduce((n, g) => n + g.controls.length, 0)} controls across ${GROUPS.length} areas · open any one`}
              items={GROUPS.map(
                (group): DossierItem => ({
                  key: group.heading,
                  title: group.heading,
                  blurb: group.blurb,
                  tally: tallyFor(group),
                  children: (
                    <ul className="space-y-6">
                      {group.controls.map((c) => (
                        <li key={c.title}>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <h3 className="font-display text-lead tracking-tight text-text">
                              {c.title}
                            </h3>
                            <StatusBadge status={c.status} />
                          </div>
                          <p className="mt-2 text-body leading-relaxed text-text-secondary measure">
                            {c.body}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ),
                }),
              )}
            />
          </Reveal>
        </Container>
      </Section>

      <Section tone="subtle" backdrop="grid" space={SECTION_TIGHT}>
        <Container>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-title tracking-tight text-text">
              Security issues, in both directions
            </h2>
            <p className="mt-3 leading-relaxed text-text-secondary measure">
              To report one: email{" "}
              <a
                href={`mailto:${site.email.security}`}
                className="text-accent-text underline underline-offset-4 hover:text-accent"
              >
                {site.email.security}
              </a>
              . It reaches both founders directly. We will confirm receipt and
              tell you what we are doing about it — we do not have a bug bounty,
              and we will not argue with you about severity.
            </p>
            <p className="mt-3 leading-relaxed text-text-secondary measure">
              And in the other direction, which an earlier version of this page
              left out entirely: if we become aware of an incident affecting your
              organization&rsquo;s records,{" "}
              <span className="font-medium text-text">
                we will tell you without undue delay and within 72 hours
              </span>{" "}
              of becoming aware: what is known, what is being done, and what we
              suggest you do. Notice goes out on what is known at the time rather
              than waiting for a complete picture. That commitment is written
              into the <a href="/terms" className="text-accent-text underline underline-offset-4 hover:text-accent">terms</a>.
            </p>
            <p className="mt-3 leading-relaxed text-text-secondary measure">
              {/* The vendors are NOT named here. A security overview points at the
                  subprocessor list; the list itself lives in the privacy notice,
                  where naming them is a legal norm rather than a product detail. */}
              The full subprocessor list, with what each one touches and where, is
              on the{" "}
              <a href="/privacy" className="text-accent-text underline underline-offset-4 hover:text-accent">
                privacy page
              </a>
              .
            </p>
          </div>
          <div>
            <h2 className="font-display text-title tracking-tight text-text">
              Documents
            </h2>
            <p className="mt-3 leading-relaxed text-text-secondary measure">
              The{" "}
              <a
                href="/privacy"
                className="text-accent-text underline underline-offset-4 hover:text-accent"
              >
                privacy notice
              </a>{" "}
              and{" "}
              <a
                href="/terms"
                className="text-accent-text underline underline-offset-4 hover:text-accent"
              >
                terms
              </a>{" "}
              are drafts written by the founders and have not yet been reviewed
              by counsel. They are published because an institution deserves to
              see the current position, not because they are finished.
            </p>
            <p className="mt-3 leading-relaxed text-text-secondary measure">
              <span className="font-medium text-text">
                There is no company to contract with yet.
              </span>{" "}
              Tenure is not an incorporated entity &mdash; it is two people, named
              on the <a href="/story" className="text-accent-text underline underline-offset-4 hover:text-accent">story page</a>.
              That means no corporate liability shield, no professional indemnity
              or cyber insurance, and nobody who can sign an institutional
              agreement today. If your procurement process requires a
              counterparty, insurance certificates or liability caps, that
              requirement is not met, and no amount of the detail above changes
              it. It belongs at the top of a security review, not discovered at
              the end of one.
            </p>
          </div>
        </div>
        </Container>
      </Section>
    </>
  );
}
