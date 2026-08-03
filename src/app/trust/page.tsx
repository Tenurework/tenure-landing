import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/site/PageHeader";
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
      "Each institution's record is separated at the database-client layer, not by convention in each query.",
    controls: [
      {
        title: "Tenant filter attached to the database client — directly on 15 of 39 models",
        status: "ci",
        body: "The tenant scope is applied by a Prisma client extension rather than by each call site, so an individual query cannot decline it. Enforcement is switched on in production infrastructure and asserted in continuous integration against a real PostgreSQL instance across read, count, update, delete, cross-tenant create, missing-context and concurrent-context cases. The scope is stated in the heading rather than the footnote, because 15 of 39 is the honest headline.",
        limit:
          "The other 24 models are reached through their parent relation and are recorded in the tenancy registry as not independently enforceable at the query layer — a query that reaches them without going through the parent is not caught by the extension. This is also query-layer enforcement, not PostgreSQL row-level security: no CREATE POLICY exists.",
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
        body: "An incoming officer is added to a seat before their term begins with read-only access to the seat's record, including the knowledge cards scoped to that seat. On the start date it becomes write access. An outgoing officer moves to alumni: the record stays, the access does not.",
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
        limit:
          "Coverage is 49 of 63 server actions. Messaging, activity-feed, profile and resource writes do not currently append a row, and AI or search queries are not recorded in the trail.",
      },
      {
        title: "Decisions record the deciding seat",
        status: "live",
        body: "Each approval step permanently records who decided, the seat they held at that moment, what the request moved from and to, and — where a backup approver acted — that it was done on another seat's behalf.",
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
          "Backup retention is ONE DAY. That is the setting in production infrastructure today, and it means an issue discovered on Wednesday cannot be recovered from Monday's state. For a system of record that is too short, we know it, and it is the single infrastructure number an institution should push us on.",
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
        body: "The corpus is assembled under the asking person's own permissions before anything is ranked or sent, so the model is never given records that the person asking could not already open themselves.",
      },
      {
        title: "Model provider: Anthropic",
        status: "live",
        body: "Answer synthesis calls Anthropic's API directly (Claude Haiku 4.5). Retrieved record text is included in that request, so some of your record does leave our infrastructure at the moment a question is asked. Anthropic is the only model subprocessor.",
        limit:
          "One platform-wide API key serves all tenants. There is no per-tenant key, no per-tenant usage quota, and no per-tenant opt-out.",
      },
      {
        title: "Training on customer data",
        status: "unsupported",
        body: "No fine-tuning or training pipeline exists anywhere in the product. Your records are not used to train any model by us.",
        limit:
          "Anthropic's own handling of API data is governed by their commercial terms, not by ours. Ask us for the current terms rather than taking a marketing sentence for it.",
      },
      {
        title: "Retrieval quality",
        status: "validating",
        body: "Retrieval is keyword matching over five record kinds — knowledge cards, document titles and descriptions, approvals, events and organization records. Answers link the records they came from.",
        limit:
          "There is no semantic or vector search. Document file contents are not indexed, only titles and descriptions. Finance figures and people records are not in the corpus, so those questions cannot be answered by the assistant today.",
      },
      {
        title: "Behaviour when the model is unavailable",
        status: "live",
        body: "If synthesis is unavailable, the ranked and permission-scoped sources are still returned, and the interface says which happened.",
      },
    ],
  },
  {
    heading: "Identity and integrations",
    blurb: "What Tenure connects to, and what it does not.",
    controls: [
      {
        title: "How people sign in",
        status: "validating",
        body: "Pilot accounts are created by us in advance against a named person. There is no public registration and no self-service signup. Sessions are issued as signed tokens by the application's auth layer.",
        limit:
          "This is a pilot-grade access model, and it is the weakest control on this page. There is no MFA, no password policy you can configure, no lockout threshold you can set, and no account-recovery flow. Until institutional SSO lands, Tenure should not hold student data your institution would classify as sensitive, and we will not tell you otherwise to win a pilot. Ask us directly for the current mechanism and we will walk you through it under NDA.",
      },
      {
        title: "Multi-factor authentication",
        status: "unsupported",
        body: "MFA is not available in any form today.",
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

export default function TrustPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trust"
        title="What is actually built, and what is not."
        intro="Tenure is an early-stage product run by two founders. The fastest way to lose an institution's trust is to blur what is shipped with what is planned, so this page separates them explicitly."
      />

      <Container>
        {/* Status vocabulary — defined once, up front. */}
        <div className="border-b border-line py-12">
          <h2 className="font-display text-xl font-semibold tracking-tight text-text">
            How to read this page
          </h2>
          <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(STATUSES) as StatusKey[]).map((key) => (
              <div key={key} className="flex items-start gap-3">
                <dt className="pt-0.5">
                  <StatusBadge status={key} />
                </dt>
                <dd className="text-[0.9rem] leading-relaxed text-text-secondary">
                  {STATUSES[key].hint}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="pb-6">
          {GROUPS.map((group) => (
            <section key={group.heading} className="border-b border-line py-12">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-text">
                    {group.heading}
                  </h2>
                  <p className="mt-3 leading-relaxed text-text-secondary">
                    {group.blurb}
                  </p>
                </div>

                <ul className="space-y-7">
                  {group.controls.map((c) => (
                    <li key={c.title}>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h3 className="font-display text-[1.05rem] font-semibold tracking-tight text-text">
                          {c.title}
                        </h3>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-text-secondary">
                        {c.body}
                      </p>
                      {c.limit && (
                        <p className="mt-3 border-l-2 border-border-strong pl-4 text-[0.9rem] leading-relaxed text-text-muted">
                          <span className="font-medium text-text-secondary">
                            Limit:{" "}
                          </span>
                          {c.limit}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <div className="grid gap-8 py-14 sm:grid-cols-2">
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
              The full subprocessor list — AWS, Anthropic, Vercel and Calendly,
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
    </>
  );
}
