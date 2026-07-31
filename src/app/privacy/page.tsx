import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/lib/site";

export const metadata = {
  title: "Privacy",
  description:
    "How Tenure handles the information you and your organization put into the record, written in plain language.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy"
        intro="How Tenure handles information, in plain language. Last updated June 2026."
      />

      <Container>
        <div className="legal max-w-2xl pb-24">
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
            power AI onboarding, so when a leader leaves a seat, an AI grounded in
            everything the role has recorded can get the next person productive in
            days instead of a semester. We do not sell personal information. We
            use it to deliver the service you&rsquo;re asking for, not to build a
            business out of your data.
          </p>
          <p>
            One piece of that deserves saying plainly, because a security review
            will ask. Tenure AI answers from records the person asking already
            has permission to see, and it shows its sources. To turn those
            sources into an answer, the relevant record text is sent to
            Anthropic&rsquo;s API, the model provider we use. So some of your
            record does leave our infrastructure at the moment someone asks a
            question, and you should hear that from us rather than find it later.
            Your records are never used to train any model, by us or by
            Anthropic. We do not train or fine-tune models on customer data, and
            we have no pipeline that could.
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
              <strong>Service providers we rely on</strong> to operate Tenure, 
              for example, hosting, infrastructure, and the AI provider
              described above, under confidentiality obligations, and only as
              needed to run the service.
            </li>
          </ul>

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
            We treat student information on a least-access basis: people see what
            their role needs, and no more. The institution or organization owns
            its records, not Tenure, and not the individuals who pass through a
            seat. We aim to support FERPA-conscious handling of education records,
            and we&rsquo;ll work with your administration on the policies and
            controls that fit your institution.
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

          <h2>Your choices</h2>
          <p>
            You can request access to the information we hold about you, ask for
            an export, or request deletion. The simplest way is to contact us and
            tell us what you need; we&rsquo;ll work with you and your organization
            to honor the request.
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
            at <a href={`mailto:${site.email}`}>{site.email}</a> and we&rsquo;ll
            help.
          </p>
        </div>
      </Container>
    </>
  );
}
