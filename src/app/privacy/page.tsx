import { Container } from "@/components/ui/layout";
import { Dossier } from "@/components/ui/Dossier";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy"
        intro="How Tenure handles information, in plain language. Last updated 2 August 2026."
      />

      <Container>
        {/*
          THE LEGAL TEXT IS A DOSSIER, NOT A WALL.

          This page was one unbroken run of 12 <h2> sections, 5.5 desktop
          viewports and nearly nine on a phone, for fewer words than /trust fits
          into 3.6. /trust and /pilot were compacted with `Dossier` and these two
          were not, which left the site’s two longest-per-word pages using the one
          pattern the compaction pass existed to replace.

          Not one word is cut. Native <details> keeps every sentence in the DOM,
          so Ctrl+F still finds a clause inside a collapsed section and
          claims.spec.ts can still audit the whole page, the two reasons
          Dossier.tsx is not a JavaScript rail.

          The founder-draft warning stays ABOVE the accordion and outside it. It
          is the one thing on this page that must never be behind a click.
        */}
        <div className="mx-auto max-w-3xl pb-16">
          {/* Publishing the current position honestly is better than publishing
              nothing, but an institution must not mistake a founder draft for a
              reviewed instrument. */}
          <div className="mb-8 rounded-xl border border-line bg-warning-subtle px-5 py-4 text-body leading-relaxed text-warning">
            <strong className="font-medium">Current practice, not a negotiated instrument.</strong>{" "}
            Tenure is operated by its founders and is not yet incorporated, so this
            notice states how information is handled today rather than forming part
            of a signed agreement. An institution&rsquo;s deployment terms are
            agreed separately, write to{" "}
            <a href={`mailto:${site.email.privacy}`}>{site.email.privacy}</a> for
            the version your review needs.
          </div>

          <Dossier
            name="privacy"
            title="Privacy notice"
            meta="plain language · open any section"
            items={[
              {
                key: "Overview",
                title: "Overview",
                blurb: "What Tenure is, whose record it holds, and what this page covers.",
                children: (
                  <div className="legal">
                    <p>
                    Tenure is the system of record for organizations where
                    leadership turns over faster than knowledge does, universities,
                    nonprofits and NGOs, small and mid-sized businesses, associations and
                    chapters. The platform holds an organization&rsquo;s
                    operations and institutional memory, finance, events, members,
                    documents, and the decisions behind them, so the record stays with
                    the seat when the people in it rotate. This page explains, in plain
                    terms, what information we collect, how we use it, and the choices you
                    have. We&rsquo;ll keep it honest and update it as the product grows.
                    </p>
                  </div>
                ),
              },
              {
                key: "Information we collect",
                title: "Information we collect",
                blurb: "Account details, the organizational records you choose to store, and basic usage data.",
                children: (
                  <div className="legal">
                    <ul>
                    <li>
                    <strong>Account details you provide</strong>, things like your
                    name, email, role, and the organization you belong to.
                    </li>
                    <li>
                    <strong>The organizational records you choose to store</strong>,
                    the finances, events, members, documents, notes, and history your
                    organization decides to keep in Tenure.
                    </li>
                    <li>
                    <strong>Basic usage data</strong>, the operational information we
                    need to run the service reliably and keep it secure.
                    </li>
                    </ul>
                  </div>
                ),
              },
              {
                key: "How we use it",
                title: "How we use it",
                blurb: "Running the service, and the three moments record text leaves our infrastructure.",
                children: (
                  <div className="legal">
                    <p>
                    We use the information to run Tenure, support your organization, and
                    answer questions from the seat&rsquo;s own record, so an incoming
                    leader can read what the role already knows instead of reconstructing
                    it. We do not sell personal information. We use it to deliver the
                    service you&rsquo;re asking for, not to build a business out of your
                    data.
                    </p>
                    <p>
                    One piece of that deserves saying plainly, because a security review
                    will ask. Tenure AI answers from records the person asking already
                    has permission to see, and it shows its sources. To turn those
                    sources into an answer, the relevant record text is sent to
                    Amazon Bedrock, which runs the Anthropic model we use. The same is
                    true when someone asks for a summary of a text document, which sends
                    that document&rsquo;s contents, and when someone uses Draft Assist,
                    which sends what they typed. So some of your record does leave our
                    own infrastructure at those moments, and you should hear that from us
                    rather than find it later. The Anthropic API can also be called
                    directly as a fallback, in which case that text leaves AWS as well.
                    We do not train or fine-tune models on customer data, and there is no
                    pipeline anywhere in the product that could. Each provider&rsquo;s own
                    handling of data sent to it is governed by that provider&rsquo;s
                    commercial terms rather than ours; ask us for the terms in force.
                    </p>
                  </div>
                ),
              },
              {
                key: "Who can see it",
                title: "Who can see it",
                blurb: "Seat-based access inside your organization, and who at Tenure can reach a record.",
                children: (
                  <div className="legal">
                    <ul>
                    <li>
                    <strong>Your organization&rsquo;s members</strong>, and the boards
                    that inherit the record when a term ends.
                    </li>
                    {/*
                    Institution staff were missing from the bullet list a privacy reviewer
                    builds their data-flow map from, and "private to your organization"
                    affirmatively contradicted the limit stated further down the page. The
                    enforced boundary is the institution: the Prisma extension scopes by
                    institutionId, and any account with an institution membership resolves
                    every organization in the portfolio.
                    */}
                    <li>
                    <strong>Institution staff at the office that stewards your
                    organization.</strong>{" "}
                    Today that means any institution account can
                    read every organization in the portfolio, not only the ones it
                    advises.
                    </li>
                    <li>
                    <strong>Not the public.</strong>{" "}
                    Records are separated per
                    institution at the database layer; separation between organizations
                    inside one institution is enforced by access rules rather than by
                    that boundary.
                    </li>
                    <li>
                    <strong>The subprocessors listed below</strong>, under
                    confidentiality obligations and only as needed to run the service.
                    </li>
                    </ul>
                  </div>
                ),
              },
              {
                key: "Subprocessors",
                title: "Subprocessors",
                blurb: "Every third party that touches your data, named, with what each one receives.",
                children: (
                  <div className="legal">
                    <p>
                    The complete list, so a security review can put it in a risk register
                    rather than ask us for it. An earlier version of this page named only
                    the AI provider, which was not enough to be useful.
                    </p>
                    <ul>
                    <li>
                    <strong>Amazon Web Services</strong>{" "}
, hosting, database and
                    document storage for the application. Data is held in AWS&rsquo;s
                    United States regions. Encryption at rest uses AWS-managed keys;
                    there is no customer-managed key option today.
                    </li>
                    <li>
                    {/*
                    This row previously disclosed one of three outbound flows. The
                    deploying app calls api.anthropic.com from three places: answer
                    synthesis, document summarization (which reads the file out of S3
                    and sends up to 24,000 characters of its text), and Draft Assist
                    (which sends the instruction the user typed). A reader of "record
                    text needed to answer a question" would not expect the contents of
                    a file to be included, and /trust’s "document file contents are not
                    indexed" made that reading more likely, not less.
                    */}
                    <strong>Amazon Bedrock, and Anthropic</strong>{" "}
, the model providers. Synthesis
                    runs on Bedrock, inside AWS, using an Anthropic model; the Anthropic
                    API is retained as a direct fallback, and record text leaves AWS when
                    that path is the one configured. Either receives permission-filtered
                    record text in three cases: when someone asks a
                    question, the records retrieved for it; when someone asks for a
                    summary of a text document, the contents of that document; and when
                    someone uses Draft Assist, the instruction they typed. Processing
                    location and retention are governed by each provider&rsquo;s commercial
                    terms rather than ours, ask us for the terms in force.
                    </li>
                    <li>
                    <strong>Vercel</strong>{" "}
, hosting for this marketing website
                    only. It does not touch your organization&rsquo;s record.
                    </li>
                    </ul>
                    <p>
                    If we add a subprocessor that touches organizational records, we will
                    update this list and tell active organizations before it starts
                    processing.
                    </p>
                  </div>
                ),
              },
              {
                key: "This website",
                title: "This website",
                blurb: "What this marketing site sets on your browser, and what it does not.",
                children: (
                  <div className="legal">
                    <p>
                    The marketing site you are reading sets no analytics or advertising
                    cookies, and we do not track you across it. Nothing third-party loads
                    on any page until you ask for it, the scheduler on the contact
                    page is the only such thing, and it loads only after you press a
                    button. If you never open it, no third party sees your visit.
                    </p>
                  </div>
                ),
              },
              {
                key: "Who owns it",
                title: "Who owns it",
                blurb: "Your organization owns its record; our licence is limited to running the service.",
                children: (
                  <div className="legal">
                    <p>
                    The organization owns its record. That&rsquo;s the whole point of
                    Tenure: the role persists while the people rotate, so knowledge
                    belongs to the seat, not the person who held it. Individuals do not
                    take the record with them when their term ends. It carries forward to
                    whoever inherits the role.
                    </p>
                  </div>
                ),
              },
              {
                key: "Sensitive records",
                title: "Sensitive records",
                blurb: "What should not be stored in Tenure, and which controls do not exist yet.",
                children: (
                  <div className="legal">
                    <p>
                    Access is scoped to the seat a person holds, and the institution or
                    organization owns its records, not Tenure, and not the
                    individuals who pass through a seat. One limit worth stating plainly:
                    an account with an institution-level membership can currently read
                    every organization that institution stewards, so administrative
                    access is broad by design today rather than narrowed per advisor.
                    </p>
                    <p>
                    We aim to support FERPA-conscious handling of education records and
                    will work with your administration on the policies and controls that
                    fit your institution. That is a statement of intent, not a compliance
                    assertion: no FERPA-specific control is implemented in the product,
                    and this page has not been reviewed by counsel. The{" "}
                    <a href="/trust">security page</a> lists what is and is not built.
                    </p>
                  </div>
                ),
              },
              {
                key: "Security",
                title: "Security",
                blurb: "Encryption, access, backups, including the retention window that is one day.",
                children: (
                  <div className="legal">
                    <p>
                    The database and the files you upload, documents and images, are
                    encrypted at rest. Documents are never served from a raw file URL:
                    every download goes through a signed link that expires in ten
                    minutes.
                    </p>
                    <p>
                    Beyond that, we use reasonable safeguards to protect the information
                    in Tenure. No method of storing or transmitting data is perfectly
                    secure, and we
                    can&rsquo;t promise absolute security, but we take the trust your
                    organization places in us seriously and work to earn it.
                    </p>
                  </div>
                ),
              },
              {
                key: "Your choices, and where deletion genuinely stops",
                title: "Your choices, and where deletion genuinely stops",
                blurb: "Export, correction and deletion, including the request that has no button yet.",
                children: (
                  <div className="legal">
                    <p>
                    You can ask us what we hold about you, ask for an export, or ask for
                    deletion, by writing to us. Two of those are simple. Deletion needs an
                    honest answer, because an earlier version of this page promised
                    something the product is deliberately built to refuse.
                    </p>
                    <ul>
                    <li>
                    {/*
                    There is no anonymization or user-deletion routine in the deploying
                    app, a repo-wide search for one returns only integration-test
                    fixture cleanup. Stating it as an available control implied a
                    self-service or automated path that does not exist.
                    */}
                    <strong>Your personal account details</strong>{" "}
, name, email,
                    profile, can be removed or anonymized on request. There is no
                    self-service control for this and no automated routine behind it: we
                    do it by hand, and assignments and audit rows that reference you are
                    kept.
                    </li>
                    <li>
                    <strong>An organization&rsquo;s whole record</strong>{" "}
                    can be
                    exported and deleted at the end of the relationship, on the
                    instruction of that organization&rsquo;s current leadership.
                    </li>
                    <li>
                    <strong>Individual entries you made cannot be erased from a
                    seat&rsquo;s history on your own say-so.</strong>{" "}
                    That is the
                    product working as designed: a seat carrying history refuses
                    deletion, and an outgoing officer is moved to alumni rather than
                    removed. If a departing treasurer could delete the budget decisions
                    they made, the record would not survive turnover, which is
                    the entire point of Tenure.
                    </li>
                    </ul>
                    <p>
                    So: access is revoked, history is retained. If you need a specific
                    entry corrected or removed for a legal reason, contact us and we will
                    work with your organization&rsquo;s leadership on it, but we
                    will not quietly delete institutional history at the request of one
                    person who is leaving. The{" "}
                    <a href="/trust">security page</a>{" "}
                    states the same limit from the
                    product&rsquo;s side.
                    </p>
                  </div>
                ),
              },
              {
                key: "Changes to this policy",
                title: "Changes to this policy",
                blurb: "How you find out when this page changes.",
                children: (
                  <div className="legal">
                    <p>
                    As Tenure develops, we may update this policy to reflect how the
                    product actually works. When we make a meaningful change, we&rsquo;ll
                    update the date at the top of this page so you can see when it last
                    changed.
                    </p>
                  </div>
                ),
              },
              {
                key: "Contact",
                title: "Contact",
                blurb: "Where to write, and who replies.",
                children: (
                  <div className="legal">
                    <p>
                    Questions about privacy, or a request about your information? Email us
                    at <a href={`mailto:${site.email.privacy}`}>{site.email.privacy}</a>{" "}
                    and we&rsquo;ll help.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Container>
    </>
  );
}
