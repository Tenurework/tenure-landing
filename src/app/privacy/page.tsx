import { Container } from "@/components/ui/layout";
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
        <div className="legal max-w-2xl pb-24">
          {/* Publishing the current position honestly is better than publishing
              nothing, but an institution must not mistake a founder draft for a
              reviewed instrument. */}
          <div className="mb-10 rounded-xl border border-line bg-warning-subtle px-5 py-4 text-[0.92rem] leading-relaxed text-warning">
            <strong className="font-semibold">This is a founder-written draft.</strong>{" "}
            It has not been reviewed by counsel, and Tenure is not yet an
            incorporated entity &mdash; &ldquo;Tenure&rdquo; below is a trading
            name for the two founders named on the{" "}
            <a href="/story">story page</a>. If you are evaluating Tenure for an
            institution, treat this as a statement of current practice and ask us
            for the reviewed version before signing anything.
          </div>

          <h2>Overview</h2>
          <p>
            Tenure is an early-stage ERP for organizations where leadership turns over faster than knowledge does, starting with university administrations and
            student organizations. The platform holds an organization&rsquo;s
            operations and institutional memory, finance, events, members,
            documents, and the decisions behind them, so the record stays with
            the seat when the people in it rotate. This page explains, in plain
            terms, what information we collect, how we use it, and the choices you
            have. We&rsquo;ll keep it honest and update it as the product grows.
          </p>

          <h2>Information we collect</h2>
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

          <h2>How we use it</h2>
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
            Anthropic&rsquo;s API, the model provider we use. So some of your
            record does leave our infrastructure at the moment someone asks a
            question, and you should hear that from us rather than find it later.
            We do not train or fine-tune models on customer data, and there is no
            pipeline anywhere in the product that could. Anthropic&rsquo;s own
            handling of data sent to its API is governed by Anthropic&rsquo;s
            commercial terms rather than ours; ask us for the terms in force
            rather than taking a sentence on a marketing page for it.
          </p>

          <h2>Who can see it</h2>
          <ul>
            <li>
              <strong>Your organization&rsquo;s members</strong>, and the boards
              that inherit the record when a term ends.
            </li>
            <li>
              <strong>Not the public.</strong> Your record is private to your
              organization by default.
            </li>
            <li>
              <strong>The subprocessors listed below</strong>, under
              confidentiality obligations and only as needed to run the service.
            </li>
          </ul>

          <h2>Subprocessors</h2>
          <p>
            The complete list, so a security review can put it in a risk register
            rather than ask us for it. An earlier version of this page named only
            the AI provider, which was not enough to be useful.
          </p>
          <ul>
            <li>
              <strong>Amazon Web Services</strong> &mdash; hosting, database and
              document storage for the application. Data is held in AWS&rsquo;s
              United States regions. Encryption at rest uses AWS-managed keys;
              there is no customer-managed key option today.
            </li>
            <li>
              <strong>Anthropic</strong> &mdash; the model provider. Receives the
              permission-filtered record text needed to answer a question, at the
              moment someone asks one, as described above.
            </li>
            <li>
              <strong>Vercel</strong> &mdash; hosting for this marketing website
              only. It does not touch your organization&rsquo;s record.
            </li>
            <li>
              <strong>Calendly</strong> &mdash; scheduling, and only if you open
              the scheduler on our <a href="/contact">contact page</a>. It sets
              its own cookies and shows its own consent prompt when you do.
            </li>
          </ul>
          <p>
            If we add a subprocessor that touches organizational records, we will
            update this list and tell active organizations before it starts
            processing.
          </p>

          <h2>This website</h2>
          <p>
            The marketing site you are reading sets no analytics or advertising
            cookies, and we do not track you across it. Nothing third-party loads
            on any page until you ask for it &mdash; the scheduler on the contact
            page is the only such thing, and it loads only after you press a
            button. If you never open it, no third party sees your visit.
          </p>

          <h2>Who owns it</h2>
          <p>
            The organization owns its record. That&rsquo;s the whole point of
            Tenure: the role persists while the people rotate, so knowledge
            belongs to the seat, not the person who held it. Individuals do not
            take the record with them when their term ends. It carries forward to
            whoever inherits the role.
          </p>

          <h2>Student data</h2>
          <p>
            Access is scoped to the seat a person holds, and the institution or
            organization owns its records &mdash; not Tenure, and not the
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
            <a href="/trust">trust page</a> lists what is and is not built.
          </p>

          <h2>Security</h2>
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

          <h2>Your choices, and where deletion genuinely stops</h2>
          <p>
            You can ask us what we hold about you, ask for an export, or ask for
            deletion, by writing to us. Two of those are simple. Deletion needs an
            honest answer, because an earlier version of this page promised
            something the product is deliberately built to refuse.
          </p>
          <ul>
            <li>
              <strong>Your personal account details</strong> &mdash; name, email,
              profile &mdash; can be removed or anonymised on request.
            </li>
            <li>
              <strong>An organization&rsquo;s whole record</strong> can be
              exported and deleted at the end of the relationship, on the
              instruction of that organization&rsquo;s current leadership.
            </li>
            <li>
              <strong>Individual entries you made cannot be erased from a
              seat&rsquo;s history on your own say-so.</strong> That is the
              product working as designed: a seat carrying history refuses
              deletion, and an outgoing officer is moved to alumni rather than
              removed. If a departing treasurer could delete the budget decisions
              they made, the record would not survive turnover &mdash; which is
              the entire point of Tenure.
            </li>
          </ul>
          <p>
            So: access is revoked, history is retained. If you need a specific
            entry corrected or removed for a legal reason, contact us and we will
            work with your organization&rsquo;s leadership on it &mdash; but we
            will not quietly delete institutional history at the request of one
            person who is leaving. The{" "}
            <a href="/trust">trust page</a> states the same limit from the
            product&rsquo;s side.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            As Tenure develops, we may update this policy to reflect how the
            product actually works. When we make a meaningful change, we&rsquo;ll
            update the date at the top of this page so you can see when it last
            changed.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about privacy, or a request about your information? Email us
            at <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
            and we&rsquo;ll help.
          </p>
        </div>
      </Container>
    </>
  );
}
