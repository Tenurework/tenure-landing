import { Container } from "@/components/ui/layout";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/terms");

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Use"
        intro={
          <>
            The terms for using Tenure during our early access and{" "}
            {site.pilot.season} pilot. Last updated June 2026.
          </>
        }
      />

      <Container>
        <div className="legal max-w-2xl pb-24">
          <p>
            These terms cover how you and your organization may use Tenure while
            the product is in early access. We&rsquo;ve kept them short and plain
            on purpose. If anything here is unclear, write to us and we&rsquo;ll
            explain it directly.
          </p>

          <h2>Acceptance of these terms</h2>
          <p>
            By creating an account or using Tenure, you agree to these terms on
            behalf of yourself and the organization you represent. If you
            don&rsquo;t agree, please don&rsquo;t use the service. If you&rsquo;re
            accepting on behalf of an organization, you confirm you have the
            authority to do so.
          </p>

          <h2>The service</h2>
          <p>
            Tenure is an early-stage ERP for organizations where leadership turns over faster than knowledge does, starting with university administrations and
            student organizations, offered through a pilot and early access. It
            keeps an organization&rsquo;s operations, finance, events,
            members, documents, and institutional memory, in one place, so
            the role persists even as the people in it rotate. Because the
            product is still being built alongside the organizations who use it,
            features may change, appear, or be removed as we learn what actually
            serves each transition.
          </p>

          <h2>Your account and content</h2>
          <p>
            You are responsible for your account and for keeping your login
            secure. You&rsquo;re responsible for the activity that happens under
            it, so let us know promptly if you think someone else has access.
          </p>
          <p>
            Your organization keeps ownership of the content it stores in Tenure.
            We don&rsquo;t claim it as ours. We process it only to provide and
            improve the service for you, as described in our Privacy notice.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Use Tenure for its purpose, running your organization and
            passing on its record. Please don&rsquo;t:
          </p>
          <ul>
            <li>Misuse, disrupt, or attempt to break the service or its security.</li>
            <li>Breach the rights of others, including privacy and intellectual property.</li>
            <li>Upload unlawful content, or content you don&rsquo;t have the right to share.</li>
            <li>Use the service to harm, harass, or impersonate others, or to send spam.</li>
          </ul>

          <h2>Organizational data and ownership</h2>
          <p>
            The record belongs to the organization, not to any one person who
            held a seat. When leadership changes hands, access passes to the
            inheriting board. Individuals who created entries don&rsquo;t take the
            record with them when their term ends. Keeping the knowledge
            with the seat is the whole point. We&rsquo;ll work with an
            organization&rsquo;s current leadership to manage access and
            transfers.
          </p>

          <h2>Availability and changes</h2>
          <p>
            During the pilot, Tenure is provided as-is. We may modify, add, or
            pause features as the product develops, and we may take the service
            offline for maintenance or improvements. We don&rsquo;t guarantee
            uninterrupted or error-free availability while we&rsquo;re still
            building. We&rsquo;ll give organizations reasonable notice of
            significant changes when we can.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            We&rsquo;re an early-stage team doing our honest best to keep your
            record safe and useful, but we can&rsquo;t promise the service will be
            perfect. To the extent the law allows, Tenure isn&rsquo;t liable for
            indirect or consequential losses arising from using the service during
            the pilot. None of this limits any rights you have that can&rsquo;t be
            waived under applicable law. Keep your own copies of anything truly
            critical.
          </p>

          <h2>Termination</h2>
          <p>
            You can stop using Tenure at any time, and an organization can ask us
            to close its account and return or delete its record. We may suspend
            or end access if these terms are seriously or repeatedly broken, or if
            we need to for security or legal reasons. If we end your access,
            we&rsquo;ll give your organization a fair chance to retrieve its record
            where we reasonably can.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            As Tenure grows beyond the pilot, these terms will evolve with it.
            When we make a meaningful change, we&rsquo;ll update the date above and
            let active organizations know. Continuing to use the service after a
            change means you accept the updated terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Write to us at{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> and a founder will
            reply.
          </p>
        </div>
      </Container>
    </>
  );
}
