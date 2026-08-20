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
  limit?: string;
};

type Group = { heading: string; blurb: string; controls: Control[] };

/**
 * Every entry below is written from the deploying application's code, not from
 * the architecture documents. Where the two disagree, the deployed behaviour
 * wins and the gap is stated as a limit rather than omitted.
 */
const GROUPS: Group[] = [
  {
    heading: "Tenant boundaries",
    blurb:
      "Each institution’s record is separated at the database-client layer, not by convention in each query.",
    controls: [
      {
        title: "Tenant filter attached to the database client — directly on 18 of 41 models",
        status: "ci",
        body: "The tenant scope is applied by a Prisma client extension rather than by each call site, so an individual query cannot decline it. Enforcement is switched on in production infrastructure and asserted in continuous integration against a real PostgreSQL instance across read, count, update, delete, cross-tenant create, missing-context and concurrent-context cases. The scope is stated in the heading rather than the footnote, because 18 of 41 is the honest headline.",
        // The old sentence said all 24 remaining models "are reached through their
        // parent relation", which the registry it cites contradicts twice: five are
        // platform-global by design and have no tenant parent, and DirectoryPerson is
        // recorded with reachableVia "(none)". Describing the model that holds real
        // student and advisor contact details as parent-protected made the disclosure
        // less honest than the code it describes.
        limit:
          "Of the other 23: five are platform-global by design — the institution row itself, plus the identity and session rows — and are not tenant-owned. The remaining eighteen are tenant-owned but carry no column the query layer can filter on, and are reachable only through a scoped parent, so they are protected by whatever check the calling code performs rather than by the extension. DirectoryPerson, which holds contact details and used to be the one parentless exception on this list, now carries the column and is filtered like the rest. This is query-layer enforcement, not PostgreSQL row-level security: no CREATE POLICY exists.",
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
        title: "Per-organization scoping for institution staff",
        status: "unsupported",
        body: "Any account with an institution membership can currently read every organization in the portfolio. An advisor relation exists in the schema but does not narrow reads.",
        limit:
          "Stated plainly because it is the question an institution should ask. If you need advisors scoped to assigned organizations, that work is not done and we will not pretend otherwise.",
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
        limit:
          "Every use is written to the audit trail with the deciding seat, but nothing prevents it and no second party is required. If your policy needs a four-eyes control on overrides, Tenure does not have one.",
      },
      {
        title: "Separation of duties on approvals",
        status: "unsupported",
        body: "There is no control preventing a requester who also holds an approving seat from approving their own request. The requester is identified in the code but is not excluded from the approving step.",
        limit:
          "If your finance policy requires enforced segregation, Tenure does not satisfy it today.",
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
        // The published fraction was "49 of 63 server actions", and it did not survive
        // a recount. Three methods over the deploying repo at 819aec0e produced three
        // different answers, and the exclusion list was wrong on its own terms:
        // resources/actions.ts routes both of its writes through an audited helper in
        // resources-data.ts, and document summarization writes a Document.Summarized
        // row, so "resource writes" and "AI ... not recorded at all" were both false.
        // Publishing a precise figure again needs a count generated in the deploying
        // repo, not one typed here — see the bible's rule on hardcoded metrics. What
        // is stated below is what was verified action-by-action.
        limit:
          "Coverage is partial and is not yet counted by anything that would fail if it drifted, so no fraction is published here. Verified today: administrative actions are audited through the capability guard, which records the denial as well as the allow; approvals, finance, documents, members, memory, delegation and resource writes append rows. Messaging, activity-feed and profile writes do not. Search queries are not recorded; of the AI paths, only document summarization is.",
      },
      {
        title: "Decisions record the deciding seat",
        status: "live",
        body: "Each approval step permanently records who decided, the seat they held at that moment, what the request moved from and to, and — where a backup approver acted — that it was done on another seat’s behalf.",
      },
      {
        title: "Cryptographic tamper-evidence",
        status: "unsupported",
        body: "The audit table has no hash chain, signature or checksum column. Append-only is enforced by the application, not by cryptography or by write-once storage.",
        limit:
          "Any vendor claiming immutability should be asked which of those three it means. For Tenure today it is the first.",
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
        limit:
          "Keys are AWS-managed. There is no customer-managed key, and no bring-your-own-key option.",
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
        limit:
          "Backup retention is ONE DAY. That is the setting in production infrastructure today, and it means an issue discovered on Wednesday cannot be recovered from Monday’s state. For a system of record that is too short, we know it, and it is the single infrastructure number an institution should push us on.",
      },
      {
        title: "Restore testing and disaster recovery",
        status: "unsupported",
        body: "No restore has been rehearsed, there is no documented recovery objective, and there is no second region. Backups exist; the process for using them under pressure does not.",
      },
      {
        title: "Bulk export",
        status: "roadmap",
        body: "There is no self-service export path in the application today. Export and deletion requests are handled by us, by hand, on request.",
        limit:
          "This is a dependency on us being reachable. It matters most in exactly the scenario where you would least want it — see the wind-down commitment in the terms.",
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
        title: "Model provider: Amazon Bedrock, running an Anthropic model",
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
        body: "Answer synthesis runs on Amazon Bedrock, using an Anthropic Claude Haiku 4.5 model by default. Bedrock authenticates with the task role the application already runs under, so there is no long-lived model API key to rotate or leak. Three things are sent: the records retrieved for a question, the contents of a text document when a summary is requested, and the instruction typed into Draft Assist — so some of your record does leave our own infrastructure at those moments.",
        limit:
          "The direct Anthropic API is retained as a fallback: an environment configured with a key but no Bedrock region calls api.anthropic.com instead, so record text can leave AWS. Neither model provider offers a per-tenant key or a per-tenant opt-out, and there is no per-tenant usage quota — Tenure applies its own ceiling instead, per person rather than per institution: 40 AI requests and 120,000 tokens each per day. The model id is an environment variable and is not validated against an allowlist.",
      },
      {
        title: "Training on customer data",
        status: "unsupported",
        body: "No fine-tuning or training pipeline exists anywhere in the product. Your records are not used to train any model by us.",
        limit:
          "Anthropic’s own handling of API data is governed by their commercial terms, not by ours. Ask us for the current terms rather than taking a marketing sentence for it.",
      },
      {
        title: "Retrieval quality",
        status: "validating",
        body: "Retrieval is keyword matching over five record kinds — knowledge cards, document titles and descriptions, approvals, events and organization records. Answers link the records they came from.",
        // The conjunctive rule is the property that decides whether a buyer's question
        // works at all, and it was the one thing this limit did not say. Every token
        // longer than one character must appear literally in a single record — no
        // stemming, no synonyms, no stopword removal — so a full-sentence question
        // is an AND over its every word, including "what" and "our", and typically
        // returns nothing.
        limit:
          "There is no semantic or vector search, and matching is literal and conjunctive: every word of a query longer than one character must appear in the same record, with no stemming, synonyms or stopword removal. Short, specific queries work; full-sentence questions often return nothing. Document file contents are not indexed for search, only titles and descriptions — though a document’s contents are sent to the model when someone explicitly asks for a summary. Finance figures and people records are not in the corpus, so those questions cannot be answered by the assistant today.",
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
        // four are false: Cognito is the registered credentials provider, the
        // pool carries a 12-character policy, TOTP is available and recovery
        // runs to a verified email. Understating your own security to an
        // institution is not caution, it is just a different inaccuracy.
        body: "Accounts live in an Amazon Cognito user pool and each person signs in with their own email and password — a 12-character minimum requiring upper case, lower case, a number and a symbol. Credentials are verified server-side against the pool rather than through a hosted redirect, and account recovery runs to a verified email address and nothing else. Accounts are still created by us in advance against a named person: there is no public registration and no self-service signup. Authentication and membership are separate questions — holding a Cognito account is not access to an organization, which is decided from the roster.",
        limit:
          "Institutional SSO is the gating item for going beyond a pilot, and it is not deployed. An interim access path is still provisioned alongside per-user sign-in for the pilot term; ask us directly and we will walk you through the current arrangement under NDA. Until SSO lands, Tenure should not hold records your organization would classify as sensitive — student data, donor or beneficiary records, payroll, anything you would have to notify someone about, and we will not tell you otherwise to win a pilot.",
      },
      {
        title: "Multi-factor authentication",
        status: "validating",
        body: "Time-based one-time-password multi-factor is available on the user pool and a person can enrol an authenticator app.",
        limit:
          // The register permits "available", never "enforced": cognito_mfa_mode
          // defaults to OPTIONAL and that is a deliberate pilot decision, not an
          // oversight. Calling this "MFA protected" would overstate it exactly as
          // far as the old row understated it.
          "It is OPTIONAL, not enforced. Nobody is required to enrol before reaching the product, so you should assume some people in a pilot cohort will not. Raising it to required for privileged staff is a policy change we can make with you; it needs a support path for a lost authenticator first. SMS and hardware keys are not offered.",
      },
      {
        title: "Single sign-on (SAML / OIDC)",
        status: "roadmap",
        body: "Institutional SSO is not deployed. It is the gating item for taking Tenure beyond a pilot.",
        limit:
          "If SSO is a procurement precondition, it is not met today. We would rather tell you now than during a security review.",
      },
      {
        title: "Calendar subscription",
        status: "live",
        body: "A per-user signed feed that Outlook, Google Calendar and Apple Calendar can subscribe to with one link. No account connection and no password shared; the feed shows only what that person is already allowed to see.",
        limit: "One-way. Tenure fills your calendar and does not read it back.",
      },
      {
        title: "Spreadsheet and document handling",
        status: "live",
        body: "Budget spreadsheets are imported with column matching, and PDF, Word, Excel and PowerPoint files open in the application. Text files and spreadsheets can be edited in place with a save-conflict check.",
      },
      {
        title: "Connectors to third-party systems",
        status: "unsupported",
        body: "Tenure does not connect to Google Drive, Slack, Notion, Teams, Dropbox, Box, Zoom or Discord. There is no integration framework, no public API and no webhooks. Files and decisions live in Tenure itself.",
      },
    ],
  },
  {
    heading: "Compliance",
    blurb:
      "Stated as posture, not as certification. None of the below is an attestation by a third party.",
    controls: [
      {
        title: "SOC 2",
        status: "roadmap",
        body: "On the roadmap. There is no audit in progress, no control set operating, and no report to share. Anyone telling you otherwise about a company this size is worth a second question.",
      },
      {
        title: "FERPA",
        status: "roadmap",
        body: "We aim to support FERPA-conscious handling of education records and will work with your administration on the controls that fit your institution. Record-level classification for education-record policy is not built.",
        limit:
          "This is not a compliance assertion and has not been reviewed by counsel. Treat it as our intent, not as an answer to your compliance questionnaire.",
      },
      {
        title: "Penetration test / third-party assessment",
        status: "unsupported",
        body: "No external assessment has been performed.",
      },
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
  const roadmap = n("roadmap");
  const missing = n("unsupported");
  const validating = n("validating");

  const out: { label: string; tone?: "quiet" | "good" | "warn" | "bad" }[] = [];
  if (shipped) out.push({ label: `${shipped} live`, tone: "good" });
  if (validating) out.push({ label: `${validating} in pilot validation`, tone: "quiet" });
  if (roadmap) out.push({ label: `${roadmap} roadmap`, tone: "warn" });
  if (missing) out.push({ label: `${missing} not supported`, tone: "bad" });
  return out;
}

export default function TrustPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trust"
        title="What is actually built, and what is not."
        intro="Tenure is an early-stage product run by two founders. The fastest way to lose an institution’s trust is to blur what is shipped with what is planned, so this page separates them explicitly."
      />

      <Section backdropSeed={18} tone="canvas" backdrop="quiet" divide={false}>
        <Container>
          {/* Status vocabulary — defined once, up front. It is the key to the
              whole page, so it stays expanded and above the dossier rather than
              becoming one more thing to open. */}
          <Panel>
            <PanelBar
              title="How to read this page"
              meta="five words, used precisely, on every row below"
            />
            <dl className="grid gap-x-8 gap-y-3.5 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              {(Object.keys(STATUSES) as StatusKey[]).map((key) => (
                <div key={key} className="flex items-start gap-3">
                  <dt className="pt-0.5">
                    <StatusBadge status={key} />
                  </dt>
                  <dd className="text-[0.88rem] leading-relaxed text-text-secondary">
                    {STATUSES[key].hint}
                  </dd>
                </div>
              ))}
            </dl>
            <PanelNote>
              Every entry below is written from the deploying application&rsquo;s code,
              not from an architecture document. Where the two disagree, the
              deployed behaviour wins and the gap is stated as a limit rather than
              left out.
            </PanelNote>
          </Panel>

          {/*
            Seven groups, thirty controls. As a flat list this was 8.9 desktop
            viewports of continuous prose, and the thing a reviewer actually wants
            — "which of these is not supported?" — could only be found by reading
            all of it. Each group now carries its tally on the summary row, so the
            shape of the answer is visible before anything is opened.

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
                            <h3 className="font-display text-[1.02rem] font-semibold tracking-tight text-text">
                              {c.title}
                            </h3>
                            <StatusBadge status={c.status} />
                          </div>
                          <p className="mt-2 text-[0.94rem] leading-relaxed text-text-secondary">
                            {c.body}
                          </p>
                          {c.limit && (
                            <p className="mt-2.5 border-l-2 border-border-strong pl-4 text-[0.89rem] leading-relaxed text-text-muted">
                              <span className="font-medium text-text-secondary">
                                Limit:{" "}
                              </span>
                              {c.limit}
                            </p>
                          )}
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

      <Section backdropSeed={19} tone="subtle" backdrop="drafting" space={SECTION_TIGHT}>
        <Container>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-text">
              Security issues, in both directions
            </h2>
            <p className="mt-3 leading-relaxed text-text-secondary">
              To report one: email{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-accent-text underline underline-offset-4 hover:text-accent"
              >
                {site.email}
              </a>
              . It reaches both founders directly. We will confirm receipt and
              tell you what we are doing about it — we do not have a bug bounty,
              and we will not argue with you about severity.
            </p>
            <p className="mt-3 leading-relaxed text-text-secondary">
              And in the other direction, which an earlier version of this page
              left out entirely: if we become aware of an incident affecting your
              organization&rsquo;s records,{" "}
              <span className="font-medium text-text">
                we will tell you without undue delay and within 72 hours
              </span>{" "}
              of becoming aware — what we know, what we do not, what we are doing,
              and what we suggest you do. We will not wait for a complete picture
              before telling you something happened. That commitment is written
              into the <a href="/terms" className="text-accent-text underline underline-offset-4 hover:text-accent">terms</a>.
            </p>
            <p className="mt-3 leading-relaxed text-text-secondary">
              The full subprocessor list — AWS (including Bedrock), Anthropic, Vercel and Calendly,
              with what each one touches and where — is on the{" "}
              <a href="/privacy" className="text-accent-text underline underline-offset-4 hover:text-accent">
                privacy page
              </a>
              .
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-text">
              Documents
            </h2>
            <p className="mt-3 leading-relaxed text-text-secondary">
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
            <p className="mt-3 leading-relaxed text-text-secondary">
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
